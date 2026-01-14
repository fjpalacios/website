// Tests for book statistics utilities
// Pure functions for calculating and aggregating book statistics

import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";

import {
  getActiveChallenges,
  getAuthorsByGender,
  getClassicsBooks,
  getFiveStarBooks,
  getGenresByType,
  getGenresWithCount,
  getPublishersWithCount,
  getRandomFavorites,
  getScoreDistribution,
  getSeriesWithCount,
  getTotalAuthors,
  getTotalBooks,
  getTotalGenres,
  getTotalPublishers,
  getTotalSeries,
} from "@/utils/blog/book-stats";

// ============================================================================
// MOCK DATA
// ============================================================================

const mockBooks: CollectionEntry<"books">[] = [
  // Spanish books
  {
    id: "book-1-es.mdx",
    collection: "books",
    data: {
      title: "Libro Favorito",
      post_slug: "libro-favorito",
      date: new Date("2024-01-01"),
      excerpt: "Un libro favorito",
      language: "es",
      score: "fav",
      pages: 300,
      author: "author-1",
      publisher: "publisher-1",
      genres: ["genre-1", "genre-2"],
      challenges: ["stephen-king", "clasicos"],
      categories: [],
      series: "series-1",
      series_order: 1,
      cover: "./cover.jpg",
    },
  },
  {
    id: "book-2-es.mdx",
    collection: "books",
    data: {
      title: "Libro 5 Estrellas",
      post_slug: "libro-5-estrellas",
      date: new Date("2024-01-02"),
      excerpt: "Un libro de 5 estrellas",
      language: "es",
      score: 5,
      pages: 400,
      author: "author-2",
      publisher: "publisher-1",
      genres: ["genre-1"],
      challenges: ["pesadillas"],
      categories: [],
      cover: "./cover.jpg",
    },
  },
  {
    id: "book-3-es.mdx",
    collection: "books",
    data: {
      title: "Libro 4 Estrellas",
      post_slug: "libro-4-estrellas",
      date: new Date("2024-01-03"),
      excerpt: "Un libro de 4 estrellas",
      language: "es",
      score: 4,
      pages: 250,
      author: "author-1",
      publisher: "publisher-2",
      genres: ["genre-3"],
      challenges: [],
      categories: [],
      series: "series-1",
      series_order: 2,
      cover: "./cover.jpg",
    },
  },
  {
    id: "book-4-es.mdx",
    collection: "books",
    data: {
      title: "Libro 3 Estrellas",
      post_slug: "libro-3-estrellas",
      date: new Date("2024-01-04"),
      excerpt: "Un libro de 3 estrellas",
      language: "es",
      score: 3,
      pages: 200,
      author: "author-3",
      publisher: "publisher-2",
      genres: ["genre-2", "genre-3"],
      challenges: [],
      categories: [],
      cover: "./cover.jpg",
    },
  },
  // English books
  {
    id: "book-1-en.mdx",
    collection: "books",
    data: {
      title: "English Book",
      post_slug: "english-book",
      date: new Date("2024-01-05"),
      excerpt: "An English book",
      language: "en",
      score: 5,
      pages: 350,
      author: "author-4",
      publisher: "publisher-3",
      genres: ["genre-4"],
      challenges: [],
      categories: [],
      cover: "./cover.jpg",
    },
  },
] as CollectionEntry<"books">[];

const mockAuthors: CollectionEntry<"authors">[] = [
  {
    id: "author-1.mdx",
    collection: "authors",
    data: {
      name: "Autor Masculino 1",
      author_slug: "author-1",
      bio: "Biografía",
      language: "es",
      gender: "male",
      sortName: "Masculino 1, Autor",
    },
  },
  {
    id: "author-2.mdx",
    collection: "authors",
    data: {
      name: "Autora Femenina 1",
      author_slug: "author-2",
      bio: "Biografía",
      language: "es",
      gender: "female",
      sortName: "Femenina 1, Autora",
    },
  },
  {
    id: "author-3.mdx",
    collection: "authors",
    data: {
      name: "Autor Masculino 2",
      author_slug: "author-3",
      bio: "Biografía",
      language: "es",
      gender: "male",
      sortName: "Masculino 2, Autor",
    },
  },
  {
    id: "author-4.mdx",
    collection: "authors",
    data: {
      name: "English Author",
      author_slug: "author-4",
      bio: "Bio",
      language: "en",
      gender: "male",
      sortName: "Author, English",
    },
  },
] as CollectionEntry<"authors">[];

