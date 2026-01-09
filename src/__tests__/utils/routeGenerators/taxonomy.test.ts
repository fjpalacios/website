/**
 * Tests for taxonomy route generator
 *
 * Tests the generation of routes for taxonomy types (authors, publishers, genres, etc.)
 * Each taxonomy has list pages and paginated detail pages.
 */

import { describe, expect, test, vi } from "vitest";

import { createMockAuthor, createMockContact, createMockTaxonomy } from "@/__tests__/__helpers__";
import { generateTaxonomyRoutes } from "@/utils/routeGenerators/taxonomy";
import type { TaxonomyConfig } from "@/utils/taxonomyPages";

// Mock the taxonomyPages module
vi.mock("@/utils/taxonomyPages", () => ({
  getTaxonomyItemsWithCount: vi.fn(),
  hasTargetContent: vi.fn(),
  generateTaxonomyDetailPaths: vi.fn(),
}));

// Import mocked functions
import { generateTaxonomyDetailPaths, getTaxonomyItemsWithCount, hasTargetContent } from "@/utils/taxonomyPages";

describe("generateTaxonomyRoutes", () => {
  // Mock data
  const mockContact = createMockContact();

  const mockTaxonomyConfig: TaxonomyConfig = {
    collection: "authors",
    slugField: "author_slug",
    contentCollections: ["books"],
    contentField: "author",
    isSingular: true,
  };

  const mockAuthorStephenKing = createMockAuthor("stephen-king", "Stephen King");
  const mockAuthorJKRowling = createMockAuthor("jk-rowling", "J.K. Rowling");
  const mockGenreFiction = createMockTaxonomy("genres", "fiction", "Fiction");

  // Helper to setup default mocks
  function setupDefaultMocks() {
    vi.clearAllMocks();

    // Default: 2 authors with content
    (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([
      { item: mockAuthorStephenKing, count: 15 },
      { item: mockAuthorJKRowling, count: 7 },
    ]);

    // Default: target language has content
    (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    // Default: 2 detail pages
    (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        slug: "stephen-king",
        props: {
          item: mockAuthorStephenKing,
          relatedContent: [],
          currentPage: 1,
          totalPages: 2,
        },
      },
      {
        slug: "jk-rowling",
        props: {
          item: mockAuthorJKRowling,
          relatedContent: [],
          currentPage: 1,
          totalPages: 1,
        },
      },
    ]);
  }

  describe("Basic Route Generation", () => {
    test("should generate list page and detail pages for taxonomy", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      // Should have 1 list page + 2 detail pages
      expect(routes).toHaveLength(3);
    });

    test("should generate correct list page route", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const listPage = routes[0];

      expect(listPage.params).toEqual({
        lang: "en",
        route: "authors",
      });

      expect(listPage.props.contentType).toBe("authors");
      expect(listPage.props.pageType).toBe("list");
      expect(listPage.props.lang).toBe("en");
    });

    test("should include items with counts in list page props", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const listPage = routes[0];

      // Items are sorted alphabetically by name (J.K. Rowling before Stephen King)
      expect(listPage.props.itemsWithContent).toEqual([
        { item: mockAuthorJKRowling, count: 7 },
        { item: mockAuthorStephenKing, count: 15 },
      ]);
    });

    test("should generate correct detail page routes", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const stephenKingPage = routes[1];
      const jkRowlingPage = routes[2];

      expect(stephenKingPage.params).toEqual({
        lang: "en",
        route: "authors/stephen-king",
      });

      expect(jkRowlingPage.params).toEqual({
        lang: "en",
        route: "authors/jk-rowling",
      });
    });

    test("should include correct props in detail pages", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const detailPage = routes[1];

      expect(detailPage.props.contentType).toBe("authors");
      expect(detailPage.props.pageType).toBe("detail");
      expect(detailPage.props.item).toEqual(mockAuthorStephenKing);
    });

    test("should include taxonomy items in detail page props", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const detailPage = routes[1];

      expect(detailPage.props.authorsWithCounts).toEqual([
        { item: mockAuthorJKRowling, count: 7 },
        { item: mockAuthorStephenKing, count: 15 },
      ]);
    });
  });

  describe("Language Handling", () => {
    test("should generate Spanish routes correctly", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "es",
        targetLang: "en",
        routeSegment: "autores",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const listPage = routes[0];

      expect(listPage.params.lang).toBe("es");
      expect(listPage.params.route).toBe("autores");
      expect(listPage.props.lang).toBe("es");
    });

    test("should pass hasTargetContent to list page props", async () => {
      setupDefaultMocks();
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(routes[0].props.hasTargetContent).toBe(true);
    });

    test("should handle when target language has no content", async () => {
      setupDefaultMocks();
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(routes[0].props.hasTargetContent).toBe(false);
    });
  });

  describe("Edge Cases - Empty Content", () => {
    test("should only generate list page when no items have content", async () => {
      vi.clearAllMocks();

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      // Only list page, no detail pages
      expect(routes).toHaveLength(1);
      expect(routes[0].props.pageType).toBe("list");
      expect(routes[0].props.itemsWithContent).toEqual([]);
    });

    test("should filter out items with zero content count", async () => {
      vi.clearAllMocks();

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([
        { item: mockAuthorStephenKing, count: 15 },
        { item: mockAuthorJKRowling, count: 0 }, // Zero content
      ]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          slug: "stephen-king",
          props: {
            item: mockAuthorStephenKing,
            relatedContent: [],
          },
        },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      // List page + only 1 detail page (JK Rowling filtered out)
      expect(routes).toHaveLength(2);
      expect(routes[0].props.itemsWithContent).toEqual([{ item: mockAuthorStephenKing, count: 15 }]);
    });

    test("should handle single item taxonomy", async () => {
      vi.clearAllMocks();

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([
        { item: mockAuthorStephenKing, count: 15 },
      ]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          slug: "stephen-king",
          props: {
            item: mockAuthorStephenKing,
            relatedContent: [],
          },
        },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(routes).toHaveLength(2); // List + 1 detail
    });
  });

  describe("Different Taxonomy Types", () => {
    test("should handle genres taxonomy", async () => {
      vi.clearAllMocks();

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([
        { item: mockGenreFiction, count: 25 },
      ]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          slug: "fiction",
          props: {
            item: mockGenreFiction,
            relatedContent: [],
          },
        },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: {
          collection: "genres",
          slugField: "genre_slug",
          contentCollections: ["books"],
          contentField: "genres",
        },
        lang: "en",
        targetLang: "es",
        routeSegment: "genres",
        contentType: "genres",
        contact: mockContact,
        itemsPropsKey: "genresWithCounts",
      });

      expect(routes).toHaveLength(2);
      expect(routes[0].params.route).toBe("genres");
      expect(routes[1].params.route).toBe("genres/fiction");
      expect(routes[1].props.genresWithCounts).toBeDefined();
    });

    test("should handle publishers taxonomy", async () => {
      vi.clearAllMocks();

      const mockPublisher = {
        id: "penguin",
        slug: "penguin",
        collection: "publishers" as const,
        data: {
          name: "Penguin Random House",
          slug: "penguin",
        },
      };

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([{ item: mockPublisher, count: 42 }]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          slug: "penguin",
          props: {
            item: mockPublisher,
            relatedContent: [],
          },
        },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: {
          collection: "publishers",
          slugField: "publisher_slug",
          contentCollections: ["books"],
          contentField: "publisher",
          isSingular: true,
        },
        lang: "en",
        targetLang: "es",
        routeSegment: "publishers",
        contentType: "publishers",
        contact: mockContact,
        itemsPropsKey: "publishersWithCounts",
      });

      expect(routes[0].params.route).toBe("publishers");
      expect(routes[1].params.route).toBe("publishers/penguin");
    });

    test("should handle categories taxonomy", async () => {
      vi.clearAllMocks();

      const mockCategory = {
        id: "programming",
        slug: "programming",
        collection: "categories" as const,
        data: {
          name: "Programming",
          slug: "programming",
        },
      };

      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([{ item: mockCategory, count: 18 }]);
      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          slug: "programming",
          props: {
            item: mockCategory,
            relatedContent: [],
          },
        },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: {
          collection: "categories",
          slugField: "category_slug",
          contentCollections: ["posts", "tutorials", "books"],
          contentField: "categories",
        },
        lang: "en",
        targetLang: "es",
        routeSegment: "categories",
        contentType: "categories",
        contact: mockContact,
        itemsPropsKey: "categoriesWithCounts",
      });

      expect(routes[0].params.route).toBe("categories");
      expect(routes[1].params.route).toBe("categories/programming");
    });
  });

  describe("Sorting and Ordering", () => {
    test("should sort items alphabetically by name", async () => {
      vi.clearAllMocks();

      const mockAuthorZebra = {
        id: "zebra-author",
        slug: "zebra-author",
        collection: "authors" as const,
        data: {
          name: "Zebra Author",
          slug: "zebra-author",
        },
      };

      const mockAuthorAlpha = {
        id: "alpha-author",
        slug: "alpha-author",
        collection: "authors" as const,
        data: {
          name: "Alpha Author",
          slug: "alpha-author",
        },
      };

      // Return in non-alphabetical order
      (getTaxonomyItemsWithCount as ReturnType<typeof vi.fn>).mockResolvedValue([
        { item: mockAuthorZebra, count: 5 },
        { item: mockAuthorAlpha, count: 10 },
      ]);

      (hasTargetContent as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (generateTaxonomyDetailPaths as ReturnType<typeof vi.fn>).mockResolvedValue([
        { slug: "zebra-author", props: { item: mockAuthorZebra } },
        { slug: "alpha-author", props: { item: mockAuthorAlpha } },
      ]);

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      const listPage = routes[0];
      const items = listPage.props.itemsWithContent as Array<{ item: { data: { name: string } } }>;

      // Should be sorted: Alpha before Zebra
      expect(items[0].item.data.name).toBe("Alpha Author");
      expect(items[1].item.data.name).toBe("Zebra Author");
    });
  });

  describe("Contact Information", () => {
    test("should pass contact info to all pages", async () => {
      setupDefaultMocks();

      const customContact = { name: "Custom Contact", email: "test@example.com" };

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: customContact,
        itemsPropsKey: "authorsWithCounts",
      });

      // Check list page
      expect(routes[0].props.contact).toEqual(customContact);

      // Contact is NOT directly in detail page props (comes from generateTaxonomyDetailPaths)
      // but is passed to the generator function
    });
  });

  describe("Props Key Customization", () => {
    test("should use custom itemsPropsKey for different taxonomies", async () => {
      setupDefaultMocks();

      const routes = await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "publishers",
        contentType: "publishers",
        contact: mockContact,
        itemsPropsKey: "publishersWithCounts", // Custom key
      });

      const detailPage = routes[1];

      expect(detailPage.props.publishersWithCounts).toBeDefined();
      expect(detailPage.props.authorsWithCounts).toBeUndefined();
    });
  });

  describe("Integration with taxonomyPages utilities", () => {
    test("should call getTaxonomyItemsWithCount with correct config and lang", async () => {
      setupDefaultMocks();

      await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(getTaxonomyItemsWithCount).toHaveBeenCalledWith(mockTaxonomyConfig, "en");
    });

    test("should call hasTargetContent with correct config and targetLang", async () => {
      setupDefaultMocks();

      await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(hasTargetContent).toHaveBeenCalledWith(mockTaxonomyConfig, "es");
    });

    test("should call generateTaxonomyDetailPaths with correct params", async () => {
      setupDefaultMocks();

      await generateTaxonomyRoutes({
        taxonomyConfig: mockTaxonomyConfig,
        lang: "en",
        targetLang: "es",
        routeSegment: "authors",
        contentType: "authors",
        contact: mockContact,
        itemsPropsKey: "authorsWithCounts",
      });

      expect(generateTaxonomyDetailPaths).toHaveBeenCalledWith(mockTaxonomyConfig, "en", mockContact);
    });
  });
});
