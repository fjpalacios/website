import { z } from "zod";

const SAFE_HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const FIRST_PRINTABLE_CHARACTER_CODE = 0x20;
const DELETE_CHARACTER_CODE = 0x7f;

function containsControlCharacter(value: string): boolean {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < FIRST_PRINTABLE_CHARACTER_CODE || code === DELETE_CHARACTER_CODE;
  });
}

/**
 * Check whether a URL can be rendered as a safe link.
 *
 * Absolute URLs are restricted to HTTP(S). Relative URLs are allowed for
 * internal navigation, but protocol-relative URLs are rejected because they
 * can point to an external origin.
 */
export function isSafeUrl(value: string, allowRelative = true): boolean {
  const normalized = value.trim();

  if (!normalized || containsControlCharacter(normalized) || /^[\\/]{2}/.test(normalized)) {
    return false;
  }

  if (allowRelative && !normalized.includes(":")) {
    return true;
  }

  try {
    return SAFE_HTTP_PROTOCOLS.has(new URL(normalized).protocol);
  } catch {
    return false;
  }
}

/**
 * Check whether a URL is a safe absolute HTTP(S) URL.
 */
export function isSafeHttpUrl(value: string): boolean {
  try {
    return SAFE_HTTP_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

/**
 * Zod schema for content-controlled absolute links.
 */
export const safeHttpUrlSchema = z.string().url().refine(isSafeHttpUrl, {
  message: "URL must use the http or https protocol",
});

/**
 * Escape text before embedding it in a deliberately controlled HTML fragment.
 */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}
