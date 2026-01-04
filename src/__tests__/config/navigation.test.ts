import {
  getAllNavigationItems,
  getFooterItems,
  getMenuItems,
  hasContentInLanguage,
  type NavigationItem,
  type RouteKey,
} from "@config/navigation";
import { describe, expect, test } from "vitest";

describe("navigation config", () => {
  describe("NavigationItem structure", () => {
    test("should have correct TypeScript types", () => {
      const items = getAllNavigationItems();
      const item: NavigationItem = items[0];

      // TypeScript compilation will fail if types are wrong
      expect(item.id).toBeDefined();
      expect(item.routeKey).toBeDefined();
      expect(item.matchStrategy).toBeDefined();
    });

    test("all items should have required properties", () => {
      const items = getAllNavigationItems();

      items.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("routeKey");
        expect(item).toHaveProperty("matchStrategy");

        expect(typeof item.id).toBe("string");
        expect(typeof item.routeKey).toBe("string");
        expect(["exact", "prefix"]).toContain(item.matchStrategy);

        // ID should be non-empty
        expect(item.id.length).toBeGreaterThan(0);

        // routeKey should be a valid route or "home"
        expect(item.routeKey).toMatch(/^(home|[a-z]+)$/);
      });
    });

    test("all items should have optional visibility properties", () => {
      const items = getAllNavigationItems();

      items.forEach((item) => {
        // These are optional, but if present should be correct type
        if (item.visibleIn !== undefined) {
          expect(Array.isArray(item.visibleIn)).toBe(true);
          item.visibleIn.forEach((lang) => {
            expect(["es", "en"]).toContain(lang);
          });
        }

        if (item.showInMenu !== undefined) {
          expect(typeof item.showInMenu).toBe("boolean");
        }

        if (item.showInFooter !== undefined) {
          expect(typeof item.showInFooter).toBe("boolean");
        }
      });
    });

    test("should have unique IDs across all items", () => {
      const items = getAllNavigationItems();
      const ids = items.map((item) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    test("should have unique routeKeys across all items", () => {
      const items = getAllNavigationItems();
      const routeKeys = items.map((item) => item.routeKey);
      const uniqueRouteKeys = new Set(routeKeys);

      expect(uniqueRouteKeys.size).toBe(routeKeys.length);
    });
  });

  describe("getAllNavigationItems", () => {
    test("should return all navigation items", () => {
      const items = getAllNavigationItems();

      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    test("should include home as first item", () => {
      const items = getAllNavigationItems();

      expect(items[0].routeKey).toBe("home");
    });

    test("should include all expected navigation items", () => {
      const items = getAllNavigationItems();
      const routeKeys = items.map((item) => item.routeKey);

      // Main pages should be present
      expect(routeKeys).toContain("home");
      expect(routeKeys).toContain("about");
      expect(routeKeys).toContain("posts");
      expect(routeKeys).toContain("tutorials");
      expect(routeKeys).toContain("books");
      expect(routeKeys).toContain("feeds");
      expect(routeKeys).toContain("categories");
      expect(routeKeys).toContain("genres");
      expect(routeKeys).toContain("publishers");
      expect(routeKeys).toContain("series");
      expect(routeKeys).toContain("challenges");
      expect(routeKeys).toContain("authors");
      expect(routeKeys).toContain("courses");
    });

    test("should be immutable - returning new array each time", () => {
      const items1 = getAllNavigationItems();
      const items2 = getAllNavigationItems();

      expect(items1).toEqual(items2);
      expect(items1).not.toBe(items2); // Different references
    });

    test("should return consistent items across multiple calls", () => {
      const calls = Array.from({ length: 5 }, () => getAllNavigationItems());

      calls.forEach((items) => {
        expect(items).toEqual(calls[0]);
      });
    });
  });

  describe("getMenuItems", () => {
    test("should return menu items for Spanish", () => {
      const items = getMenuItems("es");

      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    test("should return menu items for English", () => {
      const items = getMenuItems("en");

      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    test("should only include items with showInMenu !== false", () => {
      const items = getMenuItems("es");

      items.forEach((item) => {
        expect(item.showInMenu).not.toBe(false);
      });
    });

    test("should respect visibleIn language filter", () => {
      const itemsES = getMenuItems("es");
      const itemsEN = getMenuItems("en");

      // Items with visibleIn: ["es"] should not appear in English
      itemsEN.forEach((item) => {
        if (item.visibleIn !== undefined) {
          expect(item.visibleIn).toContain("en");
        }
      });

      // Items with visibleIn: ["en"] should not appear in Spanish
      itemsES.forEach((item) => {
        if (item.visibleIn !== undefined) {
          expect(item.visibleIn).toContain("es");
        }
      });
    });

    test("should include home as first menu item", () => {
      const itemsES = getMenuItems("es");
      const itemsEN = getMenuItems("en");

      expect(itemsES[0].routeKey).toBe("home");
      expect(itemsEN[0].routeKey).toBe("home");
    });

    test("should use exact match for home and about", () => {
      const items = getMenuItems("es");

      const homeItem = items.find((item) => item.routeKey === "home");
      const aboutItem = items.find((item) => item.routeKey === "about");

      expect(homeItem?.matchStrategy).toBe("exact");
      expect(aboutItem?.matchStrategy).toBe("exact");
    });

    test("should use prefix match for content pages", () => {
      const items = getMenuItems("es");

      const postsItem = items.find((item) => item.routeKey === "posts");

      // Posts is in menu, books is not (showInMenu: false)
      expect(postsItem).toBeDefined();
      expect(postsItem?.matchStrategy).toBe("prefix");
    });

    test("should NOT include feeds in menu (showInMenu: false)", () => {
      const itemsES = getMenuItems("es");
      const itemsEN = getMenuItems("en");

      const feedsES = itemsES.find((item) => item.routeKey === "feeds");
      const feedsEN = itemsEN.find((item) => item.routeKey === "feeds");

      expect(feedsES).toBeUndefined();
      expect(feedsEN).toBeUndefined();
    });

    test("should NOT include challenges in English menu (visibleIn: ['es'])", () => {
      const itemsEN = getMenuItems("en");

      const challenges = itemsEN.find((item) => item.routeKey === "challenges");

      expect(challenges).toBeUndefined();
    });

    test("should NOT include challenges in Spanish menu (showInMenu: false)", () => {
      const itemsES = getMenuItems("es");

      const challenges = itemsES.find((item) => item.routeKey === "challenges");

      // Challenges has showInMenu: false, so it won't appear in menu
      expect(challenges).toBeUndefined();
    });

    test("should be immutable - returning new array each time", () => {
      const items1 = getMenuItems("es");
      const items2 = getMenuItems("es");

      expect(items1).toEqual(items2);
      expect(items1).not.toBe(items2); // Different references
    });
  });

  describe("getFooterItems", () => {
    test("should return footer items for Spanish", async () => {
      const items = await getFooterItems("es");

      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);

      // All items should have required properties
      items.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("routeKey");
        expect(item).toHaveProperty("matchStrategy");
      });
    });

    test("should return footer items for English", async () => {
      const items = await getFooterItems("en");

      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    test("should only include items with showInFooter !== false", async () => {
      const items = await getFooterItems("es");

      items.forEach((item) => {
        expect(item.showInFooter).not.toBe(false);
      });
    });

    test("should respect visibleIn language filter", async () => {
      const itemsES = await getFooterItems("es");
      const itemsEN = await getFooterItems("en");

      // Items with visibleIn: ["es"] should not appear in English
      itemsEN.forEach((item) => {
        if (item.visibleIn !== undefined) {
          expect(item.visibleIn).toContain("en");
        }
      });

      // Items with visibleIn: ["en"] should not appear in Spanish
      itemsES.forEach((item) => {
        if (item.visibleIn !== undefined) {
          expect(item.visibleIn).toContain("es");
        }
      });
    });

    test("should only include items with content in that language", async () => {
      const itemsES = await getFooterItems("es");
      const itemsEN = await getFooterItems("en");

      // All items in footer should have content
      for (const item of itemsES) {
        expect(await hasContentInLanguage(item.routeKey, "es")).toBe(true);
      }

      for (const item of itemsEN) {
        expect(await hasContentInLanguage(item.routeKey, "en")).toBe(true);
      }
    });

    test("should NOT include home in footer (showInFooter: false)", async () => {
      const itemsES = await getFooterItems("es");
      const itemsEN = await getFooterItems("en");

      const homeES = itemsES.find((item) => item.routeKey === "home");
      const homeEN = itemsEN.find((item) => item.routeKey === "home");

      expect(homeES).toBeUndefined();
      expect(homeEN).toBeUndefined();
    });

    test("should include feeds in footer (showInFooter: true, even if not in menu)", async () => {
      const itemsES = await getFooterItems("es");
      const itemsEN = await getFooterItems("en");

      const feedsES = itemsES.find((item) => item.routeKey === "feeds");
      const feedsEN = itemsEN.find((item) => item.routeKey === "feeds");

      expect(feedsES).toBeDefined();
      expect(feedsEN).toBeDefined();
    });

    test("should NOT include challenges in English footer (no content)", async () => {
      const itemsEN = await getFooterItems("en");

      const challenges = itemsEN.find((item) => item.routeKey === "challenges");

      expect(challenges).toBeUndefined();
    });

    test("should include challenges in Spanish footer (has content)", async () => {
      const itemsES = await getFooterItems("es");

      const challenges = itemsES.find((item) => item.routeKey === "challenges");

      expect(challenges).toBeDefined();
    });

    test("should be immutable - returning new array each time", async () => {
      const items1 = await getFooterItems("es");
      const items2 = await getFooterItems("es");

      expect(items1).toEqual(items2);
      expect(items1).not.toBe(items2); // Different references
    });

    test("footer items should be subset of all items", async () => {
      const allItems = getAllNavigationItems();
      const footerES = await getFooterItems("es");
      const footerEN = await getFooterItems("en");

      const allRouteKeys = allItems.map((item) => item.routeKey);

      footerES.forEach((item) => {
        expect(allRouteKeys).toContain(item.routeKey);
      });

      footerEN.forEach((item) => {
        expect(allRouteKeys).toContain(item.routeKey);
      });
    });
  });

  describe("hasContentInLanguage", () => {
    test("should return true for static pages in both languages", async () => {
      // Static pages - available in both languages
      expect(await hasContentInLanguage("home", "es")).toBe(true);
      expect(await hasContentInLanguage("home", "en")).toBe(true);
      expect(await hasContentInLanguage("about", "es")).toBe(true);
      expect(await hasContentInLanguage("about", "en")).toBe(true);
      expect(await hasContentInLanguage("feeds", "es")).toBe(true);
      expect(await hasContentInLanguage("feeds", "en")).toBe(true);
    });

    test("should dynamically check content collections for non-static pages", async () => {
      // These should check actual content (tests will reflect real content state)
      // Spanish content exists for all collections
      expect(await hasContentInLanguage("posts", "es")).toBe(true);
      expect(await hasContentInLanguage("tutorials", "es")).toBe(true);
      expect(await hasContentInLanguage("books", "es")).toBe(true);
      expect(await hasContentInLanguage("series", "es")).toBe(true);
      expect(await hasContentInLanguage("courses", "es")).toBe(true);
      expect(await hasContentInLanguage("challenges", "es")).toBe(true);

      // English content - current state as of 2025-12-27:
      // - books: 1 EN book exists
      // - authors: 4 EN authors exist
      // - categories: 4 EN categories (JSON)
      // - genres: 6 EN genres (JSON)
      // - publishers: 2 EN publishers (JSON)
      // - courses: 2 EN courses (JSON)
      // - posts, tutorials, series, challenges: 0 EN content

      expect(await hasContentInLanguage("books", "en")).toBe(true); // 1 EN book
      expect(await hasContentInLanguage("authors", "en")).toBe(true); // 4 EN authors
      expect(await hasContentInLanguage("categories", "en")).toBe(true); // 4 EN categories
      expect(await hasContentInLanguage("genres", "en")).toBe(true); // 6 EN genres
      expect(await hasContentInLanguage("publishers", "en")).toBe(true); // 2 EN publishers
      expect(await hasContentInLanguage("courses", "en")).toBe(true); // 2 EN courses

      expect(await hasContentInLanguage("posts", "en")).toBe(false); // No EN posts
      expect(await hasContentInLanguage("tutorials", "en")).toBe(false); // No EN tutorials
      expect(await hasContentInLanguage("series", "en")).toBe(false); // No EN series
      expect(await hasContentInLanguage("challenges", "en")).toBe(false); // No EN challenges
    });

    test("should return false for collections without content", async () => {
      // Challenges only exist in Spanish
      expect(await hasContentInLanguage("challenges", "es")).toBe(true);
      expect(await hasContentInLanguage("challenges", "en")).toBe(false);
    });

    test("should handle unknown routeKeys gracefully (default true)", async () => {
      // @ts-expect-error Testing with invalid route key
      expect(await hasContentInLanguage("unknown-route", "es")).toBe(true);
      // @ts-expect-error Testing with invalid route key
      expect(await hasContentInLanguage("unknown-route", "en")).toBe(true);
    });

    test("should be consistent across multiple calls", async () => {
      const result1 = await hasContentInLanguage("tutorials", "es");
      const result2 = await hasContentInLanguage("tutorials", "es");
      const result3 = await hasContentInLanguage("tutorials", "es");

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe("Integration - Menu vs Footer differences", () => {
    test("menu and footer should have different items", async () => {
      const menuES = getMenuItems("es");
      const footerES = await getFooterItems("es");

      const menuRouteKeys = menuES.map((item) => item.routeKey);
      const footerRouteKeys = footerES.map((item) => item.routeKey);

      // Feeds should be in footer but not in menu
      expect(menuRouteKeys).not.toContain("feeds");
      expect(footerRouteKeys).toContain("feeds");

      // Home should be in menu but not in footer
      expect(menuRouteKeys).toContain("home");
      expect(footerRouteKeys).not.toContain("home");
    });

    test("English menu and footer should exclude challenges", async () => {
      const menuEN = getMenuItems("en");
      const footerEN = await getFooterItems("en");

      const menuRouteKeys = menuEN.map((item) => item.routeKey);
      const footerRouteKeys = footerEN.map((item) => item.routeKey);

      expect(menuRouteKeys).not.toContain("challenges");
      expect(footerRouteKeys).not.toContain("challenges");
    });

    test("Spanish menu should NOT include challenges (showInMenu: false)", async () => {
      const menuES = getMenuItems("es");
      const footerES = await getFooterItems("es");

      const menuRouteKeys = menuES.map((item) => item.routeKey);
      const footerRouteKeys = footerES.map((item) => item.routeKey);

      // Menu doesn't include challenges (showInMenu: false)
      expect(menuRouteKeys).not.toContain("challenges");
      // Footer includes challenges (has Spanish content)
      expect(footerRouteKeys).toContain("challenges");
    });

    test("only about and posts should appear in both menu and footer", async () => {
      const menuES = getMenuItems("es");
      const footerES = await getFooterItems("es");

      const menuRouteKeys = new Set(menuES.map((item) => item.routeKey));
      const footerRouteKeys = new Set(footerES.map((item) => item.routeKey));

      // Items that should be in both (based on current config)
      // Menu has: home, about, posts
      // Footer has: about, posts, tutorials, books, feeds, categories, etc.
      const commonItems: RouteKey[] = ["about", "posts"];

      commonItems.forEach((item) => {
        expect(menuRouteKeys.has(item)).toBe(true);
        expect(footerRouteKeys.has(item)).toBe(true);
      });

      // Home only in menu
      expect(menuRouteKeys.has("home")).toBe(true);
      expect(footerRouteKeys.has("home")).toBe(false);

      // Tutorials, books only in footer
      expect(menuRouteKeys.has("tutorials")).toBe(false);
      expect(footerRouteKeys.has("tutorials")).toBe(true);
      expect(menuRouteKeys.has("books")).toBe(false);
      expect(footerRouteKeys.has("books")).toBe(true);
    });
  });
});
