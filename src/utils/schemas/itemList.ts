/**
 * Generates Schema.org ItemList structured data for listing pages
 * Helps search engines understand list pages and may appear as carousels in search results
 *
 * @see https://schema.org/ItemList
 * @see https://developers.google.com/search/docs/appearance/structured-data/carousel
 */

interface ItemListItem {
  name: string;
  url: string;
  type?: "Book" | "BlogPosting" | "TechArticle" | "Thing";
  description?: string;
}

interface ItemListSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    item: {
      "@type": string;
      name: string;
      url: string;
      description?: string;
    };
  }>;
}

/**
 * Generates a Schema.org ItemList for a collection of items
 *
 * @param items - Array of items to include in the list
 * @param baseUrl - Base URL of the site (e.g., "https://fjp.es")
 * @returns ItemList schema object ready to be JSON.stringified
 *
 * @example
 * ```ts
 * const schema = generateItemListSchema(
 *   books.map(book => ({
 *     name: book.data.title,
 *     url: `/es/libros/${book.data.post_slug}/`,
 *     type: "Book",
 *     description: book.data.excerpt
 *   })),
 *   "https://fjp.es"
 * );
 * ```
 */
export function generateItemListSchema(items: ItemListItem[], baseUrl: string): ItemListSchema {
  // Ensure baseUrl doesn't have trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => {
      // Ensure URL has leading slash
      const cleanUrl = item.url.startsWith("/") ? item.url : `/${item.url}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": item.type || "Thing",
          name: item.name,
          url: `${cleanBaseUrl}${cleanUrl}`,
          ...(item.description && { description: item.description }),
        },
      };
    }),
  };
}
