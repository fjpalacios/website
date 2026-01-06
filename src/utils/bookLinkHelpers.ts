/**
 * Helper utilities for BookLink component
 * Contains pure functions for book lookup and title parsing
 */

import { buildBookUrl } from "@utils/routes";
import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Detect language from URL pathname
 * @param pathname - URL pathname (e.g., "/en/books/the-stand" or "/es/libros/apocalipsis")
 * @returns Detected language ("en" or "es"), defaults to "es" if not detected
 *
 * @example
 * detectLanguageFromUrl("/en/books/the-stand") // "en"
 * detectLanguageFromUrl("/es/libros/apocalipsis") // "es"
 * detectLanguageFromUrl("/unknown/path") // "es" (default)
 */
export const detectLanguageFromUrl = (pathname: string): LanguageKey => {
  return pathname.startsWith("/en/") ? "en" : "es";
};

/**
 * Parse a book title in format "Title, Author" or just "Title"
 */
export const parseTitle = (titleStr: string) => {
  const parts = titleStr.split(", ");
  return {
    bookTitle: parts[0],
    author: parts.slice(1).join(", ") || "", // Handle multiple commas
  };
};

/**
 * Find a book by title (supports partial matching) and language
 */
export const findBook = (
  books: CollectionEntry<"books">[],
  title: string,
  lang: LanguageKey,
): CollectionEntry<"books"> | undefined => {
  // Parse the search title to extract just the book name (without author)
  const searchTitle = parseTitle(title).bookTitle;

  return books.find((b) => b.data.title.includes(searchTitle) && b.data.language === lang);
};

/**
 * Generate display text for book link
 */
export const generateDisplayTitle = (title: string, full: boolean, book?: CollectionEntry<"books">): string => {
  if (book) {
    const bookData = parseTitle(book.data.title);
    if (full && bookData.author) {
      return `<em>${bookData.bookTitle}</em>, ${bookData.author}`;
    }
    return `<em>${bookData.bookTitle}</em>`;
  }

  // Fallback if book not found
  const parsedTitle = parseTitle(title);
  if (full && parsedTitle.author) {
    return `<em>${parsedTitle.bookTitle}</em>, ${parsedTitle.author}`;
  }
  return `<em>${parsedTitle.bookTitle}</em>`;
};

/**
 * Generate book URL if book exists
 */
export const generateBookUrl = (book: CollectionEntry<"books"> | undefined, lang: LanguageKey): string | null => {
  return book ? buildBookUrl(lang, book.data.post_slug) : null;
};
