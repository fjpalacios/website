/**
 * Shared logic for tutorials listing pages
 * Used by both /es/tutoriales/ and /en/tutorials/
 */

import { getCollection } from "astro:content";

import { PAGINATION_CONFIG } from "@/config/pagination";
import type { ContactItem } from "@/types/content";
import { filterByLanguage, prepareTutorialSummary, sortByDate, type TutorialSummary } from "@/utils/blog";
import { generateDetailPaths, generatePaginationPaths } from "@/utils/pagination/generator";

export const TUTORIALS_PER_PAGE = PAGINATION_CONFIG.tutorials;

/**
 * Get all tutorials for a language, sorted by date
 */
export async function getAllTutorialsForLanguage(lang: string): Promise<TutorialSummary[]> {
  // Get all tutorials and courses
  const allTutorials = await getCollection("tutorials");
  const allCourses = await getCollection("courses");

  // Filter courses by language
  // @ts-expect-error - Astro 5 CollectionEntry type compatibility
  const langCourses = filterByLanguage(allCourses, lang);

  // Filter by language and exclude drafts
  // @ts-expect-error - Astro 5 data type inference limitation, runtime schema ensures draft exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Astro content collection type inference limitation
  const langTutorials = filterByLanguage(allTutorials, lang).filter((tutorial) => !(tutorial.data as any).draft);

  // Sort by date (newest first)
  const sortedTutorials = sortByDate(langTutorials, "desc");

  // Prepare summaries with course information
  // @ts-expect-error - Astro 5 CollectionEntry type compatibility with helper functions
  return sortedTutorials.map((tutorial) => prepareTutorialSummary(tutorial, langCourses));
}

/**
 * Generate static paths for tutorials pagination pages (page 2+)
 */
export async function generateTutorialsPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedTutorials = await getAllTutorialsForLanguage(lang);

  return generatePaginationPaths({
    items: sortedTutorials,
    itemsPerPage: TUTORIALS_PER_PAGE,
    lang,
    contact,
    itemsKey: "tutorials",
  });
}

/**
 * Generate static paths for tutorial detail pages
 */
export async function generateTutorialDetailPaths(lang: string, contact: ContactItem[]) {
  const tutorials = await getCollection("tutorials");

  return generateDetailPaths({
    entries: tutorials,
    lang,
    contact,
    entryKey: "tutorialEntry",
  });
}
