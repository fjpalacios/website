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
 * Find a book by title and language
 * Uses exact match first, then falls back to word boundary matching
 */
export const findBook = (
  books: CollectionEntry<"books">[],
  title: string,
  lang: LanguageKey,
): CollectionEntry<"books"> | undefined => {
  // Parse the search title to extract just the book name (without author)
  const searchTitle = parseTitle(title).bookTitle.toLowerCase().trim();

  // Filter books by language first
  const langBooks = books.filter((b) => b.data.language === lang);

  // Try exact match first (case-insensitive)
  const exactMatch = langBooks.find((b) => b.data.title.toLowerCase().trim() === searchTitle);
  if (exactMatch) {
    return exactMatch;
  }

  // Try matching the first part before comma (many books are "Title, Author")
  const exactTitlePartMatch = langBooks.find((b) => {
    const bookTitlePart = b.data.title.split(",")[0].toLowerCase().trim();
    return bookTitlePart === searchTitle;
  });
  if (exactTitlePartMatch) {
    return exactTitlePartMatch;
  }

  // Fall back to word boundary matching to avoid partial matches like "It" matching "Diez negritos"
  // This regex ensures "It" only matches if it's a complete word
  const searchRegex = new RegExp(`\\b${searchTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return langBooks.find((b) => searchRegex.test(b.data.title));
};

/**
 * Find a book review, prioritizing Spanish (main review language)
 * Falls back to English only if Spanish doesn't exist
 *
 * This function is used for the bookshelf where reviews are primarily in Spanish,
 * but we want both language versions of the shelf to link to available reviews.
 */
export const findBookReview = (
  books: CollectionEntry<"books">[],
  title: string,
): CollectionEntry<"books"> | undefined => {
  // Always try Spanish first (main review language)
  const inSpanish = findBook(books, title, "es");
  if (inSpanish) {
    return inSpanish;
  }

  // Fallback to English (rare case, for future English reviews)
  return findBook(books, title, "en");
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
