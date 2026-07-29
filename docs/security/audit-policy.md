# Dependency Audit Policy

> How we run `bun audit` in CI, why we run it twice, and what each run is
> actually allowed to block.

## Context

On 2026-07-27, ten Dependabot PRs (#513–#523) failed CI with the same
error: the `Dependency Audit` job reported 11 high-severity advisories
on the lockfile. The PRs themselves did not introduce any of those
advisories — they were all transitive dependencies of the existing
lockfile on `master`. The job refused to merge ten legitimate updates
because it was checking the wrong thing.

That setup is the equivalent of a bouncer who checks every bag against
the entire club's inventory, including bags that were already inside
when the shift started. Every Monday we got ten red PRs, every Monday
the answer was the same, and the actual vulnerabilities on `master` did
not get fixed any faster.

So we split the job.

## The Policy

Dependency audit runs in two distinct jobs, each with a different job
to do:

| Job                             | When it runs                | What it checks                                                    | What it blocks                                      |
| ------------------------------- | --------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `Dependency Audit (PR-gate)`    | On every `pull_request`     | New high/critical advisories introduced by the PR (diff vs. base) | The PR — only if it introduces new high/critical    |
| `Dependency Audit (post-merge)` | On every `push` to `master` | All high/critical advisories on `master`                          | The push — if `master` itself has new high/critical |

Both jobs use the same tool, `bun audit --json --audit-level=high`. The
difference is _what_ they audit against. The PR-gate audits the diff;
the post-merge audits the absolute state.

The two jobs are **not redundant**. They cover two different failure
modes:

- The PR-gate prevents a PR from making `master` worse. A bump that
  pulls in a new vulnerable transitive will fail the PR. This is the
  equivalent of "you can enter, but you cannot bring this with you".
- The post-merge check prevents `master` from drifting. If a security
  advisory is published against a version already on `master`, the
  post-merge job fails on the next push and creates pressure to fix
  it. The post-merge job also fails when a direct push (bypassing
  PR review) introduces a regression. This is the equivalent of
  "this club has rules, even for staff".

## Why Diff Instead of Absolute

The naive audit policy — "fail on any high advisory" — has two
failure modes that show up in real projects:

1. **False positives on legitimate PRs.** A Dependabot PR that bumps
   `marked` 18.0.6 → 18.0.7 has nothing to do with the `postcss`
   vulnerability sitting in `master`. Failing the PR does not fix the
   vulnerability; it just makes the PR author feel guilty. This is the
   mode that bit us on 2026-07-27.
2. **Alert fatigue.** When every Dependabot PR is red for a reason
   the PR cannot fix, reviewers start ignoring the audit signal. The
   day a PR introduces a _real_ regression, the reviewer approves it
   because "the audit is always red anyway". That is the failure mode
   we are actively trying to avoid.

The diff approach is also what `Socket Security` already does on every
PR (`Socket Security: Pull Request Alerts`). The PR-gate brings the
native `bun audit` job into alignment with the same model. One source
of truth, same decision logic, no two contradictory signals.

## Tradeoffs We Accepted

This policy is not free. The cost of audit-at-diff is:

- **Two audit runs per PR.** The PR-gate checks out the base ref
  separately and runs `bun audit` on it. CI minutes roughly double
  for the audit portion. On a project this size, the cost is
  negligible (~30s), but the policy will not scale gracefully to
  monorepos with hundreds of lockfiles. If that becomes our problem,
  revisit.
- **No historical pressure from PR-gate.** The post-merge job is the
  only thing that fails when `master` has unfixed advisories. If
  nobody pushes to `master` (e.g. long-lived feature branch), the
  post-merge job does not run and the noise on `master` accumulates
  silently. Mitigated by Dependabot security updates, which open
  PRs for known CVEs regardless of the weekly schedule.
- **The post-merge job is strict.** A push that introduces a new high
  advisory fails immediately. This is intentional: the cost of
  reverting a bad push is lower than the cost of shipping a known
  vulnerability. If the post-merge job becomes a recurring blocker,
  the right answer is to fix the underlying lockfile, not to loosen
  the policy.
- **Severity threshold is hard-coded to `high`.** Low and moderate
  advisories are visible in the PR-gate log for context but never
  block. This is a deliberate choice: lowering the threshold to
  `moderate` would re-introduce the alert-fatigue problem we are
  trying to solve. If a moderate advisory becomes critical in a
  future CVE update, the post-merge job catches it.

## Implementation

The PR-gate logic lives in two files:

- `src/utils/auditDiff.ts` — pure functions (`diffAdvisories`,
  `hasRegression`, `parseBunAuditOutput`) with full Zod schemas and
  unit tests. The diff identity is `(packageName, advisory.id)` so
  unrelated advisories cannot accidentally collapse.
- `scripts/audit-pr-gate.ts` — Bun script that reads two JSON files
  (base and head), runs the diff, and exits 0 or 1. The CI workflow
  pipes the output of `bun audit --json` on both refs into this
  script.

The post-merge job is the same `bun audit --audit-level=high` we had
before, with one change: it now runs only on `push` events, not on
PRs. The PR-gate is the only audit job that runs on PRs.

## When to Revisit This Policy

This is not a permanent arrangement. Re-evaluate when any of the
following becomes true:

- **Astro 7.2+ ships a lockfile that uses `sharp@0.35+`.** When that
  happens, the last remaining "wait for upstream" advisory on
  `master` clears. The post-merge job should turn green on its next
  push, and we can drop the manual review of that one.
- **`typescript-eslint@9.x` ships.** When that happens, remove the
  `ignore` rule for TypeScript major updates in
  `.github/dependabot.yml` (see PR #500 for context) and let
  Dependabot propose the bump.
- **The PR-gate starts ignoring too many advisories.** If the count
  of `unchangedHighCount` stays > 0 for more than 4 consecutive
  weeks, the post-merge job is the right place to address it — not
  the PR-gate. The PR-gate exists to catch regressions, not to
  document a broken baseline.
- **We migrate to a monorepo or add a second ecosystem** (e.g. pnpm
  workspaces). The diff approach will need to iterate per lockfile.
  Plan ahead.

## Appendix: The Ten PRs of 2026-07-27

For historical context — the PRs that triggered this policy change,
and what they look like under the new policy.

| PR   | Bump                                | Old result    | New result                                                    |
| ---- | ----------------------------------- | ------------- | ------------------------------------------------------------- |
| #513 | `marked` 18.0.6 → 18.0.7            | ❌ Audit fail | ✅ Pass (does not touch vulnerable paths)                     |
| #514 | `lint-staged` 17.0.8 → 17.2.0       | ❌ Audit fail | ✅ Pass                                                       |
| #515 | `sass` 1.101.0 → 1.101.7            | ❌ Audit fail | ✅ Pass                                                       |
| #516 | `@cloudflare/workers-types`         | ❌ Audit fail | ✅ Pass                                                       |
| #517 | `typescript-eslint` 8.64.0 → 8.65.0 | ❌ Audit fail | ✅ Pass                                                       |
| #518 | `astro` 7.1.0 → 7.1.3               | ❌ Audit fail | ✅ Pass (also fixes 2 of the 11 high advisories transitively) |
| #519 | `happy-dom` 20.10.6 → 20.11.1       | ❌ Audit fail | ✅ Pass                                                       |
| #520 | `prettier` 3.9.5 → 3.9.6            | ❌ Audit fail | ✅ Pass                                                       |
| #521 | `eslint-plugin-astro` 2.1.1 → 3.0.1 | ❌ Audit fail | ✅ Pass                                                       |
| #522 | `@typescript-eslint/eslint-plugin`  | ❌ Audit fail | ✅ Pass                                                       |
| #523 | `@typescript-eslint/parser`         | ❌ Audit fail | ✅ Pass                                                       |

PR #518 is the only one of the ten that _also_ reduces the
`unchangedHighCount` baseline. It is recommended to merge #518
**after** this policy lands on `master`, not before, so the diff
baseline used by the PR-gate is stable during the policy rollout.
