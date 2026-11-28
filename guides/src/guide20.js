// Гайд «20 вопросов мужчине». node guide20.js <fontsDir> <outPdf>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const base = require('./diamond_css'); const IMG = base.IMG; const D = require('./guide20_data');
const W = 1240, H = 1754, img = f => `file://${IMG}/${f}`;
const css = base(F) + `
@page{size:${W}px ${H}px;margin:0}
*{box-sizing:border-box}html{background:#140c07}
body{margin:0;color:var(--text);font-family:Mont,sans-serif;font-weight:400;font-size:25px;line-height:1.6}
.fixbg{position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:-2;overflow:hidden}.fixbg .silk{height:150px;opacity:.55}
.fixfoot{position:fixed;left:0;right:0;bottom:44px;text-align:center;z-index:-1;font-size:16px;letter-spacing:.3em;text-transform:uppercase;color:rgba(236,201,150,.55)}
table.flow{border-collapse:collapse;width:100%}table.flow td{padding:0 110px}
b{color:#f8e2bb;font-weight:600}i{font-family:CormI;font-style:italic;font-size:1.18em;color:#e8cfa6}
h2{font-family:Corm;font-weight:500;font-size:60px;line-height:1.02;text-transform:uppercase;margin:60px 0 24px;padding-bottom:20px;text-align:center;color:#f1d4a2;position:relative;page-break-after:avoid}
h2:after{content:'';position:absolute;left:50%;bottom:0;width:260px;height:2px;margin-left:-130px;background:linear-gradient(90deg,transparent,#e6c48e,transparent)}
p{margin:0 0 18px}
.blk{text-align:center;margin:70px 0 30px;page-break-after:avoid;page-break-inside:avoid}
.blk .num{font-family:Corm;font-size:120px;line-height:.8;color:#e9c991}
.blk .t{font-family:Corm;font-weight:500;font-size:54px;text-transform:uppercase;color:#f3d9ae;line-height:1.05;margin-top:10px}
.blk .why{font-family:CormI;font-style:italic;font-size:31px;color:#d9bf98;margin-top:12px;text-wrap:balance}
.q{padding:30px 38px 24px;margin:0 0 24px;page-break-inside:avoid;position:relative}
.q .n{position:absolute;left:38px;top:26px;font-family:Corm;font-weight:600;font-size:52px;color:#e6c48e;line-height:1}
.q .qq{margin-left:78px;font-family:Corm;font-weight:600;font-size:36px;line-height:1.15;color:#fbe7c4;min-height:60px}
.q .lab{font-family:Mont;font-weight:500;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:#e2bd84;margin:16px 0 4px}
.q .lab.red{color:#e8a08a}
.q p{margin:0;font-size:23.5px}
.hl{padding:44px 54px 30px;margin:40px 0;page-break-inside:avoid}
.chk{list-style:none;padding:0;margin:10px 0 20px}.chk li{display:flex;gap:16px;margin:12px 0;align-items:flex-start}
.chk li:before{content:'♡';color:#e6c48e;font-size:30px;line-height:1.1}
.big{font-family:CormI;font-style:italic;font-size:40px;line-height:1.2;color:#f1d4a2;text-align:center;margin:26px 0 10px}
.pl{list-style:none;padding:0;margin:20px 0}.pl li{padding:14px 0 14px 46px;border-bottom:1px solid rgba(226,190,140,.22);position:relative}
.pl li:before{content:'◆';position:absolute;left:8px;color:#e6c48e;font-size:20px;top:17px}
.case{display:flex;gap:34px;padding:30px;margin:0 0 26px;page-break-inside:avoid;align-items:center}
.case .ph{flex:none;width:300px;height:380px;border-radius:150px 150px 20px 20px;background-size:cover;border:2px solid #e6c48e}
.case .nm{font-family:Corm;font-weight:600;font-size:40px;color:#f3d9ae;margin-bottom:8px}
.case .cq{font-family:CormI;font-style:italic;font-size:30px;color:#f1d4a2;margin-top:14px}
.pi{display:flex;gap:26px;padding:22px 30px;margin:0 0 16px;page-break-inside:avoid;align-items:flex-start}
.pi .k{flex:none;width:64px;height:64px;border-radius:50%;border:1.6px solid #e6c48e;display:flex;align-items:center;justify-content:center;font-family:Corm;font-weight:600;font-size:38px;color:#f1d4a2}
.pi .tt{font-family:Corm;font-weight:600;font-size:34px;color:#fbe7c4;line-height:1.1;margin-bottom:6px}
.pi p{margin:0;font-size:23px}
.cta{text-align:center;padding:50px 60px 44px;page-break-inside:avoid;margin-top:40px}
.cta .qr{display:inline-block;background:#fff7ea;border-radius:22px;padding:16px;margin:16px 0 18px}.cta .qr img{width:250px;display:block}
.coverimg{width:${W}px;height:${H}px;display:block;page-break-after:always;position:relative;z-index:1}
.sect{page-break-before:always}
`;
const cover = `<div class="dbg" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">
  <div style="position:absolute;left:0;right:0;top:0;height:1080px;background:url(${img('s_flowers.jpg')}) 50% 18%/cover;filter:sepia(.25) saturate(1.05) brightness(.85);-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent 100%)"></div>
  <div class="glow" style="left:320px;top:1080px;width:600px;height:260px;background:rgba(255,200,130,.16)"></div>
  <div style="position:absolute;left:0;right:0;top:860px;text-align:center">
    <span class="pill" style="font-size:23px">Гайд от Ксюши · сохрани себе</span>
    <div class="serif g-txt" style="font-size:96px;margin-top:34px;line-height:1">20 вопросов<br><i>мужчине</i></div>
    <div class="serif" style="font-size:46px;margin-top:18px;color:#f1d4a2;line-height:1.1"><i>прежде чем в него влюбиться</i></div>
    <img src="${img('diamond.png')}" style="width:260px;margin:4px auto 0;display:block">
    <div class="caps" style="font-size:23px;line-height:1.5;max-width:900px;margin:8px auto 0;text-wrap:balance">Что на самом деле стоит за каждым ответом — с точки зрения психологии</div>
  </div>
  <div class="silk" style="height:200px"></div>
  <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center" class="caps"><span style="font-size:19px;letter-spacing:.32em;opacity:.85">Ксюша · @iamheyksusha</span></div>
</div>`;
let n = 0;
const body = `
<h2 style="margin-top:20px">Прежде чем отдать сердце</h2>${D.intro.map(t => `<p>${t}</p>`).join('')}
<p style="font-size:22px;opacity:.9">Под каждым вопросом: <b style="color:#e2bd84">что ты узнаешь</b> и <b style="color:#e8a08a">когда насторожиться</b>.</p>
${D.blocks.map((b, i) => `<div class="blk"><div class="num">0${i + 1}</div><div class="t">${b.h}</div><div class="why">${b.why}</div></div>
${b.qs.map(q => `<div class="card q"><div class="n">${String(++n).padStart(2, '0')}</div><div class="qq">${q.q}</div>
<div class="lab">Что ты узнаешь</div><p>${q.w}</p><div class="lab red">Насторожись, если</div><p>${q.r}</p></div>`).join('')}`).join('')}
<div class="card hl"><h2 style="margin-top:0">${D.rule.h}</h2>${D.rule.t.map(t => `<p>${t}</p>`).join('')}
<p style="margin-top:20px">После каждого свидания спрашивай себя не только <i>«Понравилась ли я ему?»</i>, но и:</p>
<ul class="chk">${D.rule.check.map(c => `<li><span>${c}</span></li>`).join('')}</ul>
<div class="big">${D.rule.end}</div></div>
<div class="sect"></div><h2>${D.pain.h}</h2>
<div style="height:520px;border-radius:26px;margin:0 0 34px;background:url(${img('p_face.jpg')}) 50% 22%/cover;border:2px solid rgba(230,196,142,.7)"></div>
${D.pain.t.slice(0, 2).map(t => `<p>${t}</p>`).join('')}
<div class="card" style="padding:26px 40px;margin:26px 0;page-break-inside:avoid"><div class="caps" style="font-size:18px;color:#e2bd84">Узнаёшь себя?</div><ul class="pl">${D.pain.list.map(l => `<li>${l}</li>`).join('')}</ul></div>
<p>${D.pain.t[2]}</p>
<h2>Истории моих учениц</h2>
${D.cases.map(c => `<div class="card case"><div class="ph" style="background-image:url(${img(c.ph)});${c.ph.startsWith('rv') ? 'border-radius:20px;background-size:contain;background-repeat:no-repeat;background-position:center;background-color:#17110d' : 'background-position:50% 30%'}"></div><div><div class="nm">${c.name}</div><p style="margin:0">${c.t}</p><div class="cq">${c.q}</div></div></div>`).join('')}
<div class="sect"></div><h2 style="margin-top:20px">${D.prog.h}</h2><p style="text-align:center;font-family:CormI;font-style:italic;font-size:31px;color:#d9bf98">${D.prog.sub}</p>
${D.prog.items.map((it, i) => `<div class="card pi"><div class="k">${i + 1}</div><div><div class="tt">${it[0]}</div><p>${it[1]}</p></div></div>`).join('')}
<p class="caps" style="text-align:center;font-size:18px;margin-top:20px;color:#e2bd84">${D.prog.fmt}</p>
<div class="card cta"><h2 style="margin-top:0">${D.cta.h}</h2><p>${D.cta.t}</p>
<div class="qr"><img src="${img('qr_yoursksu2.png')}"></div><br>
<span class="pill" style="font-size:24px;white-space:nowrap;padding:16px 34px">Напиши слово <b style="color:#fff1d8">${D.cta.word}</b> → ${D.cta.acc}</span>
<p style="margin-top:26px">${D.cta.after}</p>
<p style="font-family:CormI;font-style:italic;font-size:36px;color:#f1d4a2;margin:26px 0 0">С любовью, Ксюша 🤍</p></div>
<div style="text-align:center;margin-top:40px;page-break-inside:avoid"><img src="${img('diamond.png')}" style="width:300px;display:block;margin:0 auto"><div style="font-family:CormI;font-style:italic;font-size:44px;color:#f1d4a2;margin-top:8px">Ты не проходишь кастинг. Ты выбираешь.</div></div>`;
(async () => {
  const dir = path.dirname(OUT); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const cp = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.6 });
  const ct = path.join(dir, '_c.html'); fs.writeFileSync(ct, `<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0}</style></head><body>${cover}</body></html>`);
  await cp.goto('file://' + ct); await cp.evaluate(() => document.fonts.ready); await cp.waitForTimeout(500);
  const ci = path.join(dir, '_c.jpg'); await cp.screenshot({ path: ci, type: 'jpeg', quality: 92 }); fs.unlinkSync(ct);
  const pg = await b.newPage(); const t = path.join(dir, '_g.html');
  fs.writeFileSync(t, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class="fixbg dbg"><div class="silk"></div></div>
<div class="fixfoot">◆ 20 вопросов мужчине · @iamheyksusha ◆</div><img class="coverimg" src="file://${ci}">
<table class="flow"><thead><tr><td><div style="height:96px"></div></td></tr></thead><tbody><tr><td>${body}</td></tr></tbody><tfoot><tr><td><div style="height:150px"></div></td></tr></tfoot></table></body></html>`);
  await pg.goto('file://' + t); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.pdf({ path: OUT, width: W + 'px', height: H + 'px', printBackground: true, preferCSSPageSize: true });
  if (!process.env.KEEP) { fs.unlinkSync(t); fs.unlinkSync(ci); }
  await b.close();
})();
