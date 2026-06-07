# Session 2 (Theme A) — "Aburi Gardens in the Rain"

**Status:** PLANNED (not started). Target generation window: **now → mid-July 2026** (live Ghana rainy season).
**Type:** Themed rainy-season tentpole compilation + August single companion. Doubles as the *first half* of Session 2.
**Origin:** YouTube Studio → Inspiration tab (captured 2026-05-31). The algorithm surfaced an Aburi + rain + botanical-gardens demand cluster off the back of the "Aburi Climb" single and the Vol.1 upload. This doc converts that signal into an on-brand plan.

> **Why this exists:** YouTube *explicitly* showed demand for "Aburi", "rainy season", and "garden/botanical" chill. We own a single called Aburi Climb and an Ancestral Ambient "Aburi Hills" anchor already. Aburi Botanical Gardens (est. 1890, Akuapem Hills) is a real, iconic Ghanaian location — so this theme is Law-1 native, not a chase. It also pre-loads two unopened Session-2 sounds (Highlife, Ancestral).

---

## 1. The Inspiration signal — what we adopt vs reject (Three-Laws filter)

| Suggested theme (from YT Inspiration) | Verdict | Rationale |
|---|---|---|
| Aburi Palm Grove / Pavilion / Sculpture Garden | ✅ **FLAGSHIP** | Real Ghanaian place; ties to existing single; Law 1 native |
| Rainy Season / Storm / Drizzle / Downpour | ✅ **ADOPT** | Maps to Afrobeats Rain + Afro-Lofi; seasonally live; we own real Accra rain field recordings |
| Garden Study Sessions / Botanical focus | ✅ **ADOPT (recast)** | Reframe as *Aburi Gardens*, never generic "tropical garden" |
| Highland Mist / Mountain Slope Downpour | ✅ **ADOPT (recast)** | = the Akuapem/Aburi hills → pairs with Ancestral Ambient |
| Victorian Veranda / Colonial Architecture / Tea House | ❌ **REJECT** | Colonial-nostalgia framing fails Law 1 + cultural own-goal. If architecture is wanted later, recast to Jamestown / Ussher Fort / Osu |
| Bamboo Grove / generic "Tropical Chillhop" | ⚠️ **TAG-ONLY** | "tropical chillhop" allowed as a *secondary SEO tag*; never the cultural backbone. Bamboo grove dropped |

**Discipline note:** cap this vein at **one tentpole compilation + the August single**. Then pivot Session 2's back half to dry/sun-forward sounds (Coastal dawn, Amapiano blue-hour) so the catalog doesn't narrow into rain-only monotony.

---

## 2. The compilation — day→night arc (4 of the 8 sounds)

Same proven structure as "A Day in Accra" (`compilation-day-in-accra.md`). Target ~32–40 min, 4s scene crossfades, master −14 LUFS, true peak ≤ −1 dBTP.

| Slot | Time | Sound | Working title | Use case |
|---|---|---|---|---|
| 1 — Morning | 0:00 | **Afro-Lofi** | Misty Aburi Morning | Study / focus (highest watch) |
| 2 — Midday | ~8:00 | **Highlife Chill** | Palm Grove Palmwine | Cultural moat / premium |
| 3 — Dusk | ~16:00 | **Ancestral Ambient** | Aburi Hills Dusk | Meditation crossover |
| 4 — Night | ~24:00 | **Afrobeats Rain** | Aburi Pavilion Storm | Deep sleep (watch-hours) |

---

## 3. SUNO PROMPT PACK (Law 1 anchored, ≤300 chars, 7-component formula)

Generate ~5–6 per slot, keep ~45%, Extend keepers to 4–6 min, cut the last 4s. Reroll by tweaking ONE variable (BPM ±5, reference artist, or texture tag).

### How to run a slot (the loop, decoded)

A **slot** = one position in the compilation (Slot 1 = the Afro-Lofi morning track). The loop is a controlled funnel — **over-generate → ruthless QC → extend only the winner → isolate one variable when stuck** — NOT "generate until lucky."

