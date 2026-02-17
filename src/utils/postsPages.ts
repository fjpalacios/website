/**
 * Shared logic for posts listing pages
 * Used by both /es/publicaciones/ and /en/posts/
 */

import { getCollection, type CollectionEntry } from "astro:content";

import { getAlternateLang } from "@/config/languages";
import { PAGINATION_CONFIG } from "@/config/pagination";
import type { ContactItem, LanguageKey } from "@/types";
import {
  filterByLanguage,
  getPageCount,
  isPublished,
  paginateItems,
  prepareBookSummary,
  preparePostSummary,
  prepareTutorialSummary,
  type ContentSummary,
} from "@/utils/blog";
import { generateDetailPaths, generatePaginationPaths } from "@/utils/pagination/generator";

export const POSTS_PER_PAGE = PAGINATION_CONFIG.posts;

/**
 * Get all content for a language, combined and sorted
 */
export async function getAllContentForLanguage(lang: LanguageKey): Promise<ContentSummary[]> {
  // Get all content types
  const allPosts = await getCollection("posts");
  const allTutorials = await getCollection("tutorials");
  const allBooks = await getCollection("books");
  const allCourses = await getCollection("courses");
  const allSeries = await getCollection("series");

  // Filter by language and exclude future-dated content
  const langPosts = filterByLanguage(allPosts, lang).filter((post) => isPublished(post.data.date));
  const langTutorials = filterByLanguage(allTutorials, lang).filter((tutorial) => isPublished(tutorial.data.date));
  const langBooks = filterByLanguage(allBooks, lang).filter((book) => isPublished(book.data.date));

  // Prepare summaries with course/series context
  const postSummaries = langPosts.map((post) => preparePostSummary(post));
  const tutorialSummaries = langTutorials.map((tutorial) => prepareTutorialSummary(tutorial, allCourses));
  const bookSummaries = langBooks.map((book) => prepareBookSummary(book, undefined, allSeries));

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
export async function generatePostsIndexPaths(lang: LanguageKey, contact: ContactItem[]) {
  const currentPage = 1;
  const sortedContent = await getAllContentForLanguage(lang);
  const totalPages = getPageCount(sortedContent.length, POSTS_PER_PAGE);
  const paginatedPosts = paginateItems(sortedContent, currentPage, POSTS_PER_PAGE);

  // Check if alternate language version has content (for language switcher)
  const targetLang = getAlternateLang(lang);
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
export async function generatePostsPaginationPaths(lang: LanguageKey, contact: ContactItem[]) {
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
 * Only generates paths for published (non-future-dated) posts
 */
export async function generatePostDetailPaths(lang: string, contact: ContactItem[]) {
  const posts = await getCollection("posts");
  const publishedPosts = posts.filter((post: CollectionEntry<"posts">) => isPublished(post.data.date));

  return generateDetailPaths({
    entries: publishedPosts,
    lang,
    contact,
    entryKey: "postEntry",
  });
}
