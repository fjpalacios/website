/**
 * Helper utilities for AuthorLink component
 * Contains pure functions for author lookup
 */

import { buildAuthorUrl } from "@utils/routes";
import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Find an author by case-insensitive name match
 */
export const findAuthor = (
  authors: CollectionEntry<"authors">[],
  name: string,
): CollectionEntry<"authors"> | undefined => {
  const searchName = name.toLowerCase();
  return authors.find((a) => a.data.name.toLowerCase() === searchName);
};

/**
 * Generate author URL if author exists
 */
export const generateAuthorUrl = (author: CollectionEntry<"authors"> | undefined, lang: LanguageKey): string | null => {
  return author ? buildAuthorUrl(lang, author.data.author_slug) : null;
};
