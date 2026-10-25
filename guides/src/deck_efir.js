// Девичник «Давай найдём тебе любовь!» — презентация 16:9 в стиле «Девушка на миллион»
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const lib = require('../build/lib.js');
const S = path.resolve(__dirname, '..');
const IMG = `${S}/img`;
const OUT = process.argv[2];
const PNGDIR = process.argv[3];

const css = lib.css + `
@page{size:1920px 1080px;margin:0}
.slide{width:1920px;height:1080px;padding:90px 120px 110px}
.h{font-size:110px}.h.m{font-size:88px}.h.s{font-size:70px}.h.xl{font-size:140px}
.sub{font-size:34px}
.ul li{font-size:30px;margin:12px 0}
.card{padding:28px 34px}
.foot{left:120px;right:120px;bottom:42px}
.big{font:700 64px/1.12 Osw;text-transform:uppercase;color:#fff}
.big .p{color:var(--pink)}
.qt{font:500 44px/1.35 Mont;color:#fff}
.qt .p{color:var(--pink);font-weight:700}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px}
.c h4{font-size:34px}
.c .txt{font-size:25px}
.vote{display:flex;gap:28px;margin-top:40px}
.vote span{font:700 40px Osw;padding:16px 34px;border-radius:999px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.04);color:#fff}
.chat{display:inline-flex;align-items:center;gap:16px;border-radius:999px;padding:14px 30px;background:linear-gradient(100deg,#F25AA6,#E0357F);font:700 30px Osw;color:#fff;text-transform:uppercase;letter-spacing:.03em}
.qr{width:300px;height:300px;border-radius:26px;border:3px dashed rgba(240,71,154,.7);display:flex;align-items:center;justify-content:center;text-align:center;font:600 26px Mont;color:var(--mut);background:rgba(255,255,255,.03)}
.colbad,.colgood{border-radius:28px;padding:34px 38px}
.colbad{background:#151518;border:1px solid var(--line)}
.colgood{background:linear-gradient(150deg,rgba(240,71,154,.26),#17121a 60%);border:1.5px solid rgba(240,71,154,.6)}
.xi{list-style:none}.xi li{font:400 29px/1.35 Mont;color:#E2E2E6;margin:12px 0;padding-left:46px;position:relative}
.xi li:before{position:absolute;left:0;top:0;font:700 30px Mont}
.xi.no li:before{content:'✕';color:#7c7c86}.xi.yes li:before{content:'✓';color:var(--pink)}
.tag{font-size:21px;padding:13px 28px}.tag b{font-size:24px}
.sub{font-size:44px !important;line-height:1.35}
.txt{font-size:30px !important}
.c4 h4{font-size:30px !important;line-height:1.05}.c4 .txt{font-size:24px !important;line-height:1.35}
.slide:last-of-type{page-break-after:avoid}
.ul li{font-size:32px !important;margin:8px 0 !important;padding-left:38px}.ul li:before{width:12px;height:12px;top:18px}
.lbl{font-size:20px}
.num{min-width:64px;height:56px;font-size:30px;border-radius:14px}
.result .lab{font-size:34px}.result .rt{font-size:34px}
.phrase{font-size:46px !important}
.opt .l{width:60px;height:60px;font-size:30px !important}
.card h4{font-size:40px !important}
.foot{font-size:16px}
.h .w{background:none !important;color:#fff !important;-webkit-text-fill-color:#fff}
.cap{position:absolute;z-index:6;font:700 26px Osw;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#0E0E11;border:1.5px solid rgba(255,255,255,.25);border-radius:999px;padding:8px 22px}
`;

