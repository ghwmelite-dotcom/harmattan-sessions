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

### Track A — Recommended (FRIDAY SOFT-LAUNCH ready) — Ideogram still + Ken Burns

**Stack:** Ideogram 3.0 → CapCut.

1. In Ideogram, paste the matching prompt from §"Ideogram 3.0 still prompt pack" below (Afro-Lofi for the soft launch).
2. Settings (do this once, save as preset):
   - **Aspect Ratio: 16:9**
   - **Style Type: Anime** (or **Illustration** if Anime tips too saturated)
   - **Magic Prompt: OFF** (we want our exact prompt, no auto-expansion)
   - **Model: 3.0**
   - **Rendering: Quality** (paid plans only — worth it)
3. Generate at least 2 batches = 8 variations. Download the strongest at native 1920×1080 PNG.
4. In CapCut:
   - Import the PNG, stretch duration to your mix length
   - **Animation → Slow Zoom In** (Ken Burns) 1.0× → 1.08× over full duration
   - **Effect → Light → "Light Leaks"** 15–25% intensity
   - **Effect → Particle → "Dust"** 10–20% (sells the harmattan haze)
5. **Audio:** Suno track on A1 (or arranged multi-track with 3–5s crossfades); **field-recording WAV** (Labadi waves / Aburi wind) on A2 at **−25 dB** — Law 2 is non-negotiable.
6. **Sun Vinyl watermark** (`public/youtube/watermark-150.png`) bottom-right, 40% opacity.
7. **Title card** at start: e.g. "3 Hours of Afro-Lofi · Labadi Sunset" in Fraunces 96pt gold, 4-sec fade in + 4-sec fade out.
8. **Export** at 1080p / 30fps / H.264 / 8–12 Mbps.

Total time: ~30 minutes from Ideogram prompt to YouTube-ready video. Monetization-ready ✅ (motion visuals, field-recording, AI disclosure-ready). **Real painterly aesthetic, not SVG illustration.**

> The committed `public/visuals/afro-lofi-scene.svg` remains as a stop-gap fallback if Ideogram is unavailable. The Ideogram path is the recommended Track A — tenfold visual upgrade for ~30 minutes of work.

### Track B — V2 (within 1–2 weeks of soft-launch) — Ideogram still + Veo image-to-video

**Stack:** Ideogram 3.0 → Veo 3.1 Lite (**image-to-video** mode) → CapCut.

The Ideogram still from Track A becomes the **seed image** for Veo's image-to-video mode. This locks the painterly Ideogram style into the animation — you get a 5–10 sec loop that **maintains the exact look** of the still (vs Veo text-to-video, which would interpret each scene independently and break brand consistency across the catalog).

1. Use the same Ideogram still from Track A as your seed image.
2. In Veo 3.1 Lite, select **image-to-video** mode. Upload the PNG.
3. Paste the matching motion prompt from §"Veo 3.1 Lite — image-to-video motion prompts" below — short, focused on what moves (the image carries everything else).
4. Generate **3 variations** per scene. Pick the smoothest seamless loop. Veo outputs MP4 (typically 5–10 sec).
5. In CapCut: drop the MP4, right-click → **Loop / Repeat** to reach mix length, **3–5 sec crossfade** between loop repeats so the seam is invisible.
6. Everything else (audio, watermark, title card, export) is identical to Track A.

You have **$300 Veo credit**. Image-to-video runs are ~$1–$2 each (slightly more than text-to-video). 8 scenes × 3 attempts = ~$24–$48 of credit. Plenty of runway.

> **Why image-to-video over text-to-video:** text-to-video gives Veo full creative latitude per scene → 8 different visual interpretations across the catalog → inconsistent brand. Image-to-video locks the Ideogram style across all 8 scenes → uniform identity. This is the right move for a channel.

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

## Ideogram 3.0 still prompt pack — RECOMMENDED for stills

Tuned for **Ideogram 3.0** with **Aspect Ratio 16:9**, **Style Type: Anime** (fall back to **Illustration** if Anime is too saturated), **Magic Prompt: OFF**, **Model: 3.0**, **Rendering: Quality**. Each generation yields 4 variations — 2 batches (8 variations) per scene minimum. Save winners to `public/visuals/stills/<sound>-v1.png`.

