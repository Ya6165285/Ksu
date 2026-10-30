import os, subprocess, json
s = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "yt3", "mkpage.py")).read()
exec(s[:s.index("import os\nH = {")])
H = {"d1": "Как я перестала прощать измены и встретила мужчину мечты", "d2": "Почему ты достойна любви уже сейчас",
     "d3": "Представь маленькую девочку, которая живёт внутри тебя", "d4": "Если тебя не выбрали, ты не стала хуже",
     "d5": "Почему страх одиночества держит тебя не с тем", "d6": "Почему у одних девушек всегда шикарные свидания",
     "d7": "Как перестать выбирать холодных и ненадёжных", "d8": "Почему не нужно жалеть о годах не с тем мужчиной",
     "d9": "Почему одни девушки получают всё, а другие ничего", "d10": "Что изменится, когда ты поймёшь, что ты ценна просто так",
     "d11": "Как мужчины начали говорить мне «хочу с тобой отношений»"}
order = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11"]
pages = []; cur = []; tot = 0
for r in order:
    d = dur(f"out/{r}.mp4")
    if cur and tot + d > 125: pages.append(cur); cur = []; tot = 0
    cur.append(r); tot += d
pages.append(cur)
os.makedirs("small", exist_ok=True); os.makedirs("pages", exist_ok=True)
for n, rs in enumerate(pages, 1):
    tot = sum(dur(f"out/{r}.mp4") for r in rs); vb = int(min(900, 11.0 * 8000 / tot - 100))
    for r in rs:
        o = f"small/{r}.mp4"
        for p in (1, 2):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"out/{r}.mp4", "-vf", "scale=720:1280", "-c:v", "libx264", "-preset", "slow",
                            "-b:v", f"{vb}k", "-pass", str(p), "-passlogfile", f"small/{r}"] + (["-an", "-f", "mp4", "/dev/null"] if p == 1 else
                            ["-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", o]), check=True, stdin=subprocess.DEVNULL)
    build(f"pages/ksu_dm_{n}.html", f"Рилсы «Девушка мечта» · {n}", f"Девушка мечта · <span>{n}/{len(pages)}</span>",
          "Вертикальные рилсы из ролика «Девушка мечта»: хук сверху, субтитры, в конце урок и МАРШРУТ.",
          [(f"small/{r}.mp4", H[r], r[1:]) for r in rs])
json.dump(pages, open("pages/pages.json", "w"))
print(pages)
