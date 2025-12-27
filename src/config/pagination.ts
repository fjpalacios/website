/**
 * Centralized pagination configuration
 *
 * All pagination sizes are defined here to ensure consistency
 * across the application.
 */
export const PAGINATION_CONFIG = {
  /**
   * Default items per page for all content types
   */
  DEFAULT_ITEMS_PER_PAGE: 12,

  /**
   * Content-specific pagination sizes
   */
  books: 12,
  tutorials: 12,
  posts: 12,
  taxonomy: 10,

  /**
   * Maximum items per page (safety limit)
   */
  MAX_ITEMS_PER_PAGE: 50,

  /**
   * Minimum items per page
   */
  MIN_ITEMS_PER_PAGE: 1,
} as const;

/**
 * Type for content types that support pagination
 */
export type PaginatedContentType = keyof Omit<
  typeof PAGINATION_CONFIG,
  "DEFAULT_ITEMS_PER_PAGE" | "MAX_ITEMS_PER_PAGE" | "MIN_ITEMS_PER_PAGE"
>;

/**
 * Type-safe pagination size getter
 *
 * @param contentType - Type of content to get pagination size for
 * @returns Number of items per page for the content type
 *
 * @example
 * ```typescript
 * const size = getPaginationSize('books'); // 12
 * ```
 */
export function getPaginationSize(contentType: PaginatedContentType): number {
  return PAGINATION_CONFIG[contentType];
}

/**
 * Validates pagination size is within acceptable range
 *
 * @param size - Pagination size to validate
 * @returns true if size is valid, false otherwise
 *
 * @example
 * ```typescript
 * validatePaginationSize(12); // true
 * validatePaginationSize(0);  // false
 * validatePaginationSize(51); // false
 * ```
 */
export function validatePaginationSize(size: number): boolean {
  return size >= PAGINATION_CONFIG.MIN_ITEMS_PER_PAGE && size <= PAGINATION_CONFIG.MAX_ITEMS_PER_PAGE;
}
