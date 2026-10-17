"""Reel 'Приватный девичник': vertical talking head, one-word subtitles, hook on top,
screenshot cards popping in by meaning, fast photo montage on 'моя жизнь выглядит вот так'."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
B = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(B), "yt3", "engine"))
import reel
reel.AUDIOS[:] = [os.path.join(B, "work", "audio16.wav")]
W, H = 1080, 1920
words = json.load(open(os.path.join(B, "work", "words.json")))["words"]
SRC = os.path.join(B, "src", "source.bin"); OV = os.path.join(B, "ov"); WK = os.path.join(B, "build")
CLICK = os.path.join(os.path.dirname(B), "yt2", "ref", "click_clean.wav")

drop = {27, 28, 54, 55, 56, *range(70, 79), 82, 83, 84, 85, 112, 113, 128, 129, *range(151, 160), 171,
        *range(175, 179), *range(197, 209), 241, 242, *range(267, 271)}
spec = {"ranges": [(9, 281)], "drop": sorted(drop)}
clips, outw, total, keep = reel.build_timeline(spec, words)
HOLD = 3.0
T = lambda i: outw[i][0]
E_ = lambda i: outw[i][1]

# ---------- inserts: (file, start, dur, y_centre) ----------
ins = [("subs.png", T(15), E_(24) - T(15) + 0.2, 1290),
       ("views.png", T(38), 2.4, 1290),
       ("c1.png", T(63), E_(69) - T(63) + 0.3, 1130), ("c2.png", T(63) + 0.5, E_(69) - T(63) - 0.2, 1300), ("c3.png", T(63) + 1.0, E_(69) - T(63) - 0.7, 1460),
       ("c4.png", T(81), 1.7, 1290), ("c5.png", T(81) + 1.8, 1.7, 1290), ("c6.png", T(102), 2.4, 1290),
       ("stage.png", T(138), 1.9, 1290),
       ("devichnik.png", T(184), 1.9, 1290),
       ("bride.png", T(188), 2.3, 1290), ("table.png", T(188) + 0.35, 1.95, 1290),
       ("t1.png", T(195), 2.4, 1290), ("t2.png", T(211), 2.6, 1290),
       ("devichnik.png", T(224), 2.6, 1290),
       ("highlight.png", T(224) + 2.7, total - T(224) - 2.7 + HOLD, 1230)]
# pairs sit side by side
XPOS = {"bride.png": 320, "table.png": 760}
montage = (T(143), E_(150) + 0.25)
LIFE = [f"life{n}.jpg" for n in range(8)]

# ---------- subtitles + hook ----------
PINK = "&H00AA5AF2"
ACC = {16, 17, 18, 38, 39, 60, 87, 95, 103, 104, 111, 139, 184, 196, 216, 217, 224, 240, 257, 263, 264}
FIX = {"ютубе": "YouTube", "ютуб": "YouTube", "рилс": "рилс"}
def ts(x):
    x = max(0, x); return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"
hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Word,Montserrat ExtraBold,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,1,0,1,0,4,5,30,30,0,204
Style: Acc,Montserrat Black,112,{PINK},{PINK},&H00000000,&HA0000000,0,1,0,0,100,100,0,0,1,0,4,5,30,30,0,204
Style: Title,Montserrat ExtraBold,64,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,0,0,5,20,20,0,204

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
POP = r"{\fscx88\fscy88\t(0,90,\fscx100\fscy100)}"
SY = 1700
for n, i in enumerate(keep):
    s = T(i); e = T(keep[n + 1]) if n + 1 < len(keep) else total + HOLD
    e = min(e, E_(i) + 0.6)
    w = FIX.get(words[i]["w"], words[i]["w"])
    st = "Acc" if i in ACC else "Word"
    ev.append(f"Dialogue: 2,{ts(s)},{ts(e)},{st},,0,0,0,,{{\\pos(540,{SY})}}{POP}{w}")
# hook: two lines, one pink accent, hidden during the photo montage
TL = ["ОДНА ТЕМА —", "И МОЙ YOUTUBE", "ВЗОРВАЛСЯ ЗА МЕСЯЦ:"]
from PIL import ImageFont
_f = ImageFont.truetype(subprocess.run(["fc-match", "-f", "%{file}", "Montserrat:style=ExtraBold"], capture_output=True, text=True).stdout, 100)
TFS = min(130, 100 * 980 / (0.6407 * max(_f.getlength(x) for x in TL) * 1.06))   # libass draws Montserrat ~0.64 of PIL size
for a, b in [(0, montage[0]), (montage[1], total + HOLD)]:
    for k, line in enumerate(TL):
        y = 200 + k * int(TFS * 0.76)
        col = PINK if k == 2 else "&H00FFFFFF"
        txt = r"{\fnMontserrat ExtraBold\fs%.0f\fscx106\fsp0}" % TFS + line
        ev.append(f"Dialogue: 1,{ts(a)},{ts(b)},Title,,0,0,0,,{{\\pos(543,{y + 5})\\c&H000000&\\alpha&H40&\\blur7\\shad0}}{txt}")
        ev.append(f"Dialogue: 2,{ts(a)},{ts(b)},Title,,0,0,0,,{{\\pos(540,{y})\\shad0\\c{col}&}}{txt}")
ET = T(224) + 2.9
for k2, line in enumerate(["Подробности и ссылка на чат —", r"в актуальном {\c" + PINK + r"&}«Девичник»"]):
    yy = 1560 + k2 * 66
    tx = r"{\fnMontserrat ExtraBold\fs84}" + line
    ev.append(f"Dialogue: 3,{ts(ET)},{ts(total + HOLD)},Title,,0,0,0,,{{\\pos(543,{yy + 4})\\c&H000000&\\alpha&H40&\\blur7\\shad0\\fad(200,0)}}" + tx.replace(r"{\c" + PINK + r"&}", ""))
    ev.append(f"Dialogue: 4,{ts(ET)},{ts(total + HOLD)},Title,,0,0,0,,{{\\pos(540,{yy})\\shad0\\fad(200,0)}}" + tx)
os.makedirs(WK, exist_ok=True)
ass = os.path.join(WK, "subs.ass"); open(ass, "w").write(hdr + "\n".join(ev) + "\n")

# ---------- cut clips ----------
lst = os.path.join(WK, "list.txt")
with open(lst, "w") as L:
    for n, (s, e, _) in enumerate(clips):
        f = os.path.join(WK, f"c{n:03d}.mkv"); d = e - s
        fo = 0.04 if n == len(clips) - 1 else 0.01
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", SRC, "-t", f"{d:.3f}",
                        "-vf", f"scale={W}:{H},setsar=1,fps=30", "-af", f"afade=t=in:d=0.01,afade=t=out:st={max(0, d - fo):.3f}:d={fo},aresample=48000",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", f], check=True, stdin=subprocess.DEVNULL)
        L.write(f"file 'c{n:03d}.mkv'\n")
head = os.path.join(WK, "head.mkv")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-vf", f"tpad=stop_mode=clone:stop_duration={HOLD}",
                "-af", f"apad=pad_dur={HOLD}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", head], check=True, stdin=subprocess.DEVNULL)
TOT = total + HOLD

# ---------- compose ----------
inputs = ["-i", head]; fc = []; cur = "0:v"; k = 1
seg = (montage[1] - montage[0]) / len(LIFE)
for j, f in enumerate(LIFE):
    t0 = montage[0] + j * seg
    inputs += ["-loop", "1", "-framerate", "30", "-t", f"{seg + 0.05:.3f}", "-i", os.path.join(OV, f)]
    fc.append(f"[{k}:v]scale={W}:{H},format=yuv420p,setpts=PTS-STARTPTS+{t0:.3f}/TB[l{j}]")
    fc.append(f"[{cur}][l{j}]overlay=0:0:eof_action=pass:enable='between(t,{t0:.3f},{t0 + seg:.3f})'[m{j}]")
    cur = f"m{j}"; k += 1
for j, (f, t0, d, y) in enumerate(ins):
    inputs += ["-loop", "1", "-framerate", "30", "-t", f"{d:.3f}", "-i", os.path.join(OV, f)]
    x = XPOS.get(f, 540)
    fade = "" if j == len(ins) - 1 else f"fade=t=out:st={max(0, d - 0.15):.2f}:d=0.15:alpha=1,"
    fc.append(f"[{k}:v]format=rgba,scale=w='iw*min(1,0.6+3.2*t)':h=-2:eval=frame,{fade}setpts=PTS-STARTPTS+{t0:.3f}/TB[i{j}]")
    fc.append(f"[{cur}][i{j}]overlay=x={x}-w/2:y={y}-h/2:eof_action=pass:enable='between(t,{t0:.3f},{t0 + d:.3f})'[o{j}]")
    cur = f"o{j}"; k += 1
fc.append(f"[{cur}]ass={ass},format=yuv420p[vout]")
# clicks on each insert and on the montage start
track = np.zeros((int((TOT + 1) * 48000), 2)); pop, _ = sf.read(CLICK)
if pop.ndim == 1: pop = np.stack([pop, pop], 1)
for t in [x[1] for x in ins] + [montage[0]]:
    i = int(t * 48000); track[i:i + len(pop)] += pop[:len(track) - i] * 0.45
sfx = os.path.join(WK, "sfx.wav"); sf.write(sfx, track, 48000)
inputs += ["-i", sfx]
subprocess.run([sys.executable, os.path.join(B, "music_dyn.py"), os.path.join(WK, "music.wav"), f"{TOT + 0.5:.2f}"], check=True)
inputs += ["-i", os.path.join(WK, "music.wav")]
# voice is normalised on its own; music is added afterwards at a fixed low level so loudnorm can't lift it
fc.append(f"[0:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur={TOT:.3f},asplit=2[va][vkey]")
fc.append(f"[{k + 1}:a]aresample=48000,volume=0.26[mus]")
fc.append(f"[mus][vkey]sidechaincompress=threshold=0.03:ratio=2.5:attack=20:release=400[mduck]")
fc.append(f"[va][{k}:a][mduck]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95,apad=whole_dur={TOT:.3f}[aout]")
out = os.path.join(B, "devichnik.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]", "-t", f"{TOT:.3f}",
                "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out], check=True, stdin=subprocess.DEVNULL)
print("done", out, f"{TOT:.1f}s", len(clips), "clips")
print(" ".join(words[i]["w"] for i in keep))
