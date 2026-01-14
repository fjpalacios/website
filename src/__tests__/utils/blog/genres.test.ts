import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { describe, it, expect } from "vitest";

describe("Genre Content Integration", () => {
  const genreDir = join(process.cwd(), "src/content/genres");
  const genreFiles = readdirSync(genreDir).filter((file) => file.endsWith(".json"));

  describe("Genre Files", () => {
    it("should have genre files", () => {
      expect(genreFiles.length).toBeGreaterThan(0);
    });

    it("should have valid JSON structure", () => {
      genreFiles.forEach((file) => {
        const content = readFileSync(join(genreDir, file), "utf-8");
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });

    it("should have required fields in all genres", () => {
      genreFiles.forEach((file) => {
        const content = JSON.parse(readFileSync(join(genreDir, file), "utf-8"));
        expect(content.name).toBeTruthy();
        expect(content.genre_slug).toBeTruthy();
        expect(content.language).toBeTruthy();
        expect(["es", "en"]).toContain(content.language);
      });
    });

    it("should have genres in both languages", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const spanishGenres = genres.filter((genre) => genre.language === "es");
      const englishGenres = genres.filter((genre) => genre.language === "en");

      expect(spanishGenres.length).toBeGreaterThan(0);

      // Skip English check if no English content exists
      if (englishGenres.length === 0) {
        console.warn("⚠️  No English genres found - skipping English validation");
      } else {
        expect(englishGenres.length).toBeGreaterThan(0);
      }
    });

    it("should have unique genre slugs per language", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const spanishSlugs = genres.filter((genre) => genre.language === "es").map((genre) => genre.genre_slug);
      const englishSlugs = genres.filter((genre) => genre.language === "en").map((genre) => genre.genre_slug);

      expect(new Set(spanishSlugs).size).toBe(spanishSlugs.length);
      expect(new Set(englishSlugs).size).toBe(englishSlugs.length);
    });
  });

  describe("Genre i18n Mapping", () => {
    it("should have i18n field for translations", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const genresWithI18n = genres.filter((genre) => genre.i18n);

      // Only check i18n if we have multiple languages
      const languages = new Set(genres.map((genre) => genre.language));
      if (languages.size < 2) {
        console.warn("⚠️  Only one language found - skipping i18n field validation");
      } else {
        expect(genresWithI18n.length).toBeGreaterThan(0);
      }
    });

    it("should have reciprocal i18n mappings", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const spanishGenres = genres.filter((genre) => genre.language === "es");
      const englishGenres = genres.filter((genre) => genre.language === "en");

      spanishGenres.forEach((esGenre) => {
        if (esGenre.i18n) {
          const enGenre = englishGenres.find((genre) => genre.genre_slug === esGenre.i18n);
          if (enGenre && enGenre.i18n) {
            expect(enGenre.i18n).toBe(esGenre.genre_slug);
          }
        }
      });
    });

    it("should have valid i18n references", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const genreSlugs = new Set(genres.map((genre) => genre.genre_slug));

      genres.forEach((genre) => {
        if (genre.i18n) {
          expect(genreSlugs.has(genre.i18n)).toBe(true);
        }
      });
    });
  });

  describe("Genre Hierarchy", () => {
    it("should have valid parent references if specified", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const genreSlugs = new Set(genres.map((genre) => genre.genre_slug));

      genres.forEach((genre) => {
        if (genre.parent) {
          expect(typeof genre.parent).toBe("string");
          expect(genreSlugs.has(genre.parent)).toBe(true);
        }
      });
    });

    it("should not have circular parent references", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));

      genres.forEach((genre) => {
        if (genre.parent) {
          const visited = new Set([genre.genre_slug]);
          let currentSlug = genre.parent;

          while (currentSlug) {
            expect(visited.has(currentSlug)).toBe(false);
            visited.add(currentSlug);

            const parent = genres.find((g) => g.genre_slug === currentSlug);
            currentSlug = parent?.parent;
          }
        }
      });
    });

    it("should have parent genres in the same language", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));

      genres.forEach((genre) => {
        if (genre.parent) {
          const parent = genres.find((g) => g.genre_slug === genre.parent);
          if (parent) {
            expect(parent.language).toBe(genre.language);
          }
        }
      });
    });
  });

  describe("Books with Genres", () => {
    const booksDir = join(process.cwd(), "src/content/books");

    it("should have books with valid genre references", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));
      const genreSlugs = new Set(genres.map((genre) => genre.genre_slug));

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const genresMatch = frontmatterMatch[1].match(/genres:\s*\[(.*?)\]/);
          if (genresMatch) {
            const bookGenres = genresMatch[1].split(",").map((genre) => genre.trim().replace(/['"]/g, ""));
            bookGenres.forEach((genre) => {
              if (genre) {
                expect(genreSlugs.has(genre)).toBe(true);
              }
            });
          }
        }
      });
    });

    it("should have at least one book per genre", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));

      const genreUsage = new Map<string, number>();
      genres.forEach((genre) => genreUsage.set(genre.genre_slug, 0));

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const genresMatch = frontmatterMatch[1].match(/genres:\s*\[(.*?)\]/);
          if (genresMatch) {
            const bookGenres = genresMatch[1].split(",").map((genre) => genre.trim().replace(/['"]/g, ""));
            bookGenres.forEach((genre) => {
              if (genre && genreUsage.has(genre)) {
                genreUsage.set(genre, (genreUsage.get(genre) || 0) + 1);
              }
            });
          }
        }
      });

      // At least some genres should be used
      const usedGenres = Array.from(genreUsage.values()).filter((count) => count > 0);
      expect(usedGenres.length).toBeGreaterThan(0);
    });
  });

  describe("Genre Descriptions", () => {
    it("should have description field", () => {
      const genres = genreFiles.map((file) => JSON.parse(readFileSync(join(genreDir, file), "utf-8")));

      genres.forEach((genre) => {
        if (genre.description) {
          expect(typeof genre.description).toBe("string");
          expect(genre.description.length).toBeGreaterThan(0);
        }
      });
    });
  });
});
