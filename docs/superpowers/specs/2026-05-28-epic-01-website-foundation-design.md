# EPIC-01 — Website Foundation · Design Spec

> **Status:** Draft for review
> **Date:** 2026-05-28
> **Owner:** Ozzy Hodges (Hodges & Co. Ltd)
> **Source PRD:** `PRD.md` — EPIC-01 (+ EPIC-02 infrastructure pulled forward)
> **Visual spec:** `docs/harmattansessions.html` (the approved themed landing mockup; to be copied from the brainstorm session output)

---

## 1 — Goal & Scope

Ship a production-deployed, brand-correct `harmattansessions.com` on Cloudflare Pages: an Astro 5 SSR-hybrid site with the full landing experience, a hosted Keystatic CMS, a working light/dark theme system, the locked **Sun Vinyl** logo, and a live newsletter signup backed by Cloudflare D1.

**This build covers** the seven EPIC-01 stories **plus** the infrastructure half of EPIC-02 (provision D1, define the catalog schema, wire Keystatic), per the agreed decisions below.

### 1.1 Reconciled decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Architecture | **Approach 1** — single Astro 5 app, SSR-hybrid, `@astrojs/cloudflare`, one deploy to Cloudflare Pages |
| Build scope | Full landing (all sections) + **D1/Keystatic wiring now** |
| Catalog content | **Keystatic file-based collections now**; D1 *catalog* tables defined but populated in EPIC-02 |
| D1 usage now | **Live** for the newsletter `subscribers` table + rate limiting; catalog tables created via migration, unpopulated |
| Deploy | **Deploy to Cloudflare this session** (requires `wrangler login` / API token from owner — see §13) |
| Art direction | **Harmattan Dusk** (dark) + **Harmattan Daylight** (light), designed as a pair |
| Type | **Fraunces** (display/headings) + **DM Sans** (body/UI) |
| Logo | **Sun Vinyl** — a record that reads as a setting sun; locked |
| Theme | Light/dark toggle, dark-first default, persisted, no-flash, `prefers-reduced-motion` aware |

### 1.2 The Three Laws (brand guardrails this spec must not violate)

1. Cultural authenticity — surfaced via field-recording provenance, the 8-sound taxonomy, and honest Accra/Ghana framing (no decorative misuse of sacred symbols; the logo is an original mark, not an Adinkra reproduction).
2. Transformative production — the AI-disclosure line is permanent in the footer.
3. Brand discipline — every visual lives inside the Dusk/Daylight token system; the 8 sounds are the only catalogue taxonomy shown.

---

## 2 — Architecture

```
                ┌────────────────────────── Cloudflare Pages ──────────────────────────┐
                │                                                                        │
   Browser ───► │  Astro 5 (SSR-hybrid, @astrojs/cloudflare)                            │
                │   • Prerendered static pages: / , /sounds, /mixes/* (marketing)        │
                │   • Server endpoints (Pages Functions): /api/newsletter, /api/now-playing │
                │   • Keystatic admin: /keystatic  (SSR, local mode → GitHub mode later)  │
                │                                                                        │
                │   Bindings:  DB → D1 (harmattan_sessions)   ·   KV → rate limit/cache  │
                └───────────────┬───────────────────────────────────┬────────────────────┘
                                │                                   │
                         D1 (SQLite)                              KV
                  subscribers (LIVE)                       rl:<ip> rate limits
                  tracks/mixes/field_recordings (defined, EPIC-02)   nowplaying cache

   Content (build-time):  src/content/{sounds,mixes,field-recordings}/*  ← edited via Keystatic
                          Astro reads collections → prerenders pages
```

- **Rendering:** keep Astro's static output as the default (marketing pages prerender automatically) and add the Cloudflare adapter; the API and Keystatic routes opt into on-demand rendering with `export const prerender = false`, which gives them D1/KV access via `locals.runtime.env`. (Exact `output` mode — `static` + adapter vs `server` with prerendered marketing — confirmed against current Astro 5 docs during implementation.)
- **Why Approach 1:** one project/one deploy, Keystatic gets a hosted admin surface, D1/KV bindings are reachable from Astro endpoints via `locals.runtime.env`, and it maps cleanly onto the PRD's Pages + Workers + D1 + KV stack. Hono can be introduced inside `/api` later if the surface grows; not needed for EPIC-01.