let N = 0; const TOTAL = () => slides.length;
const T = lib.tag, ul = lib.ul;
const img = (f, w, h, pos = '50% 30%') => `<img src="file://${IMG}/${f}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`;
const photo = (f, style, w, h, rot = 3, pos) => lib.framed(style, img(f, w, h, pos), rot);
const slides = [];
function S_(inner, seed = 0) { slides.push((i, n) => `<section class="slide">${lib.deco(seed)}${inner}${lib.foot('ДАВАЙ НАЙДЁМ ТЕБЕ ЛЮБОВЬ', i, n)}</section>`); }
const head = (tag, h, cls = '') => `${T(tag)}<div class="h ${cls}" style="margin-top:30px">${h}</div>`;
const R = f => slides.push(() => `<section class="slide" style="padding:0;background:url(file://${IMG}/${f}) center/cover no-repeat"></section>`);
const SCR = `<div style="position:absolute;right:120px;top:96px;z-index:5" class="pill"><b style="font-size:26px">📸</b>скринь этот слайд</div>`;
const gifts = (h) => ['gift1-01.jpg','gift2-01.jpg','gift3-01.jpg'].map((f,i)=>`<div style="transform:rotate(${[-3,2,-2][i]}deg);border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)"><img src="file://${IMG}/${f}" style="display:block;height:${h}px"></div>`).join('');
const qr = (f, w, cap) => `<div><div style="background:#fff;border-radius:28px;padding:18px;width:${w}px;box-shadow:0 20px 60px rgba(240,71,154,.35)"><img src="file://${IMG}/${f}" style="display:block;width:100%"></div><div style="font:600 24px Mont;color:#fff;margin-top:16px;text-align:center">${cap}</div></div>`;
const chat = t => `<div class="chat">💬 ${t}</div>`;

// ===== БЛОК 1. ОТКРЫТИЕ =====
S_(`${photo('v-000.jpg', 'right:150px;top:110px', 560, 760, 4, '50% 20%')}
<div class="z" style="width:1050px;margin-top:120px">${T('Закрытый девичник · 25 октября')}
<div class="h xl" style="margin-top:34px"><span class="w">Давай найдём</span><br><span class="p">тебе любовь!</span></div>
<div class="sub" style="margin-top:30px">Прямой эфир из Дубая · записи не будет</div></div>`, 0);

S_(`<div class="z" style="margin-top:60px">${head('Правила вечера', '<span class="w">3 правила,</span> <span class="p">чтобы это сработало</span>', 'm')}</div>
<div class="g3 z" style="margin-top:80px">${[['01', 'Записи не будет', 'Это только для тех, кто здесь'], ['02', 'Пиши в чат', 'Я вижу каждое сообщение'], ['03', 'Досиди до конца', 'Кодовое слово — и 3 подарка твои']].map(([n, h, t]) => `<div class="card c" style="height:330px"><span class="num">${n}</span><h4 style="margin-top:28px">${h}</h4><div class="txt">${t}</div></div>`).join('')}</div>`, 1);

S_(`<div class="z" style="text-align:center;margin-top:-30px">${T('Подарки тем, кто досидит до конца')}</div>
<div class="z" style="display:flex;gap:40px;justify-content:center;margin-top:40px">${gifts(780)}</div>`, 2);

S_(`<div class="z" style="margin-top:80px">${head('Знакомимся', '<span class="w">Напиши в чат</span>', 'm')}
<div style="margin-top:60px;display:grid;gap:22px;width:1100px">
${[['❤️', 'я сейчас одна'], ['💔', 'я в отношениях, но что-то не так'], ['🤍', 'хочу понять себя']].map(([e, t]) => `<div class="card" style="display:flex;gap:30px;align-items:center;font:500 40px Mont;color:#fff"><span style="font-size:52px">${e}</span>${t}</div>`).join('')}
</div></div>`, 2);

S_(`<div class="z">${head('Сегодня ты узнаешь', '<span class="w">Сегодня</span> <span class="p">ты узнаешь</span>', 'm')}</div>
<div class="g2 z" style="margin-top:36px;gap:16px">
${['Почему внешность ничего не решает и почему ты уже достойна самого лучшего мужчины', 'Почему тебя тянет к «не тем» и как перестать выбирать по старому сценарию', 'Свой тип привязанности и какой мужчина подходит именно тебе', 'Формулу отношений, в которых мужчина ухаживает, вкладывается и выбирает тебя', 'Как с первых встреч отличить «своего» мужчину от «не того»', 'Что нужно, чтобы встретить своего мужчину и не потерять его', 'Разбор 5 историй вживую и 3 подарка тем, кто досидит до конца']
  .map((t, i) => `<div class="card" style="display:flex;gap:22px;align-items:center;padding:16px 26px"><span class="num">0${i + 1}</span><span style="font:500 22px/1.3 Mont;color:#fff">${t}</span></div>`).join('')}
</div>`, 0);

// ===== БЛОК 2. Я ДО И ПОСЛЕ =====
S_(`${photo('u27.jpg', 'right:170px;top:100px', 520, 800, -3, '50% 30%')}
<div class="z" style="width:1050px;margin-top:110px">${T('Моя история')}
<div class="h m" style="margin-top:34px"><span class="w">Он изменил мне</span><br><span class="p">с моей лучшей подругой</span></div>
<div class="sub" style="margin-top:36px;width:900px">За неделю — минус 5 кг. Весёлые сторис, а внутри огромная дыра. В голове одно: «Кто может быть лучше, чем он?»</div></div>`, 1);

