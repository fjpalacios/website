/**
 * Tests for taxonomy.ts route generator
 *
 * Tests the generation of routes for taxonomy pages (authors, publishers, genres, etc.)
 * Covers list pages and detail pages with pagination for related content
 */

import { describe, test, expect, vi, beforeEach } from "vitest";

import { generateTaxonomyRoutes, type TaxonomyGeneratorConfig } from "@/utils/routeGenerators/taxonomy";
import type { TaxonomyConfig } from "@/utils/taxonomyPages";
// Import mocked functions for typing
import { getTaxonomyItemsWithCount, hasTargetContent, generateTaxonomyDetailPaths } from "@/utils/taxonomyPages";

// ============================================================================
// MOCKS
// ============================================================================

// Mock the taxonomyPages module functions
vi.mock("@/utils/taxonomyPages", () => ({
  getTaxonomyItemsWithCount: vi.fn(),
  hasTargetContent: vi.fn(),
  generateTaxonomyDetailPaths: vi.fn(),
}));

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

interface MockTaxonomyItem {
  id: string;
  slug: string;
  data: {
    name: string;
    description?: string;
  };
}

interface MockItemWithCount {
  item: MockTaxonomyItem;
  count: number;
}

/**
 * Create a mock taxonomy item
 */
function createMockTaxonomyItem(id: number, lang: string): MockTaxonomyItem {
  return {
    id: `item-${id}`,
    slug: `item-${id}-slug`,
    data: {
      name: `Item ${id} (${lang})`,
      description: `Description for item ${id}`,
    },
  };
}

/**
 * Create a mock item with count
 */
function createMockItemWithCount(id: number, lang: string, count: number): MockItemWithCount {
  return {
    item: createMockTaxonomyItem(id, lang),
    count,
  };
}

/**
 * Create a mock taxonomy config
 */
function createMockTaxonomyConfig(): TaxonomyConfig {
  return {
    collectionKey: "authors",
    routeSegment: { es: "autores", en: "authors" },
    contentCollectionKey: "books",
    taxonomyField: "author",
    itemsPerPage: 10,
    propsKeys: {
      items: "authorsWithCounts",
      item: "author",
      content: "books",
    },
  } as TaxonomyConfig;
}

/**
 * Create a full config object for testing
 */
function createConfig(overrides: Partial<TaxonomyGeneratorConfig> = {}): TaxonomyGeneratorConfig {
  return {
    taxonomyConfig: createMockTaxonomyConfig(),
    lang: "es",
    targetLang: "en",
    routeSegment: "autores",
    contentType: "authors",
    contact: { name: "Test Contact", email: "test@example.com" },
    itemsPropsKey: "authorsWithCounts",
    ...overrides,
  };
}

// ============================================================================
// TEST SUITE: Basic Generation
// ============================================================================

describe("generateTaxonomyRoutes - Basic Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should generate empty array when no items with content", async () => {
    const mockItems: MockItemWithCount[] = [];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    // Should have only list page (no detail pages since no items)
    expect(paths).toHaveLength(1);
    expect(paths[0].props.pageType).toBe("list");
    expect(paths[0].props.itemsWithContent).toEqual([]);
  });

  test("should generate list page for items with content", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5), createMockItemWithCount(2, "es", 3)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths).toHaveLength(1); // Only list page
    expect(paths[0].params).toEqual({
      lang: "es",
      route: "autores",
    });
    expect(paths[0].props).toMatchObject({
      contentType: "authors",
      pageType: "list",
      lang: "es",
      hasTargetContent: false,
    });
    expect(paths[0].props.itemsWithContent).toHaveLength(2);
  });

  test("should filter out items with count = 0", async () => {
    const mockItems: MockItemWithCount[] = [
      createMockItemWithCount(1, "es", 5),
      createMockItemWithCount(2, "es", 0), // Should be filtered
      createMockItemWithCount(3, "es", 3),
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const listPage = paths[0];
    expect((listPage.props.itemsWithContent as MockItemWithCount[]).length).toBe(2);
    expect(listPage.props.itemsWithContent as MockItemWithCount[]).not.toContainEqual(
      expect.objectContaining({ count: 0 }),
    );
  });

  test("should sort items alphabetically by name", async () => {
    const mockItems: MockItemWithCount[] = [
      { item: { ...createMockTaxonomyItem(1, "es"), data: { name: "Zebra" } }, count: 5 },
      { item: { ...createMockTaxonomyItem(2, "es"), data: { name: "Apple" } }, count: 3 },
      { item: { ...createMockTaxonomyItem(3, "es"), data: { name: "Mango" } }, count: 2 },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const listPage = paths[0];
    const items = listPage.props.itemsWithContent as MockItemWithCount[];

    expect(items[0].item.data.name).toBe("Apple");
    expect(items[1].item.data.name).toBe("Mango");
    expect(items[2].item.data.name).toBe("Zebra");
  });
});

// ============================================================================
// TEST SUITE: Detail Pages
// ============================================================================

