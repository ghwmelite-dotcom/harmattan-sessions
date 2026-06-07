# Interactive Field-Recordings Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the "Recorded on location, in Ghana" section into a stylized Ghana map whose 5 pins each play a distinct synthesized ambience (placeholder for the real recordings) on tap, one at a time, with a live waveform.

**Architecture:** Extend the `field-recordings` content with pin coordinates + a tone key. `src/lib/fieldTones.ts` builds per-place Web-Audio ambiences (noise → filter → LFO-modulated gain) and exposes a tested pure `toneConfig` map. `src/lib/fieldMap.ts` wires click-to-play (lazy AudioContext on first gesture, one sound at a time, analyser-driven popover waveform, auto-stop on scroll-away). `FieldRecordings.astro` is rewritten into the map of labelled pin-buttons. Progressive enhancement: no-JS shows labelled pins; audio needs a tap.

**Tech Stack:** Astro 6 content collections, Web Audio API (BufferSource noise, BiquadFilter, GainNode + LFO, AnalyserNode), Vitest for the pure `toneConfig`. No new deps, no CSP change (synth = no network).

---

## Conventions & notes
- Run all commands from `C:\dev\Projects\harmattan-sessions`. UTF-8.
- `fieldMap.ts` binds on `astro:page-load` (View Transitions) and is singleton-guarded per map element;
  `fieldTones.ts` is pure-importable in node (no top-level DOM/AudioContext use), so its test imports cleanly.
- The synth→real-clip swap: a recording can later add an `audio` URL; the pin then plays that file
  instead of the synth, no other change.

## File map
| File | Change |
|---|---|
| `src/content.config.ts` | extend `field-recordings` schema (x, y, tone, audio?) |
| `src/content/field-recordings/{1..5}.json` | add x/y/tone |
| `src/lib/fieldTones.ts` | new — `toneConfig` (pure, tested) + `createAmbience` |
| `src/lib/fieldMap.ts` | new — click-to-play interaction |
| `src/components/FieldRecordings.astro` | rewrite into the map |
| `tests/fieldTones.test.ts` | new — `toneConfig` unit tests |

---

## Task 1: Content schema + pin data

**Files:** Modify `src/content.config.ts` and the 5 `src/content/field-recordings/*.json`

- [ ] **Step 1: Extend the schema.** In `src/content.config.ts`, the `fieldRecordings` collection is currently:

```ts
const fieldRecordings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/field-recordings' }),
  schema: z.object({ location: z.string(), description: z.string(), order: z.number() }),
});
```

Replace its `schema` with:

```ts
  schema: z.object({
    location: z.string(), description: z.string(), order: z.number(),
    x: z.number(), y: z.number(),
    tone: z.enum(['surf', 'hum', 'wind', 'street', 'rain']),
    audio: z.string().optional(),
  }),
```

- [ ] **Step 2: Add x/y/tone to each recording.** Overwrite the 5 files exactly:

`src/content/field-recordings/1.json`:
```json
{ "location": "Labadi Beach", "description": "dusk surf", "order": 1, "x": 50, "y": 80, "tone": "surf" }
```
`src/content/field-recordings/2.json`:
```json
{ "location": "Makola Market", "description": "dawn hum", "order": 2, "x": 47, "y": 73, "tone": "hum" }
```
`src/content/field-recordings/3.json`:
```json
{ "location": "Aburi Hills", "description": "harmattan wind", "order": 3, "x": 50, "y": 54, "tone": "wind" }
```
`src/content/field-recordings/4.json`:
```json
{ "location": "Jamestown", "description": "evening street", "order": 4, "x": 41, "y": 79, "tone": "street" }
```
`src/content/field-recordings/5.json`:
```json
{ "location": "Volta", "description": "rain on the river", "order": 5, "x": 74, "y": 66, "tone": "rain" }
```

- [ ] **Step 3: Type-check + build** — `npm run check` (Expected: 0 errors — content typegen now includes x/y/tone and validates the JSON against the schema), `npm run build` (succeeds). The existing `FieldRecordings.astro` still renders the old chip list (it ignores the new fields) — no visible change yet.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/field-recordings/
git commit -m "feat(fieldmap): field-recording pin coordinates + tone keys

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Ambience synth (toneConfig + createAmbience)