S_(`${photo('u28.jpg', 'right:200px;top:90px', 420, 880, 3, '50% 0%')}
<div class="z" style="width:1050px;margin-top:110px">${T('Через два месяца я вернулась')}
<div class="h m" style="margin-top:34px"><span class="w">И кажется,<br>всё наладилось…</span> <span class="p">НЕТ</span></div>
<div class="sub" style="margin-top:36px;width:950px">Я завела заметку и записывала каждый его косяк. Список рос. А я ждала, что он изменится.</div></div>`, 2);

S_(`<div class="z" style="margin-top:150px;width:1500px">${T('Точка')}
<div class="qt" style="margin-top:50px;font-size:56px">«Только такси вызови сама, ты же заработала»</div>
<div class="big" style="margin-top:70px">В ту секунду я поняла: я страдала не по нему.<br><span class="p">Я считала это нормой.</span></div></div>`, 0);

S_(`<div class="z">${T('Я до · я после')}</div>
<div class="z" style="display:flex;gap:40px;margin-top:40px">
 <div class="colbad" style="flex:1;display:flex;gap:30px">${img('u29.jpg', 250, 330, '50% 20%')}<div><div class="lbl" style="color:#8E8E96">Я ДО</div><ul class="xi no">${['не была уверена в себе', 'выбирала из неуверенности', 'мне изменяли', 'за мной не ухаживали', 'за всё платила я', 'внешность — хорошая'].map(t => `<li>${t}</li>`).join('')}</ul></div></div>
 <div class="colgood" style="flex:1;display:flex;gap:30px">${img('flowers_pink.jpg', 250, 330, '30% 20%')}<div><div class="lbl">Я ПОСЛЕ</div><ul class="xi yes">${['такая же красивая', 'мужчина красиво ухаживает', 'здоровые отношения', 'классная самооценка', 'не доказываю, что достойна', 'я выбираю'].map(t => `<li>${t}</li>`).join('')}</ul></div></div>
</div>
<div class="z big" style="margin-top:50px;font-size:46px">Внешность та же. <span class="p">Изменилось, что я считала нормой.</span></div>`, 1);

const kase = (name, res, before, after, ph) => S_(`${!ph ? '' : ph.startsWith('raw:') ? `<img src="file://${IMG}/${ph.slice(4)}" style="position:absolute;right:60px;top:0;height:1080px;z-index:2">` : photo(ph, 'right:150px;top:150px', 460, 620, 3, '50% 50%')}
<div class="z" style="width:${ph ? 1050 : 1600}px">${T('Результаты учениц')}
<div class="h m" style="margin-top:30px"><span class="w">${name}</span></div>
<div class="sub" style="color:var(--pink);font-weight:600;margin-top:10px">${res}</div>
<div class="card" style="margin-top:40px"><div class="lbl" style="color:#8E8E96">ДО</div><div class="txt" style="font-size:30px">${before}</div></div>
<div style="margin-top:24px">${lib.result('После', after)}</div></div>`, 2);
kase('Илона', 'Вышла замуж', 'Жила с синдромом «я сама». Не принимала заботу, не верила, что рядом может быть мужчина, на которого можно опереться.', 'Научилась принимать заботу, мужчины начали красиво ухаживать. Встретила того самого и вышла замуж. ▶ видео-отзыв', 'raw:ilona_crop.jpg');
kase('Анна, 27', 'Предложение через 1,5 месяца', '4 года одна. Череда женатых и «не готовых».', 'Через 1,5 месяца работы встретила мужчину, который сделал ей предложение 💍', 'u32.jpg');
kase('Лиза', 'Подарок 100 000 ₽', 'Не чувствовала своей ценности, синдром «я сама», мужчина её обесценивал.', 'Раскрыла свою ценность, и незнакомый мужчина подарил ей 100 000 ₽, просто чтобы порадовать. ▶ видео-отзыв', 'u33.jpg');

S_(`${photo('u35.jpg', 'right:130px;top:170px', 860, 560, 3, '50% 30%')}<div class="z" style="margin-top:200px;width:820px">${T('Система')}
<div class="h xl" style="margin-top:30px"><span class="p">1 000+</span><br><span class="w">учениц</span></div>
<div class="big" style="margin-top:40px">1 успех — везение.<br><span class="p">1 000 — система.</span></div></div>`, 0);

