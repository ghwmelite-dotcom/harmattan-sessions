# Visual Pipeline — Lofi-Girl-style identity for Harmattan Sessions

> **Goal:** An iconic, ownable visual identity for the YouTube channel — same emotional territory as **Lofi Girl** (instantly recognizable, atmospheric, ambient-aware), but adapted for **Afrobeat-chill / Accra**. One **scene per sound** (8 in total), unified by the Harmattan Dusk palette, the Sun Vinyl watermark, and a consistent visual grammar (silhouetted foreground · warm haze · soft particle texture · single hero light source).
>
> This doc covers: the eight scenes, the production pipeline (Veo 3.1 Lite → CapCut/DaVinci), prompt packs (Veo + FLUX), the minimum-viable soft-launch route (a static atmospheric still + Ken Burns motion — fully producible today), and brand-cohesion rules. Every reference here ties back to the locked Dusk tokens in `docs/superpowers/specs/2026-05-28-epic-01-website-foundation-design.md` §3.1.

---

## Why scene-per-sound (not single-character)

**Lofi Girl** has 1 character + a small set of backgrounds — works because Lofi Girl is **one genre**.

**Harmattan Sessions** has **8 sounds**, each with a distinct mood. A single mascot would have to perform 8 emotional registers (study, sleep, dinner, dance, meditate, lounge…) — visually thinner.

The **scene-per-sound** approach gives each sound its *own visual identity* while still feeling unified — the way Studio Ghibli films are clearly Ghibli even though every film has different settings. The unifiers are: **palette, light direction, foreground silhouette grammar, dust/haze treatment, Sun Vinyl watermark**. Brand cohesion comes from *grammar*, not from a recurring character.

**Optional later (Year 2):** introduce a recurring silhouetted figure (a young person on a rooftop, headphones on, sketchbook/laptop) appearing across scenes — *only* if it survives 6 months of catalog without feeling forced. Don't start with it. Don't force it.

---

## The eight scenes

Each scene is **16:9 (1920×1080)**, dominated by the **Dusk palette**, with one hero light source, silhouetted foreground, warm haze low-band, and faint dust grain over everything.

| Sound | Scene | Hero light | Silhouette foreground | Atmosphere |
|---|---|---|---|---|
| **Afro-Lofi** | Rooftop in Osu at sunset, palms over the Atlantic, Accra coastline in the distance | Half-set sun on horizon | Rooftop ledge, 2 palm trees | Warm gold + terracotta, harmattan haze |
| **Highlife Chill** | Palmwine bar interior, vintage hi-life record sleeve hanging, brass instruments on shelf | Candle + warm bulb | Wooden bar counter, bottles in silhouette | Smoke curl, golden hour bleed through doorway |
| **Amapiano Lounge** | Hotel rooftop terrace, Accra city lights, sofa in foreground | Tungsten string lights | Sofa, low table with drink | Cool blue dusk → city glow |
| **Afro-Soul Sunset** | Balcony overlooking Tema coastline, fabric curtain billowing | Setting sun behind sheer curtain | Curtain edge, distant horizon | Rose-gold, sheer-fabric soft focus |
| **Afro-Jazz Lounge** | Jamestown bar interior, brass trumpet on chair, smoke | Single hanging incandescent | Trumpet on chair, glass on table | Smoky orange, deep shadow |
| **Coastal Afro-House** | Senya Beach at dawn, ocean swell, mist | Pre-dawn pale gold | Wet sand, fishing boat | Cool teal + warm light gradient |
| **Ancestral Ambient** | Aburi Hills at dusk, mist between ridges, single tree | Distant orange ember | Ridge silhouettes, lone baobab | Mist layer, very low contrast |
| **Afrobeats Rain** | Bedroom window in Accra at 3 AM, kente throw on bed, rain on glass | Bedside warm lamp | Window frame, bed, kente | Cool blue rain + warm interior |

All eight scenes share:
- **Light direction:** warm (3000–4500K), low or single source
- **Silhouette palette:** near-black `#0E0B08` on the foreground
- **Haze low-band:** `#E8B04B` at ~5–8% opacity behind silhouettes
- **Dust grain:** `#E7DAC8` at ~7% opacity over the whole image
- **Sun Vinyl watermark:** small (~36 px), bottom-right, low opacity (~40%)

---

## Production pipeline (three tracks, by ambition)

### Track A — Minimum viable (FRIDAY SOFT-LAUNCH ready)

You already have what you need:

