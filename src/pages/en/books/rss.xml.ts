import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allBooks = await getCollection("books");
  const englishBooks = allBooks
    .filter((book) => book.data.language === "en")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Book Reviews",
    description: "Reviews and opinions about fiction, horror, thriller and more",
    site: context.site!,
    customData: `<language>en</language>`,
    items: englishBooks.map((book) => ({
      title: book.data.title,
      pubDate: book.data.date,
      description: book.data.excerpt,
      link: `/en/books/${book.data.post_slug}`,
      customData: `<language>en</language>`,
    })),
  });
}
