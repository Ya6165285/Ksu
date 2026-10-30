"""Vertical reel from a horizontal talking-head source: 9:16 crop that follows the face per clip,
gentle punch-in on every other clip, hook on top, one-word subtitles, lesson cover + МАРШРУТ at the end."""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
ENG = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(ENG)), "yt3", "engine"))
import reel
W, H = 1080, 1920
PINK = "&H00AA5AF2"
KEY = {"мужчина", "мужчину", "мужчины", "мужчин", "самоценность", "самоценности", "ценность", "ценности", "любовь", "любви",
       "отношения", "отношений", "отношениях", "конкуренция", "конкуренции", "красивее", "красивая", "достойного", "достойна",
       "лучше", "выберет", "никогда", "никто", "одна", "страх", "боль", "счастье", "счастлива", "деньги", "уверенность"}

def ts(x):
    x = max(0, x); return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"

def title_lines(lines):
    from PIL import ImageFont
    f = ImageFont.truetype(subprocess.run(["fc-match", "-f", "%{file}", "Montserrat:style=ExtraBold"], capture_output=True, text=True).stdout, 100)
    lines = list(lines); last = lines[-1].rstrip()
    lines[-1] = (last[:-1].rstrip(",.;:—- ") + "*:") if last.endswith("*") else last.rstrip(",.;:—- ") + ":"
    plain = [re.sub(r"\*", "", l).upper() for l in lines]
    fs = min(96, 100 * 960 / (0.6407 * max(f.getlength(p) * 1.03 for p in plain)))
    out = []
    for l in lines:
        s = ""
        for p in re.split(r"(\*[^*]+\*)", l):
            if p: s += (r"{\c" + PINK + "&}" + p[1:-1].upper()) if p.startswith("*") else (r"{\c&H00FFFFFF&}" + p.upper())
        out.append(r"{\fnMontserrat ExtraBold\fs%.0f\fscx103\fsp0.7}" % fs + s)
    return out, fs

