# EPIC-01 Website Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `harmattansessions.com` — an Astro 5 SSR-hybrid site on Cloudflare Pages with the Harmattan Dusk/Daylight theme system, the Sun Vinyl logo, a full landing page driven by Keystatic file-based content, and a live D1-backed newsletter signup.

**Architecture:** Single Astro 5 project + `@astrojs/cloudflare`. Marketing pages prerender to static HTML; `/api/*` and `/keystatic` opt into on-demand rendering with D1 (`DB`) + KV (`RL`) bindings via `locals.runtime.env`. Catalog content lives in Keystatic file-based collections (`src/content`); D1 catalog tables are defined now but populated in EPIC-02. Deploy is local-first → push to GitHub `main` → Cloudflare Pages Git integration auto-deploys.

**Tech Stack:** Astro 5, TypeScript (strict), `@astrojs/cloudflare`, `@astrojs/sitemap`, Keystatic (`@keystatic/astro` + `@keystatic/core`), Cloudflare D1 + KV, Wrangler, Vitest + `@cloudflare/vitest-pool-workers`, Fraunces + DM Sans (Google Fonts).

**Source of truth for markup/CSS:** `docs/harmattansessions.html` (committed approved visual spec). **Design spec:** `docs/superpowers/specs/2026-05-28-epic-01-website-foundation-design.md`.

> **Doc-verification note:** Astro 5 `output`/adapter options, the dev-time D1/KV binding (`platformProxy`), the Keystatic-on-Astro reader + SSR route, and `@cloudflare/vitest-pool-workers` config evolve. Where a step says "verify against current docs," consult the `cloudflare`/`wrangler` skills (they bias to live-doc retrieval) before pasting config. The code below is the intended shape.

---

## File Structure

```
astro.config.mjs            — Astro + Cloudflare adapter + sitemap + keystatic
wrangler.jsonc              — Pages project name, compat date, D1 + KV bindings
package.json · tsconfig.json
keystatic.config.ts         — content collections (local mode)
migrations/0001_init.sql    — full PRD §8 schema (subscribers live; catalog defined)
public/  favicon.svg · logo.svg · og-image.svg · robots.txt · manifest.webmanifest
src/
  styles/    tokens.css · global.css
  lib/       theme-init.ts · validation.ts · ratelimit.ts · db.ts · email.ts
  components/ Logo.astro · ThemeToggle.astro · BaseHead.astro · Nav.astro · Hero.astro ·
              SoundsGrid.astro · SoundCard.astro · MixesGrid.astro · MixCard.astro ·
              FieldRecordings.astro · ListenPlatforms.astro · Newsletter.astro · Footer.astro
  layouts/   Base.astro
  pages/     index.astro · keystatic/[...params].astro · api/newsletter.ts · api/now-playing.ts
  content.config.ts · siteConfig.ts
  content/   sounds/*.json · field-recordings/*.json · mixes/.gitkeep
tests/       validation.test.ts · ratelimit.test.ts · newsletter.test.ts
```

---

## Phase A — Scaffold & Configuration

### Task 1: Initialize the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `wrangler.jsonc`, `.dev.vars.example`, `src/env.d.ts`

- [ ] **Step 1: Scaffold a minimal Astro app into the existing repo**

Run (from repo root; the folder already has git + docs, so scaffold in place):
```bash
npm create astro@latest -- --template minimal --no-install --no-git --typescript strict --yes .
```
Expected: creates `src/`, `astro.config.mjs`, `package.json`, `tsconfig.json` without touching `.git` or `docs/`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/cloudflare @astrojs/sitemap @keystatic/core @keystatic/astro
npm install -D wrangler @cloudflare/vitest-pool-workers vitest
```

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://harmattansessions.com',
  output: 'static',                 // marketing prerenders; dynamic routes opt out per-route
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [keystatic(), sitemap()],
});
```
> Verify against current Astro 5 + `@astrojs/cloudflare` docs whether `output: 'static'` + per-route `prerender=false` is the right combo for this adapter version, or whether `output: 'server'` with prerendered marketing is preferred. Adjust this one line accordingly.

- [ ] **Step 4: Write `wrangler.jsonc`**

```jsonc
{
  "name": "harmattan-sessions",
  "compatibility_date": "2026-05-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    { "binding": "DB", "database_name": "harmattan_sessions", "database_id": "PLACEHOLDER_SET_AFTER_d1_create" }
  ],
  "kv_namespaces": [
    { "binding": "RL", "id": "PLACEHOLDER_SET_AFTER_kv_create" }
  ]
}
```
> The two `PLACEHOLDER_*` ids are filled in Task 18 after `wrangler d1/kv create`. They are the only intentional placeholders in this plan and are resolved by an explicit later step.

- [ ] **Step 5: Add `src/env.d.ts` runtime typing**

```ts
/// <reference types="astro/client" />
type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
type D1Database = import('@cloudflare/workers-types').D1Database;
type Runtime = import('@astrojs/cloudflare').Runtime<{ DB: D1Database; RL: KVNamespace }>;
declare namespace App {
  interface Locals extends Runtime {}
}
```

- [ ] **Step 6: Add scripts to `package.json`**

Ensure `"scripts"` contains:
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 7: Create `.dev.vars.example`**

```
# copy to .dev.vars (gitignored). No secrets needed for EPIC-01 yet.
# EMAIL_PROVIDER_KEY=   # added in EPIC-05
```

- [ ] **Step 8: Verify the skeleton builds, then commit**

Run: `npm run build`
Expected: build succeeds (default minimal page).
```bash
git add -A && git commit -m "chore: scaffold Astro 5 + Cloudflare adapter, Keystatic, sitemap"
```

---

