## Project

Auristate is a tourism and real estate investment company operating in Syria (coastal developments, historic-city restorations, hospitality/resort projects). This repo is its marketing site, built with Astro.

Intent for the finished site:
- Bilingual, served under `/en` and `/ar` (Arabic as RTL) — not yet implemented
- Static pages (e.g. About, Contact) — contact is a homepage section (`/#contact`), not yet its own page
- Blog: index + individual posts — **done**, `/blog` and `/blog/[slug]`, content from Sanity
- Projects: index + individual project pages — **done**, `/projects` and `/projects/[slug]`, content from Sanity

## Design direction

The client picked the **Warm Heritage Contemporary** concept: warm gold/sandstone tones in a modern rounded grid, regional heritage meets contemporary investment. It is the site theme — new pages follow it rather than introducing a new look.

The alternative concepts (`minimal-luxury`, `bold-editorial`) and the `src/pages/concepts/` picker have been removed; see git history if the earlier explorations are ever needed.

The theme lives in:
- `src/components/*.astro` — one component per homepage section; the reference implementation of the style
- `src/pages/index.astro` — the homepage, now composition only (imports + section order)
- `src/styles/global.css` — brand color tokens (`gold*`, `charcoal`, `sand*`, …) as Tailwind v4 `@theme` values, plus the scroll/entrance animation utilities (`.animate-hero`, `.animate-float`, `.reveal`, all reduced-motion aware)
- `src/layouts/Layout.astro` — the page shell: theme fonts via Astro's Fonts API, plus the header, footer, `<main>`, and reveal script every page shares
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

## The page shell

`Layout.astro` owns everything a page shares, so **a new page is a `<Layout>` and its sections — nothing
else**. It renders the header, wraps the default slot in the site's only `<main>`, renders the footer, and
loads `scripts/reveal.js` once, which is why `.reveal` works on a new page without the page importing
anything. `index.astro` is the worked example: seven imports, seven tags.

Three things to know when writing one:

- **`headerOver` is the only layout knob.** It switches the header to the white-on-media treatment and takes
  it out of flow. Pass it only on pages that open on a full-bleed dark section — the homepage hero is the
  one such page today. Omit it and the header renders on sand in normal flow, which is the default a
  Contact or Projects page wants. The header pins to the top of the wrapper around `<main>`, so it overlays
  whatever section the page opens with; nothing in the page has to cooperate.
- **The shell gives no horizontal container.** `<main>` is bare, exactly as it was when the sections sat
  directly in `index.astro`, so section backgrounds stay full-bleed and each section brings its own
  `mx-auto max-w-page px-6`. Copy that from any existing component.
- **The column is what keeps the footer down.** `body` sets no background, so on a page shorter than the
  viewport a footer in normal flow would ride up mid-screen and leave bare white beneath it. The
  `flex min-h-dvh flex-col` wrapper plus `flex-1` on the element before the footer is the whole fix; it
  costs the tall homepage nothing, since column flex items keep `min-height: auto`.

There is deliberately **no skip link** — `<main>` is a landmark, but nothing yet lets a keyboard user jump
to it past the nav. Worth adding when the nav grows or a mobile menu lands.

## SEO and social previews

`Layout.astro` takes `title`, plus optional `description`, `image`, `noindex`, and `headerOver`. It emits the
description, canonical, Open Graph, and Twitter card tags; the description and OG image default to the
homepage's.

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

Static copy lives in `src/data/site.ts` — hero, about, services, vision/mission, nav, contact, social.
Section components import from it and never hardcode copy. **Projects and blog posts are the exception: they
live in Sanity** and are fetched at build time (see "Content: Sanity CMS").

Most nav entries are in-page anchors into the homepage sections — `/#about`, `/#projects`, `/#services` — so
they are coupled to the `id` on each section's root element. `News` is the exception: it keeps its label but
points at `/blog`, the real index. The homepage section it used to scroll to still exists and is still called
News. Root-relative rather than bare
`#about`, because `Footer.astro` renders the same array and now ships on **every** page via the layout —
those anchors stopped being anticipatory the moment the shell landed and are load-bearing off the homepage. `Contact Us`
points at `/#contact`, the homepage section — it pointed at `/contact` and 404'd until that section landed.

