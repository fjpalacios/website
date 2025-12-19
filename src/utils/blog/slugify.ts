/**
 * Converts a string to a URL-safe slug
 *
 * @param text - The text to slugify
 * @returns A URL-safe slug (lowercase, alphanumeric, with dashes)
 *
 * @example
 * slugify('Apocalipsis, de Stephen King') // => 'apocalipsis-de-stephen-king'
 * slugify('¿Qué es Git?') // => 'que-es-git'
 * slugify('La princesa de hielo') // => 'la-princesa-de-hielo'
 */
export function slugify(text: string): string {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Replace Spanish accented characters
      .normalize("NFD") // Decompose combined characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      // Replace ñ/Ñ specifically
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "n")
      // Replace special characters that should become separators with spaces first
      .replace(/[/\\.@,]/g, " ")
      // Remove all other non-alphanumeric characters except spaces and dashes
      .replace(/[^a-z0-9\s-]/g, "")
      // Replace whitespace (spaces, tabs, newlines) with dashes
      .replace(/\s+/g, "-")
      // Replace multiple dashes with single dash
      .replace(/-+/g, "-")
      // Remove leading/trailing dashes
      .replace(/^-+|-+$/g, "")
  );
}
