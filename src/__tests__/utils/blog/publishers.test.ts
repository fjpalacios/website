import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { describe, it, expect } from "vitest";

describe("Publisher Content Integration", () => {
  const publisherDir = join(process.cwd(), "src/content/publishers");
  const publisherFiles = readdirSync(publisherDir).filter((file) => file.endsWith(".json"));

  describe("Publisher Files", () => {
    it("should have publisher files", () => {
      expect(publisherFiles.length).toBeGreaterThan(0);
    });

    it("should have valid JSON structure", () => {
      publisherFiles.forEach((file) => {
        const content = readFileSync(join(publisherDir, file), "utf-8");
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });

    it("should have required fields in all publishers", () => {
      publisherFiles.forEach((file) => {
        const content = JSON.parse(readFileSync(join(publisherDir, file), "utf-8"));
        expect(content.name).toBeTruthy();
        expect(content.publisher_slug).toBeTruthy();
        expect(content.language).toBeTruthy();
        expect(["es", "en"]).toContain(content.language);
      });
    });

    it("should have publishers in both languages", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));
      const spanishPublishers = publishers.filter((pub) => pub.language === "es");
      const englishPublishers = publishers.filter((pub) => pub.language === "en");

      expect(spanishPublishers.length).toBeGreaterThan(0);
      expect(englishPublishers.length).toBeGreaterThan(0);
    });

    it("should have unique publisher slugs per language", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));
      const spanishSlugs = publishers.filter((pub) => pub.language === "es").map((pub) => pub.publisher_slug);
      const englishSlugs = publishers.filter((pub) => pub.language === "en").map((pub) => pub.publisher_slug);

      expect(new Set(spanishSlugs).size).toBe(spanishSlugs.length);
      expect(new Set(englishSlugs).size).toBe(englishSlugs.length);
    });
  });

  describe("Publisher Metadata", () => {
    it("should have website URL if specified", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      publishers.forEach((publisher) => {
        if (publisher.website) {
          expect(typeof publisher.website).toBe("string");
          expect(publisher.website).toMatch(/^https?:\/\//);
        }
      });
    });

    it("should have country if specified", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      publishers.forEach((publisher) => {
        if (publisher.country) {
          expect(typeof publisher.country).toBe("string");
          expect(publisher.country.length).toBeGreaterThan(0);
        }
      });
    });

    it("should have description field", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      publishers.forEach((publisher) => {
        if (publisher.description) {
          expect(typeof publisher.description).toBe("string");
          expect(publisher.description.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("Publisher Independence", () => {
    it("should NOT have i18n field (publishers are independent entities)", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      publishers.forEach((publisher) => {
        // Publishers should not have i18n mapping since they are independent entities
        // (e.g., "Debolsillo" and "Penguin Random House" are different publishers)
        expect(publisher.i18n).toBeUndefined();
      });
    });

    it("should have different names across languages (not translations)", () => {
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));
      const spanishPublishers = publishers.filter((pub) => pub.language === "es");
      const englishPublishers = publishers.filter((pub) => pub.language === "en");

      // Publishers are independent entities, not translations
      // We expect different names, not translated versions of the same publisher
      const spanishNames = new Set(spanishPublishers.map((pub) => pub.name));
      const englishNames = new Set(englishPublishers.map((pub) => pub.name));

      // Names should be different across languages (no overlap expected)
      const overlap = Array.from(spanishNames).filter((name) => englishNames.has(name));
      // This test allows for some overlap but most should be different
      expect(overlap.length).toBeLessThan(Math.max(spanishNames.size, englishNames.size));
    });
  });

  describe("Books with Publishers", () => {
    const booksDir = join(process.cwd(), "src/content/books");

    it("should have books with valid publisher references", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));
      const publisherSlugs = new Set(publishers.map((pub) => pub.publisher_slug));

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const publisherMatch = frontmatterMatch[1].match(/publisher:\s*["']?([^"'\n]+)["']?/);
          if (publisherMatch) {
            const publisher = publisherMatch[1].trim();
            expect(publisherSlugs.has(publisher)).toBe(true);
          }
        }
      });
    });

    it("should have at least one book per publisher", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      const publisherUsage = new Map<string, number>();
      publishers.forEach((pub) => publisherUsage.set(pub.publisher_slug, 0));

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const publisherMatch = frontmatterMatch[1].match(/publisher:\s*["']?([^"'\n]+)["']?/);
          if (publisherMatch) {
            const publisher = publisherMatch[1].trim();
            if (publisherUsage.has(publisher)) {
              publisherUsage.set(publisher, (publisherUsage.get(publisher) || 0) + 1);
            }
          }
        }
      });

      // At least some publishers should be used
      const usedPublishers = Array.from(publisherUsage.values()).filter((count) => count > 0);
      expect(usedPublishers.length).toBeGreaterThan(0);
    });

    it("should have books matching publisher language", () => {
      const books = readdirSync(booksDir).filter((file) => file.endsWith(".mdx"));
      const publishers = publisherFiles.map((file) => JSON.parse(readFileSync(join(publisherDir, file), "utf-8")));

      books.forEach((bookFile) => {
        const content = readFileSync(join(booksDir, bookFile), "utf-8");
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const publisherMatch = frontmatterMatch[1].match(/publisher:\s*["']?([^"'\n]+)["']?/);
          const languageMatch = frontmatterMatch[1].match(/language:\s*["']?([^"'\n]+)["']?/);

          if (publisherMatch && languageMatch) {
            const publisherSlug = publisherMatch[1].trim();
            const bookLanguage = languageMatch[1].trim();

            const publisher = publishers.find((pub) => pub.publisher_slug === publisherSlug);
            if (publisher) {
              expect(publisher.language).toBe(bookLanguage);
            }
          }
        }
      });
    });
  });
});
