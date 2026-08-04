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
        categories: ["tutorials"],
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.type).toBe("post");
    expect(summary.title).toBe("Test Post");
    expect(summary.slug).toBe("test-post");
    expect(summary.excerpt).toBe("This is a test post excerpt");
    expect(summary.language).toBe("es");
    expect(summary.categories).toEqual(["tutorials"]);
    expect(summary.date).toEqual(new Date("2024-01-15"));
  });

  it("should handle optional cover field", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "Test excerpt",
        language: "en",
        categories: ["tutorials"],
        cover: "/images/test.png",
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.cover).toBe("/images/test.png");
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
        categories: ["tutorials"],
        update_date: new Date("2024-02-20"),
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.updateDate).toEqual(new Date("2024-02-20"));
  });

  it("should handle optional fields when absent", () => {
    const mockPost: CollectionEntry<"posts"> = {
      id: "test-post.mdx",
      collection: "posts",
      data: {
        title: "Test Post",
        post_slug: "test-post",
        date: new Date("2024-01-15"),
        excerpt: "Test excerpt",
        language: "en",
        categories: ["tutorials"],
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.cover).toBeUndefined();
    expect(summary.updateDate).toBeUndefined();
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
        categories: ["backend"],
        cover: "/images/complete.png",
        update_date: new Date("2024-03-01"),
      },
    } as CollectionEntry<"posts">;

    const summary = preparePostSummary(mockPost);

    expect(summary.title).toBe("Complete Post");
    expect(summary.slug).toBe("complete-post");
    expect(summary.excerpt).toBe("Complete excerpt");
    expect(summary.language).toBe("en");
    expect(summary.categories).toEqual(["backend"]);
    expect(summary.date).toEqual(new Date("2024-01-15"));
    expect(summary.cover).toBe("/images/complete.png");
    expect(summary.updateDate).toEqual(new Date("2024-03-01"));
  });
});
