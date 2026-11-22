# EDL -> видео эфира 3. H: приветствие крупно; K: Ксюша слева + слайд справа; O: Ксюша слева + Оля крупно + слайд.
import json, sys, subprocess, os, hashlib, statistics
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
V = os.path.dirname(os.path.abspath(__file__)); C = V + '/canvas'
MS, MD = os.path.getsize(V + '/main.mov'), 10960209534   # main.mov ещё докачивается: фиксированный срез + пустота + moov из хвоста
if MS >= 10971207251: MAIN = V + '/main.mov'
else:
    MS = MS // 1048576 * 1048576; gp = f'{V}/gap_{MS}.bin'
    if not os.path.exists(gp): open(gp, 'wb').truncate(MD - MS)
    MAIN = f'concat:subfile,,start,0,end,{MS},,:{V}/main.mov|{gp}|{V}/moov.bin'
L = json.load(open(C + '/layout.json')); PW = 780
GAIN = {'H': 23, 'K': 15.5, 'O': 0}
mt = lambda t: t + 476.12 + 4.8e-5 * (t - 100)
FH = json.load(open(V + '/fH.json')); FM = json.load(open(V + '/fM.json')) if os.path.exists(V + '/fM.json') else []
OT = json.load(open(V + '/otile.json'))
def face(F, a, b, d=(0.45, 0.3)):
    fs = [f for f in F if a - 1 <= f[0] <= b + 1 and f[1] is not None] or [f for f in F if a - 30 <= f[0] <= b + 30 and f[1] is not None]
    return (statistics.median(f[1] for f in fs), statistics.median(f[2] for f in fs)) if fs else d
mask = C + '/omask.png'
if not os.path.exists(mask):
    m = Image.new('L', (L['OW'], L['OH']), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, L['OW'] - 1, L['OH'] - 1), 22, fill=255); m.save(mask)
edl = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(V + '/seg', exist_ok=True)
def blocks(edl):
    out = []
    for c in edl:
        k = (c['src'], c.get('slide'), c.get('big'))
        if out and out[-1][0] == k and c['a'] - out[-1][1][-1]['b'] < 300: out[-1][1].append(c)
        else: out.append((k, [c]))
    return out
def ksu_crop(a0, b0, z=1.1):
    fx, fy = face(FM, mt(a0), mt(b0), (0.4, 0.3)); ch = int(1080 / z) // 2 * 2; cw = int(ch * PW / 1080) // 2 * 2
    x = int(min(max(fx * 1920 - cw / 2, 0), 1920 - cw)); y = int(min(max(fy * 1080 - ch * 0.3, 0), 1080 - ch))
    return f'crop={cw}:{ch}:{x}:{y},scale={PW}:1080:flags=lanczos'
def job(blk):
    (src, slide, bg), cl = blk
    out = V + '/seg/' + hashlib.md5(json.dumps(['v3', src, slide, bg, cl, GAIN, len(FM)]).encode()).hexdigest()[:16]
    if os.path.exists(out + '.done'): return out
    a0, b0 = cl[0]['a'], cl[-1]['b']; dur = f'{b0 - a0 + 0.1:.3f}'
    sel = '+'.join(f"between(t,{c['a'] - a0:.3f},{c['b'] - a0:.3f})" for c in cl)
    pre = f"fps=30,select='{sel}',setpts=N/30/TB,setsar=1"
    if src == 'H':
        fx, fy = face(FH, a0, b0, (0.55, 0.3)); z = 1.3; ch = int(1080 / z) // 2 * 2; cw = int(ch * 16 / 9) // 2 * 2
        x = int(min(max(fx * 1920 - cw / 2, 0), 1920 - cw)); y = int(min(max(fy * 1080 - ch * 0.32, 0), 1080 - ch))
        inp = ['-ss', f'{a0:.3f}', '-t', dur, '-i', V + '/hello.mov']
        fc = f"[0:v]{pre},crop={cw}:{ch}:{x}:{y},scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p[v]"; asrc = (V + '/hello.mov', a0)
    else:
        inp = ['-ss', f'{mt(a0):.3f}', '-t', dur, '-i', MAIN, '-loop', '1', '-framerate', '30', '-i', f"{C}/{'S' if src == 'K' else 'O'}{slide:02d}.png"]
        fc = f"[0:v]{pre},{ksu_crop(a0, b0)},setsar=1[p];[1:v]setsar=1[c];[c][p]overlay=0:0:shortest=1"
        if src == 'K': fc += ",format=yuv420p[v]"; asrc = (MAIN, mt(a0))
        else:
            if bg: cr = 'crop=180:313:517:438'
            else:
                k = min(int(a0 * 2), len(OT) - 1); x0 = 10 if OT[k] else 151
                cr = f'crop=115:200:{x0 + 10}:1032'
            inp += ['-ss', f'{a0:.3f}', '-t', dur, '-i', V + '/ipad.mp4', '-loop', '1', '-i', mask]
            fc += f"[b];[2:v]{pre},{cr},scale={L['OW']}:{L['OH']}:flags=lanczos,unsharp=5:5:0.6,format=yuva420p[o0];[3:v]format=gray,scale={L['OW']}:{L['OH']}[m];[o0][m]alphamerge[o];[b][o]overlay={L['OX']}:{L['OY']}:shortest=1,format=yuv420p[v]"
            asrc = (V + '/ipad.mp4', a0)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inp, '-filter_complex', fc, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', '30', out + '.mp4'], check=True)
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', out + '.mp4'], capture_output=True, text=True).stdout.strip())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{asrc[1]:.3f}', '-t', dur, '-i', asrc[0], '-map', '0:a:0', '-af',
                    f"aselect='{sel}',asetpts=N/SR/TB,aresample=48000,highpass=f=70,volume={GAIN[src]}dB,afade=t=in:d=0.02,apad,atrim=end_sample={1600 * n}", '-ac', '2', '-c:a', 'pcm_s16le', out + '.wav'], check=True)
    r = subprocess.run(['ffmpeg', '-nostats', '-i', out + '.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = [float(l.split()[1]) for l in r.splitlines() if l.strip().startswith('I:')]
    if I and I[-1] > -60 and abs(I[-1] + 18) > 1 and n > 60:
        g = max(-10, min(10, -18 - I[-1])); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out + '.wav', '-af', f'volume={g:.1f}dB', '-c:a', 'pcm_s16le', out + '.n.wav'], check=True); os.replace(out + '.n.wav', out + '.wav')
    open(out + '.done', 'w').write(str(n)); return out
with ThreadPoolExecutor(int(os.environ.get('J', 3))) as ex: segs = list(ex.map(job, blocks(edl)))
open(V + '/seg/vl.txt', 'w').write(''.join(f"file '{s}.mp4'\n" for s in segs)); open(V + '/seg/al.txt', 'w').write(''.join(f"file '{s}.wav'\n" for s in segs))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', V + '/seg/vl.txt', '-f', 'concat', '-safe', '0', '-i', V + '/seg/al.txt', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-af', 'acompressor=threshold=-24dB:ratio=2.5:attack=10:release=200,loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', OUT], check=True)
print('done', OUT)
