/**
 * Tests for synopsis processing utilities
 */

import { describe, expect, it } from "vitest";

import { processSynopsis, sanitizeSynopsis } from "../synopsis";

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
});

describe("sanitizeSynopsis", () => {
  it("removes italic markdown", () => {
    const input = "Maestro del _nonsense_, Lewis Carroll";
    const output = sanitizeSynopsis(input);
    expect(output).toBe("Maestro del nonsense, Lewis Carroll");
  });

  it("removes bold markdown", () => {
    const input = "This is **bold** text";
    const output = sanitizeSynopsis(input);
    expect(output).toBe("This is bold text");
  });

  it("converts literal \\n to spaces", () => {
    const input = "Line one\\nLine two";
    const output = sanitizeSynopsis(input);
    expect(output).toBe("Line one Line two");
  });

  it("removes HTML tags", () => {
    const input = "This is <em>italic</em> and <strong>bold</strong>";
    const output = sanitizeSynopsis(input);
    expect(output).toBe("This is italic and bold");
  });

  it("normalizes whitespace", () => {
    const input = "Multiple    spaces   here";
    const output = sanitizeSynopsis(input);
    expect(output).toBe("Multiple spaces here");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeSynopsis("")).toBe("");
  });

  it("handles complex real synopsis", () => {
    const input =
      "Maestro del _nonsense_, Lewis Carroll traspasó en estos textos.\\n\\nAcompañado de las ilustraciones **originales** de John Tenniel.";
    const output = sanitizeSynopsis(input);

    expect(output).not.toContain("_");
    expect(output).not.toContain("**");
    expect(output).not.toContain("\\n");
    expect(output).not.toContain("<");
    expect(output).toContain("nonsense");
    expect(output).toContain("originales");
  });
});
