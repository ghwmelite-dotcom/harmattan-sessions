# Harmattan Sessions — Development

## Run locally
- `npm install`
- `npm run dev` → http://localhost:4321 (Keystatic admin at /keystatic, auto-injected by @keystatic/astro)
- Local D1/KV are provided by the Cloudflare Vite plugin during `astro dev`. First-time local D1 setup:
  - `npx wrangler d1 migrations apply harmattan_sessions --local`

## Build / preview
- `npm run check` (types) · `npm run build` · `npm run preview`

## Test
- `npm test` (Vitest). Newsletter integration cases are skipped until D1 is provisioned (see below).

## Deploy (GitHub → Cloudflare Pages)
- Push `main`; Cloudflare Pages auto-builds (`astro build`, output `dist`).
- One-time owner setup:
  1. `wrangler login`
  2. `npx wrangler d1 create harmattan_sessions` and `npx wrangler kv namespace create RL`; put the real ids into `wrangler.jsonc` (replacing the dummy placeholders).
  3. `npx wrangler d1 migrations apply harmattan_sessions --remote`
  4. Cloudflare dashboard → Pages → Connect to Git → this repo (build `astro build`, output `dist`, prod branch `main`); bind D1 `DB` + KV `RL` to production & preview.
  5. Attach `harmattansessions.com` once registered.

## Outstanding verification (needs a browser)
- Live Lighthouse (perf ≥95, a11y ≥95) + axe pass against the preview / `*.pages.dev` deployment.
- Manual responsive check at 375/768/1120, keyboard-only pass, theme persistence + no-flash, Keystatic create-a-mix round-trip.

## Known follow-ups (from final code review)
- **OG image (before any social sharing):** `public/og-image.svg` is referenced by `BaseHead.astro`, but most social platforms don't render SVG OG cards. Rasterize a 1200×630 `public/og-image.png` (with Fraunces/DM Sans embedded) and point `og:image` at it. Deferred because the site isn't shared yet.
- **`lodash` devDependency is load-bearing — do NOT remove.** It is pinned to `4.17.21` to force npm to resolve a Keystatic/`slate-react` transitive dependency to a working version (`lodash@4.18.1` omits internal modules and breaks the Rollup bundle). It is intentionally not imported in `src/`. If cleaning up, convert it to a `package.json` `overrides` pin rather than deleting it, and re-run `npm run build`.
- **`SESSION` KV warning:** Astro 6's Cloudflare adapter logs a default-session KV-binding notice. Benign (no `Astro.session` usage). Silence later by setting the adapter's session option or binding a `SESSION` KV namespace.
- **CSP vs Keystatic admin:** confirm `public/_headers` CSP doesn't block the `/keystatic` SPA during the owner's live-deploy QA; loosen the `/keystatic/*` block if needed.
