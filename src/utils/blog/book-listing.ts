// Book listing utilities
// Helpers for preparing book data for listing pages

import type { CollectionEntry } from "astro:content";

/**
 * Book summary for listing pages
 */
export interface BookSummary {
  title: string;
  slug: string;
  excerpt: string;
  score: number;
  language: "es" | "en";
  date: Date;
  cover: string;
  pages: number;
  authorName?: string;
  authorSlug?: string;
}

/**
 * Prepare a book summary for listing pages
 * @param book - Book entry
 * @param author - Optional author entry
 * @returns Book summary object
 */
export function prepareBookSummary(book: CollectionEntry<"books">, author?: CollectionEntry<"authors">): BookSummary {
  return {
    title: book.data.title,
    slug: book.data.post_slug,
    excerpt: book.data.excerpt,
    score: book.data.score,
    language: book.data.language,
    date: book.data.date,
    cover: book.data.cover,
    pages: book.data.pages,
    authorName: author?.data.name,
    authorSlug: author?.data.author_slug,
  };
}
