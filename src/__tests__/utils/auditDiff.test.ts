import { describe, it, expect } from "vitest";

import { diffAdvisories } from "@/utils/auditDiff";
import type { BunAuditReport } from "@/utils/auditDiff";

/**
 * Unit tests for auditDiff.
 *
 * The function compares two bun audit reports (base branch vs PR head)
 * and returns which advisories are new, which were fixed, and how many
 * high/critical advisories are unchanged.
 *
 * The model: an advisory is identified by (packageName, advisory.id).
 * A PR introduces a regression when the PR's report contains a
 * (package, id) pair that is NOT in the base report.
 */
describe("diffAdvisories", () => {
  // Minimal but realistic shape based on `bun audit --json` output.
  const baseReport: BunAuditReport = {
    postcss: [
      {
        id: 1124288,
        url: "https://github.com/advisories/GHSA-r28c-9q8g-f849",
        title: "PostCSS: Path Traversal in Previous Source Map Auto-Loading",
        severity: "high",
        vulnerable_versions: "<=8.5.17",
        cwe: ["CWE-22"],
        cvss: { score: 7.5, vectorString: null },
      },
    ],
    sharp: [
      {
        id: 1124066,
        url: "https://github.com/advisories/GHSA-f88m-g3jw-g9cj",
        title: "sharp inherited vulnerabilities in libvips",
        severity: "high",
        vulnerable_versions: "<0.35.0",
        cwe: ["CWE-1395"],
        cvss: { score: 0, vectorString: null },
      },
    ],
  };

  it("returns no new advisories when both reports are identical", () => {
    const result = diffAdvisories(baseReport, baseReport);
    expect(result.newAdvisories).toEqual([]);
    expect(result.fixedAdvisories).toEqual([]);
    expect(result.unchangedHighCount).toBe(2);
  });

  it("returns no new advisories when PR report is a strict subset of base", () => {
    // A PR that fixes a high-severity advisory in sharp (e.g. bumps
    // sharp to >=0.35.0) should NOT be flagged as introducing a
    // regression. The remaining high advisory in postcss is
    // unchanged and pre-existing.
    const headReport: BunAuditReport = {
      postcss: baseReport.postcss,
    };
    const result = diffAdvisories(baseReport, headReport);
    expect(result.newAdvisories).toEqual([]);
    expect(result.fixedAdvisories).toHaveLength(1);
    expect(result.fixedAdvisories[0]?.packageName).toBe("sharp");
    expect(result.fixedAdvisories[0]?.id).toBe(1124066);
    expect(result.unchangedHighCount).toBe(1);
  });

  it("flags advisories present in head but not in base as new", () => {
    // Simulates a PR that adds a dependency pulling in a vulnerable
    // version of brace-expansion. This is a real regression and
    // must fail the PR gate.
    const headReport: BunAuditReport = {
      ...baseReport,
      "brace-expansion": [
        {
          id: 1124334,
          url: "https://github.com/advisories/GHSA-mh99-v99m-4gvg",
          title: "brace-expansion: DoS via unbounded expansion length",
          severity: "high",
          vulnerable_versions: "<=5.0.7",
          cwe: ["CWE-400", "CWE-770"],
          cvss: { score: 7.5, vectorString: null },
        },
      ],
    };
    const result = diffAdvisories(baseReport, headReport);
    expect(result.newAdvisories).toHaveLength(1);
    expect(result.newAdvisories[0]?.packageName).toBe("brace-expansion");
    expect(result.newAdvisories[0]?.severity).toBe("high");
    expect(result.unchangedHighCount).toBe(2);
  });

  it("flags new advisories of severity critical with priority in the count", () => {
    const headReport: BunAuditReport = {
      ...baseReport,
      // Pretend a critical advisory sneaks in via a transitive bump.
      "left-pad": [
        {
          id: 9999999,
          url: "https://example/advisory",
          title: "left-pad: catastrophic issue",
          severity: "critical",
          vulnerable_versions: "<1.0.0",
          cwe: ["CWE-000"],
          cvss: { score: 10, vectorString: null },
        },
      ],
    };
    const result = diffAdvisories(baseReport, headReport);
    expect(result.newAdvisories).toHaveLength(1);
    expect(result.newAdvisories[0]?.severity).toBe("critical");
  });

  it("treats advisories on different packages independently even with the same id", () => {
    // Defensive: same numeric id on different packages is a different
    // advisory. Should never happen in practice (GHSA ids are globally
    // unique) but the diff logic must not collapse them.
    const base: BunAuditReport = {
      postcss: [
        {
          id: 1,
          url: "https://a",
          title: "x",
          severity: "high",
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 0, vectorString: null },
        },
      ],
    };
    const head: BunAuditReport = {
      postcss: base.postcss,
      sharp: [
        {
          id: 1,
          url: "https://b",
          title: "y",
          severity: "high",
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 0, vectorString: null },
        },
      ],
    };
    const result = diffAdvisories(base, head);
    expect(result.newAdvisories).toHaveLength(1);
    expect(result.newAdvisories[0]?.packageName).toBe("sharp");
  });

  it("handles empty base and empty head", () => {
    const result = diffAdvisories({}, {});
    expect(result.newAdvisories).toEqual([]);
    expect(result.fixedAdvisories).toEqual([]);
    expect(result.unchangedHighCount).toBe(0);
  });

  it("handles empty head (PR fixes every advisory)", () => {
    const result = diffAdvisories(baseReport, {});
    expect(result.newAdvisories).toEqual([]);
    expect(result.fixedAdvisories).toHaveLength(2);
    expect(result.unchangedHighCount).toBe(0);
  });

  it("handles empty base (any advisory in head is new)", () => {
    const result = diffAdvisories({}, baseReport);
    expect(result.newAdvisories).toHaveLength(2);
    expect(result.fixedAdvisories).toEqual([]);
    expect(result.unchangedHighCount).toBe(0);
  });

  it("does not flag a low-severity advisory added by the PR as a regression", () => {
    // The PR-gate policy is high+ only. Low additions are reported
    // in the diff so the log is informative, but they do not
    // contribute to the regression count.
    const headReport: BunAuditReport = {
      ...baseReport,
      "some-package": [
        {
          id: 1234,
          url: "https://example/low",
          title: "minor issue",
          severity: "low",
          vulnerable_versions: "<1.0.0",
          cwe: ["CWE-000"],
          cvss: { score: 2.0, vectorString: null },
        },
      ],
    };
    const result = diffAdvisories(baseReport, headReport);
    // newAdvisories is informational; the gate uses hasRegression,
    // which we verify separately below.
    expect(result.newAdvisories).toHaveLength(1);
    expect(result.newAdvisories[0]?.severity).toBe("low");
    expect(result.unchangedHighCount).toBe(2);
  });
});

