// Tests for cover image URL handling in detail page templates
// Verifies that processed image URLs (from ImageMetadata.src) are used
// for meta tags and preload hints instead of raw frontmatter paths,
// which would cause 404 errors since assets live in src/assets/ not public/

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

const TEMPLATES = [
  {
    name: "TutorialsDetailPage",
    file: "../../pages-templates/tutorials/TutorialsDetailPage.astro",
    coverVar: "coverImage",
    rawPathVar: "coverImagePath",
  },
  {
    name: "PostsDetailPage",
    file: "../../pages-templates/posts/PostsDetailPage.astro",
    coverVar: "coverImage",
    rawPathVar: "coverImagePath",
  },
];

describe("Detail page templates — cover image URL for meta tags", () => {
  for (const template of TEMPLATES) {
    describe(template.name, () => {
      const filePath = path.resolve(__dirname, template.file);

      it("should exist", () => {
        expect(fs.existsSync(filePath)).toBe(true);
      });

      it("should use processed image src for preloadImage prop (not raw frontmatter path)", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        // preloadImage must use the .src from ImageMetadata (the Astro-processed URL),
        // not the raw /images/... path from the frontmatter which doesn't exist in public/
        expect(content).toMatch(/preloadImage=\{coverImage\.src\}/);
      });

      it("should use processed image src for Layout image prop (OG/Twitter meta)", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        // Same requirement for the OG image meta tag
        expect(content).toMatch(/image=\{coverImage\.src\}/);
      });

      it("should use processed image src for JSON-LD schema image field", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        // JSON-LD schema.org image field must also point to the real processed URL
        expect(content).toMatch(/image:\s*coverImage\.src/);
      });

      it("should NOT use raw coverImagePath for preloadImage", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        // Ensure the old broken pattern is gone
        expect(content).not.toMatch(/preloadImage=\{coverImagePath\}/);
      });

      it("should NOT use raw coverImagePath for Layout image prop", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).not.toMatch(/image=\{coverImagePath\}/);
      });
    });
  }
});
