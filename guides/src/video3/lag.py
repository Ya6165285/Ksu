import numpy as np,wave,json
def rd(f):
  w=wave.open(f);return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)
m=rd('main_part.wav');i=rd('ipad.wav')
def env(x):
  n=len(x)//80;return np.abs(x[:n*80]).reshape(n,80).mean(1)  # 200Hz
em,ei=env(m),env(i);R=200
T=int(len(em)/R-480);out=[]
for k in range(0,T*2):
  t=k/2; base=int((t+476.12+4.8e-5*(t-100))*R); a=ei[int((t-1)*R):int((t+2)*R)]
  if len(a)<3*R or a.std()<1:out.append((t,None,0));continue
  a=(a-a.mean())/a.std();best=(-9,0)
  for lag in range(-40,160,2):
    s=base-R+lag;b=em[s:s+len(a)]
    if len(b)<len(a):continue
    c=np.dot(a,b-b.mean())/(b.std()+1e-9)/len(a)
    if c>best[0]:best=(c,lag)
  out.append((t,best[1]/R,round(float(best[0]),3)))
json.dump(out,open('lag.json','w'))
