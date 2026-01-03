/**
 * Unit Tests: Route Parser
 * Tests the URL parsing and route matching logic
 */

import { describe, it, expect } from "vitest";

import type { PageType } from "@/config/unified-routing";
import {
  parseRoute,
  safeParseRoute,
  validateParsedRoute,
  buildRoute,
  matchRoute,
  getContentTypeRoutes,
  formatParsedRoute,
  RouteParseError,
} from "@/utils/routing/parser";

describe("parseRoute()", () => {
  describe("list pages", () => {
    it("should parse English books list page", () => {
      const parsed = parseRoute("en", "books");

      expect(parsed.lang).toBe("en");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("list");
      expect(parsed.slug).toBeUndefined();
      expect(parsed.pageNumber).toBeUndefined();
      expect(parsed.segments).toEqual(["books"]);
      expect(parsed.config).toBeDefined();
      expect(parsed.config.id).toBe("books");
    });

    it("should parse Spanish books list page", () => {
      const parsed = parseRoute("es", "libros");

      expect(parsed.lang).toBe("es");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("list");
      expect(parsed.segments).toEqual(["libros"]);
    });

    it("should parse tutorials list pages", () => {
      expect(parseRoute("en", "tutorials").contentTypeId).toBe("tutorials");
      expect(parseRoute("es", "tutoriales").contentTypeId).toBe("tutorials");
    });

    it("should parse posts list pages", () => {
      expect(parseRoute("en", "posts").contentTypeId).toBe("posts");
      expect(parseRoute("es", "publicaciones").contentTypeId).toBe("posts");
    });

    it("should parse taxonomy list pages", () => {
      expect(parseRoute("en", "authors").contentTypeId).toBe("authors");
      expect(parseRoute("es", "autores").contentTypeId).toBe("authors");
      expect(parseRoute("en", "publishers").contentTypeId).toBe("publishers");
      expect(parseRoute("es", "editoriales").contentTypeId).toBe("publishers");
      expect(parseRoute("en", "genres").contentTypeId).toBe("genres");
      expect(parseRoute("es", "generos").contentTypeId).toBe("genres");
    });
  });

  describe("detail pages", () => {
    it("should parse English book detail page", () => {
      const parsed = parseRoute("en", "books/the-stand-stephen-king");

      expect(parsed.lang).toBe("en");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("detail");
      expect(parsed.slug).toBe("the-stand-stephen-king");
      expect(parsed.pageNumber).toBeUndefined();
      expect(parsed.segments).toEqual(["books", "the-stand-stephen-king"]);
    });

    it("should parse Spanish book detail page", () => {
      const parsed = parseRoute("es", "libros/apocalipsis-stephen-king");

      expect(parsed.lang).toBe("es");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("detail");
      expect(parsed.slug).toBe("apocalipsis-stephen-king");
      expect(parsed.segments).toEqual(["libros", "apocalipsis-stephen-king"]);
    });

    it("should parse tutorial detail pages", () => {
      const enParsed = parseRoute("en", "tutorials/how-to-code");
      expect(enParsed.contentTypeId).toBe("tutorials");
      expect(enParsed.pageType).toBe("detail");
      expect(enParsed.slug).toBe("how-to-code");

      const esParsed = parseRoute("es", "tutoriales/como-programar");
      expect(esParsed.contentTypeId).toBe("tutorials");
      expect(esParsed.slug).toBe("como-programar");
    });

    it("should parse author detail pages", () => {
      const enParsed = parseRoute("en", "authors/stephen-king");
      expect(enParsed.contentTypeId).toBe("authors");
      expect(enParsed.pageType).toBe("detail");
      expect(enParsed.slug).toBe("stephen-king");

      const esParsed = parseRoute("es", "autores/stephen-king");
      expect(esParsed.contentTypeId).toBe("authors");
      expect(esParsed.slug).toBe("stephen-king");
    });

    it("should handle slugs with special characters", () => {
      const parsed1 = parseRoute("es", "libros/el-silencio-de-la-ciudad-blanca");
      expect(parsed1.slug).toBe("el-silencio-de-la-ciudad-blanca");

      const parsed2 = parseRoute("en", "books/book-123-test");
      expect(parsed2.slug).toBe("book-123-test");
    });

    it("should handle slugs with numbers", () => {
      const parsed = parseRoute("es", "libros/1984-george-orwell");
      expect(parsed.slug).toBe("1984-george-orwell");
    });
  });

  describe("pagination pages", () => {
    it("should parse English pagination page", () => {
      const parsed = parseRoute("en", "books/page/2");

      expect(parsed.lang).toBe("en");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("pagination");
      expect(parsed.pageNumber).toBe(2);
      expect(parsed.slug).toBeUndefined();
      expect(parsed.segments).toEqual(["books", "page", "2"]);
    });

    it("should parse Spanish pagination page", () => {
      const parsed = parseRoute("es", "libros/pagina/3");

      expect(parsed.lang).toBe("es");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("pagination");
      expect(parsed.pageNumber).toBe(3);
      expect(parsed.segments).toEqual(["libros", "pagina", "3"]);
    });

    it("should parse page 1", () => {
      const parsed = parseRoute("en", "books/page/1");
      expect(parsed.pageNumber).toBe(1);
    });

    it("should parse large page numbers", () => {
      const parsed = parseRoute("en", "books/page/999");
      expect(parsed.pageNumber).toBe(999);
    });

    it("should parse tutorials pagination", () => {
      const enParsed = parseRoute("en", "tutorials/page/2");
      expect(enParsed.contentTypeId).toBe("tutorials");
      expect(enParsed.pageType).toBe("pagination");
      expect(enParsed.pageNumber).toBe(2);

      const esParsed = parseRoute("es", "tutoriales/pagina/5");
      expect(esParsed.contentTypeId).toBe("tutorials");
      expect(esParsed.pageNumber).toBe(5);
    });

    it("should throw error for invalid page number (not a number)", () => {
      expect(() => parseRoute("en", "books/page/abc")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "books/page/abc")).toThrow('Invalid page number: "abc"');
    });

    it("should throw error for page number less than 1", () => {
      expect(() => parseRoute("en", "books/page/0")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "books/page/0")).toThrow('Invalid page number: "0"');

      expect(() => parseRoute("en", "books/page/-1")).toThrow(RouteParseError);
    });

    it("should parse decimal page numbers as integers (truncates)", () => {
      // parseInt("2.5") = 2, which is valid behavior in JavaScript
      const parsed = parseRoute("en", "books/page/2.5");
      expect(parsed.pageNumber).toBe(2);
    });

    it("should throw error for pagination on content without pagination", () => {
      // Authors don't have pagination
      expect(() => parseRoute("en", "authors/page/2")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "authors/page/2")).toThrow("Pagination not enabled for content type: authors");
    });

    it("should throw error for invalid pagination path structure", () => {
      // Missing page number
      expect(() => parseRoute("en", "books/page")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "books/page")).toThrow("Invalid pagination path");

      // Extra segments
      expect(() => parseRoute("en", "books/page/2/extra")).toThrow(RouteParseError);
    });
  });

  describe("RSS feeds", () => {
    it("should parse English RSS feed", () => {
      const parsed = parseRoute("en", "books/rss.xml");

      expect(parsed.lang).toBe("en");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("rss");
      expect(parsed.slug).toBeUndefined();
      expect(parsed.pageNumber).toBeUndefined();
      expect(parsed.segments).toEqual(["books", "rss.xml"]);
    });

    it("should parse Spanish RSS feed", () => {
      const parsed = parseRoute("es", "libros/rss.xml");

      expect(parsed.lang).toBe("es");
      expect(parsed.contentTypeId).toBe("books");
      expect(parsed.pageType).toBe("rss");
      expect(parsed.segments).toEqual(["libros", "rss.xml"]);
    });

    it("should parse tutorials RSS feed", () => {
      const enParsed = parseRoute("en", "tutorials/rss.xml");
      expect(enParsed.contentTypeId).toBe("tutorials");
      expect(enParsed.pageType).toBe("rss");

      const esParsed = parseRoute("es", "tutoriales/rss.xml");
      expect(esParsed.contentTypeId).toBe("tutorials");
      expect(esParsed.pageType).toBe("rss");
    });

    it("should throw error for RSS on content without RSS", () => {
      // Posts don't have RSS
      expect(() => parseRoute("en", "posts/rss.xml")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "posts/rss.xml")).toThrow("RSS not enabled for content type: posts");

      // Authors don't have RSS
      expect(() => parseRoute("es", "autores/rss.xml")).toThrow(RouteParseError);
      expect(() => parseRoute("es", "autores/rss.xml")).toThrow("RSS not enabled for content type: authors");
    });
  });

  describe("error handling", () => {
    it("should throw RouteParseError for empty route", () => {
      expect(() => parseRoute("en", "")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "")).toThrow("Empty route path");
    });

    it("should throw RouteParseError for undefined route", () => {
      expect(() => parseRoute("en", undefined as unknown as string)).toThrow(RouteParseError);
      expect(() => parseRoute("en", undefined as unknown as string)).toThrow("Empty route path");
    });

    it("should throw RouteParseError for unknown content type", () => {
      expect(() => parseRoute("en", "unknown-content")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "unknown-content")).toThrow('Unknown content type: "unknown-content"');

      expect(() => parseRoute("es", "contenido-desconocido")).toThrow(RouteParseError);
    });

    it("should throw RouteParseError for too many segments", () => {
      // Valid: books/slug or books/page/2
      // Invalid: books/slug/extra/segments
      expect(() => parseRoute("en", "books/my-book/extra/segments")).toThrow(RouteParseError);
      expect(() => parseRoute("en", "books/my-book/extra/segments")).toThrow(
        "Invalid route structure: too many segments",
      );
    });

    it("should include context in RouteParseError", () => {
      try {
        parseRoute("es", "contenido-invalido");
        expect.fail("Should have thrown RouteParseError");
      } catch (error) {
        expect(error).toBeInstanceOf(RouteParseError);
        const routeError = error as RouteParseError;
        expect(routeError.lang).toBe("es");
        expect(routeError.path).toBe("contenido-invalido");
        expect(routeError.segments).toEqual(["contenido-invalido"]);
      }
    });
  });
});