const mockGenres: CollectionEntry<"genres">[] = [
  {
    id: "genre-1.json",
    collection: "genres",
    data: {
      name: "Ficción",
      genre_slug: "genre-1",
      language: "es",
      type: "fiction",
    },
  },
  {
    id: "genre-2.json",
    collection: "genres",
    data: {
      name: "Terror",
      genre_slug: "genre-2",
      language: "es",
      type: "fiction",
    },
  },
  {
    id: "genre-3.json",
    collection: "genres",
    data: {
      name: "No Ficción",
      genre_slug: "genre-3",
      language: "es",
      type: "non-fiction",
    },
  },
  {
    id: "genre-4.json",
    collection: "genres",
    data: {
      name: "Fiction",
      genre_slug: "genre-4",
      language: "en",
      type: "fiction",
    },
  },
] as CollectionEntry<"genres">[];

const mockPublishers: CollectionEntry<"publishers">[] = [
  {
    id: "publisher-1.json",
    collection: "publishers",
    data: {
      name: "Editorial A",
      publisher_slug: "publisher-1",
      language: "es",
    },
  },
  {
    id: "publisher-2.json",
    collection: "publishers",
    data: {
      name: "Editorial B",
      publisher_slug: "publisher-2",
      language: "es",
    },
  },
  {
    id: "publisher-3.json",
    collection: "publishers",
    data: {
      name: "Publisher C",
      publisher_slug: "publisher-3",
      language: "en",
    },
  },
] as CollectionEntry<"publishers">[];

const mockSeries: CollectionEntry<"series">[] = [
  {
    id: "series-1.json",
    collection: "series",
    data: {
      name: "Serie 1",
      series_slug: "series-1",
      language: "es",
    },
  },
] as CollectionEntry<"series">[];

const mockChallenges: CollectionEntry<"challenges">[] = [
  {
    id: "stephen-king.json",
    collection: "challenges",
    data: {
      name: "Reto Stephen King",
      challenge_slug: "stephen-king",
      language: "es",
      description: "Leer todos los libros de Stephen King",
    },
  },
  {
    id: "pesadillas.json",
    collection: "challenges",
    data: {
      name: "Reto Pesadillas",
      challenge_slug: "pesadillas",
      language: "es",
      description: "Leer libros de terror",
    },
  },
  {
    id: "155-libros.json",
    collection: "challenges",
    data: {
      name: "155 Libros",
      challenge_slug: "155-libros",
      language: "es",
      description: "Leer 155 libros",
    },
  },
] as CollectionEntry<"challenges">[];

// ============================================================================
// TESTS
// ============================================================================