> **Implementation note:** exact adapter options, the dev-time D1 binding (`platformProxy` / `wrangler dev`), and the Keystatic-on-Astro reader API will be confirmed against current Cloudflare + Astro + Keystatic docs during implementation (the `cloudflare`/`wrangler` skills bias to live-doc retrieval). The shapes below are the intended design, not copied config.

---

## 3 — Design System / Tokens

Tokens are CSS custom properties on `[data-theme="dark"]` / `[data-theme="light"]`, defined in `src/styles/tokens.css`. Components reference **semantic** tokens only — never raw hex.

### 3.1 Color — Harmattan Dusk (dark, default)

| Token | Hex / value | Role |
|---|---|---|
| `--bg` | `#0E0B08` | Page background (espresso black) |
| `--bg-elev` | `#15100B` | Hero base, gradient panels |
| `--surface` | `#1C1714` | Cards |
| `--surface-2` | `#221B16` | Raised surface, toggle well |
| `--text` | `#E7DAC8` | Body text (sand) |
| `--text-strong` | `#F4E8D6` | Headings |
| `--text-dim` | `rgba(231,218,200,.62)` | Secondary text |
| `--gold` | `#E8B04B` | Labels, links, accents |
| `--terracotta` | `#C96E3F` | Secondary accent, logo edge |
| `--accent` | `#E8B04B` | CTA button background |
| `--on-accent` | `#231803` | Text on CTA |
| `--line` | `rgba(231,218,200,.12)` | Borders/dividers |

### 3.2 Color — Harmattan Daylight (light)

| Token | Hex / value | Role |
|---|---|---|
| `--bg` | `#F4EADB` | Warm sand background |
| `--bg-elev` | `#FBF3E7` | Gradient panels |
| `--surface` | `#FFFDF9` | Cards |
| `--surface-2` | `#FBF3E7` | Raised surface |
| `--text` | `#2A2017` | Body text |
| `--text-strong` | `#1B130C` | Headings |
| `--text-dim` | `rgba(36,26,18,.6)` | Secondary text |
| `--gold` | `#8F5E12` | Labels/links (deepened for contrast) |
| `--terracotta` | `#A8502A` | Secondary accent |
| `--accent` | `#E8B04B` | CTA background (vivid in both themes) |
| `--on-accent` | `#231803` | Text on CTA |
| `--line` | `rgba(36,26,18,.12)` | Borders/dividers |

### 3.3 Contrast verification (WCAG AA target)

| Pair | Theme | Ratio (approx) | Verdict |
|---|---|---|---|
| `--text` on `--bg` | dark | ~13:1 | AAA |
| `--text-dim` on `--bg` | dark | ~5.5:1 | AA |
| `--gold` on `--bg` | dark | ~9:1 | AAA |
| `--on-accent` on `--accent` | both | ~8:1 | AAA |
| `--text` on `--bg` | light | ~12:1 | AAA |
| `--gold` on `--bg` | light | ~5.1:1 | AA (normal text) |
| `--text-dim` on `--bg` | light | ~5:1 | AA |

`--line` is intentionally sub-threshold (decorative divider, not information). Contrast to be re-verified with a tool (axe / Lighthouse) before deploy.

### 3.4 Typography

- **Display/headings:** Fraunces (`opsz` 9–144, weights 400/500/600/700; italic 400 for the hero accent).
- **Body/UI:** DM Sans (400/500/600).
- **Loading:** Google Fonts with `display=swap`; `preconnect` to fonts.gstatic.com. (Self-hosting via `@fontsource` is a perf upgrade noted for later, not EPIC-01.)
- **Type scale (px):** 12 · 13 · 14 · 16 (base) · 18 · 21 · 27 · 40 · clamp hero to 76.
- **Line-height:** body 1.6; headings 1.05. **Letter-spacing:** headings −0.01em.

### 3.5 Spacing, radius, motion

- **Spacing:** base-8 scale — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 84 / 120.
- **Radius:** `--r-sm` 8 · `--r-md` 12 · `--r-lg` 16 · `--r-xl` 24 · `--r-pill` 999.
- **Container:** `max-width: 1120px`, 24px gutters.
- **Motion:** micro-interactions 150–300ms, ease-out for entrances; theme crossfade 400ms; all transitions disabled under `prefers-reduced-motion: reduce`. No animation of width/height/top/left — transform/opacity only.
- **Breakpoints:** 520 / 760 / 900 / 1120.

---

## 4 — Logo & Brand Assets (Sun Vinyl)

The mark is an inline SVG `<symbol id="vinyl">`, theme-aware via `--accent`/`--terracotta`/`--bg`. Production source (final):

