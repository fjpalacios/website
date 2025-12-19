// Tests for book page helpers
// These utilities help retrieve and process book data for the book detail page

import type { CollectionEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { findBookBySlug, findAuthorBySlug, findPublisherBySlug, findGenresBySlug } from "@/utils/blog/books";

// Mock book data for testing
const mockBooks: CollectionEntry<"books">[] = [
  {
    id: "apocalipsis-stephen-king.mdx",
    collection: "books",
    data: {
      title: "Apocalipsis",
      post_slug: "apocalipsis-stephen-king",
      date: new Date("2017-05-02"),
      excerpt: "Test excerpt",
      language: "es" as const,
      synopsis: "Test synopsis",
      score: 5,
      pages: 1584,
      isbn: "9788497599412",
      author: "stephen-king",
      publisher: "debolsillo",
      genres: ["fiction", "horror", "thriller"],
      challenges: ["2017-reading-challenge"],
      category: "book-reviews",
      cover: "./covers/test.jpg",
      buy_links: [],
    },
  },
] as CollectionEntry<"books">[];

// Mock author data
const mockAuthors: CollectionEntry<"authors">[] = [
  {
    id: "stephen-king.json",
    collection: "authors",
    data: {
      name: "Stephen King",
      author_slug: "stephen-king",
      bio: "Test bio",
      language: "en" as const,
    },
  },
] as CollectionEntry<"authors">[];

// Mock publisher data
const mockPublishers: CollectionEntry<"publishers">[] = [
  {
    id: "debolsillo.json",
    collection: "publishers",
    data: {
      name: "Debolsillo",
      publisher_slug: "debolsillo",
      language: "es" as const,
    },
  },
] as CollectionEntry<"publishers">[];

// Mock genre data
const mockGenres: CollectionEntry<"genres">[] = [
  {
    id: "fiction.json",
    collection: "genres",
    data: {
      name: "Fiction",
      genre_slug: "fiction",
      language: "en" as const,
    },
  },
  {
    id: "horror.json",
    collection: "genres",
    data: {
      name: "Horror",
      genre_slug: "horror",
      language: "en" as const,
      parent: "fiction",
    },
  },
  {
    id: "thriller.json",
    collection: "genres",
    data: {
      name: "Thriller",
      genre_slug: "thriller",
      language: "en" as const,
      parent: "fiction",
    },
  },
] as CollectionEntry<"genres">[];

describe("findBookBySlug", () => {
  it("should return a book when slug matches", () => {
    const book = findBookBySlug(mockBooks, "apocalipsis-stephen-king");
    expect(book).toBeDefined();
    expect(book?.data.title).toBe("Apocalipsis");
  });

  it("should return undefined when slug does not match", () => {
    const book = findBookBySlug(mockBooks, "non-existent-book");
    expect(book).toBeUndefined();
  });

  it("should match by post_slug field", () => {
    const book = findBookBySlug(mockBooks, "apocalipsis-stephen-king");
    expect(book?.data.post_slug).toBe("apocalipsis-stephen-king");
  });
});

describe("findAuthorBySlug", () => {
  it("should return author when slug matches", () => {
    const author = findAuthorBySlug(mockAuthors, "stephen-king");
    expect(author).toBeDefined();
    expect(author?.data.name).toBe("Stephen King");
  });

  it("should return undefined when author slug is invalid", () => {
    const author = findAuthorBySlug(mockAuthors, "non-existent-author");
    expect(author).toBeUndefined();
  });
});

describe("findPublisherBySlug", () => {
  it("should return publisher when slug matches", () => {
    const publisher = findPublisherBySlug(mockPublishers, "debolsillo");
    expect(publisher).toBeDefined();
    expect(publisher?.data.name).toBe("Debolsillo");
  });

  it("should return undefined when publisher slug is invalid", () => {
    const publisher = findPublisherBySlug(mockPublishers, "non-existent-publisher");
    expect(publisher).toBeUndefined();
  });
});

describe("findGenresBySlug", () => {
  it("should return all genres for given slugs", () => {
    const genres = findGenresBySlug(mockGenres, ["fiction", "horror", "thriller"]);
    expect(genres).toHaveLength(3);
    expect(genres.map((g) => g.data.name)).toContain("Fiction");
    expect(genres.map((g) => g.data.name)).toContain("Horror");
    expect(genres.map((g) => g.data.name)).toContain("Thriller");
  });

  it("should return empty array when no genres", () => {
    const genres = findGenresBySlug(mockGenres, []);
    expect(genres).toEqual([]);
  });

  it("should filter out invalid genre references", () => {
    const genres = findGenresBySlug(mockGenres, ["fiction", "non-existent-genre", "horror"]);
    expect(genres).toHaveLength(2);
    expect(genres.map((g) => g.data.name)).toContain("Fiction");
    expect(genres.map((g) => g.data.name)).toContain("Horror");
  });
});
