import os, subprocess, json
s = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "yt3", "mkpage.py")).read()
exec(s[:s.index("import os\nH = {")])
H = {"k1": "Почему тебе не нужно становиться красивее", "k2": "Почему даже самых красивых бросают",
     "k3": "Почему после 30 ты не становишься неликвидной", "k4": "Какой мужчина никогда не скажет, что ты неликвидна",
     "k5": "Почему соцсети заставляют тебя чувствовать себя хуже", "k6": "Что на самом деле ценят мужчины",
     "k7": "Как перестать зависеть от своей внешности", "k8": "Почему ты так строга к своей внешности",
     "k9": "Почему красота не спасает от измен", "k10": "Что заставляет мужчину ценить тебя",
     "k11": "Чем женщина, которая знает себе цену, отличается от других", "k12": "Почему достойный мужчина не уйдёт к красивее",
     "k13": "Как выбирать мужчину по-новому", "k14": "Почему даже с красивыми плохо обращаются (Айза)",
     "k15": "Кто на самом деле решает, что ты неликвидна (Джарахов)"}
order = ["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9", "k10", "k11", "k12", "k13", "k14", "k15"]
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
    build(f"pages/ksu_yt3_{n}.html", f"Рилсы «Конкуренция» · {n}", f"Конкуренция — миф · <span>{n}/{len(pages)}</span>",
          "Вертикальные рилсы из ролика про конкуренцию: хук сверху, субтитры, в конце урок и МАРШРУТ.",
          [(f"small/{r}.mp4", H[r], r[1:]) for r in rs])
json.dump(pages, open("pages/pages.json", "w"))
print(pages)
