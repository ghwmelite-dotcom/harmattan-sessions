# Suno Launch-Prompt Batch — Week 1

> **Goal:** Generate **the first ~20 keeper tracks** across the 8 sounds in 3 focused Suno sessions, hitting Phase-0 exit criteria ("first 20 tracks generated and triaged" + "first 1 mix uploaded as soft launch"). Curated from `.claude/skills/harmattan-music-craft/assets/prompt-templates.md` + 4 new Accra-anchored variations, sequenced for retention impact and watch-hour leverage.
>
> **Three Laws apply to every track** — Cultural Authenticity (Law 1), Transformative Production (Law 2), Brand Discipline (Law 3). A Suno generation is *raw material*. The mixing pass, field-recording layer, and QC are non-negotiable before anything ships.

---

## How to use this batch

**Each prompt is a Suno Custom Mode "Style of Music" block.** Workflow per generation:

1. Suno → **Custom Mode**
2. **Style of Music:** paste the block exactly (≤300 chars).
3. **Lyrics:** `[Instrumental]`
4. **Title:** pick one from the *Title suggestions* (you can rename after).
5. Generate → review **both** versions.
6. **Triage immediately** (don't queue more before listening): Keep / Reroll / Cull.
7. For Keepers → use **Extend** 2–3× to reach 4–6 minutes, then save **WAV**.

**Reroll rule:** if neither version hits, try the prompt ONCE more (~30% wins). If still no, tweak ONE component (BPM −5, add `vinyl crackle`, change reference) — don't rewrite. After 3 strikes, kill the prompt and move on.

---

## Generation Order — three sessions, ~22 prompts, ~44 raw tracks

The order is deliberate: the workhorse (Afro-Lofi) and the sleep specialist (Afrobeats Rain) come **first** because they drive the YPP watch-hour math fastest (per `monetization-fast-track.md` — a 3-hr sleep mix needs only ~1,333 complete views to log 4,000 hours). The cultural-moat sounds come second to anchor the brand. The premium/lounge sounds come third for catalog breadth.

### Session 1 — Volume & Watch Hours (Day 1, ~7 prompts)
Goal: lock the two highest-leverage sounds.
1. Afro-Lofi · **Labadi Sunset** (1.1)
2. Afro-Lofi · **Trotro Window** (1.3)
3. Afro-Lofi · **Aburi Climb** *(NEW)*
4. Afro-Lofi · **Sunday Morning Light** (1.5)
5. Afrobeats Rain · **Heartbeat Rain** (8.1)
6. Afrobeats Rain · **3AM Rain** (8.4)
7. Afrobeats Rain · **Volta Sleep** *(NEW)*

### Session 2 — The Cultural Moat (Day 2, ~6 prompts)
Goal: ground the brand in Ghana's actual music heritage.
8. Highlife Chill · **Palmwine Evening** (2.1)
9. Highlife Chill · **Osu After Rain** (2.3)
10. Highlife Chill · **Jamestown Lighthouse** *(NEW)*
11. Ancestral Ambient · **Sankofa** (7.1) — *handle with reverence; read the cultural caution below*
12. Ancestral Ambient · **Aburi Mountain** (7.3)
13. Afro-Soul Sunset · **Labone Dawn** *(NEW)*

### Session 3 — Lounge & Premium (Day 3, ~9 prompts)
Goal: catalog breadth for Spotify editorial + lounge/dinner placements.
14. Amapiano Lounge · **Slow Log Drums at Dusk** (3.1)
15. Amapiano Lounge · **Hotel Lobby** (3.3)
16. Amapiano Lounge · **Night Drive N1** (3.5)
17. Afro-Soul Sunset · **Tema Coastline** (4.1)
18. Afro-Soul Sunset · **Midnight in Accra** (4.3)
19. Afro-Jazz Lounge · **Saxophone Over Korle Lagoon** (5.2)
20. Afro-Jazz Lounge · **Smoky Room in Jamestown** (5.1)
21. Coastal Afro-House · **Senya Beach 5AM** (6.1)
22. Coastal Afro-House · **Spa at Senya** (6.4)

**Expected output after culling:** ~20 keepers from ~44 generations (45% keep-rate is normal for a launch batch; the reject-rate metric is itself a quality signal — track it).

---

## The Prompts

### Afro-Lofi · the workhorse (4 prompts)

#### 1. Labadi Sunset
```
afro lofi, mellow afrobeat groove, soft kick, brushed shakers, jazzy electric piano, warm sub bass, vinyl crackle, 75 bpm, sunset vibe, instrumental, no vocals, Sarz x Tay Iwar style, chill, hazy
```
- **Title suggestions:** Labadi Sunset · Golden Hour Drive · Coastal Daydream
- **Listen for:** Is the kick *afrobeat* (one-drop, kick on 1, snare on 3) — NOT generic boom-bap? If you can't hear "this is African," reroll with `west african` added.

#### 2. Trotro Window
```
afro lofi, soft afrobeat percussion, muted brass stabs distant, jazzy piano chords, lo-fi compression, vinyl warmth, 78 bpm, late night observational, instrumental, no vocals, alte downtempo, nigerian alternative
```
- **Title suggestions:** Trotro Window · 2AM in Osu · Night Drive Spintex
- **Listen for:** A "looking out a window" emotional arc — slightly melancholic, not maudlin.

#### 3. Aburi Climb *(NEW)*
```
afro lofi, ascending afrobeat groove, soft kick on 1, brushed shakers, warm Rhodes melody climbing, mellow bass walking up, light vinyl crackle, 77 bpm, hopeful upward, instrumental, no vocals, Sarz inspired, mountain air
```
- **Title suggestions:** Aburi Climb · Up to the Hills · Mountain Drive
- **Listen for:** A subtle melodic ascension across the loop (Rhodes line climbing). If it stays flat, add `melodic motion upward` and reroll.

#### 4. Sunday Morning Light
```
afro lofi, warm afrobeat groove, soft kick, light hi-hats, bright electric piano melody, mellow bass, light vinyl crackle, 76 bpm, hopeful, morning vibe, instrumental, no vocals, contemporary west african chill
```
- **Title suggestions:** Sunday Morning Light · Akwaaba Sunrise · Bright Slow
- **Listen for:** Major-key warmth without saccharine; if it tips sweet, swap to `mellow minor key` and reroll.

### Afrobeats Rain · the sleep specialist (3 prompts — watch-hours engine)

#### 5. Heartbeat Rain
```
afrobeats ambient, very slow tempo, soft talking drum heartbeat, mellow kalimba, warm pads, gentle rain sounds throughout, 55 bpm, sleep, meditation, instrumental, no vocals, deep relaxation, African ambient lullaby
```
- **Title suggestions:** Rain on Kente · Heartbeat Rain · Mother Wind
- **Listen for:** The talking drum *pulse* — it must feel like a heartbeat, not a beat. If it sounds rhythmic-musical, lower BPM to 53 and add `extremely sparse`.

#### 6. 3AM Rain
```
deep sleep afrobeats, very slow talking drum, distant kalimba, warm drone pad, steady gentle rain, 55 bpm, 3am, deep sleep, instrumental, no vocals, slow heart, peaceful
```
- **Title suggestions:** 3AM Rain · Deep Hours · Slow Heart
- **Listen for:** Zero "musical events" in the first 60s — it should feel like ambience, not a track.

#### 7. Volta Sleep *(NEW)*
```
ambient west african, very gentle talking drum pulse, distant kora, soft mbira, warm drone pad, gentle rain on river surface, 56 bpm, deep sleep, instrumental, no vocals, slow current, peaceful
```
- **Title suggestions:** Volta Sleep · Slow Current · Rain on the River
- **Listen for:** "Water" tonality — the pad should suggest moving water. **Important:** Suno usually won't add convincing rain; you'll layer your own Volta river field recording over the top in Audacity.

### Highlife Chill · the cultural moat (3 prompts)

#### 8. Palmwine Evening
```
chilled highlife, clean palmwine guitar fingerpicking, soft conga, mellow upright bass, jazz piano comping, brush drums, 82 bpm, nostalgic, Accra evening, instrumental, no vocals, Pat Thomas inspired, golden hour
```
- **Title suggestions:** Palmwine Evening · Old Accra · Memory of Korle
- **Listen for:** The palmwine guitar pattern is the make-or-break. If it sounds Caribbean/reggae, add `west african highlife syncopation`, NOT `tropical`.

#### 9. Osu After Rain
```
highlife lofi, soft palmwine guitar pattern, mellow horns far away, warm Rhodes, gentle conga, vinyl crackle, distant rain ambience, 78 bpm, instrumental, no vocals, rainy Accra evening, sophisticated chill
```
- **Title suggestions:** Osu After Rain · Ridge in the Rain · Wet Tarmac
- **Listen for:** Slight tape saturation, room ambience — that vintage Ghanaian-recording feel.

#### 10. Jamestown Lighthouse *(NEW)*
```
slow highlife, clean fingerpicked guitar with answer phrases, soft conga, walking upright bass, mellow trumpet phrases, brushed drums, light shaker, 80 bpm, coastal nostalgia, instrumental, no vocals, Ebo Taylor influence, vintage Accra
```
- **Title suggestions:** Jamestown Lighthouse · Fishing District Slow · Old Coast
- **Listen for:** "Answer phrases" between guitar and horn — the call-and-response of classic highlife. If they don't talk to each other, add `call and response melodic conversation`.

### Ancestral Ambient · the sacred sound (2 prompts)

> **Cultural caution (read before generating):** This sound touches sacred territory. Don't title tracks in Twi/Akan/Ewe you don't speak (Ozzy: use Ghanaian English you actually use). Don't claim griot lineage. Position as "ambient music inspired by West African traditions, with deep reverence for the masters." See `references/genre-deep-dives.md` §7.

#### 11. Sankofa
```
african ambient, solo kora melody, soft mbira, distant kpanlogo drums, gentle strings, pentatonic phrasing, 60 bpm, meditative, ceremonial, ancestral, instrumental, no vocals, Toumani Diabate ambient
```
- **Title suggestions:** Sankofa · Returning Home · The Bird Looking Back
- **Listen for:** Genuine **pentatonic** phrasing (not Western major scale). If the melody sits on Western major, add `west african pentatonic, NOT major scale`.

#### 12. Aburi Mountain
```
ancestral ambient, gentle kora, soft kalimba, sustained pads, distant percussion, pentatonic melody, 58 bpm, hills, contemplative, instrumental, no vocals, Ali Farka Toure inspired, blues touch
```
- **Title suggestions:** Aburi Mountain · Hill Country · Distant Hills
- **Listen for:** The kora must sound like a kora (plucked, resonant) — not a generic harp. If it sounds harp-like, add `kora not harp, west african harp-lute, plucked 21-string`.

### Afro-Soul Sunset · the mainstream-ready sound (3 prompts)

#### 13. Labone Dawn *(NEW)*
```
afro soul slow, sparse afrobeat drums, warm fender Rhodes, soft saxophone fills, sustained pads, walking bass, 70 bpm, dawn light, reflective hopeful, instrumental, no vocals, Tems x Bloody Civilian downtempo, residential morning
```
- **Title suggestions:** Labone Dawn · 6AM Slow · Morning in the Garden
- **Listen for:** The Rhodes warmth — must feel late-90s/early-2000s soul-room, not modern plugin clean.

#### 14. Tema Coastline
```
afro soul, slow afrobeat groove, soft drums, warm electric piano, lush sustained pads, sub bass, 70 bpm, romantic, sunset, instrumental, no vocals, Tems style downtempo, dreamy, mood
```
- **Title suggestions:** Tema Coastline · Slow Tide · Soul of the Sea
- **Listen for:** The shaker pattern — if it disappears, the track loses its Afrobeats DNA. Re-emphasize `afrobeat shaker pattern continuous` on reroll.

#### 15. Midnight in Accra
```
afro soul ambient, slow afrobeat percussion, warm bass, electric piano, jazzy guitar accents, soft pads, 65 bpm, late night, sensual, instrumental, no vocals, Asake downtempo style, neon city
```
- **Title suggestions:** Midnight in Accra · Slow Hours · Neon and Velvet
- **Listen for:** Patience — even at 65 BPM, the groove must feel **alive**, not draggy.

### Amapiano Lounge · Spotify editorial-ready (3 prompts)

#### 16. Slow Log Drums at Dusk
```
slow amapiano, deep log drums, jazzy piano chords, soft shakers, warm sub bass, mellow pads, 105 bpm, lounge, sophisticated, instrumental, no vocals, Kabza De Small downtempo, sunset, south african
```
- **Title suggestions:** Slow Log Drums at Dusk · Joburg Sunset · Amapiano Lounge
- **Listen for:** **Log drums, not 808s.** This is the genre signature. If it sounds like trap, add `south african log drums NOT 808 NOT trap` and reroll. Suno often pushes BPM past 108 — pin it explicitly.

#### 17. Hotel Lobby
```
chill amapiano, slow log drums, smooth saxophone hints, jazzy piano, warm pads, soft percussion, 100 bpm, hotel lounge, sophisticated, instrumental, no vocals, dinner music, elegant, downtempo
```
- **Title suggestions:** Accra Hotel Lobby · The Wharf Lounge · Slow Service
- **Listen for:** Sax must feel breath-real (audible attack), not synthy.

#### 18. Night Drive N1
```
night amapiano, deep log drums, dreamy piano, sustained pads, soft hi-hats, warm sub bass, 104 bpm, late night driving, contemplative, instrumental, no vocals, sophisticated, joburg style
```
- **Title suggestions:** Night Drive N1 · Headlights · Slow Highway

### Afro-Jazz Lounge · the dinner/premium sound (2 prompts)

#### 19. Saxophone Over Korle Lagoon
```
afro jazz lounge, soft saxophone melody, brushed jazz drums, warm upright bass, mellow piano, light conga, 82 bpm, sunset, elegant, instrumental, no vocals, dinner music, sophisticated chill
```
- **Title suggestions:** Saxophone Over Korle Lagoon · Sunset Set · Sax & Salt
- **Listen for:** Sophistication in the chord changes (proper jazz harmony, not "jazz-ish"). If chords stay diatonic, add `7th and 9th chord voicings, jazz harmony`.

#### 20. Smoky Room in Jamestown
```
afro jazz, soft brushed drums, walking upright bass, muted trumpet melody, electric piano, kalimba accents, 85 bpm, smoky, lounge, instrumental, no vocals, Fela slow jam reimagined, sophisticated
```
- **Title suggestions:** Smoky Room in Jamestown · Late Set · Trumpet at Dusk
- **Listen for:** Restraint — if it raises its voice, demote to b-roll.

### Coastal Afro-House · wellness/yoga (2 prompts)

#### 21. Senya Beach 5AM
```
deep afro house chill, slow 4-on-floor kick, marimba melody, warm analog pads, ocean wave ambience, soft percussion, 102 bpm, sunrise, instrumental, no vocals, Black Coffee downtempo, ethereal
```
- **Title suggestions:** Senya Beach 5AM · Sunrise Deep · Coastal Awakening
- **Listen for:** Kick is **felt**, not punched. If it dominates, add `very soft kick, sub-felt only`.

#### 22. Spa at Senya
```
ambient afro house, very soft kick, melodic marimba, warm pads, gentle congas, 100 bpm, spa, meditative, instrumental, no vocals, Keinemusik influenced, wellness, calm
```
- **Title suggestions:** Spa at Senya · Slow Breath · Salt Water Healing
- **Listen for:** Meditation-adjacent — if you can't imagine it in a yoga studio, push softer with `barely-there kick`.

---

## After Generation — the triage checklist

For each Keeper before it earns a release slot, run the **Award-Quality Bar** from `SKILL.md`:

- [ ] Has a recognizable cultural element from Law 1 (palmwine guitar, log drums, talking drum, kora, afrobeat shaker, pentatonic phrasing, highlife horn stab)
- [ ] Has a distinctive hook identifiable in <10 seconds
- [ ] Will be mixed/mastered to −14 LUFS, ≤−1 dBFS true peak (mixing pass to come)
- [ ] Has a dynamic emotional arc (intro → development → resolution)
- [ ] Sits convincingly next to a chart Afrobeats track in the same playlist
- [ ] Would survive a Spotify editorial curator's monitor
- [ ] Carries some Harmattan-unique sonic signature

Fail one → demote to **b-roll for Shorts** or **stem for layering**. Never force a marginal track onto the release calendar.

**Then for the first compilation (the soft-launch mix):**
- Pick 6–8 keepers from one sound (Afro-Lofi recommended — fastest YPP path).
- Mix in Audacity per `references/mixing-mastering.md`.
- Layer a Labadi/Aburi/Volta field recording at −25 to −30 dB underneath (Law 2 — non-negotiable).
- Crossfade tracks 3–5 sec.
- Master to −14 LUFS, true peak −1 dBFS.
- QC on phone speaker AND headphones.

---

## Track your own winners

When a prompt produces a consistent keeper across multiple rerolls, **add it to `.claude/skills/harmattan-music-craft/assets/prompt-templates.md`** under the appropriate sound, dated and credited. The library is meant to grow with the catalog.

---

## Self-critique (one line, honest)

**This could fail because** Suno's seed variance means even strong prompts produce inconsistent keepers, and the reject-rate may push the first 20 keepers past Day 3 — *mitigation:* if Session 1's keep-rate falls below 30%, stop generating and re-architect the failing prompts (don't burn credits on the same wording), and bias the soft launch toward whichever sound is producing the cleanest output rather than forcing the planned Afro-Lofi launch mix.