- `public/visuals/afro-lofi-scene.svg` — the Osu rooftop dusk scene, ready
- Rasterized PNG at 1920×1080 (committed in same folder)
- CapCut / DaVinci on your machine
- Suno audio for the mix

**Steps (≈ 15 minutes total):**

1. In CapCut, **Import** the PNG.
2. Drag onto timeline. Stretch its duration to match your mix audio (e.g. drag right edge to fill 30 min / 1 hr / 3 hr).
3. Apply effects:
   - **Animation → Slow Zoom In** (Ken Burns) — 0.5× to 1.05× over the full duration (very subtle).
   - **Effect → Light → "Light Leaks"** (soft warm overlay) at 15–25% intensity.
   - **Effect → Particle → "Dust" or "Embers"** at 10–20% intensity (sells the harmattan haze).
4. Drag the **Suno audio** onto the audio track. Trim to length.
5. (Optional, recommended) Layer the **field-recording WAV** (Labadi waves / Aburi wind) on a second audio track at **−25 dB** under the music. This is Law 2 — non-negotiable.
6. Add a small **Sun Vinyl PNG** in the bottom-right corner (use `public/youtube/watermark-150.png`), 40% opacity.
7. Add the **title text** at the start: e.g. "3 Hours of Afro-Lofi · Labadi Sunset" in **Fraunces** 96pt, gold, fades in/out over 4 sec.
8. **Export** at **1080p, 30fps, H.264, 8–12 Mbps**.

That's a monetization-ready video per `SKILL.md` → Fast-Monetization Bar: motion visuals ✅, field-recording layer ✅, brand-consistent thumbnail (to be made — see below) ✅.

### Track B — V2 (within 1–2 weeks of soft-launch)

Replace the Ken-Burns still with a real animated loop from **Veo 3.1 Lite**.

1. Use the Veo prompts in §"Veo prompt pack" below.
2. Generate a **5–10 second loop** per sound. Veo outputs MP4.
3. In CapCut, drop the loop in, **Loop / Repeat** it to mix length (or Ctrl+D duplicate-stretch).
4. Apply a **3–5 second crossfade** between loop repeats so the seam is invisible.
5. Everything else the same as Track A.

You have **$300 Veo credit free**. Each generation is ~$0.50–$1. Eight scenes × 3 attempts (best of) = ~$12–$24 of credit. Massive runway.

### Track C — V3 (Month 3+, scaling)

Once Veo credit runs out (or before, if cheaper):

- **Grok Imagine** ($12/mo) for ongoing loop generation
- **FLUX** (via fal.ai, pay-per-image) for thumbnails
- **DaVinci Resolve (Fairlight)** for audio mastering — replaces CapCut as audio gets sophisticated
- Optionally subscribe to **CapCut Pro** ($7/mo) for higher-quality export + AI scene continuity

---

## Veo 3.1 Lite prompt pack — 8 scenes, ready to paste

Each prompt is structured: **scene description → camera/motion → lighting → palette/atmosphere → style → loop-friendliness**. Aim for **8-second clips, 24fps, no camera cuts**, designed to loop seamlessly.

### 1. Afro-Lofi · Osu Rooftop Sunset
```
A peaceful, ambient looping animation of a rooftop in Osu, Accra at golden hour, looking out over the Atlantic Ocean. Two palm tree silhouettes frame the foreground left and right. The sun sets at the center horizon, casting a warm gold reflection on the gentle ocean. Distant Accra coastline lights twinkle softly. Slow harmattan dust particles drift left to right across the frame. No camera movement — locked-off shot. Warm Dusk palette: espresso, terracotta, harmattan gold, sand. Style: cinematic, lofi anime, painterly, slightly hazy, Studio Ghibli atmosphere. Eight-second seamless loop.
```

### 2. Highlife Chill · Palmwine Bar Interior
```
A warm, intimate ambient loop inside a palmwine bar in Old Accra, golden hour bleed coming through an open doorway. Wooden bar counter in soft focus foreground, glass bottles in silhouette, a vintage highlife record sleeve hanging on the wall. A single tungsten bulb glows warmly overhead. Faint smoke curls slowly from a candle. Sound of a guitar fingerpick implied. Locked-off shot, no camera movement. Warm Dusk palette + deep wood tones. Style: painterly, vintage Ghanaian album cover, lofi anime. Eight-second seamless loop.
```

