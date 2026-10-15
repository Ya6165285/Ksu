// Shared design system for the guides (matches the "Девушка на миллион" deck)
const path = require('path');
const S = path.resolve(__dirname, '..');
const F = `${S}/fonts`;
const IMG = `${S}/img`;

const css = `
@font-face{font-family:Osw;font-weight:500;src:url(file://${F}/fontsource-oswald/files/oswald-cyrillic-500-normal.woff2)}
@font-face{font-family:Osw;font-weight:600;src:url(file://${F}/fontsource-oswald/files/oswald-cyrillic-600-normal.woff2)}
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/fontsource-oswald/files/oswald-cyrillic-700-normal.woff2)}
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/fontsource-oswald/files/oswald-latin-700-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
@font-face{font-family:Mont;font-weight:400;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-400-normal.woff2)}
@font-face{font-family:Mont;font-weight:500;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-500-normal.woff2)}
@font-face{font-family:Mont;font-weight:600;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-600-normal.woff2)}
@font-face{font-family:Mont;font-weight:700;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-700-normal.woff2)}
@font-face{font-family:Mont;font-weight:400;src:url(file://${F}/fontsource-montserrat/files/montserrat-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
@font-face{font-family:Mont;font-weight:600;src:url(file://${F}/fontsource-montserrat/files/montserrat-latin-600-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
@font-face{font-family:Mont;font-weight:700;src:url(file://${F}/fontsource-montserrat/files/montserrat-latin-700-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
:root{--pink:#F0479A;--pink2:#E0357F;--bg:#0B0B0D;--card:#18181B;--line:rgba(255,255,255,.08);--txt:#ECECEC;--mut:#A3A3AB}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:1600px 900px;margin:0}
html,body{background:var(--bg)}
body{font-family:Mont,sans-serif;color:var(--txt);-webkit-font-smoothing:antialiased}
.slide{width:1600px;height:900px;position:relative;overflow:hidden;background:var(--bg);page-break-after:always;padding:70px 90px 80px}
.slide:last-child{page-break-after:auto}
.grid{position:absolute;inset:-300px;transform:rotate(-9deg);
 background-image:linear-gradient(rgba(255,255,255,.035) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.035) 2px,transparent 2px),
 linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
 background-size:260px 190px,260px 190px,65px 47px,65px 47px;pointer-events:none}
.glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.spark{position:absolute;color:#fff;font-size:26px;line-height:1;text-shadow:0 0 14px rgba(255,255,255,.8)}
.petal{position:absolute;left:0;top:0;width:200px;height:190px;background:url(file://${IMG}/p-000.jpg) 0 0/2304px 1296px no-repeat;opacity:.9}
.z{position:relative;z-index:2}
.tag{background:#0E0E11;display:inline-flex;align-items:center;gap:12px;border:1.5px solid rgba(255,255,255,.22);border-radius:999px;padding:11px 24px;font:600 15px Mont;letter-spacing:.22em;text-transform:uppercase;color:#fff}
.tag b{color:var(--pink);font-size:18px;letter-spacing:0}
.prog{display:inline-flex;gap:8px;margin-left:18px;vertical-align:middle}
.prog i{width:30px;height:8px;border-radius:9px;background:rgba(255,255,255,.14)}
.prog i.on{background:var(--pink);box-shadow:0 0 12px rgba(240,71,154,.7)}
.h{font:700 96px/1 Osw;text-transform:uppercase;letter-spacing:-.005em;margin-top:26px}
.h .w{background:linear-gradient(180deg,#fff 30%,#b9b9c0);-webkit-background-clip:text;color:transparent}
.h .p{color:var(--pink);text-shadow:0 0 34px rgba(240,71,154,.45)}
.h.m{font-size:76px}.h.s{font-size:62px}.h.xl{font-size:104px}
.sub{font:400 27px/1.35 Mont;color:#E4E4E7;margin-top:18px}
.sub b,.txt b{color:#fff;font-weight:700}.sub em,.txt em{font-style:normal;color:var(--pink);font-weight:600}
.txt{font:400 22px/1.5 Mont;color:#D7D7DC}
.txt p+p{margin-top:12px}
.card{background:linear-gradient(160deg,#1C1C20,#141417);border:1px solid var(--line);border-radius:26px;padding:26px 30px}
.card.hl{border:1.5px solid var(--pink);background:linear-gradient(150deg,rgba(240,71,154,.28),#1a1016 55%,#141417);box-shadow:0 0 40px rgba(240,71,154,.18)}
.card h4{font:700 30px/1.1 Osw;text-transform:uppercase;color:#fff;margin-bottom:10px}
.num{display:inline-flex;align-items:center;justify-content:center;min-width:48px;height:42px;padding:0 10px;border-radius:12px;border:1.5px solid rgba(240,71,154,.55);background:rgba(240,71,154,.12);font:700 22px Osw;color:var(--pink)}
.result{display:flex;align-items:center;gap:28px;border-radius:26px;padding:26px 34px;background:linear-gradient(100deg,#F25AA6,#E0357F);box-shadow:0 0 50px rgba(240,71,154,.35)}
.result .lab{flex:none;background:rgba(255,255,255,.88);color:var(--pink2);font:700 26px Osw;letter-spacing:.04em;text-transform:uppercase;border-radius:12px;padding:10px 18px}
.result .rt{font:500 23px/1.38 Mont;color:#fff}
.chain{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;font:700 21px Osw;text-transform:uppercase;letter-spacing:.02em;color:#fff}
.chain i{font-style:normal;color:var(--pink)}
.lbl{font:600 14px Mont;letter-spacing:.24em;text-transform:uppercase;color:var(--pink);margin-bottom:12px}
.cols{display:flex;gap:26px}
.col{flex:1}
.bad,.good{border-radius:24px;padding:24px 28px}
.bad{background:#151518;border:1px solid var(--line)}
.good{background:linear-gradient(150deg,rgba(240,71,154,.22),#17121a 60%);border:1.5px solid rgba(240,71,154,.6)}
.bad .lbl{color:#8E8E96}
.ul{list-style:none}
.ul li{font:400 22px/1.4 Mont;color:#E2E2E6;padding-left:30px;position:relative;margin:8px 0}
.ul li:before{content:'';position:absolute;left:4px;top:12px;width:9px;height:9px;border-radius:50%;background:var(--pink);box-shadow:0 0 10px var(--pink)}
.bad .ul li:before{background:#5c5c64;box-shadow:none}
.quote{font:500 25px/1.42 Mont;color:#fff}
.photo{position:absolute;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.08)}
.tape{position:absolute;width:190px;height:52px;background:linear-gradient(90deg,rgba(240,71,154,.92),rgba(246,120,180,.85));z-index:5;box-shadow:0 4px 18px rgba(0,0,0,.35)}
.foot{position:absolute;left:90px;right:90px;bottom:30px;display:flex;justify-content:space-between;font:600 13px Mont;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.32);z-index:3}
.foot b{color:var(--pink);font-weight:600}
.pill{display:inline-flex;align-items:center;gap:12px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);border-radius:999px;padding:12px 24px;font:500 22px Mont;color:#fff}
.pill b{font:700 34px Osw;color:var(--pink)}
.btn{display:inline-flex;align-items:center;gap:22px;border-radius:999px;padding:14px 16px 14px 34px;background:linear-gradient(100deg,#F25AA6,#E0357F);box-shadow:0 0 50px rgba(240,71,154,.45);font:700 30px Osw;text-transform:uppercase;color:#fff;letter-spacing:.02em}
.btn i{font-style:normal;width:58px;height:58px;border-radius:50%;background:#fff;color:var(--pink2);display:flex;align-items:center;justify-content:center;font:700 30px Mont}
.wm{position:absolute;font:700 520px/1 Osw;color:rgba(255,255,255,.035);right:40px;top:120px;z-index:1}
.opt{display:flex;align-items:flex-start;gap:16px;font:400 23px/1.38 Mont;color:#E2E2E6;margin:16px 0}
.opt .l{flex:none;width:38px;height:38px;border-radius:10px;background:rgba(240,71,154,.14);border:1.5px solid rgba(240,71,154,.5);color:var(--pink);font:700 18px Osw;display:flex;align-items:center;justify-content:center;margin-top:-2px}
.q{font:700 36px/1.15 Osw;text-transform:uppercase;color:#fff;margin:18px 0 18px}
.chk{display:flex;align-items:center;gap:18px;font:500 23px/1.3 Mont;color:#fff;padding:13px 0;border-bottom:1px solid var(--line)}
.chk i{flex:none;width:34px;height:34px;border-radius:9px;border:2px solid var(--pink);box-shadow:0 0 12px rgba(240,71,154,.35)}
.phrase{background:#18181B;border:1px solid var(--line);border-left:4px solid var(--pink);border-radius:18px;padding:16px 22px;font:500 21px/1.38 Mont;color:#fff}
`;

