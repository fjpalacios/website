#!/usr/bin/env bun
/**
 * CI script: PR-gate for dependency audit.
 *
 * Compares the audit output of the PR head against the base branch
 * and exits non-zero if the PR introduces new high or critical
 * advisories. Pre-existing advisories on the base branch are
 * reported in the log for context but do not block.
 *
 * Usage:
 *   bun run scripts/audit-pr-gate.ts <base-audit.json> <head-audit.json>
 *
 * See docs/security/audit-policy.md for the policy rationale.
 */

import { readFileSync } from "node:fs";

import { diffAdvisories, hasRegression, parseBunAuditOutput } from "../src/utils/auditDiff";

const [basePath, headPath] = process.argv.slice(2);
if (!basePath || !headPath) {
  console.error("Usage: bun run scripts/audit-pr-gate.ts <base-audit.json> <head-audit.json>");
  console.error(`Received ${process.argv.slice(2).length} argument(s); expected 2.`);
  process.exit(2);
}

let baseReport;
let headReport;
try {
  baseReport = parseBunAuditOutput(readFileSync(basePath, "utf8"));
  headReport = parseBunAuditOutput(readFileSync(headPath, "utf8"));
} catch (err) {
  console.error(`[audit-pr-gate] Failed to read or parse audit reports: ${(err as Error).message}`);
  console.error(`  base: ${basePath}`);
  console.error(`  head: ${headPath}`);
  process.exit(2);
}

const diff = diffAdvisories(baseReport, headReport);

const fmt = (pkg: string, id: number): string => `  - ${pkg}@GHSA-id:${id}`;

console.log("┌─ Dependency audit diff (PR vs base)");
console.log(`│  Base branch: ${diff.unchangedHighCount} unchanged high/critical advisories`);
console.log(`│  PR introduces: ${diff.newAdvisories.length} new advisories`);
console.log(`│  PR fixes:     ${diff.fixedAdvisories.length} advisories`);

if (diff.fixedAdvisories.length > 0) {
  console.log("│");
  console.log("│  ✅ Fixed by this PR:");
  for (const a of diff.fixedAdvisories) {
    console.log(`│${fmt(a.packageName, a.id)} [${a.severity}] ${a.title}`);
  }
}

if (diff.newAdvisories.length > 0) {
  console.log("│");
  console.log("│  ⚠️  New advisories introduced by this PR:");
  for (const a of diff.newAdvisories) {
    console.log(`│${fmt(a.packageName, a.id)} [${a.severity}] ${a.title}`);
    console.log(`│    ${a.url}`);
  }
}

if (diff.unchangedHighCount > 0) {
  console.log("│");
  console.log(
    `│  ℹ️  ${diff.unchangedHighCount} high/critical advisories exist on the base branch and are NOT this PR's responsibility.`,
  );
  console.log("│     See `Dependency Audit (post-merge)` on master to track the cleanup.");
}

console.log("└─");

if (hasRegression(diff)) {
  console.error("\n❌ PR introduces a new high or critical advisory. The PR-gate policy blocks this merge.");
  console.error("   Fix the introduced advisory or document why the risk is accepted in the PR description.");
  process.exit(1);
}

console.log("\n✅ No new high or critical advisories. PR-gate passes.");
process.exit(0);
