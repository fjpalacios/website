/**
 * Helper utilities for AuthorLink component
 * Contains pure functions for author lookup
 */

import { buildAuthorUrl } from "@utils/routes";
import type { CollectionEntry } from "astro:content";

/**
 * Find an author by exact name match
 */
export const findAuthor = (
  authors: CollectionEntry<"authors">[],
  name: string,
): CollectionEntry<"authors"> | undefined => {
  return authors.find((a) => a.data.name === name);
};

/**
 * Generate author URL if author exists
 */
export const generateAuthorUrl = (author: CollectionEntry<"authors"> | undefined, lang: "es" | "en"): string | null => {
  return author ? buildAuthorUrl(lang, author.data.author_slug) : null;
};