**Files:** Create `src/lib/fieldTones.ts`; Test `tests/fieldTones.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/fieldTones.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { toneConfig, TONE_CONFIG } from '../src/lib/fieldTones';

describe('toneConfig', () => {
  it('returns the matching config for each known tone', () => {
    for (const key of ['surf', 'hum', 'wind', 'street', 'rain'] as const) {
      expect(toneConfig(key)).toBe(TONE_CONFIG[key]);
    }
  });
  it('falls back to the wind config for unknown / empty keys', () => {
    expect(toneConfig('xyz')).toBe(TONE_CONFIG.wind);
    expect(toneConfig('')).toBe(TONE_CONFIG.wind);
  });
  it('every config has a filter, frequency and gain', () => {
    for (const cfg of Object.values(TONE_CONFIG)) {
      expect(typeof cfg.filter).toBe('string');
      expect(typeof cfg.freq).toBe('number');
      expect(typeof cfg.gain).toBe('number');
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/fieldTones.test.ts` → FAIL (cannot find module).

- [ ] **Step 3: Implement** — `src/lib/fieldTones.ts`:

```ts
export type Tone = 'surf' | 'hum' | 'wind' | 'street' | 'rain';

export interface ToneConfig {
  filter: BiquadFilterType;
  freq: number;
  q: number;
  lfoRate: number;   // Hz — slow gain modulation
  lfoDepth: number;  // 0..1 — portion of gain swung by the LFO
  gain: number;      // base output level
  drone?: number;    // optional low sine (Hz)
}

export const TONE_CONFIG: Record<Tone, ToneConfig> = {
  surf:   { filter: 'lowpass',  freq: 600,  q: 0.7, lfoRate: 0.16, lfoDepth: 0.7,  gain: 0.5 },
  hum:    { filter: 'bandpass', freq: 420,  q: 0.8, lfoRate: 0.5,  lfoDepth: 0.3,  gain: 0.4, drone: 70 },
  wind:   { filter: 'highpass', freq: 1200, q: 0.6, lfoRate: 0.12, lfoDepth: 0.8,  gain: 0.35 },
  street: { filter: 'bandpass', freq: 900,  q: 0.9, lfoRate: 0.7,  lfoDepth: 0.35, gain: 0.35, drone: 110 },
  rain:   { filter: 'highpass', freq: 3000, q: 0.5, lfoRate: 1.4,  lfoDepth: 0.5,  gain: 0.28, drone: 90 },
};

export function toneConfig(key: string): ToneConfig {
  return (TONE_CONFIG as Record<string, ToneConfig>)[key] ?? TONE_CONFIG.wind;
}

let noiseBuffer: AudioBuffer | undefined;
function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

export interface Ambience {
  analyser: AnalyserNode;
  start(): void;
  stop(): void;
}

export function createAmbience(ctx: AudioContext, key: string): Ambience {
  const cfg = toneConfig(key);
  const src = ctx.createBufferSource();
  src.buffer = getNoise(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = cfg.filter;
  filter.frequency.value = cfg.freq;
  filter.Q.value = cfg.q;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = cfg.lfoRate;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = cfg.gain * cfg.lfoDepth;
  lfo.connect(lfoGain).connect(gain.gain);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  src.connect(filter).connect(gain).connect(analyser).connect(ctx.destination);

  let drone: OscillatorNode | undefined;
  let droneGain: GainNode | undefined;
  if (cfg.drone) {
    drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = cfg.drone;
    droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    drone.connect(droneGain).connect(analyser);
  }

  const base = cfg.gain * (1 - cfg.lfoDepth);
  return {
    analyser,
    start() {
      const t = ctx.currentTime;
      src.start();
      lfo.start();
      drone?.start();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(base, t + 0.4);
      if (droneGain) droneGain.gain.linearRampToValueAtTime(cfg.gain * 0.25, t + 0.6);
    },
    stop() {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.25);
      if (droneGain) {
        droneGain.gain.cancelScheduledValues(t);
        droneGain.gain.linearRampToValueAtTime(0, t + 0.25);
      }
      const stopAt = t + 0.3;
      try { src.stop(stopAt); lfo.stop(stopAt); drone?.stop(stopAt); } catch { /* already stopped */ }
    },
  };
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/fieldTones.test.ts` → PASS. (No DOM/AudioContext at import — only function/const definitions — so the node import is clean.)

- [ ] **Step 5: Type-check** — `npm run check` → 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/fieldTones.ts tests/fieldTones.test.ts
git commit -m "feat(fieldmap): web-audio ambience synth + toneConfig (tested)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Click-to-play interaction

**Files:** Create `src/lib/fieldMap.ts`

- [ ] **Step 1: Create `src/lib/fieldMap.ts`:**

