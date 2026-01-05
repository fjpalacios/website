/**
 * Mock Data Builders for Tests
 *
 * Provides consistent mock data creation for testing.
 * Reduces duplication and makes tests more maintainable.
 *
 * @module __tests__/__helpers__/mockData
 */

import type { LanguageKey } from "@/types";

// ============================================================================
// MOCK BOOK DATA
// ============================================================================

export interface MockBook {
  id: string;
  slug: string;
  collection: "books";
  data: {
    title: string;
    post_slug: string;
    excerpt: string;
    language: LanguageKey;
    i18n?: string;
    author?: string;
    publisher?: string;
    genres?: string[];
    score?: number;
    published_date?: Date;
  };
}

/**
 * Create a mock book for testing
 *
 * @param id - Numeric ID for the book
 * @param lang - Language (es or en)
 * @param overrides - Optional property overrides
 * @returns MockBook object
 *
 * @example
 * ```typescript
 * const book = createMockBook(1, "es");
 * const bookWithAuthor = createMockBook(2, "en", { author: "stephen-king" });
 * ```
 */
export const createMockBook = (
  id: number,
  lang: LanguageKey = "es",
  overrides: Partial<MockBook["data"]> = {},
): MockBook => ({
  id: `book-${id}`,
  slug: `book-slug-${id}`,
  collection: "books",
  data: {
    title: `Book Title ${id}`,
    post_slug: `book-slug-${id}`,
    excerpt: `Excerpt for book ${id}`,
    language: lang,
    ...overrides,
  },
});

/**
 * Create multiple mock books at once
 *
 * @param count - Number of books to create
 * @param lang - Language for all books
 * @param factory - Optional factory function for customization
 * @returns Array of MockBook objects
 *
 * @example
 * ```typescript
 * const books = createMockBooks(10, "es");
 * const customBooks = createMockBooks(5, "en", (i) => ({ score: i * 2 }));
 * ```
 */
export const createMockBooks = (
  count: number,
  lang: LanguageKey = "es",
  factory?: (index: number) => Partial<MockBook["data"]>,
): MockBook[] => {
  return Array.from({ length: count }, (_, i) => createMockBook(i + 1, lang, factory?.(i + 1)));
};

// ============================================================================
// MOCK AUTHOR DATA
// ============================================================================

export interface MockAuthor {
  id: string;
  slug: string;
  collection: "authors";
  data: {
    name: string;
    slug: string;
    language?: LanguageKey;
    bio?: string;
    i18n?: string;
  };
}

/**
 * Create a mock author for testing
 *
 * @param id - Author identifier (e.g., "stephen-king")
 * @param name - Author name
 * @param overrides - Optional property overrides
 * @returns MockAuthor object
 *
 * @example
 * ```typescript
 * const author = createMockAuthor("stephen-king", "Stephen King");
 * const authorWithBio = createMockAuthor("jk-rowling", "J.K. Rowling", { bio: "British author" });
 * ```
 */
export const createMockAuthor = (
  id: string,
  name: string,
  overrides: Partial<MockAuthor["data"]> = {},
): MockAuthor => ({
  id,
  slug: id,
  collection: "authors",
  data: {
    name,
    slug: id,
    ...overrides,
  },
});

// ============================================================================
// MOCK TAXONOMY DATA (Genres, Publishers, etc.)
// ============================================================================

export interface MockTaxonomy {
  id: string;
  slug: string;
  collection: "genres" | "publishers" | "categories" | "series" | "challenges" | "courses";
  data: {
    name: string;
    slug: string;
    language?: LanguageKey;
    description?: string;
    i18n?: string;
  };
}

/**
 * Create a mock taxonomy item (genre, publisher, etc.)
 *
 * @param collection - Collection name
 * @param id - Taxonomy identifier
 * @param name - Taxonomy name
 * @param overrides - Optional property overrides
 * @returns MockTaxonomy object
 *
 * @example
 * ```typescript
 * const genre = createMockTaxonomy("genres", "fiction", "Fiction");
 * const publisher = createMockTaxonomy("publishers", "penguin", "Penguin Random House");
 * ```
 */
