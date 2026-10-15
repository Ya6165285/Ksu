import numpy as np, cv2
img = cv2.imread('img/pajama.jpg'); H, W = img.shape[:2]
m = cv2.imread('mask.png', 0).astype(np.float32) / 255
gc = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
gc[m > 0.35] = cv2.GC_PR_FGD
gc[m > 0.85] = cv2.GC_FGD
# bed: polygon of quilt as probable fg
bed = np.array([[0, 880], [120, 850], [260, 845], [480, 815], [560, 830], [640, 900], [720, 1010], [720, 1280], [0, 1280]], np.int32)
bm = np.zeros((H, W), np.uint8); cv2.fillPoly(bm, [bed], 1)
gc[(bm == 1) & (gc == cv2.GC_PR_BGD)] = cv2.GC_PR_FGD
gc[1100:, :][bm[1100:, :] == 1] = cv2.GC_FGD
gc[:380, :] = cv2.GC_BGD
bgd = np.zeros((1, 65)); fgd = np.zeros((1, 65))
cv2.grabCut(img, gc, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
a = np.where((gc == 1) | (gc == 3), 1.0, 0.0).astype(np.float32)
a = cv2.morphologyEx(a, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
# keep largest component
n, lab, st, _ = cv2.connectedComponentsWithStats((a > .5).astype(np.uint8))
k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); a = (lab == k).astype(np.float32)
a = cv2.GaussianBlur(a, (7, 7), 0)
rgba = np.dstack([img, (a * 255).astype(np.uint8)])
cv2.imwrite('img/pajama_cut.png', rgba)
prev = img.copy(); prev[a < .5] = (prev[a < .5] * 0.2 + np.array([180, 60, 240]) * 0.8).astype(np.uint8)
cv2.imwrite('cut_prev.jpg', prev)
# remove dark glass-frame strip near the raised hand
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
reg = np.zeros((H, W), bool); reg[380:520, 100:145] = True
a[reg & (g < 70)] = 0
a = cv2.GaussianBlur(a, (3, 3), 0)
cv2.imwrite('img/pajama_cut.png', np.dstack([img, (a * 255).astype(np.uint8)]))
# drop the flower basket behind her (keeps person via ML mask)
reg = np.zeros((H, W), bool); reg[650:805, 400:570] = True
a[reg & (m < 0.55)] = 0
a = cv2.GaussianBlur(a, (3, 3), 0)
cv2.imwrite('img/pajama_cut.png', np.dstack([img, (a * 255).astype(np.uint8)]))
