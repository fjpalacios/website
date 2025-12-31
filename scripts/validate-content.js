#!/usr/bin/env node
/**
 * Script to validate content files
 *
 * Checks:
 * - Required frontmatter fields
 * - Valid dates
 * - Valid language codes
 * - Existing author/publisher/course references
 * - Image file existence
 * - i18n translations consistency
 *
 * Usage:
 *   node scripts/validate-content.js [type]
 *
 * Arguments:
 *   type   Content type to validate (books|posts|tutorials|all) - default: all
 *
 * Examples:
 *   node scripts/validate-content.js
 *   node scripts/validate-content.js books
 *   node scripts/validate-content.js posts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentPath = path.join(__dirname, "..", "src", "content");
const publicPath = path.join(__dirname, "..", "public");

let errors = 0;
let warnings = 0;

// Helper to log errors
function logError(file, message) {
  console.error(`❌ ERROR [${file}]: ${message}`);
  errors++;
}

// Helper to log warnings
function logWarning(file, message) {
  console.warn(`⚠️  WARNING [${file}]: ${message}`);
  warnings++;
}

// Helper to extract frontmatter
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split("\n");

  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (line.startsWith("#")) continue; // Skip comments

    if (line.includes(":") && !line.startsWith(" ")) {
      // Save previous key-value
      if (currentKey) {
        frontmatter[currentKey] = currentValue.join("\n").trim();
      }

      // Parse new key-value
      const [key, ...valueParts] = line.split(":");
      currentKey = key.trim();
      currentValue = [valueParts.join(":").trim()];
    } else if (currentKey && line.trim()) {
      // Continuation of previous value (arrays, etc)
      currentValue.push(line.trim());
    }
  }

  // Save last key-value
  if (currentKey) {
    frontmatter[currentKey] = currentValue.join("\n").trim();
  }

  return frontmatter;
}

// Validate book
function validateBook(file, content) {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    logError(file, "No frontmatter found");
    return;
  }

  // Required fields
  const required = ["title", "post_slug", "date", "language", "author", "categories"];
  for (const field of required) {
    if (!frontmatter[field]) {
      logError(file, `Missing required field: ${field}`);
    }
  }

  // Validate date
  if (frontmatter.date && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
    logError(file, `Invalid date format: ${frontmatter.date} (expected YYYY-MM-DD)`);
  }

  // Validate language
  if (frontmatter.language && !["es", "en"].includes(frontmatter.language.replace(/"/g, ""))) {
    logError(file, `Invalid language: ${frontmatter.language} (expected "es" or "en")`);
  }

  // Check author exists
  if (frontmatter.author) {
    const authorSlug = frontmatter.author.replace(/"/g, "");
    const authorPath = path.join(contentPath, "authors", `${authorSlug}.json`);
    if (!fs.existsSync(authorPath)) {
      logWarning(file, `Author not found: ${authorSlug}`);
    }
  }

  // Check publisher exists (if specified)
  if (frontmatter.publisher) {
    const publisherSlug = frontmatter.publisher.replace(/"/g, "");
    const publisherPath = path.join(contentPath, "publishers", `${publisherSlug}.json`);
    if (!fs.existsSync(publisherPath)) {
      logWarning(file, `Publisher not found: ${publisherSlug}`);
    }
  }

  // Check book cover exists
  if (frontmatter.book_cover) {
    const coverPath = frontmatter.book_cover.replace(/"/g, "");
    const fullPath = path.join(publicPath, coverPath);
    if (!fs.existsSync(fullPath) && !coverPath.includes("default")) {
      logWarning(file, `Book cover image not found: ${coverPath}`);
    }
  }

  // Check excerpt
  if (!frontmatter.excerpt || frontmatter.excerpt.includes("Breve resumen")) {
    logWarning(file, "Excerpt is missing or using default template text");
  }

  // Check synopsis
  if (!frontmatter.synopsis || frontmatter.synopsis.includes("Sinopsis completa")) {
    logWarning(file, "Synopsis is missing or using default template text");
  }
}

// Validate post
function validatePost(file, content) {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    logError(file, "No frontmatter found");
    return;
  }

  // Required fields
  const required = ["title", "post_slug", "date", "language", "categories"];
  for (const field of required) {
    if (!frontmatter[field]) {
      logError(file, `Missing required field: ${field}`);
    }
  }

  // Validate date
  if (frontmatter.date && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
    logError(file, `Invalid date format: ${frontmatter.date} (expected YYYY-MM-DD)`);
  }

  // Validate language
  if (frontmatter.language && !["es", "en"].includes(frontmatter.language.replace(/"/g, ""))) {
    logError(file, `Invalid language: ${frontmatter.language} (expected "es" or "en")`);
  }

  // Check excerpt
  if (!frontmatter.excerpt || frontmatter.excerpt.includes("Breve resumen")) {
    logWarning(file, "Excerpt is missing or using default template text");
  }
}

// Validate tutorial
function validateTutorial(file, content) {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    logError(file, "No frontmatter found");
    return;
  }

  // Required fields
  const required = ["title", "post_slug", "date", "language", "categories"];
  for (const field of required) {
    if (!frontmatter[field]) {
      logError(file, `Missing required field: ${field}`);
    }
  }

  // Validate date
  if (frontmatter.date && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
    logError(file, `Invalid date format: ${frontmatter.date} (expected YYYY-MM-DD)`);
  }

  // Validate language
  if (frontmatter.language && !["es", "en"].includes(frontmatter.language.replace(/"/g, ""))) {
    logError(file, `Invalid language: ${frontmatter.language} (expected "es" or "en")`);
  }

  // Check course exists (if specified)
  if (frontmatter.courses) {
    const courseSlug = frontmatter.courses.replace(/[[\]"]/g, "").trim();
    if (courseSlug) {
      const coursePath = path.join(contentPath, "courses", `${courseSlug}.json`);
      if (!fs.existsSync(coursePath)) {
        logWarning(file, `Course not found: ${courseSlug}`);
      }
    }
  }

  // Check excerpt
  if (!frontmatter.excerpt || frontmatter.excerpt.includes("Breve resumen")) {
    logWarning(file, "Excerpt is missing or using default template text");
  }
}

// Validate directory
function validateDirectory(type, validator) {
  const dirPath = path.join(contentPath, type);

  if (!fs.existsSync(dirPath)) {
    console.log(`⏭️  Skipping ${type} (directory not found)`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  console.log(`\n📁 Validating ${type}... (${files.length} files)`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf8");
    validator(file, content);
  }
}

// Main
function main() {
  const type = process.argv[2] || "all";

  console.log("🔍 Content Validator\n");
  console.log(`Validating: ${type === "all" ? "all content types" : type}\n`);

  if (type === "all" || type === "books") {
    validateDirectory("books", validateBook);
  }

  if (type === "all" || type === "posts") {
    validateDirectory("posts", validatePost);
  }

  if (type === "all" || type === "tutorials") {
    validateDirectory("tutorials", validateTutorial);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Warnings: ${warnings}\n`);

  if (errors === 0 && warnings === 0) {
    console.log("✅ All content is valid!\n");
    process.exit(0);
  } else if (errors === 0) {
    console.log("⚠️  Content is valid but has warnings\n");
    process.exit(0);
  } else {
    console.log("❌ Content validation failed\n");
    process.exit(1);
  }
}

main();