// ===== БЛОК 3. КРАСОТА =====
S_(`${lib.framed('left:1060px;top:120px', img('u30.jpg', 330, 430, '50% 30%'), -4)}<div class="cap" style="left:1110px;top:600px">тогда</div>
${lib.framed('left:1430px;top:200px', img('u31.jpg', 330, 430, '50% 25%'), 4)}<div class="cap" style="left:1480px;top:680px">сейчас</div>
<div class="z" style="width:880px;margin-top:90px">${T('Неудобная правда')}
<div class="h s" style="margin-top:30px"><span class="w">Почему неважно,</span><br><span class="p">какая ты внешне</span></div>
<div class="sub" style="margin-top:36px">Красота открывает дверь. Но удерживают, выбирают в жёны и носят на руках <b>не за неё.</b></div>
<div class="sub" style="margin-top:24px">Красота имеет смысл, только если к ней есть <em>знания о себе, о мужчинах и об отношениях.</em></div></div>`, 1);

// ===== БЛОК 4 =====
S_(`<div class="z" style="margin-top:90px">${head('Знакомо?', '<span class="w">Три мысли,</span> <span class="p">которые держат тебя одной</span>', 's')}
<div style="margin-top:60px;display:grid;gap:24px;width:1300px">${['«Нормальных мужчин не осталось»', '«Мне просто не везёт»', '«Наверное, со мной что-то не так»'].map(t => `<div class="phrase" style="font-size:40px">${t}</div>`).join('')}</div></div>`, 2);

S_(`<div class="z">${head('Причина 1 · сценарий', '<span class="w">Мы повторяем то,</span><br><span class="p">что когда-то было знакомо</span>', 's')}</div>
<div class="g3 z" style="margin-top:70px">${[['«Меня бросят»', 'Цепляешься и боишься, что уйдёт'], ['«Со мной что-то не так»', 'Ищешь причину в себе'], ['«Мои чувства неважны»', 'Молчишь о желаниях']].map(([h, t], i) => `<div class="card c" style="height:280px"><span class="num">0${i + 1}</span><h4 style="margin-top:24px">${h}</h4><div class="txt">${t}</div></div>`).join('')}</div>`, 0);

S_(`<div class="z" style="margin-top:110px;width:1500px">${T('Причина 2 · качели')}
<div class="h" style="margin-top:30px"><span class="w">Искра ≠ любовь.</span><br><span class="p">Часто искра = тревога</span></div>
<div class="sub" style="margin-top:40px;width:1200px">То пишет, то пропадает — и мозг принимает качели за химию. А с надёжным «скучно».</div>
<div class="big" style="margin-top:50px;font-size:52px">Тебя тянет не к лучшему. <span class="p">Тебя тянет к знакомому.</span></div></div>`, 1);

S_(`<div class="z">${head('Причина 3 · тип привязанности', '<span class="w">Мини-тест.</span> <span class="p">Запомни свою букву</span>', 's')}
<div class="q" style="margin-top:40px;font-size:44px">После хорошего свидания он не пишет 5 часов. Что ты делаешь?</div>
<div style="width:1500px">${[['А', 'Спокойно живу свою жизнь: он занят, напишет'], ['Б', 'Проверяю, был ли в сети, перечитываю переписку, пишу ещё раз'], ['В', 'Сама отдаляюсь: мне и одной нормально'], ['Г', 'То хочу написать 10 сообщений, то заблокировать']].map(([l, t]) => `<div class="opt" style="font-size:34px;margin:22px 0"><span class="l">${l}</span>${t}</div>`).join('')}</div></div>`, 2);

