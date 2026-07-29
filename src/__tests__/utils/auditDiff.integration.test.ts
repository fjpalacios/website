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
import { existsSync, unlinkSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, it, expect, afterAll } from "vitest";

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
