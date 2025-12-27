/**
 * Shared logic for books listing pages
 * Used by both /es/libros/ and /en/books/
 */

import { getCollection } from "astro:content";

import { PAGINATION_CONFIG } from "@/config/pagination";
import type { ContactItem } from "@/types/content";
import { filterByLanguage, findAuthorBySlug, prepareBookSummary, sortByDate, type BookSummary } from "@/utils/blog";
import { generateDetailPaths, generatePaginationPaths } from "@/utils/pagination/generator";

export const BOOKS_PER_PAGE = PAGINATION_CONFIG.books;

/**
 * Get all books for a language, sorted by date
 */
export async function getAllBooksForLanguage(lang: string): Promise<BookSummary[]> {
  // Get all books and authors
  const allBooks = await getCollection("books");
  const allAuthors = await getCollection("authors");

  // Filter by language and exclude drafts
  const langBooks = filterByLanguage(allBooks, lang).filter((book) => !book.data.draft);

  // Sort by date (newest first)
  const sortedBooks = sortByDate(langBooks, "desc");

  // Prepare summaries with author info
  return sortedBooks.map((book) => {
    const author = findAuthorBySlug(allAuthors, book.data.author, lang as "es" | "en");
    return prepareBookSummary(book, author);
  });
}

/**
 * Generate static paths for books pagination pages (page 2+)
 */
export async function generateBooksPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedBooks = await getAllBooksForLanguage(lang);

  return generatePaginationPaths({
    items: sortedBooks,
    itemsPerPage: BOOKS_PER_PAGE,
    lang,
    contact,
    itemsKey: "books",
  });
}

/**
 * Generate static paths for book detail pages
 */
export async function generateBookDetailPaths(lang: string, contact: ContactItem[]) {
  const books = await getCollection("books");

  return generateDetailPaths({
    entries: books,
    lang,
    contact,
    entryKey: "bookEntry",
  });
}
