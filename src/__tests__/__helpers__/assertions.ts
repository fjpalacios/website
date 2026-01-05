/**
 * Common Test Assertions
 *
 * Reusable assertion helpers to reduce duplication in tests.
 *
 * @module __tests__/__helpers__/assertions
 */

import { expect } from "vitest";

import type { LanguageKey } from "@/types";

// ============================================================================
// ROUTE ASSERTIONS
// ============================================================================

/**
 * Assert that a route path matches expected format
 *
 * @param path - The route path to check
 * @param expectedPattern - Regex pattern or string to match
 *
 * @example
 * ```typescript
 * assertValidRoutePath("/en/books", /^\/en\/books$/);
 * assertValidRoutePath("/es/libros/page/2", /^\/es\/libros\/page\/\d+$/);
 * ```
 */
export function assertValidRoutePath(path: string, expectedPattern: RegExp | string): void {
  if (typeof expectedPattern === "string") {
    expect(path).toBe(expectedPattern);
  } else {
    expect(path).toMatch(expectedPattern);
  }
}

/**
 * Assert that route props contain required fields
 *
 * @param props - Route props object
 * @param requiredFields - Array of required field names
 *
 * @example
 * ```typescript
 * assertRoutePropsHaveFields(route.props, ["lang", "items", "contact"]);
 * ```
 */
export function assertRoutePropsHaveFields(props: Record<string, unknown>, requiredFields: string[]): void {
  for (const field of requiredFields) {
    expect(props).toHaveProperty(field);
    expect(props[field]).toBeDefined();
  }
}

/**
 * Assert that a route object has valid structure
 *
 * @param route - Route object to validate
 * @param expectedPath - Expected path (optional)
 *
 * @example
 * ```typescript
 * assertValidRoute(route, "/en/books");
 * assertValidRoute(route); // Just check structure
 * ```
 */
export function assertValidRoute(route: { params: unknown; props: unknown }, expectedPath?: string): void {
  expect(route).toHaveProperty("params");
  expect(route).toHaveProperty("props");

  if (expectedPath) {
    expect(route.params).toHaveProperty("route");
    if (typeof route.params === "object" && route.params !== null && "route" in route.params) {
      expect(route.params.route).toBe(expectedPath);
    }
  }
}

// ============================================================================
// PAGINATION ASSERTIONS
// ============================================================================

/**
 * Assert pagination props are valid
 *
 * @param props - Route props containing pagination
 * @param expectedPage - Expected current page number
 * @param expectedTotalPages - Expected total pages
 *
 * @example
 * ```typescript
 * assertValidPagination(route.props, 2, 5);
 * ```
 */
export function assertValidPagination(
  props: Record<string, unknown>,
  expectedPage: number,
  expectedTotalPages: number,
): void {
  expect(props).toHaveProperty("currentPage", expectedPage);
  expect(props).toHaveProperty("totalPages", expectedTotalPages);

  // Validate pagination logic
  expect(props.currentPage).toBeGreaterThanOrEqual(1);
  expect(props.currentPage).toBeLessThanOrEqual(expectedTotalPages);
}

/**
 * Assert that pagination items match expected count
 *
 * @param items - Items array from pagination
 * @param expectedCount - Expected number of items
 * @param maxPerPage - Maximum items per page (optional validation)
 *
 * @example
 * ```typescript
 * assertPaginationItems(route.props.items, 10);
 * assertPaginationItems(route.props.items, 5, 10); // Also check not exceeding max
 * ```
 */
export function assertPaginationItems(items: unknown[], expectedCount: number, maxPerPage?: number): void {
  expect(items).toHaveLength(expectedCount);

  if (maxPerPage !== undefined) {
    expect(items.length).toBeLessThanOrEqual(maxPerPage);
  }
}

// ============================================================================
// LANGUAGE / i18n ASSERTIONS
// ============================================================================

/**
 * Assert all items have expected language
 *
 * @param items - Array of items with data.language
 * @param expectedLang - Expected language code
 *
 * @example
 * ```typescript
 * assertItemsHaveLanguage(books, "es");
 * ```
 */
export function assertItemsHaveLanguage(items: Array<{ data: { language: string } }>, expectedLang: string): void {
  expect(items.length).toBeGreaterThan(0);
  items.forEach((item) => {
    expect(item.data.language).toBe(expectedLang);
  });
}

/**
 * Assert route has valid language in params
 *
 * @param params - Route params
 * @param expectedLang - Expected language code
 *
 * @example
 * ```typescript
 * assertRouteLanguage(route.params, "en");
 * ```
 */
export function assertRouteLanguage(params: Record<string, unknown>, expectedLang: LanguageKey): void {
  expect(params).toHaveProperty("lang", expectedLang);
}

// ============================================================================
// COLLECTION ASSERTIONS
// ============================================================================

/**
 * Assert array is not empty
 *
 * @param array - Array to check
 * @param message - Optional custom error message
 *
 * @example
 * ```typescript
 * assertNotEmpty(books, "Books array should not be empty");
 * ```
 */
export function assertNotEmpty<T>(array: T[], message?: string): void {
  expect(array.length).toBeGreaterThan(0);
  if (message) {
    expect(array.length, message).toBeGreaterThan(0);
  }
}

/**
 * Assert array has exact count
 *
 * @param array - Array to check
 * @param expectedCount - Expected length
 * @param message - Optional custom error message
 *
 * @example
 * ```typescript
 * assertArrayCount(routes, 86, "Should generate 86 routes");
 * ```
 */
export function assertArrayCount<T>(array: T[], expectedCount: number, message?: string): void {
  if (message) {
    expect(array, message).toHaveLength(expectedCount);
  } else {
    expect(array).toHaveLength(expectedCount);
  }
}

/**
 * Assert all items in array satisfy predicate
 *
 * @param array - Array to check
 * @param predicate - Function to test each item
 * @param message - Optional custom error message
 *
 * @example
 * ```typescript
 * assertAllItemsSatisfy(books, (book) => book.data.score > 0, "All books should have score");
 * ```
 */
export function assertAllItemsSatisfy<T>(array: T[], predicate: (item: T) => boolean, message?: string): void {
  const failedItems = array.filter((item) => !predicate(item));
  if (message) {
    expect(failedItems, message).toHaveLength(0);
  } else {
    expect(failedItems).toHaveLength(0);
  }
}

// ============================================================================
// SCHEMA ASSERTIONS
// ============================================================================

/**
 * Assert object matches expected schema structure
 *
 * @param obj - Object to check
 * @param schema - Expected schema (partial match)
 *
 * @example
 * ```typescript
 * assertMatchesSchema(book.data, {
 *   title: expect.any(String),
 *   score: expect.any(Number),
 * });
 * ```
 */
export function assertMatchesSchema(obj: Record<string, unknown>, schema: Record<string, unknown>): void {
  expect(obj).toMatchObject(schema);
}

/**
 * Assert all objects in array match schema
 *
 * @param array - Array of objects to check
 * @param schema - Expected schema (partial match)
 *
 * @example
 * ```typescript
 * assertAllMatchSchema(books, {
 *   id: expect.any(String),
 *   data: expect.objectContaining({
 *     title: expect.any(String),
 *   }),
 * });
 * ```
 */
export function assertAllMatchSchema<T extends Record<string, unknown>>(array: T[], schema: Partial<T>): void {
  array.forEach((item) => {
    expect(item).toMatchObject(schema);
  });
}
