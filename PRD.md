# Harmattan Sessions — Product Requirements Document (PRD)

> **Document version:** 1.0
> **Owner:** Ozzy Hodges (Hodges & Co. Ltd)
> **Status:** Active — Phase 0 (Planning)
> **Last updated:** 2026-05-27
> **Repo:** `github.com/ghwmelite-dotcom/harmattan-sessions`

---

## 0 — Document Map

This PRD is the source of truth for the Harmattan Sessions project. Anything in this document overrides earlier ad-hoc decisions. Treat each `Epic` heading as a candidate for a GitHub Issue once you run `ccpm` epic-decompose.

| Section | Purpose |
|---|---|
| 1. Executive Summary | One-page elevator pitch + outcomes |
| 2. Strategic Context | Why this project exists, market position |
| 3. Personas & Use Cases | Who we serve, how they find us |
| 4. Goals & Success Metrics | What "winning" looks like by phase |
| 5. Product Scope | In-scope / out-of-scope explicit list |
| 6. Technical Architecture | Cloudflare stack, integrations, data flow |
| 7. Component Epics | Implementation-ready epic specifications |
| 8. Data Models | D1 schemas, content schemas |
| 9. Phased Rollout | 4-phase build plan with exit criteria |
| 10. Risk Register | Known risks, mitigation strategies |
| 11. Budget & Operations | Money + time + team |
| 12. Appendix | References, links, glossary |

---

## 1 — Executive Summary

**Harmattan Sessions** is an AI-assisted music project, brand, and distribution operation building the first major **Afrobeat-chill audio brand** rooted in Ghana. Output is curated long-form mixes (30 min – 3 hr) across 8 distinct sounds — Afro-Lofi, Highlife Chill, Amapiano Lounge, Afro-Soul Sunset, Afro-Jazz Lounge, Coastal Afro-House, Ancestral Ambient, and Afrobeats Rain — distributed across YouTube, Spotify, Apple Music, Tidal, Bandcamp, and a self-hosted licensing platform on Cloudflare.

**The opportunity:** Western lofi is saturated. Japanese AI music channels (e.g., AI MUSIC MATRIX) have locked their lane. The Afrobeat-chill niche is wide open globally — and impossible to authentically own from outside West Africa. Harmattan Sessions occupies this gap with a fundamentally unfair geographic and cultural advantage.

**The build:** Cloudflare-native (Pages, Workers, D1, R2, KV, Workers AI) static + serverless stack, AI music generation via Suno Pro, AI visuals via Veo 3.1 Lite (free $300 credit) → Grok Imagine (post-credit), distribution via DistroKid. The full operation runs under $200/year in fixed costs.

**The 12-month goal:** Full YouTube Partner Program monetization, 10k+ subscribers, Spotify presence on 5+ editorial playlists, at least one award submission accepted (AFRIMA Best Alternative West Africa, or equivalent), and $1,500+/month combined revenue across YouTube + streaming + licensing.

---

## 2 — Strategic Context

### 2.1 Market Position

| Dimension | Status today | Harmattan Sessions edge |
|---|---|---|
| Western lofi hip-hop | Saturated, 1000+ channels | Avoid — too crowded |
| Japanese AI music (R&B/soul) | Locked by AI MUSIC MATRIX | Avoid — fan loyalty entrenched |
| **Afrobeat chill** | **Open — <10 dedicated channels globally** | **Geographic + cultural ownership** |
| Mainstream Afrobeats (vocals) | Burna Boy / Rema / Tems dominate | Adjacent — we feed playlist crossover |
| Ambient African / "world music" | Niche but growing | Premium positioning available |

### 2.2 Competitive Moat

Three layers of defensibility, in order of permanence:

1. **Geographic authenticity.** Recordings of Labadi Beach, Makola Market dawn hum, harmattan wind in Aburi Hills — physically unreplicable from outside Ghana. Per YouTube 2026 policy, this is also our "transformative value" satisfying the AI-content monetization gate.

2. **Cultural literacy.** Adinkra symbolism, Sankofa framing, Twi linguistic accents, highlife / palmwine heritage knowledge. AI music channels run by non-Africans cannot fake this without being called out.

3. **Production polish + brand discipline.** The 90% of AI music channels that fail do so by uploading unmixed Suno exports with static images. Harmattan Sessions enforces a polished pipeline (mixing pass, field recording layer, motion visuals, consistent thumbnails, transparent AI disclosure).

### 2.3 Why Now

