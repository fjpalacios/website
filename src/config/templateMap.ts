/**
 * Template Mapping Configuration
 *
 * Maps content types and page types to their corresponding Astro components.
 * This eliminates the need for 47+ conditional statements in the router.
 *
 * Benefits:
 * - Single source of truth for template selection
 * - Type-safe template mapping
 * - Easy to add new content types
 * - Reduces router file size by ~50 lines
 *
 * @module config/templateMap
 */

import type { AstroComponentFactory } from "astro/runtime/server/index.js";

// Page templates - Content Types

// Page templates - Taxonomies
import AuthorsDetailPage from "@/pages-templates/authors/AuthorsDetailPage.astro";
import AuthorsListPage from "@/pages-templates/authors/AuthorsListPage.astro";
import BooksDetailPage from "@/pages-templates/books/BooksDetailPage.astro";
import BooksListPage from "@/pages-templates/books/BooksListPage.astro";
import BooksPaginationPage from "@/pages-templates/books/BooksPaginationPage.astro";
import CategoriesDetailPage from "@/pages-templates/categories/CategoriesDetailPage.astro";
import CategoriesListPage from "@/pages-templates/categories/CategoriesListPage.astro";
import ChallengesDetailPage from "@/pages-templates/challenges/ChallengesDetailPage.astro";
import ChallengesListPage from "@/pages-templates/challenges/ChallengesListPage.astro";
import CoursesDetailPage from "@/pages-templates/courses/CoursesDetailPage.astro";
import CoursesListPage from "@/pages-templates/courses/CoursesListPage.astro";
import GenresDetailPage from "@/pages-templates/genres/GenresDetailPage.astro";
import GenresListPage from "@/pages-templates/genres/GenresListPage.astro";
import PostsDetailPage from "@/pages-templates/posts/PostsDetailPage.astro";
import PostsListPage from "@/pages-templates/posts/PostsListPage.astro";
import PostsPaginationPage from "@/pages-templates/posts/PostsPaginationPage.astro";
import PublishersDetailPage from "@/pages-templates/publishers/PublishersDetailPage.astro";
import PublishersListPage from "@/pages-templates/publishers/PublishersListPage.astro";
import SeriesDetailPage from "@/pages-templates/series/SeriesDetailPage.astro";
import SeriesListPage from "@/pages-templates/series/SeriesListPage.astro";
// Page templates - Static
import AboutPage from "@/pages-templates/static/AboutPage.astro";
import FeedsPage from "@/pages-templates/static/FeedsPage.astro";
import TutorialsDetailPage from "@/pages-templates/tutorials/TutorialsDetailPage.astro";
import TutorialsListPage from "@/pages-templates/tutorials/TutorialsListPage.astro";
import TutorialsPaginationPage from "@/pages-templates/tutorials/TutorialsPaginationPage.astro";

/**
 * Page type discriminator
 * Used to identify which template to render
 */
export type PageType = "list" | "pagination" | "detail" | "static";

/**
 * Content type discriminator
 * Matches contentType prop passed to templates
 */
export type ContentType =
  | "books"
  | "tutorials"
  | "posts"
  | "authors"
  | "publishers"
  | "genres"
  | "categories"
  | "series"
  | "challenges"
  | "courses"
  | "about"
  | "feeds";

/**
 * Template map structure
 * Maps content type + page type to Astro component
 */
type TemplateMap = {
  [K in ContentType]: {
    [P in PageType]?: AstroComponentFactory;
  };
};

/**
 * Template mapping configuration
 *
 * Structure: templateMap[contentType][pageType] = Component
 *
 * Example:
 * - templateMap.books.list = BooksListPage
 * - templateMap.books.pagination = BooksPaginationPage
 * - templateMap.books.detail = BooksDetailPage
 *
 * Note: Not all content types have all page types
 * - Static pages only have "static" type
 * - Taxonomies don't have pagination
 */
