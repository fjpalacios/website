#!/usr/bin/env tsx

/**
 * Language Configuration Validator
 *
 * Validates that all configured languages have the required files and folders.
 * Run this after adding a new language to ensure everything is properly set up.
 *
 * Usage: bun run validate:languages
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { getAllLanguages } from "../src/config/languages.ts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

const errors: string[] = [];
const warnings: string[] = [];

console.log("🔍 Validating language configuration...\n");

const languages = getAllLanguages();

console.log(`📋 Configured languages: ${languages.map((l) => `${l.code} (${l.label})`).join(", ")}\n`);

for (const lang of languages) {
  const { code, label } = lang;
  console.log(`Checking ${code} (${label})...`);

  // 1. Check translation files
  const translationPath = join(rootDir, "src", "locales", code, "common.json");
  if (!existsSync(translationPath)) {
    errors.push(`❌ Missing translation file: src/locales/${code}/common.json`);
  } else {
    console.log(`  ✅ Translation file exists`);
  }

  // 2. Check content folders (optional - content is organized by collection, not by language subfolders)
  // Note: Content structure is src/content/{collection}/{slug}.md with language in frontmatter
  // We don't need to check for language subfolders

  // 3. Check static pages
  const staticPagesPath = join(rootDir, "src", "pages", code);
  if (!existsSync(staticPagesPath)) {
    errors.push(`❌ Missing static pages folder: src/pages/${code}`);
  } else {
    console.log(`  ✅ Static pages folder exists`);

    // Check for critical pages
    const criticalPages = ["index.astro"];
    for (const page of criticalPages) {
      const pagePath = join(staticPagesPath, page);
      if (!existsSync(pagePath)) {
        errors.push(`❌ Missing critical page: src/pages/${code}/${page}`);
      }
    }
  }

  console.log("");
}

// Report results
console.log("\n📊 Validation Results\n");

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ All checks passed! Language configuration is valid.\n");
  process.exit(0);
}

if (errors.length > 0) {
  console.log("🚨 ERRORS (must fix):\n");
  errors.forEach((err) => console.log(`  ${err}`));
  console.log("");
}

if (warnings.length > 0) {
  console.log("⚠️  WARNINGS (optional):\n");
  warnings.forEach((warn) => console.log(`  ${warn}`));
  console.log("");
}

if (errors.length > 0) {
  console.log("❌ Validation failed. Please fix the errors above.\n");
  process.exit(1);
} else {
  console.log("✅ Validation passed with warnings (content folders are optional).\n");
  process.exit(0);
}