- Afrobeats globally peaked in 2025–2026 (Burna Boy, Rema, Tems, Asake mainstream) — adjacent chill catalog is the next-wave opportunity
- YouTube's 2026 expanded Partner Program (500 subs + 3000 watch hours OR 3M Shorts views) makes early monetization realistic in 3–6 months
- Suno Pro pricing ($10/mo) + full commercial rights makes catalog-scale economically viable
- AFRIMA, Headies, and Spotify editorial increasingly recognize alternative / instrumental African music — submission windows are open

---

## 3 — Personas & Use Cases

### 3.1 Primary Personas

| Persona | Profile | What they want | Where they find us |
|---|---|---|---|
| **The Diaspora Student** | African students in US/UK/Canada universities, 18-26 | Study music that feels like home | YouTube search ("afrobeats study"), TikTok |
| **The Wellness Listener** | Yoga/meditation/spa enthusiasts, 25-45, global | Ambient with cultural depth | Spotify mood playlists, Apple Music |
| **The Lounge Curator** | Café/hotel/restaurant owners, Accra/Lagos/Nairobi/Joburg | Background music for venue | Direct outreach, Bandcamp license |
| **The Filmmaker** | Indie/doc filmmakers seeking African music sync | License-cleared tracks | Bandcamp, direct contact |
| **The Sleep Listener** | Insomniacs, parents with infants, 25-45 | Long-form gentle audio | YouTube ("rain music," "sleep") |

### 3.2 Critical Use Cases (User Journey)

**UC-01 — First-time discovery via YouTube search**
A student in Houston types "afrobeats study music" → finds *"3 Hours of Afro-Lofi for Deep Focus | No Ads"* → plays it during a 6-hour study session → returns weekly → subscribes after 3rd visit.

**UC-02 — Spotify editorial pickup**
Track *"Labadi Sunset"* released → distributed via DistroKid → Spotify editor sees it in "Afro Heat" submission queue → adds to "Afro Chill" mood playlist → 50k streams in week one → triggers Discover Weekly recommendations.

**UC-03 — Licensing inquiry**
Documentary filmmaker producing a piece on West African textile artisans → searches "African ambient music license" → lands on `harmattansessions.com/license` → previews 8 tracks → checkouts via Stripe ($79 per track sync license) → downloads master + license PDF.

**UC-04 — Mobile listening (TikTok / Shorts)**
User scrolls TikTok → sees 30-second Highlife Chill clip with sunset visual + "@harmattansessions" tag → swipes through 3 more → follows on TikTok → searches "Harmattan Sessions" on YouTube → subscribes there.

**UC-05 — Direct B2B (Accra hotel)**
Hotel manager at an Accra boutique hotel sees the channel via Instagram → DMs for venue licensing → custom monthly playlist arrangement with locked Spotify Connect → recurring $200/mo revenue.

---

## 4 — Goals & Success Metrics

### 4.1 Phase Targets (Critical KPIs)

| Phase | Duration | Subscribers | Watch Hours | Streams (Spotify) | Revenue/mo |
|---|---|---|---|---|---|
| **P0 — Foundation** | Day 1–14 | 0 | 0 | 0 | $0 |
| **P1 — Catalog Build** | Day 15–90 | 250–500 | 1,500–3,000 | 5k–20k | $0 |
| **P2 — Monetization Unlock** | Day 91–180 | 1,000+ | 4,000+ | 50k+ | $100–$500 |
| **P3 — Scale** | Day 181–365 | 10,000+ | 40,000+ | 500k+ | $1,500–$5,000 |

### 4.2 Leading vs Lagging Indicators

**Leading (controllable, weekly):**
- Tracks generated per week
- Mixes uploaded per week (target: 2 long + 1 mega-mix biweekly)
- Shorts uploaded per week (target: 7)
- Email subscribers added
- Spotify playlist submissions made
- Field recordings captured

**Lagging (results, monthly):**
- Subscriber growth rate (%)
- Watch hours growth rate
- Spotify monthly listeners
- Revenue by platform
- Click-through rate (impression → view)
- Average view duration (especially first 30 seconds)

### 4.3 Non-Negotiable Quality Bars

These are kill switches — if any falls below, stop scaling and fix:

- **Average view duration** must exceed 4 minutes (signals quality content)
- **Subscriber-to-view ratio** must stay above 0.5% per video
- **Spotify save rate** must exceed 8% on first 1000 listeners
- **Strike count on YouTube/Spotify** must be zero
- **Suno generation reject rate** must be tracked (if >70%, prompts need refinement)

---

## 5 — Product Scope

### 5.1 In Scope (v1)

