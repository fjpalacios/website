/**
 * Process synopsis markdown to HTML
 * Handles markdown formatting in book synopsis fields
 */

import { marked } from "marked";

/**
 * Convert synopsis markdown to HTML
 * - Converts _text_ to <em>text</em>
 * - Converts **text** to <strong>text</strong>
 * - Converts \\n to <br> (literal newlines from YAML)
 * - Converts \\n\\n to paragraph breaks
 * - Handles other markdown syntax
 *
 * @param synopsis - Raw synopsis string from YAML frontmatter
 * @returns HTML string ready for rendering
 */
export function processSynopsis(synopsis: string): string {
  if (!synopsis) return "";

  // Replace literal \\n from YAML with actual newlines
  const withNewlines = synopsis.replace(/\\n/g, "\n");

  // Pre-escape HTML entities so raw HTML in the synopsis (e.g. <script>,
  // <img onerror>) is rendered as text, not as live elements. The
  // consumer (BooksDetailPage.astro) inserts the result with set:html,
  // so without this step an attacker-controlled synopsis could execute
  // arbitrary script. Markdown formatting (_em_, **bold**, etc.) is
  // unaffected because it doesn't use angle brackets.
  // See CodeQL alert #9 on this file.
  const escaped = withNewlines
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // Configure marked for inline parsing
  marked.setOptions({
    breaks: true, // Convert single \n to <br>
    gfm: true, // GitHub Flavored Markdown
  });

  // Parse markdown to HTML
  const html = marked.parse(escaped, { async: false }) as string;

  // Return trimmed HTML (keep multiple <p> tags for multi-paragraph synopsis)
  return html.trim();
}

/**
 * Sanitize synopsis for plain text usage (meta tags, etc.)
 * Removes all markdown and HTML formatting
 *
 * @param synopsis - Raw synopsis string
 * @returns Plain text without formatting
 */
export function sanitizeSynopsis(synopsis: string): string {
  if (!synopsis) return "";

  return synopsis
    .replace(/\\n/g, " ") // Replace literal \\n with space
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove **bold**
    .replace(/_(.+?)_/g, "$1") // Remove _italic_
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}
