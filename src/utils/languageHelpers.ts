/**
 * Language resolution shared by the conditional link components.
 *
 * The site is bilingual and components are rendered from MDX, so the language
 * comes from the URL rather than from props: a tutorial at /es/tutoriales/x
 * links to Spanish targets, the one at /en/tutorials/x to English ones.
 *
 * Note: bookLinkHelpers, authorLinkHelpers and seriesLinkHelpers each carry
 * their own copy of this function. They predate this module and are left alone
 * on purpose; folding them into it is a separate, mechanical refactor.
 */

import type { LanguageKey } from "@/types";

/**
 * Detect the language from a URL pathname.
 *
 * @example
 * detectLanguageFromUrl("/en/tutorials/git-branches"); // "en"
 * detectLanguageFromUrl("/es/tutoriales/ramas-git");    // "es"
 * detectLanguageFromUrl("/unknown");                    // "es" (fallback)
 */
export const detectLanguageFromUrl = (pathname: string): LanguageKey =>
  pathname.startsWith("/en/") || pathname === "/en" ? "en" : "es";
