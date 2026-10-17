"""Upbeat 122 BPM pop-house bed (synthesised, no samples): four-on-the-floor kick, claps,
offbeat hats, plucky supersaw chords with sidechain pump, offbeat bass. Am-F-C-G."""
import sys, numpy as np, soundfile as sf
from scipy.signal import lfilter, butter
sr = 48000; bpm = 108; beat = 60 / bpm; bar = 4 * beat; T = float(sys.argv[2]) if len(sys.argv) > 2 else 75
N = int(T * sr); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(3)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, t0, pan=0.0, g=1.0):
    i = int(t0 * sr)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * g
    L[i:j] += s * np.cos((pan + 1) * np.pi / 4); R[i:j] += s * np.sin((pan + 1) * np.pi / 4)
def kick():
    n = int(0.3 * sr); t = np.arange(n) / sr; f = 48 + 110 * np.exp(-t * 35)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 7))
def clap():
    n = int(0.22 * sr); t = np.arange(n) / sr; x = rng.standard_normal(n)
    b, a = butter(2, [900 / (sr / 2), 5000 / (sr / 2)], "band"); x = lfilter(b, a, x)
    env = np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) * 300) ** 2) + 0.5 * np.exp(-((t - 0.024) * 300) ** 2)
    return x * env * 0.8
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * sr); t = np.arange(n) / sr; x = rng.standard_normal(n)
    b, a = butter(2, 7000 / (sr / 2), "high"); x = lfilter(b, a, x)
    return x * np.exp(-t * (18 if open_ else 80)) * 0.35
def saw(f, t):
    return 2 * ((f * t) % 1) - 1
def pluck(freqs, dur):
    n = int(dur * sr); t = np.arange(n) / sr; s = np.zeros(n)
    for f in freqs:
        for d in (-0.18, 0, 0.17):
            s += saw(f * (1 + d / 100), t + rng.uniform(0, 1))
    s /= len(freqs) * 3
    cut = 900 + 4000 * np.exp(-t * 9)
    # one-pole lowpass with moving cutoff (approx, block-wise)
    out = np.zeros(n); acc = 0.0
    for k in range(0, n, 256):
        a = 1 - np.exp(-2 * np.pi * cut[k] / sr)
        seg = s[k:k + 256]; y = lfilter([a], [1, a - 1], seg, zi=[acc * (1 - a)])[0]
        out[k:k + 256] = y; acc = y[-1]
    return out * np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
def bassnote(f, dur):
    n = int(dur * sr); t = np.arange(n) / sr
    s = np.tanh(2.2 * (np.sin(2 * np.pi * f * t) + 0.3 * saw(f, t)))
    return s * np.exp(-t * 4) * (1 - np.exp(-t * 300))
prog = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]]   # Am F C G
roots = [45, 41, 36, 43]
nb = int(T / bar) + 1
pump = np.ones(N)
for b in range(nb):
    t0 = b * bar; ch = prog[b % 4]; intro = b < 2
    for q in range(4):
        tq = t0 + q * beat
        add(kick(), tq, 0, 0.0 if intro or q % 2 else 0.6)
        i = int(tq * sr); k = np.arange(min(int(beat * sr), N - i)) / sr if i < N else np.array([])
        if len(k): pump[i:i + len(k)] = np.minimum(pump[i:i + len(k)], 0.7 + 0.3 * (1 - np.exp(-k * 10)))
        if q == 2 and not intro: add(clap(), tq, 0.05, 0.4)
        add(hat(True), tq + beat / 2, 0.35, 0.3)
        pass
        # plucks on the offbeats and the "and of 4"
        add(pluck([midi(m + 12) for m in ch], beat * 0.6), tq + beat / 2, -0.15, 0.32)
        if q == 3: add(pluck([midi(m + 12) for m in ch], beat * 0.4), tq + 0.75 * beat, 0.2, 0.22)
        if not intro: add(bassnote(midi(roots[b % 4]), beat * 0.45), tq + beat / 2, 0, 0.5)
t = np.arange(N) / sr
fade = np.clip(t / 0.5, 0, 1) * np.clip((T - t) / 2.5, 0, 1)
L *= pump; R *= pump
m = np.stack([L * fade, R * fade], 1); m /= np.abs(m).max(); m *= 0.85
sf.write(sys.argv[1], m, sr); print("ok", T)
