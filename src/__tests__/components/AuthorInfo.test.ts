// Tests for AuthorInfo component
// Verifies that the component structure is correct

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("AuthorInfo Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/AuthorInfo.astro");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it("should have correct component structure", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for Props interface with required fields
    expect(content).toContain("interface Props");
    expect(content).toContain('CollectionEntry<"authors">');
    expect(content).toContain("border");

    // Check for author-info classes
    expect(content).toContain("author-info");

    // Check for image section
    expect(content).toContain('class="author-info__image"');
    expect(content).toContain('class="author-info__image__border"');

    // Check for text section
    expect(content).toContain('class="author-info__text"');
    expect(content).toContain('class="text-area"');
  });

  it("should handle border prop with conditional class", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check that border prop has default value
    expect(content).toContain("border = true");

    // Check for conditional class logic
    expect(content).toContain("author-info--border");
  });

  it("should render author data correctly", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check that author data is used
    expect(content).toContain("author.data.picture");
    expect(content).toContain("author.data.name");

    // Check that MDX content is rendered using render() function
    expect(content).toContain('from "astro:content"');
    expect(content).toContain("render(author)");
    expect(content).toContain("<Content />");
  });
});
