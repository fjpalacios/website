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

  it("should validate complete challenge", () => {
    expect(() =>
      challengesSchema.parse({
        ...baseChallenge,
        description: "Read all Stephen King books",
        start_date: new Date("2024-01-01"),
        end_date: new Date("2024-12-31"),
        goal: 10,
      }),
    ).not.toThrow();
  });

  it("should validate minimal challenge", () => {
    expect(() => challengesSchema.parse(baseChallenge)).not.toThrow();
  });

  it("should coerce string dates", () => {
    const parsed = challengesSchema.parse({
      ...baseChallenge,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    });
    expect(parsed.start_date).toBeInstanceOf(Date);
    expect(parsed.end_date).toBeInstanceOf(Date);
  });

  it("should reject negative goal", () => {
    expect(() => challengesSchema.parse({ ...baseChallenge, goal: -1 })).toThrow();
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
        difficulty: "beginner",
        duration: 120,
      }),
    ).not.toThrow();
  });

  it("should validate minimal course", () => {
    expect(() => coursesSchema.parse(baseCourse)).not.toThrow();
  });

  it("should accept all difficulty levels", () => {
    expect(() => coursesSchema.parse({ ...baseCourse, difficulty: "beginner" })).not.toThrow();
    expect(() => coursesSchema.parse({ ...baseCourse, difficulty: "intermediate" })).not.toThrow();
    expect(() => coursesSchema.parse({ ...baseCourse, difficulty: "advanced" })).not.toThrow();
  });

  it("should reject invalid difficulty", () => {
    expect(() => coursesSchema.parse({ ...baseCourse, difficulty: "expert" })).toThrow();
  });

  it("should reject negative duration", () => {
    expect(() => coursesSchema.parse({ ...baseCourse, duration: -10 })).toThrow();
  });
});

describe("Genres Collection Schema", () => {
  const baseGenre = {
    name: "Horror",
    genre_slug: "horror",
    language: "en",
  };

  it("should validate complete genre", () => {
    expect(() =>
      genresSchema.parse({
        ...baseGenre,
        description: "Horror fiction",
        parent: "fiction",
      }),
    ).not.toThrow();
  });

  it("should validate minimal genre", () => {
    expect(() => genresSchema.parse(baseGenre)).not.toThrow();
  });

  it("should accept parent for hierarchical structure", () => {
    expect(() => genresSchema.parse({ ...baseGenre, parent: "fiction" })).not.toThrow();
  });

  it("should validate nested genre structure", () => {
    // fiction > horror > supernatural
    expect(() =>
      genresSchema.parse({
        name: "Supernatural Horror",
        genre_slug: "supernatural-horror",
        language: "en",
        parent: "horror",
      }),
    ).not.toThrow();
  });
});