### Task 2: Design tokens & global CSS

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/tokens.css`** (verbatim)

```css
[data-theme="dark"]{
  --bg:#0E0B08; --bg-elev:#15100B; --surface:#1C1714; --surface-2:#221B16;
  --text:#E7DAC8; --text-strong:#F4E8D6; --text-dim:rgba(231,218,200,.62);
  --gold:#E8B04B; --terracotta:#C96E3F; --line:rgba(231,218,200,.12);
  --accent:#E8B04B; --on-accent:#231803; --nav-bg:rgba(14,11,8,.72);
  --glow-1:rgba(201,110,63,.20); --glow-2:rgba(232,176,75,.10); --grain:rgba(231,218,200,.6); --grain-op:.04;
}
[data-theme="light"]{
  --bg:#F4EADB; --bg-elev:#FBF3E7; --surface:#FFFDF9; --surface-2:#FBF3E7;
  --text:#2A2017; --text-strong:#1B130C; --text-dim:rgba(36,26,18,.6);
  --gold:#8F5E12; --terracotta:#A8502A; --line:rgba(36,26,18,.12);
  --accent:#E8B04B; --on-accent:#231803; --nav-bg:rgba(244,234,219,.78);
  --glow-1:rgba(201,110,63,.16); --glow-2:rgba(232,176,75,.16); --grain:rgba(36,26,18,.5); --grain-op:.04;
}
:root{
  --serif:'Fraunces',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
  --maxw:1120px;
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px; --r-pill:999px;
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-6:24px; --sp-8:32px; --sp-12:48px; --sp-16:64px;
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

Port the entire `<style>` block from the committed `docs/harmattansessions.html` into this file, with these adjustments: (a) drop the `[data-theme]` token blocks (now in `tokens.css`), (b) keep every component rule (`.wrap`, `.btn*`, `.logo`, `nav`, `.hero*`, `section.blk`, `.sec-head`, `.sounds`/`.sound`, `.mixrow`/`.mixcard`, `.field`/`.loc`, `.platforms`/`.plat`, `.dispatch`, `footer`/`.foot-*`, the `@keyframes eq`, and the `prefers-reduced-motion` block), (c) keep the base `*`, `body`, `h1..h3`, `a`, `.label` rules. The mockup is the canonical source — copy rules exactly so the built site matches the approved design pixel-for-pixel.

- [ ] **Step 3: Commit**

```bash
git add src/styles && git commit -m "feat: design tokens + global styles (Dusk/Daylight)"
```

---

### Task 3: Theme system (no-flash init + helper)

**Files:**
- Create: `src/lib/theme-init.ts`, `tests/theme.test.ts`
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Write the failing test for theme resolution**

`tests/theme.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resolveTheme } from '../src/lib/theme-init';

describe('resolveTheme', () => {
  it('uses stored value when present', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
  it('falls back to system light when no stored value', () => {
    expect(resolveTheme(null, true)).toBe('light');
  });
  it('defaults to dark when no stored value and system not light', () => {
    expect(resolveTheme(null, false)).toBe('dark');
  });
  it('ignores invalid stored values', () => {
    expect(resolveTheme('purple', false)).toBe('dark');
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run tests/theme.test.ts`
Expected: FAIL — `resolveTheme` not exported.

- [ ] **Step 3: Implement `src/lib/theme-init.ts`**

```ts
export type Theme = 'dark' | 'light';

export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored;
  return prefersLight ? 'light' : 'dark';
}

// Stringified IIFE injected inline in <head> before paint to avoid FOUC.
export const themeInitScript = `(function(){try{var s=localStorage.getItem('hs-theme');
var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npx vitest run tests/theme.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Create `src/components/ThemeToggle.astro`**

```astro
---
// Renders the sun/moon toggle button. Behaviour wired client-side.
---
<button class="tgl" id="hs-theme-toggle" type="button" aria-label="Toggle light or dark mode" aria-pressed="false"></button>
<script>
  const root = document.documentElement;
  const btn = document.getElementById('hs-theme-toggle')!;
  const sun = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4 12H1M23 12h-3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke-linecap="round"/></svg>';
  const moon = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke-linejoin="round"/></svg>';
  function paint() {
    const dark = root.getAttribute('data-theme') === 'dark';
    btn.innerHTML = dark ? moon : sun;          // dark shows moon (tap → light)
    btn.setAttribute('aria-pressed', String(!dark));
  }
  btn.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('hs-theme', next); } catch (e) {}
    paint();
  });
  paint();
</script>
```

Add the `.tgl` rule to `global.css` if not already ported from the mockup:
```css
.tgl{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:transparent;cursor:pointer;display:grid;place-items:center;color:var(--gold);transition:border-color .2s;padding:0}
.tgl:hover{border-color:var(--gold)}
.tgl svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme-init.ts tests/theme.test.ts src/components/ThemeToggle.astro src/styles/global.css
git commit -m "feat: theme system — no-flash init, resolveTheme (tested), toggle"
```

---

## Phase B — Brand & Layout

### Task 4: Sun Vinyl logo + favicon/OG assets

**Files:**
- Create: `src/components/Logo.astro`, `public/favicon.svg`, `public/logo.svg`, `public/og-image.svg`, `public/manifest.webmanifest`, `public/robots.txt`

- [ ] **Step 1: Create `src/components/Logo.astro`** (theme-aware inline symbol + wordmark)

```astro
---
interface Props { size?: number; wordmark?: boolean; stacked?: boolean; }
const { size = 30, wordmark = true, stacked = false } = Astro.props;
---
<a class={`logo${stacked ? ' logo--stacked' : ''}`} href="/" aria-label="Harmattan Sessions home">
  <svg class="mk" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <defs><radialGradient id="hsvg" cx="36%" cy="27%" r="82%">
      <stop offset="0" stop-color="var(--accent)"></stop><stop offset="1" stop-color="var(--terracotta)"></stop>
    </radialGradient></defs>
    <circle cx="32" cy="32" r="22" fill="url(#hsvg)"></circle>
    <ellipse cx="24" cy="22" rx="13" ry="8.5" fill="#fff" opacity="0.13"></ellipse>
    <circle cx="32" cy="32" r="16.5" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"></circle>
    <circle cx="32" cy="32" r="12" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"></circle>
    <circle cx="32" cy="32" r="6" fill="#2A1604"></circle>
    <circle cx="32" cy="32" r="1.7" fill="var(--bg)"></circle>
  </svg>
  {wordmark && <span class="brand">Harmattan<span class="dot">·</span>Sessions</span>}
</a>
```
> Note: each rendered instance redefines gradient id `hsvg`; if two logos appear on one page (nav + footer) give the footer instance a distinct id via a prop, OR define the symbol once in `Base.astro` and `<use href="#vinyl">`. Implement the single-symbol approach: see Step 2.

- [ ] **Step 2: Switch to a single shared symbol** — replace the inline `<svg>` in `Logo.astro` with a `<use>` and define the symbol once in `Base.astro` (Task 5). `Logo.astro` becomes:

```astro
---
interface Props { size?: number; wordmark?: boolean; stacked?: boolean; }
const { size = 30, wordmark = true, stacked = false } = Astro.props;
---
<a class={`logo${stacked ? ' logo--stacked' : ''}`} href="/" aria-label="Harmattan Sessions home">
  <svg class="mk" width={size} height={size} aria-hidden="true"><use href="#vinyl"></use></svg>
  {wordmark && <span class="brand">Harmattan<span class="dot">·</span>Sessions</span>}
</a>
```

- [ ] **Step 3: Create `public/favicon.svg`** (simplified, static fills so it renders standalone)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="f" cx="36%" cy="27%" r="82%"><stop offset="0" stop-color="#E8B04B"/><stop offset="1" stop-color="#C96E3F"/></radialGradient></defs>
  <circle cx="32" cy="32" r="23" fill="url(#f)"/>
  <circle cx="32" cy="32" r="7" fill="#2A1604"/><circle cx="32" cy="32" r="2" fill="#0E0B08"/>
</svg>
```

- [ ] **Step 4: Create `public/logo.svg`** (full mark, static fills, for OG/social)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="l" cx="36%" cy="27%" r="82%"><stop offset="0" stop-color="#E8B04B"/><stop offset="1" stop-color="#C96E3F"/></radialGradient></defs>
  <circle cx="32" cy="32" r="22" fill="url(#l)"/>
  <ellipse cx="24" cy="22" rx="13" ry="8.5" fill="#fff" opacity="0.13"/>
  <circle cx="32" cy="32" r="16.5" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"/>
  <circle cx="32" cy="32" r="12" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"/>
  <circle cx="32" cy="32" r="6" fill="#2A1604"/><circle cx="32" cy="32" r="1.7" fill="#0E0B08"/>
</svg>
```

- [ ] **Step 5: Create `public/og-image.svg`** (1200×630 social card, Dusk)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0E0B08"/>
  <circle cx="980" cy="150" r="220" fill="#C96E3F" opacity="0.18"/>
  <g transform="translate(110,250)">
    <g transform="scale(2.2)">
      <circle cx="32" cy="32" r="22" fill="#E8B04B"/>
      <circle cx="32" cy="32" r="6" fill="#2A1604"/><circle cx="32" cy="32" r="1.7" fill="#0E0B08"/>
    </g>
  </g>
  <text x="110" y="430" font-family="Georgia,serif" font-size="64" fill="#F4E8D6">Harmattan Sessions</text>
  <text x="112" y="490" font-family="Arial,sans-serif" font-size="28" fill="#E7DAC8" opacity="0.7">The sound of African evenings — from Accra.</text>
</svg>
```
> If a PNG is required by a platform, convert with `npx sharp-cli` or generate via the `design` skill during a later polish pass; SVG OG is acceptable for launch.

- [ ] **Step 6: Create `public/manifest.webmanifest` and `public/robots.txt`**

`manifest.webmanifest`:
```json
{ "name": "Harmattan Sessions", "short_name": "Harmattan", "theme_color": "#0E0B08",
  "background_color": "#0E0B08", "display": "standalone",
  "icons": [{ "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }] }
```
`robots.txt`:
```
User-agent: *
Allow: /
Disallow: /keystatic
Sitemap: https://harmattansessions.com/sitemap-index.xml
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Logo.astro public/
git commit -m "feat: Sun Vinyl logo component + favicon/og/manifest assets"
```

---

### Task 5: BaseHead + Base layout (with shared vinyl symbol)

**Files:**
- Create: `src/components/BaseHead.astro`, `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/components/BaseHead.astro`**

```astro
---
import { themeInitScript } from '../lib/theme-init';
interface Props { title: string; description: string; image?: string; }
const { title, description, image = '/og-image.svg' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site).href} />
<meta property="og:url" content={canonical} />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
<script is:inline set:html={themeInitScript}></script>
<script type="application/ld+json" set:html={JSON.stringify({
  "@context":"https://schema.org","@type":"MusicGroup","name":"Harmattan Sessions",
  "genre":["Afrobeat","Lo-fi","Ambient","Highlife"],"foundingLocation":"Accra, Ghana",
  "url":"https://harmattansessions.com"
})}></script>
```

- [ ] **Step 2: Create `src/layouts/Base.astro`** (imports global styles, defines the shared `#vinyl` symbol once)

```astro
---
import BaseHead from '../components/BaseHead.astro';
import '../styles/tokens.css';
import '../styles/global.css';
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en" data-theme="dark">
  <head><BaseHead title={title} description={description} /></head>
  <body>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="vinyl" viewBox="0 0 64 64">
        <defs><radialGradient id="vg" cx="36%" cy="27%" r="82%">
          <stop offset="0" stop-color="var(--accent)"></stop><stop offset="1" stop-color="var(--terracotta)"></stop>
        </radialGradient></defs>
        <circle cx="32" cy="32" r="22" fill="url(#vg)"></circle>
        <ellipse cx="24" cy="22" rx="13" ry="8.5" fill="#fff" opacity="0.13"></ellipse>
        <circle cx="32" cy="32" r="16.5" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"></circle>
        <circle cx="32" cy="32" r="12" fill="none" stroke="#2a1604" stroke-opacity="0.22" stroke-width="1.3"></circle>
        <circle cx="32" cy="32" r="6" fill="#2A1604"></circle>
        <circle cx="32" cy="32" r="1.7" fill="var(--bg)"></circle>
      </symbol>
    </svg>
    <a href="#main" class="skip-link">Skip to content</a>
    <slot />
  </body>
</html>
```

Add to `global.css`:
```css
.skip-link{position:absolute;left:-9999px;top:0;background:var(--accent);color:var(--on-accent);padding:10px 16px;border-radius:0 0 var(--r-sm) 0;z-index:100}
.skip-link:focus{left:0}
.logo--stacked{flex-direction:column;text-align:center;gap:10px}
:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
```

- [ ] **Step 3: Verify build, commit**

Run: `npm run build`  → Expected: PASS.
```bash
git add src/components/BaseHead.astro src/layouts/Base.astro src/styles/global.css
git commit -m "feat: BaseHead (meta/OG/JSON-LD) + Base layout with shared vinyl symbol"
```

---

## Phase C — Content Layer

### Task 6: Astro content collections + site config

**Files:**
- Create: `src/content.config.ts`, `src/siteConfig.ts`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sounds = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sounds' }),
  schema: z.object({
    name: z.string(), bpmRange: z.string(), mood: z.string(),
    order: z.number(), chipFrom: z.string(), chipTo: z.string(), blurb: z.string().optional(),
  }),
});

const mixes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc,json}', base: './src/content/mixes' }),
  schema: ({ image }) => z.object({
    title: z.string(), primaryGenre: z.string(), durationSeconds: z.number().optional(),
    youtubeVideoId: z.string().optional(), spotifyPlaylistId: z.string().optional(),
    bandcampUrl: z.string().optional(), thumbnail: image().optional(),
    releasedAt: z.coerce.date(), isPublished: z.boolean().default(false),
  }),
});

const fieldRecordings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/field-recordings' }),
  schema: z.object({ location: z.string(), description: z.string(), order: z.number() }),
});