```ts
import { createAmbience, type Ambience } from './fieldTones';

function init(): void {
  const map = document.getElementById('hs-fieldmap');
  if (!map || map.dataset.ready) return;
  map.dataset.ready = 'true';

  const pins = Array.from(map.querySelectorAll<HTMLButtonElement>('.fr-pin'));
  const pop = map.querySelector<HTMLElement>('.fr-pop');
  const popName = pop?.querySelector<HTMLElement>('.fr-pop-name');
  const popDesc = pop?.querySelector<HTMLElement>('.fr-pop-desc');
  const canvas = pop?.querySelector<HTMLCanvasElement>('.fr-wave');
  if (!pop || !popName || !popDesc || !canvas) return;

  let ctx: AudioContext | undefined;
  let amb: Ambience | undefined;
  let audioEl: HTMLAudioElement | undefined;
  let activePin: HTMLButtonElement | undefined;
  let raf = 0;

  function stopAll(): void {
    cancelAnimationFrame(raf);
    if (amb) { amb.stop(); amb = undefined; }
    if (audioEl) { audioEl.pause(); audioEl = undefined; }
    if (activePin) {
      activePin.classList.remove('is-playing');
      activePin.setAttribute('aria-pressed', 'false');
      activePin = undefined;
    }
    pop!.hidden = true;
  }

  function draw(analyser: AnalyserNode): void {
    const c = canvas!.getContext('2d');
    if (!c) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const W = canvas!.width;
    const H = canvas!.height;
    const tick = (): void => {
      analyser.getByteTimeDomainData(buf);
      c.clearRect(0, 0, W, H);
      c.lineWidth = 2;
      c.strokeStyle = '#E8B04B';
      c.beginPath();
      const stepX = W / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * H;
        const x = i * stepX;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function showPop(pin: HTMLButtonElement): void {
    popName!.textContent = pin.dataset.name ?? '';
    popDesc!.textContent = pin.dataset.desc ?? '';
    pop!.style.left = pin.style.left;
    pop!.style.top = pin.style.top;
    pop!.hidden = false;
  }

  async function playPin(pin: HTMLButtonElement): Promise<void> {
    if (!ctx) {
      const AC: typeof AudioContext =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') await ctx.resume();
    if (activePin === pin) { stopAll(); return; }
    stopAll();
    activePin = pin;
    pin.classList.add('is-playing');
    pin.setAttribute('aria-pressed', 'true');
    showPop(pin);

    const url = pin.dataset.audio;
    let analyser: AnalyserNode;
    if (url) {
      audioEl = new Audio(url);
      audioEl.loop = true;
      const node = ctx.createMediaElementSource(audioEl);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      node.connect(analyser).connect(ctx.destination);
      try { await audioEl.play(); } catch { stopAll(); return; }
    } else {
      amb = createAmbience(ctx, pin.dataset.tone ?? 'wind');
      analyser = amb.analyser;
      amb.start();
    }
    draw(analyser);
  }

  pins.forEach((pin) => pin.addEventListener('click', () => void playPin(pin)));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (!e.isIntersecting) stopAll(); },
      { threshold: 0 },
    );
    io.observe(map);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', init);
}
```

