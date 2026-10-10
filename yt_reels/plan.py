"""Reel plan. Segment boundaries and inserts are pinned to phrases in the source transcript."""
import json, sys, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDS = os.path.join(BASE, "work", "words.json")
SRC = os.path.join(BASE, "src", "source.bin")
BR = os.path.join(BASE, "broll")
ST = os.path.join(BASE, "stickers")
REPO = "/home/user/Ksu/reels1/assets"
CLICK = os.path.join(BASE, "ref", "click_clean.wav")
FILLERS = {"ну", "короче", "блядь", "типа"}

words = json.load(open(WORDS))["words"]


def find(phrase, near, span=40):
    """(first_idx, last_idx) of the phrase occurrence closest to source time `near`."""
    ws = phrase.split(); n = len(ws); best = None
    for i in range(len(words) - n + 1):
        if abs(words[i]["s"] - near) > span:
            continue
        if [w["w"] for w in words[i:i + n]] == ws:
            if best is None or abs(words[i]["s"] - near) < abs(words[best]["s"] - near):
                best = i
    if best is None:
        raise SystemExit(f"phrase not found: {phrase!r} near {near}")
    return best, best + n - 1


CTA = (("из этой боли у меня появился мой урок", 172), ("почему это может быть", 180))
BRIDGE = (("я нахожусь в счастливых офигенных отношениях", 1207), ("мой лучший друг", 1211))

