import { describe, expect, it } from "vitest";

import { formatVintageDate } from "@/utils/dateFormat";

describe("formatVintageDate", () => {
  describe("visual format (Roman numerals)", () => {
    it("should format date with Roman numeral month", () => {
      const date = new Date("2024-12-01");
      const result = formatVintageDate(date, "es");

      expect(result.visual).toBe("1-XII-24");
    });

    it("should handle all months correctly", () => {
      const months = [
        { date: new Date("2024-01-15"), expected: "15-I-24" },
        { date: new Date("2024-02-20"), expected: "20-II-24" },
        { date: new Date("2024-03-05"), expected: "5-III-24" },
        { date: new Date("2024-04-10"), expected: "10-IV-24" },
        { date: new Date("2024-05-25"), expected: "25-V-24" },
        { date: new Date("2024-06-30"), expected: "30-VI-24" },
        { date: new Date("2024-07-14"), expected: "14-VII-24" },
        { date: new Date("2024-08-08"), expected: "8-VIII-24" },
        { date: new Date("2024-09-17"), expected: "17-IX-24" },
        { date: new Date("2024-10-22"), expected: "22-X-24" },
        { date: new Date("2024-11-11"), expected: "11-XI-24" },
        { date: new Date("2024-12-31"), expected: "31-XII-24" },
      ];

      months.forEach(({ date, expected }) => {
        const result = formatVintageDate(date, "es");
        expect(result.visual).toBe(expected);
      });
    });

    it("should use two-digit year", () => {
      const date1 = new Date("2024-06-15");
      const date2 = new Date("1999-06-15");
      const date3 = new Date("2005-06-15");

      expect(formatVintageDate(date1, "es").visual).toBe("15-VI-24");
      expect(formatVintageDate(date2, "es").visual).toBe("15-VI-99");
      expect(formatVintageDate(date3, "es").visual).toBe("15-VI-05");
    });
  });

  describe("aria label (accessibility)", () => {
    it("should provide Spanish accessible text", () => {
      const date = new Date("2024-12-01");
      const result = formatVintageDate(date, "es");

      // Should be like "1 de diciembre de 2024"
      expect(result.aria).toContain("diciembre");
      expect(result.aria).toContain("2024");
      expect(result.aria).toContain("1");
    });

    it("should provide English accessible text", () => {
      const date = new Date("2024-12-01");
      const result = formatVintageDate(date, "en");

      // Should be like "December 1, 2024"
      expect(result.aria).toContain("December");
      expect(result.aria).toContain("2024");
      expect(result.aria).toContain("1");
    });

    it("should default to Spanish when no lang provided", () => {
      const date = new Date("2024-03-15");
      const result = formatVintageDate(date);

      expect(result.aria).toContain("marzo");
    });
  });

  describe("datetime attribute (machine-readable)", () => {
    it("should provide ISO format datetime", () => {
      const date = new Date("2024-12-01");
      const result = formatVintageDate(date, "es");

      expect(result.datetime).toBe("2024-12-01");
    });

    it("should handle different dates correctly", () => {
      const dates = [
        { input: new Date("2024-01-01"), expected: "2024-01-01" },
        { input: new Date("2024-06-15"), expected: "2024-06-15" },
        { input: new Date("2024-12-31"), expected: "2024-12-31" },
        { input: new Date("1999-07-20"), expected: "1999-07-20" },
      ];

      dates.forEach(({ input, expected }) => {
        const result = formatVintageDate(input, "es");
        expect(result.datetime).toBe(expected);
      });
    });
  });

  describe("all format properties together", () => {
    it("should return all three format properties", () => {
      const date = new Date("2024-12-01");
      const result = formatVintageDate(date, "es");

      expect(result).toHaveProperty("visual");
      expect(result).toHaveProperty("aria");
      expect(result).toHaveProperty("datetime");
    });

    it("should have consistent data across all formats", () => {
      const date = new Date("2024-06-15");
      const result = formatVintageDate(date, "es");

      // Visual: 15-VI-24
      expect(result.visual).toBe("15-VI-24");

      // Aria: Should mention June (junio)
      expect(result.aria).toContain("junio");

      // Datetime: 2024-06-15
      expect(result.datetime).toBe("2024-06-15");
    });
  });
});
