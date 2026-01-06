import { describe, expect, it } from "vitest";

import { seriesSchema, challengesSchema, coursesSchema, genresSchema } from "@/schemas/blog";

describe("Series Collection Schema", () => {
  const baseSeries = {
    name: "Fjällbacka Series",
    series_slug: "fjallbacka",
    language: "en",
  };

  it("should validate complete series", () => {
    expect(() =>
      seriesSchema.parse({
        ...baseSeries,
        description: "Crime novels set in Fjällbacka",
        author: "camilla-lackberg",
      }),
    ).not.toThrow();
  });

  it("should validate minimal series", () => {
    expect(() => seriesSchema.parse(baseSeries)).not.toThrow();
  });

  it("should require name, series_slug, and language", () => {
    expect(() => seriesSchema.parse({ name: "Test", series_slug: "test" })).toThrow();
    expect(() => seriesSchema.parse({ name: "Test", language: "es" })).toThrow();
    expect(() => seriesSchema.parse({ series_slug: "test", language: "es" })).toThrow();
  });
});

describe("Challenges Collection Schema", () => {
  const baseChallenge = {
    name: "Stephen King Challenge",
    challenge_slug: "stephen-king-challenge",
    language: "en",
  };

  it("should validate minimal challenge", () => {
    expect(() => challengesSchema.parse(baseChallenge)).not.toThrow();
  });
});

describe("Courses Collection Schema", () => {
  const baseCourse = {
    name: "React Fundamentals",
    course_slug: "react-fundamentals",
    language: "en",
  };

  it("should validate complete course", () => {
    expect(() =>
      coursesSchema.parse({
        ...baseCourse,
        description: "Learn React from scratch",
      }),
    ).not.toThrow();
  });

  it("should validate minimal course", () => {
    expect(() => coursesSchema.parse(baseCourse)).not.toThrow();
  });
});

describe("Genres Collection Schema", () => {
  const baseGenre = {
    name: "Horror",
    genre_slug: "horror",
    language: "en",
  };

  it("should validate minimal genre", () => {
    expect(() => genresSchema.parse(baseGenre)).not.toThrow();
  });
});