describe("safeParseRoute()", () => {
  it("should return parsed route for valid input", () => {
    const result = safeParseRoute("en", "books");

    expect(result).not.toBeNull();
    expect(result?.contentTypeId).toBe("books");
    expect(result?.pageType).toBe("list");
  });

  it("should return null for invalid input instead of throwing", () => {
    const result = safeParseRoute("en", "unknown-content");

    expect(result).toBeNull();
  });

  it("should return null for empty route", () => {
    const result = safeParseRoute("en", "");

    expect(result).toBeNull();
  });

  it("should return null for invalid pagination", () => {
    const result = safeParseRoute("en", "authors/page/2");

    expect(result).toBeNull();
  });

  it("should handle all valid routes", () => {
    expect(safeParseRoute("en", "books")).not.toBeNull();
    expect(safeParseRoute("es", "libros/mi-libro")).not.toBeNull();
    expect(safeParseRoute("en", "tutorials/page/2")).not.toBeNull();
    expect(safeParseRoute("es", "tutoriales/rss.xml")).not.toBeNull();
  });
});

describe("buildRoute()", () => {
  describe("list pages", () => {
    it("should build English books list route", () => {
      const route = buildRoute("en", "books", "list");
      expect(route).toBe("books");
    });

    it("should build Spanish books list route", () => {
      const route = buildRoute("es", "books", "list");
      expect(route).toBe("libros");
    });

    it("should build tutorials list routes", () => {
      expect(buildRoute("en", "tutorials", "list")).toBe("tutorials");
      expect(buildRoute("es", "tutorials", "list")).toBe("tutoriales");
    });

    it("should build taxonomy list routes", () => {
      expect(buildRoute("en", "authors", "list")).toBe("authors");
      expect(buildRoute("es", "authors", "list")).toBe("autores");
      expect(buildRoute("en", "publishers", "list")).toBe("publishers");
      expect(buildRoute("es", "publishers", "list")).toBe("editoriales");
    });
  });

  describe("detail pages", () => {
    it("should build English book detail route", () => {
      const route = buildRoute("en", "books", "detail", { slug: "the-stand" });
      expect(route).toBe("books/the-stand");
    });

    it("should build Spanish book detail route", () => {
      const route = buildRoute("es", "books", "detail", { slug: "apocalipsis" });
      expect(route).toBe("libros/apocalipsis");
    });

    it("should throw error if slug is missing for detail page", () => {
      expect(() => buildRoute("en", "books", "detail")).toThrow("Slug required for detail page type");
      expect(() => buildRoute("en", "books", "detail", {})).toThrow("Slug required for detail page type");
    });

    it("should build tutorial detail routes", () => {
      expect(buildRoute("en", "tutorials", "detail", { slug: "how-to" })).toBe("tutorials/how-to");
      expect(buildRoute("es", "tutorials", "detail", { slug: "como-hacer" })).toBe("tutoriales/como-hacer");
    });
  });

  describe("pagination pages", () => {
    it("should build English pagination route", () => {
      const route = buildRoute("en", "books", "pagination", { pageNumber: 2 });
      expect(route).toBe("books/page/2");
    });

    it("should build Spanish pagination route", () => {
      const route = buildRoute("es", "books", "pagination", { pageNumber: 3 });
      expect(route).toBe("libros/pagina/3");
    });

    it("should throw error if pageNumber is missing", () => {
      expect(() => buildRoute("en", "books", "pagination")).toThrow("Page number required for pagination page type");
    });

    it("should throw error for pagination on unsupported content", () => {
      expect(() => buildRoute("en", "authors", "pagination", { pageNumber: 2 })).toThrow(
        "Pagination not enabled for authors",
      );
    });

    it("should build tutorials pagination routes", () => {
      expect(buildRoute("en", "tutorials", "pagination", { pageNumber: 5 })).toBe("tutorials/page/5");
      expect(buildRoute("es", "tutorials", "pagination", { pageNumber: 10 })).toBe("tutoriales/pagina/10");
    });
  });

  describe("RSS feeds", () => {
    it("should build English RSS route", () => {
      const route = buildRoute("en", "books", "rss");
      expect(route).toBe("books/rss.xml");
    });

    it("should build Spanish RSS route", () => {
      const route = buildRoute("es", "books", "rss");
      expect(route).toBe("libros/rss.xml");
    });

    it("should throw error for RSS on unsupported content", () => {
      expect(() => buildRoute("en", "posts", "rss")).toThrow("RSS not enabled for posts");
      expect(() => buildRoute("es", "authors", "rss")).toThrow("RSS not enabled for authors");
    });

    it("should build tutorials RSS routes", () => {
      expect(buildRoute("en", "tutorials", "rss")).toBe("tutorials/rss.xml");
      expect(buildRoute("es", "tutorials", "rss")).toBe("tutoriales/rss.xml");
    });
  });

  describe("error handling", () => {
    it("should throw error for unknown content type", () => {
      expect(() => buildRoute("en", "unknown", "list")).toThrow("Unknown content type: unknown");
    });

    it("should throw error for unsupported page type", () => {
      expect(() => buildRoute("en", "books", "static" as unknown as PageType)).toThrow("Unsupported page type: static");
    });
  });
});

