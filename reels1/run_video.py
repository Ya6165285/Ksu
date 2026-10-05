import cv2, numpy as np, subprocess, sys, glob, os, mediapipe as mp
sys.path.insert(0,".")
from retouch import make_landmarker, apply_roi as apply, landmarks
OUT="parts2"; os.makedirs(OUT,exist_ok=True)
files=sorted(glob.glob("../reels/parts/p*.mkv"))
K,NW=int(sys.argv[1]),int(sys.argv[2]); files=files[K::NW]
cv2.setNumThreads(1)
for f in files:
    out=os.path.join(OUT,os.path.basename(f))
    if os.path.exists(out): continue
    cap=cv2.VideoCapture(f); w=int(cap.get(3)); h=int(cap.get(4)); fps=30
    lmk=make_landmarker(video=True)
    enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{w}x{h}","-r","30","-i","-","-i",f,
        "-map","0:v","-map","1:a","-c:v","libx264","-preset","fast","-crf","14","-pix_fmt","yuv420p","-c:a","copy","-shortest",out+".tmp.mkv"],stdin=subprocess.PIPE)
    ema=None; n=0; miss=0
    while True:
        ok,fr=cap.read()
        if not ok: break
        small=cv2.resize(fr,(w//2,h//2))
        r=lmk.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB,data=cv2.cvtColor(small,cv2.COLOR_BGR2RGB)),int(n*1000/fps))
        pts=landmarks(r,w,h)
        if pts is not None:
            if ema is None: ema=pts
            else:
                mv=np.linalg.norm(pts-ema,axis=1).mean()
                a=0.55 if mv<6 else 0.85   # smooth jitter, follow fast motion
                ema=ema*(1-a)+pts*a
            miss=0
        else:
            miss+=1
            if miss>3: ema=None
        o=apply(fr,ema) if ema is not None else fr
        enc.stdin.write(o.tobytes()); n+=1
    enc.stdin.close(); enc.wait(); os.rename(out+".tmp.mkv",out)
    print(os.path.basename(f),n,"frames",flush=True)
print("DONE")
