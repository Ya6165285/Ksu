"""Vertical reels from YouTube video #3 (competition is a myth). Segments pinned to transcript phrases."""
import json, os, sys
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDS = os.path.join(BASE, "work", "words.json")
words = json.load(open(WORDS))["words"]
FIX = {"часки": "чизкейк", "фандан": "фонтан", "пхапа": "пикапа", "коуча": "коучи", "мэчут": "мэтчат", "смэчились": "сметчились", "ксюша": "Ксюша", "оксаной": "Оксаной", "самойловой": "Самойловой", "оксана": "Оксана", "джиган": "Джиган", "моргенштерн": "Моргенштерн",
       "лиза": "Лиза", "стас": "Стас", "бале": "Бали", "инстаграм": "Instagram", "мычут": "мэтчат", "мэтчат": "мэтчат", "мечатся": "мэтчатся",
       "ренопластику": "ринопластику", "былбес": "балбес", "мифура": "обёртка", "бертка": "обёртка"}
for w in words:
    if w["w"] in FIX: w["disp"] = FIX[w["w"]]
json.dump({"words": words}, open(os.path.join(BASE, "work", "words_fix.json"), "w"), ensure_ascii=False)
FILLERS = {"ну", "короче", "блядь", "блять", "типа", "вот"}
FILLER2 = {("то", "есть"), ("как", "бы"), ("грубо", "говоря")}

def find(phrase, near, span=40):
    ws = phrase.split(); n = len(ws); best = None
    for i in range(len(words) - n + 1):
        if abs(words[i]["s"] - near) > span: continue
        if [w["w"] for w in words[i:i + n]] == ws:
            if best is None or abs(words[i]["s"] - near) < abs(words[best]["s"] - near): best = i
    if best is None: raise SystemExit(f"phrase not found: {phrase!r} near {near}")
    return best, best + n - 1

REELS = [
 dict(id="d1", title=["Как я перестала прощать измены", "и встретила *мужчину мечты*"],
      phr=[(("у меня тоже были такие периоды", 20), ("у меня не было самоценности", 30)),
           (("мой мужчина мне изменил я его прощала", 50), ("окей я буду одна", 116)),
           (("но я сделаю все чтобы у меня больше такая", 118), ("это здоровые классные отношения", 136))]),
 dict(id="d2", title=["Почему ты достойна любви", "*уже сейчас*"],
      phr=[(("я вам возможно сейчас скажу такую вещь", 150), ("вы достойны любви уже сейчас", 228)),
           (("когда мы знаем в себе то что мы очень ценные", 247), ("я достойна к себе хорошего отношения", 250))]),
 dict(id="d3", title=["Представь маленькую девочку,", "*которая живёт внутри тебя*"],
      phr=[(("можете даже знаете представить себе маленькую девочку", 253), ("которые будут со мной поступать неприятным образом", 290)),
           (("и ваших силах это изменить", 292), ("но это не отменяет того что вы уже ценные", 327))],
      cut=[("выигрывай", 297.9)]),
 dict(id="d4", title=["Если тебя не выбрали,", "*ты не стала хуже*"],
      phr=[(("всех нас мэчут по энергии нет никакой конкуренции", 330), ("сократил вам количество времени", 375))],
      fin=("закончились", 378), cut=[("как я уже вам говорила", 332)]),
 dict(id="d5", title=["Почему страх одиночества", "*держит тебя не с тем*"],
      phr=[(("многие девушки боятся быть одни", 387), ("если он этого не готов вам дать также как и в ответ", 474))]),
 dict(id="d6", title=["Почему у одних девушек", "*всегда шикарные свидания*"],
      phr=[(("когда девушки есть большая самоценность", 482), ("и узнаете подходит ли этот человек вам", 560))]),
 dict(id="d7", title=["Как перестать выбирать", "*холодных и ненадёжных*"],
      phr=[(("нам нужно иметь классную опору на себя", 577), ("этот мужчина достоин другой женщины", 637))]),
 dict(id="d8", title=["Почему не нужно жалеть", "о годах *не с тем мужчиной*"],
      phr=[(("и выбор человека из чувства дефицита", 666), ("и не входим в то же самое", 754))]),
 dict(id="d9", title=["Почему одни девушки получают всё,", "а другие *ничего*"],
      phr=[(("и вопрос почему одни получают все другие ничего", 926), ("устраивать из этого качели", 979))]),
 dict(id="d10", title=["Что изменится, когда ты поймёшь,", "что ты *ценна просто так*"],
      phr=[(("запомни то что ты ценная с самого рождения", 984), ("ты достойна самого лучшего мужчину на свете", 990)),
           (("и если я сказала что у вас все будет значит у вас все будет", 1061), ("твоя жизнь просто поменяется на сто восемьдесят раз", 1088))]),
 dict(id="d11", title=["Как мужчины начали говорить мне:", "*«хочу с тобой отношений»*"],
      phr=[(("когда то я тоже этого не понимала", 990), ("у вас есть уверенность уверенность в том что у вас будут классные отношения", 1041))]),
]

