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
