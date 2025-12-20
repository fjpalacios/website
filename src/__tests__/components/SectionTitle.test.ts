// Tests for SectionTitle component
// Verifies that the component can be imported and has correct structure

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("SectionTitle Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/SectionTitle.astro");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it("should have correct component structure", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for Props interface
    expect(content).toContain("interface Props");
    expect(content).toContain("title: string");

    // Check for section-title class
    expect(content).toContain('class="section-title"');

    // Check for h3 element
    expect(content).toContain("<h3>");
  });

  it("should use title prop correctly", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check that title is destructured
    expect(content).toContain("const { title }");

    // Check that title is rendered
    expect(content).toContain("{title}");
  });
});
