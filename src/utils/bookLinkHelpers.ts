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
 * Normalize a string for search comparison
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes accents/diacritics
 */
const normalizeForSearch = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
};

/**
 * Find a book review by title
 *
 * This function searches for reviews that match the book title from shelf.
 * It handles partial matching since reviews have format "Title, de Author"
 * while shelf has just "Title".
 *
 * @param allBooks - Array of book reviews to search
 * @param bookTitle - Title to search for (from shelf.ts)
 * @returns Matching book review or undefined
 *
 * @example
 * // Searching for "1984" will match "1984, de George Orwell"
 * // Searching for "Apocalipsis" will match "Apocalipsis, de Stephen King"
 */
export function findBookReview(
  allBooks: CollectionEntry<"books">[],
  bookTitle: string,
): CollectionEntry<"books"> | undefined {
  const normalizedSearchTitle = normalizeForSearch(bookTitle);

  return allBooks.find((book) => {
    const normalizedTitle = normalizeForSearch(book.data.title);

    // Exact match
    if (normalizedTitle === normalizedSearchTitle) {
      return true;
    }

    // Check if review title starts with shelf title
    // This handles cases like "1984" matching "1984, de George Orwell"
    if (normalizedTitle.startsWith(normalizedSearchTitle)) {
      // Make sure it's followed by comma or end of string to avoid false matches
      const afterMatch = normalizedTitle.substring(normalizedSearchTitle.length);
      if (afterMatch === "" || afterMatch.startsWith(",") || afterMatch.startsWith(" ")) {
        return true;
      }
    }

    // Check against originalTitle if it exists (for future cross-language matching)
    if (book.data.originalTitle) {
      const normalizedOriginalTitle = normalizeForSearch(book.data.originalTitle);
      if (normalizedOriginalTitle === normalizedSearchTitle) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Classify books by review language availability
 *
 * Groups books into three categories:
 * 1. Books with reviews in the current language
 * 2. Books with reviews in other languages
 * 3. Books without any reviews
 *
 * @param allBooks - All available book reviews (all languages)
 * @param shelfBooks - Books from the shelf
 * @param currentLang - Current language to filter by
 * @returns Object with three arrays of classified books
 */
export function classifyBooksByReviewLanguage<T extends { title: string }>(
  allBooks: CollectionEntry<"books">[],
  shelfBooks: T[],
  currentLang: LanguageKey,
): {
  inCurrentLang: Array<T & { review: CollectionEntry<"books"> }>;
  inOtherLangs: Array<T & { review: CollectionEntry<"books"> }>;
  withoutReview: T[];
} {
  const inCurrentLang: Array<T & { review: CollectionEntry<"books"> }> = [];
  const inOtherLangs: Array<T & { review: CollectionEntry<"books"> }> = [];
  const withoutReview: T[] = [];

  for (const book of shelfBooks) {
    const review = findBookReview(allBooks, book.title);

    if (!review) {
      withoutReview.push(book);
    } else if (review.data.language === currentLang) {
      inCurrentLang.push({ ...book, review });
    } else {
      inOtherLangs.push({ ...book, review });
    }
  }

  return { inCurrentLang, inOtherLangs, withoutReview };
}

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
