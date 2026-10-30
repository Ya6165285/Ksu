"""Halloween montage: cleaned voiceover (pauses, false start cut) over vertical clips matched to the words,
hook = opening phrase on top, one-word subtitles, quiet Halloween music ducked under the voice."""
import json, os, re, subprocess, sys
HW = sys.argv[1]; OUT = sys.argv[2]
SRC = os.path.join(HW, "src"); WK = os.path.join(HW, "work"); os.makedirs(os.path.join(WK, "v"), exist_ok=True)
ENG = os.path.dirname(os.path.abspath(__file__))
W, H = 1080, 1920
PINK = "&H00AA5AF2"
words = json.load(open(os.path.join(WK, "words.json")))["words"]
DROP = set(range(53, 60))                        # first take "весь вечер играет диджей атмосфера просто нере…"
HOOK_WORDS = set(range(0, 10))                   # the opening phrase lives in the hook, not in subtitles
DISP = {"дубае": "Дубае", "ищите": "ищете", "хэллоуина": "Хэллоуина"}
KEY = {"хэллоуина", "костюмах", "фильма", "вкусно", "кальян", "диджей", "невероятная", "комьюнити", "рождения", "шоу",
       "восьми", "эмоций", "сохраняйте"}
TITLE = ["Самое атмосферное", "место на *Хэллоуин*"]; HOOK_T = 5.0
LOCATION = "MYATA PLATINUM DUBAI"
BRK_AFTER, BRK, BRK_SHOT = 88, 3.0, ("0481", 14.0)   # voice pauses after "поздравили": the real applause plays
# word index -> (clip, source second)
SHOTS = [(0, "0470", 2.5), (10, "2980", 5.0), (13, "0440", 12.3), (16, "0430", 1.0), (19, "0475", 0.0),
         (22, "0470", 12.0), (29, "0433", 6.0), (34, "0436", 1.0), (38, "0441", 1.5), (40, "0470", 31.4),
         (45, "0440", 0.0), (60, "0474", 3.0), (64, "0475", 3.0), (67, "0437", 0.0), (74, "0481", 0.0),
         (83, "0480", 5.5), ("brk", *BRK_SHOT), (89, "0480", 9.0), (97, "0480", 15.0), (101, "0470", 20.0), (108, "0432", 1.5),
         (114, "0481", 20.0), (119, "0470", 24.3)]
PRE, POST, MAXGAP, HOLD = 0.12, 0.16, 0.30, 1.6

def ts(x):
    x = max(0, x); return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"

# ---- cleaned voice: keep word runs, close long pauses ----
keep = [i for i in range(len(words)) if i not in DROP]
runs = [[keep[0]]]
for i in keep[1:]:
    if i == runs[-1][-1] + 1 and words[i]["s"] - words[runs[-1][-1]]["e"] <= MAXGAP: runs[-1].append(i)
    else: runs.append([i])
segs = []
for r in runs:
    a = max(0, words[r[0]]["s"] - PRE); b = words[r[-1]]["e"] + POST
    nxt = r[-1] + 1
    if nxt < len(words) and nxt not in DROP: b = min(b, words[nxt]["s"] - 0.04)
    segs.append((a, b))
outw = {}; t = 0.0
for (a, b), r in zip(segs, runs):
    for i in r: outw[i] = (words[i]["s"] - a + t, words[i]["e"] - a + t)
    t += b - a
    if r[-1] == BRK_AFTER: brk0 = t; t += BRK
VT = t; TOT = VT + HOLD
voice = os.path.join(WK, "voice_clean.wav")
fc = []; lab = []
for k, (a, b) in enumerate(segs):
    fc.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b - a - 0.03:.3f}:d=0.03[s{k}]"); lab.append(f"[s{k}]")
    if runs[k][-1] == BRK_AFTER:
        fc.append(f"anullsrc=r=48000:cl=mono,atrim=0:{BRK}[gap]"); lab.append("[gap]")
fc.append("".join(lab) + f"concat=n={len(lab)}:v=0:a=1[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(WK, "voice48.wav"), "-filter_complex", ";".join(fc), "-map", "[o]", voice], check=True)

# ---- video shots ----
starts = [0.0] + [brk0 if w == "brk" else outw[w][0] - 0.05 for w, _, _ in SHOTS[1:]] + [TOT]
lst = os.path.join(WK, "v", "list.txt")
with open(lst, "w") as L:
    for n, (w, clip, s0) in enumerate(SHOTS):
        d = starts[n + 1] - starts[n]
        src = os.path.join(SRC, f"IMG_{clip}.MOV")
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
        s0 = max(0.0, min(s0, dur - d - 0.05))
        sp = min(1.0, (dur - 0.05) / d)           # too-short shot: slow it down a little instead of freezing
        z = 1.0 + 0.06 * (n % 2)
        f = os.path.join(WK, "v", f"c{n:02d}.mp4")
        vf = (f"setpts=(PTS-STARTPTS)/{sp:.4f},scale={int(W * z)//2*2}:{int(H * z)//2*2}:force_original_aspect_ratio=increase,"
              f"crop={W}:{H},setsar=1,fps=30,eq=saturation=1.08")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s0:.3f}", "-i", src, "-t", f"{d * sp:.3f}", "-an", "-vf", vf, "-t", f"{d:.3f}",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", f], check=True, stdin=subprocess.DEVNULL)
        L.write(f"file 'c{n:02d}.mp4'\n")
        if w == "brk": brk_src = (src, s0, d)
