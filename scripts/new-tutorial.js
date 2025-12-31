#!/usr/bin/env node
/**
 * Script to create a new tutorial entry with automatic entity creation
 *
 * Usage:
 *   node scripts/new-tutorial.js --title "Tutorial Title" [options]
 *
 * Required:
 *   --title        Tutorial title
 *
 * Optional:
 *   --lang         Language (es|en) - default: es
 *   --course       Course name (will be created if doesn't exist)
 *   --categories   Comma-separated category names (will be created if don't exist)
 *   --tags         Comma-separated tag names
 *   --interactive  Run in interactive mode
 *
 * Features:
 *   - Auto-creates course if not found
 *   - Auto-creates categories if not found
 *   - Smart slug generation
 *
 * Examples:
 *   node scripts/new-tutorial.js --interactive
 *   node scripts/new-tutorial.js --title "Cómo usar Git" --lang es --course "Domina Git desde cero"
 */

import fs from "fs";
import path from "path";
import readline from "readline";

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function question(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

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
  };

  if (lang === "es") {
    data.i18n = slug;
  } else {
    data.i18n = slug;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created category: ${name} (${slug})`);
  return slug;
}

// Helper to create course if not exists
function createCourseIfNotExists(name, lang) {
  const existingSlug = findEntityByName("courses", name, lang);
  if (existingSlug) {
    console.log(`   ℹ️  Course found: ${name} (${existingSlug})`);
    return existingSlug;
  }

  const slug = slugify(name);
  const filePath = path.join(process.cwd(), "src", "content", "courses", `${slug}.json`);

  const data = {
    name: name,
    course_slug: slug,
    language: lang,
    description: `Course about ${name}`,
    difficulty: "beginner",
    // duration: 900
  };

  if (lang === "es") {
    data.i18n = slug;
  } else {
    data.i18n = slug;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created course: ${name} (${slug})`);
  return slug;
}

function getTutorialTemplate(data) {
  const { title, slug, date, lang, course, categories, tags, excerpt } = data;

  return `---
title: "${title}"
post_slug: "${slug}"
date: ${date}
excerpt: "${excerpt || "Breve resumen del tutorial..."}"
language: "${lang}"
i18n: ""
${course ? `course: "${course}"` : '# course: "course-slug" # Optional: link to a course'}
category: "${categories && categories.length > 0 ? categories[0] : "tutoriales"}"
tags: [${tags && tags.length > 0 ? tags.map((t) => `"${t}"`).join(", ") : ""}]
categories: [${categories && categories.length > 0 ? categories.map((c) => `"${c}"`).join(", ") : '"tutoriales"'}]
cover: "/images/defaults/tutorial-default-${lang}.jpg"
---

## Introducción

Explica brevemente de qué trata este tutorial y qué aprenderás...

## Requisitos previos

- Requisito 1
- Requisito 2
- Requisito 3

## Paso 1: Título del paso

Describe el primer paso del tutorial...

\`\`\`bash
# Código de ejemplo
echo "Hola mundo"
\`\`\`

## Paso 2: Título del paso

Continúa con el segundo paso...

## Paso 3: Título del paso

Y así sucesivamente...

## Conclusión

Resume lo que se ha aprendido en este tutorial...

## Recursos adicionales

- [Recurso 1](https://example.com)
- [Recurso 2](https://example.com)
`;
}

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

async function interactiveMode() {
  const rl = createInterface();

  console.log("\n🎓 Creating a new tutorial entry (interactive mode)");
  console.log("💡 Tip: Course and categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Tutorial title: ");
  const lang = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const course = await question(rl, "Course name (optional, will be created if doesn't exist): ");
  const categoriesInput = await question(rl, "Categories (comma-separated names) [default: tutoriales/tutorials]: ");
  const tagsInput = await question(rl, "Tags (comma-separated, optional): ");

  const categories = categoriesInput
    ? categoriesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : lang === "es"
      ? ["tutoriales"]
      : ["tutorials"];

  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  rl.close();

  const slug = slugify(title);
  const date = getTodayDate();

  return {
    title,
    slug,
    date,
    lang,
    course: course || null,
    categories,
    tags,
    excerpt: null,
  };
}

async function main() {
  const args = parseArgs();

  let data;

  if (args.interactive) {
    data = await interactiveMode();
  } else {
    if (!args.title) {
      console.error("❌ Error: --title is required\n");
      console.log('Usage: node scripts/new-tutorial.js --title "Tutorial Title"');
      console.log("Or run in interactive mode: node scripts/new-tutorial.js --interactive\n");
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
      course: args.course || null,
      categories: args.categories
        ? args.categories.split(",").map((c) => c.trim())
        : lang === "es"
          ? ["tutoriales"]
          : ["tutorials"],
      tags: args.tags ? args.tags.split(",").map((t) => t.trim()) : [],
      excerpt: null,
    };
  }

  console.log("\n🔍 Processing entities...\n");

  // Create or find course (if provided)
  let courseSlug = null;
  if (data.course) {
    courseSlug = createCourseIfNotExists(data.course, data.lang);
  }

  // Create or find categories
  let categorySlugs = [];
  if (data.categories && data.categories.length > 0) {
    categorySlugs = data.categories.map((category) => createCategoryIfNotExists(category, data.lang));
  }

  // Update data with slugs
  data.course = courseSlug;
  data.categories = categorySlugs;

  const content = getTutorialTemplate(data);
  const fileName = `${data.slug}.mdx`;
  const filePath = path.join(process.cwd(), "src", "content", "tutorials", fileName);

  if (fs.existsSync(filePath)) {
    console.error(`\n❌ Error: File already exists: ${filePath}\n`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, content, "utf8");

  console.log(`\n✅ Tutorial created successfully!\n`);
  console.log(`📁 File: ${filePath}`);
  console.log(`🔗 Slug: ${data.slug}`);
  console.log(`🌐 Language: ${data.lang}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Add cover image (optional): public/images/tutorials/${data.slug}.jpg`);
  console.log(`   2. Fill in excerpt`);
  console.log(`   3. Write your tutorial content`);
  console.log(`   4. Add translation (i18n field) if needed`);
  if (courseSlug) {
    console.log(`   5. Review auto-created course and add more details`);
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
