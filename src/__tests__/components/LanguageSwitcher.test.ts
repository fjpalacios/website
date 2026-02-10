// Tests for LanguageSwitcher component
// Verifies WCAG 2.5.3 compliance (aria-label must contain visible text)
// and correct accessible name structure

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("LanguageSwitcher Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/LanguageSwitcher.astro");
  const scssPath = path.resolve(__dirname, "../../styles/components/language-switcher.scss");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  describe("WCAG 2.5.3 - Label in Name", () => {
    it("should include visible langCode in aria-label to satisfy WCAG 2.5.3", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // aria-label must contain the visible text (langCode) so that
      // the accessible name matches the label in name requirement.
      // Pattern: aria-label must reference or interpolate langCode
      expect(content).toMatch(/aria-label=\{`\$\{langCode\}/);
    });

    it("should render visible text via language-switcher__text span", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('class="language-switcher__text"');
      expect(content).toContain("{langCode}");
    });

    it("should keep aria-label descriptive beyond just the code", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // aria-label template must still include the human-readable description
      expect(content).toMatch(/aria-label=\{`\$\{langCode\}.*flagLabel/);
    });
  });

  describe("Props interface", () => {
    it("should have correct Props interface", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("interface Props");
      expect(content).toContain("lang: LanguageKey");
      expect(content).toContain("translationSlug?:");
      expect(content).toContain("disabled?:");
    });
  });

  describe("Disabled state", () => {
    it("should support disabled prop on button", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("disabled={disabled}");
    });
  });

  describe("SCSS touch targets", () => {
    it("should define minimum 44px touch targets on mobile", () => {
      const scss = fs.readFileSync(scssPath, "utf-8");

      expect(scss).toContain("min-width: 44px");
      expect(scss).toContain("min-height: 44px");
    });
  });
});
