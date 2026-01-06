/**
 * Content Date Extraction Helpers
 *
 * Extracted from taxonomyPages.ts to simplify complex date extraction logic.
 * Handles different date field names across content types (posts/tutorials use `date`, books use `read_start_date`).
 *
 * @module utils/content-date
 */

import type { CollectionEntry } from "astro:content";

/**
 * Extract date from content item (post, tutorial, or book)
 *
 * Different content types use different date fields:
 * - Posts and Tutorials: `date` field
 * - Books: `read_start_date` field
 *
 * @param item - Content entry from any collection
 * @returns Date object (or epoch date if no date field exists)
 * @example
 * // Post with date
 * const post = { collection: "posts", data: { date: new Date("2025-01-15") } };
 * extractContentDate(post); // Date(2025-01-15)
 *
 * // Book with read_start_date
 * const book = { collection: "books", data: { read_start_date: new Date("2024-06-10") } };
 * extractContentDate(book); // Date(2024-06-10)
 *
 * // Content without date
 * const content = { collection: "posts", data: {} };
 * extractContentDate(content); // Date(0) - epoch date
 */
export function extractContentDate(
  item: CollectionEntry<"posts"> | CollectionEntry<"tutorials"> | CollectionEntry<"books">,
): Date {
  // Books use read_start_date
  if ("read_start_date" in item.data && item.data.read_start_date) {
    return new Date(item.data.read_start_date);
  }

  // Posts and Tutorials use date
  if ("date" in item.data && item.data.date) {
    return new Date(item.data.date);
  }

  // Fallback: epoch date (Jan 1, 1970)
  return new Date(0);
}
