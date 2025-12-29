/**
 * Unit Tests: Unified Routing Configuration
 * Tests the core routing configuration registry and helper functions
 */

import { describe, it, expect } from "vitest";

import {
  CONTENT_TYPES,
  parseRouteSegment,
  getRouteSegment,
  getContentTypeConfig,
  getAllContentTypeIds,
  getContentTypesByCategory,
  hasFeature,
  validateRouteConfig,
  getSpecialSegment,
  isSpecialSegment,
  SPECIAL_SEGMENTS,
} from "@/config/unified-routing";

describe("unified-routing configuration", () => {
  describe("CONTENT_TYPES registry", () => {
    it("should have all expected content types", () => {
      const expectedTypes = [
        "books",
        "tutorials",
        "posts",
        "authors",
        "publishers",
        "genres",
        "categories",
        "series",
        "challenges",
        "courses",
      ];

      const actualTypes = Object.keys(CONTENT_TYPES);
      expect(actualTypes).toEqual(expect.arrayContaining(expectedTypes));
      expect(actualTypes.length).toBe(expectedTypes.length);
    });

    it("should have valid structure for each content type", () => {
      Object.entries(CONTENT_TYPES).forEach(([id, config]) => {
        // ID matches key
        expect(config.id).toBe(id);

        // Has required properties
        expect(config.category).toMatch(/^(content|taxonomy|static)$/);
        expect(config.routeSegments).toBeDefined();
        expect(config.routeSegments.en).toBeDefined();
        expect(config.routeSegments.es).toBeDefined();
        expect(config.templates).toBeDefined();
        expect(config.features).toBeDefined();
        expect(config.seo).toBeDefined();
        expect(config.dataLoaders).toBeDefined();

        // Has at least one template
        const hasTemplate = Object.values(config.templates).some((t) => t !== undefined);
        expect(hasTemplate).toBe(true);

        // Pagination config is consistent
        if (config.features.hasPagination) {
          expect(config.features.itemsPerPage).toBeGreaterThan(0);
        }

        // RSS config is consistent
        if (config.features.hasRSS) {
          expect(config.templates.rss).toBeDefined();
        }

        // Collection exists for content/taxonomy types
        if (config.category !== "static") {
          expect(config.collection).toBeDefined();
          expect(config.collection).not.toBeNull();
        }
      });
    });

    it("should have books config with correct properties", () => {
      const books = CONTENT_TYPES.books;

      expect(books.id).toBe("books");
      expect(books.category).toBe("content");
      expect(books.collection).toBe("books");
      expect(books.routeSegments.en).toBe("books");
      expect(books.routeSegments.es).toBe("libros");
      expect(books.features.hasPagination).toBe(true);
      expect(books.features.hasRSS).toBe(true);
      expect(books.features.itemsPerPage).toBe(12);
      expect(books.seo.schemaType).toBe("Book");
    });

    it("should have tutorials config with correct properties", () => {
      const tutorials = CONTENT_TYPES.tutorials;

      expect(tutorials.id).toBe("tutorials");
      expect(tutorials.category).toBe("content");
      expect(tutorials.collection).toBe("tutorials");
      expect(tutorials.routeSegments.en).toBe("tutorials");
      expect(tutorials.routeSegments.es).toBe("tutoriales");
      expect(tutorials.features.hasPagination).toBe(true);
      expect(tutorials.features.hasRSS).toBe(true);
    });

    it("should have authors config with correct properties", () => {
      const authors = CONTENT_TYPES.authors;

      expect(authors.id).toBe("authors");
      expect(authors.category).toBe("taxonomy");
      expect(authors.collection).toBe("authors");
      expect(authors.routeSegments.en).toBe("authors");
      expect(authors.routeSegments.es).toBe("autores");
      expect(authors.features.hasPagination).toBe(false);
      expect(authors.features.hasRSS).toBe(false);
      expect(authors.seo.schemaType).toBe("Person");
    });
  });

  describe("parseRouteSegment()", () => {
    it("should parse English route segments correctly", () => {
      expect(parseRouteSegment("en", "books")?.id).toBe("books");
      expect(parseRouteSegment("en", "tutorials")?.id).toBe("tutorials");
      expect(parseRouteSegment("en", "posts")?.id).toBe("posts");
      expect(parseRouteSegment("en", "authors")?.id).toBe("authors");
      expect(parseRouteSegment("en", "publishers")?.id).toBe("publishers");
      expect(parseRouteSegment("en", "genres")?.id).toBe("genres");
      expect(parseRouteSegment("en", "categories")?.id).toBe("categories");
      expect(parseRouteSegment("en", "series")?.id).toBe("series");
      expect(parseRouteSegment("en", "challenges")?.id).toBe("challenges");
      expect(parseRouteSegment("en", "courses")?.id).toBe("courses");
    });

    it("should parse Spanish route segments correctly", () => {
      expect(parseRouteSegment("es", "libros")?.id).toBe("books");
      expect(parseRouteSegment("es", "tutoriales")?.id).toBe("tutorials");
      expect(parseRouteSegment("es", "publicaciones")?.id).toBe("posts");
      expect(parseRouteSegment("es", "autores")?.id).toBe("authors");
      expect(parseRouteSegment("es", "editoriales")?.id).toBe("publishers");
      expect(parseRouteSegment("es", "generos")?.id).toBe("genres");
      expect(parseRouteSegment("es", "categorias")?.id).toBe("categories");
      expect(parseRouteSegment("es", "series")?.id).toBe("series");
      expect(parseRouteSegment("es", "retos")?.id).toBe("challenges");
      expect(parseRouteSegment("es", "cursos")?.id).toBe("courses");
    });

    it("should return null for unknown segments", () => {
      expect(parseRouteSegment("en", "unknown")).toBeNull();
      expect(parseRouteSegment("es", "desconocido")).toBeNull();
      expect(parseRouteSegment("en", "")).toBeNull();
    });

    it("should return full config object", () => {
      const config = parseRouteSegment("en", "books");

      expect(config).not.toBeNull();
      expect(config?.id).toBe("books");
      expect(config?.category).toBe("content");
      expect(config?.collection).toBe("books");
      expect(config?.routeSegments).toBeDefined();
      expect(config?.templates).toBeDefined();
      expect(config?.features).toBeDefined();
      expect(config?.seo).toBeDefined();
      expect(config?.dataLoaders).toBeDefined();
    });
  });

  describe("getRouteSegment()", () => {
    it("should get English route segments", () => {
      expect(getRouteSegment("books", "en")).toBe("books");
      expect(getRouteSegment("tutorials", "en")).toBe("tutorials");
      expect(getRouteSegment("authors", "en")).toBe("authors");
    });

    it("should get Spanish route segments", () => {
      expect(getRouteSegment("books", "es")).toBe("libros");
      expect(getRouteSegment("tutorials", "es")).toBe("tutoriales");
      expect(getRouteSegment("authors", "es")).toBe("autores");
    });

    it("should handle unknown content types gracefully", () => {
      // Should return the ID itself as fallback and log warning
      expect(getRouteSegment("unknown", "en")).toBe("unknown");
      expect(getRouteSegment("", "es")).toBe("");
    });
  });

  describe("getContentTypeConfig()", () => {
    it("should return config for valid IDs", () => {
      const booksConfig = getContentTypeConfig("books");
      expect(booksConfig).not.toBeNull();
      expect(booksConfig?.id).toBe("books");

      const authorsConfig = getContentTypeConfig("authors");
      expect(authorsConfig).not.toBeNull();
      expect(authorsConfig?.id).toBe("authors");
    });

    it("should return null for invalid IDs", () => {
      expect(getContentTypeConfig("unknown")).toBeNull();
      expect(getContentTypeConfig("")).toBeNull();
    });
  });

  describe("getAllContentTypeIds()", () => {
    it("should return all content type IDs", () => {
      const ids = getAllContentTypeIds();

      expect(ids).toContain("books");
      expect(ids).toContain("tutorials");
      expect(ids).toContain("posts");
      expect(ids).toContain("authors");
      expect(ids).toContain("publishers");
      expect(ids).toContain("genres");
      expect(ids).toContain("categories");
      expect(ids).toContain("series");
      expect(ids).toContain("challenges");
      expect(ids).toContain("courses");

      expect(ids.length).toBe(10);
    });

    it("should return array of strings", () => {
      const ids = getAllContentTypeIds();
      ids.forEach((id) => {
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getContentTypesByCategory()", () => {
    it("should return content types", () => {
      const contentTypes = getContentTypesByCategory("content");

      expect(contentTypes.length).toBe(3);
      expect(contentTypes.map((c) => c.id)).toContain("books");
      expect(contentTypes.map((c) => c.id)).toContain("tutorials");
      expect(contentTypes.map((c) => c.id)).toContain("posts");
    });

    it("should return taxonomy types", () => {
      const taxonomyTypes = getContentTypesByCategory("taxonomy");

      expect(taxonomyTypes.length).toBe(7);
      expect(taxonomyTypes.map((c) => c.id)).toContain("authors");
      expect(taxonomyTypes.map((c) => c.id)).toContain("publishers");
      expect(taxonomyTypes.map((c) => c.id)).toContain("genres");
      expect(taxonomyTypes.map((c) => c.id)).toContain("categories");
      expect(taxonomyTypes.map((c) => c.id)).toContain("series");
      expect(taxonomyTypes.map((c) => c.id)).toContain("challenges");
      expect(taxonomyTypes.map((c) => c.id)).toContain("courses");
    });

    it("should return empty array for static category (not yet implemented)", () => {
      const staticTypes = getContentTypesByCategory("static");
      expect(staticTypes.length).toBe(0);
    });
  });

  describe("hasFeature()", () => {
    it("should detect pagination feature", () => {
      expect(hasFeature("books", "hasPagination")).toBe(true);
      expect(hasFeature("tutorials", "hasPagination")).toBe(true);
      expect(hasFeature("authors", "hasPagination")).toBe(false);
      expect(hasFeature("publishers", "hasPagination")).toBe(false);
    });

    it("should detect RSS feature", () => {
      expect(hasFeature("books", "hasRSS")).toBe(true);
      expect(hasFeature("tutorials", "hasRSS")).toBe(true);
      expect(hasFeature("posts", "hasRSS")).toBe(false);
      expect(hasFeature("authors", "hasRSS")).toBe(false);
    });

    it("should detect showRelated feature", () => {
      expect(hasFeature("books", "showRelated")).toBe(true);
      expect(hasFeature("authors", "showRelated")).toBe(false);
    });

    it("should detect searchable feature", () => {
      expect(hasFeature("books", "searchable")).toBe(true);
      expect(hasFeature("tutorials", "searchable")).toBe(true);
      expect(hasFeature("authors", "searchable")).toBe(true);
    });

    it("should return false for unknown content types", () => {
      expect(hasFeature("unknown", "hasPagination")).toBe(false);
      expect(hasFeature("", "hasRSS")).toBe(false);
    });

    it("should handle itemsPerPage correctly", () => {
      expect(hasFeature("books", "itemsPerPage")).toBe(true);
      expect(hasFeature("authors", "itemsPerPage")).toBe(false);
    });
  });

  describe("validateRouteConfig()", () => {
    it("should validate successfully without errors", () => {
      expect(() => validateRouteConfig()).not.toThrow();
    });
  });

  describe("SPECIAL_SEGMENTS", () => {
    it("should have expected special segments", () => {
      expect(SPECIAL_SEGMENTS.page).toBeDefined();
      expect(SPECIAL_SEGMENTS.about).toBeDefined();
      expect(SPECIAL_SEGMENTS.feeds).toBeDefined();
    });

    it("should have translations for each segment", () => {
      Object.values(SPECIAL_SEGMENTS).forEach((segment) => {
        expect(segment.en).toBeDefined();
        expect(segment.es).toBeDefined();
        expect(typeof segment.en).toBe("string");
        expect(typeof segment.es).toBe("string");
      });
    });
  });

  describe("getSpecialSegment()", () => {
    it("should get English special segments", () => {
      expect(getSpecialSegment("page", "en")).toBe("page");
      expect(getSpecialSegment("about", "en")).toBe("about");
      expect(getSpecialSegment("feeds", "en")).toBe("feeds");
    });

    it("should get Spanish special segments", () => {
      expect(getSpecialSegment("page", "es")).toBe("pagina");
      expect(getSpecialSegment("about", "es")).toBe("acerca-de");
      expect(getSpecialSegment("feeds", "es")).toBe("feeds");
    });

    it("should return segment itself if not found", () => {
      expect(getSpecialSegment("unknown", "en")).toBe("unknown");
      expect(getSpecialSegment("", "es")).toBe("");
    });
  });

  describe("isSpecialSegment()", () => {
    it("should detect English special segments", () => {
      expect(isSpecialSegment("page", "en")).toBe(true);
      expect(isSpecialSegment("about", "en")).toBe(true);
      expect(isSpecialSegment("feeds", "en")).toBe(true);
    });

    it("should detect Spanish special segments", () => {
      expect(isSpecialSegment("pagina", "es")).toBe(true);
      expect(isSpecialSegment("acerca-de", "es")).toBe(true);
      expect(isSpecialSegment("feeds", "es")).toBe(true);
    });

    it("should return false for non-special segments", () => {
      expect(isSpecialSegment("books", "en")).toBe(false);
      expect(isSpecialSegment("libros", "es")).toBe(false);
      expect(isSpecialSegment("unknown", "en")).toBe(false);
      expect(isSpecialSegment("", "es")).toBe(false);
    });

    it("should not cross-detect segments from other languages", () => {
      // "pagina" is special in Spanish but not in English
      expect(isSpecialSegment("pagina", "en")).toBe(false);
      // "page" is special in English but not in Spanish
      expect(isSpecialSegment("page", "es")).toBe(false);
    });
  });
});
