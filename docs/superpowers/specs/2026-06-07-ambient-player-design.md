# Persistent Ambient Player — Design

**Date:** 2026-06-07
**Status:** Approved (form factor + visualizer chosen via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Let visitors actually *hear* the brand. A tasteful, opt-in audio player streams a looping ambient bed
and **follows the visitor across pages without stopping** — turning a beautiful but silent site into a
premium music experience.

This is **mini-project #3 of 4** in the premium-elevation set (the field-recordings map is #4).

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Form factor | A quiet **"Listen" pill** that expands into a **slim glass bar** docked at the bottom |
| Visualizer | **Flowing waveform** (oscilloscope line), driven by a real Web Audio `AnalyserNode` |
| Start behavior | **Tap to listen** — never autoplay (browser requirement); `<audio loop>` for seamless repeat |
| Persistence | Plays continuously **across page navigations** (via `transition:persist`, like the nav) |
| Audio source | `public/audio/generational-rhythm-vol-i.mp3` (same-origin; already committed) |
| Bar label | **`Generational_Rhythm_Vol_I`** (verbatim) |
| Volume | Adjustable, **persisted** to `localStorage`; default 0.7 |

## 3. Scope

### In scope
- A persistent `<audio>` + player UI rendered once site-wide.
- Tap-to-listen → play/pause, the live waveform, volume, and a collapse control.
- Volume persistence; graceful failure if the file is missing/blocked.

### Out of scope (YAGNI)
- A playlist, track switching, or skip/next (it's one infinite ambient bed).
- A seek/progress scrubber (meaningless for an infinite loop).
- Auto-resume of playback on a fresh page load / new session (autoplay is blocked anyway; only volume
  is remembered).
- Tying the bar to the hero's YouTube "now playing" line (that stays a separate, text-only element).
- Streaming the actual latest YouTube track (not feasible cleanly).

## 4. Architecture

One persistent player, reusing the cross-navigation persistence pattern established in the motion
feature (View Transitions). Pure progressive enhancement: no JS / no Web Audio support / missing file
all degrade to "no player," never a broken page.

```
Base.astro (every page)
  └─ <Player />  (transition:persist — DOM + playback survive client navigations)
       ├─ <audio id="hs-audio" preload="none" loop>  <source .../generational-rhythm-vol-i.mp3>
       ├─ "Listen" pill   (collapsed default)
       └─ slim glass bar  (expanded while engaged): play/pause · vinyl · label · <canvas> · volume · ✕

src/lib/player.ts  (bundled module, runs ONCE; the persisted node keeps it alive across navs)
   on first user gesture (Listen / play):
     AudioContext  →  createMediaElementSource(audio)  →  AnalyserNode  →  destination   [created once]
     audio.play(); ctx.resume()
   rAF loop while playing: analyser.getByteTimeDomainData() → draw flowing line on <canvas>
   play/pause toggle · volume (persist 'hs-volume') · collapse (pause + back to pill)
   all wrapped so a play() rejection (missing file / blocked) reverts to the pill, no error surfaced
```

**Why `transition:persist`:** with `<ClientRouter />` active (from mini-project #1), tagging the
player region `transition:persist` keeps the same `<audio>` element — and its playback position —
alive across client navigations, so the music never cuts out when moving between `/`, `/studio`,
`/mixes`. `player.ts` binds once (like `ThemeToggle`/`TodControl`) and survives.

**Web Audio one-time graph:** `createMediaElementSource()` may be called only once per media element,
so the AudioContext/source/analyser graph is created lazily on the first play and guarded by a
singleton flag. The context is created/resumed inside the user-gesture handler (browsers require a
gesture to start audio).

**Audio loading:** `preload="none"` means the ~2.8 MB file downloads only when the visitor taps
Listen — zero impact on page load. `loop` gives the seamless repeat.

## 5. Components & files

### 5.1 `src/siteConfig.ts` (modify)
- Add `audio: { src: '/audio/generational-rhythm-vol-i.mp3', label: 'Generational_Rhythm_Vol_I' }`
  (single source for the path + display label; an optional `srcOgg` can be added later for a fallback
  `<source>`).

### 5.2 `src/lib/player.ts` (create)
- A side-effecting init module imported by the Player component's `<script>`.
- Exports one pure helper for testability: `clampVolume(n: number): number` → clamps to `[0, 1]`
  (used when reading a possibly-garbage stored value and on input). Everything else is DOM/Web-Audio
  glue.
- Singleton guard: if already initialized (flag on the element/`window`), no-op — so it survives
  `astro:page-load` without rebuilding the audio graph.
- Behavior: lazy AudioContext + `MediaElementSource` + `AnalyserNode` (fftSize ~2048) on first play;
  rAF waveform draw (time-domain → a single smooth gold line on the canvas) that runs only while
  playing; play/pause with `aria-pressed`; volume `<input type=range>` → `audio.volume` +
  `localStorage('hs-volume')` (read on init via `clampVolume`, default 0.7); Listen pill expands the
  bar and plays; ✕ pauses and collapses. `audio.play().catch(...)` reverts to the pill on failure.

### 5.3 `src/components/Player.astro` (create)
- Markup: the `<audio>` (with `<source>` from `siteConfig.audio.src`), the collapsed **Listen** pill
  (`<button>`), and the expanded slim **bar**: play/pause `<button>`, a spinning `.vinyl`, the
  `siteConfig.audio.label`, a `<canvas class="wave">` (decorative, `aria-hidden`), a volume
  `<input type=range aria-label>`, and a collapse `<button>`. The whole region is
  `role="region" aria-label="Ambient player"` and carries `transition:persist`.
- Scoped `<style>`: slim glass bar (`position:fixed; bottom:0; backdrop-filter:blur`), the pill, the
  spinning vinyl (`@keyframes`), responsive (label/volume may hide < 520px). Under
  `@media (prefers-reduced-motion: reduce)` the **vinyl stops spinning** (the waveform reflects real,
  user-initiated audio and stays).
- A bundled `<script>import '../lib/player.ts'</script>` at the end.

### 5.4 `src/layouts/Base.astro` (modify)
- Render `<Player />` once as a direct child of `<body>` (outside `<main>`, which is swapped on
  navigation), so the persisted region is present on every page. Import it in the frontmatter.

## 6. Accessibility, performance & resilience

- **No autoplay:** audio starts only on the explicit Listen/play gesture; the AudioContext is created
  and resumed within that gesture.
- **Reduced motion:** vinyl spin disabled; the waveform (user-initiated) remains. The rAF loop runs
  only while playing and is cancelled on pause — no idle CPU.
- **Missing/blocked file:** `audio.play()` rejects → caught → UI reverts to the Listen pill; nothing
  breaks, no console error surfaced to the user.
- **A11y:** Listen/play/collapse are real `<button>`s with `aria-label` and `aria-pressed` where
  stateful; volume is a labelled range input; canvas is `aria-hidden`; the bar is a labelled region;
  fully keyboard-operable. 44px touch targets.
- **Performance:** `preload="none"` (no load until tap); single rAF only while playing; one
  AudioContext. No layout shift (the bar is `position:fixed` overlaying the bottom edge).
- **CSP:** unchanged — the audio is same-origin, covered by `default-src 'self'` (media-src falls back
  to it). See the project's CSP note.
- **View Transitions:** the player is in a `transition:persist` region, so playback is uninterrupted
  across client navigations and `player.ts` is not re-initialized.

## 7. Testing

- **Unit (vitest, real TDD):** `clampVolume` — `1.5→1`, `-0.2→0`, `0.7→0.7`, `NaN→` default-safe
  (e.g. returns `0` or a guarded value), boundary `0`/`1`.
- **Behavioral (Playwright on built output):** the Listen pill exists; clicking it flips
  `#hs-audio`.paused → false and advances `currentTime` (and AudioContext, if observable, to
  "running"); the bar appears; playback **survives a client navigation** (after navigating, the same
  audio element is still not-paused); changing volume persists to `localStorage('hs-volume')` and is
  restored on reload; under emulated reduced-motion the vinyl has no running animation.
  (Headless Chromium has no audio device, but `play()` resolves on a user gesture and `currentTime`
  advances — sufficient to assert the mechanism.)
- `astro check` clean; existing suite green.

## 8. Risks / open items

- **Loop seam:** the provided file is a full song, not a gapless loop, so `loop` may have a faint seam
  at the wrap. Acceptable for an ambient bed; a gapless short loop can be dropped in later (same path).
- **Autoplay policies:** starting audio strictly inside the gesture handler satisfies all current
  browser policies; the `.catch` covers the rest.
- **Headless audio in CI:** the Playwright behavioral check asserts element state (`paused`,
  `currentTime`), not actual sound, since CI has no audio device.

## 9. Success criteria

- A visitor taps **Listen**, hears the ambient bed, sees a live flowing waveform, and can play/pause,
  adjust volume, and collapse it.
- Navigating between `/`, `/studio`, `/mixes` does **not** interrupt playback.
- Volume is remembered; nothing autoplays; reduced-motion/JS-off/missing-file all degrade gracefully.
- No page-load weight cost (audio loads only on tap), no CSP/CWV regression.
