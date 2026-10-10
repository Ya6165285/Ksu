"""Render one vertical reel in the reference style from a JSON spec.

Layout (1080x1920): black canvas, two-line hook title above a full-width
16:9 video band, one-word subtitles under the band, b-roll cards popping
in the lower black area, occasional full-screen punch-in on the speaker,
and a МАРШРУТ call-to-action at the end.
"""
import json, subprocess, sys, os, re
import numpy as np, soundfile as sf

W, H = 1080, 1920
BAND_H = 608
BAND_Y = (H - BAND_H) // 2           # 656
SUB_Y = BAND_Y + BAND_H + 58          # just under the band
ROOT = os.path.dirname(os.path.abspath(__file__))


def run(cmd):
    subprocess.run(cmd, check=True)


def ts(x):
    x = max(0.0, x)
    return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"


def build_timeline(spec, words):
    """Turn kept word indices into clips; returns clips and per-word out times."""
    seen = set(); keep = []
    for a, b in spec["ranges"]:
        for i in range(a, b + 1):
            if i not in seen and i not in set(spec.get("drop", [])):
                seen.add(i); keep.append(i)
    PRE, POST, MAXGAP = 0.08, 0.14, 0.32
    clips = []
    for i in keep:
        w = words[i]
        if clips and clips[-1][2][-1] == i - 1 and w["s"] - words[i - 1]["e"] <= MAXGAP:
            clips[-1][1] = w["e"]; clips[-1][2].append(i)
        else:
            clips.append([w["s"], w["e"], [i]])
    for c in clips:
        a, b = c[2][0], c[2][-1]
        lo = words[a - 1]["e"] if a > 0 else 0
        hi = words[b + 1]["s"] if b + 1 < len(words) else c[1] + 1
        c[0] = max(c[0] - PRE, (lo + c[0]) / 2)
        c[1] = min(c[1] + POST, (hi + c[1]) / 2)
    # the reel ends on this word: keep its full tail (the next source word may start right away;
    # a short audio fade at the clip end hides it)
    if clips:
        b = clips[-1][2][-1]
        clips[-1][1] = max(clips[-1][1], words[b]["e"] + 0.16)
    t = 0.0; outw = {}
    for c in clips:
        for i in c[2]:
            outw[i] = (words[i]["s"] - c[0] + t, words[i]["e"] - c[0] + t)
        t += c[1] - c[0]
    return clips, outw, t, keep


PINK_T = "&H00AA5AF2"   # #F25AAA, same pink as the МАРШРУТ call-to-action


def title_ass(lines):
    """Montserrat Bold caps, white with *pink* accents; one size for all lines, fitted to 980 px."""
    from PIL import ImageFont
    path = subprocess.run(["fc-match", "-f", "%{file}", "Montserrat:style=ExtraBold"], capture_output=True, text=True).stdout
    f = ImageFont.truetype(path, 100)
    plain = [re.sub(r"\*", "", ln).upper() for ln in lines]
    # glyphs 4% wider and ~1.7% of size extra letter spacing (measured on the reference screenshot)
    widest = max(f.getlength(p) * 1.03 + 1.05 * len(p) for p in plain)
    fs = min(66, 100 * 820 / (0.6407 * widest))
    out = []
    for ln in lines:
        s = ""
        for p in re.split(r"(\*[^*]+\*)", ln):
            if not p:
                continue
            if p.startswith("*"):
                s += r"{\c" + PINK_T + "&}" + p[1:-1].upper()
            else:
                s += r"{\c&H00FFFFFF&}" + p.upper()
        out.append(r"{\fnMontserrat ExtraBold\b0\i0\fs%.0f\fscx103\fsp%.1f}" % (fs, fs * 0.0105) + s)
    return out, fs


def make_ass(spec, words, outw, total, keep, cta_t0, path):
    hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Title,Montserrat,64,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,0,3,5,20,20,0,204
