import { describe, expect, it } from "vitest";

import { findCourse, findLesson, resolveConditionalLink } from "@/utils/courseLinkHelpers";

type CourseLike = { data: { course_slug: string; language: "es" | "en"; name: string } };
type LessonLike = {
  data: { post_slug: string; language: "es" | "en"; course?: string; order?: number };
};

const courses: CourseLike[] = [
  { data: { course_slug: "domina-git-desde-cero", language: "es", name: "Domina Git" } },
  { data: { course_slug: "mastering-git-from-scratch", language: "en", name: "Mastering Git" } },
];

const lessons: LessonLike[] = [
  { data: { post_slug: "que-es-git", language: "es", course: "domina-git-desde-cero", order: 1 } },
  {
    data: { post_slug: "what-is-git", language: "en", course: "mastering-git-from-scratch", order: 1 },
  },
  { data: { post_slug: "ramas-git", language: "es", course: "domina-git-desde-cero", order: 5 } },
];

describe("findCourse", () => {
  it("finds the course by slug and language", () => {
    expect(findCourse(courses, "domina-git-desde-cero", "es")?.data.name).toBe("Domina Git");
  });

  it("does not return the other language version of the same course", () => {
    expect(findCourse(courses, "domina-git-desde-cero", "en")).toBeUndefined();
  });

  it("returns undefined when the course does not exist", () => {
    expect(findCourse(courses, "domina-bash-desde-cero", "es")).toBeUndefined();
  });
});

describe("findLesson", () => {
  it("finds a lesson by course, order and language", () => {
    expect(findLesson(lessons, "domina-git-desde-cero", 5, "es")?.data.post_slug).toBe("ramas-git");
  });

  it("returns undefined when the order does not exist", () => {
    expect(findLesson(lessons, "domina-git-desde-cero", 99, "es")).toBeUndefined();
  });

  it("does not mix courses with the same order", () => {
    expect(findLesson(lessons, "mastering-git-from-scratch", 5, "en")).toBeUndefined();
  });
});

describe("resolveConditionalLink", () => {
  it("returns the href and the linked text when the target exists", () => {
    expect(resolveConditionalLink("https://example.test/es/cursos/x", "el curso", "más adelante")).toEqual({
      href: "https://example.test/es/cursos/x",
      text: "el curso",
    });
  });

  it("falls back to the plain text when the target exists but no linked text is given", () => {
    expect(resolveConditionalLink("https://example.test/es/cursos/x", undefined, "más adelante")).toEqual({
      href: "https://example.test/es/cursos/x",
      text: "más adelante",
    });
  });

  it("drops the link and keeps the plain text when the target does not exist", () => {
    expect(resolveConditionalLink(undefined, "el curso", "más adelante")).toEqual({
      href: null,
      text: "más adelante",
    });
  });

  it("degrades to the linked text without an href when no plain text is given", () => {
    expect(resolveConditionalLink(undefined, "el curso", undefined)).toEqual({
      href: null,
      text: "el curso",
    });
  });

  it("returns an empty text when neither text is given", () => {
    expect(resolveConditionalLink(undefined, undefined, undefined)).toEqual({ href: null, text: "" });
  });
});
