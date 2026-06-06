# YouTube Channel Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reflect the Harmattan Sessions YouTube channel on the marketing site — latest 3 tracks on the homepage, a `/mixes` archive, and a synced hero "now playing" — auto-updating with no manual entry and no per-upload rebuild.

**Architecture:** One pure parser (`src/lib/youtube.ts`) turns the channel's public Atom feed into typed `Video[]`. It's used two ways: at **build time** (Astro components fetch + render a seed into static HTML for SEO/instant/no-JS) and at **runtime** (a KV-cached Cloudflare Worker endpoint `/api/youtube` that a tiny client script refreshes from). Shorts are filtered by hashtag. Cards link out to YouTube.

**Tech Stack:** Astro 6 (static + Cloudflare Workers adapter), `cloudflare:workers` KV binding `RL`, Vitest for the pure modules, regex-based Atom parsing (no XML dependency — runs in Node and Workers).

---

## Conventions (read first)

- Brand tokens only in components/CSS (`var(--gold)`, `var(--surface)`, `var(--line)`, `var(--text-strong)`, `var(--text-dim)`, `var(--surface-2)`); reuse global classes `.blk .wrap .sec-head .label .btn .btn-ghost .mixrow`.
- The video-card markup is produced by ONE helper `cardHTML()` so build-time and client-refresh markup are identical; its CSS lives in `global.css` (NOT scoped) so client-injected cards are styled too.
- Run all commands from `C:\dev\Projects\harmattan-sessions`. Files with non-ASCII (·, →, ↗, “”) must be written UTF-8.
- Channel ID is single-sourced in `siteConfig.youtubeChannelId`; `youtube.ts` takes `channelId` as a parameter (keeps the lib testable and account-agnostic).

## File map

| File | Responsibility |
|---|---|
| `src/lib/format.ts` | `relativeDate()`, `formatViews()` — pure display helpers |
| `src/lib/youtube.ts` | types + `parseYouTubeFeed()` (pure) + `tracksOnly()` + `pickNowPlaying()` + `fetchUploads()` |
| `src/lib/videoCard.ts` | `cardHTML(video)` — the single card-markup source (pure) |
| `src/components/VideoCard.astro` | thin `.astro` wrapper over `cardHTML` |
| `src/pages/api/youtube.ts` | runtime KV-cached endpoint → `{ videos, nowPlaying }` |
| `src/components/MixesGrid.astro` | homepage section, repointed to YouTube (seed + hooks) |
| `src/pages/mixes.astro` | `/mixes` archive page |
| `src/components/Hero.astro` | now-playing seeded + `data-now-playing` |
| `src/lib/yt-hydrate.ts` | client refresh from `/api/youtube` |
| `src/styles/global.css` | `.vcard*` styles (unscoped) |
| `src/siteConfig.ts` | `youtubeChannelId` |
| `src/content.config.ts`, `src/content/mixes/`, `src/pages/api/now-playing.ts` | removed (superseded) |

---

## Task 1: Display format helpers

**Files:** Create `src/lib/format.ts`; Test `tests/format.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatViews, relativeDate } from '../src/lib/format';

describe('formatViews', () => {
  it('handles singular, plural, K and M and null', () => {
    expect(formatViews(1)).toBe('1 view');
    expect(formatViews(968)).toBe('968 views');
    expect(formatViews(2000)).toBe('2K views');
    expect(formatViews(1500)).toBe('1.5K views');
    expect(formatViews(1_500_000)).toBe('1.5M views');
    expect(formatViews(null)).toBeNull();
  });
});

describe('relativeDate', () => {
  const now = Date.parse('2026-06-07T19:00:25Z');
  it('produces coarse relative strings', () => {
    expect(relativeDate('2026-06-07T18:59:50+00:00', now)).toBe('just now');
    expect(relativeDate('2026-06-07T18:00:25+00:00', now)).toBe('1 hour ago');
    expect(relativeDate('2026-06-05T19:00:25+00:00', now)).toBe('2 days ago');
  });
  it('returns empty string for an unparseable date', () => {
    expect(relativeDate('not-a-date', now)).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/format.test.ts` → FAIL (cannot find module).

- [ ] **Step 3: Implement** — `src/lib/format.ts`:

