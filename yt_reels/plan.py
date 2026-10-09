"""Reel plan: segments are given in SOURCE seconds; this turns them into specs for reel.py."""
import json, sys, os, bisect

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDS = os.path.join(BASE, "work", "words.json")
SRC = os.path.join(BASE, "src", "source.bin")
BR = os.path.join(BASE, "broll")
REPO = "/home/user/Ksu/reels1/assets"
POP = os.path.join(os.path.dirname(BASE), "reels", "sfx", "pop.wav")
FILLERS = {"ну", "короче", "блядь", "типа"}
CTA_OWN = (172.0, 181.2)  # «из этой боли у меня появился мой урок ... почему это может быть»

words = json.load(open(WORDS))["words"]
starts = [w["s"] for w in words]


def find(phrase, near, span=40):
    """Return (first_idx, last_idx) of phrase occurring near source time `near`."""
    ws = phrase.split(); n = len(ws)
    best = None
    for i in range(len(words) - n + 1):
        if abs(words[i]["s"] - near) > span: continue
        if [w["w"] for w in words[i:i + n]] == ws:
            if best is None or abs(words[i]["s"] - near) < abs(words[best]["s"] - near): best = i
    if best is None: raise SystemExit(f"phrase not found: {phrase!r} near {near}")
    return best, best + n - 1


def idx_at(t, side):
    """First word starting at/after t (side='s') or last word ending at/before t (side='e')."""
    if side == "s":
        return bisect.bisect_left(starts, t - 0.05)
    i = bisect.bisect_right(starts, t + 0.05) - 1
    return i


REELS = [
    dict(id="r1", phr=[(("выход из отношений где меня обеспечивали",141),("попадаются какие то не такие",166)),(("для меня это было действительно тяжело",185),("самых сильных страхов",215))], title=["Он *внушал,* что без него", "я ^пропаду^"],
         segs=[(141.04, 168.9), (183.9, 223.0)], cta="own",
         ins=[(150.0, "b08.mov", 0.5, 2.6, "L"), (162.0, "b14.mov", 1.0, 2.4, "R"), (186.5, "b01.mov", 0.2, 2.4, "L"),
              (208.5, "b03.mov", 4.5, 2.6, "R"), (213.0, "b18.mov", 1.0, 2.4, "L")],
         zooms=[(208.06, 211.0)]),
    dict(id="r2", phr=[(("мне было важно когда я выйду из отношений",436),("такого же мужчину как и я",462))], title=["Почему тебе попадаются", "*«не те»* мужчины"],
         segs=[(424.08, 464.5)], cta="own",
         ins=[(430.0, "b10.mov", 0.5, 2.4, "L"), (441.0, "b17.mov", 2.0, 2.4, "R"), (452.0, "p06.jpg", 0, 2.2, "L")],
         zooms=[(445.0, 448.0)]),
    dict(id="r3", phr=[(("тогда мне попался парень",462),("то что я похудею",506))], title=["Я *похудела,* когда", "перестала себя ^мучить^"],
         segs=[(461.0, 507.98)], cta="card",
         ins=[(466.0, "b03.mov", 1.0, 2.4, "R"), (472.0, "b07.mp4", 0.5, 2.4, "L"), (495.0, "b08.mov", 1.5, 2.2, "R")],
         zooms=[(478.74, 482.0)]),
    dict(id="r4", phr=[(("моисей должен был вывести за сорок дней",646),("у меня ничего не получается",741))], title=["Ты *сама* продлеваешь", "свои страдания"],
         segs=[(642.5, 743.0)], cta="card",
         ins=[(650.0, "b01.mov", 0.3, 2.4, "L"), (672.0, "b08.mov", 0.8, 2.6, "R"), (700.0, "b14.mov", 2.0, 2.4, "L"),
              (720.0, "b08.mov", 2.0, 2.2, "R")],
         zooms=[(653.52, 657.0), (727.14, 731.0)]),
    dict(id="r5", phr=[(("если вы сейчас проживаете тяжелый финансовый этап",745),("поэтому заостряйте на это внимание",812))], title=["Если сейчас *нет денег —*", "послушай это"],
         segs=[(743.92, 813.38)], cta="card",
         ins=[(752.0, "b13.mov", 0.5, 2.4, "R"), (770.0, "b02.mov", 0.5, 2.4, "L"), (790.0, "b15.mov", 0.3, 2.4, "R"),
              (805.0, "b13.mov", 3.0, 2.2, "L")],
         zooms=[(798.36, 802.0)]),
    dict(id="r6", phr=[(("там где ваш страх там рост",816),("в моменте сейчас",857))], title=["Эту мысль", "тебе *просто внушили*"],
         segs=[(813.38, 858.94)], cta="card",
         ins=[(820.0, "b08.mov", 2.0, 2.4, "L"), (838.0, "b01.mov", 1.0, 2.4, "R"), (850.0, "b05.mov", 0.5, 2.2, "L")],
         zooms=[(847.52, 851.0)]),
    dict(id="r7", phr=[(("остановитесь сейчас и вот подумайте",1300),("самый лучший для нас момент",1336))], title=["Вспомни, какой ты была", "*год назад*"],
         segs=[(1292.48, 1338.94)], cta="card",
         ins=[(1300.0, "b07.mp4", 0.5, 2.4, "L"), (1314.0, "b12.mov", 2.0, 2.4, "R"), (1326.0, "b09.mov", 0.5, 2.4, "L")],
         zooms=[(1325.2, 1329.0)]),
    dict(id="r8", phr=[(("верующему все во благо",1395),("обернулось для меня во благо",1490))], title=["Всё плохое, что случилось,", "было *тебе во благо*"],
         segs=[(1396.28, 1496.32)], cta="card",
         ins=[(1410.0, "b01.mov", 0.5, 2.4, "L"), (1425.0, "b08.mov", 0.5, 2.4, "R"), (1442.0, "b10.mov", 1.0, 2.4, "L"),
              (1470.0, "b12.mov", 4.0, 2.4, "R"), (1485.0, "b11.mov", 0.5, 2.2, "L")],
         zooms=[(1457.84, 1461.0), (1481.1, 1484.0)]),
]


