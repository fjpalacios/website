/**
 * Process synopsis markdown to HTML
 * Handles markdown formatting in book synopsis fields
 */

import { marked, type Tokens } from "marked";

import { escapeHtml, isSafeUrl } from "@/utils/safeUrl";

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

  // Configure marked for inline parsing. Unsafe links are rendered as text
  // instead of anchors so content cannot execute a URL scheme in the browser.
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, tokens }: Tokens.Link): string => {
    const text = renderer.parser.parseInline(tokens);

    if (!isSafeUrl(href)) {
      return text;
    }

    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${escapeHtml(href)}"${titleAttribute}>${text}</a>`;
  };

  // Parse markdown to HTML
  const html = marked.parse(escaped, {
    async: false,
    breaks: true,
    gfm: true,
    renderer,
  }) as string;

  // Return trimmed HTML (keep multiple <p> tags for multi-paragraph synopsis)
  return html.trim();
}
