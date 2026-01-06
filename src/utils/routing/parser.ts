/**
 * Route Parser and Matcher
 * Phase 3: Unified i18n Routing System
 *
 * Parses URL paths and matches them to content types and page types.
 * Core logic for the unified routing system.
 *
 * @see src/config/unified-routing.ts
 * @see docs/PHASE_3_UNIFIED_ROUTING.md
 */

import {
  getContentTypeConfig,
  getSpecialSegment,
  parseRouteSegment,
  type ContentTypeConfig,
  type PageType,
} from "@/config/unified-routing";
import { safeValidateParsedRoute, type ValidatedParsedRoute } from "@/config/unified-routing-schema";
import { RouteParseError } from "@/utils/errors";
import type { Language } from "@/utils/routes";

import { routingLogger } from "../logger";

/**
 * Parsed route result
 */
export interface ParsedRoute {
  /** Language code */
  lang: Language;

  /** Content type ID (e.g., "books", "authors") */
  contentTypeId: string;

  /** Content type configuration */
  config: ContentTypeConfig;

  /** Page type (list, detail, pagination, rss) */
  pageType: PageType;

  /** Content slug (for detail pages) */
  slug?: string;

  /** Page number (for pagination) */
  pageNumber?: number;

  /** All route segments (for debugging) */
  segments: string[];
}

// RouteParseError moved to @/utils/errors for centralization
export { RouteParseError } from "@/utils/errors";

/**
 * Parse a route path into structured data
 *
 * @param lang - Language code from URL
 * @param routePath - Route path without language (e.g., "books/my-book")
 * @returns Parsed route object
 * @throws {RouteParseError} If route cannot be parsed
 *
 * @example
 * parseRoute("es", "libros") // { pageType: "list", contentTypeId: "books", ... }
 * parseRoute("es", "libros/my-book") // { pageType: "detail", slug: "my-book", ... }
 * parseRoute("es", "libros/pagina/2") // { pageType: "pagination", pageNumber: 2, ... }
 * parseRoute("en", "books/rss.xml") // { pageType: "rss", ... }
 */
export function parseRoute(lang: Language, routePath: string | undefined): ParsedRoute {
  // Handle empty route (should not happen in normal usage)
  if (!routePath) {
    throw new RouteParseError("Empty route path", lang, "", []);
  }

  // Split path into segments
  const segments = routePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    throw new RouteParseError("No route segments found", lang, routePath, segments);
  }

  // First segment should be a content type
  const firstSegment = segments[0];

  // Check if it's a content type
  const config = parseRouteSegment(lang, firstSegment);

  if (!config) {
    throw new RouteParseError(`Unknown content type: "${firstSegment}"`, lang, routePath, segments);
  }

  // Now determine page type based on remaining segments
  if (segments.length === 1) {
    // Just content type → LIST page
    // e.g., /es/libros → books list
    return {
      lang,
      contentTypeId: config.id,
      config,
      pageType: "list",
      segments,
    };
  }

  // Check second segment
  const secondSegment = segments[1];

  // Check for RSS feed
  if (secondSegment === "rss.xml") {
    if (!config.features.hasRSS) {
      throw new RouteParseError(`RSS not enabled for content type: ${config.id}`, lang, routePath, segments);
    }

    return {
      lang,
      contentTypeId: config.id,
      config,
      pageType: "rss",
      segments,
    };
  }

  // Check for pagination segment
  const pageSegment = getSpecialSegment("page", lang);
  if (secondSegment === pageSegment) {
    // Pagination page
    // e.g., /es/libros/pagina/2 → books pagination page 2

    if (!config.features.hasPagination) {
      throw new RouteParseError(`Pagination not enabled for content type: ${config.id}`, lang, routePath, segments);
    }

    if (segments.length !== 3) {
      throw new RouteParseError(
        `Invalid pagination path: expected "/{content}/{page}/{number}"`,
        lang,
        routePath,
        segments,
      );
    }

    const pageNumber = parseInt(segments[2], 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new RouteParseError(`Invalid page number: "${segments[2]}"`, lang, routePath, segments);
    }

    return {
      lang,
      contentTypeId: config.id,
      config,
      pageType: "pagination",
      pageNumber,
      segments,
    };
  }

  // Otherwise, second segment is a slug → DETAIL page
  // e.g., /es/libros/apocalipsis-stephen-king → book detail
  if (segments.length === 2) {
    const slug = secondSegment;

    return {
      lang,
      contentTypeId: config.id,
      config,
      pageType: "detail",
      slug,
      segments,
    };
  }

  // More than 2 segments and not pagination → error
  throw new RouteParseError(`Invalid route structure: too many segments`, lang, routePath, segments);
}

/**
 * Safe version of parseRoute that returns null on error instead of throwing
 *
 * @param lang - Language code
 * @param routePath - Route path
 * @returns Parsed route or null if parsing fails
 */
export function safeParseRoute(lang: Language, routePath: string | undefined): ParsedRoute | null {
  try {
    return parseRoute(lang, routePath);
  } catch (error) {
    if (error instanceof RouteParseError) {
      routingLogger.warn(`Failed to parse route: ${error.message}`, {
        lang: error.lang,
        path: error.path,
        segments: error.segments,
      });
      return null;
    }
    // Re-throw unexpected errors
    throw error;
  }
}