✅ YouTube channel — primary content distribution
✅ Spotify, Apple Music, Tidal, Amazon Music, Deezer via DistroKid
✅ Bandcamp — direct sales + licensing storefront
✅ harmattansessions.com — marketing site, mix archive, licensing
✅ Instagram, TikTok, X — short-form distribution
✅ Email newsletter ("The Harmattan Dispatch")
✅ 8 sound categories, established catalog rotation
✅ Field recording layer in every long-form mix
✅ AI-generated visuals (Veo 3.1 Lite → Grok Imagine)
✅ Cross-platform analytics dashboard (internal)
✅ Submission pipeline for editorial playlists & awards

### 5.2 Out of Scope (v1 — defer to v2+)

❌ Live performances or events
❌ Physical merchandise (t-shirts, vinyl) — defer to month 9+
❌ Mobile app — defer until 25k subscribers
❌ AI vocal generation / lyrics-based releases — explicit non-goal for the "instrumental chill" brand
❌ Mixed-artist label / signing other artists — defer until financially profitable
❌ Custom commission service for clients — defer until catalog of 50+ tracks
❌ Patreon or paid subscription tier — defer until 5k+ subscribers

### 5.3 Explicit Non-Goals

- Becoming a mainstream Afrobeats vocal artist channel (different brand)
- Competing with AI MUSIC MATRIX on R&B/funk (different niche)
- Selling individual unmixed Suno exports (brand discipline)
- Anonymous / faceless operation (the Ozzy Hodges + Accra story IS the brand)

---

## 6 — Technical Architecture

### 6.1 Tech Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| **Hosting** | Cloudflare Pages | Free tier, edge-distributed, already mastered |
| **Web framework** | Astro 5 + Keystatic CMS | Static-first, content-first, your stack preference |
| **Server logic** | Cloudflare Workers (Hono) | Edge functions for newsletter, licensing, analytics |
| **Database** | Cloudflare D1 (SQLite) | Free tier, sufficient for catalog metadata |
| **Object storage** | Cloudflare R2 | Free egress for audio masters, license PDFs |
| **Key-value store** | Cloudflare KV | Caching, rate limits, session tokens |
| **AI inference** | Cloudflare Workers AI | Free tier for embeddings, lightweight tasks |
| **Music generation** | Suno Pro ($10/mo) | Best quality, full commercial rights |
| **Video generation** | Veo 3.1 Lite (free $300 credit) → Grok Imagine | Best price/quality for atmospheric loops |
| **Image generation** | FLUX.1 (via fal.ai pay-per-image) | Best aesthetic for thumbnails / covers |
| **Audio editing** | Audacity → DaVinci Resolve (Fairlight) | Free, professional |
| **Video editing** | CapCut → DaVinci Resolve | Free, mobile-friendly |
| **Distribution** | DistroKid | $22.99/yr, unlimited uploads, 100% royalties |
| **Email** | Cloudflare Email Routing → Buttondown ($9/mo when scaling) | Free start, scales cheap |
| **Analytics** | YouTube Studio + Cloudflare Web Analytics + Plausible | Free / privacy-respecting |
| **Domain** | Cloudflare Registrar | At-cost ($9.77/year) |

### 6.2 Architecture Diagram (text form)

```
                ┌─────────────────────────────────────────┐
                │     CREATION PIPELINE (off-platform)    │
                │                                          │
                │  Suno Pro  ──▶  Audacity  ──▶  Field    │
                │  (audio)        (mix)         recording │
                │                                  layer  │
                │                                          │
                │  Veo / Grok ──▶  CapCut    ──▶  Final  │
                │  (visuals)       (assemble)     export  │
                └────────────────┬─────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │  DISTRIBUTION  (multi-platform fanout)        │
        │                                                │
        │  YouTube   Spotify   Apple   Tidal   Bandcamp │
        │     ▲         ▲        ▲       ▲        ▲     │
        │     │         │        │       │        │     │
        │     │       (via DistroKid)             │     │
        │     │                                   │     │
        │  (manual)                          (direct) │
        └─────┬──────────────────────────────┬─────────┘
              │                              │
              │       ┌──────────────────────┴────────┐
              │       │   HARMATTANSESSIONS.COM       │
              │       │   (Cloudflare Pages + Workers)│
              │       │                                │
              │       │  ┌──────────┐ ┌────────────┐  │
              │       │  │  Astro   │ │ Keystatic  │  │
              │       │  │  static  │ │  CMS       │  │
              │       │  │  site    │ │ (mixes,    │  │
              │       │  │          │ │  releases) │  │
              │       │  └──────────┘ └────────────┘  │
              │       │                                │
              │       │  ┌──────────────────────────┐ │
              │       │  │  Workers (Hono routes)   │ │
              │       │  │  /api/newsletter         │ │
              │       │  │  /api/license            │ │
              │       │  │  /api/now-playing        │ │
              │       │  └──────────────────────────┘ │
              │       │                                │
              │       │  D1 ◀──▶ KV ◀──▶ R2          │
              │       │  metadata    cache   audio   │
              │       │                       masters │
              │       └────────────────────────────────┘
              │
              └────▶ TikTok, Instagram, X (manual or via Metricool)
```

