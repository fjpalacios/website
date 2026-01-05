/**
 * Route Configuration Validation Schemas
 * Phase 3: Unified i18n Routing System
 *
 * Provides runtime validation for route configuration using Zod schemas.
 * Ensures type safety and catches configuration errors at build time.
 *
 * @see src/config/unified-routing.ts
 */

import { z } from "zod";

import type { LanguageKey } from "@/types";

/**
 * Language schema
 */
export const LanguageSchema = z.enum(["es", "en"]);

/**
 * Page type schema
 */
export const PageTypeSchema = z.enum(["list", "detail", "pagination", "rss", "static"]);

/**
 * Content category schema
 */
export const ContentCategorySchema = z.enum(["content", "taxonomy", "static"]);

/**
 * Template name schema
 */
export const TemplateNameSchema = z.enum([
  "ContentList",
  "ContentDetail",
  "ContentPagination",
  "TaxonomyList",
  "TaxonomyDetail",
  "StaticPage",
  "RSSFeed",
]);

/**
 * Collection name schema
 */
export const CollectionNameSchema = z.enum([
  "books",
  "tutorials",
  "posts",
  "authors",
  "publishers",
  "genres",
  "categories",
  "series",
  "challenges",
  "courses",
]);

/**
 * Route segments schema
 * Ensures both EN and ES segments are provided
 */
export const RouteSegmentsSchema = z.object({
  en: z.string().min(1, "EN route segment cannot be empty"),
  es: z.string().min(1, "ES route segment cannot be empty"),
});

/**
 * Templates schema
 * At least one template must be defined
 */
export const TemplatesSchema = z
  .object({
    list: TemplateNameSchema.optional(),
    detail: TemplateNameSchema.optional(),
    pagination: TemplateNameSchema.optional(),
    rss: TemplateNameSchema.optional(),
  })
  .refine((data) => Object.values(data).some((template) => template !== undefined), {
    message: "At least one template must be defined",
  });

/**
 * Features schema
 * Validates feature flags and their dependencies
 */
export const FeaturesSchema = z
  .object({
    hasPagination: z.boolean(),
    hasRSS: z.boolean(),
    itemsPerPage: z.number().int().positive().optional(),
    showRelated: z.boolean().optional(),
    searchable: z.boolean().optional(),
  })
  .refine((data) => !data.hasPagination || (data.hasPagination && data.itemsPerPage), {
    message: "itemsPerPage is required when hasPagination is true",
  });

/**
 * SEO schema
 */
export const SEOSchema = z.object({
  schemaType: z.string().min(1, "Schema type cannot be empty"),
  generateItemList: z.boolean(),
  descriptionKey: z.string().optional(),
});

/**
 * Data loaders schema
 */
export const DataLoadersSchema = z.object({
  getAll: z.string().optional(),
  getBySlug: z.string().optional(),
});

/**
 * Content Type Configuration schema
 * Main schema for validating content type configs
 */
export const ContentTypeConfigSchema = z
  .object({
    id: z.string().min(1, "ID cannot be empty"),
    category: ContentCategorySchema,
    collection: CollectionNameSchema.nullable(),
    routeSegments: RouteSegmentsSchema,
    templates: TemplatesSchema,
    features: FeaturesSchema,
    seo: SEOSchema,
    dataLoaders: DataLoadersSchema,
  })
  .refine((data) => data.category === "static" || data.collection !== null, {
    message: "Non-static content types must have a collection",
  })
  .refine((data) => !data.features.hasRSS || data.templates.rss !== undefined, {
    message: "RSS template is required when hasRSS is true",
  });

/**
 * Content Types Registry schema
 * Validates the entire CONTENT_TYPES object
 */
export const ContentTypesRegistrySchema = z.record(z.string(), ContentTypeConfigSchema);

/**
 * Special segments schema
 */
export const SpecialSegmentsSchema = z.record(z.string(), RouteSegmentsSchema);

/**
 * Route params schema (for URL parsing)
 */
export const RouteParamsSchema = z.object({
  lang: LanguageSchema,
  route: z.string().optional(),
});

/**
 * Parsed route schema (result of URL parsing)
 */
export const ParsedRouteSchema = z.object({
  lang: LanguageSchema,
  contentTypeId: z.string(),
  pageType: PageTypeSchema,
  slug: z.string().optional(),
  pageNumber: z.number().int().positive().optional(),
  segments: z.array(z.string()),
});

/**
 * Validation helper functions
 */

/**
 * Validate a single content type config
 *
 * @param config - Content type config to validate
 * @param id - Content type ID (for error messages)
 * @throws {z.ZodError} If validation fails
 */
export function validateContentTypeConfig(config: unknown, id: string): void {
  try {
    ContentTypeConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
      throw new Error(`Content type config validation failed for "${id}":\n${issues}`);
    }
    throw error;
  }
}

/**
 * Validate entire content types registry
 *
 * @param registry - Content types registry to validate
 * @throws {z.ZodError} If validation fails
 */
export function validateContentTypesRegistry(registry: unknown): void {
  try {
    ContentTypesRegistrySchema.parse(registry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
      throw new Error(`Content types registry validation failed:\n${issues}`);
    }
    throw error;
  }
}

/**
 * Validate route params from Astro
 *
 * @param params - Route params from Astro.params
 * @returns Validated and typed route params
 * @throws {z.ZodError} If validation fails
 */
export function validateRouteParams(params: unknown) {
  return RouteParamsSchema.parse(params);
}

/**
 * Validate parsed route
 *
 * @param route - Parsed route object
 * @returns Validated and typed parsed route
 * @throws {z.ZodError} If validation fails
 */
export function validateParsedRoute(route: unknown) {
  return ParsedRouteSchema.parse(route);
}

/**
 * Safe validation (returns result object instead of throwing)
 */

/**
 * Safely validate content type config
 *
 * @param config - Content type config to validate
 * @returns Validation result
 */
export function safeValidateContentTypeConfig(config: unknown) {
  return ContentTypeConfigSchema.safeParse(config);
}

/**
 * Safely validate route params
 *
 * @param params - Route params to validate
 * @returns Validation result
 */
export function safeValidateRouteParams(params: unknown) {
  return RouteParamsSchema.safeParse(params);
}

/**
 * Safely validate parsed route
 *
 * @param route - Parsed route to validate
 * @returns Validation result
 */
export function safeValidateParsedRoute(route: unknown) {
  return ParsedRouteSchema.safeParse(route);
}

/**
 * Type guards
 */

/**
 * Check if a value is a valid language
 *
 * @param value - Value to check
 * @returns True if value is a valid language
 */
export function isValidLanguage(value: unknown): value is LanguageKey {
  return LanguageSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid page type
 *
 * @param value - Value to check
 * @returns True if value is a valid page type
 */
export function isValidPageType(value: unknown): value is z.infer<typeof PageTypeSchema> {
  return PageTypeSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid content category
 *
 * @param value - Value to check
 * @returns True if value is a valid content category
 */
export function isValidContentCategory(value: unknown): value is z.infer<typeof ContentCategorySchema> {
  return ContentCategorySchema.safeParse(value).success;
}

/**
 * Type exports for convenience
 */
export type ValidatedRouteParams = z.infer<typeof RouteParamsSchema>;
export type ValidatedParsedRoute = z.infer<typeof ParsedRouteSchema>;
export type ValidatedContentTypeConfig = z.infer<typeof ContentTypeConfigSchema>;
