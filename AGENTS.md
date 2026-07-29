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
- `src/components/*.astro` — one component per homepage section; the reference implementation of the style
- `src/pages/index.astro` — the homepage, now composition only (imports + section order)
- `src/styles/global.css` — brand color tokens (`gold*`, `charcoal`, `sand*`, …) as Tailwind v4 `@theme` values, plus the scroll/entrance animation utilities (`.animate-hero`, `.animate-float`, `.reveal`, all reduced-motion aware)
- `src/layouts/Layout.astro` — loads the two theme fonts via Astro's Fonts API
- `astro.config.mjs` — Fraunces as `--font-display` (headings) and Work Sans as `--font-body`

Note on the fonts: both CSS variables are emitted into `:root` by Astro's `<Font>` component, *not* by Tailwind's `@theme`, so despite the `--font-*` naming there is no `font-display`/`font-body` utility class. `--font-body` is applied once to `body` in `global.css`; headings opt into the display font with inline `style="font-family: var(--font-display)"`. Follow that pattern on new pages.

## Content and assets

All homepage copy lives in `src/data/site.ts` — a single module exporting `nav`, `hero`, `about`, `stats`,
`projects`, `services`, `posts`, `visionMission`, `cta`, `contact`, `social`. Section components import from
it and never hardcode copy. Nav entries carry real `href`s; the five routes they point at (`/about`,
`/projects`, `/services`, `/news`, `/contact`) do not exist yet and 404 until built.

Imagery is placeholder SVG in brand tones. Drop real files at these paths and nothing else needs to change:

| Path | Replaces |
| --- | --- |
| `public/images/hero/hero-bg.svg` | Hero background |
| `public/images/hero/video-poster.svg` | Showreel poster frame |
| `public/images/projects/filler-{1,2,3}.svg` | Gallery tiles 4–6 |

The hero showreel is flag-gated: `hero.showreel` is `null`, so the hero renders the poster as a plain `<img>`.
Drop the video at `public/videos/auristate-showreel.mp4` and set `showreel` to that path to switch on the real
`<video>`. Never emit a `<video>` with a dead source — Firefox draws an error overlay and `controls` gives a
dead play button.

Images use raw `<img src="/...">`, not `astro:assets` `<Image>`. Stay consistent; migrating is a separate pass.

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
