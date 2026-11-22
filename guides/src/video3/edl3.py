# Монтажный план эфира 3: hello (H) + основная часть по словам iPad-расшифровки; K — говорит Ксюша, O — Оля.
import json, re, sys, os, bisect
V = os.path.dirname(os.path.abspath(__file__)); J = lambda f: json.load(open(f'{V}/{f}'))
TMAX = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
norm = lambda s: re.sub(r'[^а-яёa-z0-9 ]', '', s.lower().replace('ё', 'е')).split()
DROP = {'блять', 'блядь', 'бля', 'нахуй', 'хуй', 'пиздец', 'ебать', 'сука', 'дебил', 'гондон', 'звездец', 'заебал', 'охуенно', 'охуеть', 'нихуя'}
FILL = {'э', 'ээ', 'эм', 'ммм', 'мм', 'эээ', 'хм', 'ээээ', 'эмм', 'ам'}
# слайды: только уверенные совпадения, остальное — протягиваем предыдущий
st = J('slides_tl.json'); ST, SN = [], []; last = 1
for t, n, d, *_ in st:
    if d < 600: last = n
    ST.append(t); SN.append(last)
slide = lambda t: SN[max(0, bisect.bisect_right(ST, t) - 1)]
# кто говорит: задержка (lag.json) там, где есть основной звук, иначе зелёная рамка
lag = {round(x[0] * 2): x for x in J('lag.json')}
spk = J('spk.json'); ot = J('otile.json')
def who(t):
    x = lag.get(round(t * 2))
    if x and x[1] is not None and x[2] >= 0.45: return 1 if x[1] > 0.25 else -1
    if x and x[1] is not None: return 0
    k = int(t * 2); r = spk[min(k, len(spk) - 1)][1]; o = 0 if ot[min(k, len(ot) - 1)] else 1
    return (1 if r[o][2] > .1 else 0) - (1 if r[1 - o][2] > .1 else 0)
bp = J('bigp.json')
def big(a, b):
    xs = bp[int(a * 2):int(b * 2) + 1]
    return bool(xs) and sum(1 for _, br, sa in xs if 95 < br < 180 and 12 < sa < 45) >= 0.9 * len(xs)
def runs_of(words, gap=0.55):
    runs = []; brk = False
    for w in words:
        t = (norm(w[2]) or [''])[0]
        if t in DROP: brk = True; continue
        if t in FILL: continue
        key = w[3]
        if runs and not brk and w[0] - runs[-1][1] < gap and runs[-1][2] == key: runs[-1][1] = max(runs[-1][1], w[1])
        else: runs.append([w[0], w[1], key])
        brk = False
    return runs
clips = []
H = [w for s in J('hello.json') for w in s['w'] if w[1] <= 102.4]
for a, b, _ in runs_of([[*w, ('H', None)] for w in H]): clips.append(dict(src='H', a=round(max(0, a - .1), 3), b=round(b + .18, 3), slide=None))
segs = [s for s in J('ipad.json') if s['s'] >= 9.8 and s['e'] <= TMAX]
W = []
for s in segs:
    v = sum(who(t / 2) for t in range(int(s['s'] * 2), int(s['e'] * 2) + 1))
    src = 'O' if v > 0 else 'K'
    W += [[w[0], w[1], w[2], (src, slide((w[0] + w[1]) / 2))] for w in s['w']]
for a, b, (src, sl) in runs_of(W):
    clips.append(dict(src=src, a=round(max(0, a - .1), 3), b=round(b + .18, 3), slide=sl))
for i in range(1, len(clips)):
    p, c = clips[i - 1], clips[i]
    if c['src'] != 'H' and p['src'] != 'H' and c['a'] < p['b']: p['b'] = c['a'] = round((p['b'] + c['a']) / 2, 3)
clips = [c for c in clips if c['b'] - c['a'] > 0.15]
out = []
for c in clips:
    if out and (out[-1]['src'], out[-1]['slide']) == (c['src'], c['slide']) and c['a'] - out[-1]['b'] < 0.02: out[-1]['b'] = c['b']
    else: out.append(c)
for c in out:
    if c['src'] == 'O': c['big'] = big(c['a'], c['b'])
json.dump(out, open(sys.argv[1], 'w'))
from collections import Counter
print(len(out), 'clips', round(sum(c['b'] - c['a'] for c in out) / 60, 1), 'min', Counter(c['src'] for c in out), 'O big', sum(1 for c in out if c.get('big')))
