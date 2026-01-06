# Open Graph Image Generation

Technical documentation for generating social media images.

## Overview

The `generate-og-image.sh` script creates standardized Open Graph images (1840x720px) for social media sharing. It supports two modes: text-based and logo-based images.

## Features

- **Standard dimensions**: 1840x720px (Open Graph optimized)
- **Retro typography**: Press Start 2P pixel font
- **Semi-transparent border**: Black with 21% opacity, 90px width
- **Smart text splitting**: Automatically converts long text (>20 chars) to two lines
- **Logo support**: Best with PNG logos, limited SVG support

## Usage

### Text Mode

```bash
# Using npm script (recommended)
bun run generate:og text "hello world" "#1a7f8f" output.jpg

# Or directly with bash
./scripts/generate-og-image.sh text "hello world" "#1a7f8f" output.jpg

# Multi-line (>20 characters, splits at nearest space to middle)
bun run generate:og text "learn to code from scratch" "#5a3e85" output.jpg
```

**Text specifications:**

- Single line: 72pt font size
- Two lines: 72pt font size
- Automatic splitting at optimal word boundary

### Logo Mode

```bash
# Using npm script (recommended)
bun run generate:og logo path/to/logo.png "#F05032" output.jpg

# Or directly with bash
./scripts/generate-og-image.sh logo path/to/logo.png "#F05032" output.jpg

# Limited: SVG support
bun run generate:og logo path/to/logo.svg "#336699" output.jpg
```

**Logo specifications:**

- Resized to 350x350px
- Centered on canvas
- PNG with white/light colors recommended for contrast
- SVG rendering has transparency limitations

## Technical Notes

### ImageMagick Limitations

During development, we encountered challenges with SVG conversion:

1. **Transparency issues**: ImageMagick struggles to render SVG transparency correctly
2. **Color replacement**: Automatic color conversion (e.g., black → white) affects edges
3. **Alpha channel handling**: Different SVG renderers produce inconsistent results

**Solution**: Recommend using pre-prepared PNG logos with transparency in white color.

### Border Implementation

The semi-transparent border is achieved using:

```bash
magick -size 1840x720 xc:none \
  -fill "rgba(0,0,0,0.21)" \
  -draw "rectangle 0,0 89,719" \      # left
  -draw "rectangle 1750,0 1839,719" \ # right
  -draw "rectangle 0,0 1839,89" \     # top
  -draw "rectangle 0,630 1839,719"    # bottom
```

### Text Splitting Algorithm

For text longer than 20 characters:

1. Calculate middle position: `length / 2`
2. Find nearest space before or after middle
3. Split text at that space
4. Render as two lines with 72pt font

## Examples

```bash
# Git tutorial OG image
bun run generate:og logo git-logo-white.png "#F05032" git-tutorial-og.jpg

# Book review
bun run generate:og text "the hobbit review" "#8B4513" hobbit-og.jpg

# Course image
bun run generate:og text "learn javascript from scratch" "#F7DF1E" js-course-og.jpg
```

## Dependencies

- ImageMagick 7+ (with `magick` command)
- Press Start 2P font installed system-wide
- Bash 4+

## Future Improvements

Potential enhancements documented but not yet implemented:

1. **Better SVG support**: Research alternative rendering methods (librsvg, Inkscape CLI)
2. **Three-line text**: Support for very long titles
3. **Custom fonts**: Allow font selection via parameter
4. **Gradient backgrounds**: Support for multi-color gradients
5. **Image optimization**: Automatic WebP conversion for better compression

## Related Files

- Script: `/scripts/generate-og-image.sh`
- Documentation: `/scripts/README.md` (section: "Image Generation Script")
