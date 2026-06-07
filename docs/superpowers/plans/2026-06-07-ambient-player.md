# Persistent Ambient Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An opt-in "tap to listen" ambient player — a Listen pill that expands into a slim glass bar with a live waveform — that keeps playing across page navigations and never autoplays.

**Architecture:** A `<Player />` rendered once in `Base` with `transition:persist`, so its `<audio>` and playback survive View-Transition navigations. `src/lib/player.ts` lazily builds a Web Audio graph (AudioContext → MediaElementSource → AnalyserNode) on the first user gesture, draws a flowing waveform on a canvas, and handles play/pause + persisted volume. Pure progressive enhancement: no JS / unsupported audio / missing file all degrade to "no player."

**Tech Stack:** Astro 6, Web Audio API (`AnalyserNode`, time-domain), `<audio loop preload="none">`, `localStorage`, Vitest for the one pure helper. No new deps. No CSP change (audio is same-origin). The audio file `public/audio/generational-rhythm-vol-i.mp3` is already committed on this branch.

---

## Conventions & notes
- Run all commands from `C:\dev\Projects\harmattan-sessions`. UTF-8.
- Reuses the persistence pattern from the motion feature (`transition:persist`) and the
  single-binding component-script pattern from `ThemeToggle`/`TodControl` (works under the persisted
  region across client navs).
- `player.ts` registers its `astro:page-load` listener **only when `document` exists**, so the file
  can be imported in the (node) Vitest environment to unit-test `clampVolume` without a DOM.

## File map
| File | Change |
|---|---|
| `src/siteConfig.ts` | add `audio: { src, label }` |
| `src/lib/player.ts` | new — `clampVolume` (pure, tested) + the player init/glue |
| `src/components/Player.astro` | new — audio + Listen pill + slim glass bar + canvas, `transition:persist` |
| `src/layouts/Base.astro` | render `<Player />` once (persisted) |
| `tests/player.test.ts` | new — `clampVolume` unit tests |

---

## Task 1: Audio config in siteConfig

**Files:** Modify `src/siteConfig.ts`; Test `tests/siteConfig.test.ts` (extend)

- [ ] **Step 1: Add the failing assertion.** Append inside the existing `describe` block in `tests/siteConfig.test.ts`:

```ts
  it('exposes the ambient audio source and label', () => {
    expect(siteConfig.audio.src).toBe('/audio/generational-rhythm-vol-i.mp3');
    expect(siteConfig.audio.label).toBe('Generational_Rhythm_Vol_I');
  });
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/siteConfig.test.ts` → FAIL (`audio` undefined).

- [ ] **Step 3: Implement.** In `src/siteConfig.ts`, add this property inside the `siteConfig` object, right after the `youtubeChannelId` line:

```ts
  // Ambient "tap to listen" player — same-origin loop + the bar's display label.
  audio: { src: '/audio/generational-rhythm-vol-i.mp3', label: 'Generational_Rhythm_Vol_I' },
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/siteConfig.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/siteConfig.ts tests/siteConfig.test.ts
git commit -m "feat(player): ambient audio src + label in siteConfig

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Player logic (clampVolume + init)

**Files:** Create `src/lib/player.ts`; Test `tests/player.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/player.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { clampVolume } from '../src/lib/player';

