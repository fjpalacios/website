// Tutorial utilities
// Helpers for tutorial pages and tutorial-related operations

import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Navigation info for a single adjacent tutorial
 */
export interface TutorialNavigationItem {
  title: string;
  slug: string;
  order: number;
}

/**
 * Result of course tutorial navigation resolution
 */
export interface CourseTutorialNavigation {
  previousTutorial: TutorialNavigationItem | null;
  nextTutorial: TutorialNavigationItem | null;
}

/**
 * Resolve the previous and next tutorials within a course sequence.
 *
 * Uses positional index after sorting by `order` — not arithmetic (order ± 1) —
 * so decimal orders (e.g. 2.5) and non-consecutive gaps (e.g. 5 → 8) work correctly.
 *
 * @param courseTutorials - All non-draft tutorials from the same course and language, in any order
 * @param currentOrder - The `order` value of the tutorial being rendered
 * @returns Previous and next tutorial navigation items (null when absent)
 */
export function getCourseTutorialNavigation(
  courseTutorials: CollectionEntry<"tutorials">[],
  currentOrder: number,
): CourseTutorialNavigation {
  const sorted = [...courseTutorials].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

  const currentIndex = sorted.findIndex((t) => t.data.order === currentOrder);

  if (currentIndex === -1) {
    return { previousTutorial: null, nextTutorial: null };
  }

  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return {
    previousTutorial: prev ? { title: prev.data.title, slug: prev.data.post_slug, order: prev.data.order! } : null,
    nextTutorial: next ? { title: next.data.title, slug: next.data.post_slug, order: next.data.order! } : null,
  };
}

/**
 * Tutorial summary for listing pages
 */
export interface TutorialSummary {
  type: "tutorial";
  title: string;
  slug: string;
  excerpt: string;
  language: LanguageKey;
  date: Date;
  category: string;
  draft: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: number;
  course?: string;
  courseName?: string;
  order?: number;
  githubRepo?: string;
  demoUrl?: string;
  cover?: string;
  featuredImage?: string;
  updateDate?: Date;
}

/**
 * Prepare a tutorial summary for listing pages
 * @param tutorial - Tutorial entry
 * @param courses - Optional array of course entries to resolve course name
 * @returns Tutorial summary object
 */
export function prepareTutorialSummary(
  tutorial: CollectionEntry<"tutorials">,
  courses?: CollectionEntry<"courses">[],
): TutorialSummary {
  // Resolve course name if tutorial belongs to a course
  let courseName: string | undefined;
  if (tutorial.data.course && courses) {
    const course = courses.find((c) => c.data.course_slug === tutorial.data.course);
    courseName = course?.data.name;
  }

  return {
    type: "tutorial",
    title: tutorial.data.title,
    slug: tutorial.data.post_slug,
    excerpt: tutorial.data.excerpt,
    language: tutorial.data.language,
    date: tutorial.data.date,
    category: tutorial.data.category,
    draft: tutorial.data.draft,
    difficulty: tutorial.data.difficulty,
    estimatedTime: tutorial.data.estimated_time,
    course: tutorial.data.course,
    courseName,
    order: tutorial.data.order,
    githubRepo: tutorial.data.github_repo,
    demoUrl: tutorial.data.demo_url,
    cover: tutorial.data.cover || tutorial.data.featured_image,
    featuredImage: tutorial.data.featured_image,
    updateDate: tutorial.data.update_date,
  };
}
