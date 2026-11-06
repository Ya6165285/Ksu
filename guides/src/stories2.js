// Сторис-прогрев к эфиру «Генеральная уборка» — стиль прошлых сторис (фото на весь экран + розовые плашки)
// node stories2.js <fontsDir(@fontsource)> <outDir> [onlyN,...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
const C = path.resolve(__dirname, '../../launch/guides2/img') + '/';
fs.mkdirSync(OUT, { recursive: true });
const PINK = '#EC6FB8';
const font = w => `@font-face{font-family:I;font-weight:${w};src:url(file://${F}/montserrat/files/montserrat-cyrillic-${w}-normal.woff2)}@font-face{font-family:I;font-weight:${w};src:url(file://${F}/montserrat/files/montserrat-latin-${w}-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+20BD}`;

const P = (t, fs = 60) => ({ k: 'pink', t, fs });
const B = (t, fs = 260) => ({ k: 'big', t, fs });
const I = (src, w = 900, rot = 0) => ({ k: 'img', src, w, rot });
const ROW = (items, gap = 18) => ({ k: 'row', items, gap });
const GAP = (h = 24) => ({ k: 'gap', h });
const T = (t, fs = 72) => ({ k: 'txt', t, fs });
const SM = (t, fs = 42) => ({ k: 'sm', t, fs });
const N = (t, fs = 40) => ({ k: 'note', t, fs });
const STK = (t) => ({ k: 'stk', t }); // место под стикер Instagram
const p = s => `<span class=acc>${s}</span>`;

