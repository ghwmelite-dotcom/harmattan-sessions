# -*- coding: utf-8 -*-
"""Static brand-identity assets, consistent with the YouTube banner.
Outputs:
  1. avatar-800.png        (800x800) Sun Vinyl mark on Dusk radial — works as a circle (YouTube/X/IG/TikTok profile)
  2. x-header-1500x500.png  X/Twitter header — Akua face + wordmark, center-safe
Akua = face (large formats), Sun Vinyl = mark (profile/small). Same palette as banner.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

DOWNLOADS = r"C:\Users\USER\Downloads"
COVER = DOWNLOADS + r"\Harmattan Single Covers\01-labadi-sunset-3000.png"
FR = DOWNLOADS + r"\_hs_fonts\Fraunces.ttf"
DM = DOWNLOADS + r"\_hs_fonts\DMSans.ttf"

GOLD  = (232,176,75); GOLDL=(244,201,93); GOLDD=(200,132,46)
CREAM = (245,237,224); DUSK=(14,11,8); DUSK2=(21,16,11)

def load(f,s): return ImageFont.truetype(f,s)

def sun_vinyl(draw_img, cx, cy, R):
    """Draw the Sun Vinyl mark: dark disc, radial-gold sun, dark hole, gold spindle."""
    layer = Image.new("RGBA", draw_img.size, (0,0,0,0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse([cx-R,cy-R,cx+R,cy+R], fill=(*DUSK,255))
    rg=int(R*0.74)
    for i in range(rg,0,-1):
        t=i/rg
        col=(int(GOLDL[0]*(1-t)+GOLDD[0]*t),int(GOLDL[1]*(1-t)+GOLDD[1]*t),int(GOLDL[2]*(1-t)+GOLDD[2]*t),255)
        ld.ellipse([cx-i,cy-i,cx+i,cy+i],fill=col)
    # subtle grooves
    for gr in (int(rg*0.55),int(rg*0.75),int(rg*0.92)):
        ld.ellipse([cx-gr,cy-gr,cx+gr,cy+gr],outline=(*DUSK,40),width=2)
    rh=int(R*0.20); ld.ellipse([cx-rh,cy-rh,cx+rh,cy+rh],fill=(*DUSK,255))
    rs=int(R*0.075); ld.ellipse([cx-rs,cy-rs,cx+rs,cy+rs],fill=(*GOLDL,255))
    return Image.alpha_composite(draw_img, layer)

# ---------- 1. AVATAR 800x800 ----------
S=800
av=Image.new("RGBA",(S,S),(0,0,0,0))
ad=av.load()
cx,cy=S/2,S/2; maxd=math.hypot(cx,cy)
for y in range(S):
    for x in range(S):
        t=math.hypot(x-cx,y-cy)/maxd
        r=int(DUSK2[0]*(1-t)+DUSK[0]*t); g=int(DUSK2[1]*(1-t)+DUSK[1]*t); b=int(DUSK2[2]*(1-t)+DUSK[2]*t)
        ad[x,y]=(r,g,b,255)
av=sun_vinyl(av,S//2,S//2,int(S*0.34))
# faint outer ring so it reads on light backgrounds too
ImageDraw.Draw(av).ellipse([6,6,S-6,S-6],outline=(*GOLD,60),width=3)
av.convert("RGB").save(DOWNLOADS+r"\Harmattan-Avatar-800.png","PNG")
print("SAVED avatar-800")

# ---------- 2. X HEADER 1500x500 ----------
W,H=1500,500
im=Image.open(COVER).convert("RGB")
sw,sh=im.size
ar=W/H
new_h=int(sw/ar)
if new_h<=sh:
    y0=int((sh-new_h)*0.40); im=im.crop((0,y0,sw,y0+new_h))
else:
    new_w=int(sh*ar); x0=int((sw-new_w)*0.5); im=im.crop((x0,0,x0+new_w,sh))
im=im.resize((W,H),Image.LANCZOS).convert("RGBA")
im=Image.alpha_composite(im,Image.new("RGBA",(W,H),(*DUSK,80)))
# center vignette for legibility (X centers the header, crops sides on mobile)
vig=Image.new("RGBA",(W,H),(0,0,0,0)); vd=vig.load()
cx,cy=W/2,H/2; maxd=math.hypot(W*0.42,H*0.5)
for y in range(H):
    for x in range(0,W,2):
        dd=math.hypot(x-cx,y-cy)/maxd; a=int(150*max(0,1-dd*1.2))
        vd[x,y]=(*DUSK,a)
        if x+1<W: vd[x+1,y]=(*DUSK,a)
im=Image.alpha_composite(im,vig)
im=sun_vinyl(im,W//2,165,34)
d=ImageDraw.Draw(im)
def ctext(y,s,font,fill,tr=0):
    tot=-tr
    for ch in s:
        bb=d.textbbox((0,0),ch,font=font); tot+=(bb[2]-bb[0])+tr
    x=(W-tot)//2
    for ch in s:
        d.text((x+2,y+2),ch,font=font,fill=(0,0,0,160)); d.text((x,y),ch,font=font,fill=fill)
        bb=d.textbbox((0,0),ch,font=font); x+=(bb[2]-bb[0])+tr
ctext(218,"HARMATTAN  SESSIONS",load(FR,58),GOLD,tr=5)
d.line([(W//2-180,292),(W//2+180,292)],fill=(*GOLD,170),width=2)
ctext(308,"afro-lofi · highlife · ambient — from Accra",load(DM,26),CREAM,tr=1)
im.convert("RGB").save(DOWNLOADS+r"\Harmattan-X-Header-1500x500.png","PNG")
print("SAVED x-header-1500x500")
print("DONE")