export const collections = { sounds, mixes, 'field-recordings': fieldRecordings };
```
> Verify the Astro 5 Content Layer `glob` loader API against current docs; adjust import path if changed.

- [ ] **Step 2: Create `src/siteConfig.ts`**

```ts
export const siteConfig = {
  tagline: 'The sound of African evenings',
  email: 'hello@harmattansessions.com',
  platforms: [
    { name: 'YouTube', url: '#' }, { name: 'Spotify', url: '#' },
    { name: 'Apple Music', url: '#' }, { name: 'Tidal', url: '#' }, { name: 'Bandcamp', url: '#' },
  ],
  social: [
    { name: 'Instagram', url: '#' }, { name: 'TikTok', url: '#' },
  ],
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts src/siteConfig.ts
git commit -m "feat: content collections (sounds/mixes/field-recordings) + site config"
```

---

### Task 7: Seed content — the 8 sounds + field recordings

**Files:**
- Create: `src/content/sounds/{1..8}.json`, `src/content/field-recordings/{1..5}.json`, `src/content/mixes/.gitkeep`

- [ ] **Step 1: Create the 8 sound files** (`src/content/sounds/`)

`afro-lofi.json`:
```json
{ "name": "Afro-Lofi", "bpmRange": "70–80", "mood": "Study, chill", "order": 1, "chipFrom": "#E8B04B", "chipTo": "#C96E3F" }
```
`highlife-chill.json`:
```json
{ "name": "Highlife Chill", "bpmRange": "78–85", "mood": "Nostalgic, golden", "order": 2, "chipFrom": "#C96E3F", "chipTo": "#7a3b25" }
```
`amapiano-lounge.json`:
```json
{ "name": "Amapiano Lounge", "bpmRange": "100–108", "mood": "Sophisticated", "order": 3, "chipFrom": "#C9952B", "chipTo": "#6B7A4F" }
```
`afro-soul-sunset.json`:
```json
{ "name": "Afro-Soul Sunset", "bpmRange": "65–72", "mood": "Romantic, late-night", "order": 4, "chipFrom": "#d4733f", "chipTo": "#9c2f4a" }
```
`afro-jazz-lounge.json`:
```json
{ "name": "Afro-Jazz Lounge", "bpmRange": "82–88", "mood": "Dinner, smoky", "order": 5, "chipFrom": "#b9863a", "chipTo": "#4a3320" }
```
`coastal-afro-house.json`:
```json
{ "name": "Coastal Afro-House", "bpmRange": "100–105", "mood": "Meditative", "order": 6, "chipFrom": "#3f7d6b", "chipTo": "#1d4a3f" }
```
`ancestral-ambient.json`:
```json
{ "name": "Ancestral Ambient", "bpmRange": "55–62", "mood": "Sacred, ceremonial", "order": 7, "chipFrom": "#8a6fae", "chipTo": "#3a2f56" }
```
`afrobeats-rain.json`:
```json
{ "name": "Afrobeats Rain", "bpmRange": "55–60", "mood": "Sleep", "order": 8, "chipFrom": "#5a6b86", "chipTo": "#23303f" }
```

- [ ] **Step 2: Create 5 field-recording files** (`src/content/field-recordings/`)

```json
{ "location": "Labadi Beach", "description": "dusk surf", "order": 1 }
```
…and `2`–`5` for: `{ "location": "Makola Market", "description": "dawn hum", "order": 2 }`, `{ "location": "Aburi Hills", "description": "harmattan wind", "order": 3 }`, `{ "location": "Jamestown", "description": "evening street", "order": 4 }`, `{ "location": "Volta", "description": "rain on the river", "order": 5 }`.

- [ ] **Step 3: Keep the empty mixes dir tracked**

```bash
mkdir -p src/content/mixes && type nul > src/content/mixes/.gitkeep 2>nul || touch src/content/mixes/.gitkeep
```

- [ ] **Step 4: Commit**

```bash
git add src/content && git commit -m "feat: seed 8 sounds + 5 field recordings"
```

---

### Task 8: Keystatic config + admin route

**Files:**
- Create: `keystatic.config.ts`, `src/pages/keystatic/[...params].astro`

- [ ] **Step 1: Create `keystatic.config.ts`**

```ts
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' }, // → { kind:'github', repo:'ghwmelite-dotcom/harmattan-sessions' } for hosted editing
  collections: {
    sounds: collection({
      label: 'Sounds', slugField: 'name', path: 'src/content/sounds/*', format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        bpmRange: fields.text({ label: 'BPM range', defaultValue: '70–80' }),
        mood: fields.text({ label: 'Mood' }),
        order: fields.integer({ label: 'Order' }),
        chipFrom: fields.text({ label: 'Chip gradient from (hex)' }),
        chipTo: fields.text({ label: 'Chip gradient to (hex)' }),
        blurb: fields.text({ label: 'Blurb', multiline: true }),
      },
    }),
    mixes: collection({
      label: 'Mixes', slugField: 'title', path: 'src/content/mixes/*', format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        primaryGenre: fields.select({ label: 'Primary sound', defaultValue: 'afro_lofi', options: [
          { label: 'Afro-Lofi', value: 'afro_lofi' }, { label: 'Highlife Chill', value: 'highlife_chill' },
          { label: 'Amapiano Lounge', value: 'amapiano_lounge' }, { label: 'Afro-Soul Sunset', value: 'afro_soul_sunset' },
          { label: 'Afro-Jazz Lounge', value: 'afro_jazz_lounge' }, { label: 'Coastal Afro-House', value: 'coastal_house' },
          { label: 'Ancestral Ambient', value: 'ancestral_ambient' }, { label: 'Afrobeats Rain', value: 'afrobeats_rain' } ] }),
        durationSeconds: fields.integer({ label: 'Duration (seconds)' }),
        youtubeVideoId: fields.text({ label: 'YouTube video ID' }),
        thumbnail: fields.image({ label: 'Thumbnail', directory: 'public/mixes', publicPath: '/mixes/' }),
        releasedAt: fields.date({ label: 'Released at' }),
        isPublished: fields.checkbox({ label: 'Published' }),
        description: fields.markdoc({ label: 'Description' }),
      },
    }),
    'field-recordings': collection({
      label: 'Field recordings', slugField: 'location', path: 'src/content/field-recordings/*', format: { data: 'json' },
      schema: {
        location: fields.slug({ name: { label: 'Location' } }),
        description: fields.text({ label: 'Description' }),
        order: fields.integer({ label: 'Order' }),
      },
    }),
  },
});
```
> Schema field names must match `content.config.ts`. Verify the Keystatic field API against current docs.

- [ ] **Step 2: Create the admin route `src/pages/keystatic/[...params].astro`**

```astro
---
export const prerender = false;
import { makePage } from '@keystatic/astro/ui';
import keystaticConfig from '../../../keystatic.config';
const Page = makePage(keystaticConfig);
---
<Page />
```
> The Keystatic Astro UI mount API may differ by version; verify the exact `@keystatic/astro` usage (UI route + optional API route) against current docs and adjust.

- [ ] **Step 3: Verify Keystatic loads in dev**

Run: `npm run dev`, open `http://localhost:4321/keystatic`
Expected: Keystatic admin renders the three collections. (If the adapter/SSR combo errors, fall back to local-only Keystatic per spec §17 and note it.)

