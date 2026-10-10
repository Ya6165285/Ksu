"""Reel plan for video #2. Segments are pinned to phrases of the transcript.

Words of both sources live in one list (src 0 = this video, src 1 = video #1,
which holds the free-lesson fragment used as the call-to-action in every reel).
"""
import json, sys, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S1 = os.path.join(os.path.dirname(BASE), "yt2")
WORDS = os.path.join(BASE, "work", "words_all.json")
SRCS = [os.path.join(BASE, "src", "source.bin"), os.path.join(S1, "src", "source.bin")]
AUDIOS = [os.path.join(BASE, "work", "audio16.wav"), os.path.join(S1, "work", "audio16.wav")]
GAINS = [0, 1.3]   # dB, evens out the loudness of the two recordings
BR = os.path.join(S1, "broll")
REPO = "/home/user/Ksu/reels1/assets"
CLICK = os.path.join(BASE, "ref", "click_clean.wav")
FILLERS = {"ну", "короче", "блядь", "типа", "хуяк", "нихера", "вот"}
FILLER2 = {("то", "есть"), ("как", "бы"), ("грубо", "говоря")}

words = json.load(open(WORDS))["words"]


def find(phrase, near, src=0, span=40):
    """(first_idx, last_idx) of the phrase occurrence closest to time `near` in source `src`."""
    ws = phrase.split(); n = len(ws); best = None
    for i in range(len(words) - n + 1):
        if words[i]["src"] != src or abs(words[i]["s"] - near) > span:
            continue
        if [w["w"] for w in words[i:i + n]] == ws:
            if best is None or abs(words[i]["s"] - near) < abs(words[best]["s"] - near):
                best = i
    if best is None:
        raise SystemExit(f"phrase not found: {phrase!r} near {near} (src {src})")
    return best, best + n - 1


# free-lesson fragment from video #1
CTA = (("из этой боли у меня появился мой урок", 172, 1), ("почему это может быть", 180, 1))
# her own words about meeting her man, leads into the lesson
BRIDGE = (("и притянулся реально очень классный парень", 1043), ("он такой светлый он такой теплый", 1048))

