/**
 * Blog utilities barrel file
 * Re-exports all blog-related utilities for convenient importing
 */

// Slugify utilities
export { slugify } from "./slugify";

// Pagination utilities
export { getPageCount, paginateItems, getPaginationInfo, type PaginationInfo } from "./pagination";

// Collection utilities
export { sortByDate, filterByLanguage, groupByYear, type CollectionItem, type GroupedByYear } from "./collections";

// Book utilities
export {
  findBookBySlug,
  findAuthorBySlug,
  findPublisherBySlug,
  findGenresBySlug,
  findCategoriesBySlug,
  findSeriesBySlug,
} from "./books";
export { prepareBookSummary, type BookSummary } from "./book-listing";

// Author utilities
export { getBooksByAuthor, prepareAuthorSummary, type AuthorSummary } from "./authors";

// Tutorial utilities
export { prepareTutorialSummary, type TutorialSummary } from "./tutorials";

// Post utilities
export { preparePostSummary, type PostSummary } from "./posts";

// Import types for creating union
import type { BookSummary } from "./book-listing";
import type { PostSummary } from "./posts";
import type { TutorialSummary } from "./tutorials";

/**
 * Union type for all content summaries (posts, tutorials, books)
 * Used in combined listings like /publicaciones/
 */
export type ContentSummary = PostSummary | TutorialSummary | BookSummary;
