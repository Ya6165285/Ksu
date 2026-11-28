// Гайд «20 вопросов мужчине» — розово-чёрный стиль первых гайдов (Oswald + Montserrat). node guide20p.js <fontsDir> <outPdf>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const D = require('./guide20_data');
const IMG = path.resolve(__dirname, '../../launch/diamond/img'), img = f => `file://${IMG}/${f}`;
const W = 1240, H = 1754;
const ff = (fam, w, file, ur = '') => `@font-face{font-family:${fam};font-weight:${w};src:url(file://${F}/${file})${ur ? ';unicode-range:' + ur : ''}}`;
const LAT = 'U+0000-00FF,U+2000-206F,U+2190-21FF';
const fonts = [500, 600, 700].map(w => ff('Osw', w, `oswald/files/oswald-cyrillic-${w}-normal.woff2`) + ff('Osw', w, `oswald/files/oswald-latin-${w}-normal.woff2`, LAT)).join('')
  + [400, 500, 600, 700].map(w => ff('Mont', w, `montserrat/files/montserrat-cyrillic-${w}-normal.woff2`) + ff('Mont', w, `montserrat/files/montserrat-latin-${w}-normal.woff2`, LAT)).join('');
const css = fonts + `
:root{--pink:#F0479A;--pink2:#E0357F;--bg:#0B0B0D;--line:rgba(255,255,255,.08);--txt:#ECECEC;--mut:#A3A3AB}
*{box-sizing:border-box;margin:0;padding:0}@page{size:${W}px ${H}px;margin:0}
html{background:var(--bg)}body{background:transparent}body{font-family:Mont,sans-serif;color:var(--txt);-webkit-font-smoothing:antialiased;font-size:25px;line-height:1.5}
.bgl{position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:-2;overflow:hidden;background:radial-gradient(circle at 100% 0%,rgba(240,71,154,.24),rgba(240,71,154,0) 38%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.14),rgba(240,71,154,0) 34%),var(--bg)}
.grid{position:absolute;inset:-300px;transform:rotate(-9deg);background-image:linear-gradient(rgba(255,255,255,.035) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.035) 2px,transparent 2px),linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:260px 190px,260px 190px,65px 47px,65px 47px}
.spark{position:absolute;color:#fff;line-height:1}
.foot{position:fixed;left:90px;right:90px;bottom:50px;display:flex;justify-content:space-between;font:600 13px Mont;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.32);z-index:-1}.foot b{color:var(--pink)}
table.flow{border-collapse:collapse;width:100%}table.flow td{padding:0 90px}
b{color:#fff;font-weight:700}i{font-style:normal;color:var(--pink);font-weight:600}
.tag{background:#0E0E11;display:inline-flex;align-items:center;gap:12px;border:1.5px solid rgba(255,255,255,.22);border-radius:999px;padding:11px 24px;font:600 15px Mont;letter-spacing:.22em;text-transform:uppercase;color:#fff}.tag b{color:var(--pink);font-size:18px}
.h{font:700 84px/1 Osw;text-transform:uppercase;margin:24px 0 26px;page-break-after:avoid}
.h .w{color:#fff}.h .p{color:var(--pink)}
.h.m{font-size:70px}
p{margin:0 0 16px;color:#D7D7DC}
.card{background:linear-gradient(160deg,#1C1C20,#141417);border:1px solid var(--line);border-radius:26px;padding:26px 30px}
.card.hl{border:1.5px solid var(--pink);background:linear-gradient(150deg,rgba(240,71,154,.28),#1a1016 55%,#141417)}
.blk{margin:70px 0 26px;page-break-after:avoid;page-break-inside:avoid;display:flex;gap:28px;align-items:flex-end}
.blk .num{font:700 150px/.8 Osw;color:var(--pink)}
.blk .t{font:700 52px/1.02 Osw;text-transform:uppercase;color:#fff}
.blk .why{font:500 23px/1.4 Mont;color:var(--mut);margin-top:10px}
.q{margin:0 0 20px;page-break-inside:avoid}
.q .top{display:flex;gap:18px;align-items:flex-start;margin-bottom:14px}
.q .n{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:56px;height:48px;border-radius:12px;border:1.5px solid rgba(240,71,154,.55);background:rgba(240,71,154,.12);font:700 26px Osw;color:var(--pink)}
.q .qq{font:700 34px/1.15 Osw;text-transform:uppercase;color:#fff}
.q .row{display:flex;gap:14px;margin-top:10px}.q .row .k{flex:none;font:600 14px Mont;letter-spacing:.18em;text-transform:uppercase;width:150px;padding-top:6px;color:var(--pink)}
.q .row.red .k{color:#8E8E96}.q .row p{margin:0;font-size:23px}
.res{display:flex;align-items:center;gap:28px;border-radius:26px;padding:30px 34px;background:linear-gradient(100deg,#F25AA6,#E0357F);page-break-inside:avoid;margin:30px 0}
.res .lab{flex:none;background:rgba(255,255,255,.88);color:var(--pink2);font:700 26px Osw;letter-spacing:.04em;text-transform:uppercase;border-radius:12px;padding:10px 18px}.res .rt{font:500 26px/1.4 Mont;color:#fff}
.chk{display:flex;align-items:center;gap:18px;font:500 25px/1.3 Mont;color:#fff;padding:15px 0;border-bottom:1px solid var(--line)}.chk span.b{flex:none;width:36px;height:36px;border-radius:9px;border:2px solid var(--pink)}
.ul{list-style:none}.ul li{font:400 25px/1.4 Mont;color:#E2E2E6;padding-left:32px;position:relative;margin:12px 0}.ul li:before{content:'';position:absolute;left:4px;top:12px;width:10px;height:10px;border-radius:50%;background:var(--pink)}
.case{display:flex;gap:30px;align-items:center;margin:0 0 24px;page-break-inside:avoid}
.case .ph{flex:none;width:280px;height:340px;border-radius:22px;background-size:cover;border:1px solid rgba(255,255,255,.1)}
.case .nm{font:700 38px Osw;text-transform:uppercase;color:#fff;margin-bottom:8px}.case .cq{font:600 25px/1.4 Mont;color:var(--pink);margin-top:12px}
.pi{display:flex;gap:22px;align-items:flex-start;margin:0 0 16px;page-break-inside:avoid}
.pi .n{flex:none;width:58px;height:52px;border-radius:12px;background:var(--pink);display:flex;align-items:center;justify-content:center;font:700 30px Osw;color:#fff}
.pi .tt{font:700 32px/1.1 Osw;text-transform:uppercase;color:#fff;margin-bottom:6px}.pi p{margin:0;font-size:23px}
.tape{position:absolute;width:190px;height:52px;background:linear-gradient(90deg,#F0479A,#F678B4);z-index:5}
.btn{display:inline-flex;align-items:center;gap:22px;border-radius:999px;padding:16px 18px 16px 38px;background:linear-gradient(100deg,#F25AA6,#E0357F);font:700 36px Osw;text-transform:uppercase;color:#fff}.btn s{text-decoration:none;width:58px;height:58px;border-radius:50%;background:#fff;color:var(--pink2);display:flex;align-items:center;justify-content:center;font:700 30px Mont}
.coverimg{width:${W}px;height:${H}px;display:block;page-break-after:always;position:relative;z-index:1}
.sect{page-break-before:always}
`;
const sparks = [[1080, 120], [1150, 620], [60, 1400], [700, 70], [980, 1560], [40, 820]].map(([x, y], k) => `<div class="spark" style="left:${x}px;top:${y}px;font-size:${[30, 22, 18, 24, 20, 16][k]}px">✦</div>`).join('');
const bg = `<div class="bgl"><div class="grid"></div>${sparks}</div>`;
const framed = (style, inner, rot) => `<div style="position:absolute;${style};transform:rotate(${rot}deg);z-index:2"><div class="tape" style="right:-50px;top:-12px;transform:rotate(32deg)"></div><div class="tape" style="left:-55px;bottom:-10px;transform:rotate(32deg)"></div><div style="border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.08)">${inner}</div></div>`;
const cover = `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${bg.replace('position:fixed', 'position:absolute')}
 ${framed('left:150px;top:120px', `<img src="${img('s_flowers.jpg')}" style="display:block;width:700px;height:820px;object-fit:cover;object-position:45% 30%">`, -4)}
 <div style="position:absolute;left:90px;right:90px;top:1060px;z-index:3">
  <span class="tag"><b>✦</b>Гайд от Ксюши · сохрани себе</span>
  <div class="h" style="font-size:112px;margin:26px 0 0"><span class="w">20 вопросов</span> <span class="p">мужчине</span></div>
  <div style="font:700 50px/1.05 Osw;text-transform:uppercase;color:#fff;margin-top:14px">прежде чем в него <span style="color:var(--pink)">влюбиться</span></div>
  <div style="font:400 28px/1.4 Mont;color:#E4E4E7;margin-top:22px">Что на самом деле стоит за каждым ответом — <i>с точки зрения психологии</i></div>
  <div style="display:flex;gap:16px;margin-top:34px">${[['20', 'вопросов'], ['5', 'тем'], ['1', 'главное правило']].map(([a, b]) => `<span style="display:inline-flex;align-items:center;gap:12px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);border-radius:999px;padding:12px 24px;font:500 22px Mont;color:#fff"><b style="font:700 34px Osw;color:var(--pink)">${a}</b>${b}</span>`).join('')}</div>
 </div>
 <div class="foot" style="position:absolute;z-index:3"><span>HEY KSUSHA <b>♥</b> 20 вопросов мужчине</span><span>@iamheyksusha</span></div></div>`;
