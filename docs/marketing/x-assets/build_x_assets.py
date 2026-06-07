# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw, ImageFont

BASE = r"C:\Users\USER\Downloads\Harmattan Releases\Session 1"
OUT  = r"C:\dev\Projects\harmattan-sessions\docs\marketing\x-assets"
os.makedirs(OUT, exist_ok=True)

COVERS = {
    "labadi":    os.path.join(BASE, r"1 - 2026-06-12 - Labadi Sunset\Labadi Sunset - cover.png"),
    "volta":     os.path.join(BASE, r"2 - 2026-07 - Volta Sleep\Volta Sleep - cover.png"),
    "aburi":     os.path.join(BASE, r"3 - 2026-08 - Aburi Climb\Aburi Climb - cover.png"),
    "3am":       os.path.join(BASE, r"4 - 2026-09 - 3 AM\3 AM - cover.png"),
    "sunday":    os.path.join(BASE, r"5 - 2026-10 - Sunday Morning Light\Sunday Morning Light - cover.png"),
    "heartbeat": os.path.join(BASE, r"6 - 2026-11 - Heartbeat\Heartbeat - cover.png"),
    "trotro":    os.path.join(BASE, r"7 - 2026-12 - Trotro Window\Trotro Window - cover.png"),
}

CREAM = (244, 234, 219); GOLD = (232, 176, 75); TERRA = (201, 110, 63)
DARK = (14, 11, 8); INK = (27, 19, 12)
F  = "C:/Windows/Fonts/georgia.ttf"
FB = "C:/Windows/Fonts/georgiab.ttf"
FI = "C:/Windows/Fonts/georgiai.ttf"
def font(p, s): return ImageFont.truetype(p, s)

