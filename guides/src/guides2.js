// Гайды к эфиру 2: тёмный «люкс»-стиль, как обложки бота. node guides2.js <fontsDir> <outDir>
const { marked } = require(process.env.MARKED || 'marked');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
const SRC = fs.readFileSync(path.resolve(__dirname, '../../launch/Гайды_эфир_2.md'), 'utf8');
const W = 1240, H = 1754;
const ff = (fam, file, extra = '') => `@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
const css = `
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2', 'font-weight:600;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', 'font-weight:600;unicode-range:U+0000-00FF;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('CormI', 'cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2', 'font-style:italic;font-weight:500;')}
${ff('Cav', 'caveat/files/caveat-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-400-normal.woff2', 'font-weight:400;')}
${ff('Mont', 'montserrat/files/montserrat-latin-400-normal.woff2', 'font-weight:400;unicode-range:U+0000-00FF,U+2000-206F;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-600-normal.woff2', 'font-weight:600;')}
${ff('Mont', 'montserrat/files/montserrat-latin-600-normal.woff2', 'font-weight:600;unicode-range:U+0000-00FF,U+2000-206F;')}
@page{size:${W}px ${H}px;margin:0}
*{box-sizing:border-box}
.fixbg{position:fixed;left:0;top:0;width:${W}px;height:${H}px;background:#140e0a;z-index:-1}
table.flow{border-collapse:collapse;width:100%}table.flow td{padding:0 120px}
.cover{position:relative;z-index:1}
html{background:#140e0a}
body{margin:0;color:#efe3cf;font-family:Mont,sans-serif;font-size:25px;line-height:1.6}
.cover{position:relative;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always;background:#140e0a}
.cover .bg{position:absolute;inset:0;background:url(file://${IMG}/bgblur.jpg) center/cover;filter:brightness(.5)}
.cover .ph{position:relative;flex:1;min-height:0;width:960px;margin-top:10px;border-radius:30px;overflow:hidden;border:4px solid rgba(217,183,126,.75);box-shadow:0 30px 80px rgba(0,0,0,.6);transform:rotate(-1deg)}
.cover .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 0}
.tag{display:inline-block;border:2px solid #d9b77e;border-radius:50px;padding:10px 34px;font-family:Corm;font-weight:600;font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:#f3e6d0}
.gold{text-wrap:balance;font-family:Corm;font-weight:700;text-transform:uppercase;line-height:.95;color:#f1d9ae;text-shadow:0 4px 20px rgba(0,0,0,.5)}
.red{font-family:Cav;font-weight:700;color:#e0242b;line-height:1}
.abs{position:absolute}
.pill{display:inline-block;border-radius:60px;padding:18px 46px;font-family:Corm;font-weight:700;font-size:36px;letter-spacing:.06em;text-transform:uppercase;color:#1a0f08;background:linear-gradient(180deg,#fff0d4,#d9b77e)}
h2{font-family:Corm;font-weight:700;font-size:56px;line-height:1.05;text-transform:uppercase;margin:60px 0 20px;padding-bottom:14px;border-bottom:2px solid rgba(217,183,126,.5);color:#f1d9ae;page-break-after:avoid}
h3{font-family:Corm;font-weight:700;font-size:38px;color:#f1d9ae;margin:40px 0 10px;page-break-after:avoid}
p{margin:0 0 18px}
strong{color:#f6dcae;font-weight:600}
em{font-family:CormI;font-style:italic;font-size:1.15em;color:#d9c4a4}
ul,ol{padding-left:34px;margin:0 0 20px}li{margin:6px 0}
blockquote{margin:16px 0;padding:22px 30px;border-left:5px solid #e0242b;background:rgba(255,255,255,.05);border-radius:0 16px 16px 0}
blockquote p{margin:0}
hr{border:0;height:0;margin:30px 0}
.q{background:rgba(255,255,255,.04);border:1.5px solid rgba(217,183,126,.35);border-radius:22px;padding:26px 32px 12px;margin:0 0 26px;page-break-inside:avoid}
.q>p:first-child strong{font-family:Corm;font-weight:700;font-size:38px;line-height:1.15;color:#f6dcae}
.pic{margin:24px 0 30px;page-break-inside:avoid;text-align:center}
.pic img{max-width:78%;max-height:720px;border-radius:24px;border:3px solid rgba(217,183,126,.6);box-shadow:0 20px 60px rgba(0,0,0,.5)}
.final{font-family:Cav;font-weight:700;font-size:58px;color:#e0242b;text-align:center;margin:40px 0;line-height:1.1}
`;
// split into guides
const parts = SRC.split(/\n# ГАЙД \d\. /).slice(1);
const META = [
  { photo: 'n_marble.jpg', pos: '50% 18%', red: '20 вопросов, которые покажут, твой ли это мужчина', pics: { 'БЛОК 2.': 'p_man.jpg' } },
  { photo: 'n_selfie.jpg', pos: '50% 30%', red: 'готовые сообщения, чтобы он сам захотел тебя радовать ♡', pics: { 'Готовые сообщения': 'n_gifts.jpg', 'Когда он сделал': 'n_balloons.jpg', 'Синдром': 'p_bags.jpg' } },
  { photo: 'n_yacht.jpg', pos: '50% 35%', red: '15 сигналов, что ты соглашаешься на меньшее', pics: { '15 сигналов': 'n_roses.jpg' } },
];
function body(md, meta) {
  md = md.replace(/^.*\n### .*\n/, ''); // drop title + subtitle lines (on cover)
  // dark-theme CTA
  md = md.replace(/background:#fff5fa/g, 'background:rgba(240,71,154,.08)').replace(/file:\/\/\/home\/user\/Ksu\/launch\/img\//g, `file://${IMG}/`).replace(/color:#9a6a80/g, 'color:#d9b77e');
  let html = marked.parse(md, { breaks: true });
  html = html.replace(/font-size:([\d.]+)px/g, (m, v) => `font-size:${Math.round(v * 1.6)}px`).replace(/width:170px/g, 'width:260px');
  // wrap numbered questions/signals into cards: <p><strong>N. ...</strong> ... until next such p or heading
  html = html.replace(/(<p><strong>\d+\.[\s\S]*?)(?=<p><strong>\d+\.|<h2|<h3|<hr|<div|$)/g, '<div class="q">$1</div>');
  for (const [k, img] of Object.entries(meta.pics)) {
    html = html.replace(new RegExp(`(<h2[^>]*>[^<]*${k.replace('.', '\\.')}[^<]*</h2>)`), `<div class="pic"><img src="file://${IMG}/${img}"></div>$1`);
  }
  html = html.replace(/<p><strong>(Ты достойна мужчину[^<]*|Просить — не стыдно[^<]*|Ты не обязана заслуживать любовь[^<]*)<\/strong><\/p>/g, '<div class="final">$1</div>');
  return html;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [i, part] of parts.entries()) {
    const title = part.split('\n')[0].trim();
    const sub = (part.match(/\n### (.*)\n/) || [, ''])[1];
    const m = META[i];
    const words = title.split(' ');
    const cover = `<div class="cover"><div class="bg"></div>
      <div class="abs" style="left:80px;right:80px;top:80px;bottom:175px;display:flex;flex-direction:column;align-items:center;gap:34px;text-align:center">
        <span class="tag">Подарок с эфира · гайд ${i + 1}</span>
        <div class="gold" style="font-size:${title.length > 22 ? 98 : 112}px">${title}</div>
        <div class="red" style="font-size:58px;max-width:860px;text-wrap:balance;transform:rotate(-2deg)">${m.red}</div>
        <div class="ph"><img src="file://${IMG}/${m.photo}" style="object-position:${m.pos}"></div></div>
      <div class="abs" style="left:0;right:0;bottom:70px;text-align:center"><span class="pill">Ксюша · @iamheyksusha</span></div></div>`;
    const html = `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class="fixbg"></div>${cover}<table class="flow"><thead><tr><td><div style="height:100px"></div></td></tr></thead><tbody><tr><td>${body(part, m)}</td></tr></tbody><tfoot><tr><td><div style="height:110px"></div></td></tr></tfoot></table></body></html>`;
    const tmp = path.join(OUT, `_g${i + 1}.html`); fs.writeFileSync(tmp, html);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
    const name = ['Гайд_1_Спроси_это_прежде_чем_влюбиться', 'Гайд_2_Как_просить_не_выпрашивая', 'Гайд_3_Ты_не_любишь_ты_терпишь'][i];
    await pg.pdf({ path: path.join(OUT, name + '.pdf'), width: W + 'px', height: H + 'px', printBackground: true, preferCSSPageSize: true });
    fs.unlinkSync(tmp);
  }
  await b.close();
})();