describe("generateTaxonomyRoutes - Detail Pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should generate detail pages with correct routes", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    const mockDetailPaths = [
      {
        slug: "stephen-king",
        props: { title: "Stephen King", author: { id: "stephen-king" } },
      },
      {
        slug: "george-orwell",
        props: { title: "George Orwell", author: { id: "george-orwell" } },
      },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue(mockDetailPaths);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    // Should have 1 list page + 2 detail pages = 3 total
    expect(paths).toHaveLength(3);

    const detailPages = paths.filter((p) => p.props.pageType === "detail");
    expect(detailPages).toHaveLength(2);

    expect(detailPages[0].params).toEqual({
      lang: "es",
      route: "autores/stephen-king",
    });

    expect(detailPages[1].params).toEqual({
      lang: "es",
      route: "autores/george-orwell",
    });
  });

  test("should merge detail props with taxonomy items", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5), createMockItemWithCount(2, "es", 3)];

    const mockDetailPaths = [
      {
        slug: "test-author",
        props: {
          title: "Test Author",
          author: { id: "test-author" },
          customField: "Custom Value",
        },
      },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue(mockDetailPaths);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const detailPage = paths.find((p) => p.props.pageType === "detail");

    expect(detailPage?.props).toMatchObject({
      contentType: "authors",
      pageType: "detail",
      title: "Test Author",
      customField: "Custom Value",
      authorsWithCounts: mockItems, // Should include taxonomy items for sidebar
    });
  });

  test("should use correct itemsPropsKey for taxonomy items", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    const mockDetailPaths = [
      {
        slug: "test-publisher",
        props: { title: "Test Publisher" },
      },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue(mockDetailPaths);

    const config = createConfig({
      contentType: "publishers",
      itemsPropsKey: "publishersWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);
    const detailPage = paths.find((p) => p.props.pageType === "detail");

    expect(detailPage?.props).toHaveProperty("publishersWithCounts");
    expect(detailPage?.props.publishersWithCounts).toEqual(mockItems);
  });
});

// ============================================================================
// TEST SUITE: Language Handling
// ============================================================================

describe("generateTaxonomyRoutes - Language Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should generate Spanish routes with correct segments", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      lang: "es",
      routeSegment: "autores",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].params).toEqual({
      lang: "es",
      route: "autores",
    });
    expect(paths[0].props.lang).toBe("es");
  });

  test("should generate English routes with correct segments", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "en", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      routeSegment: "authors",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].params).toEqual({
      lang: "en",
      route: "authors",
    });
    expect(paths[0].props.lang).toBe("en");
  });

  test("should set hasTargetContent=true when target language has content", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(true);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.hasTargetContent).toBe(true);
  });

  test("should set hasTargetContent=false when target language has no content", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.hasTargetContent).toBe(false);
  });
});

// ============================================================================
// TEST SUITE: Props Validation
// ============================================================================

describe("generateTaxonomyRoutes - Props Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("list page should have all required props", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const listPage = paths[0];

    expect(listPage.props).toHaveProperty("contentType");
    expect(listPage.props).toHaveProperty("pageType");
    expect(listPage.props).toHaveProperty("lang");
    expect(listPage.props).toHaveProperty("itemsWithContent");
    expect(listPage.props).toHaveProperty("contact");
    expect(listPage.props).toHaveProperty("hasTargetContent");
  });

  test("detail page should have all required props", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    const mockDetailPaths = [
      {
        slug: "test-author",
        props: { title: "Test Author", author: { id: "test-author" } },
      },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue(mockDetailPaths);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const detailPage = paths.find((p) => p.props.pageType === "detail");

    expect(detailPage?.props).toHaveProperty("contentType");
    expect(detailPage?.props).toHaveProperty("pageType");
    expect(detailPage?.props).toHaveProperty("title");
    expect(detailPage?.props).toHaveProperty("author");
    expect(detailPage?.props).toHaveProperty("authorsWithCounts"); // Taxonomy items for sidebar
  });

  test("should pass contact to list page", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];
    const mockContact = { name: "Custom Contact", email: "custom@example.com" };

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({ contact: mockContact });
    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contact).toEqual(mockContact);
  });
});

// ============================================================================
// TEST SUITE: Taxonomy Types
// ============================================================================

describe("generateTaxonomyRoutes - Taxonomy Types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should work with authors taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 5)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "authors",
      routeSegment: "autores",
      itemsPropsKey: "authorsWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("authors");
  });

  test("should work with publishers taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 3)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "publishers",
      routeSegment: "editoriales",
      itemsPropsKey: "publishersWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("publishers");
  });

  test("should work with categories taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 10)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "categories",
      routeSegment: "categorias",
      itemsPropsKey: "categoriesWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("categories");
  });

  test("should work with genres taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 7)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "genres",
      routeSegment: "generos",
      itemsPropsKey: "genresWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("genres");
  });

  test("should work with series taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 4)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "series",
      routeSegment: "series",
      itemsPropsKey: "seriesWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("series");
  });

  test("should work with challenges taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 2)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "challenges",
      routeSegment: "retos",
      itemsPropsKey: "challengesWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("challenges");
  });

  test("should work with courses taxonomy", async () => {
    const mockItems: MockItemWithCount[] = [createMockItemWithCount(1, "es", 6)];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig({
      contentType: "courses",
      routeSegment: "cursos",
      itemsPropsKey: "coursesWithCounts",
    });

    const paths = await generateTaxonomyRoutes(config);

    expect(paths[0].props.contentType).toBe("courses");
  });
});

