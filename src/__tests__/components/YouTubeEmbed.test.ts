// Tests for YouTubeEmbed component
// Verifies façade pattern: thumbnail shown initially, iframe loaded only on user interaction

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("YouTubeEmbed Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/blog/YouTubeEmbed.astro");
  const scssPath = path.resolve(__dirname, "../../styles/components/youtube-embed.scss");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it("should have Props interface with required id and optional title", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain("interface Props");
    expect(content).toContain("id: string");
    expect(content).toContain("title?:");
  });

  it("should use YouTube thumbnail instead of loading iframe directly", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Façade: show thumbnail on load
    expect(content).toContain("i.ytimg.com/vi/");
    expect(content).toContain("hqdefault.jpg");
  });

  it("should render thumbnail with lazy loading and explicit dimensions", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain('loading="lazy"');
    expect(content).toContain("width=");
    expect(content).toContain("height=");
  });

  it("should have a play button with accessible aria-label", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain('type="button"');
    expect(content).toContain("aria-label");
  });

  it("should not render an iframe directly in the HTML markup", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // The iframe must be created by JS on click, not statically in the template
    expect(content).not.toContain("<iframe");
  });

  it("should create iframe dynamically on play button click", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain("createElement");
    expect(content).toContain("iframe");
    expect(content).toContain("click");
  });

  it("should inject autoplay parameter when loading the iframe", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain("autoplay=1");
  });

  it("should inject the iframe inside the wrapper (keeps CSS styles intact)", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // Wrapper is preserved so aspect-ratio/border-radius CSS stays applied
    expect(content).toContain("appendChild");
    expect(content).not.toContain("replaceWith");
  });

  it("should use BEM class structure", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain("youtube-embed");
    expect(content).toContain("youtube-embed__thumbnail");
    expect(content).toContain("youtube-embed__play");
    expect(content).toContain("youtube-embed__iframe");
  });

  it("should not set frameborder as an HTML attribute or JS property", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    // frameborder="0" as attribute or iframe.frameBorder as JS property are both deprecated
    expect(content).not.toContain('frameborder="');
    expect(content).not.toContain("frameBorder");
    expect(content).not.toContain('setAttribute("frameborder"');
  });

  it("should import the SCSS file", () => {
    const content = fs.readFileSync(componentPath, "utf-8");

    expect(content).toContain("youtube-embed.scss");
  });

  it("should have the SCSS file with play button, thumbnail and iframe styles", () => {
    expect(fs.existsSync(scssPath)).toBe(true);

    const scss = fs.readFileSync(scssPath, "utf-8");

    // BEM selectors use the &__ nesting shorthand in SCSS
    expect(scss).toContain("&__play");
    expect(scss).toContain("&__thumbnail");
    expect(scss).toContain("&__iframe");
  });

  it("should set border: 0 on iframe via CSS (not deprecated frameborder attribute)", () => {
    const scss = fs.readFileSync(scssPath, "utf-8");

    expect(scss).toContain("border: 0");
  });
});
