/**
 * Tests for generic pagination generator
 * Tests the core pagination logic extracted from booksPages, tutorialsPages, and postsPages
 */

import { describe, expect, it } from "vitest";

import type { ContactItem } from "@/types/content";
import { generatePaginationPaths, generateDetailPaths } from "@/utils/pagination/generator";

// Mock data types
interface MockItem {
  id: number;
  title: string;
}

interface MockEntry {
  data: {
    post_slug: string;
    language: string;
    draft?: boolean;
  };
}

// Mock contact data
const mockContact: ContactItem[] = [{ name: "GitHub", link: "https://github.com", icon: "github", text: "@user" }];

describe("pagination/generator", () => {
  describe("generatePaginationPaths", () => {
    it("should generate pagination paths for multiple pages", () => {
      const items: MockItem[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      // Should generate pages 2 and 3 (page 1 is the index)
      expect(paths).toHaveLength(2);

      // Page 2
      expect(paths[0].page).toBe("2");
      expect(paths[0].props.currentPage).toBe(2);
      expect(paths[0].props.totalPages).toBe(3);
      expect(paths[0].props.items).toHaveLength(10);
      expect(paths[0].props.lang).toBe("es");
      expect(paths[0].props.contact).toEqual(mockContact);

      // Page 3
      expect(paths[1].page).toBe("3");
      expect(paths[1].props.currentPage).toBe(3);
      expect(paths[1].props.totalPages).toBe(3);
      expect(paths[1].props.items).toHaveLength(5); // Last page has remainder
    });

    it("should handle exact multiple of items per page", () => {
      const items: MockItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "en",
        contact: mockContact,
        itemsKey: "posts",
      });

      // Should generate only page 2
      expect(paths).toHaveLength(1);
      expect(paths[0].page).toBe("2");
      expect(paths[0].props.currentPage).toBe(2);
      expect(paths[0].props.totalPages).toBe(2);
      expect(paths[0].props.posts).toHaveLength(10);
    });

    it("should return empty array when items fit in one page", () => {
      const items: MockItem[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      // No pagination needed for single page
      expect(paths).toHaveLength(0);
    });

    it("should return empty array when items are empty", () => {
      const paths = generatePaginationPaths({
        items: [],
        itemsPerPage: 10,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      expect(paths).toHaveLength(0);
    });

    it("should correctly slice items for each page", () => {
      const items: MockItem[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 5,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      expect(paths).toHaveLength(2);

      // Page 2 should have items 6-10
      expect((paths[0].props.items as MockItem[])[0].id).toBe(6);
      expect((paths[0].props.items as MockItem[])[4].id).toBe(10);

      // Page 3 should have items 11-15
      expect((paths[1].props.items as MockItem[])[0].id).toBe(11);
      expect((paths[1].props.items as MockItem[])[4].id).toBe(15);
    });

    it("should use custom itemsKey in props", () => {
      const items: MockItem[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const pathsWithBooks = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "es",
        contact: mockContact,
        itemsKey: "books",
      });

      expect(pathsWithBooks[0].props).toHaveProperty("books");
      expect(pathsWithBooks[0].props.books).toBeDefined();

      const pathsWithTutorials = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "en",
        contact: mockContact,
        itemsKey: "tutorials",
      });

      expect(pathsWithTutorials[0].props).toHaveProperty("tutorials");
      expect(pathsWithTutorials[0].props.tutorials).toBeDefined();
    });

    it("should handle large datasets efficiently", () => {
      const items: MockItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 12,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      // 1000 / 12 = 84 pages total, so pages 2-84 = 83 paths
      expect(paths).toHaveLength(83);

      // Check first pagination page
      expect(paths[0].page).toBe("2");
      expect(paths[0].props.items).toHaveLength(12);

      // Check last pagination page
      expect(paths[82].page).toBe("84");
      expect(paths[82].props.items).toHaveLength(4); // 1000 % 12 = 4
    });
  });

  describe("generateDetailPaths", () => {
    it("should generate detail paths for entries", () => {
      const entries: MockEntry[] = [
        { data: { post_slug: "first-post", language: "es" } },
        { data: { post_slug: "second-post", language: "es" } },
        { data: { post_slug: "third-post", language: "es" } },
      ];

      const paths = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "postEntry",
      });

      expect(paths).toHaveLength(3);

      // First entry
      expect(paths[0].slug).toBe("first-post");
      expect(paths[0].props.postEntry).toEqual(entries[0]);
      expect(paths[0].props.lang).toBe("es");
      expect(paths[0].props.contact).toEqual(mockContact);

      // Second entry
      expect(paths[1].slug).toBe("second-post");
      expect(paths[1].props.postEntry).toEqual(entries[1]);

      // Third entry
      expect(paths[2].slug).toBe("third-post");
      expect(paths[2].props.postEntry).toEqual(entries[2]);
    });

    it("should filter entries by language", () => {
      const entries: MockEntry[] = [
        { data: { post_slug: "spanish-post", language: "es" } },
        { data: { post_slug: "english-post", language: "en" } },
        { data: { post_slug: "another-spanish", language: "es" } },
      ];

      const pathsEs = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "postEntry",
      });

      expect(pathsEs).toHaveLength(2);
      expect(pathsEs[0].slug).toBe("spanish-post");
      expect(pathsEs[1].slug).toBe("another-spanish");

      const pathsEn = generateDetailPaths({
        entries,
        lang: "en",
        contact: mockContact,
        entryKey: "postEntry",
      });

      expect(pathsEn).toHaveLength(1);
      expect(pathsEn[0].slug).toBe("english-post");
    });

    it("should use custom entryKey in props", () => {
      const entries: MockEntry[] = [{ data: { post_slug: "test-book", language: "es" } }];

      const pathsWithBook = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "bookEntry",
      });

      expect(pathsWithBook[0].props).toHaveProperty("bookEntry");
      expect(pathsWithBook[0].props.bookEntry).toEqual(entries[0]);

      const pathsWithTutorial = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "tutorialEntry",
      });

      expect(pathsWithTutorial[0].props).toHaveProperty("tutorialEntry");
      expect(pathsWithTutorial[0].props.tutorialEntry).toEqual(entries[0]);
    });

    it("should return empty array when no entries match language", () => {
      const entries: MockEntry[] = [{ data: { post_slug: "english-post", language: "en" } }];

      const paths = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "postEntry",
      });

      expect(paths).toHaveLength(0);
    });

    it("should return empty array when entries are empty", () => {
      const paths = generateDetailPaths({
        entries: [],
        lang: "es",
        contact: mockContact,
        entryKey: "postEntry",
      });

      expect(paths).toHaveLength(0);
    });

    it("should handle entries with draft flag excluded", () => {
      const entries: MockEntry[] = [
        { data: { post_slug: "published", language: "es" } },
        { data: { post_slug: "draft", language: "es", draft: true } },
        { data: { post_slug: "also-published", language: "es", draft: false } },
      ];

      // generateDetailPaths doesn't filter drafts (that's done before calling it)
      // but it should pass through all matching language entries
      const paths = generateDetailPaths({
        entries,
        lang: "es",
        contact: mockContact,
        entryKey: "postEntry",
      });

      // All 3 entries should be included (draft filtering happens elsewhere)
      expect(paths).toHaveLength(3);
    });
  });

  describe("edge cases", () => {
    it("should handle pagination with itemsPerPage = 1", () => {
      const items: MockItem[] = [
        { id: 1, title: "Item 1" },
        { id: 2, title: "Item 2" },
        { id: 3, title: "Item 3" },
      ];

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 1,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      // 3 items / 1 per page = 3 pages, so pages 2 and 3
      expect(paths).toHaveLength(2);
      expect(paths[0].props.items).toHaveLength(1);
      expect(paths[1].props.items).toHaveLength(1);
    });

    it("should handle very small itemsPerPage values", () => {
      const items: MockItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 2,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      // 10 / 2 = 5 pages, so pages 2-5 = 4 paths
      expect(paths).toHaveLength(4);
    });

    it("should maintain reference to original contact array", () => {
      const items: MockItem[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
      }));

      const paths = generatePaginationPaths({
        items,
        itemsPerPage: 10,
        lang: "es",
        contact: mockContact,
        itemsKey: "items",
      });

      expect(paths[0].props.contact).toBe(mockContact);
    });
  });
});
