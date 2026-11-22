import subprocess, numpy as np, glob, json
from PIL import Image
SL=sorted(glob.glob('/home/user/Ksu/launch/Слайды_Из_алмаза_в_бриллиант/Слайд_*.jpg'))
def prep(im): return np.asarray(im.convert('L').resize((100,81)),np.float32)
# slide region in ipad frame: x0..720, y437..842 ; use left part x0..500 -> slide fraction 500/720
ref=[]
for f in SL:
    im=Image.open(f).resize((720,405)); ref.append(prep(im.crop((0,0,500,405))))
ref=np.stack(ref)
W,H=720,1280
p=subprocess.Popen(['ffmpeg','-v','error','-i','ipad.mp4','-vf','fps=0.5','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
out=[];i=0
while True:
    b=p.stdout.read(W*H*3)
    if len(b)<W*H*3: break
    fr=Image.fromarray(np.frombuffer(b,np.uint8).reshape(H,W,3))
    x=prep(fr.crop((0,437,500,842)))
    d=((ref-x)**2).mean(axis=(1,2))
    k=int(d.argmin()); out.append((i*2,k+1,float(d[k]),float(np.sort(d)[1])))
    i+=1
json.dump(out,open('slides_tl.json','w'))
print(len(out))
