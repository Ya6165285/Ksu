# Рилс 1 — монтаж

Исходник: «Материал .mov» (Google Диск, папка «Рилс 1»), стиль — «Эталон.mp4».

1. `transcribe.py` — распознавание речи (GigaAM v2, sherpa-onnx) с таймингом слов → `words.json`.
2. `build.py` — вырезает паузы, повторы и дубли (`DROP`), собирает список кусков и субтитры `subs.ass`
   (по одному слову, Montserrat ExtraBold белый; акценты — Montserrat Black Italic #F2BADC и Marck Script).
3. Рендер: каждый кусок режется отдельно ffmpeg, затем concat + `ass=subs.ass` + loudnorm (−14 LUFS).
