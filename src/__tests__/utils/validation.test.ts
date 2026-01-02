import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { CommonSchemas, PropsValidationError, safeValidateProps, validateProps } from "../../utils/validation";

describe("validation", () => {
  describe("validateProps", () => {
    it("should validate correct props", () => {
      const schema = z.object({
        title: z.string(),
        count: z.number(),
      });

      const props = { title: "Test", count: 5 };
      const result = validateProps(schema, props, "TestComponent");

      expect(result).toEqual(props);
    });

    it("should throw PropsValidationError for invalid props", () => {
      const schema = z.object({
        title: z.string(),
        count: z.number(),
      });

      const props = { title: "Test", count: "invalid" };

      expect(() => validateProps(schema, props, "TestComponent")).toThrow(PropsValidationError);
    });

    it("should include component name in error", () => {
      const schema = z.object({
        title: z.string(),
      });

      const props = { title: 123 };

      try {
        validateProps(schema, props, "MyComponent");
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(PropsValidationError);
        expect((error as PropsValidationError).componentName).toBe("MyComponent");
        expect((error as Error).message).toContain("[MyComponent]");
      }
    });

    it("should include validation errors in error message", () => {
      const schema = z.object({
        title: z.string(),
        count: z.number(),
      });

      const props = { title: 123, count: "wrong" };

      try {
        validateProps(schema, props, "TestComponent");
        expect.fail("Should have thrown");
      } catch (error) {
        expect((error as Error).message).toContain("title");
        expect((error as Error).message).toContain("count");
      }
    });

    it("should handle nested object validation", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          age: z.number(),
        }),
      });

      const props = { user: { name: "John", age: 30 } };
      const result = validateProps(schema, props, "TestComponent");

      expect(result).toEqual(props);
    });

    it("should apply default values from schema", () => {
      const schema = z.object({
        title: z.string(),
        optional: z.boolean().optional().default(false),
      });

      const props = { title: "Test" };
      const result = validateProps(schema, props, "TestComponent");

      expect(result).toEqual({ title: "Test", optional: false });
    });
  });

  describe("safeValidateProps", () => {
    it("should return validated props on success", () => {
      const schema = z.object({
        title: z.string(),
      });

      const props = { title: "Test" };
      const defaultValue = { title: "Default" };

      const result = safeValidateProps(schema, props, defaultValue, "TestComponent");

      expect(result).toEqual(props);
    });

    it("should return default value on validation failure", () => {
      const schema = z.object({
        title: z.string(),
      });

      const props = { title: 123 };
      const defaultValue = { title: "Default" };

      const result = safeValidateProps(schema, props, defaultValue, "TestComponent");

      expect(result).toEqual(defaultValue);
    });

    it("should log warning in dev mode on validation failure", () => {
      const schema = z.object({
        title: z.string(),
      });

      const props = { title: 123 };
      const defaultValue = { title: "Default" };

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      safeValidateProps(schema, props, defaultValue, "TestComponent");

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain("[TestComponent]");

      consoleSpy.mockRestore();
    });

    it("should not throw on validation failure", () => {
      const schema = z.object({
        title: z.string(),
      });

      const props = { title: 123 };
      const defaultValue = { title: "Default" };

      expect(() => {
        safeValidateProps(schema, props, defaultValue, "TestComponent");
      }).not.toThrow();
    });
  });

  describe("CommonSchemas", () => {
    it("language schema should accept es and en", () => {
      expect(CommonSchemas.language.safeParse("es").success).toBe(true);
      expect(CommonSchemas.language.safeParse("en").success).toBe(true);
      expect(CommonSchemas.language.safeParse("fr").success).toBe(false);
    });

    it("nonEmptyString should reject empty strings", () => {
      expect(CommonSchemas.nonEmptyString.safeParse("test").success).toBe(true);
      expect(CommonSchemas.nonEmptyString.safeParse("").success).toBe(false);
    });

    it("positiveInt should accept positive integers", () => {
      expect(CommonSchemas.positiveInt.safeParse(5).success).toBe(true);
      expect(CommonSchemas.positiveInt.safeParse(0).success).toBe(false);
      expect(CommonSchemas.positiveInt.safeParse(-5).success).toBe(false);
      expect(CommonSchemas.positiveInt.safeParse(5.5).success).toBe(false);
    });

    it("url schema should validate URLs", () => {
      expect(CommonSchemas.url.safeParse("https://example.com").success).toBe(true);
      expect(CommonSchemas.url.safeParse("not-a-url").success).toBe(false);
    });

    it("slug schema should validate slug format", () => {
      expect(CommonSchemas.slug.safeParse("valid-slug").success).toBe(true);
      expect(CommonSchemas.slug.safeParse("valid-slug-123").success).toBe(true);
      expect(CommonSchemas.slug.safeParse("Invalid Slug").success).toBe(false);
      expect(CommonSchemas.slug.safeParse("invalid_slug").success).toBe(false);
      expect(CommonSchemas.slug.safeParse("").success).toBe(false);
    });

    it("dateString should validate YYYY-MM-DD format", () => {
      expect(CommonSchemas.dateString.safeParse("2024-01-15").success).toBe(true);
      expect(CommonSchemas.dateString.safeParse("2024-1-15").success).toBe(false);
      expect(CommonSchemas.dateString.safeParse("15-01-2024").success).toBe(false);
    });

    it("optionalBoolean should default to false", () => {
      const result = CommonSchemas.optionalBoolean.parse(undefined);
      expect(result).toBe(false);
    });

    it("nonEmptyArray should reject empty arrays", () => {
      const schema = CommonSchemas.nonEmptyArray(z.string());
      expect(schema.safeParse(["item"]).success).toBe(true);
      expect(schema.safeParse([]).success).toBe(false);
    });

    it("nonEmptyArray should validate array items", () => {
      const schema = CommonSchemas.nonEmptyArray(z.number());
      expect(schema.safeParse([1, 2, 3]).success).toBe(true);
      expect(schema.safeParse(["1", "2"]).success).toBe(false);
    });
  });

  describe("PropsValidationError", () => {
    it("should format error message with component name", () => {
      const errors: z.ZodIssue[] = [
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["title"],
          message: "Expected string, received number",
        },
      ];

      const error = new PropsValidationError("TestComponent", errors);

      expect(error.message).toContain("[TestComponent]");
      expect(error.message).toContain("title");
      expect(error.message).toContain("Expected string, received number");
    });

    it("should include multiple errors", () => {
      const errors: z.ZodIssue[] = [
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["title"],
          message: "Expected string",
        },
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          path: ["count"],
          message: "Expected number",
        },
      ];

      const error = new PropsValidationError("TestComponent", errors);

      expect(error.message).toContain("title");
      expect(error.message).toContain("count");
    });

    it("should have correct error name", () => {
      const error = new PropsValidationError("Test", []);
      expect(error.name).toBe("PropsValidationError");
    });
  });
});