### 6.3 Data Flow Summary

1. **Track Generation**: Suno Pro → 16-32 raw tracks/week
2. **Curation**: Best 8 tracks selected, mixed in Audacity with field recording layer
3. **Visual Assembly**: Veo/Grok visual loop + thumbnail (FLUX) → final video in CapCut
4. **Upload (YouTube)**: Manual upload with full SEO description, chapters, AI disclosure
5. **Distribution (Streaming)**: Same tracks uploaded to DistroKid → propagates to Spotify, Apple, Tidal, Amazon, Deezer
6. **Catalog Sync**: Metadata written to D1 via Keystatic CMS UI
7. **Web Display**: Astro pulls from D1 at build time → static site → Cloudflare Pages
8. **Newsletter**: Friday email triggered via Worker cron → sent via Buttondown API
9. **Licensing**: User lands on `/license` → previews via embedded R2 audio → Stripe checkout → Worker fulfills (license PDF + master delivery via signed R2 URL)


---

## 7 — Component Epics

Each `EPIC-NN` is a candidate GitHub Issue. Use `ccpm epic-decompose <id>` to expand into tasks.

### EPIC-01 — Website Foundation (`harmattansessions.com`)

**Goal:** Production-deployed Astro site on Cloudflare Pages with brand-correct landing page.

**Stories:**
- E01-S1: Scaffold Astro 5 project, configure Cloudflare Pages adapter
- E01-S2: Set up brand design tokens (CSS vars matching Harmattan palette)
- E01-S3: Build component library: Nav, Hero, Sounds grid, Mixes grid, FieldRecordings, ListenPlatforms, Newsletter, Footer
- E01-S4: Integrate Keystatic CMS for managing `mixes`, `sounds`, `field_recordings`
- E01-S5: Configure custom domain `harmattansessions.com` via Cloudflare Registrar
- E01-S6: Set up Cloudflare Web Analytics
- E01-S7: Lighthouse audit pass (>95 perf, >95 accessibility)

**Acceptance Criteria:**
- Site deployable via `wrangler pages deploy ./dist`
- Adding a new mix via Keystatic auto-rebuilds and publishes
- Mobile responsive at 360px width minimum
- All 8 sounds displayable

**Tech notes:**
- Use HTML reference at `docs/harmattansessions.html` as visual spec
- All fonts loaded from Google Fonts (Fraunces, DM Sans, JetBrains Mono)

---

### EPIC-02 — Content Database (D1 Schema + Keystatic)

**Goal:** Source-of-truth database for all releases, mixes, tracks, field recordings.

**Stories:**
- E02-S1: Design D1 schema (see Section 8)
- E02-S2: Create migration scripts via `wrangler d1 migrations create`
- E02-S3: Configure Keystatic content collections to write to D1 via Worker API
- E02-S4: Build internal admin dashboard at `/admin` (password-protected via Cloudflare Access)
- E02-S5: Seed database with first 16 tracks + 4 mixes
- E02-S6: Backup automation (nightly D1 export to R2)

**Acceptance Criteria:**
- All catalog metadata queryable via D1 API
- Keystatic UI creates valid records
- Backup runs without intervention

---

### EPIC-03 — Music Production Pipeline

**Goal:** Repeatable workflow producing 2 compilations per week.

**Stories:**
- E03-S1: Document Suno generation SOP (use `harmattan-music-craft` skill)
- E03-S2: Build Audacity macro for standard mastering chain (compress, EQ, limit)
- E03-S3: Document field recording capture standards (44.1kHz/16-bit minimum, phone settings)
- E03-S4: Build CapCut template projects for each genre (16:9 main, 9:16 Shorts)
- E03-S5: QC checklist before any track ships (loudness compliance -14 LUFS, no clipping, proper fade)
- E03-S6: File naming convention + Notion or D1 tracking sheet
- E03-S7: Backup raw Suno generations to R2 (in case of regeneration needs)

**Acceptance Criteria:**
- A new 30-min compilation can be produced end-to-end in ≤4 hours
- All output meets QC checklist before upload

---

### EPIC-04 — YouTube Channel Operations

