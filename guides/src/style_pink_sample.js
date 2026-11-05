const fs=require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const F=process.argv[2], OUT=process.argv[3], IMG='/home/user/Ksu/launch/guides2/img';
const ff=(fam,file,extra='')=>`@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
const css=`${ff('Osw','oswald/files/oswald-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Osw','oswald/files/oswald-latin-700-normal.woff2','font-weight:700;unicode-range:U+0000-00FF,U+2000-206F;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-500-normal.woff2','font-weight:500;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-600-normal.woff2','font-weight:600;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Mont','montserrat/files/montserrat-latin-600-normal.woff2','font-weight:600;unicode-range:U+0000-00FF,U+2000-206F;')}
:root{--pink:#F0479A;--pink2:#E0357F}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;color:#ECECEC;font-family:Mont;background:radial-gradient(circle at 100% 0%,rgba(240,71,154,.26),rgba(240,71,154,0) 40%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.16),rgba(240,71,154,0) 36%),#0B0B0D}
.grid{position:absolute;inset:-300px;transform:rotate(-9deg);background-image:linear-gradient(rgba(255,255,255,.035) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.035) 2px,transparent 2px);background-size:200px 150px}
.tag{position:absolute;left:120px;top:90px;background:#0E0E11;border:1.5px solid rgba(255,255,255,.22);border-radius:999px;padding:10px 26px;font:600 20px Mont;letter-spacing:.2em;text-transform:uppercase;color:#fff}
.tag:before{content:'✦ ';color:var(--pink)}
.h{position:absolute;left:120px;top:160px;right:120px;font:700 92px/1.02 Osw;text-transform:uppercase;color:#fff}
.h .p{color:var(--pink)}
.gridc{position:absolute;left:120px;right:120px;display:grid;gap:26px}
.c{background:linear-gradient(160deg,#1C1C20,#141417);border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:32px 36px}
.c.hl{border:1.5px solid var(--pink);background:linear-gradient(150deg,rgba(240,71,154,.28),#1a1016 55%,#141417)}
.num{display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:56px;padding:0 12px;border-radius:14px;border:1.5px solid rgba(240,71,154,.55);background:rgba(240,71,154,.12);font:700 32px Osw;color:var(--pink)}
.c .t{font:700 38px/1.15 Mont;color:#fff;margin-top:14px}
.c .k{font:700 52px/1 Osw;text-transform:uppercase;color:#fff}
.c .d{font:500 30px/1.4 Mont;color:#B9B9C2;margin-top:10px}
.result{position:absolute;left:120px;right:120px;bottom:100px;border-radius:26px;padding:26px 40px;background:linear-gradient(100deg,#F25AA6,#E0357F);font:700 40px Osw;text-transform:uppercase;color:#fff;text-align:center}
.foot{position:absolute;left:120px;right:120px;bottom:32px;display:flex;justify-content:space-between;font:600 17px Mont;letter-spacing:.2em;color:rgba(255,255,255,.35);text-transform:uppercase}
.ph{position:absolute;top:90px;bottom:90px;right:110px;width:560px;border-radius:30px;overflow:hidden;transform:rotate(2deg);box-shadow:0 30px 70px rgba(0,0,0,.6)}.ph img{width:100%;height:100%;object-fit:cover;object-position:50% 25%}
.tape{position:absolute;width:190px;height:52px;background:linear-gradient(90deg,#F0479A,#F678B4);z-index:5;transform:rotate(-24deg)}
`;
const P=(b,t)=>`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class="grid"></div>${b}<div class="foot"><span>Hey Ksusha ♥ Генеральная уборка</span><span>${t}</span></div></body></html>`;
const S={
'a':P(`<div class="tag">Остановка 1 · Самоценность</div><div class="h">Самооценка <span class="p">≠ самоценность</span></div>
 <div class="gridc" style="top:390px;grid-template-columns:1fr 1fr">
 <div class="c"><div class="k">Самооценка</div><div class="t">«Какая я»</div><div class="d">Красивая, умная, успешная.<br>Зависит от чужого мнения.<br>Сегодня высокая — завтра упала.</div></div>
 <div class="c hl"><div class="k">Самоценность</div><div class="t">«Я ценна, потому что я есть»</div><div class="d" style="color:#eee">Не зависит ни от внешности,<br>ни от денег, ни от мужчины рядом.</div></div></div>
 <div class="result">Можно быть красивой — и всё равно терпеть</div>`,'Остановка 1'),
'b':P(`<div class="tag">Остановка 1 · Самоценность</div><div class="h">6 признаков <span class="p">низкой самоценности</span></div>
 <div class="gridc" style="top:350px;grid-template-columns:1fr 1fr 1fr">
 ${[['01','Радуешься «крохам»'],['02','Стыдно просить'],['03','Боишься, что найдёт лучше'],['04','Доказываешь, что хорошая'],['05','Его настроение важнее твоего'],['06','Выбираешь его — против себя']].map(([n,t])=>`<div class="c"><span class="num">${n}</span><div class="t">${t}</div></div>`).join('')}</div>
 <div class="result">Сколько про тебя? Напиши цифру в чат</div>`,'Остановка 1'),
'c':P(`<div class="tag">Остановка 2 · Привычка терпеть</div><div class="h">Формула <span class="p">границы</span></div>
 <div class="gridc" style="top:340px;grid-template-columns:repeat(4,1fr)">
 ${[['1','Когда ты…','что он делает'],['2','Я чувствую…','твоё чувство'],['3','Мне важно…','твоя потребность'],['4','Давай…','как по-другому']].map(([n,t,d],i)=>`<div class="c ${i==3?'hl':''}"><span class="num">${n}</span><div class="t">${t}</div><div class="d">${d}</div></div>`).join('')}</div>
 <div class="c" style="position:absolute;left:120px;right:120px;top:660px;border-left:5px solid var(--pink);font:500 34px/1.45 Mont;color:#fff">«Когда ты пропадаешь на весь вечер, я волнуюсь. Мне важно знать, что ты в порядке. <b style="color:var(--pink)">Давай ты просто напишешь "задерживаюсь"?</b>»</div>`,'Остановка 2'),
'd':P(`<div class="tag">Остановка 3 · Синдром «я сама»</div><div class="h" style="right:760px">Почему тебе <span class="p">трудно просить</span></div>
 <div class="gridc" style="top:400px;right:760px;grid-template-columns:1fr;gap:16px">
 ${[['01','«Просить — значит быть слабой»'],['02','«Попрошу — буду должна»'],['03','Страх отказа'],['04','«Хорошая девочка не хочет многого»'],['05','Мама всё тащила сама']].map(([n,t])=>`<div class="c" style="padding:18px 28px;display:flex;gap:24px;align-items:center"><span class="num">${n}</span><div class="t" style="margin:0;font-size:34px">${t}</div></div>`).join('')}</div>
 <div class="ph"><img src="file://${IMG}/n_gifts.jpg"></div><div class="tape" style="right:560px;top:80px"></div><div class="tape" style="right:90px;bottom:70px"></div>`,'Остановка 3'),
};
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
for(const [k,h] of Object.entries(S)){fs.writeFileSync(OUT+'/t.html',h);await pg.goto('file://'+OUT+'/t.html');await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:OUT+'/'+k+'.jpg',type:'jpeg',quality:88});}
await b.close();})();
