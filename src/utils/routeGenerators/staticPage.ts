/**
 * Route Generator: Static Pages
 *
 * Generates routes for static, non-dynamic pages that don't require
 * complex data fetching or pagination.
 *
 * Static pages are simpler than content type pages:
 * - No pagination needed
 * - No list/detail distinction
 * - Content is typically from JSON files
 * - Fast to generate (no collection queries)
 *
 * Current Static Pages:
 * - About: /en/about, /es/acerca-de
 * - Feeds: /en/feeds, /es/feeds (RSS feed listings)
 *
 * Future static pages can easily be added using this generator.
 *
 * @module routeGenerators/staticPage
 */

/**
 * Configuration for static page route generation
 */
export interface StaticPageConfig {
  /** Current language code (e.g., 'en', 'es') */
  lang: string;

  /** Localized route segment (e.g., 'about' in EN, 'acerca-de' in ES) */
  routeSegment: string;

  /** Content type identifier matching the page type (e.g., 'about', 'feeds') */
  contentType: string;

  /** Contact information for the current language */
  contact: unknown;

  /** Optional content data (e.g., aboutContent from JSON file) */
  content?: unknown;

  /** Additional custom props to pass to the page template */
  additionalProps?: Record<string, unknown>;
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate route for a static page
 *
 * Unlike content type generators that return multiple routes (list, pagination, detail),
 * this generator returns a single route for a static page.
 *
 * The function automatically:
 * 1. Creates base props (contentType, pageType, lang, contact)
 * 2. Merges in any additional props
 * 3. Adds content with auto-generated key name if provided
 *
 * Key Naming Convention:
 * If content is provided, it's stored as `{contentType}Content`.
 * Example: contentType="about" → props.aboutContent = content
 *
 * @param config - Static page configuration
 * @returns Array containing a single generated route path
 *
 * @example
 * ```ts
 * // Generate About page
 * const aboutRoute = generateStaticPageRoute({
 *   lang: 'en',
 *   routeSegment: 'about',
 *   contentType: 'about',
 *   contact: contactEn,
 *   content: aboutContentEn
 * });
 * // Returns: [{ params: { lang: 'en', route: 'about' }, props: { ... } }]
 * ```
 */
export function generateStaticPageRoute(config: StaticPageConfig): GeneratedPath[] {
  const { lang, routeSegment, contentType, contact, content, additionalProps = {} } = config;

  const props: Record<string, unknown> = {
    contentType,
    pageType: "static",
    lang,
    contact,
    ...additionalProps,
  };

  // Add content with auto-generated key name if provided
  // Example: contentType="about" → aboutContent
  if (content !== undefined) {
    props[`${contentType}Content`] = content;
  }

  return [
    {
      params: { lang, route: routeSegment },
      props,
    },
  ];
}