Style: Sub,Inter,54,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,0,2,5,20,20,0,204
Style: Big,Inter Bold,70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,0,3,5,20,20,0,204
Style: Pink,Inter ExtraBold,96,&H00AA5AF2,&H00AA5AF2,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,20,20,0,204

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = []
    tl, tfs = title_ass(spec["title"]); LINE = int(tfs * 0.74)
    y0 = BAND_Y - int(tfs * 0.62) - LINE * (len(tl) - 1)
    # title is hidden during full-screen zooms and replaced by the CTA at the end
    zooms = spec.get("zooms", [])
    cuts = sorted(zooms) + ([(cta_t0, total)] if cta_t0 is not None else [])
    spans = []; cur = 0.0
    for a, b in cuts:
        if a > cur: spans.append((cur, a))
        cur = max(cur, b)
    if cur < total and cta_t0 is None: spans.append((cur, total))
    for n, (a, b) in enumerate(spans):
        fad = "\\fad(200,0)" if n == 0 else ""
        for k, s in enumerate(tl):
            sh = re.sub(r"\\c&H[0-9A-F]+&", "", s)
            ev.append(f"Dialogue: 1,{ts(a)},{ts(b)},Title,,0,0,0,,{{\\pos(544,{y0 + LINE * k + 6}){fad}\\c&H000000&\\alpha&H60&\\blur9\\shad0}}{sh}")
            ev.append(f"Dialogue: 2,{ts(a)},{ts(b)},Title,,0,0,0,,{{\\pos(540,{y0 + LINE * k}){fad}\\shad0}}{s}")
    # one-word subtitles under the band (hidden during full-screen zooms)
    for n, i in enumerate(keep):
        s = outw[i][0]
        e = outw[keep[n + 1]][0] if n + 1 < len(keep) else total
        e = min(e, outw[i][1] + 0.6)
        if cta_t0 is not None and s >= cta_t0 and spec.get("cta", {}).get("type") == "card":
            continue
        inzoom = any(a <= s < b for a, b in zooms)
        y = 1500 if inzoom else SUB_Y
        sty = "Big" if inzoom else "Sub"
        ev.append(f"Dialogue: 1,{ts(s)},{ts(e)},{sty},,0,0,0,,{{\\pos(540,{y})}}{words[i]['w']}")
    for sym in spec.get("symbols", []):
        ev.append(f"Dialogue: 4,{ts(sym['t'])},{ts(sym['t'] + sym['dur'])},Big,,0,0,0,,{{\\pos(540,{sym['y']})\\fnInter\\fs130\\fad(120,120)}}{sym['ch']}")
    if cta_t0 is not None:
        c = cta_t0 + 0.2
        ev.append(f"Dialogue: 3,{ts(c)},{ts(total)},Big,,0,0,0,,{{\\pos(540,{BAND_Y - 150})\\fad(150,0)}}напиши {{\\rPink}}МАРШРУТ")
        ev.append(f"Dialogue: 3,{ts(c + 0.25)},{ts(total)},Sub,,0,0,0,,{{\\pos(540,{BAND_Y - 70})\\fad(150,0)}}в комментариях и я пришлю тебе урок")
    open(path, "w").write(hdr + "\n".join(ev) + "\n")


def face_x(src, t):
    """Median horizontal face centre around time t (pixels in 1920-wide source)."""
    try:
        import cv2, mediapipe as mp
        from mediapipe.tasks.python import vision, BaseOptions
        det = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(
            base_options=BaseOptions(model_asset_path=os.path.join(ROOT, "blaze_face_short_range.tflite"))))
        xs = []
        for dt in (0, 0.7, 1.4):
            fr = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t + dt:.2f}", "-i", src, "-frames:v", "1",
                                 "-vf", "scale=960:540", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                capture_output=True).stdout
            if len(fr) != 960 * 540 * 3:
                continue
            img = np.frombuffer(fr, np.uint8).reshape(540, 960, 3).copy()
            r = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=img))
            if r.detections:
                b = max(r.detections, key=lambda d: d.bounding_box.width).bounding_box
                xs.append((b.origin_x + b.width / 2) * 2)
        return float(np.median(xs)) if xs else 960.0
    except Exception as e:
        print("face_x fallback:", e)
        return 960.0


