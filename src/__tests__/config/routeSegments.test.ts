/**
 * Tests for route segments configuration
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- Test file requires any for testing invalid inputs */

import { describe, expect, it } from "vitest";

import { ROUTE_SEGMENTS, getRouteSegment, getRouteSegments } from "@/config/routeSegments";

describe("routeSegments configuration", () => {
  describe("ROUTE_SEGMENTS constant", () => {
    it("should contain all required content type segments", () => {
      const requiredKeys = ["books", "tutorials", "posts"];
      for (const key of requiredKeys) {
        expect(ROUTE_SEGMENTS).toHaveProperty(key);
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("en");
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("es");
      }
    });

    it("should contain all required taxonomy segments", () => {
      const requiredKeys = ["authors", "publishers", "genres", "categories", "series", "challenges", "courses"];
      for (const key of requiredKeys) {
        expect(ROUTE_SEGMENTS).toHaveProperty(key);
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("en");
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("es");
      }
    });

    it("should contain all required static page segments", () => {
      const requiredKeys = ["about", "contact"];
      for (const key of requiredKeys) {
        expect(ROUTE_SEGMENTS).toHaveProperty(key);
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("en");
        expect(ROUTE_SEGMENTS[key]).toHaveProperty("es");
      }
    });

    it("should contain pagination segment", () => {
      expect(ROUTE_SEGMENTS).toHaveProperty("page");
      expect(ROUTE_SEGMENTS.page).toHaveProperty("en");
      expect(ROUTE_SEGMENTS.page).toHaveProperty("es");
    });

    it("should have correct English translations", () => {
      expect(ROUTE_SEGMENTS.books.en).toBe("books");
      expect(ROUTE_SEGMENTS.tutorials.en).toBe("tutorials");
      expect(ROUTE_SEGMENTS.posts.en).toBe("posts");
      expect(ROUTE_SEGMENTS.authors.en).toBe("authors");
      expect(ROUTE_SEGMENTS.publishers.en).toBe("publishers");
      expect(ROUTE_SEGMENTS.genres.en).toBe("genres");
      expect(ROUTE_SEGMENTS.categories.en).toBe("categories");
      expect(ROUTE_SEGMENTS.series.en).toBe("series");
      expect(ROUTE_SEGMENTS.challenges.en).toBe("challenges");
      expect(ROUTE_SEGMENTS.courses.en).toBe("courses");
      expect(ROUTE_SEGMENTS.about.en).toBe("about");
      expect(ROUTE_SEGMENTS.contact.en).toBe("contact");
      expect(ROUTE_SEGMENTS.page.en).toBe("page");
    });

    it("should have correct Spanish translations", () => {
      expect(ROUTE_SEGMENTS.books.es).toBe("libros");
      expect(ROUTE_SEGMENTS.tutorials.es).toBe("tutoriales");
      expect(ROUTE_SEGMENTS.posts.es).toBe("publicaciones");
      expect(ROUTE_SEGMENTS.authors.es).toBe("autores");
      expect(ROUTE_SEGMENTS.publishers.es).toBe("editoriales");
      expect(ROUTE_SEGMENTS.genres.es).toBe("generos");
      expect(ROUTE_SEGMENTS.categories.es).toBe("categorias");
      expect(ROUTE_SEGMENTS.series.es).toBe("series");
      expect(ROUTE_SEGMENTS.challenges.es).toBe("retos");
      expect(ROUTE_SEGMENTS.courses.es).toBe("cursos");
      expect(ROUTE_SEGMENTS.about.es).toBe("acerca-de");
      expect(ROUTE_SEGMENTS.contact.es).toBe("contacto");
      expect(ROUTE_SEGMENTS.page.es).toBe("pagina");
    });

    it("should not have empty or null values", () => {
      for (const [_key, translations] of Object.entries(ROUTE_SEGMENTS)) {
        expect(translations.en).toBeTruthy();
        expect(translations.es).toBeTruthy();
        expect(translations.en).not.toBe("");
        expect(translations.es).not.toBe("");
        expect(translations.en).not.toBeNull();
        expect(translations.es).not.toBeNull();
      }
    });

    it("should have URL-safe segment values (no spaces, special chars)", () => {
      const urlSafeRegex = /^[a-z0-9-]+$/;
      for (const [_key, translations] of Object.entries(ROUTE_SEGMENTS)) {
        expect(translations.en).toMatch(urlSafeRegex);
        expect(translations.es).toMatch(urlSafeRegex);
      }
    });
  });

  describe("getRouteSegment()", () => {
    it("should return correct English segment for books", () => {
      expect(getRouteSegment("books", "en")).toBe("books");
    });

    it("should return correct Spanish segment for books", () => {
      expect(getRouteSegment("books", "es")).toBe("libros");
    });

    it("should return correct English segment for tutorials", () => {
      expect(getRouteSegment("tutorials", "en")).toBe("tutorials");
    });

    it("should return correct Spanish segment for tutorials", () => {
      expect(getRouteSegment("tutorials", "es")).toBe("tutoriales");
    });

    it("should return correct English segment for posts", () => {
      expect(getRouteSegment("posts", "en")).toBe("posts");
    });

    it("should return correct Spanish segment for posts", () => {
      expect(getRouteSegment("posts", "es")).toBe("publicaciones");
    });

    it("should return correct segment for page pagination", () => {
      expect(getRouteSegment("page", "en")).toBe("page");
      expect(getRouteSegment("page", "es")).toBe("pagina");
    });

    it("should return correct segment for about page", () => {
      expect(getRouteSegment("about", "en")).toBe("about");
      expect(getRouteSegment("about", "es")).toBe("acerca-de");
    });

    it("should handle all taxonomy segments", () => {
      expect(getRouteSegment("authors", "en")).toBe("authors");
      expect(getRouteSegment("authors", "es")).toBe("autores");
      expect(getRouteSegment("publishers", "en")).toBe("publishers");
      expect(getRouteSegment("publishers", "es")).toBe("editoriales");
      expect(getRouteSegment("genres", "en")).toBe("genres");
      expect(getRouteSegment("genres", "es")).toBe("generos");
      expect(getRouteSegment("categories", "en")).toBe("categories");
      expect(getRouteSegment("categories", "es")).toBe("categorias");
      expect(getRouteSegment("series", "en")).toBe("series");
      expect(getRouteSegment("series", "es")).toBe("series");
      expect(getRouteSegment("challenges", "en")).toBe("challenges");
      expect(getRouteSegment("challenges", "es")).toBe("retos");
      expect(getRouteSegment("courses", "en")).toBe("courses");
      expect(getRouteSegment("courses", "es")).toBe("cursos");
    });

    it("should throw error for unknown route key", () => {
      expect(() => getRouteSegment("unknown-key", "en")).toThrow(
        'Route segment not found for key "unknown-key" and language "en"',
      );
    });

    it("should throw error with helpful message listing available keys", () => {
      try {
        getRouteSegment("invalid", "en");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Available keys:");
        expect((error as Error).message).toContain("books");
        expect((error as Error).message).toContain("tutorials");
        expect((error as Error).message).toContain("posts");
      }
    });

    it("should throw error for invalid language", () => {
      // Testing runtime behavior with invalid language

      expect(() => getRouteSegment("books", "fr" as any)).toThrow();
    });

    it("should be case-sensitive for keys", () => {
      expect(() => getRouteSegment("Books", "en")).toThrow();
      expect(() => getRouteSegment("BOOKS", "en")).toThrow();
    });
  });

  describe("getRouteSegments()", () => {
    it("should return multiple segments at once", () => {
      const segments = getRouteSegments(["books", "tutorials", "page"], "en");
      expect(segments).toEqual({
        books: "books",
        tutorials: "tutorials",
        page: "page",
      });
    });

    it("should return Spanish segments for multiple keys", () => {
      const segments = getRouteSegments(["books", "tutorials", "page"], "es");
      expect(segments).toEqual({
        books: "libros",
        tutorials: "tutoriales",
        page: "pagina",
      });
    });

    it("should handle empty array", () => {
      const segments = getRouteSegments([], "en");
      expect(segments).toEqual({});
    });

    it("should handle single key array", () => {
      const segments = getRouteSegments(["books"], "en");
      expect(segments).toEqual({ books: "books" });
    });

    it("should throw error if any key is invalid", () => {
      expect(() => getRouteSegments(["books", "invalid-key", "tutorials"], "en")).toThrow();
    });

    it("should return correct segments for all taxonomies", () => {
      const taxonomyKeys = ["authors", "publishers", "genres", "categories", "series", "challenges", "courses"];
      const segments = getRouteSegments(taxonomyKeys, "es");
      expect(segments).toEqual({
        authors: "autores",
        publishers: "editoriales",
        genres: "generos",
        categories: "categorias",
        series: "series",
        challenges: "retos",
        courses: "cursos",
      });
    });

    it("should maintain key order in returned object", () => {
      const keys = ["posts", "books", "tutorials"];
      const segments = getRouteSegments(keys, "en");
      const returnedKeys = Object.keys(segments);
      expect(returnedKeys).toEqual(keys);
    });
  });

  describe("edge cases and consistency", () => {
    it("should have same value for 'series' in both languages", () => {
      expect(ROUTE_SEGMENTS.series.en).toBe(ROUTE_SEGMENTS.series.es);
      expect(ROUTE_SEGMENTS.series.en).toBe("series");
    });

    it("should not have duplicate segment values within same language", () => {
      const enSegments = Object.values(ROUTE_SEGMENTS).map((t) => t.en);
      const uniqueEnSegments = new Set(enSegments);
      expect(uniqueEnSegments.size).toBe(enSegments.length);

      const esSegments = Object.values(ROUTE_SEGMENTS).map((t) => t.es);
      const uniqueEsSegments = new Set(esSegments);
      expect(uniqueEsSegments.size).toBe(esSegments.length);
    });

    it("should have consistent casing (lowercase)", () => {
      for (const [_key, translations] of Object.entries(ROUTE_SEGMENTS)) {
        expect(translations.en).toBe(translations.en.toLowerCase());
        expect(translations.es).toBe(translations.es.toLowerCase());
      }
    });

    it("should handle rapid successive calls without errors", () => {
      for (let i = 0; i < 100; i++) {
        expect(getRouteSegment("books", "en")).toBe("books");
        expect(getRouteSegment("books", "es")).toBe("libros");
      }
    });
  });

  describe("integration with routing system", () => {
    it("should match expected URL patterns for English", () => {
      // Books: /en/books
      expect(getRouteSegment("books", "en")).toBe("books");
      // Tutorials: /en/tutorials
      expect(getRouteSegment("tutorials", "en")).toBe("tutorials");
      // Posts: /en/posts
      expect(getRouteSegment("posts", "en")).toBe("posts");
      // Pagination: /en/books/page/2
      expect(getRouteSegment("page", "en")).toBe("page");
    });

    it("should match expected URL patterns for Spanish", () => {
      // Books: /es/libros
      expect(getRouteSegment("books", "es")).toBe("libros");
      // Tutorials: /es/tutoriales
      expect(getRouteSegment("tutorials", "es")).toBe("tutoriales");
      // Posts: /es/publicaciones
      expect(getRouteSegment("posts", "es")).toBe("publicaciones");
      // Pagination: /es/libros/pagina/2
      expect(getRouteSegment("page", "es")).toBe("pagina");
    });

    it("should work for building full taxonomy URLs", () => {
      const lang = "es";
      const authorSlug = "stephen-king";
      const authorSegment = getRouteSegment("authors", lang);
      const expectedUrl = `/${lang}/${authorSegment}/${authorSlug}`;
      expect(expectedUrl).toBe("/es/autores/stephen-king");
    });

    it("should work for building pagination URLs", () => {
      const lang = "es";
      const contentSegment = getRouteSegment("books", lang);
      const pageSegment = getRouteSegment("page", lang);
      const pageNumber = 2;
      const expectedUrl = `/${lang}/${contentSegment}/${pageSegment}/${pageNumber}`;
      expect(expectedUrl).toBe("/es/libros/pagina/2");
    });
  });
});
