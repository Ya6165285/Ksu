const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const L = require('./lib'); const IMG = L.IMG; const F = path.resolve(__dirname, '../fonts');
const FONTS = `<style>@font-face{font-family:GV;src:url(file://${F}/fontsource-great-vibes/files/great-vibes-cyrillic-400-normal.woff2)}
@font-face{font-family:GV;src:url(file://${F}/fontsource-great-vibes/files/great-vibes-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}
.scr{font-family:GV,cursive;display:inline-block;padding:0 .12em .1em 0;background:linear-gradient(100deg,#F0479A 0%,#ff9fd0 28%,#fff0f7 42%,#ff7ab8 58%,#F0479A 75%,#ffc3e1 100%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 14px rgba(240,71,154,.75))}</style>`;
const tape = (css) => `<div style="position:absolute;${css};width:200px;height:56px;background:linear-gradient(90deg,#F0479A,#F678B4);z-index:4"></div>`;
const pic = (src, css, w, h, rot, pos) => `<div style="position:absolute;${css};transform:rotate(${rot}deg);z-index:3">
  <div style="width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;border:6px solid rgba(255,255,255,.95);box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 50px rgba(240,71,154,.35)"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"></div></div>`;
const heart = (x, y, s, r) => `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);z-index:6" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.4 4.5 6.3 4.5c2.3 0 3.9 1.3 5.7 3.4 1.8-2.1 3.4-3.4 5.7-3.4 3.9 0 5.9 4 4.3 7.2C19.5 16.4 12 21 12 21z" fill="#F0479A"/></svg>`;
const sp = (x, y, s) => `<div style="position:absolute;left:${x}px;top:${y}px;color:#fff;font-size:${s}px;z-index:6;text-shadow:0 0 12px #ff9fd0">✦</div>`;
const html = `${FONTS}<section class="slide" style="width:1080px;height:1920px;padding:0;background:radial-gradient(circle at 100% 0%,rgba(240,71,154,.34),rgba(240,71,154,0) 45%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.24),rgba(240,71,154,0) 42%),#0B0B0D">
 <div class="grid"></div><div class="petal"></div>
 <div style="position:absolute;left:70px;right:70px;top:110px;z-index:5;text-align:center">
  <span class="tag" style="font-size:34px;padding:16px 36px;letter-spacing:.2em;background:rgba(11,11,13,.75)"><b style="font-size:38px">✦</b>Girls day · online</span>
  <div class="scr" style="font-size:170px;line-height:1.05;margin-top:24px">онлайн-девичник</div>
 </div>
 ${pic(`file://${IMG}/party.jpg`, 'right:70px;top:450px', 470, 760, 6, '50% 40%')}
 ${pic(`file://${IMG}/pajama2.jpg`, 'left:60px;top:620px', 560, 640, -4, '50% 30%')}
 ${tape('left:30px;top:600px;transform:rotate(-30deg)')}${tape('right:20px;top:440px;transform:rotate(32deg)')}${tape('left:470px;top:1230px;transform:rotate(28deg)')}
 ${heart(860, 1240, 70, 12)}${heart(80, 470, 56, -15)}${sp(640, 520, 40)}${sp(980, 1280, 30)}${sp(60, 1330, 28)}
 <div style="position:absolute;left:70px;right:70px;top:1340px;z-index:5;text-align:center">
  <div style="font:700 118px/0.98 Osw;text-transform:uppercase;background:linear-gradient(180deg,#fff 30%,#dcdce2);-webkit-background-clip:text;color:transparent">Давай найдём</div>
  <div style="font:700 118px/1 Osw;text-transform:uppercase;color:#F0479A;text-shadow:0 0 40px rgba(240,71,154,.6)">тебе любовь! ❤️</div>
  <div class="btn" style="margin-top:44px;font-size:46px;padding:20px 46px;box-shadow:0 0 50px rgba(240,71,154,.55)">25 октября · 15:00 МСК · бесплатно</div>
 </div></section>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.resolve(__dirname, '../preview/story2.html'); fs.writeFileSync(f, L.page('story', [html]));
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await (await p.$('section')).screenshot({ path: '/home/user/Ksu/launch/covers/Сторис_онлайн_девичник.jpg', type: 'jpeg', quality: 92 });
  await b.close();
})();
