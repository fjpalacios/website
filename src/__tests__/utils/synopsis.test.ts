/**
 * Tests for synopsis processing utilities
 */

import { describe, expect, it } from "vitest";

import { processSynopsis } from "../../utils/synopsis";

describe("processSynopsis", () => {
  it("converts italic markdown to <em> tags", () => {
    const input = "Maestro del _nonsense_, Lewis Carroll";
    const output = processSynopsis(input);
    expect(output).toContain("<em>nonsense</em>");
  });

  it("converts bold markdown to <strong> tags", () => {
    const input = "This is **bold** text";
    const output = processSynopsis(input);
    expect(output).toContain("<strong>bold</strong>");
  });

  it("converts literal \\n to line breaks", () => {
    const input = "Line one\\nLine two";
    const output = processSynopsis(input);
    expect(output).toContain("<br>");
    expect(output).toContain("Line one");
    expect(output).toContain("Line two");
  });

  it("handles multiple markdown formats together", () => {
    const input = "Maestro del _nonsense_, **Lewis Carroll** traspasó";
    const output = processSynopsis(input);
    expect(output).toContain("<em>nonsense</em>");
    expect(output).toContain("<strong>Lewis Carroll</strong>");
  });

  it("returns empty string for empty input", () => {
    expect(processSynopsis("")).toBe("");
  });

  it("handles real synopsis from WordPress", () => {
    const input =
      "Maestro del _nonsense_, Lewis Carroll traspasó en estos textos el umbral que separa la realidad del sueño y se adentró en un territorio sin leyes ni normas donde todo es posible. Alicia, los estrambóticos personajes del País de las Maravillas, los del otro lado del espejo y los pertenecientes a la tripulación en batida contra el Snark ponen así en entredicho todos y cada uno de los postulados lógicos en los que se basa el mundo en que vivimos.\\n\\nAcompañado de las ilustraciones originales de John Tenniel, el presente volumen recoge las formidables traducciones de Luis Maristany, uno de los más consagrados expertos en la obra de Carroll que ha habido en nuestra lengua. A modo de apéndice, además, se incluye una selección de cartas del autor y un pormenorizado estudio de Nina Auerbach, catedrática emérita en la Universidad de Pennsylvania y reconocida especialista en literatura inglesa decimonónica.";
    const output = processSynopsis(input);

    expect(output).toContain("<em>nonsense</em>");
    // Double \n\n creates paragraph break, not <br>
    expect(output).toContain("<p>Acompañado de las ilustraciones");
    expect(output).not.toContain("\\n");
    expect(output).not.toContain("_nonsense_");
  });

  it("handles synopsis without markdown", () => {
    const input = "Plain text without any formatting";
    const output = processSynopsis(input);
    // Marked wraps plain text in <p> tags
    expect(output).toBe("<p>Plain text without any formatting</p>");
  });

  // Regression tests for CodeQL alert #9 (incomplete multi-character
  // sanitization / XSS via raw HTML in synopsis). The previous
  // implementation passed raw HTML through marked and into set:html,
  // which would execute <script> payloads. The fix pre-escapes HTML
  // entities so marked renders them as text.
  it("escapes <script> tags in synopsis (XSS regression)", () => {
    const input = "Hello <script>alert(1)</script>";
    const output = processSynopsis(input);
    expect(output).not.toContain("<script");
    expect(output).not.toContain("</script");
    expect(output).toContain("&lt;script&gt;");
  });

  it("escapes <img> tags with event handlers in synopsis (XSS regression)", () => {
    const input = "Click <img src=x onerror=alert(1)> here";
    const output = processSynopsis(input);
    // The tag itself must be escaped so the browser does not parse it
    // as a live element. The `onerror=` substring will still appear in
    // the rendered text (inside the escaped tag), but that is harmless
    // because it is not an attribute on a live <img> element.
    expect(output).not.toContain("<img");
    expect(output).toContain("&lt;img");
  });

  it("preserves markdown formatting when XSS payload is present", () => {
    // Sanity check: the XSS fix must not break legitimate markdown.
    const input = "A _b_ and **c** with <script>danger</script>";
    const output = processSynopsis(input);
    expect(output).toContain("<em>b</em>");
    expect(output).toContain("<strong>c</strong>");
    expect(output).toContain("&lt;script&gt;");
  });

  it.each(["javascript:alert(1)", "data:text/html,<script>alert(1)</script>"])(
    "does not render executable Markdown URL %s as a link",
    (url: string): void => {
      const output = processSynopsis(`[unsafe](${url})`);

      expect(output).not.toContain("<a href=");
      expect(output).toContain("unsafe");
    },
  );

  it("preserves safe Markdown links", () => {
    const output = processSynopsis("[safe](https://example.com)");

    expect(output).toContain('<a href="https://example.com">safe</a>');
  });
});