A nav entry with a `children` array renders as a dropdown **in the header only** — `Footer.astro` reads the
same array and stays flat. `About Us` uses it for `Who We Are` (`/#about`) and `Mission and Vision`
(`/#vision-mission`), so it now depends on a third section id. `Projects` uses it for `All Projects` (`/projects`)
plus the six project types. Those type hrefs are the `projectType` **values**, and `/projects` renders a
section with each as its `id` — so `#tourism-hospitality`, `#residential`, `#education`, `#commercial-leisure`,
`#retail-entertainment`, and `#commercial` now resolve. Nothing derives the list: a new project type means
editing **three** places — the Studio schema's `PROJECT_TYPES`,
the labels in `src/lib/sanity.ts`, and this menu. A project whose type matches none of them still appears on
`/projects` under an "Other" heading rather than vanishing silently. Each trigger keeps its own
`href`, so no item is a dead end. The panel opens on `:hover` and `:focus-within` in CSS; the small script in
`Header.astro` covers touch, where neither fires — under `(hover: none)` the first tap opens the menu and the
second follows the link. Below 768px the nav is hidden entirely and there is still no mobile menu.

**Only `hero`, `about`, and `contact.email` are client copy.** `social` and `footerTagline` are placeholders
marked as such in the file, as are `contact.phone` and `contact.address` — the phone number is invented and
must be replaced before launch.

The footer's `social` entries render as **icons only**, so `label` never appears on screen and serves as the
link's `aria-label`. `icon` selects a glyph from `SocialIcon.astro`, whose path table is typed
`Record<SocialIconName, string>` against the union in `site.ts` — adding a network to one side fails the
build until the other catches up. Those paths are simple-icons@13 (CC0) copied verbatim, not redrawn; the
component header records where to re-fetch them. LinkedIn, Instagram, and Facebook still point at `#`.
**WhatsApp is the first live outbound link on the site** — it is built from `contact.phone`, which AGENTS.md
flags as invented, so confirm the number before launch or it delivers visitors to a stranger.

On the dark ground the icons need no special-casing: `gold-light` clears both the 3:1 non-text threshold and
the 4.5:1 text one, so glyphs and links share a single hover color.

`SectionHeading` sets the pair every section shares: an 18px eyebrow, 20px at `md`, over a `text-3xl` title.
**The eyebrow carries the emphasis** — it was raised from 12px and the title deliberately left where it was,
because the eyebrow is the section's name ("Our Projects", "Our Purpose") and the title beneath it is a line
of copy. It is still the smaller of the two; asking for a bigger "section title" here means the eyebrow.
`ProjectsGallery` inlines the same pair by hand for the dark ground, so the two move together or not at all.

**Keep the eyebrow under 24px.** At 24px it becomes large text by WCAG's measure, the threshold drops from
4.5:1 to 3:1, and the constraint recorded below — VisionMission's glow offset — stops being one. It was
measured against the 4.5:1 line.

Raising the *title* instead has its own cap: Services' "From First Study to Final Handover" must stay on one
line (715d43c), and at 17.1em in Fraunces against `max-w-page` minus `px-6` that ceiling is ~57px at `lg`,
~72px once the container caps at 80rem. Re-measure if the brand's BankGothic ever replaces Fraunces.

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
  not composition. The eyebrow is 20px `gold-deep`, which is 4.51:1 on bare sand — one hundredth over the
  minimum, and still normal text by WCAG's measure at that size, so it has no margin for any tint at all. Full-bleed the glow and it reads 3.67:1; dimming does not
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
is empty, so the section appears on its own the moment something is published in Sanity, with no code change
and no empty heading shipping over a blank grid. `News` behaves the same way for the latest post. Both now
take their data as a **prop** from `index.astro`, which does the fetching — they import nothing themselves.

`Contact` closes the page. Its ground is `bg-white/50`, not `bg-sand` — VisionMission above it is bare sand,
and that alternation is the only thing separating the two sections.

**There is no server, so the form does not submit anywhere.** It composes a `mailto:` to `contact.email` in
JS and assigns `location.href`; `action="mailto:"` was avoided because browser behaviour varies and Chrome
fronts it with a warning dialog. Three consequences:

- Newlines are normalised to CRLF before `encodeURIComponent`. A bare `%0A` collapses into one run of text
  in Outlook.
- The textarea is capped at 1200 chars so the assembled URL stays inside the ~2000 the strictest clients
  accept.
