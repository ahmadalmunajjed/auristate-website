## Project

Auristate is a tourism and real estate investment company operating in Syria (coastal developments, historic-city restorations, hospitality/resort projects). This repo is its marketing site, built with Astro.

Intent for the finished site:
- Bilingual, served under `/en` and `/ar` (Arabic as RTL) — not yet implemented, planned once a homepage direction is chosen
- Static pages (e.g. About, Contact)
- Blog: index + individual posts
- Projects: index + individual project pages

Current status: three homepage design concepts live under `src/pages/concepts/` (`minimal-luxury`, `bold-editorial`, `warm-heritage`) for the client to pick a visual direction before the rest of the site is built. The root `/` currently redirects to `/concepts`. Shared setup already in place: Tailwind v4 (`@tailwindcss/vite`), brand color tokens and scroll/entrance animation utilities in `src/styles/global.css`, and Astro's built-in Fonts API configured per concept in `astro.config.mjs`. Once a concept is picked, its homepage becomes `src/pages/index.astro` (replacing the redirect) and the About/Blog/Projects/i18n work begins on top of it.

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
