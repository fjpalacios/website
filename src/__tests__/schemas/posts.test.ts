import { describe, expect, it } from "vitest";

import { postsSchema } from "@/schemas/blog";

describe("Posts Collection Schema", () => {
  describe("Valid posts", () => {
    it("should validate a complete valid post", () => {
      const validPost = {
        title: "Mi primer post del blog",
        post_slug: "mi-primer-post-del-blog",
        date: new Date("2024-01-15"),
        excerpt: "Este es mi primer post donde hablo sobre desarrollo web",
        language: "es",
        category: "development",
        draft: false,
      };

      expect(() => postsSchema.parse(validPost)).not.toThrow();
    });

    it("should validate post in English", () => {
      const englishPost = {
        title: "My First Blog Post",
        post_slug: "my-first-blog-post",
        date: new Date("2024-01-15"),
        excerpt: "This is my first post about web development",
        language: "en",
        category: "development",
      };

      expect(() => postsSchema.parse(englishPost)).not.toThrow();
    });

    it("should validate post without optional fields", () => {
      const minimalPost = {
        title: "Minimal Post",
        post_slug: "minimal-post",
        date: new Date("2024-01-15"),
        excerpt: "Short excerpt",
        language: "es",
        category: "general",
      };

      expect(() => postsSchema.parse(minimalPost)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    const basePost = {
      title: "Test Post",
      post_slug: "test-post",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      category: "test",
    };

    it("should require title", () => {
      const { title: _title, ...postWithoutTitle } = basePost;
      expect(() => postsSchema.parse(postWithoutTitle)).toThrow();
    });

    it("should require post_slug", () => {
      const { post_slug: _post_slug, ...postWithoutSlug } = basePost;
      expect(() => postsSchema.parse(postWithoutSlug)).toThrow();
    });

    it("should require date", () => {
      const { date: _date, ...postWithoutDate } = basePost;
      expect(() => postsSchema.parse(postWithoutDate)).toThrow();
    });

    it("should require excerpt", () => {
      const { excerpt: _excerpt, ...postWithoutExcerpt } = basePost;
      expect(() => postsSchema.parse(postWithoutExcerpt)).toThrow();
    });

    it("should require language", () => {
      const { language: _language, ...postWithoutLanguage } = basePost;
      expect(() => postsSchema.parse(postWithoutLanguage)).toThrow();
    });

    it("should require category", () => {
      const { category: _category, ...postWithoutCategory } = basePost;
      expect(() => postsSchema.parse(postWithoutCategory)).toThrow();
    });
  });

  describe("Field validation", () => {
    const basePost = {
      title: "Test Post",
      post_slug: "test-post",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      category: "test",
    };

    it("should reject empty title", () => {
      expect(() => postsSchema.parse({ ...basePost, title: "" })).toThrow();
    });

    it("should reject empty post_slug", () => {
      expect(() => postsSchema.parse({ ...basePost, post_slug: "" })).toThrow();
    });

    it("should reject invalid language", () => {
      expect(() => postsSchema.parse({ ...basePost, language: "fr" })).toThrow();
    });

    it("should accept es language", () => {
      expect(() => postsSchema.parse({ ...basePost, language: "es" })).not.toThrow();
    });

    it("should accept en language", () => {
      expect(() => postsSchema.parse({ ...basePost, language: "en" })).not.toThrow();
    });

    it("should reject empty excerpt", () => {
      expect(() => postsSchema.parse({ ...basePost, excerpt: "" })).toThrow();
    });

    it("should reject empty category", () => {
      expect(() => postsSchema.parse({ ...basePost, category: "" })).toThrow();
    });
  });

  describe("Optional fields", () => {
    const basePost = {
      title: "Test Post",
      post_slug: "test-post",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      category: "test",
    };

    it("should accept optional draft field", () => {
      const withDraft = { ...basePost, draft: true };
      expect(() => postsSchema.parse(withDraft)).not.toThrow();
    });

    it("should default draft to false when not provided", () => {
      const parsed = postsSchema.parse(basePost);
      expect(parsed.draft).toBe(false);
    });

    it("should accept optional featured_image", () => {
      const withImage = { ...basePost, featured_image: "./image.jpg" };
      expect(() => postsSchema.parse(withImage)).not.toThrow();
    });

    it("should accept optional update_date", () => {
      const withUpdate = { ...basePost, update_date: new Date("2024-02-01") };
      expect(() => postsSchema.parse(withUpdate)).not.toThrow();
    });

    it("should accept optional canonical_url", () => {
      const withCanonical = {
        ...basePost,
        canonical_url: "https://example.com/original-post",
      };
      expect(() => postsSchema.parse(withCanonical)).not.toThrow();
    });
  });

  describe("Type coercion", () => {
    const basePost = {
      title: "Test Post",
      post_slug: "test-post",
      date: "2024-01-15",
      excerpt: "Test excerpt",
      language: "es",
      category: "test",
    };

    it("should coerce string date to Date object", () => {
      const parsed = postsSchema.parse(basePost);
      expect(parsed.date).toBeInstanceOf(Date);
    });

    it("should coerce string update_date to Date object", () => {
      const withUpdate = { ...basePost, update_date: "2024-02-01" };
      const parsed = postsSchema.parse(withUpdate);
      expect(parsed.update_date).toBeInstanceOf(Date);
    });
  });

  describe("Edge cases", () => {
    const basePost = {
      title: "Test Post",
      post_slug: "test-post",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      category: "test",
    };

    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);
      expect(() => postsSchema.parse({ ...basePost, title: longTitle })).not.toThrow();
    });

    it("should handle very long excerpt", () => {
      const longExcerpt = "A".repeat(1000);
      expect(() => postsSchema.parse({ ...basePost, excerpt: longExcerpt })).not.toThrow();
    });

    it("should handle slug with special characters", () => {
      const specialSlug = "post-with-numbers-123-and-dashes";
      expect(() => postsSchema.parse({ ...basePost, post_slug: specialSlug })).not.toThrow();
    });

    it("should handle many tags", () => {
      const manyTags = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
      expect(() => postsSchema.parse({ ...basePost, tags: manyTags })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate a typical blog post about books", () => {
      const bookPost = {
        title: "Mis libros favoritos de 2023",
        post_slug: "mis-libros-favoritos-2023",
        date: new Date("2023-12-31"),
        excerpt: "Un repaso por las mejores lecturas del año, con reseñas y recomendaciones",
        language: "es",
        category: "books",
        draft: false,
      };

      expect(() => postsSchema.parse(bookPost)).not.toThrow();
    });

    it("should validate a technical tutorial post", () => {
      const tutorialPost = {
        title: "Introduction to TypeScript",
        post_slug: "introduction-to-typescript",
        date: new Date("2024-01-10"),
        excerpt: "Learn the basics of TypeScript and how to use it in your projects",
        language: "en",
        category: "tutorials",
        featured_image: "./typescript-intro.png",
        draft: false,
      };

      expect(() => postsSchema.parse(tutorialPost)).not.toThrow();
    });

    it("should validate a draft post", () => {
      const draftPost = {
        title: "Work in Progress",
        post_slug: "work-in-progress",
        date: new Date("2024-06-01"),
        excerpt: "This post is still being written",
        language: "es",
        category: "development",
        draft: true,
      };

      expect(() => postsSchema.parse(draftPost)).not.toThrow();
    });

    it("should validate a republished post with canonical URL", () => {
      const republishedPost = {
        title: "Understanding Async/Await",
        post_slug: "understanding-async-await",
        date: new Date("2024-03-15"),
        excerpt: "A deep dive into async/await in JavaScript",
        language: "en",
        category: "development",
        canonical_url: "https://dev.to/author/understanding-async-await",
        draft: false,
      };

      expect(() => postsSchema.parse(republishedPost)).not.toThrow();
    });

    it("should validate an updated post", () => {
      const updatedPost = {
        title: "Getting Started with React",
        post_slug: "getting-started-with-react",
        date: new Date("2023-05-01"),
        update_date: new Date("2024-01-15"),
        excerpt: "Learn React from scratch (Updated for React 18)",
        language: "en",
        category: "tutorials",
        draft: false,
      };

      expect(() => postsSchema.parse(updatedPost)).not.toThrow();
    });
  });
});
