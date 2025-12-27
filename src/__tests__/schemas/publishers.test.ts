import { describe, expect, it } from "vitest";

import { publishersSchema } from "@/schemas/blog";

describe("Publishers Collection Schema", () => {
  const basePublisher = {
    name: "Penguin Random House",
    publisher_slug: "penguin-random-house",
    language: "en",
  };

  describe("Valid publishers", () => {
    it("should validate complete publisher", () => {
      expect(() =>
        publishersSchema.parse({
          ...basePublisher,
          description: "Major publishing house",
          website: "https://penguinrandomhouse.com",
          country: "United States",
        }),
      ).not.toThrow();
    });

    it("should validate minimal publisher", () => {
      expect(() => publishersSchema.parse(basePublisher)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    it("should require name", () => {
      const { name, ...rest } = basePublisher;
      expect(() => publishersSchema.parse(rest)).toThrow();
    });

    it("should require publisher_slug", () => {
      const { publisher_slug, ...rest } = basePublisher;
      expect(() => publishersSchema.parse(rest)).toThrow();
    });

    it("should require language", () => {
      const { language, ...rest } = basePublisher;
      expect(() => publishersSchema.parse(rest)).toThrow();
    });
  });

  describe("Field validation", () => {
    it("should reject empty name", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, name: "" })).toThrow();
    });

    it("should reject invalid language", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, language: "fr" })).toThrow();
    });

    it("should reject invalid website URL", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, website: "not-a-url" })).toThrow();
    });
  });

  describe("Optional fields", () => {
    it("should accept description", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, description: "A publisher" })).not.toThrow();
    });

    it("should accept website", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, website: "https://example.com" })).not.toThrow();
    });

    it("should accept country", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, country: "Spain" })).not.toThrow();
    });

    it("should accept i18n", () => {
      expect(() => publishersSchema.parse({ ...basePublisher, i18n: "publisher-es" })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate Debolsillo", () => {
      expect(() =>
        publishersSchema.parse({
          name: "Debolsillo",
          publisher_slug: "debolsillo",
          description: "Editorial española de libros de bolsillo",
          language: "es",
          country: "España",
        }),
      ).not.toThrow();
    });

    it("should validate Alfaguara", () => {
      expect(() =>
        publishersSchema.parse({
          name: "Alfaguara",
          publisher_slug: "alfaguara",
          description: "Editorial de literatura en español",
          website: "https://alfaguara.com",
          language: "es",
          country: "España",
        }),
      ).not.toThrow();
    });
  });
});