// crop of a 2000x1125-coordinate region from a program slide (2880x1620 source)
function crop(file, x, y, w, h, W, H) {
  const s = W / w;
  return `background:url(file://${IMG}/${file}) ${-x * s}px ${-y * s}px/${2000 * s}px ${1125 * s}px no-repeat;width:${W}px;height:${H}px`;
}

function deco(seed = 0) {
  const sp = [[[1290, 110], [1520, 300], [140, 820], [880, 70]], [[1480, 120], [1180, 820], [70, 640], [760, 840]], [[1350, 80], [1530, 760], [600, 860], [60, 420]]][seed % 3];
  return `<div class="grid"></div>
  <div class="glow" style="width:520px;height:520px;right:-180px;top:-200px;background:rgba(240,71,154,.18)"></div>
  <div class="glow" style="width:420px;height:420px;left:-200px;bottom:-220px;background:rgba(240,71,154,.10)"></div>
  <div class="petal"></div>
  ${sp.map(([x, y], i) => `<div class="spark" style="left:${x}px;top:${y}px;font-size:${[30, 22, 18, 24][i]}px">✦</div>`).join('')}`;
}

function foot(brand, i, n) {
  return `<div class="foot"><span>HEY KSUSHA <b>♥</b> ${brand}</span><span>${String(i).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>`;
}

