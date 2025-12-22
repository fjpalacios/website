import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allBooks = await getCollection("books");
  const spanishBooks = allBooks
    .filter((book) => book.data.language === "es")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Reseñas de Libros",
    description: "Reseñas y opiniones sobre libros de ficción, terror, suspense y más",
    site: context.site!,
    items: spanishBooks.map((book) => ({
      title: book.data.title,
      pubDate: book.data.date,
      description: book.data.excerpt,
      link: `/es/libros/${book.data.post_slug}`,
      customData: `<language>es</language>`,
    })),
  });
}
