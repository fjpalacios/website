import { describe, expect, it } from "vitest";

import { getPageCount, paginateItems, getPaginationInfo, type PaginationInfo } from "@/utils/blog/pagination";

describe("getPageCount", () => {
  describe("Basic calculations", () => {
    it("should calculate page count for exact division", () => {
      expect(getPageCount(10, 5)).toBe(2);
      expect(getPageCount(100, 10)).toBe(10);
      expect(getPageCount(50, 25)).toBe(2);
    });

    it("should round up for non-exact division", () => {
      expect(getPageCount(11, 5)).toBe(3);
      expect(getPageCount(101, 10)).toBe(11);
      expect(getPageCount(51, 25)).toBe(3);
    });

    it("should return 1 for items less than page size", () => {
      expect(getPageCount(5, 10)).toBe(1);
      expect(getPageCount(1, 10)).toBe(1);
      expect(getPageCount(9, 10)).toBe(1);
    });
  });

  describe("Edge cases", () => {
    it("should return 0 for zero items", () => {
      expect(getPageCount(0, 10)).toBe(0);
    });

    it("should handle single item per page", () => {
      expect(getPageCount(5, 1)).toBe(5);
      expect(getPageCount(100, 1)).toBe(100);
    });

    it("should handle large numbers", () => {
      expect(getPageCount(1000, 10)).toBe(100);
      expect(getPageCount(9999, 100)).toBe(100);
    });
  });

  describe("Invalid inputs", () => {
    it("should throw for negative total items", () => {
      expect(() => getPageCount(-1, 10)).toThrow("Total items must be non-negative");
    });

    it("should throw for zero or negative items per page", () => {
      expect(() => getPageCount(10, 0)).toThrow("Items per page must be positive");
      expect(() => getPageCount(10, -5)).toThrow("Items per page must be positive");
    });

    it("should throw for non-integer inputs", () => {
      expect(() => getPageCount(10.5, 10)).toThrow("Total items must be an integer");
      expect(() => getPageCount(10, 10.5)).toThrow("Items per page must be an integer");
    });
  });
});

describe("paginateItems", () => {
  const testItems = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  }));

  describe("Basic pagination", () => {
    it("should return correct items for first page", () => {
      const result = paginateItems(testItems, 1, 10);
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe(1);
      expect(result[9].id).toBe(10);
    });

    it("should return correct items for middle page", () => {
      const result = paginateItems(testItems, 2, 10);
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe(11);
      expect(result[9].id).toBe(20);
    });

    it("should return correct items for last page", () => {
      const result = paginateItems(testItems, 3, 10);
      expect(result).toHaveLength(5);
      expect(result[0].id).toBe(21);
      expect(result[4].id).toBe(25);
    });

    it("should handle different page sizes", () => {
      const result5 = paginateItems(testItems, 1, 5);
      expect(result5).toHaveLength(5);

      const result20 = paginateItems(testItems, 1, 20);
      expect(result20).toHaveLength(20);

      const result30 = paginateItems(testItems, 1, 30);
      expect(result30).toHaveLength(25);
    });
  });

  describe("Edge cases", () => {
    it("should return empty array for empty input", () => {
      expect(paginateItems([], 1, 10)).toEqual([]);
    });

    it("should return empty array for page beyond last page", () => {
      expect(paginateItems(testItems, 10, 10)).toEqual([]);
    });

    it("should handle single item per page", () => {
      const result = paginateItems(testItems, 5, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(5);
    });

    it("should handle all items on single page", () => {
      const result = paginateItems(testItems, 1, 100);
      expect(result).toHaveLength(25);
      expect(result[0].id).toBe(1);
      expect(result[24].id).toBe(25);
    });
  });

  describe("Invalid inputs", () => {
    it("should throw for page less than 1", () => {
      expect(() => paginateItems(testItems, 0, 10)).toThrow("Page must be at least 1");
      expect(() => paginateItems(testItems, -1, 10)).toThrow("Page must be at least 1");
    });

    it("should throw for zero or negative items per page", () => {
      expect(() => paginateItems(testItems, 1, 0)).toThrow("Items per page must be positive");
      expect(() => paginateItems(testItems, 1, -5)).toThrow("Items per page must be positive");
    });

    it("should throw for non-integer inputs", () => {
      expect(() => paginateItems(testItems, 1.5, 10)).toThrow("Page must be an integer");
      expect(() => paginateItems(testItems, 1, 10.5)).toThrow("Items per page must be an integer");
    });
  });

  describe("Type preservation", () => {
    it("should preserve item types", () => {
      interface Book {
        id: number;
        title: string;
        author: string;
      }

      const books: Book[] = [
        { id: 1, title: "Book 1", author: "Author 1" },
        { id: 2, title: "Book 2", author: "Author 2" },
      ];

      const result = paginateItems(books, 1, 10);
      expect(result[0].author).toBe("Author 1");
    });
  });
});

