// Tests for book cover image optimization in BooksDetailPage
// Verifies that:
// 1. The <img> uses small widths for book covers (98px rendered size)
// 2. The preload/OG image uses getImage() to obtain the optimized WebP URL
//    instead of the raw JPG from the import's .src property

import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const BOOKS_DETAIL_PATH = path.resolve(__dirname, "../../pages-templates/books/BooksDetailPage.astro");

describe("BooksDetailPage — cover image optimization", () => {
  let content: string;

  it("template file should exist", () => {
    expect(fs.existsSync(BOOKS_DETAIL_PATH)).toBe(true);
    content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");
  });

  describe("OptimizedImage widths for book cover", () => {
    it("should use small widths array for book cover (rendered at ~98px)", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // Book covers render at 98-120px wide. Widths [100, 200] cover 1x and 2x retina.
      // The default [400, 800, 1200, 1600] would download 4x more data than needed.
      expect(content).toMatch(/widths=\{\[100,\s*200\]\}/);
    });

    it("should NOT use the default large widths for book cover", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // Ensure we're not wasting bandwidth with oversized srcset entries
      // for a small thumbnail-sized image
      expect(content).not.toMatch(/widths=\{\[400,\s*800,\s*1200,\s*1600\]\}/);
    });
  });

  describe("Optimized image URL for preload and OG meta", () => {
    it("should import getImage from astro:assets", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // getImage() produces the final optimized URL (WebP) at build time
      expect(content).toMatch(/import\s*\{[^}]*getImage[^}]*\}\s*from\s*["']astro:assets["']/);
    });

    it("should call getImage() with the book cover to get optimized WebP URL", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // getImage() must be awaited with the bookCoverImage and webp format
      expect(content).toMatch(/getImage\s*\(\s*\{[^}]*src:\s*bookCoverImage[^}]*format:\s*["']webp["'][^}]*\}\s*\)/);
    });

    it("should use optimized image URL for preloadImage prop", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // The preload hint must use the WebP URL, not the original JPG
      expect(content).toMatch(/preloadImage=\{optimizedCoverImage\.src\}/);
    });

    it("should use optimized image URL for Layout image prop (OG/Twitter)", () => {
      content = fs.readFileSync(BOOKS_DETAIL_PATH, "utf-8");

      // OG image must serve WebP for modern browsers
      expect(content).toMatch(/image=\{optimizedCoverImage\.src\}/);
    });
  });
});
