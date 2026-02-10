// Tests for Paginator component
// Verifies WCAG 2.5.3 compliance (aria-label must not mismatch visible text),
// accessible landmark structure, and correct prev/next semantics

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("Paginator Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/Paginator.astro");
  const scssPath = path.resolve(__dirname, "../../styles/components/paginator.scss");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  describe("Props interface", () => {
    it("should define required pagination props", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("interface Props");
      expect(content).toContain("currentPage:");
      expect(content).toContain("totalPages:");
      expect(content).toContain("basePath:");
      expect(content).toContain("lang?:");
    });
  });

  describe("WCAG 2.5.3 — Label in Name (prev/next buttons)", () => {
    it("should NOT have aria-label on prev button (visible text is the accessible name)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // The prev button text (e.g. "« Anterior") IS the accessible name.
      // Adding a different aria-label (e.g. "Página anterior") violates WCAG 2.5.3
      // because the accessible name does not contain the visible text.
      // Solution: remove aria-label from prev/next and rely on visible text.
      expect(content).not.toMatch(/paginator__button--prev[^>]*aria-label/s);
    });

    it("should NOT have aria-label on next button (visible text is the accessible name)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).not.toMatch(/paginator__button--next[^>]*aria-label/s);
    });

    it("should keep aria-label on first/last buttons (symbol-only content «/»)", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // «/» are symbols — they need an aria-label to be meaningful
      expect(content).toMatch(/paginator__button--first[^>]*aria-label/s);
      expect(content).toMatch(/paginator__button--last[^>]*aria-label/s);
    });
  });

  describe("Nav landmark", () => {
    it("should render a nav element with aria-label", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('<nav class="paginator"');
      expect(content).toContain("aria-label=");
    });
  });

  describe("Current page indicator", () => {
    it("should mark current page with aria-current=page", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('aria-current="page"');
    });
  });

  describe("SCSS", () => {
    it("should exist", () => {
      expect(fs.existsSync(scssPath)).toBe(true);
    });
  });
});
