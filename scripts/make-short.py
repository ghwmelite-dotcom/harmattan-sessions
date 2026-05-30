# -*- coding: utf-8 -*-
"""Build a 1080x1920 vertical Short still-frame (PNG) from a square cover.
Motion + audio are added by the ffmpeg step (see make-short.ps1 equivalent below)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, os

COVER = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\USER\Downloads\hs-single-covers\01-labadi-sunset-3000.png"
TITLE = sys.argv[2] if len(sys.argv) > 2 else "LABADI SUNSET"
OUT   = sys.argv[3] if len(sys.argv) > 3 else r"C:\Users\USER\Downloads\short-labadi-frame.png"
FR = r"C:\Users\USER\Downloads\_hs_fonts\Fraunces.ttf"
DM = r"C:\Users\USER\Downloads\_hs_fonts\DMSans.ttf"

W, H = 1080, 1920
GOLD=(232,176,75); CREAM=(245,237,224); DUSK=(14,11,8)

cov = Image.open(COVER).convert("RGB")

# blurred fill background (cover scaled to fill 1080x1920, blurred + darkened)
bg = cov.resize((W, W), Image.LANCZOS)  # 1080x1080
scale = H / bg.height
bg = bg.resize((int(bg.width*scale), H), Image.LANCZOS)
bx = (bg.width - W)//2
bg = bg.crop((bx, 0, bx+W, H)).filter(ImageFilter.GaussianBlur(40))
dark = Image.new("RGB", (W,H), DUSK)
bg = Image.blend(bg, dark, 0.45)

# foreground square cover, centered
fg = cov.resize((W, W), Image.LANCZOS)
canvas = bg.convert("RGBA")
canvas.alpha_composite(fg.convert("RGBA"), (0, (H-W)//2))

d = ImageDraw.Draw(canvas)
def load(f,s): return ImageFont.truetype(f,s)
def center(d, y, s, font, fill, shadow=True):
    bb = d.textbbox((0,0), s, font=font); w = bb[2]-bb[0]
    x = (W-w)//2
    if shadow: d.text((x+2,y+3), s, font=font, fill=(0,0,0,160))
    d.text((x,y), s, font=font, fill=fill)

# top lockup
center(d, 150, TITLE, load(FR, 88), GOLD)
center(d, 260, "Harmattan Sessions", load(DM, 40), CREAM)
# bottom CTA
center(d, H-230, "Full track on Spotify  ↗", load(DM, 44), CREAM)

canvas.convert("RGB").save(OUT, "PNG")
print("SAVED", OUT)
