import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { expect, test, describe, beforeEach, vi } from "vitest";

import BookLink from "@/components/blog/BookLink.astro";

// Mock data
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
];

describe("BookLink Component", () => {
  beforeEach(() => {
    // Setup mock for getCollection
    vi.mocked(getCollection).mockResolvedValue(mockBooks);
  });
  test("should render link when book exists", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis, de Stephen King",
        lang: "es",
      },
    });

    expect(result).toContain('href="/es/libros/apocalipsis-stephen-king"');
    expect(result).toContain("<em>Apocalipsis</em>");
  });

  test("should render full title when full prop is true", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis, de Stephen King",
        full: true,
        lang: "es",
      },
    });

    expect(result).toContain("<em>Apocalipsis</em>");
    expect(result).toContain("de Stephen King");
  });

  test("should default to Spanish when no lang provided", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis, de Stephen King",
      },
    });

    expect(result).toContain('href="/es/libros/apocalipsis-stephen-king"');
  });

  test("should render plain text when book not found", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookLink, {
      props: {
        title: "Libro Inexistente, de Autor Desconocido",
        lang: "es",
      },
    });

    expect(result).not.toContain("href=");
    expect(result).toContain("<em>Libro Inexistente</em>");
  });

  test("should match book by partial title", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis",
        lang: "es",
      },
    });

    // Should still find "Apocalipsis, de Stephen King"
    expect(result).toContain('href="/es/libros/apocalipsis-stephen-king"');
  });

  test("should filter by language", async () => {
    const container = await AstroContainer.create();
    const resultES = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis",
        lang: "es",
      },
    });

    const resultEN = await container.renderToString(BookLink, {
      props: {
        title: "Apocalipsis",
        lang: "en",
      },
    });

    expect(resultES).toContain('href="/es/libros/');
    // English version doesn't exist, should render plain text
    expect(resultEN).not.toContain("href=");
  });
});
