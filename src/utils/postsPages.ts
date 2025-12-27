/**
 * Shared logic for posts listing pages
 * Used by both /es/publicaciones/ and /en/posts/
 */

import { getCollection } from "astro:content";

import { PAGINATION_CONFIG } from "@/config/pagination";
import type { ContactItem } from "@/types/content";
import {
  filterByLanguage,
  getPageCount,
  paginateItems,
  prepareBookSummary,
  preparePostSummary,
  prepareTutorialSummary,
  type PostSummary,
} from "@/utils/blog";
import { generateDetailPaths, generatePaginationPaths } from "@/utils/pagination/generator";

export const POSTS_PER_PAGE = PAGINATION_CONFIG.posts;

/**
 * Get all content for a language, combined and sorted
 */
export async function getAllContentForLanguage(lang: string): Promise<PostSummary[]> {
  // Get all content types
  const allPosts = await getCollection("posts");
  const allTutorials = await getCollection("tutorials");
  const allBooks = await getCollection("books");

  // Filter by language and exclude drafts
  const langPosts = filterByLanguage(allPosts, lang).filter((post) => !post.data.draft);
  const langTutorials = filterByLanguage(allTutorials, lang).filter((tutorial) => !tutorial.data.draft);
  const langBooks = filterByLanguage(allBooks, lang);

  // Prepare summaries
  const postSummaries: PostSummary[] = langPosts.map((post) => preparePostSummary(post));
  const tutorialSummaries: PostSummary[] = langTutorials.map((tutorial) => prepareTutorialSummary(tutorial));
  const bookSummaries: PostSummary[] = langBooks.map((book) => prepareBookSummary(book));

  // Combine all content
  const allContent = [...postSummaries, ...tutorialSummaries, ...bookSummaries];

  // Sort by date (newest first)
  return allContent.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Generate static paths for posts index page (page 1)
 */
export async function generatePostsIndexPaths(lang: string, contact: ContactItem[]) {
  const currentPage = 1;
  const sortedContent = await getAllContentForLanguage(lang);
  const totalPages = getPageCount(sortedContent.length, POSTS_PER_PAGE);
  const paginatedPosts = paginateItems(sortedContent, currentPage, POSTS_PER_PAGE);

  // Check if alternate language version has content (for language switcher)
  const targetLang = lang === "es" ? "en" : "es";
  const targetContent = await getAllContentForLanguage(targetLang);
  const hasTargetContent = targetContent.length > 0;

  return {
    lang,
    posts: paginatedPosts,
    currentPage,
    totalPages,
    contact,
    hasTargetContent,
  };
}

/**
 * Generate static paths for posts pagination pages (page 2+)
 */
export async function generatePostsPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedContent = await getAllContentForLanguage(lang);

  return generatePaginationPaths({
    items: sortedContent,
    itemsPerPage: POSTS_PER_PAGE,
    lang,
    contact,
    itemsKey: "posts",
  });
}

/**
 * Generate static paths for post detail pages
 */
export async function generatePostDetailPaths(lang: string, contact: ContactItem[]) {
  const posts = await getCollection("posts");

  return generateDetailPaths({
    entries: posts,
    lang,
    contact,
    entryKey: "postEntry",
  });
}
