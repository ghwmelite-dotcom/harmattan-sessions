# YouTube Channel Trailer — "A Day in Accra"

Short auto-play video shown on the channel homepage to non-subscribers. Built from the **7 real animated cover loops** (one per single), sequenced as a day→night arc, with the Labadi Sunset hook.

## Output
**`C:\Users\USER\Downloads\Harmattan-Channel-Trailer.mp4`** — 1920×1080, 30fps, ~18s, −14 LUFS.

## Structure (day→night arc, ~2.3s per clip + 3.5s endcard)
1. Sunday Morning Light — "MORNING"
2. Aburi Climb — "THE CLIMB"
3. Labadi Sunset — "GOLDEN HOUR"
4. Trotro Window — "NIGHT DRIVE"
5. Heartbeat — "AFTER DARK"
6. 3 AM — "DEEP NIGHT"
7. Volta Sleep — "DEEP SLEEP"
8. Endcard — Sun Vinyl mark + "HARMATTAN SESSIONS" + tagline + "New mix every Tuesday & Friday · Subscribe"

0.4s crossfades between scenes; audio = Labadi hook (from 0:30) with 1s fade-in / 1.5s fade-out.

## How it was built (reusable)
- **Source:** the 7 `*vid.mp4` animated loops in `Downloads/Harmattan Releases/*/` (real motion, not Ken-Burns stills).
- **Overlays:** `scripts/make-trailer.py` writes title overlays + endcard (PIL — reliable; the headless-Chrome path failed mid-session due to an already-running Chrome instance hijacking the `--screenshot` call).
- **Assembly:** `_trailer/build2.sh` — per-clip scale/crop to 1080p + overlay → xfade-concat → layer Labadi hook. ffmpeg only.
- Clips are mixed resolution (6×720p + Labadi 960²); all normalized to 1080p via scale-to-fill + center-crop.

## Upload
YouTube Studio → Customization → Layout → Video spotlight → **Channel trailer** (for people who haven't subscribed). Also usable as a pinned intro / Shorts teaser.

## Caveat
720p sources upscaled to 1080p → slightly soft. Fine for a trailer. For a crisper V2, regenerate the loops at 1080p (Veo/Grok) or upscale, then rerun `build2.sh`.