- [ ] **Step 4: Commit**

```bash
git add keystatic.config.ts src/pages/keystatic
git commit -m "feat: Keystatic CMS (local mode) for sounds/mixes/field-recordings"
```

---

## Phase D — Landing Components

> All component CSS already lives in `global.css` (Task 2). These components are markup that consumes those classes + collection data.

### Task 9: Nav

**Files:** Create `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import Logo from './Logo.astro';
import ThemeToggle from './ThemeToggle.astro';
---
<nav><div class="wrap nav-in">
  <Logo size={30} />
  <div class="nav-links">
    <a href="#sounds">The Sounds</a><a href="#mixes">Mixes</a>
    <a href="#field">Field Recordings</a><a href="#listen">Listen</a>
  </div>
  <div class="nav-right">
    <ThemeToggle />
    <a class="btn btn-primary" href="#dispatch">Subscribe</a>
  </div>
</div></nav>
```

- [ ] **Step 2: Commit** — `git add src/components/Nav.astro && git commit -m "feat: Nav"`

---

### Task 10: Hero

**Files:** Create `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
// now-playing falls back to a static value; live value wired in Task 22 (optional).
const nowPlaying = 'Labadi Sunset · Afro-Lofi';
---
<header class="hero"><div class="wrap hero-in">
  <span class="label">The sound of African evenings</span>
  <h1>Afrobeat chill, highlife lofi &amp; <span class="it">ancestral ambient</span> — from Accra.</h1>
  <p class="sub">Curated long-form mixes layered with real field recordings of Ghana — the harmattan wind, Labadi shorelines, Makola at dawn. Made to study, unwind, and drift to.</p>
  <form class="capture hs-subscribe" data-source="homepage_hero">
    <input type="email" name="email" placeholder="your@email.com" aria-label="Email address" required />
    <button class="btn btn-primary" type="submit">Join the Dispatch</button>
  </form>
  <div class="nowplay"><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span> Now playing —&nbsp;<strong>{nowPlaying}</strong></div>
</div></header>
```
> The `.hs-subscribe` form is progressively enhanced by the script in Task 21 Step 6.