// ============================================================================
// TEST SUITE: Edge Cases
// ============================================================================

describe("generateTaxonomyRoutes - Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should handle empty taxonomy gracefully", async () => {
    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue([]);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths).toHaveLength(1); // Only list page
    expect(paths[0].props.itemsWithContent).toEqual([]);
  });

  test("should handle taxonomy with all zero-count items", async () => {
    const mockItems: MockItemWithCount[] = [
      createMockItemWithCount(1, "es", 0),
      createMockItemWithCount(2, "es", 0),
      createMockItemWithCount(3, "es", 0),
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths).toHaveLength(1); // Only list page
    expect(paths[0].props.itemsWithContent).toEqual([]); // All filtered out
  });

  test("should handle large number of items", async () => {
    const mockItems: MockItemWithCount[] = Array.from({ length: 100 }, (_, i) =>
      createMockItemWithCount(i + 1, "es", i + 1),
    );

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    expect(paths).toHaveLength(1); // Only list page
    expect((paths[0].props.itemsWithContent as MockItemWithCount[]).length).toBe(100);
  });

  test("should handle items with special characters in names", async () => {
    const mockItems: MockItemWithCount[] = [
      {
        item: {
          ...createMockTaxonomyItem(1, "es"),
          data: { name: "Björk & The Icelandics" },
        },
        count: 5,
      },
      {
        item: {
          ...createMockTaxonomyItem(2, "es"),
          data: { name: "Ñoño's Books™" },
        },
        count: 3,
      },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(false);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue([]);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    const items = paths[0].props.itemsWithContent as MockItemWithCount[];
    expect(items[0].item.data.name).toBe("Björk & The Icelandics");
    expect(items[1].item.data.name).toBe("Ñoño's Books™");
  });
});

// ============================================================================
// TEST SUITE: Integration
// ============================================================================

describe("generateTaxonomyRoutes - Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should generate complete route structure for realistic scenario", async () => {
    // Realistic scenario: 5 authors with content, 2 without content
    const mockItems: MockItemWithCount[] = [
      { item: { ...createMockTaxonomyItem(1, "es"), data: { name: "Stephen King" } }, count: 12 },
      { item: { ...createMockTaxonomyItem(2, "es"), data: { name: "George Orwell" } }, count: 5 },
      { item: { ...createMockTaxonomyItem(3, "es"), data: { name: "J.K. Rowling" } }, count: 7 },
      { item: { ...createMockTaxonomyItem(4, "es"), data: { name: "Unknown Author" } }, count: 0 }, // Filtered
      { item: { ...createMockTaxonomyItem(5, "es"), data: { name: "Agatha Christie" } }, count: 15 },
      { item: { ...createMockTaxonomyItem(6, "es"), data: { name: "No Books Author" } }, count: 0 }, // Filtered
      { item: { ...createMockTaxonomyItem(7, "es"), data: { name: "Isaac Asimov" } }, count: 8 },
    ];

    const mockDetailPaths = [
      { slug: "stephen-king", props: { title: "Stephen King", author: { id: "stephen-king" } } },
      { slug: "george-orwell", props: { title: "George Orwell", author: { id: "george-orwell" } } },
      { slug: "jk-rowling", props: { title: "J.K. Rowling", author: { id: "jk-rowling" } } },
      { slug: "agatha-christie", props: { title: "Agatha Christie", author: { id: "agatha-christie" } } },
      { slug: "isaac-asimov", props: { title: "Isaac Asimov", author: { id: "isaac-asimov" } } },
    ];

    vi.mocked(getTaxonomyItemsWithCount).mockResolvedValue(mockItems);
    vi.mocked(hasTargetContent).mockResolvedValue(true);
    vi.mocked(generateTaxonomyDetailPaths).mockResolvedValue(mockDetailPaths);

    const config = createConfig();
    const paths = await generateTaxonomyRoutes(config);

    // 1 list page + 5 detail pages = 6 total
    expect(paths).toHaveLength(6);

    // Verify list page
    const listPage = paths[0];
    expect(listPage.params.route).toBe("autores");
    expect(listPage.props.pageType).toBe("list");
    expect((listPage.props.itemsWithContent as MockItemWithCount[]).length).toBe(5); // 2 filtered out

    // Verify detail pages
    const detailPages = paths.filter((p) => p.props.pageType === "detail");
    expect(detailPages).toHaveLength(5);

    // Verify sorting (Agatha Christie should be first alphabetically)
    const items = listPage.props.itemsWithContent as MockItemWithCount[];
    expect(items[0].item.data.name).toBe("Agatha Christie");
    expect(items[1].item.data.name).toBe("George Orwell");
    expect(items[2].item.data.name).toBe("Isaac Asimov");
    expect(items[3].item.data.name).toBe("J.K. Rowling");
    expect(items[4].item.data.name).toBe("Stephen King");
  });
});
