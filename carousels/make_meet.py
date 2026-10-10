"""Instagram carousel 1080x1350: full-bleed photo, dark gradient, Montserrat text with one pink accent."""
import re, subprocess, sys
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
W, H = 1080, 1350
PINK = (242, 90, 170)
S = "/tmp/claude-0/-home-user-Ksu/03c5ee2b-73ae-52f6-90d7-fac0ce26511e/scratchpad"
BR = S + "/yt2/broll/"; SRC = S + "/car/src/"; FR = S + "/car/fr/"
def font(style, size):
    p = subprocess.run(["fc-match", "-f", "%{file}", f"Montserrat:style={style}"], capture_output=True, text=True).stdout
    return ImageFont.truetype(p, size)

def photo(path, fx=0.5, fy=0.5, blur=0, dark=0.0):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    # strip black phone-screenshot bars
    g = im.convert("L"); px = g.load(); w, h = im.size
    top = 0
    while top < h // 3 and max(px[x, top] for x in range(0, w, 16)) < 12: top += 1
    bot = h - 1
    while bot > h * 2 // 3 and max(px[x, bot] for x in range(0, w, 16)) < 12: bot -= 1
    # also drop the home-indicator strip area if a bar was found
    if top > 0 or bot < h - 1:
        im = im.crop((0, top + 4, w, bot - 4))
    w, h = im.size
    s = max(W / w, H / h); im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    w, h = im.size
    x = min(max(int(fx * w - W / 2), 0), w - W); y = min(max(int(fy * h - H / 2), 0), h - H)
    im = im.crop((x, y, x + W, y + H))
    if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
    if dark: im = Image.blend(im, Image.new("RGB", im.size, (0, 0, 0)), dark)
    return im

def gradient(im, side, frac=0.62, strength=0.88):
    g = Image.new("L", (1, H))
    for yy in range(H):
        t = (yy - H * (1 - frac)) / (H * frac) if side == "bottom" else ((H * frac) - yy) / (H * frac)
        t = max(0.0, min(1.0, t))
        g.putpixel((0, yy), int(255 * strength * (t ** 1.3)))
    g = g.resize((W, H))
    return Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), im, g)

def layout(lines, f, maxw):
    """lines: strings with *pink* parts, one row each (no wrapping)."""
    rows = []
    for ln in lines:
        row, pink, buf = [], False, ""
        for ch in ln:
            if ch == "*":
                if buf: row.append((buf, PINK if pink else (255, 255, 255)))
                buf, pink = "", not pink
            else:
                buf += ch
        if buf: row.append((buf, PINK if pink else (255, 255, 255)))
        rows.append(row)
    return rows

def fit(style, size, lines, maxw=960, upper=False):
    f = font(style, size)
    plain = [re.sub(r"\*", "", l).upper() if upper else re.sub(r"\*", "", l) for l in lines]
    w = max(f.getlength(p) for p in plain)
    return f if w <= maxw else font(style, int(size * maxw / w))

def draw_text(im, lines, f, y0, anchor="bottom", lh=1.28, maxw=940, upper=False):
    if upper: lines = [l.upper() for l in lines]
    rows = layout(lines, f, maxw); step = int(f.size * lh)
    total = step * len(rows)
    y = y0 - total if anchor == "bottom" else (y0 - total // 2 if anchor == "center" else y0)
    sh = Image.new("L", (W, H), 0); ds = ImageDraw.Draw(sh)
    pos = []
    for r in rows:
        rw = sum(f.getlength(t) for t, _ in r)
        x = (W - rw) / 2
        for t, c in r:
            pos.append((x, y, t, c)); ds.text((x, y + 5), t, font=f, fill=150); x += f.getlength(t)
        y += step
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    im.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), sh)
    d = ImageDraw.Draw(im)
    for px_, py_, t, c in pos: d.text((px_, py_), t, font=f, fill=c)
    return y

TITLE = font("ExtraBold", 74); BODY = font("Bold", 54); SMALL = font("SemiBold", 34)

