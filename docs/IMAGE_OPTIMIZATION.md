# Image Optimization System

## Overview

This project uses **Astro's built-in image optimization** with a custom automation system for managing static imports. All images are automatically optimized to WebP format with responsive srcset during build time.

## Key Features

✅ **Automatic WebP conversion** - ~70% size reduction  
✅ **Responsive images** - Multiple sizes for different viewports  
✅ **Lazy loading** - Better performance  
✅ **Static imports** - Build-time optimization (faster than runtime)  
✅ **Auto-generation** - Script creates imports automatically  
✅ **Type-safe** - Full TypeScript support

---

## Directory Structure

```
src/
├── assets/              # Source images (optimized during build)
│   ├── books/           # Book covers
│   ├── authors/         # Author pictures
│   ├── tutorials/       # Tutorial covers (optional)
│   ├── posts/           # Post covers (optional)
│   └── defaults/        # Default fallback images
├── components/
│   └── OptimizedImage.astro   # Main image component
└── utils/
    ├── images.ts              # Constants (dimensions, sizes)
    └── imageImports.ts        # AUTO-GENERATED - do not edit manually

dist/
└── _astro/              # Optimized images (generated during build)
    └── *.webp           # WebP files with hash names
```

---

## How It Works

### 1. **Development Mode** (`bun run dev`)

- Images are optimized **on-the-fly** (on-demand)
- WebP generated in memory (not saved to disk)
- First page load: slower (needs to process images)
- Subsequent loads: fast (cached in memory)
- **You DO see optimized images**, but they're processed as needed

### 2. **Production Build** (`bun run build`)

- All images pre-generated in `dist/_astro/`
- Multiple sizes created for srcset (responsive)
- WebP format with quality 80
- Ultra-fast serving (already optimized)

---

## Adding New Images

### Step-by-Step Process

When you add a new book, author, tutorial, or post image:

```bash
# 1. Copy the image to the correct directory
cp new-book-cover.jpg src/assets/books/

# 2. Regenerate imports (auto-detects all images)
bun run generate:images

# 3. Build (Astro optimizes automatically)
bun run build
```

**That's it!** No manual editing of imports required.

### Image Naming Convention

**Important:** Image filenames must match the slugs used in content frontmatter.

**Example:**

```yaml
# src/content/books/es/el-hobbit.mdx
---
title: "El Hobbit"
cover: "/images/books/el-hobbit.jpg" # ← Must match filename
---
```

```bash
# The actual file:
src/assets/books/el-hobbit.jpg  # ← Same slug: "el-hobbit"
```

**Naming rules:**

- Use kebab-case: `el-hobbit.jpg`, `stephen-king.jpg`
- No spaces: ❌ `el hobbit.jpg` → ✅ `el-hobbit.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`

---

## Removing Images

### What happens when you delete an image?

1. **Delete the image** from `src/assets/`
2. **Regenerate imports:**
   ```bash
   bun run generate:images
   ```
3. **Clean old build artifacts:**
   ```bash
   bun run clean:images   # Removes dist/ directory
   bun run build          # Fresh build without old images
   ```

### Important Notes

- **Development:** Old images in `dist/` don't matter (they're regenerated on-demand)
- **Production:** Use `bun run clean:images` before deploying to remove unused images
- **CI/CD:** Always runs fresh builds, so no cleanup needed

### Scripts for Cleaning

```bash
# Clean dist/ directory (removes ALL build artifacts)
bun run clean:dist

# Clean and show message
bun run clean:images

# Build from scratch (automatically cleans)
bun run build:clean
```

---

## Using OptimizedImage Component

### Basic Usage

```astro
---
import OptimizedImage from "@components/OptimizedImage.astro";
import { getBookCoverImage } from "@utils/imageImports";
import { IMAGE_DIMENSIONS } from "@utils/images";

const cover = getBookCoverImage("/images/books/el-hobbit.jpg", "es");
---

<OptimizedImage
  src={cover}
  alt="El Hobbit book cover"
  width={IMAGE_DIMENSIONS.BOOK_COVER_SMALL.width}
  height={IMAGE_DIMENSIONS.BOOK_COVER_SMALL.height}
  loading="lazy"
/>
```

### Available Helper Functions

```typescript
// Get book cover (with language fallback)
getBookCoverImage(coverPath: string | undefined, lang: 'es' | 'en'): ImageMetadata

// Get author picture (returns undefined if not found)
getAuthorPictureImage(picturePath: string | undefined): ImageMetadata | undefined

// Get post cover (fallback to default)
getPostCoverImage(coverPath: string | undefined): ImageMetadata

// Get tutorial cover (fallback to default)
getTutorialCoverImage(coverPath: string | undefined): ImageMetadata
```