describe("matchRoute()", () => {
  const booksList = parseRoute("en", "books");
  const booksDetail = parseRoute("es", "libros/mi-libro");
  const booksPagination = parseRoute("en", "books/page/2");
  const tutorialsList = parseRoute("es", "tutoriales");

  describe("match by content type", () => {
    it("should match content type", () => {
      expect(matchRoute(booksList, { contentTypeId: "books" })).toBe(true);
      expect(matchRoute(booksDetail, { contentTypeId: "books" })).toBe(true);
      expect(matchRoute(booksPagination, { contentTypeId: "books" })).toBe(true);
    });

    it("should not match different content type", () => {
      expect(matchRoute(tutorialsList, { contentTypeId: "books" })).toBe(false);
      expect(matchRoute(booksList, { contentTypeId: "tutorials" })).toBe(false);
    });
  });

  describe("match by page type", () => {
    it("should match page type", () => {
      expect(matchRoute(booksList, { pageType: "list" })).toBe(true);
      expect(matchRoute(booksDetail, { pageType: "detail" })).toBe(true);
      expect(matchRoute(booksPagination, { pageType: "pagination" })).toBe(true);
    });

    it("should not match different page type", () => {
      expect(matchRoute(booksList, { pageType: "detail" })).toBe(false);
      expect(matchRoute(booksDetail, { pageType: "list" })).toBe(false);
    });
  });

  describe("match by language", () => {
    it("should match language", () => {
      expect(matchRoute(booksList, { lang: "en" })).toBe(true);
      expect(matchRoute(booksDetail, { lang: "es" })).toBe(true);
    });

    it("should not match different language", () => {
      expect(matchRoute(booksList, { lang: "es" })).toBe(false);
      expect(matchRoute(booksDetail, { lang: "en" })).toBe(false);
    });
  });

  describe("match multiple criteria", () => {
    it("should match all criteria (AND logic)", () => {
      expect(matchRoute(booksList, { lang: "en", contentTypeId: "books", pageType: "list" })).toBe(true);
      expect(matchRoute(booksDetail, { lang: "es", contentTypeId: "books", pageType: "detail" })).toBe(true);
    });

    it("should not match if any criterion fails", () => {
      expect(matchRoute(booksList, { lang: "en", contentTypeId: "tutorials" })).toBe(false);
      expect(matchRoute(booksList, { contentTypeId: "books", pageType: "detail" })).toBe(false);
    });
  });

  describe("match with partial criteria", () => {
    it("should match with only one criterion", () => {
      expect(matchRoute(booksList, { contentTypeId: "books" })).toBe(true);
      expect(matchRoute(booksDetail, { pageType: "detail" })).toBe(true);
    });

    it("should match any route if no criteria provided", () => {
      expect(matchRoute(booksList, {})).toBe(true);
      expect(matchRoute(booksDetail, {})).toBe(true);
      expect(matchRoute(tutorialsList, {})).toBe(true);
    });
  });
});