def spec_for(r):
    ranges = []
    for (a, ta), (b, tb) in r["phr"]:
        ranges.append((find(a, ta)[0], find(b, tb)[1]))
    if r["cta"] == "own":
        ranges.append((find("из этой боли у меня появился мой урок", 172)[0], find("почему это может быть", 180)[1]))
    drop = []
    allidx = [i for a, b in ranges for i in range(a, b + 1)]
    for n, i in enumerate(allidx):
        w = words[i]["w"]
        if w in FILLERS:
            drop.append(i)
        elif n > 0 and words[allidx[n - 1]]["w"] == w and len(w) > 2:
            drop.append(allidx[n - 1])  # stutter: keep the second take
    return ranges, drop


def out_time_map(ranges, drop):
    """Approximate source->output time mapping (same rules as reel.build_timeline)."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from reel import build_timeline
    clips, outw, total, keep = build_timeline({"ranges": ranges, "drop": drop}, words)

    def f(t):
        best = None
        for c in clips:
            if c[0] <= t <= c[1]:
                return outw[c[2][0]][0] + (t - words[c[2][0]]["s"])
            if c[0] > t and best is None:
                best = outw[c[2][0]][0]
        return best if best is not None else total
    return f, outw, total, keep


def main(sel):
    os.makedirs(os.path.join(BASE, "specs"), exist_ok=True)
    for r in REELS:
        if sel and r["id"] not in sel:
            continue
        ranges, drop = spec_for(r)
        f, outw, total, keep = out_time_map(ranges, drop)
        ins = []
        for t, fn, ss, d, side in r["ins"]:
            path = os.path.join(BR, fn)
            ins.append(dict(file=path, t=round(f(t), 2), ss=ss, dur=d, h=480,
                            x=300 if side == "L" else 780, y=1640, rot=-5 if side == "L" else 5))
        zooms = [(round(f(a), 2), round(f(b), 2)) for a, b in r["zooms"]]
        spec = dict(source=SRC, words=WORDS, work=os.path.join(BASE, "build", r["id"]), title=r["title"],
                    ranges=ranges, drop=drop, inserts=ins, zooms=zooms, pop=POP,
                    lesson_cover=os.path.join(REPO, "lesson_cover.jpg"), endcard=os.path.join(REPO, "endcard.mp4"))
        if r["cta"] == "own":
            spec["cta"] = dict(type="own", first_word=ranges[-1][0])
        else:
            spec["cta"] = dict(type="card")
        p = os.path.join(BASE, "specs", r["id"] + ".json")
        json.dump(spec, open(p, "w"), ensure_ascii=False, indent=1)
        txt = " ".join(words[i]["w"] for i in keep)
        print(r["id"], f"{total:.1f}s", "|", txt[:160], "...", txt[-120:])


if __name__ == "__main__":
    main(sys.argv[1:])
