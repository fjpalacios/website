import { describe, expect, it } from "vitest";

import {
  sortByDate,
  filterByLanguage,
  filterByTag,
  groupByYear,
  type CollectionItem,
  type GroupedByYear,
} from "@/utils/blog/collections";

// Mock data for testing
const createMockItem = (id: number, date: Date, language: "es" | "en", tags: string[] = []): CollectionItem => ({
  slug: `item-${id}`,
  data: {
    title: `Item ${id}`,
    date: date,
    language,
    tags,
  },
});

describe("sortByDate", () => {
  const items: CollectionItem[] = [
    createMockItem(1, new Date("2024-03-15"), "es"),
    createMockItem(2, new Date("2024-01-10"), "es"),
    createMockItem(3, new Date("2024-06-20"), "en"),
    createMockItem(4, new Date("2024-02-01"), "en"),
  ];

  describe("Descending order (newest first)", () => {
    it("should sort items by date in descending order by default", () => {
      const sorted = sortByDate(items);
      expect(sorted[0].slug).toBe("item-3"); // 2024-06-20
      expect(sorted[1].slug).toBe("item-1"); // 2024-03-15
      expect(sorted[2].slug).toBe("item-4"); // 2024-02-01
      expect(sorted[3].slug).toBe("item-2"); // 2024-01-10
    });

    it("should sort items by date in descending order explicitly", () => {
      const sorted = sortByDate(items, "desc");
      expect(sorted[0].slug).toBe("item-3");
      expect(sorted[3].slug).toBe("item-2");
    });
  });

  describe("Ascending order (oldest first)", () => {
    it("should sort items by date in ascending order", () => {
      const sorted = sortByDate(items, "asc");
      expect(sorted[0].slug).toBe("item-2"); // 2024-01-10
      expect(sorted[1].slug).toBe("item-4"); // 2024-02-01
      expect(sorted[2].slug).toBe("item-1"); // 2024-03-15
      expect(sorted[3].slug).toBe("item-3"); // 2024-06-20
    });
  });

  describe("Edge cases", () => {
    it("should handle empty array", () => {
      expect(sortByDate([])).toEqual([]);
    });

    it("should handle single item", () => {
      const single = [createMockItem(1, new Date("2024-01-01"), "es")];
      expect(sortByDate(single)).toEqual(single);
    });

    it("should handle items with same date", () => {
      const sameDate = new Date("2024-01-01");
      const itemsSameDate = [
        createMockItem(1, sameDate, "es"),
        createMockItem(2, sameDate, "en"),
        createMockItem(3, sameDate, "es"),
      ];
      const sorted = sortByDate(itemsSameDate);
      expect(sorted).toHaveLength(3);
      // Order should be maintained when dates are equal
    });

    it("should not modify original array", () => {
      const original = [...items];
      sortByDate(items);
      expect(items).toEqual(original);
    });
  });

  describe("Invalid inputs", () => {
    it("should throw for invalid order parameter", () => {
      // @ts-expect-error Testing runtime validation
      expect(() => sortByDate(items, "invalid")).toThrow('Order must be "asc" or "desc"');
    });
  });
});

describe("filterByLanguage", () => {
  const items: CollectionItem[] = [
    createMockItem(1, new Date("2024-01-01"), "es"),
    createMockItem(2, new Date("2024-01-02"), "en"),
    createMockItem(3, new Date("2024-01-03"), "es"),
    createMockItem(4, new Date("2024-01-04"), "en"),
    createMockItem(5, new Date("2024-01-05"), "es"),
  ];

  describe("Filter by Spanish", () => {
    it("should return only Spanish items", () => {
      const spanish = filterByLanguage(items, "es");
      expect(spanish).toHaveLength(3);
      expect(spanish.every((item) => item.data.language === "es")).toBe(true);
      expect(spanish.map((item) => item.slug)).toEqual(["item-1", "item-3", "item-5"]);
    });
  });

  describe("Filter by English", () => {
    it("should return only English items", () => {
      const english = filterByLanguage(items, "en");
      expect(english).toHaveLength(2);
      expect(english.every((item) => item.data.language === "en")).toBe(true);
      expect(english.map((item) => item.slug)).toEqual(["item-2", "item-4"]);
    });
  });

  describe("Edge cases", () => {
    it("should return empty array when no items match", () => {
      const onlySpanish = [createMockItem(1, new Date(), "es")];
      expect(filterByLanguage(onlySpanish, "en")).toEqual([]);
    });

    it("should handle empty array", () => {
      expect(filterByLanguage([], "es")).toEqual([]);
    });

    it("should not modify original array", () => {
      const original = [...items];
      filterByLanguage(items, "es");
      expect(items).toEqual(original);
    });
  });
});

