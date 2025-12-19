import { about as aboutEn } from "@content/en/about";
import { contact as contactEn } from "@content/en/contact";
import { resume as resumeEn } from "@content/en/resume";
import { about as aboutEs } from "@content/es/about";
import { contact as contactEs } from "@content/es/contact";
import { resume as resumeEs } from "@content/es/resume";
import { describe, it, expect } from "vitest";

describe("Content data validation", () => {
  describe("Resume content", () => {
    it("should have valid Spanish resume data", () => {
      expect(resumeEs).toBeDefined();
      expect(resumeEs.me).toBeDefined();
      expect(typeof resumeEs.me).toBe("string");
      expect(Array.isArray(resumeEs.experience)).toBe(true);
      expect(Array.isArray(resumeEs.education)).toBe(true);
    });

    it("should have valid English resume data", () => {
      expect(resumeEn).toBeDefined();
      expect(resumeEn.me).toBeDefined();
      expect(typeof resumeEn.me).toBe("string");
      expect(Array.isArray(resumeEn.experience)).toBe(true);
      expect(Array.isArray(resumeEn.education)).toBe(true);
    });

    it("should have experience with required fields", () => {
      const firstExp = resumeEs.experience[0];
      expect(firstExp.name).toBeDefined();
      expect(firstExp.dates).toBeDefined();
      expect(firstExp.desc).toBeDefined();
      expect(typeof firstExp.name).toBe("string");
      expect(typeof firstExp.dates).toBe("string");
      expect(typeof firstExp.desc).toBe("string");
    });

    it("should have projects with languages array", () => {
      expect(Array.isArray(resumeEs.projects)).toBe(true);
      if (resumeEs.projects.length > 0) {
        const firstProject = resumeEs.projects[0];
        expect(Array.isArray(firstProject.languages)).toBe(true);
        expect(firstProject.languages.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Contact content", () => {
    it("should have valid Spanish contact data", () => {
      expect(Array.isArray(contactEs)).toBe(true);
      expect(contactEs.length).toBeGreaterThan(0);
    });

    it("should have valid English contact data", () => {
      expect(Array.isArray(contactEn)).toBe(true);
      expect(contactEn.length).toBeGreaterThan(0);
    });

    it("should have contact items with required fields", () => {
      const firstContact = contactEs[0];
      expect(firstContact.name).toBeDefined();
      expect(firstContact.link).toBeDefined();
      expect(firstContact.icon).toBeDefined();
      expect(firstContact.text).toBeDefined();
      expect(typeof firstContact.link).toBe("string");
      expect(firstContact.link).toMatch(/^(https?:\/\/|mailto:|tel:)/);
    });

    it("should have consistent contact structure across languages", () => {
      expect(contactEs.length).toBe(contactEn.length);
    });
  });

  describe("About content", () => {
    it("should have valid Spanish about data", () => {
      expect(aboutEs).toBeDefined();
      expect(aboutEs.me).toBeDefined();
      expect(typeof aboutEs.me).toBe("string");
      expect(aboutEs.me.length).toBeGreaterThan(0);
    });

    it("should have valid English about data", () => {
      expect(aboutEn).toBeDefined();
      expect(aboutEn.me).toBeDefined();
      expect(typeof aboutEn.me).toBe("string");
      expect(aboutEn.me.length).toBeGreaterThan(0);
    });

    it("should have internet section if defined", () => {
      if (aboutEs.internet) {
        expect(typeof aboutEs.internet).toBe("string");
      }
    });
  });

  describe("Data consistency", () => {
    it("should have the same sections structure in both languages", () => {
      expect(Object.keys(resumeEs).sort()).toEqual(Object.keys(resumeEn).sort());
    });

    it("should have all experience items with dates", () => {
      [...resumeEs.experience, ...resumeEn.experience].forEach((item) => {
        expect(item.dates).toBeDefined();
        expect(item.dates.length).toBeGreaterThan(0);
      });
    });

    it("should have valid URLs where specified", () => {
      const allItems = [...resumeEs.experience, ...resumeEn.experience, ...resumeEs.education, ...resumeEn.education];

      allItems.forEach((item) => {
        if (item.url) {
          expect(item.url).toMatch(/^https?:\/\//);
        }
      });
    });
  });
});
