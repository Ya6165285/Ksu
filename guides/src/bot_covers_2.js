const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const D = '/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/bc'; const F = '/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/mdw/w/node_modules/@fontsource';
const css = `
@font-face{font-family:Corm;font-weight:600;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2)}
@font-face{font-family:Corm;font-weight:600;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:CormI;font-style:italic;font-weight:500;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2)}
@font-face{font-family:CormI;font-style:italic;font-weight:500;src:url(file://${F}/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:Cav;font-weight:700;src:url(file://${F}/caveat/files/caveat-cyrillic-700-normal.woff2)}
@font-face{font-family:Cav;font-weight:700;src:url(file://${F}/caveat/files/caveat-latin-700-normal.woff2);unicode-range:U+0000-00FF}
@font-face{font-family:Mont;font-weight:500;src:url(file://${F}/montserrat/files/montserrat-cyrillic-500-normal.woff2)}
@font-face{font-family:Mont;font-weight:500;src:url(file://${F}/montserrat/files/montserrat-latin-500-normal.woff2);unicode-range:U+0000-00FF}
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
`;
const P = (b) => `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class=bg></div><div class=vig></div>${b}</body></html>`;
const covers = {
'01_приглашение': P(`
 <div class="abs" style="left:60px;top:60px"><span class=tag>Женская встреча</span></div>
 <div class="abs gold" style="left:56px;top:145px;font-size:84px">Генеральная<br>уборка</div>
 <div class="abs it" style="left:66px;top:340px;font-size:42px;line-height:1.1">в личной жизни<br>перед 2027 годом</div>
 <div class="photo" style="right:44px;top:70px;width:330px;height:480px;transform:rotate(2deg)"><img src="file://${D}/her.jpg"></div>
 <div class="abs red" style="left:66px;top:500px;font-size:62px">3 подарка — тем,<br>кто будет до конца ♡</div>
 <div class="abs paper" style="left:60px;top:700px;width:300px;height:170px;font-size:39px;line-height:1.05;transform:rotate(-2deg)">20 вопросов, прежде чем влюбиться</div>
 <div class="abs paper" style="left:390px;top:690px;width:300px;height:170px;font-size:39px;line-height:1.05;transform:rotate(1.5deg)">Как просить, не выпрашивая</div>
 <div class="abs paper" style="left:720px;top:705px;width:300px;height:170px;font-size:39px;line-height:1.05;transform:rotate(-1deg)">Ты не любишь, ты терпишь</div>
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
 <div class="photo" style="right:56px;top:70px;width:420px;height:760px"><img src="file://${D}/her_tall.jpg"></div>
 <div class="abs" style="left:64px;top:80px"><span class=tag>Обратный отсчёт</span></div>
 <div class="abs gold" style="left:56px;top:170px;font-size:122px">Завтра</div>
 <div class="abs gold" style="left:60px;top:300px;font-size:112px">13:00</div>
 <div class="abs it" style="left:66px;top:440px;font-size:42px;line-height:1.15">генеральная уборка<br>в личной жизни</div>
 <div class="abs red" style="left:70px;top:630px;font-size:66px">не бери его<br>в 2027-й! ♡</div>
 <div class="abs it" style="left:66px;top:840px;font-size:36px">Записи не будет</div>
 <div class="abs" style="left:0;right:0;bottom:56px;text-align:center"><span class=pill>Поставь будильник на 12:55</span></div>`),
'04_мы_в_эфире': P(`
 <div class="photo" style="left:60px;top:200px;width:440px;height:560px;transform:rotate(-2deg)"><img src="file://${D}/her.jpg"></div>
 <div class="abs" style="left:560px;top:110px"><span class=tag style="border-color:#d8161c"><span style="color:#ff2a2a">●</span> Live</span></div>
 <div class="abs gold" style="left:556px;top:200px;font-size:120px">Мы<br>в эфире</div>
 <div class="abs it" style="left:562px;top:460px;font-size:40px;line-height:1.15">наводим порядок<br>в личной жизни<br>прямо сейчас</div>
 <div class="abs red" style="left:560px;top:660px;font-size:62px">подарки — тем,<br>кто до конца ♡</div>
 <div class="abs" style="left:0;right:0;bottom:60px;text-align:center"><span class=pill>Заходи, пока не начались разборы</span></div>`),
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
