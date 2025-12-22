import { findAuthor, generateAuthorUrl } from "@utils/authorLinkHelpers";
import type { CollectionEntry } from "astro:content";
import { describe, expect, test } from "vitest";

describe("authorLinkHelpers", () => {
  // Mock authors for testing
  const mockAuthors: CollectionEntry<"authors">[] = [
    {
      id: "stephen-king.json",
      collection: "authors",
      data: {
        name: "Stephen King",
        author_slug: "stephen-king",
        image: "/images/stephen-king.jpg",
        language: "es",
      },
    } as CollectionEntry<"authors">,
    {
      id: "camilla-lackberg.json",
      collection: "authors",
      data: {
        name: "Camilla Läckberg",
        author_slug: "camilla-lackberg",
        image: "/images/camilla-lackberg.jpg",
        language: "es",
      },
    } as CollectionEntry<"authors">,
  ];

  describe("findAuthor", () => {
    test("should find author by exact name", () => {
      const result = findAuthor(mockAuthors, "Stephen King");
      expect(result).toBeDefined();
      expect(result?.data.name).toBe("Stephen King");
      expect(result?.data.author_slug).toBe("stephen-king");
    });

    test("should find author with special characters", () => {
      const result = findAuthor(mockAuthors, "Camilla Läckberg");
      expect(result).toBeDefined();
      expect(result?.data.name).toBe("Camilla Läckberg");
    });

    test("should return undefined when author not found", () => {
      const result = findAuthor(mockAuthors, "Nonexistent Author");
      expect(result).toBeUndefined();
    });

    test("should be case sensitive", () => {
      const result = findAuthor(mockAuthors, "stephen king");
      expect(result).toBeUndefined();
    });

    test("should not match partial names", () => {
      const result = findAuthor(mockAuthors, "Stephen");
      expect(result).toBeUndefined();
    });

    test("should handle empty author list", () => {
      const result = findAuthor([], "Stephen King");
      expect(result).toBeUndefined();
    });
  });

  describe("generateAuthorUrl", () => {
    test("should generate Spanish URL when author exists", () => {
      const author = mockAuthors[0];
      const result = generateAuthorUrl(author, "es");
      expect(result).toBe("/es/autor/stephen-king");
    });

    test("should generate English URL when language is en", () => {
      const author = mockAuthors[0];
      const result = generateAuthorUrl(author, "en");
      expect(result).toBe("/en/author/stephen-king");
    });

    test("should handle author with special characters", () => {
      const author = mockAuthors[1];
      const result = generateAuthorUrl(author, "es");
      expect(result).toBe("/es/autor/camilla-lackberg");
    });

    test("should return null when author is undefined", () => {
      const result = generateAuthorUrl(undefined, "es");
      expect(result).toBeNull();
    });
  });
});