### Predefined Dimensions

```typescript
import { IMAGE_DIMENSIONS } from "@utils/images";

// Book covers (2:3 aspect ratio)
IMAGE_DIMENSIONS.BOOK_COVER_SMALL; // 98x151
IMAGE_DIMENSIONS.BOOK_COVER_MEDIUM; // 200x300
IMAGE_DIMENSIONS.BOOK_COVER_LARGE; // 400x600

// Author pictures (1:1 aspect ratio)
IMAGE_DIMENSIONS.AUTHOR_PICTURE_SMALL; // 100x100
IMAGE_DIMENSIONS.AUTHOR_PICTURE_MEDIUM; // 150x150
IMAGE_DIMENSIONS.AUTHOR_PICTURE_LARGE; // 300x300

// Post/Tutorial covers (16:9 aspect ratio)
IMAGE_DIMENSIONS.POST_COVER_SMALL; // 400x225
IMAGE_DIMENSIONS.POST_COVER_MEDIUM; // 800x450
IMAGE_DIMENSIONS.POST_COVER_LARGE; // 1200x675
```

### Responsive Sizes

```typescript
import { RESPONSIVE_SIZES } from "@utils/images";

RESPONSIVE_SIZES.FULL_WIDTH; // "100vw"
RESPONSIVE_SIZES.HALF_WIDTH; // "(max-width: 768px) 100vw, 50vw"
RESPONSIVE_SIZES.THIRD_WIDTH; // "(max-width: 768px) 100vw, 33vw"
RESPONSIVE_SIZES.SMALL; // "150px"
RESPONSIVE_SIZES.MEDIUM; // "(max-width: 768px) 50vw, 300px"
```

---

## Image Categories

### 1. Books (`src/assets/books/`)

- Book cover images
- Used in: Book detail pages, book listings, author pages
- Fallback: `defaultImages.bookDefaultEs` or `defaultImages.bookDefaultEn`
- Example: `apocalipsis-stephen-king.jpg`

### 2. Authors (`src/assets/authors/`)

- Author profile pictures
- Used in: Author info component, author pages
- Fallback: None (optional, component handles missing images)
- Example: `stephen-king.jpg`

### 3. Tutorials (`src/assets/tutorials/`)

- Custom tutorial cover images (optional)
- Used in: Tutorial detail pages, tutorial listings
- Fallback: `defaultImages.tutorialDefault`
- Example: `git-basics.jpg`

### 4. Posts (`src/assets/posts/`)

- Custom post cover images (optional)
- Used in: Post detail pages, post listings
- Fallback: `defaultImages.postDefault`
- Example: `my-first-post.jpg`

### 5. Defaults (`src/assets/defaults/`)

- Fallback images when content doesn't have a cover
- **Required files:**
  - `book-default-es.jpg` - Spanish book default
  - `book-default-en.jpg` - English book default
  - `post-default.jpg` - Post default
  - `tutorial-default.jpg` - Tutorial default

---

## Advanced: Image Import System

### How `imageImports.ts` is Generated

The file is **auto-generated** by `scripts/generate-image-imports.ts`.

**What it does:**

1. Scans `src/assets/` for all images
2. Generates static imports for each image
3. Creates typed maps: `bookCovers`, `authorPictures`, etc.
4. Generates helper functions with fallbacks
5. Writes everything to `src/utils/imageImports.ts`

**Generated structure:**

```typescript
// Imports
import apocalipsis from "@/assets/books/apocalipsis-stephen-king.jpg";
import area81 from "@/assets/books/area-81-stephen-king.jpg";
// ... more imports

// Maps
export const bookCovers: Record<string, ImageMetadata> = {
  "apocalipsis-stephen-king": apocalipsis,
  "area-81-stephen-king": area81,
  // ... more entries
};

// Helpers
export function getBookCoverImage(coverPath: string | undefined, lang: "es" | "en" = "es"): ImageMetadata {
  // ... implementation
}
```

### Why Static Imports?

**Astro requires static imports for build-time optimization:**

❌ **This DOESN'T work:**

```astro
<Image src="/images/books/el-hobbit.jpg" alt="..." />
<!-- Astro can't optimize string paths -->
```

✅ **This WORKS:**

```astro
import cover from '@/assets/books/el-hobbit.jpg';
<Image src={cover} alt="..." />
<!-- Astro optimizes imported images -->
```

