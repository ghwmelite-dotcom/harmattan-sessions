# Time-of-Day "Evening Engine" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shift the hero's atmosphere (glow color/intensity, sun position, grain) across dawn → midday → dusk → night based on the visitor's local clock, with a nav phase-chip override — as a progressive enhancement that leaves JS-off/reduced-motion users with today's exact site.

**Architecture:** A parallel axis to the existing theme system: an inline script sets `data-tod` on `<html>` before paint (from `localStorage('hs-tod')`, default `auto` → computed from the local hour). `tod.css` re-points the atmosphere CSS variables the hero already consumes (`--glow-1`, `--glow-2`, `--grain-op`) plus a new sun-position (`--sun-x`/`--sun-y`), per `[data-tod]` phase, with `@property`-registered vars + a post-paint transition for smooth cross-fades. A nav phase chip cycles/persists the setting.

**Tech Stack:** Astro 6, CSS `@property` + custom-property transitions, `localStorage`, Vitest for the pure phase logic. Mirrors the existing `theme-init` / `ThemeToggle` patterns. No new deps, no CSP change.

---

## Conventions & notes
- Run all commands from `C:\dev\Projects\harmattan-sessions`. UTF-8.
- This mirrors the **theme system**: `data-tod` on `<html>` (like `data-theme`), an inline no-FOUC
  init script (like `themeInitScript`), and a nav control (like `ThemeToggle`, which works under the
  persisted nav from the motion feature).
- **Defaults equal today's look:** the hero's default sun position is the current `78% 8%`, so with
  JS off / no `data-tod` / unsupported `@property`, the site looks exactly as it does now.
- Per-phase color values below are the agreed starting point; we do a screenshot pass in the final
  task and tune if needed (spec §8).

## File map
| File | Change |
|---|---|
| `src/lib/timeOfDay.ts` | new — `phaseForHour`, `resolveTod`, `nextSetting`, `todInitScript` (pure + tested) |
| `src/components/BaseHead.astro` | add the inline `todInitScript` (before paint) |
| `src/styles/tokens.css` | add `--sun-x`/`--sun-y` defaults to `:root` |
| `src/styles/global.css` | hero gradient uses `--sun-x`/`--sun-y` |
| `src/styles/tod.css` | new — `@property` regs + per-phase variable sets (dark+light) + cross-fade transition |
| `src/layouts/Base.astro` | import `tod.css` |
| `src/components/TodControl.astro` | new — the phase chip (cycle + persist + Auto interval) |
| `src/components/Nav.astro` | render `<TodControl />` beside `<ThemeToggle />` |

---

## Task 1: Time-of-day pure module

**Files:** Create `src/lib/timeOfDay.ts`; Test `tests/timeOfDay.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/timeOfDay.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { phaseForHour, resolveTod, nextSetting, todInitScript } from '../src/lib/timeOfDay';

describe('phaseForHour', () => {
  it('maps each hour bucket and its boundaries', () => {
    expect(phaseForHour(4)).toBe('night');
    expect(phaseForHour(5)).toBe('dawn');
    expect(phaseForHour(8)).toBe('dawn');
    expect(phaseForHour(9)).toBe('day');
    expect(phaseForHour(16)).toBe('day');
    expect(phaseForHour(17)).toBe('dusk');
    expect(phaseForHour(20)).toBe('dusk');
    expect(phaseForHour(21)).toBe('night');
    expect(phaseForHour(0)).toBe('night');
    expect(phaseForHour(23)).toBe('night');
  });
});

describe('resolveTod', () => {
  it('returns an explicit stored phase unchanged', () => {
    expect(resolveTod('dusk', 10)).toBe('dusk');
    expect(resolveTod('night', 12)).toBe('night');
  });
  it('computes from the hour for auto / null / garbage', () => {
    expect(resolveTod('auto', 7)).toBe('dawn');
    expect(resolveTod(null, 23)).toBe('night');
    expect(resolveTod('not-a-phase', 12)).toBe('day');
  });
});

describe('nextSetting', () => {
  it('cycles auto -> dawn -> day -> dusk -> night -> auto', () => {
    expect(nextSetting('auto')).toBe('dawn');
    expect(nextSetting('dawn')).toBe('day');
    expect(nextSetting('day')).toBe('dusk');
    expect(nextSetting('dusk')).toBe('night');
    expect(nextSetting('night')).toBe('auto');
  });
  it('resets unknown values to auto', () => {
    expect(nextSetting('whatever' as never)).toBe('auto');
  });
});

describe('todInitScript', () => {
  it('references the data-tod attribute and the hs-tod storage key', () => {
    expect(todInitScript).toContain('data-tod');
    expect(todInitScript).toContain('hs-tod');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/timeOfDay.test.ts` → FAIL (cannot find module).

