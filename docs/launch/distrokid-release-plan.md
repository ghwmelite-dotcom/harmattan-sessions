# DistroKid Release Plan — Session 1 Catalog → Spotify / Apple Music

**Generated:** 2026-05-30 · Source: `tmp/suno-session-1/keepers/`
**Goal:** Get the Session-1 catalog onto Spotify, Apple Music, Tidal, Amazon, etc. — without tripping the AI-spam / catalog-stuffing flags, sequenced for editorial pickup.

> ⚠️ **The #1 rule:** release ONE master per composition. The folders contain v1/v2/v3 + short/EXT cuts of the **same 7 songs** — releasing two versions of "Aburi Climb" as separate tracks is the duplicate-stuffing anti-pattern Spotify penalizes. Pick one master each. This plan does that for you.

---

## What you actually have (7 distinct compositions, not 30 files)

The folders hold many *variations* of 7 underlying songs. Distinct compositions only:

**Afro-Lofi (4):** Labadi Sunset · Trotro Window · Aburi Climb · Sunday Morning Light
**Afrobeats Rain (3):** Heartbeat · 3 AM · Volta Sleep

Everything else is a v1/v2/v3 take or a short/extended cut of one of those.

---

## The plan: TWO releases, one month apart

Two distinct moods = two clean releases. Do **not** dump all 7 at once (looks artificial, splits your one-pitch-per-release leverage, and reads as spam).

| | Release 1 — **debut** | Release 2 — **+4 weeks** |
|---|---|---|
| Type | EP (4 tracks) | EP (3 tracks) |
| Working title | *Harmattan Sessions — Afro-Lofi, Vol. 1* | *Harmattan Sessions — Afrobeats Rain* (sleep) |
| Mood | Focus / study / sunset | Sleep / deep rest |
| Why first | Matches the YouTube launch; most editorial-ready | Different playlist ecosystem (sleep/ambient); long tracks = high stream-time |
| Editorial pitch song | **Labadi Sunset** | **Volta Sleep** |

> Why an EP not 7 singles: you get **one** "Pitch a Song" per *release*. Two EPs = two strong pitches into two different playlist worlds (focus vs sleep). Seven singles = seven weak releases and pitch fatigue.

---

## RELEASE 1 — Afro-Lofi EP (the masters to upload)

All measured at streaming-ready loudness; **use these exact files:**

| # | Track title (public) | File | Length | LUFS / TP |
|---|---------------------|------|--------|-----------|
| 1 | **Labadi Sunset** | `01-afro-lofi-labadi-sunset-v1-EXT.wav` | 4:05 | −14.2 / −2.5 ✅ |
| 2 | **Trotro Window** | `02-afro-lofi-trotro-window-v1-EXT.wav` | 4:00 | −14.4 / −3.6 ✅ |
| 3 | **Aburi Climb** | `03-afro-lofi-aburi-climb-v2-EXT.wav` | 4:00 | −14.2 / −3.6 ✅ |
| 4 | **Sunday Morning Light** | `04-afro-lofi-sunday-morning-light-v1-EXT.wav` | 4:00 | −14.2 / −3.6 ✅ |

*(Chose v1-EXT for Labadi/Trotro/Sunday — most dynamic, full 4-min length. Aburi: v2-EXT is the full 4:00 cut; v1-EXT is only 2:48. All sit at −14 LUFS / safe true-peak already — no remaster needed.)*

