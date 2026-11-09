/**
 * Helper utilities for the CourseLink and LessonLink components.
 *
 * Both components exist so a cross-reference in a tutorial only renders as a
 * link when the thing it points at exists. A course that has not been written
 * yet, or a lesson that has not been published, must leave the sentence
 * readable instead of shipping a dead link.
 *
 * The decision lives in two steps: resolve the target against the content
 * collection, then pick which of the two texts the author wrote applies.
 */

import type { LanguageKey } from "@/types";

/** Minimal shape of a course entry, enough to resolve it. */
export interface CourseLike {
  data: {
    course_slug: string;
    language: string;
    name?: string;
  };
}

/** Minimal shape of a tutorial entry, enough to resolve it. */
export interface LessonLike {
  data: {
    post_slug: string;
    language: string;
    course?: string;
    order?: number;
  };
}

/** What a component needs in order to render: an optional href and the text. */
export interface ConditionalLink {
  /** URL to link to, or `null` when the target does not exist yet. */
  href: string | null;
  /** The text to render in either case. */
  text: string;
}

/**
 * Find a course by its language-specific slug.
 *
 * @example findCourse(courses, "domina-vim-desde-cero", "es")
 */
export const findCourse = <T extends CourseLike>(
  courses: readonly T[],
  slug: string,
  lang: LanguageKey,
): T | undefined => courses.find((course) => course.data.course_slug === slug && course.data.language === lang);

/**
 * Find a lesson by its course slug, lesson number and language.
 *
 * Order is unique per course, so the three fields together identify one entry.
 *
 * @example findLesson(tutorials, "domina-docker-desde-cero", 13, "es")
 */
export const findLesson = <T extends LessonLike>(
  lessons: readonly T[],
  courseSlug: string,
  order: number,
  lang: LanguageKey,
): T | undefined =>
  lessons.find(
    (lesson) => lesson.data.course === courseSlug && lesson.data.order === order && lesson.data.language === lang,
  );

/**
 * Decide the text to render and whether it becomes a link.
 *
 * The author writes two sentences on purpose: `linked` promises a destination,
 * `plain` stands on its own when there is none. Each falls back to the other so
 * a missing prop degrades instead of breaking the paragraph.
 */
export const resolveConditionalLink = (href: string | undefined, linked?: string, plain?: string): ConditionalLink => ({
  href: href ?? null,
  text: href ? (linked ?? plain ?? "") : (plain ?? linked ?? ""),
});