# inserts: (phrase, near, kind, payload)
#   card    -> (file, ss)        sticker -> name        pair -> ((fileA, ssA), (fileB, ssB), symbol)
REELS = [
    dict(id="r1", title=["Как я вышла из отношений,", "в которых *потеряла себя*"],
         phr=[(("выход из отношений где меня обеспечивали", 141), ("попадаются какие то не такие", 166)),
              (("для меня это было действительно тяжело", 185), ("самых сильных страхов", 215))],
         cta="own", bridge=False, zooms=[("я вышла и я жива", 208, 2.6)],
         ins=[("меня обеспечивали", 143, "pair", (("b15.mov", 0.2), ("b02.mov", 0.5), "+")),
              ("очень сильно страшно уйти", 147, "card", ("b01.mov", 0.2)),
              ("разочаровываются в мужчинах", 160, "card", ("b08.mov", 1.0)),
              ("я не буду зарабатывать деньги", 199, "card", ("b13.mov", 0.5)),
              ("прекрасных отношениях", 211, "pair", (("b03.mov", 5.6), ("b17.mov", 1.0), "+")),]),
    dict(id="r2", title=["Как перестать выбирать не тех", "и встретить *достойного*"],
         phr=[(("мне было важно когда я выйду из отношений", 436), ("такого же мужчину как и я", 462))],
         cta="own", bridge=[(("и тогда мне попался парень", 462), ("повлиял на мою жизнь", 465)), BRIDGE], zooms=[("я была сама по себе достойной", 442, 2.6)],
         ins=[("выйду из отношений", 435, "card", ("b01.mov", 0.2)),
              ("самый классный мужчина", 439, "card", ("b03.mov", 5.6)),
              ("на классного такого же мужчину", 457, "card", ("b17.mov", 2.0)),
              ("счастливых офигенных отношениях", 1208, "pair", (("b18.mov", 1.0), ("b09.mov", 0.5), "+")),]),
    dict(id="r3", title=["Как я похудела, когда перестала", "*ненавидеть* своё тело"],
         phr=[(("тогда мне попался парень", 462), ("то что я похудею", 506))],
         cta="card", bridge=False, zooms=[("и просто этот вес он ушел легко", 476, 2.4)],
         ins=[("тогда мне попался парень", 462, "pair", (("before.jpg", 0), ("after.jpg", 0), "→")),
              ("окружил меня такой любовью", 472, "pair", (("b03.mov", 5.6), ("b18.mov", 1.0), "+")),]),
    dict(id="r4", title=["Как перестать страдать", "и начать *жить счастливо*"],
         phr=[(("моисей должен был вывести за сорок дней", 646), ("у меня ничего не получается", 741))],
         cta="card", bridge=False, zooms=[("они выходили сорок лет", 656, 2.4), ("то мы привлекаем еще больше", 724, 2.4)],
         ins=[("встречаемся с подружкой", 665, "card", ("b11.mov", 0.5)),
              ("все сжималось", 702, "card", ("b14.mov", 2.0)),
              ("за три месяца", 729, "card", ("b07.mp4", 0.5)),
              ("мы аж плачем", 673, "card", ("b08.mov", 1.0)),]),
    dict(id="r5", title=["Как перестать бояться *за деньги*,", "даже если их нет"],
         phr=[(("если вы сейчас проживаете тяжелый финансовый этап", 745), ("поэтому заостряйте на это внимание", 812))],
         cta="card", bridge=False, zooms=[("дочь миллиардера", 808, 2.4)],
         ins=[("везет по жизни", 782, "card", ("b02.mov", 0.5)),
              ("у самого богатого", 797, "pair", (("b13.mov", 0.5), ("b15.mov", 0.2), "+")),]),
    dict(id="r6", title=["Как раз и навсегда перестать", "зависеть от *чужого мнения*"],
         phr=[(("там где ваш страх там рост", 816), ("что я вышла из этих отношений", 861))],
         cta="own", bridge=[(("я нахожусь в прекрасных отношениях", 211), ("самых сильных страхов", 215))], zooms=[("я живу только в моменте сейчас", 855, 2.0)],
         ins=[("не принимайте эту мысль", 849, "card", ("b05.mov", 2.0)),
              ("я так боялась", 823, "card", ("b08.mov", 2.0)),
              ("в прекрасных отношениях", 211, "pair", (("b18.mov", 1.0), ("b03.mov", 5.6), "+"))]),
    dict(id="r7", title=["Как за год изменить жизнь", "*до неузнаваемости*"],
         phr=[(("остановитесь сейчас и вот подумайте", 1300), ("самый лучший для нас момент", 1336))],
         cta="card", bridge=False, zooms=[("то о чем вы молились", 1323, 2.4)],
         ins=[("очень много потрясающих событий", 1318, "pair", (("b10.mov", 1.0), ("b12.mov", 3.0), "+")),
              ("самый лучший для нас момент", 1333, "card", ("b09.mov", 0.5))]),
    dict(id="r8", title=["Почему худшее в жизни —", "*лучшее*, что с тобой случилось"],
         phr=[(("верующему все во благо", 1395), ("обернулось для меня во благо", 1490))],
         cta="card", bridge=False, zooms=[("но мне это было все во благо", 1456, 2.4)],
         ins=[("глава из библии", 1400, "card", ("b01.mov", 0.5)),
              ("сдали его в рабство", 1416, "card", ("b08.mov", 2.5)),
              ("правой рукой", 1442, "card", ("b05.mov", 0.5)),
              ("мы начинаем страдать", 1465, "card", ("b14.mov", 1.0)),
              ("обернулось для меня во благо", 1485, "pair", (("b10.mov", 1.0), ("b12.mov", 3.0), "→"))]),
    dict(id="r9", title=["Что делать, если то, о чём мечтаешь,", "*не получается*"],
         phr=[(("я вот была на таком вдохновение", 969), ("не столько сколько я ожидала", 976)),
              (("почему у меня не получается снова пробить", 986), ("несколько лет назад", 993)),
              (("у ксюши в мечтах построить империю", 1079), ("я сплю и вижу это", 1087)),
              (("у нас есть момент сейчас первое что мы делаем", 1094), ("смиряемся с тем что сейчас есть", 1098)),
              (("давайте применим технику благодарности", 1112), ("давайте применим технику благодарности", 1112)),
              (("когда мы хотим мы хотим вот чего то из нехватки", 1171), ("благодарить за то что у нас есть", 1179)),
              (("я благодарю за то что мой блог растет", 1188), ("я меняю их жизнь", 1196)),
              (("я благодарю за то что у меня есть эта прекрасная квартира", 1252), ("смотрю на нее и кайфую", 1258)),
              (("я благодарю за то что я живу свою самую лучшую жизнь", 1278), ("исполнилось чем я только хотела", 1291)),
              (("остановитесь сейчас и вот подумайте", 1300), ("самый лучший для нас момент", 1336))],
         cta="own", bridge=True, zooms=[("я сплю и вижу это", 1086, 2.2), ("но оно работает", 1330, 2.4)],
         ins=[("на нем собралось заявок", 974, "card", ("b12.mov", 3.0)),
              ("цифру в доходе", 989, "card", ("b13.mov", 0.5)),
              ("тысяча учениц", 1084, "pair", (("b10.mov", 1.0), ("b11.mov", 0.5), "+")),
              ("смиряемся с тем что сейчас есть", 1097, "card", ("b01.mov", 0.3)),
              ("из нехватки", 1172, "card", ("b08.mov", 1.5)),
              ("благодарить за то что у нас есть", 1179, "card", ("b02.mov", 0.5)),
              ("мой блог растет", 1189, "card", ("b05.mov", 0.5)),
              ("эта прекрасная квартира", 1253, "card", ("b07.mp4", 0.5)),
              ("самую лучшую жизнь", 1280, "card", ("b09.mov", 0.5)),
              ("два года назад", 1304, "pair", (("b10.mov", 1.5), ("b12.mov", 3.0), "→")),
              ("о чем вы молились", 1324, "card", ("b03.mov", 5.6)),
              ("счастливых офигенных отношениях", 1208, "pair", (("b18.mov", 1.0), ("b17.mov", 1.0), "+"))]),
]


