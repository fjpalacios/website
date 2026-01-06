/**
 * Tests for Test Assertion Helpers
 *
 * @module __tests__/__helpers__/assertions.test
 */

import { describe, expect, it } from "vitest";

import {
  assertAllItemsSatisfy,
  assertAllMatchSchema,
  assertArrayCount,
  assertItemsHaveLanguage,
  assertMatchesSchema,
  assertNotEmpty,
  assertPaginationItems,
  assertRouteLanguage,
  assertRoutePropsHaveFields,
  assertValidPagination,
  assertValidRoute,
  assertValidRoutePath,
} from "./assertions";

describe("Test Assertion Helpers", () => {
  describe("assertValidRoutePath", () => {
    it("should pass for exact string match", () => {
      expect(() => assertValidRoutePath("/en/books", "/en/books")).not.toThrow();
    });

    it("should pass for regex match", () => {
      expect(() => assertValidRoutePath("/es/libros/page/2", /^\/es\/libros\/page\/\d+$/)).not.toThrow();
    });

    it("should fail for mismatched string", () => {
      expect(() => assertValidRoutePath("/en/books", "/es/libros")).toThrow();
    });

    it("should fail for mismatched regex", () => {
      expect(() => assertValidRoutePath("/en/books", /^\/es\//)).toThrow();
    });
  });

  describe("assertRoutePropsHaveFields", () => {
    it("should pass when all fields exist", () => {
      const props = { lang: "es", items: [], contact: {} };

      expect(() => assertRoutePropsHaveFields(props, ["lang", "items", "contact"])).not.toThrow();
    });

    it("should fail when field is missing", () => {
      const props = { lang: "es", items: [] };

      expect(() => assertRoutePropsHaveFields(props, ["lang", "items", "contact"])).toThrow();
    });

    it("should fail when field is undefined", () => {
      const props = { lang: "es", items: [], contact: undefined };

      expect(() => assertRoutePropsHaveFields(props, ["lang", "items", "contact"])).toThrow();
    });
  });

  describe("assertValidRoute", () => {
    it("should pass for valid route structure", () => {
      const route = {
        params: { lang: "es", route: "/books" },
        props: { items: [] },
      };

      expect(() => assertValidRoute(route)).not.toThrow();
    });

    it("should pass with expected path", () => {
      const route = {
        params: { route: "/en/books" },
        props: {},
      };

      expect(() => assertValidRoute(route, "/en/books")).not.toThrow();
    });

    it("should fail when params missing", () => {
      const route = { props: {} } as unknown as { params: unknown; props: unknown };

      expect(() => assertValidRoute(route)).toThrow();
    });

    it("should fail when props missing", () => {
      const route = { params: {} } as unknown as { params: unknown; props: unknown };

      expect(() => assertValidRoute(route)).toThrow();
    });
  });

  describe("assertValidPagination", () => {
    it("should pass for valid pagination", () => {
      const props = { currentPage: 2, totalPages: 5 };

      expect(() => assertValidPagination(props, 2, 5)).not.toThrow();
    });

    it("should fail when page number is wrong", () => {
      const props = { currentPage: 1, totalPages: 5 };

      expect(() => assertValidPagination(props, 2, 5)).toThrow();
    });

    it("should fail when total pages is wrong", () => {
      const props = { currentPage: 2, totalPages: 3 };

      expect(() => assertValidPagination(props, 2, 5)).toThrow();
    });

    it("should validate page is within bounds", () => {
      const props = { currentPage: 6, totalPages: 5 };

      expect(() => assertValidPagination(props, 6, 5)).toThrow();
    });
  });

  describe("assertPaginationItems", () => {
    it("should pass for correct count", () => {
      const items = [1, 2, 3, 4, 5];

      expect(() => assertPaginationItems(items, 5)).not.toThrow();
    });

    it("should pass when under max", () => {
      const items = [1, 2, 3];

      expect(() => assertPaginationItems(items, 3, 10)).not.toThrow();
    });

    it("should fail when count is wrong", () => {
      const items = [1, 2, 3];

      expect(() => assertPaginationItems(items, 5)).toThrow();
    });

    it("should fail when exceeding max", () => {
      const items = [1, 2, 3, 4, 5, 6];

      expect(() => assertPaginationItems(items, 6, 5)).toThrow();
    });
  });

  describe("assertItemsHaveLanguage", () => {
    it("should pass when all items have correct language", () => {
      const items = [{ data: { language: "es" } }, { data: { language: "es" } }];

      expect(() => assertItemsHaveLanguage(items, "es")).not.toThrow();
    });

    it("should fail when language is wrong", () => {
      const items = [{ data: { language: "es" } }, { data: { language: "en" } }];

      expect(() => assertItemsHaveLanguage(items, "es")).toThrow();
    });

    it("should fail for empty array", () => {
      const items: Array<{ data: { language: string } }> = [];

      expect(() => assertItemsHaveLanguage(items, "es")).toThrow();
    });
  });

  describe("assertRouteLanguage", () => {
    it("should pass for correct language", () => {
      const params = { lang: "en" };

      expect(() => assertRouteLanguage(params, "en")).not.toThrow();
    });

    it("should fail for wrong language", () => {
      const params = { lang: "es" };

      expect(() => assertRouteLanguage(params, "en")).toThrow();
    });

    it("should fail when lang missing", () => {
      const params = {};

      expect(() => assertRouteLanguage(params, "en")).toThrow();
    });
  });

  describe("assertNotEmpty", () => {
    it("should pass for non-empty array", () => {
      expect(() => assertNotEmpty([1, 2, 3])).not.toThrow();
    });

    it("should fail for empty array", () => {
      expect(() => assertNotEmpty([])).toThrow();
    });

    it("should include custom message", () => {
      expect(() => assertNotEmpty([], "Custom error message")).toThrow();
    });
  });

  describe("assertArrayCount", () => {
    it("should pass for correct count", () => {
      expect(() => assertArrayCount([1, 2, 3], 3)).not.toThrow();
    });

    it("should fail for wrong count", () => {
      expect(() => assertArrayCount([1, 2], 3)).toThrow();
    });

    it("should include custom message", () => {
      expect(() => assertArrayCount([1], 3, "Expected 3 items")).toThrow();
    });
  });

  describe("assertAllItemsSatisfy", () => {
    it("should pass when all items satisfy predicate", () => {
      const items = [2, 4, 6, 8];

      expect(() => assertAllItemsSatisfy(items, (n) => n % 2 === 0)).not.toThrow();
    });

    it("should fail when some items don't satisfy", () => {
      const items = [2, 3, 4];

      expect(() => assertAllItemsSatisfy(items, (n) => n % 2 === 0)).toThrow();
    });

    it("should pass for empty array", () => {
      expect(() => assertAllItemsSatisfy([], () => false)).not.toThrow();
    });

    it("should include custom message", () => {
      const items = [1, 2, 3];

      expect(() => assertAllItemsSatisfy(items, (n) => n > 5, "All should be > 5")).toThrow();
    });
  });

  describe("assertMatchesSchema", () => {
    it("should pass for matching schema", () => {
      const obj = { title: "Test", score: 5 };

      expect(() =>
        assertMatchesSchema(obj, {
          title: "Test",
          score: 5,
        }),
      ).not.toThrow();
    });

    it("should pass for partial schema match", () => {
      const obj = { title: "Test", score: 5, extra: "field" };

      expect(() =>
        assertMatchesSchema(obj, {
          title: "Test",
        }),
      ).not.toThrow();
    });

    it("should fail when schema doesn't match", () => {
      const obj = { title: "Test", score: 5 };

      expect(() =>
        assertMatchesSchema(obj, {
          title: "Different",
        }),
      ).toThrow();
    });
  });

  describe("assertAllMatchSchema", () => {
    it("should pass when all items match schema", () => {
      const items = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      expect(() => assertAllMatchSchema(items, { id: expect.any(String) })).not.toThrow();
    });

    it("should fail when an item doesn't match", () => {
      const items = [
        { id: "1", name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];

      expect(() => assertAllMatchSchema(items, { id: expect.any(String) })).toThrow();
    });

    it("should pass for empty array", () => {
      expect(() => assertAllMatchSchema([] as { id: string }[], { id: expect.any(String) })).not.toThrow();
    });
  });
});
