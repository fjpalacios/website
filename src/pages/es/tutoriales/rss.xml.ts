import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allTutorials = await getCollection("tutorials");
  const spanishTutorials = allTutorials
    .filter((tutorial) => tutorial.data.language === "es")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Tutoriales de Programación",
    description: "Tutoriales sobre JavaScript, Git, desarrollo web y más",
    site: context.site!,
    customData: `<language>es</language>`,
    items: spanishTutorials.map((tutorial) => ({
      title: tutorial.data.title,
      pubDate: tutorial.data.date,
      description: tutorial.data.excerpt,
      link: `/es/tutoriales/${tutorial.data.post_slug}`,
      customData: `<language>es</language>`,
    })),
  });
}