---

## Performance Metrics

### Before Optimization

- **Format:** JPEG
- **Total size (14 books):** 336 KB
- **Largest image:** `the-stand-stephen-king.jpg` (187 KB)
- **No responsive images**

### After Optimization

- **Format:** WebP
- **Total generated:** 26 files (multiple sizes per image)
- **Srcset:** 1-4 sizes per image (400w, 800w, 1200w, 1600w)
- **Quality:** 80 (good balance)
- **Lazy loading:** Enabled by default
- **Average reduction:** ~70% per image

### Example: `the-stand-stephen-king.jpg`

```
Original:  187 KB (JPEG)

Optimized versions:
├── 98px width:   5 KB  (WebP) - thumbnail
├── 800px width:  53 KB (WebP) - medium
├── 1200px width: 137 KB (WebP) - large
└── 1600px width: 151 KB (WebP) - full
```

Browser automatically picks the best size based on viewport.

---

## Troubleshooting

### Images not optimizing?

**Check:**

1. Are images in `src/assets/` (not `public/`)?
2. Did you run `bun run generate:images`?
3. Is `imageImports.ts` up to date?
4. Did you import from `@utils/imageImports`?

**Debug:**

```bash
# Verify imports file is current
bun run generate:images

# Check if WebP files were generated
find dist/_astro -name "*.webp" | wc -l

# Should show: 20+ files
```

### Image shows broken?

**Check:**

1. Filename matches frontmatter slug exactly
2. Image exists in `src/assets/[category]/`
3. Build completed successfully
4. No console errors in browser

**Debug:**

```typescript
import { hasBookCover } from "@utils/imageImports";

const exists = hasBookCover("el-hobbit"); // true/false
console.log("Image exists:", exists);
```

### Build is slow?

**Normal behavior:**

- First build: Slow (processes all images)
- Subsequent builds: Fast (uses cache)

**If consistently slow:**

- Check image sizes (very large images take longer)
- Run `bun run clean:images` to clear cache
- Consider pre-optimizing very large images manually

---

## Future Improvements

### Planned Features

- [ ] **Auto-detection in content validation** - Warn if image in frontmatter doesn't exist
- [ ] **Image size recommendations** - Suggest optimal sizes
- [ ] **AVIF format support** - Even better compression (when browser support improves)
- [ ] **Unused image detection** - Find images in `src/assets/` not used in content

### When You Import 1000 Books

The system is designed to scale:

1. **Copy images:** `cp books-export/*.jpg src/assets/books/`
2. **Regenerate imports:** `bun run generate:images` (takes ~1 second)
3. **Build:** `bun run build` (takes ~2-5 minutes for 1000 images)
4. **Deploy:** All images optimized automatically

**No manual work per image.**

---

## Quick Reference

### Common Commands

```bash
# Add new images
bun run generate:images

# Build with optimizations
bun run build

# Clean old images
bun run clean:images

# Build from scratch
bun run build:clean

# Development with on-the-fly optimization
bun run dev
```

### File Locations

- **Source images:** `src/assets/[books|authors|tutorials|posts|defaults]/`
- **Generated imports:** `src/utils/imageImports.ts` (auto-generated)
- **Optimized output:** `dist/_astro/*.webp`
- **Generation script:** `scripts/generate-image-imports.ts`

### Import Helpers

```typescript
// In any Astro component
import {
  getBookCoverImage,
  getAuthorPictureImage,
  getPostCoverImage,
  getTutorialCoverImage,
  defaultImages,
  IMAGE_DIMENSIONS,
  RESPONSIVE_SIZES
} from '@utils/imageImports' or '@utils/images';
```

---

## Questions?

**Q: Do I need to manually edit `imageImports.ts`?**  
A: **NO.** It's auto-generated. Just run `bun run generate:images`.

**Q: Can I use images from `public/`?**  
A: Yes, but they won't be optimized. Use `src/assets/` for optimization.

**Q: What if I want different image formats?**  
A: Edit `OptimizedImage.astro` and change `format` prop default.

**Q: How do I add custom image sizes?**  
A: Add to `IMAGE_DIMENSIONS` in `src/utils/images.ts`.

**Q: What happens in development mode?**  
A: Images are optimized on-demand (slower first load, fast after).

**Q: Do I need to commit `dist/`?**  
A: **NO.** Never commit `dist/`. It's regenerated on every build.

---

**Last updated:** 2025-12-31  
**Astro version:** 5.16.6  
**Image service:** Sharp