describe("book-stats utilities", () => {
  describe("getTotalBooks", () => {
    it("should return total number of books for Spanish", () => {
      const total = getTotalBooks(mockBooks, "es");
      expect(total).toBe(4);
      expect(typeof total).toBe("number");
    });

    it("should return total number of books for English", () => {
      const total = getTotalBooks(mockBooks, "en");
      expect(total).toBe(1);
      expect(typeof total).toBe("number");
    });
  });

  describe("getTotalAuthors", () => {
    it("should return total number of unique authors for Spanish", () => {
      const total = getTotalAuthors(mockBooks, mockAuthors, "es");
      expect(total).toBe(3);
      expect(typeof total).toBe("number");
    });

    it("should return total number of unique authors for English", () => {
      const total = getTotalAuthors(mockBooks, mockAuthors, "en");
      expect(total).toBe(1);
      expect(typeof total).toBe("number");
    });
  });

  describe("getTotalGenres", () => {
    it("should return total number of genres for Spanish", () => {
      const total = getTotalGenres(mockBooks, mockGenres, "es");
      expect(total).toBe(3);
      expect(typeof total).toBe("number");
    });

    it("should return total number of genres for English", () => {
      const total = getTotalGenres(mockBooks, mockGenres, "en");
      expect(total).toBe(1);
      expect(typeof total).toBe("number");
    });
  });

  describe("getTotalPublishers", () => {
    it("should return total number of publishers for Spanish", () => {
      const total = getTotalPublishers(mockBooks, mockPublishers, "es");
      expect(total).toBe(2);
      expect(typeof total).toBe("number");
    });

    it("should return total number of publishers for English", () => {
      const total = getTotalPublishers(mockBooks, mockPublishers, "en");
      expect(total).toBe(1);
      expect(typeof total).toBe("number");
    });
  });

  describe("getTotalSeries", () => {
    it("should return total number of series for Spanish", () => {
      const total = getTotalSeries(mockBooks, mockSeries, "es");
      expect(total).toBe(1);
      expect(typeof total).toBe("number");
    });

    it("should return total number of series for English", () => {
      const total = getTotalSeries(mockBooks, mockSeries, "en");
      expect(total).toBe(0);
      expect(typeof total).toBe("number");
    });
  });

  describe("getScoreDistribution", () => {
    it("should return score distribution with all score types for Spanish", () => {
      const distribution = getScoreDistribution(mockBooks, "es");

      expect(distribution.fav).toBe(1);
      expect(distribution[5]).toBe(1);
      expect(distribution[4]).toBe(1);
      expect(distribution[3]).toBe(1);
      expect(distribution[2]).toBe(0);
      expect(distribution[1]).toBe(0);
    });

    it("should return score distribution for English", () => {
      const distribution = getScoreDistribution(mockBooks, "en");

      expect(distribution.fav).toBe(0);
      expect(distribution[5]).toBe(1);
      expect(distribution[4]).toBe(0);
    });

    it("should sum to total books count", () => {
      const distribution = getScoreDistribution(mockBooks, "es");
      const total = Object.values(distribution).reduce((acc, val) => acc + val, 0);

      expect(total).toBe(4);
    });
  });

  describe("getAuthorsByGender", () => {
    it("should return authors separated by gender for Spanish", () => {
      const authorsByGender = getAuthorsByGender(mockBooks, mockAuthors, "es");

      expect(authorsByGender.male).toHaveLength(2);
      expect(authorsByGender.female).toHaveLength(1);
    });

    it("should return authors sorted by sortName", () => {
      const authorsByGender = getAuthorsByGender(mockBooks, mockAuthors, "es");

      expect(authorsByGender.male[0].data.sortName).toBe("Masculino 1, Autor");
      expect(authorsByGender.male[1].data.sortName).toBe("Masculino 2, Autor");
    });

    it("should only include authors that have written books in that language", () => {
      const authorsByGender = getAuthorsByGender(mockBooks, mockAuthors, "es");
      const allAuthors = [...authorsByGender.male, ...authorsByGender.female];

      expect(allAuthors.every((author) => author.data.language === "es")).toBe(true);
      expect(allAuthors.find((a) => a.data.author_slug === "author-4")).toBeUndefined();
    });

    it("should have valid gender values", () => {
      const authorsByGender = getAuthorsByGender(mockBooks, mockAuthors, "es");

      authorsByGender.male.forEach((author) => {
        expect(author.data.gender).toBe("male");
      });

      authorsByGender.female.forEach((author) => {
        expect(author.data.gender).toBe("female");
      });
    });
  });

  describe("getGenresByType", () => {
    it("should return genres separated by fiction and non-fiction for Spanish", () => {
      const genresByType = getGenresByType(mockBooks, mockGenres, "es");

      expect(genresByType.fiction).toHaveLength(2);
      expect(genresByType.nonFiction).toHaveLength(1);
    });

    it("should have valid type values", () => {
      const genresByType = getGenresByType(mockBooks, mockGenres, "es");

      genresByType.fiction.forEach((genre) => {
        expect(genre.data.type).toBe("fiction");
      });

      genresByType.nonFiction.forEach((genre) => {
        expect(genre.data.type).toBe("non-fiction");
      });
    });

    it("should only include genres that have books in that language", () => {
      const genresByType = getGenresByType(mockBooks, mockGenres, "es");
      const allGenres = [...genresByType.fiction, ...genresByType.nonFiction];

      expect(allGenres.every((genre) => genre.data.language === "es")).toBe(true);
      expect(allGenres.find((g) => g.data.genre_slug === "genre-4")).toBeUndefined();
    });
  });

  describe("getGenresWithCount", () => {
    it("should return genres with book count separated by fiction and non-fiction", () => {
      const genresWithCount = getGenresWithCount(mockBooks, mockGenres, "es");

      expect(genresWithCount.fiction).toHaveLength(2);
      expect(genresWithCount.nonFiction).toHaveLength(1);

      genresWithCount.fiction.forEach((item) => {
        expect(item.genre).toBeDefined();
        expect(item.count).toBeGreaterThan(0);
        expect(typeof item.count).toBe("number");
      });

      genresWithCount.nonFiction.forEach((item) => {
        expect(item.genre).toBeDefined();
        expect(item.count).toBeGreaterThan(0);
        expect(typeof item.count).toBe("number");
      });
    });

    it("should be sorted by count descending, then alphabetically", () => {
      const genresWithCount = getGenresWithCount(mockBooks, mockGenres, "es");

      // Check fiction sorting
      for (let i = 0; i < genresWithCount.fiction.length - 1; i++) {
        const current = genresWithCount.fiction[i];
        const next = genresWithCount.fiction[i + 1];

        if (current.count === next.count) {
          expect(current.genre.data.name.localeCompare(next.genre.data.name, "es")).toBeLessThanOrEqual(0);
        } else {
          expect(current.count).toBeGreaterThanOrEqual(next.count);
        }
      }
    });

    it("should correctly count books per genre", () => {
      const genresWithCount = getGenresWithCount(mockBooks, mockGenres, "es");
      const allGenres = [...genresWithCount.fiction, ...genresWithCount.nonFiction];

      // genre-1 appears in 2 books (book-1, book-2)
      const genre1 = allGenres.find((g) => g.genre.data.genre_slug === "genre-1");
      expect(genre1?.count).toBe(2);

      // genre-2 appears in 2 books (book-1, book-5)
      const genre2 = allGenres.find((g) => g.genre.data.genre_slug === "genre-2");
      expect(genre2?.count).toBe(2);

      // genre-3 appears in 2 books (book-3, book-5)
      const genre3 = allGenres.find((g) => g.genre.data.genre_slug === "genre-3");
      expect(genre3?.count).toBe(2);
    });

    it("should only include genres that have books in that language", () => {
      const genresWithCount = getGenresWithCount(mockBooks, mockGenres, "es");
      const allGenres = [...genresWithCount.fiction, ...genresWithCount.nonFiction];

      expect(allGenres.every((item) => item.genre.data.language === "es")).toBe(true);
      expect(allGenres.find((g) => g.genre.data.genre_slug === "genre-4")).toBeUndefined();
    });
  });

  describe("getPublishersWithCount", () => {
    it("should return publishers with book count for Spanish", () => {
      const publishers = getPublishersWithCount(mockBooks, mockPublishers, "es");

      expect(Array.isArray(publishers)).toBe(true);
      expect(publishers).toHaveLength(2);

      publishers.forEach((publisher) => {
        expect(publisher.publisher).toBeDefined();
        expect(publisher.count).toBeGreaterThan(0);
        expect(typeof publisher.count).toBe("number");
      });
    });

    it("should be sorted alphabetically by publisher name", () => {
      const publishers = getPublishersWithCount(mockBooks, mockPublishers, "es");

      expect(publishers[0].publisher.data.name).toBe("Editorial A");
      expect(publishers[1].publisher.data.name).toBe("Editorial B");
    });
  });

  describe("getSeriesWithCount", () => {
    it("should return series with book count for Spanish", () => {
      const series = getSeriesWithCount(mockBooks, mockSeries, "es");

      expect(Array.isArray(series)).toBe(true);
      expect(series).toHaveLength(1);

      series.forEach((s) => {
        expect(s.series).toBeDefined();
        expect(s.count).toBeGreaterThan(0);
        expect(typeof s.count).toBe("number");
      });
    });

    it("should be sorted alphabetically by series name", () => {
      const series = getSeriesWithCount(mockBooks, mockSeries, "es");

      expect(series[0].series.data.name).toBe("Serie 1");
      expect(series[0].count).toBe(2);
    });
  });

  describe("getRandomFavorites", () => {
    it("should return random favorite books for Spanish", () => {
      const favorites = getRandomFavorites(mockBooks, "es", 10);

      expect(Array.isArray(favorites)).toBe(true);
      expect(favorites).toHaveLength(1);

      favorites.forEach((book) => {
        expect(book.data.score).toBe("fav");
        expect(book.data.language).toBe("es");
      });
    });

    it("should return different books on subsequent calls (randomness)", () => {
      // Create a larger set of favorites for better randomness testing
      const manyFavorites: CollectionEntry<"books">[] = [];
      for (let i = 0; i < 20; i++) {
        manyFavorites.push({
          id: `fav-${i}.mdx`,
          collection: "books",
          data: {
            title: `Favorite ${i}`,
            post_slug: `favorite-${i}`,
            date: new Date(),
            excerpt: "test",
            language: "es",
            score: "fav",
            pages: 100,
            author: "author-1",
            genres: [],
            challenges: [],
            categories: [],
            cover: "./cover.jpg",
          },
        } as CollectionEntry<"books">);
      }

      const favorites1 = getRandomFavorites(manyFavorites, "es", 5);
      const favorites2 = getRandomFavorites(manyFavorites, "es", 5);

      // With 20 books and selecting 5, probability of identical order is 1 in 15,504
      // (This test might occasionally fail due to randomness, but statistically very unlikely)
      const sameBooks = favorites1.every((book, index) => book.id === favorites2[index].id);
      expect(sameBooks).toBe(false);
    });

    it("should respect the limit parameter", () => {
      const favorites = getRandomFavorites(mockBooks, "es", 1);
      expect(favorites).toHaveLength(1);
    });
  });

  describe("getFiveStarBooks", () => {
    it("should return random 5-star books for Spanish", () => {
      const fiveStars = getFiveStarBooks(mockBooks, "es", 5);

      expect(Array.isArray(fiveStars)).toBe(true);
      expect(fiveStars).toHaveLength(1);

      fiveStars.forEach((book) => {
        expect(book.data.score).toBe(5);
        expect(book.data.language).toBe("es");
      });
    });

    it("should return all 5-star books when limit is not specified", () => {
      const fiveStars = getFiveStarBooks(mockBooks, "es");

      expect(fiveStars).toHaveLength(1);
    });

    it("should respect the limit parameter", () => {
      const fiveStars = getFiveStarBooks(mockBooks, "es", 1);
      expect(fiveStars).toHaveLength(1);
    });
  });

  describe("getClassicsBooks", () => {
    it("should return random classics books for Spanish", () => {
      const classics = getClassicsBooks(mockBooks, "es", 5);

      expect(Array.isArray(classics)).toBe(true);
      expect(classics).toHaveLength(1);

      classics.forEach((book) => {
        expect(book.data.challenges).toContain("clasicos");
        expect(book.data.language).toBe("es");
      });
    });

    it("should respect the limit parameter", () => {
      const classics = getClassicsBooks(mockBooks, "es", 1);
      expect(classics).toHaveLength(1);
    });
  });

  describe("getActiveChallenges", () => {
    it("should return active challenges with progress for Spanish", () => {
      const challenges = getActiveChallenges(mockBooks, mockChallenges, "es");

      expect(Array.isArray(challenges)).toBe(true);
      expect(challenges.length).toBeGreaterThan(0);

      challenges.forEach((challenge) => {
        expect(challenge.challenge).toBeDefined();
        expect(challenge.completed).toBeGreaterThanOrEqual(0);
        expect(challenge.total).toBeGreaterThan(0);
        expect(challenge.percentage).toBeGreaterThanOrEqual(0);
        expect(challenge.percentage).toBeLessThanOrEqual(100);
      });
    });

    it("should only return active challenges (stephen-king, pesadillas, 155-libros)", () => {
      const challenges = getActiveChallenges(mockBooks, mockChallenges, "es");

      expect(challenges).toHaveLength(3);

      const challengeSlugs = challenges.map((c) => c.challenge.data.challenge_slug);
      expect(challengeSlugs).toContain("stephen-king");
      expect(challengeSlugs).toContain("pesadillas");
      expect(challengeSlugs).toContain("155-libros");
    });
  });
});
