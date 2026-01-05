import { test, expect, type Page } from "@playwright/test";

/**
 * E2E tests for ItemList Schema.org structured data
 * Tests verify that ItemList schemas are present and correctly structured
 * on all listing and taxonomy detail pages
 */

// Type definitions for Schema.org ItemList structure
interface SchemaItem {
  "@type": string;
  name: string;
  url: string;
  description?: string;
}

interface SchemaListItem {
  "@type": "ListItem";
  position: number;
  item: SchemaItem;
}

interface ItemListSchema {
  "@context": string;
  "@type": "ItemList";
  itemListElement: SchemaListItem[];
}

/**
 * Helper function to find and parse ItemList schema
 */
async function getItemListSchema(page: Page): Promise<ItemListSchema | null> {
  const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

  for (const script of jsonLdScripts) {
    const content = await script.textContent();
    const schema = JSON.parse(content!) as { "@type"?: string };
    if (schema["@type"] === "ItemList") {
      return schema as ItemListSchema;
    }
  }
  return null;
}

/**
 * Helper function to assert and return non-null ItemList schema
 */
function assertItemListSchema(schema: ItemListSchema | null): ItemListSchema {
  expect(schema).toBeTruthy();
  if (!schema) {
    throw new Error("ItemList schema not found");
  }
  return schema;
}

/**
 * Helper function to validate ItemList structure
 */
