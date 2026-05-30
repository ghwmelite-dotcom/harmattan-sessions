# -*- coding: utf-8 -*-
"""Generate 3000x3000 square single covers for the Session-1 catalog.
Two hero anchors -> 7 distinct covers via crop + colour grade + title lockup."""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageChops, ImageFilter
import os

STILLS = r"C:\dev\Harmattan Sessions\harmattan-sessions-project\public\visuals\stills"
OUTDIR = r"C:\Users\USER\Downloads\hs-single-covers"
FR = r"C:\Users\USER\Downloads\_hs_fonts\Fraunces.ttf"
DM = r"C:\Users\USER\Downloads\_hs_fonts\DMSans.ttf"
os.makedirs(OUTDIR, exist_ok=True)

S = 3000
GOLD  = (232, 176, 75)
CREAM = (245, 237, 224)
DUSK  = (14, 11, 8)

LOFI = os.path.join(STILLS, "afro-lofi-anchor-v1.png")
RAIN = os.path.join(STILLS, "afrobeats-rain-anchor-v1.png")

# crop = (x0 fraction, width fraction of source) — square is full height
COVERS = [
    # file               src   crop_x  sound          title                tint           bright sat  strength
    ("01-labadi-sunset",  LOFI, 0.24, "AFRO-LOFI",   "Labadi Sunset",        (255,165,80),  1.00, 1.18, 0.16),
    ("02-aburi-climb",    LOFI, 0.44, "AFRO-LOFI",   "Aburi Climb",          (130,180,150), 1.04, 1.05, 0.18),
    ("03-trotro-window",  LOFI, 0.06, "AFRO-LOFI",   "Trotro Window",        (70,85,140),   0.84, 1.05, 0.24),
    ("04-sunday-morning", LOFI, 0.16, "AFRO-LOFI",   "Sunday Morning Light", (255,225,180), 1.12, 0.98, 0.14),
    ("05-heartbeat",      RAIN, 0.18, "AFROBEATS RAIN","Heartbeat",          (255,170,95),  0.98, 1.10, 0.14),
    ("06-3am",            RAIN, 0.10, "AFROBEATS RAIN","3 AM",               (55,65,120),   0.80, 1.05, 0.24),
    ("07-volta-sleep",    RAIN, 0.26, "AFROBEATS RAIN","Volta Sleep",        (80,140,175),  0.92, 1.05, 0.18),
]

def grade(im, tint, bright, sat, strength):
    solid = Image.new("RGB", im.size, tint)
    mult = ImageChops.multiply(im, solid)
    g = Image.blend(im, mult, strength)
    g = ImageEnhance.Brightness(g).enhance(bright)
    g = ImageEnhance.Color(g).enhance(sat)
    g = ImageEnhance.Contrast(g).enhance(1.04)
    return g

def load(f, s): return ImageFont.truetype(f, s)

def tracked(d, xy, s, font, fill, tracking, left=True, shadow=None):
    x, y = xy
    total = -tracking
    for ch in s:
        bb = d.textbbox((0,0), ch, font=font); total += (bb[2]-bb[0])+tracking
    cx = x if left else x-total
    for ch in s:
        if shadow:
            sx,sy,sc = shadow; d.text((cx+sx,y+sy), ch, font=font, fill=sc)
        d.text((cx, y), ch, font=font, fill=fill)
        bb = d.textbbox((0,0), ch, font=font); cx += (bb[2]-bb[0])+tracking
    return total

for fn, src, cropx, sound, title, tint, bright, sat, strength in COVERS:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    sq = h                      # square side = full height
    x0 = int((w - sq) * cropx)
    im = im.crop((x0, 0, x0+sq, h)).resize((S, S), Image.LANCZOS)
    im = grade(im, tint, bright, sat, strength).convert("RGBA")

    # bottom gradient scrim
    scrim = Image.new("RGBA", (S, S), (0,0,0,0)); sd = scrim.load()
    gtop = int(S*0.45)
    for y in range(gtop, S):
        a = int(225*(((y-gtop)/(S-gtop))**1.3))
        for x in range(S): sd[x,y] = (DUSK[0],DUSK[1],DUSK[2],a)
    im = Image.alpha_composite(im, scrim)
    d = ImageDraw.Draw(im)

    # sound label
    tracked(d, (150, S-720), sound, load(DM, 78), CREAM, 14, shadow=(2,3,(0,0,0,150)))

    # title (Fraunces) with soft shadow — wrap if very long
    tfont = load(FR, 250 if len(title) <= 14 else 188)
    sh = Image.new("RGBA",(S,S),(0,0,0,0))
    ImageDraw.Draw(sh).text((150, S-600), title, font=tfont, fill=(0,0,0,200))
    sh = sh.filter(ImageFilter.GaussianBlur(12))
    im = Image.alpha_composite(im, sh); d = ImageDraw.Draw(im)
    d.text((150, S-600), title, font=tfont, fill=GOLD)

    # wordmark bottom
    tracked(d, (150, S-170), "HARMATTAN SESSIONS", load(DM, 60), CREAM, 12, shadow=(2,2,(0,0,0,150)))

    out = os.path.join(OUTDIR, fn+"-3000.png")
    im.convert("RGB").save(out, "PNG")
    print("SAVED", os.path.basename(out))

print("ALL DONE ->", OUTDIR)
