// Content collections config
// This file defines schemas for blog content collections (books, posts, tutorials)
// and taxonomies (authors, publishers, genres, series, challenges, courses, categories)

import { glob } from "astro/loaders";
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
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/books", type: "content" }),
  schema: booksSchema,
});

// Posts collection (general blog posts)
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts", type: "content" }),
  schema: postsSchema,
});

// Tutorials collection (programming tutorials)
const tutorialsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tutorials", type: "content" }),
  schema: tutorialsSchema,
});

// ============================================================================
// TAXONOMY COLLECTIONS
// ============================================================================

// Authors collection (MDX with biographies)
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors", type: "content" }),
  schema: authorsSchema,
});

// Categories collection
const categoriesCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/categories" }),
  schema: categoriesSchema,
});

// Publishers collection
const publishersCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/publishers" }),
  schema: publishersSchema,
});

// Series collection
const seriesCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/series" }),
  schema: seriesSchema,
});

// Challenges collection
const challengesCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/challenges" }),
  schema: challengesSchema,
});

// Courses collection
const coursesCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/courses" }),
  schema: coursesSchema,
});

// Genres collection
const genresCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/genres" }),
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
  authors: authorsCollection,

  // Taxonomy collections (data only)
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