const pair = (tag, h1, h2, signsT, signs, why) => S_(`<div class="z">${head(tag, `<span class="w">${h1}</span> <span class="p">→ ${h2}</span>`, 's')}</div>
<div class="z" style="display:flex;gap:34px;margin-top:50px">
<div class="card" style="flex:1.2"><div class="lbl">${signsT}</div>${ul(signs)}</div>
<div class="card hl" style="flex:1"><div class="lbl">Почему тянет</div><div class="txt" style="font-size:29px">${why}</div><div style="margin-top:34px">${chat('Если это про тебя — поставь +')}</div></div></div>`, 0);
pair('Тип Б · тревожная', 'Тревожная', 'избегающий', 'Признаки избегающего мужчины', ['После хорошего свидания пропадает', '«Зачем ярлыки, нам же хорошо»', '«Я сейчас не готов к серьёзному»', 'После близости нужна «дистанция»', 'Не знакомит с друзьями, нет планов'], 'Его холодность включает твою тревогу, а тревогу ты принимаешь за любовь. Когда он возвращается — это не счастье, а облегчение.');
pair('Тип В · избегающая', 'Избегающая', 'недоступные', 'Кого она выбирает', ['Женатых и «не готовых»', 'Живущих в другом городе', 'Или удобных, которых не уважает', 'От тех, кто выбирает её, — бежит'], 'Близость пугает. С недоступным безопасно: настоящей близости всё равно не будет. Хочет семью, а выбирает тех, с кем её не будет.');
pair('Тип Г · тревожно-избегающая', 'Тревожно-избегающая', '«американские горки»', 'Признаки такого мужчины', ['Бешеная страсть с первых дней', 'Ссоры и примирения по кругу', 'Ревность, драма, громкие слова'], 'Такие отношения повторяют знакомый хаос: любовь и боль рядом. Спокойная любовь кажется ненастоящей.');
S_(`<div class="z">${head('Тип А · надёжная', '<span class="w">Надёжный мужчина,</span><br><span class="p">которого вы называете «скучным»</span>', 's')}</div>
<div class="g2 z" style="margin-top:50px;width:1500px">${['Пишет, когда обещал, и держит слово', 'Говорит о чувствах прямо, без игр', 'Сам заводит разговор о будущем', 'Знакомит тебя с друзьями', 'В ссоре говорит «давай разберёмся»', 'Спокойно принимает твоё «нет»'].map(t => `<div class="card" style="font:500 30px Mont;color:#fff"><span style="color:var(--pink)">✓</span> ${t}</div>`).join('')}</div>
<div class="z big" style="margin-top:44px;font-size:44px">Многие встречали такого. <span class="p">И отказали: «не было искры».</span></div>`, 1);

S_(`<div class="z" style="margin-top:120px;text-align:center">${T('Главный интерактив')}
<div class="h s" style="margin-top:30px"><span class="w">Вспомни последних 2–3 мужчин</span></div>
<div class="card hl" style="margin:60px auto 0;width:1400px;text-align:left;padding:46px 56px"><div class="qt" style="font-size:48px">Я ХОЧУ мужчину, который <span class="p">________</span>,<br>а ВЫБИРАЮ тех, кто <span class="p">________</span></div></div>
<div style="margin-top:50px">${chat('Напиши в чат')}</div></div>`, 2);

S_(`<div class="z">${head('Причина 4 · самоценность', '<span class="w">Мужчина рядом — отражение того,</span><br><span class="p">сколько ты себе разрешаешь</span>', 's')}</div>
<div class="z" style="margin-top:50px;width:1400px">${ul(['Соглашаешься на меньшее: «ну он же неплохой»', 'Вкладываешься больше него, чтобы не бросили', 'Оправдываешься там, где не виновата', 'Не замечаешь достойных: «такой на меня не посмотрит»'])}
<div class="big" style="margin-top:40px;font-size:44px">Не веришь, что достойна, — <span class="p">рядом будет тот, кто ниже уровнем.</span></div></div>`, 0);

S_(`${SCR}<div class="z" style="margin-top:180px;text-align:center">${T('Запомни')}
<div class="h xl" style="margin-top:30px"><span class="w">Химия</span> <span class="p">≠</span> <span class="w">совместимость</span></div>
<div style="margin-top:60px;display:flex;justify-content:center">${lib.chain(['чувства', 'факты', 'время']).replace(/→/g,'+')}</div>
<div class="sub" style="margin-top:40px">Бабочки в животе — это не умение любить</div></div>`, 1);
// ===== БЛОК 5. БОЛЬ =====
S_(`<div class="z">${head('Если ничего не менять', '<span class="w">Проходит ещё год.</span> <span class="p">Та же точка</span>', 's')}</div>
<div class="g2 z" style="margin-top:46px">${['Первые недели идеальный, потом резко меняется', 'Годами не можешь никого найти', 'Отношения рушатся через 3–6 месяцев в одной точке', 'В отношениях, но одиноко: всё тащишь сама', 'Молчишь, копишь и взрываешься', 'Тебе 30, а ты всё ещё «ждёшь своего»'].map(t => `<div class="card" style="font:500 29px/1.35 Mont;color:#fff">${t}</div>`).join('')}</div>
<div class="z" style="margin-top:40px">${lib.chain(['Новый мужчина', 'старые страхи', 'старые реакции', 'тот же финал'])}</div>`, 1);

