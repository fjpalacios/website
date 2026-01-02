#!/usr/bin/env node

/**
 * Copy Pagefind assets to public directory for development
 *
 * This script solves the issue where Pagefind CSS/JS aren't available
 * during development because Pagefind only runs after build.
 *
 * Usage:
 *   bun run scripts/copy-pagefind-dev.js
 *
 * Or add to dev workflow:
 *   "dev": "bun run scripts/copy-pagefind-dev.js && astro dev"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const distPagefind = path.join(projectRoot, "dist", "pagefind");
const publicPagefind = path.join(projectRoot, "public", "pagefind");

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all files/folders from source
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Copying Pagefind assets for development...");

  // Check if dist/pagefind exists
  if (!fs.existsSync(distPagefind)) {
    console.error("❌ Error: dist/pagefind not found!");
    console.error('   Run "bun run build" first to generate Pagefind index.');
    console.error("   Then run this script to copy assets to public/");

    process.exit(1);
  }

  // Remove old public/pagefind if exists
  if (fs.existsSync(publicPagefind)) {
    console.log("🗑️  Removing old public/pagefind...");
    fs.rmSync(publicPagefind, { recursive: true, force: true });
  }

  // Copy dist/pagefind to public/pagefind
  console.log("📁 Copying dist/pagefind → public/pagefind...");
  copyDirectory(distPagefind, publicPagefind);

  console.log("✅ Pagefind assets copied successfully!");
  console.log('   You can now run "bun run dev" and search will work.');
  console.log("");
  console.log("⚠️  Note: If you modify content, you must:");
  console.log('   1. Run "bun run build" (regenerates Pagefind index)');
  console.log("   2. Run this script again (copies new index to public/)");
}

// Run
main();