describe("filterByTag", () => {
  const items: CollectionItem[] = [
    createMockItem(1, new Date("2024-01-01"), "es", ["javascript", "react"]),
    createMockItem(2, new Date("2024-01-02"), "es", ["typescript", "node"]),
    createMockItem(3, new Date("2024-01-03"), "en", ["javascript", "vue"]),
    createMockItem(4, new Date("2024-01-04"), "en", ["python", "django"]),
    createMockItem(5, new Date("2024-01-05"), "es", ["javascript", "typescript"]),
  ];

  describe("Filter by single tag", () => {
    it("should return items with javascript tag", () => {
      const jsItems = filterByTag(items, "javascript");
      expect(jsItems).toHaveLength(3);
      expect(jsItems.map((item) => item.slug)).toEqual(["item-1", "item-3", "item-5"]);
    });

    it("should return items with typescript tag", () => {
      const tsItems = filterByTag(items, "typescript");
      expect(tsItems).toHaveLength(2);
      expect(tsItems.map((item) => item.slug)).toEqual(["item-2", "item-5"]);
    });

    it("should return items with python tag", () => {
      const pyItems = filterByTag(items, "python");
      expect(pyItems).toHaveLength(1);
      expect(pyItems[0].slug).toBe("item-4");
    });
  });

  describe("Case sensitivity", () => {
    it("should be case-insensitive by default", () => {
      const result1 = filterByTag(items, "JavaScript");
      const result2 = filterByTag(items, "javascript");
      const result3 = filterByTag(items, "JAVASCRIPT");

      expect(result1).toHaveLength(3);
      expect(result2).toHaveLength(3);
      expect(result3).toHaveLength(3);
    });
  });

  describe("Edge cases", () => {
    it("should return empty array when no items match", () => {
      expect(filterByTag(items, "rust")).toEqual([]);
    });

    it("should handle empty array", () => {
      expect(filterByTag([], "javascript")).toEqual([]);
    });

    it("should handle items with no tags", () => {
      const noTags = [createMockItem(1, new Date(), "es", [])];
      expect(filterByTag(noTags, "javascript")).toEqual([]);
    });

    it("should handle items with undefined tags", () => {
      const itemsUndefinedTags: CollectionItem[] = [
        {
          slug: "item-1",
          data: {
            title: "Item 1",
            date: new Date(),
            language: "es",
            // tags is undefined
          },
        },
      ];
      expect(filterByTag(itemsUndefinedTags, "javascript")).toEqual([]);
    });

    it("should not modify original array", () => {
      const original = [...items];
      filterByTag(items, "javascript");
      expect(items).toEqual(original);
    });
  });

  describe("Invalid inputs", () => {
    it("should throw for empty tag string", () => {
      expect(() => filterByTag(items, "")).toThrow("Tag cannot be empty");
    });

    it("should throw for whitespace-only tag", () => {
      expect(() => filterByTag(items, "   ")).toThrow("Tag cannot be empty");
    });
  });
});