- [ ] **Step 2: Type-check** — `npm run check` → 0 errors. (Not imported anywhere yet; the component imports it next.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/fieldMap.ts
git commit -m "feat(fieldmap): click-to-play interaction (one-at-a-time, waveform, auto-stop)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Rewrite the FieldRecordings section into the map

**Files:** Modify `src/components/FieldRecordings.astro` (full replace)

- [ ] **Step 1: Replace the file** — `src/components/FieldRecordings.astro`:

```astro
---
import { getCollection } from 'astro:content';
const recs = (await getCollection('field-recordings')).sort((a, b) => a.data.order - b.data.order);
---
<section class="blk" id="field"><div class="wrap">
  <div class="sec-head" data-reveal>
    <div><span class="label">The moat</span><h2>Recorded on location, in Ghana.</h2></div>
    <p>The layer no remote channel can fake — captured at 44.1kHz and woven under every mix. <b>Tap a place to hear it.</b></p>
  </div>
  <div id="hs-fieldmap" class="fieldmap" data-reveal>
    <svg class="fr-land" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path class="fr-fill" d="M60 50 L300 44 Q352 70 338 130 L330 200 Q318 238 270 232 L150 236 Q70 232 56 175 Q46 110 60 50 Z"/>
      <path class="fr-coast" d="M150 236 L270 232 Q318 238 330 200"/>
    </svg>
    {recs.map((r) => (
      <button
        class="fr-pin"
        type="button"
        style={`left:${r.data.x}%;top:${r.data.y}%`}
        data-tone={r.data.tone}
        data-name={r.data.location}
        data-desc={r.data.description}
        data-audio={r.data.audio}
        aria-label={`${r.data.location} — ${r.data.description} — play sound`}
        aria-pressed="false"
      >
        <span class="fr-dot" aria-hidden="true"></span>
        <span class="fr-pinlabel">{r.data.location}</span>
      </button>
    ))}
    <div class="fr-pop" hidden>
      <span class="fr-pop-name"></span>
      <span class="fr-pop-desc"></span>
      <canvas class="fr-wave" width="200" height="26" aria-hidden="true"></canvas>
    </div>
  </div>
</div></section>

<style>
  .fieldmap{position:relative;width:100%;max-width:600px;aspect-ratio:4/3;margin-top:28px}
  .fr-land{position:absolute;inset:0;width:100%;height:100%}
  .fr-fill{fill:rgba(28,23,20,.7);stroke:rgba(232,176,75,.30);stroke-width:1.2}
  .fr-coast{fill:none;stroke:var(--gold);stroke-width:1.6;opacity:.45}

  .fr-pin{position:absolute;transform:translate(-50%,-50%);background:none;border:0;padding:0;cursor:pointer;
    display:grid;place-items:center;z-index:2}
  .fr-dot{width:14px;height:14px;border-radius:50%;background:var(--gold);
    box-shadow:0 0 0 0 rgba(232,176,75,.5);animation:frPing 2.6s ease-out infinite}
  @keyframes frPing{0%{box-shadow:0 0 0 0 rgba(232,176,75,.5)}70%,100%{box-shadow:0 0 0 13px rgba(232,176,75,0)}}
  .fr-pin.is-playing .fr-dot{background:var(--terracotta);box-shadow:0 0 0 4px rgba(201,110,63,.35)}
  .fr-pinlabel{position:absolute;top:16px;font-size:11px;color:var(--text-strong);white-space:nowrap;
    background:rgba(14,11,8,.7);padding:2px 7px;border-radius:99px;opacity:0;transition:opacity .15s;pointer-events:none}
  .fr-pin:hover .fr-pinlabel,.fr-pin:focus-visible .fr-pinlabel,.fr-pin.is-playing .fr-pinlabel{opacity:1}
  .fr-pin:focus-visible{outline:2px solid var(--gold);outline-offset:4px;border-radius:50%}

  .fr-pop{position:absolute;transform:translate(-50%,-118%);z-index:3;min-width:140px;
    background:rgba(20,16,11,.94);border:1px solid rgba(232,176,75,.4);border-radius:10px;padding:9px 12px;
    backdrop-filter:blur(8px);box-shadow:0 12px 30px rgba(0,0,0,.5)}
  .fr-pop-name{display:block;font-family:'Fraunces',serif;font-size:13px;color:var(--text-strong);font-weight:600}
  .fr-pop-desc{display:block;font-size:11px;color:var(--text-dim);margin-bottom:5px}
  .fr-wave{display:block;width:100%;height:26px}

  @media(prefers-reduced-motion:reduce){.fr-dot{animation:none}}
</style>

<script>import '../lib/fieldMap.ts';</script>
```

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). The homepage now shows the map. Verify the pins rendered: `npx --yes rg -c "fr-pin" dist/client/index.html` (expect ≥1).

- [ ] **Step 3: Commit**

```bash
git add src/components/FieldRecordings.astro
git commit -m "feat(fieldmap): replace chip list with interactive Ghana map

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Suite + check + build.** `npm test` (all green incl. `fieldTones`), `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 2: Behavioral check (Playwright on built output).** Serve `dist/client` (`python -m http.server 8099 --directory dist/client`) and run:

```python
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8099"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--autoplay-policy=no-user-gesture-required"])
    pg = b.new_context(viewport={"width":1280,"height":2400}).new_page()
    pg.goto(f"{BASE}/", wait_until="networkidle"); pg.wait_for_timeout(400)

    pins = pg.locator('.fr-pin')
    assert pins.count() == 5, f"expected 5 pins, got {pins.count()}"
    # aria-labels present
    labels = [pins.nth(i).get_attribute('aria-label') for i in range(5)]
    assert any("Labadi Beach" in (l or "") for l in labels), labels
    pg.locator('#hs-fieldmap').scroll_into_view_if_needed(); pg.wait_for_timeout(300)

    # click a pin -> it plays, popover shows its name
    pins.first.click(); pg.wait_for_timeout(700)
    assert pg.evaluate("document.querySelectorAll('.fr-pin.is-playing').length") == 1, "not exactly one playing"
    assert pins.first.get_attribute('aria-pressed') == "true"
    popname = pg.evaluate("document.querySelector('.fr-pop-name').textContent")
    print("playing:", popname, "| popover hidden:", pg.evaluate("document.querySelector('.fr-pop').hidden"))
    assert pg.evaluate("!document.querySelector('.fr-pop').hidden"), "popover not shown"

    # click same pin -> stops
    pins.first.click(); pg.wait_for_timeout(400)
    assert pg.evaluate("document.querySelectorAll('.fr-pin.is-playing').length") == 0, "did not stop on re-click"

    # switch: click pin A then B -> only one playing
    pins.nth(0).click(); pg.wait_for_timeout(300); pins.nth(1).click(); pg.wait_for_timeout(400)
    assert pg.evaluate("document.querySelectorAll('.fr-pin.is-playing').length") == 1, "switch left >1 playing"
    assert pins.nth(1).get_attribute('aria-pressed') == "true" and pins.nth(0).get_attribute('aria-pressed') == "false"

    # reduced motion: pin pulse off
    rm = b.new_context(reduced_motion="reduce"); r = rm.new_page(); r.goto(f"{BASE}/", wait_until="networkidle")
    anim = r.evaluate("getComputedStyle(document.querySelector('.fr-dot')).animationName")
    assert anim in ("none",""), f"pin animated under reduce-motion: {anim}"
    b.close()
print("FIELDMAP CHECKS PASSED")
```

Expected: `FIELDMAP CHECKS PASSED`.

- [ ] **Step 3: Visual confirm + tune.** Screenshot the field-recordings section (and one with a pin active showing the popover). Confirm the map reads well and the pins sit sensibly on the landmass; nudge the `x`/`y` values in the 5 JSON files (Task 1) or the SVG path if a pin floats off the land, then rebuild.

- [ ] **Step 4: Final commit (only if coordinates/path were tuned).**

```bash
git add -A
git commit -m "polish(fieldmap): tune pin positions / map shape after visual pass

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 stylized Ghana map + pin-per-recording → Task 4 (SVG + pin buttons from data). ✓
- §2 synthesized ambiences (5 recipes) → Task 2 (`TONE_CONFIG`/`createAmbience`). ✓
- §2 real-clip swap via `audio` → Task 1 (schema) + Task 3 (`data-audio` branch in `playPin`). ✓
- §2 click-to-play, hover highlight, one-at-a-time → Task 3 (`playPin`/`stopAll`) + Task 4 CSS (`:hover`/`:focus-visible` label). ✓
- §2 auto-stop on scroll-away → Task 3 (IntersectionObserver). ✓
- §2 independent of bottom player → no reference to `#hs-audio` anywhere. ✓
- §5.1 schema → Task 1; §5.2 data → Task 1; §5.3 fieldTones → Task 2; §5.4 fieldMap → Task 3;
  §5.5 component → Task 4. ✓
- §6 a11y (labelled `<button>`s, aria-pressed, focus-visible, canvas aria-hidden), reduced-motion (pulse
  off), resilience (unknown tone → default; audio error → stopAll), perf (shared noise buffer, single rAF,
  nodes stopped), CSP unchanged, astro:page-load re-init → Tasks 2/3/4 + verified Task 5. ✓
- §7 unit `toneConfig` → Task 2; behavioral → Task 5. ✓

**Placeholder scan:** none — every code step is complete (the SVG path and all 5 tone recipes are
concrete); commands have expected results. No vitest beyond `toneConfig` because the rest is
Web-Audio/DOM glue (stated; verified by build + Playwright, matching the repo's UI approach).

**Type/name consistency:** `Tone`/`ToneConfig`/`TONE_CONFIG`/`toneConfig`/`createAmbience`/`Ambience`,
the data attributes `data-tone`/`data-name`/`data-desc`/`data-audio`, classes `.fr-pin`/`.fr-dot`/
`.fr-pop`/`.fr-pop-name`/`.fr-pop-desc`/`.fr-wave`/`is-playing`, the map id `#hs-fieldmap`, and the schema
fields `x`/`y`/`tone`/`audio` are used identically across Tasks 1–5. The component (Task 4) provides
exactly the elements `fieldMap.ts` (Task 3) queries, and `fieldMap` imports `createAmbience` from
`fieldTones` (Task 2). ✓
