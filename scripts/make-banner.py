# -*- coding: utf-8 -*-
"""YouTube channel banner (2560x1440) — Akua as the face + Sun Vinyl mark + wordmark.
Center 1546x423 'safe area' (visible on all devices) holds the lockup; Akua bleeds wide.
Usage: python make-banner.py [src_cover] [out] [crop_y_bias 0-1]"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, math

SRC  = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\USER\Downloads\Harmattan Single Covers\01-labadi-sunset-3000.png"
OUT  = sys.argv[2] if len(sys.argv) > 2 else r"C:\Users\USER\Downloads\Harmattan-YouTube-Banner-2560x1440.png"
BIAS = float(sys.argv[3]) if len(sys.argv) > 3 else 0.42  # vertical crop position (0=top,1=bottom)
FR   = r"C:\Users\USER\Downloads\_hs_fonts\Fraunces.ttf"
DM   = r"C:\Users\USER\Downloads\_hs_fonts\DMSans.ttf"

W, H = 2560, 1440
GOLD  = (232, 176, 75)
GOLDL = (244, 201, 93)
GOLDD = (200, 132, 46)
CREAM = (245, 237, 224)
DUSK  = (14, 11, 8)

# --- base: crop source to 16:9, scale to fill ---
im = Image.open(SRC).convert("RGB")
sw, sh = im.size
target_ar = W / H
# crop to 16:9 from the (square) source
new_h = int(sw / target_ar)
if new_h <= sh:
    y0 = int((sh - new_h) * BIAS)
    im = im.crop((0, y0, sw, y0 + new_h))
else:
    new_w = int(sh * target_ar)
    x0 = int((sw - new_w) * 0.5)
    im = im.crop((x0, 0, x0 + new_w, sh))
im = im.resize((W, H), Image.LANCZOS).convert("RGBA")

# --- Dusk scrim: overall darken + strong center vignette for text legibility ---
overlay = Image.new("RGBA", (W, H), (DUSK[0], DUSK[1], DUSK[2], 90))  # gentle overall
im = Image.alpha_composite(im, overlay)
# center horizontal-band darkening (radial-ish) behind the lockup
vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vd = vig.load()
cx, cy = W/2, H/2
maxd = math.hypot(W*0.42, H*0.5)
for y in range(H):
    for x in range(0, W, 2):  # step 2 for speed, fill pairs
        d = math.hypot(x-cx, y-cy)/maxd
        a = int(150 * max(0, 1 - d*1.25))
        vd[x, y] = (DUSK[0], DUSK[1], DUSK[2], a)
        if x+1 < W: vd[x+1, y] = (DUSK[0], DUSK[1], DUSK[2], a)
im = Image.alpha_composite(im, vig)

d = ImageDraw.Draw(im)
def load(f, s): return ImageFont.truetype(f, s)

# --- Sun Vinyl mark (drawn) ---
def draw_sun_vinyl(img, cx, cy, R):
    layer = Image.new("RGBA", img.size, (0,0,0,0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse([cx-R, cy-R, cx+R, cy+R], fill=(DUSK[0],DUSK[1],DUSK[2],255))   # dark disc
    rg = int(R*0.73)                                                            # gold sun radius
    for i in range(rg, 0, -1):
        t = i/rg
        col = (int(GOLDL[0]*(1-t)+GOLDD[0]*t), int(GOLDL[1]*(1-t)+GOLDD[1]*t), int(GOLDL[2]*(1-t)+GOLDD[2]*t), 255)
        ld.ellipse([cx-i, cy-i, cx+i, cy+i], fill=col)
    rh = int(R*0.20); ld.ellipse([cx-rh, cy-rh, cx+rh, cy+rh], fill=(DUSK[0],DUSK[1],DUSK[2],255))  # hole
    rs = int(R*0.085); ld.ellipse([cx-rs, cy-rs, cx+rs, cy+rs], fill=(GOLDL[0],GOLDL[1],GOLDL[2],255))  # spindle
    return Image.alpha_composite(img, layer)

# --- centered lockup in safe area (center 1546x423) ---
def ctext(y, s, font, fill, tracking=0, shadow=True):
    total = -tracking
    for ch in s:
        bb = d.textbbox((0,0), ch, font=font); total += (bb[2]-bb[0]) + tracking
    cxp = (W - total)//2
    for ch in s:
        if shadow:
            for ox,oy in ((2,3),):
                d.text((cxp+ox, y+oy), ch, font=font, fill=(0,0,0,170))
        d.text((cxp, y), ch, font=font, fill=fill)
        bb = d.textbbox((0,0), ch, font=font); cxp += (bb[2]-bb[0]) + tracking

# mark above the wordmark
im = draw_sun_vinyl(im, W//2, 560, 46)
d = ImageDraw.Draw(im)
# wordmark
ctext(632, "HARMATTAN  SESSIONS", load(FR, 96), GOLD, tracking=8)
# divider rule
d.line([(W//2-300, 762), (W//2+300, 762)], fill=(GOLD[0],GOLD[1],GOLD[2],180), width=2)
# tagline
ctext(786, "the sound of African evenings — from Accra", load(DM, 40), CREAM, tracking=2)

im.convert("RGB").save(OUT, "PNG")
print("SAVED", OUT, im.size)
