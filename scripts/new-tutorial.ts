#!/usr/bin/env node
/**
 * Script to create a new tutorial entry with automatic entity creation
 *
 * Usage:
 *   bun run new:tutorial --title "Tutorial Title" [options]
 *
 * Required:
 *   --title        Tutorial title
 *
 * Optional:
 *   --lang         Language (es|en) - default: es
 *   --course       Course name (will be created if doesn't exist)
 *   --categories   Comma-separated category names (will be created if don't exist)
 *   --interactive  Run in interactive mode
 *
 * Features:
 *   - Auto-creates course if not found
 *   - Auto-creates categories if not found
 *   - Smart slug generation
 *
 * Examples:
 *   bun run new:tutorial --interactive
 *   bun run new:tutorial --title "Cómo usar Git" --lang es --course "Domina Git desde cero"
 */

import fs from "fs";
import path from "path";

import type { LanguageKey } from "@/types/content";

import type { TutorialData } from "./shared-types";
import {
  createInterface,
  question,
  slugify,
  getTodayDate,
  createCategoryIfNotExists,
  createCourseIfNotExists,
  parseArgs,
  isValidLanguage,
} from "./shared-utils";

function getTutorialTemplate(data: TutorialData): string {
  const { title, slug, date, lang, course, categories, excerpt } = data;

  return `---
title: "${title}"
post_slug: "${slug}"
date: ${date}
excerpt: "${excerpt || "Breve resumen del tutorial..."}"
language: "${lang}"
i18n: ""
${course ? `course: "${course}"` : '# course: "course-slug" # Optional: link to a course'}
categories: [${categories && categories.length > 0 ? categories.map((c) => `"${c}"`).join(", ") : '"tutoriales"'}]
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

async function interactiveMode(): Promise<TutorialData> {
  const rl = createInterface();

  console.log("\n🎓 Creating a new tutorial entry (interactive mode)");
  console.log("💡 Tip: Course and categories will be auto-created if they don't exist\n");

  const title = await question(rl, "Tutorial title: ");
  const langInput = (await question(rl, "Language (es|en) [default: es]: ")) || "es";
  const course = await question(rl, "Course name (optional, will be created if doesn't exist): ");
  const categoriesInput = await question(rl, "Categories (comma-separated names) [default: tutoriales/tutorials]: ");

  rl.close();

  const lang: LanguageKey = isValidLanguage(langInput) ? langInput : "es";

  const categories = categoriesInput
    ? categoriesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : lang === "es"
      ? ["tutoriales"]
      : ["tutorials"];

  const slug = slugify(title);
  const date = getTodayDate();

  return {
    title,
    slug,
    date,
    lang,
    course: course || null,
    categories,
    excerpt: null,
  };
}

async function main(): Promise<void> {
  const args = parseArgs();

  let data: TutorialData;

  if (args.interactive) {
    data = await interactiveMode();
  } else {
    if (!args.title) {
      console.error("❌ Error: --title is required\n");
      console.log('Usage: bun run new:tutorial --title "Tutorial Title"');
      console.log("Or run in interactive mode: bun run new:tutorial --interactive\n");
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
      course: args.course || null,
      categories: args.categories
        ? args.categories.split(",").map((c) => c.trim())
        : lang === "es"
          ? ["tutoriales"]
          : ["tutorials"],
      excerpt: null,
    };
  }

  console.log("\n🔍 Processing entities...\n");

  // Create or find course (if provided)
  let courseSlug: string | null = null;
  if (data.course) {
    courseSlug = createCourseIfNotExists(data.course, data.lang);
  }

  // Create or find categories
  let categorySlugs: string[] = [];
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

main().catch((error: Error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
