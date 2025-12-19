// Content collections config
// This file defines schemas for blog content collections (books, posts, tutorials)
// and taxonomies (authors, publishers, genres, series, challenges, courses, categories)

import { defineCollection, z } from "astro:content";

import {
  booksSchema,
  postsSchema,
  tutorialsSchema,
  authorsSchema,
  categoriesSchema,
  publishersSchema,
  seriesSchema,
  challengesSchema,
  coursesSchema,
  genresSchema,
} from "@/schemas/blog";

// ============================================================================
// COLLECTIONS
// ============================================================================

// Define empty collections for es and en folders (static content)
const emptyCollection = defineCollection({
  type: "data",
  schema: z.object({}),
});

// ============================================================================
// PRIMARY CONTENT COLLECTIONS
// ============================================================================

// Books collection (blog book reviews)
const booksCollection = defineCollection({
  type: "content",
  schema: booksSchema,
});

// Posts collection (general blog posts)
const postsCollection = defineCollection({
  type: "content",
  schema: postsSchema,
});

// Tutorials collection (programming tutorials)
const tutorialsCollection = defineCollection({
  type: "content",
  schema: tutorialsSchema,
});

// ============================================================================
// TAXONOMY COLLECTIONS (data-only, no MDX body)
// ============================================================================

// Authors collection
const authorsCollection = defineCollection({
  type: "data",
  schema: authorsSchema,
});

// Categories collection
const categoriesCollection = defineCollection({
  type: "data",
  schema: categoriesSchema,
});

// Publishers collection
const publishersCollection = defineCollection({
  type: "data",
  schema: publishersSchema,
});

// Series collection
const seriesCollection = defineCollection({
  type: "data",
  schema: seriesSchema,
});

// Challenges collection
const challengesCollection = defineCollection({
  type: "data",
  schema: challengesSchema,
});

// Courses collection
const coursesCollection = defineCollection({
  type: "data",
  schema: coursesSchema,
});

// Genres collection
const genresCollection = defineCollection({
  type: "data",
  schema: genresSchema,
});

// ============================================================================
// EXPORT COLLECTIONS
// ============================================================================

export const collections = {
  // Existing static content collections
  es: emptyCollection,
  en: emptyCollection,

  // Primary content collections (with MDX body)
  books: booksCollection,
  posts: postsCollection,
  tutorials: tutorialsCollection,

  // Taxonomy collections (data only)
  authors: authorsCollection,
  categories: categoriesCollection,
  publishers: publishersCollection,
  series: seriesCollection,
  challenges: challengesCollection,
  courses: coursesCollection,
  genres: genresCollection,
};

// Re-export schemas for testing
export {
  booksSchema,
  postsSchema,
  tutorialsSchema,
  authorsSchema,
  categoriesSchema,
  publishersSchema,
  seriesSchema,
  challengesSchema,
  coursesSchema,
  genresSchema,
};
