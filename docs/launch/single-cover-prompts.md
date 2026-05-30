# Single Cover Prompts — 7 Distinct Scenes (Ideogram 3.0)

**Goal:** a UNIQUE cover per single, all unmistakably Harmattan Sessions. Solves the "recolored duplicate" problem — same character (Akua), same painterly Ghibli look, but a different Accra micro-scene per track so the artist page reads as a real catalog, not a content farm.

## How to generate each one

1. In Ideogram 3.0, **upload `public/visuals/stills/afro-lofi-anchor-v1.png` as Style Reference** (locks Akua, palette, grain, painterly look)
2. Paste the scene prompt below
3. **Settings:** Aspect **1:1** · Style Type **Anime** · Magic Prompt **OFF** · Model **3.0** · Quality
4. Generate 4, pick the best, **upscale**, export ≥ 3000×3000
5. Title lockup: add the track name in **Fraunces** + "HARMATTAN SESSIONS" in **DM Sans** afterward (or re-run `scripts/make-single-covers.py` pointed at the new base — but text-in-Ideogram is unreliable, prefer the script overlay)

## The Akua character block (paste into EVERY prompt)

```
young Ghanaian woman, late teens/early 20s, deep dark brown West African skin (NOT light-skinned, NOT olive, NOT tan), natural Black hair in locs with small colorful beads, large gold over-ear headphones, cream oversized hoodie, viewed from behind or 3/4 back-view, painterly Studio Ghibli aesthetic, warm film grain
```

---

## AFRO-LOFI singles (4)

### 1. Labadi Sunset  *(June — flagship)*
```
[Akua block] sitting on warm sand at Labadi Beach, Accra, facing the Atlantic at golden hour, gentle waves, a few fishing boats on the horizon, palm trees leaning, distant beach umbrellas, warm orange and gold sunset light, hazy coastal glow, square composition, negative space lower-left for title
```
Mood: warm, hazy, coastal daydream. Tint reference: orange/gold.

### 2. Aburi Climb  *(August)*
```
[Akua block] sitting on a stone ledge on a winding road in the Aburi Hills above Accra, looking out over green forested valley descending to the distant city and coastline, cool morning mist between ridges, dappled light, hopeful ascending mood, lush greens with warm gold accent, square composition, negative space lower-left for title
```
Mood: hopeful, upward, fresh. Tint reference: green/gold.

### 3. Trotro Window  *(December)*
```
[Akua block] seated inside a trotro minibus at night, looking out the window at blurred Accra street lights, neon shop signs, motion-soft cityscape passing, warm interior glow against cool blue night exterior, raindrops on the glass, intimate observational late-night mood, square composition, negative space lower-left for title
```
Mood: melancholic, night-drive, observational. Tint reference: blue night + warm interior.

### 4. Sunday Morning Light  *(October)*
```
[Akua block] sitting by an open window in a sunlit Accra room on a bright Sunday morning, sheer curtains glowing, potted plants, soft warm sunlight streaming in, a cup of tea on the sill, calm hopeful major-key warmth, bright cream and honey tones, square composition, negative space lower-left for title
```
Mood: bright, warm, hopeful (don't tip saccharine). Tint reference: cream/honey.

---

## AFROBEATS RAIN singles (3)  — sleep, darker/cooler

> For these, Style Reference still = the afro-lofi anchor for character consistency, but ADD cool negative anchors so it doesn't pull warm/sunset: append `muted indigo and deep blue night palette, NOT bright, NOT sunset, low contrast, hushed`.

### 5. Heartbeat  *(November)*
```
[Akua block, drifting to a t-shirt] lying back peacefully eyes closed in a dim Accra bedroom at night, soft single warm lamp, a kente throw, gentle rain streaking the dark window, distant blurred city lights, deeply calm lullaby stillness, muted indigo and deep blue night palette, NOT bright, NOT sunset, low contrast, hushed, square composition, negative space lower-left for title
```
Mood: intimate, lullaby, still. Tint: indigo/warm-lamp.

### 6. 3 AM  *(September)*
```
[Akua block, t-shirt] asleep curled in bed in a very dark Accra bedroom at 3am, almost no light except faint cool moonglow and distant streetlights through heavy rain on the window, deep shadow, profound quiet, almost monochrome deep indigo and charcoal, NOT bright, NOT sunset, very low contrast, square composition, negative space lower-left for title
```
Mood: deepest sleep, near-silent, dark. Tint: charcoal/indigo.

### 7. Volta Sleep  *(July)*
```
[Akua block, t-shirt] resting by a window overlooking the Volta River at night, calm dark water reflecting faint moonlight, gentle rain on the river surface, distant riverbank silhouettes, slow-current serenity, deep teal and indigo water palette, NOT bright, NOT sunset, low contrast, peaceful, square composition, negative space lower-left for title
```
Mood: watery, flowing, serene. Tint: teal/indigo.

---

## Consistency checklist (per cover before accepting)

- [ ] Akua's **deep dark brown skin** held (reroll if lightened)
- [ ] Locs + gold headphones present (the recognizability anchors)
- [ ] Distinct **scene** from the other 6 (the whole point)
- [ ] Painterly Ghibli look matches the anchor (Style Reference doing its job)
- [ ] Square, with clear negative space for the title lockup
- [ ] Final export ≥ 3000×3000 for DistroKid

## Fallback
The recolored placeholders in `Downloads/hs-single-covers/` exist if a deadline hits before a distinct cover is ready — but every effort should be the distinct version. Distinct art per single is a Law 3 (brand discipline) + anti-spam requirement.
