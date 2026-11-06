// Люкс-аватарки Telegram «Девушка на миллион»: чёрный бархат + золотая фольга, Didone-шрифты. 1280×1280.
// node tg_logos_lux.js <fontsDir(@fontsource)> <texturesDir(foil.jpg, velvet.jpg, bw.jpg)> <outDir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [F, T, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const ff = (fam, file, w, st = 'normal') => `@font-face{font-family:${fam};font-weight:${w};font-style:${st};src:url(file://${F}/${file})}`;
const css = `
${ff('Bod', 'bodoni-moda/files/bodoni-moda-latin-400-normal.woff2', 400)}
${ff('Bod', 'bodoni-moda/files/bodoni-moda-latin-400-italic.woff2', 400, 'italic')}
${ff('Pf', 'playfair-display/files/playfair-display-cyrillic-400-normal.woff2', 400)}
${ff('Pf', 'playfair-display/files/playfair-display-cyrillic-500-normal.woff2', 500)}
${ff('Pf', 'playfair-display/files/playfair-display-cyrillic-400-italic.woff2', 400, 'italic')}
${ff('Pf', 'playfair-display/files/playfair-display-latin-400-normal.woff2', 400)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:1280px;overflow:hidden;position:relative;background:#0b0908}
.bg{position:absolute;inset:0;background:url(file://${T}/velvet.jpg)}
.foil{background:url(file://${T}/foil.jpg) center/cover;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 2px rgba(0,0,0,.6)) drop-shadow(0 0 1px rgba(255,230,170,.3))}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.r1{position:absolute;inset:78px;border-radius:50%;border:6px solid transparent;background:url(file://${T}/foil.jpg) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0)}
.r2{position:absolute;inset:100px;border-radius:50%;border:2px solid transparent;background:url(file://${T}/foil.jpg) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0)}
.line{height:3px;background:url(file://${T}/foil.jpg) center/cover}
`;
const foilDefs = `<defs><pattern id="fo" patternUnits="userSpaceOnUse" width="1280" height="1280"><image href="file://${T}/foil.jpg" width="1280" height="1280"/></pattern></defs>`;
const logos = {
  // 1 — монограмма M
  'Канал_монограмма': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c>
      <div class=foil style="font:400 640px/0.8 Bod;margin-top:40px">M</div>
      <div class=line style="width:300px;margin:70px 0 34px"></div>
      <div class=foil style="font:500 44px Pf;letter-spacing:.32em;margin-left:.32em">ДЕВУШКА НА МИЛЛИОН</div>
    </div>`,
  // 2 — надпись как этикетка
  'Канал_надпись': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c>
      <div class=foil style="font:400 170px/1 Pf;letter-spacing:.04em">Девушка</div>
      <div class=foil style="font:italic 400 150px/1.1 Pf">на миллион</div>
      <div class=line style="width:260px;margin:46px 0 0"></div>
    </div>`,
  // 3 — фото ч/б + золото
  'Канал_фото': `<img src="file://${T}/bw.jpg" style="position:absolute;inset:0;width:1280px;height:1280px">
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,rgba(0,0,0,0) 50%,rgba(0,0,0,.55) 100%)"></div>
    <div class=r1></div><div class=r2></div>`,
  // 4 — чат: тонкий золотой «пузырь» + ЧАТ
  'Чат': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c>
      <svg width="900" height="800" viewBox="0 0 1280 1138" style="filter:drop-shadow(0 4px 3px rgba(0,0,0,.6))">${foilDefs}
        <path d="M640 150C365 150 160 320 160 530c0 108 54 206 142 274l-52 170 196-90c62 18 126 27 194 27 275 0 480-170 480-381S915 150 640 150z" fill="none" stroke="url(#fo)" stroke-width="20"/>
        <text x="640" y="610" text-anchor="middle" font-family="Pf" font-weight="500" font-size="250" letter-spacing="30" fill="url(#fo)">ЧАТ</text>
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
