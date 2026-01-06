import { contact as contactEN } from "@content/en/contact";
import { contact as contactES } from "@content/es/contact";
import { getContact } from "@utils/content/contact";
import { describe, expect, test } from "vitest";

describe("contact utils", () => {
  describe("getContact", () => {
    test("should return Spanish contact data when lang is 'es'", () => {
      const result = getContact("es");

      expect(result).toBeDefined();
      expect(result).toEqual(contactES);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test("should return English contact data when lang is 'en'", () => {
      const result = getContact("en");

      expect(result).toBeDefined();
      expect(result).toEqual(contactEN);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test("should return same structure for both languages", () => {
      const resultES = getContact("es");
      const resultEN = getContact("en");

      // Both should have the same number of items
      expect(resultES.length).toBe(resultEN.length);

      // Both should have the same properties in each item
      resultES.forEach((item, index) => {
        expect(resultEN[index]).toHaveProperty("name");
        expect(resultEN[index]).toHaveProperty("link");
        expect(resultEN[index]).toHaveProperty("icon");
        expect(resultEN[index]).toHaveProperty("text");
      });
    });

    test("should return ContactItem[] type with correct properties", () => {
      const result = getContact("es");

      result.forEach((item) => {
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("link");
        expect(item).toHaveProperty("icon");
        expect(item).toHaveProperty("text");

        expect(typeof item.name).toBe("string");
        expect(typeof item.link).toBe("string");
        expect(typeof item.icon).toBe("string");
        expect(typeof item.text).toBe("string");

        // Validate link format (should be URL or mailto or tel)
        expect(item.link.startsWith("http") || item.link.startsWith("mailto:") || item.link.startsWith("tel:")).toBe(
          true,
        );
      });
    });

    test("should include expected contact methods", () => {
      const resultES = getContact("es");
      const resultEN = getContact("en");

      // Check that common contact methods exist
      const esNames = resultES.map((c) => c.name.toLowerCase());
      const enNames = resultEN.map((c) => c.name.toLowerCase());

      // Should include email
      expect(esNames.some((name) => name.includes("correo") || name.includes("email"))).toBe(true);
      expect(enNames.some((name) => name.includes("email"))).toBe(true);

      // Should include GitHub
      expect(esNames.some((name) => name.includes("github"))).toBe(true);
      expect(enNames.some((name) => name.includes("github"))).toBe(true);
    });

    test("should be immutable - returning new array each time", () => {
      const result1 = getContact("es");
      const result2 = getContact("es");

      // Should be equal but not the same reference
      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2); // Different references
    });

    test("should handle repeated calls efficiently", () => {
      // Call multiple times to ensure no side effects
      const results = Array.from({ length: 10 }, () => getContact("es"));

      // All results should be equal
      results.forEach((result) => {
        expect(result).toEqual(results[0]);
      });
    });
  });
});
