# -*- coding: utf-8 -*-
"""Generate Harmattan Sessions release/content calendar as an .ics file.
Import into Google Calendar once -> phone notifications for every deadline + weekly rhythm."""
import datetime

OUT = r"C:\Users\USER\Downloads\Harmattan-Sessions-2026.ics"

# release order: (num, title, release_date(Friday), genre, already_scheduled)
SINGLES = [
    (1, "Labadi Sunset",        datetime.date(2026,6,12),  "Afrobeat", True),
    (2, "Volta Sleep",          datetime.date(2026,7,10),  "Ambient",  True),
    (3, "Aburi Climb",          datetime.date(2026,8,14),  "Afrobeat", False),
    (4, "3 AM",                 datetime.date(2026,9,11),  "Ambient",  False),
    (5, "Sunday Morning Light", datetime.date(2026,10,9),  "Afrobeat", False),
    (6, "Heartbeat",            datetime.date(2026,11,13), "Ambient",  False),
    (7, "Trotro Window",        datetime.date(2026,12,11), "Afrobeat", False),
]

def fmt(d): return d.strftime("%Y%m%d")
def nextday(d): return d + datetime.timedelta(days=1)

lines = [
 "BEGIN:VCALENDAR","VERSION:2.0",
 "PRODID:-//Harmattan Sessions//Release Calendar//EN",
 "CALSCALE:GREGORIAN","METHOD:PUBLISH",
 "X-WR-CALNAME:Harmattan Sessions 2026",
 "X-WR-TIMEZONE:Africa/Accra",
]
STAMP = "20260530T120000Z"

def add_event(uid, d, title, desc, alarm_days=1):
    dd = desc.replace("\\","\\\\").replace(",","\\,").replace(";","\\;")
    trig = f"-P{alarm_days}D" if alarm_days > 0 else "-PT9H"
    lines.extend([
      "BEGIN:VEVENT",
      f"UID:{uid}@harmattansessions",
      f"DTSTAMP:{STAMP}",
      f"DTSTART;VALUE=DATE:{fmt(d)}",
      f"DTEND;VALUE=DATE:{fmt(nextday(d))}",
      f"SUMMARY:{title}",
      f"DESCRIPTION:{dd}",
      "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Reminder",
      f"TRIGGER:{trig}","END:VALARM",
      "END:VEVENT",
    ])

def add_weekly(uid, first, title, desc, until="20261231"):
    dd = desc.replace(",","\\,")
    lines.extend([
      "BEGIN:VEVENT",
      f"UID:{uid}@harmattansessions",
      f"DTSTAMP:{STAMP}",
      f"DTSTART;VALUE=DATE:{fmt(first)}",
      f"DTEND;VALUE=DATE:{fmt(nextday(first))}",
      f"RRULE:FREQ=WEEKLY;UNTIL={until}",
      f"SUMMARY:{title}",
      f"DESCRIPTION:{dd}",
      "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Reminder",
      "TRIGGER:-PT3H","END:VALARM",
      "END:VEVENT",
    ])

# --- fixed one-off deadlines ---
add_event("hs-yt-appeal", datetime.date(2026,6,28),
  "LAST DAY: YouTube advanced-features appeal",
  "Submit appeal in YouTube Studio if not done. Text: docs/launch/youtube-advanced-features-appeal.md. Phone-verify channel first.", 3)
add_event("hs-session2", datetime.date(2026,9,1),
  "Run Suno Session 2 (catalog refuel)",
  "Generate the 6 unopened sounds + Afro-Lofi depth before catalog runs dry. Plan: docs/launch/session-2-plan.md. Capture new field recordings too.", 0)

# --- per-single: upload (~21d before), pitch (~10d before), release day ---
for num, title, rel, genre, done in SINGLES:
    if not done:
        add_event(f"hs-upload-{num}", rel - datetime.timedelta(days=21),
          f"Upload Single #{num}: {title} (DistroKid)",
          f"Schedule {title} for {rel:%a %d %b}. JPG cover + clean 44.1k WAV from Harmattan Releases/{num}. Genre {genre}. AI-disclose. distrokid-wise-setup.md", 2)
        add_event(f"hs-pitch-{num}", rel - datetime.timedelta(days=10),
          f"Pitch Single #{num}: {title} (Spotify for Artists)",
          f"Pitch {title} via Spotify for Artists before release - one pitch per release. Tags/desc in distrokid-wise-setup.md", 1)
    add_event(f"hs-release-{num}", rel,
      f"RELEASE: {title} live on streaming",
      f"Single #{num} '{title}' goes live. Grab Spotify URL, swap Short CTA to Spotify, update site footer, post cover+Short on X/IG/TikTok.", 0)

# --- weekly content rhythm ---
add_weekly("hs-yt-tue", datetime.date(2026,6,2),
  "YouTube mix upload (Tuesday)",
  "Upload/queue this week's Tuesday long-form mix. Akua visual + field-rec bed + AI disclosure.")
add_weekly("hs-yt-fri", datetime.date(2026,6,5),
  "YouTube mix + Friday Dispatch newsletter",
  "Friday long-form mix + send The Harmattan Dispatch (17:00 GMT).")
add_weekly("hs-social", datetime.date(2026,6,3),
  "Weekly social pass (X/IG/TikTok)",
  "Post a Short/Reel + 2-3 native posts across X, Instagram, TikTok. Story/curiosity hooks, link in bio.")

lines.append("END:VCALENDAR")
open(OUT,"w",encoding="utf-8",newline="\r\n").write("\n".join(lines)+"\n")

veco = sum(1 for L in lines if L=="BEGIN:VEVENT")
print("WROTE", OUT)
print("events:", veco)
