#!/usr/bin/env node
/**
 * Script to create a new post entry with automatic entity creation
 *
 * Usage:
 *   bun run new:post --title "Post Title" [options]
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
 *   bun run new:post --interactive
 *   bun run new:post --title "Mi primera entrada" --lang es --categories "Libros,Reseñas"
 */

import fs from "fs";
import path from "path";

import type { LanguageKey } from "@/types/content";

import type { PostData } from "./shared-types";
import {
  createInterface,
  question,
  slugify,
  getTodayDate,
  createCategoryIfNotExists,
  parseArgs,
  isValidLanguage,
} from "./shared-utils";

function getPostTemplate(data: PostData): string {
  const { title, slug, date, lang, categories, excerpt } = data;

  return `---
title: "${title}"
post_slug: "${slug}"
date: ${date}
excerpt: "${excerpt || "Breve resumen del post..."}"
language: "${lang}"
i18n: ""
categories: [${categories && categories.length > 0 ? categories.map((c) => `"${c}"`).join(", ") : '"publicaciones"'}]
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

async function interactiveMode(): Promise<PostData> {
  const rl = createInterface();

  console.log("\n📝 Creating a new post entry (interactive mode)");
  console.log("💡 Tip: Categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Post title: ");
  const langInput = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const categoriesInput = await question(rl, "Categories (comma-separated names) [default: publicaciones/posts]: ");

  rl.close();

  const lang: LanguageKey = isValidLanguage(langInput) ? langInput : "es";

  const categories = categoriesInput
    ? categoriesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : lang === "es"
      ? ["publicaciones"]
      : ["posts"];

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

async function main(): Promise<void> {
  const args = parseArgs();

  let data: PostData;

  if (args.interactive) {
    data = await interactiveMode();
  } else {
    if (!args.title) {
      console.error("❌ Error: --title is required\n");
      console.log('Usage: bun run new:post --title "Post Title"');
      console.log("Or run in interactive mode: bun run new:post --interactive\n");
      process.exit(1);
    }

    const slug = slugify(args.title);
    const date = getTodayDate();
    const langInput = args.lang || "es";
    const lang: LanguageKey = isValidLanguage(langInput) ? langInput : "es";

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
  let categorySlugs: string[] = [];
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

main().catch((error: Error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
