import type { CollectionEntry } from "astro:content";

import { booksSchema } from "@/schemas/blog";

interface UnknownBookEntry {
  id?: unknown;
  collection?: unknown;
  data?: unknown;
}

/**
 * Validate the runtime shape required by the book detail template.
 */
export function isBookCollectionEntry(value: unknown): value is CollectionEntry<"books"> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as UnknownBookEntry;
  return typeof entry.id === "string" && entry.collection === "books" && booksSchema.safeParse(entry.data).success;
}
