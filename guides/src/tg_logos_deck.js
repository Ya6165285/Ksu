// Аватарки Telegram в стиле презентации (тёмный фон, золото, красный, Oswald). 1280×1280.
// node tg_logos_deck.js <fontsDir(@fontsource)> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
fs.mkdirSync(OUT, { recursive: true });
const css = `
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/oswald/files/oswald-cyrillic-700-normal.woff2)}
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/oswald/files/oswald-latin-700-normal.woff2);unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:1280px;overflow:hidden;position:relative;background:#120c08}
.bg{position:absolute;inset:-60px;background:url(file://${IMG}/bgwide.jpg) center/cover;filter:blur(6px) brightness(.55)}
.dk{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(60,20,14,.2),rgba(10,6,4,.75) 75%)}
.ring{position:absolute;inset:34px;border-radius:50%;border:14px solid #e8c886;box-shadow:0 0 0 4px rgba(18,12,8,.6) inset}
.ring2{position:absolute;inset:66px;border-radius:50%;border:3px solid rgba(232,200,134,.7)}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Osw;font-weight:700;text-transform:uppercase}
`;
const logos = {
  'Канал_фото': `<img src="file://${IMG}/ava_yacht.jpg" style="position:absolute;inset:0;width:1280px;height:1280px">
    <div class=ring></div><div class=ring2></div>`,
  'Канал_без_фото': `<div class=bg></div><div class=dk></div><div class=ring></div><div class=ring2></div>
    <div class=c style="gap:0">
      <div style="font-size:190px;line-height:1;color:#f3dcae;letter-spacing:.01em">ДЕВУШКА</div>
      <div style="font-size:190px;line-height:1;color:#d91f2a;letter-spacing:.01em">НА<br>МИЛЛИОН</div>
    </div>`,
  'Чат': `<div class=bg></div><div class=dk></div><div class=ring></div><div class=ring2></div>
    <div class=c>
      <svg width="900" viewBox="0 0 120 100" style="filter:drop-shadow(0 18px 30px rgba(0,0,0,.55))">
        <defs><linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0444c"/><stop offset="1" stop-color="#a8121c"/></linearGradient></defs>
        <path d="M60 6C29 6 6 25 6 48c0 12 6 22 16 30l-6 18 22-10c7 2 14 3 22 3 31 0 54-19 54-41S91 6 60 6z" fill="url(#r)" stroke="#e8c886" stroke-width="2.4"/>
        <text x="60" y="61" text-anchor="middle" font-family="Osw" font-weight="700" font-size="36" fill="#fff" letter-spacing="1">ЧАТ</text>
      </svg>
    </div>`,
};
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const [name, body] of Object.entries(logos)) {
    const tmp = path.join(OUT, '_t.html');
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${body}</body></html>`);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, name + '.png') });
  }
  fs.unlinkSync(path.join(OUT, '_t.html'));
  await b.close(); console.log('ok');
})();