REELS = [
    dict(id="n1", title=["Почему тебе кажется,", "что *нормальных мужчин* нет"],
         phr=[(("давайте разберем сначала вот это", 178), ("ну а я же знала ну так и есть", 222)),
              (("но опыт это не равно закон", 322), ("это не значит то что так всегда", 329)),
              (("тут знаете нужно поменять вашу установку", 464), ("будут классно ко мне относиться", 482))],
         zooms=[("но опыт это не равно закон", 322, 2.4)],
         ins=[("мужчина изменил", 182, "card", ("b08.mov", 1.0)),
              ("подружка нам сказала", 209, "card", ("b14.mov", 2.0)),
              ("будут классно ко мне относиться", 481, "pair", (("n06.jpg", 0), ("n02.jpg", 0), "+"))]),
    dict(id="n2", title=["Как одна неприятная история", "*ломает* все твои отношения"],
         phr=[(("у меня была такая ситуация", 224), ("и замечать только их", 298)),
              (("тоже самое то есть вот у нас происходит в принципе в отношениях", 300), ("вы начинаете думать то что нормальных мужчин нет", 320))],
         zooms=[("я вообще была в шоке", 238, 2.2)],
         ins=[("и была компания мужчин", 235, "card", ("b11.mov", 0.5)),
              ("она просто силами выплыла", 266, "card", ("b08.mov", 2.0)),
              ("если вам там изменил мужчина", 303, "card", ("b01.mov", 0.2))]),
    dict(id="n3", title=["Как ходить на свидания", "и *не разочаровываться*"],
         phr=[(("я когда была свободна", 329), ("и они проходят гораздо легче", 408))],
         zooms=[("я так обжигалась", 357, 2.2)],
         ins=[("иду на свидание", 333, "card", ("b01.mov", 0.2)),
              ("в отель", 341, "card", ("b07.mp4", 0.5)),
              ("возможно я так иду поразвлекаться", 383, "card", ("b11.mov", 0.5)),
              ("понравились его ценности", 393, "card", ("n12.jpg", 0))]),
    dict(id="n4", title=["Как перестать жалеть, что", "*столько вложила* в мужчину"],
         phr=[(("девушка встречается с мужчиной", 498), ("я потеряла время вместе с ним", 512)),
              (("вы объективно когда заходите в отношения", 517), ("лишь бы быть вот этой хорошей", 538)),
              (("когда мы делаем потому что вот в нас настолько много любви", 549), ("какая классная я могла так сделать", 581)),
              (("понимаете вот это две абсолютно разных мотивации", 619), ("просто потому что вот нам сейчас вместе классно", 638))],
         zooms=[("две абсолютно разных мотивации", 620, 2.2)],
         ins=[("я в него столько всего вложила", 509, "card", ("b13.mov", 0.5)),
              ("настолько много любви", 551, "card", ("n09.jpg", 0)),
              ("на день рождения", 558, "pair", (("n02.jpg", 0), ("n03.jpg", 0), "+")),
              ("нам сейчас вместе классно", 637, "card", ("b17.mov", 1.0))]),
    dict(id="n5", title=["Почему ты снова и снова", "выбираешь *не того* мужчину"],
         phr=[(("главный вопрос который я хочу чтобы вы себе задали", 1625), ("и какие сценарии я повторяю", 1652)),
              (("девушки перестают доверять мужчинам", 655), ("быстро отстраняться", 676)),
              (("девушка начинает выбирать просто знакомый тип мужчин", 700), ("я же говорила что так будет", 721))],
         zooms=[("а почему я снова выбираю таких", 1630, 2.4)],
         ins=[("какие красные флаги вы игнорируете", 1638, "card", ("b19.mov", 0.5)),
              ("начинают искать подвох", 659, "card", ("b14.mov", 1.0)),
              ("так мозгу комфортнее", 706, "card", ("b01.mov", 0.3))]),
    dict(id="n6", title=["Почему «хорошим девочкам»", "*не везёт* с мужчинами"],
         phr=[(("первое это нужно перестать в коммуникации с мужчиной быть", 742), ("вы разочаровываетесь в мужчинах", 811))],
         zooms=[("нужно всегда быть самой собой", 805, 2.4)],
         ins=[("наступаете на горло самой себе", 754, "card", ("b08.mov", 1.0)),
              ("из чистого сердца", 763, "card", ("n03.jpg", 0)),
              ("такого же человека к себе притянете", 794, "pair", (("n04.jpg", 0), ("n05.jpg", 0), "+"))]),
    dict(id="n7", title=["Как перестать бояться", "*уйти* от мужчины"],
         phr=[(("когда были предыдущие отношения я реально выходила с такой установкой", 828), ("кто тебе еще такие подарки будет дарить", 848)),
              (("и вот прошло уже два года как я рассталась", 865), ("из которой мы не можем выйти", 895))],
         zooms=[("насколько сейчас это мне кажется незначительная проблема", 868, 2.4)],
         ins=[("такие подарки будет дарить", 847, "card", ("b02.mov", 0.5)),
              ("прошло уже два года", 865, "pair", (("b08.mov", 1.0), ("n08.jpg", 0), "→")),
              ("живем в матрице", 876, "card", ("b01.mov", 0.3))]),
    dict(id="n8", title=["Как я встретила мужчину мечты,", "когда *разочаровалась* во всех"],
         phr=[(("что нужно делать первое это уходить из таких коммуникаций", 900), ("это реально сделать проще", 919)),
              (("и вот полгода я реально посвятила тому что я занималась собой", 924), ("что же со мной вообще как бы будет", 933)),
              (("я поменяла стратегию не в пользу того чтобы ходить и обжигаться", 943), ("ставить его под одну гребенку то что все мужчины такие", 967)),
              (("и когда я ходила на свидание во первых я это делала супер выборочно", 1037), ("он такой светлый он такой теплый", 1048))],
         zooms=[("это то что я искала это то самое", 1046, 2.4)],
         ins=[("людей которые в счастливых отношениях", 912, "card", ("n10.jpg", 0)),
              ("я занималась собой", 928, "pair", (("n04.jpg", 0), ("n08.jpg", 0), "+")),
              ("ходить и обжигаться", 945, "card", ("b08.mov", 1.5)),
              ("супер выборочно", 1039, "card", ("b01.mov", 0.3))]),
    dict(id="n9", title=["Что делать, если мужчинам", "от тебя *нужен только секс*"],
         phr=[(("во первых я вот когда мужчины стали ну там хотеть секса от меня", 986), ("с какой призмой мы на это смотрим", 1033))],
         zooms=[("ого прикольно меня видит сексуальной", 999, 2.2)],
         ins=[("вы привлекательны этому мужчине", 993, "card", ("n04.jpg", 0)),
              ("вызывало какую то агрессию", 1005, "card", ("b08.mov", 1.0)),
              ("сексуальной классной девушкой красивой", 1011, "pair", (("n05.jpg", 0), ("n02.jpg", 0), "+"))]),
    dict(id="n10", title=["Разлюбит ли мужчина,", "если ты *поправишься*"],
         phr=[(("а если бы твоя девушка сильно поправилась", 1130), ("а почему это должно меня заставить расстаться с девушкой", 1143)),
              (("а вот если бы я поправилась на пять килограмм", 1176), ("мне кажется даже вкусненько", 1184)),
              (("мне нравится девочка и плюс пять и плюс десять и плюс пятнадцать", 1204), ("и плюс пятнадцать", 1208)),
              (("когда у меня было рп", 1226), ("которые я желаю испытать каждой девушке", 1279))],
         bridge=[], zooms=[("он вылечил мою рп", 1233, 2.2)],
         ins=[("мне кажется даже вкусненько", 1183, "card", ("n09.jpg", 0)),
              ("посмотри какая ты красивая", 1240, "card", ("n05.jpg", 0)),
              ("он меня выбирает в любом состоянии", 1275, "pair", (("n02.jpg", 0), ("n06.jpg", 0), "+"))]),
    dict(id="n11", title=["Что настоящий мужчина", "*делает* для своей женщины"],
         phr=[(("что для тебя значит фраза моя девушка может на меня положиться", 1405), ("в эмоциональном плане если очень тяжело", 1437)),
              (("в плане финансовых вопросов мужчина как мне кажется должен сам закрывать этот вопрос", 1441), ("не чувствовать вот это недоуважение", 1462)),
              (("мне нравится дарить подарки", 1482), ("иногда сумочку", 1509))],
         bridge=[], zooms=[("сам предлагать просить не надо", 1446, 2.2)],
         ins=[("каких то финансовых вопросах", 1431, "card", ("b13.mov", 0.5)),
              ("побаловать свою малышку", 1451, "card", ("n06.jpg", 0)),
              ("мне нравится дарить подарки", 1482, "pair", (("n02.jpg", 0), ("b17.mov", 1.0), "+")),
              ("нужна регулярность", 1500, "card", ("n01.jpg", 0))]),
    dict(id="n12", title=["Что делать, если тебе", "*изменяли* снова и снова"],
         phr=[(("главный вывод который я хочу чтобы ты поняла", 1850), ("это не определяет твою судьбу", 1893)),
              (("и не позволяй ни тем мужчинам убедить тебя что твоего мужчины не существует", 1938), ("он есть и он к тебе придет", 1950))],
         zooms=[("три мужчины это не равно все мужчины", 1857, 2.4)],
         ins=[("тебе изменяли", 1855, "card", ("b08.mov", 1.0)),
              ("носить ее на руках", 1876, "pair", (("n06.jpg", 0), ("n09.jpg", 0), "+")),
              ("он есть и он к тебе придет", 1950, "card", ("n12.jpg", 0))]),
]