describe("hasRegression (PR-gate decision)", () => {
  // A second, smaller suite for the boolean helper that the workflow
  // uses to decide whether to fail the job.
  it("is true when a new high advisory is introduced", async () => {
    const { hasRegression, diffAdvisories } = await import("@/utils/auditDiff");
    const base = {
      foo: [
        {
          id: 1,
          url: "u",
          title: "t",
          severity: "high" as const,
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 7, vectorString: null },
        },
      ],
    };
    const head = {
      ...base,
      bar: [
        {
          id: 2,
          url: "u",
          title: "t",
          severity: "high" as const,
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 7, vectorString: null },
        },
      ],
    };
    expect(hasRegression(diffAdvisories(base, head))).toBe(true);
  });

  it("is false when only low/moderate advisories are added", async () => {
    const { hasRegression, diffAdvisories } = await import("@/utils/auditDiff");
    const base = {};
    const head = {
      foo: [
        {
          id: 3,
          url: "u",
          title: "t",
          severity: "low" as const,
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 2, vectorString: null },
        },
      ],
    };
    expect(hasRegression(diffAdvisories(base, head))).toBe(false);
  });

  it("is false when PR only fixes advisories", async () => {
    const { hasRegression, diffAdvisories } = await import("@/utils/auditDiff");
    const base = {
      foo: [
        {
          id: 4,
          url: "u",
          title: "t",
          severity: "high" as const,
          vulnerable_versions: "*",
          cwe: [],
          cvss: { score: 7, vectorString: null },
        },
      ],
    };
    const head = {};
    expect(hasRegression(diffAdvisories(base, head))).toBe(false);
  });
});