/**
 * Validate a parsed route using Zod schema
 *
 * @param parsed - Parsed route object
 * @returns Validated parsed route
 * @throws {z.ZodError} If validation fails
 */
export function validateParsedRoute(parsed: ParsedRoute): ValidatedParsedRoute {
  const result = safeValidateParsedRoute(parsed);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
    throw new Error(`Parsed route validation failed: ${issues}`);
  }

  return result.data;
}

/**
 * Build a route path from parsed route components
 *
 * @param lang - Language code
 * @param contentTypeId - Content type ID
 * @param pageType - Page type
 * @param options - Additional options (slug, pageNumber)
 * @returns Built route path
 *
 * @example
 * buildRoute("es", "books", "list") // "libros"
 * buildRoute("es", "books", "detail", { slug: "my-book" }) // "libros/my-book"
 * buildRoute("es", "books", "pagination", { pageNumber: 2 }) // "libros/pagina/2"
 */
export function buildRoute(
  lang: Language,
  contentTypeId: string,
  pageType: PageType,
  options?: {
    slug?: string;
    pageNumber?: number;
  },
): string {
  const config = getContentTypeConfig(contentTypeId);

  if (!config) {
    throw new Error(`Unknown content type: ${contentTypeId}`);
  }

  const baseSegment = config.routeSegments[lang];
  const segments: string[] = [baseSegment];

  switch (pageType) {
    case "list":
      // Just base segment
      break;

    case "detail":
      if (!options?.slug) {
        throw new Error(`Slug required for detail page type`);
      }
      segments.push(options.slug);
      break;

    case "pagination": {
      if (!options?.pageNumber) {
        throw new Error(`Page number required for pagination page type`);
      }
      if (!config.features.hasPagination) {
        throw new Error(`Pagination not enabled for ${contentTypeId}`);
      }
      const pageSegment = getSpecialSegment("page", lang);
      segments.push(pageSegment, String(options.pageNumber));
      break;
    }

    case "rss":
      if (!config.features.hasRSS) {
        throw new Error(`RSS not enabled for ${contentTypeId}`);
      }
      segments.push("rss.xml");
      break;

    default:
      throw new Error(`Unsupported page type: ${pageType}`);
  }

  return segments.join("/");
}

/**
 * Match a route against a pattern
 * Useful for checking if current route matches a specific pattern
 *
 * @param parsed - Parsed route
 * @param pattern - Pattern to match against
 * @returns True if route matches pattern
 *
 * @example
 * matchRoute(parsed, { contentTypeId: "books", pageType: "list" }) // true if books list
 * matchRoute(parsed, { contentTypeId: "books" }) // true for any books page
 * matchRoute(parsed, { pageType: "detail" }) // true for any detail page
 */
export function matchRoute(
  parsed: ParsedRoute,
  pattern: {
    lang?: Language;
    contentTypeId?: string;
    pageType?: PageType;
  },
): boolean {
  if (pattern.lang && parsed.lang !== pattern.lang) {
    return false;
  }

  if (pattern.contentTypeId && parsed.contentTypeId !== pattern.contentTypeId) {
    return false;
  }

  if (pattern.pageType && parsed.pageType !== pattern.pageType) {
    return false;
  }

  return true;
}

/**
 * Get all possible routes for a content type
 * Useful for generating sitemaps, navigation, etc.
 *
 * @param lang - Language code
 * @param contentTypeId - Content type ID
 * @returns Array of all possible route patterns
 */
export function getContentTypeRoutes(lang: Language, contentTypeId: string): string[] {
  const config = getContentTypeConfig(contentTypeId);

  if (!config) {
    throw new Error(`Unknown content type: ${contentTypeId}`);
  }

  const routes: string[] = [];

  // List page (always exists)
  routes.push(buildRoute(lang, contentTypeId, "list"));

  // Pagination pages (if enabled)
  if (config.features.hasPagination) {
    // Note: Actual page numbers would come from data
    // This is just the pattern
    const pageSegment = getSpecialSegment("page", lang);
    routes.push(`${config.routeSegments[lang]}/${pageSegment}/[page]`);
  }

  // Detail pages (if has collection)
  if (config.collection) {
    routes.push(`${config.routeSegments[lang]}/[slug]`);
  }

  // RSS feed (if enabled)
  if (config.features.hasRSS) {
    routes.push(buildRoute(lang, contentTypeId, "rss"));
  }

  return routes;
}

/**
 * Debug helper: Format parsed route for logging
 *
 * @param parsed - Parsed route
 * @returns Formatted string for logging
 */
export function formatParsedRoute(parsed: ParsedRoute): string {
  const parts: string[] = [`[${parsed.lang}]`, parsed.contentTypeId, `(${parsed.pageType})`];

  if (parsed.slug) {
    parts.push(`slug="${parsed.slug}"`);
  }

  if (parsed.pageNumber) {
    parts.push(`page=${parsed.pageNumber}`);
  }

  return parts.join(" ");
}
