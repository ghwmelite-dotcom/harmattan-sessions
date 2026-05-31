# -*- coding: utf-8 -*-
"""Premium brand assets via HTML/CSS -> headless Chrome screenshot (HyperFrames technique,
single-frame). Magazine-grade typography PIL can't match: real kerning, gradient text,
soft shadows, backdrop blur. Embeds fonts + cover as base64 so headless Chrome loads them.
Writes the HTML files; render step is done by Chrome in the shell after this."""
import base64, os

DL = r"C:\Users\USER\Downloads"
FR = DL + r"\_hs_fonts\Fraunces.ttf"
DM = DL + r"\_hs_fonts\DMSans.ttf"
COVER = DL + r"\Harmattan Single Covers\01-labadi-sunset-3000.png"
OUTDIR = DL + r"\_brand_html"
os.makedirs(OUTDIR, exist_ok=True)

def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

fr = b64(FR); dm = b64(DM); cover = b64(COVER)

FONTFACE = f"""
@font-face {{ font-family:'Fraunces'; src:url(data:font/ttf;base64,{fr}) format('truetype'); font-weight:400 700; }}
@font-face {{ font-family:'DM Sans'; src:url(data:font/ttf;base64,{dm}) format('truetype'); font-weight:400 600; }}
"""

# ---------- AVATAR 800x800 (Sun Vinyl mark, premium) ----------
avatar = f"""<!doctype html><html><head><meta charset=utf8><style>
{FONTFACE}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:800px;height:800px;overflow:hidden}}
.stage{{width:800px;height:800px;position:relative;
  background:radial-gradient(circle at 50% 42%, #1a130b 0%, #0E0B08 78%);
  display:flex;align-items:center;justify-content:center}}
/* concentric vinyl grooves */
.disc{{width:560px;height:560px;border-radius:50%;position:relative;
  background:#0E0B08;
  box-shadow:0 24px 70px rgba(0,0,0,.6), inset 0 0 0 1px rgba(232,176,75,.10);
  display:flex;align-items:center;justify-content:center}}
.disc::before{{content:'';position:absolute;inset:0;border-radius:50%;
  background:repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.022) 0 2px, transparent 2px 5px)}}
/* the sun */
.sun{{width:410px;height:410px;border-radius:50%;position:relative;
  background:radial-gradient(circle at 42% 33%, #FBE3A0 0%, #F4C95D 28%, #E8B04B 55%, #C8842E 100%);
  box-shadow:0 0 70px rgba(232,176,75,.45), inset -18px -22px 60px rgba(140,80,20,.55), inset 14px 16px 44px rgba(255,240,200,.5);
  display:flex;align-items:center;justify-content:center}}
/* center hole + spindle */
.hole{{width:120px;height:120px;border-radius:50%;background:#0E0B08;
  box-shadow:inset 0 3px 10px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center}}
.spindle{{width:46px;height:46px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #FBE3A0, #E8B04B)}}
.ring{{position:absolute;inset:14px;border-radius:50%;border:3px solid rgba(232,176,75,.28)}}
</style></head><body>
<div class=stage>
  <div class=ring></div>
  <div class=disc><div class=sun><div class=hole><div class=spindle></div></div></div></div>
</div></body></html>"""

# ---------- X HEADER 1500x500 (Akua face + premium wordmark) ----------
xheader = f"""<!doctype html><html><head><meta charset=utf8><style>
{FONTFACE}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1500px;height:500px;overflow:hidden}}
.stage{{width:1500px;height:500px;position:relative;overflow:hidden;background:#0E0B08}}
.bg{{position:absolute;inset:0;background:url(data:image/png;base64,{cover}) center 38%/cover no-repeat;
  filter:saturate(1.05)}}
.tint{{position:absolute;inset:0;background:rgba(14,11,8,.34)}}
.vig{{position:absolute;inset:0;
  background:radial-gradient(ellipse 56% 130% at 50% 50%, rgba(14,11,8,.78) 0%, rgba(14,11,8,.30) 45%, transparent 72%)}}
.lock{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}}
.mark{{width:62px;height:62px;border-radius:50%;margin-bottom:6px;
  background:radial-gradient(circle at 42% 33%, #FBE3A0 0%, #F4C95D 30%, #E8B04B 58%, #C8842E 100%);
  box-shadow:0 0 26px rgba(232,176,75,.5), inset -6px -7px 18px rgba(140,80,20,.5);position:relative}}
.mark::after{{content:'';position:absolute;left:50%;top:50%;width:18px;height:18px;border-radius:50%;
  transform:translate(-50%,-50%);background:#0E0B08}}
.word{{font-family:'Fraunces';font-weight:600;font-size:62px;letter-spacing:.14em;
  color:#E8B04B;text-shadow:0 3px 18px rgba(0,0,0,.55);
  background:linear-gradient(180deg,#F4C95D,#E8B04B 60%,#D29A3C);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  padding-left:.14em}}
.rule{{width:300px;height:2px;margin:10px 0 4px;
  background:linear-gradient(90deg,transparent,rgba(232,176,75,.85),transparent)}}
.tag{{font-family:'DM Sans';font-weight:400;font-size:27px;letter-spacing:.04em;color:#F5EDE0;
  text-shadow:0 2px 10px rgba(0,0,0,.6)}}
</style></head><body>
<div class=stage>
  <div class=bg></div><div class=tint></div><div class=vig></div>
  <div class=lock>
    <div class=mark></div>
    <div class=word>HARMATTAN&nbsp;SESSIONS</div>
    <div class=rule></div>
    <div class=tag>afro-lofi · highlife · ambient — from Accra</div>
  </div>
</div></body></html>"""

open(OUTDIR + r"\avatar.html", "w", encoding="utf-8").write(avatar)
open(OUTDIR + r"\x-header.html", "w", encoding="utf-8").write(xheader)
print("WROTE", OUTDIR)
print("avatar.html", len(avatar), "bytes  | x-header.html", len(xheader), "bytes")