- [ ] **Step 2: Commit** — `git add src/components/Hero.astro && git commit -m "feat: Hero with email capture"`

---

### Task 11: SoundsGrid + SoundCard

**Files:** Create `src/components/SoundsGrid.astro`, `src/components/SoundCard.astro`

- [ ] **Step 1: Create `src/components/SoundCard.astro`**

```astro
---
interface Props { name: string; bpmRange: string; mood: string; chipFrom: string; chipTo: string; }
const { name, bpmRange, mood, chipFrom, chipTo } = Astro.props;
---
<div class="sound">
  <div class="chip" style={`background:linear-gradient(135deg, ${chipFrom}, ${chipTo})`}></div>
  <h3>{name}</h3>
  <div class="meta">{bpmRange} BPM</div>
  <div class="mood">{mood}</div>
</div>
```

- [ ] **Step 2: Create `src/components/SoundsGrid.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SoundCard from './SoundCard.astro';
const sounds = (await getCollection('sounds')).sort((a, b) => a.data.order - b.data.order);
---
<section class="blk" id="sounds"><div class="wrap">
  <div class="sec-head">
    <div><span class="label">The catalogue</span><h2>Eight sounds, one evening.</h2></div>
    <p>Every track carries at least one genuine West African element as its backbone — never decoration.</p>
  </div>
  <div class="sounds">
    {sounds.map((s) => <SoundCard name={s.data.name} bpmRange={s.data.bpmRange} mood={s.data.mood} chipFrom={s.data.chipFrom} chipTo={s.data.chipTo} />)}
  </div>
</div></section>
```

- [ ] **Step 3: Commit** — `git add src/components/SoundsGrid.astro src/components/SoundCard.astro && git commit -m "feat: Sounds grid (data-driven)"`

---

### Task 12: MixesGrid + MixCard (with empty state)

**Files:** Create `src/components/MixesGrid.astro`, `src/components/MixCard.astro`

- [ ] **Step 1: Create `src/components/MixCard.astro`**

```astro
---
interface Props { title: string; youtubeVideoId?: string; }
const { title, youtubeVideoId } = Astro.props;
const href = youtubeVideoId ? `https://youtube.com/watch?v=${youtubeVideoId}` : '#';
---
<a class="mixcard mixcard--real" href={href}>
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="var(--gold)" stroke="none"/></svg>
  <span>{title}</span>
</a>
```

- [ ] **Step 2: Create `src/components/MixesGrid.astro`** (renders mixes if present, else the approved empty state)

```astro
---
import { getCollection } from 'astro:content';
import MixCard from './MixCard.astro';
const mixes = (await getCollection('mixes'))
  .filter((m) => m.data.isPublished)
  .sort((a, b) => +b.data.releasedAt - +a.data.releasedAt);
const hasMixes = mixes.length > 0;
---
<section class="blk" id="mixes"><div class="wrap">
  <div class="sec-head"><div><span class="label">Latest sessions</span><h2>Fresh mixes.</h2></div>
    {hasMixes && <a class="btn btn-ghost" href="#">All sessions →</a>}
  </div>
  <div class="mixrow">
    {hasMixes
      ? mixes.slice(0, 3).map((m) => <MixCard title={m.data.title} youtubeVideoId={m.data.youtubeVideoId} />)
      : [1,2,3].map((n) => (
          <div class="mixcard">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="var(--gold)" stroke="none"/></svg>
            <span>{`Session 00${n}`}</span>
          </div>))}
  </div>
  {!hasMixes && <p class="empty-note">The first <b>Harmattan Sessions</b> mixes drop soon. <a href="#dispatch">Subscribe</a> to hear them first.</p>}
</div></section>
```

- [ ] **Step 3: Commit** — `git add src/components/MixesGrid.astro src/components/MixCard.astro && git commit -m "feat: Mixes grid with empty state"`

---

### Task 13: Static sections — FieldRecordings, ListenPlatforms, Footer

**Files:** Create `src/components/FieldRecordings.astro`, `src/components/ListenPlatforms.astro`, `src/components/Footer.astro`

- [ ] **Step 1: `src/components/FieldRecordings.astro`**

```astro
---
import { getCollection } from 'astro:content';
const recs = (await getCollection('field-recordings')).sort((a, b) => a.data.order - b.data.order);
---
<section class="blk" id="field"><div class="wrap">
  <div class="sec-head"><div><span class="label">The moat</span><h2>Recorded on location, in Ghana.</h2></div>
    <p>The layer no remote channel can fake. Captured at 44.1kHz and woven under every mix.</p></div>
  <div class="field">
    {recs.map((r) => <span class="loc"><span class="dot"></span>{r.data.location} — {r.data.description}</span>)}
  </div>
</div></section>
```

- [ ] **Step 2: `src/components/ListenPlatforms.astro`**

```astro
---
import { siteConfig } from '../siteConfig';
---
<section class="blk" id="listen"><div class="wrap">
  <div class="sec-head"><div><span class="label">Everywhere you listen</span><h2>Find the sessions.</h2></div></div>
  <div class="platforms">
    {siteConfig.platforms.map((p) => <a class="plat" href={p.url}>{p.name}</a>)}
  </div>
</div></section>
```

- [ ] **Step 3: `src/components/Footer.astro`**

```astro
---
import Logo from './Logo.astro';
import { siteConfig } from '../siteConfig';
---
<footer><div class="wrap">
  <div class="foot-grid">
    <div class="foot-col">
      <Logo size={30} />
      <p style="font-size:13.5px;margin-top:12px">The sound of African evenings. Built in Accra, Ghana.</p>
    </div>
    <div class="foot-col"><h4>Listen</h4>{siteConfig.platforms.map((p) => <a href={p.url}>{p.name}</a>)}</div>
    <div class="foot-col"><h4>Explore</h4><a href="#sounds">The Sounds</a><a href="#mixes">Mixes</a><a href="#field">Field Recordings</a></div>
    <div class="foot-col"><h4>Connect</h4>{siteConfig.social.map((s) => <a href={s.url}>{s.name}</a>)}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
  </div>
  <p class="disclosure">Music is AI-assisted and human-curated: every release is mixed, mastered, and layered with original field recordings captured in Ghana. © 2026 Harmattan Sessions — Hodges &amp; Co. Ltd.</p>
