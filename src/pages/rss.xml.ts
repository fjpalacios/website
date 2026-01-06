import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateBilingualFeed } from "@/utils/rss/generator";

import { t } from "../locales";

export async function GET(context: APIContext) {
  const books = await getCollection("books");
  const posts = await getCollection("posts");
  const tutorials = await getCollection("tutorials");

  const feedData = generateBilingualFeed([books, posts, tutorials], {
    title: t("es", "rss.mainTitle"),
    description: t("es", "rss.mainDescription"),
    site: context.site!.toString(),
  });

  return rss(feedData);
}