R('route3-03.jpg');
R('route20-20.jpg');

// ===== БЛОК 6. ФОРМУЛА =====
R('route5-05.jpg');

const F7 = [['Самоценность', 'Ты — Ламборгини, а не скидка', 'Ушёл — «я ничто»'], ['Сценарий и прошлое', 'Прошлое не выбирает за тебя', 'Лица разные, история одна'], ['Состояние и норма', 'Энергия выбора, а не нужды', 'Соглашаешься на меньшее'], ['Потребности', 'Его и твои', '«Догадайся сам» → обиды'], ['Коммуникация и конфликты', 'Говоришь — тебя слышат', 'Молчу → коплю → взрываюсь'], ['Выбор мужчины', 'Совместимость, а не химия', 'Годами оправдываешь не того'], ['Пара и финансы', 'Принимаешь заботу', '«Почему я всё тащу сама?»']];
S_(`${SCR}<div class="z">${head('Формула', '<span class="w">Формула гармоничных</span> <span class="p">отношений</span>', 's')}</div>
<div class="z" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:40px">${F7.map(([h, y, n], i) => `<div class="card c c4" style="padding:22px 24px"><span class="num">0${i + 1}</span><h4 style="margin-top:14px">${h}</h4><div class="txt" style="color:#fff">${y}</div><div style="font:500 15px Mont;color:#8E8E96;margin-top:8px">Без этого: ${n}</div></div>`).join('')}
<div class="card hl" style="display:flex;align-items:center;font:700 44px/1.15 Osw;text-transform:uppercase;color:#fff">Выпало одно звено — рвётся<br>вся цепочка</div></div>`, 1);

R('route21-21.jpg');
R('route19-19.jpg');
S_(`${photo('u36.jpg', 'right:170px;top:90px', 440, 860, 3, '50% 50%')}<div class="z" style="margin-top:170px;width:1150px">${T('Хорошая новость')}
<div class="h m" style="margin-top:30px"><span class="w">Нас учили учиться и работать.</span><br><span class="p">Но кто учил выбирать мужчину?</span></div>
<div class="big" style="margin-top:50px;font-size:48px">Это навык. Ему можно научиться,<br><span class="p">как водить машину.</span></div></div>`, 2);

kase('Александра, 31', 'Из «запасного варианта» в любимую', '3 года была «запасным вариантом».', 'Вышла из этих отношений, стала уверенной в себе, и рядом появились мужчины, которые роскошно за ней ухаживают.');
R('route22-22.jpg');
kase('Ещё одна ученица', 'Замужем', 'Пришла через 3 месяца после болезненного расставания: «нормальных мужчин больше нет».', 'Сейчас замужем за мужчиной, которого встретила во время программы.');

S_(`<div class="z" style="display:flex;gap:80px;align-items:flex-start">
<div style="flex:1">${T('Только 10 мест')}
<div class="h m" style="margin-top:30px"><span class="w">Бесплатный разбор</span><br><span class="p">твоего маршрута</span></div>
<div style="margin-top:36px;display:grid;gap:14px">${['В каком звене ломается твоя цепочка', 'Какой сценарий ты повторяешь', 'Что мешает встретить или построить отношения', 'Пошаговый маршрут именно для тебя'].map(t => `<div class="card" style="display:flex;gap:18px;align-items:center;font:500 28px Mont;color:#fff;padding:18px 26px"><span style="color:var(--pink);font:700 30px Mont">→</span>${t}</div>`).join('')}</div>
<div class="sub" style="margin-top:30px">Обычно моя консультация — <s style="color:var(--mut)">50 000 ₽</s>. <em>Для вас — бесплатно.</em></div></div>
<div style="width:460px;margin-top:20px;text-align:center">${qr('qr_tg.png', 420, 'Telegram')}<div style="font:700 60px Osw;color:var(--pink);margin-top:10px">@iamheyksusha</div><div style="font:600 30px/1.35 Mont;color:#fff;margin-top:14px">Напиши мне слово<br><span style="font:700 52px Osw;color:#fff;background:linear-gradient(100deg,#F25AA6,#E0357F);border-radius:14px;padding:4px 20px;display:inline-block;margin-top:10px">РАЗБОР</span></div></div></div>`, 0);

