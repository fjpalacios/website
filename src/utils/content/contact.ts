/**
 * Contact Data Utility
 *
 * Centralized access to contact information for both languages.
 * This utility eliminates the need to import contact data directly
 * in every page file, providing a single source of truth.
 *
 * @module utils/content/contact
 */

import { contact as contactEN } from "@content/en/contact";
import { contact as contactES } from "@content/es/contact";

import { getDefaultLanguageCode } from "@/config/languages";
import type { LanguageKey } from "@/types";
import type { ContactItem } from "@/types/content";

/**
 * Get contact information for a specific language
 *
 * Returns an array of contact items (social links, email, phone, etc.)
 * in the specified language. Each call returns a new array to prevent
 * accidental mutations.
 *
 * @param lang - Language code
 * @returns Array of contact items for the specified language
 *
 * @example
 * ```typescript
 * import { getContact } from "@utils/content/contact";
 *
 * const contact = getContact("es");
 * // Returns Spanish contact data
 *
 * const contactEN = getContact("en");
 * // Returns English contact data
 * ```
 *
 * @see ContactItem type definition in @types/content
 */
export function getContact(lang: LanguageKey): ContactItem[] {
  // Map language-specific contact data
  const contactMap: Record<LanguageKey, ContactItem[]> = {
    es: contactES,
    en: contactEN,
  };

  // Return a shallow copy to prevent accidental mutations
  return [...(contactMap[lang] ?? contactMap[getDefaultLanguageCode()])];
}