**Track order on the EP:** lead with **Labadi Sunset** (it's the most dynamic, LRA 6.0 — best "first impression" track and your pitch song), then Trotro → Aburi → Sunday Morning Light.

---

## RELEASE 2 — Afrobeats Rain EP (sleep)

Use the **v3-EXT** masters — they're the long-form cuts (7 min each), ideal for sleep playlists where stream-time is everything:

| # | Track title (public) | File | Length | LUFS / TP |
|---|---------------------|------|--------|-----------|
| 1 | **Heartbeat** | `05-afrobeats-rain-heartbeat-v3-EXT.wav` | 7:04 | −15.9 / −4.1 |
| 2 | **3 AM** | `06-afrobeats-rain-3am-v3-EXT.wav` | 6:59 | −14.8 / −2.4 |
| 3 | **Volta Sleep** | `07-afrobeats-rain-volta-sleep-v3-EXT.wav` | 7:14 | −15.3 / −4.1 |

> ⚠️ **One pre-upload fix:** these sit at −15 to −16 LUFS (~1–2 dB under the −14 target). For *sleep* music slightly quieter is acceptable and even desirable — but for catalog consistency I'd nudge them to −14. **I can batch-normalize all three to −14 LUFS / −1 dBTP before you upload** (lossless WAV in, WAV out). Say the word.

---

## Pre-flight setup (do BEFORE any upload — ~a few days)

- [ ] **DistroKid account** — distrokid.com, $22.99/yr unlimited. Artist name: `Harmattan Sessions`. Label: leave blank (DK acts as label) or `Hodges & Co.`
- [ ] **Payout method** — Wise or Payoneer **USD** account (lower FX fees from Ghana than direct GHS)
- [ ] **Spotify for Artists** + **Apple Music for Artists** — claim profiles (can't until first release is processing; do it the day you submit)
- [ ] **Cover art — 3000×3000 px, RGB.** ⚠️ The anchor stills are landscape 1312×736 — they **cannot** be used as-is. Each EP needs a **square** cover. *I can generate both 3000×3000 covers from the anchors (center-crop + Fraunces title lockup), matching the YouTube thumbnail style — just ask.*
- [ ] Convert release WAVs to **44.1 kHz / 16-bit** if DK requires (it accepts 48k/16 too — yours are fine as-is)

## Per-release DistroKid settings

- **Release date:** 14+ days in the future (mandatory for editorial review eligibility)
- **Pre-save:** ENABLE
- **Genre:** primary only — *Afrobeat* or *Electronic › Chill* (Release 1), *Ambient* (Release 2)
- **Lyrics field:** literally type `Instrumental`
- **Explicit:** NO (always)
- **Songwriter credit:** your legal name
- **Enable:** YouTube Content ID · TikTok/Instagram licensing · Shazam · Pandora
- **Skip:** DistroVid · DistroKid promo cards (use free `feature.fm` instead)

---

## ⚠️ The AI-disclosure line (non-negotiable, your legal/policy shield)

Spotify actively purged AI-generated music through 2025. Your **transformative production is the defense** — but only if you're transparent. In the DistroKid/Spotify credits and pitch, state your real role:

> *"Composition assisted with AI tools; arrangement, mixing, mastering, curation, and original field recordings by Ozzy Hodges, Accra."*

Do **not** claim fully-human composition. Do **not** hide the AI involvement. The field recordings + mixing are what make you a legitimate, defensible release rather than spam.

---

## Spotify "Pitch a Song" — Release 1 (pitch LABADI SUNSET)

You get ONE pitch per release. Submit via Spotify for Artists within the 7–14 day pre-release window.

**Tags:**
- Genre (3): Afrobeats · Instrumental · Chill
- Mood (3): Chill · Sunset · Focus
- Style (3): Instrumental · Acoustic · Smooth
- Culture (1): African

**Pitch description (≤500 chars):**
```
"Labadi Sunset" is an Afro-Lofi instrumental from Harmattan Sessions, an independent project rooted in Accra, Ghana. It blends palmwine-highlife guitar phrasing with warm sub-bass and brushed shakers, layered over original field recordings captured in Greater Accra. Built for golden-hour focus and study. Composition AI-assisted; mixing, mastering, curation and field recording by Ozzy Hodges. Independent release, 2026 — curated chill from West Africa.
```

---

## Free playlist + smart-link push (after release is live)

1. **feature.fm** (free) — paste the Spotify URL → auto-generates Apple/Tidal/Amazon/YouTube buttons → one link (`feature.fm/harmattan-labadi-sunset`) for the YT description, IG bio, newsletter
2. **DailyPlaylists.com** — submit to 10+ Afro / Lofi playlists (free)
3. **SubmitHub** — a few $1–5 credits to genuine curators
4. **Direct curator email** (template in `harmattan-music-craft/references/release-strategy.md` §Playlist Submission) — Tue–Thu, 10am–12pm curator time
5. ❌ Avoid anything promising "guaranteed placement" or "buy streams" — botted, gets you banned

---

## Timeline

| When | Action |
|------|--------|
| **This week** | DistroKid + Wise/Payoneer setup; generate 2× square covers; pick final titles |
| **Week 1, +14 days** | Schedule **Afro-Lofi EP** release; pitch Labadi Sunset; enable pre-save |
| **Release day** | Claim Spotify/Apple for Artists; feature.fm link into YouTube description + newsletter |
| **+7 days** | Free playlist submissions; companion YouTube content |
| **+4 weeks** | Repeat the whole flow for **Afrobeats Rain EP**; pitch Volta Sleep |

---

## Reality check (from harmattan-music-craft)

90% of independent releases get <1,000 streams; the **catalog compounds**, individual tracks rarely break out early. Don't judge success on Release 1's numbers — judge it on *getting the machine running cleanly* (honest AI disclosure, no stuffing, one good pitch per release). Track 100 might be the one that gets editorial pickup and unlocks the rest. Volume + quality + patience.

---

## What I can do right now

- ✅ **Batch-normalize the 3 Afrobeats Rain tracks to −14 LUFS** (lossless)
- ✅ **Generate both 3000×3000 square EP covers** (from the anchors, branded like the thumbnail)
- ✅ **Copy the 7 release WAVs into a clean `dist/` upload folder** with public-facing filenames so you're not hunting through `tmp/`
- ✅ Draft the **Apple Music** notes / the **curator email** filled in for these specific tracks