- [ ] **Step 3: Implement** — `src/lib/timeOfDay.ts`:

```ts
export type Phase = 'dawn' | 'day' | 'dusk' | 'night';
export type TodSetting = 'auto' | Phase;

export function phaseForHour(hour: number): Phase {
  if (hour >= 5 && hour <= 8) return 'dawn';
  if (hour >= 9 && hour <= 16) return 'day';
  if (hour >= 17 && hour <= 20) return 'dusk';
  return 'night';
}

export function resolveTod(stored: string | null, hour: number): Phase {
  if (stored === 'dawn' || stored === 'day' || stored === 'dusk' || stored === 'night') return stored;
  return phaseForHour(hour);
}

export function nextSetting(current: TodSetting): TodSetting {
  const order: TodSetting[] = ['auto', 'dawn', 'day', 'dusk', 'night'];
  const i = order.indexOf(current);
  return order[(i + 1) % order.length] ?? 'auto';
}

// Inline, render-blocking IIFE (like themeInitScript). Sets data-tod before first paint.
// Thresholds are duplicated here as inline JS; the test guards against silent drift.
export const todInitScript = `(function(){try{var s=localStorage.getItem('hs-tod');
var p=(s==='dawn'||s==='day'||s==='dusk'||s==='night')?s:(function(h){return h>=5&&h<=8?'dawn':h>=9&&h<=16?'day':h>=17&&h<=20?'dusk':'night';})(new Date().getHours());
document.documentElement.setAttribute('data-tod',p);}catch(e){document.documentElement.setAttribute('data-tod','dusk');}})();`;
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/timeOfDay.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/timeOfDay.ts tests/timeOfDay.test.ts
git commit -m "feat(evening): time-of-day phase logic + inline init script

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Set data-tod before paint

**Files:** Modify `src/components/BaseHead.astro`

- [ ] **Step 1: Import the init script.** In the frontmatter of `src/components/BaseHead.astro`, change the existing import (line 2) from:

```astro
import { themeInitScript } from '../lib/theme-init';
```

to also import the tod script:

```astro
import { themeInitScript } from '../lib/theme-init';
import { todInitScript } from '../lib/timeOfDay';
```

- [ ] **Step 2: Render it.** Immediately AFTER the existing theme-init inline script line (`<script is:inline set:html={themeInitScript}></script>`), add:

```astro
<script is:inline set:html={todInitScript}></script>
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). (No visible change yet — `data-tod` is set but no CSS targets it until Task 4.)

- [ ] **Step 4: Commit**

```bash
git add src/components/BaseHead.astro
git commit -m "feat(evening): set data-tod on <html> before paint

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Hero glow consumes a sun-position variable

**Files:** Modify `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Add default sun-position vars.** In `src/styles/tokens.css`, inside the `:root{ … }` block, add `--sun-x` and `--sun-y` (defaults equal the current hero glow position so nothing changes yet). Change the `:root` block's first line from:

```css
:root{
  --serif:'Fraunces',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
```

to:

```css
:root{
  --sun-x:78%; --sun-y:8%;
  --serif:'Fraunces',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
```

- [ ] **Step 2: Use them in the hero gradient.** In `src/styles/global.css`, the `.hero` rule currently has:

```css
.hero{position:relative;overflow:hidden;padding:120px 0 96px;
  background:radial-gradient(90% 70% at 78% 8%, var(--glow-1) 0%, transparent 55%),
    radial-gradient(70% 60% at 12% 100%, var(--glow-2) 0%, transparent 60%), var(--bg)}
```