let n = 0;
const body = `
<span class="tag"><b>✦</b>Прежде чем отдать сердце</span>
<div class="h m"><span class="w">Влюбляйся</span><br><span class="p">в человека, а не в образ</span></div>
${D.intro.map(t => `<p>${t.replace(/<i>(.*?)<\/i>/g, '<i>$1</i>')}</p>`).join('')}
<div class="card" style="margin-top:20px;display:flex;gap:30px;font:500 22px Mont;color:#fff"><span><i style="font-weight:700">●</i> Что ты узнаешь — смысл вопроса</span><span><b style="color:#8E8E96">●</b> Насторожись, если — тревожный сигнал</span></div>
${D.blocks.map((b, k) => `<div class="blk"><div class="num">0${k + 1}</div><div><div class="t">${b.h}</div><div class="why">${b.why}</div></div></div>
${b.qs.map(q => `<div class="card q"><div class="top"><span class="n">${String(++n).padStart(2, '0')}</span><div class="qq">${q.q}</div></div>
<div class="row"><span class="k">Что ты узнаешь</span><p>${q.w}</p></div><div class="row red"><span class="k">Насторожись, если</span><p>${q.r}</p></div></div>`).join('')}`).join('')}
<div class="sect"></div><span class="tag"><b>✦</b>Главное правило</span>
<div class="h m"><span class="w">Женщина</span> <span class="p">на миллион</span></div>
${D.rule.t.map(t => `<p style="font-size:27px">${t}</p>`).join('')}
<div class="lbl" style="font:600 15px Mont;letter-spacing:.24em;text-transform:uppercase;color:var(--pink);margin:30px 0 6px">После каждого свидания спроси себя</div>
<p>не только <b>«Понравилась ли я ему?»</b>, но и:</p>
${D.rule.check.map(c => `<div class="chk"><span class="b"></span>${c}</div>`).join('')}
<div class="res"><span class="lab">Помни</span><span class="rt">Ты не проходишь кастинг на роль его женщины. <b>Ты тоже выбираешь.</b></span></div>
<div class="sect"></div><span class="tag"><b>✦</b>Честно</span>
<div class="h m"><span class="w">А если вопросы</span><br><span class="p">не помогают?</span></div>
<div style="position:relative;height:420px;margin:0 0 30px">${framed('left:330px;top:10px', `<img src="${img('p_face.jpg')}" style="display:block;width:400px;height:380px;object-fit:cover;object-position:50% 22%">`, 3)}</div>
${D.pain.t.slice(0, 2).map(t => `<p>${t}</p>`).join('')}
<div class="card hl" style="margin:24px 0;page-break-inside:avoid"><div style="font:700 30px Osw;text-transform:uppercase;color:#fff;margin-bottom:6px">Узнаёшь себя?</div><ul class="ul">${D.pain.list.map(l => `<li>${l}</li>`).join('')}</ul></div>
<p style="font-size:27px">${D.pain.t[2].replace('И их можно поменять.', '<i>И их можно поменять.</i>')}</p>
<div class="h m" style="margin-top:50px"><span class="w">Истории</span> <span class="p">учениц</span></div>
${D.cases.map(c => `<div class="card case"><div class="ph" style="background-image:url(${img(c.ph)});${c.ph.startsWith('rv') ? 'background-size:contain;background-repeat:no-repeat;background-position:center;background-color:#0f0f12' : 'background-position:50% 30%'}"></div><div><div class="nm">${c.name}</div><p style="margin:0">${c.t}</p><div class="cq">${c.q}</div></div></div>`).join('')}
<div class="sect"></div><span class="tag"><b>✦</b>Со мной и психологом Олей</span>
<div class="h m"><span class="w">Программа</span><br><span class="p">«Девушка на миллион»</span></div>
<p>${D.prog.sub}</p>
${D.prog.items.map((it, k) => `<div class="card pi"><span class="n">${k + 1}</span><div><div class="tt">${it[0]}</div><p>${it[1]}</p></div></div>`).join('')}
<div class="res" style="margin-top:20px"><span class="lab">Формат</span><span class="rt">${D.prog.fmt}</span></div>
<div class="sect"></div>
<div style="display:flex;gap:40px;align-items:flex-start">
 <div style="flex:1"><span class="tag"><b>✦</b>Бесплатно</span><div class="h m"><span class="w">Хочешь уже</span><br><span class="p">поменять жизнь?</span></div>
 <p style="font-size:27px">${D.cta.t.replace('надоело ходить по одному кругу', '<b>надоело ходить по одному кругу</b>')}</p></div>
 <div style="flex:none;position:relative;width:380px;height:470px;margin-top:20px">${framed('left:0;top:0', `<img src="${img('s_mirror.jpg')}" style="display:block;width:360px;height:450px;object-fit:cover;object-position:50% 25%">`, 4)}</div>
</div>
<div class="card hl" style="margin-top:50px;display:flex;gap:40px;align-items:center;page-break-inside:avoid">
 <div style="flex:none;background:#fff;border-radius:22px;padding:16px"><img src="${img('qr_yoursksu2.png')}" style="width:260px;display:block"></div>
 <div><div style="font:600 15px Mont;letter-spacing:.24em;text-transform:uppercase;color:var(--pink)">Отдел заботы</div>
 <div style="font:700 66px/1 Osw;color:#fff;margin:10px 0 16px">${D.cta.acc}</div>
 <span class="btn">Напиши «${D.cta.word}» <s>→</s></span></div></div>
<p style="font-size:26px;margin-top:34px">${D.cta.after}</p>
<div style="font:700 34px Osw;color:#fff;margin-top:40px;letter-spacing:.04em">С ЛЮБОВЬЮ, КСЮША <span style="color:var(--pink)">♥</span></div>`;
(async () => {
  const dir = path.dirname(OUT); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const cp = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.6 });
  const ct = path.join(dir, '_c.html'); fs.writeFileSync(ct, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${cover}</body></html>`);
  await cp.goto('file://' + ct); await cp.evaluate(() => document.fonts.ready); await cp.waitForTimeout(500);
  const ci = path.join(dir, '_c.jpg'); await cp.screenshot({ path: ci, type: 'jpeg', quality: 92 }); fs.unlinkSync(ct);
  const pg = await b.newPage(); const t = path.join(dir, '_g.html');
  fs.writeFileSync(t, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${bg}
<div class="foot"><span>HEY KSUSHA <b>♥</b> 20 вопросов мужчине</span><span>@iamheyksusha</span></div><img class="coverimg" src="file://${ci}">
<table class="flow"><thead><tr><td><div style="height:100px"></div></td></tr></thead><tbody><tr><td>${body}</td></tr></tbody><tfoot><tr><td><div style="height:140px"></div></td></tr></tfoot></table></body></html>`);
  await pg.goto('file://' + t); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.pdf({ path: OUT, width: W + 'px', height: H + 'px', printBackground: true, preferCSSPageSize: true });
  if (!process.env.KEEP) { fs.unlinkSync(t); fs.unlinkSync(ci); }
  await b.close();
})();
