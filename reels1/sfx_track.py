import re, numpy as np, soundfile as sf
sr=48000; T=71.2
def t2s(x):
    h,m,s=x.split(":"); return int(h)*3600+int(m)*60+float(s)
ev=[]
for line in open("subs.ass"):
    m=re.match(r"Dialogue: 1,([^,]+),[^,]+,(\w+),",line)
    if m: ev.append((t2s(m.group(1)),m.group(2)))
ev.sort()
snd={k:sf.read(f"sfx/{k}.wav")[0] for k in ["whoosh","pop","sparkle"]}
track=np.zeros((int(T*sr),2))
last_block=-9; last_w=-9; placed=[]
for t,st in ev:
    if st=="Small" and t-last_block>2.5: k,off,g="pop",0.0,0.8; last_block=t
    elif st=="Pink" and t-last_w>1.2: k,off,g="whoosh",-0.22,0.9; last_w=t
    elif st=="Script": k,off,g="sparkle",-0.05,0.9
    else:
        last_block=t if st=="Small" else last_block; continue
    s=snd[k]; i=int(max(0,t+off)*sr); j=min(len(track),i+len(s))
    track[i:j]+=s[:j-i]*g; placed.append((round(t,2),k))
sf.write("sfx/track.wav",track,sr)
print(placed)
