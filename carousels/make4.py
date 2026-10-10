"""Carousel v4: Ksusha's own text; one strong photo per slide, photo cards on top where it helps."""
import sys; sys.path.insert(0, ".")
from carlib import *

def wrap(text, f, maxw):
    rows = []
    for para in text.split("\n"):
        cur = ""
        for wd in para.split(" "):
            t = (cur + " " + wd).strip()
            if f.getlength(t.replace("*", "")) > maxw and cur: rows.append(cur); cur = wd
            else: cur = t
        rows.append(cur)
    return rows

def text_card(im, x, y, w, text, rot=0, size=40):
    """White card with wrapped paragraphs (blank line = gap). *pink* works inside a row."""
    f = font("SemiBold", size); pad = 40; lh = int(size * 1.42)
    rows = []
    for k, para in enumerate(text.split("\n\n")):
        if k: rows.append("")
        rows += wrap(para, f, w - 2 * pad)
    hgt = pad * 2 + sum(lh if r else lh // 2 for r in rows)
    c = Image.new("RGBA", (w, hgt), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, w - 1, hgt - 1), 30, fill=(255, 255, 255, 246))
    yy = pad
    for r in rows:
        if not r: yy += lh // 2; continue
        xx = pad
        for t, p in segs(r):
            d.text((xx, yy), t, font=f, fill=PINK if p else INK); xx += f.getlength(t)
        yy += lh
    c = c.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = Image.new("L", (W, H), 0); sh.paste(c.split()[3].point(lambda v: v * 0.5), (x + 6, y + 14))
    im.paste(Image.new("RGB", (W, H)), (0, 0), sh.filter(ImageFilter.GaussianBlur(16)))
    im.paste(c, (x, y), c)
    return y + c.height

def card_h(w, text, size=40):
    probe = Image.new("RGB", (W, H)); return text_card(probe, 0, 0, w, text, size=size)

def bg(path, fx=0.5, fy=0.5):
    return fill(path, W, H, fx, fy)

slides = []

# 1. cover: just the sea photo
im = bg(SRC + "IMG_8812.PNG", 0.5, 0.55)
band(im, 40, 520, 0.4)
y = headline(im, ["Как я встретила", "*мужчину мечты*,"], 90, 84)
caption(im, ["когда уже не верила, что такие есть"], y + 14)
photo_card(im, SRC + "chat_clean.png", 455, 880, 570, 406, rot=-4, fx=0.5, fy=0.5)
slides.append(im)

# 2. the abusive relationship
im = bg(FR + "cry.jpg", 0.5, 0.38)
band(im, 40, 420, 0.45)
y = headline(im, ["Два года назад я вышла", "из отношений"], 90)
text_card(im, 80, 820, 920, "в которых были *абьюз и постоянные манипуляции*.\n\nНо самое страшное — я искренне верила, что проблема во мне. Что со мной что-то не так и именно я виновата во всём происходящем.", rot=-1.5, size=38)
slides.append(im)

# 3. all men are the same: black editorial slide
im = Image.new("RGB", (W, H), (10, 7, 9))
glow = Image.new("L", (W, H), 0); ImageDraw.Draw(glow).ellipse((-300, 700, 700, 1700), fill=90)
im.paste(Image.new("RGB", (W, H), (120, 30, 80)), (0, 0), glow.filter(ImageFilter.GaussianBlur(200)))
d = ImageDraw.Draw(im); x = 90; y = 300
f1 = font("SemiBold", 50); d.text((x, y), "Потом я решила:", font=f1, fill=(200, 185, 193)); y += 110
fb = font("ExtraBold", 138)
for line, col in [("ВСЕ", (255, 255, 255)), ("МУЖЧИНЫ", (255, 255, 255)), ("ТАКИЕ.", PINK)]:
    d.text((x, y), line, font=fb, fill=col); y += 150
y += 30; d.rectangle((x, y, x + 140, y + 8), fill=PINK); y += 60
fi = font("Bold Italic", 54)
for line in ["Все абьюзеры.", "Нормальных просто нет."]:
    d.text((x, y), line, font=fi, fill=(255, 255, 255)); y += 76
slides.append(im)

