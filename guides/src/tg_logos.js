// Аватарки Telegram «Девушка на миллион»: канал (без фото / с фото) и чат. 1280×1280, круг вписан.
// node tg_logos.js <fontsDir(@fontsource)> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
fs.mkdirSync(OUT, { recursive: true });
const ff = (fam, file, w, st = 'normal') => `@font-face{font-family:${fam};font-weight:${w};font-style:${st};src:url(file://${F}/${file})}`;
const css = `
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2', 600)}
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2', 700)}
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2', 500, 'italic')}
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', 600)}
${ff('Mo', 'montserrat/files/montserrat-cyrillic-600-normal.woff2', 600)}
${ff('Mo', 'montserrat/files/montserrat-cyrillic-800-normal.woff2', 800)}
${ff('Mo', 'montserrat/files/montserrat-latin-800-normal.woff2', 800)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:1280px;overflow:hidden;position:relative}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ring{position:absolute;inset:70px;border-radius:50%;border:5px solid rgba(255,255,255,.75)}
.ring2{position:absolute;inset:92px;border-radius:50%;border:2px solid rgba(255,255,255,.45)}
`;
const diamond = (w, col = '#fff') => `<svg width="${w}" viewBox="0 0 100 80"><g fill="none" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"><path d="M20 4h60l18 22-48 50L2 26z"/><path d="M2 26h96M20 4l12 22 18 50 18-50 12-22M32 26 50 4l18 22"/></g></svg>`;
const sparkle = (x, y, s, o = 1) => `<svg style="position:absolute;left:${x}px;top:${y}px;opacity:${o}" width="${s}" viewBox="0 0 20 20"><path d="M10 0c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10z" fill="#fff"/></svg>`;

const logos = {
  // 1. Канал без фото — розовый градиент, бриллиант, название
  'Канал_логотип': `<div style="position:absolute;inset:0;background:radial-gradient(circle at 35% 25%,#ffd3e6 0%,#f58cbc 45%,#d9488f 100%)"></div>
    <div class=ring></div><div class=ring2></div>
    ${sparkle(330, 300, 46, .9)}${sparkle(905, 360, 34, .8)}${sparkle(880, 880, 40, .85)}${sparkle(350, 900, 28, .7)}
    <div class=c>
      ${diamond(190)}
      <div style="font:700 150px/1 Cg;color:#fff;letter-spacing:.02em;margin-top:36px;text-shadow:0 6px 30px rgba(140,20,70,.35)">Девушка</div>
      <div style="font:italic 500 112px/1.05 Cg;color:#fff;margin-top:6px;text-shadow:0 6px 30px rgba(140,20,70,.35)">на миллион</div>
      <div style="width:300px;height:3px;background:rgba(255,255,255,.8);margin:40px 0 26px"></div>
      <div style="font:600 34px Mo;color:#fff;letter-spacing:.35em">HEY KSUSHA</div>
    </div>`,
  // 2. Канал с фото — портрет в круге, розовая лента с названием
  'Канал_с_фото': `<img src="file://${IMG}/s_pajama.jpg" style="position:absolute;left:-300px;top:-10px;width:1700px">
    <div style="position:absolute;inset:0;background:linear-gradient(rgba(236,111,184,0) 52%,rgba(236,111,184,.55) 72%,rgba(217,72,143,.92) 100%)"></div>
    <div class=ring></div>
    <div class=c style="justify-content:flex-end;padding-bottom:205px">
      <div style="font:700 96px/1 Cg;color:#fff;text-shadow:0 4px 24px rgba(120,10,60,.45)">Девушка</div>
      <div style="font:italic 500 80px/1.05 Cg;color:#fff;text-shadow:0 4px 24px rgba(120,10,60,.45)">на миллион ${'💎'}</div>
    </div>`,
  // 3. Чат — тёмно-вишнёвый с розовым, «чат» + сердечко-бриллиант
  'Чат_логотип': `<div style="position:absolute;inset:0;background:radial-gradient(circle at 65% 30%,#7a2350 0%,#4a1030 55%,#2a0819 100%)"></div>
    <div class=ring style="border-color:rgba(245,140,188,.85)"></div><div class=ring2 style="border-color:rgba(245,140,188,.45)"></div>
    ${sparkle(320, 330, 40, .8)}${sparkle(920, 330, 30, .7)}${sparkle(900, 900, 38, .8)}
    <div class=c>
      <svg width="250" viewBox="0 0 100 90"><path d="M10 8h80a8 8 0 0 1 8 8v44a8 8 0 0 1-8 8H40L20 86V68H10a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z" fill="#f58cbc"/><path d="M50 58C38 49 30 43 30 34a9 9 0 0 1 20-4 9 9 0 0 1 20 4c0 9-8 15-20 24z" fill="#fff"/></svg>
      <div style="font:800 64px Mo;color:#f58cbc;letter-spacing:.4em;margin:34px 0 10px 18px">ЧАТ</div>
      <div style="font:700 112px/1 Cg;color:#fff">Девушки</div>
      <div style="font:italic 500 92px/1.05 Cg;color:#fff">на миллион</div>
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
