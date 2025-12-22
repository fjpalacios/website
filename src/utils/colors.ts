/**
 * Color manipulation utility functions
 */

/**
 * Subtracts light from a color component (hex pair)
 * @param color - Two-character hex color component (e.g., "FF")
 * @param amount - Amount to subtract (0-255)
 * @returns Darkened hex component
 */
function subtractLight(color: string, amount: number): string {
  const cc = parseInt(color, 16) - amount;
  const c = cc < 0 ? 0 : cc;
  const hex = c.toString(16);
  return hex.length > 1 ? hex : `0${hex}`;
}

/**
 * Darkens a hex color by a percentage
 * @param color - Hex color string (with or without #)
 * @param amount - Percentage to darken (0-100)
 * @returns Darkened hex color with #
 */
export function darken(color: string, amount: number): string {
  // Remove # if present
  const cleanColor = color.indexOf("#") >= 0 ? color.substring(1) : color;
  const adjustAmount = Math.floor((255 * amount) / 100);

  const r = subtractLight(cleanColor.substring(0, 2), adjustAmount);
  const g = subtractLight(cleanColor.substring(2, 4), adjustAmount);
  const b = subtractLight(cleanColor.substring(4, 6), adjustAmount);

  return `#${r}${g}${b}`;
}
