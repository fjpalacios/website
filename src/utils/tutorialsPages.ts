/**
 * Shared logic for tutorials listing pages
 * Used by both /es/tutoriales/ and /en/tutorials/
 */

import { getCollection } from "astro:content";

import type { ContactItem } from "@/types/content";
import { filterByLanguage, getPageCount, prepareTutorialSummary, sortByDate, type TutorialSummary } from "@/utils/blog";

export const TUTORIALS_PER_PAGE = 12;

/**
 * Get all tutorials for a language, sorted by date
 */
export async function getAllTutorialsForLanguage(lang: string): Promise<TutorialSummary[]> {
  // Get all tutorials
  const allTutorials = await getCollection("tutorials");

  // Filter by language and exclude drafts
  const langTutorials = filterByLanguage(allTutorials, lang).filter((tutorial) => !tutorial.data.draft);

  // Sort by date (newest first)
  const sortedTutorials = sortByDate(langTutorials, "desc");

  // Prepare summaries
  return sortedTutorials.map((tutorial) => prepareTutorialSummary(tutorial));
}

/**
 * Generate static paths for tutorials pagination pages (page 2+)
 */
export async function generateTutorialsPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedTutorials = await getAllTutorialsForLanguage(lang);
  const totalPages = getPageCount(sortedTutorials.length, TUTORIALS_PER_PAGE);
  const paths = [];

  // Generate paths for each page (starting from page 2)
  for (let page = 2; page <= totalPages; page++) {
    const start = (page - 1) * TUTORIALS_PER_PAGE;
    const end = start + TUTORIALS_PER_PAGE;

    paths.push({
      page: page.toString(),
      props: {
        lang,
        tutorials: sortedTutorials.slice(start, end),
        currentPage: page,
        totalPages,
        contact,
      },
    });
  }

  return paths;
}

/**
 * Generate static paths for tutorial detail pages
 */
export async function generateTutorialDetailPaths(lang: string, contact: ContactItem[]) {
  const tutorials = await getCollection("tutorials");
  const langTutorials = tutorials.filter((tutorial) => tutorial.data.language === lang);

  return langTutorials.map((tutorial) => ({
    slug: tutorial.data.post_slug,
    props: {
      tutorialEntry: tutorial,
      lang,
      contact,
    },
  }));
}
