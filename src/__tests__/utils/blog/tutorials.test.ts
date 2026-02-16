// Tests for tutorial utilities
// Utilities for tutorial pages and tutorial-related operations

import type { CollectionEntry } from "astro:content";
import { describe, it, expect } from "vitest";

import { getCourseTutorialNavigation, prepareTutorialSummary } from "@/utils/blog/tutorials";

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

  describe("with courses", () => {
    const mockCourses = [
      {
        data: {
          course_slug: "javascript-fundamentals",
          name: "JavaScript Fundamentals",
          language: "en",
          description: "Learn JS basics",
        },
      },
      {
        data: {
          course_slug: "domina-git-desde-cero",
          name: "Domina Git desde Cero",
          language: "es",
          description: "Aprende Git",
        },
      },
    ] as CollectionEntry<"courses">[];

    it("should include courseName when tutorial belongs to a course", () => {
      const summary = prepareTutorialSummary(mockTutorialWithOptional, mockCourses);

      expect(summary.course).toBe("javascript-fundamentals");
      expect(summary.courseName).toBe("JavaScript Fundamentals");
    });

    it("should return undefined courseName when tutorial has no course field", () => {
      const summary = prepareTutorialSummary(mockTutorial, mockCourses);

      expect(summary.course).toBeUndefined();
      expect(summary.courseName).toBeUndefined();
    });

    it("should return undefined courseName when courses array not provided", () => {
      const summary = prepareTutorialSummary(mockTutorialWithOptional);

      expect(summary.course).toBe("javascript-fundamentals");
      expect(summary.courseName).toBeUndefined();
    });

    it("should return undefined courseName when course not found in courses array", () => {
      const tutorialWithUnknownCourse = {
        ...mockTutorialWithOptional,
        data: {
          ...mockTutorialWithOptional.data,
          course: "non-existent-course",
        },
      } as CollectionEntry<"tutorials">;

      const summary = prepareTutorialSummary(tutorialWithUnknownCourse, mockCourses);

      expect(summary.course).toBe("non-existent-course");
      expect(summary.courseName).toBeUndefined();
    });

    it("should match course by course_slug field", () => {
      const tutorialWithGitCourse = {
        ...mockTutorialWithOptional,
        data: {
          ...mockTutorialWithOptional.data,
          course: "domina-git-desde-cero",
          language: "es" as const,
        },
      } as CollectionEntry<"tutorials">;

      const summary = prepareTutorialSummary(tutorialWithGitCourse, mockCourses);

      expect(summary.course).toBe("domina-git-desde-cero");
      expect(summary.courseName).toBe("Domina Git desde Cero");
    });
  });
});

// Helpers for getCourseTutorialNavigation tests
function makeTutorial(order: number, slug: string, course = "test-course"): CollectionEntry<"tutorials"> {
  return {
    id: `${slug}.mdx`,
    collection: "tutorials",
    data: {
      title: `Tutorial ${order}`,
      post_slug: slug,
      date: new Date("2024-01-01"),
      excerpt: "An excerpt",
      language: "es" as const,
      category: "tutorials",
      draft: false,
      course,
      order,
    },
  } as CollectionEntry<"tutorials">;
}

describe("getCourseTutorialNavigation", () => {
  describe("consecutive integer orders", () => {
    const tutorials = [makeTutorial(1, "t1"), makeTutorial(2, "t2"), makeTutorial(3, "t3")];

    it("returns null prev for the first tutorial", () => {
      const { previousTutorial } = getCourseTutorialNavigation(tutorials, 1);
      expect(previousTutorial).toBeNull();
    });

    it("returns null next for the last tutorial", () => {
      const { nextTutorial } = getCourseTutorialNavigation(tutorials, 3);
      expect(nextTutorial).toBeNull();
    });

    it("returns correct prev and next for a middle tutorial", () => {
      const { previousTutorial, nextTutorial } = getCourseTutorialNavigation(tutorials, 2);
      expect(previousTutorial).toMatchObject({ slug: "t1", order: 1 });
      expect(nextTutorial).toMatchObject({ slug: "t3", order: 3 });
    });
  });

  describe("decimal orders (e.g. 2.5 between 2 and 3)", () => {
    const tutorials = [makeTutorial(1, "t1"), makeTutorial(2, "t2"), makeTutorial(2.5, "t2-5"), makeTutorial(3, "t3")];

    it("finds decimal tutorial as next when current order is 2", () => {
      const { nextTutorial } = getCourseTutorialNavigation(tutorials, 2);
      expect(nextTutorial).toMatchObject({ slug: "t2-5", order: 2.5 });
    });

    it("finds tutorial 2 as prev when current order is 2.5", () => {
      const { previousTutorial } = getCourseTutorialNavigation(tutorials, 2.5);
      expect(previousTutorial).toMatchObject({ slug: "t2", order: 2 });
    });

    it("finds tutorial 3 as next when current order is 2.5", () => {
      const { nextTutorial } = getCourseTutorialNavigation(tutorials, 2.5);
      expect(nextTutorial).toMatchObject({ slug: "t3", order: 3 });
    });
  });

  describe("non-consecutive integer orders (gaps)", () => {
    // Simulates a Git course where tutorials 6 and 7 are not yet published:
    // order 1 -> 2 -> 3 -> 5 -> 8
    const tutorials = [
      makeTutorial(1, "git-1"),
      makeTutorial(2, "git-2"),
      makeTutorial(3, "git-3"),
      makeTutorial(5, "git-5"),
      makeTutorial(8, "git-8"),
    ];

    it("finds order-8 as next when current is order-5 (gap of 3)", () => {
      const { nextTutorial } = getCourseTutorialNavigation(tutorials, 5);
      expect(nextTutorial).toMatchObject({ slug: "git-8", order: 8 });
    });

    it("finds order-5 as prev when current is order-8 (gap of 3)", () => {
      const { previousTutorial } = getCourseTutorialNavigation(tutorials, 8);
      expect(previousTutorial).toMatchObject({ slug: "git-5", order: 5 });
    });

    it("finds order-3 as prev when current is order-5", () => {
      const { previousTutorial } = getCourseTutorialNavigation(tutorials, 5);
      expect(previousTutorial).toMatchObject({ slug: "git-3", order: 3 });
    });
  });

  describe("edge cases", () => {
    it("returns both null when tutorials array is empty", () => {
      const { previousTutorial, nextTutorial } = getCourseTutorialNavigation([], 1);
      expect(previousTutorial).toBeNull();
      expect(nextTutorial).toBeNull();
    });

    it("returns both null when current order is not found in the array", () => {
      const tutorials = [makeTutorial(1, "t1"), makeTutorial(3, "t3")];
      const { previousTutorial, nextTutorial } = getCourseTutorialNavigation(tutorials, 99);
      expect(previousTutorial).toBeNull();
      expect(nextTutorial).toBeNull();
    });

    it("returns both null when there is only one tutorial", () => {
      const tutorials = [makeTutorial(1, "only")];
      const { previousTutorial, nextTutorial } = getCourseTutorialNavigation(tutorials, 1);
      expect(previousTutorial).toBeNull();
      expect(nextTutorial).toBeNull();
    });
  });
});
