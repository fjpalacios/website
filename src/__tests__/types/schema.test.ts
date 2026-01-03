import { describe, expect, it } from "vitest";

import { isValidSchemaType, SCHEMA_TYPES, type SchemaType } from "@/types/schema";

describe("SCHEMA_TYPES constants", () => {
  it("should have all required schema types", () => {
    expect(SCHEMA_TYPES.BOOK).toBe("Book");
    expect(SCHEMA_TYPES.TECH_ARTICLE).toBe("TechArticle");
    expect(SCHEMA_TYPES.BLOG_POSTING).toBe("BlogPosting");
    expect(SCHEMA_TYPES.REVIEW).toBe("Review");
    expect(SCHEMA_TYPES.PERSON).toBe("Person");
    expect(SCHEMA_TYPES.ORGANIZATION).toBe("Organization");
    expect(SCHEMA_TYPES.WEB_PAGE).toBe("WebPage");
    expect(SCHEMA_TYPES.ITEM_LIST).toBe("ItemList");
    expect(SCHEMA_TYPES.RATING).toBe("Rating");
  });

  it("should be readonly (const assertion)", () => {
    // This test verifies TypeScript type safety at compile time
    // @ts-expect-error - Should not be able to modify readonly object
    SCHEMA_TYPES.BOOK = "Modified";
  });

  it("should export correct number of types", () => {
    const types = Object.keys(SCHEMA_TYPES);
    expect(types).toHaveLength(9);
  });

  it("should have unique values", () => {
    const values = Object.values(SCHEMA_TYPES);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});

describe("isValidSchemaType", () => {
  it("should return true for valid schema types", () => {
    expect(isValidSchemaType("Book")).toBe(true);
    expect(isValidSchemaType("TechArticle")).toBe(true);
    expect(isValidSchemaType("BlogPosting")).toBe(true);
    expect(isValidSchemaType("Person")).toBe(true);
    expect(isValidSchemaType("Organization")).toBe(true);
    expect(isValidSchemaType("WebPage")).toBe(true);
    expect(isValidSchemaType("ItemList")).toBe(true);
    expect(isValidSchemaType("Review")).toBe(true);
    expect(isValidSchemaType("Rating")).toBe(true);
  });

  it("should return false for invalid schema types", () => {
    expect(isValidSchemaType("InvalidType")).toBe(false);
    expect(isValidSchemaType("book")).toBe(false); // case sensitive
    expect(isValidSchemaType("BOOK")).toBe(false); // case sensitive
    expect(isValidSchemaType("")).toBe(false);
    expect(isValidSchemaType(" ")).toBe(false);
  });

  it("should return false for non-string values", () => {
    expect(isValidSchemaType(null)).toBe(false);
    expect(isValidSchemaType(undefined)).toBe(false);
    expect(isValidSchemaType(123)).toBe(false);
    expect(isValidSchemaType({})).toBe(false);
    expect(isValidSchemaType([])).toBe(false);
    expect(isValidSchemaType(true)).toBe(false);
  });

  it("should work as a type guard", () => {
    const value: unknown = "Book";

    if (isValidSchemaType(value)) {
      // TypeScript should know that value is SchemaType here
      const schemaType: SchemaType = value;
      expect(schemaType).toBe("Book");
    }
  });
});