Change ONLY the first gradient's position `at 78% 8%` to use the variables:

```css
.hero{position:relative;overflow:hidden;padding:120px 0 96px;
  background:radial-gradient(90% 70% at var(--sun-x) var(--sun-y), var(--glow-1) 0%, transparent 55%),
    radial-gradient(70% 60% at 12% 100%, var(--glow-2) 0%, transparent 60%), var(--bg)}
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). Still no visible change (defaults equal the old hard-coded position).

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css
git commit -m "feat(evening): hero glow position via --sun-x/--sun-y (defaults unchanged)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Per-phase atmosphere styles (tod.css)

**Files:** Create `src/styles/tod.css`; Modify `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/styles/tod.css`:**

```css
/* Time-of-day "evening engine" — re-points the hero atmosphere variables per phase.
   @property registration lets the gradient colors/positions cross-fade. The transition lives on
   html.tod-transition (added by JS after first paint) so the initial phase is instant (no flash). */

@property --glow-1 { syntax: '<color>'; inherits: true; initial-value: transparent; }
@property --glow-2 { syntax: '<color>'; inherits: true; initial-value: transparent; }
@property --grain-op { syntax: '<number>'; inherits: true; initial-value: 0.04; }
@property --sun-x { syntax: '<percentage>'; inherits: true; initial-value: 78%; }
@property --sun-y { syntax: '<percentage>'; inherits: true; initial-value: 8%; }

/* dark theme (default) per-phase atmosphere */
[data-tod="dawn"]  { --glow-1: rgba(232,176,75,.22); --glow-2: rgba(201,110,63,.08); --grain-op: .035; --sun-x: 16%; --sun-y: 86%; }
[data-tod="day"]   { --glow-1: rgba(244,232,214,.13); --glow-2: rgba(232,176,75,.08); --grain-op: .030; --sun-x: 50%; --sun-y: 4%;  }
[data-tod="dusk"]  { --glow-1: rgba(201,110,63,.30); --glow-2: rgba(232,176,75,.14); --grain-op: .045; --sun-x: 82%; --sun-y: 80%; }
[data-tod="night"] { --glow-1: rgba(201,110,63,.16); --glow-2: rgba(232,176,75,.06); --grain-op: .070; --sun-x: 80%; --sun-y: 94%; }

/* light theme — toned down glow/grain (sun position inherits from the rules above) */
[data-theme="light"][data-tod="dawn"]  { --glow-1: rgba(232,176,75,.18); --glow-2: rgba(201,110,63,.10); --grain-op: .040; }
[data-theme="light"][data-tod="day"]   { --glow-1: rgba(232,176,75,.10); --glow-2: rgba(201,110,63,.06); --grain-op: .035; }
[data-theme="light"][data-tod="dusk"]  { --glow-1: rgba(201,110,63,.20); --glow-2: rgba(232,176,75,.16); --grain-op: .045; }
[data-theme="light"][data-tod="night"] { --glow-1: rgba(201,110,63,.12); --glow-2: rgba(232,176,75,.10); --grain-op: .050; }

/* smooth cross-fade for later changes only (class added after first paint); off under reduced motion */
@media (prefers-reduced-motion: no-preference) {
  html.tod-transition {
    transition: --glow-1 .8s ease, --glow-2 .8s ease, --grain-op .8s ease, --sun-x .8s ease, --sun-y .8s ease;
  }
}
```

- [ ] **Step 2: Import it.** In `src/layouts/Base.astro` frontmatter, add the import after the `motion.css` import:

```astro
import '../styles/tod.css';
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). Now loading the site shows the phase matching the local hour (the BaseHead inline script from Task 2 sets `data-tod`).

- [ ] **Step 4: Visual sanity (optional).** `npm run preview`; in devtools set `<html data-tod="dawn|day|dusk|night">` and confirm the hero glow shifts color/position; with reduce-motion the change is instant.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tod.css src/layouts/Base.astro
git commit -m "feat(evening): per-phase atmosphere variables + cross-fade (tod.css)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: The phase-chip control

**Files:** Create `src/components/TodControl.astro`; Modify `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/TodControl.astro`:**

