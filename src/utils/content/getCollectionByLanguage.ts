/**
 * Content Collection Utilities by Language
 *
 * Provides type-safe helpers to fetch content collections filtered by language.
 * Eliminates repetitive getCollection + filter patterns across templates.
 */

import { getCollection, type CollectionEntry } from "astro:content";

import type { Language } from "@/utils/routes";

/**
 * Collection names that support language filtering
 * (excludes 'books' and 'authors' which are language-agnostic)
 */
type LanguageFilterableCollection =
  | "posts"
  | "tutorials"
  | "categories"
  | "publishers"
  | "genres"
  | "series"
  | "challenges"
  | "courses";

/**
 * Get collection entries filtered by language
 *
 * @param collection - Collection name
 * @param lang - Language code (es | en)
 * @returns Array of collection entries matching the language
 *
 * @example
 * ```ts
 * // Instead of:
 * const allCategories = await getCollection("categories", (c) => c.data.language === lang);
 *
 * // Use:
 * const allCategories = await getCollectionByLanguage("categories", lang);
 * ```
 */
export async function getCollectionByLanguage<T extends LanguageFilterableCollection>(
  collection: T,
  lang: Language,
): Promise<CollectionEntry<T>[]> {
  return await getCollection(collection, (entry) => {
    // Type assertion needed because TypeScript can't infer the exact schema type
    return (entry.data as { language?: Language }).language === lang;
  });
}

/**
 * Get all entries from a collection (no language filter)
 *
 * Useful for language-agnostic collections like 'books' and 'authors'
 *
 * @param collection - Collection name
 * @returns Array of all collection entries
 *
 * @example
 * ```ts
 * const allAuthors = await getAllFromCollection("authors");
 * const allBooks = await getAllFromCollection("books");
 * ```
 */
export async function getAllFromCollection<T extends "books" | "authors">(
  collection: T,
): Promise<CollectionEntry<T>[]> {
  return await getCollection(collection);
}
