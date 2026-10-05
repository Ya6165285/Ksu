import numpy as np, subprocess
W,H,fps=540,960,30; n=int(0.7*fps)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(fps),"-i","-",
  "-vf","scale=1080:1920,gblur=sigma=30","-c:v","libx264","-crf","16","-pix_fmt","yuv420p","leak.mp4"],stdin=subprocess.PIPE)
for i in range(n):
    t=i/(n-1); a=np.sin(np.pi*t)**1.5
    cx=W*(0.15+0.7*t); cy=H*(0.35+0.2*np.sin(t*3))
    d=np.sqrt(((xx-cx)/(W*0.55))**2+((yy-cy)/(H*0.45))**2)
    blob=np.exp(-d*d*2.2)
    cx2=W*(0.9-0.5*t); cy2=H*0.75
    blob2=np.exp(-(((xx-cx2)/(W*0.4))**2+((yy-cy2)/(H*0.3))**2)*2)
    col1=np.array([255,190,120]); col2=np.array([255,170,210])
    img=(blob[...,None]*col1+blob2[...,None]*col2*0.8)*a*0.8
    flash=np.clip((a-0.55)/0.45,0,1)**2*0.45
    img=img+flash*np.array([255,240,225])
    p.stdin.write(np.clip(img,0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait(); print("ok")
