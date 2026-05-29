import { test, expect } from "@playwright/test";

async function findSchema(page: ReturnType<typeof test.info>, type: string) {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  for (const script of scripts) {
    const content = await script.textContent();
    const schema = JSON.parse(content!);
    if (schema["@type"] === type) return schema;
  }
  return null;
}

test.describe("SEO - WebSite Schema", () => {
  test("should have WebSite schema on every page", async ({ page }) => {
    await page.goto("/es/");

    const schema = await findSchema(page, "WebSite");

    expect(schema).toBeTruthy();
    expect(schema!["@context"]).toBe("https://schema.org");
    expect(schema!.name).toBeTruthy();
    expect(schema!.url).toMatch(/^https?:\/\//);
    expect(schema!.inLanguage).toBe("es");
  });

  test("should have WebSite schema with correct language on English pages", async ({ page }) => {
    await page.goto("/en/");

    const schema = await findSchema(page, "WebSite");

    expect(schema).toBeTruthy();
    expect(schema!.inLanguage).toBe("en");
  });
});

test.describe("SEO - Course Schema", () => {
  test("should have Course schema on Spanish course page", async ({ page }) => {
    await page.goto("/es/cursos/domina-git-desde-cero/");

    const schema = await findSchema(page, "Course");

    expect(schema).toBeTruthy();
    expect(schema!["@context"]).toBe("https://schema.org");
    expect(schema!.name).toBeTruthy();
    expect(schema!.url).toMatch(/^https?:\/\//);
    expect(schema!.provider["@type"]).toBe("Person");
    expect(schema!.inLanguage).toBe("es");
  });

  test("should include hasPart with all course tutorials", async ({ page }) => {
    await page.goto("/es/cursos/domina-git-desde-cero/");

    const schema = await findSchema(page, "Course");

    expect(schema).toBeTruthy();
    expect(Array.isArray(schema!.hasPart)).toBe(true);
    expect(schema!.hasPart.length).toBeGreaterThan(0);

    const firstPart = schema!.hasPart[0];
    expect(firstPart["@type"]).toBe("LearningResource");
    expect(firstPart.name).toBeTruthy();
    expect(firstPart.url).toMatch(/^https?:\/\//);
  });
});

test.describe("SEO - dateModified in schemas", () => {
  test("should emit dateModified in BlogPosting schema when update_date is set", async ({ page }) => {
    // This post has update_date: "2016-12-28" in its frontmatter
    await page.goto("/es/publicaciones/libros-leidos-durante-2014/");

    const schema = await findSchema(page, "BlogPosting");

    expect(schema).toBeTruthy();
    expect(schema!.dateModified).toBeTruthy();
    expect(schema!.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});
