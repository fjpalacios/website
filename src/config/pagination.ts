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

  /**
   * UI-related pagination constants
   *
   * These constants control the behavior of pagination UI components,
   * particularly the Paginator component that displays page navigation.
   */
  UI: {
    /**
     * Maximum number of page buttons to display in the paginator
     * @example With MAX_PAGE_BUTTONS = 7: [1] ... [3] [4] [5] [6] [7] ... [10]
     */
    MAX_PAGE_BUTTONS: 7,

    /**
     * Number of initial pages to show when near the beginning
     * @example With INITIAL_PAGES_COUNT = 5: [1] [2] [3] [4] [5] ... [10]
     */
    INITIAL_PAGES_COUNT: 5,

    /**
     * Current page threshold for showing ellipsis at start
     * If current page > START_THRESHOLD, show ellipsis before current page
     * @example With START_THRESHOLD = 4: [1] ... [5] [6] [7] ... [10]
     */
    START_THRESHOLD: 4,

    /**
     * Pages from end threshold for showing ellipsis at end
     * If (totalPages - currentPage) > END_THRESHOLD, show ellipsis after current page
     * @example With END_THRESHOLD = 3: [1] ... [4] [5] [6] ... [10]
     */
    END_THRESHOLD: 3,

    /**
     * Offset from the end when showing final pages
     * Used to calculate which pages to show near the end
     * @example With END_OFFSET = 4: [1] ... [7] [8] [9] [10]
     */
    END_OFFSET: 4,

    /**
     * Number of pages to show around current page (on each side)
     * @example With PAGES_AROUND_CURRENT = 2: [1] ... [3] [4] [5] [6] [7] ... [10]
     *          Current page is 5, shows 2 pages before (3,4) and 2 after (6,7)
     */
    PAGES_AROUND_CURRENT: 2,

    /**
     * First page number (1-based indexing)
     * Used as the starting point for pagination
     */
    FIRST_PAGE: 1,

    /**
     * Minimum gap between page numbers to show ellipsis
     * If gap is <= MIN_GAP_FOR_ELLIPSIS, show consecutive numbers instead
     * @example With MIN_GAP_FOR_ELLIPSIS = 2: [1] [2] [3] [4] instead of [1] ... [4]
     */
    MIN_GAP_FOR_ELLIPSIS: 2,
  },
} as const;

/**
 * Type for content types that support pagination
 */
export type PaginatedContentType = keyof Omit<
  typeof PAGINATION_CONFIG,
  "DEFAULT_ITEMS_PER_PAGE" | "MAX_ITEMS_PER_PAGE" | "MIN_ITEMS_PER_PAGE" | "UI"
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
