import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, it } from "vitest";

import JsonLd from "../../components/JsonLd.astro";

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

  const scriptContent = html.match(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/i)?.[1];
  expect(scriptContent).toBeDefined();

  if (scriptContent === undefined) {
    throw new Error("JSON-LD script content was not rendered");
  }

  expect(scriptContent).not.toContain("</script>");
  expect(scriptContent).toContain("\\u003c/script\\u003e");
  expect(JSON.parse(scriptContent)).toEqual(hostileSchema);
});
