// Фоны для монтажа эфира 3: S<n> — слайд справа; O<n> — Оля крупно + слайд поменьше. node vid3_canvas.js <fontsDir> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const base = require('./diamond_css'); const IMG = base.IMG;
const SL = path.resolve(__dirname, '../../launch/Слайды_Из_алмаза_в_бриллиант');
const L = { SW: 1100, SH: 619, SX: 800, SY: 230, OX: 840, OY: 150, OW: 420, OH: 730, TW: 600, TH: 338, TX: 1300, TY: 346 };
const css = base(F) + `*{box-sizing:border-box}body{margin:0;width:1920px;height:1080px;position:relative;overflow:hidden}
.fr{position:absolute;border-radius:26px;border:4px solid #e8c886;box-shadow:0 0 0 1px rgba(255,240,210,.25),0 18px 50px rgba(0,0,0,.65),0 0 60px rgba(236,201,150,.18);overflow:hidden;background:#0d0805}
.fr img{width:100%;height:100%;display:block}
.silk{height:170px;opacity:.5}`;
const page = (n, mode) => {
  const s = `${SL}/Слайд_${String(n).padStart(2, '0')}.jpg`;
  const body = mode === 'S'
    ? `<div class="fr" style="left:${L.SX - 4}px;top:${L.SY - 4}px;width:${L.SW + 8}px;height:${L.SH + 8}px"><img src="file://${s}"></div>`
    : `<div class="fr" style="left:${L.OX - 4}px;top:${L.OY - 4}px;width:${L.OW + 8}px;height:${L.OH + 8}px"></div>
       <div style="position:absolute;left:${L.OX - 40}px;width:${L.OW + 80}px;top:${L.OY + L.OH + 22}px;text-align:center">
         <div class="serif g-txt" style="font-size:46px;line-height:1">Ольга Новикова</div>
         <div class="caps" style="font-size:17px;margin-top:8px;letter-spacing:.3em;opacity:.85">психолог · магистр Оксфорда</div></div>
       <div class="fr" style="left:${L.TX - 4}px;top:${L.TY - 4}px;width:${L.TW + 8}px;height:${L.TH + 8}px"><img src="file://${s}"></div>`;
  return `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body class="dbg"><div class="silk"></div>${body}</body></html>`;
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const n = fs.readdirSync(SL).filter(f => /^Слайд_\d+\.jpg$/.test(f)).length;
  const jobs = [['B', 0]]; for (let i = 1; i <= n; i++) jobs.push(['S', i], ['O', i]);
  for (const [m, i] of jobs) {
    const tmp = path.join(OUT, '_t.html');
    fs.writeFileSync(tmp, m === 'B' ? `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body class="dbg"><div class="silk"></div></body></html>` : page(i, m));
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, m === 'B' ? 'bg.png' : `${m}${String(i).padStart(2, '0')}.png`) });
  }
  fs.unlinkSync(path.join(OUT, '_t.html')); fs.writeFileSync(path.join(OUT, 'layout.json'), JSON.stringify(L)); await b.close();
})();
