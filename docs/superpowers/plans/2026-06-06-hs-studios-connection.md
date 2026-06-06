# HS Studios Connection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display HS Studios on the Harmattan Sessions site as a rich `/studio` landing page plus a homepage teaser band, with a same-domain seamless crossing into the live studio.

**Architecture:** All work in the Astro marketing repo (`harmattan-sessions`). A single typed data module (`src/data/studioGenres.ts`) is the source of truth for the six genres, imported by both the `/studio` page and the homepage teaser. Five new presentational Astro components compose the page; one teaser component slots into the homepage. Nav + `siteConfig` are updated so the "Studio" tab links in-site and every "Enter the Studio" CTA points at `studio.ohwpstudios.org`. A separate appendix covers the cross-repo HS Studios custom-domain + brand cutover.

**Tech Stack:** Astro 6 (static, Cloudflare adapter), scoped component styles over CSS-variable design tokens, Vitest for pure-module tests, `astro check` + `astro build` as the component/page verification gate.

---

## Design Refinement vs. Spec

The spec proposed a `studio-genres` **content collection**. This plan uses a typed **data module**
(`src/data/studioGenres.ts`) instead. Rationale: (1) it's directly unit-testable in the existing
plain-vitest suite without the `astro:content` runtime, matching how this repo tests pure logic;
(2) DRY — both surfaces import one array; (3) simpler, no schema registration. The intent (single
source of truth for the six genres) is unchanged.

## Conventions to follow (read before starting)

- Brand tokens only — never raw hex in component logic; use `var(--gold)`, `var(--terracotta)`,
  `var(--surface)`, `var(--line)`, `var(--text)`, `var(--text-strong)`, `var(--text-dim)`,
  `var(--glow-1)`, `var(--glow-2)`, `var(--accent)`, `var(--on-accent)`. (Per-genre accent hex is
  data, and is the one allowed place a literal color lives.)
- Reuse global classes from `src/styles/global.css`: `.wrap`, `.label`, `section.blk`, `.sec-head`,
  `.btn`, `.btn-primary`, `.btn-ghost`, `.nav-studio` + `.tag`.
- Components are `.astro` files under `src/components/` with a scoped `<style>` block.
- Respect `prefers-reduced-motion` on every animation/hover transform.
- Page uses `Base` (Props: `title`, `description`) + `Nav` + `<main id="main">` + `Footer`.

---

## Task 1: Studio genre data module

**Files:**
- Create: `src/data/studioGenres.ts`
- Test: `tests/studioGenres.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/studioGenres.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { studioGenres, getStudioGenres, type StudioGenre } from '../src/data/studioGenres';

describe('studioGenres data', () => {
  it('has exactly six genres', () => {
    expect(studioGenres).toHaveLength(6);
  });

  it('exposes every required field on each genre', () => {
    for (const g of studioGenres as StudioGenre[]) {
      expect(g.name).toBeTruthy();
      expect(g.tempo).toMatch(/BPM/);
      expect(g.signature).toBeTruthy();
      expect(['Lyric · 4-pass', 'Instrumental']).toContain(g.path);
      expect(g.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(typeof g.order).toBe('number');
    }
  });

  it('has unique, contiguous order values 1..6', () => {
    const orders = studioGenres.map((g) => g.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('getStudioGenres returns them sorted by order', () => {
    const sorted = getStudioGenres();
    const orders = sorted.map((g) => g.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('includes the instrumental Afro-lofi path exactly once', () => {
    expect(studioGenres.filter((g) => g.path === 'Instrumental')).toHaveLength(1);
    expect(studioGenres.find((g) => g.path === 'Instrumental')?.name).toBe('Afro-lofi');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/studioGenres.test.ts`
Expected: FAIL — `Cannot find module '../src/data/studioGenres'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/studioGenres.ts`:

