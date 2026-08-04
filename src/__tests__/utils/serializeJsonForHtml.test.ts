import { describe, expect, it } from "vitest";

import { serializeJsonForHtml } from "@/utils/serializeJsonForHtml";

describe("serializeJsonForHtml", () => {
  it("escapes characters that can break out of a script element", (): void => {
    const serialized = serializeJsonForHtml({
      title: "</script><script>alert('xss')</script>",
      ampersand: "&",
      lineSeparator: "\u2028",
      paragraphSeparator: "\u2029",
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u0026");
    expect(serialized).toContain("\\u2028");
    expect(serialized).toContain("\\u2029");
  });

  it("preserves the original data when parsed as JSON", (): void => {
    const value = { title: "<safe> & text", nested: { enabled: true } };

    expect(JSON.parse(serializeJsonForHtml(value))).toEqual(value);
  });
});
