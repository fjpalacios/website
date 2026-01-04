/**
 * Tests for Mock Data Builders
 *
 * @module __tests__/__helpers__/mockData.test
 */

import { describe, expect, it } from "vitest";

import {
  createMockAuthor,
  createMockBook,
  createMockBooks,
  createMockContact,
  createMockPost,
  createMockPosts,
  createMockTaxonomy,
  createMockTutorial,
} from "./mockData";

describe("Mock Data Builders", () => {
  describe("createMockBook", () => {
    it("should create a book with default values", () => {
      const book = createMockBook(1, "es");

      expect(book.id).toBe("book-1");
      expect(book.slug).toBe("book-slug-1");
      expect(book.collection).toBe("books");
      expect(book.data.title).toBe("Book Title 1");
      expect(book.data.post_slug).toBe("book-slug-1");
      expect(book.data.excerpt).toBe("Excerpt for book 1");
      expect(book.data.language).toBe("es");
    });

    it("should create a book in English", () => {
      const book = createMockBook(2, "en");

      expect(book.data.language).toBe("en");
    });

    it("should accept overrides", () => {
      const book = createMockBook(3, "es", {
        title: "Custom Title",
        author: "stephen-king",
        score: 9,
      });

      expect(book.data.title).toBe("Custom Title");
      expect(book.data.author).toBe("stephen-king");
      expect(book.data.score).toBe(9);
    });

    it("should preserve default values when using overrides", () => {
      const book = createMockBook(4, "es", { score: 8 });

      expect(book.data.post_slug).toBe("book-slug-4");
      expect(book.data.excerpt).toBe("Excerpt for book 4");
    });
  });

  describe("createMockBooks", () => {
    it("should create multiple books", () => {
      const books = createMockBooks(5, "es");

      expect(books).toHaveLength(5);
      expect(books[0].id).toBe("book-1");
      expect(books[4].id).toBe("book-5");
    });

    it("should create books with custom factory", () => {
      const books = createMockBooks(3, "en", (i) => ({ score: i * 2 }));

      expect(books).toHaveLength(3);
      expect(books[0].data.score).toBe(2);
      expect(books[1].data.score).toBe(4);
      expect(books[2].data.score).toBe(6);
    });

    it("should handle zero count", () => {
      const books = createMockBooks(0, "es");

      expect(books).toHaveLength(0);
    });
  });

  describe("createMockAuthor", () => {
    it("should create an author with default values", () => {
      const author = createMockAuthor("stephen-king", "Stephen King");

      expect(author.id).toBe("stephen-king");
      expect(author.slug).toBe("stephen-king");
      expect(author.collection).toBe("authors");
      expect(author.data.name).toBe("Stephen King");
      expect(author.data.slug).toBe("stephen-king");
    });

    it("should accept overrides", () => {
      const author = createMockAuthor("jk-rowling", "J.K. Rowling", {
        bio: "British author",
        language: "en",
      });

      expect(author.data.bio).toBe("British author");
      expect(author.data.language).toBe("en");
    });
  });

  describe("createMockTaxonomy", () => {
    it("should create a genre", () => {
      const genre = createMockTaxonomy("genres", "fiction", "Fiction");

      expect(genre.id).toBe("fiction");
      expect(genre.slug).toBe("fiction");
      expect(genre.collection).toBe("genres");
      expect(genre.data.name).toBe("Fiction");
    });

    it("should create a publisher", () => {
      const publisher = createMockTaxonomy("publishers", "penguin", "Penguin Random House");

      expect(publisher.collection).toBe("publishers");
      expect(publisher.data.name).toBe("Penguin Random House");
    });

    it("should accept overrides", () => {
      const category = createMockTaxonomy("categories", "tech", "Technology", {
        description: "Technology books",
        language: "en",
      });

      expect(category.data.description).toBe("Technology books");
      expect(category.data.language).toBe("en");
    });
  });

  describe("createMockPost", () => {
    it("should create a post with default values", () => {
      const post = createMockPost(1, "es");

      expect(post.id).toBe("post-1");
      expect(post.slug).toBe("post-slug-1");
      expect(post.collection).toBe("posts");
      expect(post.data.title).toBe("Post Title 1");
      expect(post.data.language).toBe("es");
      expect(post.data.published_date).toBeInstanceOf(Date);
    });

    it("should create posts with incremental dates", () => {
      const post1 = createMockPost(1, "es");
      const post2 = createMockPost(2, "es");

      expect(post1.data.published_date.getDate()).toBe(1);
      expect(post2.data.published_date.getDate()).toBe(2);
    });

    it("should accept overrides", () => {
      const post = createMockPost(3, "en", {
        categories: ["tech", "programming"],
      });

      expect(post.data.categories).toEqual(["tech", "programming"]);
    });
  });

  describe("createMockPosts", () => {
    it("should create multiple posts", () => {
      const posts = createMockPosts(10, "es");

      expect(posts).toHaveLength(10);
      expect(posts[0].id).toBe("post-1");
      expect(posts[9].id).toBe("post-10");
    });

    it("should create posts with custom factory", () => {
      const posts = createMockPosts(3, "en", (i) => ({
        categories: [`category-${i}`],
      }));

      expect(posts[0].data.categories).toEqual(["category-1"]);
      expect(posts[2].data.categories).toEqual(["category-3"]);
    });
  });

  describe("createMockTutorial", () => {
    it("should create a tutorial with default values", () => {
      const tutorial = createMockTutorial(1, "es");

      expect(tutorial.id).toBe("tutorial-1");
      expect(tutorial.slug).toBe("tutorial-slug-1");
      expect(tutorial.collection).toBe("tutorials");
      expect(tutorial.data.title).toBe("Tutorial Title 1");
      expect(tutorial.data.language).toBe("es");
    });

    it("should accept overrides", () => {
      const tutorial = createMockTutorial(2, "en", {
        categories: ["javascript", "typescript"],
      });

      expect(tutorial.data.categories).toEqual(["javascript", "typescript"]);
    });
  });

  describe("createMockContact", () => {
    it("should create contact with default values", () => {
      const contact = createMockContact();

      expect(Array.isArray(contact)).toBe(true);
      expect(contact.length).toBe(1);
      expect(contact[0].name).toBe("Email");
      expect(contact[0].link).toBe("mailto:test@example.com");
      expect(contact[0].icon).toBe("mail");
      expect(contact[0].text).toBe("test@example.com");
    });

    it("should accept overrides", () => {
      const contact = createMockContact([
        {
          name: "Email",
          link: "mailto:john@example.com",
          icon: "mail",
          text: "john@example.com",
        },
        {
          name: "Website",
          link: "https://johndoe.com",
          icon: "globe",
          text: "johndoe.com",
        },
      ]);

      expect(contact.length).toBe(2);
      expect(contact[0].link).toBe("mailto:john@example.com");
      expect(contact[1].link).toBe("https://johndoe.com");
    });

    it("should partially override", () => {
      const contact = createMockContact([
        {
          name: "Custom Email",
          link: "mailto:jane@example.com",
          icon: "mail",
          text: "jane@example.com",
        },
      ]);

      expect(contact.length).toBe(1);
      expect(contact[0].name).toBe("Custom Email");
      expect(contact[0].text).toBe("jane@example.com");
    });
  });
});
