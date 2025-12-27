import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const allBooks = await getCollection("books");

  const feedData = generateSingleCollectionFeed(allBooks, {
    title: "fjp.es - Book Reviews",
    description: "Reviews and opinions about fiction, horror, thriller and more",
    site: context.site!.toString(),
    language: "en",
  });

  return rss(feedData);
}
