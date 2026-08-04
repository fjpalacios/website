import JsonLd from "@components/JsonLd.astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { Window } from "happy-dom";
import { expect, it } from "vitest";

it("renders hostile JSON-LD values without breaking out of the script", async (): Promise<void> => {
  const container = await AstroContainer.create();
  const hostileSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    description: "</script><script>alert(1)</script>",
  };

  const html = await container.renderToString(JsonLd, {
    props: { schema: hostileSchema },
  });

  const testWindow = new Window();

  try {
    testWindow.document.body.innerHTML = html;
    const script = testWindow.document.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();

    if (script === null) {
      throw new Error("JSON-LD script was not rendered");
    }

    const scriptContent = script.textContent;

    expect(scriptContent).not.toContain("</script>");
    expect(scriptContent).toContain("\\u003c/script\\u003e");
    expect(JSON.parse(scriptContent)).toEqual(hostileSchema);
  } finally {
    testWindow.close();
  }
});
