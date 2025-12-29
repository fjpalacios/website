/**
 * Unit tests for contentTypeWithPagination route generator
 *
 * Tests cover:
 * - List page generation (page 1)
 * - Pagination pages generation (page 2+)
 * - Detail pages generation
 * - Language handling (ES/EN)
 * - Edge cases (empty content, single item, exact boundaries)
 * - Props validation
 */

import { describe, test, expect, vi, beforeEach } from "vitest";

import { buildCache } from "@/utils/cache/buildCache";
import {
  generateContentTypeWithPaginationRoutes,
  type ContentTypeWithPaginationConfig,
} from "@/utils/routeGenerators/contentTypeWithPagination";

// ============================================================================
// SETUP: Clear cache before each test
// ============================================================================

beforeEach(() => {
  // Clear build cache to avoid interference between tests
  buildCache.clear();
});

// ============================================================================
// MOCK DATA
// ============================================================================

interface MockBook {
  id: string;
  data: {
    title: string;
    post_slug: string;
    excerpt: string;
    language: "es" | "en";
  };
}

const createMockBook = (id: number, lang: "es" | "en" = "es"): MockBook => ({
  id: `book-${id}`,
  data: {
    title: `Book Title ${id}`,
    post_slug: `book-slug-${id}`,
    excerpt: `Excerpt for book ${id}`,
    language: lang,
  },
});

const mockContact = {
  name: "Test User",
  email: "test@example.com",
};

// ============================================================================
// HELPER: Create Config
// ============================================================================

type PartialConfig<T> = Partial<ContentTypeWithPaginationConfig<T>> &
  Pick<ContentTypeWithPaginationConfig<T>, "lang" | "targetLang">;

const createConfig = <T>(overrides: PartialConfig<T>): ContentTypeWithPaginationConfig<T> => {
  return {
    lang: overrides.lang,
    targetLang: overrides.targetLang,
    routeSegment: overrides.routeSegment || "books",
    pageSegment: overrides.pageSegment || "page",
    contentType: overrides.contentType || "books",
    getAllItems: overrides.getAllItems || vi.fn().mockResolvedValue([]),
    itemsPerPage: overrides.itemsPerPage || 10,
    generateDetailPaths: overrides.generateDetailPaths || vi.fn().mockResolvedValue([]),
    contact: overrides.contact || mockContact,
    schemaType: (overrides.schemaType as "Book" | "TechArticle" | "BlogPosting") || "Book",
    extractItemData:
      overrides.extractItemData ||
      ((item: MockBook) => ({
        name: item.data.title,
        slug: item.data.post_slug,
        excerpt: item.data.excerpt,
      })),
  };
};

