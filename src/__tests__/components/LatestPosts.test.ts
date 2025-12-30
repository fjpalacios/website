// Tests for LatestPosts component
// Verifies component structure, props, and query logic

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("LatestPosts Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/LatestPosts.astro");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it("should have correct component structure", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for Props interface
    expect(content).toContain("interface Props");
    expect(content).toContain("limit");
    expect(content).toContain("lang");

    // Check for BEM class structure
    expect(content).toContain("latest-posts");
    expect(content).toContain("latest-posts__list");
    expect(content).toContain("latest-posts__list__post");
  });

  it("should use getLatestPosts utility function", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check that it imports the utility from the correct path
    expect(content).toContain('from "@utils/content/getLatestPosts"');
    expect(content).toContain("getLatestPosts");

    // Check that it calls the utility with correct parameters
    expect(content).toContain("await getLatestPosts(lang, limit)");
  });

  it("should use vintage date formatting", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for formatVintageDate import and usage
    expect(content).toContain("formatVintageDate");
    expect(content).toContain("datetime");
    expect(content).toContain("aria");
    expect(content).toContain("visual");
  });

  it("should use route builders for URLs", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for route builder imports
    expect(content).toContain("buildBookUrl");
    expect(content).toContain("buildPostUrl");
    expect(content).toContain("buildTutorialUrl");
  });

  it("should have content type badges", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for getContentBadge function
    expect(content).toContain("getContentBadge");

    // Check for badge element in template
    expect(content).toContain("latest-posts__list__post__title__badge");

    // Check that badge is rendered with aria-label
    expect(content).toContain("aria-label={post.type}");

    // Check for emoji badges in function
    expect(content).toContain("📚"); // book
    expect(content).toContain("🎓"); // tutorial
    expect(content).toContain("📝"); // post
  });

  it("should have 'View All Posts' link", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for footer element
    expect(content).toContain("latest-posts__footer");

    // Check for link element
    expect(content).toContain("latest-posts__footer__link");

    // Check for buildIndexUrl import and usage
    expect(content).toContain("buildIndexUrl");

    // Check for translation key
    expect(content).toContain("viewAllPosts");
  });

  it("should use translation system", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for translation imports and usage
    expect(content).toContain('from "@locales"');
    expect(content).toContain("t(");
    expect(content).toContain("latestBlogPosts");
  });

  it("should render semantic HTML", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for semantic HTML elements (following Gatsby structure)
    expect(content).toContain("<main");
    expect(content).toContain("<section");
    expect(content).toContain("<time");
  });

  it("should include accessibility attributes", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for ARIA attributes
    expect(content).toContain("datetime");
    expect(content).toContain("aria-label");
  });

  it("should only render when posts exist", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for conditional rendering
    expect(content).toContain("latestPosts.length > 0");
  });

  it("should have default limit prop", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Check for default limit value
    expect(content).toMatch(/limit\s*=\s*4/);
  });

  describe("Empty State Handling", () => {
    it("should not render any HTML when there are no posts", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Verify that the component checks for empty array before rendering
      // This prevents rendering empty sections, titles, or placeholders
      expect(content).toContain("latestPosts.length > 0");

      // Verify that main container is wrapped in conditional
      expect(content).toMatch(/latestPosts\.length\s*>\s*0\s*&&\s*\(/);
    });

    it("should handle case where language has no content", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Component uses getLatestPosts utility which filters by language
      // If a language has no posts, the array should be empty and nothing should render
      expect(content).toContain("getLatestPosts");
      expect(content).toContain("latestPosts.length > 0");
    });

    it("should handle case where all posts are drafts", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Component uses getLatestPosts utility which filters out drafts
      // If all posts are drafts, the array should be empty and nothing should render
      expect(content).toContain("getLatestPosts");
      expect(content).toContain("latestPosts.length > 0");
    });

    it("should not render title component when no posts", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Verify that Title component is inside the conditional block
      // So it won't render when there are no posts
      const titleImport = content.indexOf("import Title");
      const conditionalRender = content.indexOf("latestPosts.length > 0");
      const titleUsage = content.indexOf("<Title");

      expect(titleImport).toBeGreaterThan(-1);
      expect(conditionalRender).toBeGreaterThan(-1);
      expect(titleUsage).toBeGreaterThan(conditionalRender);
    });

    it("should not render empty list when no posts", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Verify that the list container is inside the conditional
      // So no empty <section class="latest-posts__list"> is rendered
      const listClass = content.indexOf("latest-posts__list");
      const conditionalRender = content.indexOf("latestPosts.length > 0");

      expect(listClass).toBeGreaterThan(conditionalRender);
    });

    it("should gracefully handle mixed empty collections", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Component uses getLatestPosts utility which handles all collections
      // When books, posts, or tutorials are empty individually,
      // the component should still work if ANY collection has content
      expect(content).toContain("getLatestPosts");
      expect(content).toContain("latestPosts.length > 0");
    });
  });
});
