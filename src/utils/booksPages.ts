/**
 * Shared logic for books listing pages
 * Used by both /es/libros/ and /en/books/
 */

import { getCollection } from "astro:content";

import type { ContactItem } from "@/types/content";
import {
  filterByLanguage,
  findAuthorBySlug,
  getPageCount,
  prepareBookSummary,
  sortByDate,
  type BookSummary,
} from "@/utils/blog";

export const BOOKS_PER_PAGE = 12;

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
    const author = findAuthorBySlug(allAuthors, book.data.author);
    return prepareBookSummary(book, author);
  });
}

/**
 * Generate static paths for books pagination pages (page 2+)
 */
export async function generateBooksPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedBooks = await getAllBooksForLanguage(lang);
  const totalPages = getPageCount(sortedBooks.length, BOOKS_PER_PAGE);
  const paths = [];

  // Generate paths for each page (starting from page 2)
  for (let page = 2; page <= totalPages; page++) {
    const start = (page - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;

    paths.push({
      page: page.toString(),
      props: {
        lang,
        books: sortedBooks.slice(start, end),
        currentPage: page,
        totalPages,
        contact,
      },
    });
  }

  return paths;
}

/**
 * Generate static paths for book detail pages
 */
export async function generateBookDetailPaths(lang: string, contact: ContactItem[]) {
  const books = await getCollection("books");
  const langBooks = books.filter((book) => book.data.language === lang);

  return langBooks.map((book) => ({
    slug: book.data.post_slug,
    props: {
      bookEntry: book,
      lang,
      contact,
    },
  }));
}
