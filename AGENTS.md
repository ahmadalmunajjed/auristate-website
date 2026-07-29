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

The brand's specified typefaces are **BankGothic Md BT Medium** (headlines) and **Bauhaus Std Light** (body).
Both are commercial and available from neither the repo nor Google Fonts, the only provider configured in
`astro.config.mjs`. Fraunces and Work Sans stand in until the licensed files land in `public/fonts/`.

### Brand palette

The client supplied four colors, which are exactly the logo's. They map onto the existing token names, with
the client's own semantic notes recorded in `global.css`:

| Token | Value | Client's note |
| --- | --- | --- |
| `gold-dark` | `#b47c27` | Symbol of prestige and excellence |
| `gold-light` | `#e1b145` | Foundation of elegance and contrast |
| `charcoal` | `#565656` | Balance and clarity in design |
| `grey-light` | `#a19f97` | To add balance and writings |

`sand`, `sand-dark`, `offwhite`, and `nearblack` are unchanged — they are the substrate the palette sits on,
not accents.

**Two tokens exist purely for contrast and are not brand colors.** The palette is light: measured on `sand`,
`gold-dark` is 2.83:1 and `charcoal` at `/70` is 3.09:1, both well under the 4.5:1 AA threshold for body text.

- `--color-ink: #2b2b2b` — body copy that needs opacity modifiers. `text-ink/75` is 5.9:1 where
  `text-charcoal/70` would be 3.3:1. Use `charcoal` at **full opacity only**, for genuinely secondary text.
- `--color-gold-deep: #885e1d` — any gold text below ~24px, notably the `tracking-[0.3em]` eyebrows.
  Reserve `gold-dark` for fills, rules, and large display type.

Two knock-on rules, both measured rather than guessed:

- The **CTA band** heading is `text-ink`, not white. White on the gradient's light end (`#e1b145`) is 1.99:1;
  ink gives 7.13:1 there and 3.95:1 on the dark end.
- **Footer** links hover to `ink` + underline rather than gold. Its `sand-dark/60` ground composites to
  `#d9c7a5`, where even `gold-deep` reaches only 3.45:1.

## SEO and social previews

`Layout.astro` takes `title`, plus optional `description`, `image`, and `noindex`. It emits the description,
canonical, Open Graph, and Twitter card tags; the description and OG image default to the homepage's.

**`site` in `astro.config.mjs` is load-bearing.** Canonical and OG image URLs are built from it with
`new URL()`, because social platforms reject relative image paths. It currently points at the Cloudflare
Pages deployment (`https://auristate-website.pages.dev`) — **swap it when the custom domain goes live**, or
previews and canonicals will point at the wrong host.

`public/og-image.png` is 1200×630 (the size Facebook, LinkedIn, WhatsApp, and X all crop toward): the full
logo lockup on the brand dark ground with a gold rule. It is generated from `transperate-logo.png` by
cropping the measured lockup band — the raw logo is a 2362² square that is 93% empty margin and would render
as a tiny mark lost in a field of white.

Titles pass through `Astro.props` and are **escaped once**. Write a plain `&`, never `&amp;` — the entity
ships as the literal text "&amp;" in the tab and in every share preview.

## Content and assets

All homepage copy lives in `src/data/site.ts`. Section components import from it and never hardcode copy.
Four nav entries are in-page anchors into the homepage sections — `/#about`, `/#projects`, `/#services`,
`/#news` — so they are coupled to the `id` on each section's root element. Root-relative rather than bare
`#about`, because `Footer.astro` renders the same array and will ship on pages other than `/`. `Contact Us`
still points at `/contact`, which does not exist yet and 404s until built.

**Only `hero` and `about` are client copy.** `cta`, `contact`, `social`, and `footerTagline` are placeholders
marked as such in the file — the phone number and email in particular are invented and must be replaced
before launch.

`Services`, `News`, and `VisionMission` are **built but commented out of `index.astro`**, and their data is
deleted. Everything they contained was invented: fabricated blog posts, service blurbs, and stats claiming
"12+ years" for a company founded in 2025. A page that shows nothing beats one that shows fiction. Uncomment
each as its real copy arrives.

`ProjectsGallery` works differently — it is **mounted but self-hiding**. It returns nothing while `projects`
is empty, so the section appears on its own the moment real entries land in `site.ts`, with no second edit
and no empty heading shipping over a blank grid.

