/**
 * Tests for getLatestPosts utility
 *
 * This utility extracts the query logic from LatestPosts component
 * to make it reusable across different parts of the application.
 *
 * Note: These are structural tests since getCollection() from Astro
 * cannot be easily mocked in a unit test environment.
 */

import fs from "fs";
import path from "path";

import { describe, expect, test } from "vitest";

describe("getLatestPosts utility", () => {
  const utilPath = path.resolve(__dirname, "../../../utils/content/getLatestPosts.ts");

  describe("File Structure", () => {
    test("should exist as a file", () => {
      expect(fs.existsSync(utilPath)).toBe(true);
    });

    test("should export getLatestPosts function", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("export async function getLatestPosts");
    });

    test("should have proper JSDoc documentation", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("/**");
      expect(content).toContain("@param");
      expect(content).toContain("@returns");
      expect(content).toContain("@example");
    });
  });

  describe("Function Signature", () => {
    test("should accept language and maxItems parameters", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(/language:\s*"es"\s*\|\s*"en"/);
      expect(content).toContain("maxItems: number");
    });

    test("should have default value for maxItems", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(/maxItems.*=\s*4/);
    });

    test("should return Promise<PostSummary[]>", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("Promise<PostSummary[]>");
    });
  });

  describe("Content Collection Queries", () => {
    test("should import getCollection from astro:content", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain('from "astro:content"');
      expect(content).toContain("getCollection");
    });

    test("should query all three content collections", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain('getCollection("posts")');
      expect(content).toContain('getCollection("tutorials")');
      expect(content).toContain('getCollection("books")');
    });

    test("should assign collections to properly named variables", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("allPosts");
      expect(content).toContain("allTutorials");
      expect(content).toContain("allBooks");
    });
  });

  describe("Language Filtering", () => {
    test("should import filterByLanguage from utils", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("filterByLanguage");
      expect(content).toContain("@utils/blog");
    });

    test("should filter posts by language", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("filterByLanguage(allPosts, language)");
    });

    test("should filter tutorials by language", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("filterByLanguage(allTutorials, language)");
    });

    test("should filter books by language", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("filterByLanguage(allBooks, language)");
    });
  });

  describe("Draft Filtering", () => {
    test("should exclude draft posts", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      // Should filter out drafts from posts
      expect(content).toMatch(
        /filterByLanguage\(allPosts,\s*language\)\.filter\(\(post\)\s*=>\s*!\(post\.data\s+as\s+any\)\.draft\)/s,
      );
    });

    test("should exclude draft tutorials", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      // Should filter out drafts from tutorials
      expect(content).toMatch(
        /filterByLanguage\(allTutorials,\s*language\)\.filter\(\(tutorial\)\s*=>\s*!\(tutorial\.data\s+as\s+any\)\.draft\)/s,
      );
    });

    test("should not filter books (no draft field)", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      // Books should be assigned directly without draft filtering
      expect(content).toContain("langBooks = filterByLanguage(allBooks, language)");
    });
  });

  describe("Data Mapping", () => {
    test("should map posts with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain('type: "post" as const');
      expect(content).toMatch(/slug:\s*\(post\.data\s+as\s+any\)\.post_slug/);
      expect(content).toContain("post.data.title");
      expect(content).toContain("post.data.date");
      expect(content).toMatch(/excerpt:\s*\(post\.data\s+as\s+any\)\.excerpt/);
    });

    test("should map tutorials with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain('type: "tutorial" as const');
      expect(content).toMatch(/slug:\s*\(tutorial\.data\s+as\s+any\)\.post_slug/);
      expect(content).toContain("tutorial.data.title");
    });

    test("should map books with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain('type: "book" as const');
      expect(content).toContain("book.data.post_slug");
      expect(content).toContain("book.data.title");
    });

    test("should handle cover/featured_image fallback for posts", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(/\(post\.data\s+as\s+any\)\.cover\s*\|\|\s*\(post\.data\s+as\s+any\)\.featured_image/);
    });

    test("should handle cover/featured_image fallback for tutorials", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(
        /\(tutorial\.data\s+as\s+any\)\.cover\s*\|\|\s*\(tutorial\.data\s+as\s+any\)\.featured_image/,
      );
    });
  });

  describe("Sorting and Limiting", () => {
    test("should sort by date in descending order", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      // Should sort with newest first (dateB - dateA)
      expect(content).toMatch(/sort.*dateB\.getTime\(\).*-.*dateA\.getTime\(\)/s);
    });

    test("should use slice to limit results", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain(".slice(0, maxItems)");
    });

    test("should combine all content types before sorting", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("combinedContent");
      expect(content).toMatch(/\[.*\.\.\.langPosts.*\.\.\.langTutorials.*\.\.\.langBooks.*\]/s);
    });
  });

  describe("Edge Cases", () => {
    test("should handle limit of 0", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(/if.*maxItems.*===.*0/);
      expect(content).toContain("return []");
    });

    test("should import PostSummary type", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("import type { PostSummary }");
      expect(content).toContain("@utils/blog");
    });
  });

  describe("Code Quality", () => {
    test("should have clear variable names", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("allPosts");
      expect(content).toContain("allTutorials");
      expect(content).toContain("allBooks");
      expect(content).toContain("langPosts");
      expect(content).toContain("langTutorials");
      expect(content).toContain("langBooks");
      expect(content).toContain("combinedContent");
    });

    test("should use async/await syntax", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("async function");
      expect(content).toContain("await getCollection");
    });

    test("should have detailed module documentation", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("@module");
      expect(content).toContain("getLatestPosts");
    });
  });
});
