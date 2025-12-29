/**
 * Route Generator: Static Pages
 *
 * Generates routes for static pages without dynamic content:
 * - About page (e.g., /en/about, /es/acerca-de)
 * - Feeds page (e.g., /en/feeds, /es/feeds)
 *
 * Used by: About, Feeds, and any future static pages
 */

export interface StaticPageConfig {
  /** Current language (e.g., 'en', 'es') */
  lang: string;

  /** Route segment in current language (e.g., 'about', 'acerca-de', 'feeds') */
  routeSegment: string;

  /** Content type identifier (e.g., 'about', 'feeds') */
  contentType: string;

  /** Contact data for current language */
  contact: unknown;

  /** Optional content data (e.g., aboutContent for About page) */
  content?: unknown;

  /** Additional props to merge into the route props */
  additionalProps?: Record<string, unknown>;
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate route for a static page
 *
 * @param config Configuration object
 * @returns Array with single generated path
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

  // Add content if provided (e.g., aboutContent)
  if (content !== undefined) {
    // Use content type name + "Content" as key (e.g., "aboutContent")
    props[`${contentType}Content`] = content;
  }

  return [
    {
      params: { lang, route: routeSegment },
      props,
    },
  ];
}
