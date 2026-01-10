/**
 * Book Statistics Utilities
 *
 * Pure functions for calculating and aggregating book statistics.
 * Used in /es/libros/estadisticas and /en/books/stats
 *
 * All functions are synchronous and receive collection data as parameters,
 * following the project's pattern for testable, pure utility functions.
 *
 * @module utils/blog/book-stats
 */

import type { CollectionEntry } from "astro:content";

import { challengesConfig } from "@/config/challenges";
import type { LanguageKey } from "@/config/languages";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ScoreDistribution {
  fav: number;
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface AuthorsByGender {
  male: CollectionEntry<"authors">[];
  female: CollectionEntry<"authors">[];
}

export interface GenresByType {
  fiction: CollectionEntry<"genres">[];
  nonFiction: CollectionEntry<"genres">[];
}

export interface PublisherWithCount {
  publisher: CollectionEntry<"publishers">;
  count: number;
}

export interface SeriesWithCount {
  series: CollectionEntry<"series">;
  count: number;
}

export interface GenreWithCount {
  genre: CollectionEntry<"genres">;
  count: number;
}

export interface GenresWithCountByType {
  fiction: GenreWithCount[];
  nonFiction: GenreWithCount[];
}

export interface ChallengeProgress {
  challenge: CollectionEntry<"challenges">;
  completed: number;
  total: number;
  percentage: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Active challenge IDs
 */
const ACTIVE_CHALLENGE_IDS = ["stephen-king", "pesadillas", "155-libros"] as const;

/**
 * Challenge total counts (imported from centralized config)
 */
const CHALLENGE_TOTALS: Record<string, number> = Object.fromEntries(
  Object.entries(challengesConfig).map(([key, config]) => [key, config.goal]),
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Filter books by language
 */
function filterBooksByLanguage(books: CollectionEntry<"books">[], lang: LanguageKey): CollectionEntry<"books">[] {
  return books.filter((book) => book.data.language === lang);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// TOTAL COUNTS
// ============================================================================

/**
 * Get total number of books read in a language
 * @param books - All books collection
 * @param lang - Language to filter by
 * @returns Total number of books
 */
export function getTotalBooks(books: CollectionEntry<"books">[], lang: LanguageKey): number {
  return filterBooksByLanguage(books, lang).length;
}

/**
 * Get total number of unique authors in a language
 * @param books - All books collection
 * @param authors - All authors collection
 * @param lang - Language to filter by
 * @returns Total number of unique authors
 */
export function getTotalAuthors(
  books: CollectionEntry<"books">[],
  authors: CollectionEntry<"authors">[],
  lang: LanguageKey,
): number {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique author IDs from books
  const authorIds = new Set(filteredBooks.map((book) => book.data.author));

  // Filter authors that exist in the collection and match language
  const authorsInLanguage = authors.filter(
    (author) => authorIds.has(author.data.author_slug) && author.data.language === lang,
  );

  return authorsInLanguage.length;
}

/**
 * Get total number of genres in a language
 * @param books - All books collection
 * @param genres - All genres collection
 * @param lang - Language to filter by
 * @returns Total number of genres
 */
export function getTotalGenres(
  books: CollectionEntry<"books">[],
  genres: CollectionEntry<"genres">[],
  lang: LanguageKey,
): number {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique genre IDs from books
  const genreIds = new Set<string>();
  filteredBooks.forEach((book) => {
    if (book.data.genres) {
      book.data.genres.forEach((genreId: string) => genreIds.add(genreId));
    }
  });

  // Filter genres that exist in the collection and match language
  const genresInLanguage = genres.filter(
    (genre) => genreIds.has(genre.data.genre_slug) && genre.data.language === lang,
  );

  return genresInLanguage.length;
}

/**
 * Get total number of publishers in a language
 * @param books - All books collection
 * @param publishers - All publishers collection
 * @param lang - Language to filter by
 * @returns Total number of publishers
 */
export function getTotalPublishers(
  books: CollectionEntry<"books">[],
  publishers: CollectionEntry<"publishers">[],
  lang: LanguageKey,
): number {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique publisher IDs from books
  const publisherIds = new Set(
    filteredBooks.filter((book) => book.data.publisher).map((book) => book.data.publisher as string),
  );

  // Filter publishers that exist in the collection and match language
  const publishersInLanguage = publishers.filter(
    (publisher) => publisherIds.has(publisher.data.publisher_slug) && publisher.data.language === lang,
  );

  return publishersInLanguage.length;
}

/**
 * Get total number of series in a language
 * @param books - All books collection
 * @param series - All series collection
 * @param lang - Language to filter by
 * @returns Total number of series
 */
export function getTotalSeries(
  books: CollectionEntry<"books">[],
  series: CollectionEntry<"series">[],
  lang: LanguageKey,
): number {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique series IDs from books
  const seriesIds = new Set(filteredBooks.filter((book) => book.data.series).map((book) => book.data.series as string));

  // Filter series that exist in the collection and match language
  const seriesInLanguage = series.filter((s) => seriesIds.has(s.data.series_slug) && s.data.language === lang);

  return seriesInLanguage.length;
}

// ============================================================================
// SCORE DISTRIBUTION
// ============================================================================

/**
 * Get distribution of book scores in a language
 * @param books - All books collection
 * @param lang - Language to filter by
 * @returns Score distribution object
 */
export function getScoreDistribution(books: CollectionEntry<"books">[], lang: LanguageKey): ScoreDistribution {
  const filteredBooks = filterBooksByLanguage(books, lang);

  const distribution: ScoreDistribution = {
    fav: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  filteredBooks.forEach((book) => {
    const score = book.data.score;
    if (score === "fav") {
      distribution.fav++;
    } else if (typeof score === "number" && score >= 1 && score <= 5) {
      distribution[score as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  return distribution;
}

// ============================================================================
// AUTHORS BY GENDER
// ============================================================================

/**
 * Get all authors separated by gender, sorted by sortOrder
 * @param books - All books collection
 * @param authors - All authors collection
 * @param lang - Language to filter by
 * @returns Authors separated by gender
 */
export function getAuthorsByGender(
  books: CollectionEntry<"books">[],
  authors: CollectionEntry<"authors">[],
  lang: LanguageKey,
): AuthorsByGender {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique author IDs from books
  const authorIds = new Set(filteredBooks.map((book) => book.data.author));

  // Filter authors that have books in this language
  const authorsInLanguage = authors.filter(
    (author) => authorIds.has(author.data.author_slug) && author.data.language === lang,
  );

  // Sort by sortName (or name if sortName is not available)
  const sortedAuthors = authorsInLanguage.sort((a, b) => {
    const sortA = a.data.sortName || a.data.name;
    const sortB = b.data.sortName || b.data.name;
    return sortA.localeCompare(sortB, lang);
  });

  // Separate by gender
  const male = sortedAuthors.filter((author) => author.data.gender === "male");
  const female = sortedAuthors.filter((author) => author.data.gender === "female");

  return { male, female };
}

// ============================================================================
// GENRES BY TYPE
// ============================================================================

/**
 * Get all genres separated by fiction/non-fiction
 * @param books - All books collection
 * @param genres - All genres collection
 * @param lang - Language to filter by
 * @returns Genres separated by type
 */
export function getGenresByType(
  books: CollectionEntry<"books">[],
  genres: CollectionEntry<"genres">[],
  lang: LanguageKey,
): GenresByType {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Get unique genre IDs from books
  const genreIds = new Set<string>();
  filteredBooks.forEach((book) => {
    if (book.data.genres) {
      book.data.genres.forEach((genreId: string) => genreIds.add(genreId));
    }
  });

  // Filter genres that have books in this language
  const genresInLanguage = genres.filter(
    (genre) => genreIds.has(genre.data.genre_slug) && genre.data.language === lang,
  );

  // Separate by type (handle undefined type as fiction by default)
  const fiction = genresInLanguage.filter((genre) => !genre.data.type || genre.data.type === "fiction");
  const nonFiction = genresInLanguage.filter((genre) => genre.data.type === "non-fiction");

  return { fiction, nonFiction };
}

/**
 * Get all genres with book count, separated by fiction/non-fiction
 * @param books - All books collection
 * @param genres - All genres collection
 * @param lang - Language to filter by
 * @returns Genres with counts separated by type
 */
export function getGenresWithCount(
  books: CollectionEntry<"books">[],
  genres: CollectionEntry<"genres">[],
  lang: LanguageKey,
): GenresWithCountByType {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Count books per genre
  const genreCounts = new Map<string, number>();
  filteredBooks.forEach((book) => {
    if (book.data.genres) {
      book.data.genres.forEach((genreId: string) => {
        const count = genreCounts.get(genreId) || 0;
        genreCounts.set(genreId, count + 1);
      });
    }
  });

  // Build result arrays
  const fictionResult: GenreWithCount[] = [];
  const nonFictionResult: GenreWithCount[] = [];

  genres.forEach((genre) => {
    const count = genreCounts.get(genre.data.genre_slug);
    if (count && genre.data.language === lang) {
      const genreWithCount = { genre, count };
      if (!genre.data.type || genre.data.type === "fiction") {
        fictionResult.push(genreWithCount);
      } else {
        nonFictionResult.push(genreWithCount);
      }
    }
  });

  // Sort by count (descending), then alphabetically
  const sortFn = (a: GenreWithCount, b: GenreWithCount) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.genre.data.name.localeCompare(b.genre.data.name, lang);
  };

  fictionResult.sort(sortFn);
  nonFictionResult.sort(sortFn);

  return { fiction: fictionResult, nonFiction: nonFictionResult };
}

// ============================================================================
// PUBLISHERS AND SERIES WITH COUNTS
// ============================================================================

/**
 * Get all publishers with book count, sorted alphabetically
 * @param books - All books collection
 * @param publishers - All publishers collection
 * @param lang - Language to filter by
 * @returns Array of publishers with book counts
 */
/**
 * Get all publishers with book count, sorted by book count (descending)
 * @param books - All books collection
 * @param publishers - All publishers collection
 * @param lang - Language to filter by
 * @returns Array of publishers with book counts, sorted by count (highest first), then alphabetically
 */
export function getPublishersWithCount(
  books: CollectionEntry<"books">[],
  publishers: CollectionEntry<"publishers">[],
  lang: LanguageKey,
): PublisherWithCount[] {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Count books per publisher
  const publisherCounts = new Map<string, number>();
  filteredBooks.forEach((book) => {
    if (book.data.publisher) {
      const count = publisherCounts.get(book.data.publisher) || 0;
      publisherCounts.set(book.data.publisher, count + 1);
    }
  });

  // Build result array
  const result: PublisherWithCount[] = [];
  publishers.forEach((publisher) => {
    const count = publisherCounts.get(publisher.data.publisher_slug);
    if (count && publisher.data.language === lang) {
      result.push({ publisher, count });
    }
  });

  // Sort by count (descending), then alphabetically
  result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count; // Higher count first
    }
    return a.publisher.data.name.localeCompare(b.publisher.data.name, lang);
  });

  return result;
}

/**
 * Get all series with book count, sorted by book count (descending)
 * @param books - All books collection
 * @param series - All series collection
 * @param lang - Language to filter by
 * @returns Array of series with book counts, sorted by count (highest first), then alphabetically
 */
export function getSeriesWithCount(
  books: CollectionEntry<"books">[],
  series: CollectionEntry<"series">[],
  lang: LanguageKey,
): SeriesWithCount[] {
  const filteredBooks = filterBooksByLanguage(books, lang);

  // Count books per series
  const seriesCounts = new Map<string, number>();
  filteredBooks.forEach((book) => {
    if (book.data.series) {
      const count = seriesCounts.get(book.data.series) || 0;
      seriesCounts.set(book.data.series, count + 1);
    }
  });

  // Build result array
  const result: SeriesWithCount[] = [];
  series.forEach((s) => {
    const count = seriesCounts.get(s.data.series_slug);
    if (count && s.data.language === lang) {
      result.push({ series: s, count });
    }
  });

  // Sort by count (descending), then alphabetically
  result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count; // Higher count first
    }
    return a.series.data.name.localeCompare(b.series.data.name, lang);
  });

  return result;
}

// ============================================================================
// SPECIAL LISTS
// ============================================================================

/**
 * Get random favorite books
 * @param books - All books collection
 * @param lang - Language to filter by
 * @param limit - Maximum number of books to return
 * @returns Array of random favorite books
 */
export function getRandomFavorites(
  books: CollectionEntry<"books">[],
  lang: LanguageKey,
  limit: number,
): CollectionEntry<"books">[] {
  const filteredBooks = filterBooksByLanguage(books, lang);
  const favorites = filteredBooks.filter((book) => book.data.score === "fav");
  const shuffled = shuffleArray(favorites);
  return shuffled.slice(0, limit);
}

/**
 * Get random 5-star books (or all if limit not specified)
 * @param books - All books collection
 * @param lang - Language to filter by
 * @param limit - Optional maximum number of books to return
 * @returns Array of random 5-star books
 */
export function getFiveStarBooks(
  books: CollectionEntry<"books">[],
  lang: LanguageKey,
  limit?: number,
): CollectionEntry<"books">[] {
  const filteredBooks = filterBooksByLanguage(books, lang);
  const fiveStars = filteredBooks.filter((book) => book.data.score === 5);

  if (limit === undefined) {
    return fiveStars;
  }

  const shuffled = shuffleArray(fiveStars);
  return shuffled.slice(0, limit);
}

/**
 * Get random classics books
 * @param books - All books collection
 * @param lang - Language to filter by
 * @param limit - Maximum number of books to return
 * @returns Array of random classics books
 */
export function getClassicsBooks(
  books: CollectionEntry<"books">[],
  lang: LanguageKey,
  limit: number,
): CollectionEntry<"books">[] {
  const filteredBooks = filterBooksByLanguage(books, lang);
  const classics = filteredBooks.filter((book) => book.data.challenges && book.data.challenges.includes("clasicos"));
  const shuffled = shuffleArray(classics);
  return shuffled.slice(0, limit);
}

/**
 * Get most recent books by publication date
 * @param books - All books collection
 * @param lang - Language to filter by
 * @param limit - Maximum number of books to return
 * @returns Array of most recent books, sorted by pubDate (newest first)
 */
export function getRecentBooks(
  books: CollectionEntry<"books">[],
  lang: LanguageKey,
  limit: number = 5,
): CollectionEntry<"books">[] {
  const filteredBooks = filterBooksByLanguage(books, lang);
  const sorted = filteredBooks.sort((a, b) => {
    const dateA = new Date(b.data.pubDate).getTime();
    const dateB = new Date(a.data.pubDate).getTime();
    return dateA - dateB;
  });
  return sorted.slice(0, limit);
}

// ============================================================================
// ACTIVE CHALLENGES
// ============================================================================

/**
 * Get active challenges with progress
 * @param books - All books collection
 * @param challenges - All challenges collection
 * @param lang - Language to filter by
 * @returns Array of challenge progress objects
 */
export function getActiveChallenges(
  books: CollectionEntry<"books">[],
  challenges: CollectionEntry<"challenges">[],
  lang: LanguageKey,
): ChallengeProgress[] {
  const filteredBooks = filterBooksByLanguage(books, lang);

  const result: ChallengeProgress[] = [];

  for (const challengeId of ACTIVE_CHALLENGE_IDS) {
    const challenge = challenges.find((c) => c.data.challenge_slug === challengeId && c.data.language === lang);

    if (challenge) {
      // Count books completed in this challenge
      const completed = filteredBooks.filter(
        (book) => book.data.challenges && book.data.challenges.includes(challengeId),
      ).length;

      const total = CHALLENGE_TOTALS[challengeId] || 0;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      result.push({
        challenge,
        completed,
        total,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      });
    }
  }

  return result;
}
