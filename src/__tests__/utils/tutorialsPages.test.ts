import { getCollection } from "astro:content";
import { describe, expect, it } from "vitest";

import { getAllTutorialsForLanguage } from "@/utils/tutorialsPages";

describe("getAllTutorialsForLanguage", () => {
  it("rejects unsupported languages before loading collections", async () => {
    await expect(getAllTutorialsForLanguage("fr")).rejects.toThrow("Unsupported language: fr");
    expect(getCollection).not.toHaveBeenCalled();
  });
});
