import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateBilingualFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const books = await getCollection("books");
  const posts = await getCollection("posts");
  const tutorials = await getCollection("tutorials");

  const feedData = generateBilingualFeed([books, posts, tutorials], {
    title: "fjp.es - Blog (All Languages)",
    description:
      "Blog personal sobre libros, programación y tecnología / Personal blog about books, programming and technology",
    site: context.site!.toString(),
  });

  return rss(feedData);
}
