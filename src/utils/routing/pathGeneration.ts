/**
 * Path Generation Orchestrator
 *
 * This module orchestrates the generation of all static paths for the unified
 * dynamic router. It breaks down the complex path generation logic into focused,
 * manageable functions.
 *
 * Key Responsibilities:
 * - Coordinate parallel generation of independent content types
 * - Handle language-specific route generation
 * - Manage error handling and fallback strategies
 * - Integrate with performance monitoring
 *
 * Architecture:
 * - generateAllPaths: Main entry point (replaces getStaticPaths logic)
 * - generateLanguageRoutes: Generate all routes for a single language
 * - generateParallelRoutes: Coordinate parallel generation of content/taxonomies
 * - generateStaticRoutes: Handle static pages (about, feeds)
 * - buildGenerators: Build generator functions for content types and taxonomies
 *
 * @module utils/routing/pathGeneration
 */

import type { GetStaticPaths } from "astro";

// Configuration
import { CONTENT_TYPE_CONFIGS, TAXONOMY_TYPES } from "@/config/routeConfig";
import { getRouteSegment } from "@/config/routeSegments";

// Utilities
import { logCacheStats } from "@/utils/cache/buildCache";
import { getContact } from "@/utils/content/contact";
import type { ContactItem } from "@/utils/content/contact";
import { routingLogger } from "@/utils/logger";
import { performanceMonitor } from "@/utils/performance/monitor";
import {
  generateContentTypeWithPaginationRoutes,
  generateTaxonomyRoutes,
  generateStaticPageRoute,
  generatePostsRoutes,
  type GeneratedPath,
} from "@/utils/routeGenerators";
import { getLanguages } from "@/utils/routes";
import { TAXONOMY_CONFIGS } from "@/utils/taxonomyPages";

/**
 * Safe route generator wrapper with error handling
 *
 * Wraps a generator function to catch and log errors without breaking the entire build.
 * This allows the build to continue even if one content type fails to generate.
 *
 * @param generator - Function that generates routes
 * @param context - Description of what's being generated (for error messages)
 * @returns Array of generated paths, or empty array if generation fails
 */
async function safeGenerateRoutes(
  generator: () => Promise<GeneratedPath[]>,
  context: string,
): Promise<GeneratedPath[]> {
  try {
    return await generator();
  } catch (error) {
    routingLogger.error(`Error generating routes for ${context}:`, error);
    // Return empty array to allow build to continue with other routes
    return [];
  }
}

/**
 * Build generator functions for all configured content types
 *
 * Creates an array of safe generator functions for books, tutorials, etc.
 * Each generator is wrapped with error handling and will execute in parallel.
 *
 * @param lang - Current language code
 * @param targetLang - Target language for translation checks
 * @param contact - Contact information for the current language
 * @returns Array of generator promises
 */
function buildContentTypeGenerators(
  lang: string,
  targetLang: string,
  contact: ContactItem[],
): Promise<GeneratedPath[]>[] {
  return Object.values(CONTENT_TYPE_CONFIGS).map((config) =>
    safeGenerateRoutes(
      async () =>
        generateContentTypeWithPaginationRoutes({
          lang,
          targetLang,
          routeSegment: getRouteSegment(config.routeKey, lang),
          pageSegment: getRouteSegment("page", lang),
          contentType: config.contentType,
          getAllItems: config.getAllItems,
          itemsPerPage: config.itemsPerPage,
          generateDetailPaths: config.generateDetailPaths,
          contact,
          schemaType: config.schemaType,
          extractItemData: config.extractItemData,
        }),
      `${config.contentType} (${lang})`,
    ),
  );
}

/**
 * Build generator functions for all taxonomy types
 *
 * Creates an array of safe generator functions for authors, publishers, genres, etc.
 * Each generator is wrapped with error handling and will execute in parallel.
 *
 * @param lang - Current language code
 * @param targetLang - Target language for translation checks
 * @param contact - Contact information for the current language
 * @returns Array of generator promises
 */
function buildTaxonomyGenerators(lang: string, targetLang: string, contact: ContactItem[]): Promise<GeneratedPath[]>[] {
  return TAXONOMY_TYPES.map((taxonomyType) =>
    safeGenerateRoutes(
      async () =>
        generateTaxonomyRoutes({
          taxonomyConfig: TAXONOMY_CONFIGS[taxonomyType],
          lang,
          targetLang,
          routeSegment: getRouteSegment(taxonomyType, lang),
          contentType: taxonomyType,
          contact,
          itemsPropsKey: `${taxonomyType}WithCounts` as const,
        }),
      `${taxonomyType} (${lang})`,
    ),
  );
}

/**
 * Generate all routes that can be executed in parallel
 *
 * Coordinates the parallel execution of content type and taxonomy generators.
 * This is a key performance optimization that significantly reduces build time.
 *
 * @param lang - Current language code
 * @param targetLang - Target language for translation checks
 * @param contact - Contact information for the current language
 * @returns Flattened array of all generated paths
 */
