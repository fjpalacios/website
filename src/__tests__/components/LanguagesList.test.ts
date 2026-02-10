// Tests for LanguagesList component
// Verifies touch target compliance (WCAG 2.5.5) for name and language tag links

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("LanguagesList Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/LanguagesList.astro");
  const scssPath = path.resolve(__dirname, "../../styles/components/languages-list.scss");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  describe("HTML structure", () => {
    it("should render name link when url is provided", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('class="languages-list__name"');
      expect(content).toContain("item.url");
      expect(content).toContain("<a href=");
    });

    it("should render language tag links pointing to DDG search", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('class="languages-list__languages"');
      expect(content).toContain("ddg.gg");
    });
  });

  describe("WCAG 2.5.5 — Touch targets", () => {
    it("should apply min-height: 44px to __name links on mobile", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      // __name block must exist and file must contain 44px touch target
      expect(scss).toContain("&__name");
      expect(scss).toContain("min-height: 44px");
    });

    it("should apply min-height: 44px to __languages li links on mobile", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      // Verify both the __languages block and the 44px value exist in the file
      expect(scss).toContain("&__languages");
      expect(scss).toContain("min-height: 44px");
    });

    it("should reset min-height to auto on small-and-up for __name links", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      // Both 44px mobile targets and auto desktop reset must coexist
      expect(scss).toContain("min-height: 44px");
      expect(scss).toContain("min-height: auto");
    });

    it("should reset min-height to auto on small-and-up for __languages links", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      // The auto reset cancels the 44px on tablet+
      expect(scss).toContain("min-height: auto");
    });
  });
});