describe("getContentTypeRoutes()", () => {
  it("should return all route patterns for books", () => {
    const enRoutes = getContentTypeRoutes("en", "books");

    expect(enRoutes).toContain("books");
    expect(enRoutes).toContain("books/page/[page]");
    expect(enRoutes).toContain("books/[slug]");
    expect(enRoutes).toContain("books/rss.xml");
    expect(enRoutes.length).toBe(4);
  });

  it("should return Spanish route patterns", () => {
    const esRoutes = getContentTypeRoutes("es", "books");

    expect(esRoutes).toContain("libros");
    expect(esRoutes).toContain("libros/pagina/[page]");
    expect(esRoutes).toContain("libros/[slug]");
    expect(esRoutes).toContain("libros/rss.xml");
  });

  it("should return routes for tutorials", () => {
    const enRoutes = getContentTypeRoutes("en", "tutorials");

    expect(enRoutes).toContain("tutorials");
    expect(enRoutes).toContain("tutorials/page/[page]");
    expect(enRoutes).toContain("tutorials/[slug]");
    expect(enRoutes).toContain("tutorials/rss.xml");
  });

  it("should not include pagination for authors", () => {
    const routes = getContentTypeRoutes("en", "authors");

    expect(routes).toContain("authors");
    expect(routes).toContain("authors/[slug]");
    expect(routes).not.toContain("authors/page/[page]");
    expect(routes.length).toBe(2);
  });

  it("should not include RSS for posts", () => {
    const routes = getContentTypeRoutes("en", "posts");

    expect(routes).toContain("posts");
    expect(routes).toContain("posts/page/[page]");
    expect(routes).toContain("posts/[slug]");
    expect(routes).not.toContain("posts/rss.xml");
  });

  it("should throw error for unknown content type", () => {
    expect(() => getContentTypeRoutes("en", "unknown")).toThrow("Unknown content type: unknown");
  });
});