- **The form can never be the only route to the inbox** — it needs a configured mail client, which a visitor
  on a shared machine or a webmail-only browser does not have. The plain `mailto:`, `tel:`, and WhatsApp
  links beside it are that fallback, not decoration. They do *not* cover a JS-less visitor: they sit in a
  `.reveal`, so like every other section on the site they stay at `opacity: 0` until the reveal script runs.

Real server-side delivery means a Cloudflare Pages Function plus an email API key (Resend or similar), which
is a separate change: it would be the site's first non-static piece.

Form controls set their own convention, since nothing else in the repo has any. Two measured constraints:
input borders are **full-opacity `gold-dark`** (3.19:1 — the border is the control's only boundary, and
VisionMission's `/20` hairline is 1.6:1), and the submit button is **`bg-gold-deep`**, not the hero's
`gold-dark`: white on it is 5.73:1 against 3.59:1, so the hero's primary CTA is itself under AA at 14px.

The live page is therefore: Header → Hero → About → Projects → Services → News → Vision/Mission → Contact →
Footer, with the header and footer coming from the layout rather than from `index.astro`.

### The scroll stack

The homepage opens on a three-layer parallax: **Hero and About pin to the top of the viewport while
Projects rises over them.** It is `position: sticky` and nothing else — no scroll handler, no
`transform`. That is deliberate: `.reveal` owns `transform` on nearly every element in those
sections, so anything transform-driven here would be wiped by `.reveal.is-visible`.

`index.astro` wraps exactly those three sections in a bare `<div>`, which is the one thing in that
file that is not a section tag. **It must include Projects.** Sticky travel is bounded by the
containing block, so with Hero and About alone About's bottom would *be* the wrapper's bottom and it
would have nowhere to hold. All three max out at the wrapper's bottom edge, which is why the release
is invisible — the opaque projects section is covering them at the moment they unpin.

Four things it depends on:

- **Layer order is explicit**: hero `z-0` (set by hand rather than left to its `isolate`), About
  `relative z-10`, Projects `relative z-20`. Without it About slides *under* the hero, since sticky
  creates a stacking context that paints above later siblings.
- **Anything over the hero must be opaque, or the video shows through it.** About's `bg-white/50`
  became `bg-parchment`, a new `--color-parchment: #f7f1e6` in `global.css` — the same value
  `white/50` composited to over sand, and the same value the hero's bottom scrim fades to, so the
  at-rest seam is unchanged. `Contact` still uses `bg-white/50` and is fine; it never overlaps the
  hero. Projects was already `bg-nearblack`.
- **Both pins carry their own `prefers-reduced-motion: no-preference` guard.** The global reduce
  block in `global.css` only covers `.reveal` and `.animate-*`.
- **The two size gates are measured, not defensive.** A sticky element taller than the viewport has
  its offset clamped at `top: 0`, so everything below the fold becomes permanently unreachable — no
  amount of scrolling gets to it. The hero is gated on `min-height: 640px` because at 844×390 it
  measures 473px against a 390px viewport and both CTAs would be lost. About is gated on
  `min-width: 768px` because below that its grid collapses to one column and it grows to ~740px,
  which is where its last paragraph would go. Under either gate the effect drops a layer rather
  than breaking.

No ancestor between `<html>` and the wrapper may clip overflow or sticky silently stops working;
`Layout.astro`'s wrappers and `<main>` set none today.

One accepted cost: **the hero video keeps decoding while pinned.** Its IntersectionObserver pauses
playback when the video leaves the viewport, and a sticky element never leaves — so it now plays
behind About and Projects instead of stopping after roughly one viewport of scroll. Pausing once
the hero is fully covered is the fix if that ever shows up on mobile battery.

### Projects data

Projects live in **Sanity**, not `site.ts` — see "Content: Sanity CMS" below for the schema and queries.
`ProjectsGallery` and the `/projects` pages receive `ProjectSummary[]` from `src/lib/sanity.ts`.

Two fields behave unlike the old hardcoded shape:

- **There is no `image`. The card's photo is `gallery[0]`** — the first item of the project's photo array,
  with no separate cover field. Reordering the gallery in the Studio changes the card. The schema requires at
  least one photo for exactly this reason; `ProjectCard` still guards against its absence rather than
  crashing the build on a document that predates the rule.
- **There is no `tag`. `projectType` stores a slug** (`tourism-hospitality`, `residential`, `education`,
  `commercial-leisure`, `retail-entertainment`, `commercial`), not display text, because that value doubles
  as the section id on `/projects` that the header dropdown links to. `projectTypeLabel()` in
  `src/lib/sanity.ts` maps it back for the card pill. Changing a value breaks three menu links; changing a
  label is free.

`href` is gone too — it is derived as `/projects/${slug}` at render, so it can never point somewhere stale.

The old `TEMP FOURTH` placeholder was **dropped rather than migrated**. It existed only to push the count
past three so the carousel would render its arrows, and a live project called TEMP FOURTH was never the
intent. With the three real projects the carousel is a centred row with no arrows; publishing a genuine
fourth brings them back on its own.

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

**Project and blog images now live in Sanity, not the repo.** They are uploaded through the Studio and served
from Sanity's CDN with the crop baked into the URL. Nothing in `public/images/projects/` is referenced by the
site any more — those three files were uploaded to Sanity by the seed script and are kept only as the source
of that import.

| Path | Status |
| --- | --- |
| `public/images/hero/placeholder.png` | The hero poster and LCP element. 1.3 MB — the largest thing the site ships |
| `public/images/hero/hero-bg.svg` | Unused since the video hero landed; kept for non-video pages |
| `public/images/hero/video-poster.svg` | Superseded by `placeholder.png` |
| `public/images/projects/*.jpg` | Migrated into Sanity. No longer referenced by any component |
| `public/images/services/*.jpeg` | Still local — `services` remains in `site.ts` |
| `public/og-image.png` | 1200×630 social card |

An earlier version of this table listed `filler-*.svg` and `stock-*.jpg` files that **no longer exist**, along
with a `README.md` recording their provenance. All were removed before the real client renders landed.

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

The header takes an `over` prop that switches it to the white-on-media treatment and absolutely positions it.
Pages do not pass it directly — `Layout.astro` does, from its own `headerOver`, and owns the positioned
wrapper the header pins to. See "The page shell" above.

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

## Content: Sanity CMS

Projects and blog posts are edited in **Sanity Studio** by the client, not in this repo. Everything else
(hero, about, services, vision/mission, nav, contact) is still static in `src/data/site.ts`.

**The site stays fully static.** Content is fetched at *build* time — the browser never talks to Sanity, so
pages load as fast as before and survive a Sanity outage. The cost is that publishing is not instant:

```
Publish in Studio → Sanity webhook → Cloudflare Pages deploy hook → rebuild (~1 min) → live
```

### Two apps, one repo

| | |
| --- | --- |
| `studio/` | Standalone Sanity Studio. Own `package.json`, own `node_modules`, React + `sanity`. |
| repo root | The Astro site. Reads Sanity with `@sanity/client`. **No React.** |

They share a repo so a schema change and the query change that depends on it land in the same commit — the
two are tightly coupled, and across two repos the site can deploy against a schema it no longer matches.

Two things keep them from contaminating each other, both easy to undo by accident:

- **`studio` is in `tsconfig.json`'s `exclude`.** Without it, `include: ["**/*"]` drags the Studio's
  React/Sanity files into the site's typecheck under `astro/tsconfigs/strict` and produces a wall of errors
  about dependencies the site does not have.
- **There are no npm workspaces, deliberately.** Root `npm install` therefore never reads
  `studio/package.json`, so Cloudflare never installs React or the Studio when building the site.

`@sanity/astro` was tried and removed. It is the officially recommended integration, but it declares `react`,
`react-dom`, `react-is`, `sanity`, and `styled-components` as **peerDependencies**, which npm auto-installs —
852 packages in the site's tree, reinstalled on every content publish. Its two benefits are the
`sanity:client` virtual module and Visual Editing, and a static site with a standalone Studio uses neither.
Plain `@sanity/client` is ~25 packages. Reach for `@sanity/astro` only if Visual Editing is actually wanted,
which needs on-demand rendering as well.

### `src/lib/sanity.ts`

The single entry point: client, `urlFor()`, `projectTypeLabel()`, types, GROQ queries, and fetch helpers.
Four things in it are load-bearing and easy to regress:

- **`perspective: 'published'` is set explicitly.** It is the only thing keeping unpublished drafts off the
  live site.
- **`apiVersion` is pinned and must stay ≥ `2025-02-19`.** Below that the client's default perspective is
  `raw`, which returns drafts — so an innocent-looking version bump downward silently publishes every draft.
- **`useCdn: false`.** The build is triggered *by* a publish webhook; the CDN can serve a stale response for
  a short window afterwards, which would make the rebuild ship the very content it was fired to collect.
- **Every list query filters `defined(slug.current)`.** A document without a slug produces a
  `getStaticPaths` entry of `undefined`, which either fails the build or silently collides with another route.

Missing env vars **throw at build** rather than degrading. Without that the client constructs fine, every
query returns nothing, and the site builds "successfully" with an empty blog and no projects — which reads
as a content problem, not a configuration one.

`scripts/sanity-check.mjs` is the standalone diagnostic; it mirrors the same client config and reports
whether drafts are being correctly excluded:

```
node --env-file=.env scripts/sanity-check.mjs
```

### Deploying the Studio

```
cd studio && npm run deploy      # → https://auristate.sanity.studio
```

Sanity hosts it free. `studioHost` is pinned in `sanity.cli.ts` so the deploy is non-interactive and
repeatable — the name is claimed globally across all of Sanity, so if it ever conflicts, change it in that
file rather than passing a one-off flag. `autoUpdates: true` means the hosted Studio pulls Sanity's own
patches without a redeploy; a redeploy is only needed after **schema** changes.

There is no custom-domain support on the free hosting without a reverse proxy. Self-hosting the output of
`sanity build` would allow one, at the cost of a second deploy to maintain, manual Studio version bumps, and
adding the new origin to the project's CORS allowlist by hand.

`public/_redirects` gives the Studio a memorable address on the site's own domain — `/admin` and `/studio`
both 302 to it, wildcards included so deep links survive. Two things about that file:

- **It is a Cloudflare Pages feature, not an Astro one.** Astro copies it into `dist/` untouched and never
  reads it, so `astro dev` returns 404 on `/admin`. That is expected. It also means the redirect silently
  stops working if the site ever moves off Pages.
- **302, not 301.** These point at a hosted Sanity URL that could move; a 301 is cached hard by browsers and
  would keep sending people to a dead host long after the rule was fixed.

**The Studio URL is publicly reachable but login-gated** — only project members get in. The client is invited
at sanity.io/manage → project → Members, with the **Editor** role: create, edit, and publish content, but no
project settings. That invite is what makes this a single-admin CMS.

Schema changes need **two** commands, and forgetting the second is a common confusion — the Studio shows the
new field while `sanity schemas deploy` is what makes it visible to the Content Lake tooling:

```
cd studio && npm run deploy      # the editing UI
cd studio && npx sanity schemas deploy
```

### Rich text

Bodies are **Portable Text**, rendered with `astro-portabletext`. It is structured JSON, not HTML, so an
editor cannot inject a `<script>` and no sanitizer is needed. There is no typography plugin in this project,
so the `.prose-auristate` block in the two `[slug].astro` pages supplies the rhythm.

### Ordering

Projects are dragged into order in the Studio via `@sanity/orderable-document-list`, which writes a
`lexorank` string to `orderRank`. That order is **content, not a Studio convenience** — it decides which
slide the carousel opens on and which project becomes the full-width feature at a count of one. Queries sort
by `order(orderRank)`. (The older `sanity-plugin-orderable-document-list` is deprecated and peers React 17;
do not install it.)

### Env

`PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are **optional**. `src/lib/sanity.ts` defaults to
`s055z044` / `production` and logs a warning when it falls back, so a build never fails for want of them.
Neither is a secret — both appear in every image URL the site serves.

They default because Cloudflare Pages keeps **Production and Preview variables as separate sets**, and a new
Pages project or a fresh Preview environment starts with neither. Requiring them turned a dashboard oversight
into a hard build failure. Set them only to point a build at a different project or dataset.

Verified both ways: with no `.env` and no environment variables the build produces every page and warns; with
them set it builds silently. Astro does surface real `process.env` variables to `import.meta.env` as long as
they carry the `PUBLIC_` prefix, so the dashboard route works — it is just no longer mandatory.

`SANITY_WRITE_TOKEN` is **local only** and needed solely by the seed script. The site build never writes, so
it must never reach Cloudflare.

### Seeding

`studio/scripts/seed-projects.mjs` imported the three original projects and their images. It lives under
`studio/` because it needs `lexorank`, which the site has no reason to depend on. It is idempotent — it looks
each project up by slug first — and it seeds **only** name, type, and photo. `location`, `area`,
`description`, and `faqs` were left empty rather than invented; a page that shows nothing beats one that
shows fiction.

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
