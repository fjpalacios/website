import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const allTutorials = await getCollection("tutorials");

  const feedData = generateSingleCollectionFeed(allTutorials, {
    title: "fjp.es - Tutoriales de Programación",
    description: "Tutoriales sobre JavaScript, Git, desarrollo web y más",
    site: context.site!.toString(),
    language: "es",
  });

  return rss(feedData);
}
