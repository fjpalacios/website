/**
 * Serialize JSON for insertion inside an HTML script element.
 *
 * JSON.stringify does not escape HTML-sensitive characters. Escaping them
 * prevents content-controlled strings such as `</script>` from terminating
 * the containing JSON-LD script element.
 */
export function serializeJsonForHtml(value: unknown): string {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new TypeError("Value cannot be serialized as JSON");
  }

  return serialized
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