// ============================================================================
// TEST SUITE: Basic Generation
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Basic Generation", () => {
  test("should generate empty array when no items", async () => {
    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue([]),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // Should still generate list page (page 1) even with no items
    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "es",
      route: "books",
    });
    expect(paths[0].props).toMatchObject({
      contentType: "books",
      pageType: "list",
      lang: "es",
      currentPage: 1,
      totalPages: 0,
      hasTargetContent: false,
    });
    expect(paths[0].props.books).toEqual([]);
  });

  test("should generate list page for single item (no pagination)", async () => {
    const mockBooks = [createMockBook(1, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([
        {
          slug: "book-slug-1",
          props: { book: mockBooks[0] },
        },
      ]),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 1 list page + 1 detail page = 2 total (no pagination pages)
    expect(paths).toHaveLength(2);

    const listPage = paths[0];
    expect(listPage.params).toEqual({
      lang: "es",
      route: "books",
    });
    expect(listPage.props).toMatchObject({
      contentType: "books",
      pageType: "list",
      lang: "es",
      currentPage: 1,
      totalPages: 1, // Only 1 page needed
    });
    expect(listPage.props.books).toHaveLength(1);
  });

  test("should generate list page for exactly 10 items (no pagination)", async () => {
    const mockBooks = Array.from({ length: 10 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `book-slug-${i + 1}`,
          props: { book },
        })),
      ),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 1 list page + 10 detail pages = 11 total (no page 2)
    expect(paths).toHaveLength(11);

    const listPage = paths[0];
    expect(listPage.props).toMatchObject({
      currentPage: 1,
      totalPages: 1, // Exactly 10 items = 1 page
    });
    expect(listPage.props.books).toHaveLength(10);

    // No pagination pages should exist
    const paginationPages = paths.filter((p) => p.props.pageType === "pagination");
    expect(paginationPages).toHaveLength(0);
  });

  test("should generate pagination for 11 items (2 pages)", async () => {
    const mockBooks = Array.from({ length: 11 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `book-slug-${i + 1}`,
          props: { book },
        })),
      ),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 1 list page + 1 pagination page (page 2) + 11 detail pages = 13 total
    expect(paths).toHaveLength(13);

    // List page (page 1)
    const listPage = paths[0];
    expect(listPage.params).toEqual({ lang: "es", route: "books" });
    expect(listPage.props).toMatchObject({
      pageType: "list",
      currentPage: 1,
      totalPages: 2,
    });
    expect(listPage.props.books).toHaveLength(10); // First 10 items

    // Pagination page (page 2)
    const page2 = paths[1];
    expect(page2.params).toEqual({ lang: "es", route: "books/page/2" });
    expect(page2.props).toMatchObject({
      pageType: "pagination",
      currentPage: 2,
      totalPages: 2,
    });
    expect(page2.props.books).toHaveLength(1); // Last item

    // Detail pages
    const detailPages = paths.slice(2);
    expect(detailPages).toHaveLength(11);
    expect(detailPages.every((p) => p.props.pageType === "detail")).toBe(true);
  });

  test("should generate multiple pagination pages for 25 items (3 pages)", async () => {
    const mockBooks = Array.from({ length: 25 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `book-slug-${i + 1}`,
          props: { book },
        })),
      ),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 1 list page + 2 pagination pages (pages 2-3) + 25 detail pages = 28 total
    expect(paths).toHaveLength(28);

    const listPage = paths[0];
    expect(listPage.props.totalPages).toBe(3);

    const page2 = paths[1];
    expect(page2.params.route).toBe("books/page/2");
    expect(page2.props.currentPage).toBe(2);
    expect(page2.props.books).toHaveLength(10);

    const page3 = paths[2];
    expect(page3.params.route).toBe("books/page/3");
    expect(page3.props.currentPage).toBe(3);
    expect(page3.props.books).toHaveLength(5); // Last 5 items
  });
});

// ============================================================================
// TEST SUITE: Language Handling
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Language Handling", () => {
  test("should generate Spanish routes with correct segments", async () => {
    const mockBooks = Array.from({ length: 3 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros", // Spanish route
      pageSegment: "pagina", // Spanish page segment
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `libro-slug-${i + 1}`,
          props: { book },
        })),
      ),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths[0].params).toEqual({
      lang: "es",
      route: "libros", // Spanish route
    });
    expect(paths[0].props.lang).toBe("es");

    // Detail pages should use Spanish route segment
    const detailPage = paths.find((p) => p.props.pageType === "detail");
    expect(detailPage?.params.route).toMatch(/^libros\//);
  });

  test("should generate English routes with correct segments", async () => {
    const mockBooks = Array.from({ length: 3 }, (_, i) => createMockBook(i + 1, "en"));

    const config = createConfig<MockBook>({
      lang: "en",
      targetLang: "es",
      routeSegment: "books", // English route
      pageSegment: "page", // English page segment
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `book-slug-${i + 1}`,
          props: { book },
        })),
      ),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths[0].params).toEqual({
      lang: "en",
      route: "books", // English route
    });
    expect(paths[0].props.lang).toBe("en");
  });

  test("should set hasTargetContent=true when target language has content", async () => {
    const mockBooksES = [createMockBook(1, "es")];
    const mockBooksEN = [createMockBook(1, "en")];

    const getAllItemsMock = vi.fn().mockImplementation((lang: string) => {
      return lang === "es" ? Promise.resolve(mockBooksES) : Promise.resolve(mockBooksEN);
    });

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: getAllItemsMock,
      generateDetailPaths: vi.fn().mockResolvedValue([]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths[0].props.hasTargetContent).toBe(true);
    expect(getAllItemsMock).toHaveBeenCalledWith("es");
    expect(getAllItemsMock).toHaveBeenCalledWith("en");
  });

  test("should set hasTargetContent=false when target language has no content", async () => {
    const mockBooksES = [createMockBook(1, "es")];

    const getAllItemsMock = vi.fn().mockImplementation((lang: string) => {
      return lang === "es" ? Promise.resolve(mockBooksES) : Promise.resolve([]);
    });

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: getAllItemsMock,
      generateDetailPaths: vi.fn().mockResolvedValue([]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths[0].props.hasTargetContent).toBe(false);
  });
});

