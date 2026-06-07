# Time-of-Day "Evening Engine" — Design

**Date:** 2026-06-07
**Status:** Approved (visual direction chosen via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Make the site feel like the visitor's actual time of day — "the sound of African evenings" rendered
literally. The hero's atmosphere (glow color/intensity, sun position, grain) shifts across **dawn →
midday → golden dusk → night** based on the visitor's local clock, with a manual override. It stays
inside the brand's warm family and never changes layout, copy, or readability.

This is **mini-project #2 of 4** in the premium-elevation set (the others — ambient player,
field-recordings map — are separate specs).

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Granularity | **Four phases** — `dawn`, `day`, `dusk`, `night` (cross-fading presets) |
| Relationship to dark/light | **Orthogonal atmosphere layer** on top of the existing `data-theme` toggle (it shifts glow/warmth/grain, not the whole palette) |
| What shifts | The **hero atmosphere** — re-points the variables the hero already consumes (`--glow-1`, `--glow-2`, `--grain-op`) + a new sun-position variable |
| Manual override | A **phase chip** in the nav beside the theme toggle: tap cycles `Auto → Dawn → Midday → Dusk → Night → Auto`; persists; default `Auto` |
| Auto liveness | In `Auto`, a ~5-min interval re-resolves the phase so it updates if the page is left open across a boundary |
| Default hour thresholds | dawn 5–8, day 9–16, dusk 17–20, night 21–4 (local hours) |

## 3. Scope

### In scope
- A pure time-of-day module (phase resolution + the inline no-FOUC init script).
- Per-phase atmosphere CSS variables (dark + light), with a smooth post-paint cross-fade.
- The hero consuming a sun-position variable so the light source moves across the day.
- A nav phase-chip control (cycle + persist + Auto).

> **Note (intended, documented post-build):** because the atmosphere variables (`--glow-1`,
> `--glow-2`, `--grain-op`) are inherited on `<html>`, any component that reads them — notably the
> `/studio` hero/teaser/CTA glows — also shifts color/grain per phase. This is intentional
> *site-wide* warmth tracking; the **home hero is the primary mover** (it alone re-points the
> `--sun-x`/`--sun-y` sun position). Verified to read well and keep AA contrast on `/studio` across
> phases. No action needed — recorded so it's a conscious decision, not an accident.

