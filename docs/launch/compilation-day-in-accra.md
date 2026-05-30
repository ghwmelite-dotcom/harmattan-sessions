# "A Day in Accra" — 7-Track Compilation (V2 long-form)

The full Session-1 catalog as ONE ~37-min long-form video, sequenced as a **day→night arc**: the genre split (4 Afro-Lofi focus + 3 Afrobeats Rain sleep) becomes a *feature* — morning energy compressing into deep-night stillness (daytime tracks 4 min each, night tracks 7 min each, so the video literally slows as night falls).

## Audio — DONE ✅
**`C:\Users\USER\Downloads\Harmattan Compilation\HS-Day-in-Accra-37min.wav`**
- 36:58, 44.1k stereo, −14 LUFS, decode-clean
- 7 masters, 6× 4-second crossfades (triangular), mastered as one piece
- Built via the acrossfade chain in `scripts/` (command logged at `Downloads\_compile_cmd.txt`)

## Sequence + chapter timestamps
```
 0:00  Sunday Morning Light   (morning)
 3:56  Aburi Climb            (late-morning climb)
 7:52  Labadi Sunset          (golden hour)
11:52  Trotro Window          (dusk / night drive)
15:48  Heartbeat              (bedtime)
22:48  3 AM                   (deep night)
29:42  Volta Sleep            (deepest sleep)
```
*(Computed from per-track durations minus 4s crossfade overlaps. Re-verify against the final render before pasting as YouTube chapters — drift of a few seconds is normal.)*

## Video — TO DO (needs 7 animated loops)
Generate one animated loop per cover in **Veo 3.1 Lite** (use the unspent $300 credit) or **Grok Imagine**, off each `Harmattan Single Covers\*.png`. The 5 universal motion rules (from `animation-prompts.md`): no character movement · no camera movement · subtle environment only · loopable · no new objects.

Per-cover motion hooks:
| # | Track | Cover | Motion (subtle only) |
|---|-------|-------|----------------------|
| 1 | Sunday Morning Light | 04-sunday-morning-light | curtains breathe, dust motes in sunbeam, steam off tea |
| 2 | Aburi Climb | 02-aburi-climb | mist drifts between ridges, leaves sway |
| 3 | Labadi Sunset | 01-labadi-sunset | waves lap, sun shimmer on water, hair strands |
| 4 | Trotro Window | 03-trotro-window | rain streaks glass, blurred city lights pass |
| 5 | Heartbeat | 05-heartbeat | rain on window, lamp flicker, slow breath |
| 6 | 3 AM | 06-3am | rain streaks, distant city bokeh twinkle |
| 7 | Volta Sleep | 07-volta-sleep | rain rings on river, moon shimmer on water |

**Assembly (I do this once loops exist):** each loop covers its track's duration (loop/boomerang the 8s clip to fill 4–7 min), 4s crossfades between scenes to match the audio crossfades, layer the 37-min master, export 1080p/24fps. Same ffmpeg toolchain as the launch video.

## Positioning
This is a **V2 flagship** — a "best of Session 1" omnibus. Title idea (F-formulas in youtube-channel-kit.md): *"A Day in Accra — 37 Minutes of Afrobeat Chill | Harmattan Sessions"*. Drop AFTER several singles are live (so it cross-promotes the catalog), or as a year-end capstone.
