#!/usr/bin/env bun

/**
 * Generate Image Imports Script
 *
 * Automatically generates src/utils/imageImports.ts by scanning src/assets/
 * for all image files (books, authors, defaults, tutorials, posts).
 *
 * Usage:
 *   bun run scripts/generate-image-imports.ts
 *   bun run generate:images (via package.json script)
 *
 * This ensures all images are statically imported for Astro's build-time optimization.
 */

import { readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

// ============================================================================
// CONFIGURATION
// ============================================================================

const SRC_ASSETS_DIR = join(process.cwd(), "src", "assets");
const OUTPUT_FILE = join(process.cwd(), "src", "utils", "imageImports.ts");

const IMAGE_CATEGORIES = {
  books: {
    dir: "books",
    mapName: "bookCovers",
    description: "Book Cover Images",
    helperName: "getBookCoverImage",
    hasLangFallback: true,
  },
  authors: {
    dir: "authors",
    mapName: "authorPictures",
    description: "Author Picture Images",
    helperName: "getAuthorPictureImage",
    hasLangFallback: false,
  },
  defaults: {
    dir: "defaults",
    mapName: "defaultImages",
    description: "Default Images",
    helperName: null, // No helper needed, used directly
    hasLangFallback: false,
  },
  tutorials: {
    dir: "tutorials",
    mapName: "tutorialCovers",
    description: "Tutorial Cover Images",
    helperName: "getTutorialCoverImage",
    hasLangFallback: false,
  },
  posts: {
    dir: "posts",
    mapName: "postCovers",
    description: "Post Cover Images",
    helperName: "getPostCoverImage",
    hasLangFallback: false,
  },
};

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

// ============================================================================
// UTILITIES
// ============================================================================

interface ImageFile {
  filename: string;
  slug: string;
  varName: string;
  importPath: string;
}

/**
 * Convert filename to a valid camelCase variable name
 * Examples:
 *   "el-hobbit.jpg" -> "elHobbit"
 *   "stephen-king.jpg" -> "stephenKing"
 *   "book-default-es.jpg" -> "bookDefaultEs"
 */
function toVarName(filename: string): string {
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");

  return nameWithoutExt
    .split("-")
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Get slug from filename (filename without extension)
 */
function toSlug(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
}

/**
 * Scan a directory for image files and return metadata
 */
function scanImages(category: keyof typeof IMAGE_CATEGORIES): ImageFile[] {
  const categoryPath = join(SRC_ASSETS_DIR, IMAGE_CATEGORIES[category].dir);

  if (!existsSync(categoryPath)) {
    console.warn(`⚠️  Directory not found: ${categoryPath}`);
    return [];
  }

  const files = readdirSync(categoryPath);
  const imageFiles: ImageFile[] = [];

  for (const filename of files) {
    const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      continue;
    }

    imageFiles.push({
      filename,
      slug: toSlug(filename),
      varName: toVarName(filename),
      importPath: `@/assets/${IMAGE_CATEGORIES[category].dir}/${filename}`,
    });
  }

  return imageFiles.sort((a, b) => a.filename.localeCompare(b.filename));
}

// ============================================================================
// CODE GENERATION
// ============================================================================

/**
 * Generate import statements
 */
function generateImports(category: keyof typeof IMAGE_CATEGORIES, images: ImageFile[]): string {
  if (images.length === 0) return "";

  const lines: string[] = [];
  const { description } = IMAGE_CATEGORIES[category];

  lines.push("// " + "=".repeat(76));
  lines.push(`// ${description.toUpperCase()}`);
  lines.push("// " + "=".repeat(76));
  lines.push("");

  for (const image of images) {
    lines.push(`import ${image.varName} from '${image.importPath}';`);
  }

  return lines.join("\n");
}

/**
 * Generate map/record for image category
 */
function generateMap(category: keyof typeof IMAGE_CATEGORIES, images: ImageFile[]): string {
  // Always generate maps, even if empty (needed for type safety)
  // Only skip defaults if empty (they're required)

  const { mapName, description } = IMAGE_CATEGORIES[category];
  const lines: string[] = [];

  lines.push("/**");
  lines.push(` * ${description} Map`);
  lines.push(" * ");

  if (category === "defaults") {
    lines.push(" * Fallback images when content doesn't specify a cover/picture");
  } else {
    lines.push(` * Key: Image filename (without extension) - matches the filename in content frontmatter`);
    lines.push(" * Value: Imported ImageMetadata");
  }

  lines.push(" * ");
  lines.push(" * Usage:");
  lines.push(" * ```astro");

  if (category === "defaults") {
    lines.push(` * import { ${mapName} } from '@/utils/imageImports';`);
    lines.push(` * <OptimizedImage src={${mapName}.postDefault} alt="Default post cover" />`);
  } else {
    lines.push(` * import { ${mapName} } from '@/utils/imageImports';`);
    lines.push(` * <OptimizedImage src={${mapName}['${images[0]?.slug || "slug"}']} alt="..." />`);
  }

  lines.push(" * ```");
  lines.push(" */");

  // For defaults, use object notation; for others, use Record
  if (category === "defaults") {
    lines.push(`export const ${mapName} = {`);
    for (const image of images) {
      lines.push(`  ${image.varName},`);
    }
    lines.push("};");
  } else {
    lines.push(`export const ${mapName}: Record<string, ImageMetadata> = {`);
    for (const image of images) {
      lines.push(`  '${image.slug}': ${image.varName},`);
    }
    lines.push("};");
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Generate helper function for getting images with fallback
 */
function generateHelper(category: keyof typeof IMAGE_CATEGORIES, images: ImageFile[]): string {
  const { helperName, mapName, hasLangFallback } = IMAGE_CATEGORIES[category];

  if (!helperName) return "";

  const lines: string[] = [];

  lines.push("/**");
  lines.push(
    ` * Get a ${category.slice(0, -1)} ${category === "authors" ? "picture" : "cover"} by filename (without path or extension)`,
  );
  lines.push(" * ");
  lines.push(
    ` * @param ${category === "authors" ? "picturePath" : "coverPath"} - Path from content frontmatter (e.g., "/images/${category}/example.jpg")`,
  );

  if (hasLangFallback) {
    lines.push(" * @param lang - Language for default cover fallback");
  }

  lines.push(" * @returns ImageMetadata for optimized rendering");
  lines.push(" * ");
  lines.push(" * @example");

  if (hasLangFallback) {
    lines.push(` * const cover = ${helperName}('/images/${category}/example.jpg', 'es');`);
  } else {
    lines.push(
      ` * const ${category === "authors" ? "picture" : "cover"} = ${helperName}('/images/${category}/example.jpg');`,
    );
  }

  lines.push(` * <OptimizedImage src={${category === "authors" ? "picture" : "cover"}} alt="..." />`);
  lines.push(" */");

  // Function signature
  if (hasLangFallback) {
    lines.push(`export function ${helperName}(`);
    lines.push(`  coverPath: string | undefined,`);
    lines.push(`  lang: 'es' | 'en' = 'es'`);
    lines.push(`): ImageMetadata {`);
  } else if (category === "authors") {
    lines.push(`export function ${helperName}(`);
    lines.push(`  picturePath: string | undefined`);
    lines.push(`): ImageMetadata | undefined {`);
  } else {
    lines.push(`export function ${helperName}(`);
    lines.push(`  coverPath: string | undefined`);
    lines.push(`): ImageMetadata {`);
  }

  // Function body
  if (category === "authors") {
    lines.push("  if (!picturePath) {");
    lines.push("    return undefined;");
    lines.push("  }");
    lines.push("");
    lines.push("  // If it's a full path, extract filename");
    lines.push("  const slug = picturePath.includes('/')");
    lines.push("    ? picturePath.split('/').pop()?.replace(/\\.(jpg|jpeg|png|webp)$/i, '')");
    lines.push("    : picturePath;");
    lines.push("");
    lines.push(`  if (!slug || !${mapName}[slug]) {`);
    lines.push("    console.warn(`Author picture not found: ${picturePath} (slug: ${slug})`);");
    lines.push("    return undefined;");
    lines.push("  }");
    lines.push("");
    lines.push(`  return ${mapName}[slug];`);
  } else {
    lines.push("  if (!coverPath) {");

    if (hasLangFallback) {
      lines.push("    return lang === 'es' ? defaultImages.bookDefaultEs : defaultImages.bookDefaultEn;");
    } else {
      const defaultKey = category === "tutorials" ? "tutorialDefault" : "postDefault";
      lines.push(`    return defaultImages.${defaultKey};`);
    }

    lines.push("  }");
    lines.push("");
    lines.push('  // Extract filename from path: "/images/books/el-hobbit.jpg" -> "el-hobbit"');
    lines.push("  const filename = coverPath.split('/').pop()?.replace(/\\.(jpg|jpeg|png|webp)$/i, '');");
    lines.push("  ");
    lines.push(`  if (!filename || !${mapName}[filename]) {`);

    if (images.length === 0) {
      lines.push(
        `    console.warn(\`Custom ${category} covers not yet implemented. Using default for: \${coverPath}\`);`,
      );
    } else {
      lines.push(
        `    console.warn(\`${category.charAt(0).toUpperCase() + category.slice(1, -1)} cover not found: \${coverPath} (filename: \${filename})\`);`,
      );
    }

    if (hasLangFallback) {
      lines.push("    return lang === 'es' ? defaultImages.bookDefaultEs : defaultImages.bookDefaultEn;");
    } else {
      const defaultKey = category === "tutorials" ? "tutorialDefault" : "postDefault";
      lines.push(`    return defaultImages.${defaultKey};`);
    }

    lines.push("  }");
    lines.push("");
    lines.push(`  return ${mapName}[filename];`);
  }

  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate utility functions
 */
function generateUtilities(): string {
  const lines: string[] = [];

  lines.push("// " + "=".repeat(76));
  lines.push("// UTILITIES");
  lines.push("// " + "=".repeat(76));
  lines.push("");
  lines.push("/**");
  lines.push(" * Get all available book cover keys");
  lines.push(" * Useful for validation or listing");
  lines.push(" */");
  lines.push("export function getAvailableBookCovers(): string[] {");
  lines.push("  return Object.keys(bookCovers);");
  lines.push("}");
  lines.push("");
  lines.push("/**");
  lines.push(" * Get all available author picture keys");
  lines.push(" * Useful for validation or listing");
  lines.push(" */");
  lines.push("export function getAvailableAuthorPictures(): string[] {");
  lines.push("  return Object.keys(authorPictures);");
  lines.push("}");
  lines.push("");
  lines.push("/**");
  lines.push(" * Check if a book cover exists");
  lines.push(" * ");
  lines.push(" * @param coverPath - Path or slug to check");
  lines.push(" * @returns true if the cover exists in the imports");
  lines.push(" */");
  lines.push("export function hasBookCover(coverPath: string): boolean {");
  lines.push("  const filename = coverPath.split('/').pop()?.replace(/\\.(jpg|jpeg|png|webp)$/i, '');");
  lines.push("  return !!filename && !!bookCovers[filename];");
  lines.push("}");
  lines.push("");
  lines.push("/**");
  lines.push(" * Check if an author picture exists");
  lines.push(" * ");
  lines.push(" * @param slug - Author slug to check");
  lines.push(" * @returns true if the picture exists in the imports");
  lines.push(" */");
  lines.push("export function hasAuthorPicture(slug: string): boolean {");
  lines.push("  const authorSlug = slug.split('/').pop()?.replace(/\\.(jpg|jpeg|png|webp)$/i, '');");
  lines.push("  return !!authorSlug && !!authorPictures[authorSlug];");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate complete imageImports.ts file
 */
function generateFile(): string {
  const lines: string[] = [];

  // Header
  lines.push("/**");
  lines.push(" * Static Image Imports");
  lines.push(" * ");
  lines.push(" * This file contains all static image imports for build-time optimization.");
  lines.push(" * Astro's image optimization only works with imported images, not string paths.");
  lines.push(" * ");
  lines.push(" * ⚠️  AUTO-GENERATED FILE - DO NOT EDIT MANUALLY");
  lines.push(" * Generated by: scripts/generate-image-imports.ts");
  lines.push(` * Generated at: ${new Date().toISOString()}`);
  lines.push(" * ");
  lines.push(" * To regenerate this file:");
  lines.push(" *   bun run generate:images");
  lines.push(" * ");
  lines.push(" * When adding new images:");
  lines.push(" * 1. Place the image in src/assets/[category]/ (books, authors, tutorials, posts, defaults)");
  lines.push(" * 2. Run: bun run generate:images");
  lines.push(" * 3. Build: bun run build (Astro will optimize automatically)");
  lines.push(" */");
  lines.push("");
  lines.push("import type { ImageMetadata } from 'astro';");
  lines.push("");

  // Scan and generate for each category
  const scannedData: Record<string, ImageFile[]> = {};

  for (const category of Object.keys(IMAGE_CATEGORIES) as (keyof typeof IMAGE_CATEGORIES)[]) {
    const images = scanImages(category);
    scannedData[category] = images;

    // Generate imports
    lines.push(generateImports(category, images));
  }

  // Generate maps
  for (const category of Object.keys(IMAGE_CATEGORIES) as (keyof typeof IMAGE_CATEGORIES)[]) {
    lines.push(generateMap(category, scannedData[category]));
  }

  // Helper functions header
  lines.push("// " + "=".repeat(76));
  lines.push("// HELPER FUNCTIONS");
  lines.push("// " + "=".repeat(76));
  lines.push("");

  // Generate helpers
  for (const category of Object.keys(IMAGE_CATEGORIES) as (keyof typeof IMAGE_CATEGORIES)[]) {
    lines.push(generateHelper(category, scannedData[category]));
  }

  // Generate utilities
  lines.push(generateUtilities());

  return lines.join("\n");
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log("🖼️  Generating image imports...\n");

  try {
    // Check if src/assets exists
    if (!existsSync(SRC_ASSETS_DIR)) {
      console.error(`❌ Error: src/assets directory not found at ${SRC_ASSETS_DIR}`);
      process.exit(1);
    }

    // Scan all categories
    console.log("📂 Scanning image directories:");
    const stats: Record<string, number> = {};

    for (const category of Object.keys(IMAGE_CATEGORIES) as (keyof typeof IMAGE_CATEGORIES)[]) {
      const images = scanImages(category);
      stats[category] = images.length;
      console.log(`   ${IMAGE_CATEGORIES[category].dir.padEnd(12)} → ${images.length} images`);
    }

    console.log("");

    // Generate file
    const content = generateFile();

    // Write to file
    writeFileSync(OUTPUT_FILE, content, "utf-8");

    console.log(`✅ Generated: ${OUTPUT_FILE}`);
    console.log("");
    console.log("📊 Summary:");

    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    for (const [category, count] of Object.entries(stats)) {
      console.log(`   ${category.padEnd(12)} ${count} images`);
    }
    console.log(`   ${"TOTAL".padEnd(12)} ${total} images`);
    console.log("");
    console.log('🎉 Done! You can now run "bun run build" to optimize images.');
  } catch (error) {
    console.error("❌ Error generating image imports:", error);
    process.exit(1);
  }
}

main();