describe("getPaginationInfo", () => {
  describe("Basic info generation", () => {
    it("should generate correct info for first page", () => {
      const info = getPaginationInfo(1, 5);
      expect(info.currentPage).toBe(1);
      expect(info.totalPages).toBe(5);
      expect(info.hasNextPage).toBe(true);
      expect(info.hasPrevPage).toBe(false);
      expect(info.nextPage).toBe(2);
      expect(info.prevPage).toBeNull();
    });

    it("should generate correct info for middle page", () => {
      const info = getPaginationInfo(3, 5);
      expect(info.currentPage).toBe(3);
      expect(info.hasNextPage).toBe(true);
      expect(info.hasPrevPage).toBe(true);
      expect(info.nextPage).toBe(4);
      expect(info.prevPage).toBe(2);
    });

    it("should generate correct info for last page", () => {
      const info = getPaginationInfo(5, 5);
      expect(info.currentPage).toBe(5);
      expect(info.hasNextPage).toBe(false);
      expect(info.hasPrevPage).toBe(true);
      expect(info.nextPage).toBeNull();
      expect(info.prevPage).toBe(4);
    });

    it("should handle single page", () => {
      const info = getPaginationInfo(1, 1);
      expect(info.currentPage).toBe(1);
      expect(info.totalPages).toBe(1);
      expect(info.hasNextPage).toBe(false);
      expect(info.hasPrevPage).toBe(false);
      expect(info.nextPage).toBeNull();
      expect(info.prevPage).toBeNull();
    });
  });

  describe("Page ranges", () => {
    it("should generate simple range for few pages", () => {
      const info = getPaginationInfo(2, 5);
      expect(info.pageRange).toEqual([1, 2, 3, 4, 5]);
    });

    it("should generate range with ellipsis for many pages (start)", () => {
      const info = getPaginationInfo(2, 15);
      expect(info.pageRange).toEqual([1, 2, 3, 4, 5, "...", 15]);
    });

    it("should generate range with ellipsis for many pages (middle)", () => {
      const info = getPaginationInfo(8, 15);
      expect(info.pageRange).toEqual([1, "...", 6, 7, 8, 9, 10, "...", 15]);
    });

    it("should generate range with ellipsis for many pages (end)", () => {
      const info = getPaginationInfo(14, 15);
      expect(info.pageRange).toEqual([1, "...", 11, 12, 13, 14, 15]);
    });

    it("should handle edge case where ellipsis not needed", () => {
      const info = getPaginationInfo(5, 7);
      expect(info.pageRange).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe("Invalid inputs", () => {
    it("should throw for current page less than 1", () => {
      expect(() => getPaginationInfo(0, 5)).toThrow("Current page must be at least 1");
      expect(() => getPaginationInfo(-1, 5)).toThrow("Current page must be at least 1");
    });

    it("should throw for total pages less than 1", () => {
      expect(() => getPaginationInfo(1, 0)).toThrow("Total pages must be at least 1");
      expect(() => getPaginationInfo(1, -5)).toThrow("Total pages must be at least 1");
    });

    it("should throw for current page greater than total pages", () => {
      expect(() => getPaginationInfo(6, 5)).toThrow("Current page cannot exceed total pages");
    });

    it("should throw for non-integer inputs", () => {
      expect(() => getPaginationInfo(1.5, 5)).toThrow("Current page must be an integer");
      expect(() => getPaginationInfo(1, 5.5)).toThrow("Total pages must be an integer");
    });
  });

  describe("Type definitions", () => {
    it("should have correct PaginationInfo type", () => {
      const info: PaginationInfo = getPaginationInfo(2, 5);

      // TypeScript will catch type errors at compile time
      expect(typeof info.currentPage).toBe("number");
      expect(typeof info.totalPages).toBe("number");
      expect(typeof info.hasNextPage).toBe("boolean");
      expect(typeof info.hasPrevPage).toBe("boolean");
      expect(Array.isArray(info.pageRange)).toBe(true);

      // nextPage and prevPage can be number or null
      if (info.nextPage !== null) {
        expect(typeof info.nextPage).toBe("number");
      }
      if (info.prevPage !== null) {
        expect(typeof info.prevPage).toBe("number");
      }
    });
  });
});

describe("Integration tests", () => {
  it("should work together for complete pagination flow", () => {
    const items = Array.from({ length: 47 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
    }));

    const itemsPerPage = 10;
    const totalPages = getPageCount(items.length, itemsPerPage);

    expect(totalPages).toBe(5);

    // Get page 3
    const page3Items = paginateItems(items, 3, itemsPerPage);
    const page3Info = getPaginationInfo(3, totalPages);

    expect(page3Items).toHaveLength(10);
    expect(page3Items[0].id).toBe(21);
    expect(page3Info.currentPage).toBe(3);
    expect(page3Info.hasNextPage).toBe(true);
    expect(page3Info.hasPrevPage).toBe(true);

    // Get last page
    const lastPageItems = paginateItems(items, totalPages, itemsPerPage);
    const lastPageInfo = getPaginationInfo(totalPages, totalPages);

    expect(lastPageItems).toHaveLength(7); // 47 % 10 = 7
    expect(lastPageItems[0].id).toBe(41);
    expect(lastPageInfo.hasNextPage).toBe(false);
  });

  it("should handle blog-like content with different types", () => {
    interface BlogPost {
      slug: string;
      title: string;
      date: Date;
    }

    const posts: BlogPost[] = Array.from({ length: 15 }, (_, i) => ({
      slug: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      date: new Date(2024, 0, i + 1),
    }));

    const pageSize = 5;
    const totalPages = getPageCount(posts.length, pageSize);
    const page2Posts = paginateItems(posts, 2, pageSize);
    const page2Info = getPaginationInfo(2, totalPages);

    expect(totalPages).toBe(3);
    expect(page2Posts).toHaveLength(5);
    expect(page2Posts[0].slug).toBe("post-6");
    expect(page2Info.currentPage).toBe(2);
  });
});
