// Презентация эфира 3 «Из алмаза в бриллиант» — стиль афиши (шоколад + шампань-золото).
// node deck4.js <fontsDir> <outDir> [onlyN,...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
const base = require('./diamond_css'); const IMG = base.IMG;
const S = require('./deck4_data');
const u = f => `file://${IMG}/${f}`;
const css = base(F) + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;color:var(--text);font-family:Mont;font-weight:400}
.abs{position:absolute}
.tag{font-size:22px;padding:12px 34px}
.h{font-size:92px}
.items{display:flex;flex-direction:column;gap:20px}
.it2{display:flex;gap:26px;align-items:center;padding:22px 32px}
.num{flex:none;width:74px;height:74px;border-radius:50%;border:1.4px solid rgba(236,201,150,.75);display:flex;align-items:center;justify-content:center;font-family:Corm;font-weight:500;font-size:40px;color:#f3d6a6;background:radial-gradient(circle at 50% 30%,rgba(236,201,150,.18),transparent 70%)}
.t{font-size:36px;line-height:1.3;color:#f6e8d2;font-weight:500}
.d{font-size:28px;line-height:1.38;color:var(--muted);margin-top:4px}
.t b,.d b,.p b{color:#f6d9a8;font-weight:600}
.p{font-size:36px;line-height:1.45;color:#ecdfcb}
.quote{font-family:CormI;font-style:italic;font-weight:500;font-size:46px;line-height:1.2;color:#f1d4a2}
.arch{position:absolute;overflow:hidden;border-radius:330px 330px 26px 26px;border:2px solid rgba(236,201,150,.8);box-shadow:0 0 0 10px rgba(236,201,150,.07),0 40px 80px rgba(0,0,0,.6)}
.arch img{width:100%;height:100%;object-fit:cover;display:block}
.archline{position:absolute;border-radius:350px 350px 40px 40px;border:1px solid rgba(236,201,150,.35)}
.qr{background:#fff7ea;border-radius:26px;padding:20px;display:inline-block;box-shadow:0 0 60px rgba(236,201,150,.25)}.qr img{width:290px;display:block}
.word{font-size:40px;padding:20px 56px;letter-spacing:.12em}
.word b{font-weight:600;color:#fff2da}
.foot{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:15px;letter-spacing:.34em;text-transform:uppercase;color:rgba(236,201,150,.45);z-index:5}
.vs{flex:1;padding:44px 48px}.vs .p{font-size:40px;line-height:1.4}
.vs .lab{font-family:Mont;font-size:22px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:18px}
.vs.glass{background:rgba(255,255,255,.03);border:1.4px dashed rgba(200,180,160,.35);border-radius:26px}
.vs.glass .lab{color:#a9998a}.vs.glass .p{color:#b9ab9c}
.vs.br .lab{color:#f3d6a6}
`;
const diamond = (w, extra = '') => `<img class="abs" src="${u('diamond.png')}" style="width:${w}px;${extra}">`;
const bg = (o = {}) => `<div class="abs dbg" style="inset:0"></div>
<div class="glow" style="left:${o.gx ?? 700}px;top:${o.gy ?? 300}px;width:700px;height:420px;background:rgba(255,196,130,.10)"></div>
${o.chand === false ? '' : `<div class="chand" style="left:0;top:0;width:150px;height:560px"></div>`}
${o.silk === false ? '' : `<div class="silk" style="height:${o.silkH || 170}px;opacity:${o.silkO ?? .75}"></div>`}`;
const H = (h, size = 92, align = 'left') => `<div class="serif g-txt h" style="font-size:${size}px;text-align:${align}">${h}</div>`;
const tag = t => `<span class="pill tag">${t}</span>`;
const arch = (f, pos = '50% 25%', x = 1250, y = 110, w = 560, h = 840) => `<div class="archline" style="left:${x - 18}px;top:${y - 18}px;width:${w + 36}px;height:${h + 36}px"></div><div class="arch" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img src="${u(f)}" style="object-position:${pos}"></div>`;
const two = (x = 1100, y = 150) => arch('ksu_poster.jpg', '45% 20%', x, y, 350, 680) + arch('olya_poster.jpg', '15% 20%', x + 390, y + 70, 350, 680);
const items = (arr, opt = {}) => `<div class="items" style="${opt.style || ''}">${arr.map((x, i) => `<div class="card it2" style="${opt.pad ? 'padding:' + opt.pad : ''}">${x.n === false ? '' : `<div class="num" style="${opt.ns || ''}">${x.n ?? String(i + 1).padStart(2, '0')}</div>`}<div><div class="t" style="${opt.ts || ''}">${x.t}</div>${x.d ? `<div class="d">${x.d}</div>` : ''}</div></div>`).join('')}</div>`;
const L = {
  cover: s => `${bg({ silk: true, silkH: 230, chand: false })}
    ${two(1080, 120)}
    <div class="abs" style="left:120px;top:170px;width:880px">
      ${tag('Женская встреча с психологом из Оксфорда')}
      <div class="serif g-txt" style="font-size:116px;margin-top:44px;line-height:.98">Из алмаза<br><i>в бриллиант</i></div>
      ${diamond(330, 'position:relative;display:block;margin:16px 0 0 250px')}
      <div class="caps" style="font-size:28px;line-height:1.55;margin-top:18px">Психологическая огранка: снимаем старые сценарии,<br>раскрываем новые грани тебя</div>
      <div class="caps" style="font-size:20px;letter-spacing:.3em;margin-top:44px;color:rgba(236,201,150,.75)">Ксюша @iamheyksusha · Ольга Новикова @ola_nvkv</div>
    </div>`,
  list: s => `${bg()}${s.covers ? `<img class="abs" src="${u(s.covers[0])}" style="left:1180px;top:170px;width:400px;border-radius:14px;transform:rotate(-6deg);box-shadow:0 30px 70px rgba(0,0,0,.7);border:1.5px solid rgba(236,201,150,.6)"><img class="abs" src="${u(s.covers[1])}" style="left:1420px;top:250px;width:400px;border-radius:14px;transform:rotate(5deg);box-shadow:0 30px 70px rgba(0,0,0,.7);border:1.5px solid rgba(236,201,150,.6)">` : ''}${s.two ? two() : s.ph ? (s.wide ? arch(s.ph, s.pos, 1120, 150, 680, 760) : arch(s.ph, s.pos)) : ''}
    <div class="abs" style="left:150px;top:80px;width:${s.covers ? 960 : s.two ? 880 : s.ph ? (s.wide ? 900 : 1000) : 1620}px;bottom:120px;display:flex;flex-direction:column;justify-content:center;gap:24px">
      ${s.tag ? `<div>${tag(s.tag)}</div>` : ''}${H(s.h, s.hs || 84)}
      ${s.lead ? `<div class="p" style="font-size:32px">${s.lead}</div>` : ''}
      ${items(s.items, s.opt || {})}
      ${s.q ? `<div class="quote" style="font-size:${s.qs || 42}px">${s.q}</div>` : ''}
      ${s.prog ? `<div class="card" style="padding:16px 26px;border-color:rgba(236,201,150,.75)"><span class="caps" style="font-size:18px;letter-spacing:.2em;color:#f3d6a6">Без этого не получится · </span><span class="p" style="font-size:25px">${s.prog}</span></div>` : ''}
    </div>`,
  big: s => `${bg({ gx: 610, gy: 330 })}
    <div class="abs" style="left:180px;right:180px;top:0;bottom:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:30px">
      ${s.tag ? `<div>${tag(s.tag)}</div>` : ''}
      ${s.pre ? `<div class="p" style="max-width:1400px">${s.pre}</div>` : ''}
      ${H(s.h, s.hs || 96, 'center')}
      ${s.diam === false ? '' : `<img src="${u('diamond.png')}" style="width:300px">`}
      ${s.sub ? `<div class="p" style="max-width:1400px">${s.sub}</div>` : ''}
      ${s.q ? `<div class="quote" style="max-width:1400px">${s.q}</div>` : ''}
    </div>`,
  vs: s => `${bg()}
    <div class="abs" style="left:150px;right:150px;top:80px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:40px">
      <div>${tag(s.tag)}</div>${H(s.h, 88)}
      <div style="display:flex;gap:34px">
        <div class="vs glass"><div class="lab">◇ Стекло</div><div class="p">${s.a}</div></div>
        <div class="vs card br"><div class="lab">◆ Бриллиант</div><div class="p">${s.b}</div></div>
      </div>
      ${s.q ? `<div class="quote" style="text-align:center">${s.q}</div>` : ''}
      ${s.chat ? `<div style="text-align:center"><span class="pill" style="font-size:24px">${s.chat}</span></div>` : ''}
    </div>`,
  q: s => `${bg({ gx: 900 })}${arch(s.ph || 'olya2.jpg', s.pos || '50% 20%', 140, 110, 520, 840)}
    <div class="abs" style="left:780px;right:140px;top:0;bottom:60px;display:flex;flex-direction:column;justify-content:center;gap:40px">
      <div>${tag('Слайд Оли')}</div>
      <div class="serif g-txt" style="font-size:${s.hs || 86}px;line-height:1.02"><i>${s.h}</i></div>
      <img src="${u('diamond.png')}" style="width:220px;margin-left:-20px">
      <div class="caps" style="font-size:24px;letter-spacing:.24em">Отвечает Ольга Новикова · психолог</div>
    </div>`,
  code: s => `${bg()}
    <div class="abs" style="left:150px;top:100px;width:1060px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div>${tag(s.tag || 'Кодовое слово')}</div>${H(s.h, s.hs || 80)}
      ${s.items ? items(s.items, { ts: 'font-size:31px', pad: '18px 30px' }) : ''}
      ${s.lead ? `<div class="p">${s.lead}</div>` : ''}
    </div>
    <div class="abs" style="left:1260px;right:120px;top:120px;bottom:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center">
      <div class="qr"><img src="${u('qr_yoursksu2.png')}"></div>
      <div class="caps" style="font-size:24px">Напиши слово</div>
      ${[].concat(s.word).map(w => `<span class="pill word" style="${[].concat(s.word).length > 1 ? 'font-size:34px;padding:16px 44px' : ''}"><b>${w}</b></span>`).join('')}
      <div class="caps" style="font-size:28px;color:#f3d6a6">→ @yoursksu2</div>
    </div>`,
  cover2: s => `${bg({ silk: true, silkH: 230, chand: false })}
    ${two(1080, 120)}
    <div class="abs" style="left:120px;top:200px;width:900px">
      ${tag('Из алмаза в бриллиант')}
      <div class="serif g-txt" style="font-size:130px;margin-top:34px;line-height:.95">Спасибо,<br><i>красотки</i></div>
      ${diamond(330, 'position:relative;display:block;margin:16px 0 0 220px')}
      <div class="quote" style="margin-top:10px;font-size:${s.q ? 36 : 46}px;max-width:860px">${s.q || 'В 2027-й заходит новая ты'}</div>
      <div class="caps" style="font-size:20px;letter-spacing:.3em;margin-top:40px;color:rgba(236,201,150,.75)">Ксюша @iamheyksusha · Оля @ola_nvkv</div>
    </div>`,
  case: s => `${bg()}${s.ph.length > 1 ? arch(s.ph[0], s.pos?.[0] || '50% 30%', 1080, 140, 340, 640) + arch(s.ph[1], s.pos?.[1] || '50% 30%', 1460, 220, 340, 640) : arch(s.ph[0], s.pos?.[0] || '50% 30%')}
    <div class="abs" style="left:150px;top:100px;width:860px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:26px">
      <div>${tag(s.tag || 'Кейс ученицы')}</div>${H(s.name + '<br><i>' + s.sub + '</i>', s.hs || 84)}
      <div class="card" style="padding:24px 32px"><div class="caps" style="font-size:19px;letter-spacing:.24em;color:#a9998a;margin-bottom:6px">◇ Было</div><div class="p" style="font-size:31px;color:#cdbfae">${s.before}</div></div>
      <div class="card" style="padding:24px 32px;border-color:rgba(236,201,150,.8)"><div class="caps" style="font-size:19px;letter-spacing:.24em;color:#f3d6a6;margin-bottom:6px">◆ Стало</div><div class="p" style="font-size:31px">${s.after}</div></div>
      ${s.q ? `<div class="quote" style="font-size:38px">${s.q}</div>` : ''}
    </div>`,
  chain: s => `${bg()}
    <div class="abs" style="left:150px;right:150px;top:90px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:46px">
      <div>${tag(s.tag)}</div>${H(s.h, 88)}
      <div style="display:flex;align-items:center;gap:14px">${s.links.map((t, i) => `<div class="card" style="flex:1;text-align:center;padding:30px 14px"><div class="num" style="margin:0 auto 16px">${i + 1}</div><div class="t" style="font-size:29px">${t}</div></div>${i < s.links.length - 1 ? '<div class="serif g-txt" style="font-size:54px">→</div>' : ''}`).join('')}</div>
      <div style="text-align:center"><span class="pill" style="font-size:30px;padding:20px 50px">${s.res}</span></div>
      ${s.q ? `<div class="quote" style="text-align:center">${s.q}</div>` : ''}
    </div>`,
  bridge: s => `${bg()}${s.ph ? arch(s.ph, s.pos) : ''}
    <div class="abs" style="left:150px;top:100px;width:${s.ph ? 1000 : 1620}px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div>${tag(s.tag)}</div>${H(s.h || 'Почему без этого <i>не получится</i>', s.hs || 84)}
      <div class="card" style="padding:30px 36px"><div class="caps" style="font-size:20px;letter-spacing:.24em;color:#f3d6a6;margin-bottom:10px">Почему это важно</div><div class="p" style="font-size:33px">${s.why}</div></div>
      <div class="card" style="padding:30px 36px"><div class="caps" style="font-size:20px;letter-spacing:.24em;color:#f3d6a6;margin-bottom:10px">Что будет, если оставить как есть</div><div class="p" style="font-size:33px">${s.next}</div></div>
      <div><span class="pill" style="font-size:24px">→ В программе: ${s.prog}</span></div>
    </div>`,
  route: s => { const G = require('./deck4_data').GR; return `${bg()}
    <div class="abs" style="left:150px;right:150px;top:90px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:40px">
      <div>${tag(s.k ? `Маршрут огранки · грань ${s.k} из 5` : 'Маршрут огранки · скринь')}</div>
      ${H(s.k ? G[s.k - 1].t : 'Сегодня — <i>5 граней тебя</i>', s.k ? 92 : 96)}
      <div style="display:flex;gap:18px">${G.map((g, i) => { const cur = s.k === i + 1, past = s.k && i + 1 < s.k; return `<div class="card" style="flex:1;padding:28px 20px;text-align:center;${cur ? 'border:2px solid #f0cf98;box-shadow:0 0 50px rgba(240,207,152,.25);background:linear-gradient(160deg,rgba(110,72,40,.7),rgba(30,18,10,.8))' : ''};${past ? 'opacity:.45' : ''}"><div class="serif g-txt" style="font-size:30px;letter-spacing:.2em">${past ? '✓' : '◆'} ${i + 1}</div><div class="t" style="font-size:28px;margin-top:12px">${g.s}</div></div>`; }).join('')}</div>
      ${s.k ? `<div class="quote" style="text-align:center">${G[s.k - 1].d}</div>` : `<div class="quote" style="text-align:center">Каждая грань — то, что сейчас закрывает твой блеск</div>`}
    </div>`; },
  about: s => `${bg()}${s.two ? two() : s.wide ? arch(s.ph, s.pos, 1120, 150, 680, 760) : arch(s.ph, s.pos)}
    <div class="abs" style="left:150px;top:100px;width:${s.two ? 880 : s.wide ? 900 : 1000}px;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:28px">
      <div>${tag(s.tag)}</div>${H(s.h, s.hs || 84)}
      ${s.body}
    </div>`,
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [i, s] of S.entries()) {
    const n = i + 1; if (ONLY && !ONLY.includes(n)) continue;
    const html = `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${L[s.type](s)}<div class="foot">◆ Из алмаза в бриллиант · ${String(n).padStart(2, '0')} ◆</div></body></html>`;
    const tmp = path.join(OUT, '_s.html'); fs.writeFileSync(tmp, html);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, `Слайд_${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  fs.rmSync(path.join(OUT, '_s.html'), { force: true });
  await b.close();
})();