// ===== БЛОК 7. ИГРА =====
S_(`<div class="z" style="margin-top:130px;text-align:center">${T('Игра')}
<div class="h xl" style="margin-top:30px"><span class="p">Ред-флаг</span> <span class="w">или грин-флаг?</span></div>
<div class="vote" style="justify-content:center;margin-top:60px"><span>🚩 беги</span><span>💚 всё хорошо</span><span>🟡 присмотрись</span></div></div>`, 1);
const sit = (n, t) => S_(`<div class="z" style="margin-top:120px;width:1550px">${T('Ситуация ' + n + ' из 8')}
<div class="qt" style="margin-top:50px;font-size:50px">${t}</div>
<div class="vote" style="margin-top:70px"><span>🚩</span><span>💚</span><span>🟡</span></div></div>
<div class="wm" style="font-size:420px">${n}</div>`, n % 3);
['Первое свидание. Он: «Ой, а в жизни ты совсем не такая, как в Инстаграме…» — и ждёт, что ты ответишь',
 'Сам назначил встречу на субботу. В пятницу пропал. В понедельник: «Привет, красотка, был занят. Как ты?»',
 'Ты собираешься к подруге. Он: «Ты в этом пойдёшь? Слишком вызывающе. Я же о тебе забочусь»',
 'Тебя повысили. Он: «Ну, повезло. Посмотрим, надолго ли» — и переводит разговор на себя',
 'Третье свидание. «Пригласишь на кофе?» — «Не сегодня». — «Да ладно, ты мне не доверяешь?»',
 '4 месяца вместе. «Хочу серьёзных отношений». А на «кто мы друг другу?» — «Зачем ярлыки? Нам же хорошо»',
 '«С бывшей не сложилось: слишком требовательная, хотела, чтобы я писал каждый день. А женщинам вообще только деньги нужны»',
 'Сказал, что вечером дома. Ночью ты видишь его в сторис в баре. Он: «Ты что, следишь за мной? У тебя паранойя»'].forEach((t, i) => sit(i + 1, t));
S_(`${SCR}<div class="z" style="margin-top:100px">${head('Вывод', '<span class="w">3 правила,</span> <span class="p">которые спасут тебе годы</span>', 'm')}
<div style="margin-top:60px;display:grid;gap:24px;width:1400px">${['Смотри на действия, а не на слова', 'Если рядом с ним хочется оправдываться — это сигнал', 'Твоё «нет» — законченное предложение'].map((t, i) => `<div class="card" style="display:flex;gap:26px;align-items:center;font:600 38px Mont;color:#fff"><span class="num">0${i + 1}</span>${t}</div>`).join('')}</div></div>`, 2);

S_(`${SCR}<div class="z" style="margin-top:170px;text-align:center">${T('Проверка мужчины')}
<div class="h m" style="margin-top:30px"><span class="w">Кто перед тобой?</span></div>
<div style="margin-top:70px;display:flex;justify-content:center;transform:scale(2);transform-origin:center top">${lib.chain(['слова', 'время', 'поступки', 'реакция на «нет»']).replace(/→/g,'+')}</div>
<div class="big" style="margin-top:170px;font-size:46px">Не первые недели, <span class="p">а поведение во времени</span></div></div>`, 0);
// ===== БЛОК 8. РАЗБОРЫ =====
S_(`${photo('stage.jpg', 'right:160px;top:130px', 520, 700, 3, '60% 40%')}
<div class="z" style="width:1000px;margin-top:150px">${T('Прямой эфир')}
<div class="h m" style="margin-top:30px"><span class="w">Разбираем</span><br><span class="p">ваши истории</span></div>
<div class="sub" style="margin-top:36px">5 историй · можно анонимно</div>
<div style="margin-top:50px">${chat('Узнала себя? Ставь ❤️')}</div></div>`, 0);