function tag(t) { return `<span class="tag"><b>✦</b>${t}</span>`; }
function prog(n, k) { return `<span class="prog">${Array.from({ length: n }, (_, i) => `<i class="${i < k ? 'on' : ''}"></i>`).join('')}</span>`; }
function chain(items) { return `<div class="chain">${items.map(t => `<span>${t}</span>`).join('<i>→</i>')}</div>`; }
function result(lab, text) { return `<div class="result"><span class="lab">${lab}</span><span class="rt">${text}</span></div>`; }
function ul(items) { return `<ul class="ul">${items.map(t => `<li>${t}</li>`).join('')}</ul>`; }

function framed(style, inner, rot = 3) {
  return `<div style="position:absolute;${style};transform:rotate(${rot}deg);z-index:2">
   <div class="tape" style="right:-50px;top:-12px;transform:rotate(32deg)"></div>
   <div class="tape" style="left:-55px;bottom:-10px;transform:rotate(32deg)"></div>
   <div class="photo" style="position:relative">${inner}</div></div>`;
}

function cta(brand, i, n, seed) {
  return `<section class="slide">${deco(seed)}
  <div class="z" style="width:960px">
   ${tag('Бесплатно')}
   <div class="h m"><span class="w">Персональный разбор</span><br><span class="p">твоего маршрута</span></div>
   <div class="sub" style="margin-top:22px">Знать свою ошибку — ещё не значит изменить её. Она годами работает на автомате. На разборе мы определим:</div>
   <div style="margin-top:22px;display:grid;gap:12px">
    ${['Где сейчас ломается твой маршрут', 'Какой сценарий ты повторяешь', 'Что мешает встретить или построить отношения', 'Какая точка роста даст самый большой сдвиг', 'Пошаговый маршрут именно для тебя']
      .map(t => `<div style="display:flex;gap:16px;align-items:center;font:500 24px Mont;color:#fff"><span style="color:var(--pink);font:700 26px Mont">→</span>${t}</div>`).join('')}
   </div>
   <div style="margin-top:36px" class="btn">Заполни анкету в боте @ksu_for_girl_bot <i>→</i></div>
  </div>
  ${framed('right:150px;top:100px', `<img src="file://${IMG}/v-000.jpg" style="display:block;width:360px;height:440px;object-fit:cover;object-position:50% 18%">`, 4)}
  <div class="z" style="position:absolute;right:90px;bottom:84px;width:520px;text-align:right">
   <div class="quote" style="font-size:21px;color:#E4E4E7">«Твоя личная жизнь меняется не тогда, когда появляется новый мужчина. <span style="color:var(--pink)">А когда ты впервые выбираешь по-другому</span>»</div>
   <div style="font:700 26px Osw;color:#fff;margin-top:14px;letter-spacing:.04em">С ЛЮБОВЬЮ, КСЮША ❤</div>
  </div>
  ${foot(brand, i, n)}</section>`;
}

function page(title, slides) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body>${slides.join('\n')}</body></html>`;
}

module.exports = { css, crop, deco, foot, tag, prog, chain, result, ul, framed, cta, page, IMG };
