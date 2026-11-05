const path=require('path'),fs=require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const F=process.argv[2], OUT=process.argv[3], IMG='/home/user/Ksu/launch/guides2/img';
const ff=(fam,file,extra='')=>`@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
const css=`${ff('Corm','cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Corm','cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2','font-weight:700;unicode-range:U+0000-00FF;')}
${ff('CormI','cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2','font-style:italic;font-weight:500;')}
${ff('Cav','caveat/files/caveat-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-400-normal.woff2','font-weight:400;')}
${ff('Mont','montserrat/files/montserrat-latin-400-normal.woff2','font-weight:400;unicode-range:U+0000-00FF,U+2000-206F;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-600-normal.woff2','font-weight:600;')}
${ff('Mont','montserrat/files/montserrat-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Osw','oswald/files/oswald-cyrillic-700-normal.woff2','font-weight:700;')}
${ff('Osw','oswald/files/oswald-latin-700-normal.woff2','font-weight:700;unicode-range:U+0000-00FF;')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;background:#120c08;color:#efe3cf;font-family:Mont}
.bg{position:absolute;inset:-40px;background:url(file://${IMG}/bgwide.jpg) center/cover}
.tag{position:absolute;left:120px;top:90px;border:2px solid #d9b77e;border-radius:50px;padding:8px 28px;font-family:Mont;font-weight:600;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:#f3e6d0}
.h{position:absolute;left:120px;top:160px;right:120px;font-family:Osw;font-weight:700;text-transform:uppercase;font-size:92px;line-height:1;color:#f3dcae}
.h .r{font-family:Cav;text-transform:none;color:#e2242b;font-size:.85em}
.grid{position:absolute;left:120px;right:120px;display:grid;gap:28px}
.c{background:rgba(255,255,255,.06);border:2px solid rgba(217,183,126,.45);border-radius:26px;padding:34px 38px}
.c .n{font-family:Osw;font-weight:700;font-size:56px;color:#e8c886;line-height:1}
.c .t{font-weight:700;font-size:40px;color:#fff3dc;margin:10px 0 8px;line-height:1.15}
.c .d{font-size:30px;line-height:1.35;color:#e6d6bd}
.bottom{position:absolute;left:120px;right:120px;bottom:90px;font-family:Cav;font-weight:700;font-size:64px;color:#e2242b;text-align:center}
.foot{position:absolute;left:120px;right:120px;bottom:30px;display:flex;justify-content:space-between;font-family:Mont;font-weight:600;font-size:18px;letter-spacing:.2em;color:rgba(243,230,208,.5);text-transform:uppercase}
.ph{position:absolute;top:90px;bottom:90px;right:110px;width:560px;border-radius:30px;overflow:hidden;border:4px solid #c9a46a}.ph img{width:100%;height:100%;object-fit:cover;object-position:50% 25%}
`;
const P=b=>`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body><div class="bg"></div>${b}<div class="foot"><span>Hey Ksusha ♥ Генеральная уборка</span><span>Остановка 1 · самоценность</span></div></body></html>`;
const S={
'a':P(`<div class="tag">Остановка 1 · Самоценность</div><div class="h">Самооценка <span class="r">≠</span> самоценность</div>
 <div class="grid" style="top:400px;grid-template-columns:1fr 1fr">
 <div class="c"><div class="n">Самооценка</div><div class="t">«Какая я»</div><div class="d">Красивая, умная, успешная.<br>Зависит от чужого мнения.<br>Сегодня высокая — завтра упала.</div></div>
 <div class="c" style="border-color:#e8c886;background:rgba(232,200,134,.12)"><div class="n">Самоценность</div><div class="t">«Я ценна, потому что я есть»</div><div class="d">Не зависит ни от внешности,<br>ни от денег,<br>ни от мужчины рядом.</div></div></div>
 <div class="bottom">Можно быть красивой — и всё равно терпеть</div>`),
'b':P(`<div class="tag">Остановка 1 · Самоценность</div><div class="h">6 признаков <span class="r">низкой самоценности</span></div>
 <div class="grid" style="top:360px;grid-template-columns:1fr 1fr 1fr">
 ${[['01','Радуешься «крохам»'],['02','Стыдно просить'],['03','Боишься, что найдёт лучше'],['04','Доказываешь, что хорошая'],['05','Его настроение важнее твоего'],['06','Выбираешь его — против себя']].map(([n,t])=>`<div class="c"><div class="n">${n}</div><div class="t">${t}</div></div>`).join('')}</div>
 <div class="bottom">Сколько про тебя? Напиши цифру в чат</div>`),
'c':P(`<div class="tag">Остановка 2 · Привычка терпеть</div><div class="h">Формула <span class="r">границы</span></div>
 <div class="grid" style="top:380px;grid-template-columns:repeat(4,1fr)">
 ${[['1','Когда ты…','что он делает'],['2','Я чувствую…','твоё чувство'],['3','Мне важно…','твоя потребность'],['4','Давай…','как по-другому']].map(([n,t,d])=>`<div class="c"><div class="n">${n}</div><div class="t">${t}</div><div class="d">${d}</div></div>`).join('')}</div>
 <div class="c" style="position:absolute;left:120px;right:120px;top:690px;font-size:34px;line-height:1.4">«Когда ты пропадаешь на весь вечер, <b>я волнуюсь</b>. Мне важно знать, что ты в порядке. <b>Давай ты просто напишешь "задерживаюсь"?</b>»</div>`),
'd':P(`<div class="tag">Остановка 3 · Синдром «я сама»</div><div class="h" style="right:760px">Почему тебе <span class="r">трудно просить</span></div>
 <div class="grid" style="top:400px;right:760px;grid-template-columns:1fr;gap:18px">
 ${[['01','«Просить — значит быть слабой»'],['02','«Попрошу — буду должна»'],['03','Страх отказа'],['04','«Хорошая девочка не хочет многого»'],['05','Мама всё тащила сама']].map(([n,t])=>`<div class="c" style="padding:20px 30px;display:flex;gap:24px;align-items:center"><div class="n" style="font-size:48px">${n}</div><div class="t" style="margin:0;font-size:36px">${t}</div></div>`).join('')}</div>
 <div class="ph"><img src="file://${IMG}/n_gifts.jpg"></div>`),
};
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
for(const [k,h] of Object.entries(S)){fs.writeFileSync(OUT+'/t.html',h);await pg.goto('file://'+OUT+'/t.html');await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:OUT+'/'+k+'.jpg',type:'jpeg',quality:88});}
await b.close();})();
