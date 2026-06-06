# YouTube Channel Sync — Design

**Date:** 2026-06-06
**Status:** Approved (visual direction + decisions confirmed via brainstorming companion)
**Author:** Ozzy + Claude

---

## 1. Goal

Reflect the **Harmattan Sessions** YouTube channel (`@HarmattanSessions`,
channel ID `UCPvNI44wmYxnCxVk_BJ1wvg`) on the marketing site (`hs.ohwpstudios.org`) so new uploads
surface automatically — no manual content entry, no per-upload rebuild.

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Data source | The channel's public **Atom/RSS feed** (`youtube.com/feeds/videos.xml?channel_id=…`) — no API key, no quota, ~15 latest uploads |
| Freshness | **Live** — build-time seed (SEO + instant + no-JS) **plus** a runtime KV-cached Worker endpoint (~30 min) that the client refreshes from |
| Homepage section | The existing **"Fresh mixes"** slot, repointed to YouTube: **editorial 3-up** (layout A) showing the latest 3 full tracks |
| Archive | A new **`/mixes`** page listing all ~15 feed tracks in a grid |
| Shorts | **Hidden** — filtered out by the `#shorts`/`#short` hashtag in title/description |
| Click action | **Open on YouTube in a new tab** (drives channel watch-time / subscribers) |
| Hero "Now playing" | **Synced** to the latest YouTube track (replaces the hardcoded label) |

## 3. Scope

### In scope
- A YouTube feed library (fetch + pure parser + filters).
- A runtime Worker endpoint with KV caching.
- Build-time seeding of the homepage section, the `/mixes` page, and the hero now-playing line.
- Client-side refresh (progressive enhancement) on those surfaces.
- A reusable video card component.
- Cleanup of the now-superseded manual `mixes` content collection and `/api/now-playing` route.

### Out of scope (YAGNI)
- YouTube Data API v3 (keys/quota) — the RSS feed covers the need.
- In-page video playback / lightbox (we link out to YouTube).
- Showing Shorts anywhere on the site.
- Comments, likes, subscriber counts, or channel analytics.
- Pagination beyond what the ~15-item feed returns.

## 4. Architecture & data flow

```
YouTube channel Atom feed (≤15 latest)
        │
        ├─ BUILD TIME ─ src/lib/youtube.fetchUploads()
        │     → MixesGrid (latest 3), /mixes (all tracks), Hero (now-playing)
        │       rendered into static HTML  → instant paint, SEO-indexed, works with JS off
        │
        └─ RUNTIME ─ GET /api/youtube  (Cloudflare Worker, prerender=false)
              → KV cache (key `yt:uploads`, TTL ~1800s)
              → returns { videos: Track[], nowPlaying: string }
                    │
                    └─ tiny client script hydrates the same surfaces with the freshest data
```

**Why both:** static hosting can't fetch on every request at the origin, but a Worker can. The
build-time render keeps the page non-empty, crawlable, and fast; the runtime endpoint + client
refresh make new uploads appear within ~30 min with zero rebuilds. The two share **one** parser
(`src/lib/youtube.ts`) so build and runtime can never disagree on shape.

**Cache key & TTL:** `yt:uploads` in the existing `RL` KV namespace, TTL 1800s. On a cache miss the
endpoint fetches the feed, parses, stores, and returns; on a fetch error it returns the last-known
cached value if present, else an empty list (200) so the client silently keeps the build seed.

## 5. Components & files

All new components follow existing conventions (Astro under `src/components/`, brand tokens, scoped
styles, global section classes). Each unit has one clear job.

### 5.1 `src/lib/youtube.ts` (pure-where-possible, the single source of parsing)
- `CHANNEL_ID` — sourced from `siteConfig` (added there as `youtubeChannelId`).
- `FEED_URL(channelId)` → the Atom feed URL.
- `interface Video { id; title; url; publishedAt (ISO); thumbnail; views (number|null); isShort (boolean) }`.
- `parseYouTubeFeed(xml: string): Video[]` — **pure.** Parses the Atom XML (entries → `yt:videoId`,
  `title`, `published`, `media:group/media:thumbnail@url`, `media:community/media:statistics@views`),
  marks `isShort` when the title or `media:description` contains `#short`/`#shorts` (case-insensitive),
  sorted newest-first. No network — takes a string, returns data. Unit-tested against a fixture.
- `tracksOnly(videos): Video[]` — `videos.filter(v => !v.isShort)`.
- `pickNowPlaying(videos): string` — title of the newest track, else a sensible default
  (`'Labadi Sunset · Afro-Lofi'`).
- `fetchUploads(fetchImpl, channelId): Promise<Video[]>` — `fetchImpl(FEED_URL)` → text →
  `parseYouTubeFeed`. Takes the fetch function as a parameter (works in Node build + Worker runtime,
  and is mockable in tests). Throws on network/HTTP error; callers handle fallback.
- Thumbnails use `https://i.ytimg.com/vi/{id}/hqdefault.jpg` (always present) — not `maxres` (can 404).

### 5.2 `src/pages/api/youtube.ts` (runtime)
- `export const prerender = false;`
- `GET`: read `yt:uploads` from `env.RL`; on hit return it; on miss `fetchUploads(fetch, CHANNEL_ID)`,
  build `{ videos: tracksOnly(...).slice(0, 15), nowPlaying: pickNowPlaying(...) }`, store (TTL 1800),
  return JSON. On fetch failure return last-known cache or `{ videos: [], nowPlaying: <default> }`.
- `content-type: application/json`; permissive cache headers consistent with `now-playing`.

