# Motion: View Transitions + Scroll Choreography — Design

**Date:** 2026-06-06
**Status:** Approved (motion direction chosen via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Elevate the marketing site (`hs.ohwpstudios.org`) to a premium feel through **motion**: seamless
page-to-page transitions and choreographed scroll reveals — without harming readability,
performance, or accessibility.

This is **mini-project #1 of 4** in the "premium elevation" set (the others — persistent ambient
player, time-of-day evening engine, interactive field-recordings map — are separate specs). It's
sequenced first because the persistent player depends on the cross-navigation element persistence
this introduces.

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Scroll reveal — default | **Soft fade-up (A)** — content lifts ~20px + fades in, gently staggered, once per element |
| Scroll reveal — hero | **Depth (C)** — blur-in + slight scale + a drifting warm glow, reserved for the hero only |
| Cinematic mask (B) | **Not used** |
| Page transition — default | **Cross-dissolve (A)** for all navigation; the nav persists (never reloads/flashes) |
| Page transition — signature | **Shared-element morph** reserved for **home → /studio**: the homepage Studio teaser "peek" grows into the studio hero |
| Directional slide (B) | **Not used** |
| Accessibility | Everything gated on `prefers-reduced-motion`; reduced-motion = instant, no transform |

## 3. Scope

### In scope
- Site-wide Astro View Transitions (`<ClientRouter />`) with the default cross-dissolve.
- Persisting the nav across navigations.
- A shared-element morph for the home → /studio crossing.
- An IntersectionObserver scroll-reveal system (fade-up default, depth hero variant).
- Wiring `data-reveal` onto section headers/grids across `/`, `/studio`, `/mixes`.
- A drifting-glow layer on the hero.

