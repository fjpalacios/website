#!/usr/bin/env node
/**
 * Script to create a new book entry with automatic entity creation
 *
 * Usage:
 *   bun run new:book --title "Book Title" --author "author-name" [options]
 *
 * Required:
 *   --title        Book title
 *   --author       Author name (will be created if doesn't exist)
 *
 * Optional:
 *   --lang         Language (es|en) - default: es
 *   --isbn         ISBN number
 *   --pages        Number of pages (default: 300)
 *   --publisher    Publisher name (will be created if doesn't exist)
 *   --score        Score (1-5, default: 3)
 *   --genres       Comma-separated genre names (will be created if don't exist)
 *   --categories   Comma-separated category names (will be created if don't exist)
 *   --interactive  Run in interactive mode
 *
 * Features:
 *   - Auto-creates author if not found
 *   - Auto-creates publisher if not found
 *   - Auto-creates genres if not found
 *   - Auto-creates categories if not found
 *   - Smart slug generation
 *
 * Examples:
 *   bun run new:book --interactive
 *   bun run new:book --title "El nombre del viento" --author "Patrick Rothfuss" --lang es
 */

import fs from "fs";
import path from "path";

import type { LanguageKey } from "@/types/content";

import type { BookData } from "./shared-types";
import {
  createInterface,
  question,
  slugify,
  getTodayDate,
  createAuthorIfNotExists,
  createPublisherIfNotExists,
  createGenreIfNotExists,
  createCategoryIfNotExists,
  parseArgs,
  isValidLanguage,
} from "./shared-utils";

