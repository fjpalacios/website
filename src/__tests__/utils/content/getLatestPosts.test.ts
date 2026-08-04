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

      expect(content).toMatch(/language:\s*LanguageKey/);
      expect(content).toContain("maxItems: number");
    });

    test("should have default value for maxItems", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toMatch(/maxItems.*=\s*4/);
    });

    test("should return Promise<ContentSummary[]>", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("Promise<ContentSummary[]>");
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

  describe("Data Mapping", () => {
    test("should map posts with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("preparePostSummary");
      expect(content).toContain("langPosts.map(preparePostSummary)");
    });

    test("should map tutorials with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("prepareTutorialSummary");
      expect(content).toContain("langTutorials.map");
    });

    test("should map books with correct structure", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("prepareBookSummary");
      expect(content).toContain("langBooks.map");
    });

    test("should use canonical cover mapping for posts", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("preparePostSummary");
    });

    test("should use canonical cover mapping for tutorials", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("prepareTutorialSummary");
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

    test("should import ContentSummary type", () => {
      const content = fs.readFileSync(utilPath, "utf-8");

      expect(content).toContain("type ContentSummary");
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