### 5.3 `src/components/VideoCard.astro`
- Props: `{ id, title, publishedAt, thumbnail, views }`.
- Renders the approved editorial card: 16:9 thumbnail (`<img loading="lazy">`) with a play overlay,
  title, and a meta line `"<relative date> · <views> views"` via a small `relativeDate()` +
  `formatViews()` helper (in `src/lib/format.ts`, unit-tested).
- Anchor → `https://www.youtube.com/watch?v={id}` with `target="_blank" rel="noopener"`,
  descriptive `aria-label`. Decorative play glyph `aria-hidden`.

### 5.4 `src/components/MixesGrid.astro` (repointed)
- Build-time: `try { fetchUploads(fetch, CHANNEL_ID) } catch → []`; take `tracksOnly(...).slice(0,3)`.
- If empty → keep the existing tasteful empty state ("The first mixes drop soon… Subscribe").
- Else render three `VideoCard`s in the existing `.mixrow`/grid + a "Visit the channel →" (and, when
  present, an "All sessions →" link to `/mixes`).
- Adds `data-yt-grid="home"` and `data-yt-limit="3"` hooks for the client refresh script.

### 5.5 `src/pages/mixes.astro` (new `/mixes`)
- `Base` + `Nav` + `<main>` + `Footer`. Build-time seed of **all** feed tracks in a responsive grid
  of `VideoCard`s; `data-yt-grid="archive"`. Title/description/OG for the videos page. Empty-state
  fallback identical in spirit to the homepage. Sitemap picks it up automatically.

### 5.6 `src/components/Hero.astro` (now-playing synced)
- Build-time: seed the now-playing label from `pickNowPlaying(fetchUploads(...))` (fallback to the
  current default on error). Add `data-now-playing` to the `<strong>` so the client script can update it.

### 5.7 Client refresh — `src/lib/yt-hydrate.ts` (+ a `<script>` include)
- On load, `fetch('/api/youtube')`; on success, re-render the cards inside each `[data-yt-grid]`
  (respecting `data-yt-limit`) and update `[data-now-playing]`. On any error, do nothing (keep seed).
- Pure DOM, no framework. Builds the same card markup as `VideoCard` (a shared `cardHTML(video)` string
  helper kept next to the component so markup stays in one place).

### 5.8 `src/siteConfig.ts`
- Add `youtubeChannelId: 'UCPvNI44wmYxnCxVk_BJ1wvg'`. The existing `platforms[].YouTube` URL stays as
  the channel link.

### 5.9 Cleanup (both consumers are being repointed, so this is in-path)
- Remove the `mixes` collection from `src/content.config.ts` and the `src/content/mixes/` dir.
- Replace `/api/now-playing` by folding its behavior into `/api/youtube` (the hero reads `nowPlaying`
  from there). Remove the old route, or keep it as a thin alias — decided in the plan; default is remove.

## 6. Error handling

- **Build-time fetch failure:** caught per-surface → render empty-state/fallback; the build never fails
  because of YouTube.
- **Runtime fetch failure:** serve last-known KV value; else empty list with 200.
- **Malformed/partial feed:** `parseYouTubeFeed` skips entries missing a `videoId`/`title` rather than
  throwing; returns what it can.
- **Missing views/thumbnail:** `views` → `null` (meta line shows just the date); thumbnail always
  derivable from `id`.
- **All-Shorts / empty feed:** surfaces show the empty state; hero falls back to the default label.

## 7. Accessibility & quality gates

- Cards are real `<a>` elements with descriptive `aria-label`; play glyphs `aria-hidden`; thumbnails
  have meaningful `alt` (the video title) and `loading="lazy"`.
- AA contrast on meta text over thumbnails/gradient; focus-visible inherited from globals.
- Touch targets ≥ 44px; grid is responsive (3→2→1) reusing existing `.mixrow` breakpoints.
- Works in dark + light themes (tokens).
- `astro check` clean; `vitest` green (new parser/format tests + existing suite).

## 8. Testing

- `parseYouTubeFeed` — against a committed sample-feed fixture: entry count, field extraction,
  newest-first ordering, `isShort` detection (a `#shorts` title is flagged), graceful skip of a
  malformed entry.
- `tracksOnly` / `pickNowPlaying` — Shorts excluded; now-playing is the newest track's title; default
  when no tracks.
- `src/lib/format.ts` — `relativeDate()` and `formatViews()` (e.g. `1` → "1 view", `968` → "968 views",
  `1500` → "1.5K views").
- Endpoint KV/fetch wiring follows the repo norm (the parsing is fully covered; integration that needs
  miniflare KV may be `it.skip`-documented like `newsletter.test.ts`).

## 9. Risks / open items

- **Shorts detection is heuristic** (hashtag-based). A Short lacking `#shorts` in title/description
  could appear in the section; a full track that jokingly uses the tag would be hidden. Accepted as the
  free/no-API trade-off; revisit with the Data API only if it becomes a problem.
- **Feed depth ~15.** The `/mixes` archive shows what the feed returns; older uploads aren't listed.
  Accepted (out of scope to paginate via the API).
- **Build-time coupling to YouTube availability** is mitigated by per-surface try/catch + fallbacks.

## 10. Success criteria

- A new public upload appears in the homepage "Fresh mixes" section and on `/mixes` within ~30 minutes,
  with no rebuild and no manual entry — Shorts excluded.
- The hero "Now playing —" line reflects the latest track.
- Each card links to the video on YouTube in a new tab.
- With JavaScript disabled, the build-time-seeded videos still render and are crawlable.
- If YouTube is unreachable, the site degrades gracefully (no broken/empty-looking section, no failed build).
