import numpy as np, soundfile as sf
from scipy.signal import fftconvolve
sr=44100; q=60/70; bar=3*q; T=72.0; N=int(T*sr)
rng=np.random.default_rng(3)
names={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def m(n):
    p=n[:-1]; o=int(n[-1]); return 12*(o+1)+names[p]
def hz(mm): return 440*2**((mm-69)/12)
def note(f,dur,vel):
    n=int((dur+2.5)*sr); t=np.arange(n)/sr; s=np.zeros(n); B=0.00035
    for k in range(1,12):
        fk=k*f*np.sqrt(1+B*k*k)
        if fk>sr/2.2: break
        a=(1/k**1.3)*(0.6+0.4*vel)**(k*0.4)
        d1=0.25+2.2/(1+0.004*fk); 
        env=0.65*np.exp(-t/(d1*0.35))+0.35*np.exp(-t/(d1*2.5))
        for det in (-0.4,0,0.45):
            s+=a*env*np.sin(2*np.pi*fk*(1+det/1731)*t+rng.uniform(0,6))/3
    s*=(1-np.exp(-t*900))
    rel=np.clip(1-(t-dur)/0.35,0,1); s*=np.where(t>dur,rel,1)
    ham=rng.standard_normal(int(0.01*sr))*np.exp(-np.arange(int(0.01*sr))/60)*0.02
    s[:len(ham)]+=ham
    return s*vel
L=np.zeros(N); R=np.zeros(N)
def play(n,t0,dur,vel,pan=0):
    i=int(t0*sr)
    if i>=N: return
    x=note(hz(m(n)),dur,vel); j=min(N,i+len(x))
    L[i:j]+=x[:j-i]*np.cos((pan+1)*np.pi/4); R[i:j]+=x[:j-i]*np.sin((pan+1)*np.pi/4)
G=('G2',['B3','D4','F#4']); D=('D2',['A3','C#4','F#4'])
mel=[None]*4+[
 [None,'F#5','A5'],['G5','F#5','C#5'],['B4','C#5','D5'],['A4',None,None],['F#4',None,None],[None]*3,[None]*3,[None]*3,
 [None,'F#5','A5'],['G5','F#5','C#5'],['B4','C#5','D5'],['A4',None,None],['F#4',None,None],[None]*3,[None]*3,[None]*3,
 [None,'A4','B4'],['C#5','E5','D5'],['B4','C#5','D5'],['E5',None,None],['F#5',None,None],['D5','C#5','B4'],['A4',None,None],['F#4',None,None],
]
nb=len(mel)
for b in range(nb):
    t0=b*bar+0.3; bass,ch=(G if b%2==0 else D)
    if b==nb-1: bass,ch=D
    play(bass,t0,bar*0.95,0.42,-0.3)
    for k,c in enumerate(ch): play(c,t0+q+k*0.008,2*q*0.95,0.26,-0.1+0.1*k)
    if mel[b]:
        notes=mel[b]
        for i,nn in enumerate(notes):
            if nn is None: continue
            dur=q
            j=i+1
            while j<3 and notes[j] is None: dur+=q; j+=1
            if dur>=3*q-0.01: dur=bar*1.6
            play(nn,t0+i*q,dur*0.97,0.38,0.15)
# reverb
ir_n=int(2.8*sr); tt=np.arange(ir_n)/sr
irL=rng.standard_normal(ir_n)*np.exp(-tt/0.7); irR=rng.standard_normal(ir_n)*np.exp(-tt/0.7)
irL[:int(0.02*sr)]*=0; irR[:int(0.023*sr)]*=0
irL/=np.sqrt((irL**2).sum()); irR/=np.sqrt((irR**2).sum())
wL=fftconvolve(L,irL)[:N]; wR=fftconvolve(R,irR)[:N]
L=L*0.8+wL*0.45; R=R*0.8+wR*0.45
t=np.arange(N)/sr; fade=np.clip(t/1.0,0,1)*np.clip((T-t)/3,0,1)
mix=np.stack([L*fade,R*fade],1); mix/=np.abs(mix).max(); mix*=0.85
sf.write("music_piano.wav",mix,sr); print("bars",nb,"len",nb*bar)
