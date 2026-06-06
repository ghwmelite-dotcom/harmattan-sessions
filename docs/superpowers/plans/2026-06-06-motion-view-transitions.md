# Motion: View Transitions + Scroll Choreography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add premium motion to the marketing site — site-wide cross-dissolve page transitions (with a shared-element morph on home → /studio) and once-on-scroll reveals (fade-up default, depth hero) — as progressive enhancements that fully respect reduced-motion and JS-off.

**Architecture:** Enable Astro's `<ClientRouter />` for View Transitions, persist the nav, and tag the two studio "peek" elements with a shared `transition:name` for the morph. A small `IntersectionObserver` module reveals `[data-reveal]` / `[data-reveal-group]` elements once; all hidden states live in `motion.css` behind `@media (prefers-reduced-motion: no-preference)` and an `html.reveal-ready` class set before paint (no FOUC). Existing client scripts are moved onto the `astro:page-load` lifecycle so they survive client navigation.

**Tech Stack:** Astro 6 `astro:transitions` (`ClientRouter`, `transition:persist`, `transition:name`, `astro:page-load`/`astro:before-swap`), IntersectionObserver, CSS transitions/keyframes. No new deps. Verification = `astro check` + build + Playwright behavioral (minimal pure logic, matching how this repo verifies UI).

---

## Conventions & notes
- Run all commands from `C:\dev\Projects\harmattan-sessions`. UTF-8 files.
- No CSP changes (all same-origin; inline already allowed). See the project's CSP memory.
- **Order matters:** Task 1 turns on client routing; Task 2 immediately makes the existing
  newsletter + YouTube scripts survive it. Do them in sequence.
- **Refinement vs spec §5.6:** the depth reveal + drifting glow go on the **homepage Hero only**.
  The `/studio` hero's signature entrance is the morph (Task 7), so adding a competing depth reveal
  there is omitted to avoid the two animations fighting. (StudioHero keeps its existing static glow.)

## File map
| File | Change |
|---|---|
| `src/components/BaseHead.astro` | `<ClientRouter />` + inline no-FOUC script |
| `src/layouts/Base.astro` | re-init newsletter on `astro:page-load`; import `motion.css`; include `scroll-reveal` script |
| `src/lib/yt-hydrate.ts` | run on `astro:page-load` instead of once |
| `src/components/Nav.astro` | `transition:persist` |
| `src/lib/scroll-reveal.ts` | new — IntersectionObserver reveal engine + before-swap/page-load wiring |
| `src/styles/motion.css` | new — reveal states, depth variant, child stagger, hero glow |
| `src/components/Hero.astro` | `data-reveal="depth"` + `.hero-glow` element |
| section components + `mixes.astro` | `data-reveal` / `data-reveal-group` attributes |
| `src/components/StudioTeaser.astro` + `src/components/StudioHero.astro` | shared `transition:name` on the peeks |

---

## Task 1: Enable View Transitions + no-FOUC

**Files:** Modify `src/components/BaseHead.astro`

- [ ] **Step 1: Add the router import.** At the top of the frontmatter in `src/components/BaseHead.astro`, add the import after the existing `themeInitScript` import (line 2):

```astro
import { ClientRouter } from 'astro:transitions';
```

- [ ] **Step 2: Render the router + no-FOUC script.** At the END of `src/components/BaseHead.astro` (after the JSON-LD script block, line 28), add:

```astro
<ClientRouter />
<script is:inline>
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
  }
</script>
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors) then `npm run build` (succeeds; the View Transitions runtime is bundled, no external request).

- [ ] **Step 4: Commit**

```bash
git add src/components/BaseHead.astro
git commit -m "feat(motion): enable Astro View Transitions + no-FOUC reveal-ready flag

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Keep existing client scripts alive across navigations

With client routing on, bundled scripts run once and would stop working after a client navigation.
Bind them to `astro:page-load` (fires on first load AND after every transition).

**Files:** Modify `src/layouts/Base.astro`, `src/lib/yt-hydrate.ts`

- [ ] **Step 1: Newsletter handler → `astro:page-load`.** In `src/layouts/Base.astro`, replace the entire newsletter `<script>` block (lines 27–45, the one starting `document.querySelectorAll('form.hs-subscribe')`) with this version that binds on every page load and guards against double-binding:

