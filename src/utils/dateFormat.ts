/**
 * Date formatting utilities for the blog
 */

/**
 * Converts a month number (1-12) to Roman numerals
 */
function monthToRoman(month: number): string {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return romans[month - 1] || "";
}

/**
 * Formats a date in vintage logbook style with Roman numerals for months
 * Example: 1-XII-24 (December 1, 2024)
 *
 * Returns an object with:
 * - visual: The visual representation (e.g., "1-XII-24")
 * - aria: The accessible text for screen readers (e.g., "1 de diciembre de 2024")
 * - datetime: The ISO datetime string (e.g., "2024-12-01")
 */
export function formatVintageDate(
  date: Date,
  lang: "es" | "en" = "es",
): {
  visual: string;
  aria: string;
  datetime: string;
} {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 0-indexed
  const year = date.getFullYear();
  const shortYear = year.toString().slice(-2);

  const romanMonth = monthToRoman(month);

  // ISO datetime for machine reading
  const datetime = date.toISOString().split("T")[0];

  // Accessible text for screen readers
  const aria = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Visual representation with Roman numerals
  const visual = `${day}-${romanMonth}-${shortYear}`;

  return { visual, aria, datetime };
}
