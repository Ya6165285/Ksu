import cv2, numpy as np, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
MODEL="/tmp/claude-0/-home-user-Ksu/03c5ee2b-73ae-52f6-90d7-fac0ce26511e/scratchpad/face_landmarker.task"
def make_landmarker(video=False):
    o=vision.FaceLandmarkerOptions(base_options=BaseOptions(model_asset_path=MODEL),
        running_mode=vision.RunningMode.VIDEO if video else vision.RunningMode.IMAGE,num_faces=1,
        min_face_detection_confidence=0.4,min_tracking_confidence=0.4)
    return vision.FaceLandmarker.create_from_options(o)
FACE_OVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
LEFT_EYE=[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
RIGHT_EYE=[362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398]
LBROW=[70,63,105,66,107,55,65,52,53,46]; RBROW=[300,293,334,296,336,285,295,282,283,276]
LIPS=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185]
NOSTRILS=[98,327]; NOSE_TIP=4; NOSE_BRIDGE=6
JAW_L=[172,136,150,149,176]; JAW_R=[397,365,379,378,400]; CHIN=152
def poly_mask(shape,pts,idx,dil=0):
    m=np.zeros(shape[:2],np.uint8); cv2.fillPoly(m,[pts[idx].astype(np.int32)],255)
    if dil: m=cv2.dilate(m,np.ones((dil,dil),np.uint8))
    return m
def local_warp(mapx,mapy,cx,cy,dx,dy,r):
    # backward map: pixel at p samples from p - d*w  (moves content by +d)
    h,w=mapx.shape
    x0,x1=int(max(0,cx-r)),int(min(w,cx+r)); y0,y1=int(max(0,cy-r)),int(min(h,cy+r))
    if x1<=x0 or y1<=y0: return
    yy,xx=np.mgrid[y0:y1,x0:x1].astype(np.float32)
    d2=((xx-cx)**2+(yy-cy)**2)/(r*r)
    wgt=np.clip(1-d2,0,1)**2
    mapx[y0:y1,x0:x1]-=dx*wgt; mapy[y0:y1,x0:x1]-=dy*wgt
