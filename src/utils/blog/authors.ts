// Author page utilities
// Helpers for author pages and author-related operations

import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Author summary for author pages
 */
export interface AuthorSummary {
  name: string;
  slug: string;
  bio?: string;
  language: LanguageKey;
  picture?: string;
  gender?: "male" | "female" | "other";
}

/**
 * Get all books by a specific author
 * @param books - Array of all books
 * @param authorSlug - The author's slug
 * @returns Array of books by that author
 */
export function getBooksByAuthor(books: CollectionEntry<"books">[], authorSlug: string): CollectionEntry<"books">[] {
  return books.filter((book) => book.data.author === authorSlug);
}

/**
 * Prepare an author summary for author pages
 * @param author - Author entry
 * @returns Author summary object
 */
export function prepareAuthorSummary(author: CollectionEntry<"authors">): AuthorSummary {
  return {
    name: author.data.name,
    slug: author.data.author_slug,
    bio: author.body,
    language: author.data.language,
    picture: author.data.picture,
    gender: author.data.gender,
  };
}
