// @ts-check
import path from "path";
import { fileURLToPath } from "url";

import mdx from "@astrojs/mdx";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypePrism from "rehype-prism-plus";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://fjp.es",

  // Image optimization configuration
  image: {
    // Use Sharp for image optimization (default, but explicit for clarity)
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false, // Allow large images
      },
    },
    // Default formats for optimization
    // When using <Image>, Astro will generate these formats
    remotePatterns: [], // No remote images for now
  },

  integrations: [
    mdx(),
    sitemap({
      // Customize sitemap entries with priorities and change frequencies
      serialize(item) {
        const url = item.url;

        // Home pages - highest priority
        if (url === "https://fjp.es/es/" || url === "https://fjp.es/en/") {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.DAILY;
        }

        // Content detail pages (books, tutorials, posts) - high priority
        else if (
          url.includes("/libros/") ||
          url.includes("/books/") ||
          url.includes("/tutoriales/") ||
          url.includes("/tutorials/") ||
          url.includes("/publicaciones/")
        ) {
          // Skip pagination pages
          if (url.includes("/pagina/") || url.includes("/page/")) {
            item.priority = 0.3;
            item.changefreq = ChangeFreqEnum.WEEKLY;
          } else {
            item.priority = 0.8;
            item.changefreq = ChangeFreqEnum.MONTHLY;
          }
        }

        // Taxonomy detail pages (authors, categories, genres, etc.) - medium-high priority
        else if (
          url.includes("/autores/") ||
          url.includes("/authors/") ||
          url.includes("/categorias/") ||
          url.includes("/categories/") ||
          url.includes("/generos/") ||
          url.includes("/genres/") ||
          url.includes("/editoriales/") ||
          url.includes("/publishers/") ||
          url.includes("/series/") ||
          url.includes("/retos/") ||
          url.includes("/challenges/") ||
          url.includes("/cursos/") ||
          url.includes("/courses/")
        ) {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        }

        // Index/listing pages - medium priority
        else if (
          url.endsWith("/libros/") ||
          url.endsWith("/books/") ||
          url.endsWith("/tutoriales/") ||
          url.endsWith("/tutorials/") ||
          url.endsWith("/publicaciones/") ||
          url.endsWith("/posts/") ||
          url.endsWith("/autores/") ||
          url.endsWith("/authors/") ||
          url.endsWith("/categorias/") ||
          url.endsWith("/categories/") ||
          url.endsWith("/generos/") ||
          url.endsWith("/genres/") ||
          url.endsWith("/editoriales/") ||
          url.endsWith("/publishers/") ||
          url.endsWith("/series/") ||
          url.endsWith("/retos/") ||
          url.endsWith("/challenges/") ||
          url.endsWith("/cursos/") ||
          url.endsWith("/courses/")
        ) {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        }

        // Static pages (about, feeds) - lower priority
        else if (url.includes("/acerca-de") || url.includes("/about") || url.includes("/feeds")) {
          item.priority = 0.5;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }

        // Default for any other pages
        else {
          item.priority = 0.5;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }

        return item;
      },

      // Support for i18n
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es",
          en: "en",
        },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false, // Disable Shiki
    rehypePlugins: [
      [
        rehypePrism,
        {
          showLineNumbers: true,
          ignoreMissing: true,
        },
      ],
    ],
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@content": path.resolve(__dirname, "./src/content"),
        "@locales": path.resolve(__dirname, "./src/locales"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@scripts": path.resolve(__dirname, "./src/scripts"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@config": path.resolve(__dirname, "./src/config"),
      },
    },
    build: {
      // Bundle all CSS into a single file for better performance
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // Consolidate CSS files into a single bundle
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) {
              return "_astro/styles.[hash].css";
            }
            return "_astro/[name].[hash][extname]";
          },
        },
      },
    },
  },
});