def apply(img,pts,S=1.0):
    h,w=img.shape[:2]
    fw=np.linalg.norm(pts[234]-pts[454])  # face width
    out=img.copy()
    # ---- skin smoothing ----
    face=poly_mask(img.shape,pts,FACE_OVAL)
    holes=cv2.bitwise_or(cv2.bitwise_or(poly_mask(img.shape,pts,LEFT_EYE,int(fw*0.05)),poly_mask(img.shape,pts,RIGHT_EYE,int(fw*0.05))),
          cv2.bitwise_or(cv2.bitwise_or(poly_mask(img.shape,pts,LBROW,int(fw*0.03)),poly_mask(img.shape,pts,RBROW,int(fw*0.03))),poly_mask(img.shape,pts,LIPS,int(fw*0.02))))
    skin=cv2.subtract(face,holes)
    # also neck/chest skin by color? keep face only, plus soft edge
    k=int(fw*0.08)|1
    skin=cv2.GaussianBlur(skin,(k,k),0).astype(np.float32)/255
    x,y,bw,bh=cv2.boundingRect(face); pad=int(fw*0.1)
    x0,y0,x1,y1=max(0,x-pad),max(0,y-pad),min(w,x+bw+pad),min(h,y+bh+pad)
    crop=img[y0:y1,x0:x1]
    d=max(5,int(fw*0.035))
    sm=cv2.bilateralFilter(crop,d,40,d*2)
    # keep fine texture a bit: high-pass of original
    hp=crop.astype(np.float32)-cv2.GaussianBlur(crop,(0,0),1.2).astype(np.float32)
    sm=sm.astype(np.float32)
    # even out tone: pull toward heavily blurred skin color a bit
    tone=cv2.GaussianBlur(crop,(0,0),fw*0.05).astype(np.float32)
    sm=sm*0.8+ (sm-cv2.GaussianBlur(sm,(0,0),fw*0.05)+tone)*0.2
    sm=np.clip(sm+hp*0.25,0,255)
    a=(skin[y0:y1,x0:x1]*0.9*min(S,1.2))[...,None]
    out[y0:y1,x0:x1]=np.clip(crop*(1-a)+sm*a,0,255).astype(np.uint8)
    # ---- makeup: lips tint + soft contour ----
    lm=cv2.GaussianBlur(poly_mask(img.shape,pts,LIPS),(0,0),fw*0.012).astype(np.float32)/255
    hsv=cv2.cvtColor(out,cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[...,1]=np.clip(hsv[...,1]*(1+0.12*S*lm),0,255)
    hsv[...,2]=np.clip(hsv[...,2]*(1-0.04*S*lm),0,255)
    out=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR)
    # cheek contour: darken under cheekbones slightly
    cont=np.zeros((h,w),np.float32)
    for a_,b_ in [(123,147),(352,376)]:
        c=(pts[a_]*0.5+pts[b_]*0.5).astype(int)
        cv2.ellipse(cont,tuple(c),(int(fw*0.10),int(fw*0.035)),-25 if a_==123 else 25,0,360,1,-1)
    cont=cv2.GaussianBlur(cont,(0,0),fw*0.04)*skin
    out=np.clip(out.astype(np.float32)*(1-0.10*S*cont[...,None]),0,255).astype(np.uint8)
    # ---- geometry: nose slim + jaw sharpen ----
    mapx,mapy=np.meshgrid(np.arange(w,dtype=np.float32),np.arange(h,dtype=np.float32))
    nc=pts[NOSE_TIP]
    for i in NOSTRILS:
        p=pts[i]; v=(nc-p); v[1]=0
        local_warp(mapx,mapy,p[0],p[1],v[0]*0.22*S,0,fw*0.14)
    for i in [129,358,48,278]:   # nose wings / sides
        p=pts[i]; v=(nc-p); v[1]=0
        local_warp(mapx,mapy,p[0],p[1],v[0]*0.12*S,0,fw*0.12)
    tip=pts[NOSE_TIP]; local_warp(mapx,mapy,tip[0],tip[1],0,-fw*0.018*S,fw*0.07)
    center=(pts[234]+pts[454])/2
    cx=pts[NOSE_BRIDGE][0]
    # V-shape: cheeks + jaw inward (horizontal), chin a bit narrower
    for idx,k in [(93,0.020),(323,0.020),(132,0.035),(361,0.035),(58,0.045),(288,0.045),(172,0.050),(397,0.050),(136,0.045),(365,0.045),(150,0.035),(379,0.035),(149,0.022),(378,0.022)]:
        p=pts[idx]; dx=np.sign(cx-p[0])*fw*k*S
        local_warp(mapx,mapy,p[0],p[1],dx,-abs(dx)*0.15,fw*0.17)
    # eyes slightly bigger
    for eye in (LEFT_EYE,RIGHT_EYE):
        ec=pts[eye].mean(0); r=fw*0.09
        x0,x1=int(ec[0]-r),int(ec[0]+r); y0,y1=int(ec[1]-r),int(ec[1]+r)
        yy,xx=np.mgrid[y0:y1,x0:x1].astype(np.float32)
        d=np.sqrt((xx-ec[0])**2+(yy-ec[1])**2)/r
        f=0.07*S*np.clip(1-d,0,1)**2
        mapx[y0:y1,x0:x1]-=(xx-ec[0])*f; mapy[y0:y1,x0:x1]-=(yy-ec[1])*f
    # lips slightly fuller
    lc=pts[LIPS].mean(0); r=fw*0.16
    x0,x1=int(lc[0]-r),int(lc[0]+r); y0,y1=int(lc[1]-r),int(lc[1]+r)
    yy,xx=np.mgrid[y0:y1,x0:x1].astype(np.float32)
    d=np.sqrt((xx-lc[0])**2+((yy-lc[1])*1.6)**2)/r
    f=0.05*S*np.clip(1-d,0,1)**2
    mapy[y0:y1,x0:x1]-=(yy-lc[1])*f
    out=cv2.remap(out,mapx,mapy,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
    glow=cv2.GaussianBlur(face.astype(np.float32)/255,(0,0),fw*0.15)[...,None]
    out=np.clip(out.astype(np.float32)*(1+0.06*S*glow)+np.array([0,2,5],np.float32)*S*glow,0,255).astype(np.uint8)
    return out
def landmarks(res,w,h):
    if not res.face_landmarks: return None
    return np.array([[p.x*w,p.y*h] for p in res.face_landmarks[0]],np.float32)
if __name__=="__main__":
    import sys
    img=cv2.imread(sys.argv[1]); h,w=img.shape[:2]
    lmk=make_landmarker()
    r=lmk.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)))
    pts=landmarks(r,w,h); print("face",pts is not None)
    out=apply(img,pts)
    cv2.imwrite(sys.argv[2],out)

def apply_roi(img,pts,S=1.0):
    h,w=img.shape[:2]
    fw=np.linalg.norm(pts[234]-pts[454]); m=fw*0.55
    x0=int(max(0,pts[:,0].min()-m)); x1=int(min(w,pts[:,0].max()+m))
    y0=int(max(0,pts[:,1].min()-m)); y1=int(min(h,pts[:,1].max()+m))
    if x1-x0<50 or y1-y0<50: return img
    out=img.copy()
    out[y0:y1,x0:x1]=apply(np.ascontiguousarray(img[y0:y1,x0:x1]),pts-np.array([x0,y0],np.float32),S)
    return out
