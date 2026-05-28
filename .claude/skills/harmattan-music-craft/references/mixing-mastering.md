# Mixing & Mastering — Reference

The transformative production layer that turns Suno raw output into release-quality tracks. This is what makes the difference between AI slop and award-quality music.

## The Mandatory Production Pipeline

Every track that goes public passes through this pipeline. No exceptions.

```
Suno raw export (WAV)
       ↓
1. Cleanup pass (remove artifacts, silence ends)
       ↓
2. EQ pass (correct frequency imbalances)
       ↓
3. Compression pass (control dynamics)
       ↓
4. Stereo imaging (width, depth)
       ↓
5. Saturation / coloring (genre-appropriate texture)
       ↓
6. Limiting (final loudness)
       ↓
7. Loudness normalization to -14 LUFS
       ↓
8. Export master + preview MP3
```

## Tool: Audacity (Free)

For Phase 1-2, Audacity handles everything. Here's the master chain to set up once:

### Audacity Master Chain Setup

1. **Cleanup**
   - Effect → Noise Reduction (sample profile from silence first)
   - Effect → Click Removal (for any vinyl-crackle simulation artifacts)
   - Trim ends — remove Suno's hard cutoffs

2. **EQ (Effect → Filter Curve EQ)**
   - High-pass filter at 30Hz (removes inaudible rumble)
   - Cut around 200-300Hz if "muddy" (~-2dB)
   - Cut around 2-4kHz if "harsh" (~-1.5dB)
   - Slight boost around 80-120Hz for body (+1dB max)
   - Slight boost around 10kHz for "air" (+1dB max)

3. **Compression (Effect → Compressor)**
   - Threshold: -18dB
   - Ratio: 2.5:1
   - Attack: 30ms
   - Release: 200ms
   - Makeup gain: +2dB

4. **Limiting (Effect → Limiter)**
   - Type: Soft Limit
   - Limit to: -1.0dB
   - Hold: 10ms

5. **Loudness Normalization**
   - Effect → Loudness Normalization
   - Normalize loudness to: -14 LUFS
   - Treat mono as dual-mono: ON

### Save as Audacity Macro

Tools → Macros → New → name it "HarmattanMaster"

Add all the above steps in order. Now you can apply the entire chain with one click on every track.

## Tool: DaVinci Resolve Fairlight (Free, More Advanced)

When you outgrow Audacity (around month 6), DaVinci's audio module is studio-grade and still free.