</div></footer>
```

- [ ] **Step 4: Commit** — `git add src/components/FieldRecordings.astro src/components/ListenPlatforms.astro src/components/Footer.astro && git commit -m "feat: field recordings, listen platforms, footer"`

---

### Task 14: Newsletter band

**Files:** Create `src/components/Newsletter.astro`

- [ ] **Step 1: Create `src/components/Newsletter.astro`**

```astro
---
---
<section class="blk"><div class="wrap">
  <div class="dispatch" id="dispatch">
    <span class="label">The Harmattan Dispatch</span><h2>One email, every Friday.</h2>
    <p>The week's new mix, a featured field recording, and one thing worth your evening. No noise.</p>
    <form class="capture hs-subscribe" data-source="dispatch_band">
      <input type="email" name="email" placeholder="your@email.com" aria-label="Email address" required />
      <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" />
      <button class="btn btn-primary" type="submit">Subscribe</button>
    </form>
    <p class="hs-form-msg" role="status" aria-live="polite" style="margin-top:14px;min-height:1em"></p>
  </div>
</div></section>
```
> The `website` field is the spam honeypot consumed by the API (Task 21).

- [ ] **Step 2: Commit** — `git add src/components/Newsletter.astro && git commit -m "feat: newsletter band with honeypot"`

---

### Task 15: Assemble the landing page

**Files:** Create `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import SoundsGrid from '../components/SoundsGrid.astro';
import MixesGrid from '../components/MixesGrid.astro';
import FieldRecordings from '../components/FieldRecordings.astro';
import ListenPlatforms from '../components/ListenPlatforms.astro';
import Newsletter from '../components/Newsletter.astro';
import Footer from '../components/Footer.astro';
---
<Base title="Harmattan Sessions — the sound of African evenings" description="Afrobeat chill, highlife lofi & ancestral ambient from Accra, Ghana. Long-form mixes layered with real field recordings.">
  <Nav />
  <main id="main">
    <Hero />
    <SoundsGrid />
    <MixesGrid />
    <FieldRecordings />
    <ListenPlatforms />
    <Newsletter />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Visual verification against the spec**

Run: `npm run dev` → open `http://localhost:4321`. Compare side-by-side with `docs/harmattansessions.html`. Confirm: nav (logo + toggle), hero, 8 sounds, mixes empty-state, field chips, platforms, dispatch, footer. Toggle light/dark; reload to confirm no flash; toggle reduced-motion in OS and confirm the eq freezes.

- [ ] **Step 3: Build gate**

Run: `npm run check && npm run build`  → Expected: PASS (0 type errors, build output in `dist`).

- [ ] **Step 4: Commit** — `git add src/pages/index.astro && git commit -m "feat: assemble landing page"`

---

## Phase E — Data Layer & API

### Task 16: D1 migration

**Files:** Create `migrations/0001_init.sql`

- [ ] **Step 1: Create `migrations/0001_init.sql`** — the full PRD §8 schema (only `subscribers` is used now)

```sql
CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  signup_date DATE DEFAULT CURRENT_DATE,
  source TEXT,
  status TEXT DEFAULT 'pending',
  confirm_token TEXT,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
-- Catalog tables defined now, populated in EPIC-02:
CREATE TABLE tracks (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, genre TEXT NOT NULL,
  bpm INTEGER, key TEXT, duration_seconds INTEGER, suno_id TEXT, suno_prompt TEXT,
  audio_master_url TEXT, audio_preview_url TEXT, cover_image_url TEXT, isrc TEXT, upc TEXT,
  released_at DATE, is_published BOOLEAN DEFAULT 0, is_licensable BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE mixes (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT,
  primary_genre TEXT, duration_seconds INTEGER, youtube_video_id TEXT, spotify_playlist_id TEXT,
  bandcamp_album_url TEXT, thumbnail_url TEXT, visual_loop_url TEXT, released_at DATE,
  is_published BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE mix_tracks (
  mix_id TEXT NOT NULL, track_id TEXT NOT NULL, position INTEGER NOT NULL, start_seconds INTEGER NOT NULL,
  PRIMARY KEY (mix_id, track_id)
);
CREATE TABLE field_recordings (
  id TEXT PRIMARY KEY, location TEXT NOT NULL, description TEXT, captured_at TIMESTAMP,
  duration_seconds INTEGER, audio_url TEXT, gps_lat REAL, gps_lng REAL
);
CREATE TABLE mix_field_recordings (
  mix_id TEXT NOT NULL, recording_id TEXT NOT NULL, volume_db REAL DEFAULT -25,
  PRIMARY KEY (mix_id, recording_id)
);
CREATE TABLE distributions (
  id TEXT PRIMARY KEY, track_id TEXT NOT NULL, platform TEXT NOT NULL, external_id TEXT, url TEXT, live_since DATE
);
CREATE TABLE royalties (
  id TEXT PRIMARY KEY, track_id TEXT, platform TEXT NOT NULL, period_start DATE NOT NULL,
  period_end DATE NOT NULL, streams INTEGER, earnings_usd REAL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE licenses (
  id TEXT PRIMARY KEY, track_id TEXT NOT NULL, buyer_email TEXT NOT NULL, buyer_name TEXT,
  tier TEXT NOT NULL, price_usd REAL NOT NULL, stripe_payment_id TEXT, pdf_url TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE analytics_daily (
  date DATE NOT NULL, platform TEXT NOT NULL, metric TEXT NOT NULL, value REAL NOT NULL,
  PRIMARY KEY (date, platform, metric)
);
CREATE TABLE submissions (
  id TEXT PRIMARY KEY, track_id TEXT, mix_id TEXT, target_type TEXT NOT NULL, target_name TEXT NOT NULL,
  contact TEXT, submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, response_at TIMESTAMP,
  status TEXT DEFAULT 'pending', notes TEXT
);
```

- [ ] **Step 2: Commit** — `git add migrations && git commit -m "feat: D1 migration 0001 (subscribers live; catalog defined)"`

---

### Task 17: Email validation (TDD)

**Files:** Create `src/lib/validation.ts`, `tests/validation.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/validation.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { isValidEmail, normalizeEmail } from '../src/lib/validation';

describe('isValidEmail', () => {
  it('accepts a normal address', () => { expect(isValidEmail('a@b.com')).toBe(true); });
  it('rejects missing @', () => { expect(isValidEmail('ab.com')).toBe(false); });
  it('rejects empty / spaces', () => { expect(isValidEmail('')).toBe(false); expect(isValidEmail('a b@c.com')).toBe(false); });
  it('rejects over-long input', () => { expect(isValidEmail('x'.repeat(255) + '@b.com')).toBe(false); });
});
describe('normalizeEmail', () => {
  it('lowercases and trims', () => { expect(normalizeEmail('  A@B.COM ')).toBe('a@b.com'); });
});
```

- [ ] **Step 2: Run, verify fail** — `npx vitest run tests/validation.test.ts` → FAIL (not exported).

- [ ] **Step 3: Implement `src/lib/validation.ts`**

```ts
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function normalizeEmail(input: string): string { return input.trim().toLowerCase(); }
export function isValidEmail(input: string): boolean {
  const e = normalizeEmail(input);
  return e.length > 0 && e.length <= 254 && EMAIL_RE.test(e);
}
```

- [ ] **Step 4: Run, verify pass** — `npx vitest run tests/validation.test.ts` → PASS.

- [ ] **Step 5: Commit** — `git add src/lib/validation.ts tests/validation.test.ts && git commit -m "feat: email validation (tested)"`

---

