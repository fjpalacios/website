// Tests for author page utilities
// Utilities for finding authors and their related books

import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { getBooksByAuthor, prepareAuthorSummary } from "@/utils/blog/authors";

// Mock data
const mockBooks: CollectionEntry<"books">[] = [
  {
    id: "book1.mdx",
    collection: "books",
    data: {
      title: "Book One",
      post_slug: "book-one",
      date: new Date("2024-01-01"),
      excerpt: "First book",
      language: "en",
      synopsis: "Synopsis 1",
      score: 5,
      pages: 300,
      isbn: "111",
      author: "stephen-king",
      publisher: "pub1",
      genres: [],
      challenges: [],
      category: "book-reviews",
      cover: "./cover1.jpg",
      buy_links: [],
    },
  },
  {
    id: "book2.mdx",
    collection: "books",
    data: {
      title: "Book Two",
      post_slug: "book-two",
      date: new Date("2024-02-01"),
      excerpt: "Second book",
      language: "en",
      synopsis: "Synopsis 2",
      score: 4,
      pages: 400,
      isbn: "222",
      author: "stephen-king",
      publisher: "pub1",
      genres: [],
      challenges: [],
      category: "book-reviews",
      cover: "./cover2.jpg",
      buy_links: [],
    },
  },
  {
    id: "book3.mdx",
    collection: "books",
    data: {
      title: "Book Three",
      post_slug: "book-three",
      date: new Date("2024-03-01"),
      excerpt: "Third book",
      language: "es",
      synopsis: "Synopsis 3",
      score: 3,
      pages: 200,
      isbn: "333",
      author: "other-author",
      publisher: "pub2",
      genres: [],
      challenges: [],
      category: "book-reviews",
      cover: "./cover3.jpg",
      buy_links: [],
    },
  },
] as CollectionEntry<"books">[];

const mockAuthor: CollectionEntry<"authors"> = {
  id: "stephen-king.json",
  collection: "authors",
  data: {
    name: "Stephen King",
    author_slug: "stephen-king",
    bio: "Master of horror",
    language: "en",
    birth_year: 1947,
    nationality: "American",
    website: "https://stephenking.com",
  },
} as CollectionEntry<"authors">;

describe("getBooksByAuthor", () => {
  it("should return all books by a specific author", () => {
    const books = getBooksByAuthor(mockBooks, "stephen-king");

    expect(books).toHaveLength(2);
    expect(books[0].data.author).toBe("stephen-king");
    expect(books[1].data.author).toBe("stephen-king");
  });

  it("should return empty array when no books found", () => {
    const books = getBooksByAuthor(mockBooks, "non-existent-author");

    expect(books).toEqual([]);
  });

  it("should not include books from other authors", () => {
    const books = getBooksByAuthor(mockBooks, "stephen-king");

    expect(books.every((book) => book.data.author === "stephen-king")).toBe(true);
  });
});

describe("prepareAuthorSummary", () => {
  it("should create author summary with basic fields", () => {
    const summary = prepareAuthorSummary(mockAuthor);

    expect(summary.name).toBe("Stephen King");
    expect(summary.slug).toBe("stephen-king");
    expect(summary.bio).toBe("Master of horror");
    expect(summary.language).toBe("en");
  });

  it("should include optional fields when present", () => {
    const summary = prepareAuthorSummary(mockAuthor);

    expect(summary.birthYear).toBe(1947);
    expect(summary.nationality).toBe("American");
    expect(summary.website).toBe("https://stephenking.com");
  });

  it("should handle missing optional fields", () => {
    const minimalAuthor: CollectionEntry<"authors"> = {
      id: "minimal.json",
      collection: "authors",
      data: {
        name: "Minimal Author",
        author_slug: "minimal-author",
        bio: "Just a bio",
        language: "en",
      },
    } as CollectionEntry<"authors">;

    const summary = prepareAuthorSummary(minimalAuthor);

    expect(summary.name).toBe("Minimal Author");
    expect(summary.birthYear).toBeUndefined();
    expect(summary.nationality).toBeUndefined();
    expect(summary.website).toBeUndefined();
  });

  it("should include picture path if present", () => {
    const authorWithPicture: CollectionEntry<"authors"> = {
      ...mockAuthor,
      data: {
        ...mockAuthor.data,
        picture: "./authors/stephen-king.jpg",
      },
    } as CollectionEntry<"authors">;

    const summary = prepareAuthorSummary(authorWithPicture);

    expect(summary.picture).toBe("./authors/stephen-king.jpg");
  });

  it("should include social links if present", () => {
    const authorWithSocial: CollectionEntry<"authors"> = {
      ...mockAuthor,
      data: {
        ...mockAuthor.data,
        twitter: "@StephenKing",
        goodreads: "https://www.goodreads.com/author/show/3389.Stephen_King",
      },
    } as CollectionEntry<"authors">;

    const summary = prepareAuthorSummary(authorWithSocial);

    expect(summary.twitter).toBe("@StephenKing");
    expect(summary.goodreads).toBe("https://www.goodreads.com/author/show/3389.Stephen_King");
  });
});
