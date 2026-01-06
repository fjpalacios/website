import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateMultiCollectionFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const books = await getCollection("books");
  const posts = await getCollection("posts");
  const tutorials = await getCollection("tutorials");

  const feedData = generateMultiCollectionFeed([books, posts, tutorials], {
    title: "fjp.es - Blog en Español",
    description: "Blog personal sobre libros, programación y tecnología",
    site: context.site!.toString(),
    language: "es",
  });

  return rss(feedData);
}