### Task 18: Provision D1 + KV, wire ratelimit + db helpers (TDD)

**Files:** Create `src/lib/ratelimit.ts`, `src/lib/db.ts`, `tests/ratelimit.test.ts`. Modify `wrangler.jsonc`.

- [ ] **Step 1: Provision Cloudflare resources (owner runs `wrangler login` once first)**

```bash
npx wrangler d1 create harmattan_sessions
npx wrangler kv namespace create RL
```
Copy the printed `database_id` and KV `id` into `wrangler.jsonc`, replacing the two `PLACEHOLDER_*` values from Task 1.

- [ ] **Step 2: Apply the migration locally**

```bash
npx wrangler d1 migrations apply harmattan_sessions --local
```
Expected: `0001_init.sql` applied.

- [ ] **Step 3: Write the failing rate-limit test** — `tests/ratelimit.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/ratelimit';

function fakeKV() {
  const store = new Map<string, string>();
  return { store,
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => { store.set(k, v); },
  } as any;
}
describe('checkRateLimit', () => {
  it('allows under the limit and blocks at the limit', async () => {
    const kv = fakeKV();
    for (let i = 0; i < 5; i++) expect(await checkRateLimit(kv, '1.1.1.1', 5, 3600)).toBe(true);
    expect(await checkRateLimit(kv, '1.1.1.1', 5, 3600)).toBe(false);
  });
  it('separates keys by ip', async () => {
    const kv = fakeKV();
    expect(await checkRateLimit(kv, 'a', 1, 3600)).toBe(true);
    expect(await checkRateLimit(kv, 'b', 1, 3600)).toBe(true);
  });
});
```

- [ ] **Step 4: Run, verify fail** — `npx vitest run tests/ratelimit.test.ts` → FAIL.

- [ ] **Step 5: Implement `src/lib/ratelimit.ts`**

```ts
export async function checkRateLimit(kv: KVNamespace, ip: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `rl:${ip}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= limit) return false;
  await kv.put(key, String(current + 1), { expirationTtl: windowSec });
  return true;
}
```

- [ ] **Step 6: Implement `src/lib/db.ts`** (prepared statements only)

```ts
export async function upsertSubscriber(db: D1Database, email: string, source: string, token: string): Promise<void> {
  await db.prepare(
    `INSERT INTO subscribers (email, source, status, confirm_token)
     VALUES (?1, ?2, 'pending', ?3)
     ON CONFLICT(email) DO UPDATE SET source = excluded.source`
  ).bind(email, source, token).run();
}
```

- [ ] **Step 7: Run, verify pass** — `npx vitest run tests/ratelimit.test.ts` → PASS.

- [ ] **Step 8: Commit** — `git add src/lib/ratelimit.ts src/lib/db.ts tests/ratelimit.test.ts wrangler.jsonc && git commit -m "feat: ratelimit (tested) + subscriber upsert; provision D1/KV ids"`

---

### Task 19: Newsletter API endpoint (TDD)

**Files:** Create `src/pages/api/newsletter.ts`, `src/lib/email.ts`, `tests/newsletter.test.ts`. Configure `vitest.config.ts`.

- [ ] **Step 1: Create `src/lib/email.ts`** (Phase-0 no-op sender; real send is EPIC-05)

```ts
export interface Subscriber { email: string; token: string; }
export async function sendConfirmation(_s: Subscriber): Promise<void> {
  // EPIC-05 wires Buttondown double opt-in. EPIC-01 intentionally does not send.
  return;
}
```

- [ ] **Step 2: Create `src/pages/api/newsletter.ts`**

```ts
import type { APIRoute } from 'astro';
import { isValidEmail, normalizeEmail } from '../../lib/validation';
import { checkRateLimit } from '../../lib/ratelimit';
import { upsertSubscriber } from '../../lib/db';
import { sendConfirmation } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const env = locals.runtime.env;
  const ok = () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), { status: 400 }); }

  if (typeof body.website === 'string' && body.website.length > 0) return ok(); // honeypot → silently accept
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  const source = typeof body.source === 'string' ? body.source : 'unknown';
  if (!isValidEmail(email)) return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400, headers: { 'content-type': 'application/json' } });

  const allowed = await checkRateLimit(env.RL, clientAddress ?? 'unknown', 5, 3600);
  if (!allowed) return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429, headers: { 'content-type': 'application/json' } });

  const token = crypto.randomUUID();
  await upsertSubscriber(env.DB, email, source, token);
  await sendConfirmation({ email, token });
  return ok(); // generic response (no enumeration)
};
```

- [ ] **Step 3: Create `vitest.config.ts`** (Workers pool for D1/KV-backed tests)

```ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        miniflare: {
          d1Databases: { DB: 'harmattan_sessions' },
          kvNamespaces: ['RL'],
        },
      },
    },
  },
});
```
> Verify `@cloudflare/vitest-pool-workers` config + how to apply the D1 migration in test setup against current docs. The pure-logic tests (validation, ratelimit, theme) do not need this pool; if mixing pools is awkward, keep those in a default-pool project and the endpoint test in the workers project.

- [ ] **Step 4: Write the endpoint test** — `tests/newsletter.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import worker from '../src/pages/api/newsletter';
// NOTE: integration shape depends on the vitest-pool-workers harness; this asserts the contract.
// Pseudocode-level intent — adapt to the pool's request helper during implementation:
describe('POST /api/newsletter (contract)', () => {
  it('rejects invalid email with 400', async () => {
    const res = await postJson({ email: 'nope', source: 'test' });
    expect(res.status).toBe(400);
  });
  it('accepts a valid email with 200 and persists', async () => {
    const res = await postJson({ email: 'fan@example.com', source: 'test' });
    expect(res.status).toBe(200);
    const row = await queryEmail('fan@example.com');
    expect(row?.status).toBe('pending');
  });
  it('silently accepts honeypot hits', async () => {
    const res = await postJson({ email: 'bot@example.com', source: 'test', website: 'spam' });
    expect(res.status).toBe(200);
  });
});
```
> `postJson` / `queryEmail` are thin helpers you implement using the workers-pool `SELF.fetch` + `env.DB`. Replace the placeholder helpers with the pool's real API per the verified docs in Step 3. The three behaviours asserted (400 invalid, 200+persist valid, 200 honeypot) are the required contract.

- [ ] **Step 5: Run the suite** — `npm test` → Expected: all green (validation, ratelimit, theme, newsletter contract).

- [ ] **Step 6: Progressive-enhancement form script** — add to `src/layouts/Base.astro` before `</body>`:

```astro
<script>
  document.querySelectorAll('form.hs-subscribe').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.currentTarget as HTMLFormElement;
      const btn = f.querySelector('button')!; const prev = btn.textContent;
      const data = Object.fromEntries(new FormData(f).entries());
      data.source = f.dataset.source ?? 'unknown';
      btn.setAttribute('disabled', 'true'); btn.textContent = '…';
      const msg = f.parentElement?.querySelector('.hs-form-msg') as HTMLElement | null;
      try {
        const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        if (msg) msg.textContent = res.ok ? 'Check your inbox — welcome to the Dispatch.' : 'That didn’t work. Try again?';
        if (res.ok) f.reset();
      } catch { if (msg) msg.textContent = 'Network error. Try again?'; }
      finally { btn.removeAttribute('disabled'); btn.textContent = prev; }
    });
  });
