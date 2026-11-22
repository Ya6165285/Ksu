import sys, subprocess, json, numpy as np, cv2
src, out, model, dur = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
W, H = 640, 360
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-t', dur, '-i', src, '-vf', f'fps=1,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
fd = cv2.FaceDetectorYN.create(model, '', (W, H), 0.6)
res = []; i = 0
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    f = np.frombuffer(b, np.uint8).reshape(H, W, 3); _, faces = fd.detect(f)
    if faces is not None and len(faces):
        x, y, w, h = max(faces, key=lambda r: r[2] * r[3])[:4]
        res.append([i + .5, round(float(x + w / 2) / W, 3), round(float(y + h / 2) / H, 3), round(float(w) / W, 3)])
    else: res.append([i + .5, None, None, None])
    i += 1
json.dump(res, open(out, 'w')); print(len(res), sum(1 for r in res if r[1]))
