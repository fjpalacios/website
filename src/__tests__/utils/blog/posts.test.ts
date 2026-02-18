// Post utilities tests
import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { preparePostSummary } from "@/utils/blog/posts";

describe("preparePostSummary", () => {
  it("should prepare a basic post summary", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "This is a test post excerpt",
        language: "es",
        category: "tutorials",
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.type).toBe("post");
    expect(summary.title).toBe("Test Post");
    expect(summary.slug).toBe("test-post");
    expect(summary.excerpt).toBe("This is a test post excerpt");
    expect(summary.language).toBe("es");
    expect(summary.category).toBe("tutorials");
    expect(summary.date).toEqual(new Date("2024-01-15"));
  });

  it("should handle optional featured_image field", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "Test excerpt",
        language: "en",
        category: "tutorials",
        featured_image: "/images/test.png",
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.featuredImage).toBe("/images/test.png");
  });

  it("should handle optional update_date field", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "Test excerpt",
        language: "en",
        category: "tutorials",
        update_date: new Date("2024-02-20"),
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.updateDate).toEqual(new Date("2024-02-20"));
  });

  it("should handle optional canonical_url field", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "Test excerpt",
        language: "en",
        category: "tutorials",
        canonical_url: "https://example.com/original-post",
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.canonicalUrl).toBe("https://example.com/original-post");
  });

  it("should handle posts with all optional fields", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Complete Post",
        post_slug: "complete-post",
        date: new Date("2024-01-15"),
        excerpt: "Complete excerpt",
        language: "en",
        category: "backend",
        featured_image: "/images/complete.png",
        update_date: new Date("2024-03-01"),
        canonical_url: "https://example.com/complete",
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.title).toBe("Complete Post");
    expect(summary.slug).toBe("complete-post");
    expect(summary.excerpt).toBe("Complete excerpt");
    expect(summary.language).toBe("en");
    expect(summary.category).toBe("backend");
    expect(summary.date).toEqual(new Date("2024-01-15"));
    expect(summary.featuredImage).toBe("/images/complete.png");
    expect(summary.updateDate).toEqual(new Date("2024-03-01"));
    expect(summary.canonicalUrl).toBe("https://example.com/complete");
  });
});
