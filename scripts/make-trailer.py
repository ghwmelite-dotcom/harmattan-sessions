# -*- coding: utf-8 -*-
"""Channel trailer: Ken-Burns across the 7 covers (day->night arc) + gradient-gold
text cards, set to the Labadi hook. Builds a brand-card PNG (HTML/Chrome premium type)
then prints the ffmpeg command. ~25s, 1920x1080, 30fps.

Two-stage: (1) this writes the title-overlay PNGs (transparent, premium type via Chrome)
and the per-cover scene list; (2) ffmpeg zoompans each cover + overlays text + concats +
adds audio. Run the printed ffmpeg afterwards.
"""
import base64, os, json

DL = r"C:\Users\USER\Downloads"
COVERS = DL + r"\Harmattan Single Covers"
FR = DL + r"\_hs_fonts\Fraunces.ttf"
DM = DL + r"\_hs_fonts\DMSans.ttf"
WORK = DL + r"\_trailer"
os.makedirs(WORK, exist_ok=True)

fr = base64.b64encode(open(FR,"rb").read()).decode()
dm = base64.b64encode(open(DM,"rb").read()).decode()

# day -> night arc (same as compilation), each cover gets a scene
SCENES = [
    ("04-sunday-morning-light-3000.png", "Sunday Morning Light", "morning"),
    ("02-aburi-climb-3000.png",          "Aburi Climb",          "the climb"),
    ("01-labadi-sunset-3000.png",        "Labadi Sunset",        "golden hour"),
    ("03-trotro-window-3000.png",        "Trotro Window",        "night drive"),
    ("05-heartbeat-3000.png",            "Heartbeat",            "after dark"),
    ("06-3am-3000.png",                  "3 AM",                 "deep night"),
    ("07-volta-sleep-3000.png",          "Volta Sleep",          "deep sleep"),
]

FONTFACE = f"""
@font-face{{font-family:'Fraunces';src:url(data:font/ttf;base64,{fr}) format('truetype');font-weight:400 700}}
@font-face{{font-family:'DM Sans';src:url(data:font/ttf;base64,{dm}) format('truetype');font-weight:400 600}}"""

def overlay_html(title, sub):
    return f"""<!doctype html><html><head><meta charset=utf8><style>{FONTFACE}
*{{margin:0;padding:0;box-sizing:border-box}} html,body{{width:1920px;height:1080px;overflow:hidden;background:transparent}}
.s{{width:1920px;height:1080px;position:relative}}
.b{{position:absolute;left:0;right:0;bottom:0;height:46%;
  background:linear-gradient(180deg,transparent,rgba(14,11,8,.55) 55%,rgba(14,11,8,.85))}}
.t{{position:absolute;left:110px;bottom:170px}}
.k{{font-family:'DM Sans';font-weight:600;font-size:30px;letter-spacing:.22em;text-transform:uppercase;color:#F5EDE0;opacity:.85;margin-bottom:14px}}
.h{{font-family:'Fraunces';font-weight:600;font-size:104px;line-height:1;letter-spacing:.01em;
  background:linear-gradient(180deg,#F8D77E,#E8B04B 60%,#CE963A);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 6px 26px rgba(0,0,0,.6))}}
</style></head><body><div class=s><div class=b></div>
<div class=t><div class=k>{sub}</div><div class=h>{title}</div></div></div></body></html>"""

# brand end card
endcard = f"""<!doctype html><html><head><meta charset=utf8><style>{FONTFACE}
*{{margin:0;padding:0;box-sizing:border-box}} html,body{{width:1920px;height:1080px;overflow:hidden}}
.s{{width:1920px;height:1080px;background:radial-gradient(circle at 50% 42%,#1a130b,#0E0B08 80%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}}
.m{{width:140px;height:140px;border-radius:50%;position:relative;margin-bottom:14px;
  background:radial-gradient(circle at 42% 33%,#FBE3A0,#F4C95D 30%,#E8B04B 58%,#C8842E 100%);
  box-shadow:0 0 60px rgba(232,176,75,.5),inset -12px -15px 36px rgba(140,80,20,.5),inset 9px 11px 26px rgba(255,240,200,.45)}}
.m::after{{content:'';position:absolute;left:50%;top:50%;width:40px;height:40px;border-radius:50%;transform:translate(-50%,-50%);background:#0E0B08}}
.w{{font-family:'Fraunces';font-weight:600;font-size:120px;letter-spacing:.12em;padding-left:.12em;
  background:linear-gradient(180deg,#F8D77E,#E8B04B 60%,#CE963A);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}}
.r{{width:560px;height:2px;background:linear-gradient(90deg,transparent,rgba(232,176,75,.9),transparent)}}
.t{{font-family:'DM Sans';font-weight:400;font-size:46px;letter-spacing:.04em;color:#F5EDE0}}
.c{{font-family:'DM Sans';font-weight:600;font-size:34px;letter-spacing:.06em;color:#E8B04B;margin-top:26px}}
</style></head><body><div class=s>
<div class=m></div><div class=w>HARMATTAN&nbsp;SESSIONS</div><div class=r></div>
<div class=t>the sound of African evenings — from Accra</div>
<div class=c>New mix every Tuesday &amp; Friday · Subscribe</div></div></body></html>"""

manifest = {"scenes": SCENES, "covers_dir": COVERS}
open(WORK+r"\manifest.json","w").write(json.dumps(manifest,indent=1))
for i,(cov,title,sub) in enumerate(SCENES,1):
    open(WORK+rf"\ov{i}.html","w",encoding="utf-8").write(overlay_html(title,sub))
open(WORK+r"\endcard.html","w",encoding="utf-8").write(endcard)
print("WROTE overlays + endcard to", WORK)
print("scenes:", len(SCENES))
