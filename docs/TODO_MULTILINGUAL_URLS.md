# TODO: Multi-language URL Structure

## Current Issue

The website is bilingual (Spanish/English) but the URL structure doesn't properly reflect this:

### Current Implementation (WRONG)

- Spanish: `/libros/apocalipsis-stephen-king`
- English: `/libros/apocalipsis-stephen-king` (same URL! ❌)
- Spanish: `/blog/from-ruby-to-javascript`
- English: `/blog/from-ruby-to-javascript` (same URL! ❌)

### Expected Implementation (from Gatsby)

- Spanish (default): `/libros/apocalipsis-stephen-king`
- English: `/en/libros/apocalipsis-stephen-king`
- Spanish (default): `/blog/from-ruby-to-javascript`
- English: `/en/blog/from-ruby-to-javascript`

## How Gatsby Handles This

Reference: `/home/fjpalacios/Code/website-gatsby/gatsby-node.js` lines 107-108

```javascript
const path = language === defaultLanguage ? `/${slug}` : `/${language}/${slug}`;
```

- Default language (es): No prefix
- Other languages (en): `/en/` prefix

## Required Changes

### 1. Update URL Generation in Pages

All dynamic routes need to check the language and add `/en/` prefix when needed:

**Files to update:**

- `/src/pages/blog/[slug].astro`
- `/src/pages/tutoriales/[slug].astro`
- `/src/pages/libros/[slug].astro`
- `/src/pages/autor/[slug].astro`

**Implementation:**

```typescript
// Example for blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection("posts");

  return posts.map((post) => {
    const lang = post.data.language;
    const baseSlug = post.data.post_slug;
    const slug = lang === "en" ? `en/${baseSlug}` : baseSlug;

    return {
      params: { slug },
      props: { postEntry: post },
    };
  });
}
```

### 2. Update PostList Component URLs

File: `/src/components/PostList.astro`

Current `getItemUrl()` function needs to include language:

```typescript
function getItemUrl(item: ListItem): string {
  const langPrefix = item.language === "en" ? "/en" : "";

  switch (item.type) {
    case "book":
      return `${langPrefix}/libros/${item.slug}`;
    case "tutorial":
      return `${langPrefix}/tutoriales/${item.slug}`;
    case "post":
    default:
      return `${langPrefix}/blog/${item.slug}`;
  }
}
```

### 3. Update Summary Interfaces

Add language field to summary types if not present:

**Files:**

- `/src/utils/blog/book-listing.ts` (BookSummary) ✅ Already has it
- `/src/utils/blog/tutorials.ts` (TutorialSummary) ✅ Already has it
- `/src/utils/blog/posts.ts` (PostSummary) ✅ Already has it

### 4. Update Taxonomy Pages (Future Phase 3)

When implementing taxonomy pages, remember to apply the same language prefix logic:

- `/category/[slug]` → `/en/category/[slug]` for English
- `/course/[slug]` → `/en/course/[slug]` for English
- `/genre/[slug]` → `/en/genre/[slug]` for English
- etc.

### 5. Update Internal Links

Check all hardcoded internal links in:

- Components
- MDX content
- Navigation menus
- Breadcrumbs (if any)

Ensure they respect the language prefix.

### 6. Add Language Switcher

Once URLs are properly structured, add language switcher in header:

- Detect current language from URL
- Provide link to same content in other language (if exists)
- Use i18n frontmatter field to link between translations
- **If translation doesn't exist**: Show flag in grayscale and disable link (like Gatsby)
- **No automatic fallback**: If user requests `/en/slug` and it doesn't exist → 404

Reference: `/home/fjpalacios/Code/website-gatsby/src/components/language-switcher.tsx`

**Gatsby behavior (to replicate):**

```typescript
const i18nSlug = frontmatter.i18n?.frontmatter.post_slug || '';
const hasi18n = i18nSlug.length;

// In Layout component:
<Layout
  languageSwitcherDisabled={!hasi18n}
  languageSwitcherTo={`/${i18nSlug}`}
>
```

**CSS for disabled state:**

```scss
.language-switcher--disabled {
  img {
    filter: grayscale(100%);
    cursor: not-allowed; // Add this
  }
}
```

## Testing Checklist

- [ ] Spanish content accessible without `/es/` prefix
- [ ] English content accessible with `/en/` prefix
- [ ] URLs in PostList component generate correctly
- [ ] Internal links work across languages
- [ ] Taxonomy pages respect language prefixes
- [ ] Language switcher appears in header
- [ ] Language switcher disabled (grayscale) when translation doesn't exist
- [ ] Language switcher clickable when translation exists
- [ ] Clicking language switcher navigates to correct URL
- [ ] No 404s for existing language-specific URLs
- [ ] Proper 404s for non-existing language URLs (no fallback)
- [ ] Sitemap includes both language versions

## Priority

**HIGH** - This should be fixed before adding more content or implementing Phase 3 taxonomy pages.

## Related Files

- `gatsby-node.js` in Gatsby project (reference implementation)
- All `[slug].astro` files in `/src/pages/`
- `/src/components/PostList.astro`
- All utility files in `/src/utils/blog/`

## Notes

- Consider if author pages need language prefix (probably not, as author bios are language-specific but URL could be shared)
- Test with multilingual content to ensure no conflicts
- Update tests to validate language-specific URL generation
