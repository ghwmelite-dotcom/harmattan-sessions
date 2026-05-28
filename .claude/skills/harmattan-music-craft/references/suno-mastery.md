# Suno Prompt Mastery — Reference

The complete prompt engineering guide for Suno v4.5+, tuned specifically for Harmattan Sessions' 8 sounds.

## The Suno Prompt Anatomy

A Suno Custom Mode prompt has 3 fields:

1. **Style of Music** — The main prompt (300 character limit). This is 90% of the result.
2. **Lyrics** — `[Instrumental]` for our use case (forces no vocals).
3. **Title** — Used as a hint; affects nothing musically but appears in your library.

## The 7-Component Prompt Formula

Every Harmattan Sessions Suno prompt follows this structure:

```
[GENRE_ANCHOR], [INSTRUMENTATION_LIST], [TEMPO], [KEY_OR_MOOD], [TEXTURE_TAGS], [REFERENCE_ARTIST], [INSTRUMENTAL_GUARD]
```

### Component 1 — Genre Anchor

The first 2-3 words set the entire model expectation. Use SPECIFIC genre terms:

- ✅ "afro lofi" — specific
- ✅ "chilled highlife" — specific
- ✅ "slow amapiano" — specific
- ❌ "African music" — too vague, model defaults to drum circles
- ❌ "chill beats" — too generic, defaults to Western lofi

### Component 2 — Instrumentation List

Be specific. The model assembles what you name:

**Highlife Chill instrumentation tags:**
- `clean palmwine guitar fingerpicking`
- `soft conga`
- `mellow upright bass`
- `jazz piano comping`
- `brushed jazz drums`
- `light shaker pattern`

**Afro-Lofi instrumentation tags:**
- `soft afrobeat kick pattern`
- `brushed shakers`
- `warm electric piano` or `Rhodes keys`
- `jazzy chords`
- `warm sub bass`
- `muted brass stabs` (optional accent)

**Amapiano instrumentation tags:**
- `deep log drums`
- `jazzy piano chords`
- `soft shakers`
- `warm sub bass`
- `mellow pads`

### Component 3 — Tempo

Always specify BPM. Suno respects it ~85% of the time:

- Afro-Lofi: 70-80 bpm
- Highlife Chill: 78-85 bpm
- Amapiano Lounge: 100-108 bpm (Suno often pushes higher — pin it)
- Afro-Soul Sunset: 65-72 bpm
- Afro-Jazz Lounge: 82-88 bpm
- Coastal Afro-House: 100-105 bpm
- Ancestral Ambient: 55-62 bpm
- Afrobeats Rain: 55-60 bpm

### Component 4 — Key or Mood

Pick one or both:
- Key: `A minor`, `D minor`, `F major`, `G minor pentatonic`
- Mood: `melancholic`, `hopeful`, `contemplative`, `romantic`, `ceremonial`, `sophisticated`

Mood is more reliable than key — Suno hallucinates keys sometimes.

### Component 5 — Texture Tags

Vibe modifiers that shape the production aesthetic:

- `vinyl crackle` — Adds lofi warmth
- `tape hiss` — Vintage feel
- `lo-fi compression` — Crunchier mids
- `warm analog` — Smoother
- `cinematic` — Wider stereo, more reverb
- `dusty` — Dimmer top end
- `hazy` — Wash of reverb on everything
- `intimate` — Closer mic feel
- `room ambience` — Natural space

### Component 6 — Reference Artist

A single reference artist locks the model into a sonic neighborhood. Curated list:

| Sound | Best References |
|---|---|
| Afro-Lofi | Sarz x Tay Iwar, Show Dem Camp, Ladipoe slow |
| Highlife Chill | Pat Thomas, Ebo Taylor, K. Frimpong, Daddy Lumba slow |
| Amapiano | Kabza De Small downtempo, DJ Maphorisa instrumentals |
| Afro-Soul | Tems, Joeboy slow, Bloody Civilian, Buju |
| Afro-Jazz | Mulatu Astatke, Fela slow jam, Sons of Kemet |
| Coastal House | Black Coffee, &ME deep, Keinemusik |
| Ancestral | Toumani Diabaté, Ali Farka Touré, Salif Keita acoustic |

⚠️ **Don't use overly famous current artists** ("Burna Boy", "Rema") — Suno will try to imitate vocals.