**Goal:** Channel set up, branded, and producing on cadence with monetization-optimized configuration.

**Stories:**
- E04-S1: Channel creation, handle, banner, logo, About section
- E04-S2: Apply for YouTube Official Artist Channel status (post-DistroKid release)
- E04-S3: Configure default upload settings (visibility, language=English, category=Music, AI disclosure)
- E04-S4: Set up playlists per sound (8 playlists)
- E04-S5: End-screen template for every video (subscribe + next video)
- E04-S6: Community tab strategy (post weekly engagement question)
- E04-S7: Monitor monetization eligibility, apply at 500/3000 expanded tier threshold
- E04-S8: Track Content ID claims (should be zero — Suno tracks not in CID system)

**Acceptance Criteria:**
- Channel publishing 2 long-form/week + 7 Shorts/week
- All videos use standard description template
- Subscriber gain rate >5/day by month 3

---

### EPIC-05 — Newsletter ("The Harmattan Dispatch")

**Goal:** Friday newsletter capturing emails and driving back-catalog views.

**Stories:**
- E05-S1: Cloudflare Worker endpoint `/api/newsletter` for signup
- E05-S2: D1 table `subscribers` (email, signup_date, source, status)
- E05-S3: Double opt-in flow via Worker + transactional email (Cloudflare + Buttondown or similar)
- E05-S4: Weekly cron Worker generating digest email content from D1 (latest mix, featured field recording, "one thing")
- E05-S5: Buttondown integration for sending (free tier ≤100 subs, then $9/mo)
- E05-S6: Unsubscribe link with one-click compliance

**Acceptance Criteria:**
- Signup confirmation email arrives within 30 sec
- Friday email sends automatically every Friday at 17:00 GMT
- Email renders correctly on Gmail, Apple Mail, Outlook

---

### EPIC-06 — Licensing Platform (`/license`)

**Goal:** Self-service music licensing for filmmakers, podcasters, brands.

**Stories:**
- E06-S1: License tier definition (Personal $29, Commercial $79, Extended $199, Custom inquiry)
- E06-S2: Track preview player on `/license` (R2-hosted MP3, embedded HTML5 audio)
- E06-S3: Stripe Checkout integration via Worker (`/api/license/checkout`)
- E06-S4: Post-purchase fulfillment Worker (signed R2 URL for master + license PDF generation)
- E06-S5: License PDF template (DocuSign-style with track ID, buyer, terms, scope)
- E06-S6: D1 table `licenses` for audit trail
- E06-S7: Email receipt + delivery to buyer

**Acceptance Criteria:**
- Successful purchase delivers WAV + PDF within 60 seconds
- License PDF has unique ID and machine-readable verification
- Bandcamp also offered as alternative checkout path

---

### EPIC-07 — Distribution & Royalty Tracking

**Goal:** All tracks distributed to streaming platforms; royalties tracked.

**Stories:**
- E07-S1: DistroKid account setup with Hodges & Co. Ltd as label
- E07-S2: Spotify for Artists claim post-first-release
- E07-S3: Apple Music for Artists claim
- E07-S4: Monthly royalty sync — manual entry of DistroKid earnings into D1 `royalties` table
- E07-S5: Quarterly tax calculation per Ghana RGD reporting requirements
- E07-S6: Submit each release to 5+ free playlist submission services (DailyPlaylists, SubmitHub)
- E07-S7: Track which playlists adopt each release

**Acceptance Criteria:**
- New tracks live on Spotify within 7 days of upload
- Royalty data backed by D1 records
- At least 1 playlist placement per month by month 3

---

### EPIC-08 — Analytics Dashboard (Internal)

**Goal:** Single-pane view of cross-platform performance.

**Stories:**
- E08-S1: Route `/admin/analytics` behind Cloudflare Access
- E08-S2: YouTube Data API integration (subs, views, watch hours, CPM)
- E08-S3: Spotify for Artists API integration (streams, listeners, playlists)
- E08-S4: Daily snapshot stored in D1 `analytics_daily` table
- E08-S5: Charts via D3.js or Recharts (subscriber trend, top videos, top tracks)
- E08-S6: Revenue rollup (YouTube + Spotify + Bandcamp + License sales)
- E08-S7: Email weekly summary to Ozzy

**Acceptance Criteria:**
- Single page shows last 30 days of all key metrics
- Weekly email arrives Monday morning

---

### EPIC-09 — Brand & Visual Asset Pipeline

**Goal:** Repeatable production of thumbnails, banners, social posts.

