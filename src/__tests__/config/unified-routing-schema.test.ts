/**
 * Unit Tests: Unified Routing Schema Validators
 * Tests Zod validation schemas for route configuration
 */

import { describe, it, expect } from "vitest";

import {
  LanguageSchema,
  PageTypeSchema,
  ContentCategorySchema,
  TemplateNameSchema,
  CollectionNameSchema,
  RouteSegmentsSchema,
  TemplatesSchema,
  FeaturesSchema,
  SEOSchema,
  DataLoadersSchema,
  ContentTypeConfigSchema,
  ContentTypesRegistrySchema,
  SpecialSegmentsSchema,
  RouteParamsSchema,
  ParsedRouteSchema,
  validateContentTypeConfig,
  validateContentTypesRegistry,
  validateRouteParams,
  validateParsedRoute,
  safeValidateContentTypeConfig,
  safeValidateRouteParams,
  safeValidateParsedRoute,
  isValidLanguage,
  isValidPageType,
  isValidContentCategory,
} from "@/config/unified-routing-schema";

describe("unified-routing-schema validators", () => {
  describe("LanguageSchema", () => {
    it("should accept valid languages", () => {
      expect(LanguageSchema.parse("es")).toBe("es");
      expect(LanguageSchema.parse("en")).toBe("en");
    });

    it("should reject invalid languages", () => {
      expect(() => LanguageSchema.parse("fr")).toThrow();
      expect(() => LanguageSchema.parse("")).toThrow();
      expect(() => LanguageSchema.parse(null)).toThrow();
    });
  });

  describe("PageTypeSchema", () => {
    it("should accept valid page types", () => {
      expect(PageTypeSchema.parse("list")).toBe("list");
      expect(PageTypeSchema.parse("detail")).toBe("detail");
      expect(PageTypeSchema.parse("pagination")).toBe("pagination");
      expect(PageTypeSchema.parse("rss")).toBe("rss");
      expect(PageTypeSchema.parse("static")).toBe("static");
    });

    it("should reject invalid page types", () => {
      expect(() => PageTypeSchema.parse("invalid")).toThrow();
      expect(() => PageTypeSchema.parse("")).toThrow();
    });
  });

  describe("ContentCategorySchema", () => {
    it("should accept valid categories", () => {
      expect(ContentCategorySchema.parse("content")).toBe("content");
      expect(ContentCategorySchema.parse("taxonomy")).toBe("taxonomy");
      expect(ContentCategorySchema.parse("static")).toBe("static");
    });

    it("should reject invalid categories", () => {
      expect(() => ContentCategorySchema.parse("invalid")).toThrow();
    });
  });

  describe("TemplateNameSchema", () => {
    it("should accept valid template names", () => {
      expect(TemplateNameSchema.parse("ContentList")).toBe("ContentList");
      expect(TemplateNameSchema.parse("ContentDetail")).toBe("ContentDetail");
      expect(TemplateNameSchema.parse("ContentPagination")).toBe("ContentPagination");
      expect(TemplateNameSchema.parse("TaxonomyListGrouped")).toBe("TaxonomyListGrouped");
      expect(TemplateNameSchema.parse("TaxonomyDetail")).toBe("TaxonomyDetail");
      expect(TemplateNameSchema.parse("StaticPage")).toBe("StaticPage");
      expect(TemplateNameSchema.parse("RSSFeed")).toBe("RSSFeed");
    });

    it("should reject invalid template names", () => {
      expect(() => TemplateNameSchema.parse("InvalidTemplate")).toThrow();
    });
  });

  describe("CollectionNameSchema", () => {
    it("should accept valid collection names", () => {
      const validCollections = [
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

      validCollections.forEach((collection) => {
        expect(CollectionNameSchema.parse(collection)).toBe(collection);
      });
    });

    it("should reject invalid collection names", () => {
      expect(() => CollectionNameSchema.parse("invalid")).toThrow();
    });
  });

  describe("RouteSegmentsSchema", () => {
    it("should accept valid route segments", () => {
      const valid = { en: "books", es: "libros" };
      expect(RouteSegmentsSchema.parse(valid)).toEqual(valid);
    });

    it("should reject empty route segments", () => {
      expect(() => RouteSegmentsSchema.parse({ en: "", es: "libros" })).toThrow();
      expect(() => RouteSegmentsSchema.parse({ en: "books", es: "" })).toThrow();
    });

    it("should reject missing language keys", () => {
      expect(() => RouteSegmentsSchema.parse({ en: "books" })).toThrow();
      expect(() => RouteSegmentsSchema.parse({ es: "libros" })).toThrow();
    });
  });

  describe("TemplatesSchema", () => {
    it("should accept valid templates object", () => {
      const valid = {
        list: "ContentList" as const,
        detail: "ContentDetail" as const,
      };
      expect(TemplatesSchema.parse(valid)).toEqual(valid);
    });

    it("should accept single template", () => {
      const valid = { detail: "ContentDetail" as const };
      expect(TemplatesSchema.parse(valid)).toEqual(valid);
    });

    it("should reject empty templates object", () => {
      expect(() => TemplatesSchema.parse({})).toThrow("At least one template must be defined");
    });

    it("should reject templates with only undefined values", () => {
      expect(() =>
        TemplatesSchema.parse({
          list: undefined,
          detail: undefined,
          pagination: undefined,
          rss: undefined,
        }),
      ).toThrow();
    });
  });

  describe("FeaturesSchema", () => {
    it("should accept valid features", () => {
      const valid = {
        hasPagination: true,
        hasRSS: true,
        itemsPerPage: 12,
        showRelated: true,
        searchable: true,
      };
      expect(FeaturesSchema.parse(valid)).toEqual(valid);
    });

    it("should accept minimal features", () => {
      const valid = {
        hasPagination: false,
        hasRSS: false,
      };
      expect(FeaturesSchema.parse(valid)).toEqual(valid);
    });

    it("should reject hasPagination without itemsPerPage", () => {
      const invalid = {
        hasPagination: true,
        hasRSS: false,
      };
      expect(() => FeaturesSchema.parse(invalid)).toThrow("itemsPerPage is required");
    });

    it("should reject negative itemsPerPage", () => {
      const invalid = {
        hasPagination: true,
        hasRSS: false,
        itemsPerPage: -1,
      };
      expect(() => FeaturesSchema.parse(invalid)).toThrow();
    });

    it("should reject zero itemsPerPage", () => {
      const invalid = {
        hasPagination: true,
        hasRSS: false,
        itemsPerPage: 0,
      };
      expect(() => FeaturesSchema.parse(invalid)).toThrow();
    });

    it("should reject non-integer itemsPerPage", () => {
      const invalid = {
        hasPagination: true,
        hasRSS: false,
        itemsPerPage: 12.5,
      };
      expect(() => FeaturesSchema.parse(invalid)).toThrow();
    });
  });

  describe("SEOSchema", () => {
    it("should accept valid SEO config", () => {
      const valid = {
        schemaType: "Book",
        generateItemList: true,
        descriptionKey: "books.description",
      };
      expect(SEOSchema.parse(valid)).toEqual(valid);
    });

    it("should accept SEO config without optional fields", () => {
      const valid = {
        schemaType: "BlogPosting",
        generateItemList: false,
      };
      expect(SEOSchema.parse(valid)).toEqual(valid);
    });

    it("should reject empty schemaType", () => {
      const invalid = {
        schemaType: "",
        generateItemList: true,
      };
      expect(() => SEOSchema.parse(invalid)).toThrow("Schema type cannot be empty");
    });
  });

  describe("DataLoadersSchema", () => {
    it("should accept valid data loaders", () => {
      const valid = {
        getAll: "getAllBooks",
        getBySlug: "getBookBySlug",
      };
      expect(DataLoadersSchema.parse(valid)).toEqual(valid);
    });

    it("should accept empty data loaders", () => {
      const valid = {};
      expect(DataLoadersSchema.parse(valid)).toEqual(valid);
    });

    it("should accept partial data loaders", () => {
      const valid = { getAll: "getAllPosts" };
      expect(DataLoadersSchema.parse(valid)).toEqual(valid);
    });
  });

  describe("ContentTypeConfigSchema", () => {
    it("should accept valid content type config", () => {
      const valid = {
        id: "books",
        category: "content" as const,
        collection: "books" as const,
        routeSegments: { en: "books", es: "libros" },
        templates: {
          list: "ContentList" as const,
          detail: "ContentDetail" as const,
          rss: "RSSFeed" as const,
        },
        features: {
          hasPagination: true,
          hasRSS: true,
          itemsPerPage: 12,
        },
        seo: {
          schemaType: "Book",
          generateItemList: true,
        },
        dataLoaders: {},
      };
      expect(ContentTypeConfigSchema.parse(valid)).toEqual(valid);
    });

    it("should reject non-static type without collection", () => {
      const invalid = {
        id: "books",
        category: "content" as const,
        collection: null,
        routeSegments: { en: "books", es: "libros" },
        templates: { list: "ContentList" as const },
        features: { hasPagination: false, hasRSS: false },
        seo: { schemaType: "Book", generateItemList: false },
        dataLoaders: {},
      };
      expect(() => ContentTypeConfigSchema.parse(invalid)).toThrow("must have a collection");
    });

    it("should reject hasRSS without rss template", () => {
      const invalid = {
        id: "books",
        category: "content" as const,
        collection: "books" as const,
        routeSegments: { en: "books", es: "libros" },
        templates: { list: "ContentList" as const },
        features: { hasPagination: false, hasRSS: true },
        seo: { schemaType: "Book", generateItemList: false },
        dataLoaders: {},
      };
      expect(() => ContentTypeConfigSchema.parse(invalid)).toThrow("RSS template is required");
    });

    it("should accept static type without collection", () => {
      const valid = {
        id: "about",
        category: "static" as const,
        collection: null,
        routeSegments: { en: "about", es: "sobre-mi" },
        templates: { detail: "StaticPage" as const },
        features: { hasPagination: false, hasRSS: false },
        seo: { schemaType: "WebPage", generateItemList: false },
        dataLoaders: {},
      };
      expect(ContentTypeConfigSchema.parse(valid)).toEqual(valid);
    });
  });

  describe("ContentTypesRegistrySchema", () => {
    it("should accept valid registry", () => {
      const valid = {
        books: {
          id: "books",
          category: "content" as const,
          collection: "books" as const,
          routeSegments: { en: "books", es: "libros" },
          templates: { list: "ContentList" as const },
          features: { hasPagination: false, hasRSS: false },
          seo: { schemaType: "Book", generateItemList: false },
          dataLoaders: {},
        },
        posts: {
          id: "posts",
          category: "content" as const,
          collection: "posts" as const,
          routeSegments: { en: "posts", es: "publicaciones" },
          templates: { list: "ContentList" as const },
          features: { hasPagination: false, hasRSS: false },
          seo: { schemaType: "BlogPosting", generateItemList: false },
          dataLoaders: {},
        },
      };
      expect(ContentTypesRegistrySchema.parse(valid)).toEqual(valid);
    });

    it("should reject empty registry", () => {
      const result = ContentTypesRegistrySchema.parse({});
      expect(result).toEqual({});
    });
  });

  describe("SpecialSegmentsSchema", () => {
    it("should accept valid special segments", () => {
      const valid = {
        pagination: { en: "page", es: "pagina" },
        feeds: { en: "feeds", es: "feeds" },
      };
      expect(SpecialSegmentsSchema.parse(valid)).toEqual(valid);
    });
  });

  describe("RouteParamsSchema", () => {
    it("should accept valid route params", () => {
      const valid = {
        lang: "es" as const,
        route: "libros",
      };
      expect(RouteParamsSchema.parse(valid)).toEqual(valid);
    });

    it("should accept route params with optional route", () => {
      const valid = {
        lang: "en" as const,
      };
      const result = RouteParamsSchema.parse(valid);
      expect(result.lang).toBe("en");
      expect(result.route).toBeUndefined();
    });
  });

  describe("ParsedRouteSchema", () => {
    it("should accept valid parsed route", () => {
      const valid = {
        lang: "es" as const,
        contentTypeId: "books",
        pageType: "list" as const,
        segments: ["libros"],
      };
      expect(ParsedRouteSchema.parse(valid)).toEqual(valid);
    });

    it("should accept parsed route with optional fields", () => {
      const valid = {
        lang: "en" as const,
        contentTypeId: "books",
        pageType: "detail" as const,
        slug: "apocalipsis-stephen-king",
        pageNumber: 2,
        segments: ["books", "apocalipsis-stephen-king"],
      };
      expect(ParsedRouteSchema.parse(valid)).toEqual(valid);
    });

    it("should reject negative page numbers", () => {
      const invalid = {
        lang: "en" as const,
        contentTypeId: "books",
        pageType: "pagination" as const,
        pageNumber: -1,
        segments: ["books", "page", "-1"],
      };
      expect(() => ParsedRouteSchema.parse(invalid)).toThrow();
    });

    it("should reject zero page numbers", () => {
      const invalid = {
        lang: "en" as const,
        contentTypeId: "books",
        pageType: "pagination" as const,
        pageNumber: 0,
        segments: ["books", "page", "0"],
      };
      expect(() => ParsedRouteSchema.parse(invalid)).toThrow();
    });
  });

  // ===================================================================
  // VALIDATION FUNCTIONS (throw on error)
  // ===================================================================

  describe("validateContentTypeConfig()", () => {
    it("should validate correct config without throwing", () => {
      const validConfig = {
        id: "books",
        category: "content" as const,
        collection: "books" as const,
        routeSegments: { en: "books", es: "libros" },
        templates: { list: "ContentList" as const },
        features: { hasPagination: false, hasRSS: false },
        seo: { schemaType: "Book", generateItemList: false },
        dataLoaders: {},
      };

      expect(() => validateContentTypeConfig(validConfig, "books")).not.toThrow();
    });

    it("should throw with formatted error for invalid config", () => {
      const invalidConfig = {
        id: "books",
        category: "invalid-category",
        collection: "books",
      };

      expect(() => validateContentTypeConfig(invalidConfig, "books")).toThrow(
        /Content type config validation failed for "books"/,
      );
    });

    it("should throw with detailed issues in error message", () => {
      const invalidConfig = {
        id: "books",
        category: "content",
        collection: null, // Invalid: content must have collection
        routeSegments: { en: "books", es: "libros" },
        templates: {},
        features: { hasPagination: false, hasRSS: false },
        seo: { schemaType: "Book", generateItemList: false },
        dataLoaders: {},
      };

      expect(() => validateContentTypeConfig(invalidConfig, "books")).toThrow(/must have a collection/);
    });

    it("should re-throw non-Zod errors", () => {
      const invalidConfig = {
        get id() {
          throw new Error("Custom error");
        },
      };

      expect(() => validateContentTypeConfig(invalidConfig, "test")).toThrow("Custom error");
    });
  });

  describe("validateContentTypesRegistry()", () => {
    it("should validate correct registry without throwing", () => {
      const validRegistry = {
        books: {
          id: "books",
          category: "content" as const,
          collection: "books" as const,
          routeSegments: { en: "books", es: "libros" },
          templates: { list: "ContentList" as const },
          features: { hasPagination: false, hasRSS: false },
          seo: { schemaType: "Book", generateItemList: false },
          dataLoaders: {},
        },
      };

      expect(() => validateContentTypesRegistry(validRegistry)).not.toThrow();
    });

    it("should throw with formatted error for invalid registry", () => {
      const invalidRegistry = {
        books: {
          id: "books",
          category: "invalid-category",
        },
      };

      expect(() => validateContentTypesRegistry(invalidRegistry)).toThrow(/Content types registry validation failed/);
    });

    it("should accept empty registry", () => {
      expect(() => validateContentTypesRegistry({})).not.toThrow();
    });
  });

  describe("validateRouteParams()", () => {
    it("should validate and return correct params", () => {
      const params = { lang: "es", route: "libros" };
      const result = validateRouteParams(params);

      expect(result).toEqual(params);
      expect(result.lang).toBe("es");
      expect(result.route).toBe("libros");
    });

    it("should accept params with optional route", () => {
      const params = { lang: "en" };
      const result = validateRouteParams(params);

      expect(result.lang).toBe("en");
      expect(result.route).toBeUndefined();
    });

    it("should throw for invalid language", () => {
      const params = { lang: "fr", route: "livres" };

      expect(() => validateRouteParams(params)).toThrow();
    });

    it("should throw for missing lang", () => {
      const params = { route: "books" };

      expect(() => validateRouteParams(params)).toThrow();
    });
  });

  describe("validateParsedRoute()", () => {
    it("should validate and return correct parsed route", () => {
      const route = {
        lang: "es" as const,
        contentTypeId: "books",
        pageType: "list" as const,
        segments: ["libros"],
      };

      const result = validateParsedRoute(route);
      expect(result).toEqual(route);
    });

    it("should validate parsed route with optional fields", () => {
      const route = {
        lang: "en" as const,
        contentTypeId: "books",
        pageType: "detail" as const,
        slug: "the-stand",
        pageNumber: 1,
        segments: ["books", "the-stand"],
      };

      const result = validateParsedRoute(route);
      expect(result).toEqual(route);
    });

    it("should throw for invalid page type", () => {
      const route = {
        lang: "en",
        contentTypeId: "books",
        pageType: "invalid-type",
        segments: ["books"],
      };

      expect(() => validateParsedRoute(route)).toThrow();
    });

    it("should throw for negative page number", () => {
      const route = {
        lang: "en",
        contentTypeId: "books",
        pageType: "pagination",
        pageNumber: -1,
        segments: ["books", "page", "-1"],
      };

      expect(() => validateParsedRoute(route)).toThrow();
    });
  });

  // ===================================================================
  // SAFE VALIDATION FUNCTIONS (return result object)
  // ===================================================================

  describe("safeValidateContentTypeConfig()", () => {
    it("should return success for valid config", () => {
      const validConfig = {
        id: "books",
        category: "content" as const,
        collection: "books" as const,
        routeSegments: { en: "books", es: "libros" },
        templates: { list: "ContentList" as const },
        features: { hasPagination: false, hasRSS: false },
        seo: { schemaType: "Book", generateItemList: false },
        dataLoaders: {},
      };

      const result = safeValidateContentTypeConfig(validConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("books");
      }
    });

    it("should return error for invalid config", () => {
      const invalidConfig = {
        id: "books",
        category: "invalid-category",
      };

      const result = safeValidateContentTypeConfig(invalidConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("should return error with details for missing required fields", () => {
      const invalidConfig = {
        id: "books",
        category: "content",
        collection: "books",
        // Missing: routeSegments, templates, features, seo, dataLoaders
      };

      const result = safeValidateContentTypeConfig(invalidConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("safeValidateRouteParams()", () => {
    it("should return success for valid params", () => {
      const params = { lang: "es", route: "libros" };
      const result = safeValidateRouteParams(params);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lang).toBe("es");
        expect(result.data.route).toBe("libros");
      }
    });

    it("should return error for invalid language", () => {
      const params = { lang: "fr", route: "livres" };
      const result = safeValidateRouteParams(params);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("should return success for params without route", () => {
      const params = { lang: "en" };
      const result = safeValidateRouteParams(params);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lang).toBe("en");
        expect(result.data.route).toBeUndefined();
      }
    });

    it("should return error for missing lang", () => {
      const params = { route: "books" };
      const result = safeValidateRouteParams(params);

      expect(result.success).toBe(false);
    });
  });

  describe("safeValidateParsedRoute()", () => {
    it("should return success for valid parsed route", () => {
      const route = {
        lang: "es" as const,
        contentTypeId: "books",
        pageType: "list" as const,
        segments: ["libros"],
      };

      const result = safeValidateParsedRoute(route);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lang).toBe("es");
        expect(result.data.contentTypeId).toBe("books");
      }
    });

    it("should return error for invalid page type", () => {
      const route = {
        lang: "en",
        contentTypeId: "books",
        pageType: "invalid-type",
        segments: ["books"],
      };

      const result = safeValidateParsedRoute(route);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("should return error for negative page number", () => {
      const route = {
        lang: "en",
        contentTypeId: "books",
        pageType: "pagination",
        pageNumber: -1,
        segments: ["books", "page", "-1"],
      };

      const result = safeValidateParsedRoute(route);

      expect(result.success).toBe(false);
    });

    it("should return success for route with all optional fields", () => {
      const route = {
        lang: "en" as const,
        contentTypeId: "posts",
        pageType: "detail" as const,
        slug: "my-post",
        pageNumber: 2,
        segments: ["posts", "my-post", "page", "2"],
      };

      const result = safeValidateParsedRoute(route);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("my-post");
        expect(result.data.pageNumber).toBe(2);
        expect(result.data.segments).toEqual(["posts", "my-post", "page", "2"]);
      }
    });
  });

  // ===================================================================
  // TYPE GUARDS
  // ===================================================================

  describe("isValidLanguage()", () => {
    it("should return true for valid languages", () => {
      expect(isValidLanguage("es")).toBe(true);
      expect(isValidLanguage("en")).toBe(true);
    });

    it("should return false for invalid languages", () => {
      expect(isValidLanguage("fr")).toBe(false);
      expect(isValidLanguage("de")).toBe(false);
      expect(isValidLanguage("")).toBe(false);
      expect(isValidLanguage(null)).toBe(false);
      expect(isValidLanguage(undefined)).toBe(false);
      expect(isValidLanguage(123)).toBe(false);
      expect(isValidLanguage({})).toBe(false);
    });
  });

  describe("isValidPageType()", () => {
    it("should return true for valid page types", () => {
      expect(isValidPageType("list")).toBe(true);
      expect(isValidPageType("detail")).toBe(true);
      expect(isValidPageType("pagination")).toBe(true);
      expect(isValidPageType("rss")).toBe(true);
      expect(isValidPageType("static")).toBe(true);
    });

    it("should return false for invalid page types", () => {
      expect(isValidPageType("invalid")).toBe(false);
      expect(isValidPageType("")).toBe(false);
      expect(isValidPageType(null)).toBe(false);
      expect(isValidPageType(undefined)).toBe(false);
      expect(isValidPageType(123)).toBe(false);
      expect(isValidPageType({})).toBe(false);
    });
  });

  describe("isValidContentCategory()", () => {
    it("should return true for valid categories", () => {
      expect(isValidContentCategory("content")).toBe(true);
      expect(isValidContentCategory("taxonomy")).toBe(true);
      expect(isValidContentCategory("static")).toBe(true);
    });

    it("should return false for invalid categories", () => {
      expect(isValidContentCategory("invalid")).toBe(false);
      expect(isValidContentCategory("")).toBe(false);
      expect(isValidContentCategory(null)).toBe(false);
      expect(isValidContentCategory(undefined)).toBe(false);
      expect(isValidContentCategory(123)).toBe(false);
      expect(isValidContentCategory({})).toBe(false);
    });
  });
});
