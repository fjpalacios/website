/**
 * Pagination utilities for blog content
 */

import { PAGINATION_CONFIG } from "../../config/pagination";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pageRange: (number | "...")[];
}

/**
 * Calculate the total number of pages needed for pagination
 *
 * @param totalItems - Total number of items to paginate
 * @param itemsPerPage - Number of items to show per page
 * @returns Total number of pages
 *
 * @example
 * getPageCount(100, 10) // => 10
 * getPageCount(101, 10) // => 11
 * getPageCount(5, 10) // => 1
 */
export function getPageCount(totalItems: number, itemsPerPage: number): number {
  // Validate inputs
  if (!Number.isInteger(totalItems)) {
    throw new Error("Total items must be an integer");
  }
  if (!Number.isInteger(itemsPerPage)) {
    throw new Error("Items per page must be an integer");
  }
  if (totalItems < 0) {
    throw new Error("Total items must be non-negative");
  }
  if (itemsPerPage <= 0) {
    throw new Error("Items per page must be positive");
  }

  if (totalItems === 0) return 0;

  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Get a slice of items for a specific page
 *
 * @param items - Array of items to paginate
 * @param page - Current page number (1-indexed)
 * @param perPage - Number of items per page
 * @returns Slice of items for the requested page
 *
 * @example
 * const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * paginateItems(items, 1, 5) // => [1, 2, 3, 4, 5]
 * paginateItems(items, 2, 5) // => [6, 7, 8, 9, 10]
 */
export function paginateItems<T>(items: T[], page: number, perPage: number): T[] {
  // Validate inputs
  if (!Number.isInteger(page)) {
    throw new Error("Page must be an integer");
  }
  if (!Number.isInteger(perPage)) {
    throw new Error("Items per page must be an integer");
  }
  if (page < PAGINATION_CONFIG.UI.FIRST_PAGE) {
    throw new Error(`Page must be at least ${PAGINATION_CONFIG.UI.FIRST_PAGE}`);
  }
  if (perPage <= 0) {
    throw new Error("Items per page must be positive");
  }

  const startIndex = (page - PAGINATION_CONFIG.UI.FIRST_PAGE) * perPage;
  const endIndex = startIndex + perPage;

  return items.slice(startIndex, endIndex);
}

/**
 * Generate pagination information for UI rendering
 *
 * @param currentPage - Current page number (1-indexed)
 * @param totalPages - Total number of pages
 * @returns Pagination information object
 *
 * @example
 * getPaginationInfo(3, 5)
 * // => {
 * //   currentPage: 3,
 * //   totalPages: 5,
 * //   hasNextPage: true,
 * //   hasPrevPage: true,
 * //   nextPage: 4,
 * //   prevPage: 2,
 * //   pageRange: [1, 2, 3, 4, 5]
 * // }
 */
export function getPaginationInfo(currentPage: number, totalPages: number): PaginationInfo {
  // Validate inputs
  if (!Number.isInteger(currentPage)) {
    throw new Error("Current page must be an integer");
  }
  if (!Number.isInteger(totalPages)) {
    throw new Error("Total pages must be an integer");
  }
  if (currentPage < PAGINATION_CONFIG.UI.FIRST_PAGE) {
    throw new Error(`Current page must be at least ${PAGINATION_CONFIG.UI.FIRST_PAGE}`);
  }
  if (totalPages < PAGINATION_CONFIG.UI.FIRST_PAGE) {
    throw new Error(`Total pages must be at least ${PAGINATION_CONFIG.UI.FIRST_PAGE}`);
  }
  if (currentPage > totalPages) {
    throw new Error("Current page cannot exceed total pages");
  }

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > PAGINATION_CONFIG.UI.FIRST_PAGE;

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null,
    pageRange: generatePageRange(currentPage, totalPages),
  };
}

/**
 * Generate an array representing the page range for pagination UI
 * Shows first page, last page, current page and surrounding pages, with ellipsis
 *
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis
 *
 * @example
 * generatePageRange(2, 5) // => [1, 2, 3, 4, 5]
 * generatePageRange(8, 15) // => [1, '...', 6, 7, 8, 9, 10, '...', 15]
 */
function generatePageRange(currentPage: number, totalPages: number): (number | "...")[] {
  const {
    MAX_PAGE_BUTTONS,
    INITIAL_PAGES_COUNT,
    START_THRESHOLD,
    END_THRESHOLD,
    END_OFFSET,
    PAGES_AROUND_CURRENT,
    FIRST_PAGE,
  } = PAGINATION_CONFIG.UI;

  // If MAX_PAGE_BUTTONS or fewer pages, show all
  if (totalPages <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, i) => i + FIRST_PAGE);
  }

  const range: (number | "...")[] = [];

  // If current page is near the beginning (pages 1-START_THRESHOLD)
  if (currentPage <= START_THRESHOLD) {
    for (let i = FIRST_PAGE; i <= INITIAL_PAGES_COUNT; i++) {
      range.push(i);
    }
    range.push("...");
    range.push(totalPages);
    return range;
  }

  // If current page is near the end (last END_OFFSET pages)
  if (currentPage >= totalPages - END_THRESHOLD) {
    range.push(FIRST_PAGE);
    range.push("...");
    for (let i = totalPages - END_OFFSET; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  // Current page is in the middle
  range.push(FIRST_PAGE);
  range.push("...");

  // Show PAGES_AROUND_CURRENT pages before and after current
  for (let i = currentPage - PAGES_AROUND_CURRENT; i <= currentPage + PAGES_AROUND_CURRENT; i++) {
    range.push(i);
  }

  range.push("...");
  range.push(totalPages);

  return range;
}