### Out of scope (YAGNI)
- Recoloring the whole page palette per phase (hero atmosphere only).
- Geolocation / real sunrise-sunset times (visitor's device clock hour is enough).
- Animating a literal sun graphic across the hero (the glow position conveys it; no sprite).
- Per-phase imagery or content changes.

## 4. Architecture

A parallel axis to the existing theme system, implemented the same way (an attribute on `<html>` set
before paint by an inline script, with CSS variable sets keyed off it). Pure progressive enhancement:
JS-off renders today's exact look.

```
inline todInitScript (BaseHead, is:inline, before paint)
   read localStorage('hs-tod')  ──default──▶ 'auto'
   if 'auto' → phaseForHour(localHour)         ┐
   else      → the stored phase                ├─▶ document.documentElement.dataset.tod = phase
                                               ┘        (dawn | day | dusk | night)

tod.css
   @property --glow-1/--glow-2/--grain-op/--sun-x/--sun-y  (registered <color>/<%> so they tween)
   [data-tod="dawn|day|dusk|night"] { …atmosphere var values… }   (dark + light variants)
   html.tod-transition { transition: those vars .8s ease }        (added AFTER first paint; no-FOUC)
   @media (prefers-reduced-motion: reduce) { html.tod-transition { transition: none } }

hero (global.css + Hero.astro)
   already uses --glow-1/--glow-2/--grain-op; gains --sun-x/--sun-y in its gradient position
   → re-pointing the vars per phase shifts the hero with no new hero markup

TodControl.astro (in Nav, beside ThemeToggle)
   chip button; click cycles auto→dawn→day→dusk→night→auto; writes localStorage('hs-tod');
   sets/recomputes data-tod; updates chip label; Auto runs a ~5-min re-resolve interval
```

**Why re-point existing variables (not new layers):** the hero already consumes `--glow-1`,
`--glow-2`, and `--grain-op`, and the motion feature's `.hero-glow` uses `--glow-1`. Overriding those
per phase shifts the hero automatically — the smallest, least-risky surface. The only new variable is
the sun position (`--sun-x`/`--sun-y`) used in the hero gradient so the light source travels low-east
→ high → low-west → dim.

**Why `@property` + a class-gated transition:** custom properties don't transition unless registered
via `@property`. Registering the atmosphere vars lets the gradients cross-fade smoothly. The
transition lives on `html.tod-transition`, a class added by JS *after* first paint — so the
phase set at load is instant (no flash from the `@property` initial value), and only later changes
(override taps, the auto-rollover) animate. Unsupported `@property` → instant swap (graceful).

## 5. Components & files

### 5.1 `src/lib/timeOfDay.ts` (pure + the init script)
- `export type Phase = 'dawn' | 'day' | 'dusk' | 'night';`
- `export type TodSetting = 'auto' | Phase;`
- `phaseForHour(hour: number): Phase` — dawn 5–8, day 9–16, dusk 17–20, else night. (Pure, tested.)
- `resolveTod(stored: string | null, hour: number): Phase` — if `stored` is a Phase, return it;
  otherwise (`'auto'`/null/garbage) return `phaseForHour(hour)`. (Pure, tested.)
- `nextSetting(current: TodSetting): TodSetting` — cycle order `auto → dawn → day → dusk → night →
  auto`. (Pure, tested — drives the chip.)
- `export const todInitScript: string` — an IIFE (like `themeInitScript`) that reads
  `localStorage('hs-tod')`, computes the phase via the same thresholds, and sets `data-tod` on
  `document.documentElement`, wrapped in try/catch with a `dusk` fallback. (The script is a string so
  the thresholds are duplicated as inline JS; a test asserts the script contains the right attribute
  and key so it can't silently drift.)

### 5.2 `src/components/BaseHead.astro` (modify)
- Add `<script is:inline set:html={todInitScript}></script>` next to the existing theme-init inline
  script (so `data-tod` is set before paint, no flash).

### 5.3 `src/styles/tod.css` (create; imported in `Base.astro` after `motion.css`)
- `@property` registrations for `--glow-1`, `--glow-2` (`<color>`, inherits), `--grain-op`
  (`<number>`), `--sun-x`, `--sun-y` (`<percentage>`).
- Four `[data-tod="…"]` blocks setting those vars for the **dark** theme, and four
  `[data-theme="light"][data-tod="…"]` blocks with toned-down (lower-opacity) values for light.
- `html.tod-transition { transition: --glow-1 .8s ease, --glow-2 .8s ease, --grain-op .8s ease,
  --sun-x .8s ease, --sun-y .8s ease; }` plus the reduced-motion override that nulls it.
- Concrete per-phase values (dawn: soft gold low-east; day: pale high; dusk: rich terracotta+gold
  low-west = the current signature; night: dim warm embers, grain up) are finalized in the plan.

### 5.4 `src/components/Hero.astro` + `src/styles/global.css` (modify)
- Replace the hero's hard-coded gradient focal position with `--sun-x`/`--sun-y` so the glow position
  follows the phase. Defaults (when no `data-tod`) equal today's values, so the JS-off look is
  unchanged. The `.hero-glow` (motion) already uses `--glow-1` — it inherits the shift for free.

### 5.5 `src/components/TodControl.astro` (create)
- A `<button class="tod-chip" aria-label="Time of day — currently Auto">` rendering a small dot + a
  phase label (`Auto`/`Dawn`/`Midday`/`Dusk`/`Night`).
- Client `<script>` (same pattern as `ThemeToggle`, which works under the persisted nav): on click,
  read current setting from `localStorage('hs-tod')`, compute `nextSetting(...)` *(imported from
  `timeOfDay.ts`)*, persist it, set `data-tod` (recomputing from the hour when the new setting is
  `auto`), update the chip label, and ensure `html.tod-transition` is present so the change animates.
  On load it paints the chip from the stored setting and, if `auto`, starts a `setInterval` (~5 min)
  that re-resolves `data-tod` from the current hour.
- Adds `html.tod-transition` after first paint (a one-liner) so the initial phase didn't animate.

### 5.6 `src/components/Nav.astro` (modify)
- Render `<TodControl />` immediately before `<ThemeToggle />` in `.nav-right`. (`@media(max-width:520px)`
  may hide the chip label like the studio tab does — finalized in the plan.)

## 6. Accessibility, performance & resilience

- **No-FOUC:** `data-tod` set before paint; the cross-fade transition is added only after load.
- **JS-off / unsupported `@property`:** no `data-tod` (or no tween) → the hero shows its default
  (current) atmosphere; everything still works. The chip is a `<button>` that simply does nothing
  without JS (acceptable; it's an enhancement).
- **Reduced motion:** the `html.tod-transition` transition is nulled under
  `prefers-reduced-motion: reduce` — phases snap. (The phase still reflects the hour; only the
  animation is removed.)
- **Contrast:** glows stay behind content (`z-index` already handled by the hero); text/`--text`
  tokens are untouched, so AA contrast is preserved. The plan's per-phase values keep glow opacity in
  a range verified not to wash out hero text in either theme.
- **Performance:** no new network. One small inline script, one ~5-min interval (only in Auto),
  variable swaps (compositor-friendly gradients). No layout shift.
- **CSP:** unchanged (inline scripts already allowed; no external origin).
- **View Transitions interplay:** the chip lives in the persisted `<nav>`, so its listener survives
  client navigations (same as `ThemeToggle`). `data-tod`/`data-theme` live on `<html>` which persists.

## 7. Testing

- **Unit (vitest, real TDD):** `phaseForHour` (each bucket + boundaries 4/5, 8/9, 16/17, 20/21, 0, 23),
  `resolveTod` (explicit phase passes through; `'auto'`/null/garbage → hour-based), `nextSetting`
  (full cycle incl. wrap), and a guard test that `todInitScript` references `data-tod` and the
  `hs-tod` key (so the inline copy can't silently drift from the module).
- **Behavioral (Playwright on built output):** with the clock/timezone emulated to a known hour,
  `document.documentElement.dataset.tod` equals the expected phase; clicking the chip cycles the label
  and updates `data-tod`; the setting persists across reload (localStorage); under emulated
  reduced-motion the `html` transition is `none`.
- `astro check` clean; existing suite stays green.

## 8. Risks / open items

- **Per-phase values are a taste call.** The plan fixes concrete values; we tune visually after build
  (a quick screenshot pass per phase). The dusk preset should match today's hero so "the current look"
  ≈ "evening," which is on-brand.
- **`@property` support:** modern browsers fine; older ones get instant swaps. Acceptable.
- **Light-theme phases:** must stay subtle (light bg shows glows harshly); values toned down. Verified
  in the behavioral/screenshot pass.

## 9. Success criteria

- Loading the site at, say, 7am vs 6pm vs 11pm visibly shifts the hero's light/warmth/sun-position to
  match — without any layout, copy, or contrast change.
- The nav phase chip cycles Auto → Dawn → Midday → Dusk → Night → Auto, the choice persists, and Auto
  tracks the clock (including a live update if left open across a boundary).
- Reduced-motion users get the correct phase with no animation; JS-off users get today's exact site.
- No CWV/CSP regressions.
