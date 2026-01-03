# Personal Website

My personal blog built with Astro. Books, tutorials, and tech posts in Spanish and English.

**Live:** https://fjp.es (coming soon)

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun run test           # Unit tests
bun run test:e2e       # E2E tests
```

## Tech Stack

- **Astro 5** + TypeScript
- **SCSS** for styles
- **Vitest** + **Playwright** for testing
- **Pagefind** for search

## Project Structure

```
src/
├── components/         # Reusable components
├── content/            # MDX content (books, posts, tutorials)
├── layouts/            # Page layouts
├── pages/              # Routes
│   └── [lang]/[...route].astro  # Unified router
├── pages-templates/    # Page templates
├── styles/             # SCSS modules
└── utils/              # Helpers
```

## Key Features

- Bilingual (ES/EN) with unified routing
- Full-text search (Cmd+K)
- Dark mode with zero flash
- Lighthouse 100/100
- 1,500+ tests

## Commands

| Command            | Action               |
| :----------------- | :------------------- |
| `bun run dev`      | Start dev server     |
| `bun run build`    | Build for production |
| `bun run test`     | Run unit tests       |
| `bun run test:e2e` | Run E2E tests        |
| `bun run lint`     | Lint with ESLint     |

## License

Code: MIT  
Content: © Francisco Javier Palacios Pérez
