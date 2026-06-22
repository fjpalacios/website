/**
 * Breadcrumb utilities
 *
 * Pure helpers for breadcrumb navigation. Extracted from the Breadcrumbs
 * component so the schema generator can be imported by pages and templates
 * without violating the `astro/no-exports-from-components` rule.
 */

/**
 * A single entry in a breadcrumb trail.
 * `url` is undefined for the current page (the last breadcrumb).
 */
export interface BreadcrumbItem {
  label: string;
  url?: string; // undefined for current page
}

/**
 * A Schema.org JSON-LD BreadcrumbList ready to be serialized.
 */
export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbListItemSchema[];
}

export interface BreadcrumbListItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

/**
 * Build a Schema.org BreadcrumbList JSON-LD object for SEO.
 *
 * @param items - Ordered breadcrumb items. The last one is usually the current page (no `url`).
 * @param baseUrl - Absolute base URL used to resolve each item's `url` into a full link.
 * @returns A `BreadcrumbList` object ready to be serialized as JSON-LD.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.label,
      ...(item.url && { item: `${baseUrl}${item.url}` }),
    })),
  };
}
