// Content collections config
// This file defines schemas for blog content collections (books, posts, tutorials)
// and taxonomies (authors, publishers, genres, series, challenges, courses, categories)

import { defineCollection, z } from "astro:content";

import { booksSchema } from "@/schemas/blog";

// ============================================================================
// COLLECTIONS
// ============================================================================

// Define empty collections for es and en folders (static content)
const emptyCollection = defineCollection({
  type: "data",
  schema: z.object({}),
});

// Books collection (blog book reviews)
const booksCollection = defineCollection({
  type: "content",
  schema: booksSchema,
});

export const collections = {
  // Existing static content collections
  es: emptyCollection,
  en: emptyCollection,

  // Blog content collections
  books: booksCollection,
};

// Re-export schemas for testing
export { booksSchema };