# 4. dates: four restaurant photos, compact text across the middle
im = collage([(SRC + "IMG_8824.PNG", 0, 0, W // 2, H // 2, 0.5, 0.42), (SRC + "IMG_8823.PNG", W // 2, 0, W // 2, H // 2, 0.5, 0.35),
              (SRC + "IMG_8822.PNG", 0, H // 2, W // 2, H // 2, 0.5, 0.55), (SRC + "IMG_8825.PNG", W // 2, H // 2, W // 2, H // 2, 0.5, 0.5)])
band(im, 520, 900, 0.35)
y = headline(im, ["Потом были свидания"], 560, 70)
t4 = "Я снова и снова *разочаровывалась* в мужчинах. И в какой-то момент настолько устала, что больше не хотела ни с кем знакомиться."
text_card(im, 160, y + 14, 760, t4, rot=-1, size=30)
slides.append(im)

# 5. the realisation: keep the face clear
im = bg(BR + "p06.jpg", 0.5, 0.3)
band(im, 20, 300, 0.45)
headline(im, ["Но потом я поняла одну вещь"], 70, 64)
t5 = "Если я продолжу смотреть на мужчин через призму прошлых разочарований, то даже *достойному мужчине* будет сложно появиться в моей жизни.\n\nЯ не хотела больше жить с убеждением, что хороших мужчин не существует."
text_card(im, 120, H - card_h(840, t5, 29) - 50, 840, t5, rot=-1, size=29)
slides.append(im)

# 6. new approach: collage (people around me, events, flowers, me) with the card in the middle
im = collage([(BR + "n10.jpg", 0, 0, W // 2, H // 2, 0.5, 0.5), (BR + "n03.jpg", W // 2, 0, W // 2, H // 2, 0.4, 0.42),
              (BR + "n09.jpg", 0, H // 2, W // 2, H // 2, 0.45, 0.55), (BR + "n01.jpg", W // 2, H // 2, W // 2, H // 2, 0.5, 0.3)])
band(im, 30, 300, 0.45)
headline(im, ["Я изменила не требования,", "а свой *подход*"], 60, 66)
t6 = "— Сменила окружение.\n\n— Перестала слушать разговоры о том, что «все мужики козлы».\n\n— Начала работать над *самоценностью* и перестала искать подтверждение своей значимости в мужчинах."
text_card(im, 230, (H - card_h(620, t6, 26)) // 2, 620, t6, rot=1, size=26)
slides.append(im)

# 7. the main thing
im = bg(BR + "n04.jpg", 0.5, 0.4)
band(im, 820, 1320, 0.55)
y = headline(im, ["Дело не в том,", "что «все такие»"], 870)
caption(im, ["Дело в том, кого я выбираю"], y + 16)
slides.append(im)

# 8. and then he appeared: one photo
im = bg(SRC + "IMG_8815.PNG", 0.55, 0.5)
band(im, 30, 420, 0.45)
y = headline(im, ["А потом", "появился он"], 70, 86)
caption(im, ["Я увидела его и подумала:", "это то, что я искала"], y + 12)
slides.append(im)

# 9. today: a wall of gifts and flowers, the two of you in a smaller card
T3 = H // 3
im = collage([(FR + "b03_5.6.jpg", 0, 0, W // 2, T3, 0.45, 0.45), (FR + "b17_1.0.jpg", W // 2, 0, W // 2, T3, 0.5, 0.5),
              (FR + "b18_1.0.jpg", 0, T3, W // 2, T3, 0.5, 0.45), (BR + "p16.png", W // 2, T3, W // 2, T3, 0.5, 0.45),
              (BR + "n06.jpg", 0, 2 * T3, W // 2, H - 2 * T3, 0.5, 0.55), (BR + "n01.jpg", W // 2, 2 * T3, W // 2, H - 2 * T3, 0.5, 0.3)])
band(im, 0, 240, 0.5); band(im, 1150, H, 0.55)
headline(im, ["Сегодня он мой любимый", "мужчина и *лучший друг*"], 40, 64)
photo_card(im, SRC + "IMG_8811.PNG", 345, 330, 380, 620, rot=-2, fx=0.45, fy=0.45)
caption(im, ["Дарит подарки без повода. Мы поддерживаем", "друг друга во всём. И мне больше", "не страшно быть собой"], 1170)
slides.append(im)

# 10. CTA
im = collage([(BR + "n01.jpg", 0, 0, W // 2, H // 2, 0.5, 0.35), (BR + "n03.jpg", W // 2, 0, W // 2, H // 2, 0.5, 0.45),
              (BR + "n05.jpg", 0, H // 2, W // 2, H // 2, 0.5, 0.45), (BR + "n09.jpg", W // 2, H // 2, W // 2, H // 2, 0.5, 0.5)])
band(im, 60, 1300, 0.55)
y = headline(im, ["Если ты сейчас там,", "где была я"], 90, 80)
photo_card(im, "/home/user/Ksu/reels1/assets/lesson_cover.jpg", 120, y + 40, 800, 450, rot=-2)
text_card(im, 90, y + 560, 900, "Напиши *МАРШРУТ* в комментариях, и я пришлю тебе урок, как понять свой сценарий и встретить своего мужчину", rot=1.5, size=42)
slides.append(im)

for n, im in enumerate(slides, 1):
    im.save(f"{S}/car/out4/slide_{n:02d}.jpg", quality=94)
print(len(slides))
