# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC   = r"C:\dev\Harmattan Sessions\harmattan-sessions-project\public\visuals\stills\afro-lofi-anchor-v1.png"
OUT   = r"C:\Users\USER\Downloads\Harmattan-AfroLofi-Vol1-THUMB.png"
FR    = r"C:\Users\USER\Downloads\_hs_fonts\Fraunces.ttf"
DM    = r"C:\Users\USER\Downloads\_hs_fonts\DMSans.ttf"

W, H = 1280, 720
GOLD  = (232, 176, 75)
CREAM = (245, 237, 224)
DUSK  = (14, 11, 8)

img = Image.open(SRC).convert("RGB")
sw, sh = img.size
scale = max(W/sw, H/sh)
img = img.resize((int(sw*scale), int(sh*scale)), Image.LANCZOS)
left = (img.width - W)//2
top  = (img.height - H)//2
img = img.crop((left, top, left+W, top+H)).convert("RGBA")

# bottom-third gradient scrim
scrim = Image.new("RGBA", (W, H), (0,0,0,0))
sd = scrim.load()
gtop = int(H*0.48)
for y in range(gtop, H):
    t = (y-gtop)/(H-gtop)
    a = int(238*(t**1.3))
    for x in range(W):
        sd[x, y] = (DUSK[0], DUSK[1], DUSK[2], a)
img = Image.alpha_composite(img, scrim)

def load(f, s): return ImageFont.truetype(f, s)

def tracked(d, xy, s, font, fill, tracking=0, left_anchor=True):
    x, y = xy
    total = -tracking
    for ch in s:
        bb = d.textbbox((0,0), ch, font=font); total += (bb[2]-bb[0])+tracking
    cx = x if left_anchor else x-total
    for ch in s:
        d.text((cx, y), ch, font=font, fill=fill)
        bb = d.textbbox((0,0), ch, font=font); cx += (bb[2]-bb[0])+tracking
    return total

draw = ImageDraw.Draw(img)

# ---- TITLE with soft blurred drop shadow ----
title_font = load(FR, 132)
tx, ty = 58, H-258
shadow_layer = Image.new("RGBA", (W, H), (0,0,0,0))
ImageDraw.Draw(shadow_layer).text((tx+5, ty+7), "AFRO-LOFI", font=title_font, fill=(0,0,0,200))
shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(7))
img = Image.alpha_composite(img, shadow_layer)
draw = ImageDraw.Draw(img)
draw.text((tx, ty), "AFRO-LOFI", font=title_font, fill=GOLD)

# ---- SUBTITLE ----
draw.text((62, H-108), "Osu Rooftop Sunset  ·  from Accra",
          font=load(DM, 46), fill=CREAM)

# ---- WORDMARK top-right: solid Dusk pill so it reads over the palm ----
wm_font = load(DM, 28)
wm = "HARMATTAN SESSIONS"
# measure tracked width
mw = -5
for ch in wm:
    bb = draw.textbbox((0,0), ch, font=wm_font); mw += (bb[2]-bb[0])+5
pad_x, pad_y = 22, 12
pill_w = mw + pad_x*2
pill_h = 28 + pad_y*2
px2 = W-44; px1 = px2-pill_w; py1 = 34; py2 = py1+pill_h
pill = Image.new("RGBA", (W,H), (0,0,0,0))
ImageDraw.Draw(pill).rounded_rectangle([px1,py1,px2,py2], radius=pill_h//2,
                                       fill=(DUSK[0],DUSK[1],DUSK[2],205))
img = Image.alpha_composite(img, pill)
draw = ImageDraw.Draw(img)
tracked(draw, (px1+pad_x, py1+pad_y-2), wm, wm_font, CREAM, tracking=5)

# ---- bottom-right tag ----
tracked(draw, (W-58, H-66), "25 MIN  ·  FOCUS", load(DM, 30), GOLD,
        tracking=4, left_anchor=False)

img.convert("RGB").save(OUT, "PNG")
print("SAVED:", OUT, img.size)
