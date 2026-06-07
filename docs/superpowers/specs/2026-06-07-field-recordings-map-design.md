# Interactive Field-Recordings Map — Design

**Date:** 2026-06-07
**Status:** Approved (form + sound + interaction chosen via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Turn the static "Recorded on location, in Ghana" section into a **sensory centerpiece**: a stylized
map of Ghana whose pins play the **sound of each place** on tap. Real field recordings aren't ready,
so each pin plays a distinct **synthesized ambience placeholder** now, with a built-in path to swap in
the real clips later.

This is **mini-project #4 of 4** in the premium-elevation set (the last one).

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Form | **Stylized SVG map of southern Ghana** with a pin per recording |
| Sound (now) | **Evocative synthesized ambiences** — per-place Web-Audio recipes (noise → filter → LFO gain); no files |
| Real clips (later) | A recording may carry an `audio` URL → the pin plays that clip instead of the synth (same-origin) |
| Interaction | **Click/tap to play** (stops any other); **hover/focus highlights** + shows the label. One sound at a time |
| Auto-stop | Playback stops if the map scrolls out of view, so it never lingers |
| Relationship to the bottom ambient player (#3) | **Independent** — no coupling (avoids play-state desync); brief ambient overlap is acceptable |

## 3. Scope

### In scope
- Extend the `field-recordings` content with pin coordinates + a tone key (+ optional future audio URL).
- A Web-Audio ambience synth (5 placeholder recipes) + a tested `toneConfig` map.
- A click-to-play interaction with a per-pin popover (label + live waveform).
- Rewrite `FieldRecordings.astro` from the chip list into the map.

### Out of scope (YAGNI)
- Sourcing/encoding the real field recordings (a later content task; the swap path is built in).
- A geographically precise Ghana map (a tasteful stylized landmass is enough).
- Ducking/pausing the bottom ambient player when a pin plays (kept independent on purpose).
- Volume control for the map tones (they're short low-level previews).

## 4. Architecture

An upgrade of one section + two small client modules. Progressive enhancement: no-JS shows the map
with labelled pin-buttons (all location/description text present for screen readers); audio needs a
tap (browser gesture requirement) and degrades to silence if unsupported.

```
field-recordings collection (x, y, tone, audio?)  ──build──▶ FieldRecordings.astro
   renders: <svg> Ghana landmass + one <button.fr-pin style=left/top data-tone[/data-audio]
            aria-label="<place> — <desc> — play sound"> per recording
            + a shared popover (name/desc/<canvas> waveform)

src/lib/fieldTones.ts
   toneConfig(key) → ToneConfig   (pure, tested)
   createAmbience(ctx, key) → { analyser, start(), stop() }
      noiseBuffer → BiquadFilter → Gain(↔ LFO osc) → analyser → destination   (+ optional drone osc)

src/lib/fieldMap.ts  (bundled; binds on astro:page-load; singleton-guarded)
   first pin click → create/resume AudioContext (gesture)
   click pin: same→stop; else stop current → (data-audio ? <audio>+MediaElementSource : createAmbience)
              → start (fade) → analyser drives popover <canvas> via rAF → mark active + position popover
   hover/focus: CSS highlight + label;  IntersectionObserver: map out of view → stop
```

**Why synth placeholders:** the user wants the *experience* now without the audio assets. Web-Audio
noise+filter recipes are a few lines each, need no files or network, and each sounds distinct enough
to preview the eventual recording. When a real clip exists, the pin's `audio` field takes over with
zero UI change.

**One-at-a-time + gesture:** the AudioContext is created lazily on the first pin click (browsers block
audio before a gesture). Starting a new pin stops the current ambience first, so only one place ever
sounds. A single `AnalyserNode` on the active source feeds the popover waveform (the same draw
technique as the ambient player).

## 5. Components & files

### 5.1 `src/content.config.ts` (modify)
- Extend the `field-recordings` schema: add `x: z.number()`, `y: z.number()` (pin position as a
  percentage of the map box), `tone: z.enum(['surf','hum','wind','street','rain'])`, and
  `audio: z.string().optional()` (future real-clip URL). Keep `location`, `description`, `order`.

### 5.2 `src/content/field-recordings/*.json` (modify all 5)
Add `x`/`y`/`tone` to each (audio omitted for now):
| file | location | tone | x | y |
|---|---|---|---|---|
| 1 | Labadi Beach | `surf` | 50 | 80 |
| 2 | Makola Market | `hum` | 47 | 73 |
| 3 | Aburi Hills | `wind` | 50 | 54 |
| 4 | Jamestown | `street` | 41 | 79 |
| 5 | Volta | `rain` | 74 | 66 |
(Coordinates are tuned visually in the final task.)

### 5.3 `src/lib/fieldTones.ts` (create)
- `export type Tone = 'surf' | 'hum' | 'wind' | 'street' | 'rain';`
- `export interface ToneConfig { filter: BiquadFilterType; freq: number; q: number; lfoRate: number; lfoDepth: number; gain: number; drone?: number }`
- `export const TONE_CONFIG: Record<Tone, ToneConfig>` — five recipes (e.g. surf = lowpass ~600Hz,
  slow LFO; hum = bandpass ~400Hz + low drone; wind = highpass ~1.2kHz, slow swell; street = bandpass
  ~900Hz + faint drone; rain = highpass ~3kHz, fast shimmer + low rumble drone).
- `export function toneConfig(key: string): ToneConfig` — returns the matching config, or a safe
  default (`TONE_CONFIG.wind`) for an unknown key. **Pure, unit-tested.**
- `export function createAmbience(ctx: AudioContext, key: string): { analyser: AnalyserNode; start(): void; stop(): void }`
  — builds a looping noise `AudioBufferSourceNode` (shared ~2s noise buffer) → `BiquadFilter` → `Gain`
  (an LFO `OscillatorNode` → gain modulates the level) → `AnalyserNode` → `ctx.destination`, plus an
  optional low `drone` oscillator. `start()` fades gain in; `stop()` fades out then disconnects. (Glue;
  verified behaviorally.)

### 5.4 `src/lib/fieldMap.ts` (create)
- Singleton-guarded `init()` bound to `astro:page-load`; `if (typeof document !== 'undefined')` guard so
  the module imports cleanly in node tests (none import it, but consistent with `player.ts`).
- Lazy `AudioContext` on first click. Tracks the active pin + ambience handle.
- `playPin(button)`: resume ctx; if it's the active pin → `stop()`; else stop current, then if the
  button has `data-audio` build an `<audio>`+`MediaElementSource`→analyser graph, otherwise
  `createAmbience(ctx, button.dataset.tone)`; `start()`; position + show the shared popover (name from
  `aria-label`/`data-name`, description from `data-desc`); rAF-draw the analyser onto the popover canvas;
  toggle `is-playing`/`aria-pressed`.
- Hover/focus highlight is pure CSS; an `IntersectionObserver` on the map stops playback when it leaves
  the viewport.

### 5.5 `src/components/FieldRecordings.astro` (rewrite)
- Keep the `<section class="blk" id="field">` + the existing `.sec-head` (label "The moat", h2
  "Recorded on location, in Ghana.", the paragraph) with its `data-reveal`.
- Add `<div id="hs-fieldmap" class="fieldmap" data-reveal>`: a stylized `<svg>` Ghana landmass +
  coastline, then one `<button class="fr-pin" style={`left:${x}%;top:${y}%`} data-tone={tone}
  data-name={location} data-desc={description} aria-label={`${location} — ${description} — play sound`}>`
  per recording, plus a shared `<div class="fr-pop" hidden>` popover containing name, description, and a
  `<canvas class="fr-wave" aria-hidden>`.
- Scoped styles: the map box (aspect-ratio, the SVG), pins (dot + pulse `@keyframes`, `.is-active`
  highlight, `.is-playing`), the popover (glass card), responsive. `@media (prefers-reduced-motion:
  reduce)` stops the pin pulse.
- `<script>import '../lib/fieldMap.ts';</script>`.

## 6. Accessibility, performance & resilience

- **Pins are real `<button>`s** with `aria-label="<place> — <desc> — play sound"` and `aria-pressed`,
  so every location/description is exposed to screen readers and present without JS. Keyboard: pins are
  focusable and Enter/Space plays.
- **No autoplay:** audio starts only from the click/keyboard gesture; AudioContext created/resumed then.
- **Reduced motion:** pin pulse disabled; the popover waveform (user-initiated) remains. SVG is static.
- **Resilience:** unsupported Web Audio or a creation error → the click is a no-op (no broken UI). A
  future `audio` 404 → the `<audio>` error path stops quietly. Unknown `tone` → `toneConfig` default.
- **Performance:** one shared noise buffer; nodes created per play and disconnected on stop (no leak);
  a single rAF only while a pin plays, cancelled on stop and on out-of-view; no network for synth.
- **CSP:** unchanged — synth makes no requests; future same-origin clips are covered by `default-src
  'self'`.
- **View Transitions:** `fieldMap.ts` binds on `astro:page-load` and re-initializes per page (the map
  is page content inside `<main>`, not persisted) — re-binding is idempotent via the singleton guard.

## 7. Testing

- **Unit (vitest, real TDD):** `toneConfig` — each of the five keys returns its distinct config; an
  unknown key (`'xyz'`, `''`) returns the `wind` default; the returned object has the expected shape
  (filter/freq/gain present).
- **Behavioral (Playwright on built output):** exactly 5 `.fr-pin` buttons render with the right
  aria-labels; clicking a pin starts audio (AudioContext "running", pin gets `is-playing`/`aria-pressed`
  and the popover shows the matching name); clicking the same pin again stops it; clicking a second pin
  switches (only one `is-playing`); under emulated reduced-motion the pin pulse animation is `none`.
- `astro check` clean; existing suite green.

## 8. Risks / open items

- **Synth quality is "evocative," not realistic** — by design; it previews the idea and is replaced by
  real recordings via the `audio` field. Recipes are tunable in the final task.
- **Map geography is stylized** — pin coordinates are eyeballed and tuned visually; not survey-accurate.
- **Headless audio in CI** — the behavioral check asserts AudioContext/UI state, not actual sound.

## 9. Success criteria

- The field-recordings section shows a stylized Ghana map; each of the 5 pins plays a distinct ambient
  sound on tap, with a label + live waveform, and only one plays at a time.
- Hover/focus highlights pins; keyboard users can play them; screen readers get every place + description.
- Reduced-motion users get a still map with working (user-initiated) audio; no-JS users get the labelled
  map with no broken behavior. No CSP/CWV regression.
- Dropping a real clip's URL into a recording's `audio` field makes that pin play the real recording with
  no other change.
