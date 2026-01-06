/**
 * Shared utility functions for content creation scripts
 */

import fs from "fs";
import path from "path";
import readline from "readline";

import type { LanguageKey } from "@/types/content";

/**
 * Create readline interface for interactive mode
 */
export function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question in interactive mode
 */
export function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
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

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if entity exists and return its slug
 */
export function findEntityByName(
  collectionDir: string,
  name: string,
  fileExtension: ".json" | ".mdx" = ".json",
): string | null {
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
    if (baseName === slug || baseName.startsWith(`${slug}-`)) {
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

/**
 * Create category if it doesn't exist
 */
export function createCategoryIfNotExists(name: string, lang: LanguageKey): string {
  const existingSlug = findEntityByName("categories", name);
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
    i18n: slug,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created category: ${name} (${slug})`);
  return slug;
}

/**
 * Create course if it doesn't exist
 */
export function createCourseIfNotExists(name: string, lang: LanguageKey): string {
  const existingSlug = findEntityByName("courses", name);
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
    difficulty: "beginner" as const,
    i18n: slug,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created course: ${name} (${slug})`);
  return slug;
}

/**
 * Create author if it doesn't exist
 */
export function createAuthorIfNotExists(name: string, lang: LanguageKey): string {
  const existingSlug = findEntityByName("authors", name, ".mdx");
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

/**
 * Create publisher if it doesn't exist
 */
export function createPublisherIfNotExists(name: string, lang: LanguageKey): string {
  const existingSlug = findEntityByName("publishers", name);
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
    i18n: slug,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created publisher: ${name} (${slug})`);
  return slug;
}

/**
 * Create genre if it doesn't exist
 */
export function createGenreIfNotExists(name: string, lang: LanguageKey): string {
  const existingSlug = findEntityByName("genres", name);
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
    i18n: slug,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`   ✨ Created genre: ${name} (${slug})`);
  return slug;
}

/**
 * Parse command line arguments
 */
export function parseArgs(): Record<string, string | undefined> {
  const args = process.argv.slice(2);
  const options: Record<string, string | undefined> = {};

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

/**
 * Validate language code
 */
export function isValidLanguage(lang: string): lang is LanguageKey {
  return lang === "es" || lang === "en";
}
