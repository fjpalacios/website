// Tutorial utilities
// Helpers for tutorial pages and tutorial-related operations

import type { CollectionEntry } from "astro:content";

/**
 * Tutorial summary for listing pages
 */
export interface TutorialSummary {
  type: "tutorial";
  title: string;
  slug: string;
  excerpt: string;
  language: "es" | "en";
  date: Date;
  category: string;
  draft: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: number;
  course?: string;
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
 * @returns Tutorial summary object
 */
export function prepareTutorialSummary(tutorial: CollectionEntry<"tutorials">): TutorialSummary {
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
    order: tutorial.data.order,
    githubRepo: tutorial.data.github_repo,
    demoUrl: tutorial.data.demo_url,
    cover: tutorial.data.cover || tutorial.data.featured_image,
    featuredImage: tutorial.data.featured_image,
    updateDate: tutorial.data.update_date,
  };
}