head = os.path.join(WK, "head.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", head], check=True)

# ---- hook + subtitles ----
from PIL import ImageFont
fnt = ImageFont.truetype(subprocess.run(["fc-match", "-f", "%{file}", "Montserrat:style=ExtraBold"], capture_output=True, text=True).stdout, 100)
lines = list(TITLE); lines[-1] = lines[-1] + ":"
plain = [re.sub(r"\*", "", l).upper() for l in lines]
tfs = min(110, 100 * 960 / (0.6407 * max(fnt.getlength(p) * 1.03 for p in plain)))
hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Word,Montserrat ExtraBold,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,1,0,1,0,4,5,30,30,0,204
Style: Acc,Montserrat Black,104,{PINK},{PINK},&H00000000,&HA0000000,0,1,0,0,100,100,0,0,1,0,4,5,30,30,0,204
Style: T,Montserrat ExtraBold,64,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,0,0,5,20,20,0,204

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []; LH = int(tfs * 0.78)
for k, l in enumerate(lines):
    s = ""
    for p in re.split(r"(\*[^*]+\*)", l):
        if p: s += (r"{\c" + PINK + "&}" + p[1:-1].upper()) if p.startswith("*") else (r"{\c&H00FFFFFF&}" + p.upper())
    t = r"{\fnMontserrat ExtraBold\fs%.0f\fscx103\fsp0.7}" % tfs + s
    y = 240 + k * LH; sh = re.sub(r"\\c&H[0-9A-F]+&", "", t)
    ev.append(f"Dialogue: 1,{ts(0)},{ts(HOOK_T)},T,,0,0,0,,{{\\pos(543,{y + 5})\\fad(200,0)\\c&H000000&\\alpha&H28&\\blur7\\shad0}}{sh}")
    ev.append(f"Dialogue: 2,{ts(0)},{ts(HOOK_T)},T,,0,0,0,,{{\\pos(540,{y})\\fad(200,300)\\shad0}}{t}")
# small location tag over the closing words
l0 = outw[119][0]
for lay, tag in ((1, r"\c&H000000&\alpha&H40&\blur6"), (2, "")):
    dy = 4 if lay == 1 else 0; col = "" if lay == 1 else r"{\c" + PINK + "&}"
    ev.append(f"Dialogue: {lay},{ts(l0)},{ts(TOT)},T,,0,0,0,,{{\\pos({540 + dy // 2},{1660 + dy})\\fad(250,0)\\shad0{tag}\\fnMontserrat SemiBold\\fs40\\fsp1}}{col}локация")
    ev.append(f"Dialogue: {lay},{ts(l0)},{ts(TOT)},T,,0,0,0,,{{\\pos({540 + dy // 2},{1716 + dy})\\fad(250,0)\\shad0{tag}\\fnMontserrat ExtraBold\\fs52\\fsp2}}{LOCATION}")
POP = r"{\fscx88\fscy88\t(0,90,\fscx100\fscy100)}"
sub = [i for i in keep if i not in HOOK_WORDS]
for n, i in enumerate(sub):
    s = outw[i][0]; e = outw[sub[n + 1]][0] if n + 1 < len(sub) else VT
    e = min(e, outw[i][1] + 0.6)
    st = "Acc" if words[i]["w"] in KEY else "Word"
    ev.append(f"Dialogue: 2,{ts(s)},{ts(e)},{st},,0,0,0,,{{\\pos(540,1480)}}{POP}{DISP.get(words[i]['w'], words[i]['w'])}")
ass = os.path.join(WK, "subs.ass"); open(ass, "w").write(hdr + "\n".join(ev) + "\n")

# ---- music + mix ----
subprocess.run([sys.executable, os.path.join(ENG, "music_hw.py"), os.path.join(WK, "music.wav"), f"{TOT + 0.5:.2f}"], check=True)
b0 = brk0; b1 = brk0 + BRK
fc = [f"[3:a]aresample=48000,pan=mono|c0=0.5*c0+0.5*c1,loudnorm=I=-16:TP=-2,aresample=48000,afade=t=in:d=0.25,afade=t=out:st={BRK - 0.35:.3f}:d=0.35,adelay={int(b0 * 1000)},apad=whole_dur={TOT:.3f}[crowd]",
      f"[0:v]ass={ass},format=yuv420p,fade=t=out:st={TOT - 0.5:.3f}:d=0.5[vout]",
      f"[1:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur={TOT:.3f},asplit=2[va][vkey]",
      f"[2:a]aresample=48000,volume=0.26,volume='if(between(t,{b0 - 0.1:.3f},{b1:.3f}),0.35,1)':eval=frame[mus]",
      f"[mus][vkey]sidechaincompress=threshold=0.03:ratio=2.5:attack=20:release=400[mduck]",
      f"[va][mduck][crowd]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95,afade=t=out:st={TOT - 1.2:.3f}:d=1.2[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", head, "-i", voice, "-i", os.path.join(WK, "music.wav"), "-ss", f"{brk_src[1]:.3f}", "-t", f"{BRK:.3f}", "-i", brk_src[0], "-filter_complex", ";".join(fc),
                "-map", "[vout]", "-map", "[aout]", "-t", f"{TOT:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", OUT], check=True, stdin=subprocess.DEVNULL)
print(f"done {OUT} {TOT:.1f}s (voice {VT:.1f}s)")
