/**
 * Runtime Prop Validation Utilities
 *
 * Provides runtime validation for Astro component props using Zod schemas.
 * This adds an additional layer of type safety beyond TypeScript's compile-time checks.
 *
 * **Why Runtime Validation?**
 * - TypeScript only validates types at compile time
 * - Props can be incorrect if passed dynamically or from external sources
 * - Catches errors early with clear messages
 * - Provides better developer experience
 *
 * **Usage:**
 * ```astro
 * ---
 * import { z } from 'zod';
 * import { validateProps } from '@/utils/validation';
 *
 * const PropsSchema = z.object({
 *   lang: z.enum(['es', 'en']),
 *   posts: z.array(z.any()).min(1),
 *   showOrderBadges: z.boolean().optional().default(false),
 * });
 *
 * type Props = z.infer<typeof PropsSchema>;
 *
 * const props = validateProps(PropsSchema, Astro.props, 'PostList');
 * const { posts, lang, showOrderBadges } = props;
 * ---
 * ```
 *
 * @module utils/validation
 */

import { z } from "zod";

import { PropsValidationError } from "@/utils/errors";

/**
 * PropsValidationError moved to @/utils/errors for centralization
 * Re-exported here for backward compatibility
 */
export { PropsValidationError } from "@/utils/errors";

/**
 * Validates component props against a Zod schema
 *
 * @template T - Zod schema type
 * @param schema - Zod schema to validate against
 * @param props - Props object to validate
 * @param componentName - Name of component (for error messages)
 * @returns Validated and typed props
 * @throws {PropsValidationError} If validation fails
 *
 * @example
 * ```typescript
 * const PropsSchema = z.object({
 *   title: z.string().min(1),
 *   count: z.number().positive(),
 * });
 *
 * const validatedProps = validateProps(PropsSchema, Astro.props, 'MyComponent');
 * ```
 */
export function validateProps<T extends z.ZodType>(schema: T, props: unknown, componentName: string): z.infer<T> {
  const result = schema.safeParse(props);

  if (!result.success) {
    throw new PropsValidationError(componentName, result.error.issues);
  }

  return result.data;
}

/**
 * Validates props and returns default value on error (non-throwing version)
 *
 * Useful when you want to gracefully handle validation errors instead of
 * throwing exceptions. Returns the default value if validation fails.
 *
 * @template T - Zod schema type
 * @param schema - Zod schema to validate against
 * @param props - Props object to validate
 * @param defaultValue - Value to return if validation fails
 * @param componentName - Name of component (for logging)
 * @returns Validated props or default value
 *
 * @example
 * ```typescript
 * const props = safeValidateProps(
 *   PropsSchema,
 *   Astro.props,
 *   { title: 'Default', count: 0 },
 *   'MyComponent'
 * );
 * ```
 */
export function safeValidateProps<T extends z.ZodType>(
  schema: T,
  props: unknown,
  defaultValue: z.infer<T>,
  componentName: string,
): z.infer<T> {
  const result = schema.safeParse(props);

  if (!result.success) {
    // Check if in dev mode (works in both Astro and test environments)
    // In Astro: import.meta.env.DEV is available
    // In tests (Vitest): import.meta.env.DEV should be true via vitest.config define
    // In Node/Bun: import.meta.env may not have DEV, so we default to true for warnings
    const isDev =
      (typeof import.meta !== "undefined" && import.meta.env?.DEV) ||
      (typeof import.meta !== "undefined" &&
        import.meta.env?.DEV !== false &&
        typeof import.meta.env?.PROD === "undefined");

    if (isDev) {
      console.warn(
        `[${componentName}] Invalid props (using defaults):`,
        result.error.issues.map((err) => `${err.path.join(".")}: ${err.message}`),
      );
    }
    return defaultValue;
  }

  return result.data;
}

/**
 * Common Zod schemas for reuse across components
 */
export const CommonSchemas = {
  /**
   * Language code (es or en)
   */
  language: z.enum(["es", "en"]),

  /**
   * Non-empty string
   */
  nonEmptyString: z.string().min(1, "String cannot be empty"),

  /**
   * Positive integer
   */
  positiveInt: z.number().int().positive(),

  /**
   * URL string
   */
  url: z.string().url(),

  /**
   * Slug (lowercase, hyphens, no spaces)
   */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .min(1),

  /**
   * Date string in YYYY-MM-DD format
   */
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),

  /**
   * Optional boolean with default false
   */
  optionalBoolean: z.boolean().optional().default(false),

  /**
   * Array that must have at least one item
   */
  nonEmptyArray: <T extends z.ZodTypeAny>(itemSchema: T) => z.array(itemSchema).min(1, "Array cannot be empty"),
} as const;
