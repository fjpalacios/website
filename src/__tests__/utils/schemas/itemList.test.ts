import { describe, expect, it } from "vitest";

import { generateItemListSchema } from "@/utils/schemas/itemList";

describe("generateItemListSchema", () => {
  const baseUrl = "https://fjp.es";

  describe("basic structure", () => {
    it("should generate valid Schema.org ItemList structure", () => {
      const items = [
        {
          name: "Test Item",
          url: "/test/item",
          type: "Thing" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema).toHaveProperty("@context", "https://schema.org");
      expect(schema).toHaveProperty("@type", "ItemList");
      expect(schema).toHaveProperty("itemListElement");
      expect(Array.isArray(schema.itemListElement)).toBe(true);
    });

    it("should handle empty items array", () => {
      const schema = generateItemListSchema([], baseUrl);

      expect(schema.itemListElement).toHaveLength(0);
    });

    it("should remove trailing slash from baseUrl", () => {
      const items = [
        {
          name: "Test",
          url: "/test",
          type: "Thing" as const,
        },
      ];

      const schemaWithSlash = generateItemListSchema(items, "https://fjp.es/");
      const schemaWithoutSlash = generateItemListSchema(items, "https://fjp.es");

      expect(schemaWithSlash).toEqual(schemaWithoutSlash);
      expect(schemaWithSlash.itemListElement[0].item.url).toBe("https://fjp.es/test");
    });
  });

  describe("item properties", () => {
    it("should include all required item fields", () => {
      const items = [
        {
          name: "Apocalipsis",
          url: "/es/libros/apocalipsis-stephen-king",
          type: "Book" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);
      const item = schema.itemListElement[0];

      expect(item).toHaveProperty("@type", "ListItem");
      expect(item).toHaveProperty("position", 1);
      expect(item).toHaveProperty("item");
      expect(item.item).toHaveProperty("@type", "Book");
      expect(item.item).toHaveProperty("name", "Apocalipsis");
      expect(item.item).toHaveProperty("url", "https://fjp.es/es/libros/apocalipsis-stephen-king");
    });

    it("should include optional description field when provided", () => {
      const items = [
        {
          name: "Test Post",
          url: "/test",
          type: "BlogPosting" as const,
          description: "This is a test description",
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item).toHaveProperty("description", "This is a test description");
    });

    it("should omit description field when not provided", () => {
      const items = [
        {
          name: "Test Post",
          url: "/test",
          type: "BlogPosting" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item).not.toHaveProperty("description");
    });

    it("should default to Thing type when type is not specified", () => {
      const items = [
        {
          name: "Generic Item",
          url: "/generic",
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item["@type"]).toBe("Thing");
    });
  });

  describe("multiple items", () => {
    it("should handle multiple items with correct positions", () => {
      const items = [
        { name: "Item 1", url: "/item-1", type: "Thing" as const },
        { name: "Item 2", url: "/item-2", type: "Thing" as const },
        { name: "Item 3", url: "/item-3", type: "Thing" as const },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it("should preserve item order", () => {
      const items = [
        { name: "First", url: "/first", type: "Thing" as const },
        { name: "Second", url: "/second", type: "Thing" as const },
        { name: "Third", url: "/third", type: "Thing" as const },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item.name).toBe("First");
      expect(schema.itemListElement[1].item.name).toBe("Second");
      expect(schema.itemListElement[2].item.name).toBe("Third");
    });
  });

  describe("content types", () => {
    it("should support Book type", () => {
      const items = [
        {
          name: "1984",
          url: "/es/libros/1984",
          type: "Book" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item["@type"]).toBe("Book");
    });

    it("should support BlogPosting type", () => {
      const items = [
        {
          name: "My Blog Post",
          url: "/es/publicaciones/my-post",
          type: "BlogPosting" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item["@type"]).toBe("BlogPosting");
    });

    it("should support TechArticle type", () => {
      const items = [
        {
          name: "Git Tutorial",
          url: "/es/tutoriales/git-tutorial",
          type: "TechArticle" as const,
        },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item["@type"]).toBe("TechArticle");
    });

    it("should support mixed content types", () => {
      const items = [
        { name: "Book", url: "/book", type: "Book" as const },
        { name: "Post", url: "/post", type: "BlogPosting" as const },
        { name: "Tutorial", url: "/tutorial", type: "TechArticle" as const },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item["@type"]).toBe("Book");
      expect(schema.itemListElement[1].item["@type"]).toBe("BlogPosting");
      expect(schema.itemListElement[2].item["@type"]).toBe("TechArticle");
    });
  });

  describe("url formatting", () => {
    it("should handle URLs with leading slash", () => {
      const items = [{ name: "Test", url: "/test/page", type: "Thing" as const }];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item.url).toBe("https://fjp.es/test/page");
    });

    it("should handle URLs without leading slash", () => {
      const items = [{ name: "Test", url: "test/page", type: "Thing" as const }];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item.url).toBe("https://fjp.es/test/page");
    });

    it("should construct absolute URLs correctly", () => {
      const items = [
        { name: "ES Page", url: "/es/libros/test", type: "Book" as const },
        { name: "EN Page", url: "/en/books/test", type: "Book" as const },
      ];

      const schema = generateItemListSchema(items, baseUrl);

      expect(schema.itemListElement[0].item.url).toBe("https://fjp.es/es/libros/test");
      expect(schema.itemListElement[1].item.url).toBe("https://fjp.es/en/books/test");
    });
  });

  describe("real-world example", () => {
    it("should generate correct schema for book listing", () => {
      const books = [
        {
          name: "Apocalipsis",
          url: "/es/libros/apocalipsis-stephen-king",
          type: "Book" as const,
          description: "Una épica historia de terror y supervivencia",
        },
        {
          name: "1984",
          url: "/es/libros/1984-george-orwell",
          type: "Book" as const,
          description: "Una distopía clásica sobre el totalitarismo",
        },
      ];

      const schema = generateItemListSchema(books, baseUrl);

      expect(schema["@type"]).toBe("ItemList");
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].item.name).toBe("Apocalipsis");
      expect(schema.itemListElement[0].item["@type"]).toBe("Book");
      expect(schema.itemListElement[0].item.description).toBe("Una épica historia de terror y supervivencia");
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[1].item.name).toBe("1984");
    });

    it("should generate correct schema for tutorial listing", () => {
      const tutorials = [
        {
          name: "Introducción a Git",
          url: "/es/tutoriales/introduccion-a-git",
          type: "TechArticle" as const,
        },
        {
          name: "Variables en JavaScript",
          url: "/es/tutoriales/variables-javascript",
          type: "TechArticle" as const,
        },
      ];

      const schema = generateItemListSchema(tutorials, baseUrl);

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].item["@type"]).toBe("TechArticle");
      expect(schema.itemListElement[1].item["@type"]).toBe("TechArticle");
    });
  });
});
