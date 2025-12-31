// Tests for tutorial utilities
// Utilities for tutorial pages and tutorial-related operations

import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { prepareTutorialSummary } from "@/utils/blog/tutorials";

// Mock tutorial data
const mockTutorial: CollectionEntry<"tutorials"> = {
  id: "test-tutorial.mdx",
  collection: "tutorials",
  data: {
    title: "Test Tutorial",
    post_slug: "test-tutorial",
    date: new Date("2024-01-15"),
    excerpt: "Learn how to test",
    language: "en",
    category: "tutorials",
    difficulty: "beginner",
    estimated_time: 30,
    draft: false,
  },
} as CollectionEntry<"tutorials">;

const mockTutorialWithOptional: CollectionEntry<"tutorials"> = {
  id: "advanced-tutorial.mdx",
  collection: "tutorials",
  data: {
    title: "Advanced Tutorial",
    post_slug: "advanced-tutorial",
    date: new Date("2024-02-01"),
    excerpt: "Advanced concepts",
    language: "es",
    category: "tutorials",
    difficulty: "advanced",
    estimated_time: 120,
    draft: false,
    github_repo: "https://github.com/test/repo",
    demo_url: "https://demo.example.com",
    course: "javascript-fundamentals",
    featured_image: "./images/tutorial.png",
  },
} as CollectionEntry<"tutorials">;

describe("prepareTutorialSummary", () => {
  it("should create tutorial summary with basic fields", () => {
    const summary = prepareTutorialSummary(mockTutorial);

    expect(summary.type).toBe("tutorial");
    expect(summary.title).toBe("Test Tutorial");
    expect(summary.slug).toBe("test-tutorial");
    expect(summary.excerpt).toBe("Learn how to test");
    expect(summary.language).toBe("en");
    expect(summary.date).toEqual(new Date("2024-01-15"));
    expect(summary.difficulty).toBe("beginner");
    expect(summary.estimatedTime).toBe(30);
  });

  it("should handle optional fields when not present", () => {
    const summary = prepareTutorialSummary(mockTutorial);

    expect(summary.githubRepo).toBeUndefined();
    expect(summary.demoUrl).toBeUndefined();
    expect(summary.course).toBeUndefined();
    expect(summary.featuredImage).toBeUndefined();
  });

  it("should include optional fields when present", () => {
    const summary = prepareTutorialSummary(mockTutorialWithOptional);

    expect(summary.githubRepo).toBe("https://github.com/test/repo");
    expect(summary.demoUrl).toBe("https://demo.example.com");
    expect(summary.course).toBe("javascript-fundamentals");
    expect(summary.featuredImage).toBe("./images/tutorial.png");
  });

  it("should handle different difficulty levels", () => {
    const beginner = prepareTutorialSummary(mockTutorial);
    expect(beginner.difficulty).toBe("beginner");

    const advanced = prepareTutorialSummary(mockTutorialWithOptional);
    expect(advanced.difficulty).toBe("advanced");
  });
});