```ts
export function formatViews(n: number | null): string | null {
  if (n == null) return null;
  if (n < 1000) return `${n} view${n === 1 ? '' : 's'}`;
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K views`;
  }
  const m = n / 1_000_000;
  return `${m % 1 === 0 ? m : m.toFixed(1)}M views`;
}

export function relativeDate(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const s = Math.max(0, Math.floor((now - then) / 1000));
  const DAY = 86400;
  if (s < 60) return 'just now';
  if (s < 3600) { const m = Math.floor(s / 60); return `${m} minute${m === 1 ? '' : 's'} ago`; }
  if (s < DAY) { const h = Math.floor(s / 3600); return `${h} hour${h === 1 ? '' : 's'} ago`; }
  if (s < DAY * 7) { const d = Math.floor(s / DAY); return `${d} day${d === 1 ? '' : 's'} ago`; }
  if (s < DAY * 30) { const w = Math.floor(s / (DAY * 7)); return `${w} week${w === 1 ? '' : 's'} ago`; }
  if (s < DAY * 365) { const mo = Math.floor(s / (DAY * 30)); return `${mo} month${mo === 1 ? '' : 's'} ago`; }
  const y = Math.floor(s / (DAY * 365)); return `${y} year${y === 1 ? '' : 's'} ago`;
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/format.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.ts tests/format.test.ts
git commit -m "feat(youtube): relative-date + view-count format helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: YouTube feed library

**Files:** Create `src/lib/youtube.ts`; Test `tests/youtube.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/youtube.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseYouTubeFeed, tracksOnly, pickNowPlaying, fetchUploads, NOW_PLAYING_DEFAULT } from '../src/lib/youtube';

const FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Harmattan Sessions</title>
 <entry>
  <id>yt:video:aaa1</id><yt:videoId>aaa1</yt:videoId>
  <title>Tom &amp; Jerry Lofi</title>
  <published>2026-06-05T19:00:25+00:00</published>
  <media:group>
   <media:description>chill beats #lofi</media:description>
   <media:community><media:statistics views="968"/></media:community>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:bbb2</id><yt:videoId>bbb2</yt:videoId>
  <title>Quick Vibe #Shorts</title>
  <published>2026-06-04T19:00:25+00:00</published>
  <media:group>
   <media:description>a short</media:description>
   <media:community><media:statistics views="50"/></media:community>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:ccc3</id><yt:videoId>ccc3</yt:videoId>
  <title>Osu Rooftop</title>
  <published>2026-06-03T19:00:25+00:00</published>
  <media:group><media:description>no stats here</media:description></media:group>
 </entry>
 <entry>
  <title>Broken entry with no videoId</title>
 </entry>
</feed>`;

describe('parseYouTubeFeed', () => {
  it('parses valid entries, skips ones missing a videoId', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(v.map((x) => x.id)).toEqual(['aaa1', 'bbb2', 'ccc3']);
  });
  it('decodes title entities and derives url + thumbnail from id', () => {
    const [first] = parseYouTubeFeed(FIXTURE);
    expect(first.title).toBe('Tom & Jerry Lofi');
    expect(first.url).toBe('https://www.youtube.com/watch?v=aaa1');
    expect(first.thumbnail).toBe('https://i.ytimg.com/vi/aaa1/hqdefault.jpg');
    expect(first.views).toBe(968);
  });
  it('flags Shorts by hashtag and yields null views when absent', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(v.find((x) => x.id === 'bbb2')!.isShort).toBe(true);
    expect(v.find((x) => x.id === 'aaa1')!.isShort).toBe(false);
    expect(v.find((x) => x.id === 'ccc3')!.views).toBeNull();
  });
  it('sorts newest first', () => {
    expect(parseYouTubeFeed(FIXTURE).map((x) => x.id)).toEqual(['aaa1', 'bbb2', 'ccc3']);
  });
});

describe('tracksOnly + pickNowPlaying', () => {
  it('excludes Shorts and picks the newest track title', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(tracksOnly(v).map((x) => x.id)).toEqual(['aaa1', 'ccc3']);
    expect(pickNowPlaying(v)).toBe('Tom & Jerry Lofi');
  });
  it('falls back to the default when there are no tracks', () => {
    expect(pickNowPlaying([])).toBe(NOW_PLAYING_DEFAULT);
  });
});

