#!/usr/bin/env node
/**
 * Script to create a new book entry with automatic entity creation
 *
 * Usage:
 *   node scripts/new-book.js --title "Book Title" --author "author-name" [options]
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
 *   node scripts/new-book.js --interactive
 *   node scripts/new-book.js --title "El nombre del viento" --author "Patrick Rothfuss" --lang es
 */

import fs from "fs";
import path from "path";
import readline from "readline";

// Helper to create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Helper to ask question
function question(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Helper to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
}

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to check if entity exists and get its slug
function findEntityByName(collectionDir, name, lang, fileExtension = ".json") {
  if (!name) return null;

  const contentDir = path.join(process.cwd(), "src", "content", collectionDir);
  if (!fs.existsSync(contentDir)) {
    return null;
  }

  const files = fs.readdirSync(contentDir);
  const slug = slugify(name);

  // Try exact slug match first
  for (const file of files) {
    if (!file.endsWith(fileExtension)) continue;

    const baseName = file.replace(fileExtension, "");
    if (baseName === slug || baseName === `${slug}-${lang}`) {
      return baseName;
    }
  }

  // Try to find by reading file content
  for (const file of files) {
    if (!file.endsWith(fileExtension)) continue;

    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    if (fileExtension === ".json") {
      try {
        const json = JSON.parse(content);
        if (json.name && json.name.toLowerCase() === name.toLowerCase()) {
          return file.replace(".json", "");
        }
      } catch {
        // Skip invalid JSON
      }
    } else if (fileExtension === ".mdx") {
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/^name:\s*"?([^"\n]+)"?/m);
        if (nameMatch && nameMatch[1].toLowerCase() === name.toLowerCase()) {
          return file.replace(".mdx", "");
        }
      }
    }
  }

  return null;
}

// Helper to create author if not exists
function createAuthorIfNotExists(name, lang) {
  const existingSlug = findEntityByName("authors", name, lang, ".mdx");
  if (existingSlug) {
    console.log(`   ℹ️  Author found: ${name} (${existingSlug})`);
    return existingSlug;
  }

  const slug = `${slugify(name)}-${lang}`;
  const filePath = path.join(process.cwd(), "src", "content", "authors", `${slug}.mdx`);

  const template = `---
name: "${name}"
author_slug: "${slugify(name)}"
language: "${lang}"
# gender: "male"
# picture: "/images/authors/${slugify(name)}.jpg"
i18n: "${lang === "es" ? "en" : "es"}"
---

Write the author's biography here...
`;

  fs.writeFileSync(filePath, template, "utf8");
  console.log(`   ✨ Created author: ${name} (${slug})`);
  return slug;
}

// Helper to create publisher if not exists
function createPublisherIfNotExists(name, lang) {
  const existingSlug = findEntityByName("publishers", name, lang);
  if (existingSlug) {
    console.log(`   ℹ️  Publisher found: ${name} (${existingSlug})`);
    return existingSlug;
  }

  const slug = slugify(name);
  const filePath = path.join(process.cwd(), "src", "content", "publishers", `${slug}.json`);

  const data = {
    name: name,
    publisher_slug: slug,
    language: lang,
    i18n: lang === "es" ? slug : slug, // Will need manual correction
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created publisher: ${name} (${slug})`);
  return slug;
}

// Helper to create genre if not exists
function createGenreIfNotExists(name, lang) {
  const existingSlug = findEntityByName("genres", name, lang);
  if (existingSlug) {
    console.log(`   ℹ️  Genre found: ${name} (${existingSlug})`);
    return existingSlug;
  }

  const slug = slugify(name);
  const filePath = path.join(process.cwd(), "src", "content", "genres", `${slug}.json`);

  const data = {
    name: name,
    genre_slug: slug,
    language: lang,
    i18n: slug, // Will need manual correction
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created genre: ${name} (${slug})`);
  return slug;
}

// Helper to create category if not exists
function createCategoryIfNotExists(name, lang) {
  const existingSlug = findEntityByName("categories", name, lang);
  if (existingSlug) {
    console.log(`   ℹ️  Category found: ${name} (${existingSlug})`);
    return existingSlug;
  }

  const slug = slugify(name);
  const filePath = path.join(process.cwd(), "src", "content", "categories", `${slug}.json`);

  const data = {
    name: name,
    category_slug: slug,
    language: lang,
    description: `Content related to ${name}`,
    // icon: "book",
    // color: "#8B4513",
    // order: 1
  };

  // If lang is 'es', try to suggest i18n
  if (lang === "es") {
    data.i18n = slug; // Will need manual correction
  } else {
    data.i18n = slug; // Will need manual correction
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created category: ${name} (${slug})`);
  return slug;
}

// Template for new book
function getBookTemplate(data) {
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
genres: [${genres && genres.length > 0 ? genres.map((g) => `"${g}"`).join(", ") : '"ficcion"'}]
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

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];
      options[key] = value;
      i++; // Skip next arg
    }
  }

  return options;
}

// Interactive mode
async function interactiveMode() {
  const rl = createInterface();

  console.log("\n📚 Creating a new book entry (interactive mode)");
  console.log("💡 Tip: Author, publisher, genres, and categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Book title: ");
  const author = await question(rl, "Author name (will be created if doesn't exist): ");
  const lang = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const isbn = await question(rl, "ISBN (optional): ");
  const pagesInput = await question(rl, "Number of pages [default: 300]: ");
  const publisher = await question(rl, "Publisher name (optional, will be created if doesn't exist): ");
  const scoreInput = await question(rl, "Score (1-5) [default: 3]: ");

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

// Main function
async function main() {
  const args = parseArgs();

  let data;

  if (args.interactive) {
    data = await interactiveMode();
  } else {
    // Validate required args
    if (!args.title || !args.author) {
      console.error("❌ Error: --title and --author are required\n");
      console.log('Usage: node scripts/new-book.js --title "Book Title" --author "Author Name"');
      console.log("Or run in interactive mode: node scripts/new-book.js --interactive\n");
      process.exit(1);
    }

    const slug = slugify(args.title);
    const date = getTodayDate();
    const lang = args.lang || "es";

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
  let publisherSlug = null;
  if (data.publisher) {
    publisherSlug = createPublisherIfNotExists(data.publisher, data.lang);
  }

  // Create or find genres (if provided)
  let genreSlugs = null;
  if (data.genres && data.genres.length > 0) {
    genreSlugs = data.genres.map((genre) => createGenreIfNotExists(genre, data.lang));
  }

  // Create or find categories
  let categorySlugs = [];
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

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
