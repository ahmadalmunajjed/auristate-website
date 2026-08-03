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

- Type on the **gold gradient** (`gold-light` → `gold-dark`) is `text-ink`, not white. White on the light end
  (`#e1b145`) is 1.99:1; ink gives 7.13:1 there and 3.95:1 on the dark end.
- The **footer is `bg-nearblack`**, so the palette inverts there exactly as it does in the projects gallery:
  `gold-light` is the accessible gold (8.77:1) and `gold-deep` is not (3.04:1), while `ink` is unusable at
  1.23:1. Every text color in it is white at some opacity — `white/75` body copy measures 10.19:1.

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
Most nav entries are in-page anchors into the homepage sections — `/#about`, `/#projects`, `/#services`,
`/#news` — so they are coupled to the `id` on each section's root element. Root-relative rather than bare
`#about`, because `Footer.astro` renders the same array and will ship on pages other than `/`. `Contact Us`
still points at `/contact`, which does not exist yet and 404s until built.

A nav entry with a `children` array renders as a dropdown **in the header only** — `Footer.astro` reads the
same array and stays flat. `About Us` uses it for `Who We Are` (`/#about`) and `Mission and Vision`
(`/#vision-mission`), so it now depends on a third section id. `Projects` uses it for the three project
types, which are the `tag` values on `projects` shortened for menu width — nothing derives that list, so a
project with a new tag needs a matching entry. Those three are the only nav links pointing **off** the
homepage besides `Contact Us`: they expect `/projects` to expose `#hospitality`, `#residential`, and
`#luxury-villas`, and 404 with the rest of `/projects` until that page is built. Each trigger keeps its own
`href`, so no item is a dead end. The panel opens on `:hover` and `:focus-within` in CSS; the small script in
`Header.astro` covers touch, where neither fires — under `(hover: none)` the first tap opens the menu and the
second follows the link. Below 768px the nav is hidden entirely and there is still no mobile menu.

**Only `hero` and `about` are client copy.** `contact`, `social`, and `footerTagline` are placeholders
marked as such in the file — the phone number and email in particular are invented and must be replaced
before launch.

The footer's `social` entries render as **icons only**, so `label` never appears on screen and serves as the
link's `aria-label`. `icon` selects a glyph from `SocialIcon.astro`, whose path table is typed
`Record<SocialIconName, string>` against the union in `site.ts` — adding a network to one side fails the
build until the other catches up. Those paths are simple-icons@13 (CC0) copied verbatim, not redrawn; the
component header records where to re-fetch them. LinkedIn, Instagram, and Facebook still point at `#`.
**WhatsApp is the first live outbound link on the site** — it is built from `contact.phone`, which AGENTS.md
flags as invented, so confirm the number before launch or it delivers visitors to a stranger.

On the dark ground the icons need no special-casing: `gold-light` clears both the 3:1 non-text threshold and
the 4.5:1 text one, so glyphs and links share a single hover color.

`Services`, `News`, and `VisionMission` were once commented out of `index.astro` because everything in them
was invented. All three are **live now**, carrying real client copy. The principle that put them behind a
comment still holds: a page that shows nothing beats one that shows fiction.

`Services` renders its four steps as a numbered sequence, and the ordinal is what carries that — the
connecting rule between badges is decorative and hidden from assistive tech. Each step's photo sits **above**
the badge so every badge in the row shares one baseline and that rule stays straight. The photos are
decorative and take an empty `alt`: the title beside one already names the step. All four are
**PLACEHOLDER** — genuine client renders and one real site photo, reused as decoration. None depicts the
service it sits above, which is only safe because nothing captions them; see the note in `site.ts` before
swapping them.

`VisionMission` is the two statements as matched framed panels on bare `bg-sand` — the earlier dark/light
card pair is gone, along with its 3/2 split, since the two are peers rather than a statement and its answer.
Three things in it are load-bearing:

- **The gold glow starts 32% down the section, below the heading.** That is a measured contrast constraint,
  not composition. The eyebrow is 12px `gold-deep`, which is 4.51:1 on bare sand — one hundredth over the
  minimum, so it has no margin for any tint at all. Full-bleed the glow and it reads 3.67:1; dimming does not
  save it, since even 0.10 alpha gives 4.32. The panels are `white/70` over the glow, which lifts the same
  eyebrow to 5.05:1 inside them. `vm-drift` scales from `50% 100%` for the same reason — the default centre
  origin walks the top edge back up into the heading.
