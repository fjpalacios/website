import { describe, expect, it } from "vitest";

import { isSafeHttpUrl, isSafeUrl, safeHttpUrlSchema } from "@/utils/safeUrl";

describe("safe URL utilities", () => {
  it.each([
    "https://example.com",
    "http://example.com/path",
    "/es/libros/book",
    "../books/book",
    "#section",
    "?query=1",
  ])("accepts safe URL %s", (value) => {
    expect(isSafeUrl(value)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//evil.example/path",
    "\\\\evil.example\\path",
    "java\nscript:alert(1)",
  ])("rejects executable or external URL %s", (value) => {
    expect(isSafeUrl(value)).toBe(false);
  });

  it("rejects relative URLs when only absolute HTTP(S) URLs are allowed", () => {
    expect(isSafeUrl("/internal", false)).toBe(false);
    expect(isSafeHttpUrl("/internal")).toBe(false);
    expect(isSafeHttpUrl("mailto:test@example.com")).toBe(false);
  });

  it("accepts only absolute HTTP(S) URLs in the content schema", () => {
    expect(safeHttpUrlSchema.safeParse("https://example.com").success).toBe(true);
    expect(safeHttpUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(safeHttpUrlSchema.safeParse("data:text/html,payload").success).toBe(false);
    expect(safeHttpUrlSchema.safeParse("mailto:test@example.com").success).toBe(false);
  });
});