The live page is therefore: Header → Hero → About → CTA band → Footer.

### Projects data

```ts
interface Project {
  name: string;
  tag: string;       // 'Hospitality / Resort' — the gold eyebrow
  image: string;     // cards crop to 4:3, so 4:3 or wider is best
  href: string;      // '/projects/<slug>' once project pages exist
  summary?: string;  // shown in the feature and mosaic layouts
}
```

`ProjectsGallery` picks its layout from the count, because one grid cannot serve every case — a mosaic built
for six tiles looks broken at two, and a lone card in a three-column grid reads as a loading failure:

| Count | Layout | Crop |
| --- | --- | --- |
| 1 | Feature — full width | 16:9 |
| 2–3 | Equal cards in a 2- or 3-column row | 9:10 portrait |
| 4+ | Mosaic — first tile spans two columns | 16:10 wide, 9:10 rest |

`ProjectCard.astro` renders all three via a `variant` prop (`feature` / `wide` / `default`).

**This section deliberately inverts the theme.** Per the client's reference design it is `bg-nearblack` with
square corners, tight 12px gutters, and near-full-bleed cards — everywhere else on the site is warm sand with
`rounded-3xl`. Cards are overlays: the image *is* the card, with a white type pill top-left and the title in
white over the photo, nothing in a panel beneath.

Consequences worth knowing before editing it:

- `SectionHeading.astro` is **not** used here. Its `text-ink` title would be invisible on black and its
  `gold-deep` eyebrow measures 3.04:1 there. The heading is inlined with `text-white` / `gold-light`
  (8.77:1). The palette inverts on dark — `gold-light` is the accessible gold, `gold-deep` is not.
- The title sits on photography nobody has vetted, so legibility comes from a **bottom-weighted scrim**, not
  from assuming a dark image. It was tuned by rendering each card to canvas and sampling the brightest pixel
  behind the title: the first ramp left a sunlit render at 4.37:1, the current one holds ≥8:1. Architectural
  renders run brighter than stock photography, so keep the margin if you retune it.
- The grid is `items-start`. The default stretch pads shorter cards to match the tall wide tile.

### Imagery

| Path | Status |
| --- | --- |
| `public/images/hero/hero-bg.svg` | Unused since the video hero landed; kept for non-video pages |
| `public/images/hero/video-poster.svg` | Superseded by `placeholder.png` |
| `public/images/projects/filler-{1,2,3}.svg` | Abstract brand-toned art; safe as a placeholder anywhere |
| `public/images/projects/stock-*.jpg` | **Stock photos — never usable as a project.** See below |

The three `stock-*.jpg` files arrived as layout filler for the design concepts and depict no Auristate
development. One was named `latakia-coastal.jpg` but is actually **Ortigia, Syracuse** — a stock photo of
Sicily. They were renamed so the filenames stop asserting a location, and
`public/images/projects/README.md` records the provenance. Use them for mockups; never caption them as a
project. In a projects gallery a wrong image stops being a placeholder and becomes a false claim about what
the company has built.

The only genuine client imagery in the repo is the "365" venue render in `hero.mp4` and its poster frame.

### Hero video

The homepage hero is full-bleed video (`public/videos/hero.mp4`, client-supplied), configured entirely from
the `hero` object in `site.ts` — `showreel`, `poster`, `showreelRate`, `showreelStart`. Setting `showreel` to
`null` falls back to the poster alone; the hero never emits a `<video>` with a dead source.

The source is **854×480 with a high-bitrate 4.5 MB encode and `faststart` disabled**, so `moov` sits at the
end of the file and playback cannot begin until the whole thing downloads. It also carries an audio track
that is never played. That is why the hero works as hard as it does to disguise the resolution:

- The video is attached **from JS, not markup**, so `prefers-reduced-motion` never issues the request at all
  rather than downloading and hiding it. The poster is the LCP element in every case.
- **All viewports load the video, including phones.** A `(min-width: 768px)` gate previously kept it off
  mobile; it was removed deliberately. The cost is real and worth restating: with `faststart` disabled a
  phone visitor downloads all 4.5 MB before the first frame, and a 854×480 landscape clip crops hard to a
  portrait viewport. Restore the gate, or ship a portrait-cropped mobile source, if that trade sours.
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
