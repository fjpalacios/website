// Tests for PostList component
// Verifies grid rendering, image loading strategy for LCP/CLS optimization,
// and correct prop forwarding to OptimizedImage

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("PostList Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/PostList.astro");
  const scssPath = path.resolve(__dirname, "../../styles/components/post-list.scss");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  describe("Props interface", () => {
    it("should define posts, lang and showOrderBadges props", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("interface Props");
      expect(content).toContain("posts:");
      expect(content).toContain('lang: "es" | "en"');
      expect(content).toContain("showOrderBadges?:");
    });
  });

  describe("LCP / CLS optimization — first item eager loading", () => {
    it("should accept an index in the map to identify the first item", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // posts.map must destructure index to know which item is first
      expect(content).toMatch(/posts\.map\(\s*\(\s*(?:\w+\s*,\s*index|\(\s*\w+\s*,\s*index\s*\))/);
    });

    it("should use loading=eager for the first item (index === 0)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // First item must load eagerly to avoid LCP delay
      expect(content).toMatch(/index\s*===\s*0.*eager|eager.*index\s*===\s*0/s);
    });

    it("should use fetchpriority=high for the first item (index === 0)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // First item must have high fetch priority to improve LCP
      expect(content).toMatch(/index\s*===\s*0.*high|high.*index\s*===\s*0/s);
    });

    it("should keep loading=lazy for subsequent items (index > 0)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // All items except the first should remain lazy
      expect(content).toContain('"lazy"');
    });

    it("should pass fetchpriority prop to OptimizedImage", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("fetchpriority=");
    });
  });

  describe("BEM structure", () => {
    it("should use blog__grid BEM block for the grid", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('class="blog"');
      expect(content).toContain('class="blog__grid"');
      expect(content).toContain('class="blog__grid__post"');
      expect(content).toContain('class="blog__grid__post__image-wrapper"');
    });
  });

  describe("SCSS", () => {
    it("should define image-wrapper with position relative for badges", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      expect(scss).toContain("&__image-wrapper");
      expect(scss).toContain("position: relative");
    });

    it("should set img to 100% width and block display to prevent layout shift", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      expect(scss).toContain("width: 100%");
      expect(scss).toContain("display: block");
    });
  });
});