### 1. Afro-Lofi · Osu Rooftop Sunset
```
A peaceful lofi anime illustration of a rooftop in Osu, Accra at golden hour. Wide cinematic composition looking out over the Atlantic Ocean. Two tall palm tree silhouettes frame the foreground left and right. The half-set sun glows warm gold on the horizon, casting a shimmering reflection on the gentle ocean. Distant Accra coastline lights twinkle softly. Subtle harmattan dust haze drifts across the scene. Warm dusk color palette: deep espresso brown, terracotta orange, harmattan gold, warm sand. Painterly Studio Ghibli atmosphere, soft brush strokes, romantic, nostalgic, atmospheric, cinematic. No people, no text, no watermark.
```

### 2. Highlife Chill · Palmwine Bar Interior
```
A warm intimate lofi anime illustration inside a vintage palmwine bar in Old Accra, Ghana. Golden hour light streams through an open doorway. Wooden bar counter in soft focus foreground, vintage palm-wine bottles in silhouette, a hanging vintage highlife record sleeve on the wall. Single warm tungsten bulb glows overhead. Faint candle on the bar with smoke curling slowly. Warm dusk color palette: espresso brown, terracotta orange, harmattan gold, warm wood tones. Painterly Studio Ghibli style, nostalgic vintage Ghanaian, atmospheric, cinematic. No people visible, no text, no watermark.
```

### 3. Amapiano Lounge · Accra Rooftop Terrace
```
A sophisticated lofi anime illustration of an empty rooftop terrace in Accra at blue hour. Tungsten string lights warmly glow across the foreground. A low modern sofa and a small table with a single drink in soft focus. The Accra cityscape spreads across the distant horizon in cool blue dusk. Faint city lights twinkle. Color palette: deep indigo, terracotta, harmattan gold, warm sand. Cool blue and warm gold contrast. Painterly Studio Ghibli style, sophisticated, atmospheric, cinematic. No people visible, no text, no watermark.
```

### 4. Afro-Soul Sunset · Tema Coastline Balcony
```
A romantic lofi anime illustration of a balcony overlooking the Tema coastline in Ghana at sunset. A sheer fabric curtain in the foreground billows softly in a warm breeze. Beyond it, the horizon glows rose-gold and the ocean is still and reflective. A single half-set sun. Soft focus, painterly, intimate mood. Warm dusk color palette: rose-gold, terracotta, harmattan gold, warm sand. Studio Ghibli atmosphere, romantic, nostalgic, cinematic. No people visible, no text, no watermark.
```

### 5. Afro-Jazz Lounge · Jamestown Smoky Bar
```
A smoky intimate lofi anime illustration of a jazz lounge interior in Jamestown, Accra, at night. A brass trumpet rests on a wooden chair in the foreground. A single hanging warm incandescent bulb pools light. Slow smoke from a candle curls in the air. A glass of pito on a table glows amber. Deep shadows. Warm dusk color palette: deep espresso brown, brass gold, terracotta accents, smoky amber. Painterly Studio Ghibli style, Mulatu Astatke album cover atmosphere, sophisticated, nostalgic, cinematic. No people visible, no text, no watermark.
```

### 6. Coastal Afro-House · Senya Beach at Dawn
```
A meditative lofi anime illustration of Senya Beach in Ghana at the first light of dawn. Wet sand in the foreground reflects the pale gold sky. A single small fishing boat in silhouette in the mid-frame. Gentle ocean swell rolls in slowly. Low mist hangs over the water. Faint pale gold light builds on the horizon. Cool dawn color palette with warm gold accent: deep teal blue, harmattan gold, terracotta horizon, soft cream. Painterly Studio Ghibli style, meditative, atmospheric, cinematic. No people visible, no text, no watermark.
```

### 7. Ancestral Ambient · Aburi Hills at Dusk
```
A reverent slow-breathing lofi anime illustration of the Aburi Hills in Ghana at dusk. Layered ridge silhouettes recede into mist. A single distant baobab tree silhouetted against the horizon. A faint orange ember of remaining sunlight on the highest ridge. Mist drifts slowly between the ridges. Very low contrast, muted painterly atmosphere. Color palette: muted ash gray, soft ember orange, harmattan gold accents, deep mist. Painterly Studio Ghibli style, Toumani Diabaté album cover atmosphere, contemplative, reverent, cinematic. No people visible, no text, no watermark.
```

