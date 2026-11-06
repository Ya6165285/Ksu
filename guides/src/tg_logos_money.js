// Аватарки Telegram «Девушка на миллион» в стиле old money / банкнота: бордо + глянцевое золото. 1280×1280.
// node tg_logos_money.js <fontsDir(@fontsource)> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
fs.mkdirSync(OUT, { recursive: true });
const ff = (fam, file, w, st = 'normal') => `@font-face{font-family:${fam};font-weight:${w};font-style:${st};src:url(file://${F}/${file})}`;
const GOLD = 'linear-gradient(160deg,#7a5a1e 0%,#f6e3a1 22%,#c8963a 40%,#fff6cf 55%,#b0802e 72%,#f2d68a 88%,#7a5a1e 100%)';
const css = `
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2', 700)}
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2', 700)}
${ff('Cg', 'cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2', 500, 'italic')}
${ff('Mo', 'montserrat/files/montserrat-cyrillic-700-normal.woff2', 700)}
${ff('Mo', 'montserrat/files/montserrat-latin-700-normal.woff2', 700)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:1280px;overflow:hidden;position:relative;background:#3a0712}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#8c1a32 0%,#5e0d20 48%,#330510 100%)}
.gold{background:${GOLD};-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 6px rgba(0,0,0,.45))}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
`;
// гильош — тонкие золотые эллипсы вокруг центра, как на купюре
const guilloche = (r1, r2, n, op) => {
  let e = '';
  for (let i = 0; i < n; i++) e += `<ellipse cx="640" cy="640" rx="${r1}" ry="${r2}" transform="rotate(${(180 / n) * i} 640 640)"/>`;
  return `<svg style="position:absolute;inset:0" width="1280" height="1280"><g fill="none" stroke="#e8c886" stroke-width="1.3" opacity="${op}">${e}</g></svg>`;
};
// золотая рамка-кольцо с текстом по кругу
const ring = (top, bottom) => `<svg style="position:absolute;inset:0" width="1280" height="1280">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5a1e"/><stop offset=".25" stop-color="#f6e3a1"/><stop offset=".45" stop-color="#c8963a"/><stop offset=".6" stop-color="#fff6cf"/><stop offset=".8" stop-color="#b0802e"/><stop offset="1" stop-color="#f2d68a"/></linearGradient>
  <path id="tp" d="M640,640 m-455,0 a455,455 0 1,1 910,0"/><path id="bp" d="M640,640 m-497,0 a497,497 0 0,0 994,0"/></defs>
  <circle cx="640" cy="640" r="545" fill="none" stroke="url(#g)" stroke-width="16"/>
  <circle cx="640" cy="640" r="520" fill="none" stroke="url(#g)" stroke-width="3"/>
  <circle cx="640" cy="640" r="395" fill="none" stroke="url(#g)" stroke-width="3"/>
  <circle cx="640" cy="640" r="380" fill="none" stroke="url(#g)" stroke-width="10"/>
  <text font-family="Cg" font-weight="700" font-size="74" letter-spacing="10" fill="url(#g)"><textPath href="#tp" startOffset="50%" text-anchor="middle">${top}</textPath></text>
  <text font-family="Mo" font-weight="700" font-size="40" letter-spacing="14" fill="url(#g)"><textPath href="#bp" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>
</svg>`;

const logos = {
  // 1. Канал с портретом
  'Канал_оldmoney_фото': `<div class=bg></div>${guilloche(560, 230, 36, .16)}
    <div style="position:absolute;left:265px;top:265px;width:750px;height:750px;border-radius:50%;overflow:hidden">
      <img src="file://${IMG}/marina.jpg" style="position:absolute;left:-40px;top:-30px;width:830px;filter:sepia(.18) saturate(.95) contrast(1.05)">
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,rgba(0,0,0,0) 55%,rgba(60,6,18,.55) 100%)"></div>
    </div>
    ${ring('ДЕВУШКА НА МИЛЛИОН', '★ HEY KSUSHA ★')}`,
  // 2. Канал без фото — глянцевый золотой $
  'Канал_оldmoney_без_фото': `<div class=bg></div>${guilloche(560, 230, 48, .2)}${guilloche(330, 150, 30, .14)}
    ${ring('ДЕВУШКА НА МИЛЛИОН', '★ HEY KSUSHA ★')}
    <div class=c><div class=gold style="font:700 560px/0.9 Cg;margin-top:-30px">$</div>
      <div class=gold style="font:700 86px/1 Cg;letter-spacing:.06em;margin-top:-10px">1 000 000</div></div>`,
  // 3. Чат — тот же стиль, в центре «ЧАТ»
  'Чат_оldmoney': `<div class=bg style="background:radial-gradient(circle at 50% 42%,#6e1428 0%,#4a0a1a 50%,#26040c 100%)"></div>${guilloche(560, 230, 48, .18)}
    ${ring('ДЕВУШКИ НА МИЛЛИОН', '★ ЗАКРЫТЫЙ ЧАТ ★')}
    <div class=c><svg width="330" viewBox="0 0 120 100" style="filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))">
        <defs><linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5a1e"/><stop offset=".25" stop-color="#f6e3a1"/><stop offset=".45" stop-color="#c8963a"/><stop offset=".6" stop-color="#fff6cf"/><stop offset=".8" stop-color="#b0802e"/><stop offset="1" stop-color="#f2d68a"/></linearGradient></defs>
        <path d="M60 6C29 6 6 25 6 48c0 12 6 22 16 30l-6 18 22-10c7 2 14 3 22 3 31 0 54-19 54-41S91 6 60 6z" fill="url(#gb)"/>
        <ellipse cx="44" cy="24" rx="20" ry="7" fill="#fff" opacity=".35" transform="rotate(-18 44 24)"/>
        <circle cx="38" cy="48" r="7" fill="#5e0d20"/><circle cx="60" cy="48" r="7" fill="#5e0d20"/><circle cx="82" cy="48" r="7" fill="#5e0d20"/></svg>
      <div class=gold style="font:700 130px/1 Cg;letter-spacing:.12em;margin:26px 0 0 16px">ЧАТ</div></div>`,
};

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const [name, body] of Object.entries(logos)) {
    const tmp = path.join(OUT, '_t.html');
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${body}</body></html>`);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, name.replace('оldmoney', 'oldmoney') + '.png') });
  }
  fs.unlinkSync(path.join(OUT, '_t.html'));
  await b.close(); console.log('ok');
})();