describe("formatParsedRoute()", () => {
  it("should format list page", () => {
    const parsed = parseRoute("en", "books");
    const formatted = formatParsedRoute(parsed);

    expect(formatted).toBe("[en] books (list)");
  });

  it("should format detail page with slug", () => {
    const parsed = parseRoute("es", "libros/mi-libro");
    const formatted = formatParsedRoute(parsed);

    expect(formatted).toBe('[es] books (detail) slug="mi-libro"');
  });

  it("should format pagination page with page number", () => {
    const parsed = parseRoute("en", "books/page/3");
    const formatted = formatParsedRoute(parsed);

    expect(formatted).toBe("[en] books (pagination) page=3");
  });

  it("should format RSS feed", () => {
    const parsed = parseRoute("es", "tutoriales/rss.xml");
    const formatted = formatParsedRoute(parsed);

    expect(formatted).toBe("[es] tutorials (rss)");
  });

  it("should handle all parts together", () => {
    // This would be an unusual case but should still work
    const parsed = parseRoute("en", "books/my-slug");
    const formatted = formatParsedRoute(parsed);

    expect(formatted).toContain("[en]");
    expect(formatted).toContain("books");
    expect(formatted).toContain("(detail)");
    expect(formatted).toContain('slug="my-slug"');
  });
});

