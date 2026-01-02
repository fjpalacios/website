#!/usr/bin/env node

/**
 * Script to clean removed fields from content files
 * Removes dead fields that were eliminated from schemas
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT_DIR = "./src/content";

// Fields to remove by collection
const FIELDS_TO_REMOVE = {
  categories: ["icon", "color", "order"],
  authors: ["website", "twitter", "goodreads", "wikipedia", "birth_year", "death_year", "nationality"],
  publishers: ["description", "website", "country"],
  challenges: ["description", "goal", "start_date", "end_date"],
  courses: ["difficulty", "duration", "estimated_duration"],
  genres: ["description", "parent"],
  posts: ["draft", "featured_image", "canonical_url"],
  tutorials: ["draft", "difficulty", "estimated_time", "github_repo", "demo_url", "featured_image"],
};

/**
 * Clean JSON file by removing specified fields
 */
function cleanJSONFile(filePath, fieldsToRemove) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    let modified = false;
    fieldsToRemove.forEach((field) => {
      if (field in data) {
        delete data[field];
        modified = true;
      }
    });

    if (modified) {
      writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Clean MDX frontmatter by removing specified fields
 */
function cleanMDXFile(filePath, fieldsToRemove) {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontmatterMatch) {
      return false;
    }

    const frontmatter = frontmatterMatch[1];
    const body = content.slice(frontmatterMatch[0].length);

    // Remove fields from frontmatter
    let modifiedFrontmatter = frontmatter;
    let modified = false;

    fieldsToRemove.forEach((field) => {
      // Match field: value or field: "value" or field: number
      const regex = new RegExp(`^${field}:.*$`, "gm");
      if (regex.test(modifiedFrontmatter)) {
        modifiedFrontmatter = modifiedFrontmatter.replace(regex, "").replace(/\n\n+/g, "\n");
        modified = true;
      }
    });

    if (modified) {
      // Remove trailing newlines in frontmatter
      modifiedFrontmatter = modifiedFrontmatter.trim();
      const newContent = `---\n${modifiedFrontmatter}\n---\n${body}`;
      writeFileSync(filePath, newContent, "utf-8");
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Process all files in a collection directory
 */
function processCollection(collectionName, extension = "json") {
  const collectionPath = join(CONTENT_DIR, collectionName);
  const fieldsToRemove = FIELDS_TO_REMOVE[collectionName];

  if (!fieldsToRemove || fieldsToRemove.length === 0) {
    console.log(`ℹ️  ${collectionName}: No fields to remove`);
    return;
  }

  try {
    const files = readdirSync(collectionPath).filter((f) => f.endsWith(`.${extension}`));

    let modifiedCount = 0;
    files.forEach((file) => {
      const filePath = join(collectionPath, file);
      const wasModified =
        extension === "json" ? cleanJSONFile(filePath, fieldsToRemove) : cleanMDXFile(filePath, fieldsToRemove);

      if (wasModified) {
        modifiedCount++;
      }
    });

    console.log(
      `✅ ${collectionName}: ${modifiedCount}/${files.length} files modified (removed: ${fieldsToRemove.join(", ")})`,
    );
  } catch (error) {
    console.error(`❌ ${collectionName}: ${error.message}`);
  }
}

// Main execution
console.log("🧹 Cleaning schema fields from content files...\n");

// JSON collections
processCollection("categories", "json");
processCollection("publishers", "json");
processCollection("challenges", "json");
processCollection("courses", "json");
processCollection("genres", "json");

// MDX collections
processCollection("authors", "mdx");
processCollection("posts", "mdx");
processCollection("tutorials", "mdx");

console.log("\n✨ Done!");
