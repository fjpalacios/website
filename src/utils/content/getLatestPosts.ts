/**
 * Get Latest Posts Utility
 *
 * Queries all content collections (posts, tutorials, books), filters by language,
 * excludes drafts, and returns the N most recent items sorted by date.
 *
 * This utility was extracted from the LatestPosts component to make the logic
 * reusable across different parts of the application.
 *
 * @module utils/content/getLatestPosts
 */

import { filterByLanguage } from "@utils/blog";
import type { PostSummary } from "@utils/blog";
import { getCollection } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Get the latest posts from all content collections
 *
 * @param language - The language to filter by ('es' | 'en')
 * @param maxItems - Maximum number of items to return (default: 4)
 * @returns Array of PostSummary objects sorted by date (newest first)
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
export async function getLatestPosts(language: LanguageKey, maxItems: number = 4): Promise<PostSummary[]> {
  // Handle edge case: limit of 0
  if (maxItems === 0) {
    return [];
  }

  // Get all content types
  const allPosts = await getCollection("posts");
  const allTutorials = await getCollection("tutorials");
  const allBooks = await getCollection("books");

  // Filter by language and exclude drafts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic content collection access requires any
  const langPosts = filterByLanguage(allPosts, language).filter((post) => !(post.data as any).draft);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic content collection access requires any
  const langTutorials = filterByLanguage(allTutorials, language).filter((tutorial) => !(tutorial.data as any).draft);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic content collection access requires any
  const langBooks = filterByLanguage(allBooks, language) as any;

  // Prepare combined content with unified structure

  const combinedContent: PostSummary[] = [
    ...langPosts.map((post) => ({
      type: "post" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      slug: (post.data as any).post_slug,
      title: post.data.title,
      date: post.data.date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      excerpt: (post.data as any).excerpt,
      language: post.data.language,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      cover: (post.data as any).cover || (post.data as any).featured_image,
    })),
    ...langTutorials.map((tutorial) => ({
      type: "tutorial" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      slug: (tutorial.data as any).post_slug,
      title: tutorial.data.title,
      date: tutorial.data.date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      excerpt: (tutorial.data as any).excerpt,
      language: tutorial.data.language,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic field access
      cover: (tutorial.data as any).cover || (tutorial.data as any).featured_image,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic content mapping
    ...langBooks.map((book: any) => ({
      type: "book" as const,
      slug: book.data.post_slug,
      title: book.data.title,
      date: book.data.date,
      excerpt: book.data.excerpt,
      language: book.data.language,
      cover: book.data.cover,
    })),
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
