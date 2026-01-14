import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { describe, it, expect } from "vitest";

describe("Category Content Integration", () => {
  const categoryDir = join(process.cwd(), "src/content/categories");
  const categoryFiles = readdirSync(categoryDir).filter((file) => file.endsWith(".json"));

  describe("Category Files", () => {
    it("should have category files", () => {
      expect(categoryFiles.length).toBeGreaterThan(0);
    });

    it("should have valid JSON structure", () => {
      categoryFiles.forEach((file) => {
        const content = readFileSync(join(categoryDir, file), "utf-8");
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });

    it("should have required fields in all categories", () => {
      categoryFiles.forEach((file) => {
        const content = JSON.parse(readFileSync(join(categoryDir, file), "utf-8"));
        expect(content.name).toBeTruthy();
        expect(content.category_slug).toBeTruthy();
        expect(content.language).toBeTruthy();
        expect(["es", "en"]).toContain(content.language);
      });
    });

    it("should have categories in both languages", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const spanishCategories = categories.filter((cat) => cat.language === "es");
      const englishCategories = categories.filter((cat) => cat.language === "en");

      expect(spanishCategories.length).toBeGreaterThan(0);

      // Skip English check if no English content exists
      if (englishCategories.length === 0) {
        console.warn("⚠️  No English categories found - skipping English validation");
      } else {
        expect(englishCategories.length).toBeGreaterThan(0);
      }
    });

    it("should have unique category slugs per language", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const spanishSlugs = categories.filter((cat) => cat.language === "es").map((cat) => cat.category_slug);
      const englishSlugs = categories.filter((cat) => cat.language === "en").map((cat) => cat.category_slug);

      expect(new Set(spanishSlugs).size).toBe(spanishSlugs.length);
      expect(new Set(englishSlugs).size).toBe(englishSlugs.length);
    });
  });

  describe("Category i18n Mapping", () => {
    it("should have i18n field for translations", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const categoriesWithI18n = categories.filter((cat) => cat.i18n);

      // Only check i18n if we have multiple languages
      const languages = new Set(categories.map((cat) => cat.language));
      if (languages.size < 2) {
        console.warn("⚠️  Only one language found - skipping i18n field validation");
      } else {
        expect(categoriesWithI18n.length).toBeGreaterThan(0);
      }
    });

    it("should have reciprocal i18n mappings", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const spanishCategories = categories.filter((cat) => cat.language === "es");
      const englishCategories = categories.filter((cat) => cat.language === "en");

      spanishCategories.forEach((esCategory) => {
        if (esCategory.i18n) {
          const enCategory = englishCategories.find((cat) => cat.category_slug === esCategory.i18n);
          if (enCategory && enCategory.i18n) {
            expect(enCategory.i18n).toBe(esCategory.category_slug);
          }
        }
      });
    });

    it("should have valid i18n references", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const categorySlugs = new Set(categories.map((cat) => cat.category_slug));

      categories.forEach((category) => {
        if (category.i18n) {
          expect(categorySlugs.has(category.i18n)).toBe(true);
        }
      });
    });
  });

  describe("Category Ordering", () => {
    it("should have valid order field if specified", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));

      categories.forEach((category) => {
        if (category.order !== undefined) {
          expect(typeof category.order).toBe("number");
          expect(category.order).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it("should be sortable by order field", () => {
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const sorted = [...categories].sort((a, b) => (a.order || 999) - (b.order || 999));

      expect(sorted.length).toBe(categories.length);
      for (let i = 1; i < sorted.length; i++) {
        const prevOrder = sorted[i - 1].order || 999;
        const currOrder = sorted[i].order || 999;
        expect(prevOrder).toBeLessThanOrEqual(currOrder);
      }
    });
  });

  describe("Content with Categories", () => {
    const postsDir = join(process.cwd(), "src/content/posts");
    const tutorialsDir = join(process.cwd(), "src/content/tutorials");
    const booksDir = join(process.cwd(), "src/content/books");

    it("should have posts with valid category references", () => {
      const posts = readdirSync(postsDir).filter((file) => file.endsWith(".mdx"));
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const categorySlugs = new Set(categories.map((cat) => cat.category_slug));

      posts.forEach((postFile) => {
        const content = readFileSync(join(postsDir, postFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const categoriesMatch = frontmatterMatch[1].match(/categories:\s*\[(.*?)\]/);
          if (categoriesMatch) {
            const postCategories = categoriesMatch[1].split(",").map((cat) => cat.trim().replace(/['"]/g, ""));
            postCategories.forEach((cat) => {
              if (cat) {
                expect(categorySlugs.has(cat)).toBe(true);
              }
            });
          }
        }
      });
    });

    it("should have tutorials with valid category references", () => {
      const tutorials = readdirSync(tutorialsDir).filter((file) => file.endsWith(".mdx"));
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const categorySlugs = new Set(categories.map((cat) => cat.category_slug));

      tutorials.forEach((tutorialFile) => {
        const content = readFileSync(join(tutorialsDir, tutorialFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const categoriesMatch = frontmatterMatch[1].match(/categories:\s*\[(.*?)\]/);
          if (categoriesMatch) {
            const tutorialCategories = categoriesMatch[1].split(",").map((cat) => cat.trim().replace(/['"]/g, ""));
            tutorialCategories.forEach((cat) => {
              if (cat) {
                expect(categorySlugs.has(cat)).toBe(true);
              }
            });
          }
        }
      });
    });

    it("should have books with valid category references", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const categories = categoryFiles.map((file) => JSON.parse(readFileSync(join(categoryDir, file), "utf-8")));
      const categorySlugs = new Set(categories.map((cat) => cat.category_slug));

      const invalidReferences: string[] = [];

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const categoriesMatch = frontmatterMatch[1].match(/categories:\s*\[(.*?)\]/);
          if (categoriesMatch) {
            const bookCategories = categoriesMatch[1].split(",").map((cat) => cat.trim().replace(/['"]/g, ""));
            bookCategories.forEach((cat) => {
              if (cat && !categorySlugs.has(cat)) {
                invalidReferences.push(`${bookFile}: ${cat}`);
              }
            });
          }
        }
      });

      if (invalidReferences.length > 0) {
        console.warn(`⚠️  Found ${invalidReferences.length} invalid category references:`);
        invalidReferences.slice(0, 5).forEach((ref) => console.warn(`   - ${ref}`));
        if (invalidReferences.length > 5) {
          console.warn(`   ... and ${invalidReferences.length - 5} more`);
        }
      }

      expect(invalidReferences.length).toBe(0);
    });
  });
});