const stories = [
  // 1 — Бали, цветы
  { bg: 'bali_airport.jpg', pos: '50% 40%', groups: [
    { top: 150, items: [P('ДЕВОЧКИ, Я СНОВА НА БАЛИ!!! 🥹🌴', 54)] },
    { top: 1560, items: [T('И посмотрите, какой<br>сюрприз меня здесь ждал…', 62)] },
  ] },
  // 2 — вспоминала прошлый эфир
  { bg: 's_walk.jpg', pos: '50% 50%', groups: [
    { top: 170, items: [P('ПОКА ЛЕТЕЛА,', 56), T('всё думала о нашем<br>прошлом эфире… 🥹', 70)] },
    { top: 1330, items: [SM('Я привыкла к маленьким уютным встречам,<br>где я лично разбираю ваши истории.', 40), GAP(10), SM(`Думала, и в этот раз соберёмся<br>${p('небольшой компанией…')}`, 40)] },
  ] },
  // 3 — 140
  { bg: 'n_balloons.jpg', shade: 'rgba(0,0,0,.42)', groups: [
    { top: 430, items: [P('НО НА ЭФИР ПРИШЛИ', 58), GAP(10), B('140', 300), GAP(6), T('девочек!!! 😭❤️', 84)] },
    { top: 1250, items: [SM('140 девушек в воскресенье отложили дела,<br>чтобы наконец разобраться<br>в своей личной жизни', 42)] },
  ] },
  // 4 — отзывы + опрос
  { bg: 's_flowers.jpg', shade: 'rgba(0,0,0,.5)', filter: 'blur(6px)', groups: [
    { top: 110, items: [P('А ПОТОМ ВЫ НАПИСАЛИ…', 56)] },
    { top: 260, items: [I('rv_psy.jpg', 900, -1.5), GAP(30), I('review_solved.jpg', 800, 1.5)] },
    { top: 1500, items: [STK('опрос: ❤️ Я была! / 🥺 Всё пропустила…')] },
  ] },
  // 5 — Марина
  { bg: 'ring.jpg', shade: 'rgba(0,0,0,.5)', filter: 'blur(5px)', groups: [
    { top: 120, items: [P('💍 МАРИНА, 29', 60)] },
    { top: 270, items: [N(`<b>ДО:</b> боялась принимать заботу, стыдно было просить, всё делала сама<br><br><b class=acc>ПОСЛЕ:</b> научилась принимать — встретила мужчину, переехала к нему за границу и получила <b class=acc>предложение</b> 💍`, 40)] },
    { top: 900, items: [I('alina_collage.jpg', 760, -1.5)] },
  ] },
  // 5b — ещё отзывы
  { bg: 's_blueflowers.jpg', shade: 'rgba(0,0,0,.5)', filter: 'blur(6px)', groups: [
    { top: 110, items: [P('И ТАКИХ ИСТОРИЙ', 56), T('всё больше ❤️', 70)] },
    { top: 360, items: [I('rv_carry.jpg', 820, -1.5), GAP(16), I('rv_changed.jpg', 820, 1.5), GAP(16), I('rv_katya.jpg', 760, -1)] },
  ] },
  // 6 — почему работает + повторить
  { bg: 'me_portrait.jpg', pos: '50% 25%', groups: [
    { top: 1180, items: [P('ДЛЯ ТАКИХ ИЗМЕНЕНИЙ', 52), T('не нужны годы!', 80), GAP(10), SM('Я лично разбираю ваши ситуации<br>и даю инструменты, которые<br>можно применить сразу 🎁', 40), GAP(14), P('НАМ СРОЧНО НУЖНО ПОВТОРИТЬ!', 46)] },
  ] },
  // 7 — моя история + опрос
  { bg: 'p_man.jpg', shade: 'rgba(0,0,0,.45)', groups: [
    { top: 130, items: [P('СЕЙЧАС БУДЕТ ОТКРОВЕННО…', 54)] },
    { top: 300, items: [N(`<b>Я ДО:</b><br>— парень изменил мне с лучшей подругой<br>— я простила и сама вернулась<br>— годами верила пустым обещаниям<br>— боялась уйти: «лучше не встречу»<br><br><b class=acc>Я ПОСЛЕ:</b><br>— научилась выбирать себя<br>— не соглашаюсь на отношения, где несчастлива<br>— знаю, какой любви достойна ❤️`, 38)] },
    { top: 1330, items: [T('Узнала себя в моём «до»?', 58), GAP(30), STK('опрос: 💔 Да, это про меня / 🤍 Нет')] },
  ] },
  // 8 — держит страх + окошко
  { bg: 'n_roses.jpg', shade: 'rgba(0,0,0,.55)', groups: [
    { top: 170, items: [P('ИНОГДА НАС ДЕРЖИТ НЕ ЛЮБОВЬ,', 50), T('а страх, что больше<br>никто не полюбит', 70)] },
    { top: 640, items: [SM('💔 Бывшие, за которыми мы следим<br>💔 Мужчины, которые годами «не готовы»<br>💔 Привычка всё делать самой<br>💔 Мысль, что с нами что-то не так', 42), GAP(30), T('Неужели заберём это<br>и в 2027-й?', 62)] },
    { top: 1420, items: [STK('окошко: «В 2027-й я НЕ беру с собой…»')] },
  ] },
  // 9 — анонс
  { bg: 'p_bags.jpg', shade: 'rgba(0,0,0,.6)', filter: 'blur(8px)', groups: [
    { top: 100, items: [P('ПОЭТОМУ Я ПРИДУМАЛА', 52), T('кое-что особенное! ❤️', 64)] },
    { top: 330, items: [I('afisha.jpg', 760, -1.5)] },
    { top: 1400, items: [P('8 НОЯБРЯ · 13:00 МСК', 52), GAP(4), SM('бесплатно, в закрытой комнате', 40), GAP(26), STK('стикер-ссылка: ЗАЙТИ В ЗАКРЫТУЮ КОМНАТУ')] },
  ] },
  // 10 — что разберём
  { bg: 'n_marble.jpg', shade: 'rgba(0,0,0,.55)', groups: [
    { top: 160, items: [P('БУДЕМ РАЗБИРАТЬ ТО,', 54), T('о чём молчат даже<br>с подругами…', 70)] },
    { top: 640, items: [N(`💔 Почему ты соглашаешься на меньшее<br><br>💔 5 стадий, на которых ты теряешь себя в мужчине<br><br>💔 Границы — чтобы услышали, а не скандал<br><br>💔 Как отпустить бывшего<br><br>💔 <b class=acc>Где знакомиться с достойными мужчинами?!</b>`, 40)] },
  ] },
  // 11 — подарки
  { bg: 'p_roses_gifts.jpg', shade: 'rgba(0,0,0,.5)', groups: [
    { top: 140, items: [P('А ЕЩЁ — 3 ПОДАРКА!!! 🎁', 60), SM('тем, кто досидит до конца', 40)] },
    { top: 400, items: [ROW([I('gcov1-1.jpg', 320, -3), I('gcov2-1.jpg', 320, 0), I('gcov3-1.jpg', 320, 3)], 0)] },
    { top: 1010, items: [SM('💌 20 вопросов, твой ли это мужчина<br>💌 Готовые сообщения о заботе и подарках<br>💌 15 сигналов, что ты терпишь', 40), GAP(24), T('И главный сюрприз —<br>только на эфире 🤫', 58), GAP(30), STK('стикер-ссылка: ЗАБРАТЬ ПОДАРКИ')] },
  ] },
  // 12 — вопросы
  { bg: 's_flowers.jpg', pos: '50% 40%', shade: 'rgba(0,0,0,.35)', groups: [
    { top: 140, items: [P('СРАЗУ ОТВЕЧУ НА ВОПРОСЫ!', 54)] },
    { top: 310, items: [N(`<b>«Я уже в отношениях»</b><br>Тем более приходи — перестанешь тащить всё на себе<br><br><b>«Мне 30+, не поздно?»</b><br>Поздно — это ещё 5 лет ждать, что всё изменится само<br><br><b>«В воскресенье занята»</b><br>Это 1,5 часа. Можно слушать в наушниках`, 40)] },
    { top: 1480, items: [T('Твоя личная жизнь<br>стоит 1,5 часа ❤️', 64)] },
  ] },
  // 13 — 3 исключительности
  { bg: 'me_blue.jpg', shade: 'rgba(0,0,0,.45)', groups: [
    { top: 140, items: [P('ПОЧЕМУ НЕЛЬЗЯ ПРОПУСТИТЬ:', 54)] },
    { top: 330, items: [N(`🤍 <b>Последняя встреча перед Новым годом</b><br><br>🤍 <b>Записи НЕ БУДЕТ</b> — всё ценное останется у тех, кто придёт<br><br>🤍 <b>Живые разборы</b> — обычно разбор стоит <b class=acc>50 000 ₽</b>, а здесь <b class=acc>бесплатно</b>`, 42)] },
    { top: 1240, items: [T('Напиши мне в директ<br>«ХОЧУ»', 70), SM('— пришлю ссылку лично 💌', 42), GAP(30), STK('стикер-ссылка: ПОПАСТЬ НА ЭФИР')] },
  ] },
  // 14 — закат
  { bg: 'n_yacht.jpg', pos: '50% 50%', shade: 'rgba(0,0,0,.35)', groups: [
    { top: 170, items: [P('А Я ПОШЛА ВСТРЕЧАТЬ', 54), T('балийский закат… 🥹', 72)] },
    { top: 560, items: [SM('В прошлый раз нас было 140 девочек', 44), GAP(16), T('Побьём рекорд<br>в это воскресенье? ❤️', 72)] },
    { top: 1240, items: [P('🎄 8 НОЯБРЯ · 13:00 МСК', 54), GAP(30), STK('обратный отсчёт'), GAP(20), STK('стикер-ссылка: Я ИДУ!')] },
  ] },
];