### Key advantages over Audacity:
- Real-time effect processing (no rendering each step)
- Better EQ tools (Fairlight EQ vs Audacity's curve)
- Built-in metering for LUFS monitoring
- Native loudness analysis
- Easier video sync (since you'll be doing video anyway)

### Standard chain in Fairlight:
1. **EQ (Channel EQ):** Surgical mid-cut, gentle highs lift
2. **Compressor:** Bus compressor settings
3. **De-Esser** if needed (for any vocal-like artifacts in Suno output)
4. **Limiter:** -1.0dB ceiling
5. **Loudness meter:** Verify -14 LUFS integrated

## The -14 LUFS Standard

Every streaming platform normalizes to -14 LUFS:
- Spotify: -14 LUFS (-11 for "Loud" setting users)
- Apple Music: -16 LUFS
- YouTube: -14 LUFS
- Tidal: -14 LUFS
- Amazon Music: -14 LUFS

**Why this matters:** If your master is -18 LUFS, Spotify boosts it +4dB. Quiet master = thinner sound. If your master is -10 LUFS, Spotify CUTS it -4dB. Loud master = compromised dynamics.

**The sweet spot is -14 LUFS integrated** with true peak no higher than -1dB. Match the standard, get the best playback.

### How to measure LUFS

In Audacity: Effect → Loudness Normalization → shows current LUFS reading
In DaVinci Fairlight: View → Loudness History (built-in meter)
Free standalone: Youlean Loudness Meter 2 (free VST, works in most DAWs)

## Genre-Specific Production Tweaks

### Afro-Lofi
- Add subtle vinyl crackle (-30dB)
- Roll off above 12kHz for "dustier" feel
- Slight low-pass around 12kHz at -1dB
- Mono-collapse bass below 100Hz for tightness

### Highlife Chill
- PRESERVE the guitar's natural top end
- Don't over-compress — let it breathe
- Add slight tape saturation (Audacity: Effect → Vinyl Recording)
- Room reverb if Suno gave it dry

### Amapiano Lounge
- DON'T cut the sub-bass — log drums need the low end
- Compress sidechain-style if possible (drums duck pad)
- Wide stereo on pads
- Mono kept on log drum bass

### Afro-Soul Sunset
- Lush reverb on pads (long hall, 3-4 sec)
- Bring up the kick a touch (this isn't lofi)
- De-ess any harsh consonant artifacts in synth voicings

### Afro-Jazz Lounge
- Brushed drums need natural ambience — don't dry it out
- Bass should be warm, slightly compressed
- Horn EQ: cut 250Hz (-2dB), boost 5kHz (+1dB) for clarity

### Coastal Afro-House
- Heavy sub-bass focus — verify on real speakers/subwoofer
- Side-chain the pad to the kick gently
- Reverb depth — feel of large outdoor space
- Layer in your ocean field recording during long buildups

### Ancestral Ambient
- VERY subtle processing — these tracks want to feel real
- Light reverb only
- Don't over-EQ — preserve the instrumental tones
- Loudness can sit slightly lower (-16 LUFS acceptable for meditation use case)

### Afrobeats Rain
- Rain layer at -25dB to -30dB underneath music
- Music at -16 to -18 LUFS (quieter than streaming standard)
- Slow fade-in over 60 seconds
- Slow fade-out over 90+ seconds
- Mono-check on phone speakers (most sleep listeners use phones)

## The Field Recording Layer

This is the most important transformative element. The technique:

### Recording Standards
- Sample rate: 44.1kHz minimum (48kHz preferred)
- Bit depth: 16-bit minimum (24-bit preferred)
- Format: WAV or FLAC (not MP3)
- Duration: 3-10 minutes per recording (gives room to layer in mix)
- Use a windscreen on your phone if outdoor

### Recording Locations (Already Documented)
- Labadi Beach (ocean waves, evening crowd at dusk)
- Osu (rain on tin roof during rainy season)
- Makola Market (dawn ambient, before 7am)
- Aburi Hills (wind in trees, distant birds)
- Korle Lagoon (crickets at dusk, water lapping)
- Independence Avenue (distant traffic, late night)

### Layering Technique in Audacity

1. Import your music track (top layer)
2. Import your field recording (bottom layer)
3. Set field recording to -25 to -30dB (very low, supportive)
4. Cut any sudden loud moments (phone vibration, voices, etc.)
5. Use Envelope tool to fade up/down across long mixes
6. Apply gentle high-pass filter (200Hz) on field recording to leave low-end space for music

### Why This Layer Matters

1. **YouTube monetization:** Proves transformative human work
2. **Brand differentiation:** No AI music channel anywhere else captures Accra
3. **Emotional ground:** Listeners feel "place" without knowing why
4. **Award eligibility:** Award juries detect generic vs. specific instantly

## Stereo Imaging

For long compilations especially, stereo width must vary:

- **Intro:** Narrow stereo (mono-like) for intimacy
- **Build:** Gradually widen
- **Peak:** Full stereo width
- **Bridge:** Narrow again for contrast
- **Outro:** Wide and dissolving

In Audacity: Effect → Stereo Width
In DaVinci: built-in stereo widener on each track

⚠️ Always mono-check. Some listeners use phone speakers (mono). Don't make production decisions that disappear in mono playback.

## Compilation Mixing (The 30-min Workflow)

Stitching 8 tracks into a 30-min YouTube compilation:

1. **Order tracks for emotional flow:**
   - Open with mid-energy hook track
   - Build slowly
   - Peak around 60% mark
   - Wind down
   - End with the "rest your eyes" softest track

2. **Crossfade transitions (4-6 sec overlap):**
   - Fade out track A starting at 3:30 of a 4:00 track
   - Fade in track B at the same moment
   - Crossover should feel natural, not abrupt

3. **Field recording layer underneath ENTIRE compilation:**
   - One continuous field recording at -28dB
   - Provides emotional ground throughout
   - Often: ocean waves, rain, or wind sustained

4. **Master the FINAL compilation as one piece:**
   - Don't just glue mastered tracks together
   - Re-master the assembled compilation to -14 LUFS
   - Ensures even loudness throughout

5. **Generate chapters/timestamps:**
   - Each track begins at a 5-second nearest mark for readability
   - YouTube description format: `00:00 — Track Name`
   - Triggers YouTube's chapter UI automatically

## QC Checklist (Before Upload)

Run through every item before uploading:

- [ ] Loudness measured -14 LUFS ± 0.5 LUFS
- [ ] True peak below -1.0 dB
- [ ] No clipping anywhere (red lights in meter)
- [ ] No sudden volume jumps between tracks
- [ ] Field recording layer audible but not distracting
- [ ] Mono playback test passed (sound coherent on phone speaker)
- [ ] Headphone playback test passed (no harsh frequencies, no fatigue)
- [ ] Bass test (car / subwoofer if available — verify low end)
- [ ] First 30 seconds is the strongest moment
- [ ] Final 30 seconds gentle fade (especially sleep mixes)
- [ ] No silence gaps longer than 1.5 seconds
- [ ] Tracklist timestamps verified accurate
- [ ] File format: WAV master + MP3 320kbps export

## Common Production Mistakes (And Fixes)

### Mistake: "Sounds thin" / "Sounds harsh"
**Cause:** Suno output has high-mid bias.
**Fix:** Cut 2-4kHz by 1.5-2dB. Boost 80-120Hz by 1dB for body.

### Mistake: "Sounds muddy"
**Cause:** Build-up around 200-300Hz.
**Fix:** Cut 200-300Hz by 2dB. High-pass filter at 30-40Hz.

### Mistake: "No dynamics"
**Cause:** Suno often over-compresses raw output. Re-compression flattens further.
**Fix:** Use LESS compression. Try 2:1 ratio instead of 4:1. Let the music breathe.

### Mistake: "Field recording too obvious"
**Cause:** Layer too loud, or wrong frequency content competing with music.
**Fix:** Lower 3-5dB. High-pass field recording at 200Hz. Use only during quieter musical moments.

### Mistake: "Awkward loop at end of compilation"
**Cause:** Last track ends abruptly or first track starts cold.
**Fix:** Add 5-second fade out on last track. Add 3-second fade in on first track. Optional: bridge them with field recording.

### Mistake: "Sleep mix listeners complain it's not relaxing"
**Cause:** Too much variation, too much musical "interest."
**Fix:** Sleep mixes should be MORE monotonous. Less melodic content. More texture. More ambience.

## Industry-Standard Reference Tracks

Listen to these on YOUR studio monitors / headphones. Match their loudness, EQ balance, and stereo character:

| Genre | Reference (commercially released) |
|---|---|
| Afro-Lofi | Sarz — anything from "Sarz Is Not Your Mate" (instrumental cuts) |
| Highlife Chill | Pat Thomas — "Yamona" |
| Amapiano | Kabza De Small — "Asibe Happy" |
| Afro-Soul | Tems — "Crazy Tings" instrumental |
| Afro-Jazz | Mulatu Astatke — "Tezeta" |
| Coastal House | Black Coffee — "We Dance Again" |
| Ancestral | Toumani Diabaté — "Kaira" |

If your tracks sit at the same loudness, same dynamic range, same stereo character as these — you're production-ready.

## When to Hire a Mastering Engineer

For Year 1, self-master everything. By Year 2, if you have a SIGNATURE release (e.g., your debut "Harmattan: The Album" for Grammy submission):

**Budget mastering engineers (Afrobeats specialists):**
- Lekan Awoyeye (Nigeria) — ~$50-100/track
- WaveSpace Studios (Lagos) — ~$80-150/track
- Submit a track to Mastering Showcase (online services) — $30-60/track

For a Grammy/AFRIMA submission, hire a pro. For weekly catalog uploads, your Audacity master is sufficient.
