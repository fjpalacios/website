/**
 * Tests for RSS feed generator
 * Tests the core RSS generation logic extracted from multiple RSS feed files
 */

import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";

import {
  generateRSSFeed,
  generateSingleCollectionFeed,
  generateMultiCollectionFeed,
  generateBilingualFeed,
  buildContentUrl,
  type RSSFeedConfig,
} from "@/utils/rss/generator";

// Mock collection entries
const mockBooks: CollectionEntry<"books">[] = [
  {
    id: "book-1-es.md",
    collection: "books",
    data: {
      title: "Libro de Terror",
      excerpt: "Una historia aterradora",
      date: new Date("2024-01-15"),
      post_slug: "libro-terror",
      language: "es",
      author: "stephen-king",
      book_genres: ["horror"],
      draft: false,
    },
    slug: "book-1-es",
    body: "",
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} }),
  },
  {
    id: "book-2-en.md",
    collection: "books",
    data: {
      title: "Horror Book",
      excerpt: "A scary story",
      date: new Date("2024-01-10"),
      post_slug: "horror-book",
      language: "en",
      author: "stephen-king",
      book_genres: ["horror"],
      draft: false,
    },
    slug: "book-2-en",
    body: "",
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} }),
  },
] as CollectionEntry<"books">[];

const mockPosts: CollectionEntry<"posts">[] = [
  {
    id: "post-1-es.md",
    collection: "posts",
    data: {
      title: "Mi primer post",
      excerpt: "Descripción del post",
      date: new Date("2024-01-20"),
      post_slug: "primer-post",
      language: "es",
      categories: ["tech"],
      draft: false,
    },
    slug: "post-1-es",
    body: "",
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} }),
  },
] as CollectionEntry<"posts">[];

const mockTutorials: CollectionEntry<"tutorials">[] = [
  {
    id: "tutorial-1-es.md",
    collection: "tutorials",
    data: {
      title: "Tutorial de Git",
      excerpt: "Aprende Git desde cero",
      date: new Date("2024-01-25"),
      post_slug: "tutorial-git",
      language: "es",
      categories: ["git"],
      courses: [],
      draft: false,
    },
    slug: "tutorial-1-es",
    body: "",
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} }),
  },
] as CollectionEntry<"tutorials">[];

