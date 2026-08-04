/**
 * Content Date Extraction Helpers
 *
 * Extracted from taxonomyPages.ts to simplify complex date extraction logic.
 * All current content collections use the `date` field.
 *
 * @module utils/content-date
 */

import type { CollectionEntry } from "astro:content";

/**
 * Extract date from content item (post, tutorial, or book)
 *
 * Posts, tutorials, and books all use the `date` field.
 *
 * @param item - Content entry from any collection
 * @returns Date object (or epoch date if no date field exists)
 * @example
 * // Post with date
 * const post = { collection: "posts", data: { date: new Date("2025-01-15") } };
 * extractContentDate(post); // Date(2025-01-15)
 *
 * // Book with date
 * const book = { collection: "books", data: { date: new Date("2024-06-10") } };
 * extractContentDate(book); // Date(2024-06-10)
 *
 */
export function extractContentDate(
  item: CollectionEntry<"posts"> | CollectionEntry<"tutorials"> | CollectionEntry<"books">,
): Date {
  return item.data.date ? new Date(item.data.date) : new Date(0);
}
