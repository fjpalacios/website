import { describe, it, expect } from "vitest";

import { renderScoreEmoji, getScoreText, getScoreAriaLabel, getScoreClass } from "@/utils/book/scoreFormatter";

describe("scoreFormatter", () => {
  describe("renderScoreEmoji", () => {
    it('should render 5 hearts for "fav" score', () => {
      expect(renderScoreEmoji("fav")).toBe("❤️❤️❤️❤️❤️");
    });

    it("should render 5 filled stars for score 5", () => {
      expect(renderScoreEmoji(5)).toBe("★★★★★");
    });

    it("should render 4 filled and 1 empty star for score 4", () => {
      expect(renderScoreEmoji(4)).toBe("★★★★☆");
    });

    it("should render 3 filled and 2 empty stars for score 3", () => {
      expect(renderScoreEmoji(3)).toBe("★★★☆☆");
    });

    it("should render 2 filled and 3 empty stars for score 2", () => {
      expect(renderScoreEmoji(2)).toBe("★★☆☆☆");
    });

    it("should render 1 filled and 4 empty stars for score 1", () => {
      expect(renderScoreEmoji(1)).toBe("★☆☆☆☆");
    });

    it("should render 5 empty stars for invalid score 0", () => {
      expect(renderScoreEmoji(0)).toBe("☆☆☆☆☆");
    });

    it("should handle negative scores as invalid (empty stars)", () => {
      expect(renderScoreEmoji(-1)).toBe("☆☆☆☆☆");
    });

    it("should handle scores above 5 as invalid (empty stars)", () => {
      expect(renderScoreEmoji(10)).toBe("☆☆☆☆☆");
    });
  });

  describe("getScoreText", () => {
    describe("English (en)", () => {
      it('should return "Favorite" for "fav" score', () => {
        expect(getScoreText("fav", "en")).toBe("Favorite");
      });

      it('should return "5/5" for score 5', () => {
        expect(getScoreText(5, "en")).toBe("5/5");
      });

      it('should return "4/5" for score 4', () => {
        expect(getScoreText(4, "en")).toBe("4/5");
      });

      it('should return "1/5" for score 1', () => {
        expect(getScoreText(1, "en")).toBe("1/5");
      });

      it('should return "0/5" for invalid score 0', () => {
        expect(getScoreText(0, "en")).toBe("0/5");
      });
    });

    describe("Spanish (es)", () => {
      it('should return "Favorito" for "fav" score', () => {
        expect(getScoreText("fav", "es")).toBe("Favorito");
      });

      it('should return "5/5" for score 5', () => {
        expect(getScoreText(5, "es")).toBe("5/5");
      });

      it('should return "4/5" for score 4', () => {
        expect(getScoreText(4, "es")).toBe("4/5");
      });

      it('should return "1/5" for score 1', () => {
        expect(getScoreText(1, "es")).toBe("1/5");
      });

      it('should return "0/5" for invalid score 0', () => {
        expect(getScoreText(0, "es")).toBe("0/5");
      });
    });

    describe("Edge cases", () => {
      it("should default to English for unknown language", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(getScoreText(5, "fr" as any)).toBe("5/5");
      });

      it("should handle negative scores", () => {
        expect(getScoreText(-1, "en")).toBe("-1/5");
      });

      it("should handle scores above 5", () => {
        expect(getScoreText(10, "en")).toBe("10/5");
      });
    });
  });

  describe("getScoreAriaLabel", () => {
    describe("English (en)", () => {
      it('should return "Rated as favorite" for "fav"', () => {
        expect(getScoreAriaLabel("fav", "en")).toBe("Rated as favorite");
      });

      it('should return "Rated 5 out of 5 stars" for score 5', () => {
        expect(getScoreAriaLabel(5, "en")).toBe("Rated 5 out of 5 stars");
      });

      it('should return "Rated 4 out of 5 stars" for score 4', () => {
        expect(getScoreAriaLabel(4, "en")).toBe("Rated 4 out of 5 stars");
      });

      it('should return "Rated 1 out of 5 stars" for score 1', () => {
        expect(getScoreAriaLabel(1, "en")).toBe("Rated 1 out of 5 stars");
      });

      it('should return "Rated 0 out of 5 stars" for invalid score 0', () => {
        expect(getScoreAriaLabel(0, "en")).toBe("Rated 0 out of 5 stars");
      });
    });

    describe("Spanish (es)", () => {
      it('should return "Marcado como favorito" for "fav"', () => {
        expect(getScoreAriaLabel("fav", "es")).toBe("Marcado como favorito");
      });

      it('should return "Puntuación 5 de 5 estrellas" for score 5', () => {
        expect(getScoreAriaLabel(5, "es")).toBe("Puntuación 5 de 5 estrellas");
      });

      it('should return "Puntuación 4 de 5 estrellas" for score 4', () => {
        expect(getScoreAriaLabel(4, "es")).toBe("Puntuación 4 de 5 estrellas");
      });

      it('should return "Puntuación 1 de 5 estrellas" for score 1', () => {
        expect(getScoreAriaLabel(1, "es")).toBe("Puntuación 1 de 5 estrellas");
      });

      it('should return "Puntuación 0 de 5 estrellas" for invalid score 0', () => {
        expect(getScoreAriaLabel(0, "es")).toBe("Puntuación 0 de 5 estrellas");
      });
    });

    describe("Edge cases", () => {
      it("should return Spanish aria label for unknown language (defaults to ternary else)", () => {
        // TypeScript strict types prevent non-"en"|"es" values in production
        // but if it happens at runtime, ternary defaults to Spanish (else branch)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(getScoreAriaLabel(5, "de" as any)).toBe("Puntuación 5 de 5 estrellas");
      });
    });
  });

  describe("getScoreClass", () => {
    it('should return "score--favorite" for "fav" score', () => {
      expect(getScoreClass("fav")).toBe("score--favorite");
    });

    it('should return "score--perfect" for score 5', () => {
      expect(getScoreClass(5)).toBe("score--perfect");
    });

    it('should return "score--high" for score 4', () => {
      expect(getScoreClass(4)).toBe("score--high");
    });

    it('should return "score--medium" for score 3', () => {
      expect(getScoreClass(3)).toBe("score--medium");
    });

    it('should return "score--low" for score 2', () => {
      expect(getScoreClass(2)).toBe("score--low");
    });

    it('should return "score--low" for score 1', () => {
      expect(getScoreClass(1)).toBe("score--low");
    });

    it('should return "score--low" for invalid score 0', () => {
      expect(getScoreClass(0)).toBe("score--low");
    });

    it('should return "score--low" for negative scores', () => {
      expect(getScoreClass(-1)).toBe("score--low");
    });

    it('should return "score--perfect" for scores above 5', () => {
      expect(getScoreClass(10)).toBe("score--perfect");
    });
  });
});