### 3. Amapiano Lounge · Accra Rooftop Terrace
```
A sophisticated looping animation of an empty rooftop terrace in Accra at blue hour. Tungsten string lights warmly glow across the foreground. A low sofa and a small table with a single drink in soft focus. City lights of Accra spread across the distant horizon. Cool blue dusk gradient sky. A faint breeze gently moves the string lights. Locked-off shot, no camera movement. Dusk palette: deep indigo, brass, gold accents, sand. Style: cinematic, lofi anime, painterly, sophisticated. Eight-second seamless loop.
```

### 4. Afro-Soul Sunset · Tema Coastline Balcony
```
A romantic ambient loop of a balcony overlooking the Tema coastline at sunset. A sheer fabric curtain in the foreground billows softly in the warm breeze. Beyond it, the horizon glows rose-gold, the ocean still and reflective. A single half-set sun. Locked-off camera. Slow, gentle fabric motion. Soft focus, painterly. Warm Dusk palette: rose-gold, terracotta, harmattan gold, sand. Style: cinematic, lofi anime, painterly, intimate. Eight-second seamless loop.
```

### 5. Afro-Jazz Lounge · Jamestown Smoky Bar
```
A smoky, intimate jazz lounge interior in Jamestown, Accra, at night. A brass trumpet rests on a wooden chair in the foreground. A single hanging incandescent bulb pools warm light. Smoke from a candle on a table curls slowly. Glass of pito glows amber. No people visible — atmosphere is the subject. Locked-off camera. Style: painterly, lofi anime, Mulatu Astatke album cover aesthetic. Dusk palette: deep amber, brass, espresso shadow. Eight-second seamless loop.
```

### 6. Coastal Afro-House · Senya Beach Dawn
```
A meditative looping animation of Senya Beach at the very first light of dawn. Wet sand in the foreground reflects the sky. A single fishing boat in silhouette mid-frame. Gentle ocean swell rolls in slowly. Mist hangs low over the water. Faint pale-gold light building on the horizon. Locked-off camera. Style: cinematic, painterly, lofi anime, Black Coffee album cover energy. Cool dawn palette with warm gold accent. Eight-second seamless loop.
```

### 7. Ancestral Ambient · Aburi Hills at Dusk
```
A reverent, slow-breathing loop of the Aburi Hills at dusk. Layered ridge silhouettes recede into mist. A single distant tree (acacia or baobab) silhouetted against the horizon. A faint orange ember of remaining sunlight on the highest ridge. Mist drifts slowly between the ridges. Locked-off camera. Style: cinematic, painterly, very low contrast, Toumani Diabaté album cover. Dusk palette muted: ash, ember, fog. Eight-second seamless loop. Reverent and contemplative.
```

### 8. Afrobeats Rain · Accra Bedroom Window 3 AM
```
A peaceful, sleep-inducing looping animation of a bedroom in Accra at 3 AM. A window in the foreground with rain streaming down the glass. A bedside lamp glows warm and low. A kente patterned throw drapes across the bed in soft focus. Beyond the window, the city is barely visible through the rain — just a few warm distant lights. Slow continuous rain motion. Locked-off camera. Style: cinematic, painterly, lofi anime, intimate sleep-mix mood. Warm interior vs cool exterior contrast. Dusk palette + cool rain. Eight-second seamless loop.
```

**Veo workflow tip:** generate **3 variations per prompt** at minimum. Pick the smoothest seamless loop. If none of the 3 are right, tweak ONE element (e.g., add "no people present", "remove camera drift", "warmer lighting") — don't rewrite. Save winners to `public/visuals/loops/<sound>-v1.mp4` (gitignored if too large — keep on cloud).

---

## FLUX thumbnail prompt pack — 8 thumbnails, 1280×720

YouTube thumbnails are different from loops: **high contrast, strong focal point, readable at 320px width, brand-consistent**.

Format for each: scene PNG (1280×720) + title overlay (Fraunces 84pt gold, the mix length, the sound name) — assembled in Canva/Figma.

### 1. Afro-Lofi
```
Cinematic painterly thumbnail of a rooftop in Osu, Accra at golden hour. Two palm tree silhouettes frame the composition. Half-set sun in the center, warm reflection on the Atlantic. Distant Accra coastline. Warm Dusk palette: espresso, terracotta, harmattan gold, sand. Style: Studio Ghibli, lofi anime. No text — composition leaves empty negative space top-third for title overlay. 1280x720.
```
Repeat with each scene description from §"The eight scenes" — same format, FLUX takes 30 seconds per generation, ~$0.05 each.

---

