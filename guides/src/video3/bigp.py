import subprocess,numpy as np,json
w,h=180,300
p=subprocess.Popen(['ffmpeg','-v','error','-i','ipad.mp4','-vf','fps=2,crop=180:300:520:450,format=hsv' if False else 'fps=2,crop=180:300:520:450','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
o=[];i=0
while True:
  b=p.stdout.read(w*h*3)
  if len(b)<w*h*3:break
  a=np.frombuffer(b,np.uint8).reshape(h,w,3).astype(np.int16)
  mx=a.max(2);mn=a.min(2);sat=(mx-mn).mean();br=mx.mean()
  # top band (wall) brightness, dark-row fraction
  o.append((i/2,round(float(br),1),round(float(sat),1)));i+=1
json.dump(o,open('bigp.json','w'));print(len(o))