1. **Generate ~5–6 takes.** In Suno, 1 credit = 1 generation = 2 takes (A/B). So ~3 credits → ~6 takes per slot. A whole 4-slot comp ≈ 12 credits (trivial against Pro's 500/mo). You're sculpting from a pool, not commissioning one track.
2. **Keep ~45%** (the Session-1 keep-rate, used as a sanity check, not a target). 6 takes → ~2–3 survive → pick **1 winner**. A take survives ONLY if it passes the Three-Laws QC on **headphones AND phone speaker**: Law 1 element clearly present (palmwine guitar / talking drum / kora / log drums — not generic lofi with an African name), right BPM + mood, no surprise vocals, no artifacts, and it dodges the genre traps (highlife ≠ Caribbean reggae; kora ≠ generic harp). Keeping 90% = standards slipped. Keeping 5% = the *prompt* is wrong, not your luck.
3. **Reroll by changing exactly ONE variable** so you learn what helped:
   - too rushed/draggy → **BPM ±5**
   - wrong sonic flavor → **reference artist** (Sarz → Tay Iwar)
   - wrong grit/vibe → **texture tag** (`vinyl crackle`, `tape hiss`, `hazy`)
   - vocals/drums creeping in → tighten the **guard** (`no vocals` → `no vocals, no drums`)
   - **Stopping rule:** 3 honest attempts with nothing keepable = the *concept* is wrong. Re-architect the prompt; don't keep rolling dice.
4. **Extend the winner to 4–6 min.** Raw takes are ~2–3 min. Pick FIRST, then click Suno's **Extend** (same seed/style) and stack 1–2 continuations. Never extend a take you're unsure about. Download **WAV** (lossless — MP3 can't be mixed cleanly).
5. **Cut the last ~4s** (in ffmpeg/Clipchamp). Suno tails often glitch or cut off abruptly — trimming gives a clean ending so the 4s scene crossfade into the next slot doesn't pop.

**Worked example — Slot 1 (Afro-Lofi · Misty Aburi Morning):**
> Paste prompt **1A**, Lyrics = `[Instrumental]`, run 3× → 6 takes (~3 credits). QC on headphones + phone → 3 survive. 1A's best is a touch busy → reroll with ONE tweak = prompt **1B** (Tay Iwar ref + `tape hiss`, 72 bpm) → it lands = **winner**. Extend once → ~4:30, download WAV. Trim last 4s → ready to crossfade into Slot 2. Repeat for Slots 2–4. Net: ~12 credits for the whole comp's raw material.

### Slot 1 — Afro-Lofi · "Misty Aburi Morning" (74 bpm, focus)

**1A — Primary**
```
afro lofi, soft afrobeat kick, brushed shakers, clean palmwine guitar fingerpicking, warm Rhodes keys, jazzy 9th chords, warm sub bass, 74 bpm, contemplative rainy, vinyl crackle, room ambience, Sarz x Tay Iwar style, instrumental, no vocals
```
**1B — Mistier / softer**
```
afro lofi, soft afrobeat kick, brushed shakers, mellow Rhodes, suspended jazzy chords, warm sub bass, muted brass stab, 72 bpm, hazy contemplative, vinyl crackle, tape hiss, rain ambience, Tay Iwar style, instrumental, no vocals
```
**1C — Hopeful lift (mid-track variety)**
```
afro lofi, soft afrobeat kick, light shakers, bright Rhodes keys, major 9th chords, warm bass, palmwine guitar accents, 76 bpm, hopeful morning, vinyl crackle, warm analog, Show Dem Camp style, instrumental, no vocals
```

### Slot 2 — Highlife Chill · "Palm Grove Palmwine" (82 bpm, nostalgic)

**2A — Primary (palmwine classic)**
```
chilled highlife, clean palmwine guitar fingerpicking, soft conga, mellow upright bass, jazz piano comping, light shaker, 82 bpm, nostalgic bittersweet, warm analog tape saturation, room ambience, Pat Thomas style, west african, instrumental, no vocals
```
**2B — Garden veranda**
```
chilled highlife, palmwine guitar fingerpicking, soft congas, walking upright bass, Rhodes comping, brushed drums, horn stab accents, 80 bpm, warm bittersweet, room ambience, Ebo Taylor style, west african, instrumental, no vocals
```
**2C — Rain-on-leaves slow cut**
```
chilled highlife, fingerpicked palmwine guitar, gentle conga, mellow upright bass, jazz piano, soft shaker, 78 bpm, reflective nostalgic, warm tape saturation, light rain ambience, K. Frimpong style, west african, instrumental, no vocals
```

### Slot 3 — Ancestral Ambient · "Aburi Hills Dusk" (58 bpm, sacred-adjacent)

> Cultural caution (Law 1): position as "ambient inspired by West African traditions," not ceremonial claim. No sacred symbols, no invented Twi/Ga titles.

**3A — Primary**
```
west african ambient, kora pentatonic phrasing, soft mbira, distant kpanlogo, sustained low drone pad, 58 bpm, contemplative reverent, hazy reverb, Toumani Diabate style, instrumental, no vocals, no drums
```
**3B — Misty hills**
```
west african ambient, fingerpicked kora, gentle kalimba, sustained warm drone, faint wind texture, 56 bpm, serene contemplative, deep reverb wash, Ali Farka Toure tone, pentatonic, instrumental, no vocals, no drums
```

### Slot 4 — Afrobeats Rain · "Aburi Pavilion Storm" (57 bpm, sleep)

> Rain is layered EXTERNALLY (your Accra field recording at −25 dB). Suno generates the music bed only.

**4A — Primary**
```
afrobeats rain, gentle talking drum heartbeat, sparse kalimba, sustained warm pad, deep sub drone, 57 bpm, safe secure mood, hazy intimate, instrumental, no vocals, no drums
```
**4B — Deeper / stormier bed**
```
afrobeats sleep ambient, soft talking drum pulse, minimal kalimba accent, wide sustained pad, low sub drone, 55 bpm, calm protected mood, warm hazy, deep reverb, instrumental, no vocals, no drums
```

---

## 4. COVER PROMPT PACK — Akua at the real Aburi Botanical Gardens

**Workflow (proven, per `single-cover-prompts.md` + memory):** Ideogram 3.0 · 1:1 · Style Type **Anime** · Magic Prompt **OFF** · Style Reference = `01-labadi-sunset` cover (best). **Prompt MUST start with the character block, then scene.** Accept-checklist before keeping: gold over-ear headphones ✅ · beaded locs ✅ · cream/sand oversized hoodie ✅ · **back-view (3/4 or full)** ✅ · deep dark brown skin ✅ · zoom ear cups + any signage for text glitches (sharp text = reject, motion-blur = ok) ✅. Process to 3000×3000 via `scripts/make-cover-square.py <src> <out> 0.5`.

**Shared character block (paste at the START of every cover prompt):**
```
young Ghanaian woman late teens, deep dark brown West African skin (NOT light-skinned, NOT olive, NOT tan), natural black locs with small colorful beads, cream oversized hoodie, large gold over-ear headphones, viewed from behind, back-view, anime style,
```

**Cover 1 — Afro-Lofi / Misty Aburi Morning**
```
…[character block]… sitting on a stone step under the famous royal palm avenue of Aburi Botanical Gardens at misty dawn, tall palms receding into fog, light rain on broad green leaves, sketchbook on lap, soft golden mist light, lush wet greenery, cinematic depth
```

**Cover 2 — Highlife Chill / Palm Grove Palmwine**
```
…[character block]… seated on a weathered wooden bench beside the giant strangler-fig arch in Aburi gardens, midday after rain, dripping leaves, warm dappled light through the canopy, a glass of palmwine beside her, nostalgic warm tones, rich green foliage
```

**Cover 3 — Ancestral Ambient / Aburi Hills Dusk**
```
…[character block]… standing at a hilltop clearing in the Akuapem hills above Aburi at dusk, single silhouetted baobab in the distance, low rolling mist over green valley, muted ash-gray and deep indigo palette (NOT vibrant, NOT bright sunset), reverent stillness, faint rain haze
```

**Cover 4 — Afrobeats Rain / Aburi Pavilion Storm**
```
…[character block]… sitting inside a wooden garden pavilion in Aburi during a night storm, heavy rain curtain beyond the railing, warm amber lantern glow on her, dark blue rainy night, water streaming off the roof eaves, cozy protected mood, soft bokeh of distant garden lights
```

**Cohesion note:** keep headphones ON in all four (same call as the Rain covers — cohesion over realism). Style Reference pulls warm; for Cover 3 add the explicit cool/negative anchors shown above or it will over-warm the dusk.

---

## 5. ANIMATION PROMPT PACK — subtle rain-motion loops

**Tool:** Veo 3.1 Lite ($300 credit unspent) for the 3 hero loops; Grok Imagine for B-roll. Veo 3.1 Lite = 4/6/8s clips, **no extend** — generate the longest (8s) and loop in ffmpeg (boomerang forward+reverse for seamlessness, the `afro-lofi-loop-26min.mp4` recipe).

**The 5 universal rules (unchanged, from `animation-prompts.md`):** no character movement · no camera movement · subtle environment only · loopable · no new objects. **Rain on leaves is the ideal subtle-motion subject** — perfect fit for these rules.

Feed each animation the matching still cover from §4 as the first frame.

**Anim 1 — Afro-Lofi / Misty Aburi Morning**
```
Static shot. Character does not move. Camera does not move. Only animate: fine rain falling steadily, mist drifting slowly between the palms, occasional droplet running down a broad leaf. Gentle, loopable, 8 seconds. No new objects, no people entering.
```

**Anim 2 — Highlife Chill / Palm Grove Palmwine**
```
Static shot. Character and camera completely still. Only animate: water dripping from the strangler-fig leaves, slow drift of dappled light through the canopy, faint steam rising off wet stone. Subtle, seamless loop, 8 seconds. No new objects.
```

**Anim 3 — Ancestral Ambient / Aburi Hills Dusk**
```
Static shot. No character or camera movement. Only animate: mist rolling very slowly over the valley, the distant baobab silhouette unchanged, faint rain haze shifting. Glacial, meditative, loopable, 8 seconds. No new objects, no birds.
```

**Anim 4 — Afrobeats Rain / Aburi Pavilion Storm**
```
Static shot. Character still, camera still. Only animate: heavy rain curtain falling beyond the railing, water streaming off the roof eaves, the amber lantern flame flickering gently, soft bokeh shimmer in the background. Cozy, loopable, 8 seconds. No new objects.
```

---

## 6. Calendar slotting

- **Now → mid-July 2026:** generate audio + covers + loops (live rainy-season window).
- **August 2026:** "Aburi Climb" is the scheduled August single (`singles-plan.md`). Drop this compilation as the **Day-7 YouTube companion** that month so single + tentpole reinforce each other.
- **Session 2 credit:** Highlife + Ancestral cuts here = the first two of the six unopened sounds, started early. Update `session-2-plan.md` to mark Highlife/Ancestral as in-progress once generation starts.
- **Field recording (Law 2):** if a true Aburi-gardens rain capture isn't feasible, the existing Bortianor/Accra rain beds are acceptable substitutes for launch; flag for a real Aburi capture on any future visit.

---

## 7. Self-critique

**Most likely failure mode:** over-indexing on the algorithm's rain theme narrows the channel and starves the four sun-forward sounds (Amapiano, Coastal, Afro-Soul, Afro-Jazz). **Mitigation:** hard cap = one compilation + the August single; Session 2's back half deliberately swings dry/bright. Secondary risk: Ideogram stripping Akua's signature elements on the new Aburi scenes (documented drift) — enforce the accept-checklist in §4 on every variant.

---

## Cross-reference
- Inspiration source: YouTube Studio screenshot 2026-05-31
- Compilation pattern: `docs/launch/compilation-day-in-accra.md`
- Session 2 master: `docs/launch/session-2-plan.md`
- Singles pipeline: `docs/launch/singles-plan.md`
- Cover workflow: `docs/launch/single-cover-prompts.md`
- Animation rules: `docs/launch/animation-prompts.md`
- Visual pipeline + character: `docs/launch/visual-pipeline.md`
- Skill references: `.claude/skills/harmattan-music-craft/references/{genre-deep-dives,suno-mastery,release-strategy}.md`
