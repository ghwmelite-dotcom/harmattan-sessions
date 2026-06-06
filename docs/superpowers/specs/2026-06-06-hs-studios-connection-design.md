# HS Studios ↔ Harmattan Sessions — Connection Design

**Date:** 2026-06-06
**Status:** Approved (visual direction confirmed via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Connect the **HS Studios** AI music studio (`C:\dev\Projects\HS Studios`, a React/Vite + Hono
monorepo, currently live at `hs-studios.pages.dev`) to the **Harmattan Sessions** marketing site
(this repo, Astro, live at `hs.ohwpstudios.org`) so the two read as **one product**, with a
**seamless crossing** between them.

The studio is a private, single-user tool behind Cloudflare Access. The connection is therefore a
**proud public showcase with gated entry** ("private beta" framing) — visitors get the full story;
only the owner can actually enter and use it.

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| How the studio is displayed | **Dedicated `/studio` landing page** (rich story) **+** a condensed **teaser band on the homepage** |
| Audience / access | **Hybrid** — public showcase, gated entry. "Private beta" treatment. |
| Crossing seamlessness | **Same-domain family** — move the studio to `studio.ohwpstudios.org` |
| Page depth | **Rich** — hero, genres, pipeline, release kit, CTA |
| The "studio peek" visual | **Hand-built brand element**, not a live screenshot (avoids the Access auth wall; always on-brand) |

## 3. Scope

Two workstreams. The marketing-site work is the bulk and ships independently of the studio-side
work; the studio-side work is configuration + a light brand pass.

### In scope
- New `/studio` page on the marketing site (5 sections).
- Homepage teaser band linking into `/studio`.
- A `studio-genres` content collection (single source of truth for genre data on the marketing side).
- Nav + `siteConfig` updates.
- HS Studios custom-domain cutover to `studio.ohwpstudios.org`.
- A brand-continuity pass on the HS Studios entry shell + a "back to Harmattan Sessions" link.

### Out of scope (YAGNI)
- Opening the studio to public/multi-user use (stays single-user behind Access).
- Live screenshots / embedding the studio in an iframe.
- Any change to the studio's AI pipelines, data, or auth.
- A branded interstitial/splash on crossing — the same-domain + matched brand makes the direct
  hand-off feel continuous without one. (Revisit only if the jump still feels abrupt.)

---

## 4. Architecture

```
harmattan-sessions (Astro · this repo)            HS Studios (React/Vite + Hono)
┌───────────────────────────────────────┐         ┌──────────────────────────────┐
│ index.astro                           │         │ apps/web  (Pages project)    │
│   Hero                                │         │   • custom domain →          │
│   SoundsGrid                          │         │     studio.ohwpstudios.org│
│   ▶ StudioTeaser  ── links to ──┐     │         │   • brand tokens aligned     │
│   MixesGrid                     │     │         │   • "← Harmattan Sessions"   │
│   …                             │     │         │     back-link                │
│                                 ▼     │         └──────────────┬───────────────┘
│ pages/studio.astro              │     │   Enter the Studio →   │
│   StudioHero ───────────────────┼─────┼────────────────────────┘
│   StudioGenres   ← studio-genres│     │      (siteConfig.studioUrl)
│   StudioPipeline   collection   │     │
│   StudioReleaseKit              │     │
│   StudioCTA ────────────────────┘     │
└───────────────────────────────────────┘
```

**Data flow:** `studio-genres` content collection → consumed by both `StudioGenres` (full cards on
`/studio`) and `StudioTeaser` (chips on the homepage). One edit updates both surfaces.
`siteConfig.studioUrl` is the single source for every "Enter the Studio" link.

---

## 5. Components & files (marketing site)

All components follow existing conventions: Astro components under `src/components/`, brand tokens
from `src/styles/tokens.css`, section classes (`.blk`, `.wrap`, `.sec-head`, `.label`) from
`src/styles/global.css`. No raw hex in components — use the CSS variables. Each component has one
clear job and is independently understandable.

### 5.1 New content collection — `studio-genres`
- **Where:** `src/content/studio-genres/*.json`, registered in `src/content.config.ts`.
- **Schema:** `{ name, tempo (string, e.g. "108 BPM"), signature (string), path ("Lyric · 4-pass" | "Instrumental"), accent (hex string), order (number) }`.
- **Six entries** (from the HS Studios README, authoritative source):
  | name | tempo | path | signature | accent |
  |---|---|---|---|---|
  | Afrobeats | 108 BPM | Lyric · 4-pass | log drum, syncopated bass, vocal chops | `#1D9E75` |
  | Amapiano | 113 BPM | Lyric · 4-pass | log drum bass, jazzy piano, deep house groove | `#6C4FD6` |
  | Dancehall | 98 BPM | Lyric · 4-pass | riddim, heavy sub bass, patois bounce | `#E8B04B` |
  | Alté | 100 BPM | Lyric · 4-pass | dreamy synths, mellow, experimental R&B | `#8A6D4A` |
  | Highlife Fusion | 110 BPM | Lyric · 4-pass | palm-wine guitar, horns, talking drum | `#C96E3F` |
  | Afro-lofi | 82 BPM | Instrumental | kalimba, tape warmth, vinyl crackle (no vocals) | `#7A5230` |

### 5.2 `StudioHero.astro`
- "Private beta" pill, kicker (`HS Studios — in-house studio`), serif headline *"Pick a genre.
  Write a brief. Walk away with a song."*, sub, dual CTA (**Enter the Studio →** = `studioUrl`;
  **See how it works** = `#how`), and the hand-built **studio peek** (browser frame showing genre
  list + a "Pass ② · Hook" panel + live model / neuron-meter pill).
