/**
 * Route Generators - Centralized Exports
 *
 * This module provides reusable route generators for different page types.
 * Used by the unified router in src/pages/[lang]/[...route].astro
 */

export { generateContentTypeWithPaginationRoutes } from "./contentTypeWithPagination";
export type { ContentTypeWithPaginationConfig } from "./contentTypeWithPagination";

export { generateTaxonomyRoutes } from "./taxonomy";
export type { TaxonomyGeneratorConfig } from "./taxonomy";

export { generateStaticPageRoute } from "./staticPage";
export type { StaticPageConfig } from "./staticPage";

export { generatePostsRoutes } from "./posts";
export type { PostsGeneratorConfig } from "./posts";

// Re-export common types
export type { GeneratedPath } from "./contentTypeWithPagination";