function getBookTemplate(data: BookData): string {
  const { title, slug, date, lang, author, isbn, pages, publisher, score, genres, categories, synopsis, excerpt } =
    data;

  return `---
title: "${title}"
post_slug: "${slug}"
date: ${date}
excerpt: "${excerpt || "Breve resumen del libro..."}"
language: "${lang}"
i18n: ""
synopsis: "${synopsis || "Sinopsis completa del libro..."}"
score: ${score || 3}
pages: ${pages || 300}
${isbn ? `isbn: "${isbn}"` : '# isbn: "9781234567890"'}
author: "${author}"
${publisher ? `publisher: "${publisher}"` : `# publisher: "publisher-slug" # Add publisher or use --publisher flag`}
buy:
  - type: "paper"
    link: "https://www.amazon.es/dp/"
  - type: "ebook"
    link: "https://www.amazon.es/dp/"
# book_card: "https://www.megustaleer.com/libro/"
genres: [${genres && genres.length > 0 ? genres.map((g) => `"${g}"`).join(", ") : ""}]
# challenges: ["reto-lectura-2025"]
categories: [${categories && categories.length > 0 ? categories.map((c) => `"${c}"`).join(", ") : lang === "es" ? '"libros", "resenas"' : '"books", "reviews"'}]
book_cover: "/images/books/${slug}.jpg"
---

import BookLink from "@components/blog/BookLink.astro";
import AuthorLink from "@components/blog/AuthorLink.astro";
import Spoiler from "@components/blog/Spoiler.astro";

## Opinión

Escribe aquí tu opinión sobre el libro...

### Características

Describe las características del libro: estructura narrativa, estilo, etc.

### Personajes

Describe los personajes principales del libro...

## Conclusión

Tu conclusión final sobre el libro...`;
}

async function interactiveMode(): Promise<BookData> {
  const rl = createInterface();

  console.log("\n📚 Creating a new book entry (interactive mode)");
  console.log("💡 Tip: Author, publisher, genres, and categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Book title: ");
  const author = await question(rl, "Author name (will be created if doesn't exist): ");
  const langInput = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const isbn = await question(rl, "ISBN (optional): ");
  const pagesInput = await question(rl, "Number of pages [default: 300]: ");
  const publisher = await question(rl, "Publisher name (optional, will be created if doesn't exist): ");
  const scoreInput = await question(rl, "Score (1-5) [default: 3]: ");

  const lang: LanguageKey = isValidLanguage(langInput) ? langInput : "es";

  // Validate and parse numeric inputs
  const pages = pagesInput ? parseInt(pagesInput) : 300;
  let score = scoreInput ? parseInt(scoreInput) : 3;
  if (score < 1 || score > 5 || isNaN(score)) {
    console.log("⚠️  Invalid score, using default: 3");
    score = 3;
  }
  const genresInput = await question(rl, "Genres (comma-separated names, optional): ");
  const categoriesInput = await question(rl, "Categories (comma-separated names) [default: libros, resenas]: ");

  const genres = genresInput
    ? genresInput
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    : null;

  const categories = categoriesInput
    ? categoriesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : lang === "es"
      ? ["libros", "resenas"]
      : ["books", "reviews"];

  rl.close();

  const slug = slugify(title);
  const date = getTodayDate();

  return {
    title,
    slug,
    date,
    lang,
    author,
    isbn: isbn || null,
    pages,
    publisher: publisher || null,
    score,
    genres,
    categories,
    synopsis: null,
    excerpt: null,
  };
}

async function main(): Promise<void> {
  const args = parseArgs();

  let data: BookData;

  if (args.interactive) {
    data = await interactiveMode();
  } else {
    // Validate required args
    if (!args.title || !args.author) {
      console.error("❌ Error: --title and --author are required\n");
      console.log('Usage: bun run new:book --title "Book Title" --author "Author Name"');
      console.log("Or run in interactive mode: bun run new:book --interactive\n");
      process.exit(1);
    }

    const slug = slugify(args.title);
    const date = getTodayDate();
    const langInput = args.lang || "es";
    const lang: LanguageKey = isValidLanguage(langInput) ? langInput : "es";

    // Validate and parse numeric inputs
    let pages = args.pages ? parseInt(args.pages) : 300;
    let score = args.score ? parseInt(args.score) : 3;

    if (isNaN(pages) || pages <= 0) {
      console.log("⚠️  Invalid pages value, using default: 300");
      pages = 300;
    }

    if (isNaN(score) || score < 1 || score > 5) {
      console.log("⚠️  Invalid score (must be 1-5), using default: 3");
      score = 3;
    }

    data = {
      title: args.title,
      slug,
      date,
      lang,
      author: args.author,
      isbn: args.isbn || null,
      pages,
      publisher: args.publisher || null,
      score,
      genres: args.genres ? args.genres.split(",").map((g) => g.trim()) : null,
      categories: args.categories
        ? args.categories.split(",").map((c) => c.trim())
        : lang === "es"
          ? ["libros", "resenas"]
          : ["books", "reviews"],
      synopsis: null,
      excerpt: null,
    };
  }

  console.log("\n🔍 Processing entities...\n");

  // Create or find author
  const authorSlug = createAuthorIfNotExists(data.author, data.lang);

  // Create or find publisher (if provided)
  let publisherSlug: string | null = null;
  if (data.publisher) {
    publisherSlug = createPublisherIfNotExists(data.publisher, data.lang);
  }

  // Create or find genres (if provided)
  let genreSlugs: string[] | null = null;
  if (data.genres && data.genres.length > 0) {
    genreSlugs = data.genres.map((genre) => createGenreIfNotExists(genre, data.lang));
  }

  // Create or find categories
  let categorySlugs: string[] = [];
  if (data.categories && data.categories.length > 0) {
    categorySlugs = data.categories.map((category) => createCategoryIfNotExists(category, data.lang));
  }

  // Update data with slugs
  data.author = authorSlug;
  data.publisher = publisherSlug;
  data.genres = genreSlugs;
  data.categories = categorySlugs;

  // Generate file content
  const content = getBookTemplate(data);

  // Determine file path
  const fileName = `${data.slug}.mdx`;
  const filePath = path.join(process.cwd(), "src", "content", "books", fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`\n❌ Error: File already exists: ${filePath}\n`);
    process.exit(1);
  }

  // Write file
  fs.writeFileSync(filePath, content, "utf8");

  console.log(`\n✅ Book created successfully!\n`);
  console.log(`📁 File: ${filePath}`);
  console.log(`🔗 Slug: ${data.slug}`);
  console.log(`🌐 Language: ${data.lang}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Add book cover image: public/images/books/${data.slug}.jpg`);
  console.log(`   2. Fill in synopsis and excerpt`);
  console.log(`   3. Write your review`);
  console.log(`   4. Add translation (i18n field) if needed`);
  if (genreSlugs && genreSlugs.length > 0) {
    console.log(`   5. Review auto-created genres and add i18n translations`);
  }
  if (categorySlugs && categorySlugs.length > 0) {
    console.log(`   6. Review auto-created categories and add i18n translations`);
  }
  console.log();
}

main().catch((error: Error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