// ===== БЛОК 9. ПРОГРАММА =====
S_(`${lib.framed('right:150px;top:40px', img('u34.jpg', 330, 220, '50% 30%'), 3)}<div class="z">${T('Программа')}<div class="h s" style="margin-top:20px"><span class="w">Девушка</span> <span class="p">на миллион</span></div><div class="sub" style="margin-top:10px">Маршрут к отношениям мечты · старт в начале декабря</div></div>
<div class="z" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:26px">${[['Самоценность и опора', 'Перестаёшь доказывать, что достойна любви'], ['Психика и сценарии', 'Переписываешь сценарий «не тех»'], ['Состояние и уровень жизни', 'Твоя норма — без «соглашаюсь на меньшее»'], ['Понимание отношений', 'Что важно ему и что важно тебе'], ['Коммуникация и границы', 'Тебя слышат, ссоры сближают'], ['Привлечение мужчины', 'Знакомства, переписка, флаги, свидания'], ['Отношения в паре', 'Не теряешь себя, финансы без «я сама»']].map(([h, t], i) => `<div class="card c c4" style="padding:18px 22px"><span class="num">0${i + 1}</span><h4 style="margin-top:10px">${h}</h4><div class="txt">${t}</div></div>`).join('')}
<div class="card hl c4" style="display:flex;flex-direction:column;justify-content:center"><div class="lbl">Для тебя, если</div><div class="txt" style="color:#fff">устала ждать «своего» · одиноко в отношениях · берёшь минимум</div></div></div>`, 1);

S_(`<div class="z" style="display:flex;gap:70px;align-items:center;margin-top:20px">
<div style="flex:1">${T('Подарки')}
<div class="h m" style="margin-top:26px"><span class="w">Кодовое слово:</span> <span class="p">ЛЮБОВЬ</span></div>
<div class="sub" style="margin-top:20px">Напиши мне в Telegram слово <em>ЛЮБОВЬ</em> — и забирай 3 подарка</div><div style="font:700 64px Osw;color:var(--pink);margin-top:14px">@iamheyksusha</div>
<div style="margin-top:36px;display:flex;gap:26px">${gifts(400)}</div></div>
<div style="width:440px">${qr('qr_tg.png', 440, 'Наведи камеру — и пиши')}</div></div>`, 2);

S_(`<div class="z" style="display:flex;gap:90px;align-items:center;margin-top:30px">
<div style="flex:1">${T('Всё — в одном месте')}
<div class="h m" style="margin-top:26px"><span class="w">Пиши мне</span> <span class="p">в Telegram</span></div>
<div style="font:700 120px/1 Osw;color:var(--pink);margin-top:20px">@iamheyksusha</div>
<div style="margin-top:44px;display:grid;gap:18px">
<div class="card" style="display:flex;gap:24px;align-items:center"><span style="font:700 46px Osw;color:#fff;background:linear-gradient(100deg,#F25AA6,#E0357F);border-radius:14px;padding:4px 18px">ЛЮБОВЬ</span><span style="font:500 32px Mont;color:#fff">→ забрать 3 подарка</span></div>
<div class="card" style="display:flex;gap:24px;align-items:center"><span style="font:700 46px Osw;color:#fff;background:linear-gradient(100deg,#F25AA6,#E0357F);border-radius:14px;padding:4px 18px">РАЗБОР</span><span style="font:500 32px Mont;color:#fff">→ бесплатный разбор маршрута · 10 мест</span></div></div></div>
<div>${qr('qr_tg.png', 520, 'Наведи камеру')}</div></div>`, 0);

S_(`${photo('u31.jpg', 'right:170px;top:120px', 520, 720, 4, '50% 25%')}
<div class="z" style="width:1000px;margin-top:180px">${T('С любовью, Ксюша')}
<div class="qt" style="margin-top:40px;font-size:54px">Ты не «слишком многого хочешь».</div>
<div class="big" style="margin-top:30px;font-size:58px"><span class="p">Ты достойна любви, в которой не нужно ничего доказывать</span></div></div>`, 0);

(async () => {
  let html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${css}</style></head><body>${slides.map((f, i) => f(i + 1, slides.length)).join('\n')}</body></html>`;
  html = html.replace(/(font:(?:400|500|600) )(\d+)(px)/g,(m,a,n,c)=>+n<40?a+Math.round(n*1.35)+c:m).replace(/(font-size:)(\d+)(px)/g,(m,a,n,c)=>+n<40?a+Math.round(n*1.35)+c:m);
  fs.writeFileSync(path.join(__dirname, 'deck.html'), html);
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await pg.goto('file://' + path.join(__dirname, 'deck.html'), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, pageRanges: `1-${slides.length}` });
  if (PNGDIR) {
    fs.mkdirSync(PNGDIR, { recursive: true });
    const els = await pg.$$('section.slide');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(PNGDIR, `s${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 80 });
  }
  await b.close();
  console.log('slides', slides.length);
})();
