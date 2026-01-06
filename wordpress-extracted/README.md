# WordPress Content Extracted

This directory contains WordPress content manually extracted from fjp.es that is ready to be migrated to the new Astro site.

## 📁 Directory Structure

```
wordpress-extracted/
├── posts/           # 10 blog posts (libros leídos, retos literarios)
├── tutorials/       # 3 tutorials (math & web dev)
└── README.md        # This file
```

## 📝 Posts Extracted (10 total)

### "Libros leídos durante" series (6 posts)

- `libros-leidos-durante-2012.md`
- `libros-leidos-durante-2013.md`
- `libros-leidos-durante-2014.md`
- `libros-leidos-durante-2015.md`
- `libros-leidos-durante-2016.md`
- `libros-leidos-durante-2017.md`

### Literary challenges (4 posts)

- `reto-literario-los-155-libros-que-debes-leer-antes-de-morir.md`
- `reto-literario-stephen-king.md`
- `reto-literario-pesadillas.md`
- `reto-literario-12-meses-12-clasicos-2016.md`

## 🎓 Tutorials Extracted (3 total)

### Web Development (1 tutorial)

- `redireccionar-htaccess-http-https.md` - How to redirect HTTP to HTTPS using .htaccess

### Mathematics (2 tutorials)

- `averiguar-resto-division-calculadora.md` - How to calculate division remainder with calculator
- `minimo-comun-multiplo-y-maximo-comun-divisor-con-calculadora.md` - LCM and GCD with calculator

## ⚠️ Content Status

- ✅ **Exported from XML**: All 10 posts extracted from `/home/fjpalacios/Code/WordPress/entries.xml`
- ✅ **Manually created**: All 3 tutorials scraped from fjp.es (not in entries.xml)
- 🔴 **Needs conversion**: Content has WordPress shortcodes and HTML that needs to be cleaned
- 🔴 **Needs frontmatter update**: Must adapt to Astro's MDX format

## 🚀 Next Steps

1. **Clean WordPress shortcodes** (e.g., `[libro titulo="..."]`, `[autor name="..."]`, `[estrellas]`)
2. **Convert HTML to Markdown** where appropriate
3. **Add proper frontmatter** following Astro content collections schema
4. **Download images** referenced in posts
5. **Test rendering** in Astro dev server
6. **Move to** `src/content/posts/` and `src/content/tutorials/`

## 📚 Source Information

- **Original source**: https://fjp.es/
- **Export date**: December 23, 2025
- **WordPress export file**: `/home/fjpalacios/Code/WordPress/entries.xml`
- **Books already exported**: `/home/fjpalacios/Code/WordPress/output/` (143 files - not processed yet)
