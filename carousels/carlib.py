"""Carousel v3 in the style of hey.ksusha posts: full-bleed photo collage, bold white headline
with a black outline across the middle, italic caption with shadow, white screenshot-like cards."""
import subprocess
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
W, H = 1080, 1350
PINK = (242, 90, 170); INK = (28, 22, 26)
S = "/tmp/claude-0/-home-user-Ksu/03c5ee2b-73ae-52f6-90d7-fac0ce26511e/scratchpad"
BR = S + "/yt2/broll/"; SRC = S + "/car/src/"; FR = S + "/car/fr/"; VF = S + "/car/vf/"
_fc = {}
def font(style, size):
    if style not in _fc:
        _fc[style] = subprocess.run(["fc-match", "-f", "%{file}", f"Montserrat:style={style}"], capture_output=True, text=True).stdout
    return ImageFont.truetype(_fc[style], size)

def fill(path, w, h, fx=0.5, fy=0.5):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    g = im.convert("L"); px = g.load(); iw, ih = im.size
    top = 0
    while top < ih // 3 and max(px[x, top] for x in range(0, iw, 16)) < 12: top += 1
    bot = ih - 1
    while bot > ih * 2 // 3 and max(px[x, bot] for x in range(0, iw, 16)) < 12: bot -= 1
    if top or bot < ih - 1: im = im.crop((0, top + 6, iw, bot - 6))
    iw, ih = im.size; s = max(w / iw, h / ih)
    im = im.resize((round(iw * s), round(ih * s)), Image.LANCZOS); iw, ih = im.size
    x = min(max(int(fx * iw - w / 2), 0), iw - w); y = min(max(int(fy * ih - h / 2), 0), ih - h)
    return im.crop((x, y, x + w, y + h))

def collage(tiles):
    """tiles: (path, x, y, w, h, fx, fy)"""
    im = Image.new("RGB", (W, H))
    for p, x, y, w, h, fx, fy in tiles:
        im.paste(fill(p, w, h, fx, fy), (x, y))
    return im

def band(im, y0, y1, a=0.35):
    """Soft dark band so the middle text always reads."""
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).rectangle((0, y0, W, y1), fill=int(255 * a))
    im.paste(Image.new("RGB", (W, H)), (0, 0), m.filter(ImageFilter.GaussianBlur(60)))

def segs(line):
    out, pink, buf = [], False, ""
    for ch in line:
        if ch == "*":
            if buf: out.append((buf, pink))
            buf, pink = "", not pink
        else: buf += ch
    if buf: out.append((buf, pink))
    return out

def write(im, lines, f, y, lh=1.15, stroke=5, maxw=1000, shadow=True):
    plain = [l.replace("*", "") for l in lines]
    wmax = max(f.getlength(p) for p in plain)
    if wmax > maxw: f = ImageFont.truetype(f.path, int(f.size * maxw / wmax))
    step = int(f.size * lh)
    if shadow:
        sh = Image.new("L", (W, H), 0); ds = ImageDraw.Draw(sh); yy = y
        for l in plain:
            ds.text(((W - f.getlength(l)) / 2, yy + 6), l, font=f, fill=200, stroke_width=stroke + 2, stroke_fill=200); yy += step
        im.paste(Image.new("RGB", (W, H)), (0, 0), sh.filter(ImageFilter.GaussianBlur(10)))
    d = ImageDraw.Draw(im)
    for l in lines:
        ss = segs(l); x = (W - sum(f.getlength(t) for t, _ in ss)) / 2
        for t, p in ss:
            d.text((x, y), t, font=f, fill=PINK if p else (255, 255, 255), stroke_width=stroke, stroke_fill=(0, 0, 0)); x += f.getlength(t)
        y += step
    return y

TITLE = font("ExtraBold", 76); ITAL = font("Bold Italic", 44)
def headline(im, lines, y, size=76):
    return write(im, lines, font("ExtraBold", size), y, lh=1.12, stroke=5)
def caption(im, lines, y):
    return write(im, lines, ITAL, y, lh=1.3, stroke=0)

def card(im, x, y, w, rows, title=None, rot=0, check=None):
    """White rounded card with dark text rows; check='x' or 'v' draws markers."""
    fb = font("Bold", 40); fm = font("SemiBold", 42)
    lh = 60; pad = 38
    hgt = pad * 2 + (lh * len(rows)) + (56 if title else 0)
    c = Image.new("RGBA", (w, hgt), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, w - 1, hgt - 1), 28, fill=(255, 255, 255, 245))
    yy = pad
    if title:
        d.text((pad, yy), title, font=fb, fill=INK); yy += 56
    for r in rows:
        xx = pad
        if check:
            cy = yy + 22
            if check == "v":
                d.ellipse((xx, cy - 16, xx + 32, cy + 16), fill=PINK)
                d.line([(xx + 8, cy), (xx + 14, cy + 7), (xx + 25, cy - 7)], fill=(255, 255, 255), width=5)
            else:
                d.line([(xx + 6, cy - 10), (xx + 26, cy + 10)], fill=INK, width=5); d.line([(xx + 26, cy - 10), (xx + 6, cy + 10)], fill=INK, width=5)
            xx += 52
        for t, p in segs(r):
            d.text((xx, yy), t, font=fm, fill=PINK if p else INK); xx += fm.getlength(t)
        yy += lh
    c = c.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = Image.new("L", (W, H), 0); sh.paste(c.split()[3].point(lambda v: v * 0.5), (x + 6, y + 14))
    im.paste(Image.new("RGB", (W, H)), (0, 0), sh.filter(ImageFilter.GaussianBlur(16)))
    im.paste(c, (x, y), c)
    return y + c.height

def photo_card(im, path, x, y, w, h, rot=0, fx=0.5, fy=0.5):
    p = fill(path, w, h, fx, fy).convert("RGBA")
    fr = Image.new("RGBA", (w + 20, h + 20), (255, 255, 255, 255)); fr.paste(p, (10, 10))
    m = Image.new("L", fr.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, fr.width - 1, fr.height - 1), 22, fill=255); fr.putalpha(m)
    fr = fr.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = Image.new("L", (W, H), 0); sh.paste(fr.split()[3].point(lambda v: v * 0.55), (x + 8, y + 16))
    im.paste(Image.new("RGB", (W, H)), (0, 0), sh.filter(ImageFilter.GaussianBlur(16)))
    im.paste(fr, (x, y), fr)