export const createMockTaxonomy = (
  collection: MockTaxonomy["collection"],
  id: string,
  name: string,
  overrides: Partial<MockTaxonomy["data"]> = {},
): MockTaxonomy => ({
  id,
  slug: id,
  collection,
  data: {
    name,
    slug: id,
    ...overrides,
  },
});

// ============================================================================
// MOCK POST DATA
// ============================================================================

export interface MockPost {
  id: string;
  slug: string;
  collection: "posts";
  data: {
    title: string;
    post_slug: string;
    excerpt: string;
    language: LanguageKey;
    published_date: Date;
    i18n?: string;
    categories?: string[];
  };
}

/**
 * Create a mock post for testing
 *
 * @param id - Numeric ID for the post
 * @param lang - Language (es or en)
 * @param overrides - Optional property overrides
 * @returns MockPost object
 *
 * @example
 * ```typescript
 * const post = createMockPost(1, "es");
 * const postWithCategories = createMockPost(2, "en", { categories: ["tech", "programming"] });
 * ```
 */
export const createMockPost = (
  id: number,
  lang: LanguageKey = "es",
  overrides: Partial<MockPost["data"]> = {},
): MockPost => ({
  id: `post-${id}`,
  slug: `post-slug-${id}`,
  collection: "posts",
  data: {
    title: `Post Title ${id}`,
    post_slug: `post-slug-${id}`,
    excerpt: `Excerpt for post ${id}`,
    language: lang,
    published_date: new Date(`2025-01-${String(id).padStart(2, "0")}`),
    ...overrides,
  },
});

/**
 * Create multiple mock posts at once
 *
 * @param count - Number of posts to create
 * @param lang - Language for all posts
 * @param factory - Optional factory function for customization
 * @returns Array of MockPost objects
 */
export const createMockPosts = (
  count: number,
  lang: LanguageKey = "es",
  factory?: (index: number) => Partial<MockPost["data"]>,
): MockPost[] => {
  return Array.from({ length: count }, (_, i) => createMockPost(i + 1, lang, factory?.(i + 1)));
};

// ============================================================================
// MOCK TUTORIAL DATA
// ============================================================================

export interface MockTutorial {
  id: string;
  slug: string;
  collection: "tutorials";
  data: {
    title: string;
    post_slug: string;
    excerpt: string;
    language: LanguageKey;
    i18n?: string;
    categories?: string[];
  };
}

/**
 * Create a mock tutorial for testing
 *
 * @param id - Numeric ID for the tutorial
 * @param lang - Language (es or en)
 * @param overrides - Optional property overrides
 * @returns MockTutorial object
 */
export const createMockTutorial = (
  id: number,
  lang: LanguageKey = "es",
  overrides: Partial<MockTutorial["data"]> = {},
): MockTutorial => ({
  id: `tutorial-${id}`,
  slug: `tutorial-slug-${id}`,
  collection: "tutorials",
  data: {
    title: `Tutorial Title ${id}`,
    post_slug: `tutorial-slug-${id}`,
    excerpt: `Excerpt for tutorial ${id}`,
    language: lang,
    ...overrides,
  },
});

// ============================================================================
// CONTACT HELPERS
// ============================================================================

import type { ContactItem } from "@/types/content";

export type MockContact = ContactItem[];

/**
 * Create mock contact data
 *
 * @param overrides - Optional property overrides
 * @returns MockContact array
 *
 * @example
 * ```typescript
 * const contact = createMockContact();
 * const customContact = createMockContact([{ name: "Email", link: "mailto:john@example.com", icon: "mail", text: "john@example.com" }]);
 * ```
 */
export const createMockContact = (overrides?: ContactItem[]): MockContact =>
  overrides || [
    {
      name: "Email",
      link: "mailto:test@example.com",
      icon: "mail",
      text: "test@example.com",
    },
  ];