async function generateParallelRoutes(
  lang: string,
  targetLang: string,
  contact: ContactItem[],
): Promise<GeneratedPath[]> {
  performanceMonitor.start(`parallel-generation-${lang}`);

  const generators = [
    ...buildContentTypeGenerators(lang, targetLang, contact),
    ...buildTaxonomyGenerators(lang, targetLang, contact),
  ];

  const results = await Promise.all(generators);
  performanceMonitor.end(`parallel-generation-${lang}`);

  return results.flat();
}

/**
 * Generate posts routes (special case - mixed content)
 *
 * Posts are a special case because they combine multiple content types
 * (books + tutorials) and have complex schema mapping. They must be
 * generated sequentially after other content types are cached.
 *
 * @param lang - Current language code
 * @param targetLang - Target language for translation checks
 * @param contact - Contact information for the current language
 * @returns Array of generated paths for posts
 */
async function generatePostsPaths(lang: string, targetLang: string, contact: ContactItem[]): Promise<GeneratedPath[]> {
  performanceMonitor.start(`posts-${lang}`);

  const paths = await safeGenerateRoutes(
    async () =>
      generatePostsRoutes({
        lang,
        targetLang,
        contact,
      }),
    `posts (${lang})`,
  );

  performanceMonitor.end(`posts-${lang}`);
  return paths;
}

/**
 * Generate static page routes (about, feeds)
 *
 * Handles the generation of static pages that don't follow
 * the standard content type pattern.
 *
 * @param lang - Current language code
 * @param contact - Contact information for the current language
 * @returns Array of generated paths for static pages
 */
async function generateStaticRoutes(lang: string, contact: ContactItem[]): Promise<GeneratedPath[]> {
  performanceMonitor.start(`static-${lang}`);

  const paths: GeneratedPath[] = [];

  // ABOUT PAGE
  try {
    const aboutContent =
      lang === "en"
        ? await import("@content/en/about.ts").then((mod) => mod.about)
        : await import("@content/es/about.ts").then((mod) => mod.about);

    paths.push(
      ...generateStaticPageRoute({
        lang,
        routeSegment: getRouteSegment("about", lang),
        contentType: "about",
        contact,
        content: aboutContent,
      }),
    );
  } catch (error) {
    routingLogger.error(`Error generating routes for about (${lang}):`, error);
  }

  // FEEDS PAGE
  try {
    paths.push(
      ...generateStaticPageRoute({
        lang,
        routeSegment: getRouteSegment("feeds", lang),
        contentType: "feeds",
        contact,
      }),
    );
  } catch (error) {
    routingLogger.error(`Error generating routes for feeds (${lang}):`, error);
  }

  performanceMonitor.end(`static-${lang}`);
  return paths;
}

/**
 * Generate all routes for a specific language
 *
 * This is the main orchestrator for a single language. It coordinates:
 * 1. Parallel generation of content types and taxonomies
 * 2. Sequential generation of posts (depends on cached content)
 * 3. Static page generation
 *
 * @param lang - Language code to generate routes for
 * @returns Array of all generated paths for this language
 */
async function generateLanguageRoutes(lang: string): Promise<GeneratedPath[]> {
  performanceMonitor.start(`routes-${lang}`);

  const contact = getContact(lang);
  const targetLang = lang === "en" ? "es" : "en";
  const paths: GeneratedPath[] = [];

  // Phase 1: Parallel generation (content types + taxonomies)
  const parallelPaths = await generateParallelRoutes(lang, targetLang, contact);
  paths.push(...parallelPaths);

  // Phase 2: Posts (sequential - depends on cached content)
  const postsPaths = await generatePostsPaths(lang, targetLang, contact);
  paths.push(...postsPaths);

  // Phase 3: Static pages
  const staticPaths = await generateStaticRoutes(lang, contact);
  paths.push(...staticPaths);

  performanceMonitor.end(`routes-${lang}`);
  return paths;
}

/**
 * Main path generation function
 *
 * This is the entry point that replaces the complex getStaticPaths logic
 * in the route file. It orchestrates the entire path generation process:
 * 1. Generate routes for all languages in parallel
 * 2. Monitor performance
 * 3. Log statistics
 *
 * Usage:
 * ```astro
 * import { generateAllPaths } from "@/utils/routing/pathGeneration";
 * export const getStaticPaths = generateAllPaths;
 * ```
 *
 * @returns GetStaticPaths-compatible function
 */
export const generateAllPaths: GetStaticPaths = async () => {
  performanceMonitor.start("total-route-generation");

  const languages = getLanguages();
  const allLanguagePaths = await Promise.all(languages.map((lang) => generateLanguageRoutes(lang)));

  const paths = allLanguagePaths.flat();

  performanceMonitor.end("total-route-generation");

  routingLogger.info(`Generated ${paths.length} paths (all content types + taxonomies + static pages)`);

  // Log performance and cache statistics
  performanceMonitor.printSummary();
  logCacheStats();

  return paths;
};
