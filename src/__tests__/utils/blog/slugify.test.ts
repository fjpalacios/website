import { describe, it, expect } from "vitest";

// This will fail initially - we haven't implemented slugify yet
// That's the point of TDD: RED -> GREEN -> REFACTOR
describe("slugify", () => {
  describe("Basic slugification", () => {
    it("should convert simple text to slug", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("The Quick Brown Fox")).toBe("the-quick-brown-fox");
    });

    it("should handle single words", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Hello")).toBe("hello");
      expect(slugify("Test")).toBe("test");
    });

    it("should convert to lowercase", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("UPPERCASE")).toBe("uppercase");
      expect(slugify("MiXeD CaSe")).toBe("mixed-case");
    });
  });

  describe("Spanish characters", () => {
    it("should handle Spanish accents and tildes", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Apocalipsis, de Stephen King")).toBe("apocalipsis-de-stephen-king");
      expect(slugify("La princesa de hielo")).toBe("la-princesa-de-hielo");
      expect(slugify("José María")).toBe("jose-maria");
      expect(slugify("Año nuevo")).toBe("ano-nuevo");
    });

    it("should handle ñ character", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("España")).toBe("espana");
      expect(slugify("Niño")).toBe("nino");
      expect(slugify("Mañana")).toBe("manana");
    });

    it("should handle all Spanish vowels with accents", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("á é í ó ú")).toBe("a-e-i-o-u");
      expect(slugify("Á É Í Ó Ú")).toBe("a-e-i-o-u");
      expect(slugify("àèìòù")).toBe("aeiou");
      expect(slugify("äëïöü")).toBe("aeiou");
    });
  });

  describe("Punctuation and special characters", () => {
    it("should remove commas and periods", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Hello, World.")).toBe("hello-world");
      expect(slugify("Test. Another. Test.")).toBe("test-another-test");
    });

    it("should handle question marks and exclamation marks", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("¿Qué es Git?")).toBe("que-es-git");
      expect(slugify("¡Hola Mundo!")).toBe("hola-mundo");
      expect(slugify("What? Why?")).toBe("what-why");
    });

    it("should handle colons and semicolons", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Chapter: Introduction")).toBe("chapter-introduction");
      expect(slugify("Note; Remember this")).toBe("note-remember-this");
    });

    it("should handle parentheses and brackets", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Book (2017)")).toBe("book-2017");
      expect(slugify("Test [Updated]")).toBe("test-updated");
      expect(slugify("Example {New}")).toBe("example-new");
    });

    it("should handle quotes and apostrophes", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("It's a test")).toBe("its-a-test");
      expect(slugify('"Quoted text"')).toBe("quoted-text");
      expect(slugify("'Single quotes'")).toBe("single-quotes");
    });

    it("should handle slashes and backslashes", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Path/To/File")).toBe("path-to-file");
      expect(slugify("Windows\\Path")).toBe("windows-path");
    });

    it("should handle ampersands and symbols", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Rock & Roll")).toBe("rock-roll");
      expect(slugify("Price: $100")).toBe("price-100");
      expect(slugify("Email: test@example.com")).toBe("email-test-example-com");
    });
  });

  describe("Whitespace handling", () => {
    it("should replace multiple spaces with single dash", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Multiple    spaces")).toBe("multiple-spaces");
      expect(slugify("Test     with     gaps")).toBe("test-with-gaps");
    });

    it("should trim leading and trailing spaces", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("  Hello World  ")).toBe("hello-world");
      expect(slugify("   Trimmed   ")).toBe("trimmed");
    });

    it("should handle tabs and newlines", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Hello\tWorld")).toBe("hello-world");
      expect(slugify("Line1\nLine2")).toBe("line1-line2");
      expect(slugify("Test\r\nWindows")).toBe("test-windows");
    });
  });

  describe("Multiple dashes", () => {
    it("should replace multiple dashes with single dash", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Test---Multiple")).toBe("test-multiple");
      expect(slugify("Many-----Dashes")).toBe("many-dashes");
    });

    it("should remove leading and trailing dashes", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("-Leading Dash")).toBe("leading-dash");
      expect(slugify("Trailing Dash-")).toBe("trailing-dash");
      expect(slugify("-Both Sides-")).toBe("both-sides");
    });
  });

  describe("Numbers", () => {
    it("should preserve numbers in slug", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Chapter 1")).toBe("chapter-1");
      expect(slugify("Year 2017")).toBe("year-2017");
      expect(slugify("Test 123 ABC")).toBe("test-123-abc");
    });

    it("should handle numbers with special characters", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Version 1.0.0")).toBe("version-1-0-0");
      expect(slugify("Price: $1,000")).toBe("price-1-000");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("")).toBe("");
    });

    it("should handle string with only special characters", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("!!!")).toBe("");
      expect(slugify("###")).toBe("");
      expect(slugify("...")).toBe("");
    });

    it("should handle string with only spaces", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("   ")).toBe("");
      expect(slugify("\t\t\t")).toBe("");
    });

    it("should handle very long strings", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      const longString = "This is a very long string that could potentially be used as a title".repeat(3);
      const result = slugify(longString);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9-]+$/);
      expect(result.startsWith("-")).toBe(false);
      expect(result.endsWith("-")).toBe(false);
    });
  });

  describe("Real book titles from Gatsby blog", () => {
    it("should handle actual book titles correctly", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      // Real examples from your Gatsby blog
      expect(slugify("Apocalipsis, de Stephen King")).toBe("apocalipsis-de-stephen-king");
      expect(slugify("La princesa de hielo, de Camilla Läckberg")).toBe("la-princesa-de-hielo-de-camilla-lackberg");
      expect(slugify("Harry Potter y el cáliz de fuego")).toBe("harry-potter-y-el-caliz-de-fuego");
      expect(slugify("Cuentos de Navidad, de Charles Dickens")).toBe("cuentos-de-navidad-de-charles-dickens");
    });

    it("should handle tutorial titles", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("¿Qué es Git?")).toBe("que-es-git");
      expect(slugify("Cómo instalar Git en Linux, macOS y Windows")).toBe("como-instalar-git-en-linux-macos-y-windows");
    });

    it("should handle post titles", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Libros leídos durante 2017")).toBe("libros-leidos-durante-2017");
    });
  });

  describe("Unicode and emoji", () => {
    it("should remove emojis", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Hello 👋 World")).toBe("hello-world");
      expect(slugify("Test 🚀 Rocket")).toBe("test-rocket");
    });

    it("should handle other Unicode characters", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      expect(slugify("Café")).toBe("cafe");
      expect(slugify("Niño")).toBe("nino");
      expect(slugify("Français")).toBe("francais");
    });
  });

  describe("Consistency", () => {
    it("should produce same slug for same input", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      const input = "Test String";
      const result1 = slugify(input);
      const result2 = slugify(input);

      expect(result1).toBe(result2);
    });

    it("should produce valid URL-safe slugs", async () => {
      const { slugify } = await import("@/utils/blog/slugify");

      const inputs = [
        "Apocalipsis, de Stephen King",
        "¿Qué es Git?",
        "Test & Example",
        "Price: $100",
        "Email: test@example.com",
      ];

      inputs.forEach((input) => {
        const result = slugify(input);
        // Should only contain lowercase letters, numbers, and dashes
        expect(result).toMatch(/^[a-z0-9-]*$/);
        // Should not start or end with dash
        if (result.length > 0) {
          expect(result.startsWith("-")).toBe(false);
          expect(result.endsWith("-")).toBe(false);
        }
      });
    });
  });
});
