import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const BOOKS_DIR = join(process.cwd(), "src/content/books");
const TUTORIALS_DIR = join(process.cwd(), "src/content/tutorials");

/**
 * Strips MDX frontmatter and returns only the body content.
 */
function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---[\s\S]*?---\n/;
  return content.replace(frontmatterRegex, "");
}

/**
 * Returns all h4 headings that appear without a preceding h3 in the same file.
 * An h4 is considered "orphaned" (invalid) when no h3 exists before it.
 */
function findOrphanedH4Headings(body: string): string[] {
  const lines = body.split("\n");
  const orphaned: string[] = [];
  let hasH3 = false;

  for (const line of lines) {
    if (/^###[^#]/.test(line)) {
      hasH3 = true;
    }
    if (/^####/.test(line)) {
      if (!hasH3) {
        orphaned.push(line.trim());
      }
    }
  }

  return orphaned;
}

function getMdxFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => join(dir, f));
}

describe("MDX heading hierarchy", () => {
  describe("Books collection", () => {
    const bookFiles = getMdxFiles(BOOKS_DIR);

    it("should have at least one book file to validate", () => {
      expect(bookFiles.length).toBeGreaterThan(0);
    });

    it("should not contain h4 headings without a preceding h3 in any book", () => {
      const violations: { file: string; headings: string[] }[] = [];

      for (const filePath of bookFiles) {
        const content = readFileSync(filePath, "utf-8");
        const body = stripFrontmatter(content);
        const orphaned = findOrphanedH4Headings(body);

        if (orphaned.length > 0) {
          violations.push({
            file: filePath.split("/").at(-1) ?? filePath,
            headings: orphaned,
          });
        }
      }

      if (violations.length > 0) {
        const report = violations
          .map((v) => `  ${v.file}:\n${v.headings.map((h) => `    - ${h}`).join("\n")}`)
          .join("\n");

        expect.fail(
          `Found ${violations.length} book(s) with h4 headings that lack a preceding h3 (heading hierarchy violation):\n${report}`,
        );
      }
    });

    it.each(bookFiles.map((f) => [f.split("/").at(-1) ?? f, f]))(
      "book '%s' should have valid heading hierarchy",
      (_name: string, filePath: string) => {
        const content = readFileSync(filePath, "utf-8");
        const body = stripFrontmatter(content);
        const orphaned = findOrphanedH4Headings(body);

        expect(orphaned, `Found orphaned h4 headings: ${orphaned.join(", ")}`).toHaveLength(0);
      },
    );
  });

  describe("Tutorials collection", () => {
    const tutorialFiles = getMdxFiles(TUTORIALS_DIR);

    it("should have at least one tutorial file to validate", () => {
      expect(tutorialFiles.length).toBeGreaterThan(0);
    });

    it("should not contain h4 headings without a preceding h3 in any tutorial", () => {
      const violations: { file: string; headings: string[] }[] = [];

      for (const filePath of tutorialFiles) {
        const content = readFileSync(filePath, "utf-8");
        const body = stripFrontmatter(content);
        const orphaned = findOrphanedH4Headings(body);

        if (orphaned.length > 0) {
          violations.push({
            file: filePath.split("/").at(-1) ?? filePath,
            headings: orphaned,
          });
        }
      }

      if (violations.length > 0) {
        const report = violations
          .map((v) => `  ${v.file}:\n${v.headings.map((h) => `    - ${h}`).join("\n")}`)
          .join("\n");

        expect.fail(
          `Found ${violations.length} tutorial(s) with h4 headings that lack a preceding h3 (heading hierarchy violation):\n${report}`,
        );
      }
    });
  });
});
