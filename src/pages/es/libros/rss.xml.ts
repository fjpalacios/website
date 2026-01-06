import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

import { t } from "../../../locales";

export async function GET(context: APIContext) {
  const allBooks = await getCollection("books");

  const feedData = generateSingleCollectionFeed(allBooks, {
    title: t("es", "rss.booksTitle"),
    description: t("es", "rss.booksDescription"),
    site: context.site!.toString(),
    language: "es",
  });

  return rss(feedData);
}
