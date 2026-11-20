// Гайды к эфиру 3 «Из алмаза в бриллиант». node guides3.js <fontsDir> <outDir>
const { marked } = require(process.env.MARKED || 'marked');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const base = require('./diamond_css'); const IMG = base.IMG;
const SRC = fs.readFileSync(path.resolve(__dirname, '../../launch/Гайды_эфир_3.md'), 'utf8');
const W = 1240, H = 1754;
const css = base(F) + `
@page{size:${W}px ${H}px;margin:0}
*{box-sizing:border-box}
html{background:#140c07}
body{margin:0;color:var(--text);font-family:Mont,sans-serif;font-weight:400;font-size:26px;line-height:1.62}
.fixbg{position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:-2;overflow:hidden}
.fixbg .silk{height:150px;opacity:.55}
.fixfoot{position:fixed;left:0;right:0;bottom:44px;text-align:center;z-index:-1;font-family:Mont;font-size:16px;letter-spacing:.3em;text-transform:uppercase;color:rgba(236,201,150,.55)}
table.flow{border-collapse:collapse;width:100%}table.flow td{padding:0 120px}
.cover{position:relative;z-index:1;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always}
.cover .photo{position:absolute;left:0;right:0;top:0;height:1060px;background-size:cover;-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 100%)}
.cover .silk{height:200px}
h2{font-family:Corm;font-weight:500;font-size:62px;line-height:1.02;text-transform:uppercase;margin:70px 0 26px;padding-bottom:20px;text-align:center;page-break-after:avoid;color:#f1d4a2;position:relative}
h2:after{content:'';position:absolute;left:50%;bottom:0;width:260px;height:2px;margin-left:-130px;background:linear-gradient(90deg,transparent,#e6c48e,transparent)}
h3{font-family:Corm;font-weight:600;font-size:40px;color:#f3d9ae;margin:42px 0 12px;page-break-after:avoid}
p{margin:0 0 18px}
strong{color:#f8e2bb;font-weight:600}
em{font-family:CormI;font-style:italic;font-size:1.18em;color:#e2c9a3}
ul,ol{padding-left:36px;margin:0 0 22px}li{margin:8px 0}
li::marker{color:#e2bd84}
li:has(.box){list-style:none;margin-left:-36px;display:flex;gap:18px;align-items:flex-start}
.box{flex:none;width:30px;height:30px;margin-top:6px;border:1.6px solid #e2bd84;border-radius:8px;background:rgba(236,201,150,.06)}
.line{display:inline-block;min-width:320px;border-bottom:1.5px solid var(--line);height:1.25em;vertical-align:bottom;flex:1}
.lineb{display:block;height:48px;border-bottom:1.5px solid var(--line);margin:6px 0 10px}
blockquote{margin:20px 0;padding:24px 34px;border:1.4px solid var(--line);border-left:4px solid #e6c48e;background:linear-gradient(160deg,rgba(66,42,25,.55),rgba(24,15,9,.6));border-radius:0 20px 20px 0;page-break-inside:avoid}
blockquote p{margin:0}
hr{border:0;height:0;margin:24px 0}
table{width:100%;border-collapse:separate;border-spacing:0;margin:20px 0 26px;border:1.4px solid var(--line);border-radius:20px;overflow:hidden}
th,td{padding:16px 24px;text-align:left;border-bottom:1px solid rgba(226,190,140,.22)}
th{font-family:Mont;font-weight:500;text-transform:uppercase;letter-spacing:.12em;font-size:20px;color:#f3d9ae;background:rgba(236,201,150,.08)}
tr:last-child td{border-bottom:0}
.card{padding:34px 40px 18px;margin:34px 0;page-break-inside:avoid}
.card h2{margin:0 0 22px;font-size:46px;text-align:left;padding-bottom:16px}
.card h2:after{left:0;margin-left:0;width:200px;background:linear-gradient(90deg,#e6c48e,transparent)}
.cta{text-align:center;page-break-inside:avoid;padding:50px 60px 40px;margin-top:20px}
.cta h2{margin-top:0}
.cta .qr{display:inline-block;background:#fff7ea;border-radius:22px;padding:16px;margin:10px 0 18px}.cta .qr img{width:230px;display:block}
.cta .word{display:inline-block;margin:6px 0 20px}
.intro{font-size:28px}
.norm{padding:50px 50px 30px}.norm h2{text-align:center}.norm h2:after{left:50%;margin-left:-100px;background:linear-gradient(90deg,transparent,#e6c48e,transparent)}.norm p:has(>.line){margin:0 0 70px;font-size:28px}
.cta h2{text-align:center}.cta h2:after{left:50%;margin-left:-100px;background:linear-gradient(90deg,transparent,#e6c48e,transparent)}
p:has(>.line){display:flex;gap:16px;align-items:flex-end;margin:0 0 34px}
p:has(>.line) .line{min-width:0}
.diamp{display:block}
.coverimg{width:1240px;height:1754px;display:block;page-break-after:always;position:relative;z-index:1}
`;
const META = [
  { photo: 'ksu_poster.jpg', pos: '50% 10%', t: ['Какого мужчину', '<i>ты на самом деле</i>', '<i>достойна?</i>'], sub: 'Личная анкета: твои стандарты в отношениях, чтобы перестать соглашаться на меньшее' },
  { photo: 'me_portrait.jpg', pos: '50% 20%', f: 'filter:sepia(.35) saturate(1.1) brightness(.82)', t: ['Что сказать мужчине,', '<i>чтобы он начал</i>', '<i>стараться?</i>'], sub: '7 готовых фраз для переписки и реальных разговоров' },
];
const parts = SRC.split(/\n# ГАЙД \d\. /).slice(1);
function body(md, i) {
  md = md.replace(/^.*\n### .*\n/, '').replace(/\n---\n---\s*$/, '').replace(/\n---\s*$/, '');
  md = md.replace(/^[ \t]*_{5,}[ \t]*$/gm, '<span class="lineb"></span>').replace(/_{5,}/g, '<span class="line"></span>').replace(/☐/g, '<span class="box"></span>');
  let html = marked.parse(md, { breaks: true });
  html = html.replace(/<br>\s*<span class="lineb"><\/span>/g, '<span class="lineb"></span>');
  // CTA section
  html = html.replace(/(<h2>А ЧТО ДАЛЬШЕ\?<\/h2>[\s\S]*?)(<p><em>С любовью[\s\S]*)$/, (m, a, b) => `<div class="card cta">${a.replace(/<p>\S*\s*<strong>Напиши мне слово РАЗБОР<\/strong> → @iamheyksusha<\/p>/, `<div class="qr"><img src="file://${IMG}/qr_iamheyksusha.png"></div><br><span class="pill word" style="font-size:23px;white-space:nowrap;padding:16px 34px">Напиши слово <b style="font-weight:600;color:#fff1d8">РАЗБОР</b> → @iamheyksusha</span>`)}${b}</div><div style="text-align:center;margin-top:50px;page-break-inside:avoid"><img class="diamp" src="file://${IMG}/diamond.png" style="width:340px;margin:0 auto"><div style="font-family:CormI;font-style:italic;font-size:46px;color:#f1d4a2;margin-top:10px">Ты не стекло. Ты — бриллиант.</div></div>`);
  // phrase sections → cards
  html = html.replace(/(<h2>ФРАЗА [\s\S]*?)(?=<hr>|<h2)/g, '<div class="card">$1</div>');
  html = html.replace(/(<h2>ЧАСТЬ 5\.[\s\S]*?)(?=<hr>|<h2)/, '<div class="card norm">$1</div>');
  html = html.replace(/(<h2>3 ФРАЗЫ[\s\S]*?)(?=<hr>|<h2)/g, '<div class="card">$1</div>').replace(/(<h2>ЗАДАНИЕ НА НЕДЕЛЮ[\s\S]*?)(?=<hr>|<h2)/g, '<div class="card">$1</div>');
  return html;
}
const cover = (i, m) => `<div class="cover dbg">
  <div class="photo" style="background-image:url(file://${IMG}/${m.photo});background-position:${m.pos};${m.f||''}"></div>
  <div class="glow" style="left:320px;top:1080px;width:600px;height:260px;background:rgba(255,200,130,.16)"></div>
  <div style="position:absolute;left:0;right:0;top:850px;text-align:center">
    <span class="pill" style="font-size:24px">Подарок с эфира · гайд ${i + 1}<br><span style="font-size:19px;opacity:.8">«Из алмаза в бриллиант»</span></span>
    <div class="serif g-txt" style="font-size:${i ? 86 : 100}px;margin-top:34px;line-height:1">${m.t.join('<br>')}</div>
    <img class="diamp" src="file://${IMG}/diamond.png" style="width:300px;margin:6px auto 0">
    <div class="caps" style="font-size:25px;line-height:1.5;max-width:900px;margin:14px auto 0;text-wrap:balance">${m.sub}</div>
  </div>
  <div class="silk"></div>
  <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center" class="caps"><span style="font-size:19px;letter-spacing:.32em;opacity:.85">Ксюша · @iamheyksusha</span></div>
</div>`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  const cp = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.6 });
  const names = ['Гайд_1_Какого_мужчину_ты_достойна', 'Гайд_2_Что_сказать_мужчине'];
  for (const [i, part] of parts.entries()) {
    const m = META[i];
    const ctmp = path.join(OUT, `_c${i + 1}.html`); fs.writeFileSync(ctmp, `<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0}</style></head><body>${cover(i, m)}</body></html>`);
    await cp.goto('file://' + ctmp); fs.unlinkSync(ctmp);
    await cp.evaluate(() => document.fonts.ready); await cp.waitForTimeout(400);
    const cimg = path.join(OUT, `_c${i + 1}.jpg`); await cp.screenshot({ path: cimg, type: 'jpeg', quality: 92 });
    const html = `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>
<div class="fixbg dbg"><div class="silk"></div></div>
<div class="fixfoot">◆ Из алмаза в бриллиант · @iamheyksusha ◆</div>
<img class="coverimg" src="file://${cimg}"><table class="flow"><thead><tr><td><div style="height:96px"></div></td></tr></thead><tbody><tr><td>${body(part, i)}</td></tr></tbody><tfoot><tr><td><div style="height:150px"></div></td></tr></tfoot></table></body></html>`;
    const tmp = path.join(OUT, `_g${i + 1}.html`); fs.writeFileSync(tmp, html);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
    await pg.pdf({ path: path.join(OUT, names[i] + '.pdf'), width: W + 'px', height: H + 'px', printBackground: true, preferCSSPageSize: true });
    if (!process.env.KEEP) { fs.unlinkSync(tmp); fs.unlinkSync(cimg); }
  }
  await b.close();
})();