```ts
// Single source of truth for the six HS Studios genres shown on the marketing site.
// Mirrors the studio's packages/shared genre configs (kept in sync by hand — see
// docs/superpowers/specs/2026-06-06-hs-studios-connection-design.md §8).

export type StudioPath = 'Lyric · 4-pass' | 'Instrumental';

export interface StudioGenre {
  name: string;
  tempo: string;       // e.g. "108 BPM"
  signature: string;   // sonic fingerprint, one line
  path: StudioPath;
  accent: string;      // hex — the only place a literal color is allowed (it's data)
  order: number;
}

export const studioGenres: StudioGenre[] = [
  { name: 'Afrobeats',       tempo: '108 BPM', path: 'Lyric · 4-pass', accent: '#1D9E75', order: 1, signature: 'Log drum, syncopated bass, vocal chops' },
  { name: 'Amapiano',        tempo: '113 BPM', path: 'Lyric · 4-pass', accent: '#6C4FD6', order: 2, signature: 'Log drum bass, jazzy piano, deep house groove' },
  { name: 'Dancehall',       tempo: '98 BPM',  path: 'Lyric · 4-pass', accent: '#E8B04B', order: 3, signature: 'Riddim, heavy sub bass, patois bounce' },
  { name: 'Alté',            tempo: '100 BPM', path: 'Lyric · 4-pass', accent: '#8A6D4A', order: 4, signature: 'Dreamy synths, mellow, experimental R&B' },
  { name: 'Highlife Fusion', tempo: '110 BPM', path: 'Lyric · 4-pass', accent: '#C96E3F', order: 5, signature: 'Palm-wine guitar, horns, talking drum' },
  { name: 'Afro-lofi',       tempo: '82 BPM',  path: 'Instrumental',   accent: '#7A5230', order: 6, signature: 'Kalimba, tape warmth, vinyl crackle — no vocals' },
];

export function getStudioGenres(): StudioGenre[] {
  return [...studioGenres].sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/studioGenres.test.ts`
Expected: PASS (5 passing).

- [ ] **Step 5: Commit**

```bash
git add src/data/studioGenres.ts tests/studioGenres.test.ts
git commit -m "feat(studio): genre data module — single source for page + teaser

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Point siteConfig at the studio subdomain

**Files:**
- Modify: `src/siteConfig.ts:4-5`
- Test: `tests/siteConfig.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/siteConfig.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { siteConfig } from '../src/siteConfig';