- Warm radial-glow background + grain, matching the site Hero.

### 5.3 `StudioGenres.astro`
- Pulls `studio-genres` via `getCollection`, sorted by `order`.
- 3-column responsive grid of genre cards: accent dot, name, tempo, signature, path badge. Hover
  lift. Mirrors the `SoundsGrid`/`SoundCard` pattern.

### 5.4 `StudioPipeline.astro` (`id="how"`)
- 4 stepped cards: ① Concept → ② Hook → ③ Verses → ④ Polish, with connecting arrows.
- A dashed note card for the **Afro-lofi instrumental path** (texture sliders → single composition pass).

### 5.5 `StudioReleaseKit.astro`
- Two-column: a "kit" card listing the four outputs (full lyrics, style prompts, cover art,
  metadata) + a stylized cover-art tile.

### 5.6 `StudioCTA.astro`
- Final centered band: private-beta pill, "Step into the studio", a line on free-tier + budget
  meter, primary CTA (`studioUrl`), and a subtle same-domain hand-off note.

### 5.7 `StudioTeaser.astro` (homepage)
- Condensed excerpt of the above: one bordered, glowing band — pill, headline *"Pick a genre.
  Walk away with a song."*, one-line pitch, the 6 genre chips (from `studio-genres`), a small
  studio peek, and two CTAs (**Explore the Studio →** = `/studio`; **See how it works** =
  `/studio#how`).
- **Placement:** `index.astro`, between `<SoundsGrid />` and `<MixesGrid />`.

### 5.8 `pages/studio.astro`
- `Base` (title/description/OG for the studio) + `Nav` + `main` (the five Studio components) +
  `Footer`. Sitemap picks it up automatically.

### 5.9 Edits to existing files
- **`src/components/Nav.astro`** — change the Studio link from `href={siteConfig.studioUrl}
  target="_blank"` to an internal `href="/studio"` (same tab). Keep the "New" tag and the
  waveform icon. Remove the `target`/`rel`/external aria wording.
- **`src/siteConfig.ts`** — `studioUrl: 'https://studio.ohwpstudios.org'`. Add a short comment
  that this is the canonical live-studio entry used by every CTA.
- **`src/pages/index.astro`** — import and place `StudioTeaser`.

---

## 6. HS Studios side (cross-repo)

1. **Custom domain.** Add `studio.ohwpstudios.org` as a custom domain on the existing Cloudflare
   Pages project (Pages → Custom domains; CNAME via the `ohwpstudios.org` zone). Cloudflare Access
   policy must cover the new hostname so the gate still applies. *(Owner-run dashboard/DNS step;
   documented as an ops checklist item, not code.)*
2. **Brand continuity.** Align the studio's entry shell (genre picker / top bar) to the Harmattan
   palette and type — warm dark theme, gold `#E8B04B` / terracotta `#C96E3F`, Fraunces + DM Sans —
   reusing the studio's existing CSS-variable theming. Goal: the first paint after the jump looks
   like the same world.
3. **Back-link.** Add a small "← Harmattan Sessions" link in the studio header pointing to
   `https://hs.ohwpstudios.org`, so the crossing is round-trip.
4. *(Optional, low priority)* a brand-tinted first-paint loading state.

---

## 7. Accessibility & quality gates

- AA contrast on all text over the dark/glow backgrounds; verify the gold-on-dark CTA.
- Every CTA is a real `<a>` with a descriptive `aria-label`; focus-visible states on all interactives.
- Touch targets ≥ 44px; ≥ 8px spacing between adjacent CTAs.
- `prefers-reduced-motion` respected for any hover/entrance motion.
- Responsive: hero and band collapse to single-column on mobile; genre grid 3 → 1 col.
- Works in both `data-theme="dark"` and `light` (tokens already define both).
- `astro check` clean; existing `vitest` suite stays green.

## 8. Risks / open items

- **Screenshots:** none needed — the peek is hand-built. (Decision recorded to avoid the Access
  auth wall.)
- **DNS/Access propagation:** the same-domain cutover depends on a manual Cloudflare step; the
  marketing page ships regardless and simply points at whatever `studioUrl` is set to. Until the
  subdomain is live, `studioUrl` can temporarily remain `hs-studios.pages.dev`.
- **Brand drift between repos:** the genre list is duplicated (studio's `packages/shared` vs the
  marketing `studio-genres` collection). Accepted — the marketing copy is a curated showcase, not a
  runtime import across repos. Keep the six names in sync by hand if a genre is added.

## 9. Success criteria

- A visitor on the homepage sees a beautiful studio teaser and can reach the full `/studio` page in
  one click, never leaving the brand world.
- `/studio` tells the complete story (genres, pipeline, release kit) and feels like a native part
  of the site.
- Clicking **Enter the Studio** lands on `studio.ohwpstudios.org` with matching brand and a way
  back — the jump feels like moving rooms, not sites.
- The owner (via Access) reaches a working studio; a visitor hits a tasteful gated entry.
