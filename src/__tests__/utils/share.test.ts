import { describe, expect, it } from "vitest";

import { buildShareMessage } from "@/utils/share";

describe("buildShareMessage", () => {
  it("encodes dynamic values before inserting them into HTML attributes", (): void => {
    const template = '<a href="https://example.com/share?title=%TITLE%&url=%URL%&via=%TWITTER%">Share</a>';
    const result = buildShareMessage(template, '" onmouseover="alert(1)', "https://fjp.es/book?a=1&b=2", "@user");

    expect(result).not.toContain('" onmouseover="');
    expect(result).toContain(encodeURIComponent('" onmouseover="alert(1)'));
    expect(result).toContain(encodeURIComponent("https://fjp.es/book?a=1&b=2"));
    expect(result).toContain(encodeURIComponent("user"));
  });
});