### Component 7 — Instrumental Guard

Always end with: `instrumental, no vocals, no drums` (if applicable). Suno LOVES adding vocals and surprise drums. The guard fights this.

For sounds with drums (Afro-Lofi, Highlife, Amapiano, Afrobeat): use `instrumental, no vocals`
For ambient (Ancestral, Afrobeats Rain): use `instrumental, no vocals, no drums`

## Anti-Patterns (Prompts That Fail)

### ❌ The Word Salad Prompt
> "African chill afrobeat highlife lofi hip-hop study music vibes mellow tropical sunset music for relaxing"

Why it fails: Too many genre tags confuse the model. Pick ONE primary genre, layer 2-3 modifiers max.

### ❌ The Vague Mood Prompt
> "chill african music for studying, nice and relaxing"

Why it fails: No instrumentation, no tempo, no reference. Model defaults to generic stock music.

### ❌ The "Recreate This Song" Prompt
> "Make a song just like Burna Boy's Common Person but instrumental"

Why it fails: Either fails copyright filter or produces something legally risky.

### ❌ The Verbose Description
> "A peaceful song about a quiet evening in Ghana where you can almost feel the warm breeze..."

Why it fails: Suno reads descriptions, not novels. Stick to tags and technical descriptors.

## The Reroll Strategy

Suno generates 2 versions per credit. Listen to BOTH. If neither hits:

1. **Same prompt, reroll once.** ~30% chance the second attempt nails it.
2. **Tweak ONE component.** Don't rewrite the whole prompt. Common winning tweaks:
   - Drop the BPM by 5
   - Add `vinyl crackle` or `tape hiss`
   - Change reference artist
   - Replace `instrumental, no vocals` with `instrumental, no vocals, no drums`
3. **If still nothing after 3 attempts** — the concept is wrong. Don't waste credits. Re-architect.

## Extending Tracks

After generating a track you like, use Suno's **Extend** feature:

- Click "Extend" on your favorite
- Suno generates additional sections matching the style
- Stack 2-3 extensions to reach 4-6 minutes
- Always cut the LAST 4 seconds (Suno often ends abruptly)

## Stem Extraction (Suno Premier feature)

When you upgrade to Suno Premier ($30/mo):

- Each track exports as 4-5 stems (drums, bass, melody, harmony, FX)
- Use stems to:
  - Create remix versions (drum-only, instrumental-only)
  - Layer with field recordings cleaner
  - Build longer compilations with less repetition
  - Cross-pollinate between tracks for unique blends

Don't upgrade until you have 30+ Pro-tier tracks tested. Premier pays off at scale.

## Genre-Specific Failure Modes

### Highlife Chill
- **Failure mode:** Suno renders as Caribbean reggae if "highlife" alone is the tag
- **Fix:** Add `palmwine guitar fingerpicking` explicitly
- **Failure mode:** Wrong rhythmic feel (4/4 instead of highlife syncopation)
- **Fix:** Add `west african` and reference Pat Thomas

### Amapiano
- **Failure mode:** Suno produces deep house, not amapiano
- **Fix:** Explicitly say `log drums` (the genre signature) and `south african`
- **Failure mode:** Vocals creep in even with [Instrumental]
- **Fix:** Add `dub-style instrumental amapiano` to the prompt

### Ancestral Ambient
- **Failure mode:** Renders as Western new-age music
- **Fix:** Explicitly name instruments — `kora`, `mbira`, `kpanlogo`
- **Failure mode:** Wrong scale (Western major instead of African pentatonic)
- **Fix:** Add `pentatonic phrasing` and reference Toumani Diabaté

### Afrobeats Rain
- **Failure mode:** Suno doesn't add rain even when requested
- **Fix:** Layer rain externally in Audacity. Just generate the music base in Suno.

## Master Prompt Library

For ready-to-use templates per sound, see `assets/prompt-templates.md`. Each template has 5+ variations tuned for different moods within the same genre.

## When to Break These Rules

This guide is opinionated. Sometimes breaking a rule produces a winner:

- A 4-tag minimal prompt occasionally beats a 7-component one
- Mixing 2 genres (e.g., "highlife meets amapiano") can produce signature tracks
- Adding a non-Western reference (e.g., "Bonobo style") for stretch experiments

Document any rule-breaking experiment in a `experiments/` directory. If it produces consistent winners, codify it as a new rule.
