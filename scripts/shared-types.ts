/**
 * Shared types and utilities for content creation scripts
 */

import type { LanguageKey } from "@/types/content";

export interface ContentData {
  title: string;
  slug: string;
  date: string;
  lang: LanguageKey;
  excerpt: string | null;
  categories: string[];
}

export interface BookData extends ContentData {
  author: string;
  isbn: string | null;
  pages: number;
  publisher: string | null;
  score: number;
  genres: string[] | null;
  synopsis: string | null;
}

export interface TutorialData extends ContentData {
  course: string | null;
}

export type PostData = ContentData;

export interface CommandLineArgs {
  [key: string]: string | undefined;
  interactive?: string;
  title?: string;
  lang?: string;
  author?: string;
  isbn?: string;
  pages?: string;
  publisher?: string;
  score?: string;
  genres?: string;
  categories?: string;
  course?: string;
}