describe("groupByYear", () => {
  const items: CollectionItem[] = [
    createMockItem(1, new Date("2024-06-15"), "es"),
    createMockItem(2, new Date("2024-03-20"), "en"),
    createMockItem(3, new Date("2023-11-10"), "es"),
    createMockItem(4, new Date("2023-05-01"), "en"),
    createMockItem(5, new Date("2022-12-25"), "es"),
    createMockItem(6, new Date("2024-01-05"), "en"),
  ];

  describe("Basic grouping", () => {
    it("should group items by year", () => {
      const grouped = groupByYear(items);

      expect(grouped).toHaveLength(3);
      expect(grouped[0].year).toBe(2024);
      expect(grouped[1].year).toBe(2023);
      expect(grouped[2].year).toBe(2022);
    });

    it("should have correct number of items per year", () => {
      const grouped = groupByYear(items);

      expect(grouped[0].items).toHaveLength(3); // 2024
      expect(grouped[1].items).toHaveLength(2); // 2023
      expect(grouped[2].items).toHaveLength(1); // 2022
    });

    it("should sort groups by year descending (newest first)", () => {
      const grouped = groupByYear(items);

      expect(grouped[0].year).toBe(2024);
      expect(grouped[1].year).toBe(2023);
      expect(grouped[2].year).toBe(2022);
    });

    it("should sort items within each year by date descending", () => {
      const grouped = groupByYear(items);

      const items2024 = grouped[0].items;
      expect(items2024[0].slug).toBe("item-1"); // 2024-06-15
      expect(items2024[1].slug).toBe("item-2"); // 2024-03-20
      expect(items2024[2].slug).toBe("item-6"); // 2024-01-05
    });
  });

  describe("Edge cases", () => {
    it("should handle empty array", () => {
      expect(groupByYear([])).toEqual([]);
    });

    it("should handle single item", () => {
      const single = [createMockItem(1, new Date("2024-01-01"), "es")];
      const grouped = groupByYear(single);

      expect(grouped).toHaveLength(1);
      expect(grouped[0].year).toBe(2024);
      expect(grouped[0].items).toHaveLength(1);
    });

    it("should handle all items in same year", () => {
      const sameYear = [
        createMockItem(1, new Date("2024-01-01"), "es"),
        createMockItem(2, new Date("2024-06-15"), "en"),
        createMockItem(3, new Date("2024-12-31"), "es"),
      ];
      const grouped = groupByYear(sameYear);

      expect(grouped).toHaveLength(1);
      expect(grouped[0].year).toBe(2024);
      expect(grouped[0].items).toHaveLength(3);
    });

    it("should not modify original array", () => {
      const original = [...items];
      groupByYear(items);
      expect(items).toEqual(original);
    });
  });

  describe("Type structure", () => {
    it("should return correct GroupedByYear structure", () => {
      const grouped: GroupedByYear[] = groupByYear(items);

      expect(typeof grouped[0].year).toBe("number");
      expect(Array.isArray(grouped[0].items)).toBe(true);
      expect(grouped[0].items[0]).toHaveProperty("slug");
      expect(grouped[0].items[0]).toHaveProperty("data");
    });
  });
});

describe("Integration tests", () => {
  const items: CollectionItem[] = [
    createMockItem(1, new Date("2024-06-15"), "es", ["javascript", "react"]),
    createMockItem(2, new Date("2024-03-20"), "en", ["typescript", "node"]),
    createMockItem(3, new Date("2023-11-10"), "es", ["javascript", "vue"]),
    createMockItem(4, new Date("2023-05-01"), "en", ["python"]),
    createMockItem(5, new Date("2024-01-05"), "es", ["javascript", "typescript"]),
  ];

  it("should filter by language and sort by date", () => {
    const spanish = filterByLanguage(items, "es");
    const sorted = sortByDate(spanish, "desc");

    expect(sorted).toHaveLength(3);
    expect(sorted[0].slug).toBe("item-1"); // 2024-06-15
    expect(sorted[1].slug).toBe("item-5"); // 2024-01-05
    expect(sorted[2].slug).toBe("item-3"); // 2023-11-10
  });

  it("should filter by tag and group by year", () => {
    const jsItems = filterByTag(items, "javascript");
    const grouped = groupByYear(jsItems);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].year).toBe(2024);
    expect(grouped[0].items).toHaveLength(2); // item-1 and item-5
    expect(grouped[1].year).toBe(2023);
    expect(grouped[1].items).toHaveLength(1); // item-3
  });

  it("should chain all operations", () => {
    // Get Spanish items with javascript tag, grouped by year
    const spanish = filterByLanguage(items, "es");
    const jsItems = filterByTag(spanish, "javascript");
    const grouped = groupByYear(jsItems);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].items.every((item) => item.data.language === "es")).toBe(true);
    expect(grouped[0].items.every((item) => item.data.tags?.includes("javascript"))).toBe(true);
  });
});
