import subprocess, numpy as np, json
from PIL import Image
W,H=720,1280
T1=(10,1029,146,1269); T2=(151,1029,287,1269); P=(515,436,705,750)
def vec(a,box,sz=(12,20)):
    x0,y0,x1,y1=box; im=Image.fromarray(a[y0+6:y1-40,x0+6:x1-6]).convert('L').resize(sz)
    v=np.asarray(im,np.float32).ravel(); v-=v.mean(); return v/(np.linalg.norm(v)+1e-6)
def green(a,box):
    x0,y0,x1,y1=box; b=np.concatenate([a[y0:y1,x0:x0+3].reshape(-1,3),a[y0:y1,x1-3:x1].reshape(-1,3)])
    return float(((b[:,1]>150)&(b[:,0]<140)&(b[:,2]<140)).mean())
ref=np.asarray(Image.open('f1040.png').convert('RGB'))
rK=vec(ref,T1); rO=vec(ref,T2); rP=vec(ref,P,(16,26))
p=subprocess.Popen(['ffmpeg','-v','error','-i','ipad.mp4','-vf','fps=2','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
out=[];i=0
while True:
    b=p.stdout.read(W*H*3)
    if len(b)<W*H*3: break
    a=np.frombuffer(b,np.uint8).reshape(H,W,3)
    r=[]
    for T in (T1,T2):
        v=vec(a,T); r.append((float(v@rO),float(v@rK),green(a,T)))
    pv=float(vec(a,P,(16,26))@rP)
    out.append((i/2,r,pv)); i+=1
json.dump(out,open('spk.json','w')); print(len(out))