def spec_for(r):
    ranges = [(find(a, ta)[0], find(b, tb)[1]) for (a, ta), (b, tb) in r["phr"]]
    drop = []
    allidx = [i for a, b in ranges for i in range(a, b + 1)]
    raw = r.get("raw", [])
    for n, i in enumerate(allidx):
        if any(a <= words[i]["s"] <= b for a, b in raw): continue     # someone else's clip stays as it was
        w = words[i]["w"]; nx = words[allidx[n + 1]]["w"] if n + 1 < len(allidx) else ""
        if w in FILLERS: drop.append(i)
        elif (w, nx) in FILLER2: drop += [i, allidx[n + 1]]
        elif n > 0 and words[allidx[n - 1]]["w"] == w and len(w) > 2: drop.append(allidx[n - 1])
        else:
            for k in (4, 3, 2):
                if n >= k and n + k <= len(allidx) and [words[j]["w"] for j in allidx[n - k:n]] == [words[j]["w"] for j in allidx[n:n + k]]:
                    drop += allidx[n - k:n]; break
    for ph, near in r.get("cut", []):
        x, y = find(ph, near); drop += list(range(x, y + 1))
    return ranges, sorted(set(drop))

def main(sel):
    sys.path.insert(0, os.path.join(os.path.dirname(BASE), "yt3", "engine"))
    import reel
    reel.AUDIOS[:] = [os.path.join(BASE, "work", "audio16.wav")]
    os.makedirs(os.path.join(BASE, "specs"), exist_ok=True)
    for r in REELS:
        if sel and r["id"] not in sel: continue
        if r.get("fin"):
            a, b = r["phr"][-1]; r = dict(r, phr=r["phr"][:-1] + [(a, r["fin"])])
        ranges, drop = spec_for(r)
        clips, outw, total, keep = reel.build_timeline({"ranges": ranges, "drop": drop}, words)
        spec = dict(source=os.path.join(BASE, "src", "source.bin"), audio=os.path.join(BASE, "work", "audio16.wav"),
                    words=os.path.join(BASE, "work", "words_fix.json"), work=os.path.join(BASE, "build", r["id"]),
                    title=r["title"], ranges=ranges, drop=drop, lesson_cover="/home/user/Ksu/reels1/assets/lesson_cover.jpg",
                    cta=r.get("cta", {}), raw_box=r.get("raw_box", []), zoom=[1.3, 1.45], face_y=0.3)
        if r.get("montage"):
            mo = r["montage"]
            spec["montage"] = dict(from_word=find(*mo["frm"])[0], to_word=find(*mo["to"])[0], images=mo["images"])
        json.dump(spec, open(os.path.join(BASE, "specs", r["id"] + ".json"), "w"), ensure_ascii=False, indent=1)
        print(r["id"], f"{total + 3.8:.1f}s", "|", " ".join(words[i]["w"] for i in keep)[:160], "...", " ".join(words[i]["w"] for i in keep)[-80:])

if __name__ == "__main__":
    main(sys.argv[1:])
