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
  // 3b — цветное фото + золотая надпись снизу
  'Канал_фото_надпись': `<img src="file://${T}/color.jpg" style="position:absolute;inset:0;width:1280px;height:1280px">
    <div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 48%,rgba(8,6,5,.6) 64%,rgba(8,6,5,.92) 82%)"></div>
    <div class=r1></div><div class=r2></div>
    <div class=c style="justify-content:flex-end;padding-bottom:175px">
      <div class=foil style="font:500 150px/1 Pf;letter-spacing:.02em;filter:drop-shadow(0 4px 4px rgba(0,0,0,.8)) drop-shadow(0 0 18px rgba(255,215,140,.35))">Девушка</div>
      <div class=foil style="font:italic 400 132px/1.08 Pf;filter:drop-shadow(0 4px 4px rgba(0,0,0,.8)) drop-shadow(0 0 18px rgba(255,215,140,.35))">на миллион</div>
    </div>`,
  // 5 — чат: эмодзи-сообщение с сердечком
  'Чат_сердечко': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c><svg width="820" viewBox="0 0 1280 1138" style="filter:drop-shadow(0 14px 18px rgba(0,0,0,.7))">${foilDefs}
        <defs><radialGradient id="hl" cx=".35" cy=".25" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3162a"/><stop offset="1" stop-color="#5c0614"/></linearGradient></defs>
        <path d="M640 150C365 150 160 320 160 530c0 108 54 206 142 274l-52 170 196-90c62 18 126 27 194 27 275 0 480-170 480-381S915 150 640 150z" fill="url(#fo)"/>
        <path d="M640 150C365 150 160 320 160 530c0 108 54 206 142 274l-52 170 196-90c62 18 126 27 194 27 275 0 480-170 480-381S915 150 640 150z" fill="url(#hl)"/>
        <g transform="translate(640 540) scale(.8) translate(-640 -560)"><path d="M640 760C480 650 380 570 380 455a120 120 0 0 1 260-60 120 120 0 0 1 260 60c0 115-100 195-260 305z" fill="url(#hr)" stroke="#2a0208" stroke-width="6"/>
        <ellipse cx="520" cy="430" rx="50" ry="26" fill="#fff" opacity=".35" transform="rotate(-30 520 430)"/></g>
      </svg></div>`,
  // 6 — то же + ЧАТ
  'Чат_сердечко_надпись': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c style="margin-top:-30px"><svg width="620" viewBox="0 0 1280 1138" style="filter:drop-shadow(0 14px 18px rgba(0,0,0,.7))">${foilDefs}
        <defs><radialGradient id="hl" cx=".35" cy=".25" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3162a"/><stop offset="1" stop-color="#5c0614"/></linearGradient></defs>
        <path d="M640 150C365 150 160 320 160 530c0 108 54 206 142 274l-52 170 196-90c62 18 126 27 194 27 275 0 480-170 480-381S915 150 640 150z" fill="url(#fo)"/>
        <path d="M640 150C365 150 160 320 160 530c0 108 54 206 142 274l-52 170 196-90c62 18 126 27 194 27 275 0 480-170 480-381S915 150 640 150z" fill="url(#hl)"/>
        <g transform="translate(640 540) scale(.8) translate(-640 -560)"><path d="M640 760C480 650 380 570 380 455a120 120 0 0 1 260-60 120 120 0 0 1 260 60c0 115-100 195-260 305z" fill="url(#hr)" stroke="#2a0208" stroke-width="6"/>
        <ellipse cx="520" cy="430" rx="50" ry="26" fill="#fff" opacity=".35" transform="rotate(-30 520 430)"/></g>
      </svg>
      <div class=foil style="font:500 130px/1 Pf;letter-spacing:.25em;margin:10px 0 0 .25em">ЧАТ</div></div>`,
  // 7 — чат: красная эмаль в золотой оправе, сердце — чёрная эмаль с золотым кантом
  'Чат_красный': `<div class=bg></div><div class=r1></div><div class=r2></div>
    <div class=c style="margin-top:-10px">
      <svg width="600" viewBox="0 0 240 200" style="filter:drop-shadow(0 18px 22px rgba(0,0,0,.8))">${foilDefs}
        <defs>
          <linearGradient id="en" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#a3121f"/><stop offset=".55" stop-color="#7a0a15"/><stop offset="1" stop-color="#4a050c"/></linearGradient>
          <radialGradient id="sp" cx=".3" cy=".15" r=".55"><stop offset="0" stop-color="#ffd9d9" stop-opacity=".45"/><stop offset="1" stop-color="#ffd9d9" stop-opacity="0"/></radialGradient>
          <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2422"/><stop offset="1" stop-color="#050404"/></linearGradient>
          <pattern id="fs" patternUnits="userSpaceOnUse" width="240" height="200"><image href="file://${T}/foil.jpg" width="240" height="240" preserveAspectRatio="xMidYMid slice"/></pattern>
        </defs>
        <path id="bub" d="M32 10h176a22 22 0 0 1 22 22v86a22 22 0 0 1-22 22H98l-44 40v-40H32a22 22 0 0 1-22-22V32a22 22 0 0 1 22-22z" fill="url(#en)" stroke="url(#fs)" stroke-width="5" stroke-linejoin="round"/>
        <path d="M32 18h176a14 14 0 0 1 14 14v86a14 14 0 0 1-14 14H95l-33 30v-30H32a14 14 0 0 1-14-14V32a14 14 0 0 1 14-14z" fill="none" stroke="url(#fs)" stroke-width="1" opacity=".7"/>
        <path d="M32 10h176a22 22 0 0 1 22 22v86a22 22 0 0 1-22 22H98l-44 40v-40H32a22 22 0 0 1-22-22V32a22 22 0 0 1 22-22z" fill="url(#sp)"/>
        <path d="M120 124C94 106 80 93 80 75a20 20 0 0 1 40-7 20 20 0 0 1 40 7c0 18-14 31-40 49z" fill="url(#hb)" stroke="url(#fs)" stroke-width="3" stroke-linejoin="round"/>
        <path d="M97 66c4-6 11-8 16-5" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>
      </svg>
      <div class=foil style="font:500 120px/1 Pf;letter-spacing:.3em;margin:46px 0 0 .3em">ЧАТ</div>
    </div>`,
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
