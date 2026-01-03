/**
 * Centralized Custom Error Classes
 *
 * All application-specific error types in a single module for better
 * organization, reusability, and maintainability.
 *
 * @module utils/errors
 */

import type { z } from "zod";

// ============================================================================
// ROUTING ERRORS
// ============================================================================

/**
 * Error thrown when route parsing fails
 *
 * Used in: src/utils/routing/parser.ts
 *
 * @example
 * ```typescript
 * throw new RouteParseError(
 *   "Invalid content type: xyz",
 *   "en",
 *   "/en/xyz/something",
 *   ["xyz", "something"]
 * );
 * ```
 */
export class RouteParseError extends Error {
  constructor(
    message: string,
    public readonly lang: string,
    public readonly path: string,
    public readonly segments: string[],
  ) {
    super(message);
    this.name = "RouteParseError";
  }
}

/**
 * Error thrown when template is not found for a given content type and page type
 *
 * Used in: src/config/templateMap.ts
 *
 * @example
 * ```typescript
 * throw new TemplateNotFoundError("books", "rss");
 * // Error: No template found for contentType="books" and pageType="rss"
 * ```
 */
export class TemplateNotFoundError extends Error {
  constructor(
    public readonly contentType: string,
    public readonly pageType: string,
  ) {
    super(`No template found for contentType="${contentType}" and pageType="${pageType}"`);
    this.name = "TemplateNotFoundError";
  }
}

// ============================================================================
// VALIDATION ERRORS
// ============================================================================

/**
 * Error thrown when component props fail Zod validation
 *
 * Used in: src/utils/validation.ts
 *
 * @example
 * ```typescript
 * throw new PropsValidationError("PostList", [
 *   { path: ["lang"], message: "Invalid enum value" },
 *   { path: ["posts"], message: "Required" },
 * ]);
 * ```
 */
export class PropsValidationError extends Error {
  constructor(
    public readonly componentName: string,
    public readonly errors: z.ZodIssue[],
  ) {
    const errorMessages = errors?.length
      ? errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n")
      : "  - Unknown validation error";

    super(`[${componentName}] Invalid props:\n${errorMessages}`);
    this.name = "PropsValidationError";
  }
}

// ============================================================================
// ASSET ERRORS
// ============================================================================

/**
 * Error thrown when a static image is not found in the build
 *
 * Used in: src/utils/imageImports.ts
 *
 * In strict mode (CI), this error is thrown instead of falling back to defaults.
 * In development, a warning is logged and a default image is used.
 *
 * @example
 * ```typescript
 * throw new ImageNotFoundError(
 *   "books/non-existent-book.jpg",
 *   "book-cover"
 * );
 * // Error: [ImageNotFound] book-cover: books/non-existent-book.jpg
 * ```
 */
export class ImageNotFoundError extends Error {
  constructor(
    public readonly imagePath: string,
    public readonly imageType: "book-cover" | "author-picture" | "tutorial-cover" | "post-cover",
  ) {
    super(`[ImageNotFound] ${imageType}: ${imagePath}`);
    this.name = "ImageNotFoundError";
  }
}
