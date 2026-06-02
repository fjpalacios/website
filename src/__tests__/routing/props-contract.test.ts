/**
 * Props contract tests for route generators
 *
 * The 404 "Template Not Found" bug (Astro 6.4.2 regression) rendered the
 * unified router with empty props {}, giving contentType="" and pageType="".
 *
 * These tests assert that every path returned by our generators always carries
 * non-empty contentType and pageType in props, and has lang + route in params.
 * They guard against regressions in our own generators; they won't catch a
 * framework-level dev-server bug but will fail if props are stripped at the
 * generator layer.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";

import { createMockBook, createMockContact } from "@/__tests__/__helpers__";
import { buildCache } from "@/utils/cache/buildCache";
import { generateContentTypeWithPaginationRoutes } from "@/utils/routeGenerators/contentTypeWithPagination";
import { generateStaticPageRoute } from "@/utils/routeGenerators/staticPage";

beforeEach(() => {
  buildCache.clear();
});

// ============================================================================
// CONTRACT: every path must satisfy these invariants
// ============================================================================

function assertPropsContract(paths: { params: Record<string, unknown>; props: Record<string, unknown> }[]) {
  for (const path of paths) {
    expect(path.params.lang, "params.lang must be set").toBeTruthy();
    expect(path.params.route !== undefined, "params.route must be present").toBe(true);

    expect(path.props.contentType, "props.contentType must not be empty").toBeTruthy();
    expect(path.props.pageType, "props.pageType must not be empty").toBeTruthy();
    expect(path.props.lang, "props.lang must match params.lang").toBe(path.params.lang);
  }
}

// ============================================================================
// generateStaticPageRoute
// ============================================================================

describe("generateStaticPageRoute — props contract", () => {
  test("about page has contentType and pageType", () => {
    const paths = generateStaticPageRoute({
      lang: "es",
      routeSegment: "acerca-de",
      contentType: "about",
      contact: createMockContact(),
      content: { title: "Acerca de" },
    });

    assertPropsContract(paths);
    expect(paths[0].props.contentType).toBe("about");
    expect(paths[0].props.pageType).toBe("static");
  });

  test("feeds page has contentType and pageType", () => {
    const paths = generateStaticPageRoute({
      lang: "en",
      routeSegment: "feeds",
      contentType: "feeds",
      contact: createMockContact(),
    });

    assertPropsContract(paths);
    expect(paths[0].props.contentType).toBe("feeds");
    expect(paths[0].props.pageType).toBe("static");
  });
});

// ============================================================================
// generateContentTypeWithPaginationRoutes
// ============================================================================

describe("generateContentTypeWithPaginationRoutes — props contract", () => {
  const contact = createMockContact();

  test("list page props are complete", async () => {
    const paths = await generateContentTypeWithPaginationRoutes({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      pageSegment: "pagina",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue([createMockBook(1, "es")]),
      itemsPerPage: 10,
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      contact,
      schemaType: "Book",
      extractItemData: (item: ReturnType<typeof createMockBook>) => ({
        name: item.data.title,
        slug: item.data.post_slug,
        excerpt: item.data.excerpt,
      }),
    });

    assertPropsContract(paths);
  });

  test("pagination pages props are complete", async () => {
    const books = Array.from({ length: 12 }, (_, i) => createMockBook(i + 1, "es"));

    const paths = await generateContentTypeWithPaginationRoutes({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      pageSegment: "pagina",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue(books),
      itemsPerPage: 10,
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      contact,
      schemaType: "Book",
      extractItemData: (item: ReturnType<typeof createMockBook>) => ({
        name: item.data.title,
        slug: item.data.post_slug,
        excerpt: item.data.excerpt,
      }),
    });

    assertPropsContract(paths);
    const paginationPages = paths.filter((p) => p.props.pageType === "pagination");
    expect(paginationPages.length).toBeGreaterThan(0);
  });

  test("detail pages props are complete", async () => {
    const book = createMockBook(1, "es");

    const paths = await generateContentTypeWithPaginationRoutes({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      pageSegment: "pagina",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue([book]),
      itemsPerPage: 10,
      generateDetailPaths: vi.fn().mockResolvedValue([{ slug: "el-libro", props: { book } }]),
      contact,
      schemaType: "Book",
      extractItemData: (item: ReturnType<typeof createMockBook>) => ({
        name: item.data.title,
        slug: item.data.post_slug,
        excerpt: item.data.excerpt,
      }),
    });

    assertPropsContract(paths);
    const detailPages = paths.filter((p) => p.props.pageType === "detail");
    expect(detailPages.length).toBe(1);
  });

  test("EN routes have correct lang in props", async () => {
    const paths = await generateContentTypeWithPaginationRoutes({
      lang: "en",
      targetLang: "es",
      routeSegment: "tutorials",
      pageSegment: "page",
      contentType: "tutorials",
      getAllItems: vi.fn().mockResolvedValue([createMockBook(1, "en")]),
      itemsPerPage: 10,
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      contact,
      schemaType: "TechArticle",
      extractItemData: (item: ReturnType<typeof createMockBook>) => ({
        name: item.data.title,
        slug: item.data.post_slug,
        excerpt: item.data.excerpt,
      }),
    });

    assertPropsContract(paths);
    expect(paths.every((p) => p.props.lang === "en")).toBe(true);
  });
});
