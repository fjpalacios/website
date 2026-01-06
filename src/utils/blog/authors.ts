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
  bio: string;
  language: LanguageKey;
  birthYear?: number;
  deathYear?: number;
  nationality?: string;
  picture?: string;
  website?: string;
  twitter?: string;
  goodreads?: string;
  wikipedia?: string;
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
    bio: author.data.bio,
    language: author.data.language,
    birthYear: author.data.birth_year,
    deathYear: author.data.death_year,
    nationality: author.data.nationality,
    picture: author.data.picture,
    website: author.data.website,
    twitter: author.data.twitter,
    goodreads: author.data.goodreads,
    wikipedia: author.data.wikipedia,
    gender: author.data.gender,
  };
}