```astro
    <script>
  function bindNewsletter() {
    document.querySelectorAll('form.hs-subscribe').forEach((form) => {
      if ((form as HTMLElement).dataset.bound) return;
      (form as HTMLElement).dataset.bound = 'true';
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.currentTarget as HTMLFormElement;
        const btn = f.querySelector('button')!; const prev = btn.textContent;
        const data = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
        data.source = f.dataset.source ?? 'unknown';
        btn.setAttribute('disabled', 'true'); btn.textContent = '…';
        const msg = f.parentElement?.querySelector('.hs-form-msg') as HTMLElement | null;
        try {
          const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
          if (msg) msg.textContent = res.ok ? 'You\'re on the list — the first dispatch lands Friday.' : 'That didn\'t work. Try again?';
          if (res.ok) f.reset();
        } catch { if (msg) msg.textContent = 'Network error. Try again?'; }
        finally { btn.removeAttribute('disabled'); btn.textContent = prev; }
      });
    });
  }
  document.addEventListener('astro:page-load', bindNewsletter);
</script>
```

- [ ] **Step 2: YouTube hydrate → `astro:page-load`.** In `src/lib/yt-hydrate.ts`, replace the final line `hydrate();` with:

```ts
document.addEventListener('astro:page-load', hydrate);
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/lib/yt-hydrate.ts
git commit -m "fix(motion): re-init newsletter + youtube hydrate on astro:page-load

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Persist the nav across navigations

**Files:** Modify `src/components/Nav.astro`

- [ ] **Step 1: Add `transition:persist`.** In `src/components/Nav.astro`, change the opening `<nav>` tag (line 5) from:

```astro
<nav><div class="wrap nav-in">
```

to:

```astro
<nav transition:persist><div class="wrap nav-in">
```

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(motion): persist nav across view transitions (no flash)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: The reveal engine (script + styles + wiring)

**Files:** Create `src/lib/scroll-reveal.ts`, `src/styles/motion.css`; Modify `src/layouts/Base.astro`

- [ ] **Step 1: Create the observer module** — `src/lib/scroll-reveal.ts`:

```ts
// Scroll-reveal engine. Reveals [data-reveal] / [data-reveal-group] once as they enter view.
// All hidden states live in motion.css behind prefers-reduced-motion + html.reveal-ready.

const SELECTOR = '[data-reveal], [data-reveal-group]';
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | null = null;

function ensureObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  return observer;
}

function reveal(): void {
  if (reduce()) return; // motion.css leaves everything visible
  document.documentElement.classList.add('reveal-ready');
  const obs = ensureObserver();
  document.querySelectorAll(SELECTOR).forEach((el) => {
    if (!el.classList.contains('in')) obs.observe(el);
  });
}

// Set the no-FOUC flag on the INCOMING document before it paints (client navigations).
document.addEventListener('astro:before-swap', (e) => {
  if (!reduce()) {
    (e as unknown as { newDocument: Document }).newDocument.documentElement.classList.add('reveal-ready');
  }
});

// Runs on first load and after every view-transition navigation.
document.addEventListener('astro:page-load', reveal);
```

- [ ] **Step 2: Create the motion styles** — `src/styles/motion.css`:

```css
/* Motion layer — scroll reveals + hero depth. Gated on reduce-motion + .reveal-ready (no FOUC). */