```svg
<symbol id="vinyl" viewBox="0 0 64 64">
  <defs><radialGradient id="vg" cx="36%" cy="27%" r="82%">
    <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--terracotta)"/>
  </radialGradient></defs>
  <circle cx="32" cy="32" r="22" fill="url(#vg)"/>
  <ellipse cx="24" cy="22" rx="13" ry="8.5" fill="#fff" opacity=".13"/>      <!-- sheen -->
  <circle cx="32" cy="32" r="16.5" fill="none" stroke="#2a1604" stroke-opacity=".22" stroke-width="1.3"/>
  <circle cx="32" cy="32" r="12"   fill="none" stroke="#2a1604" stroke-opacity=".22" stroke-width="1.3"/>
  <circle cx="32" cy="32" r="6" fill="#2A1604"/>                              <!-- label -->
  <circle cx="32" cy="32" r="1.7" fill="var(--bg)"/>                          <!-- spindle hole -->
</symbol>
```

Asset deliverables (created during implementation):
- `public/favicon.svg` — simplified mark (no fine grooves: disc + label + hole) so it stays crisp ≤18px.
- `public/logo.svg` — full mark, standalone (static fill version for OG/social where CSS vars don't resolve — gold `#E8B04B` → terracotta `#C96E3F`).
- `public/og-image.png` — 1200×630 social card (Dusk, logo + wordmark + tagline), generated.
- `src/components/Logo.astro` — renders the inline symbol + Fraunces wordmark; props: `size`, `wordmark` (bool), `stacked` (bool).
- Apple touch icon + web manifest icons from the static logo.

Lockups: horizontal (icon + "Harmattan·Sessions") and stacked. The "·" separator uses `--gold`.

---

## 5 — Theme Toggle

- **State:** `data-theme="dark|light"` on `<html>`.
- **Persistence:** `localStorage['hs-theme']`.
- **No-flash init:** a tiny inline `<script>` in `<head>` (before CSS) reads stored pref → else `prefers-color-scheme` → else `dark`, and sets `data-theme` before first paint.
- **Default:** dark (the brand is *evenings*), but system `light` preference is honored on first visit.
- **Toggle UI:** circular icon button in the nav (sun in dark mode → tap for light; moon in light mode). 40×40px hit target, `aria-label`, `aria-pressed` reflects state.
- **Reduced motion:** the 400ms crossfade and the hero equalizer are disabled under `prefers-reduced-motion`.
- **Implementation:** `src/components/ThemeToggle.astro` + `src/lib/theme.ts` (the init snippet is inlined via `is:inline` so it isn't deferred).

---

## 6 — Page Structure & Components

Single landing page (`/`) composed of the sections validated in the mockup. Each is an Astro component; data comes from content collections (§7), not hardcoded.

| Component | Content source | Notes / EPIC-01 story |
|---|---|---|
| `BaseHead.astro` | — | meta, OG/Twitter, fonts, theme init, JSON-LD | 
| `Nav.astro` | static | logo, section links, ThemeToggle, Subscribe → scrolls to Dispatch (E01-S3) |
| `Hero.astro` | static + `now-playing` | headline, inline email capture, now-playing chip (E01-S3) |
| `SoundsGrid.astro` / `SoundCard.astro` | `sounds` collection (8) | per-sound chip gradient, BPM, mood (E01-S3) |
| `MixesGrid.astro` / `MixCard.astro` | `mixes` collection | **empty state** when 0 mixes; "All sessions →" (E01-S3) |
| `FieldRecordings.astro` | `field-recordings` collection | location chips; empty-safe (E01-S3) |
| `ListenPlatforms.astro` | site config | text pills (no third-party logos — brand-asset safety) (E01-S3) |
| `Newsletter.astro` | — | "The Harmattan Dispatch" band → posts to `/api/newsletter` (E01-S3, E05 seed) |
| `Footer.astro` | site config | links, location, **AI-disclosure line** (E01-S3) |

Marketing pages are prerendered. The `now-playing` chip degrades gracefully to a static "latest mix" if the endpoint is unavailable.

---

## 7 — Content Model (Keystatic, file-based)

`keystatic.config.ts` — local mode (filesystem) for Phase 0; switch `storage` to `{ kind: 'github', repo }` once the repo is on GitHub for hosted editing. Admin mounted at `/keystatic` (SSR route). Astro reads the same files via content collections (`src/content.config.ts`).

Collections:

**`sounds`** — `src/content/sounds/*.json` (seeded with the 8)
```
slug (e.g. "afro-lofi") · name · bpmRange ("70–80") · mood · order (int) · chipFrom (hex) · chipTo (hex) · blurb (md)
```

**`mixes`** — `src/content/mixes/*` (`format: { contentField: 'description' }`)
```
title · slug · primaryGenre (select: 8 sounds) · durationSeconds · youtubeVideoId? · spotifyPlaylistId?
· bandcampUrl? · thumbnail (image) · releasedAt (date) · isPublished (bool) · description (markdoc)
```

**`field-recordings`** — `src/content/field-recordings/*.json`
```
location ("Labadi Beach") · description ("dusk surf") · capturedAt? · order
```

Site/global config (`src/content/settings.ts` singleton or a typed `siteConfig.ts`): platform URLs (YouTube/Spotify/Apple/Tidal/Bandcamp), social links, contact email.

> Field naming maps to the D1 catalog columns (PRD §8) so the EPIC-02 migration from files → D1 is mechanical.

---

## 8 — Data Layer (D1 + KV)

D1 database `harmattan_sessions`, migration `migrations/0001_init.sql`. **Created now:** the full PRD §8 schema. **Used now:** only `subscribers`.

```sql
-- LIVE in EPIC-01
CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  signup_date DATE DEFAULT CURRENT_DATE,
  source TEXT,                       -- homepage_hero | dispatch_band | footer
  status TEXT DEFAULT 'pending',     -- pending | confirmed | unsubscribed
  confirm_token TEXT,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- DEFINED now, POPULATED in EPIC-02 (verbatim from PRD §8): tracks, mixes, mix_tracks,
-- field_recordings, mix_field_recordings, distributions, royalties, licenses,
-- analytics_daily, submissions
```

- **Access:** D1 binding `DB`, KV binding `RL`, reached via `locals.runtime.env` in endpoints. Prepared statements only (never string-concatenated SQL).
- **KV:** `rl:<ip>` rate-limit counters; optional `nowplaying` cache.
- **Backups:** nightly D1 → R2 export is **EPIC-02** (E02-S6), not here.

---

## 9 — API Endpoints

**`POST /api/newsletter`** (`prerender = false`)
- Body: `{ email, source }`. Validate email (server-side, `src/lib/validation.ts`).
- Rate limit by IP via KV (e.g. 5/hour) → 429 on exceed.
- Upsert into `subscribers` with `status='pending'` + a `confirm_token`.
- Phase 0 email: send double-opt-in confirmation via a pluggable sender interface (`src/lib/email.ts`). Default Phase-0 implementation may be a no-op/log + TODO; **full double opt-in + Buttondown is EPIC-05**. EPIC-01 acceptance = subscriber persisted + rate-limited + valid JSON response. Honeypot field for spam.
- Returns `{ ok: true }` (always generic, to avoid email enumeration).

**`GET /api/now-playing`** (`prerender = false`, optional/stub)
- Returns the latest published mix (or a static fallback) for the hero chip. Cached in KV. If unbuilt, the chip uses a static value — non-blocking.

CORS: same-origin only. Security headers (CSP, etc.) set via middleware/`_headers`.

---

## 10 — Project Structure

```
astro.config.mjs · wrangler.jsonc · package.json · tsconfig.json · keystatic.config.ts
.dev.vars (gitignored) · migrations/0001_init.sql
public/ favicon.svg · logo.svg · og-image.png · manifest.webmanifest · robots.txt
src/
  components/  BaseHead · Logo · Nav · ThemeToggle · Hero · SoundsGrid · SoundCard ·
               MixesGrid · MixCard · FieldRecordings · ListenPlatforms · Newsletter · Footer
  layouts/     Base.astro
  pages/       index.astro · keystatic/[...params].astro · api/newsletter.ts · api/now-playing.ts
  content/     sounds/* · mixes/* · field-recordings/*
  content.config.ts · siteConfig.ts
  styles/      tokens.css · global.css
  lib/         theme.ts · db.ts · validation.ts · email.ts
```

TypeScript strict mode; no `any` without justification.

---

## 11 — Accessibility (ui-ux-pro-max priority 1–2, CRITICAL)

- Contrast ≥ 4.5:1 for text in **both** themes (§3.3); re-verified with axe before deploy.
- Visible focus rings on all interactives (2px gold outline); never removed.
- Keyboard nav: logical tab order; skip-to-content link; the theme toggle is a real `<button>`.
- `aria-label` on icon-only controls (toggle, social links); form inputs have associated labels.
- Sequential heading hierarchy (one h1 in the hero).
- `prefers-reduced-motion` respected globally.
- Touch targets ≥ 44px (nav toggle is 40px visual / 44px hit area via padding).
- Color never the sole signal (e.g., now-playing has the eq icon + text).

---

## 12 — Performance & SEO

- **Targets:** Lighthouse ≥ 95 perf / ≥ 95 a11y (EPIC-01 acceptance, E01-S7). LCP < 2.0s, CLS < 0.1, INP < 200ms.
- Marketing pages prerendered (static HTML at the edge). `font-display: swap` + `preconnect`. Images via Astro `<Image>` (WebP/AVIF, width/height to reserve space). Lazy-load below-fold media. No render-blocking JS beyond the tiny inline theme init.
- **SEO:** per-page `<title>`/description following the niche title formulas; canonical; Open Graph + Twitter cards; `MusicGroup`/`Organization` JSON-LD; `sitemap` (`@astrojs/sitemap`); `robots.txt`. Cloudflare Web Analytics snippet (E01-S6).

---

## 13 — Deployment (Cloudflare)

1. `wrangler` added as a devDependency (not global).
2. **Auth (owner action):** `wrangler login` (interactive browser OAuth) *or* set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. Interactive login can be run in-session via `! wrangler login`. **Blocker until provided.**
3. Provision: `wrangler d1 create harmattan_sessions`, `wrangler kv namespace create RL`; bind both in `wrangler.jsonc`.
4. Apply migration: `wrangler d1 migrations apply harmattan_sessions` (remote + local).
5. Build + deploy: `astro build` → Cloudflare Pages (via `wrangler pages deploy` or Pages Git integration).
6. **Custom domain (E01-S5):** `harmattansessions.com` via Cloudflare Registrar + Pages custom domain. Requires the domain to be registered/claimed by the owner — confirm availability.
7. Secrets via `.dev.vars` (local) and Pages env vars (remote); never committed.

---

## 14 — Testing

- **Unit (Vitest):** `validation.ts` (email + honeypot), rate-limit logic, theme-resolution helper.
- **Endpoint:** `/api/newsletter` — valid insert, duplicate handling, invalid email → 400, rate limit → 429 (Miniflare/`wrangler` local D1+KV).
- **Build gate:** `astro check` (types) + `astro build` must pass.
- **Quality gate:** Lighthouse CI + axe on the built site (perf/a11y ≥ 95).
- **Manual matrix:** 375 / 768 / 1120px; light + dark; reduced-motion on; keyboard-only pass; Keystatic create-a-mix round-trip rebuilds the grid.

---

## 15 — Out of Scope (deferred)

- Double opt-in email send + Buttondown (EPIC-05).
- D1 catalog population + files→D1 sync + nightly R2 backup (EPIC-02).
- `/license` storefront + Stripe (EPIC-06). Analytics dashboard (EPIC-08). Self-hosted fonts, mix detail pages beyond the grid, i18n.

---

## 16 — Acceptance Criteria

- [ ] Deployable to Cloudflare Pages; site live on a `*.pages.dev` URL (custom domain when registrar ready).
- [ ] All 8 sounds render from the `sounds` collection.
- [ ] Adding a mix via Keystatic → rebuild → it appears in the grid (empty state shown when none).
- [ ] Light/dark toggle works, persists, no flash on load, reduced-motion honored.
- [ ] Sun Vinyl logo in nav + footer + favicon, crisp at 16px, correct in both themes.
- [ ] `POST /api/newsletter` persists a subscriber to D1 and is rate-limited.
- [ ] Mobile responsive ≥ 360px; Lighthouse ≥ 95 perf & a11y; axe clean.
- [ ] AI-disclosure line present in footer.

---

## 17 — Risks / Open Questions

- **Cloudflare auth & domain** — deploy blocks until the owner provides `wrangler login`/token; needs `harmattansessions.com` registered. *Mitigation:* build + verify locally and on `*.pages.dev` first; attach the domain when ready.
- **Keystatic SSR on Cloudflare** — admin route needs SSR; confirm the adapter + Keystatic reader work together on Pages (verify against current docs; fallback = local-only Keystatic for Phase 0, which still satisfies file-based editing).
- **D1 in local dev** — ensure `wrangler dev`/platformProxy exposes the binding to Astro endpoints; document the dev command.
- **Light-mode `--gold` (#8F5E12) at 11px bold labels** — ~5:1, passes AA but re-check with axe; darken to `#855711` if it fails.
```
