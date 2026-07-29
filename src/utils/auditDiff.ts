/**
 * Diff two `bun audit --json` reports to decide whether a PR introduces
 * a regression in dependency vulnerabilities.
 *
 * The function is pure: it takes two parsed reports and returns a
 * structured diff. The CI workflow in `.github/workflows/ci.yml` is
 * responsible for executing `bun audit --json` on both the base branch
 * and the PR head, then calling this function to make the gating
 * decision.
 *
 * @module utils/auditDiff
 */

import { z } from "zod";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Severity levels as reported by GitHub Advisories and `bun audit`.
 * `bun audit --audit-level=high` filters out anything below `high`.
 */
export const SEVERITY = ["low", "moderate", "high", "critical"] as const;
export type Severity = (typeof SEVERITY)[number];

/**
 * A single advisory from `bun audit --json`. The shape mirrors the
 * real output, validated via Zod so the workflow can fail loudly if
 * `bun` ever changes its schema.
 */
export const AdvisorySchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  title: z.string(),
  severity: z.enum(SEVERITY),
  vulnerable_versions: z.string(),
  cwe: z.array(z.string()),
  cvss: z.object({
    score: z.number(),
    vectorString: z.string().nullable(),
  }),
});

export type Advisory = z.infer<typeof AdvisorySchema>;

/**
 * The top-level shape of `bun audit --json`: a map from package name
 * to the list of advisories affecting that package.
 */
export const BunAuditReportSchema = z.record(z.string(), z.array(AdvisorySchema));
export type BunAuditReport = z.infer<typeof BunAuditReportSchema>;

/**
 * A single diff entry, preserving the package + advisory identity
 * so log output is actionable.
 */
export interface DiffEntry {
  packageName: string;
  id: number;
  severity: Severity;
  title: string;
  url: string;
}

/**
 * Result of comparing two audit reports.
 *
 * - `newAdvisories`: advisories present in `head` but not in `base`.
 *   These are the potential regressions introduced by the PR.
 * - `fixedAdvisories`: advisories present in `base` but not in `head`.
 *   The PR is good news here.
 * - `unchangedHighCount`: count of high+ advisories present in BOTH
 *   reports. Useful for the CI log to remind reviewers that the
 *   base branch still has known issues unrelated to this PR.
 */
export interface AuditDiff {
  newAdvisories: DiffEntry[];
  fixedAdvisories: DiffEntry[];
  unchangedHighCount: number;
}

// ============================================================================
// PURE DIFF
// ============================================================================

/**
 * Identity of an advisory: (package, id). The id is the numeric GHSA
 * id from `bun audit`, which is globally unique across advisories.
 * Using id (not url) avoids collapsing two advisories on different
 * packages that happen to share a url fragment.
 */
function identityOf(packageName: string, advisory: Advisory): string {
  return `${packageName}::${advisory.id}`;
}

/**
 * Build a Set of identity strings for fast lookup.
 */
function identitySet(report: BunAuditReport): Set<string> {
  const ids = new Set<string>();
  for (const [pkg, advisories] of Object.entries(report)) {
    for (const advisory of advisories) {
      ids.add(identityOf(pkg, advisory));
    }
  }
  return ids;
}

function toEntry(packageName: string, advisory: Advisory): DiffEntry {
  return {
    packageName,
    id: advisory.id,
    severity: advisory.severity,
    title: advisory.title,
    url: advisory.url,
  };
}

/**
 * Compute the diff between a base report and a head (PR) report.
 *
 * @param base - audit report from the base branch (e.g. `master`).
 * @param head - audit report from the PR head.
 * @returns the structured diff. `newAdvisories` includes advisories
 *          of ALL severities; the PR-gate decision (`hasRegression`)
 *          filters down to high+ critical.
 */
export function diffAdvisories(base: BunAuditReport, head: BunAuditReport): AuditDiff {
  const baseIds = identitySet(base);
  const headIds = identitySet(head);

  const newAdvisories: DiffEntry[] = [];
  const fixedAdvisories: DiffEntry[] = [];
  let unchangedHighCount = 0;

  // Walk head: each advisory not in base is "new".
  for (const [pkg, advisories] of Object.entries(head)) {
    for (const advisory of advisories) {
      const id = identityOf(pkg, advisory);
      if (!baseIds.has(id)) {
        newAdvisories.push(toEntry(pkg, advisory));
      } else if (advisory.severity === "high" || advisory.severity === "critical") {
        unchangedHighCount += 1;
      }
    }
  }

  // Walk base: each advisory not in head was "fixed" by the PR.
  for (const [pkg, advisories] of Object.entries(base)) {
    for (const advisory of advisories) {
      const id = identityOf(pkg, advisory);
      if (!headIds.has(id)) {
        fixedAdvisories.push(toEntry(pkg, advisory));
      }
    }
  }

  // Sort for deterministic output: by package, then id.
  const byPackageAndId = (a: DiffEntry, b: DiffEntry): number => {
    if (a.packageName !== b.packageName) return a.packageName.localeCompare(b.packageName);
    return a.id - b.id;
  };
  newAdvisories.sort(byPackageAndId);
  fixedAdvisories.sort(byPackageAndId);

  return { newAdvisories, fixedAdvisories, unchangedHighCount };
}

/**
 * PR-gate decision: does the diff represent a regression?
 *
 * The policy (see docs/security/audit-policy.md) is: a PR fails the
 * audit gate only if it introduces NEW high or critical advisories.
 * Low and moderate additions are logged for awareness but do not
 * block the merge.
 */
export function hasRegression(diff: AuditDiff): boolean {
  return diff.newAdvisories.some((a) => a.severity === "high" || a.severity === "critical");
}

// ============================================================================
// PARSING
// ============================================================================

/**
 * Parse the stdout of `bun audit --json`.
 *
 * `bun` writes a couple of log lines to stdout before the JSON payload
 * (e.g. `bun audit v1.3.6 (d530ed99)`) when stderr is merged. We
 * locate the first `{` and parse from there to be robust against
 * future header additions. If parsing fails we throw a descriptive
 * error so the CI fails loudly rather than silently passing.
 */
export function parseBunAuditOutput(stdout: string): BunAuditReport {
  const start = stdout.indexOf("{");
  if (start === -1) {
    throw new Error("[auditDiff] Could not find JSON object in `bun audit --json` output");
  }
  const candidate = stdout.slice(start);
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (err) {
    throw new Error(`[auditDiff] Failed to parse \`bun audit --json\` output as JSON: ${(err as Error).message}`);
  }
  return BunAuditReportSchema.parse(parsed);
}