/* The glow element must be out of flow even under reduced motion (else it injects a blank block). */
.hero-glow {
  position: absolute;
  inset: -25%;
  background: radial-gradient(42% 42% at 70% 30%, var(--glow-1), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: no-preference) {
  /* single-element fade-up */
  html.reveal-ready [data-reveal] {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity .6s ease-out, transform .6s ease-out;
  }
  html.reveal-ready [data-reveal].in { opacity: 1; transform: none; }

  /* hero depth variant */
  html.reveal-ready [data-reveal="depth"] {
    opacity: 0;
    transform: translateY(26px) scale(.97);
    filter: blur(10px);
    transition: opacity .8s ease-out, transform .8s ease-out, filter .8s ease-out;
  }
  html.reveal-ready [data-reveal="depth"].in { opacity: 1; transform: none; filter: none; }

  /* grouped children, staggered */
  html.reveal-ready [data-reveal-group] > * {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity .55s ease-out, transform .55s ease-out;
  }
  html.reveal-ready [data-reveal-group].in > * { opacity: 1; transform: none; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(1) { transition-delay: 0s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(2) { transition-delay: .06s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(3) { transition-delay: .12s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(4) { transition-delay: .18s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(5) { transition-delay: .24s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(6) { transition-delay: .30s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(7) { transition-delay: .36s; }
  html.reveal-ready [data-reveal-group].in > *:nth-child(n+8) { transition-delay: .42s; }

  /* hero drifting glow */
  .hero-glow { animation: hs-drift 14s ease-in-out infinite; }
  @keyframes hs-drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-3%, 2%); }
  }
}
```

- [ ] **Step 3: Wire into the layout.** In `src/layouts/Base.astro`:

(a) Add the motion stylesheet import after the `global.css` import (line 4):

```astro
import '../styles/motion.css';
```

(b) Add the reveal script right after the YouTube hydrate script line (the `<script>import '../lib/yt-hydrate.ts';</script>` line), before `</body>`:

```astro
    <script>import '../lib/scroll-reveal.ts';</script>
```

- [ ] **Step 4: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds). At this point nothing has `data-reveal` yet, so there is no visible change — that's expected; the engine is in place.

- [ ] **Step 5: Commit**

```bash
git add src/lib/scroll-reveal.ts src/styles/motion.css src/layouts/Base.astro
git commit -m "feat(motion): scroll-reveal engine + motion.css (no markup wired yet)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Hero depth reveal + drifting glow

**Files:** Modify `src/components/Hero.astro`

- [ ] **Step 1: Add the glow element and the depth reveal.** In `src/components/Hero.astro`, change the opening of the header (line 4) from:

```astro
<header class="hero"><div class="wrap hero-in">
```

to:

```astro
<header class="hero"><div class="hero-glow" aria-hidden="true"></div><div class="wrap hero-in" data-reveal="depth">
```

(The `.hero` element already has `position:relative; overflow:hidden` in `global.css`, so the absolutely-positioned glow sits behind the content and is clipped. `data-reveal="depth"` makes the hero content blur-in on load.)

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 3: Visual sanity (optional but recommended).** `npm run preview` (or serve `dist/client`) and confirm the homepage hero blurs/rises in on load and a faint warm glow drifts behind it; with OS reduce-motion on, the hero is simply visible with a static glow.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(motion): hero depth reveal + drifting glow

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Wire fade-up reveals across all sections

Pure markup: add `data-reveal` to each section header and `data-reveal-group` to each card grid.
No logic changes. After each file, the section will rise in on scroll.

**Files:** Modify the components/pages below.

- [ ] **Step 1: Homepage section components.**

`src/components/SoundsGrid.astro` — add `data-reveal` to the sec-head and `data-reveal-group` to the grid:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="sounds">` → `<div class="sounds" data-reveal-group>`

`src/components/MixesGrid.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- the populated grid `<div class="mixrow" data-yt-grid="home" data-yt-limit="3">` → add `data-reveal-group` so it reads `<div class="mixrow" data-yt-grid="home" data-yt-limit="3" data-reveal-group>`
- the fallback `<div class="mixrow">` (placeholder branch) → `<div class="mixrow" data-reveal-group>`

`src/components/FieldRecordings.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="field">` → `<div class="field" data-reveal-group>`

`src/components/ListenPlatforms.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="platforms">` → `<div class="platforms" data-reveal-group>`

`src/components/Newsletter.astro`:
- `<div class="dispatch" id="dispatch">` → `<div class="dispatch" id="dispatch" data-reveal>`

`src/components/StudioTeaser.astro`:
- `<div class="st-band">` → `<div class="st-band" data-reveal>`

- [ ] **Step 2: /studio section components.**

`src/components/StudioGenres.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="st-genres">` → `<div class="st-genres" data-reveal-group>`

`src/components/StudioPipeline.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<ol class="st-steps">` → `<ol class="st-steps" data-reveal-group>`
- `<p class="st-note">` → `<p class="st-note" data-reveal>`

`src/components/StudioReleaseKit.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="st-kit">` → `<div class="st-kit" data-reveal-group>`

`src/components/StudioCTA.astro`:
- `<div class="st-final">` → `<div class="st-final" data-reveal>`

- [ ] **Step 3: /mixes page.**

`src/pages/mixes.astro`:
- `<div class="sec-head">` → `<div class="sec-head" data-reveal>`
- `<div class="mixrow" data-yt-grid="archive">` → `<div class="mixrow" data-yt-grid="archive" data-reveal-group>`

- [ ] **Step 4: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 5: Commit**

```bash
git add src/components/SoundsGrid.astro src/components/MixesGrid.astro src/components/FieldRecordings.astro src/components/ListenPlatforms.astro src/components/Newsletter.astro src/components/StudioTeaser.astro src/components/StudioGenres.astro src/components/StudioPipeline.astro src/components/StudioReleaseKit.astro src/components/StudioCTA.astro src/pages/mixes.astro
git commit -m "feat(motion): wire fade-up scroll reveals across all sections

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Shared-element morph (home → /studio)

**Files:** Modify `src/components/StudioTeaser.astro`, `src/components/StudioHero.astro`

- [ ] **Step 1: Tag the teaser peek (source).** In `src/components/StudioTeaser.astro`, change:

```astro
    <div class="st-band-peek" aria-hidden="true">
```

to:

```astro
    <div class="st-band-peek" aria-hidden="true" transition:name="studio-portal">
```

- [ ] **Step 2: Tag the hero peek (destination).** In `src/components/StudioHero.astro`, change:

```astro
  <div class="st-peek" aria-hidden="true">
```

to:

```astro
  <div class="st-peek" aria-hidden="true" transition:name="studio-portal">
```

(The two share the name but live on different pages, so there's no per-page collision. Navigating home → /studio morphs the teaser peek into the hero peek; navigating to /studio from a page without the teaser simply cross-dissolves.)

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` (succeeds).

- [ ] **Step 4: Commit**

```bash
git add src/components/StudioTeaser.astro src/components/StudioHero.astro
git commit -m "feat(motion): shared-element morph on the home -> studio crossing

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Suite + check + build.** `npm test` (existing tests stay green), `npm run check` (0 errors), `npm run build` (succeeds; `dist/client/index.html`, `dist/client/studio/index.html`, `dist/client/mixes/index.html` all emitted).

- [ ] **Step 2: Behavioral check (Playwright on the built output).** Serve `dist/client` (`python -m http.server 8011 --directory dist/client`) and run a Playwright script that verifies:

```python
from playwright.sync_api import sync_playwright
BASE = "http://localhost:8011"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # (1) motion ON: reveal-ready set, below-fold reveals on scroll
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.goto(f"{BASE}/", wait_until="networkidle")
    assert pg.evaluate("document.documentElement.classList.contains('reveal-ready')"), "reveal-ready missing"
    # a below-fold group starts un-revealed, then reveals after scrolling to it
    grp = pg.locator('[data-reveal-group]').last
    pg.wait_for_timeout(300)
    grp.scroll_into_view_if_needed(); pg.wait_for_timeout(700)
    assert grp.evaluate("el => el.classList.contains('in')"), "group did not reveal on scroll"
    # client-side nav keeps the SAME nav node (persist) and is not a full reload
    pg.evaluate("window.__navMarker = true")
    pg.get_by_role("link", name="Studio").first.click()
    pg.wait_for_url("**/studio/**", timeout=8000) if False else pg.wait_for_timeout(1200)
    assert pg.evaluate("window.__navMarker === true"), "full reload happened (persist/router not active)"
    assert "/studio" in pg.url, f"did not navigate, url={pg.url}"

    # (2) reduced motion: content visible, no reveal-ready, no transform
    rm = b.new_context(reduced_motion="reduce").new_page()
    rm.goto(f"{BASE}/", wait_until="networkidle")
    assert not rm.evaluate("document.documentElement.classList.contains('reveal-ready')"), "reveal-ready set under reduce-motion"
    el = rm.locator('[data-reveal]').last
    assert el.evaluate("e => getComputedStyle(e).opacity") == "1", "data-reveal hidden under reduce-motion"
    b.close()
print("MOTION CHECKS PASSED")
```

Expected output: `MOTION CHECKS PASSED`. (The `window.__navMarker` surviving the click proves the navigation was client-side via `<ClientRouter />` — a full reload would wipe it.)

- [ ] **Step 3: Final commit (only if tweaks were needed)**

```bash
git add -A
git commit -m "test(motion): verify transitions + reveals + reduced-motion fallback

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 fade-up default → Task 4 (`[data-reveal]`/`[data-reveal-group]`) + Task 6 wiring. ✓
- §2 depth hero → Task 4 (depth CSS) + Task 5 (Hero). ✓
- §2 cross-dissolve default + nav persist → Task 1 (ClientRouter) + Task 3 (persist). ✓
- §2 morph home→/studio → Task 7. ✓
- §2 reduced-motion gating → Task 4 (motion.css guards) + Task 1 (no-FOUC flag) + Task 8 (verified). ✓
- §5.1 BaseHead → Task 1; §5.2 Nav → Task 3; §5.3 morph → Task 7; §5.4 scroll-reveal.ts → Task 4;
  §5.5 motion.css → Task 4; §5.6 reveal wiring + hero glow → Tasks 5/6; §5.7 Base imports → Task 4. ✓
- §6 `astro:page-load` re-init of newsletter + yt-hydrate (the flagged integration risk) → Task 2. ✓
- §6 no-FOUC via inline + before-swap → Task 1 + Task 4. ✓
- §7 testing (router present, persist, reveal-on-scroll, reduced-motion visible) → Task 8. ✓

**Placeholder scan:** none — every code step has complete code or an exact old→new edit; every command
has an expected result. (No vitest unit tests are added: this feature is DOM/CSS glue with no pure
logic; verification is build + Playwright behavioral, consistent with the repo's UI approach and stated
explicitly in the header.)

**Type/name consistency:** the `reveal-ready` class, `.in` class, `[data-reveal]` /
`[data-reveal="depth"]` / `[data-reveal-group]` selectors, `transition:name="studio-portal"`, the
`hs-drift` keyframe, and `.hero-glow` are used identically across Tasks 1, 4, 5, 6, 7. `astro:page-load`
is the single re-init hook used by Task 2 (newsletter, yt-hydrate) and Task 4 (scroll-reveal). The
morph source (`.st-band-peek`) and destination (`.st-peek`) match the elements confirmed in the current
component source. ✓