describe("rss/generator", () => {
  describe("buildContentUrl", () => {
    it("should build correct URL for Spanish book", () => {
      const url = buildContentUrl(mockBooks[0], "es");
      expect(url).toBe("/es/libros/libro-terror");
    });

    it("should build correct URL for English book", () => {
      const url = buildContentUrl(mockBooks[1], "en");
      expect(url).toBe("/en/books/horror-book");
    });

    it("should build correct URL for Spanish post", () => {
      const url = buildContentUrl(mockPosts[0], "es");
      expect(url).toBe("/es/publicaciones/primer-post");
    });

    it("should build correct URL for English post", () => {
      const post = { ...mockPosts[0], data: { ...mockPosts[0].data, language: "en" as const } };
      const url = buildContentUrl(post, "en");
      expect(url).toBe("/en/posts/primer-post");
    });

    it("should build correct URL for Spanish tutorial", () => {
      const url = buildContentUrl(mockTutorials[0], "es");
      expect(url).toBe("/es/tutoriales/tutorial-git");
    });

    it("should build correct URL for English tutorial", () => {
      const tutorial = { ...mockTutorials[0], data: { ...mockTutorials[0].data, language: "en" as const } };
      const url = buildContentUrl(tutorial, "en");
      expect(url).toBe("/en/tutorials/tutorial-git");
    });

    it("should handle unknown collection type as post", () => {
      const unknownItem = {
        ...mockPosts[0],
        collection: "unknown" as "posts" | "books" | "tutorials",
      };
      const url = buildContentUrl(unknownItem, "es");
      expect(url).toBe("/es/publicaciones/primer-post");
    });
  });

  describe("generateSingleCollectionFeed", () => {
    it("should generate feed for single collection with language filter", () => {
      const config: RSSFeedConfig = {
        title: "Book Reviews",
        description: "Latest book reviews",
        site: "https://fjp.es",
        language: "en",
      };

      const feed = generateSingleCollectionFeed(mockBooks, config);

      expect(feed.title).toBe("Book Reviews");
      expect(feed.description).toBe("Latest book reviews");
      expect(feed.site).toBe("https://fjp.es");
      expect(feed.customData).toBe("<language>en</language>");
      expect(feed.items).toHaveLength(1); // Only English book
      expect(feed.items[0].title).toBe("Horror Book");
      expect(feed.items[0].link).toBe("/en/books/horror-book");
    });

    it("should filter items by language", () => {
      const config: RSSFeedConfig = {
        title: "Reseñas de Libros",
        description: "Últimas reseñas",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateSingleCollectionFeed(mockBooks, config);

      expect(feed.items).toHaveLength(1); // Only Spanish book
      expect(feed.items[0].title).toBe("Libro de Terror");
      expect(feed.items[0].link).toBe("/es/libros/libro-terror");
    });

    it("should sort items by date (newest first)", () => {
      const books = [
        { ...mockBooks[0], data: { ...mockBooks[0].data, date: new Date("2024-01-01") } },
        { ...mockBooks[0], data: { ...mockBooks[0].data, date: new Date("2024-01-15") } },
        { ...mockBooks[0], data: { ...mockBooks[0].data, date: new Date("2024-01-10") } },
      ];

      const config: RSSFeedConfig = {
        title: "Books",
        description: "Books",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateSingleCollectionFeed(books, config);

      expect(feed.items).toHaveLength(3);
      expect(feed.items[0].pubDate.getTime()).toBeGreaterThan(feed.items[1].pubDate.getTime());
      expect(feed.items[1].pubDate.getTime()).toBeGreaterThan(feed.items[2].pubDate.getTime());
    });

    it("should include custom data for each item", () => {
      const config: RSSFeedConfig = {
        title: "Books",
        description: "Books",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateSingleCollectionFeed(mockBooks, config);

      expect(feed.items[0].customData).toBe("<language>es</language>");
    });

    it("should return empty items array when no content matches language", () => {
      const config: RSSFeedConfig = {
        title: "Books",
        description: "Books",
        site: "https://fjp.es",
        language: "fr" as "es" | "en",
      };

      const feed = generateSingleCollectionFeed(mockBooks, config);

      expect(feed.items).toHaveLength(0);
    });
  });

  describe("generateMultiCollectionFeed", () => {
    it("should combine multiple collections", () => {
      const config: RSSFeedConfig = {
        title: "All Content",
        description: "All content in Spanish",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateMultiCollectionFeed([mockBooks, mockPosts, mockTutorials], config);

      expect(feed.items).toHaveLength(3); // 1 book + 1 post + 1 tutorial (all Spanish)
      expect(feed.items.map((i) => i.title)).toContain("Libro de Terror");
      expect(feed.items.map((i) => i.title)).toContain("Mi primer post");
      expect(feed.items.map((i) => i.title)).toContain("Tutorial de Git");
    });

    it("should sort combined items by date", () => {
      const config: RSSFeedConfig = {
        title: "All Content",
        description: "All content",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateMultiCollectionFeed([mockBooks, mockPosts, mockTutorials], config);

      // Tutorial (Jan 25) > Post (Jan 20) > Book (Jan 15)
      expect(feed.items[0].title).toBe("Tutorial de Git");
      expect(feed.items[1].title).toBe("Mi primer post");
      expect(feed.items[2].title).toBe("Libro de Terror");
    });

    it("should handle empty collections array", () => {
      const config: RSSFeedConfig = {
        title: "Empty",
        description: "Empty",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateMultiCollectionFeed([], config);

      expect(feed.items).toHaveLength(0);
    });

    it("should filter all collections by language", () => {
      const config: RSSFeedConfig = {
        title: "English Content",
        description: "All English content",
        site: "https://fjp.es",
        language: "en",
      };

      const feed = generateMultiCollectionFeed([mockBooks, mockPosts, mockTutorials], config);

      expect(feed.items).toHaveLength(1); // Only 1 English book
      expect(feed.items[0].title).toBe("Horror Book");
    });
  });

  describe("generateBilingualFeed", () => {
    it("should include all items regardless of language", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual Feed",
        description: "Content in all languages",
        site: "https://fjp.es",
      };

      const feed = generateBilingualFeed([mockBooks, mockPosts, mockTutorials], config);

      expect(feed.items).toHaveLength(4); // 2 books + 1 post + 1 tutorial
    });

    it("should prefix title with language tag", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual",
        description: "Bilingual",
        site: "https://fjp.es",
      };

      const feed = generateBilingualFeed([mockBooks], config);

      expect(feed.items[0].title).toContain("[ES]");
      expect(feed.items[0].title).toContain("Libro de Terror");
      expect(feed.items[1].title).toContain("[EN]");
      expect(feed.items[1].title).toContain("Horror Book");
    });

    it("should include language in custom data for each item", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual",
        description: "Bilingual",
        site: "https://fjp.es",
      };

      const feed = generateBilingualFeed([mockBooks], config);

      expect(feed.items[0].customData).toBe("<language>es</language>");
      expect(feed.items[1].customData).toBe("<language>en</language>");
    });

    it("should sort by date across all languages", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual",
        description: "Bilingual",
        site: "https://fjp.es",
      };

      const feed = generateBilingualFeed([mockBooks, mockPosts, mockTutorials], config);

      // Tutorial (Jan 25) > Post (Jan 20) > Book ES (Jan 15) > Book EN (Jan 10)
      expect(feed.items[0].title).toContain("Tutorial de Git");
      expect(feed.items[1].title).toContain("Mi primer post");
      expect(feed.items[2].title).toContain("Libro de Terror");
      expect(feed.items[3].title).toContain("Horror Book");
    });

    it("should not have customData at feed level (only per item)", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual",
        description: "Bilingual",
        site: "https://fjp.es",
      };

      const feed = generateBilingualFeed([mockBooks], config);

      expect(feed.customData).toBeUndefined();
    });
  });

  describe("generateRSSFeed (main wrapper)", () => {
    it("should delegate to generateSingleCollectionFeed for single collection", () => {
      const config: RSSFeedConfig = {
        title: "Books",
        description: "Books",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateRSSFeed({ items: mockBooks, config });

      expect(feed.items).toHaveLength(1);
      expect(feed.items[0].title).toBe("Libro de Terror");
    });

    it("should delegate to generateMultiCollectionFeed for multiple collections", () => {
      const config: RSSFeedConfig = {
        title: "All",
        description: "All",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateRSSFeed({ items: [mockBooks, mockPosts], config });

      expect(feed.items).toHaveLength(2);
    });

    it("should delegate to generateBilingualFeed when bilingual is true", () => {
      const config: Omit<RSSFeedConfig, "language"> = {
        title: "Bilingual",
        description: "Bilingual",
        site: "https://fjp.es",
      };

      const feed = generateRSSFeed({ items: [mockBooks], config, bilingual: true });

      expect(feed.items).toHaveLength(2); // Both languages
      expect(feed.items[0].title).toContain("[ES]");
      expect(feed.items[1].title).toContain("[EN]");
    });
  });

  describe("edge cases", () => {
    it("should handle items with missing language (defaults to 'es')", () => {
      const itemWithoutLang = {
        ...mockBooks[0],
        data: { ...mockBooks[0].data, language: undefined as unknown as "es" | "en" },
      };

      const url = buildContentUrl(itemWithoutLang, "es");
      expect(url).toBe("/es/libros/libro-terror");
    });

    it("should handle empty collections gracefully", () => {
      const config: RSSFeedConfig = {
        title: "Empty",
        description: "Empty",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateSingleCollectionFeed([], config);
      expect(feed.items).toHaveLength(0);
    });

    it("should preserve all RSS item properties", () => {
      const config: RSSFeedConfig = {
        title: "Books",
        description: "Books",
        site: "https://fjp.es",
        language: "es",
      };

      const feed = generateSingleCollectionFeed(mockBooks, config);
      const item = feed.items[0];

      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("pubDate");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("link");
      expect(item).toHaveProperty("customData");
    });
  });
});
