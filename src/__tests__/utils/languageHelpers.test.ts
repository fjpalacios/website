import { describe, expect, it } from "vitest";

import { detectLanguageFromUrl } from "@/utils/languageHelpers";

describe("detectLanguageFromUrl", () => {
  it("detects English paths", () => {
    expect(detectLanguageFromUrl("/en/tutorials/git-branches")).toBe("en");
  });

  it("detects the bare English root", () => {
    expect(detectLanguageFromUrl("/en")).toBe("en");
  });

  it("detects Spanish paths", () => {
    expect(detectLanguageFromUrl("/es/tutoriales/ramas-git")).toBe("es");
  });

  it("falls back to Spanish for anything else", () => {
    expect(detectLanguageFromUrl("/unknown/path")).toBe("es");
  });

  it("does not mistake a path that merely contains 'en' for English", () => {
    expect(detectLanguageFromUrl("/es/tutoriales/entornos-virtuales")).toBe("es");
  });
});