**Stories:**
- E09-S1: Canva brand kit (when Pro upgrade happens) with Harmattan palette + fonts
- E09-S2: Thumbnail template — 5 variants for visual rotation
- E09-S3: Veo / Grok prompt library for visual loops (per genre)
- E09-S4: FLUX prompt library for static covers
- E09-S5: Instagram template (square + 9:16 reel cover)
- E09-S6: TikTok / Shorts vertical visual templates
- E09-S7: Press kit PDF (one-pager bio, photos, links) for media outreach

**Acceptance Criteria:**
- Any new video has thumbnail produced in ≤15 min
- Every release has both vertical + landscape visuals ready

---

### EPIC-10 — Award & Editorial Submission Pipeline

**Goal:** Systematic submission to awards, editorial playlists, press.

**Stories:**
- E10-S1: Award calendar tracker (AFRIMA, Headies, BET Africa, Grammy Global Music) with deadlines
- E10-S2: Press kit + EPK pages
- E10-S3: Curated submission spreadsheet (target playlists, contacts, status, response date)
- E10-S4: Submission tracker D1 table
- E10-S5: Q1 2027 — first AFRIMA submission for *Best Alternative Song — West Africa* category (eligibility: released between submission window)
- E10-S6: Monthly press outreach (Music in Africa, OkayAfrica, Pitchfork, Stereofox) with new releases

**Acceptance Criteria:**
- 1+ editorial playlist pickup by month 6
- 1+ press feature by month 9
- 1+ award submission filed by Q1 2027

---

## 8 — Data Models

### 8.1 D1 Schema (initial)

```sql
-- Core catalog tables
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,                -- UUID, e.g. "trk_01HX..."
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  genre TEXT NOT NULL,                -- afro_lofi | highlife_chill | amapiano_lounge | ...
  bpm INTEGER,
  key TEXT,                           -- e.g. "A minor"
  duration_seconds INTEGER NOT NULL,
  suno_id TEXT,                       -- Original Suno generation ID
  suno_prompt TEXT,                   -- Full prompt used
  audio_master_url TEXT,              -- R2 signed URL pattern
  audio_preview_url TEXT,             -- 30-sec preview, R2
  cover_image_url TEXT,
  isrc TEXT,                          -- International Standard Recording Code (from DistroKid)
  upc TEXT,
  released_at DATE,
  is_published BOOLEAN DEFAULT 0,
  is_licensable BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mixes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  primary_genre TEXT,                 -- Optional — null for multi-genre mixes
  duration_seconds INTEGER NOT NULL,
  youtube_video_id TEXT,
  spotify_playlist_id TEXT,
  bandcamp_album_url TEXT,
  thumbnail_url TEXT,
  visual_loop_url TEXT,               -- Background video used
  released_at DATE NOT NULL,
  is_published BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mix_tracks (
  mix_id TEXT NOT NULL,
  track_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  start_seconds INTEGER NOT NULL,     -- Timestamp in mix (for chapters)
  PRIMARY KEY (mix_id, track_id),
  FOREIGN KEY (mix_id) REFERENCES mixes(id),
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);

CREATE TABLE field_recordings (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,             -- "Labadi Beach"
  description TEXT,                   -- "Ocean waves at dusk"
  captured_at TIMESTAMP,
  duration_seconds INTEGER,
  audio_url TEXT,
  gps_lat REAL,
  gps_lng REAL
);

CREATE TABLE mix_field_recordings (
  mix_id TEXT NOT NULL,
  recording_id TEXT NOT NULL,
  volume_db REAL DEFAULT -25,          -- Volume level it sits at in the mix
  PRIMARY KEY (mix_id, recording_id)
);

-- Distribution
CREATE TABLE distributions (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL,
  platform TEXT NOT NULL,             -- spotify | apple_music | tidal | bandcamp | youtube
  external_id TEXT,                   -- Platform-specific track ID
  url TEXT,
  live_since DATE,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- Royalties tracking
CREATE TABLE royalties (
  id TEXT PRIMARY KEY,
  track_id TEXT,                      -- Nullable if aggregated
  platform TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  streams INTEGER,
  earnings_usd REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter
CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  signup_date DATE DEFAULT CURRENT_DATE,
  source TEXT,                        -- homepage | newsletter_popup | bandcamp | manual
  status TEXT DEFAULT 'pending',      -- pending | confirmed | unsubscribed
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- Licensing
CREATE TABLE licenses (
  id TEXT PRIMARY KEY,                -- "lic_01HX..."
  track_id TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  tier TEXT NOT NULL,                 -- personal | commercial | extended | custom
  price_usd REAL NOT NULL,
  stripe_payment_id TEXT,
  pdf_url TEXT,                       -- R2-hosted license PDF
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- Analytics snapshots
CREATE TABLE analytics_daily (
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  metric TEXT NOT NULL,               -- subscribers | views | watch_hours | streams | listeners
  value REAL NOT NULL,
  PRIMARY KEY (date, platform, metric)
);

-- Submission tracking
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  track_id TEXT,                      -- Or mix_id
  mix_id TEXT,
  target_type TEXT NOT NULL,          -- playlist | award | press
  target_name TEXT NOT NULL,
  contact TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_at TIMESTAMP,
  status TEXT DEFAULT 'pending',      -- pending | accepted | rejected | no_response
  notes TEXT
);
```

