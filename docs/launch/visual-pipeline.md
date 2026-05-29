# Visual Pipeline — Harmattan Sessions

**Source of truth for the brand's visual system.** This document supersedes the
earlier scene-only / "scene-per-sound, no people" framing (the prior version of
this file, which lives at the same path on `main` and is superseded on merge).
As of 2026-05-29 the visual identity is **character-led**: a single recurring
Ghanaian character anchors all 8 sound scenes, in the Lofi Girl model adapted to
Accra.

---

## The Pivot (why character-led, not scene-only)

The original spec called for faceless, scene-based art — abstract West African
settings with no people, with cultural authenticity (Law 1) carried by
instrumentation alone. Three Ideogram batches in Anime mode kept **adding
characters regardless of `no people` negative anchors** — the model fights the
faceless brief.

Rather than keep fighting the model, we pivoted to character-led. This solved
two problems at once:

1. **Technical** — the model stops fighting us; generations become consistent.
2. **Law 1 (Cultural Authenticity)** — the character *is* the cultural anchor.
   A young Ghanaian woman in an Accra setting carries West African identity more
   legibly than an abstract scene, and reinforces (not replaces) the
   instrumentation anchor.

The result is closer to the proven Lofi Girl playbook: one recognizable
character, rotating settings, instantly identifiable across a catalog.

---

## The Character — "Akua"

Internal name only (Akan, "born on Wednesday"). Like Lofi Girl, she can stay
unnamed in public marketing.

**Paste-able prompt block for any future generation:**

- Young Ghanaian woman, late teens / early 20s
- **Deep dark brown skin** (West African) — *critical:* always include negative
  anchors `NOT light-skinned, NOT olive, NOT tan` because Ideogram lightens by
  default
- Natural Black hair: locs with small colorful beads (signature element)
- Cream / sand **oversized hoodie** (drift to t-shirt acceptable for intimate
  interior scenes)
- Large **gold over-ear headphones** (echoes the Sun Gold palette)
- **Prop rotates per scene:** sketchbook / book / drink / trumpet / nothing
- **Always viewed from behind** (3/4 or full back-view) — sidesteps Ideogram's
  face-rendering weakness with Black characters

---

## Generation Workflow

In **Ideogram 3.0**:

1. Upload `public/visuals/stills/afro-lofi-anchor-v1.png` as a **Style
   Reference** (this is the master anchor; it locks palette, grain, and
   character consistency).
2. Write the scene prompt including the full character block above.
3. For cool-palette scenes (dawn, dusk), add explicit cool negative anchors —
   e.g. `muted ash gray, NOT vibrant, NOT bright sunset` — because the Style
   Reference pulls warm (the master anchor is a sunset).

**Settings:** Aspect `16:9` · Style Type **Anime** · Magic Prompt **OFF** ·
Model **3.0** · Quality rendering.

---

## The 8 Anchors (locked 2026-05-29)

All saved at `public/visuals/stills/{sound}-anchor-v1.png`.

| # | Sound | Anchor file | Scene | Prop |
|---|-------|-------------|-------|------|
| 1 | Afro-Lofi | `afro-lofi-anchor-v1.png` | Osu rooftop sunset (**master anchor**) | sketchbook |
| 2 | Highlife Chill | `highlife-chill-anchor-v1.png` | Palmwine bar interior | book |
| 3 | Amapiano Lounge | `amapiano-lounge-anchor-v1.png` | Rooftop terrace, blue hour | drink |
| 4 | Afro-Soul Sunset | `afro-soul-sunset-anchor-v1.png` | Tema balcony, billowing sheer curtain | none |
| 5 | Afro-Jazz Lounge | `afro-jazz-lounge-anchor-v1.png` | Jamestown coral booth, smoky | trumpet |
| 6 | Coastal Afro-House | `coastal-afro-house-anchor-v1.png` | Senya Beach dawn, fishing boat | none |
| 7 | Ancestral Ambient | `ancestral-ambient-anchor-v1.png` | Aburi Hills dusk, single baobab silhouette | none |
| 8 | Afrobeats Rain | `afrobeats-rain-anchor-v1.png` | Accra bedroom 3 AM, kente throw, rain on window | none (eyes closed) |

---

## Catalog Drift Notes (acceptable variation)

The catalog isn't pixel-identical, and that's fine — Lofi Girl varies too. Known
drifts, all judged acceptable:

- **Hoodie → t-shirt** on interior scenes (Afrobeats Rain) — contextually
  correct for 3 AM in bed.