SLIDES = [
 dict(img=SRC + "IMG_8812.PNG", fx=0.5, fy=0.62, title=True,
      text=["Как я встретила", "*мужчину мечты*,", "когда уже", "не верила,", "что такие есть"]),
 dict(img=FR + "b01_0.5.jpg", fx=0.45, fy=0.4,
      text=["Два года назад", "я вышла из отношений.", "Но они *не вышли из меня*."]),
 dict(img=FR + "b08_1.0.jpg", fx=0.5, fy=0.35,
      text=["В голове звучали его слова:", "«Кто тебя ещё", "так *полюбит*?»", "«Кто тебе ещё такие", "подарки будет дарить?»"]),
 dict(img=FR + "b02_0.5.jpg", fx=0.5, fy=0.4,
      text=["Он припоминал подарки.", "Манипулировал.", "А я верила, что", "*со мной что-то не так*."]),
 dict(img=BR + "n12.jpg", fx=0.5, fy=0.5,
      text=["И я решила:", "все мужчины такие.", "Все *абьюзеры*.", "Нормальных просто нет."]),
 dict(img=FR + "b14_1.0.jpg", fx=0.5, fy=0.4,
      text=["Потом были свидания.", "Несерьёзные. Балаболы.", "Те, кто *не настроен*", "*на отношения*."]),
 dict(img=FR + "b08_3.0.jpg", fx=0.5, fy=0.35,
      text=["Я обжигалась снова и снова.", "И в какой-то момент", "*не хотела больше*", "*никуда идти*."]),
 dict(img=BR + "n07.jpg", fx=0.5, fy=0.45,
      text=["Тогда я поменяла стратегию:", "поменяла окружение,", "перестала слушать", "«все мужики козлы»", "и начала *прокачивать*", "*самоценность*."]),
 dict(img=BR + "n04.jpg", fx=0.5, fy=0.35,
      text=["Я поняла главное:", "дело не в том,", "что «все такие».", "Дело в том,", "*кого я выбираю*."]),
 dict(img=SRC + "IMG_8813.PNG", fx=0.55, fy=0.45,
      text=["А потом появился он.", "Я увидела его и подумала:", "*это то, что я искала*."]),
 dict(img=SRC + "IMG_8811.PNG", fx=0.45, fy=0.5,
      text=["Сейчас он мой *лучший друг*.", "Дарит подарки без повода.", "Мы поддерживаем", "друг друга во всём.", "И мне больше не страшно", "быть собой."]),
 dict(img=BR + "n09.jpg", fx=0.5, fy=0.5, cta=True),
]
for n, sl in enumerate(SLIDES, 1):
    if sl.get("cta"):
        im = photo(sl["img"], sl["fx"], sl["fy"], blur=6, dark=0.45)
        y = draw_text(im, ["Если ты сейчас там,", "где была я, напиши", "*МАРШРУТ* в комментариях"], font("Bold", 56), 110, anchor="top")
        cov = Image.open("/home/user/Ksu/reels1/assets/lesson_cover.jpg").convert("RGB")
        cw = 900; cov = cov.resize((cw, int(cov.height * cw / cov.width)), Image.LANCZOS)
        cy = y + 40
        shadow = Image.new("L", (W, H), 0); ImageDraw.Draw(shadow).rounded_rectangle((90, cy + 12, 90 + cw, cy + 12 + cov.height), 28, fill=170)
        im.paste(Image.new("RGB", (W, H)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(18)))
        m = Image.new("L", cov.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, cw, cov.height), 28, fill=255)
        im.paste(cov, (90, cy), m)
        draw_text(im, ["и я пришлю тебе урок,", "как понять свой сценарий", "и встретить своего мужчину"], font("Bold", 56), cy + cov.height + 50, anchor="top")
    else:
        im = photo(sl["img"], sl["fx"], sl["fy"])
        im = gradient(im, "bottom", frac=0.7 if sl.get("title") else 0.62)
        if sl.get("title"):
            draw_text(im, sl["text"], fit("ExtraBold", 84, sl["text"], 960, True), H - 120, upper=True, lh=1.1)
            d = ImageDraw.Draw(im); t = "листай →"; d.text((W - 60 - SMALL.getlength(t), H - 80), t, font=SMALL, fill=(255, 255, 255))
        else:
            draw_text(im, sl["text"], fit("Bold", 60, sl["text"], 960), H - 100)
    im.save(f"{S}/car/out/slide_{n:02d}.jpg", quality=94)
    print("slide", n)
