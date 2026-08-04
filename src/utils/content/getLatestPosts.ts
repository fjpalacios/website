/**
 * Get Latest Posts Utility
 *
 * Queries all content collections (posts, tutorials, books), filters by language,
 * and returns the N most recent items sorted by date.
 *
 * This utility was extracted from the LatestPosts component to make the logic
 * reusable across different parts of the application.
 *
 * @module utils/content/getLatestPosts
 */

import {
  filterByLanguage,
  prepareBookSummary,
  preparePostSummary,
  prepareTutorialSummary,
  type ContentSummary,
} from "@utils/blog";
import { getCollection } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Get the latest posts from all content collections
 *
 * @param language - The language to filter by ('es' | 'en')
 * @param maxItems - Maximum number of items to return (default: 4)
 * @returns Array of content summaries sorted by date (newest first)
 *
 * @example
 * ```typescript
 * // Get latest 4 posts in Spanish
 * const latestPosts = await getLatestPosts("es", 4);
 *
 * // Get latest 10 posts in English
 * const latestPosts = await getLatestPosts("en", 10);
 * ```
 */
export async function getLatestPosts(language: LanguageKey, maxItems: number = 4): Promise<ContentSummary[]> {
  // Handle edge case: limit of 0
  if (maxItems === 0) {
    return [];
  }

  // Get all content types
  const allPosts = await getCollection("posts");
  const allTutorials = await getCollection("tutorials");
  const allBooks = await getCollection("books");

  // Filter by language
  const langPosts = filterByLanguage(allPosts, language);
  const langTutorials = filterByLanguage(allTutorials, language);
  const langBooks = filterByLanguage(allBooks, language);

  // Prepare combined content with unified structure

  const combinedContent: ContentSummary[] = [
    ...langPosts.map(preparePostSummary),
    ...langTutorials.map((tutorial) => prepareTutorialSummary(tutorial)),
    ...langBooks.map((book) => prepareBookSummary(book)),
  ];

  // Sort by date (newest first) and limit
  return combinedContent
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, maxItems);
}