describe("integration: parse and build roundtrip", () => {
  it("should roundtrip list pages", () => {
    const original = "books";
    const parsed = parseRoute("en", original);
    const rebuilt = buildRoute(parsed.lang, parsed.contentTypeId, parsed.pageType);

    expect(rebuilt).toBe(original);
  });

  it("should roundtrip detail pages", () => {
    const original = "libros/mi-libro";
    const parsed = parseRoute("es", original);
    const rebuilt = buildRoute(parsed.lang, parsed.contentTypeId, parsed.pageType, {
      slug: parsed.slug,
    });

    expect(rebuilt).toBe(original);
  });

  it("should roundtrip pagination pages", () => {
    const original = "tutorials/page/5";
    const parsed = parseRoute("en", original);
    const rebuilt = buildRoute(parsed.lang, parsed.contentTypeId, parsed.pageType, {
      pageNumber: parsed.pageNumber,
    });

    expect(rebuilt).toBe(original);
  });

  it("should roundtrip RSS feeds", () => {
    const original = "tutoriales/rss.xml";
    const parsed = parseRoute("es", original);
    const rebuilt = buildRoute(parsed.lang, parsed.contentTypeId, parsed.pageType);

    expect(rebuilt).toBe(original);
  });
});

describe("validateParsedRoute()", () => {
  it("should validate and return correct parsed route", () => {
    const parsed = parseRoute("en", "books");
    const validated = validateParsedRoute(parsed);

    expect(validated.lang).toBe("en");
    expect(validated.contentTypeId).toBe("books");
    expect(validated.pageType).toBe("list");
    expect(validated.segments).toEqual(["books"]);
  });

  it("should validate detail page with slug", () => {
    const parsed = parseRoute("es", "libros/mi-libro");
    const validated = validateParsedRoute(parsed);

    expect(validated.lang).toBe("es");
    expect(validated.contentTypeId).toBe("books");
    expect(validated.pageType).toBe("detail");
    expect(validated.slug).toBe("mi-libro");
  });

  it("should validate pagination page with page number", () => {
    const parsed = parseRoute("en", "books/page/3");
    const validated = validateParsedRoute(parsed);

    expect(validated.lang).toBe("en");
    expect(validated.pageType).toBe("pagination");
    expect(validated.pageNumber).toBe(3);
  });

  it("should throw error for invalid parsed route", () => {
    const invalidParsed = {
      lang: "invalid-lang", // Invalid language
      contentTypeId: "books",
      config: {} as never,
      pageType: "list" as PageType,
      segments: ["books"],
    };

    expect(() => validateParsedRoute(invalidParsed as never)).toThrow(/Parsed route validation failed/);
  });

  it("should throw error with detailed issues", () => {
    const invalidParsed = {
      lang: "en",
      contentTypeId: "books",
      config: {} as never,
      pageType: "pagination" as PageType,
      pageNumber: -1, // Invalid: negative page number
      segments: ["books", "page", "-1"],
    };

    expect(() => validateParsedRoute(invalidParsed as never)).toThrow(/pageNumber/);
  });

  it("should throw error for missing required fields", () => {
    const invalidParsed = {
      lang: "en",
      // Missing contentTypeId
      config: {} as never,
      pageType: "list" as PageType,
      segments: ["books"],
    };

    expect(() => validateParsedRoute(invalidParsed as never)).toThrow(/validation failed/);
  });
});