```astro
---
// Time-of-day phase chip. Cycles Auto -> Dawn -> Midday -> Dusk -> Night -> Auto, persists the
// choice, and (in Auto) re-resolves the phase every ~5 min. Mirrors the ThemeToggle pattern, so it
// survives view-transition navigations via the persisted <nav>.
---
<button class="tod-chip" id="hs-tod-chip" type="button" aria-label="Time of day — Auto">
  <span class="tod-dot" aria-hidden="true"></span><span class="tod-label">Auto</span>
</button>
<style>
  .tod-chip{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:var(--gold);
    border:1px solid rgba(232,176,75,.4);background:rgba(232,176,75,.07);padding:7px 12px;border-radius:999px;
    cursor:pointer;font-family:inherit;line-height:1;transition:border-color .2s,background .2s}
  .tod-chip:hover{border-color:var(--gold)}
  .tod-dot{width:8px;height:8px;border-radius:50%;background:radial-gradient(circle,#ffd9a0,var(--terracotta))}
  @media(max-width:520px){.tod-chip .tod-label{display:none}.tod-chip{padding:7px}}
</style>
<script>
  import { resolveTod, nextSetting, type TodSetting } from '../lib/timeOfDay';
  const root = document.documentElement;
  const chip = document.getElementById('hs-tod-chip');
  if (chip) {
    const label = chip.querySelector('.tod-label') as HTMLElement;
    const LABELS: Record<TodSetting, string> = { auto: 'Auto', dawn: 'Dawn', day: 'Midday', dusk: 'Dusk', night: 'Night' };
    let timer: number | undefined;

    function read(): TodSetting {
      const s = localStorage.getItem('hs-tod');
      return (s === 'dawn' || s === 'day' || s === 'dusk' || s === 'night' || s === 'auto') ? s : 'auto';
    }
    function applyTod(setting: TodSetting): void {
      root.setAttribute('data-tod', resolveTod(setting === 'auto' ? null : setting, new Date().getHours()));
    }
    function paint(setting: TodSetting): void {
      label.textContent = LABELS[setting];
      chip!.setAttribute('aria-label', `Time of day — ${LABELS[setting]}`);
    }
    function manageTimer(setting: TodSetting): void {
      if (timer) { clearInterval(timer); timer = undefined; }
      if (setting === 'auto') timer = window.setInterval(() => applyTod('auto'), 300000);
    }
    function set(setting: TodSetting): void {
      try { localStorage.setItem('hs-tod', setting); } catch {}
      applyTod(setting); paint(setting); manageTimer(setting);
    }

    chip.addEventListener('click', () => set(nextSetting(read())));
    const cur = read(); paint(cur); manageTimer(cur);
    // enable cross-fade for subsequent changes only (initial phase was set before paint)
    requestAnimationFrame(() => root.classList.add('tod-transition'));
  }
</script>
```

- [ ] **Step 2: Add it to the nav.** In `src/components/Nav.astro`:

(a) Add the import in the frontmatter after the `ThemeToggle` import:

```astro
import TodControl from './TodControl.astro';
```

(b) In `.nav-right`, render `<TodControl />` immediately before `<ThemeToggle />`. Change:

```astro
    <ThemeToggle />
```

to:

```astro
    <TodControl />
    <ThemeToggle />
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 4: Commit**

```bash
git add src/components/TodControl.astro src/components/Nav.astro
git commit -m "feat(evening): nav phase chip (cycle Auto/Dawn/Midday/Dusk/Night + persist)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Suite + check + build.** `npm test` (all green incl. the new `timeOfDay` tests), `npm run check` (0 errors), `npm run build` (succeeds; home/studio/mixes all emit).

- [ ] **Step 2: Behavioral check (Playwright on built output).** Serve `dist/client` (`python -m http.server 8055 --directory dist/client`) and run:

```python
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8055"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # (a) an explicit stored phase is honored before paint
    c = b.new_context(viewport={"width":1280,"height":900})
    c.add_init_script("try{localStorage.setItem('hs-tod','dusk')}catch(e){}")
    pg = c.new_page(); pg.goto(f"{BASE}/", wait_until="networkidle")
    assert pg.evaluate("document.documentElement.getAttribute('data-tod')") == "dusk", "stored phase not applied"

    # (b) chip cycles label + data-tod + persists
    chip = pg.locator('#hs-tod-chip')
    chip.click(); pg.wait_for_timeout(150)  # dusk -> night
    assert pg.evaluate("document.documentElement.getAttribute('data-tod')") == "night"
    assert "Night" in chip.inner_text()
    assert pg.evaluate("localStorage.getItem('hs-tod')") == "night"
    c.close()

    # (c) auto resolves to one of the four on a fresh visit
    c2 = b.new_context(); pg2 = c2.new_page(); pg2.goto(f"{BASE}/", wait_until="networkidle")
    assert pg2.evaluate("document.documentElement.getAttribute('data-tod')") in ("dawn","day","dusk","night")
    c2.close()

    # (d) reduced motion: no cross-fade transition on <html>
    c3 = b.new_context(reduced_motion="reduce"); pg3 = c3.new_page(); pg3.goto(f"{BASE}/", wait_until="networkidle")
    pg3.wait_for_timeout(200)
    td = pg3.evaluate("getComputedStyle(document.documentElement).transitionDuration")
    assert td in ("", "0s", "0s, 0s, 0s, 0s, 0s"), f"unexpected transition under reduce-motion: {td}"
    c3.close()
    b.close()
print("EVENING ENGINE CHECKS PASSED")
```

Expected output: `EVENING ENGINE CHECKS PASSED`.

- [ ] **Step 3: Per-phase screenshot pass.** With the static server still serving `dist/client`, screenshot the homepage hero with `data-tod` forced to each phase (set via `add_init_script` localStorage `hs-tod` = `dawn|day|dusk|night`, dark + a light check) to visually confirm each phase reads well and hero text keeps AA contrast. Tune the values in `tod.css` (Task 4) if any phase washes out the text, then rebuild.

- [ ] **Step 4: Final commit (only if tod.css values were tuned).**

```bash
git add -A
git commit -m "polish(evening): tune per-phase atmosphere values after visual pass

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 four phases → Task 1 (`phaseForHour`) + Task 4 (four `[data-tod]` blocks). ✓
- §2 orthogonal to dark/light → `data-tod` separate from `data-theme`; light overrides in Task 4. ✓
- §2 re-points hero glow vars + sun position → Tasks 3 (sun vars) + 4 (per-phase). ✓
- §2 phase-chip override (cycle/persist/Auto) → Task 5. ✓
- §2 auto ~5-min re-resolve → Task 5 (`manageTimer`). ✓
- §2 hour thresholds → Task 1 (`phaseForHour`) and the inline `todInitScript`. ✓
- §4 no-FOUC inline before paint → Task 2; `@property` + post-paint transition → Task 4 + Task 5 (`tod-transition`). ✓
- §5.1 module → Task 1; §5.2 BaseHead → Task 2; §5.3 tod.css → Task 4; §5.4 hero/global → Task 3;
  §5.5 TodControl → Task 5; §5.6 Nav → Task 5. ✓
- §6 reduced-motion (transition gated), JS-off (defaults = today), CSP unchanged, view-transition
  persistence (chip in persisted nav) → Tasks 4/5 + verified Task 6. ✓
- §7 unit TDD (phaseForHour/resolveTod/nextSetting/todInitScript) → Task 1; behavioral + screenshots
  → Task 6. ✓

**Placeholder scan:** none — every code step has complete code/edit; commands have expected results.
Per-phase color values are concrete (not placeholders); Task 6 Step 3 is an explicit visual-tune pass,
not a deferred requirement.

**Type/name consistency:** `Phase`/`TodSetting`, `phaseForHour`/`resolveTod`/`nextSetting`/
`todInitScript`, the `data-tod` attribute, `hs-tod` storage key, the `dawn|day|dusk|night` values,
`--glow-1`/`--glow-2`/`--grain-op`/`--sun-x`/`--sun-y` variables, and the `tod-transition` class are
used identically across Tasks 1–6. The chip's `LABELS` map (`day → "Midday"`) is the only place phase
ids differ from display text, and it's self-contained in Task 5. ✓
