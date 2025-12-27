import { describe, it, expect } from "vitest";

import {
  PAGINATION_CONFIG,
  getPaginationSize,
  validatePaginationSize,
  type PaginatedContentType,
} from "@/config/pagination";

describe("Pagination Config", () => {
  describe("PAGINATION_CONFIG", () => {
    it("should have valid default size", () => {
      expect(PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE).toBeGreaterThan(0);
      expect(PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE).toBe(12);
    });

    it("should have consistent sizes for main content types", () => {
      expect(PAGINATION_CONFIG.books).toBe(12);
      expect(PAGINATION_CONFIG.tutorials).toBe(12);
      expect(PAGINATION_CONFIG.posts).toBe(12);
    });

    it("should have different size for taxonomy", () => {
      expect(PAGINATION_CONFIG.taxonomy).toBe(10);
    });

    it("should have valid max and min limits", () => {
      expect(PAGINATION_CONFIG.MAX_ITEMS_PER_PAGE).toBeGreaterThan(PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE);
      expect(PAGINATION_CONFIG.MIN_ITEMS_PER_PAGE).toBeGreaterThan(0);
      expect(PAGINATION_CONFIG.MIN_ITEMS_PER_PAGE).toBe(1);
      expect(PAGINATION_CONFIG.MAX_ITEMS_PER_PAGE).toBe(50);
    });
  });

  describe("getPaginationSize", () => {
    it("should return correct size for books", () => {
      expect(getPaginationSize("books")).toBe(12);
    });

    it("should return correct size for tutorials", () => {
      expect(getPaginationSize("tutorials")).toBe(12);
    });

    it("should return correct size for posts", () => {
      expect(getPaginationSize("posts")).toBe(12);
    });

    it("should return correct size for taxonomy", () => {
      expect(getPaginationSize("taxonomy")).toBe(10);
    });

    it("should be type-safe", () => {
      // This test verifies TypeScript compilation
      const validTypes: PaginatedContentType[] = ["books", "tutorials", "posts", "taxonomy"];

      validTypes.forEach((type) => {
        expect(getPaginationSize(type)).toBeGreaterThan(0);
      });
    });
  });

  describe("validatePaginationSize", () => {
    it("should accept valid sizes", () => {
      expect(validatePaginationSize(1)).toBe(true);
      expect(validatePaginationSize(12)).toBe(true);
      expect(validatePaginationSize(25)).toBe(true);
      expect(validatePaginationSize(50)).toBe(true);
    });

    it("should reject sizes below minimum", () => {
      expect(validatePaginationSize(0)).toBe(false);
      expect(validatePaginationSize(-1)).toBe(false);
      expect(validatePaginationSize(-100)).toBe(false);
    });

    it("should reject sizes above maximum", () => {
      expect(validatePaginationSize(51)).toBe(false);
      expect(validatePaginationSize(100)).toBe(false);
      expect(validatePaginationSize(1000)).toBe(false);
    });

    it("should handle edge cases", () => {
      // Minimum boundary
      expect(validatePaginationSize(1)).toBe(true);
      expect(validatePaginationSize(0)).toBe(false);

      // Maximum boundary
      expect(validatePaginationSize(50)).toBe(true);
      expect(validatePaginationSize(51)).toBe(false);
    });

    it("should handle decimal numbers", () => {
      expect(validatePaginationSize(12.5)).toBe(true); // Between min and max
      expect(validatePaginationSize(0.5)).toBe(false); // Below min
      expect(validatePaginationSize(50.5)).toBe(false); // Above max
    });
  });
});
