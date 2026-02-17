// Blog content schemas
// Extracted Zod schemas for testing purposes (without Astro dependencies)

import { z } from "zod";

import { getLanguageCodes } from "@/config/languages";

/**
 * Create a dynamic language enum validator
 * This automatically includes all configured languages
 */
function createLanguageEnum() {
  const languages = getLanguageCodes();
  if (languages.length === 0) {
    throw new Error("No languages configured in src/config/languages.ts");
  }
  // z.enum requires at least 2 values, use type assertion for single language
  return languages.length === 1 ? z.literal(languages[0]) : z.enum(languages as [string, string, ...string[]]);
}

// Create the language validator
const languageSchema = createLanguageEnum();

// Books collection schema
export const booksSchema = z
  .object({
    // Basic metadata
    title: z.string(),
    post_slug: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    language: languageSchema,

    // Book-specific metadata
    originalTitle: z.string().optional(), // Original title for matching across translations
    synopsis: z.string().optional(),
    score: z.union([z.number().int().min(1).max(5), z.literal("fav")]),
    pages: z.number().positive().optional(),
    isbn: z.string().optional(),
    asin: z.string().optional(),

    // Relationships (using strings for now, will be references later)
    author: z.string(), // reference to authors collection
    publisher: z.string().optional(), // reference to publishers collection
    genres: z.array(z.string().min(1)).default([]), // references to genres collection
    series: z.string().nullable().optional(), // reference to series collection
    series_order: z.number().positive().optional(), // Order within the series (Book 1, 2, 3...)
    challenges: z.array(z.string().min(1)).default([]), // references to challenges collection
    categories: z.array(z.string().min(1)).default([]), // references to categories collection

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
    cover: z.string().optional(), // Relative path to cover image (fallback to default if not provided)
    book_cover: z.string().optional(), // Original book cover filename

    // i18n
    i18n: z.string().optional(), // Slug of translated version
  })
  .refine((data) => !data.series || data.series_order !== undefined, {
    message: "series_order is required when series is defined",
    path: ["series_order"],
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
  categories: z.array(z.string().min(1)).min(1), // references to categories collection

  // Optional metadata
  cover: z.string().optional(), // Relative path to cover image
  update_date: z.coerce.date().optional(), // When the post was last updated

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
  categories: z.array(z.string().min(1)).min(1), // references to categories collection

  // Optional metadata
  course: z.string().optional(), // reference to courses collection
  order: z.number().positive().optional(), // Tutorial order within course (1, 2, 2.5, 3...)
  cover: z.string().optional(), // Relative path to cover image
  update_date: z.coerce.date().optional(), // When the tutorial was last updated

  // i18n
  i18n: z.string().optional(), // Slug of translated version
});

export type Tutorial = z.infer<typeof tutorialsSchema>;

// Authors collection schema (now MDX content with biography in body)
export const authorsSchema = z.object({
  // Basic metadata
  name: z.string().min(1),
  author_slug: z.string().min(1),
  language: z.enum(["es", "en"]),

  // Sorting (optional - if not provided, sorts by full name)
  sortName: z.string().optional(), // Last name(s) for proper alphabetical sorting

  // Optional personal information
  gender: z.enum(["male", "female", "other"]).optional(),

  // Media
  picture: z.string().optional(), // Relative path to author picture

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
  i18n: z.string().optional(),
});

export type Challenge = z.infer<typeof challengesSchema>;

// Courses collection schema (taxonomy)
export const coursesSchema = z.object({
  name: z.string().min(1),
  course_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  description: z.string().optional(),
  i18n: z.string().optional(),
});

export type Course = z.infer<typeof coursesSchema>;

// Genres collection schema (taxonomy)
export const genresSchema = z.object({
  name: z.string().min(1),
  genre_slug: z.string().min(1),
  language: z.enum(["es", "en"]),
  type: z.enum(["fiction", "non-fiction"]), // Genre type classification (required)
  i18n: z.string().optional(),
});

export type Genre = z.infer<typeof genresSchema>;
