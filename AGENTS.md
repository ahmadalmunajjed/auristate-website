## Project

Auristate is a tourism and real estate investment company operating in Syria (coastal developments, historic-city restorations, hospitality/resort projects). This repo is its marketing site, built with Astro.

Intent for the finished site:
- Bilingual, served under `/en` and `/ar` (Arabic as RTL) — not yet implemented
- Static pages (e.g. About, Contact)
- Blog: index + individual posts
- Projects: index + individual project pages

## Design direction

The client picked the **Warm Heritage Contemporary** concept: warm gold/sandstone tones in a modern rounded grid, regional heritage meets contemporary investment. It is the site theme — new pages follow it rather than introducing a new look.

The alternative concepts (`minimal-luxury`, `bold-editorial`) and the `src/pages/concepts/` picker have been removed; see git history if the earlier explorations are ever needed.

The theme lives in:
- `src/pages/index.astro` — the homepage, and the reference implementation of the style
- `src/styles/global.css` — brand color tokens (`gold*`, `charcoal`, `sand*`, …) as Tailwind v4 `@theme` values, plus the scroll/entrance animation utilities (`.animate-hero`, `.animate-float`, `.reveal`, all reduced-motion aware)
- `src/layouts/Layout.astro` — loads the two theme fonts via Astro's Fonts API
- `astro.config.mjs` — Fraunces as `--font-display` (headings) and Work Sans as `--font-body` (set on `body` in `global.css`)

Next up: About/Blog/Projects pages and i18n, built on this theme.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
