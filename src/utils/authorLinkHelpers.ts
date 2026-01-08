/**
 * Helper utilities for AuthorLink component
 * Contains pure functions for author lookup
 */

import { buildAuthorUrl } from "@utils/routes";
import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Detect language from URL pathname
 * @param pathname - URL pathname (e.g., "/en/authors/stephen-king" or "/es/autores/stephen-king")
 * @returns Detected language ("en" or "es"), defaults to "es" if not detected
 *
 * @example
 * detectLanguageFromUrl("/en/authors/stephen-king") // "en"
 * detectLanguageFromUrl("/es/autores/stephen-king") // "es"
 * detectLanguageFromUrl("/unknown/path") // "es" (default)
 */
export const detectLanguageFromUrl = (pathname: string): LanguageKey => {
  return pathname.startsWith("/en/") ? "en" : "es";
};

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