describe('clampVolume', () => {
  it('clamps to the 0..1 range', () => {
    expect(clampVolume(0.7)).toBe(0.7);
    expect(clampVolume(1.5)).toBe(1);
    expect(clampVolume(-0.2)).toBe(0);
    expect(clampVolume(0)).toBe(0);
    expect(clampVolume(1)).toBe(1);
  });
  it('returns 0 for non-finite input', () => {
    expect(clampVolume(NaN)).toBe(0);
    expect(clampVolume(Infinity)).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/player.test.ts` → FAIL (cannot find module).

- [ ] **Step 3: Implement** — `src/lib/player.ts`:

```ts
export function clampVolume(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function readStoredVolume(): number {
  try {
    const raw = localStorage.getItem('hs-volume');
    if (raw === null) return 0.7;
    const n = Number(raw);
    return Number.isFinite(n) ? clampVolume(n) : 0.7;
  } catch {
    return 0.7;
  }
}

function init(): void {
  const root = document.getElementById('hs-player');
  if (!root || root.dataset.ready) return; // singleton: survive astro:page-load without rebuilding
  root.dataset.ready = 'true';

  const audio = document.getElementById('hs-audio') as HTMLAudioElement | null;
  const pill = root.querySelector<HTMLButtonElement>('.hs-listen');
  const playBtn = root.querySelector<HTMLButtonElement>('.hs-play');
  const closeBtn = root.querySelector<HTMLButtonElement>('.hs-close');
  const vol = root.querySelector<HTMLInputElement>('.hs-vol');
  const canvas = root.querySelector<HTMLCanvasElement>('.hs-wave');
  if (!audio || !pill || !playBtn || !closeBtn || !vol || !canvas) return;

  const v0 = readStoredVolume();
  audio.volume = v0;
  vol.value = String(v0);

  let ctx: AudioContext | undefined;
  let analyser: AnalyserNode | undefined;
  let raf = 0;

  function setupGraph(): void {
    if (ctx) return;
    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    const srcNode = ctx.createMediaElementSource(audio!);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    srcNode.connect(analyser);
    analyser.connect(ctx.destination);
  }

  function drawLoop(): void {
    if (!analyser || !canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const W = canvas.width;
    const H = canvas.height;
    const tick = (): void => {
      analyser!.getByteTimeDomainData(buf);
      c.clearRect(0, 0, W, H);
      c.lineWidth = 2;
      c.strokeStyle = '#E8B04B';
      c.beginPath();
      const step = W / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * H;
        const x = i * step;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function setPlaying(on: boolean): void {
    root!.classList.toggle('hs-playing', on);
    playBtn!.setAttribute('aria-pressed', String(on));
    playBtn!.setAttribute('aria-label', on ? 'Pause' : 'Play');
  }

  async function play(): Promise<void> {
    try {
      setupGraph();
      if (ctx && ctx.state === 'suspended') await ctx.resume();
      await audio!.play();
      setPlaying(true);
      cancelAnimationFrame(raf);
      drawLoop();
    } catch {
      setPlaying(false);
      root!.classList.remove('hs-open'); // failed (missing file / blocked) → back to pill
    }
  }
  function pause(): void {
    audio!.pause();
    setPlaying(false);
    cancelAnimationFrame(raf);
  }

  pill.addEventListener('click', () => { root.classList.add('hs-open'); void play(); });
  playBtn.addEventListener('click', () => { void (audio.paused ? play() : Promise.resolve(pause())); });
  closeBtn.addEventListener('click', () => { pause(); root.classList.remove('hs-open'); });
  vol.addEventListener('input', () => {
    const v = clampVolume(Number(vol.value));
    audio.volume = v;
    try { localStorage.setItem('hs-volume', String(v)); } catch { /* ignore */ }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', init);
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/player.test.ts` → PASS. (The top-level `typeof document` guard lets the module import cleanly in the node test environment.)

- [ ] **Step 5: Type-check** — `npm run check` → 0 errors. (`player.ts` isn't imported anywhere yet; that's fine.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/player.ts tests/player.test.ts
git commit -m "feat(player): web-audio player logic + clampVolume (tested)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: The Player component

**Files:** Create `src/components/Player.astro`

- [ ] **Step 1: Create the component** — `src/components/Player.astro`:

```astro
---
import { siteConfig } from '../siteConfig';
const { src, label } = siteConfig.audio;
---
<div id="hs-player" class="hs-player" role="region" aria-label="Ambient player" transition:persist>
  <audio id="hs-audio" preload="none" loop>
    <source src={src} type="audio/mpeg" />
  </audio>

  <button class="hs-listen" type="button" aria-label="Listen — play the ambient sound">
    <span class="hs-pulse" aria-hidden="true"></span><span>Listen</span>
  </button>

  <div class="hs-bar">
    <button class="hs-play" type="button" aria-label="Play" aria-pressed="false">
      <svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
      <svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
    </button>
    <span class="hs-vinyl" aria-hidden="true"></span>
    <span class="hs-label">{label}</span>
    <canvas class="hs-wave" width="260" height="34" aria-hidden="true"></canvas>
    <label class="hs-volwrap" aria-label="Volume">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="hs-volic"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>
      <input class="hs-vol" type="range" min="0" max="1" step="0.01" aria-label="Volume" />
    </label>
    <button class="hs-close" type="button" aria-label="Close player">✕</button>
  </div>
</div>

<style>
  .hs-player{}
  /* Listen pill (collapsed default) */
  .hs-listen{position:fixed;left:18px;bottom:18px;z-index:60;display:inline-flex;align-items:center;gap:8px;
    font-family:inherit;font-size:13px;font-weight:600;color:var(--gold);cursor:pointer;
    padding:9px 15px;border-radius:999px;border:1px solid rgba(232,176,75,.45);
    background:rgba(14,11,8,.78);backdrop-filter:blur(12px);box-shadow:0 8px 26px -10px rgba(0,0,0,.6)}
  .hs-listen:hover{border-color:var(--gold)}
  .hs-pulse{width:9px;height:9px;border-radius:50%;background:radial-gradient(circle,#ffd9a0,var(--terracotta));
    box-shadow:0 0 0 0 rgba(232,176,75,.5);animation:hsPulse 2.4s ease-in-out infinite}
  @keyframes hsPulse{0%,100%{box-shadow:0 0 0 0 rgba(232,176,75,.5)}50%{box-shadow:0 0 0 7px rgba(232,176,75,0)}}

  /* Slim glass bar (expanded) */
  .hs-bar{position:fixed;left:0;right:0;bottom:0;z-index:60;display:none;align-items:center;gap:16px;
    padding:11px 18px;background:rgba(14,11,8,.82);backdrop-filter:blur(16px);border-top:1px solid var(--line)}
  .hs-player.hs-open .hs-listen{display:none}
  .hs-player.hs-open .hs-bar{display:flex}

  .hs-play{width:38px;height:38px;border-radius:50%;border:0;background:var(--gold);color:#231803;cursor:pointer;
    display:grid;place-items:center;flex-shrink:0}
  .hs-play svg{width:16px;height:16px;fill:#231803}
  .ic-pause{display:none}
  .hs-player.hs-playing .ic-play{display:none}
  .hs-player.hs-playing .ic-pause{display:block}

  .hs-vinyl{width:28px;height:28px;border-radius:50%;flex-shrink:0;
    background:radial-gradient(circle at 36% 30%,var(--gold),var(--terracotta) 60%,#2a1604);position:relative}
  .hs-vinyl::after{content:"";position:absolute;inset:42%;background:var(--bg);border-radius:50%}
  .hs-player.hs-playing .hs-vinyl{animation:hsSpin 4s linear infinite}
  @keyframes hsSpin{to{transform:rotate(360deg)}}

  .hs-label{font-size:12.5px;color:var(--text-strong);white-space:nowrap;flex-shrink:0;letter-spacing:.01em}
  .hs-wave{flex:1;height:34px;min-width:60px}
  .hs-volwrap{display:flex;align-items:center;gap:7px;color:var(--text-dim);flex-shrink:0}
  .hs-volic{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}
  .hs-vol{width:84px;accent-color:var(--gold);cursor:pointer}
  .hs-close{background:none;border:0;color:var(--text-dim);font-size:15px;cursor:pointer;flex-shrink:0;padding:4px}
  .hs-close:hover{color:var(--text)}

  @media(max-width:640px){.hs-label,.hs-volwrap{display:none}}
  @media(prefers-reduced-motion:reduce){
    .hs-player.hs-playing .hs-vinyl{animation:none}
    .hs-pulse{animation:none}
  }
</style>

<script>import '../lib/player.ts';</script>
```

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). The component isn't rendered yet (added to Base next), so no visible change.

- [ ] **Step 3: Commit**

```bash
git add src/components/Player.astro
git commit -m "feat(player): Player component — Listen pill + slim glass bar + waveform

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Mount the player site-wide

**Files:** Modify `src/layouts/Base.astro`

- [ ] **Step 1: Import the component.** In `src/layouts/Base.astro` frontmatter, add after the `BaseHead` import:

```astro
import Player from '../components/Player.astro';
```

- [ ] **Step 2: Render it once, persisted.** The body currently ends with the script tags then `</body>`. Add `<Player />` right before the first `<script>` (so it's a direct child of `<body>`, outside the swapped `<main>`), i.e. immediately after the `<slot />` line. Change:

```astro
    <slot />
    <script>
```

to:

```astro
    <slot />
    <Player />
    <script>
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds; `dist/client/index.html` now contains `hs-player`).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat(player): mount persistent player site-wide in Base

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Suite + check + build.** `npm test` (all green incl. `player` + `siteConfig` tests), `npm run check` (0 errors), `npm run build` (succeeds; confirm the audio file shipped: `test -f dist/client/audio/generational-rhythm-vol-i.mp3 && echo OK`).

- [ ] **Step 2: Behavioral check (Playwright on built output).** Serve `dist/client` (`python -m http.server 8077 --directory dist/client`) and run:

```python
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8077"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--autoplay-policy=no-user-gesture-required"])
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.goto(f"{BASE}/", wait_until="networkidle"); pg.wait_for_timeout(400)

    # (1) Listen pill present; bar hidden
    assert pg.locator('.hs-listen').count() == 1, "no Listen pill"
    assert not pg.evaluate("document.getElementById('hs-player').classList.contains('hs-open')")

    # (2) tap Listen -> bar opens and audio starts
    pg.locator('.hs-listen').click(); pg.wait_for_timeout(900)
    assert pg.evaluate("document.getElementById('hs-player').classList.contains('hs-open')"), "bar did not open"
    paused = pg.evaluate("document.getElementById('hs-audio').paused")
    print("audio.paused after tap:", paused)
    assert paused is False, "audio did not start on tap"

    # (3) playback survives a client navigation (persisted element keeps playing)
    pg.evaluate("document.getElementById('hs-player').dataset.marker='alive'")
    pg.get_by_role("link", name="Studio").first.click(); pg.wait_for_timeout(1200)
    assert "/studio" in pg.url
    assert pg.evaluate("document.getElementById('hs-player')?.dataset.marker") == "alive", "player was re-created (not persisted)"
    assert pg.evaluate("document.getElementById('hs-audio').paused") is False, "playback stopped on nav"

    # (4) volume persists
    pg.evaluate("const v=document.querySelector('.hs-vol'); v.value='0.3'; v.dispatchEvent(new Event('input',{bubbles:true}))")
    pg.wait_for_timeout(150)
    assert pg.evaluate("localStorage.getItem('hs-volume')") == "0.3", "volume not persisted"
    assert abs(pg.evaluate("document.getElementById('hs-audio').volume") - 0.3) < 1e-6

    # (5) reduced motion: vinyl not animated
    rm = b.new_context(reduced_motion="reduce"); r = rm.new_page(); r.goto(f"{BASE}/", wait_until="networkidle")
    r.locator('.hs-listen').click(); r.wait_for_timeout(300)
    anim = r.evaluate("getComputedStyle(document.querySelector('.hs-vinyl')).animationName")
    assert anim in ("none", ""), f"vinyl animated under reduce-motion: {anim}"
    b.close()
print("PLAYER CHECKS PASSED")
```

Expected: `PLAYER CHECKS PASSED`. (The `--autoplay-policy` flag + the click gesture make playback deterministic in headless; the `dataset.marker` surviving the navigation proves `transition:persist` kept the same player node and audio element.)

- [ ] **Step 3: Visual confirm.** Screenshot the homepage after tapping Listen (the open slim bar with the waveform) to confirm it reads well in light + dark.

- [ ] **Step 4: Final commit (only if tweaks were needed)**

```bash
git add -A
git commit -m "test(player): verify tap-to-listen, cross-nav persistence, volume, reduced-motion

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 Listen pill → slim glass bar → Task 3 (markup + CSS states `hs-open`). ✓
- §2 flowing waveform via AnalyserNode → Task 2 (`setupGraph`/`drawLoop`, time-domain). ✓
- §2 tap-to-listen, no autoplay, `loop` → Task 2 (gesture-driven `play()`) + Task 3 (`<audio loop preload="none">`). ✓
- §2 persistence across nav → Task 3 (`transition:persist`) + Task 4 (mounted in Base) + verified Task 5(3). ✓
- §2 audio source + label → Task 1 (siteConfig) consumed in Task 3. ✓
- §2 volume persisted, default 0.7 → Task 2 (`readStoredVolume`, `hs-volume`). ✓
- §5.1 siteConfig → Task 1; §5.2 player.ts → Task 2; §5.3 Player.astro → Task 3; §5.4 Base → Task 4. ✓
- §6 reduced-motion (vinyl stops), missing-file graceful (`play().catch`), a11y (buttons/aria/labels,
  canvas aria-hidden), `preload=none`, CSP unchanged, single-init guard → Tasks 2/3 + verified Task 5. ✓
- §7 unit `clampVolume` → Task 2; behavioral → Task 5. ✓

**Placeholder scan:** none — every code step is complete; commands have expected results. `clampVolume`
is fully specified (NaN→0, Infinity→1 via clamp). No new vitest beyond `clampVolume` because the rest is
Web-Audio/DOM glue (stated; verified by build + Playwright, consistent with the repo's UI approach).

**Type/name consistency:** ids/classes `#hs-player`/`#hs-audio`/`.hs-listen`/`.hs-bar`/`.hs-play`/
`.hs-close`/`.hs-vol`/`.hs-wave`/`.hs-vinyl`, state classes `hs-open`/`hs-playing`, storage key
`hs-volume`, `siteConfig.audio.{src,label}`, and `clampVolume` are used identically across Tasks 1–5.
The component markup (Task 3) provides exactly the elements `player.ts` (Task 2) queries. ✓
