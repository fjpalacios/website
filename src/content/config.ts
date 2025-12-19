// Content collections config
// This file prevents the deprecation warning about auto-generated collections
// Since we use TypeScript files for content (not MD/MDX), we define empty collections

import { defineCollection } from "astro:content";

// Define empty collections for es and en folders to suppress deprecation warnings
// Our content is in .ts files and doesn't need schema validation at build time
const emptyCollection = defineCollection({
  type: "data",
  schema: () => ({}),
});

export const collections = {
  es: emptyCollection,
  en: emptyCollection,
};
