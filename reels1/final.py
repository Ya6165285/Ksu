import json, re, subprocess, numpy as np, cv2
clips=json.load(open("clips.json"))["clips"]
bounds=[0]; 
for s,e in clips: bounds.append(bounds[-1]+e-s)
def t2s(x):
    h,m,s=x.split(":"); return int(h)*3600+int(m)*60+float(s)
# accent windows from subtitle layer 1
acc=[]
for line in open("subs.ass"):
    m=re.match(r"Dialogue: 1,([^,]+),([^,]+),",line)
    if m:
        s,e=t2s(m.group(1)),t2s(m.group(2))
        if acc and s-acc[-1][1]<0.3: acc[-1][1]=max(acc[-1][1],e)
        else: acc.append([s,e])
def zoom(t):
    k=np.searchsorted(bounds,t,side="right")-1
    z=1.0 if k%2==0 else 1.10
    for s,e in acc:
        if s-0.25<=t<=e+0.25:
            a=min(1,(t-(s-0.25))/0.25, (e+0.25-t)/0.25)
            a=0.5-0.5*np.cos(np.pi*max(0,a))
            z*=1+0.07*a
    return z
cap=cv2.VideoCapture("retouched_concat.mkv"); W,H=1080,1920
enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r","30","-i","-",
   "-c:v","libx264","-preset","fast","-crf","14","-pix_fmt","yuv420p","zoomed.mkv"],stdin=subprocess.PIPE)
n=0
while True:
    ok,f=cap.read()
    if not ok: break
    z=zoom(n/30)
    if z>1.001:
        cw,ch=W/z,H/z; x0=(W-cw)/2; y0=(H-ch)*0.35   # keep face area, bias upward
        M=np.array([[z,0,-x0*z],[0,z,-y0*z]],np.float32)
        f=cv2.warpAffine(f,M,(W,H),flags=cv2.INTER_LINEAR)
    enc.stdin.write(f.tobytes()); n+=1
enc.stdin.close(); enc.wait(); print("frames",n,"accents",len(acc))