- **Back-view → 3/4 profile** on some middle-catalog scenes (Sounds 2–6).
  Coastal Afro-House and Ancestral Ambient were re-anchored back to back-view;
  the 3/4 drift on the others is acceptable.
- **Warm pull** from the Style Reference required explicit cool negative anchors
  on the dawn (Coastal) and dusk (Ancestral) scenes.

---

## V1.1 — Motion

Each still anchor will be animated into a looping YouTube background. Prompts
(8 scenes × Grok + Veo 3 / 3.1 Lite = 16) live in
[`animation-prompts.md`](./animation-prompts.md).

The **5 universal animation rules**: no character movement · no camera movement ·
subtle environment only · loopable · no new objects. Generate post-launch
(7–14 days), then silent re-upload to YouTube as the motion version.

---

## File Naming Conventions

```
public/visuals/stills/{sound}-anchor-v{N}.png    # static anchors (V1)
public/visuals/motion/{sound}-loop-v{N}.mp4      # animated loops (V1.1)
```

Examples: `afro-lofi-anchor-v1.png`, `afro-soul-sunset-loop-v1.mp4`.

---

## Production Pipeline (still → motion → mix video)

Ranked options for getting from a locked anchor to an uploadable video:

- **Option A — Ideogram anchor → Veo 3.1 Lite image-to-video (RECOMMENDED, V1.1).**
  Lock the composition as the still anchor, then animate only what should move
  (smoke, light, water, dust, curtain) per [`animation-prompts.md`](./animation-prompts.md).
  Most control, least drift.
- **Option B — Static anchor + Ken Burns (FALLBACK, V1 launch).** Ideogram anchor
  + slow CapCut/Clipchamp zoom-pan. YouTube de-prioritizes static images, so this
  is launch-only; replace with Option A motion within 7–14 days.
- ~~Veo text-to-video (direct)~~ — deprecated; image-to-video off the locked
  anchor keeps the character consistent.

## Thumbnail System

- **1280×720**, same scene/character as the video, with a **text lockup**
- Title in **Fraunces 600**, sound name in **DM Sans**
- Sun Vinyl mark bottom-right at ~12% opacity
- Dusk-palette gradient scrim on the bottom third for text legibility
- Generate the base in **FLUX** (renders text more cleanly than Ideogram),
  framed on the locked anchor's scene with negative space top-left or bottom for
  the title. The 8 scene settings map 1:1 to the anchors in the table above.

## Mix-Video Assembly (CapCut / Clipchamp / DaVinci)

1. Import the looping clip (8–10s) — or the still for the V1 Ken Burns fallback
2. Loop/repeat to full mix length with ~1s crossfades between repetitions
3. Layer the mastered audio (−14 LUFS, true peak ≤ −1 dBFS)
4. Add a subtle film-grain overlay (4–8% opacity) for warmth
5. Export **1080p · H.264 · 24fps · audio AAC 320kbps**

## Sleep-Mix Overrides (Afrobeats Rain)

The 3 AM bedroom scene has its own visual playbook for the long sleep mixes:

- Even slower motion — barely-there rain, minimal light change.
- **60-second visual fade-in** (start near-black, resolve to scene) — never shock
  a sleeping viewer.
- **90-second visual fade-out** at the end.
- No on-screen text after the first 30 seconds.
- For 3–8 hour mixes, render **3–4 loop variants** and sequence them (see
  self-critique) rather than repeating one short loop thousands of times.

---

## Relationship to the Three Laws

- **Law 1 (Cultural Authenticity):** carried by *both* the character (Ghanaian,
  Accra settings) and the instrumentation. Belt and braces.
- **Law 3 (Brand Discipline):** one character, 8 scenes, shared Dusk palette
  (base `#0E0B08`; Sun Gold `#E8B04B`, Terracotta, Sand, Deep Brown, Muted
  Green), consistent film grain, Sun Vinyl watermark on every frame
  (bottom-right, low opacity), and Ken Burns / subtle-motion language. The
  recurring character + locked scene-per-sound mapping is the moat — once a
  scene is locked for a sound, it doesn't change.

---

## Self-Critique

The biggest risk is **visual monotony across a long sleep mix** — a single
8-second loop repeated thousands of times reads as static, and YouTube's 2026
spam policy flags low-effort static-feeling content. *Mitigation:* render 3–4
loop variants per scene and sequence them, and/or add a very slow
(10-minute-cycle) color-temperature drift in post. Secondary risk is **character
drift** across the 8 anchors (skin-tone lightening, back-view → 3/4) —
*mitigation:* the locked anchors are the source of truth; always Style-Reference
`afro-lofi-anchor-v1.png` and re-apply the negative anchors when regenerating.