describe('siteConfig.studioUrl', () => {
  it('is the same-domain studio subdomain over https', () => {
    expect(siteConfig.studioUrl).toBe('https://studio.ohwpstudios.org');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/siteConfig.test.ts`
Expected: FAIL — received `'https://hs-studios.pages.dev'`.

- [ ] **Step 3: Make the change**

In `src/siteConfig.ts`, replace lines 4-5:

```ts
  // HS Studios — the in-house studio. Canonical live-studio entry; every "Enter the Studio"
  // CTA links here. Same-domain family for a seamless crossing from the marketing site.
  studioUrl: 'https://studio.ohwpstudios.org',
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/siteConfig.test.ts`
Expected: PASS.

> **Note:** Until the Cloudflare custom domain (Appendix A) is live, this URL will 404. That is
> acceptable — the marketing page ships independently. If you need a working link before the
> cutover, temporarily set `'https://hs-studios.pages.dev'` and update the test to match, then
> revert both when the subdomain is live.

- [ ] **Step 5: Commit**

```bash
git add src/siteConfig.ts tests/siteConfig.test.ts
git commit -m "feat(studio): point studioUrl at studio.ohwpstudios.org

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Nav "Studio" tab → in-site link

**Files:**
- Modify: `src/components/Nav.astro:13-18`

- [ ] **Step 1: Make the change**

In `src/components/Nav.astro`, replace the studio anchor (lines 13-18) so it links internally and
opens in the same tab (drop `target`/`rel` and `siteConfig`-driven href; keep the icon + "New" tag):

```astro
    <a class="nav-studio" href="/studio" aria-label="HS Studios — explore the in-house studio">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h2.5l2-7 3.5 14 3-10 2 3H21"/></svg>
      <span>Studio</span>
      <span class="tag">New</span>
    </a>
```

The `import { siteConfig }` on line 4 is now unused in this file — remove that import line.

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: 0 errors, 0 warnings (no "unused import" or missing-module errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(nav): Studio tab links to in-site /studio page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: StudioHero component

**Files:**
- Create: `src/components/StudioHero.astro`

- [ ] **Step 1: Create the component**

Create `src/components/StudioHero.astro`:

```astro
---
import { siteConfig } from '../siteConfig';
---
<header class="st-hero"><div class="wrap st-hero-in">
  <span class="st-pill">◆ HS Studios — in-house studio&nbsp;·&nbsp;<b>Private beta</b></span>
  <h1>Pick a genre. Write a brief. <span class="it">Walk away with a song.</span></h1>
  <p class="sub">The studio behind the sessions. Choose a sound and it decides everything — the AI
    pipeline, the controls, the room — then hands you a ready-to-ship release kit.</p>
  <div class="st-cta-row">
    <a class="btn btn-primary" href={siteConfig.studioUrl}>Enter the Studio →</a>
    <a class="btn btn-ghost" href="#how">See how it works</a>
  </div>

  <div class="st-peek" aria-hidden="true">
    <div class="peek-bar"><i></i><i></i><i></i><span class="peek-url">studio.ohwpstudios.org</span></div>
    <div class="peek-body">
      <div class="peek-side">
        <span class="gp act">Afrobeats</span><span class="gp">Amapiano</span>
        <span class="gp">Highlife</span><span class="gp">Afro-lofi</span>
      </div>
      <div class="peek-main">
        <span class="label">Pass ② · Hook</span>
        <i class="ln" style="width:90%"></i><i class="ln" style="width:74%"></i>
        <i class="ln hot" style="width:82%"></i><i class="ln" style="width:58%"></i>
        <div class="peek-meters">
          <span class="meter on">● Live · GLM-4.7-flash</span>
          <span class="meter">9,840 neurons left</span>
        </div>
      </div>
    </div>
  </div>
</div></header>

<style>
  .st-hero{position:relative;overflow:hidden;padding:104px 0 72px;
    background:radial-gradient(95% 75% at 80% -5%,var(--glow-1) 0%,transparent 58%),
      radial-gradient(70% 60% at 8% 115%,var(--glow-2) 0%,transparent 60%),var(--bg)}
  .st-hero::after{content:"";position:absolute;inset:0;opacity:var(--grain-op);pointer-events:none;
    background-image:radial-gradient(var(--grain) 1px,transparent 1px);background-size:3px 3px}
  .st-hero-in{position:relative;max-width:820px}
  .st-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
    letter-spacing:.02em;padding:6px 14px;border-radius:999px;color:var(--gold);
    border:1px solid rgba(232,176,75,.42);background:rgba(232,176,75,.07)}
  .st-pill b{color:var(--text-strong);font-weight:600}
  .st-hero h1{font-size:clamp(38px,6.4vw,66px);margin:20px 0 0}
  .st-hero h1 .it{font-style:italic;color:var(--gold);font-weight:400}
  .st-hero .sub{font-size:clamp(16px,2.2vw,19px);color:var(--text-dim);margin:20px 0 30px;max-width:560px}
  .st-cta-row{display:flex;gap:12px;flex-wrap:wrap}
  .st-peek{margin-top:48px;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;
    box-shadow:0 30px 80px -30px rgba(0,0,0,.6)}
  .peek-bar{display:flex;align-items:center;gap:6px;padding:11px 14px;background:var(--bg-elev);
    border-bottom:1px solid var(--line)}
  .peek-bar i{width:10px;height:10px;border-radius:50%;background:#3a2f26}
  .peek-url{margin-left:12px;font-size:12px;color:var(--text-dim);background:var(--bg);
    padding:3px 12px;border-radius:999px;border:1px solid var(--line)}
  .peek-body{display:grid;grid-template-columns:200px 1fr;gap:18px;padding:22px;
    background:radial-gradient(90% 120% at 85% 0,var(--glow-2),var(--surface))}
  .peek-side{display:flex;flex-direction:column;gap:8px}
  .gp{font-size:12px;color:var(--text);padding:8px 12px;border-radius:9px;border:1px solid var(--line);background:var(--bg)}
  .gp.act{border-color:var(--gold);color:var(--gold);background:rgba(232,176,75,.08)}
  .peek-main{background:var(--bg);border:1px solid var(--line);border-radius:var(--r-md);padding:18px}
  .peek-main .ln{display:block;height:9px;border-radius:5px;background:var(--surface-2);margin:10px 0}
  .peek-main .ln.hot{background:rgba(232,176,75,.28)}
  .peek-meters{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
  .meter{font-size:10px;font-weight:600;padding:4px 10px;border-radius:999px;border:1px solid var(--line);color:var(--text-dim)}
  .meter.on{color:var(--gold);border-color:rgba(232,176,75,.4)}
  @media(max-width:620px){.peek-body{grid-template-columns:1fr}.peek-side{flex-direction:row;flex-wrap:wrap}}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioHero.astro
git commit -m "feat(studio): StudioHero — headline, dual CTA, branded studio peek

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: StudioGenres component

**Files:**
- Create: `src/components/StudioGenres.astro`

- [ ] **Step 1: Create the component**

Create `src/components/StudioGenres.astro`:

```astro
---
import { getStudioGenres } from '../data/studioGenres';
const genres = getStudioGenres();
---
<section class="blk" id="genres"><div class="wrap">
  <div class="sec-head">
    <div><span class="label">Six rooms, one studio</span><h2>The genre is the whole mechanism.</h2></div>
    <p>Each genre is pure data — its own tempo, signature, language mix and pipeline. The room themes itself to match.</p>
  </div>
  <div class="st-genres">
    {genres.map((g) => (
      <article class="st-genre">
        <span class="st-path">{g.path}</span>
        <span class="st-dot" style={`background:${g.accent}`}></span>
        <h3>{g.name}</h3>
        <div class="st-tempo">{g.tempo}</div>
        <p class="st-sig">{g.signature}</p>
      </article>
    ))}
  </div>
</div></section>

<style>
  .st-genres{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media(max-width:820px){.st-genres{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:520px){.st-genres{grid-template-columns:1fr}}
  .st-genre{position:relative;background:var(--surface);border:1px solid var(--line);
    border-radius:var(--r-lg);padding:20px;transition:transform .18s ease,border-color .18s ease}
  .st-genre:hover{transform:translateY(-4px);border-color:var(--gold)}
  .st-dot{display:block;width:34px;height:34px;border-radius:10px;margin-bottom:14px}
  .st-genre h3{font-size:19px;margin-bottom:3px}
  .st-tempo{font-size:12.5px;color:var(--gold);font-weight:600;letter-spacing:.04em}
  .st-sig{font-size:13px;color:var(--text-dim);margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
  .st-path{position:absolute;top:16px;right:16px;font-size:9px;letter-spacing:.06em;text-transform:uppercase;
    color:var(--text-dim);border:1px solid var(--line);padding:3px 8px;border-radius:999px}
  @media(prefers-reduced-motion:reduce){.st-genre:hover{transform:none}}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioGenres.astro
git commit -m "feat(studio): StudioGenres — data-driven six-genre grid

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: StudioPipeline component

**Files:**
- Create: `src/components/StudioPipeline.astro`

- [ ] **Step 1: Create the component**

Create `src/components/StudioPipeline.astro`:

```astro
---
const steps = [
  { n: '①', title: 'Concept', body: 'Theme, emotional arc, language mix, title candidates' },
  { n: '②', title: 'Hook',    body: 'Write the chorus first — chantable, call-and-response, ad-libs' },
  { n: '③', title: 'Verses',  body: 'Build around the locked hook, keep the pocket, weave the languages' },
  { n: '④', title: 'Polish',  body: 'Section tags, ad-libs, syllable-to-beat fit, final title' },
];
---
<section class="blk" id="how"><div class="wrap">
  <div class="sec-head">
    <div><span class="label">How it works</span><h2>Four passes. Hooks first.</h2></div>
    <p>Afrobeats is hook-led, so the chorus is written before the verses. Every pass is re-runnable —
      regenerate verses without losing an approved hook.</p>
  </div>
  <ol class="st-steps">
    {steps.map((s, i) => (
      <li class="st-step">
        <span class="st-n">{s.n}</span>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
        {i < steps.length - 1 && <span class="st-arrow" aria-hidden="true">→</span>}
      </li>
    ))}
  </ol>
  <p class="st-note">🎚️ <b>Afro-lofi</b> takes the instrumental path instead — texture sliders
    (vinyl crackle, tape warmth, kalimba, rain) drive a single fast composition pass into the style prompt.</p>
</div></section>

<style>
  .st-steps{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:0}
  @media(max-width:820px){.st-steps{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:440px){.st-steps{grid-template-columns:1fr}}
  .st-step{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:20px}
  .st-n{font-family:'Fraunces',serif;font-size:30px;color:var(--gold);font-weight:600;line-height:1}
  .st-step h3{font-size:16px;margin:8px 0 6px}
  .st-step p{font-size:13px;color:var(--text-dim)}
  .st-arrow{position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--terracotta);font-size:18px;z-index:2}
  @media(max-width:820px){.st-arrow{display:none}}
  .st-note{margin-top:16px;font-size:13.5px;color:var(--text-dim);background:var(--surface);
    border:1px dashed var(--line);border-radius:var(--r-md);padding:14px 18px}
  .st-note b{color:var(--text)}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioPipeline.astro
git commit -m "feat(studio): StudioPipeline — 4-pass steps + instrumental note

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: StudioReleaseKit component

**Files:**
- Create: `src/components/StudioReleaseKit.astro`

- [ ] **Step 1: Create the component**

Create `src/components/StudioReleaseKit.astro`:

```astro
---
const outputs = [
  { ic: '♫', label: 'Full lyrics', body: 'section-tagged, ad-libbed, beat-fit' },
  { ic: '✎', label: 'Style prompts', body: 'Suno style box + MusicGPT sentence, character-counted' },
  { ic: '▦', label: 'Cover art', body: 'Flux-1 Schnell, stored and ready' },
  { ic: '#', label: 'Metadata', body: 'title, hashtags, description to ship it' },
];
---
<section class="blk" id="kit"><div class="wrap">
  <div class="sec-head">
    <div><span class="label">What you walk away with</span><h2>A complete release kit.</h2></div>
    <p>Everything you need to ship, generated end-to-end on Cloudflare's free tier.</p>
  </div>
  <div class="st-kit">
    <ul class="st-kit-card">
      {outputs.map((o) => (
        <li class="st-kit-row">
          <span class="st-ic" aria-hidden="true">{o.ic}</span>
          <span><b>{o.label}</b> — {o.body}</span>
        </li>
      ))}
    </ul>
    <div class="st-cover" aria-hidden="true"><span class="st-cover-txt">Labadi Sunset</span></div>
  </div>
</div></section>

<style>
  .st-kit{display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:center}
  @media(max-width:760px){.st-kit{grid-template-columns:1fr}}
  .st-kit-card{list-style:none;padding:22px;border-radius:var(--r-lg);border:1px solid var(--line);
    background:linear-gradient(160deg,var(--surface) 0%,var(--bg-elev) 100%)}
  .st-kit-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);
    font-size:14px;color:var(--text)}
  .st-kit-row:last-child{border-bottom:0}
  .st-kit-row b{color:var(--text-strong)}
  .st-ic{flex-shrink:0;width:30px;height:30px;border-radius:8px;display:grid;place-items:center;
    color:var(--gold);background:rgba(232,176,75,.12);border:1px solid rgba(232,176,75,.3);font-size:14px}
  .st-cover{aspect-ratio:1;border-radius:var(--r-lg);border:1px solid var(--line);overflow:hidden;
    display:flex;align-items:flex-end;padding:20px;
    background:radial-gradient(120% 120% at 20% 10%,var(--terracotta),var(--bg-elev) 72%)}
  .st-cover-txt{font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:var(--text-strong);
    text-shadow:0 2px 20px rgba(0,0,0,.55)}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioReleaseKit.astro
git commit -m "feat(studio): StudioReleaseKit — outputs list + cover tile

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: StudioCTA component

**Files:**
- Create: `src/components/StudioCTA.astro`

- [ ] **Step 1: Create the component**

Create `src/components/StudioCTA.astro`:

```astro
---
import { siteConfig } from '../siteConfig';
---
<section class="blk st-final-blk"><div class="wrap">
  <div class="st-final">
    <span class="st-pill">◆ Private beta — built by Ozzy</span>
    <h2>Step into the studio.</h2>
    <p>It runs entirely on Cloudflare's free tier, with a live budget meter. Right now it's a
      single-user room — entry is gated while it's in private sessions.</p>
    <a class="btn btn-primary" href={siteConfig.studioUrl}>Enter the Studio →</a>
    <span class="st-cross">⟢ Seamless hand-off — same brand, same domain family:
      <b>studio.ohwpstudios.org</b></span>
  </div>
</div></section>

<style>
  .st-final-blk{background:radial-gradient(80% 130% at 50% 0,var(--glow-1),transparent 60%)}
  .st-final{text-align:center;max-width:600px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:16px}
  .st-final h2{font-size:clamp(28px,4.4vw,42px)}
  .st-final p{color:var(--text-dim);font-size:15px}
  .st-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
    padding:6px 14px;border-radius:999px;color:var(--gold);
    border:1px solid rgba(232,176,75,.42);background:rgba(232,176,75,.07)}
  .st-cross{font-size:12.5px;color:var(--text-dim);display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}
  .st-cross b{color:var(--text)}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioCTA.astro
git commit -m "feat(studio): StudioCTA — gated private-beta entry band

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: The /studio page

**Files:**
- Create: `src/pages/studio.astro`

- [ ] **Step 1: Create the page**

Create `src/pages/studio.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import StudioHero from '../components/StudioHero.astro';
import StudioGenres from '../components/StudioGenres.astro';
import StudioPipeline from '../components/StudioPipeline.astro';
import StudioReleaseKit from '../components/StudioReleaseKit.astro';
import StudioCTA from '../components/StudioCTA.astro';
import Footer from '../components/Footer.astro';
---
<Base
  title="HS Studios — pick a genre, walk away with a song"
  description="The in-house studio behind Harmattan Sessions. Pick a genre — Afrobeats, Amapiano, Dancehall, Alté, Highlife or Afro-lofi — and walk away with a full release kit: lyrics, style prompts, cover art and metadata."
>
  <Nav />
  <main id="main">
    <StudioHero />
    <StudioGenres />
    <StudioPipeline />
    <StudioReleaseKit />
    <StudioCTA />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 3: Build and confirm the route emits**

Run: `npm run build`
Expected: build succeeds and `dist/studio/index.html` exists.

Verify: `test -f dist/studio/index.html && echo OK` → prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/studio.astro
git commit -m "feat(studio): assemble /studio landing page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Homepage teaser band

**Files:**
- Create: `src/components/StudioTeaser.astro`
- Modify: `src/pages/index.astro:5-6` (import) and `:16-17` (placement)

- [ ] **Step 1: Create the teaser component**

Create `src/components/StudioTeaser.astro`:

```astro
---
import { getStudioGenres } from '../data/studioGenres';
const genres = getStudioGenres();
---
<section class="st-teaser-sec"><div class="wrap">
  <div class="st-band">
    <div class="st-band-copy">
      <span class="st-pill">◆ HS Studios — in-house&nbsp;·&nbsp;<b>Private beta</b></span>
      <h2>Pick a genre. <span class="it">Walk away with a song.</span></h2>
      <p>The studio behind the sessions. Choose a sound, and it crafts a full release kit —
        lyrics, style prompts, cover art and metadata.</p>
      <div class="st-chips">
        {genres.map((g) => (
          <span class="st-chip" style={g.path === 'Instrumental' ? 'color:var(--gold);border-color:rgba(232,176,75,.4)' : ''}>{g.name}</span>
        ))}
      </div>
      <div class="st-cta-row">
        <a class="btn btn-primary" href="/studio">Explore the Studio →</a>
        <a class="btn btn-ghost" href="/studio#how">See how it works</a>
      </div>
    </div>
    <div class="st-band-peek" aria-hidden="true">
      <div class="peek-bar"><i></i><i></i><i></i><span class="peek-url">studio.ohwpstudios.org</span></div>
      <div class="peek-body">
        <div class="peek-side"><span class="gp act">Afrobeats</span><span class="gp">Amapiano</span><span class="gp">Highlife</span></div>
        <div class="peek-main">
          <span class="label">Pass ② · Hook</span>
          <i class="ln" style="width:88%"></i><i class="ln" style="width:70%"></i>
          <i class="ln hot" style="width:80%"></i><i class="ln" style="width:55%"></i>
          <span class="meter on">● Live · 9,840 neurons</span>
        </div>
      </div>
    </div>
  </div>
</div></section>

<style>
  .st-teaser-sec{padding:30px 0 36px}
  .st-band{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:var(--r-xl);
    display:grid;grid-template-columns:1.05fr .95fr;gap:30px;padding:34px 36px;align-items:center;
    background:radial-gradient(90% 130% at 88% -20%,var(--glow-1),transparent 55%),
      radial-gradient(70% 100% at 5% 120%,var(--glow-2),transparent),
      linear-gradient(160deg,var(--surface),var(--bg-elev));
    box-shadow:0 24px 70px -34px rgba(0,0,0,.5)}
  @media(max-width:760px){.st-band{grid-template-columns:1fr;padding:26px 22px}}
  .st-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
    padding:6px 14px;border-radius:999px;color:var(--gold);
    border:1px solid rgba(232,176,75,.42);background:rgba(232,176,75,.07)}
  .st-pill b{color:var(--text-strong);font-weight:600}
  .st-band-copy h2{font-size:clamp(26px,3.4vw,33px);margin:12px 0}
  .st-band-copy h2 .it{font-style:italic;color:var(--gold);font-weight:400}
  .st-band-copy p{color:var(--text-dim);font-size:15px;max-width:440px;margin-bottom:18px}
  .st-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px}
  .st-chip{font-size:11px;color:var(--text);border:1px solid var(--line);background:rgba(14,11,8,.4);
    padding:5px 11px;border-radius:999px}
  .st-cta-row{display:flex;gap:12px;flex-wrap:wrap}
  /* peek (mirrors StudioHero peek, condensed) */
  .st-band-peek{border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden;
    box-shadow:0 18px 50px -24px rgba(0,0,0,.5);transform:rotate(.4deg)}
  .peek-bar{display:flex;align-items:center;gap:6px;padding:10px 12px;background:var(--bg-elev);border-bottom:1px solid var(--line)}
  .peek-bar i{width:9px;height:9px;border-radius:50%;background:#3a2f26}
  .peek-url{margin-left:10px;font-size:11px;color:var(--text-dim);background:var(--bg);padding:2px 10px;border-radius:999px;border:1px solid var(--line)}
  .peek-body{display:grid;grid-template-columns:96px 1fr;gap:14px;padding:18px;
    background:radial-gradient(90% 120% at 85% 0,var(--glow-2),var(--surface))}
  .peek-side{display:flex;flex-direction:column;gap:6px}
  .gp{font-size:10px;color:var(--text);padding:7px 9px;border-radius:8px;border:1px solid var(--line);background:var(--bg)}
  .gp.act{border-color:var(--gold);color:var(--gold);background:rgba(232,176,75,.08)}
  .peek-main{background:var(--bg);border:1px solid var(--line);border-radius:9px;padding:14px}
  .peek-main .ln{display:block;height:8px;border-radius:5px;background:var(--surface-2);margin:8px 0}
  .peek-main .ln.hot{background:rgba(232,176,75,.25)}
  .meter{display:inline-block;margin-top:10px;font-size:9px;font-weight:600;padding:4px 10px;border-radius:999px;border:1px solid rgba(232,176,75,.4);color:var(--gold)}
  @media(prefers-reduced-motion:reduce){.st-band-peek{transform:none}}
</style>
```

- [ ] **Step 2: Inject into the homepage**

In `src/pages/index.astro`, add the import after the `SoundsGrid` import (line 5):

```astro
import StudioTeaser from '../components/StudioTeaser.astro';
```

Then place it between `<SoundsGrid />` and `<MixesGrid />` (lines 16-17), so the `<main>` reads:

```astro
    <Hero />
    <SoundsGrid />
    <StudioTeaser />
    <MixesGrid />
    <FieldRecordings />
    <ListenPlatforms />
    <Newsletter />
```

- [ ] **Step 3: Type-check and build**

Run: `npm run check && npm run build`
Expected: 0 errors; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/StudioTeaser.astro src/pages/index.astro
git commit -m "feat(studio): homepage teaser band linking into /studio

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all tests pass, including `studioGenres.test.ts` and `siteConfig.test.ts`; no prior tests broke.

- [ ] **Step 2: Type-check the whole project**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: success; both `dist/studio/index.html` and `dist/index.html` exist.

- [ ] **Step 4: Visual + a11y smoke check (manual)**

Run: `npm run preview` and open the printed URL. Verify:
- `/` shows the teaser band between The Sounds and Mixes; both CTAs navigate to `/studio` (and `/studio#how`).
- `/studio` renders all five sections; the nav "Studio" tab is the active route; "Enter the Studio" points to `studio.ohwpstudios.org`.
- Toggle the theme — both pages read correctly in light and dark.
- Tab through both pages — focus rings show on every CTA; the studio peek is skipped by AT (`aria-hidden`).
- Narrow the window to ~375px — hero, band, genre grid and steps all collapse to single column with no overflow.
- With OS "reduce motion" on, hover lifts / peek tilt are disabled.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "test(studio): verify connection — suite, check, build green

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Appendix A: HS Studios cross-repo cutover (separate follow-up)

> This is in the **`C:\dev\Projects\HS Studios`** repo + the Cloudflare dashboard, not this Astro
> repo. It is partly manual ops, so it is a checklist rather than TDD tasks. The marketing site
> ships without it; do this to make the crossing live and seamless.

- [ ] **A1 — Custom domain.** In Cloudflare Pages → the HS Studios `apps/web` project → Custom
  domains, add `studio.ohwpstudios.org`. Confirm the CNAME is created in the `ohwpstudios.org`
  zone and the cert issues.
- [ ] **A2 — Access policy.** In Cloudflare Zero Trust → Access, ensure the existing single-user
  policy covers the new hostname `studio.ohwpstudios.org` so entry stays gated.
- [ ] **A3 — Brand continuity.** In `apps/web`, align the genre-picker / top-bar theme to the
  Harmattan tokens (warm dark, gold `#E8B04B` / terracotta `#C96E3F`, Fraunces + DM Sans) using the
  studio's existing CSS-variable theming, so the first paint after the jump matches the marketing site.
- [ ] **A4 — Back-link.** Add a small `← Harmattan Sessions` link in the studio header pointing to
  `https://hs.ohwpstudios.org`, making the crossing round-trip.
- [ ] **A5 — Verify the round-trip.** From `hs.ohwpstudios.org/studio`, click **Enter the Studio**,
  confirm the Access gate, land in a brand-matched studio, and return via the back-link.
- [ ] **A6 — (Optional) README links.** Update HS Studios README "live" links to the new subdomain.

---

## Self-Review

**Spec coverage:**
- §2 dedicated `/studio` page → Tasks 4-9. ✓
- §2 homepage teaser → Task 10. ✓
- §2 hybrid/private-beta framing → pill + gated copy in StudioHero/StudioCTA/StudioTeaser. ✓
- §2 same-domain crossing → siteConfig (Task 2) + Appendix A1/A2. ✓
- §2 hand-built peek (no screenshots) → StudioHero/StudioTeaser peeks. ✓
- §5.1 genre source of truth → Task 1 (data module, refinement noted). ✓
- §5.2-5.7 components → Tasks 4-7, 10. ✓
- §5.9 Nav + siteConfig + index edits → Tasks 3, 2, 10. ✓
- §6 cross-repo work → Appendix A. ✓
- §7 a11y/responsive gates → Task 11 Step 4. ✓

**Placeholder scan:** none — every component/page step contains full code; every command has an
expected result.

**Type/name consistency:** `studioGenres` / `getStudioGenres` / `StudioGenre` / `StudioPath` used
consistently across Task 1, 5, 10. `siteConfig.studioUrl` used in Tasks 4, 8 (string, defined Task
2). Peek class names (`.peek-bar/.peek-url/.peek-body/.peek-side/.gp/.peek-main/.ln/.hot/.meter`)
are scoped within each component that uses them. Section ids `#how` (Pipeline) matches the
teaser/hero links; `#genres`, `#kit` self-consistent. ✓