## CapCut assembly recipe (mix-video, 30 min – 3 hr)

```
1. New Project → 1080p / 30fps / 16:9
2. Drop video asset on track V1 (PNG via Ken Burns OR Veo loop)
   - If PNG: stretch to mix length, then Animation → Slow Zoom (1.0→1.08 over full duration)
   - If Veo loop: drop on timeline, right-click → Loop until mix length, set 3s crossfade between loops
3. Drop Suno extended audio (4–6 min) on track A1, loop to mix length OR
   - For multi-track mixes: arrange tracks back-to-back, add 4 sec crossfade between each (Adjust → Audio → Crossfade)
4. Drop field-recording WAV on track A2 at -25 dB (Adjust → Audio → Volume → -25 dB)
5. Drop Sun Vinyl watermark PNG on V2, bottom-right, 40% opacity, persistent
6. Add Fraunces title text card at the start, 4-sec fade in + 4-sec fade out
7. Mix → Match Loudness → set target -14 LUFS (CapCut Pro feature; otherwise normalize via Audacity/Resolve later)
8. Export → 1080p / 30fps / H.264 / 8–12 Mbps / AAC stereo 192 kbps
9. (Optional) Drop the exported MP4 into HandBrake for a final size-quality pass before YouTube upload
```

For mixes ≥ 3 hours, you may need to render in DaVinci Resolve (free) instead of CapCut to handle the file length and memory cleanly. The Fairlight panel also gives proper -14 LUFS loudness normalization out of the box.

---

## Sleep-mix specific overrides (per `youtube-channel-kit.md`)

Different rules apply to Afrobeats Rain sleep mixes:

- **No abrupt visual changes.** Ken Burns or a single Veo loop only — no scene transitions, no flashes, no zooming-in beyond 1.05×.
- **No on-screen text** beyond a single intro card that fades out by second 30.
- **No end-screen elements** (they wake sleeping viewers).
- **60-sec gentle fade-in / 90-sec gentle fade-out** on both audio AND video.
- **No watermark visible during the mix** — only first 60 sec and last 60 sec.

---

## Brand cohesion rules (these are non-negotiable)

Across all 8 scenes / all uploads:

1. **Palette ONLY from the Dusk tokens** in the spec. No free-picked colors. Period.
2. **Sun Vinyl watermark, bottom-right, 40% opacity** on every long-form (except sleep mixes — see above).
3. **Fraunces 84–96pt for titles, gold (#E8B04B), centered, brief, no keyword-spam.**
4. **One hero light source per scene.** Two competing lights = visually noisy = not us.
5. **Foreground silhouettes always near-black** `#0E0B08`. The Dusk palette earns its drama from this contrast.
6. **Dust grain at 7% opacity everywhere** — the harmattan signature. Without it, the visual feels generic.
7. **No people-faces in v1.** Silhouettes only. Avoids the "AI-generated face" uncanny-valley flag, AND keeps the mood about *place* not *person*.

---

## Soft-launch fallback (use TODAY)

If Veo / FLUX feel like too much, **the Friday soft-launch can ship with**:
- `public/visuals/afro-lofi-scene.svg` (committed) → 1920×1080 PNG (committed)
- A 3-hour Afro-Lofi audio mix (mixed in Audacity from your Session 1 keepers + Labadi field-recording layer)
- CapCut: PNG + Ken Burns slow zoom + Dust particle effect + audio + watermark + title card
- ~30 min from start to YouTube-ready

V2 with Veo loops can ship Tuesday's mix the following week.

---

## Self-critique

**This could fail because** the Veo 3.1 Lite prompts above are *unvalidated against the model's current behavior* — I haven't run them in Veo, and video-gen models drift on subtle vibe direction. *Mitigation:* every prompt budgets for 3 generations, and the prompts are designed around concrete physical/optical elements (sun position, palm trees, rooftop, sheer curtain) that any decent video-gen model handles competently. The atmospheric direction ("Dusk palette," "Studio Ghibli," "lofi anime") is well-trained in current models. If a prompt produces nothing usable in 3 attempts, swap to Grok Imagine — different model lineage, often catches what Veo misses.

**Also:** the soft-launch Ken Burns fallback is genuinely "minimum viable" — it WILL look less impressive than a Lofi-Girl-grade loop. *Mitigation:* the rest of the channel package (audio quality, field recordings, title formula, channel branding, description AI-disclosure) does the heavy lifting on monetization-readiness; the visual gets you over the bar for now, and Veo loops come within 2 weeks.