def spec_for(r):
    ranges = [(find(a, ta)[0], find(b, tb)[1]) for (a, ta), (b, tb) in r["phr"]]
    if r["cta"] == "own":
        br = r.get("bridge")
        if br is True:
            br = [BRIDGE]
        for (a, ta), (b, tb) in (br or []):
            ranges.append((find(a, ta)[0], find(b, tb)[1]))
        ranges.append((find(*CTA[0])[0], find(*CTA[1])[1]))
    drop = []
    allidx = [i for a, b in ranges for i in range(a, b + 1)]
    for n, i in enumerate(allidx):
        w = words[i]["w"]
        if w in FILLERS:
            drop.append(i)
        elif n > 0 and words[allidx[n - 1]]["w"] == w and len(w) > 2:
            drop.append(allidx[n - 1])
    return ranges, drop


def main(sel):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from reel import build_timeline
    os.makedirs(os.path.join(BASE, "specs"), exist_ok=True)
    for r in REELS:
        if sel and r["id"] not in sel:
            continue
        ranges, drop = spec_for(r)
        clips, outw, total, keep = build_timeline({"ranges": ranges, "drop": drop}, words)
        kept = set(keep)

        def t_of(phrase, near):
            a, b = find(phrase, near)
            for i in range(a, b + 1):
                if i in kept:
                    return outw[i][0]
            raise SystemExit(f"{r['id']}: insert phrase {phrase!r} is not inside the reel")

        zooms = []
        for phrase, near, d in r["zooms"]:
            t = t_of(phrase, near); zooms.append((round(t, 2), round(min(total, t + d), 2)))
        ins, syms, last_end, side = [], [], -1.0, 0
        for phrase, near, kind, pay in sorted(r["ins"], key=lambda e: t_of(e[0], e[1])):
            t = t_of(phrase, near)
            if t < last_end + 0.1:
                t = last_end + 0.1
            for za, zb_ in zooms:
                if za - 1.0 < t < zb_:
                    t = zb_ + 0.05
            if kind == "sticker":
                d = 1.6
                ins.append(dict(kind="sticker", file=os.path.join(ST, pay + ".png"), t=round(t, 2), dur=d,
                                size=300, x=[380, 700][side % 2], y=1610, rot=[-6, 6][side % 2]))
            elif kind == "card":
                d = 2.4; f, ss = pay
                ins.append(dict(kind="card", file=os.path.join(BR, f), ss=ss, t=round(t, 2), dur=d,
                                w=440, x=[340, 740][side % 2], y=1600, rot=[-5, 5][side % 2]))
            else:
                d = 2.6; (fa, sa), (fb, sb), sym = pay
                ins.append(dict(kind="card", file=os.path.join(BR, fa), ss=sa, t=round(t, 2), dur=d, w=400, x=280, y=1600, rot=-6))
                ins.append(dict(kind="card", file=os.path.join(BR, fb), ss=sb, t=round(t + 0.35, 2), dur=d - 0.35, w=400, x=800, y=1615, rot=6))
                syms.append(dict(t=round(t + 0.2, 2), dur=d - 0.2, ch=sym, y=1610))
            last_end = t + d; side += 1
        spec = dict(source=SRC, words=WORDS, work=os.path.join(BASE, "build", r["id"]), title=r["title"],
                    ranges=ranges, drop=drop, inserts=ins, symbols=syms, zooms=zooms, pop=CLICK,
                    lesson_cover=os.path.join(REPO, "lesson_cover.jpg"), endcard=os.path.join(REPO, "endcard.mp4"))
        spec["cta"] = dict(type="own", first_word=ranges[-1][0]) if r["cta"] == "own" else dict(type="card")
        json.dump(spec, open(os.path.join(BASE, "specs", r["id"] + ".json"), "w"), ensure_ascii=False, indent=1)
        print(r["id"], f"{total:.1f}s", len(ins), "inserts")


if __name__ == "__main__":
    main(sys.argv[1:])
