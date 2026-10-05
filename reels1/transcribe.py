import sherpa_onnx, soundfile as sf, json, subprocess, re
M="sherpa-onnx-nemo-transducer-giga-am-v2-russian-2025-04-19/"
rec=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=M+"encoder.int8.onnx",decoder=M+"decoder.onnx",joiner=M+"joiner.onnx",tokens=M+"tokens.txt",model_type="nemo_transducer",num_threads=4)
a,sr=sf.read("reels/audio16.wav",dtype="float32"); dur=len(a)/sr
out=subprocess.run(["ffmpeg","-hide_banner","-i","reels/audio16.wav","-af","silencedetect=n=-45dB:d=0.45","-f","null","-"],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",out)]; se=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",out)]
segs=[];cur=0.0
for s,e in zip(ss,se+[dur]*(len(ss)-len(se))):
    if s>cur+0.05: segs.append((cur,s))
    cur=e
if cur<dur-0.05: segs.append((cur,dur))
# split long segments into <=20s pieces at the quietest point
import numpy as np
def split(s,e):
    if e-s<=20: return [(s,e)]
    lo,hi=int((s+8)*sr),int((s+18)*sr); win=int(0.2*sr)
    best=min(range(lo,hi-win,int(0.02*sr)),key=lambda i: float(np.mean(a[i:i+win]**2)))
    m=(best+win/2)/sr
    return split(s,m)+split(m,e)
segs=[p for s,e in segs for p in split(s,e)]
words=[]
for (s,e) in segs:
    s0=max(0,s-0.1);e0=min(dur,e+0.1)
    st=rec.create_stream(); st.accept_waveform(sr,a[int(s0*sr):int(e0*sr)]); rec.decode_stream(st)
    r=st.result; w=None
    for t,tt in zip(r.tokens,r.timestamps):
        if t.strip()=="":
            if w: words.append(w); w=None
            continue
        if w is None: w={"w":t,"s":s0+tt,"e":s0+tt+0.06}
        else: w["w"]+=t; w["e"]=s0+tt+0.06
    if w: words.append(w)
    print(f"[{s:.2f}-{e:.2f}] {r.text}")
json.dump({"segs":segs,"words":words},open("reels/words.json","w"),ensure_ascii=False,indent=0)
