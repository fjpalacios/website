import {
  parseTitle,
  findBook,
  generateDisplayTitle,
  generateBookUrl,
  detectLanguageFromUrl,
} from "@utils/bookLinkHelpers";
import type { CollectionEntry } from "astro:content";
import { describe, expect, test } from "vitest";

describe("bookLinkHelpers", () => {
  // Mock books for testing
  const mockBooks: CollectionEntry<"books">[] = [
    {
      id: "apocalipsis-stephen-king-es.md",
      collection: "books",
      data: {
        title: "Apocalipsis, de Stephen King",
        post_slug: "apocalipsis-stephen-king",
        language: "es",
        post_date: "2024-01-01",
        post_modified: "2024-01-01",
        rating: 5,
        genres: [],
        categories: [],
        authors: [],
        publishers: [],
      },
      slug: "apocalipsis-stephen-king-es",
    } as CollectionEntry<"books">,
    {
      id: "it-stephen-king-es.md",
      collection: "books",
      data: {
        title: "It, de Stephen King",
        post_slug: "it-stephen-king",
        language: "es",
        post_date: "2024-01-01",
        post_modified: "2024-01-01",
        rating: 5,
        genres: [],
        categories: [],
        authors: [],
        publishers: [],
      },
      slug: "it-stephen-king-es",
    } as CollectionEntry<"books">,
    {
      id: "it-stephen-king-en.md",
      collection: "books",
      data: {
        title: "It, by Stephen King",
        post_slug: "it-stephen-king",
        language: "en",
        post_date: "2024-01-01",
        post_modified: "2024-01-01",
        rating: 5,
        genres: [],
        categories: [],
        authors: [],
        publishers: [],
      },
      slug: "it-stephen-king-en",
    } as CollectionEntry<"books">,
  ];

  describe("parseTitle", () => {
    test("should parse title with author", () => {
      const result = parseTitle("Apocalipsis, de Stephen King");
      expect(result).toEqual({
        bookTitle: "Apocalipsis",
        author: "de Stephen King",
      });
    });

    test("should parse title without author", () => {
      const result = parseTitle("Apocalipsis");
      expect(result).toEqual({
        bookTitle: "Apocalipsis",
        author: "",
      });
    });

    test("should handle multiple commas", () => {
      const result = parseTitle("Title, Part 1, by Author Name");
      expect(result).toEqual({
        bookTitle: "Title",
        author: "Part 1, by Author Name",
      });
    });

    test("should handle empty string", () => {
      const result = parseTitle("");
      expect(result).toEqual({
        bookTitle: "",
        author: "",
      });
    });
  });

  describe("findBook", () => {
    test("should find book by exact title", () => {
      const result = findBook(mockBooks, "Apocalipsis, de Stephen King", "es");
      expect(result).toBeDefined();
      expect(result?.data.title).toBe("Apocalipsis, de Stephen King");
    });

    test("should find book by partial title", () => {
      const result = findBook(mockBooks, "Apocalipsis", "es");
      expect(result).toBeDefined();
      expect(result?.data.title).toBe("Apocalipsis, de Stephen King");
    });

    test("should filter by language", () => {
      const resultES = findBook(mockBooks, "It", "es");
      const resultEN = findBook(mockBooks, "It", "en");

      expect(resultES?.data.language).toBe("es");
      expect(resultES?.data.title).toBe("It, de Stephen King");

      expect(resultEN?.data.language).toBe("en");
      expect(resultEN?.data.title).toBe("It, by Stephen King");
    });

    test("should return undefined when book not found", () => {
      const result = findBook(mockBooks, "Nonexistent Book", "es");
      expect(result).toBeUndefined();
    });

    test("should return undefined when language doesn't match", () => {
      const result = findBook(mockBooks, "Apocalipsis", "en");
      expect(result).toBeUndefined();
    });
  });

  describe("generateDisplayTitle", () => {
    test("should generate simple title when full is false", () => {
      const book = mockBooks[0];
      const result = generateDisplayTitle("Apocalipsis", false, book);
      expect(result).toBe("<em>Apocalipsis</em>");
    });

    test("should generate full title when full is true", () => {
      const book = mockBooks[0];
      const result = generateDisplayTitle("Apocalipsis", true, book);
      expect(result).toBe("<em>Apocalipsis</em>, de Stephen King");
    });

    test("should generate fallback title when book not found", () => {
      const result = generateDisplayTitle("Nonexistent Book", false, undefined);
      expect(result).toBe("<em>Nonexistent Book</em>");
    });

    test("should generate fallback full title when book not found", () => {
      const result = generateDisplayTitle("Nonexistent Book, by Author", true, undefined);
      expect(result).toBe("<em>Nonexistent Book</em>, by Author");
    });

    test("should handle title without author in full mode", () => {
      const book = {
        ...mockBooks[0],
        data: {
          ...mockBooks[0].data,
          title: "SingleTitleBook",
        },
      };
      const result = generateDisplayTitle("SingleTitleBook", true, book);
      expect(result).toBe("<em>SingleTitleBook</em>");
    });
  });

  describe("generateBookUrl", () => {
    test("should generate URL when book exists", () => {
      const book = mockBooks[0];
      const result = generateBookUrl(book, "es");
      expect(result).toBe("/es/libros/apocalipsis-stephen-king");
    });

    test("should generate English URL when language is en", () => {
      const book = mockBooks[2];
      const result = generateBookUrl(book, "en");
      expect(result).toBe("/en/books/it-stephen-king");
    });

    test("should return null when book is undefined", () => {
      const result = generateBookUrl(undefined, "es");
      expect(result).toBeNull();
    });
  });

  describe("detectLanguageFromUrl", () => {
    test("should detect English from /en/ prefix", () => {
      expect(detectLanguageFromUrl("/en/books/the-stand")).toBe("en");
      expect(detectLanguageFromUrl("/en/authors/stephen-king")).toBe("en");
      expect(detectLanguageFromUrl("/en/")).toBe("en");
      expect(detectLanguageFromUrl("/en")).toBe("es"); // No trailing slash, doesn't match
    });

    test("should detect Spanish from /es/ prefix", () => {
      expect(detectLanguageFromUrl("/es/libros/apocalipsis")).toBe("es");
      expect(detectLanguageFromUrl("/es/autores/stephen-king")).toBe("es");
      expect(detectLanguageFromUrl("/es/")).toBe("es");
    });

    test("should default to Spanish for unknown paths", () => {
      expect(detectLanguageFromUrl("/unknown/path")).toBe("es");
      expect(detectLanguageFromUrl("/fr/books/something")).toBe("es");
      expect(detectLanguageFromUrl("/")).toBe("es");
      expect(detectLanguageFromUrl("")).toBe("es");
    });

    test("should handle edge cases", () => {
      expect(detectLanguageFromUrl("/en")).toBe("es"); // No trailing slash
      expect(detectLanguageFromUrl("/english/path")).toBe("es"); // Contains 'en' but not /en/
      expect(detectLanguageFromUrl("/es")).toBe("es"); // No trailing slash, still defaults to es
    });
  });
});
