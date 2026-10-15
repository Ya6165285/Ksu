const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const L = require('./lib'); const IMG = L.IMG; const F = path.resolve(__dirname, '../fonts');
const FONTS = `<style>@font-face{font-family:GV;src:url(file://${F}/fontsource-great-vibes/files/great-vibes-cyrillic-400-normal.woff2)}
@font-face{font-family:GV;src:url(file://${F}/fontsource-great-vibes/files/great-vibes-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}
.scr{font-family:GV,cursive;display:inline-block;padding:0 .12em .1em 0;background:linear-gradient(100deg,#F0479A 0%,#ff9fd0 28%,#fff0f7 42%,#ff7ab8 58%,#F0479A 75%,#ffc3e1 100%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 14px rgba(240,71,154,.75))}</style>`;
let gs = 77; const gr = () => ((gs = (gs * 9301 + 49297) % 233280) / 233280);
function glitter() { let d = '';
  for (let i = 0; i < 80; i++) { const x = gr() * 1080, y = gr() * 1080, r = gr() * 3 + .8, c = ['#ffffff', '#ff9fd0', '#F0479A', '#ffe1a8'][Math.floor(gr() * 4)]; d += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${.4 + gr() * .55}"/>`; }
  for (const [x, y, s] of [[60, 300, 26], [470, 180, 30], [470, 640, 22], [1040, 980, 26], [40, 1010, 24], [610, 1030, 20], [1010, 90, 22]]) d += `<path d="M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z" fill="#fff" style="filter:drop-shadow(0 0 8px #ff9fd0)"/>`;
  return `<svg width="1080" height="1080" style="position:absolute;left:0;top:0;z-index:7;pointer-events:none">${d}</svg>`; }
const tape = (css) => `<div style="position:absolute;${css};width:180px;height:52px;background:linear-gradient(90deg,#F0479A,#F678B4);z-index:4"></div>`;
const pic = (src, css, w, h, rot, pos) => `<div style="position:absolute;${css};transform:rotate(${rot}deg);z-index:3"><div style="width:${w}px;height:${h}px;border-radius:28px;overflow:hidden;border:6px solid rgba(255,255,255,.95);box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 50px rgba(240,71,154,.35)"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"></div></div>`;
const heart = (x, y, s, r) => `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);z-index:6" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.4 4.5 6.3 4.5c2.3 0 3.9 1.3 5.7 3.4 1.8-2.1 3.4-3.4 5.7-3.4 3.9 0 5.9 4 4.3 7.2C19.5 16.4 12 21 12 21z" fill="#F0479A"/></svg>`;
const make = (bg, dark) => `${FONTS}${dark ? '' : `<style>.grid{background-image:linear-gradient(rgba(120,40,80,.08) 2px,transparent 2px),linear-gradient(90deg,rgba(120,40,80,.08) 2px,transparent 2px)!important;background-size:260px 190px!important}.petal{display:none}.scr{background:linear-gradient(100deg,#d81f7a 0%,#F0479A 40%,#c4246f 70%,#F0479A 100%)!important;-webkit-background-clip:text!important;filter:drop-shadow(0 2px 6px rgba(240,71,154,.35))!important}</style>`}<section class="slide" style="width:1080px;height:1080px;padding:0;background:${bg}">
 <div class="grid"></div><div class="petal" style="z-index:2"></div>
 ${pic(`file://${IMG}/pajama2.jpg`, 'left:560px;top:450px', 470, 590, -5, '50% 25%')}
 ${pic(`file://${IMG}/party.jpg`, 'left:700px;top:30px', 420, 470, 7, '50% 38%')}
 ${tape('left:900px;top:20px;transform:rotate(32deg)')}${tape('left:520px;top:440px;transform:rotate(-30deg)')}${tape('left:900px;top:960px;transform:rotate(28deg)')}
 ${heart(630, 380, 64, -12)}${heart(960, 680, 52, 14)}
 <div style="position:absolute;left:56px;top:40px;bottom:56px;width:500px;z-index:6;display:flex;flex-direction:column">
  <span class="tag" style="align-self:flex-start;font-size:30px;padding:14px 30px;letter-spacing:.16em;background:${dark ? 'rgba(11,11,13,.75)' : '#2b1220'};border-color:${dark ? 'rgba(255,255,255,.22)' : '#2b1220'}"><b style="font-size:34px">✦</b>Girls day · online</span>
  <div class="scr" style="font-size:150px;line-height:1;margin-top:20px">онлайн-</div>
  <div class="scr" style="font-size:150px;line-height:1;margin-top:-20px">девичник</div>
  <div style="font:700 96px/0.98 Osw;text-transform:uppercase;${dark ? 'background:linear-gradient(180deg,#fff 30%,#dcdce2);-webkit-background-clip:text;color:transparent' : 'color:#2b1220'};margin-top:20px">Давай найдём</div>
  <div style="font:700 96px/1 Osw;text-transform:uppercase;color:#E0357F;${dark ? 'text-shadow:0 0 40px rgba(240,71,154,.6)' : ''}">тебе любовь!</div>
  <div style="flex:1"></div>
  <div class="btn" style="align-self:flex-start;font-size:40px;padding:18px 38px;box-shadow:0 0 40px rgba(240,71,154,.55)">25.10 · 15:00 МСК</div>
  <div style="font:700 34px Mont;color:${dark ? '#ffd1e8' : '#c4246f'};margin-top:14px;letter-spacing:.06em">бесплатно ♡</div>
 </div>${glitter()}</section>`;
const V = {
  'Квадрат_онлайн_девичник_бежевый': [make('radial-gradient(circle at 100% 0%,rgba(240,71,154,.18),rgba(240,71,154,0) 45%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.14),rgba(240,71,154,0) 42%),linear-gradient(160deg,#f6ece1,#ead9c8)', false)],
  'Квадрат_онлайн_девичник_розовый': [make('radial-gradient(circle at 100% 0%,rgba(240,71,154,.28),rgba(240,71,154,0) 45%),radial-gradient(circle at 0% 100%,rgba(255,255,255,.5),rgba(255,255,255,0) 42%),linear-gradient(160deg,#ffe3ef,#f8c6dc)', false)],
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [n, [html]] of Object.entries(V)) {
    const f = path.resolve(__dirname, '../preview/sqgn.html'); fs.writeFileSync(f, L.page('sq', [html]));
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await (await p.$('section')).screenshot({ path: '/home/user/Ksu/launch/covers/' + n + '.jpg', type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
