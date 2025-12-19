// Post utilities
// Helpers for post pages and post-related operations

import type { CollectionEntry } from "astro:content";

/**
 * Post summary for listing pages
 */
export interface PostSummary {
  title: string;
  slug: string;
  excerpt: string;
  language: "es" | "en";
  date: Date;
  category: string;
  tags: string[];
  draft: boolean;
  cover?: string;
  featuredImage?: string;
  updateDate?: Date;
  canonicalUrl?: string;
}

/**
 * Prepare a post summary for listing pages
 * @param post - Post entry
 * @returns Post summary object
 */
export function preparePostSummary(post: CollectionEntry<"posts">): PostSummary {
  return {
    title: post.data.title,
    slug: post.data.post_slug,
    excerpt: post.data.excerpt,
    language: post.data.language,
    date: post.data.date,
    category: post.data.category,
    tags: post.data.tags,
    draft: post.data.draft,
    cover: post.data.cover || post.data.featured_image,
    featuredImage: post.data.featured_image,
    updateDate: post.data.update_date,
    canonicalUrl: post.data.canonical_url,
  };
}
