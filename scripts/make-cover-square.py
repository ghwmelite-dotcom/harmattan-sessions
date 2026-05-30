# -*- coding: utf-8 -*-
"""Crop a 16:9 cover to square, upscale to 3000x3000 (Lanczos + mild unsharp).
Usage: python make-cover-square.py <src> <out> [crop_bias 0.0-1.0]
crop_bias: horizontal position of the crop window (0=left-aligned, 0.5=center, 1=right)."""
from PIL import Image, ImageFilter
import sys

src  = sys.argv[1]
out  = sys.argv[2]
bias = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
TARGET = 3000

im = Image.open(src).convert("RGB")
w, h = im.size
side = min(w, h)
max_x = w - side
x0 = int(round(max_x * bias))
sq = im.crop((x0, 0, x0 + side, side))

# upscale Lanczos
big = sq.resize((TARGET, TARGET), Image.LANCZOS)
# mild unsharp to counter resample softness
big = big.filter(ImageFilter.UnsharpMask(radius=2.5, percent=80, threshold=2))

big.save(out, "PNG")
print(f"SAVED {out}  src={w}x{h} crop_x={x0}..{x0+side} -> {TARGET}x{TARGET}")
