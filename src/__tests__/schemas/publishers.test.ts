import { describe, expect, it } from "vitest";

import { publishersSchema } from "@/schemas/blog";

describe("Publishers Collection Schema", () => {
  const basePublisher = {
    name: "Penguin Random House",
    publisher_slug: "penguin-random-house",
    language: "en",
  };

  describe("Valid publishers", () => {
    it("should validate minimal publisher", () => {
      expect(() => publishersSchema.parse(basePublisher)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    it("should require name", () => {
      const { name: _name, ...rest } = basePublisher;
      expect(() => publishersSchema.parse(rest)).toThrow();
    });

    it("should require publisher_slug", () => {
      const { publisher_slug: _publisher_slug, ...rest } = basePublisher;
      expect(() => publishersSchema.parse(rest)).toThrow();
    });

    it("should require language", () => {
      const { language: _language, ...rest } = basePublisher;
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
  });

  describe("Optional fields", () => {
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
          language: "es",
        }),
      ).not.toThrow();
    });

    it("should validate Alfaguara", () => {
      expect(() =>
        publishersSchema.parse({
          name: "Alfaguara",
          publisher_slug: "alfaguara",
          language: "es",
        }),
      ).not.toThrow();
    });
  });
});
