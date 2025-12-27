import {
  buildLocalizedPath,
  getLocalizedRoute,
  getCanonicalSegment,
  buildContentUrl,
  buildIndexUrl,
  buildPaginatedIndexUrl,
  buildPostUrl,
  buildTutorialUrl,
  buildBookUrl,
  buildCategoryUrl,
  buildTagUrl,
  buildGenreUrl,
  buildPublisherUrl,
  buildSeriesUrl,
  buildChallengeUrl,
  buildCourseUrl,
  buildAuthorUrl,
  buildScoreUrl,
  buildAboutUrl,
  buildFeedsUrl,
  buildPostsIndexUrl,
  buildTutorialsIndexUrl,
  buildBooksIndexUrl,
  buildAuthorsIndexUrl,
  buildCategoriesIndexUrl,
  buildGenresIndexUrl,
  buildPublishersIndexUrl,
  buildSeriesIndexUrl,
  buildChallengesIndexUrl,
  buildCoursesIndexUrl,
  getLanguages,
  getDefaultLanguage,
  isValidLanguage,
  type RouteSegment,
  type ContentType,
} from "@utils/routes";
import { describe, it, expect } from "vitest";

describe("routes utilities", () => {
  describe("getLocalizedRoute", () => {
    it("should return localized route for Spanish", () => {
      expect(getLocalizedRoute("posts", "es")).toBe("publicaciones");
      expect(getLocalizedRoute("books", "es")).toBe("libros");
      expect(getLocalizedRoute("tutorials", "es")).toBe("tutoriales");
    });

    it("should return localized route for English", () => {
      expect(getLocalizedRoute("posts", "en")).toBe("posts");
      expect(getLocalizedRoute("books", "en")).toBe("books");
      expect(getLocalizedRoute("tutorials", "en")).toBe("tutorials");
    });

    it("should return segment as fallback for unknown language", () => {
      expect(getLocalizedRoute("posts", "fr")).toBe("posts");
    });
  });

  describe("buildLocalizedPath", () => {
    it("should build path with language prefix", () => {
      expect(buildLocalizedPath("es", "posts")).toBe("/es/publicaciones");
      expect(buildLocalizedPath("en", "posts")).toBe("/en/posts");
    });

    it("should build path with multiple segments", () => {
      expect(buildLocalizedPath("es", "posts", "my-slug")).toBe("/es/publicaciones/my-slug");
      expect(buildLocalizedPath("en", "books", "book-title")).toBe("/en/books/book-title");
    });

    it("should handle non-translated segments as-is", () => {
      expect(buildLocalizedPath("es", "posts", "some-slug-123")).toBe("/es/publicaciones/some-slug-123");
    });
  });

  describe("getCanonicalSegment", () => {
    it("should return canonical segment from localized Spanish", () => {
      expect(getCanonicalSegment("publicaciones", "es")).toBe("posts");
      expect(getCanonicalSegment("libros", "es")).toBe("books");
      expect(getCanonicalSegment("tutoriales", "es")).toBe("tutorials");
    });

    it("should return canonical segment from localized English", () => {
      expect(getCanonicalSegment("posts", "en")).toBe("posts");
      expect(getCanonicalSegment("books", "en")).toBe("books");
    });

    it("should return null for unknown segment", () => {
      expect(getCanonicalSegment("unknown", "es")).toBeNull();
      expect(getCanonicalSegment("random", "en")).toBeNull();
    });
  });

  describe("detail URL builders", () => {
    describe("buildPostUrl", () => {
      it("should build post URL in Spanish", () => {
        expect(buildPostUrl("es", "my-post")).toBe("/es/publicaciones/my-post");
      });

      it("should build post URL in English", () => {
        expect(buildPostUrl("en", "my-post")).toBe("/en/posts/my-post");
      });
    });

    describe("buildTutorialUrl", () => {
      it("should build tutorial URL in Spanish", () => {
        expect(buildTutorialUrl("es", "my-tutorial")).toBe("/es/tutoriales/my-tutorial");
      });

      it("should build tutorial URL in English", () => {
        expect(buildTutorialUrl("en", "my-tutorial")).toBe("/en/tutorials/my-tutorial");
      });
    });

    describe("buildBookUrl", () => {
      it("should build book URL in Spanish", () => {
        expect(buildBookUrl("es", "book-title")).toBe("/es/libros/book-title");
      });

      it("should build book URL in English", () => {
        expect(buildBookUrl("en", "book-title")).toBe("/en/books/book-title");
      });
    });

    describe("buildCategoryUrl", () => {
      it("should build category URL in Spanish", () => {
        expect(buildCategoryUrl("es", "tech")).toBe("/es/categorias/tech");
      });

      it("should build category URL in English", () => {
        expect(buildCategoryUrl("en", "tech")).toBe("/en/categories/tech");
      });
    });

    describe("buildTagUrl", () => {
      it("should build tag URL in Spanish", () => {
        expect(buildTagUrl("es", "javascript")).toBe("/es/etiqueta/javascript");
      });

      it("should build tag URL in English", () => {
        expect(buildTagUrl("en", "javascript")).toBe("/en/tag/javascript");
      });
    });

    describe("buildGenreUrl", () => {
      it("should build genre URL in Spanish", () => {
        expect(buildGenreUrl("es", "fiction")).toBe("/es/generos/fiction");
      });

      it("should build genre URL in English", () => {
        expect(buildGenreUrl("en", "fiction")).toBe("/en/genres/fiction");
      });
    });

    describe("buildPublisherUrl", () => {
      it("should build publisher URL in Spanish", () => {
        expect(buildPublisherUrl("es", "penguin")).toBe("/es/editoriales/penguin");
      });

      it("should build publisher URL in English", () => {
        expect(buildPublisherUrl("en", "penguin")).toBe("/en/publishers/penguin");
      });
    });

    describe("buildSeriesUrl", () => {
      it("should build series URL in Spanish", () => {
        expect(buildSeriesUrl("es", "harry-potter")).toBe("/es/series/harry-potter");
      });

      it("should build series URL in English", () => {
        expect(buildSeriesUrl("en", "harry-potter")).toBe("/en/series/harry-potter");
      });
    });

    describe("buildChallengeUrl", () => {
      it("should build challenge URL in Spanish", () => {
        expect(buildChallengeUrl("es", "2024")).toBe("/es/retos/2024");
      });

      it("should build challenge URL in English", () => {
        expect(buildChallengeUrl("en", "2024")).toBe("/en/challenges/2024");
      });
    });

    describe("buildCourseUrl", () => {
      it("should build course URL in Spanish", () => {
        expect(buildCourseUrl("es", "react-basics")).toBe("/es/cursos/react-basics");
      });

      it("should build course URL in English", () => {
        expect(buildCourseUrl("en", "react-basics")).toBe("/en/courses/react-basics");
      });
    });

    describe("buildAuthorUrl", () => {
      it("should build author URL in Spanish", () => {
        expect(buildAuthorUrl("es", "tolkien")).toBe("/es/autores/tolkien");
      });

      it("should build author URL in English", () => {
        expect(buildAuthorUrl("en", "tolkien")).toBe("/en/authors/tolkien");
      });
    });

    describe("buildScoreUrl", () => {
      it("should build score URL with number in Spanish", () => {
        expect(buildScoreUrl("es", 5)).toBe("/es/score/5");
      });

      it("should build score URL with string in English", () => {
        expect(buildScoreUrl("en", "4")).toBe("/en/score/4");
      });

      it("should convert number to string", () => {
        expect(buildScoreUrl("es", 3)).toBe("/es/score/3");
      });
    });

    describe("buildAboutUrl", () => {
      it("should build about URL in Spanish", () => {
        expect(buildAboutUrl("es")).toBe("/es/acerca-de");
      });

      it("should build about URL in English", () => {
        expect(buildAboutUrl("en")).toBe("/en/about");
      });
    });

    describe("buildFeedsUrl", () => {
      it("should build feeds URL in Spanish", () => {
        expect(buildFeedsUrl("es")).toBe("/es/feeds");
      });

      it("should build feeds URL in English", () => {
        expect(buildFeedsUrl("en")).toBe("/en/feeds");
      });
    });
  });

  describe("paginated index URL builders", () => {
    describe("buildPostsIndexUrl", () => {
      it("should build base URL without page", () => {
        expect(buildPostsIndexUrl("es")).toBe("/es/publicaciones");
        expect(buildPostsIndexUrl("en")).toBe("/en/posts");
      });

      it("should build base URL for page 1", () => {
        expect(buildPostsIndexUrl("es", 1)).toBe("/es/publicaciones");
        expect(buildPostsIndexUrl("en", 1)).toBe("/en/posts");
      });

      it("should build paginated URL for page > 1 in Spanish", () => {
        expect(buildPostsIndexUrl("es", 2)).toBe("/es/publicaciones/pagina/2");
        expect(buildPostsIndexUrl("es", 3)).toBe("/es/publicaciones/pagina/3");
      });

      it("should build paginated URL for page > 1 in English", () => {
        expect(buildPostsIndexUrl("en", 2)).toBe("/en/posts/page/2");
        expect(buildPostsIndexUrl("en", 5)).toBe("/en/posts/page/5");
      });
    });

    describe("buildTutorialsIndexUrl", () => {
      it("should build base URL without page", () => {
        expect(buildTutorialsIndexUrl("es")).toBe("/es/tutoriales");
        expect(buildTutorialsIndexUrl("en")).toBe("/en/tutorials");
      });

      it("should build paginated URL in Spanish", () => {
        expect(buildTutorialsIndexUrl("es", 2)).toBe("/es/tutoriales/pagina/2");
      });

      it("should build paginated URL in English", () => {
        expect(buildTutorialsIndexUrl("en", 3)).toBe("/en/tutorials/page/3");
      });
    });

    describe("buildBooksIndexUrl", () => {
      it("should build base URL without page", () => {
        expect(buildBooksIndexUrl("es")).toBe("/es/libros");
        expect(buildBooksIndexUrl("en")).toBe("/en/books");
      });

      it("should build paginated URL in Spanish", () => {
        expect(buildBooksIndexUrl("es", 4)).toBe("/es/libros/pagina/4");
      });

      it("should build paginated URL in English", () => {
        expect(buildBooksIndexUrl("en", 2)).toBe("/en/books/page/2");
      });
    });
  });

  describe("simple index URL builders", () => {
    describe("buildAuthorsIndexUrl", () => {
      it("should build authors index URL in Spanish", () => {
        expect(buildAuthorsIndexUrl("es")).toBe("/es/autores");
      });

      it("should build authors index URL in English", () => {
        expect(buildAuthorsIndexUrl("en")).toBe("/en/authors");
      });
    });

    describe("buildCategoriesIndexUrl", () => {
      it("should build categories index URL in Spanish", () => {
        expect(buildCategoriesIndexUrl("es")).toBe("/es/categorias");
      });

      it("should build categories index URL in English", () => {
        expect(buildCategoriesIndexUrl("en")).toBe("/en/categories");
      });
    });

    describe("buildGenresIndexUrl", () => {
      it("should build genres index URL in Spanish", () => {
        expect(buildGenresIndexUrl("es")).toBe("/es/generos");
      });

      it("should build genres index URL in English", () => {
        expect(buildGenresIndexUrl("en")).toBe("/en/genres");
      });
    });

    describe("buildPublishersIndexUrl", () => {
      it("should build publishers index URL in Spanish", () => {
        expect(buildPublishersIndexUrl("es")).toBe("/es/editoriales");
      });

      it("should build publishers index URL in English", () => {
        expect(buildPublishersIndexUrl("en")).toBe("/en/publishers");
      });
    });

    describe("buildSeriesIndexUrl", () => {
      it("should build series index URL in Spanish", () => {
        expect(buildSeriesIndexUrl("es")).toBe("/es/series");
      });

      it("should build series index URL in English", () => {
        expect(buildSeriesIndexUrl("en")).toBe("/en/series");
      });
    });

    describe("buildChallengesIndexUrl", () => {
      it("should build challenges index URL in Spanish", () => {
        expect(buildChallengesIndexUrl("es")).toBe("/es/retos");
      });

      it("should build challenges index URL in English", () => {
        expect(buildChallengesIndexUrl("en")).toBe("/en/challenges");
      });
    });

    describe("buildCoursesIndexUrl", () => {
      it("should build courses index URL in Spanish", () => {
        expect(buildCoursesIndexUrl("es")).toBe("/es/cursos");
      });

      it("should build courses index URL in English", () => {
        expect(buildCoursesIndexUrl("en")).toBe("/en/courses");
      });
    });
  });

  describe("language utilities", () => {
    describe("getLanguages", () => {
      it("should return array of supported languages", () => {
        const languages = getLanguages();
        expect(languages).toEqual(["es", "en"]);
        expect(languages).toHaveLength(2);
      });
    });

    describe("getDefaultLanguage", () => {
      it("should return Spanish as default language", () => {
        expect(getDefaultLanguage()).toBe("es");
      });
    });

    describe("isValidLanguage", () => {
      it("should return true for Spanish", () => {
        expect(isValidLanguage("es")).toBe(true);
      });

      it("should return true for English", () => {
        expect(isValidLanguage("en")).toBe(true);
      });

      it("should return false for unsupported languages", () => {
        expect(isValidLanguage("fr")).toBe(false);
        expect(isValidLanguage("de")).toBe(false);
        expect(isValidLanguage("it")).toBe(false);
        expect(isValidLanguage("")).toBe(false);
      });
    });
  });

  describe("edge cases and special scenarios", () => {
    it("should handle slugs with special characters", () => {
      expect(buildPostUrl("es", "post-with-123")).toBe("/es/publicaciones/post-with-123");
      expect(buildBookUrl("en", "book_with_underscore")).toBe("/en/books/book_with_underscore");
    });

    it("should handle empty slugs gracefully", () => {
      expect(buildPostUrl("es", "")).toBe("/es/publicaciones/");
      expect(buildAuthorUrl("en", "")).toBe("/en/authors/");
    });

    it("should handle score as zero", () => {
      expect(buildScoreUrl("es", 0)).toBe("/es/score/0");
    });

    it("should handle pagination edge cases", () => {
      expect(buildPostsIndexUrl("es", 0)).toBe("/es/publicaciones");
      expect(buildPostsIndexUrl("es", -1)).toBe("/es/publicaciones");
      expect(buildPostsIndexUrl("es", undefined)).toBe("/es/publicaciones");
    });
  });

  describe("generic URL builders", () => {
    describe("buildContentUrl", () => {
      it("should build content URLs for different types in Spanish", () => {
        expect(buildContentUrl("posts", "es", "my-post")).toBe("/es/publicaciones/my-post");
        expect(buildContentUrl("books", "es", "book-title")).toBe("/es/libros/book-title");
        expect(buildContentUrl("tutorials", "es", "tutorial-name")).toBe("/es/tutoriales/tutorial-name");
        expect(buildContentUrl("categories", "es", "tech")).toBe("/es/categorias/tech");
        expect(buildContentUrl("authors", "es", "tolkien")).toBe("/es/autores/tolkien");
      });

      it("should build content URLs for different types in English", () => {
        expect(buildContentUrl("posts", "en", "my-post")).toBe("/en/posts/my-post");
        expect(buildContentUrl("books", "en", "book-title")).toBe("/en/books/book-title");
        expect(buildContentUrl("tutorials", "en", "tutorial-name")).toBe("/en/tutorials/tutorial-name");
        expect(buildContentUrl("categories", "en", "tech")).toBe("/en/categories/tech");
        expect(buildContentUrl("authors", "en", "tolkien")).toBe("/en/authors/tolkien");
      });

      it("should work for all ContentType values", () => {
        const contentTypes: ContentType[] = [
          "posts",
          "tutorials",
          "books",
          "categories",
          "tags",
          "genres",
          "publishers",
          "series",
          "challenges",
          "courses",
          "authors",
        ];

        contentTypes.forEach((type) => {
          const url = buildContentUrl(type, "es", "test-slug");
          expect(url).toContain("/es/");
          expect(url).toContain("test-slug");
        });
      });
    });

    describe("buildIndexUrl", () => {
      it("should build index URLs for different types in Spanish", () => {
        expect(buildIndexUrl("authors", "es")).toBe("/es/autores");
        expect(buildIndexUrl("categories", "es")).toBe("/es/categorias");
        expect(buildIndexUrl("genres", "es")).toBe("/es/generos");
        expect(buildIndexUrl("about", "es")).toBe("/es/acerca-de");
      });

      it("should build index URLs for different types in English", () => {
        expect(buildIndexUrl("authors", "en")).toBe("/en/authors");
        expect(buildIndexUrl("categories", "en")).toBe("/en/categories");
        expect(buildIndexUrl("genres", "en")).toBe("/en/genres");
        expect(buildIndexUrl("about", "en")).toBe("/en/about");
      });
    });

    describe("buildPaginatedIndexUrl", () => {
      it("should build base URL without page", () => {
        expect(buildPaginatedIndexUrl("posts", "es")).toBe("/es/publicaciones");
        expect(buildPaginatedIndexUrl("books", "en")).toBe("/en/books");
      });

      it("should build base URL for page 1", () => {
        expect(buildPaginatedIndexUrl("posts", "es", 1)).toBe("/es/publicaciones");
        expect(buildPaginatedIndexUrl("books", "en", 1)).toBe("/en/books");
      });

      it("should build paginated URL for page > 1 in Spanish", () => {
        expect(buildPaginatedIndexUrl("posts", "es", 2)).toBe("/es/publicaciones/pagina/2");
        expect(buildPaginatedIndexUrl("tutorials", "es", 3)).toBe("/es/tutoriales/pagina/3");
        expect(buildPaginatedIndexUrl("books", "es", 5)).toBe("/es/libros/pagina/5");
      });

      it("should build paginated URL for page > 1 in English", () => {
        expect(buildPaginatedIndexUrl("posts", "en", 2)).toBe("/en/posts/page/2");
        expect(buildPaginatedIndexUrl("tutorials", "en", 4)).toBe("/en/tutorials/page/4");
        expect(buildPaginatedIndexUrl("books", "en", 10)).toBe("/en/books/page/10");
      });

      it("should handle edge cases", () => {
        expect(buildPaginatedIndexUrl("posts", "es", 0)).toBe("/es/publicaciones");
        expect(buildPaginatedIndexUrl("posts", "es", -5)).toBe("/es/publicaciones");
        expect(buildPaginatedIndexUrl("posts", "es", undefined)).toBe("/es/publicaciones");
      });
    });

    describe("type safety", () => {
      it("should enforce ContentType for buildContentUrl", () => {
        // TypeScript should enforce this at compile time
        const validTypes: ContentType[] = ["posts", "books", "tutorials"];
        validTypes.forEach((type) => {
          expect(() => buildContentUrl(type, "es", "slug")).not.toThrow();
        });
      });

      it("should enforce RouteSegment for buildIndexUrl", () => {
        // TypeScript should enforce this at compile time
        const validSegments: RouteSegment[] = ["authors", "categories", "about"];
        validSegments.forEach((segment) => {
          expect(() => buildIndexUrl(segment, "es")).not.toThrow();
        });
      });
    });
  });

  describe("backwards compatibility", () => {
    it("should maintain same output for all helper functions", () => {
      // Verify that refactored helpers produce identical output
      const helpers = [
        { fn: buildPostUrl, expected: "/es/publicaciones/test" },
        { fn: buildTutorialUrl, expected: "/es/tutoriales/test" },
        { fn: buildBookUrl, expected: "/es/libros/test" },
        { fn: buildAuthorUrl, expected: "/es/autores/test" },
      ];

      helpers.forEach(({ fn, expected }) => {
        expect(fn("es", "test")).toBe(expected);
      });
    });

    it("should maintain same output for paginated helpers", () => {
      expect(buildPostsIndexUrl("es", 2)).toBe("/es/publicaciones/pagina/2");
      expect(buildTutorialsIndexUrl("en", 3)).toBe("/en/tutorials/page/3");
      expect(buildBooksIndexUrl("es")).toBe("/es/libros");
    });

    it("should maintain same output for simple index helpers", () => {
      expect(buildAuthorsIndexUrl("es")).toBe("/es/autores");
      expect(buildCategoriesIndexUrl("en")).toBe("/en/categories");
      expect(buildGenresIndexUrl("es")).toBe("/es/generos");
    });
  });
});
