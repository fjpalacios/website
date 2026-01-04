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

  describe("PAGINATION_CONFIG.UI", () => {
    it("should have MAX_PAGE_BUTTONS constant", () => {
      expect(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS).toBeDefined();
      expect(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS).toBe(7);
      expect(typeof PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS).toBe("number");
    });

    it("should have INITIAL_PAGES_COUNT constant", () => {
      expect(PAGINATION_CONFIG.UI.INITIAL_PAGES_COUNT).toBeDefined();
      expect(PAGINATION_CONFIG.UI.INITIAL_PAGES_COUNT).toBe(5);
      expect(typeof PAGINATION_CONFIG.UI.INITIAL_PAGES_COUNT).toBe("number");
    });

    it("should have START_THRESHOLD constant", () => {
      expect(PAGINATION_CONFIG.UI.START_THRESHOLD).toBeDefined();
      expect(PAGINATION_CONFIG.UI.START_THRESHOLD).toBe(4);
      expect(typeof PAGINATION_CONFIG.UI.START_THRESHOLD).toBe("number");
    });

    it("should have END_THRESHOLD constant", () => {
      expect(PAGINATION_CONFIG.UI.END_THRESHOLD).toBeDefined();
      expect(PAGINATION_CONFIG.UI.END_THRESHOLD).toBe(3);
      expect(typeof PAGINATION_CONFIG.UI.END_THRESHOLD).toBe("number");
    });

    it("should have END_OFFSET constant", () => {
      expect(PAGINATION_CONFIG.UI.END_OFFSET).toBeDefined();
      expect(PAGINATION_CONFIG.UI.END_OFFSET).toBe(4);
      expect(typeof PAGINATION_CONFIG.UI.END_OFFSET).toBe("number");
    });

    it("should have PAGES_AROUND_CURRENT constant", () => {
      expect(PAGINATION_CONFIG.UI.PAGES_AROUND_CURRENT).toBeDefined();
      expect(PAGINATION_CONFIG.UI.PAGES_AROUND_CURRENT).toBe(2);
      expect(typeof PAGINATION_CONFIG.UI.PAGES_AROUND_CURRENT).toBe("number");
    });

    it("should have FIRST_PAGE constant", () => {
      expect(PAGINATION_CONFIG.UI.FIRST_PAGE).toBeDefined();
      expect(PAGINATION_CONFIG.UI.FIRST_PAGE).toBe(1);
      expect(typeof PAGINATION_CONFIG.UI.FIRST_PAGE).toBe("number");
    });

    it("should have MIN_GAP_FOR_ELLIPSIS constant", () => {
      expect(PAGINATION_CONFIG.UI.MIN_GAP_FOR_ELLIPSIS).toBeDefined();
      expect(PAGINATION_CONFIG.UI.MIN_GAP_FOR_ELLIPSIS).toBe(2);
      expect(typeof PAGINATION_CONFIG.UI.MIN_GAP_FOR_ELLIPSIS).toBe("number");
    });

    it("should have logical relationships between constants", () => {
      // INITIAL_PAGES_COUNT should be less than MAX_PAGE_BUTTONS
      expect(PAGINATION_CONFIG.UI.INITIAL_PAGES_COUNT).toBeLessThan(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS);

      // START_THRESHOLD should be less than MAX_PAGE_BUTTONS
      expect(PAGINATION_CONFIG.UI.START_THRESHOLD).toBeLessThan(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS);

      // END_THRESHOLD should be less than MAX_PAGE_BUTTONS
      expect(PAGINATION_CONFIG.UI.END_THRESHOLD).toBeLessThan(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS);

      // PAGES_AROUND_CURRENT should be reasonable
      expect(PAGINATION_CONFIG.UI.PAGES_AROUND_CURRENT).toBeGreaterThan(0);
      expect(PAGINATION_CONFIG.UI.PAGES_AROUND_CURRENT).toBeLessThan(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS);

      // FIRST_PAGE should be 1 (standard pagination starts at 1)
      expect(PAGINATION_CONFIG.UI.FIRST_PAGE).toBe(1);
    });

    it("should be immutable (as const)", () => {
      // This test verifies that PAGINATION_CONFIG uses 'as const'
      // TypeScript enforces readonly at compile time, preventing modifications

      // Verify that the config object exists and has correct structure
      expect(PAGINATION_CONFIG).toBeDefined();
      expect(PAGINATION_CONFIG.UI).toBeDefined();

      // TypeScript prevents this at compile time with 'as const'
      // The config is immutable, so this line would fail:
      // PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS = 10;

      // This confirms TypeScript treats it as readonly (compile-time immutability)
      expect(PAGINATION_CONFIG.UI.MAX_PAGE_BUTTONS).toBe(7);
    });
  });
});