// ============================================================================
// TEST SUITE: Detail Pages
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Detail Pages", () => {
  test("should generate detail pages with correct routes", async () => {
    const mockBooks = [createMockBook(1, "es"), createMockBook(2, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([
        { slug: "el-hobbit", props: { book: mockBooks[0], title: "El Hobbit" } },
        { slug: "1984", props: { book: mockBooks[1], title: "1984" } },
      ]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    const detailPages = paths.filter((p) => p.props.pageType === "detail");
    expect(detailPages).toHaveLength(2);

    expect(detailPages[0].params).toEqual({
      lang: "es",
      route: "libros/el-hobbit",
    });
    expect(detailPages[0].props).toMatchObject({
      contentType: "books",
      pageType: "detail",
      lang: "es",
      title: "El Hobbit",
      hasTargetContent: true, // Mock returns true by default
    });

    expect(detailPages[1].params).toEqual({
      lang: "es",
      route: "libros/1984",
    });
  });

  test("should merge detail page props correctly", async () => {
    const mockBook = createMockBook(1, "es");

    const detailProps = {
      book: mockBook,
      title: "Test Book",
      author: "Test Author",
      customField: "Custom Value",
    };

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue([mockBook]),
      generateDetailPaths: vi.fn().mockResolvedValue([
        {
          slug: "test-book",
          props: detailProps,
        },
      ]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const detailPage = paths.find((p) => p.props.pageType === "detail");

    expect(detailPage?.props).toMatchObject({
      contentType: "books",
      pageType: "detail",
      lang: "es",
      hasTargetContent: true, // Mock returns true by default
      ...detailProps, // All detail props should be merged
    });
  });
});

// ============================================================================
// TEST SUITE: Props Validation
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Props Validation", () => {
  test("list page should have all required props", async () => {
    const mockBooks = [createMockBook(1, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      contact: mockContact,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const listPage = paths[0];

    expect(listPage.props).toHaveProperty("contentType", "books");
    expect(listPage.props).toHaveProperty("pageType", "list");
    expect(listPage.props).toHaveProperty("lang", "es");
    expect(listPage.props).toHaveProperty("books");
    expect(listPage.props).toHaveProperty("currentPage", 1);
    expect(listPage.props).toHaveProperty("totalPages");
    expect(listPage.props).toHaveProperty("itemListSchema");
    expect(listPage.props).toHaveProperty("contact", mockContact);
    expect(listPage.props).toHaveProperty("hasTargetContent");
  });

  test("pagination page should have all required props", async () => {
    const mockBooks = Array.from({ length: 11 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      contact: mockContact,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const page2 = paths[1];

    expect(page2.props).toHaveProperty("contentType", "books");
    expect(page2.props).toHaveProperty("pageType", "pagination");
    expect(page2.props).toHaveProperty("lang", "es");
    expect(page2.props).toHaveProperty("books");
    expect(page2.props).toHaveProperty("currentPage", 2);
    expect(page2.props).toHaveProperty("totalPages", 2);
    expect(page2.props).toHaveProperty("contact", mockContact);
    expect(page2.props).toHaveProperty("hasTargetContent");

    // Pagination pages should NOT have itemListSchema
    expect(page2.props).not.toHaveProperty("itemListSchema");
  });

  test("detail page should have all required props", async () => {
    const mockBook = createMockBook(1, "es");

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      contentType: "books",
      getAllItems: vi.fn().mockResolvedValue([mockBook]),
      generateDetailPaths: vi.fn().mockResolvedValue([
        {
          slug: "test-book",
          props: { book: mockBook },
        },
      ]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const detailPage = paths.find((p) => p.props.pageType === "detail");

    expect(detailPage?.props).toHaveProperty("contentType", "books");
    expect(detailPage?.props).toHaveProperty("pageType", "detail");
    expect(detailPage?.props).toHaveProperty("lang", "es");
    expect(detailPage?.props).toHaveProperty("hasTargetContent");
    expect(detailPage?.props).toHaveProperty("book");
  });

  test("should use dynamic content type key in props", async () => {
    const mockTutorials = [createMockBook(1, "es")]; // Reusing MockBook structure

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      contentType: "tutorials", // Different content type
      routeSegment: "tutoriales",
      getAllItems: vi.fn().mockResolvedValue(mockTutorials),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const listPage = paths[0];

    // Should use "tutorials" key, not "books"
    expect(listPage.props).toHaveProperty("tutorials");
    expect(listPage.props).not.toHaveProperty("books");
    expect(listPage.props.contentType).toBe("tutorials");
  });
});

// ============================================================================
// TEST SUITE: Schema Generation
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Schema Generation", () => {
  test("should generate itemListSchema for list page", async () => {
    const mockBooks = [createMockBook(1, "es"), createMockBook(2, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      schemaType: "Book",
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const listPage = paths[0];

    expect(listPage.props.itemListSchema).toBeDefined();
    expect(typeof listPage.props.itemListSchema).toBe("object");

    // Schema should contain ItemList structure
    const schema = listPage.props.itemListSchema as Record<string, unknown>;
    expect(schema["@type"]).toBe("ItemList");
    expect(schema).toHaveProperty("itemListElement");
    expect(Array.isArray(schema.itemListElement)).toBe(true);
  });

  test("should use correct schema type for tutorials", async () => {
    const mockTutorials = [createMockBook(1, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      contentType: "tutorials",
      routeSegment: "tutoriales",
      getAllItems: vi.fn().mockResolvedValue(mockTutorials),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      schemaType: "TechArticle",
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);
    const listPage = paths[0];

    const schema = listPage.props.itemListSchema as Record<string, unknown>;
    expect(schema).toBeDefined();
    expect(schema["@type"]).toBe("ItemList");
    // Schema should be generated (actual content verification done in schema tests)
  });

  test("should call extractItemData for each item in schema", async () => {
    const mockBooks = [createMockBook(1, "es"), createMockBook(2, "es")];

    const extractItemDataMock = vi.fn((item: MockBook) => ({
      name: item.data.title,
      slug: item.data.post_slug,
      excerpt: item.data.excerpt,
    }));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      extractItemData: extractItemDataMock,
    });

    await generateContentTypeWithPaginationRoutes(config);

    expect(extractItemDataMock).toHaveBeenCalledTimes(2);
    expect(extractItemDataMock).toHaveBeenCalledWith(mockBooks[0]);
    expect(extractItemDataMock).toHaveBeenCalledWith(mockBooks[1]);
  });
});

// ============================================================================
// TEST SUITE: Edge Cases
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Edge Cases", () => {
  test("should handle custom itemsPerPage value", async () => {
    const mockBooks = Array.from({ length: 7 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      itemsPerPage: 5, // Custom value
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 5 per page: page 1 (5 items), page 2 (2 items) = 2 pages total
    const listPage = paths[0];
    expect(listPage.props.totalPages).toBe(2);
    expect(listPage.props.books).toHaveLength(5);

    const page2 = paths[1];
    expect(page2.props.books).toHaveLength(2);
  });

  test("should handle exactly 20 items with itemsPerPage=10 (2 full pages)", async () => {
    const mockBooks = Array.from({ length: 20 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    const listPage = paths[0];
    expect(listPage.props.totalPages).toBe(2);
    expect(listPage.props.books).toHaveLength(10);

    const page2 = paths[1];
    expect(page2.props.books).toHaveLength(10); // Exactly full page
  });

  test("should handle 21 items (2 full pages + 1 item on page 3)", async () => {
    const mockBooks = Array.from({ length: 21 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
      itemsPerPage: 10,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths[0].props.totalPages).toBe(3);
    expect(paths[0].props.books).toHaveLength(10); // Page 1
    expect(paths[1].props.books).toHaveLength(10); // Page 2
    expect(paths[2].props.books).toHaveLength(1); // Page 3 - only 1 item
  });

  test("should handle getAllItems returning empty array", async () => {
    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue([]),
      generateDetailPaths: vi.fn().mockResolvedValue([]),
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    expect(paths).toHaveLength(1); // Only list page
    expect(paths[0].props.books).toEqual([]);
    expect(paths[0].props.totalPages).toBe(0);
  });

  test("should handle generateDetailPaths returning empty array", async () => {
    const mockBooks = [createMockBook(1, "es")];

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([]), // No detail pages
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // Only list page, no detail pages
    expect(paths).toHaveLength(1);
    expect(paths[0].props.pageType).toBe("list");
  });

  test("should pass contact to all page types", async () => {
    const customContact = { name: "Custom", email: "custom@test.com" };
    const mockBooks = Array.from({ length: 11 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      getAllItems: vi.fn().mockResolvedValue(mockBooks),
      generateDetailPaths: vi.fn().mockResolvedValue([{ slug: "test", props: { book: mockBooks[0] } }]),
      contact: customContact,
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // Check list page
    expect(paths[0].props.contact).toEqual(customContact);

    // Check pagination page
    expect(paths[1].props.contact).toEqual(customContact);

    // Check detail page
    const detailPage = paths.find((p) => p.props.pageType === "detail");
    expect(detailPage?.props.contact).toBeUndefined(); // Contact not passed to detail pages
  });
});

// ============================================================================
// TEST SUITE: Integration
// ============================================================================

describe("generateContentTypeWithPaginationRoutes - Integration", () => {
  test("should generate complete route structure for realistic scenario", async () => {
    // Realistic scenario: 35 books, 10 per page = 4 pages
    const mockBooks = Array.from({ length: 35 }, (_, i) => createMockBook(i + 1, "es"));

    const config = createConfig<MockBook>({
      lang: "es",
      targetLang: "en",
      routeSegment: "libros",
      pageSegment: "pagina",
      contentType: "books",
      getAllItems: vi
        .fn()
        .mockImplementation((lang: string) =>
          lang === "es" ? Promise.resolve(mockBooks) : Promise.resolve([createMockBook(1, "en")]),
        ),
      generateDetailPaths: vi.fn().mockResolvedValue(
        mockBooks.map((book, i) => ({
          slug: `libro-${i + 1}`,
          props: { book },
        })),
      ),
      itemsPerPage: 10,
      contact: mockContact,
      schemaType: "Book",
    });

    const paths = await generateContentTypeWithPaginationRoutes(config);

    // 1 list page + 3 pagination pages (pages 2-4) + 35 detail pages = 39 total
    expect(paths).toHaveLength(39);

    // Verify list page
    const listPage = paths[0];
    expect(listPage.params).toEqual({ lang: "es", route: "libros" });
    expect(listPage.props).toMatchObject({
      contentType: "books",
      pageType: "list",
      currentPage: 1,
      totalPages: 4,
      hasTargetContent: true, // EN has 1 book
    });
    expect(listPage.props.books).toHaveLength(10);

    // Verify pagination pages
    const page2 = paths[1];
    expect(page2.params.route).toBe("libros/pagina/2");
    expect(page2.props.currentPage).toBe(2);

    const page3 = paths[2];
    expect(page3.params.route).toBe("libros/pagina/3");

    const page4 = paths[3];
    expect(page4.params.route).toBe("libros/pagina/4");
    expect(page4.props.books).toHaveLength(5); // Last page: only 5 items

    // Verify detail pages
    const detailPages = paths.slice(4);
    expect(detailPages).toHaveLength(35);
    expect(detailPages.every((p) => p.props.pageType === "detail")).toBe(true);
    expect(detailPages.every((p) => p.params.route.startsWith("libros/"))).toBe(true);
  });
});
