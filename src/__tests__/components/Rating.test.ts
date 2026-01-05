// Tests for Rating component
// Verifies rating display with SVG icons, accessibility, and score variations

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("Rating Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/Rating.astro");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it("should have correct Props interface", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for Props interface with required fields
    expect(content).toContain("interface Props");
    expect(content).toContain('score: number | "fav"');
    expect(content).toContain('lang: "es" | "en"');
    expect(content).toContain("showText?:");
    expect(content).toContain("size?:");
  });

  it("should import Icon component", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check Icon component import
    expect(content).toContain("import Icon from");
    expect(content).toContain("Icon.astro");
  });

  it("should have BEM class structure", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for BEM naming convention
    expect(content).toContain("rating");
    expect(content).toContain("rating__stars");
    expect(content).toContain("rating__icon");
    expect(content).toContain("rating__icon--filled");
    expect(content).toContain("rating__icon--empty");
    expect(content).toContain("rating__text");
  });

  it("should render 5 icons (stars or hearts)", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for 5 icon generation
    expect(content).toContain("Array.from({ length: 5 }");
  });

  it("should use star icon for numeric scores", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for star icon usage
    expect(content).toContain('"star"');
  });

  it("should use heart icon for favorite scores", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for heart icon usage
    expect(content).toContain('"heart"');
  });

  it("should handle favorite scores", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for favorite handling
    expect(content).toContain('score === "fav"');
    expect(content).toContain("isFavorite");
  });

  it("should generate proper aria-label", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for aria-label generation with i18n
    expect(content).toContain("aria-label");
    expect(content).toContain('t(lang, "rating.favorite")');
    expect(content).toContain('t(lang, "rating.outOfFive"');
  });

  it("should support size variants", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for size prop usage
    expect(content).toContain("xs");
    expect(content).toContain("sm");
    expect(content).toContain("md");
    expect(content).toContain("lg");
    expect(content).toContain("xl");
  });

  it("should conditionally show text", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for showText conditional rendering
    expect(content).toContain("showText");
  });

  it("should import external SCSS file", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for SCSS import
    expect(content).toContain('import "@styles/components/rating.scss"');
  });

  it("should have external SCSS file with CSS custom properties", () => {
    const scssPath = path.resolve(__dirname, "../../styles/components/rating.scss");

    // Check SCSS file exists
    expect(fs.existsSync(scssPath)).toBe(true);

    // Check for CSS variables in SCSS file
    const scssContent = fs.readFileSync(scssPath, "utf-8");
    expect(scssContent).toContain("var(--");
  });

  it("should differentiate filled vs empty icons", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for filled/empty logic
    expect(content).toContain("starIndex <= numericScore");
    expect(content).toContain("rating__icon--filled");
    expect(content).toContain("rating__icon--empty");
  });

  it("should handle different colors for stars and hearts", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for favorite modifier class
    expect(content).toContain("rating--favorite");
  });

  it("should pass filled prop to Icon component for filled icons", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for filled prop usage
    expect(content).toContain("filled=");
  });

  it("should provide correct score text for favorites", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for favorite text translation calls
    expect(content).toContain('t(lang, "rating.favoriteText")');
  });

  it("should provide correct score text for numeric scores", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for numeric score text
    expect(content).toContain("/5");
  });
});