function item(it) {
  if (it.k === 'gap') return `<div style="height:${it.h}px"></div>`;
  if (it.k === 'img') return `<img class=shot src="file://${C}${it.src}" style="width:${it.w}px;transform:rotate(${it.rot}deg)">`;
  if (it.k === 'row') return `<div style="display:flex;gap:${it.gap}px;justify-content:center">${it.items.map(item).join('')}</div>`;
  if (it.k === 'txt') return `<div class=txt style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'sm') return `<div class=sm style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'note') return `<div class=note style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'big') return `<div class=big style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'stk') return `<div class=stk>${it.t}</div>`;
  return `<div class="ln"><span class="pl ${it.k}" style="font-size:${it.fs}px">${it.t}</span></div>`;
}

function html(s, guides) {
  const groups = s.groups.map(g => `<div class=grp style="top:${g.top}px">${g.items.map(item).join('')}</div>`).join('');
  return `<!doctype html><html><head><meta charset=utf-8><style>
${[400, 600, 700, 800, 900].map(font).join('\n')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;background:#111;font-family:I,'Noto Color Emoji',sans-serif}
.bg{position:absolute;inset:-20px;width:1120px;height:1960px;object-fit:cover;object-position:${s.pos || 'center'};filter:${s.filter || 'none'}}
.shade{position:absolute;inset:0;background:${s.shade || 'linear-gradient(rgba(0,0,0,.38) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)'}}
.grp{position:absolute;left:60px;width:960px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.ln{line-height:1.42;max-width:100%}
.pl{font-weight:800;padding:.12em .4em;border-radius:.28em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.pink{background:${PINK};color:#fff;font-weight:900}
.acc{color:${PINK}}
.big{font-weight:900;color:#fff;line-height:1;letter-spacing:-.02em;text-shadow:0 6px 0 ${PINK},0 10px 40px rgba(0,0,0,.45)}
.txt{font-weight:800;color:#fff;line-height:1.15;text-shadow:0 2px 18px rgba(0,0,0,.6),0 1px 3px rgba(0,0,0,.5)}
.sm{font-weight:700;color:#fff;line-height:1.35;text-shadow:0 2px 12px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.6)}
.txt .acc,.sm .acc{color:#ff9fd6}
.note{background:#fff;color:#151515;border-radius:30px;padding:40px 46px;text-align:left;font-weight:500;line-height:1.4;width:940px;box-shadow:0 18px 50px rgba(0,0,0,.3)}
.note b{font-weight:800}
.shot{border-radius:26px;box-shadow:0 18px 50px rgba(0,0,0,.4);display:block}
.stk{border:4px dashed rgba(255,255,255,.75);border-radius:26px;padding:22px 34px;color:rgba(255,255,255,.9);font:600 30px I;background:rgba(0,0,0,.18)}
</style></head><body><img class=bg src="file://${C}${s.bg}"><div class=shade></div>${groups}${guides ? '' : ''}</body></html>`;
}

(async () => {
  const guides = process.env.GUIDES === '1';
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, s] of stories.entries()) {
    const n = i + 1; if (ONLY && !ONLY.includes(n)) continue;
    const tmp = path.join(OUT, '_t.html');
    fs.writeFileSync(tmp, html(s, guides)); await pg.goto('file://' + tmp, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, `Сторис_${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  try { fs.unlinkSync(path.join(OUT, '_t.html')); } catch (e) {}
  await b.close(); console.log('ok', stories.length);
})();
