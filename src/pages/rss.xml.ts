import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const books = await getCollection("books");
  const posts = await getCollection("posts");
  const tutorials = await getCollection("tutorials");

  const allPosts = [...books, ...posts, ...tutorials].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Blog (All Languages)",
    description:
      "Blog personal sobre libros, programación y tecnología / Personal blog about books, programming and technology",
    site: context.site!,
    items: allPosts.map((post) => {
      const isBook = post.collection === "books";
      const isTutorial = post.collection === "tutorials";
      const lang = post.data.language || "es";

      // Build the correct URL based on content type and language
      let link = "";
      if (isBook) {
        link = lang === "es" ? `/es/libros/${post.data.post_slug}` : `/en/books/${post.data.post_slug}`;
      } else if (isTutorial) {
        link = lang === "es" ? `/es/tutoriales/${post.data.post_slug}` : `/en/tutorials/${post.data.post_slug}`;
      } else {
        link = lang === "es" ? `/es/publicaciones/${post.data.post_slug}` : `/en/posts/${post.data.post_slug}`;
      }

      return {
        title: `[${lang.toUpperCase()}] ${post.data.title}`,
        pubDate: post.data.date,
        description: post.data.excerpt,
        link,
        customData: `<language>${lang}</language>`,
      };
    }),
  });
}
