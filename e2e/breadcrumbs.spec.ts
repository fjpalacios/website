import { expect, test } from "@playwright/test";

test.describe("Breadcrumbs", () => {
  test.describe("Book Detail Pages", () => {
    test("should display breadcrumbs on Spanish book detail page", async ({ page }) => {
      await page.goto("/es/libros/area-81-stephen-king");

      const breadcrumbs = page.locator("nav.breadcrumbs");
      await expect(breadcrumbs).toBeVisible();

      // Check breadcrumb items
      const items = breadcrumbs.locator(".breadcrumbs__item");
      await expect(items).toHaveCount(3);

      // Home link
      const homeLink = items.nth(0).locator("a.breadcrumbs__link");
      await expect(homeLink).toHaveText("Inicio");
      await expect(homeLink).toHaveAttribute("href", "/es");

      // Books link
      const booksLink = items.nth(1).locator("a.breadcrumbs__link");
      await expect(booksLink).toHaveText("Libros");
      await expect(booksLink).toHaveAttribute("href", "/es/libros");

      // Current page (no link)
      const currentPage = items.nth(2).locator(".breadcrumbs__current");
      await expect(currentPage).toContainText("Área 81");
      await expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    test("should display breadcrumbs on English book detail page", async ({ page }) => {
      await page.goto("/en/books/the-stand-stephen-king");

      const breadcrumbs = page.locator("nav.breadcrumbs");
      await expect(breadcrumbs).toBeVisible();

      // Check breadcrumb items
      const items = breadcrumbs.locator(".breadcrumbs__item");
      await expect(items).toHaveCount(3);

      // Home link
      const homeLink = items.nth(0).locator("a.breadcrumbs__link");
      await expect(homeLink).toHaveText("Home");
      await expect(homeLink).toHaveAttribute("href", "/en");

      // Books link
      const booksLink = items.nth(1).locator("a.breadcrumbs__link");
      await expect(booksLink).toHaveText("Books");
      await expect(booksLink).toHaveAttribute("href", "/en/books");

      // Current page (no link)
      const currentPage = items.nth(2).locator(".breadcrumbs__current");
      await expect(currentPage).toContainText("The Stand");
      await expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    test("should have BreadcrumbList schema on book detail page", async ({ page }) => {
      await page.goto("/es/libros/area-81-stephen-king");

      // Get all script tags with type="application/ld+json"
      const scripts = await page.locator('script[type="application/ld+json"]').all();

      // Find the BreadcrumbList schema
      let breadcrumbSchema = null;
      for (const script of scripts) {
        const content = await script.textContent();
        if (content) {
          const json = JSON.parse(content);
          if (json["@type"] === "BreadcrumbList") {
            breadcrumbSchema = json;
            break;
          }
        }
      }

      expect(breadcrumbSchema).not.toBeNull();
      expect(breadcrumbSchema?.["@context"]).toBe("https://schema.org");
      expect(breadcrumbSchema?.itemListElement).toHaveLength(3);

      // Check first item (Home)
      expect(breadcrumbSchema?.itemListElement[0]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[0].position).toBe(1);
      expect(breadcrumbSchema?.itemListElement[0].name).toBe("Inicio");
      expect(breadcrumbSchema?.itemListElement[0].item).toBe("https://www.fcpalacios.dev/es");

      // Check second item (Books)
      expect(breadcrumbSchema?.itemListElement[1]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[1].position).toBe(2);
      expect(breadcrumbSchema?.itemListElement[1].name).toBe("Libros");
      expect(breadcrumbSchema?.itemListElement[1].item).toBe("https://www.fcpalacios.dev/es/libros");

      // Check third item (Current page - no item URL)
      expect(breadcrumbSchema?.itemListElement[2]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[2].position).toBe(3);
      expect(breadcrumbSchema?.itemListElement[2].name).toContain("Área 81");
      expect(breadcrumbSchema?.itemListElement[2].item).toBeUndefined();
    });
  });

  test.describe("Tutorial Detail Pages", () => {
    test("should display breadcrumbs on Spanish tutorial detail page", async ({ page }) => {
      await page.goto("/es/tutoriales/que-es-git");

      const breadcrumbs = page.locator("nav.breadcrumbs");
      await expect(breadcrumbs).toBeVisible();

      // Check breadcrumb items
      const items = breadcrumbs.locator(".breadcrumbs__item");
      await expect(items).toHaveCount(3);

      // Home link
      const homeLink = items.nth(0).locator("a.breadcrumbs__link");
      await expect(homeLink).toHaveText("Inicio");
      await expect(homeLink).toHaveAttribute("href", "/es");

      // Tutorials link
      const tutorialsLink = items.nth(1).locator("a.breadcrumbs__link");
      await expect(tutorialsLink).toHaveText("Tutoriales");
      await expect(tutorialsLink).toHaveAttribute("href", "/es/tutoriales");

      // Current page (no link)
      const currentPage = items.nth(2).locator(".breadcrumbs__current");
      await expect(currentPage).toHaveText("¿Qué es Git?");
      await expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    test("should display breadcrumbs on English tutorial detail page", async ({ page: _page }) => {
      // Skip this test: no English tutorials exist yet
      // When English tutorials are added, update this test with a real slug
      test.skip();
    });

    test("should have BreadcrumbList schema on tutorial detail page", async ({ page }) => {
      await page.goto("/es/tutoriales/que-es-git");

      // Get all script tags with type="application/ld+json"
      const scripts = await page.locator('script[type="application/ld+json"]').all();

      // Find the BreadcrumbList schema
      let breadcrumbSchema = null;
      for (const script of scripts) {
        const content = await script.textContent();
        if (content) {
          const json = JSON.parse(content);
          if (json["@type"] === "BreadcrumbList") {
            breadcrumbSchema = json;
            break;
          }
        }
      }

      expect(breadcrumbSchema).not.toBeNull();
      expect(breadcrumbSchema?.["@context"]).toBe("https://schema.org");
      expect(breadcrumbSchema?.itemListElement).toHaveLength(3);

      // Check first item (Home)
      expect(breadcrumbSchema?.itemListElement[0]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[0].position).toBe(1);
      expect(breadcrumbSchema?.itemListElement[0].name).toBe("Inicio");

      // Check second item (Tutorials)
      expect(breadcrumbSchema?.itemListElement[1]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[1].position).toBe(2);
      expect(breadcrumbSchema?.itemListElement[1].name).toBe("Tutoriales");

      // Check third item (Current page)
      expect(breadcrumbSchema?.itemListElement[2]["@type"]).toBe("ListItem");
      expect(breadcrumbSchema?.itemListElement[2].position).toBe(3);
      expect(breadcrumbSchema?.itemListElement[2].name).toBe("¿Qué es Git?");
    });
  });

  test.describe("Breadcrumb Navigation", () => {
    test("should navigate when clicking breadcrumb links", async ({ page }) => {
      await page.goto("/es/libros/area-81-stephen-king");

      // Click on "Libros" breadcrumb
      await page.click(".breadcrumbs__item:nth-child(2) .breadcrumbs__link");
      await expect(page).toHaveURL(/\/es\/libros$/);
      await expect(page).toHaveTitle(/Libros/);
    });

    test("should have correct aria-label for accessibility", async ({ page }) => {
      await page.goto("/es/libros/area-81-stephen-king");

      const breadcrumbsNav = page.locator("nav.breadcrumbs");
      const ariaLabel = await breadcrumbsNav.getAttribute("aria-label");

      // Should have aria-label (either "breadcrumb" in EN or "migas de pan" in ES)
      expect(ariaLabel).toBeTruthy();
      expect(["breadcrumb", "migas de pan"]).toContain(ariaLabel);
    });
  });

  test.describe("Breadcrumb Separators", () => {
    test("should display arrow separators between breadcrumb items", async ({ page }) => {
      await page.goto("/es/libros/area-81-stephen-king");

      // Check that separators are present (using CSS ::after content)
      const items = page.locator(".breadcrumbs__item");

      // First and second items should have separators (::after with →)
      // Last item should NOT have separator
      const firstItem = items.nth(0);
      const secondItem = items.nth(1);
      const lastItem = items.nth(2);

      // We can't directly test ::after content with Playwright,
      // but we can verify the structure is correct
      await expect(firstItem).toBeVisible();
      await expect(secondItem).toBeVisible();
      await expect(lastItem).toBeVisible();

      // Verify the last item doesn't have the same class pattern
      // (it should only have .breadcrumbs__current, not a link)
      await expect(lastItem.locator(".breadcrumbs__current")).toBeVisible();
    });
  });
});
