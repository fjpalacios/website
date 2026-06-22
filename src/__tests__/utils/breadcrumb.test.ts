import { generateBreadcrumbSchema } from "@utils/breadcrumb";
import type { BreadcrumbItem, BreadcrumbListItemSchema } from "@utils/breadcrumb";
import { describe, expect, test } from "vitest";

describe("breadcrumb", () => {
  describe("generateBreadcrumbSchema", () => {
    test("returns a valid Schema.org BreadcrumbList object with @context and @type", () => {
      const items: BreadcrumbItem[] = [{ label: "Home", url: "/en" }, { label: "Books" }];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
    });

    test("assigns 1-based positions to each item in order", () => {
      const items: BreadcrumbItem[] = [
        { label: "Home", url: "/en" },
        { label: "Books", url: "/en/books" },
        { label: "The Stand" },
      ];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");
      const list: BreadcrumbListItemSchema[] = schema.itemListElement;

      expect(list).toHaveLength(3);
      expect(list[0]?.position).toBe(1);
      expect(list[1]?.position).toBe(2);
      expect(list[2]?.position).toBe(3);
    });

    test("each item is a ListItem with @type and the label as name", () => {
      const items: BreadcrumbItem[] = [{ label: "Home", url: "/en" }, { label: "Books" }];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");
      const list: BreadcrumbListItemSchema[] = schema.itemListElement;

      for (const entry of list) {
        expect(entry["@type"]).toBe("ListItem");
        expect(typeof entry.name).toBe("string");
        expect(entry.name).toBeTruthy();
      }
    });

    test("includes the full item URL when breadcrumb has a url", () => {
      const items: BreadcrumbItem[] = [{ label: "Home", url: "/en" }];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");
      const list: BreadcrumbListItemSchema[] = schema.itemListElement;

      expect(list[0]?.item).toBe("https://fjp.es/en");
    });

    test("omits the item field when breadcrumb has no url (current page)", () => {
      const items: BreadcrumbItem[] = [
        { label: "Home", url: "/en" },
        { label: "The Stand" }, // no url = current page
      ];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");
      const list: BreadcrumbListItemSchema[] = schema.itemListElement;

      expect(list[0]?.item).toBe("https://fjp.es/en");
      expect(list[1]).not.toHaveProperty("item");
    });

    test("concatenates baseUrl with the item url without altering the path", () => {
      const items: BreadcrumbItem[] = [
        { label: "Books", url: "/en/books" },
        { label: "Detail", url: "/en/books/the-stand" },
      ];

      const schema = generateBreadcrumbSchema(items, "https://fjp.es");
      const list: BreadcrumbListItemSchema[] = schema.itemListElement;

      expect(list[0]?.item).toBe("https://fjp.es/en/books");
      expect(list[1]?.item).toBe("https://fjp.es/en/books/the-stand");
    });

    test("returns an empty itemListElement for an empty items array", () => {
      const schema = generateBreadcrumbSchema([], "https://fjp.es");

      expect(schema.itemListElement).toEqual([]);
    });
  });
});
