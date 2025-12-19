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

    expect(summary.cover).toBe("./covers/test.jpg");
  });

  it("should include pages count", () => {
    const summary = prepareBookSummary(mockBook);

    expect(summary.pages).toBe(300);
  });
});
