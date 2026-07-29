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
| `public/images/hero/hero-bg.svg` | Unused since the video hero landed; kept for non-video pages |
| `public/images/hero/video-poster.svg` | Superseded by `placeholder.png` |
| `public/images/projects/filler-{1,2,3}.svg` | Gallery tiles 4–6 |

### Hero video

The homepage hero is full-bleed video (`public/videos/hero.mp4`, client-supplied), configured entirely from
the `hero` object in `site.ts` — `showreel`, `poster`, `showreelRate`, `showreelStart`. Setting `showreel` to
`null` falls back to the poster alone; the hero never emits a `<video>` with a dead source.

The source is **854×480 with a high-bitrate 4.5 MB encode and `faststart` disabled**, so `moov` sits at the
end of the file and playback cannot begin until the whole thing downloads. It also carries an audio track
that is never played. That is why the hero works as hard as it does to disguise the resolution:

- The video is attached **from JS, not markup** — mobile (`<768px`) and `prefers-reduced-motion` never issue
  the request at all, rather than downloading and hiding it. The poster is the LCP element in every case.
- `showreelStart: 2.4` skips the opening, where the camera moves fastest and the framing is tightest — by
  far the softest part of the clip.
- The clip is a continuous pull-back, so its last frame is nowhere near its first and a plain loop hard-cuts
  every pass. It loops natively and **dips through the poster across the seam**, which reads as a blink.
  Reverse playback was tried first and abandoned: browsers cannot play backwards, and faking it by seeking
  painted 6fps against 27.5fps forward. Don't reintroduce it. The fade duration lives in `--hero-fade` in CSS
  and the script reads it back, so the transition and the timer cannot drift apart.
- `currentTime` and `playbackRate` are set on `loadedmetadata`, **not** before assigning `src` — both reset
  when a new source loads.
- Grade, vignette, scrim, and a CSS grain layer sit above the media. The grain matters: the eye reads it as
  texture and stops parsing compression blocks as artifacts.

The bottom scrim fades to `#f7f1e6`, **not** `--color-sand`. The section below is `bg-white/50` over sand,
which composites to that value; fading to the raw token leaves a visible seam.

Re-encoding the source (faststart, drop audio, trim, ~1 MB) would let most of the playback JS go away, and a
1080p master from the client would retire the disguise work entirely.

The header takes an `over` prop that switches it to the white-on-media treatment and absolutely positions it;
`index.astro` wraps `<Header over />` and `<Hero />` in a `relative` div so it overlays.

### Logo

`public/transperate-logo.png` is the real mark — genuinely transparent, and with no pure-dark pixels, so it
survives on video. Two quirks drive how it is used, both handled by `.logo-crop` in `global.css`:

- The artwork occupies **1240×1436 of a 2362² square** — 93% of the file is empty margin. Rendered uncropped
  it loses about a third of its available height.
- Its wordmark is only **7.4% of the lockup height**, which is ~2px at header scale.

So there are two crops. `.logo-crop--mark` isolates the triangle for compact placements (the header pairs it
with live text at a readable size); `.logo-crop--lockup` shows the whole thing where there is vertical room
(the footer). The measured bands are in `global.css` — re-derive the percentages if the asset is re-exported.
`.logo-over` adds a soft halo so the mid-grey facets keep their edge on video.

`logo.jpeg` is superseded and no longer referenced; `mix-blend-multiply` existed only to hide its baked-in
white background.

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
