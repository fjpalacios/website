// Tests for book listing utilities
// Utilities for filtering, sorting, and preparing books for listing pages

import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { prepareBookSummary } from "@/utils/blog/book-listing";

// Mock book data
const mockBook: CollectionEntry<"books"> = {
  id: "test-book.mdx",
  collection: "books",
  data: {
    title: "Test Book",
    post_slug: "test-book",
    date: new Date("2024-01-15"),
    excerpt: "This is a test book excerpt",
    language: "en",
    synopsis: "Test synopsis",
    score: 5,
    pages: 300,
    isbn: "1234567890",
    author: "test-author",
    publisher: "test-publisher",
    genres: ["fiction"],
    challenges: [],
    category: "book-reviews",
    cover: "./covers/test.jpg",
    buy_links: [],
  },
} as CollectionEntry<"books">;

const mockAuthor: CollectionEntry<"authors"> = {
  id: "test-author.json",
  collection: "authors",
  data: {
    name: "Test Author",
    author_slug: "test-author",
    bio: "Test bio",
    language: "en",
  },
} as CollectionEntry<"authors">;

describe("prepareBookSummary", () => {
  it("should create a book summary with basic fields", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.type).toBe("book");
    expect(summary.title).toBe("Test Book");
    expect(summary.slug).toBe("test-book");
    expect(summary.excerpt).toBe("This is a test book excerpt");
    expect(summary.score).toBe(5);
    expect(summary.language).toBe("en");
    expect(summary.date).toEqual(new Date("2024-01-15"));
  });

  it("should include author name when author is provided", () => {
    const summary = prepareBookSummary(mockBook, mockAuthor);

    expect(summary.authorName).toBe("Test Author");
    expect(summary.authorSlug).toBe("test-author");
  });

  it("should handle missing author", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.authorName).toBeUndefined();
    expect(summary.authorSlug).toBeUndefined();
  });

  it("should include cover path", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.cover).toBe("/images/books/test.jpg");
  });

  it("should include pages count", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.pages).toBe(300);
  });

  it("should return undefined for missing cover", () => {
    const bookWithoutCover = {
      ...mockBook,
      data: {
        ...mockBook.data,
        cover: undefined,
      },
    } as CollectionEntry<"books">;

    const summary = prepareBookSummary(bookWithoutCover);

    expect(summary.cover).toBeUndefined();
  });

  it("should preserve absolute URL paths starting with http", () => {
    const bookWithAbsoluteUrl = {
      ...mockBook,
      data: {
        ...mockBook.data,
        cover: "https://example.com/image.jpg",
      },
    } as CollectionEntry<"books">;

    const summary = prepareBookSummary(bookWithAbsoluteUrl);

    expect(summary.cover).toBe("https://example.com/image.jpg");
  });

  it("should preserve absolute paths starting with /", () => {
    const bookWithAbsolutePath = {
      ...mockBook,
      data: {
        ...mockBook.data,
        cover: "/static/images/book.jpg",
      },
    } as CollectionEntry<"books">;

    const summary = prepareBookSummary(bookWithAbsolutePath);

    expect(summary.cover).toBe("/static/images/book.jpg");
  });

  it("should include series_order when present", () => {
    const bookWithSeriesOrder = {
      ...mockBook,
      data: {
        ...mockBook.data,
        series_order: 3,
      },
    } as CollectionEntry<"books">;

    const summary = prepareBookSummary(bookWithSeriesOrder);

    expect(summary.series_order).toBe(3);
  });

  it("should return undefined series_order when not present", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.series_order).toBeUndefined();
  });

  describe("with series", () => {
    const mockSeries = [
      {
        data: {
          series_slug: "fantasy-trilogy",
          name: "The Fantasy Trilogy",
          language: "en",
          description: "An epic fantasy series",
        },
      },
      {
        data: {
          series_slug: "mystery-series",
          name: "Mystery Adventures",
          language: "es",
          description: "Una serie de misterio",
        },
      },
    ] as CollectionEntry<"series">[];

    it("should include seriesName when book belongs to a series", () => {
      const bookWithSeries = {
        ...mockBook,
        data: {
          ...mockBook.data,
          series: "fantasy-trilogy",
          series_order: 1,
        },
      } as CollectionEntry<"books">;

      const summary = prepareBookSummary(bookWithSeries, undefined, mockSeries);

      expect(summary.series).toBe("fantasy-trilogy");
      expect(summary.seriesName).toBe("The Fantasy Trilogy");
      expect(summary.series_order).toBe(1);
    });

    it("should return undefined seriesName when book has no series field", () => {
      const summary = prepareBookSummary(mockBook, undefined, mockSeries);

      expect(summary.series).toBeUndefined();
      expect(summary.seriesName).toBeUndefined();
    });

    it("should return undefined seriesName when series array not provided", () => {
      const bookWithSeries = {
        ...mockBook,
        data: {
          ...mockBook.data,
          series: "fantasy-trilogy",
        },
      } as CollectionEntry<"books">;

      const summary = prepareBookSummary(bookWithSeries);

      expect(summary.series).toBe("fantasy-trilogy");
      expect(summary.seriesName).toBeUndefined();
    });

    it("should return undefined seriesName when series not found in series array", () => {
      const bookWithUnknownSeries = {
        ...mockBook,
        data: {
          ...mockBook.data,
          series: "non-existent-series",
        },
      } as CollectionEntry<"books">;

      const summary = prepareBookSummary(bookWithUnknownSeries, undefined, mockSeries);

      expect(summary.series).toBe("non-existent-series");
      expect(summary.seriesName).toBeUndefined();
    });

    it("should match series by series_slug field", () => {
      const bookWithMysterySeries = {
        ...mockBook,
        data: {
          ...mockBook.data,
          series: "mystery-series",
          series_order: 2,
          language: "es" as const,
        },
      } as CollectionEntry<"books">;

      const summary = prepareBookSummary(bookWithMysterySeries, undefined, mockSeries);

      expect(summary.series).toBe("mystery-series");
      expect(summary.seriesName).toBe("Mystery Adventures");
    });
  });
});
