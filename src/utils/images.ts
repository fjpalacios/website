/**
 * Image Utilities
 *
 * Helper constants and types for managing images in the Astro project.
 * For actual image imports and retrieval, see imageImports.ts
 */

/**
 * Image dimensions for common use cases
 * These are used when rendering images with known aspect ratios
 */
export const IMAGE_DIMENSIONS = {
  // Book covers (standard 2:3 aspect ratio)
  BOOK_COVER_SMALL: { width: 98, height: 151 },
  BOOK_COVER_MEDIUM: { width: 200, height: 300 },
  BOOK_COVER_LARGE: { width: 400, height: 600 },

  // Author pictures (square 1:1 aspect ratio)
  AUTHOR_PICTURE_SMALL: { width: 100, height: 100 },
  AUTHOR_PICTURE_MEDIUM: { width: 150, height: 150 },
  AUTHOR_PICTURE_LARGE: { width: 300, height: 300 },

  // Post/Tutorial covers (16:9 aspect ratio)
  POST_COVER_SMALL: { width: 400, height: 225 },
  POST_COVER_MEDIUM: { width: 800, height: 450 },
  POST_COVER_LARGE: { width: 1200, height: 675 },
} as const;

/**
 * Responsive image sizes for srcset
 * Common sizes attribute values for different contexts
 */
export const RESPONSIVE_SIZES = {
  // Full width on mobile, half width on desktop
  HALF_WIDTH: "(max-width: 768px) 100vw, 50vw",

  // Full width on mobile, one third on desktop
  THIRD_WIDTH: "(max-width: 768px) 100vw, 33vw",

  // Full width on all screens
  FULL_WIDTH: "100vw",

  // Fixed small size (for thumbnails, author pictures)
  SMALL: "150px",

  // Medium size (for cards)
  MEDIUM: "(max-width: 768px) 50vw, 300px",
} as const;
