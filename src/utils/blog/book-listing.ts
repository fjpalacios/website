// Book listing utilities
// Helpers for preparing book data for listing pages

import type { CollectionEntry } from "astro:content";

/**
 * Book summary for listing pages
 */
export interface BookSummary {
  type: "book";
  title: string;
  slug: string;
  excerpt: string;
  score: number;
  language: "es" | "en";
  date: Date;
  cover: string | undefined;
  pages: number;
  authorName?: string;
  authorSlug?: string;
  series?: string;
  seriesName?: string;
  series_order?: number;
}

/**
 * Normalize cover path to absolute URL
 * Converts relative paths like "./covers/book.jpg" to "/images/books/book.jpg"
 * Returns undefined if no cover is provided (component will use default)
 */
function normalizeCoverPath(cover: string | undefined): string | undefined {
  // Return undefined if no cover provided (let component handle default)
  if (!cover) {
    return undefined;
  }

  if (cover.startsWith("http") || cover.startsWith("/")) {
    return cover;
  }
  // Remove ./ prefix and covers/ directory, then build absolute path
  const filename = cover.replace("./covers/", "").replace("covers/", "");
  return `/images/books/${filename}`;
}

/**
 * Prepare a book summary for listing pages
 * @param book - Book entry
 * @param author - Optional author entry
 * @param series - Optional array of series entries to resolve series name
 * @returns Book summary object
 */
export function prepareBookSummary(
  book: CollectionEntry<"books">,
  author?: CollectionEntry<"authors">,
  series?: CollectionEntry<"series">[],
): BookSummary {
  // For listings, ALWAYS use cover (listing/social image)
  // book_cover is ONLY for detail page (left sidebar with book physical cover)
  const coverImage = book.data.cover;

  // Resolve series name if book belongs to a series and series data is provided
  let seriesName: string | undefined;
  if (book.data.series && series) {
    const bookSeries = series.find((s) => s.data.series_slug === book.data.series);
    seriesName = bookSeries?.data.name;
  }

  return {
    type: "book",
    title: book.data.title,
    slug: book.data.post_slug,
    excerpt: book.data.excerpt,
    score: book.data.score,
    language: book.data.language,
    date: book.data.date,
    cover: normalizeCoverPath(coverImage),
    pages: book.data.pages,
    authorName: author?.data.name,
    authorSlug: author?.data.author_slug,
    series: book.data.series,
    seriesName,
    series_order: book.data.series_order,
  };
}