### 8. Afrobeats Rain · Accra Bedroom Window 3 AM
```
A peaceful sleep-inducing lofi anime illustration of a bedroom in Accra at 3 AM. A window in the foreground with raindrops streaming down the glass. A bedside lamp glows warm and low. A kente patterned throw drapes across the bed in soft focus. Beyond the window, the city is barely visible through the rain — just a few warm distant lights. Cool blue rain and warm interior contrast. Color palette: warm interior amber and harmattan gold, cool blue exterior, deep espresso shadow. Painterly Studio Ghibli style, intimate, sleep-mix mood, nostalgic, cinematic. No people visible, no text, no watermark.
```

**Ideogram tips:**
- Too saturated? Switch **Style Type** from **Anime** → **Illustration** and re-generate.
- Too busy / over-detailed? Append `minimal, simple, atmospheric, lots of negative space` to the prompt.
- **For brand consistency across all 8:** pick your strongest Afro-Lofi result, **upload it as a Style Reference** on the next 7 generations. Ideogram propagates the painterly aesthetic across the catalog — this is the single biggest lever for unified visual identity.
- If Ideogram is rejecting "Studio Ghibli" as a brand-name reference, replace with `Hayao Miyazaki film aesthetic, painterly anime` or `Makoto Shinkai inspired painterly anime` — both produce the same look.

---

## Veo 3.1 Lite — image-to-video motion prompts (paired with Ideogram stills)

These motion prompts are short. The **image** (your Ideogram still) carries composition, lighting, palette, and style. The **motion prompt** describes only **what moves and how**. Upload the Ideogram PNG to Veo's image-to-video mode and paste these.

### 1. Afro-Lofi · Osu Rooftop Sunset (motion)
```
Subtle harmattan dust particles drift slowly left to right across the frame. Gentle ocean swell shimmers under the sunset reflection. Palm fronds sway gently in a warm evening breeze. Distant coastline lights twinkle softly. Locked-off camera, no pan or zoom. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 2. Highlife Chill · Palmwine Bar Interior (motion)
```
Slow candle flame flickers softly. Faint smoke curls upward and disperses. The hanging tungsten bulb sways almost imperceptibly. Warm golden light bleeds slightly stronger through the open doorway, then softens. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 3. Amapiano Lounge · Accra Rooftop Terrace (motion)
```
Tungsten string lights sway very gently in a soft evening breeze. Faint city lights twinkle in the distance. Subtle warm light bloom around the string lights. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 4. Afro-Soul Sunset · Tema Coastline Balcony (motion)
```
The sheer curtain in the foreground billows slowly and rhythmically in the warm breeze — soft, feminine, hypnotic motion. Faint sun shimmer on the still ocean beyond. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 5. Afro-Jazz Lounge · Jamestown Smoky Bar (motion)
```
Smoke from the candle curls slowly upward in elegant tendrils. The hanging incandescent bulb's light pulses very softly, barely noticeable. Faint glow shifts around the brass of the trumpet. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 6. Coastal Afro-House · Senya Beach at Dawn (motion)
```
Gentle ocean swell rolls in slowly toward the wet sand. Low mist drifts across the water from left to right. The fishing boat silhouette stays still. Faint warm dawn light gradually intensifies on the horizon. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 7. Ancestral Ambient · Aburi Hills at Dusk (motion)
```
Mist drifts very slowly between the ridges, left to right. The faint orange ember light on the highest ridge dims and brightens almost imperceptibly. The baobab silhouette stays still. Locked-off camera, no movement. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

### 8. Afrobeats Rain · Accra Bedroom Window 3 AM (motion)
```
Continuous gentle rain streams down the window glass. Raindrops accumulate, run, dissipate. The bedside lamp light flickers very softly. Distant city lights through the rain twinkle faintly. The kente throw stays still. Locked-off camera. Maintain exact painterly illustration style of the reference image, do not photorealize. Seamless 8-second loop.
```

**Veo image-to-video tip:** if a motion attempt breaks the visual style (the painterly look gets "smoothed out" into photorealism), reinforce with `do not change visual style, preserve illustration aesthetic, painterly` and cap **motion intensity at 5/10** in Veo's settings. Style preservation is more important than fancy motion — the audience watches a 3-hour mix, not a 5-sec showcase.

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
