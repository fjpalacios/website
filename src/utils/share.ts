import { escapeHtml } from "@/utils/safeUrl";

/**
 * Replace Share template values with URL-encoded, HTML-safe values.
 */
export function buildShareMessage(template: string, title: string, url: string, twitterUsername: string): string {
  const encodeAttributeValue = (value: string): string => escapeHtml(encodeURIComponent(value));

  return template
    .replace(/%TITLE%/g, encodeAttributeValue(title))
    .replace(/%URL%/g, encodeAttributeValue(url))
    .replace(/%TWITTER%/g, encodeAttributeValue(twitterUsername.replace("@", "")));
}
