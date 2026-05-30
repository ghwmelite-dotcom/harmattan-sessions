# YouTube Short — Labadi Sunset

Vertical promo Short for Single #1. Same recipe reused for every future single.

## Audio: which 22 seconds

Energy analysis of `01-...labadi-sunset-v1-EXT.wav`:
- **0:00–0:25** = intro build (soft → full). **Do NOT use** — Shorts die in the first 2s if they open soft.
- **0:30 onward** = full groove, steady. **Pull the hook from here.**

**Use 0:30 → 0:52 (22s).** Starts already in the groove, ends clean. No fade-in (start on the beat); 0.4s fade-out only.

> If you have a favourite melodic moment by ear, start the Short there instead — just keep it inside the 0:30+ full-groove zone and 15–25s long.

## Build — DONE (animated)

**Output:** `C:\Users\USER\Downloads\Short-OsuRooftopSunset.mp4` — 1080×1920, 30fps, 22s, AAC stereo, −14 LUFS, decode-clean.

Composition: the **animated Akua loop** (`afro-lofi-loop-26min.mp4`, the boomerang clip) centered in the 9:16 frame, with a blurred+darkened copy of itself filling the top/bottom (no black bars), and a transparent text overlay on top:
- **Top:** `OSU ROOFTOP SUNSET` (Fraunces gold, auto-fit to width) + `Harmattan Sessions` (DM Sans cream) — matches the main YouTube video title
- **Bottom:** `AFRO-LOFI` + `Full mix on YouTube ↗`
- **Caption (for upload):** `Golden hour in Accra 🌅 Full mix → youtu.be/6AYdUgf-FQs #afrolofi #ghana #lofi`
- Cross-post the same file to TikTok + Instagram Reels

> **CTA points to YouTube, not Spotify** — streaming isn't live yet (DistroKid gate). The full 25-min mix IS live at **https://youtu.be/6AYdUgf-FQs**, so the Short drives there (and stacks YouTube watch-time). Swap to Spotify once the single is released. Regenerate the overlay with: `python scripts/make-short-overlay.py "TITLE" "SOUND" overlay.png "Full mix on YouTube  ↗"`

### Reproducible recipe (per single)
1. `python scripts/make-short-overlay.py "TITLE" "SOUND" overlay.png` → transparent 1080×1920 text layer
2. ffmpeg: take the single's animated loop, `split` → blurred bg fill + centered fg, `overlay` the text, map the audio hook (single, sequential ffmpeg call — NOT parallel; unique output filename).

> **Do NOT use ffmpeg `zoompan` on a looped still** — it produced corrupt 250 MB "moov atom" files. Use the real animated clip composited under the overlay instead (above). That gives genuine motion AND is reliable.

## Cover/clip note
Uses the launch boomerang loop. For a per-single distinct look, generate a distinct animated loop (Grok/Veo off the single's Ideogram cover, see `single-cover-prompts.md` + `animation-prompts.md`), then re-run the recipe.
