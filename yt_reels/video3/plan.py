"""Vertical reels from YouTube video #3 (competition is a myth). Segments pinned to transcript phrases."""
import json, os, sys
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDS = os.path.join(BASE, "work", "words.json")
words = json.load(open(WORDS))["words"]
FIX = {"ксюша": "Ксюша", "оксаной": "Оксаной", "самойловой": "Самойловой", "оксана": "Оксана", "джиган": "Джиган", "моргенштерн": "Моргенштерн",
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
 dict(id="k1", title=["Почему тебе не нужно", "*становиться красивее*"],
      phr=[(("сейчас я докажу вам то что никакой конкуренции не существует", 0), ("где нету приза", 11)),
           (("что самое грустное", 24), ("при одном условии", 59)),
           (("если у тебя есть мозги", 61), ("это очень быстро закончится", 73))]),
 dict(id="k2", title=["Почему даже самых красивых", "*бросают*"],
      phr=[(("если ты будешь супер красивой", 90), ("гармоничных отношений не будет", 136))]),
 dict(id="k3", title=["Почему после 30 ты", "*не становишься неликвидной*"],
      phr=[(("красота имеет свойство заканчиваться", 165), ("из одной коробочки в другую", 213))]),
 dict(id="k4", title=["Какой мужчина никогда не скажет,", "что ты *неликвидна*"],
      phr=[(("мы можем сделать вывод то что все таки мужчины", 309), ("а они далеко строятся не на этом", 363)),
           (("кто мне эту установку вбивает в голову", 399), ("построить глубокую эмоциональную связь", 410))]),
 dict(id="k5", title=["Почему соцсети заставляют тебя", "*чувствовать себя хуже*"],
      phr=[(("соцсети вот что они создают", 461), ("я недостаточно хороша", 504))]),
 dict(id="k6", title=["Что на самом деле", "*ценят мужчины*"],
      phr=[(("когда ты себя ценишь", 572), ("это будет просто невероятно", 634))]),
 dict(id="k7", title=["Как перестать зависеть", "*от своей внешности*"],
      phr=[(("когда вы зависите только от красоты", 698), ("вам не нужно себя переделывать", 757))]),
 dict(id="k8", title=["Почему ты так строга", "*к своей внешности*"],
      phr=[(("замечали ли вы вот когда вы смотрите", 772), ("эти требования могут вас погубить", 803)),
           (("ваш человек он притянется к вам", 838), ("он действительно приведет вашу жизнь", 846))]),
 dict(id="k9", title=["Почему красота не спасает", "*от измен*"],
      phr=[(("красота она не дает гарантии", 862), ("строго нет", 897)),
           (("важно кого вы выбираете и важно насколько вы уверенны", 911), ("таков бриллиант", 933))]),
 dict(id="k10", title=["Что заставляет мужчину", "*ценить тебя*"],
      phr=[(("многие девушки они выбирают типа бабников", 1001), ("есть к этому предпосылки", 1029)),
           (("дело не в красоте дело в ценностях", 1031), ("спокойная атмосфера рядом", 1063))]),
 dict(id="k11", title=["Чем женщина, которая знает себе цену,", "*отличается от других*"],
      phr=[(("самоуважение у вас должно быть к себе как естественный фильтр", 1069), ("ее ничего не может поколебить и сломать", 1093)),
           (("и женщина которая знает себе цену не соревнуется", 1138), ("какие прекрасные женщины нас окружают", 1167))]),
 dict(id="k12", title=["Почему достойный мужчина", "*не уйдёт к красивее*"],
      phr=[(("есть на бале вот такой миф", 1167), ("это вот про это", 1209)),
           (("когда нельзя мужчину ниоткуда увести", 1256), ("придумали балбесы", 1267))]),
 dict(id="k14", title=["Почему даже с красивыми", "*плохо обращаются*"],
      raw=[(525, 569.4)], raw_box=[[525, 569.4, 390, 1140]],
      phr=[(("красивая картинка да она может привлечь внимание", 507), ("в карманах ну типа того", 536)),
           (("да мы снова сошлись с лешей", 538), ("недомолвки", 569)),
           (("то есть это про что про самоценность девушки", 570), ("чтобы у тебя был самый лучший мужчина", 588))]),
 dict(id="k15", title=["Кто на самом деле решает,", "что ты *неликвидна*"],
      raw=[(231.3, 278.8), (288.5, 303.3)], raw_box=[[231.3, 278.8, 0, 1920], [288.5, 303.3, 532, 856]],
      phr=[(("а кто у нас вообще говорит", 219), ("гармоничные отношения", 307)),
           (("мы можем сделать вывод то что все таки мужчины", 309), ("о какой тут долгосрочной связи может идти речь", 329))]),
 dict(id="k13", title=["Как выбирать мужчину", "*по-новому*"],
      phr=[(("старый сценарий вы ориентировались на химию", 1363), ("не приходится соревноваться за любовь", 1385))]),
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
        ranges, drop = spec_for(r)
        clips, outw, total, keep = reel.build_timeline({"ranges": ranges, "drop": drop}, words)
        spec = dict(source=os.path.join(BASE, "src", "source.bin"), audio=os.path.join(BASE, "work", "audio16.wav"),
                    words=os.path.join(BASE, "work", "words_fix.json"), work=os.path.join(BASE, "build", r["id"]),
                    title=r["title"], ranges=ranges, drop=drop, lesson_cover="/home/user/Ksu/reels1/assets/lesson_cover.jpg",
                    cta=r.get("cta", {}), raw_box=r.get("raw_box", []))
        json.dump(spec, open(os.path.join(BASE, "specs", r["id"] + ".json"), "w"), ensure_ascii=False, indent=1)
        print(r["id"], f"{total + 1.5:.1f}s", "|", " ".join(words[i]["w"] for i in keep)[:160], "...", " ".join(words[i]["w"] for i in keep)[-80:])

if __name__ == "__main__":
    main(sys.argv[1:])
