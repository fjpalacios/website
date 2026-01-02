import { describe, expect, it } from "vitest";

import { tutorialsSchema } from "@/schemas/blog";

describe("Tutorials Collection Schema", () => {
  describe("Valid tutorials", () => {
    it("should validate a complete valid tutorial", () => {
      const validTutorial = {
        title: "Introduction to TypeScript",
        post_slug: "introduction-to-typescript",
        date: new Date("2024-01-15"),
        excerpt: "Learn TypeScript from scratch with practical examples",
        language: "en",
        categories: ["programming"],
        difficulty: "beginner",
        estimated_time: 30,
        draft: false,
      };

      expect(() => tutorialsSchema.parse(validTutorial)).not.toThrow();
    });

    it("should validate tutorial in Spanish", () => {
      const spanishTutorial = {
        title: "Introducción a TypeScript",
        post_slug: "introduccion-a-typescript",
        date: new Date("2024-01-15"),
        excerpt: "Aprende TypeScript desde cero con ejemplos prácticos",
        language: "es",
        categories: ["programacion"],
      };

      expect(() => tutorialsSchema.parse(spanishTutorial)).not.toThrow();
    });

    it("should validate tutorial without optional fields", () => {
      const minimalTutorial = {
        title: "Quick Git Tutorial",
        post_slug: "quick-git-tutorial",
        date: new Date("2024-01-15"),
        excerpt: "Learn Git basics in minutes",
        language: "en",
        categories: ["version-control"],
      };

      expect(() => tutorialsSchema.parse(minimalTutorial)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    const baseTutorial = {
      title: "Test Tutorial",
      post_slug: "test-tutorial",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      categories: ["test"],
    };

    it("should require title", () => {
      const { title: _title, ...tutorialWithoutTitle } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutTitle)).toThrow();
    });

    it("should require post_slug", () => {
      const { post_slug: _post_slug, ...tutorialWithoutSlug } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutSlug)).toThrow();
    });

    it("should require date", () => {
      const { date: _date, ...tutorialWithoutDate } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutDate)).toThrow();
    });

    it("should require excerpt", () => {
      const { excerpt: _excerpt, ...tutorialWithoutExcerpt } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutExcerpt)).toThrow();
    });

    it("should require language", () => {
      const { language: _language, ...tutorialWithoutLanguage } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutLanguage)).toThrow();
    });

    it("should require category", () => {
      const { categories: _categories, ...tutorialWithoutCategory } = baseTutorial;
      expect(() => tutorialsSchema.parse(tutorialWithoutCategory)).toThrow();
    });
  });

  describe("Field validation", () => {
    const baseTutorial = {
      title: "Test Tutorial",
      post_slug: "test-tutorial",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      categories: ["test"],
    };

    it("should reject empty title", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, title: "" })).toThrow();
    });

    it("should reject empty post_slug", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, post_slug: "" })).toThrow();
    });

    it("should reject invalid language", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, language: "fr" })).toThrow();
    });

    it("should accept es language", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, language: "es" })).not.toThrow();
    });

    it("should accept en language", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, language: "en" })).not.toThrow();
    });

    it("should reject empty excerpt", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, excerpt: "" })).toThrow();
    });

    it("should reject empty category", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, categories: [""] })).toThrow();
    });
  });

  describe("Optional fields", () => {
    const baseTutorial = {
      title: "Test Tutorial",
      post_slug: "test-tutorial",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      categories: ["test"],
    };

    it("should accept optional difficulty field", () => {
      const withDifficulty = { ...baseTutorial, difficulty: "intermediate" };
      expect(() => tutorialsSchema.parse(withDifficulty)).not.toThrow();
    });

    it("should accept all difficulty levels", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, difficulty: "beginner" })).not.toThrow();
      expect(() => tutorialsSchema.parse({ ...baseTutorial, difficulty: "intermediate" })).not.toThrow();
      expect(() => tutorialsSchema.parse({ ...baseTutorial, difficulty: "advanced" })).not.toThrow();
    });

    it("should reject invalid difficulty level", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, difficulty: "expert" })).toThrow();
    });

    it("should accept optional estimated_time", () => {
      const withTime = { ...baseTutorial, estimated_time: 45 };
      expect(() => tutorialsSchema.parse(withTime)).not.toThrow();
    });

    it("should reject negative estimated_time", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, estimated_time: -10 })).toThrow();
    });

    it("should reject zero estimated_time", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, estimated_time: 0 })).toThrow();
    });

    it("should accept optional course field", () => {
      const withCourse = { ...baseTutorial, course: "react-fundamentals" };
      expect(() => tutorialsSchema.parse(withCourse)).not.toThrow();
    });

    it("should accept optional github_repo", () => {
      const withRepo = {
        ...baseTutorial,
        github_repo: "https://github.com/user/repo",
      };
      expect(() => tutorialsSchema.parse(withRepo)).not.toThrow();
    });

    it("should reject invalid github_repo URL", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, github_repo: "not-a-url" })).toThrow();
    });

    it("should accept optional demo_url", () => {
      const withDemo = { ...baseTutorial, demo_url: "https://example.com/demo" };
      expect(() => tutorialsSchema.parse(withDemo)).not.toThrow();
    });

    it("should reject invalid demo_url", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, demo_url: "not-a-url" })).toThrow();
    });

    it("should accept optional featured_image", () => {
      const withImage = { ...baseTutorial, featured_image: "./image.jpg" };
      expect(() => tutorialsSchema.parse(withImage)).not.toThrow();
    });

    it("should accept optional update_date", () => {
      const withUpdate = { ...baseTutorial, update_date: new Date("2024-02-01") };
      expect(() => tutorialsSchema.parse(withUpdate)).not.toThrow();
    });
  });

  describe("Type coercion", () => {
    const baseTutorial = {
      title: "Test Tutorial",
      post_slug: "test-tutorial",
      date: "2024-01-15",
      excerpt: "Test excerpt",
      language: "es",
      categories: ["test"],
    };

    it("should coerce string date to Date object", () => {
      const parsed = tutorialsSchema.parse(baseTutorial);
      expect(parsed.date).toBeInstanceOf(Date);
    });

    it("should coerce string update_date to Date object", () => {
      const withUpdate = { ...baseTutorial, update_date: "2024-02-01" };
      const parsed = tutorialsSchema.parse(withUpdate);
      expect(parsed.update_date).toBeInstanceOf(Date);
    });
  });

  describe("Edge cases", () => {
    const baseTutorial = {
      title: "Test Tutorial",
      post_slug: "test-tutorial",
      date: new Date("2024-01-15"),
      excerpt: "Test excerpt",
      language: "es",
      categories: ["test"],
    };

    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);
      expect(() => tutorialsSchema.parse({ ...baseTutorial, title: longTitle })).not.toThrow();
    });

    it("should handle very long excerpt", () => {
      const longExcerpt = "A".repeat(1000);
      expect(() => tutorialsSchema.parse({ ...baseTutorial, excerpt: longExcerpt })).not.toThrow();
    });

    it("should handle large estimated_time", () => {
      expect(() => tutorialsSchema.parse({ ...baseTutorial, estimated_time: 999 })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate a beginner JavaScript tutorial", () => {
      const jsTutorial = {
        title: "JavaScript Basics: Variables and Data Types",
        post_slug: "javascript-basics-variables-data-types",
        date: new Date("2024-01-10"),
        excerpt: "Learn the fundamentals of JavaScript variables and data types",
        language: "en",
        categories: ["javascript"],
        difficulty: "beginner",
        estimated_time: 20,
        draft: false,
      };

      expect(() => tutorialsSchema.parse(jsTutorial)).not.toThrow();
    });

    it("should validate an advanced React tutorial with repo", () => {
      const reactTutorial = {
        title: "Advanced React Patterns: Compound Components",
        post_slug: "advanced-react-patterns-compound-components",
        date: new Date("2024-02-15"),
        excerpt: "Master compound component pattern in React",
        language: "en",
        categories: ["react"],
        difficulty: "advanced",
        estimated_time: 45,
        github_repo: "https://github.com/example/react-compound-components",
        demo_url: "https://example.com/demo",
        course: "advanced-react",
        draft: false,
      };

      expect(() => tutorialsSchema.parse(reactTutorial)).not.toThrow();
    });

    it("should validate a Spanish tutorial about Git", () => {
      const gitTutorial = {
        title: "¿Qué es Git y cómo funciona?",
        post_slug: "que-es-git-y-como-funciona",
        date: new Date("2024-03-01"),
        excerpt: "Una introducción completa a Git para principiantes",
        language: "es",
        categories: ["control-versiones"],
        difficulty: "beginner",
        estimated_time: 25,
        featured_image: "./git-intro.png",
        draft: false,
      };

      expect(() => tutorialsSchema.parse(gitTutorial)).not.toThrow();
    });

    it("should validate a draft tutorial", () => {
      const draftTutorial = {
        title: "Work in Progress: Docker Tutorial",
        post_slug: "docker-tutorial-wip",
        date: new Date("2024-06-01"),
        excerpt: "Docker tutorial still being written",
        language: "en",
        categories: ["devops"],
        draft: true,
      };

      expect(() => tutorialsSchema.parse(draftTutorial)).not.toThrow();
    });

    it("should validate an updated tutorial", () => {
      const updatedTutorial = {
        title: "Getting Started with Node.js",
        post_slug: "getting-started-with-nodejs",
        date: new Date("2023-01-15"),
        update_date: new Date("2024-01-15"),
        excerpt: "Learn Node.js from scratch (Updated for Node.js 20)",
        language: "en",
        categories: ["nodejs"],
        difficulty: "beginner",
        estimated_time: 35,
        draft: false,
      };

      expect(() => tutorialsSchema.parse(updatedTutorial)).not.toThrow();
    });
  });
});
