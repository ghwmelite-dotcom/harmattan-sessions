# -*- coding: utf-8 -*-
"""Transparent 1080x1920 text overlay for a vertical Short (composited over animated video)."""
from PIL import Image, ImageDraw, ImageFont
import sys

TITLE = sys.argv[1] if len(sys.argv) > 1 else "LABADI SUNSET"
SOUND = sys.argv[2] if len(sys.argv) > 2 else "AFRO-LOFI"
OUT   = sys.argv[3] if len(sys.argv) > 3 else r"C:\Users\USER\Downloads\short-overlay.png"
FR = r"C:\Users\USER\Downloads\_hs_fonts\Fraunces.ttf"
DM = r"C:\Users\USER\Downloads\_hs_fonts\DMSans.ttf"

W, H = 1080, 1920
GOLD=(232,176,75); CREAM=(245,237,224); DUSK=(14,11,8)

img = Image.new("RGBA", (W, H), (0,0,0,0))
d = ImageDraw.Draw(img)

# top scrim (gradient down from top) for title legibility
top = Image.new("RGBA",(W,H),(0,0,0,0)); td=top.load()
for y in range(0, 360):
    a=int(150*(1-y/360))
    for x in range(W): td[x,y]=(DUSK[0],DUSK[1],DUSK[2],a)
img = Image.alpha_composite(img, top)
# bottom scrim (gradient up from bottom) for CTA
bot = Image.new("RGBA",(W,H),(0,0,0,0)); bd=bot.load()
for y in range(H-360, H):
    a=int(170*((y-(H-360))/360))
    for x in range(W): bd[x,y]=(DUSK[0],DUSK[1],DUSK[2],a)
img = Image.alpha_composite(img, bot)
d = ImageDraw.Draw(img)

def load(f,s): return ImageFont.truetype(f,s)
def center(y, s, font, fill):
    bb=d.textbbox((0,0),s,font=font); x=(W-bb[2]+bb[0])//2
    d.text((x+2,y+3), s, font=font, fill=(0,0,0,150))
    d.text((x,y), s, font=font, fill=fill)

# auto-fit title to ~960px max width
tsize=90
while tsize>40:
    f=load(FR,tsize); bb=d.textbbox((0,0),TITLE,font=f)
    if bb[2]-bb[0] <= 960: break
    tsize-=4
center(120, TITLE, load(FR, tsize), GOLD)
center(120+tsize+24, "Harmattan Sessions", load(DM, 40), CREAM)
center(H-250, SOUND, load(DM, 34), GOLD)
center(H-185, "Full track on Spotify  ↗", load(DM, 46), CREAM)

img.save(OUT, "PNG")
print("SAVED", OUT)