def main(spec_path, out_path):
    spec = json.load(open(spec_path))
    words = json.load(open(spec["words"]))["words"]
    src = spec["source"]; work = spec["work"]; os.makedirs(work, exist_ok=True)
    clips, outw, total, keep = build_timeline(spec, words)
    cta = spec.get("cta", {"type": "card"})
    cta_t0 = None
    if cta["type"] == "own":
        # CTA fragment is the last range: find its first word's output time
        cta_t0 = outw[cta["first_word"]][0]
    # 1) cut and concat the talking-head clips (full 1920x1080)
    lst = os.path.join(work, "list.txt")
    with open(lst, "w") as L:
        for n, (s, e, _) in enumerate(clips):
            f = os.path.join(work, f"c{n:03d}.mkv")
            d = e - s
            fo = 0.14 if n == len(clips) - 1 else 0.01
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", src, "-t", f"{d:.3f}",
                 "-vf", "scale=1920:1080,setsar=1,fps=30",
                 "-af", f"afade=t=in:d=0.01,afade=t=out:st={max(0, d - fo):.3f}:d={fo},aresample=48000",
                 "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", f])
            L.write(f"file 'c{n:03d}.mkv'\n")
    head = os.path.join(work, "head.mkv")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", head])
    # own CTA: hold the last frame (cover + МАРШРУТ text) a little longer
    if cta["type"] == "own":
        held = os.path.join(work, "head_hold.mkv")
        run(["ffmpeg", "-v", "error", "-y", "-i", head, "-vf", "tpad=stop_mode=clone:stop_duration=1.5",
             "-af", "apad=pad_dur=1.5", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p",
             "-c:a", "pcm_s16le", held])
        head = held; total += 1.5
    # 2) card CTA: append the prepared end card
    if cta["type"] == "card":
        cta_t0 = total
        total += 4.0
    # 3) subtitles/title
    ass = os.path.join(work, "subs.ass")
    make_ass(spec, words, outw, total, keep, cta_t0, ass)
    # 4) filter graph
    inputs = ["-i", head]
    fc = []
    fc.append(f"color=c=black:s={W}x{H}:r=30:d={total:.3f}[bg]")
    fc.append(f"[0:v]split=2[hv][hz]")
    fc.append(f"[hv]scale={W}:{BAND_H}:flags=lanczos[band]")
    fc.append(f"[bg][band]overlay=0:{BAND_Y}:eof_action=pass[v0]")
    cur = "v0"
    # full-screen punch-ins on the speaker
    zooms = spec.get("zooms", [])
    if zooms:
        fx = face_x(src, clips[0][0] + 1)
        cw = int(1080 * 9 / 16) // 2 * 2
        x = int(min(max(fx - cw / 2, 0), 1920 - cw))
        en = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in zooms)
        fc.append(f"[hz]crop={cw}:1080:{x}:0,scale={W}:{H}:flags=lanczos[zf]")
        fc.append(f"[{cur}][zf]overlay=0:0:enable='{en}'[vz]")
        cur = "vz"
    else:
        fc.append("[hz]nullsink")
    # b-roll cards and stickers, popping in
    k = 1
    for j, ins in enumerate(spec.get("inserts", [])):
        f = ins["file"]; d = ins.get("dur", 2.4); t0 = ins["t"]
        is_img = f.lower().endswith((".jpg", ".png"))
        if is_img:
            inputs += ["-loop", "1", "-framerate", "30", "-t", f"{d:.2f}", "-i", f]
        else:
            inputs += ["-ss", f"{ins.get('ss', 0):.2f}", "-t", f"{d:.2f}", "-i", f]
        ang = ins.get("rot", 0) * np.pi / 180
        cx, cy = ins.get("x", 540), ins.get("y", 1610)
        if ins.get("kind") == "sticker":
            sz = ins.get("size", 300)
            base = f"[{k}:v]fps=30,format=rgba,scale={sz}:-2"
        else:
            cw = ins.get("w", 440); ch = int(cw * 5 / 4) // 2 * 2
            base = (f"[{k}:v]fps=30,scale={cw}:{ch}:force_original_aspect_ratio=increase,crop={cw}:{ch},setsar=1,format=rgba")
        fc.append(base + f",rotate={ang:.4f}:c=none:ow=rotw({ang:.4f}):oh=roth({ang:.4f}),"
                  f"scale=w='iw*min(1,0.55+3.5*t)':h=-2:eval=frame,"
                  f"fade=t=out:st={max(0, d - 0.12):.2f}:d=0.12:alpha=1,"
                  f"setpts=PTS-STARTPTS+{t0:.3f}/TB[i{j}]")
        fc.append(f"[{cur}][i{j}]overlay=x={cx}-w/2:y={cy}-h/2:eof_action=pass:enable='between(t,{t0:.3f},{t0 + d:.3f})'[v{j + 1}x]")
        cur = f"v{j + 1}x"; k += 1
    # lesson cover during own-CTA
    if cta["type"] == "own":
        inputs += ["-loop", "1", "-framerate", "30", "-t", f"{total - cta_t0:.2f}", "-i", spec["lesson_cover"]]
        fc.append(f"[{k}:v]scale=720:-2,format=rgba,fade=t=in:st=0:d=0.25:alpha=1,setpts=PTS-STARTPTS+{cta_t0:.3f}/TB[cov]")
        fc.append(f"[{cur}][cov]overlay=x=(W-w)/2:y=1385:eof_action=pass:enable='gte(t,{cta_t0:.3f})'[vcov]")
        cur = "vcov"; k += 1
    fc.append(f"[{cur}]ass={ass},format=yuv420p[vbody]")
    # end card
    if cta["type"] == "card":
        inputs += ["-i", spec["endcard"]]
        fc.append(f"[vbody]trim=0:{cta_t0:.3f},setpts=PTS-STARTPTS[vb2]")
        fc.append(f"[{k}:v]scale={W}:{H},fps=30,format=yuv420p,setpts=PTS-STARTPTS[ec]")
        fc.append(f"[vb2][ec]concat=n=2:v=1:a=0[vout]")
        ecidx = k; k += 1
    else:
        fc.append("[vbody]null[vout]")
    # audio: voice + quiet pops on inserts
    pops = [ins["t"] for ins in spec.get("inserts", [])]
    track = np.zeros((int((total + 1) * 48000), 2))
    pop, _ = sf.read(spec["pop"])
    for t in pops:
        i = int(t * 48000); track[i:i + len(pop)] += pop[:len(track) - i] * 0.45
    sfxp = os.path.join(work, "sfx.wav"); sf.write(sfxp, track, 48000)
    inputs += ["-i", sfxp]; sidx = k
    if cta["type"] == "card":
        fc.append(f"[0:a]aresample=48000,apad=whole_dur={total:.3f}[va]")
    else:
        fc.append(f"[0:a]aresample=48000,apad=whole_dur={total:.3f}[va]")
    fc.append(f"[va][{sidx}:a]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,alimiter=limit=0.95,apad=whole_dur={total:.3f}[aout]")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]",
         "-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out_path])
    print(f"done {out_path} {total:.1f}s clips={len(clips)}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
