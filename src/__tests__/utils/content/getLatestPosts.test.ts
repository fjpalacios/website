import { getCollection, type CollectionEntry } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getLatestPosts } from "@/utils/content/getLatestPosts";

const makePost = (id: string, title: string, date: string, language: "es" | "en"): CollectionEntry<"posts"> => ({
  id,
  collection: "posts",
  data: {
    title,
    post_slug: id,
    date: new Date(date),
    excerpt: `${title} excerpt`,
    language,
    categories: ["testing"],
  },
});

const makeTutorial = (
  id: string,
  title: string,
  date: string,
  language: "es" | "en",
): CollectionEntry<"tutorials"> => ({
  id,
  collection: "tutorials",
  data: {
    title,
    post_slug: id,
    date: new Date(date),
    excerpt: `${title} excerpt`,
    language,
    categories: ["testing"],
  },
});

const makeBook = (id: string, title: string, date: string, language: "es" | "en"): CollectionEntry<"books"> => ({
  id,
  collection: "books",
  data: {
    title,
    post_slug: id,
    date: new Date(date),
    excerpt: `${title} excerpt`,
    language,
    score: 4,
    author: "test-author",
    genres: [],
    challenges: [],
    categories: [],
  },
});

const collections = {
  posts: [
    makePost("post-es", "Spanish post", "2025-01-01", "es"),
    makePost("post-en", "English post", "2025-04-01", "en"),
  ],
  tutorials: [
    makeTutorial("tutorial-es", "Spanish tutorial", "2025-03-01", "es"),
    makeTutorial("tutorial-en", "English tutorial", "2025-05-01", "en"),
  ],
  books: [
    makeBook("book-es", "Spanish book", "2025-02-01", "es"),
    makeBook("book-en", "English book", "2025-04-01", "en"),
  ],
};

describe("getLatestPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCollection).mockImplementation(async (collection: string) => {
      if (collection === "posts") return collections.posts;
      if (collection === "tutorials") return collections.tutorials;
      if (collection === "books") return collections.books;
      return [];
    });
  });

  it("filters by language and returns all content summary variants sorted by date", async () => {
    const result = await getLatestPosts("es", 10);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.title)).toEqual(["Spanish tutorial", "Spanish book", "Spanish post"]);
    expect(result.map((item) => item.type)).toEqual(["tutorial", "book", "post"]);
  });

  it("limits the sorted result set", async () => {
    const result = await getLatestPosts("es", 2);

    expect(result.map((item) => item.title)).toEqual(["Spanish tutorial", "Spanish book"]);
  });

  it("does not query collections when the requested limit is zero", async () => {
    const result = await getLatestPosts("es", 0);

    expect(result).toEqual([]);
    expect(getCollection).not.toHaveBeenCalled();
  });

  it("propagates collection loading failures", async () => {
    vi.mocked(getCollection).mockRejectedValueOnce(new Error("Collection unavailable"));

    await expect(getLatestPosts("es")).rejects.toThrow("Collection unavailable");
  });
});
