// Tests for cover image URL handling in detail page templates
// Verifies that optimized WebP URLs (from getImage()) are used
// for meta tags and preload hints instead of raw coverImage.src (JPG)
// or raw frontmatter paths, which would cause 404s or serve unoptimized images.

import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const TEMPLATES = [
  {
    name: "TutorialsDetailPage",
    file: "../../pages-templates/tutorials/TutorialsDetailPage.astro",
    optimizedVar: "optimizedCoverImage",
    rawCoverVar: "coverImage",
    rawPathVar: "coverImagePath",
  },
  {
    name: "PostsDetailPage",
    file: "../../pages-templates/posts/PostsDetailPage.astro",
    optimizedVar: "optimizedCoverImage",
    rawCoverVar: "coverImage",
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

      it("should use getImage() to produce an optimized WebP URL", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        // getImage() generates the final /_astro/*.webp URL at build time
        expect(content).toMatch(/getImage\s*\(\s*\{[^}]*src:\s*coverImage[^}]*format:\s*["']webp["'][^}]*\}\s*\)/);
      });

      it("should use optimized WebP src for preloadImage prop", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).toMatch(new RegExp(`preloadImage=\\{${template.optimizedVar}\\.src\\}`));
      });

      it("should use optimized WebP src for Layout image prop (OG/Twitter meta)", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).toMatch(new RegExp(`image=\\{${template.optimizedVar}\\.src\\}`));
      });

      it("should use optimized WebP src for JSON-LD schema image field", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).toMatch(new RegExp(`image:\\s*${template.optimizedVar}\\.src`));
      });

      it("should NOT use raw coverImage.src for preloadImage (would serve JPG)", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).not.toMatch(new RegExp(`preloadImage=\\{${template.rawCoverVar}\\.src\\}`));
      });

      it("should NOT use raw coverImage.src for Layout image prop", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).not.toMatch(new RegExp(`image=\\{${template.rawCoverVar}\\.src\\}`));
      });

      it("should NOT use raw coverImagePath for preloadImage", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).not.toMatch(/preloadImage=\{coverImagePath\}/);
      });

      it("should NOT use raw coverImagePath for Layout image prop", () => {
        const content = fs.readFileSync(filePath, "utf-8");

        expect(content).not.toMatch(/image=\{coverImagePath\}/);
      });
    });
  }
});
