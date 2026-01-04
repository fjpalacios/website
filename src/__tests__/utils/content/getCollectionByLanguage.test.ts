/* eslint-disable @typescript-eslint/no-explicit-any -- Test file with mock data requires any for flexibility */
import { describe, it, expect, vi } from "vitest";

import { getCollectionByLanguage, getAllFromCollection } from "@/utils/content/getCollectionByLanguage";

// Mock astro:content
vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const { getCollection } = await import("astro:content");

describe("getCollectionByLanguage", () => {
  it("should filter categories by language", async () => {
    const mockCategories = [
      { data: { language: "es", slug: "cat-1" } },
      { data: { language: "en", slug: "cat-2" } },
      { data: { language: "es", slug: "cat-3" } },
    ];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockCategories.filter(filter) as any;
      }
      return mockCategories as any;
    });

    const result = await getCollectionByLanguage("categories", "es");

    expect(getCollection).toHaveBeenCalledWith("categories", expect.any(Function));
    expect(result).toHaveLength(2);
    expect(result[0].data.slug).toBe("cat-1");
    expect(result[1].data.slug).toBe("cat-3");
  });

  it("should filter publishers by language", async () => {
    const mockPublishers = [
      { data: { language: "en", slug: "pub-1" } },
      { data: { language: "en", slug: "pub-2" } },
      { data: { language: "es", slug: "pub-3" } },
    ];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockPublishers.filter(filter) as any;
      }
      return mockPublishers as any;
    });

    const result = await getCollectionByLanguage("publishers", "en");

    expect(result).toHaveLength(2);
    expect(result[0].data.slug).toBe("pub-1");
    expect(result[1].data.slug).toBe("pub-2");
  });

  it("should filter genres by language", async () => {
    const mockGenres = [{ data: { language: "es", slug: "genre-1" } }, { data: { language: "es", slug: "genre-2" } }];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockGenres.filter(filter) as any;
      }
      return mockGenres as any;
    });

    const result = await getCollectionByLanguage("genres", "es");

    expect(result).toHaveLength(2);
  });

  it("should filter series by language", async () => {
    const mockSeries = [{ data: { language: "en", slug: "series-1" } }, { data: { language: "es", slug: "series-2" } }];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockSeries.filter(filter) as any;
      }
      return mockSeries as any;
    });

    const result = await getCollectionByLanguage("series", "en");

    expect(result).toHaveLength(1);
    expect(result[0].data.slug).toBe("series-1");
  });

  it("should filter courses by language", async () => {
    const mockCourses = [
      { data: { language: "es", slug: "course-1" } },
      { data: { language: "en", slug: "course-2" } },
    ];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockCourses.filter(filter) as any;
      }
      return mockCourses as any;
    });

    const result = await getCollectionByLanguage("courses", "es");

    expect(result).toHaveLength(1);
    expect(result[0].data.slug).toBe("course-1");
  });

  it("should filter challenges by language", async () => {
    const mockChallenges = [{ data: { language: "en", slug: "challenge-1" } }];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockChallenges.filter(filter) as any;
      }
      return mockChallenges as any;
    });

    const result = await getCollectionByLanguage("challenges", "en");

    expect(result).toHaveLength(1);
  });

  it("should filter posts by language", async () => {
    const mockPosts = [{ data: { language: "es", title: "Post 1" } }, { data: { language: "en", title: "Post 2" } }];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockPosts.filter(filter) as any;
      }
      return mockPosts as any;
    });

    const result = await getCollectionByLanguage("posts", "es");

    expect(result).toHaveLength(1);
    expect(result[0].data.title).toBe("Post 1");
  });

  it("should filter tutorials by language", async () => {
    const mockTutorials = [
      { data: { language: "en", title: "Tutorial 1" } },
      { data: { language: "en", title: "Tutorial 2" } },
    ];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockTutorials.filter(filter) as any;
      }
      return mockTutorials as any;
    });

    const result = await getCollectionByLanguage("tutorials", "en");

    expect(result).toHaveLength(2);
  });

  it("should return empty array when no matches", async () => {
    const mockData = [{ data: { language: "es" } }];

    vi.mocked(getCollection).mockImplementation(async (collection: any, filter?: any) => {
      if (filter) {
        return mockData.filter(filter) as any;
      }
      return mockData as any;
    });

    const result = await getCollectionByLanguage("categories", "en");

    expect(result).toHaveLength(0);
  });
});

describe("getAllFromCollection", () => {
  it("should get all authors without filtering", async () => {
    const mockAuthors = [{ data: { name: "Author 1" } }, { data: { name: "Author 2" } }];

    vi.mocked(getCollection).mockResolvedValue(mockAuthors as any);

    const result = await getAllFromCollection("authors");

    expect(getCollection).toHaveBeenCalledWith("authors");
    expect(result).toHaveLength(2);
    expect(result).toEqual(mockAuthors);
  });

  it("should get all books without filtering", async () => {
    const mockBooks = [{ data: { title: "Book 1" } }, { data: { title: "Book 2" } }, { data: { title: "Book 3" } }];

    vi.mocked(getCollection).mockResolvedValue(mockBooks as any);

    const result = await getAllFromCollection("books");

    expect(getCollection).toHaveBeenCalledWith("books");
    expect(result).toHaveLength(3);
  });
});
