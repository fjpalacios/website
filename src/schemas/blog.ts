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
