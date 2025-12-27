/**
 * Book score formatting utilities
 *
 * Provides functions to format and display book scores/ratings
 * in a consistent way across the application.
 */

/**
 * Formats book score as emoji representation
 *
 * @param score - Numeric score (1-5) or "fav" for favorites
 * @returns Emoji string representation
 *
 * @example
 * ```typescript
 * renderScoreEmoji(4)     // "★★★★☆"
 * renderScoreEmoji(5)     // "★★★★★"
 * renderScoreEmoji("fav") // "❤️❤️❤️❤️❤️"
 * ```
 */
export function renderScoreEmoji(score: number | "fav"): string {
  if (score === "fav") {
    return "❤️".repeat(5);
  }

  // Validate numeric score
  if (typeof score !== "number" || score < 1 || score > 5) {
    console.warn(`Invalid score: ${score}. Must be 1-5 or "fav"`);
    return "☆☆☆☆☆"; // Return empty stars for invalid score
  }

  const filledStars = "★".repeat(score);
  const emptyStars = "☆".repeat(5 - score);

  return filledStars + emptyStars;
}

/**
 * Gets text representation of score
 *
 * @param score - Numeric score or "fav"
 * @param lang - Language code ("en" or "es")
 * @returns Text representation of the score
 *
 * @example
 * ```typescript
 * getScoreText(4, "en")     // "4/5"
 * getScoreText("fav", "en") // "Favorite"
 * getScoreText("fav", "es") // "Favorito"
 * ```
 */
export function getScoreText(score: number | "fav", lang: "en" | "es"): string {
  if (score === "fav") {
    return lang === "en" ? "Favorite" : "Favorito";
  }
  return `${score}/5`;
}

/**
 * Gets accessibility label for score
 *
 * @param score - Numeric score or "fav"
 * @param lang - Language code ("en" or "es")
 * @returns ARIA label describing the score
 *
 * @example
 * ```typescript
 * getScoreAriaLabel(4, "en")     // "Rated 4 out of 5 stars"
 * getScoreAriaLabel("fav", "en") // "Rated as favorite"
 * getScoreAriaLabel(4, "es")     // "Puntuación 4 de 5 estrellas"
 * ```
 */
export function getScoreAriaLabel(score: number | "fav", lang: "en" | "es"): string {
  if (score === "fav") {
    return lang === "en" ? "Rated as favorite" : "Marcado como favorito";
  }

  const text = lang === "en" ? `Rated ${score} out of 5 stars` : `Puntuación ${score} de 5 estrellas`;

  return text;
}

/**
 * Gets CSS class for score display
 *
 * @param score - Numeric score or "fav"
 * @returns CSS class name
 *
 * @example
 * ```typescript
 * getScoreClass(5)     // "score--perfect"
 * getScoreClass(4)     // "score--high"
 * getScoreClass("fav") // "score--favorite"
 * ```
 */
export function getScoreClass(score: number | "fav"): string {
  if (score === "fav") {
    return "score--favorite";
  }

  if (score >= 5) return "score--perfect";
  if (score >= 4) return "score--high";
  if (score >= 3) return "score--medium";
  return "score--low";
}
