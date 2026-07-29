/**
 * Integration test for the PR-gate workflow shell pattern.
 *
 * The original bug: `bun audit --json` exits 1 whenever vulnerabilities
 * are found, regardless of --audit-level. The CI workflow captures the
 * output and runs the diff against it, so the exit code from `bun audit`
 * must NOT fail the step. This test reproduces the exact shell pattern
 * the workflow uses to guard against regressions in that pattern.
 *
 * If this test fails, the workflow is broken again.
 */

import { execSync } from "node:child_process";
import { existsSync, unlinkSync, readFileSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, it, expect, afterAll, beforeAll } from "vitest";

const tmpFile = join(tmpdir(), "audit-integration-test.json");

afterAll(() => {
  if (existsSync(tmpFile)) unlinkSync(tmpFile);
});

describe("PR-gate workflow shell pattern", () => {
  it("captures bun audit --json output without failing on exit code 1", () => {
    // bun audit --json exits 1 when vulnerabilities are present.
    // The workflow depends on extracting stdout regardless.
    // We use set +e to ignore the exit code, then verify the JSON
    // file was actually produced and is non-empty.
    const command = `set +e
bun audit --json --audit-level=low > ${tmpFile}
AUDIT_EXIT=$?
set -e
if [ ! -s ${tmpFile} ]; then
  exit 1
fi
echo "AUDIT_EXIT=$AUDIT_EXIT"`;

    let stdout = "";
    expect(() => {
      stdout = execSync(command, { encoding: "utf8", shell: "/bin/bash" });
    }).not.toThrow();

    expect(existsSync(tmpFile)).toBe(true);
    expect(stdout).toMatch(/AUDIT_EXIT=1/);

    // The file must be valid JSON (parseable by our auditDiff util).
    const content = readFileSync(tmpFile, "utf8");
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it("would fail loudly if the JSON file is empty (regression guard)", () => {
    // Mirror the workflow's safety check: empty JSON file is fatal.
    const command = `echo -n "" > ${tmpFile}
if [ ! -s ${tmpFile} ]; then
  exit 1
fi
echo "should not reach here"`;

    expect(() => {
      execSync(command, { encoding: "utf8", shell: "/bin/bash", stdio: "pipe" });
    }).toThrow();
  });
});

/**
 * Regression guard for the base-branch install pattern in the PR-gate
 * workflow.
 *
 * The original bug: the workflow copied the PR HEAD's `package.json`
 * into the base-audit directory and then extracted the base ref's
 * `bun.lock` into the same directory. When a Dependabot PR bumps a
 * package (changing `package.json`), the resolved `bun.lock` is
 * inconsistent with the head's `package.json`, and `bun install
 * --frozen-lockfile` fails with "lockfile had changes, but lockfile
 * is frozen".
 *
 * The fix: use `git show $BASE_REF:package.json` so both files come
 * from the same ref. These tests reproduce the exact pattern and
 * catch any future regression.
 */
describe("PR-gate base-branch install pattern", () => {
  let workDir: string;
  const cleanup: string[] = [];

  beforeAll(() => {
    workDir = mkdtempSync(join(tmpdir(), "audit-base-install-"));
  });

  afterAll(() => {
    for (const dir of cleanup) {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }
    if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
  });

  it("reproduces the original bug: mixing head package.json with base bun.lock fails", { timeout: 30_000 }, () => {
    // Build two minimal directories:
    //   - "head": package.json declares astro 7.1.4, with a bun.lock
    //     resolved for that version.
    //   - "base": package.json declares astro 7.1.0, with a bun.lock
    //     resolved for that version.
    //
    // The original buggy workflow did: copy head's package.json into
    // a base-audit dir, then extract base's bun.lock. That mix must
    // fail with "lockfile had changes". This test reproduces the mix
    // using real bun install so the regression is caught at test
    // time, not in CI at 2 AM.
    const headDir = mkdtempSync(join(workDir, "head-"));
    const baseDir = mkdtempSync(join(workDir, "base-"));
    const mixedDir = mkdtempSync(join(workDir, "mixed-"));
    cleanup.push(headDir, baseDir, mixedDir);

    const headPkg = {
      name: "head-fixture",
      version: "0.0.0",
      dependencies: { astro: "7.1.4" },
    };
    const basePkg = {
      name: "base-fixture",
      version: "0.0.0",
      dependencies: { astro: "7.1.0" },
    };

    // Write package.json + generate real bun.lock for each.
    writeFileSync(join(headDir, "package.json"), JSON.stringify(headPkg, null, 2));
    execSync("bun install", { cwd: headDir, stdio: "pipe" });
    expect(existsSync(join(headDir, "bun.lock"))).toBe(true);

    writeFileSync(join(baseDir, "package.json"), JSON.stringify(basePkg, null, 2));
    execSync("bun install", { cwd: baseDir, stdio: "pipe" });
    expect(existsSync(join(baseDir, "bun.lock"))).toBe(true);

    // Now reproduce the bug: copy HEAD's package.json + BASE's bun.lock
    // into the same directory, then `bun install --frozen-lockfile`.
    execSync(`cp ${join(headDir, "package.json")} ${join(mixedDir, "package.json")}`);
    execSync(`cp ${join(baseDir, "bun.lock")} ${join(mixedDir, "bun.lock")}`);

    expect(() => {
      execSync("bun install --frozen-lockfile", { cwd: mixedDir, stdio: "pipe" });
    }).toThrow(/lockfile had changes/);
  });

  it("the fix works: using base ref's package.json + bun.lock together succeeds", { timeout: 30_000 }, () => {
    // Same setup as above, but for the base directory only: package.json
    // and bun.lock are both from the same source. This must succeed.
    const baseDir = mkdtempSync(join(workDir, "base-fixed-"));
    cleanup.push(baseDir);

    const basePkg = {
      name: "base-fixture-fixed",
      version: "0.0.0",
      dependencies: { astro: "7.1.0" },
    };
    writeFileSync(join(baseDir, "package.json"), JSON.stringify(basePkg, null, 2));
    execSync("bun install", { cwd: baseDir, stdio: "pipe" });

    // Same as the workflow fix: don't mix sources.
    expect(() => {
      execSync("bun install --frozen-lockfile", { cwd: baseDir, stdio: "pipe" });
    }).not.toThrow();
  });
});