- **Panels are top-aligned, not centred.** They stretch to a common height, and centring each stack within
  that pushed the shorter mission's emblem ~44px below the vision's, reading as a misalignment. Trailing
  space under the shorter statement is the cheaper cost.
- **The ornaments are gated on `.is-visible` but do not depend on JS to appear.** The scoped
  `prefers-reduced-motion` block is what guarantees that — the global one in `global.css` only covers
  `.reveal` and `.animate-*`, so without the local override these would stay invisible for reduced-motion
  users. Verified: under forced reduced motion every ornament computes to `opacity: 1` with `is-visible`
  never applied. The drop cap ships `float: left` before `float: inline-start` so an engine lacking the
  logical value still floats it.

`ProjectsGallery` works differently — it is **mounted but self-hiding**. It returns nothing while `projects`
is empty, so the section appears on its own the moment real entries land in `site.ts`, with no second edit
and no empty heading shipping over a blank grid.

The live page is therefore: Header → Hero → About → Projects → Services → News → Vision/Mission → Footer.

### Projects data

```ts
interface Project {
  name: string;
  tag: string;       // 'Hospitality / Resort' — the gold eyebrow
  image: string;     // cards crop to 4:3, so 4:3 or wider is best
  href: string;      // '/projects/<slug>' once project pages exist
  summary?: string;  // optional second line; renders in every layout
}
```

The fourth entry, `TEMP FOURTH`, is **PLACEHOLDER** and exists only to push the count past three so the
carousel renders its arrows. Delete it, or replace it with a real project, and the section falls back to the
static three-card coverflow.

`ProjectsGallery` picks its layout from the count, because one arrangement cannot serve every case — a
coverflow needs a middle and two shoulders, and a lone card in a three-column grid reads as a loading
failure:

| Count | Layout | Crop |
| --- | --- | --- |
| 1 | Feature — full width | 16:9 |
| 2 | Two equal cards | 4:5 portrait |
| 3+ | Coverflow carousel | 4:5 portrait |

`ProjectCard.astro` renders the first via a `variant` prop (`feature` / `default`).

#### The coverflow

The centred card sits at full size; its neighbours shrink to `scale: 0.84` and dim to 50%. **The shrink is
the standalone `scale` property, never `transform`** — `.reveal` owns transform and `.reveal.is-visible`
resets it to `none`, which would wipe out any transform-based scaling on the same element. The layout box
also stays full size, so shrinking a neighbour can never shove the centred card off-centre.

The active card is whichever one's centre is nearest the track's, recomputed on scroll. Measurements come
from `getBoundingClientRect` because centres are scale-proof — but **arrow steps use `offsetLeft`**, which
transforms do not touch. A rect-based step reads a scaled neighbour's edge ~8% of a card too far in and
overshoots every click; scroll-snap quietly corrects it, which is exactly why the bug survives casual
testing.

Two layouts hide behind one component, switched at 1024px:

- **Three cards on desktop** fit, so the track drops its padding, centres with `justify-content`, and never
  scrolls. The middle card is the focus and stays that way.
- **Everything else** — any count on mobile, four or more anywhere — scrolls, with
  `padding-inline: calc(50% - var(--cf-w) / 2)` so the first and last cards can still reach the centre
  instead of stopping at the track's edge.

`--cf-w` is **a length, never a percentage**: the track's own padding is derived from it, so a percentage
would resolve against a box that depends on it.

Arrows appear only above three projects, and only once the script has run — they do nothing without it, so
the script adds `.cf-ready` to unhide them. They use `aria-disabled`, not the `disabled` attribute, because
a real disable drops focus to the body the moment a keyboard user reaches the last slide. **Below four
projects there are no arrows at all, including on mobile, where the track still scrolls** — swiping is the
only way through. That follows the spec as asked; revisit it if mobile discoverability matters.

A `focusin` handler centres whatever card receives focus. Without it, tabbing to a card the browser judges
"partly visible" scrolls nothing and focus lands on a sliver clipped by the track.

`ProjectCard` takes `reveal={false}` here and the track carries one reveal instead. A per-card scroll-in
reveal never fires for slides parked outside the track's overflow box, so they would sit at opacity 0 until
an arrow dragged them in and then fade up mid-slide.

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
