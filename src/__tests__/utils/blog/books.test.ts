// Tests for book page helpers
// These utilities help retrieve and process book data for the book detail page

import type { CollectionEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import {
  findBookBySlug,
  findAuthorBySlug,
  findPublisherBySlug,
  findGenresBySlug,
  findCategoriesBySlug,
  findSeriesBySlug,
} from "@/utils/blog/books";

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

// Mock category data
const mockCategories: CollectionEntry<"categories">[] = [
  {
    id: "book-reviews.json",
    collection: "categories",
    data: {
      name: "Book Reviews",
      category_slug: "book-reviews",
      language: "en" as const,
    },
  },
  {
    id: "tutorials.json",
    collection: "categories",
    data: {
      name: "Tutorials",
      category_slug: "tutorials",
      language: "en" as const,
    },
  },
] as CollectionEntry<"categories">[];

// Mock series data
const mockSeries: CollectionEntry<"series">[] = [
  {
    id: "the-dark-tower.json",
    collection: "series",
    data: {
      name: "The Dark Tower",
      series_slug: "the-dark-tower",
      language: "en" as const,
    },
  },
  {
    id: "harry-potter.json",
    collection: "series",
    data: {
      name: "Harry Potter",
      series_slug: "harry-potter",
      language: "en" as const,
    },
  },
] as CollectionEntry<"series">[];

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

describe("findCategoriesBySlug", () => {
  it("should return all categories for given slugs", () => {
    const categories = findCategoriesBySlug(mockCategories, ["book-reviews", "tutorials"]);
    expect(categories).toHaveLength(2);
    expect(categories.map((c) => c.data.name)).toContain("Book Reviews");
    expect(categories.map((c) => c.data.name)).toContain("Tutorials");
  });

  it("should return empty array when no categories", () => {
    const categories = findCategoriesBySlug(mockCategories, []);
    expect(categories).toEqual([]);
  });

  it("should filter out invalid category references", () => {
    const categories = findCategoriesBySlug(mockCategories, ["book-reviews", "non-existent-category"]);
    expect(categories).toHaveLength(1);
    expect(categories.map((c) => c.data.name)).toContain("Book Reviews");
  });
});

describe("findSeriesBySlug", () => {
  it("should return series when slug matches", () => {
    const series = findSeriesBySlug(mockSeries, "the-dark-tower");
    expect(series).toBeDefined();
    expect(series?.data.name).toBe("The Dark Tower");
  });

  it("should return undefined when series slug is invalid", () => {
    const series = findSeriesBySlug(mockSeries, "non-existent-series");
    expect(series).toBeUndefined();
  });

  it("should match by series_slug field", () => {
    const series = findSeriesBySlug(mockSeries, "harry-potter");
    expect(series).toBeDefined();
    expect(series?.data.series_slug).toBe("harry-potter");
  });
});
