import { describe, expect, it } from "vitest";

import { isBookCollectionEntry } from "@/utils/content/guards";

const validBookEntry = {
  id: "book",
  collection: "books",
  data: {
    title: "Book",
    post_slug: "book",
    date: new Date("2024-01-01"),
    excerpt: "Excerpt",
    language: "en" as const,
    score: 4,
    author: "author",
    genres: [],
    challenges: [],
    categories: [],
  },
};

describe("isBookCollectionEntry", () => {
  it("accepts a valid books collection entry", (): void => {
    expect(isBookCollectionEntry(validBookEntry)).toBe(true);
  });

  it.each([
    null,
    undefined,
    { ...validBookEntry, collection: "posts" },
    { ...validBookEntry, data: { ...validBookEntry.data, score: 0 } },
    { id: "book", collection: "books" },
  ])("rejects invalid entry %o", (value: unknown): void => {
    expect(isBookCollectionEntry(value)).toBe(false);
  });
});
