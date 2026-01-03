/**
 * Schema.org type constants
 *
 * Centralized constants for Schema.org structured data types.
 * Prevents typos and provides type safety for schema definitions.
 *
 * @see https://schema.org/
 */

export const SCHEMA_TYPES = {
  // Creative works
  BOOK: "Book",
  TECH_ARTICLE: "TechArticle",
  BLOG_POSTING: "BlogPosting",
  REVIEW: "Review",

  // Entities
  PERSON: "Person",
  ORGANIZATION: "Organization",

  // Web content
  WEB_PAGE: "WebPage",

  // Collections
  ITEM_LIST: "ItemList",

  // Properties
  RATING: "Rating",
} as const;

export type SchemaType = (typeof SCHEMA_TYPES)[keyof typeof SCHEMA_TYPES];

// Create a set of valid values for efficient runtime checking
const VALID_SCHEMA_TYPES = new Set<string>(Object.values(SCHEMA_TYPES));

/**
 * Type guard to check if a string is a valid schema type
 */
export function isValidSchemaType(value: unknown): value is SchemaType {
  return typeof value === "string" && VALID_SCHEMA_TYPES.has(value);
}