### Out of scope (YAGNI)
- The persistent ambient player / waveform (mini-project #3 — but this lays its persistence groundwork).
- Time-of-day engine and field-recordings map (#2, #4).
- Parallax on every element, custom cursors, intro/splash animations.
- Any redesign of layout, copy, or color.

## 4. Architecture

Two independent client-side **progressive-enhancement** layers over the existing static pages. Both
degrade to plain, fully-visible content when JavaScript is off, the View Transition API is absent, or
the user prefers reduced motion. Neither changes the server-rendered HTML's content — only its motion.

```
                         ┌─────────────────────────────────────────────┐
  Astro <ClientRouter/>  │ client-side routing + View Transitions      │
  (BaseHead, <head>)     │  • default: cross-dissolve (all nav)        │
                         │  • nav: transition:persist (no flash)       │
                         │  • home→/studio: shared transition:name      │
                         │      teaser peek  ⇄  studio hero peek (morph) │
                         └─────────────────────────────────────────────┘
                         ┌─────────────────────────────────────────────┐
  scroll-reveal.ts       │ IntersectionObserver reveals [data-reveal]   │
  (re-inits on           │  once on enter:                              │
   astro:page-load)      │  • default  → fade-up                        │
                         │  • "depth"  → blur-in + scale (hero)         │
  motion.css             │ states behind @media (prefers-reduced-motion │
                         │  : no-preference) + .reveal-ready (no FOUC)  │
                         └─────────────────────────────────────────────┘
```

**Why View Transitions for the morph (not a bespoke animation):** the browser's View Transition API
matches two elements that share a `transition:name` across a navigation and tweens between them
automatically. Astro's `<ClientRouter />` wires this up; we only tag the two peek elements. This is
far simpler and smoother than hand-rolling a FLIP animation, and Astro provides the no-API fallback.

**Persistence groundwork:** `transition:persist` on the nav keeps that DOM subtree alive across
client navigations (no re-mount, no flash). Mini-project #3's player bar will live in/next to the
persisted region so audio never stops when navigating — this spec establishes the pattern.

## 5. Components & files

### 5.1 `src/components/BaseHead.astro` (modify)
- Add `import { ClientRouter } from 'astro:transitions';` and render `<ClientRouter />` in the head.
  This enables site-wide view transitions; the default cross-dissolve needs no extra config.
- Add a tiny **inline, render-blocking** no-FOUC script (`is:inline`, alongside the existing
  theme-init script) that adds a `reveal-ready` class to `document.documentElement` **only when**
  `matchMedia('(prefers-reduced-motion: no-preference)').matches`. This lets the CSS hide
  `[data-reveal]` elements *before first paint* (no flash), but only when motion is wanted and JS
  ran. If JS is off or motion is reduced, the class is never added and content renders visible.

### 5.2 `src/components/Nav.astro` (modify)
- Add `transition:persist` to the root `<nav>` so it is preserved across client navigations (stops
  the nav from cross-fading with the body and pre-stages the player-bar persistence). The
  `ThemeToggle` state inside it therefore also survives navigations.

### 5.3 The shared-element morph (modify 2 files)
- `src/components/StudioTeaser.astro` — add `transition:name="studio-portal"` to the `.st-band-peek`
  element (the little studio preview on the homepage).
- `src/components/StudioHero.astro` — add `transition:name="studio-portal"` to the `.st-peek`
  element (the studio's hero preview on `/studio`).
- Because the two live on different pages, the name is unique per page; navigating home → /studio
  morphs the teaser peek into the hero peek. Navigations to /studio from pages without the teaser
  simply cross-dissolve (no source element — graceful).

### 5.4 `src/lib/scroll-reveal.ts` (create)
- Exports nothing consumed elsewhere; it's a side-effecting init module imported by a bundled
  `<script>` in `Base.astro`.
- On `astro:page-load` (fires on first load **and** after every view-transition navigation):
  - If `matchMedia('(prefers-reduced-motion: reduce)').matches` → do nothing (CSS already shows all).
  - Else create one `IntersectionObserver` (threshold ~0.12, `rootMargin` bottom trim so reveals
    fire slightly before fully in view); observe every `[data-reveal]:not(.in)`; on intersect add
    class `in` and `unobserve` (reveal once).
- Idempotent across re-inits (guards against double-observing the same node).

### 5.5 `src/styles/motion.css` (create; imported in `Base.astro` after `global.css`)
- All rules scoped under `@media (prefers-reduced-motion: no-preference)` **and** the
  `html.reveal-ready` class:
  - `[data-reveal]` → `opacity:0; transform:translateY(20px); transition:opacity .6s ease-out,
    transform .6s ease-out;` with a small stagger via `[data-reveal][data-reveal-i="1|2|3..."]`
    `transition-delay` (or a `--rd` custom property set inline).
  - `[data-reveal].in` → `opacity:1; transform:none;`
  - `[data-reveal="depth"]` (hero) → initial `opacity:0; transform:translateY(26px) scale(.97);
    filter:blur(10px);` transitioning to clear on `.in`.
  - `.hero-glow` (the drifting warm-glow layer) → a `radial-gradient` using `var(--glow-1)` that
    animates position via `@keyframes hs-drift` (slow, infinite, ease-in-out). The keyframe itself is
    inside the reduced-motion guard so it never animates under reduce-motion.
- Outside the guard: nothing — so reduced-motion users get the untouched static page.

### 5.6 Reveal wiring (modify pages/components — markup only)
Add `data-reveal` to the section headers and card grids so they choreograph in. Use a small stagger
index where a group of siblings should cascade.
- `src/pages/index.astro` sections / their components: `SoundsGrid`, `StudioTeaser`, `MixesGrid`,
  `FieldRecordings`, `ListenPlatforms`, `Newsletter` — `data-reveal` on each `.sec-head` and a
  staggered `data-reveal` on the immediate card children.
- `src/pages/studio.astro` components: `StudioGenres`, `StudioPipeline`, `StudioReleaseKit`,
  `StudioCTA` — same pattern.
- `src/pages/mixes.astro` — section header + grid.
- `src/components/Hero.astro` and `src/components/StudioHero.astro` — `data-reveal="depth"` on the
  hero inner content + add the `.hero-glow` layer element.

### 5.7 `src/layouts/Base.astro` (modify)
- Import `../styles/motion.css` after `global.css`.
- Add `<script>import '../lib/scroll-reveal.ts';</script>` (bundled module) before `</body>`.

## 6. Accessibility, performance & resilience

- **Reduced motion:** all motion is inside `@media (prefers-reduced-motion: no-preference)`. Reduced
  motion → no hidden states, no transitions, instant nav (Astro respects the preference for view
  transitions too). Verified in the test pass.
- **No FOUC, no JS-off breakage:** hidden states require `html.reveal-ready`, set only by the inline
  script when motion is allowed. JS off → content visible immediately.
- **Performance:** one shared `IntersectionObserver`; reveal-once then `unobserve`. `blur()` is used
  only on the single hero element (not at scale). `transition:persist` avoids nav re-mounts. No new
  network requests; `<ClientRouter />` ships a small first-party runtime (no external origin).
- **CSP:** unchanged. View Transitions are same-origin (`connect-src 'self'`), the router runtime is
  first-party (`script-src 'self'`), inline scripts are already permitted (`'unsafe-inline'`). See
  [[csp-headers]] — no allowlist change needed.
- **Interaction with existing scripts:** the newsletter submit handler and the `yt-hydrate` refresh
  currently run once at load. With `<ClientRouter />` they must run on `astro:page-load` too, or they
  silently stop working after a client navigation. This spec moves/duplicates their init onto
  `astro:page-load` (idempotent) as part of the change. (Without this, e.g. the homepage YouTube
  refresh would not re-run after navigating back from /studio.)

## 7. Testing

Minimal pure logic, so verification is build-gate + browser-behavioral (consistent with how this
repo verifies UI):
- `astro check` clean; `npm run build` succeeds; existing `vitest` suite stays green.
- **Playwright behavioral pass** on the built output:
  1. `document.startViewTransition` path: `<ClientRouter />` runtime present; navigating `/` → `/studio`
     keeps the same persisted `<nav>` node (no full reload).
  2. `[data-reveal]` elements below the fold start without `.in`; after scrolling into view they gain
     `.in` (revealed).
  3. With `prefers-reduced-motion: reduce` emulated, `[data-reveal]` elements are visible
     (`opacity:1`, no transform) without scrolling, and `html` has no `reveal-ready`.
  4. After a client navigation, `astro:page-load`-bound behavior re-runs (e.g., a `[data-reveal]` on
     the destination page reveals, confirming re-init).

## 8. Risks / open items

- **`astro:page-load` re-init for existing scripts** (newsletter, yt-hydrate) is the main integration
  risk; covered in §6 and the test pass. If missed, those features break after a client nav.
- **Morph robustness:** if the teaser markup changes, the `transition:name` must stay on the peek.
  Documented inline. Falls back to cross-dissolve if the source element is absent.
- **`transition:persist` + theme toggle:** persisting the nav means the toggle button persists; the
  theme is already stored on `<html>` (which also persists), so no double-application. Verified.

## 9. Success criteria

- Navigating between `/`, `/studio`, `/mixes` cross-dissolves smoothly with no nav flash and no full
  reload; home → /studio shows the peek morphing into the hero.
- Sections rise in softly as you scroll (once each); the hero greets with an atmospheric depth reveal
  and a slow drifting glow.
- With reduced motion or JS disabled, the site looks and reads exactly as it does today — no flashes,
  no hidden content, instant navigation.
- Lighthouse/CWV unaffected; no CSP or network regressions.
