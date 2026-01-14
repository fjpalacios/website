# Open Graph Image Generation

Quick reference for generating social media images.

---

## Usage

### Text Mode

```bash
bun run generate:og text "hello world" "#1a7f8f" output.jpg

# Long text (auto-splits at ~20 chars)
bun run generate:og text "learn to code from scratch" "#5a3e85" output.jpg
```

**Specs:**

- Dimensions: 1840x720px
- Font: Press Start 2P (72pt)
- Semi-transparent border: 90px, black 21% opacity

### Logo Mode

```bash
bun run generate:og logo path/to/logo.png "#F05032" output.jpg
```

**Specs:**

- Logo resized to 350x350px, centered
- Use PNG with white/light colors for best contrast
- SVG support limited (transparency issues)

---

## Examples

```bash
# Tutorial OG image
bun run generate:og logo git-logo-white.png "#F05032" git-og.jpg

# Book review
bun run generate:og text "the hobbit review" "#8B4513" hobbit-og.jpg
```

---

## Dependencies

- ImageMagick 7+ (`magick` command)
- Press Start 2P font (system-wide)
- Bash 4+

---

## Technical Notes

**Text splitting:** For text >20 chars, splits at nearest space to middle, renders as two lines.

**SVG issues:** ImageMagick struggles with SVG transparency. Use pre-prepared PNG logos in white.

**Border:** Semi-transparent black (rgba(0,0,0,0.21)) drawn as 90px rectangles on all sides.

---

## Future Improvements

- Better SVG support
- Three-line text support
- Custom font selection
- Gradient backgrounds
