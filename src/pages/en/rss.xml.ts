import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const books = await getCollection("books", ({ data }) => data.language === "en");
  const posts = await getCollection("posts", ({ data }) => data.language === "en");
  const tutorials = await getCollection("tutorials", ({ data }) => data.language === "en");

  const allContent = [...books, ...posts, ...tutorials].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Blog in English",
    description: "Personal blog about books, programming and technology",
    site: context.site!,
    customData: `<language>en</language>`,
    items: allContent.map((item) => {
      const isBook = item.collection === "books";
      const isTutorial = item.collection === "tutorials";

      // Build the correct URL based on content type
      let link = "";
      if (isBook) {
        link = `/en/books/${item.data.post_slug}`;
      } else if (isTutorial) {
        link = `/en/tutorials/${item.data.post_slug}`;
      } else {
        link = `/en/posts/${item.data.post_slug}`;
      }

      return {
        title: item.data.title,
        pubDate: item.data.date,
        description: item.data.excerpt,
        link,
      };
    }),
  });
}