def spec_for(r):
    rng = lambda a, b: (find(*a)[0], find(*b)[1])
    ranges = [rng(a, b) for a, b in r["phr"]]
    for a, b in r.get("bridge", [BRIDGE]):
        ranges.append(rng(a, b))
    ranges.append(rng(*CTA))
    drop = []
    allidx = [i for a, b in ranges for i in range(a, b + 1)]
    cta0 = ranges[-1][0]
    for n, i in enumerate(allidx):
        if i >= cta0 and words[i]["src"] == 1:
            continue          # the lesson fragment stays as recorded
        w = words[i]["w"]
        nx = words[allidx[n + 1]]["w"] if n + 1 < len(allidx) else ""
        if w in FILLERS:
            drop.append(i)
        elif (w, nx) in FILLER2:
            drop += [i, allidx[n + 1]]
        elif n > 0 and words[allidx[n - 1]]["w"] == w and len(w) > 2:
            drop.append(allidx[n - 1])
    return ranges, sorted(set(drop))


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
            if kind == "card":
                d = 2.4; f, ss = pay
                ins.append(dict(kind="card", file=os.path.join(BR, f), ss=ss, t=round(t, 2), dur=d,
                                w=440, x=[340, 740][side % 2], y=1600, rot=[-5, 5][side % 2]))
            else:
                d = 2.6; (fa, sa), (fb, sb), sym = pay
                ins.append(dict(kind="card", file=os.path.join(BR, fa), ss=sa, t=round(t, 2), dur=d, w=400, x=280, y=1600, rot=-6))
                ins.append(dict(kind="card", file=os.path.join(BR, fb), ss=sb, t=round(t + 0.35, 2), dur=d - 0.35, w=400, x=800, y=1615, rot=6))
                syms.append(dict(t=round(t + 0.2, 2), dur=d - 0.2, ch=sym, y=1610))
            last_end = t + d; side += 1
        cta_first = ranges[-1][0]
        cta_t = outw[min(i for i in keep if i >= cta_first)][0]
        for x in ins:
            if x["t"] + x["dur"] > cta_t - 0.1:
                raise SystemExit(f"{r['id']}: insert at {x['t']} runs into the lesson fragment")
        spec = dict(source=SRCS[0], sources=SRCS, audios=AUDIOS, gains=GAINS, words=WORDS,
                    work=os.path.join(BASE, "build", r["id"]), title=r["title"],
                    ranges=ranges, drop=drop, inserts=ins, symbols=syms, zooms=zooms, pop=CLICK,
                    lesson_cover=os.path.join(REPO, "lesson_cover.jpg"), endcard=os.path.join(REPO, "endcard.mp4"),
                    cta=dict(type="own", first_word=min(i for i in keep if i >= cta_first)))
        json.dump(spec, open(os.path.join(BASE, "specs", r["id"] + ".json"), "w"), ensure_ascii=False, indent=1)
        print(r["id"], f"{total:.1f}s", len(ins), "inserts")


if __name__ == "__main__":
    main(sys.argv[1:])
