#!/bin/bash
set -e
R="/c/Users/USER/Downloads/Harmattan Releases"
AUDIO="/c/dev/Harmattan Sessions/harmattan-sessions-project/tmp/suno-session-1/keepers/afro-lofi/01-afro-lofi-labadi-sunset-v1-EXT.wav"
OUT="/c/Users/USER/Downloads/Harmattan-Channel-Trailer.mp4"
T="/c/Users/USER/Downloads/_trailer"
SEG=2.7   # seconds shown per clip

# day->night arc clips (paths) paired with overlay index
clips=(
 "$R/5 - 2026-10 - Sunday Morning Light/Sunday Morning Light vid.mp4"
 "$R/3 - 2026-08 - Aburi Climb/Aburi Climb vid.mp4"
 "$R/1 - 2026-06-12 - Labadi Sunset/labadi sunset vid.mp4"
 "$R/7 - 2026-12 - Trotro Window/Trotro Window vid.mp4"
 "$R/6 - 2026-11 - Heartbeat/Heartbeat vid.mp4"
 "$R/4 - 2026-09 - 3 AM/3 AM vid.mp4"
 "$R/2 - 2026-07 - Volta Sleep/Volta Sleep vid.mp4"
)

# 1) each scene: take first SEG sec of clip, scale/crop to 1080p, overlay its title, silent
for i in 0 1 2 3 4 5 6; do
  n=$((i+1))
  ffmpeg -y -loglevel error -t $SEG -i "${clips[$i]}" -i "$T/ov$n.png" \
   -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1[v0];[v0][1:v]overlay=0:0,format=yuv420p[v]" \
   -map "[v]" -an -c:v libx264 -preset veryfast -crf 20 "$T/s$n.mp4"
done
# 2) endcard 3.5s
ffmpeg -y -loglevel error -loop 1 -t 3.5 -i "$T/endcard.png" -vf "scale=1920:1080,fps=30,format=yuv420p" -an -c:v libx264 -preset veryfast -crf 20 "$T/s8.mp4"

# 3) crossfade-concat all 8 (0.5s fades). Each scene 2.7s; endcard 3.5s.
ffmpeg -y -loglevel error \
 -i "$T/s1.mp4" -i "$T/s2.mp4" -i "$T/s3.mp4" -i "$T/s4.mp4" -i "$T/s5.mp4" -i "$T/s6.mp4" -i "$T/s7.mp4" -i "$T/s8.mp4" \
 -filter_complex "\
[0][1]xfade=transition=fade:duration=0.4:offset=2.3[a];\
[a][2]xfade=transition=fade:duration=0.4:offset=4.6[b];\
[b][3]xfade=transition=fade:duration=0.4:offset=6.9[c];\
[c][4]xfade=transition=fade:duration=0.4:offset=9.2[d];\
[d][5]xfade=transition=fade:duration=0.4:offset=11.5[e];\
[e][6]xfade=transition=fade:duration=0.4:offset=13.8[f];\
[f][7]xfade=transition=fade:duration=0.6:offset=16.1[v]" \
 -map "[v]" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p "$T/silent.mp4"

# 4) layer Labadi hook (from 0:30), trim to video length, fades + loudnorm
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$T/silent.mp4")
FO=$(python3 -c "print(max(0,$DUR-1.5))")
ffmpeg -y -loglevel error -i "$T/silent.mp4" -ss 30 -i "$AUDIO" \
 -filter_complex "[1:a]atrim=duration=$DUR,afade=t=in:st=0:d=1,afade=t=out:st=$FO:d=1.5,loudnorm=I=-14:TP=-1[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart "$OUT"
echo "TRAILER_DONE dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"
