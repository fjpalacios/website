#!/usr/bin/env node
/**
 * Script to create a new post entry with automatic entity creation
 *
 * Usage:
 *   node scripts/new-post.js --title "Post Title" [options]
 *
 * Required:
 *   --title        Post title
 *
 * Optional:
 *   --lang         Language (es|en) - default: es
 *   --categories   Comma-separated category names (will be created if don't exist)
 *   --interactive  Run in interactive mode
 *
 * Features:
 *   - Auto-creates categories if not found
 *   - Smart slug generation
 *
 * Examples:
 *   node scripts/new-post.js --interactive
 *   node scripts/new-post.js --title "Mi primera entrada" --lang es --categories "Libros,Reseñas"
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
function findEntityByName(collectionDir, name, lang) {
  if (!name) return null;

  const contentDir = path.join(process.cwd(), "src", "content", collectionDir);
  if (!fs.existsSync(contentDir)) {
    return null;
  }

  const files = fs.readdirSync(contentDir);
  const slug = slugify(name);

  // Try exact slug match first
  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const baseName = file.replace(".json", "");
    if (baseName === slug) {
      return baseName;
    }
  }

  // Try to find by reading file content
  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    try {
      const json = JSON.parse(content);
      if (json.name && json.name.toLowerCase() === name.toLowerCase()) {
        return file.replace(".json", "");
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return null;
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

// Template for new post
function getPostTemplate(data) {
  const { title, slug, date, lang, categories, excerpt } = data;

  return `---
title: "${title}"
post_slug: "${slug}"
date: ${date}
excerpt: "${excerpt || "Breve resumen del post..."}"
language: "${lang}"
i18n: ""
categories: [${categories && categories.length > 0 ? categories.map((c) => `"${c}"`).join(", ") : '"publicaciones"'}]
cover: "/images/defaults/post-default-${lang}.jpg"
---

import BookLink from "@components/blog/BookLink.astro";
import AuthorLink from "@components/blog/AuthorLink.astro";

## Introducción

Escribe aquí la introducción de tu post...

## Contenido principal

Desarrolla el contenido principal...

### Subsección

Más contenido...

## Conclusión

Tu conclusión final...
`;
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
      i++;
    }
  }

  return options;
}

// Interactive mode
async function interactiveMode() {
  const rl = createInterface();

  console.log("\n📝 Creating a new post entry (interactive mode)");
  console.log("💡 Tip: Categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Post title: ");
  const lang = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const categoriesInput = await question(rl, "Categories (comma-separated names) [default: publicaciones/posts]: ");

  const categories = categoriesInput
    ? categoriesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : lang === "es"
      ? ["publicaciones"]
      : ["posts"];

  rl.close();

  const slug = slugify(title);
  const date = getTodayDate();

  return {
    title,
    slug,
    date,
    lang,
    categories,
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
    if (!args.title) {
      console.error("❌ Error: --title is required\n");
      console.log('Usage: node scripts/new-post.js --title "Post Title"');
      console.log("Or run in interactive mode: node scripts/new-post.js --interactive\n");
      process.exit(1);
    }

    const slug = slugify(args.title);
    const date = getTodayDate();
    const lang = args.lang || "es";

    data = {
      title: args.title,
      slug,
      date,
      lang,
      categories: args.categories
        ? args.categories.split(",").map((c) => c.trim())
        : lang === "es"
          ? ["publicaciones"]
          : ["posts"],
      excerpt: null,
    };
  }

  console.log("\n🔍 Processing entities...\n");

  // Create or find categories
  let categorySlugs = [];
  if (data.categories && data.categories.length > 0) {
    categorySlugs = data.categories.map((category) => createCategoryIfNotExists(category, data.lang));
  }

  // Update data with slugs
  data.categories = categorySlugs;

  // Generate file content
  const content = getPostTemplate(data);

  // Determine file path
  const fileName = `${data.slug}.mdx`;
  const filePath = path.join(process.cwd(), "src", "content", "posts", fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`\n❌ Error: File already exists: ${filePath}\n`);
    process.exit(1);
  }

  // Write file
  fs.writeFileSync(filePath, content, "utf8");

  console.log(`\n✅ Post created successfully!\n`);
  console.log(`📁 File: ${filePath}`);
  console.log(`🔗 Slug: ${data.slug}`);
  console.log(`🌐 Language: ${data.lang}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Add cover image (optional): public/images/posts/${data.slug}.jpg`);
  console.log(`   2. Fill in excerpt`);
  console.log(`   3. Write your content`);
  console.log(`   4. Add translation (i18n field) if needed`);
  if (categorySlugs && categorySlugs.length > 0) {
    console.log(`   5. Review auto-created categories and add i18n translations`);
  }
  console.log();
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