describe('fetchUploads', () => {
  it('fetches the feed url and parses it', async () => {
    const fake = (async (url: string) => {
      expect(url).toContain('channel_id=UC_test');
      return { ok: true, text: async () => FIXTURE } as Response;
    }) as unknown as typeof fetch;
    const v = await fetchUploads(fake, 'UC_test');
    expect(v[0].id).toBe('aaa1');
  });
  it('throws on a non-ok response', async () => {
    const fake = (async () => ({ ok: false, status: 503 } as Response)) as unknown as typeof fetch;
    await expect(fetchUploads(fake, 'UC_test')).rejects.toThrow('503');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/youtube.test.ts` → FAIL (cannot find module).

- [ ] **Step 3: Implement** — `src/lib/youtube.ts`:

```ts
export interface Video {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  views: number | null;
  isShort: boolean;
}

export const NOW_PLAYING_DEFAULT = 'Labadi Sunset · Afro-Lofi';

export function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&'); // ampersand last so it doesn't double-decode
}

const SHORTS_RE = /#shorts?\b/i;

function field(block: string, re: RegExp): string | null {
  const m = block.match(re);
  return m ? m[1] : null;
}

export function parseYouTubeFeed(xml: string): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: Video[] = [];
  for (const e of entries) {
    const id = field(e, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const rawTitle = field(e, /<title>([\s\S]*?)<\/title>/);
    if (!id || rawTitle == null) continue;
    const viewsStr = field(e, /<media:statistics views="(\d+)"/);
    const description = field(e, /<media:description>([\s\S]*?)<\/media:description>/) ?? '';
    videos.push({
      id,
      title: decodeEntities(rawTitle).trim(),
      url: `https://www.youtube.com/watch?v=${id}`,
      publishedAt: field(e, /<published>([^<]+)<\/published>/) ?? '',
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      views: viewsStr ? Number(viewsStr) : null,
      isShort: SHORTS_RE.test(rawTitle) || SHORTS_RE.test(description),
    });
  }
  videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return videos;
}

export function tracksOnly(videos: Video[]): Video[] {
  return videos.filter((v) => !v.isShort);
}

export function pickNowPlaying(videos: Video[]): string {
  const t = tracksOnly(videos)[0];
  return t ? t.title : NOW_PLAYING_DEFAULT;
}

export async function fetchUploads(fetchImpl: typeof fetch, channelId: string): Promise<Video[]> {
  const res = await fetchImpl(feedUrl(channelId), {
    headers: { 'user-agent': 'HarmattanSessions/1.0 (+https://hs.ohwpstudios.org)' },
  });
  if (!res.ok) throw new Error(`YouTube feed HTTP ${res.status}`);
  return parseYouTubeFeed(await res.text());
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/youtube.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/youtube.ts tests/youtube.test.ts
git commit -m "feat(youtube): Atom feed parser, shorts filter, now-playing picker, fetcher

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Card markup helper

**Files:** Create `src/lib/videoCard.ts`; Test `tests/videoCard.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/videoCard.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { cardHTML } from '../src/lib/videoCard';

const NOW = Date.parse('2026-06-07T19:00:25Z');

describe('cardHTML', () => {
  const base = { id: 'aaa1', title: 'Tom & Jerry', publishedAt: '2026-06-05T19:00:25+00:00', views: 968 };

  it('links to YouTube in a new tab with the derived thumbnail', () => {
    const h = cardHTML(base, NOW);
    expect(h).toContain('href="https://www.youtube.com/watch?v=aaa1"');
    expect(h).toContain('target="_blank"');
    expect(h).toContain('rel="noopener"');
    expect(h).toContain('https://i.ytimg.com/vi/aaa1/hqdefault.jpg');
  });
  it('escapes the title to prevent markup injection', () => {
    const h = cardHTML({ ...base, title: '<script>x</script> & "q"' }, NOW);
    expect(h).toContain('&lt;script&gt;x&lt;/script&gt; &amp; &quot;q&quot;');
    expect(h).not.toContain('<script>x</script>');
  });
  it('builds a meta line with relative date and views', () => {
    expect(cardHTML(base, NOW)).toContain('2 days ago · 968 views');
  });
  it('omits views when null', () => {
    const h = cardHTML({ ...base, views: null }, NOW);
    expect(h).toContain('2 days ago');
    expect(h).not.toContain('·');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/videoCard.test.ts` → FAIL.

- [ ] **Step 3: Implement** — `src/lib/videoCard.ts`:

```ts
import { relativeDate, formatViews } from './format';

export interface CardVideo {
  id: string;
  title: string;
  publishedAt: string;
  views: number | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function cardHTML(v: CardVideo, now: number = Date.now()): string {
  const title = escapeHtml(v.title);
  const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const href = `https://www.youtube.com/watch?v=${v.id}`;
  const meta = escapeHtml([relativeDate(v.publishedAt, now), formatViews(v.views)].filter(Boolean).join(' · '));
  return (
    `<a class="vcard" href="${href}" target="_blank" rel="noopener" ` +
    `aria-label="Watch ${title} on YouTube (opens in a new tab)">` +
    `<span class="vcard-thumb"><img src="${thumb}" alt="${title}" loading="lazy" width="480" height="360" />` +
    `<span class="vcard-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none">` +
    `<circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.45)"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg></span></span>` +
    `<span class="vcard-title">${title}</span>` +
    `<span class="vcard-meta">${meta}</span>` +
    `</a>`
  );
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/videoCard.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/videoCard.ts tests/videoCard.test.ts
git commit -m "feat(youtube): cardHTML — single source of video-card markup

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Channel ID in siteConfig

**Files:** Modify `src/siteConfig.ts`; Test `tests/siteConfig.test.ts` (extend existing)

- [ ] **Step 1: Add the failing assertion** — append inside the existing `describe` block in `tests/siteConfig.test.ts`:

```ts
  it('exposes the YouTube channel id for feed sync', () => {
    expect(siteConfig.youtubeChannelId).toBe('UCPvNI44wmYxnCxVk_BJ1wvg');
  });
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run tests/siteConfig.test.ts` → FAIL (undefined).

- [ ] **Step 3: Implement** — in `src/siteConfig.ts`, add this line right after the `studioUrl` line (inside the object):

```ts
  // Harmattan Sessions YouTube channel — source for the live mixes/now-playing sync.
  youtubeChannelId: 'UCPvNI44wmYxnCxVk_BJ1wvg',
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run tests/siteConfig.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/siteConfig.ts tests/siteConfig.test.ts
git commit -m "feat(youtube): add youtubeChannelId to siteConfig

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: VideoCard component + card styles

**Files:** Create `src/components/VideoCard.astro`; Modify `src/styles/global.css` (append)

- [ ] **Step 1: Create the component** — `src/components/VideoCard.astro`:

```astro
---
import { cardHTML, type CardVideo } from '../lib/videoCard';
const { video } = Astro.props as { video: CardVideo };
---
<Fragment set:html={cardHTML(video)} />
```

- [ ] **Step 2: Append the card styles** to the end of `src/styles/global.css` (unscoped, so client-refreshed cards are styled too):

```css

/* video cards (YouTube sync) — global so build + client-injected markup share styles */
.vcard{display:flex;flex-direction:column;text-decoration:none;border-radius:14px;transition:transform .18s ease}
.vcard:hover{transform:translateY(-4px)}
.vcard-thumb{position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--surface-2)}
.vcard-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.vcard-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.45))}
.vcard-play svg{width:44px;height:44px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))}
.vcard-title{font-size:14px;color:var(--text-strong);margin:12px 0 4px;line-height:1.32;font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.vcard-meta{font-size:12px;color:var(--text-dim)}
.vcard:hover .vcard-title{color:var(--gold)}
@media(prefers-reduced-motion:reduce){.vcard:hover{transform:none}}
```

- [ ] **Step 3: Type-check** — `npm run check` → 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/VideoCard.astro src/styles/global.css
git commit -m "feat(youtube): VideoCard component + global card styles

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Runtime endpoint /api/youtube

**Files:** Create `src/pages/api/youtube.ts`

- [ ] **Step 1: Create the endpoint** — `src/pages/api/youtube.ts`:

```ts
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { fetchUploads, tracksOnly, pickNowPlaying, NOW_PLAYING_DEFAULT } from '../../lib/youtube';
import { siteConfig } from '../../siteConfig';

export const prerender = false;
const KEY = 'yt:uploads';
const JSON_HEADERS = { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' };

export const GET: APIRoute = async () => {
  const cached = await env.RL.get(KEY);
  if (cached) return new Response(cached, { headers: JSON_HEADERS });

  let body: string;
  try {
    const all = await fetchUploads(fetch, siteConfig.youtubeChannelId);
    const videos = tracksOnly(all).slice(0, 15).map((v) => ({
      id: v.id, title: v.title, publishedAt: v.publishedAt, views: v.views,
    }));
    body = JSON.stringify({ videos, nowPlaying: pickNowPlaying(all) });
    await env.RL.put(KEY, body, { expirationTtl: 1800 });
  } catch {
    body = JSON.stringify({ videos: [], nowPlaying: NOW_PLAYING_DEFAULT });
  }
  return new Response(body, { headers: JSON_HEADERS });
};
```

- [ ] **Step 2: Type-check** — `npm run check` → 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/youtube.ts
git commit -m "feat(youtube): KV-cached /api/youtube endpoint (videos + now-playing)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Repoint MixesGrid to YouTube

**Files:** Modify `src/components/MixesGrid.astro` (full replace)

- [ ] **Step 1: Replace the file** — `src/components/MixesGrid.astro`:

```astro
---
import VideoCard from './VideoCard.astro';
import { fetchUploads, tracksOnly } from '../lib/youtube';
import { siteConfig } from '../siteConfig';

let tracks: Awaited<ReturnType<typeof fetchUploads>> = [];
try {
  tracks = tracksOnly(await fetchUploads(fetch, siteConfig.youtubeChannelId)).slice(0, 3);
} catch {
  tracks = [];
}
const hasVideos = tracks.length > 0;
---
<section class="blk" id="mixes"><div class="wrap">
  <div class="sec-head">
    <div><span class="label">Latest sessions</span><h2>Fresh from the channel.</h2></div>
    {hasVideos && <a class="btn btn-ghost" href="/mixes">All sessions →</a>}
  </div>
  {hasVideos
    ? <div class="mixrow" data-yt-grid="home" data-yt-limit="3">
        {tracks.map((v) => <VideoCard video={v} />)}
      </div>
    : <div class="mixrow">
        {[1, 2, 3].map((n) => (
          <div class="mixcard">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="var(--gold)" stroke="none"/></svg>
            <span>{`Session 00${n}`}</span>
          </div>))}
      </div>}
  {!hasVideos && <p class="empty-note">The first <b>Harmattan Sessions</b> mixes drop soon. <a href="#dispatch">Subscribe</a> to hear them first.</p>}
</div></section>
```

- [ ] **Step 2: Type-check** — `npm run check` → 0 errors.

- [ ] **Step 3: Build (seed fetches the live feed)** — `npm run build` → succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/MixesGrid.astro
git commit -m "feat(youtube): homepage Fresh-mixes section pulls latest tracks from YouTube

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: /mixes archive page

**Files:** Create `src/pages/mixes.astro`

- [ ] **Step 1: Create the page** — `src/pages/mixes.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import VideoCard from '../components/VideoCard.astro';
import { fetchUploads, tracksOnly } from '../lib/youtube';
import { siteConfig } from '../siteConfig';

let tracks: Awaited<ReturnType<typeof fetchUploads>> = [];
try {
  tracks = tracksOnly(await fetchUploads(fetch, siteConfig.youtubeChannelId));
} catch {
  tracks = [];
}
const channelUrl = siteConfig.platforms.find((p) => p.name === 'YouTube')?.url ?? '#';
---
<Base
  title="Mixes — Harmattan Sessions"
  description="Every Harmattan Sessions mix — long-form Afrobeat chill, highlife lofi and ancestral ambient, straight from the YouTube channel."
>
  <Nav />
  <main id="main">
    <section class="blk"><div class="wrap">
      <div class="sec-head">
        <div><span class="label">From the channel</span><h2>Every session.</h2></div>
        <a class="btn btn-ghost" href={channelUrl} target="_blank" rel="noopener">On YouTube ↗</a>
      </div>
      {tracks.length > 0
        ? <div class="mixrow" data-yt-grid="archive">{tracks.map((v) => <VideoCard video={v} />)}</div>
        : <p class="empty-note">New <b>Harmattan Sessions</b> mixes are on the way. <a href="/#dispatch">Subscribe</a> to hear them first.</p>}
    </div></section>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors) then `npm run build` → succeeds and emits `dist/client/mixes/index.html` (verify: `test -f dist/client/mixes/index.html && echo OK`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/mixes.astro
git commit -m "feat(youtube): /mixes archive page listing every channel track

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Sync the hero now-playing

**Files:** Modify `src/components/Hero.astro`

- [ ] **Step 1: Replace the frontmatter and the now-playing line.** Current `Hero.astro` frontmatter is `const nowPlaying = 'Labadi Sunset · Afro-Lofi';`. Replace the frontmatter block (lines 1-3) with:

```astro
---
import { fetchUploads, pickNowPlaying, NOW_PLAYING_DEFAULT } from '../lib/youtube';
import { siteConfig } from '../siteConfig';
let nowPlaying = NOW_PLAYING_DEFAULT;
try {
  nowPlaying = pickNowPlaying(await fetchUploads(fetch, siteConfig.youtubeChannelId));
} catch {
  nowPlaying = NOW_PLAYING_DEFAULT;
}
---
```

Then change the now-playing line so the `<strong>` carries a `data-now-playing` hook:

```astro
  <div class="nowplay"><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span> Now playing —&nbsp;<strong data-now-playing>{nowPlaying}</strong></div>
```

- [ ] **Step 2: Type-check + build** — `npm run check` (0 errors), `npm run build` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(youtube): hero now-playing seeded from the latest track

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Client-side live refresh

**Files:** Create `src/lib/yt-hydrate.ts`; Modify `src/layouts/Base.astro` (add a script)

- [ ] **Step 1: Create the hydrator** — `src/lib/yt-hydrate.ts`:

```ts
import { cardHTML, type CardVideo } from './videoCard';

interface YtPayload { videos: CardVideo[]; nowPlaying: string }

async function hydrate(): Promise<void> {
  let data: YtPayload;
  try {
    const res = await fetch('/api/youtube');
    if (!res.ok) return;
    data = (await res.json()) as YtPayload;
  } catch {
    return; // keep the build-time seed
  }
  const videos = Array.isArray(data?.videos) ? data.videos : [];
  if (videos.length) {
    document.querySelectorAll<HTMLElement>('[data-yt-grid]').forEach((grid) => {
      const limit = Number(grid.getAttribute('data-yt-limit')) || videos.length;
      grid.innerHTML = videos.slice(0, limit).map((v) => cardHTML(v)).join('');
    });
  }
  if (data?.nowPlaying) {
    document.querySelectorAll<HTMLElement>('[data-now-playing]').forEach((el) => {
      el.textContent = data.nowPlaying;
    });
  }
}

hydrate();
```

- [ ] **Step 2: Include it in `Base.astro`.** Right after the existing closing `</script>` (the newsletter script) and before `</body>`, add:

```astro
    <script>import '../lib/yt-hydrate.ts';</script>
```

- [ ] **Step 3: Type-check + build** — `npm run check` (0 errors), `npm run build` → succeeds (the script bundles).

- [ ] **Step 4: Commit**

```bash
git add src/lib/yt-hydrate.ts src/layouts/Base.astro
git commit -m "feat(youtube): client refresh — live updates from /api/youtube

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Remove the superseded mixes collection + now-playing route

**Files:** Modify `src/content.config.ts`; Delete `src/content/mixes/` and `src/pages/api/now-playing.ts`

- [ ] **Step 1: Confirm nothing else references them.** Run:

`npx --yes rg -n "getCollection\('mixes'\)|now-playing|collections\.mixes|'mixes'" src` (or use the Grep tool).
Expected remaining references ONLY in `src/content.config.ts` (the `mixes` definition) and `src/pages/api/now-playing.ts` (being deleted). If `MixesGrid.astro` still references `getCollection('mixes')`, STOP — Task 7 was not applied.

- [ ] **Step 2: Edit `src/content.config.ts`** — remove the `mixes` collection. Delete the entire `const mixes = defineCollection({ ... });` block, and change the final export line from:

```ts
export const collections = { sounds, mixes, 'field-recordings': fieldRecordings };
```

to:

```ts
export const collections = { sounds, 'field-recordings': fieldRecordings };
```

Also remove the now-unused `image()` usage only if it was solely for mixes — leave the `sounds`/`field-recordings` collections untouched.

- [ ] **Step 3: Delete the dead files**

```bash
git rm -r src/content/mixes
git rm src/pages/api/now-playing.ts
```

- [ ] **Step 4: Type-check, test, build** — `npm run check` (0 errors), `npm test` (all green), `npm run build` (succeeds; `dist/client/mixes/index.html` still emitted by the new page).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(youtube): drop superseded manual mixes collection + now-playing route

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Whole test suite** — `npm test` → all pass (new `format`, `youtube`, `videoCard`, `siteConfig` tests included; nothing regressed).

- [ ] **Step 2: Type-check** — `npm run check` → 0 errors, 0 warnings.

- [ ] **Step 3: Production build** — `npm run build` → succeeds; confirm both `dist/client/index.html` and `dist/client/mixes/index.html` exist and that the homepage HTML contains `vcard` (the seed rendered real videos): `npx --yes rg -c "vcard" dist/client/index.html`.

- [ ] **Step 4: Visual smoke check.** Serve the built output and screenshot the homepage Mixes section + `/mixes`:

```bash
python -m http.server 8099 --directory dist/client
```

Then with Playwright (headless chromium) capture `http://localhost:8099/` and `http://localhost:8099/mixes/`; verify the editorial 3-up renders real thumbnails on the home page, the archive shows a multi-row grid, the hero "Now playing —" shows a real track title, and no Shorts (titles containing "#shorts") appear. (Note: `/api/youtube` only exists on the Worker runtime, so on the static file server the client refresh no-ops and the build-time seed is what's shown — which is the correct fallback to verify.)

- [ ] **Step 5: Commit (only if tweaks were needed)**

```bash
git add -A
git commit -m "test(youtube): verify live sync — suite, check, build, visual

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 Atom feed source → Task 2 (`feedUrl`, `fetchUploads`). ✓
- §2/§4 build-time seed + runtime KV + client refresh → Tasks 7/8/9 (seed), 6 (endpoint), 10 (refresh). ✓
- §2 homepage editorial 3-up → Task 7 + Task 5 card. ✓
- §2 `/mixes` archive → Task 8. ✓
- §2 Shorts hidden → `tracksOnly` (Task 2), used everywhere. ✓
- §2 open on YouTube new tab → `cardHTML` (Task 3). ✓
- §2 hero now-playing synced → Task 9. ✓
- §5.1 youtube lib → Task 2; §5.2 endpoint → Task 6; §5.3 VideoCard → Task 5; §5.4 MixesGrid → Task 7; §5.5 mixes page → Task 8; §5.6 Hero → Task 9; §5.7 hydrate → Task 10; §5.8 siteConfig → Task 4; §5.9 cleanup → Task 11. ✓
- §6 error handling → try/catch in Tasks 6/7/8/9; parser skips bad entries (Task 2); null views (Task 2/3). ✓
- §7 a11y (aria-label, lazy img, alt, reduced-motion) → Tasks 3/5. ✓
- §8 testing → Tasks 1/2/3. ✓

**Placeholder scan:** none — every code step has complete code; every command has an expected result.

**Type/name consistency:** `Video`/`CardVideo`, `fetchUploads(fetchImpl, channelId)`, `tracksOnly`, `pickNowPlaying`, `NOW_PLAYING_DEFAULT`, `cardHTML(video, now?)`, KV key `yt:uploads`, data hooks `data-yt-grid`/`data-yt-limit`/`data-now-playing`, and `siteConfig.youtubeChannelId` are used identically across Tasks 2–11. The `/api/youtube` JSON shape `{ videos: {id,title,publishedAt,views}[], nowPlaying }` matches `CardVideo` consumed by `cardHTML` in the hydrator. ✓