function validateItemListStructure(schema: ItemListSchema, expectedItemType?: string) {
  expect(schema["@context"]).toBe("https://schema.org");
  expect(schema["@type"]).toBe("ItemList");
  expect(schema.itemListElement).toBeTruthy();
  expect(Array.isArray(schema.itemListElement)).toBe(true);
  expect(schema.itemListElement.length).toBeGreaterThan(0);

  // Validate first item structure
  const firstItem = schema.itemListElement[0];
  expect(firstItem["@type"]).toBe("ListItem");
  expect(firstItem.position).toBe(1);
  expect(firstItem.item).toBeTruthy();
  expect(firstItem.item["@type"]).toBeTruthy();
  expect(firstItem.item.name).toBeTruthy();
  expect(firstItem.item.url).toBeTruthy();
  expect(firstItem.item.url).toMatch(/^https:\/\//); // Absolute URL

  // Validate expected item type if provided
  if (expectedItemType) {
    expect(firstItem.item["@type"]).toBe(expectedItemType);
  }

  // Validate position numbering is sequential
  schema.itemListElement.forEach((item: SchemaListItem, index: number) => {
    expect(item.position).toBe(index + 1);
  });
}

test.describe("SEO ItemList Schema - Listing Pages", () => {
  test.describe("Book Listing Pages", () => {
    test("should have ItemList schema on Spanish book listing page", async ({ page }) => {
      await page.goto("/es/libros/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");

      // Verify descriptions are present
      const firstItem = itemListSchema.itemListElement[0];
      expect(firstItem.item.description).toBeTruthy();
    });

    test("should have ItemList schema on English book listing page", async ({ page }) => {
      await page.goto("/en/books/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have proper URLs in Spanish book listing", async ({ page }) => {
      await page.goto("/es/libros/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      const firstItem = itemListSchema.itemListElement[0];

      // URL should follow Spanish pattern
      expect(firstItem.item.url).toMatch(/^https:\/\/fjp\.es\/es\/libros\/.+\/$/);
    });

    test("should have proper URLs in English book listing", async ({ page }) => {
      await page.goto("/en/books/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      const firstItem = itemListSchema.itemListElement[0];

      // URL should follow English pattern
      expect(firstItem.item.url).toMatch(/^https:\/\/fjp\.es\/en\/books\/.+\/$/);
    });
  });

  test.describe("Tutorial Listing Pages", () => {
    test("should have ItemList schema on Spanish tutorial listing page", async ({ page }) => {
      await page.goto("/es/tutoriales/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "TechArticle");
    });

    test("should have ItemList schema on English tutorial listing page", async ({ page }) => {
      await page.goto("/en/tutorials/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));

      // English tutorials page might be empty - validate structure if content exists
      if (itemListSchema && itemListSchema.itemListElement.length > 0) {
        validateItemListStructure(itemListSchema, "TechArticle");
      } else {
        // Page exists but has no content yet - verify empty ItemList structure
        expect(itemListSchema).toBeTruthy();
        expect(itemListSchema["@type"]).toBe("ItemList");
        expect(Array.isArray(itemListSchema.itemListElement)).toBe(true);
        expect(itemListSchema.itemListElement.length).toBe(0);
      }
    });
  });

  test.describe("Posts Listing Pages", () => {
    test("should have ItemList schema on Spanish posts listing page", async ({ page }) => {
      await page.goto("/es/publicaciones/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema);

      // Posts page can have mixed types (BlogPosting, TechArticle, Book)
      const firstItem = itemListSchema.itemListElement[0];
      expect(["BlogPosting", "TechArticle", "Book"]).toContain(firstItem.item["@type"]);
    });

    test("should have ItemList schema on English posts listing page", async ({ page }) => {
      await page.goto("/en/posts/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema);
    });

    test("should handle mixed content types on posts page", async ({ page }) => {
      await page.goto("/es/publicaciones/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));

      // Check that different content types can coexist
      const types = new Set(itemListSchema.itemListElement.map((item: SchemaListItem) => item.item["@type"]));

      // At least one type should be present
      expect(types.size).toBeGreaterThanOrEqual(1);

      // All types should be valid
      types.forEach((type: string) => {
        expect(["BlogPosting", "TechArticle", "Book"]).toContain(type);
      });
    });
  });
});

test.describe("SEO ItemList Schema - Taxonomy Detail Pages", () => {
  /**
   * Helper function to get ItemList schema (reused from above)
   */
  async function getItemListSchema(page: Page): Promise<ItemListSchema | null> {
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      const schema = JSON.parse(content!) as { "@type"?: string };
      if (schema["@type"] === "ItemList") {
        return schema as ItemListSchema;
      }
    }
    return null;
  }

  /**
   * Helper function to validate ItemList structure (reused from above)
   */
  function validateItemListStructure(schema: ItemListSchema, expectedItemType?: string) {
    expect(schema).toBeTruthy();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.itemListElement).toBeTruthy();
    expect(Array.isArray(schema.itemListElement)).toBe(true);
    expect(schema.itemListElement.length).toBeGreaterThan(0);

    const firstItem = schema.itemListElement[0];
    expect(firstItem["@type"]).toBe("ListItem");
    expect(firstItem.position).toBe(1);
    expect(firstItem.item).toBeTruthy();
    expect(firstItem.item["@type"]).toBeTruthy();
    expect(firstItem.item.name).toBeTruthy();
    expect(firstItem.item.url).toBeTruthy();
    expect(firstItem.item.url).toMatch(/^https:\/\//);

    if (expectedItemType) {
      expect(firstItem.item["@type"]).toBe(expectedItemType);
    }

    schema.itemListElement.forEach((item: SchemaListItem, index: number) => {
      expect(item.position).toBe(index + 1);
    });
  }

  test.describe("Author Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish author page", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema);

      // Author pages typically contain books
      const firstItem = itemListSchema.itemListElement[0];
      expect(firstItem.item["@type"]).toBe("Book");
    });

    test("should have ItemList schema on English author page", async ({ page }) => {
      await page.goto("/en/authors/stephen-king/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have proper book URLs on author page", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      const firstItem = itemListSchema.itemListElement[0];

      // URLs should point to book pages
      expect(firstItem.item.url).toMatch(/^https:\/\/fjp\.es\/es\/libros\/.+\/$/);
    });
  });

  test.describe("Category Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish category page", async ({ page }) => {
      await page.goto("/es/categorias/libros/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema);
    });

    test("should have ItemList schema on English category page", async ({ page }) => {
      await page.goto("/en/categories/books/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema);
    });

    test("should handle mixed content types on category pages", async ({ page }) => {
      // Use a category that we know has content (tutorials)
      await page.goto("/es/categorias/tutoriales/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));

      // Skip test if schema not found or page doesn't exist
      if (!itemListSchema) {
        test.skip();
        return;
      }

      // Skip if category is empty
      if (itemListSchema.itemListElement.length === 0) {
        expect(itemListSchema).toBeTruthy();
        expect(itemListSchema["@type"]).toBe("ItemList");
        return;
      }

      validateItemListStructure(itemListSchema);

      // Category pages might have mixed types (BlogPosting, TechArticle, Book)
      const types = new Set(itemListSchema.itemListElement.map((item: SchemaListItem) => item.item["@type"]));

      expect(types.size).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Genre Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish genre page", async ({ page }) => {
      await page.goto("/es/generos/terror/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have ItemList schema on English genre page", async ({ page }) => {
      await page.goto("/en/genres/horror/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });
  });

  test.describe("Publisher Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish publisher page", async ({ page }) => {
      await page.goto("/es/editoriales/debolsillo/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have ItemList schema on English publisher page", async ({ page }) => {
      await page.goto("/en/publishers/penguin-random-house/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });
  });

  test.describe("Series Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish series page", async ({ page }) => {
      await page.goto("/es/series/fjallbacka/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have ItemList schema on English series page (if exists)", async ({ page }) => {
      // Note: Skip if no English series exist
      const response = await page.goto("/en/series/");

      if (response && response.status() === 200) {
        const content = await page.content();
        // Only test if there are series listed
        if (!content.includes("empty-state")) {
          // Find first series link and test it
          const firstSeriesLink = await page.locator('a[href*="/en/series/"]').first();
          if ((await firstSeriesLink.count()) > 0) {
            await firstSeriesLink.click();
            const itemListSchema = assertItemListSchema(await getItemListSchema(page));
            if (itemListSchema) {
              validateItemListStructure(itemListSchema, "Book");
            }
          }
        }
      }
    });
  });

  test.describe("Challenge Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish challenge page", async ({ page }) => {
      await page.goto("/es/retos/reto-lectura-2017/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "Book");
    });

    test("should have ItemList schema on English challenge page", async ({ page }) => {
      await page.goto("/en/challenges/2017-reading-challenge/");

      const itemListSchema = await getItemListSchema(page);

      // Verify schema exists (even if empty)
      expect(itemListSchema).toBeTruthy();

      if (!itemListSchema) {
        return;
      }

      // English challenge pages might be empty - validate structure if content exists
      if (itemListSchema.itemListElement.length > 0) {
        validateItemListStructure(itemListSchema, "Book");
      } else {
        // Page exists but has no content yet - verify empty ItemList structure
        expect(itemListSchema["@type"]).toBe("ItemList");
        expect(Array.isArray(itemListSchema.itemListElement)).toBe(true);
        expect(itemListSchema.itemListElement.length).toBe(0);
      }
    });
  });

  test.describe("Course Taxonomy Pages", () => {
    test("should have ItemList schema on Spanish course page", async ({ page }) => {
      await page.goto("/es/cursos/domina-git-desde-cero/");

      const itemListSchema = assertItemListSchema(await getItemListSchema(page));
      validateItemListStructure(itemListSchema, "TechArticle");
    });

    test("should have ItemList schema on English course page", async ({ page: _page }) => {
      // Note: Currently no courses exist in English, but the courses listing page exists
      // This test validates that empty course detail pages would have correct schema structure
      // Skip for now since no specific course pages exist in English
      test.skip(true, "No English course pages exist yet");
    });
  });
});

test.describe("SEO ItemList Schema - Data Quality", () => {
  /**
   * Helper function to get ItemList schema
   */
  async function getItemListSchema(page: Page): Promise<ItemListSchema | null> {
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      const schema = JSON.parse(content!) as { "@type"?: string };
      if (schema["@type"] === "ItemList") {
        return schema as ItemListSchema;
      }
    }
    return null;
  }

  test("should have non-empty descriptions on all items", async ({ page }) => {
    await page.goto("/es/libros/");

    const itemListSchema = assertItemListSchema(await getItemListSchema(page));

    itemListSchema.itemListElement.forEach((listItem: SchemaListItem) => {
      expect(listItem.item.description).toBeTruthy();
      expect(listItem.item.description!.length).toBeGreaterThan(10);
    });
  });

  test("should have valid URL format for all items", async ({ page }) => {
    await page.goto("/es/libros/");

    const itemListSchema = assertItemListSchema(await getItemListSchema(page));

    itemListSchema.itemListElement.forEach((listItem: SchemaListItem) => {
      expect(listItem.item.url).toMatch(/^https:\/\/fjp\.es\/(es|en)\/.+\/$/);
    });
  });

  test("should not have duplicate URLs in ItemList", async ({ page }) => {
    await page.goto("/es/publicaciones/");

    const itemListSchema = assertItemListSchema(await getItemListSchema(page));

    const urls = itemListSchema.itemListElement.map((item: SchemaListItem) => item.item.url);
    const uniqueUrls = new Set(urls);

    expect(urls.length).toBe(uniqueUrls.size);
  });

  test("should have consistent position numbering", async ({ page }) => {
    await page.goto("/es/libros/");

    const itemListSchema = assertItemListSchema(await getItemListSchema(page));

    // Verify positions start at 1 and increment by 1
    itemListSchema.itemListElement.forEach((item: SchemaListItem, index: number) => {
      expect(item.position).toBe(index + 1);
    });

    // Verify no gaps in numbering
    const positions = itemListSchema.itemListElement.map((item: SchemaListItem) => item.position);
    const maxPosition = Math.max(...positions);
    expect(maxPosition).toBe(positions.length);
  });

  test("should use correct Schema.org types based on content", async ({ page }) => {
    const testCases = [
      { url: "/es/libros/", expectedType: "Book" },
      { url: "/es/tutoriales/", expectedType: "TechArticle" },
      { url: "/es/autores/stephen-king/", expectedType: "Book" },
      { url: "/es/generos/terror/", expectedType: "Book" },
    ];

    for (const testCase of testCases) {
      await page.goto(testCase.url);
      const itemListSchema = assertItemListSchema(await getItemListSchema(page));

      if (itemListSchema.itemListElement.length > 0) {
        const firstItem = itemListSchema.itemListElement[0];
        expect(firstItem.item["@type"]).toBe(testCase.expectedType);
      }
    }
  });

  test("should have all required Schema.org properties", async ({ page }) => {
    await page.goto("/es/libros/");

    const itemListSchema = assertItemListSchema(await getItemListSchema(page));

    // Validate top-level properties
    expect(itemListSchema["@context"]).toBe("https://schema.org");
    expect(itemListSchema["@type"]).toBe("ItemList");
    expect(itemListSchema.itemListElement).toBeTruthy();

    // Validate each list item has required properties
    itemListSchema.itemListElement.forEach((listItem: SchemaListItem) => {
      expect(listItem["@type"]).toBe("ListItem");
      expect(listItem.position).toBeGreaterThan(0);
      expect(listItem.item).toBeTruthy();
      expect(listItem.item["@type"]).toBeTruthy();
      expect(listItem.item.name).toBeTruthy();
      expect(listItem.item.url).toBeTruthy();
    });
  });
});
