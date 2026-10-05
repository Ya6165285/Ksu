import numpy as np, soundfile as sf
sr=48000; bpm=80; beat=60/bpm; bar=4*beat; T=72.0
N=int(T*sr); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(7)
def midi(m): return 440*2**((m-69)/12)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*sr)
    if i>=N: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g
    L[i:j]+=s*np.cos((pan+1)*np.pi/4); R[i:j]+=s*np.sin((pan+1)*np.pi/4)
def epiano(f,dur,vel=0.5):
    n=int((dur+1.5)*sr); t=np.arange(n)/sr
    env=np.exp(-t*1.6)*(1-np.exp(-t*300))
    s=np.sin(2*np.pi*f*t+0.6*np.sin(2*np.pi*f*t)*np.exp(-t*4))  # tine FM
    s+=0.25*np.sin(2*np.pi*2*f*t)*np.exp(-t*3)+0.1*np.sin(2*np.pi*3*f*t)*np.exp(-t*5)
    rel=np.clip(1-(t-dur)/1.2,0,1); s*=env*np.where(t>dur,rel,1)*(1+0.12*np.sin(2*np.pi*4.5*t))
    return s*vel
def pad(freqs,dur):
    n=int(dur*sr); t=np.arange(n)/sr; s=np.zeros(n)
    for f in freqs:
        for d in (-0.12,0.0,0.13):
            s+=np.sin(2*np.pi*f*(1+d/100)*t+rng.uniform(0,6))
    att=np.clip(t/1.2,0,1); rel=np.clip((dur-t)/1.2,0,1)
    return s*att*rel/(len(freqs)*3)
def kick():
    n=int(0.35*sr); t=np.arange(n)/sr; f=50+70*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*9)
def hat():
    n=int(0.08*sr); x=rng.standard_normal(n); x=np.diff(x,prepend=0); t=np.arange(n)/sr
    return x*np.exp(-t*60)*0.15
def snare():
    n=int(0.25*sr); t=np.arange(n)/sr; x=rng.standard_normal(n)
    x=np.convolve(x,np.ones(6)/6,'same')
    return (x*0.5+0.4*np.sin(2*np.pi*190*t))*np.exp(-t*18)
# Fmaj9 - Em7 - Dm9 - Cmaj7 (soft lo-fi)
prog=[[53,57,60,64,67],[52,55,59,62],[50,53,57,60,64],[48,52,55,59]]
bass=[41,40,38,36]
nb=int(T/bar)+1
for b in range(nb):
    t0=b*bar; ch=prog[b%4]
    add(pad([midi(m) for m in ch[1:4]],bar+1.2),t0,0,0.10)
    # rhodes comp: chord on 1, broken notes on 2.5 and 3.5
    for k,m in enumerate(ch): add(epiano(midi(m+12),beat*1.5,0.10),t0+k*0.012,-0.2+0.1*k)
    add(epiano(midi(ch[-1]+12),beat*0.8,0.08),t0+2.5*beat,0.3)
    add(epiano(midi(ch[2]+12),beat*0.8,0.07),t0+3.5*beat,-0.3)
    add(epiano(midi(bass[b%4]),bar*0.9,0.22),t0,0)
    if b>=1:
        for q in range(4):
            if q in (0,2): add(kick(),t0+q*beat,0,0.35 if q==0 else 0.25)
            if q in (1,3): add(snare(),t0+q*beat+0.02,0.05,0.10)
            for e in (0,0.5): add(hat(),t0+(q+e)*beat+(0.04 if e else 0),0.4,0.3)
# vinyl crackle + hiss
crack=np.zeros(N); idx=rng.integers(0,N,int(T*6)); crack[idx]=rng.uniform(-1,1,len(idx))
crack=np.convolve(crack,np.exp(-np.arange(60)/8),'same')*0.01
L+=crack+rng.standard_normal(N)*0.002; R+=crack+rng.standard_normal(N)*0.002
# simple lowpass for warmth
def lp(x,a=0.35):
    y=np.empty_like(x); acc=0.0
    from scipy.signal import lfilter
    return lfilter([a],[1,a-1],x)
try:
    L=lp(L); R=lp(R)
except Exception: pass
t=np.arange(N)/sr; fade=np.clip(t/2,0,1)*np.clip((T-t)/3,0,1)
m=np.stack([L*fade,R*fade],1); m/=np.abs(m).max(); m*=0.8
sf.write("music.wav",m,sr); print("ok")
