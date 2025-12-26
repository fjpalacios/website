import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const books = await getCollection("books", ({ data }) => data.language === "es");
  const posts = await getCollection("posts", ({ data }) => data.language === "es");
  const tutorials = await getCollection("tutorials", ({ data }) => data.language === "es");

  const allContent = [...books, ...posts, ...tutorials].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Blog en Español",
    description: "Blog personal sobre libros, programación y tecnología",
    site: context.site!,
    customData: `<language>es</language>`,
    items: allContent.map((item) => {
      const isBook = item.collection === "books";
      const isTutorial = item.collection === "tutorials";

      // Build the correct URL based on content type
      let link = "";
      if (isBook) {
        link = `/es/libros/${item.data.post_slug}`;
      } else if (isTutorial) {
        link = `/es/tutoriales/${item.data.post_slug}`;
      } else {
        link = `/es/publicaciones/${item.data.post_slug}`;
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