def main(spec_path, out_path):
    spec = json.load(open(spec_path))
    words = json.load(open(spec["words"]))["words"]
    reel.AUDIOS[:] = [spec["audio"]]
    src = spec["source"]; wk = spec["work"]; os.makedirs(wk, exist_ok=True)
    clips, outw, total, keep = reel.build_timeline(spec, words)
    # someone else's clip: split our clips at its edges, show it whole on a blurred background, no our subtitles
    RAW = spec.get("raw_box", [])            # [t0, t1, x0, w] in source seconds / pixels
    inraw = lambda t: next((r for r in RAW if r[0] <= t <= r[1]), None)
    if RAW:
        new = []
        for s0, e0, ids in clips:
            grp = [[ids[0]]]
            for i in ids[1:]:
                if (inraw(words[i]["s"]) is None) != (inraw(words[grp[-1][-1]]["s"]) is None): grp.append([i])
                else: grp[-1].append(i)
            if len(grp) == 1: new.append([s0, e0, ids]); continue
            for k, g in enumerate(grp):
                a = s0 if k == 0 else (words[grp[k - 1][-1]]["e"] + words[g[0]]["s"]) / 2
                b = e0 if k == len(grp) - 1 else (words[g[-1]]["e"] + words[grp[k + 1][0]]["s"]) / 2
                new.append([a, b, g])
        clips = new
        t = 0.0; outw = {}
        for c in clips:
            for i in c[2]: outw[i] = (words[i]["s"] - c[0] + t, words[i]["e"] - c[0] + t)
            t += c[1] - c[0]
        total = t
    HOLD = spec.get("hold", 3.8)
    cta0 = total + 0.1; TOT = total + HOLD
    # ---- cut clips, vertical crop following the face ----
    lst = os.path.join(wk, "list.txt"); prev = None
    with open(lst, "w") as L:
        for n, (s, e, _) in enumerate(clips):
            d = e - s
            rb = inraw(words[_[0]]["s"])
            if rb is not None:
                f = os.path.join(wk, f"c{n:03d}.mkv"); x0, bw = int(rb[2]), int(rb[3])
                vf = (f"split=2[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=30:3,eq=brightness=-0.15[bg];"
                      f"[b]crop={bw}:1080:{x0}:0,scale={W}:-2[fg];[bg][fg]overlay=0:(H-h)/2,setsar=1,fps=30")
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", src, "-t", f"{d:.3f}", "-filter_complex", vf,
                                "-af", f"afade=t=in:d=0.01,afade=t=out:st={max(0, d - 0.01):.3f}:d=0.01,aresample=48000",
                                "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", f],
                               check=True, stdin=subprocess.DEVNULL)
                L.write(f"file 'c{n:03d}.mkv'\n"); prev = None; continue
            fx = reel.face_x(src, s + min(d / 2, 0.8) - 0.0)
            fx = fx if prev is None or abs(fx - prev) > 60 else prev    # keep the frame still across small moves
            prev = fx
            zb = spec.get("zoom", [1.0, 1.12]); z = zb[n % 2]
            cw = int(1080 * 9 / 16 / z) // 2 * 2; ch = int(1080 / z) // 2 * 2
            x = int(min(max(fx - cw / 2, 0), 1920 - cw)); fy = spec.get("face_y", 0.32); y = int(min(max(1080 * fy - ch * 0.30, 0), 1080 - ch))
            fo = 0.04 if n == len(clips) - 1 else 0.01
            f = os.path.join(wk, f"c{n:03d}.mkv")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", src, "-t", f"{d:.3f}",
                            "-vf", f"crop={cw}:{ch}:{x}:{y},scale={W}:{H}:flags=lanczos,setsar=1,fps=30",
                            "-af", f"afade=t=in:d=0.01,afade=t=out:st={max(0, d - fo):.3f}:d={fo},aresample=48000",
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", f],
                           check=True, stdin=subprocess.DEVNULL)
            L.write(f"file 'c{n:03d}.mkv'\n")
    head = os.path.join(wk, "head.mkv")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-vf", f"tpad=stop_mode=clone:stop_duration={HOLD}",
                    "-af", f"apad=pad_dur={HOLD}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", head],
                   check=True, stdin=subprocess.DEVNULL)
    # ---- subtitles ----
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
    ev = []; POP = r"{\fscx88\fscy88\t(0,90,\fscx100\fscy100)}"
    for n, i in enumerate(keep):
        s = outw[i][0]
        if s >= cta0 or inraw(words[i]["s"]) is not None: continue
        e = outw[keep[n + 1]][0] if n + 1 < len(keep) else total
        e = min(e, outw[i][1] + 0.6, cta0)
        w = words[i].get("disp", words[i]["w"])
        st = "Acc" if words[i]["w"] in KEY else "Word"
        ev.append(f"Dialogue: 2,{ts(s)},{ts(e)},{st},,0,0,0,,{{\\pos(540,1480)}}{POP}{w}")
    tl, tfs = title_lines(spec["title"]); LH = int(tfs * 0.76)
    for k, t in enumerate(tl):
        y = 230 + k * LH
        sh = re.sub(r"\\c&H[0-9A-F]+&", "", t)
        ev.append(f"Dialogue: 1,{ts(0)},{ts(cta0)},T,,0,0,0,,{{\\pos(543,{y + 5})\\fad(200,0)\\c&H000000&\\alpha&H28&\\blur7\\shad0}}{sh}")
        ev.append(f"Dialogue: 2,{ts(0)},{ts(cta0)},T,,0,0,0,,{{\\pos(540,{y})\\fad(200,0)\\shad0}}{t}")
    # CTA over her last words
    c = cta0 + 0.2; fad = r"\fad(150,0)"
    cta = spec.get("cta", {})
    ask = cta.get("ask", "УЗНАЛА СЕБЯ?")
    lines = cta.get("lines", ["в комментариях, и я пришлю тебе урок,", "как понять свой сценарий", "и встретить своего мужчину"])
    ev.append(f"Dialogue: 3,{ts(c)},{ts(TOT)},T,,0,0,0,,{{\\pos(544,{226})\\c&H000000&\\alpha&H50&\\blur9\\shad0{fad}}}{{\\fnMontserrat ExtraBold\\fs70}}{ask}")
    ev.append(f"Dialogue: 4,{ts(c)},{ts(TOT)},T,,0,0,0,,{{\\pos(540,{220})\\shad0{fad}}}{{\\fnMontserrat ExtraBold\\fs70}}{ask}")
    ev.append(f"Dialogue: 4,{ts(c + 0.2)},{ts(TOT)},Word,,0,0,0,,{{\\pos(540,1430){fad}}}напиши {{\\rAcc}}МАРШРУТ")
    for k, l in enumerate(lines):
        ev.append(f"Dialogue: 4,{ts(c + 0.4)},{ts(TOT)},T,,0,0,0,,{{\\pos(540,{1530 + k * 66})\\fnMontserrat SemiBold\\fs76\\shad3{fad}}}{l}")
    ass = os.path.join(wk, "subs.ass"); open(ass, "w").write(hdr + "\n".join(ev) + "\n")
    # ---- compose: darken bottom + lesson cover during CTA ----
    inputs = ["-i", head, "-loop", "1", "-framerate", "30", "-t", f"{TOT - cta0:.2f}", "-i", spec["lesson_cover"]]
    mont = spec.get("montage")
    pre = []; base = "0:v"
    if mont:
        m0 = outw[mont["from_word"]][0]; m1 = outw[mont["to_word"]][0]
        seg = (m1 - m0) / len(mont["images"])
        for j, f in enumerate(mont["images"]):
            inputs += ["-loop", "1", "-framerate", "30", "-t", f"{seg + 0.05:.3f}", "-i", f]
            k = 2 + j; t0 = m0 + j * seg
            pre.append(f"[{k}:v]scale={W}:{H},format=yuv420p,setpts=PTS-STARTPTS+{t0:.3f}/TB[l{j}]")
            pre.append(f"[{base}][l{j}]overlay=0:0:eof_action=pass:enable='between(t,{t0:.3f},{t0 + seg:.3f})'[m{j}]")
            base = f"m{j}"
    fc = pre + [f"[{base}]split=2[v0][vb]",
          f"[vb]drawbox=x=0:y=0:w={W}:h={H}:color=black@0.45:t=fill[vd]",
          f"[v0][vd]overlay=0:0:enable='gte(t,{cta0:.3f})'[v1]",
          f"[1:v]scale=860:-2,format=rgba,fade=t=in:st=0:d=0.25:alpha=1,setpts=PTS-STARTPTS+{cta0:.3f}/TB[cov]",
          f"[v1][cov]overlay=x=(W-w)/2:y=880:eof_action=pass:enable='gte(t,{cta0:.3f})'[v2]",
          f"[v2]ass={ass},format=yuv420p[vout]",
          f"[0:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,alimiter=limit=0.95,apad=whole_dur={TOT:.3f}[aout]"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]", "-t", f"{TOT:.3f}",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out_path],
                   check=True, stdin=subprocess.DEVNULL)
    print(f"done {out_path} {TOT:.1f}s clips={len(clips)}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
