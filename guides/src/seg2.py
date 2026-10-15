import sys, numpy as np, cv2
from ai_edge_litert.interpreter import Interpreter
src, out = sys.argv[1], sys.argv[2]
it = Interpreter(model_path='seg.tflite'); it.allocate_tensors()
i = it.get_input_details()[0]; o = it.get_output_details()[0]
img = cv2.cvtColor(cv2.imread(src), cv2.COLOR_BGR2RGB); H, W = img.shape[:2]
x = cv2.resize(img, (256, 256)).astype(np.float32) / 255.0
it.set_tensor(i['index'], x[None]); it.invoke()
y = it.get_tensor(o['index'])[0]  # 256x256x6
print(y.shape, y.min(), y.max())
e = np.exp(y - y.max(-1, keepdims=True)); p = e / e.sum(-1, keepdims=True)
fg = 1 - p[..., 0]
fg = cv2.resize(fg, (W, H), interpolation=cv2.INTER_CUBIC)
cv2.imwrite(out, np.clip(fg * 255, 0, 255).astype(np.uint8))
