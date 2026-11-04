const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const D = '/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/bc'; const F = '/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/mdw/w/node_modules/@fontsource';
const css = `
@font-face{font-family:Corm;font-weight:600;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2)}
@font-face{font-family:Corm;font-weight:700;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2)}
@font-face{font-family:Corm;font-weight:600;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:CormI;font-style:italic;font-weight:500;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2)}
@font-face{font-family:CormI;font-style:italic;font-weight:500;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:Cav;font-weight:700;src:url(file://${F}/caveat/files/caveat-cyrillic-700-normal.woff2)}
@font-face{font-family:Cav;font-weight:700;src:url(file://${F}/caveat/files/caveat-latin-700-normal.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:Mont;font-weight:500;src:url(file://${F}/montserrat/files/montserrat-cyrillic-500-normal.woff2)}
@font-face{font-family:Mont;font-weight:500;src:url(file://${F}/montserrat/files/montserrat-latin-500-normal.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:Bod;font-weight:500;src:url(file://${F}/bodoni-moda/files/bodoni-moda-latin-500-normal.woff2)}
@font-face{font-family:Bod;font-weight:700;src:url(file://${F}/bodoni-moda/files/bodoni-moda-latin-700-normal.woff2)}
@font-face{font-family:Pin;src:url(file://${F}/pinyon-script/files/pinyon-script-latin-400-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;background:#120c08;color:#f3e6d0}
.bg{position:absolute;inset:0;background:url(file://${D}/bg.jpg) center/cover;filter:brightness(.55)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 30%,rgba(0,0,0,.65) 100%)}
.gold{font-family:Corm;font-weight:600;text-transform:uppercase;line-height:.92;letter-spacing:.01em;
  background:linear-gradient(180deg,#fff3dc 0%,#f1d9ae 45%,#c9a46a 100%);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 18px rgba(0,0,0,.6))}
.it{font-family:CormI;font-style:italic;font-weight:500;color:#f3e6d0}
.red{font-family:Cav;font-weight:700;color:#d8161c;line-height:1;transform:rotate(-6deg);filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}
.pill{display:inline-block;border:2px solid #d9b77e;border-radius:60px;padding:14px 38px;font-family:Corm;font-weight:600;font-size:36px;letter-spacing:.06em;text-transform:uppercase;color:#f3e6d0;background:rgba(20,12,8,.55)}
.tag{display:inline-block;border:1.5px solid #d9b77e;border-radius:40px;padding:8px 28px;font-family:Corm;font-weight:600;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:#f3e6d0}
.photo{position:absolute;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6);border:3px solid rgba(217,183,126,.7)}
.photo img{width:100%;height:100%;object-fit:cover}
.paper{background:#efe4d0;color:#2a1a12;border-radius:6px;padding:22px 26px;box-shadow:0 12px 30px rgba(0,0,0,.5);font-family:Cav;font-weight:700}
.abs{position:absolute}
.mont{font-family:Mont;font-weight:500}
.box{position:absolute;width:300px;height:262px}
.box .lid{position:absolute;left:-8px;right:-8px;top:0;height:46px;border-radius:4px;box-shadow:0 6px 14px rgba(0,0,0,.35)}
.box .body{position:absolute;left:0;right:0;top:40px;bottom:0;border-radius:3px;box-shadow:0 18px 40px rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:18px 18px 16px;text-align:center}
.box .brand{position:relative;z-index:2;line-height:1}
.box .t{font-size:24px !important}
.box .rv{position:absolute;left:50%;top:0;bottom:0;width:18px;margin-left:-9px}
.box .bow{position:absolute;left:50%;top:-30px;width:120px;margin-left:-60px;height:44px}
.box .bow i{position:absolute;top:6px;width:56px;height:30px;border-radius:50%}
.box .bow i:first-child{left:0;transform:rotate(-14deg)}.box .bow i:last-child{right:0;transform:rotate(14deg)}
.box .bow b{position:absolute;left:50%;top:12px;width:20px;height:20px;margin-left:-10px;border-radius:5px}
.box .t{position:relative;z-index:2;font-family:Corm;font-weight:600;font-size:31px;line-height:1.02;text-transform:uppercase;letter-spacing:.02em;padding:8px 12px;border-radius:4px}

.gb{position:absolute;width:300px;height:262px}
.gb .bd{position:absolute;left:0;right:0;top:44px;bottom:0;border-radius:4px;overflow:hidden;box-shadow:0 22px 44px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.08)}
.gb .ld{position:absolute;left:-9px;right:-9px;top:0;height:56px;border-radius:5px;overflow:hidden;box-shadow:0 8px 16px rgba(0,0,0,.45)}
.gb .sh{position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.28) 45%,rgba(255,255,255,0) 60%)}
.gb .rb{position:absolute;left:50%;top:0;bottom:0;width:22px;margin-left:-11px}
.gb .cnt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 16px 16px;z-index:3}
.gb .wm{padding:2px 12px;line-height:1;text-align:center}
.gb .tg{font-family:Corm;font-weight:600;font-size:22px;line-height:1.05;text-transform:uppercase;letter-spacing:.04em;padding:8px 14px;border-radius:3px;text-align:center}
.pill2{display:inline-block;border-radius:60px;padding:16px 44px;font-family:Corm;font-weight:700;font-size:42px;letter-spacing:.05em;text-transform:uppercase;color:#1a0f08;background:linear-gradient(180deg,#fff0d4,#d9b77e);box-shadow:0 10px 30px rgba(0,0,0,.5)}

`;
const P = (b) => `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class=bg></div><div class=vig></div>${b}</body></html>`;
const covers = {
'01_приглашение': P(`
 <div class="abs" style="left:60px;top:60px"><span class=tag>Женская встреча</span></div>
 <div class="abs gold" style="left:56px;top:145px;font-size:84px">Генеральная<br>уборка</div>
 <div class="abs it" style="left:66px;top:340px;font-size:42px;line-height:1.1">в личной жизни<br>перед 2027 годом</div>
 <div class="photo" style="right:44px;top:70px;width:330px;height:480px;transform:rotate(2deg)"><img src="file://${D}/her.jpg"></div>
 <div class="abs red" style="left:66px;top:470px;font-size:58px">3 подарка — тем,<br>кто будет до конца ♡</div>
 <div class="gb" style="left:46px;top:640px;transform:rotate(-2deg)"><div class="bd" style="background:linear-gradient(160deg,#f6904a 0%,#ea7425 45%,#c95b14 100%)"><div style="position:absolute;inset:0;border:3px solid #6b3f1d;border-radius:4px;opacity:.75"></div><div class="sh"></div><div class="cnt"><div class="wm" style="color:#4b2a12"><div style="font-family:Bod;font-weight:500;font-size:40px;letter-spacing:.06em">HERMÈS</div><div style="font-family:Bod;font-weight:500;font-size:14px;letter-spacing:.55em;margin-top:4px;padding-left:.55em">PARIS</div></div><div class="tg" style="background:#fff7ee;color:#4b2a12">20 вопросов, прежде<br>чем влюбиться</div></div></div><div class="ld" style="background:linear-gradient(180deg,#fa9b55,#e46e1f 70%,#b9520f)"><div style="position:absolute;inset:0;border:3px solid #6b3f1d;border-radius:4px;opacity:.75"></div><div class="rb" style="background:linear-gradient(90deg,#5b3519,#9a6a44 50%,#5b3519)"></div><div class="sh"></div></div><svg style="position:absolute;left:50%;top:-56px;margin-left:-72px;z-index:4;filter:drop-shadow(0 5px 6px rgba(0,0,0,.45))" width="144" height="84" viewBox="0 0 144 84"><defs><linearGradient id="g5b3519" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a44"/><stop offset="1" stop-color="#5b3519"/></linearGradient></defs><path d="M72 64 C42 8,4 12,10 46 C14 68,50 68,72 64Z" fill="url(#g5b3519)"/><path d="M72 64 C102 8,140 12,134 46 C130 68,94 68,72 64Z" fill="url(#g5b3519)"/><path d="M64 64 L44 84 M80 64 L100 84" stroke="#5b3519" stroke-width="13" stroke-linecap="round"/><rect x="59" y="51" width="26" height="24" rx="7" fill="#5b3519"/><path d="M72 60 C54 28,26 26,22 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/><path d="M72 60 C90 28,118 26,122 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/></svg></div><div class="gb" style="left:390px;top:628px;transform:rotate(1.5deg)"><div class="bd" style="background:linear-gradient(160deg,#ffffff 0%,#f1eeea 50%,#d8d3cc 100%)"><div class="sh"></div><div class="cnt"><div class="wm" style="color:#111"><div style="font-family:Bod;font-weight:500;font-size:50px;letter-spacing:.22em;padding-left:.22em">DIOR</div></div><div class="tg" style="background:#111;color:#f4efe6">Как просить,<br>не выпрашивая</div></div></div><div class="ld" style="background:linear-gradient(180deg,#ffffff,#ece8e2 70%,#cfc9c1)"><div class="rb" style="background:linear-gradient(90deg,#0d0d0d,#4a4a4a 50%,#0d0d0d)"></div><div class="sh"></div></div><svg style="position:absolute;left:50%;top:-56px;margin-left:-72px;z-index:4;filter:drop-shadow(0 5px 6px rgba(0,0,0,.45))" width="144" height="84" viewBox="0 0 144 84"><defs><linearGradient id="g0d0d0d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset="1" stop-color="#0d0d0d"/></linearGradient></defs><path d="M72 64 C42 8,4 12,10 46 C14 68,50 68,72 64Z" fill="url(#g0d0d0d)"/><path d="M72 64 C102 8,140 12,134 46 C130 68,94 68,72 64Z" fill="url(#g0d0d0d)"/><path d="M64 64 L44 84 M80 64 L100 84" stroke="#0d0d0d" stroke-width="13" stroke-linecap="round"/><rect x="59" y="51" width="26" height="24" rx="7" fill="#0d0d0d"/><path d="M72 60 C54 28,26 26,22 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/><path d="M72 60 C90 28,118 26,122 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/></svg></div><div class="gb" style="left:734px;top:642px;transform:rotate(-1deg)"><div class="bd" style="background:linear-gradient(160deg,#a4162a 0%,#7d0b1b 50%,#560510 100%)"><div style="position:absolute;inset:10px;border:2px solid #d4af6a;border-radius:2px"></div><div style="position:absolute;inset:16px;border:1px dotted #d4af6a;border-radius:2px;opacity:.8"></div><div class="sh"></div><div class="cnt"><div class="wm"><div style="font-family:Pin;font-size:58px;background:linear-gradient(180deg,#fff0c2,#d4af6a 60%,#a67c32);-webkit-background-clip:text;color:transparent">Cartier</div></div><div class="tg" style="background:rgba(30,2,6,.65);color:#f3dc9e;border:1px solid #d4af6a">Ты не любишь,<br>ты терпишь</div></div></div><div class="ld" style="background:linear-gradient(180deg,#b01c31,#850d1f 70%,#5a0612)"><div style="position:absolute;inset:6px;border:2px solid #d4af6a;border-radius:2px"></div><div style="position:absolute;inset:16px;border:1px dotted #d4af6a;border-radius:2px;opacity:.8"></div><div class="rb" style="background:linear-gradient(90deg,#b88a3e,#f3dc9e 50%,#b88a3e)"></div><div class="sh"></div></div><svg style="position:absolute;left:50%;top:-56px;margin-left:-72px;z-index:4;filter:drop-shadow(0 5px 6px rgba(0,0,0,.45))" width="144" height="84" viewBox="0 0 144 84"><defs><linearGradient id="gb88a3e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dc9e"/><stop offset="1" stop-color="#b88a3e"/></linearGradient></defs><path d="M72 64 C42 8,4 12,10 46 C14 68,50 68,72 64Z" fill="url(#gb88a3e)"/><path d="M72 64 C102 8,140 12,134 46 C130 68,94 68,72 64Z" fill="url(#gb88a3e)"/><path d="M64 64 L44 84 M80 64 L100 84" stroke="#b88a3e" stroke-width="13" stroke-linecap="round"/><rect x="59" y="51" width="26" height="24" rx="7" fill="#b88a3e"/><path d="M72 60 C54 28,26 26,22 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/><path d="M72 60 C90 28,118 26,122 44" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/></svg></div>
 <div class="abs" style="left:0;right:0;bottom:56px;text-align:center"><span class=pill>Воскресенье, 13:00 по МСК</span></div>`),
'02_красный_флаг': P(`
 <div class="photo" style="right:70px;top:90px;width:360px;height:360px;border-color:rgba(216,22,28,.6)"><img src="file://${D}/man.jpg" style="filter:brightness(.9)"></div>
 <svg class="abs" style="right:70px;top:90px" width="360" height="360"><path d="M30 40 L330 320 M320 30 L40 330" stroke="#d8161c" stroke-width="16" stroke-linecap="round" opacity=".9"/></svg>
 <div class="abs" style="left:64px;top:80px"><span class=tag>🚩 Красный флаг</span></div>
 <div class="abs gold" style="left:60px;top:170px;font-size:104px">Если он<br>говорит<br>это…</div>
 <div class="abs paper" style="left:70px;top:540px;width:600px;font-size:54px;line-height:1.05;transform:rotate(-2deg)">«Все мои бывшие были сумасшедшими»</div>
 <div class="abs red" style="left:470px;top:760px;font-size:76px">даже не начинай<br>влюбляться!</div>
 <div class="abs" style="left:64px;bottom:60px"><span class=pill>Воскресенье, 13:00 по МСК</span></div>`),
'03_завтра': P(`
 <div class="photo" style="right:56px;top:70px;width:420px;height:760px"><img src="file://${D}/her_tall.jpg" style="object-position:50% 0"></div>
 <div class="abs" style="left:64px;top:80px"><span class=tag>Обратный отсчёт</span></div>
 <div class="abs gold" style="left:56px;top:170px;font-size:122px">Завтра</div>
 <div class="abs gold" style="left:60px;top:300px;font-size:112px">13:00</div>
 <div class="abs it" style="left:66px;top:440px;font-size:42px;line-height:1.15">генеральная уборка<br>в личной жизни</div>
 <div class="abs red" style="left:70px;top:630px;font-size:66px">не бери его<br>в 2027-й! ♡</div>
 <div class="abs it" style="left:66px;top:840px;font-size:36px">Записи не будет</div>
 <div class="abs" style="left:0;right:0;bottom:56px;text-align:center"><span class=pill2>⏰ Поставь будильник на 12:55</span></div>`),
'04_мы_в_эфире': P(`
 <div class="photo" style="left:56px;top:70px;width:450px;height:830px;transform:rotate(-1.5deg)"><img src="file://${D}/her_tall.jpg" style="object-position:50% 0"></div>
 <div class="abs" style="left:560px;top:110px"><span class=tag style="border-color:#d8161c"><span style="color:#ff2a2a">●</span> Live</span></div>
 <div class="abs gold" style="left:556px;top:200px;font-size:120px">Мы<br>в эфире</div>
 <div class="abs it" style="left:562px;top:460px;font-size:40px;line-height:1.15">наводим порядок<br>в личной жизни<br>прямо сейчас</div>
 <div class="abs red" style="left:560px;top:660px;font-size:62px">подарки — тем,<br>кто до конца ♡</div>
 <div class="abs" style="left:0;right:0;bottom:60px;text-align:center"><span class=pill>Заходи, пока не начались разборы</span></div>`),
'05_по_секрету': P(`
 <div class="abs" style="left:0;right:0;top:120px;text-align:center"><span class=tag>🤫 Секрет</span></div>
 <div class="abs red" style="left:0;right:0;top:230px;text-align:center;font-size:110px;transform:rotate(-4deg)">По секрету…</div>
 <div class="abs gold" style="left:80px;right:80px;top:430px;text-align:center;font-size:78px;line-height:1.02">Я ещё никогда<br>этого не говорила</div>
 <div class="abs it" style="left:120px;right:120px;top:660px;text-align:center;font-size:42px;line-height:1.2">В конце эфира — то, чего не было на девичнике.<br>Только для тех, кто будет онлайн</div>
 <div class="abs" style="left:0;right:0;bottom:90px;text-align:center"><span class=pill>Воскресенье, 13:00 по МСК</span></div>`),
'06_сегодня_секрет': P(`
 <div class="abs" style="left:0;right:0;top:110px;text-align:center"><span class=tag>Сегодня · 13:00 по МСК</span></div>
 <div class="abs gold" style="left:70px;right:70px;top:230px;text-align:center;font-size:84px;line-height:1.02">Сегодня ты услышишь<br>то, о чём подруги<br>тебе не скажут</div>
 <div class="abs red" style="left:0;right:0;top:600px;text-align:center;font-size:76px">…и мама тоже ♡</div>
 <div class="abs it" style="left:120px;right:120px;top:750px;text-align:center;font-size:42px;line-height:1.2">Генеральная уборка в личной жизни.<br>Записи не будет</div>
 <div class="abs" style="left:0;right:0;bottom:80px;text-align:center"><span class=pill2>Наливай чай, бери блокнот</span></div>`),
};
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  fs.mkdirSync(process.argv[2], { recursive: true });
  for (const [n, h] of Object.entries(covers)) {
    fs.writeFileSync(D + '/t.html', h); await pg.goto('file://' + D + '/t.html'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(200);
    await pg.screenshot({ path: process.argv[2] + '/' + n + '.jpg', type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