def center_square(im):
    w, h = im.size; s = min(w, h)
    return im.crop(((w-s)//2, (h-s)//2, (w-s)//2+s, (h-s)//2+s))

def cover_to(im, W, H):
    w, h = im.size; sc = max(W/w, H/h)
    im = im.resize((int(w*sc), int(h*sc)), Image.LANCZOS)
    w, h = im.size
    return im.crop(((w-W)//2, (h-H)//2, (w-W)//2+W, (h-H)//2+H))

def wrap(draw, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def tracked(draw, xy, text, fnt, fill, track):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill); x += draw.textlength(ch, font=fnt) + track
    return x

def tracked_w(draw, text, fnt, track):
    return sum(draw.textlength(c, font=fnt) + track for c in text) - track

def draw_label(draw, x, y, text, maxw, track=5):
    size = 30; f = font(FB, size)
    while size >= 18 and tracked_w(draw, text, f, track) > maxw:
        size -= 1; f = font(FB, size)
    tracked(draw, (x+2, y+2), text, f, (16, 11, 7), track)   # shadow for legibility
    tracked(draw, (x, y), text, f, GOLD, track)

def vgrad_mask(W, H, top, bot, power=1.5):
    m = Image.new("L", (1, H))
    for y in range(H):
        t = (y / (H - 1)) ** power
        m.putpixel((0, y), int(top + (bot - top) * t))
    return m.resize((W, H))

def cover_band(W=1500, H=500, panel=500):
    band = Image.new("RGB", (W, H))
    for i, k in enumerate(["labadi", "volta", "aburi"]):
        im = center_square(Image.open(COVERS[k]).convert("RGB")).resize((panel, panel), Image.LANCZOS)
        band.paste(im, (i*panel, 0))
    d = ImageDraw.Draw(band)
    for x in (panel, panel*2):
        d.rectangle([x-1, 0, x+1, H], fill=DARK)
    return band

# ---------- HEADER (plain, three evenings) ----------
def build_header():
    W, H = 1500, 500
    hdr = cover_band(W, H)
    hdr = Image.composite(Image.new("RGB", (W, H), (8, 6, 4)), hdr, vgrad_mask(W, H, 0, 150, 2.2))
    ImageDraw.Draw(hdr).rectangle([0, H-4, W, H], fill=GOLD)
    hdr.save(os.path.join(OUT, "harmattan-x-header.png")); print("saved header")

# ---------- HEADER (wordmark) ----------
def build_header_wordmark():
    W, H = 1500, 500
    hdr = cover_band(W, H)
    hdr = Image.composite(Image.new("RGB", (W, H), (10, 8, 5)), hdr, Image.new("L", (W, H), 125))
    d = ImageDraw.Draw(hdr)
    title = "Harmattan Sessions"; tf = font(FB, 78)
    d.text(((W - d.textlength(title, font=tf)) / 2, 168), title, font=tf, fill=CREAM)
    tag = "LO-FI FROM ACCRA  ·  A REAL FIELD RECORDING UNDER EVERY BEAT"
    tgf = font(F, 23); tr = 4
    tx = (W - tracked_w(d, tag, tgf, tr)) / 2
    tracked(d, (tx+1, 289), tag, tgf, (16, 11, 7), tr)
    tracked(d, (tx, 288), tag, tgf, GOLD, tr)
    d.rectangle([0, H-4, W, H], fill=GOLD)
    hdr.save(os.path.join(OUT, "harmattan-x-header-wordmark.png")); print("saved header-wordmark")

# ---------- CARD with photo background ----------
def card_photo(key, label, headline, handle, outname, hsize=72, italic=False):
    W, H = 1080, 1350; M = 84
    im = cover_to(Image.open(COVERS[key]).convert("RGB"), W, H)
    im = Image.composite(Image.new("RGB", (W, H), (10, 8, 5)), im, vgrad_mask(W, H, 70, 205, 1.4))
    d = ImageDraw.Draw(im)
    draw_label(d, M, 70, label, W - 2*M)
    hf = font(FI if italic else FB, hsize)
    lines = wrap(d, headline, hf, W - 2*M); lh = int(hsize * 1.22)
    y = H - 150 - lh*len(lines)
    for ln in lines:
        d.text((M, y), ln, font=hf, fill=CREAM); y += lh
    d.text((M, H - 96), handle, font=font(F, 30), fill=(220, 210, 196))
    im.save(os.path.join(OUT, outname)); print("saved", outname)

# ---------- CARD with warm gradient (text only) ----------
def card_gradient(lines_italic, closer, outname):
    W, H = 1080, 1350; M = 90
    top, bot = (246, 238, 224), (228, 200, 158)
    g = Image.new("RGB", (1, H))
    for y in range(H):
        t = y/(H-1); g.putpixel((0, y), tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3)))
    bg = g.resize((W, H)); d = ImageDraw.Draw(bg)
    tracked(d, (M, 90), "HARMATTAN SESSIONS", font(FB, 30), TERRA, 6)
    fi = font(FI, 60); y = 360
    for ln in lines_italic:
        d.text((M, y), ln, font=fi, fill=INK); y += 96
    d.text((M, y + 40), closer, font=font(FB, 40), fill=TERRA)
    d.text((M, H - 96), "@HarmattanSessions", font=font(F, 30), fill=(120, 92, 60))
    bg.save(os.path.join(OUT, outname)); print("saved", outname)

build_header()
build_header_wordmark()
card_photo("labadi", "HARMATTAN · 01  ·  LABADI SUNSET", "what if Lofi Girl was from Accra?", "@HarmattanSessions", "card-accra.png", 74)
card_photo("volta", "HARMATTAN · 02  ·  VOLTA SLEEP", "seven minutes of stillness by the Volta — for drifting all the way down.", "@HarmattanSessions", "card-volta.png", 58, True)
card_photo("aburi", "HARMATTAN · 03  ·  ABURI CLIMB", "cooler air, harmattan wind — a beat that climbs.", "@HarmattanSessions", "card-aburi.png", 62, True)
card_photo("3am", "HARMATTAN · 04  ·  3 AM", "rain on the window, city asleep — the quiet hours that are only yours.", "@HarmattanSessions", "card-3am.png", 56, True)
card_photo("sunday", "HARMATTAN · 05  ·  SUNDAY MORNING LIGHT", "soft light, no rush — easing into the day.", "@HarmattanSessions", "card-sunday.png", 64, True)
card_photo("heartbeat", "HARMATTAN · 06  ·  HEARTBEAT", "a steady pulse under everything — calm, close, and kind.", "@HarmattanSessions", "card-heartbeat.png", 60, True)
card_photo("trotro", "HARMATTAN · 07  ·  TROTRO WINDOW", "watching neon Accra slide past the trotro glass in the rain.", "@HarmattanSessions", "card-trotro.png", 56, True)
card_gradient(["dusk surf.", "dawn hum.", "harmattan wind.", "evening street.", "rain on the river."],
              "— the sound of African evenings.", "card-evenings.png")
print("DONE")