### 8.2 Keystatic Content Collections

```ts
// src/keystatic.config.ts (excerpt)
collection({
  label: 'Tracks',
  slugField: 'title',
  path: 'src/content/tracks/*',
  format: { contentField: 'description' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    genre: fields.select({
      label: 'Genre',
      options: [
        { label: 'Afro-Lofi', value: 'afro_lofi' },
        { label: 'Highlife Chill', value: 'highlife_chill' },
        // ... etc
      ],
      defaultValue: 'afro_lofi'
    }),
    bpm: fields.integer({ label: 'BPM' }),
    sunoPrompt: fields.text({ label: 'Suno Prompt', multiline: true }),
    coverImage: fields.image({ label: 'Cover', directory: 'public/covers/' }),
    description: fields.markdoc({ label: 'Description' }),
    releasedAt: fields.date({ label: 'Released' }),
    isPublished: fields.checkbox({ label: 'Published' })
  }
})
```

---

## 9 — Phased Rollout

### Phase 0 — Foundation (Days 1–14)

**Exit criteria:**
- [ ] YouTube channel live with branding
- [ ] `harmattansessions.com` deployed with Day-1 landing page
- [ ] Suno Pro, DistroKid, Cloudflare accounts active
- [ ] First 20 tracks generated and triaged
- [ ] First 1 mix uploaded as soft launch

**Spend:** ~$45 one-time

### Phase 1 — Catalog Build (Days 15–90)

**Exit criteria:**
- [ ] 25+ uploaded compilations
- [ ] 500+ subscribers (expanded YPP tier achievable)
- [ ] 3,000+ watch hours
- [ ] Spotify catalog of 30+ tracks live
- [ ] Newsletter at 200+ subscribers
- [ ] First playlist placement achieved

**Spend:** ~$60 total ($10/mo Suno × 3 months + first DistroKid year)

### Phase 2 — Monetization Unlock (Days 91–180)

**Exit criteria:**
- [ ] YPP application submitted at 1,000 subs / 4,000 hours
- [ ] $300 Cloudflare credit fully consumed; switch to Grok Imagine
- [ ] License page live and processing real transactions
- [ ] First $100+ revenue month
- [ ] First press feature secured

**Spend:** ~$50 (Suno continues; add Grok ~$15-25/mo)

### Phase 3 — Scale (Days 181–365)

**Exit criteria:**
- [ ] 10,000+ subscribers
- [ ] $1,500+/month total revenue
- [ ] AFRIMA Q1 2027 submission filed
- [ ] 5+ Spotify editorial placements
- [ ] Bandcamp licensing generating $200+/month
- [ ] Hodges & Co. Ltd properly accounted for tax purposes

**Spend:** ~$150-300/mo (scaled tools as needed)

---

## 10 — Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| YouTube rejects monetization on "inauthentic content" grounds | High | High | Always layer field recordings + transformative editing; disclose AI use; never upload raw Suno |
| Suno terms change re: commercial use | Low | High | Maintain DistroKid distribution which already published — those rights persist; archive raw stems to R2 |
| Spotify removes AI music from playlists | Medium | High | Position as "AI-assisted, human-curated"; build human production credentials |
| Grok or Veo prices increase | Medium | Low | Stockpile visual assets while free credit lasts; multiple-provider strategy |
| Cloudflare D1 free tier exceeded | Low | Low | D1 free tier is 5GB; metadata only — won't approach |
| Burnout from 2x/week upload cadence | High | High | Batch-produce on weekends; never let weekday stress drive uploads |
| Copyright strike from sampled Suno output | Low | High | Suno provides indemnification; track Content ID claims; rapid dispute process |
| Niche overcrowding | Medium | Medium | Defensive moat = field recordings + cultural depth; can't be replicated by remote competitors |
| Ghanaian currency / payment friction | Medium | Medium | Maintain USD-denominated accounts where possible; use Wise / Payoneer for cross-border |
| AFRIMA / Headies rejection | High | Low | Submission costs are low; rejection = data on what to improve |

