import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allTutorials = await getCollection("tutorials");
  const englishTutorials = allTutorials
    .filter((tutorial) => tutorial.data.language === "en")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Programming Tutorials",
    description: "Tutorials about JavaScript, Git, web development and more",
    site: context.site!,
    customData: `<language>en</language>`,
    items: englishTutorials.map((tutorial) => ({
      title: tutorial.data.title,
      pubDate: tutorial.data.date,
      description: tutorial.data.excerpt,
      link: `/en/tutorials/${tutorial.data.post_slug}`,
      customData: `<language>en</language>`,
    })),
  });
}
