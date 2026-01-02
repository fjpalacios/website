// Book page helpers
// Utilities to retrieve and process book data for book detail pages

import type { CollectionEntry } from "astro:content";

/**
 * Find a book by its slug
 * @param books - Array of book entries
 * @param slug - The post_slug of the book
 * @returns The book entry or undefined if not found
 */
export function findBookBySlug(books: CollectionEntry<"books">[], slug: string): CollectionEntry<"books"> | undefined {
  return books.find((book) => book.data.post_slug === slug);
}

/**
 * Find an author by their slug and language
 * @param authors - Array of author entries
 * @param authorSlug - The author_slug reference from a book
 * @param lang - Language to filter by ("es" or "en")
 * @returns The author entry or undefined if not found
 */
export function findAuthorBySlug(
  authors: CollectionEntry<"authors">[],
  authorSlug: string,
  lang?: "es" | "en",
): CollectionEntry<"authors"> | undefined {
  return authors.find(
    (author) => author.data.author_slug === authorSlug && (lang ? author.data.language === lang : true),
  );
}

/**
 * Find a publisher by their slug
 * @param publishers - Array of publisher entries
 * @param publisherSlug - The publisher_slug reference from a book
 * @returns The publisher entry or undefined if not found
 */
export function findPublisherBySlug(
  publishers: CollectionEntry<"publishers">[],
  publisherSlug: string,
): CollectionEntry<"publishers"> | undefined {
  return publishers.find((publisher) => publisher.data.publisher_slug === publisherSlug);
}

/**
 * Find multiple genres by their slugs
 * @param genres - Array of genre entries
 * @param genreSlugs - Array of genre_slug references from a book
 * @returns Array of genre entries (filters out invalid references)
 */
export function findGenresBySlug(
  genres: CollectionEntry<"genres">[],
  genreSlugs: string[],
): CollectionEntry<"genres">[] {
  if (genreSlugs.length === 0) return [];

  return genreSlugs
    .map((slug) => genres.find((genre) => genre.data.genre_slug === slug))
    .filter((genre): genre is CollectionEntry<"genres"> => genre !== undefined);
}

/**
 * Find multiple categories by their slugs
 * @param categories - Array of category entries
 * @param categorySlugs - Array of category_slug references
 * @returns Array of category entries (filters out invalid references)
 */
export function findCategoriesBySlug(
  categories: CollectionEntry<"categories">[],
  categorySlugs: string[],
): CollectionEntry<"categories">[] {
  if (categorySlugs.length === 0) return [];

  return categorySlugs
    .map((slug) => categories.find((category) => category.data.category_slug === slug))
    .filter((category): category is CollectionEntry<"categories"> => category !== undefined);
}

/**
 * Find a series by its slug
 * @param series - Array of series entries
 * @param seriesSlug - The series_slug reference from a book
 * @returns The series entry or undefined if not found
 */
export function findSeriesBySlug(
  series: CollectionEntry<"series">[],
  seriesSlug: string,
): CollectionEntry<"series"> | undefined {
  return series.find((s) => s.data.series_slug === seriesSlug);
}