export const templateMap: TemplateMap = {
  // Content with pagination
  books: {
    list: BooksListPage,
    pagination: BooksPaginationPage,
    detail: BooksDetailPage,
  },
  tutorials: {
    list: TutorialsListPage,
    pagination: TutorialsPaginationPage,
    detail: TutorialsDetailPage,
  },
  posts: {
    list: PostsListPage,
    pagination: PostsPaginationPage,
    detail: PostsDetailPage,
  },

  // Taxonomies (list + detail only)
  authors: {
    list: AuthorsListPage,
    detail: AuthorsDetailPage,
  },
  publishers: {
    list: PublishersListPage,
    detail: PublishersDetailPage,
  },
  genres: {
    list: GenresListPage,
    detail: GenresDetailPage,
  },
  categories: {
    list: CategoriesListPage,
    detail: CategoriesDetailPage,
  },
  series: {
    list: SeriesListPage,
    detail: SeriesDetailPage,
  },
  challenges: {
    list: ChallengesListPage,
    detail: ChallengesDetailPage,
  },
  courses: {
    list: CoursesListPage,
    detail: CoursesDetailPage,
  },

  // Static pages
  about: {
    static: AboutPage,
  },
  feeds: {
    static: FeedsPage,
  },
};

/**
 * Validation error for template selection
 */
export class TemplateNotFoundError extends Error {
  constructor(contentType: ContentType, pageType: PageType) {
    super(`No template found for contentType="${contentType}" and pageType="${pageType}"`);
    this.name = "TemplateNotFoundError";
  }
}

/**
 * Get template component for a given content type and page type
 *
 * @param contentType - The content type (e.g., "books", "authors")
 * @param pageType - The page type (e.g., "list", "detail")
 * @returns Astro component
 * @throws {TemplateNotFoundError} If template is not found
 *
 * @example
 * ```typescript
 * const Component = getTemplate("books", "list");
 * // Returns: BooksListPage
 *
 * getTemplate("books", "static"); // Throws TemplateNotFoundError
 * ```
 */
export function getTemplate(contentType: ContentType, pageType: PageType): AstroComponentFactory {
  const template = templateMap[contentType]?.[pageType];

  if (!template) {
    throw new TemplateNotFoundError(contentType, pageType);
  }

  return template;
}

/**
 * Safely get template component without throwing errors
 *
 * @param contentType - The content type (e.g., "books", "authors")
 * @param pageType - The page type (e.g., "list", "detail")
 * @returns Astro component or null if not found
 *
 * @example
 * ```typescript
 * const Component = safeGetTemplate("books", "list");
 * if (Component) {
 *   // Use component
 * }
 * ```
 */
export function safeGetTemplate(contentType: ContentType, pageType: PageType): AstroComponentFactory | null {
  return templateMap[contentType]?.[pageType] ?? null;
}

/**
 * Check if a template exists for the given content type and page type
 *
 * @param contentType - The content type to check
 * @param pageType - The page type to check
 * @returns true if template exists, false otherwise
 *
 * @example
 * ```typescript
 * if (hasTemplate("books", "list")) {
 *   // Safe to use getTemplate
 * }
 * ```
 */
export function hasTemplate(contentType: ContentType, pageType: PageType): boolean {
  return templateMap[contentType]?.[pageType] !== undefined;
}

/**
 * Get all available page types for a content type
 *
 * @param contentType - The content type
 * @returns Array of available page types
 *
 * @example
 * ```typescript
 * getAvailablePageTypes("books"); // ["list", "pagination", "detail"]
 * getAvailablePageTypes("authors"); // ["list", "detail"]
 * ```
 */
export function getAvailablePageTypes(contentType: ContentType): PageType[] {
  const templates = templateMap[contentType];
  if (!templates) return [];

  return Object.keys(templates) as PageType[];
}

/**
 * Validate that a template exists and throw descriptive error if not
 *
 * @param contentType - The content type
 * @param pageType - The page type
 * @throws {TemplateNotFoundError} If template doesn't exist
 *
 * @example
 * ```typescript
 * validateTemplate("books", "list"); // No error
 * validateTemplate("books", "static"); // Throws with helpful message
 * ```
 */
export function validateTemplate(contentType: ContentType, pageType: PageType): void {
  if (!hasTemplate(contentType, pageType)) {
    throw new TemplateNotFoundError(contentType, pageType);
  }
}
