// @ts-check
import path from "path";
import { fileURLToPath } from "url";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypePrism from "rehype-prism-plus";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://fjp.es",
  integrations: [mdx(), sitemap()],
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
      },
    },
  },
});
