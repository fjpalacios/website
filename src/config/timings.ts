/**
 * Centralized timing constants configuration
 *
 * All timeout and animation timing values are defined here to ensure
 * consistency across the application and make them easy to adjust.
 *
 * All values are in milliseconds (ms).
 */
export const TIMINGS = {
  /**
   * Delay before focusing search input after page load (ms)
   *
   * This small delay allows the page to fully render and provides
   * a smooth user experience. The 300ms value is based on the
   * common perception threshold for "instant" interactions.
   *
   * Used in: src/components/Search.astro
   *
   * @example
   * ```typescript
   * setTimeout(() => searchInput.focus(), TIMINGS.SEARCH_INPUT_FOCUS_MS);
   * ```
   */
  SEARCH_INPUT_FOCUS_MS: 300,

  /**
   * Duration to display "copied" feedback after copying code (ms)
   *
   * This provides enough time for users to see the feedback without
   * being annoying. The 2 second duration is standard for temporary
   * success messages.
   *
   * Used in: src/layouts/Layout.astro
   *
   * @example
   * ```typescript
   * button.textContent = "Copied!";
   * setTimeout(() => {
   *   button.textContent = "Copy";
   * }, TIMINGS.CODE_COPY_FEEDBACK_MS);
   * ```
   */
  CODE_COPY_FEEDBACK_MS: 2000,
} as const;

/**
 * Type for timing configuration
 * Ensures type safety when working with timing values
 */
export type TimingsConfig = typeof TIMINGS;
