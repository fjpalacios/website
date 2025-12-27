import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const allTutorials = await getCollection("tutorials");

  const feedData = generateSingleCollectionFeed(allTutorials, {
    title: "fjp.es - Programming Tutorials",
    description: "Tutorials about JavaScript, Git, web development and more",
    site: context.site!.toString(),
    language: "en",
  });

  return rss(feedData);
}
