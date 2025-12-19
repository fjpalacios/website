// Tutorial utilities
// Helpers for tutorial pages and tutorial-related operations

import type { CollectionEntry } from "astro:content";

/**
 * Tutorial summary for listing pages
 */
export interface TutorialSummary {
  title: string;
  slug: string;
  excerpt: string;
  language: "es" | "en";
  date: Date;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  tags: string[];
  githubRepo?: string;
  demoUrl?: string;
  course?: string;
  featuredImage?: string;
}

/**
 * Prepare a tutorial summary for listing pages
 * @param tutorial - Tutorial entry
 * @returns Tutorial summary object
 */
export function prepareTutorialSummary(tutorial: CollectionEntry<"tutorials">): TutorialSummary {
  return {
    title: tutorial.data.title,
    slug: tutorial.data.post_slug,
    excerpt: tutorial.data.excerpt,
    language: tutorial.data.language,
    date: tutorial.data.date,
    difficulty: tutorial.data.difficulty,
    estimatedTime: tutorial.data.estimated_time,
    tags: tutorial.data.tags,
    githubRepo: tutorial.data.github_repo,
    demoUrl: tutorial.data.demo_url,
    course: tutorial.data.course,
    featuredImage: tutorial.data.featured_image,
  };
}