---

## 11 — Budget & Operations

### 11.1 Year 1 Budget

| Category | Item | Frequency | Annual Cost |
|---|---|---|---|
| **Music** | Suno Pro | Monthly | $120 |
| **Distribution** | DistroKid | Annual | $23 |
| **Domain** | harmattansessions.com | Annual | $10 |
| **Hosting** | Cloudflare Pages/Workers/D1/R2 | Free tier | $0 |
| **Email** | Buttondown (when needed) | Monthly | $54 (6 mo × $9) |
| **Visuals** | Veo 3.1 Lite ($300 free credit) | Free → paid | $0 → ~$120 |
| **Grok Imagine** (post-credit) | Monthly | $96 (8 mo × $12) |
| **Image gen** | FLUX via fal.ai | Pay-per-use | ~$30 |
| **Analytics** | TubeBuddy (free) → Pro M6+ | Monthly | $54 (6 mo × $9) |
| **Submissions** | SubmitHub credits | One-time | $30 |
| **Award submissions** | AFRIMA + Headies submission fees | Annual | ~$200 |
| **Contingency** | Buffer | — | $100 |
| **TOTAL** | | | **~$837** |

### 11.2 Team

| Role | Person | Time commitment |
|---|---|---|
| Founder / Producer / Operations | Ozzy Hodges | 15-20 hrs/week |
| (Optional) Editor for Shorts | Freelance via Fiverr | 5 hrs/month, ~$50/mo |
| (Future) Field recording assistant | Freelance | TBD |

### 11.3 Time Investment Per Week

| Activity | Time |
|---|---|
| Suno generation + curation | 3 hrs |
| Audio mixing (2 compilations) | 6 hrs |
| Video assembly | 4 hrs |
| Shorts creation (batch Sunday) | 2 hrs |
| Upload + SEO optimization | 1 hr |
| Engagement (comments, social) | 2 hrs |
| Submission/admin/analytics | 1 hr |
| **TOTAL** | **~19 hrs/week** |

---

## 12 — Appendix

### 12.1 References

- AI MUSIC MATRIX (reference channel): `youtube.com/channel/UC4eEg9prJU6ApDrfsRwV1bw`
- AFRIMA categories: `afrima.org`
- YouTube Partner Program rules (2026): expanded tier 500/3000 or 3M Shorts
- Suno commercial rights: Pro tier required for all commercial use
- DistroKid: $22.99/year unlimited uploads, 100% royalty retention

### 12.2 Glossary

- **YPP** — YouTube Partner Program
- **CPM** — Cost per mille (per 1000 views) for ads
- **RPM** — Revenue per mille (creator's share after YouTube's 45% cut)
- **LUFS** — Loudness Units relative to Full Scale (streaming target: -14 LUFS)
- **ISRC** — International Standard Recording Code (per-track, from DistroKid)
- **UPC** — Universal Product Code (per-release)
- **Stem** — Individual instrument track for remixing
- **EPK** — Electronic Press Kit
- **AFRIMA** — All Africa Music Awards
- **YPP** — YouTube Partner Program

### 12.3 Critical External Documentation Links

- Cloudflare Pages: `developers.cloudflare.com/pages`
- Cloudflare Workers: `developers.cloudflare.com/workers`
- Cloudflare D1: `developers.cloudflare.com/d1`
- Astro on Cloudflare: `docs.astro.build/en/guides/integrations-guide/cloudflare`
- Keystatic on Cloudflare Pages: `keystatic.com/docs/installation-next-js#cloudflare-pages`
- Hono framework: `hono.dev`
- Suno API (if/when needed): `suno.com/docs`
- DistroKid: `distrokid.com`

### 12.4 Naming Conventions

- Track filenames: `{slug}_master.wav`, `{slug}_preview.mp3`
- Mix filenames: `{date}_{primary_genre}_{slug}.mp4`
- Suno generation IDs preserved in `suno_id` field
- Slugs: lowercase, hyphen-separated, no diacritics (e.g., `labadi-sunset`, `palmwine-evening`)
- Genre codes: `afro_lofi`, `highlife_chill`, `amapiano_lounge`, `afro_soul_sunset`, `afro_jazz_lounge`, `coastal_house`, `ancestral_ambient`, `afrobeats_rain`

---

## End of PRD v1.0

This document is meant to be iterated. Open a GitHub issue with `prd-update` label for any proposed change. Major rewrites require version bump (v2.0).

**Next step:** Run `ccpm epic-decompose EPIC-01` to expand the Website Foundation epic into trackable GitHub issues.
