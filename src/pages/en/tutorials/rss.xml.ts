import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { generateSingleCollectionFeed } from "@/utils/rss/generator";

import { t } from "../../../locales";

export async function GET(context: APIContext) {
  const allTutorials = await getCollection("tutorials");

  const feedData = generateSingleCollectionFeed(allTutorials, {
    title: t("en", "rss.tutorialsTitle"),
    description: t("en", "rss.tutorialsDescription"),
    site: context.site!.toString(),
    language: "en",
  });

  return rss(feedData);
}
