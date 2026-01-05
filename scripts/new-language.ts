#!/usr/bin/env tsx

/**
 * New Language Scaffolding Script
 *
 * Automatically creates all required files and folders for a new language.
 *
 * Usage:
 *   bun run new:language <code> <label> [options]
 *
 * Examples:
 *   bun run new:language fr "Français"
 *   bun run new:language pt "Português" --with-content
 *   bun run new:language ca "Català" --default
 *
 * Options:
 *   --with-content    Create content folders (books, posts, etc.)
 *   --default         Set as default language
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

// Parse arguments
const args = process.argv.slice(2);
const langCode = args[0];
const langLabel = args[1];
const withContent = args.includes("--with-content");
const isDefault = args.includes("--default");

// Validation
if (!langCode || !langLabel) {
  console.error("❌ Error: Language code and label are required\n");
  console.log("Usage: bun run new:language <code> <label> [options]\n");
  console.log("Examples:");
  console.log('  bun run new:language fr "Français"');
  console.log('  bun run new:language pt "Português" --with-content');
  console.log('  bun run new:language ca "Català" --default\n');
  console.log("Options:");
  console.log("  --with-content    Create content folders");
  console.log("  --default         Set as default language");
  process.exit(1);
}

if (langCode.length !== 2) {
  console.error("❌ Error: Language code must be 2 characters (ISO 639-1)\n");
  console.log('Examples: "en", "es", "fr", "pt", "ca"');
  process.exit(1);
}

console.log("🌍 Creating new language scaffolding...\n");
console.log(`📋 Language: ${langLabel} (${langCode})`);
console.log(`🔧 Default: ${isDefault ? "Yes" : "No"}`);
console.log(`📁 Content folders: ${withContent ? "Yes" : "No"}\n`);

const errors: string[] = [];
const created: string[] = [];
const skipped: string[] = [];

// 1. Create translation file
console.log("📝 Creating translation file...");
const localesPath = join(rootDir, "src", "locales", langCode);
const translationFile = join(localesPath, "common.json");

if (existsSync(translationFile)) {
  skipped.push(`Translation file already exists: src/locales/${langCode}/common.json`);
} else {
  mkdirSync(localesPath, { recursive: true });

  // Copy from English as template
  const enTranslationPath = join(rootDir, "src", "locales", "en", "common.json");
  if (existsSync(enTranslationPath)) {
    cpSync(enTranslationPath, translationFile);
    created.push(`src/locales/${langCode}/common.json`);
    console.log(`  ✅ Created: src/locales/${langCode}/common.json (copied from EN)`);
  } else {
    errors.push("English translation file not found to use as template");
  }
}

// 2. Create static pages
console.log("\n📄 Creating static pages...");
const pagesPath = join(rootDir, "src", "pages", langCode);

if (existsSync(pagesPath)) {
  skipped.push(`Pages folder already exists: src/pages/${langCode}/`);
} else {
  mkdirSync(pagesPath, { recursive: true });
  created.push(`src/pages/${langCode}/`);

  // Copy static pages from English
  const enPagesPath = join(rootDir, "src", "pages", "en");
  const staticPages = ["index.astro", "about.astro", "contact.astro", "feeds.astro"];

  for (const page of staticPages) {
    const enPagePath = join(enPagesPath, page);
    const newPagePath = join(pagesPath, page);

    if (existsSync(enPagePath)) {
      let content = readFileSync(enPagePath, "utf-8");

      // Replace language code in the file
      content = content.replace(/const lang = "en";/g, `const lang = "${langCode}";`);
      content = content.replace(/lang="en"/g, `lang="${langCode}"`);

      writeFileSync(newPagePath, content);
      created.push(`src/pages/${langCode}/${page}`);
      console.log(`  ✅ Created: src/pages/${langCode}/${page}`);
    } else {
      console.log(`  ⚠️  Template not found: ${page} (skipping)`);
    }
  }
}

// 3. Create content folders (optional)
if (withContent) {
  console.log("\n📚 Creating content folders...");
  const contentFolders = [
    "books",
    "posts",
    "tutorials",
    "authors",
    "categories",
    "genres",
    "publishers",
    "series",
    "challenges",
    "courses",
  ];

  for (const folder of contentFolders) {
    const contentPath = join(rootDir, "src", "content", folder, langCode);

    if (existsSync(contentPath)) {
      skipped.push(`Content folder already exists: src/content/${folder}/${langCode}/`);
    } else {
      mkdirSync(contentPath, { recursive: true });

      // Create .gitkeep to preserve empty folders
      writeFileSync(join(contentPath, ".gitkeep"), "");

      created.push(`src/content/${folder}/${langCode}/`);
      console.log(`  ✅ Created: src/content/${folder}/${langCode}/`);
    }
  }
}

// 4. Show instructions for manual steps
console.log("\n\n📋 Manual Steps Required:\n");

console.log("1️⃣  Add language configuration to src/config/languages.ts:\n");
console.log("```typescript");
console.log(`${langCode}: {`);
console.log(`  code: "${langCode}",`);
console.log(`  label: "${langLabel}",`);
console.log(`  isDefault: ${isDefault},`);
console.log(`  urlSegments: {`);
console.log(`    books: "books",        // Translate these!`);
console.log(`    tutorials: "tutorials",`);
console.log(`    posts: "posts",`);
console.log(`    authors: "authors",`);
console.log(`    publishers: "publishers",`);
console.log(`    genres: "genres",`);
console.log(`    categories: "categories",`);
console.log(`    series: "series",`);
console.log(`    challenges: "challenges",`);
console.log(`    courses: "courses",`);
console.log(`    about: "about",`);
console.log(`    contact: "contact",`);
console.log(`    feeds: "feeds",`);
console.log(`    page: "page",`);
console.log(`  },`);
console.log(`},`);
console.log("```\n");

console.log("2️⃣  Translate strings in src/locales/${langCode}/common.json\n");
console.log("   The file has been copied from English as a starting point.\n");

console.log("3️⃣  Review and adapt static pages in src/pages/${langCode}/\n");
console.log("   Language code has been updated, but content may need translation.\n");

if (withContent) {
  console.log("4️⃣  Add content to the created folders (optional)\n");
}

console.log("\n🔍 After completing manual steps, run validation:\n");
console.log("   bun run validate:languages\n");

// Report summary
console.log("\n" + "=".repeat(60));
console.log("\n📊 Summary\n");

if (created.length > 0) {
  console.log(`✅ Created ${created.length} files/folders:`);
  created.forEach((item) => console.log(`   - ${item}`));
  console.log("");
}

if (skipped.length > 0) {
  console.log(`⏭️  Skipped ${skipped.length} (already exist):`);
  skipped.forEach((item) => console.log(`   - ${item}`));
  console.log("");
}

if (errors.length > 0) {
  console.log(`❌ Errors (${errors.length}):`);
  errors.forEach((item) => console.log(`   - ${item}`));
  console.log("");
}

if (errors.length === 0) {
  console.log("✨ Scaffolding completed successfully!\n");
  console.log("📝 Next steps:");
  console.log("   1. Edit src/config/languages.ts (add language config)");
  console.log(`   2. Translate src/locales/${langCode}/common.json`);
  console.log(`   3. Review src/pages/${langCode}/*.astro`);
  console.log("   4. Run: bun run validate:languages");
  console.log("   5. Run: bun run build && bun run preview\n");
  process.exit(0);
} else {
  console.log("⚠️  Scaffolding completed with errors.\n");
  process.exit(1);
}
