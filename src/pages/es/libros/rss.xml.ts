import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

export async function GET(context: APIContext) {
  const allBooks = await getCollection("books");

  const feedData = generateSingleCollectionFeed(allBooks, {
    title: "fjp.es - Reseñas de Libros",
    description: "Reseñas y opiniones sobre libros de ficción, terror, suspense y más",
    site: context.site!.toString(),
    language: "es",
  });

  return rss(feedData);
}
