// Blog content schemas
// Extracted Zod schemas for testing purposes (without Astro dependencies)

import { z } from "zod";

// Books collection schema
export const booksSchema = z.object({
  // Basic metadata
  title: z.string(),
  post_slug: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  language: z.enum(["es", "en"]),

  // Book-specific metadata
  synopsis: z.string(),
  score: z.number().int().min(1).max(5),
  pages: z.number().positive(),
  isbn: z.string().optional(),
  asin: z.string().optional(),

  // Relationships (using strings for now, will be references later)
  author: z.string(), // reference to authors collection
  publisher: z.string().optional(), // reference to publishers collection
  genres: z.array(z.string()).default([]), // references to genres collection
  series: z.string().nullable().optional(), // reference to series collection
  challenges: z.array(z.string()).default([]), // references to challenges collection
  categories: z.array(z.string()).default([]), // references to categories collection

  // External links
  buy: z
    .array(
      z.object({
        type: z.enum(["paper", "ebook", "audiobook"]),
        link: z.string().url(),
        store: z.string().optional(), // Amazon, Casa del Libro, etc.
      }),
    )
    .optional(),
  book_card: z.string().url().optional(), // megustaleer.com link

  // Images
  cover: z.string(), // Relative path to cover image
  book_cover: z.string().optional(), // Original book cover filename

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

// Posts collection schema
export const postsSchema = z.object({
  // Basic metadata
  title: z.string().min(1),
  post_slug: z.string().min(1),
  date: z.coerce.date(),
  excerpt: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Post-specific metadata
  category: z.string().min(1), // reference to categories collection
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),

  // Optional metadata
  featured_image: z.string().optional(), // Relative path to featured image
  update_date: z.coerce.date().optional(), // When the post was last updated
  canonical_url: z.string().url().optional(), // For republished content

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

// Export types for TypeScript
export type Book = z.infer<typeof booksSchema>;
export type Post = z.infer<typeof postsSchema>;

// Tutorials collection schema
export const tutorialsSchema = z.object({
  // Basic metadata
  title: z.string().min(1),
  post_slug: z.string().min(1),
  date: z.coerce.date(),
  excerpt: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Tutorial-specific metadata
  category: z.string().min(1), // reference to categories collection
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimated_time: z.number().positive().optional(), // Time in minutes

  // Optional metadata
  course: z.string().optional(), // reference to courses collection
  github_repo: z.string().url().optional(), // Repository URL
  demo_url: z.string().url().optional(), // Live demo URL
  featured_image: z.string().optional(), // Relative path to featured image
  update_date: z.coerce.date().optional(), // When the tutorial was last updated

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

export type Tutorial = z.infer<typeof tutorialsSchema>;

// Authors collection schema (taxonomy)
export const authorsSchema = z.object({
  // Basic metadata
  name: z.string().min(1),
  author_slug: z.string().min(1),
  bio: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Optional personal information
  gender: z.enum(["male", "female", "other"]).optional(),
  birth_year: z.number().int().positive().max(new Date().getFullYear()).optional(),
  death_year: z.number().int().positive().optional(),
  nationality: z.string().optional(),

  // Media
  picture: z.string().optional(), // Relative path to author picture

  // Social links
  website: z.string().url().optional(),
  twitter: z.string().optional(), // Twitter handle (with or without @)
  goodreads: z.string().url().optional(),
  wikipedia: z.string().url().optional(),

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

export type Author = z.infer<typeof authorsSchema>;

// Categories collection schema (taxonomy)
export const categoriesSchema = z.object({
  // Basic metadata
  name: z.string().min(1),
  category_slug: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Optional metadata
  description: z.string().optional(),

  // UI metadata
  icon: z.string().optional(), // Icon name for visual representation
  color: z.string().optional(), // Hex color for category styling
  order: z.number().int().nonnegative().optional(), // Sort order in lists

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

export type Category = z.infer<typeof categoriesSchema>;

// Publishers collection schema (taxonomy)
export const publishersSchema = z.object({
  // Basic metadata
  name: z.string().min(1),
  publisher_slug: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Optional metadata
  description: z.string().optional(),
  website: z.string().url().optional(),
  country: z.string().optional(),

  // i18n
  i18n: z.string().optional(),
});

export type Publisher = z.infer<typeof publishersSchema>;

// Series collection schema (taxonomy)
export const seriesSchema = z.object({
  name: z.string().min(1),
  series_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  description: z.string().optional(),
  author: z.string().optional(), // reference to authors collection
  i18n: z.string().optional(),
});

export type Series = z.infer<typeof seriesSchema>;

// Challenges collection schema (taxonomy)
export const challengesSchema = z.object({
  name: z.string().min(1),
  challenge_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  description: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  goal: z.number().int().positive().optional(), // Number of books to read
  i18n: z.string().optional(),
});

export type Challenge = z.infer<typeof challengesSchema>;

// Courses collection schema (taxonomy)
export const coursesSchema = z.object({
  name: z.string().min(1),
  course_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration: z.number().positive().optional(), // Duration in minutes
  i18n: z.string().optional(),
});

export type Course = z.infer<typeof coursesSchema>;

// Genres collection schema (taxonomy)
export const genresSchema = z.object({
  name: z.string().min(1),
  genre_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  description: z.string().optional(),
  parent: z.string().optional(), // Parent genre slug for hierarchical structure
  i18n: z.string().optional(),
});

export type Genre = z.infer<typeof genresSchema>;