</script>
```

- [ ] **Step 7: Commit** — `git add src/pages/api/newsletter.ts src/lib/email.ts tests/newsletter.test.ts vitest.config.ts src/layouts/Base.astro && git commit -m "feat: newsletter API (validated, rate-limited, honeypot) + form enhancement"`

---

### Task 20: now-playing endpoint (optional stub)

**Files:** Create `src/pages/api/now-playing.ts`

- [ ] **Step 1: Create `src/pages/api/now-playing.ts`**

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const prerender = false;
export const GET: APIRoute = async ({ locals }) => {
  const cached = await locals.runtime.env.RL.get('nowplaying');
  if (cached) return new Response(cached, { headers: { 'content-type': 'application/json' } });
  const mixes = (await getCollection('mixes')).filter((m) => m.data.isPublished)
    .sort((a, b) => +b.data.releasedAt - +a.data.releasedAt);
  const label = mixes[0]?.data.title ?? 'Labadi Sunset · Afro-Lofi';
  const body = JSON.stringify({ nowPlaying: label });
  await locals.runtime.env.RL.put('nowplaying', body, { expirationTtl: 300 });
  return new Response(body, { headers: { 'content-type': 'application/json' } });
};
```
> The hero already renders a static fallback; wiring the hero to fetch this is optional polish, not required for acceptance.

- [ ] **Step 2: Commit** — `git add src/pages/api/now-playing.ts && git commit -m "feat: now-playing endpoint (cached stub)"`

---

## Phase F — Quality & Deploy

### Task 21: Security headers + sitemap verification

**Files:** Create `public/_headers`

- [ ] **Step 1: Create `public/_headers`**

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'
/keystatic/*
  X-Frame-Options: SAMEORIGIN
```
> `'unsafe-inline'` for script is needed by the no-flash theme init + inline enhancement script. Tighten with a nonce/hash in a later hardening pass if desired. Verify CSP doesn't break Keystatic; relax the `/keystatic/*` block as needed.

- [ ] **Step 2: Verify sitemap + robots after build**

Run: `npm run build` then check `dist/sitemap-index.xml` exists and `dist/robots.txt` is present.

- [ ] **Step 3: Commit** — `git add public/_headers && git commit -m "feat: security headers"`

---

### Task 22: Accessibility + performance gate

- [ ] **Step 1: Preview the production build**

Run: `npm run build && npm run preview` → open the preview URL.

- [ ] **Step 2: Lighthouse**

Run Lighthouse (Chrome DevTools or `npx lighthouse <preview-url> --only-categories=performance,accessibility --view`).
Expected: Performance ≥ 95, Accessibility ≥ 95. If perf < 95, the usual fix is self-hosting fonts (`@fontsource-variable/fraunces`, `@fontsource/dm-sans`) — do that and re-measure.

- [ ] **Step 3: axe pass**

Use the `webapp-testing` skill (Playwright + axe) or the axe DevTools extension on the preview. Fix any contrast/label/landmark violations. Re-verify `--gold` (#8F5E12) on light bg at the 11px bold labels; if it fails contrast, change light `--gold` to `#855711` in `tokens.css`.

- [ ] **Step 4: Manual matrix**

Verify at widths 375 / 768 / 1120: no horizontal scroll, grids reflow, nav links hide < 760. Keyboard-only: skip link works, focus rings visible, toggle reachable + `aria-pressed` correct. Toggle persists across reload with no flash.

- [ ] **Step 5: Commit any fixes** — `git add -A && git commit -m "fix: a11y/perf gate adjustments"`

---

### Task 23: Dev docs + ship

**Files:** Create `DEVELOPMENT.md`; modify `README.md` (add a build/run section)

- [ ] **Step 1: Create `DEVELOPMENT.md`**

```markdown
# Harmattan Sessions — Development

## Run locally
- `npm install`
- `npm run dev` → http://localhost:4321 (Keystatic at /keystatic)
- D1/KV are provided locally via platformProxy. First run:
  - `npx wrangler d1 migrations apply harmattan_sessions --local`

## Build / preview
- `npm run check` (types) · `npm run build` · `npm run preview`

## Test
- `npm test`

## Deploy (GitHub → Cloudflare Pages)
- Push to `main`; Cloudflare Pages auto-builds (`astro build`, output `dist`).
- One-time owner setup: connect repo in Pages, bind D1 `DB` + KV `RL`, run
  `npx wrangler d1 migrations apply harmattan_sessions --remote`, attach `harmattansessions.com`.
```

- [ ] **Step 2: Final full verification**

Run: `npm run check && npm test && npm run build` → all PASS.

- [ ] **Step 3: Commit + push to trigger deploy**

```bash
git add -A && git commit -m "docs: development guide; EPIC-01 complete"
git push origin main
```

- [ ] **Step 4: Owner one-time Cloudflare steps** (cannot be automated here)

In the Cloudflare dashboard: Pages → Connect to Git → select `ghwmelite-dotcom/harmattan-sessions` (build `astro build`, output `dist`, prod branch `main`); bind D1 `DB` + KV `RL` to production & preview; run `npx wrangler d1 migrations apply harmattan_sessions --remote`; verify the `*.pages.dev` URL; attach `harmattansessions.com` when registered.

---

## Acceptance Verification (maps to spec §16)

- [ ] Site builds and deploys to a `*.pages.dev` URL.
- [ ] 8 sounds render from the `sounds` collection.
- [ ] Adding a mix in Keystatic → rebuild → appears in the grid (empty state when none).
- [ ] Light/dark toggle works, persists, no flash, reduced-motion honored.
- [ ] Sun Vinyl logo in nav + footer + favicon; crisp at 16px; correct in both themes.
- [ ] `POST /api/newsletter` persists a subscriber to D1 and is rate-limited (verified by `newsletter.test.ts`).
- [ ] Responsive ≥ 360px; Lighthouse ≥ 95 perf & a11y; axe clean.
- [ ] AI-disclosure line present in footer.

---

## Self-Review Notes (author)

- **Spec coverage:** scaffold (§2,§10 → T1), tokens/theme (§3,§5 → T2,T3), logo (§4 → T4), layout/SEO (§6,§12 → T5,T21,T22), content model (§7 → T6,T7,T8), data (§8 → T16,T18), API (§9 → T17,T18,T19,T20), a11y (§11 → T22), deploy (§13 → T18,T23), testing (§14 → T3,T17,T18,T19,T22), acceptance (§16 → final section). Email deferred (§15) honored via no-op `email.ts`.
- **Placeholders:** only the two `wrangler.jsonc` resource ids, resolved explicitly in T18 S1; and the endpoint-test helpers, explicitly flagged to adapt to the verified vitest-pool-workers API with the required contract stated.
- **Type consistency:** `resolveTheme`, `themeInitScript`, `isValidEmail`/`normalizeEmail`, `checkRateLimit(kv,ip,limit,windowSec)`, `upsertSubscriber(db,email,source,token)`, `sendConfirmation({email,token})`, bindings `DB`/`RL` — used consistently across tasks and the API.
```
