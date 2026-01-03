/**
 * Tests for Centralized Error Classes
 *
 * @module __tests__/utils/errors.test
 */

import { describe, expect, it } from "vitest";

import { ImageNotFoundError, PropsValidationError, RouteParseError, TemplateNotFoundError } from "@/utils/errors";

describe("Centralized Error Classes", () => {
  describe("RouteParseError", () => {
    it("should create error with correct properties", () => {
      const error = new RouteParseError("Invalid route", "en", "/en/invalid/path", ["invalid", "path"]);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("RouteParseError");
      expect(error.message).toBe("Invalid route");
      expect(error.lang).toBe("en");
      expect(error.path).toBe("/en/invalid/path");
      expect(error.segments).toEqual(["invalid", "path"]);
    });

    it("should have readonly properties", () => {
      const error = new RouteParseError("Test", "es", "/es/test", ["test"]);

      // TypeScript should enforce readonly, but we can verify the properties exist
      expect(error.lang).toBe("es");
      expect(error.path).toBe("/es/test");
      expect(error.segments).toEqual(["test"]);
    });

    it("should preserve stack trace", () => {
      const error = new RouteParseError("Test error", "en", "/en/test", ["test"]);

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("RouteParseError");
    });
  });

  describe("TemplateNotFoundError", () => {
    it("should create error with descriptive message", () => {
      const error = new TemplateNotFoundError("books", "rss");

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("TemplateNotFoundError");
      expect(error.message).toBe('No template found for contentType="books" and pageType="rss"');
      expect(error.contentType).toBe("books");
      expect(error.pageType).toBe("rss");
    });

    it("should store contentType and pageType", () => {
      const error = new TemplateNotFoundError("tutorials", "static");

      expect(error.contentType).toBe("tutorials");
      expect(error.pageType).toBe("static");
    });

    it("should have readonly properties", () => {
      const error = new TemplateNotFoundError("posts", "detail");

      // Verify properties are accessible
      expect(error.contentType).toBe("posts");
      expect(error.pageType).toBe("detail");
    });
  });

  describe("PropsValidationError", () => {
    it("should create error with formatted Zod issues", () => {
      const zodIssues = [
        { path: ["lang"], message: "Invalid enum value", code: "invalid_enum_value" as const },
        { path: ["posts"], message: "Required", code: "invalid_type" as const },
      ];

      const error = new PropsValidationError("PostList", zodIssues);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("PropsValidationError");
      expect(error.message).toContain("[PostList] Invalid props:");
      expect(error.message).toContain("- lang: Invalid enum value");
      expect(error.message).toContain("- posts: Required");
      expect(error.componentName).toBe("PostList");
      expect(error.errors).toEqual(zodIssues);
    });

    it("should handle nested path in error messages", () => {
      const zodIssues = [
        {
          path: ["author", "name"],
          message: "String must contain at least 1 character(s)",
          code: "too_small" as const,
        },
      ];

      const error = new PropsValidationError("AuthorCard", zodIssues);

      expect(error.message).toContain("- author.name: String must contain at least 1 character(s)");
    });

    it("should handle empty errors array gracefully", () => {
      const error = new PropsValidationError("TestComponent", []);

      expect(error.message).toContain("[TestComponent] Invalid props:");
      expect(error.message).toContain("- Unknown validation error");
    });

    it("should store component name and errors", () => {
      const zodIssues = [{ path: ["test"], message: "Test error", code: "custom" as const }];
      const error = new PropsValidationError("MyComponent", zodIssues);

      expect(error.componentName).toBe("MyComponent");
      expect(error.errors).toEqual(zodIssues);
    });
  });

  describe("ImageNotFoundError", () => {
    it("should create error for book-cover type", () => {
      const error = new ImageNotFoundError("books/missing-book.jpg", "book-cover");

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("ImageNotFoundError");
      expect(error.message).toBe("[ImageNotFound] book-cover: books/missing-book.jpg");
      expect(error.imagePath).toBe("books/missing-book.jpg");
      expect(error.imageType).toBe("book-cover");
    });

    it("should create error for author-picture type", () => {
      const error = new ImageNotFoundError("authors/john-doe.jpg", "author-picture");

      expect(error.message).toBe("[ImageNotFound] author-picture: authors/john-doe.jpg");
      expect(error.imageType).toBe("author-picture");
    });

    it("should create error for tutorial-cover type", () => {
      const error = new ImageNotFoundError("tutorials/intro-js.jpg", "tutorial-cover");

      expect(error.message).toBe("[ImageNotFound] tutorial-cover: tutorials/intro-js.jpg");
      expect(error.imageType).toBe("tutorial-cover");
    });

    it("should create error for post-cover type", () => {
      const error = new ImageNotFoundError("posts/my-post.jpg", "post-cover");

      expect(error.message).toBe("[ImageNotFound] post-cover: posts/my-post.jpg");
      expect(error.imageType).toBe("post-cover");
    });

    it("should store imagePath and imageType", () => {
      const error = new ImageNotFoundError("test/path.jpg", "book-cover");

      expect(error.imagePath).toBe("test/path.jpg");
      expect(error.imageType).toBe("book-cover");
    });

    it("should have readonly properties", () => {
      const error = new ImageNotFoundError("test.jpg", "book-cover");

      // Verify properties are accessible
      expect(error.imagePath).toBe("test.jpg");
      expect(error.imageType).toBe("book-cover");
    });
  });

  describe("Error inheritance", () => {
    it("all custom errors should be instances of Error", () => {
      const routeError = new RouteParseError("test", "en", "/test", ["test"]);
      const templateError = new TemplateNotFoundError("books", "list");
      const propsError = new PropsValidationError("Test", []);
      const imageError = new ImageNotFoundError("test.jpg", "book-cover");

      expect(routeError).toBeInstanceOf(Error);
      expect(templateError).toBeInstanceOf(Error);
      expect(propsError).toBeInstanceOf(Error);
      expect(imageError).toBeInstanceOf(Error);
    });

    it("all custom errors should have correct names", () => {
      const routeError = new RouteParseError("test", "en", "/test", ["test"]);
      const templateError = new TemplateNotFoundError("books", "list");
      const propsError = new PropsValidationError("Test", []);
      const imageError = new ImageNotFoundError("test.jpg", "book-cover");

      expect(routeError.name).toBe("RouteParseError");
      expect(templateError.name).toBe("TemplateNotFoundError");
      expect(propsError.name).toBe("PropsValidationError");
      expect(imageError.name).toBe("ImageNotFoundError");
    });

    it("all custom errors should be catchable", () => {
      expect(() => {
        throw new RouteParseError("test", "en", "/test", ["test"]);
      }).toThrow(RouteParseError);

      expect(() => {
        throw new TemplateNotFoundError("books", "list");
      }).toThrow(TemplateNotFoundError);

      expect(() => {
        throw new PropsValidationError("Test", []);
      }).toThrow(PropsValidationError);

      expect(() => {
        throw new ImageNotFoundError("test.jpg", "book-cover");
      }).toThrow(ImageNotFoundError);
    });
  });
});
