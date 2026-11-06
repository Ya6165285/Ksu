// Сторис-прогрев к эфиру «Генеральная уборка» — стиль прошлых сторис (фото на весь экран + розовые плашки)
// node stories2.js <fontsDir(@fontsource)> <outDir> [onlyN,...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
const C = path.resolve(__dirname, '../../launch/guides2/img') + '/';
fs.mkdirSync(OUT, { recursive: true });
const PINK = '#EC6FB8';
const font = w => `@font-face{font-family:I;font-weight:${w};src:url(file://${F}/inter/files/inter-cyrillic-${w}-normal.woff2)}@font-face{font-family:I;font-weight:${w};src:url(file://${F}/inter/files/inter-latin-${w}-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+20BD}`;

const P = (t, fs = 60) => ({ k: 'pink', t, fs });
const B = (t, fs = 260) => ({ k: 'big', t, fs });
const I = (src, w = 900, rot = 0) => ({ k: 'img', src, w, rot });
const ROW = (items, gap = 18) => ({ k: 'row', items, gap });
const GAP = (h = 24) => ({ k: 'gap', h });
const T = (t, fs = 72) => ({ k: 'txt', t, fs });
const SM = (t, fs = 42) => ({ k: 'sm', t, fs });
const D = (t, fs = 66) => ({ k: 'dtxt', t, fs });
const N = (t, fs = 40) => ({ k: 'note', t, fs });
const STK = (t) => ({ k: 'stk', t }); // место под стикер Instagram
const p = s => `<span class=acc>${s}</span>`;

const PLAIN = 'plain'; // однотонный фон
const VID = process.env.VID || ''; // папка с видео для видео-сторис
const stories = [
  // 1 — Бали, аэропорт, цветы
  { bg: 'bali_airport.jpg', pos: '50% 35%', groups: [
    { top: 150, items: [P('ДЕВОЧКИ, Я СНОВА', 62), P('НА БАЛИ!!! 🥹🌴', 62)] },
  ] },
  // 2 — кадр с прошлого эфира на розовом фоне
  { bg: 'plain', groups: [
    { top: 280, items: [P('ПОКА ЛЕТЕЛА,', 58), D('всё думала о нашем<br>прошлом эфире… 🥹', 74)] },
    { top: 640, items: [I('stream1.jpg', 980, -1.5)] },
    { top: 1300, items: [N('Я привыкла к <b>уютным встречам</b>, где <b>лично разбираю</b> ваши истории. Поэтому и в прошлый раз думала, что соберёмся <b class=acc>небольшой компанией…</b>', 40)] },
  ] },
  // 3 — 140
  { bg: 'plain', groups: [
    { top: 150, items: [P('НО НА ЭФИР ПРИШЛИ', 58), GAP(4), { k: 'bigp', t: '140' }, D('девочек!!! 😭❤️', 80)] },
    { top: 760, items: [I('n_selfie.jpg', 880, -1.5)] },
    { top: 1500, items: [D('Вы вообще представляете?!<br>Я до сих пор под впечатлением!', 50)] },
  ] },
  // 4 — отзывы
  { bg: 'plain', groups: [
    { top: 170, items: [P('А ПОТОМ ВЫ НАПИСАЛИ…', 58)] },
    { top: 340, items: [I('rv_psy.jpg', 940, -1.5), GAP(40), I('review_solved.jpg', 860, 1.5)] },
  ] },
  // 5 — Марина: коллаж + до/после поверх
  { bg: 'alina_collage.jpg', pos: '50% 50%', shade: 'rgba(0,0,0,.12)', groups: [
    { top: 120, items: [P('💍 МАРИНА, 29', 62)] },
    { top: 720, items: [N('<b>ДО:</b> боялась принимать подарки и заботу, думала, что за всё <b>должна</b> мужчине, всё делала сама<br><br><b class=acc>ПОСЛЕ:</b> научилась принимать заботу, встретила достойного мужчину, <b>переехала к нему за границу</b> и получила <b class=acc>предложение 💍</b>', 42)] },
  ] },
  // 6 — девочки с обучения + отзыв
  { bg: 'plain', groups: [
    { top: 170, items: [P('И ТАКИХ ИСТОРИЙ', 58), D('всё больше ❤️', 76)] },
    { top: 440, items: [I('students.jpg', 960, -1.5), GAP(40), I('rv_carry.jpg', 900, 1.5)] },
  ] },
  // 7 — яхта (видео)
  { bg: 'video:yacht.mp4', groups: [
    { top: 150, items: [P('ДЛЯ ТАКИХ ИЗМЕНЕНИЙ', 54), T('не нужны годы!', 86)] },
    { top: 1450, items: [SM('Я лично разбираю ваши ситуации<br>и даю инструменты, которые<br>можно применить сразу 🎁', 42), GAP(16), P('НАМ СРОЧНО НУЖНО ПОВТОРИТЬ!', 48)] },
  ] },
  // 8 — моя история: коллаж до/после
  { bg: 'plain', groups: [
    { top: 130, items: [P('СЕЙЧАС БУДЕТ ОТКРОВЕННО…', 54)] },
    { top: 270, items: [{ k: 'ba', a: 'o_before.jpg', b: 'o_after.jpg' }] },
    { top: 1010, items: [N('<b>Я ДО:</b> парень изменил мне с <b>лучшей подругой</b>, я простила и сама вернулась, годами верила пустым обещаниям и боялась уйти: «лучше не встречу»<br><br><b class=acc>Я ПОСЛЕ:</b> научилась <b>выбирать себя</b>, не соглашаюсь на отношения, где несчастлива, и знаю, какой любви <b>достойна</b> ❤️', 40), GAP(20), D('Узнала себя в моём «до»?', 56)] },
  ] },
  // 9 — держит страх (заметка)
  { bg: 'plain', groups: [
    { top: 200, items: [P('ИНОГДА НАС ДЕРЖИТ НЕ ЛЮБОВЬ…', 52)] },
    { top: 380, items: [N('<b>А страх, что больше никто не полюбит.</b><br><br>И мы годами тащим за собой:<br><br>💔 бывших, за которыми продолжаем следить<br>💔 мужчин, которые годами «не готовы»<br>💔 привычку всё делать самой<br>💔 мысль, что с нами что-то не так<br><br><b class=acc>Неужели заберём всё это и в 2027-й?</b>', 46)] },
  ] },
  // 10 — анонс с афишей (Дубай, размыто)
  { bg: 'dxb_sushi.jpg', pos: '50% 30%', filter: 'blur(10px)', shade: 'rgba(0,0,0,.35)', groups: [
    { top: 120, items: [P('ПОЭТОМУ Я ПРИДУМАЛА', 54), T('кое-что особенное! ❤️', 66)] },
    { top: 370, items: [I('afisha.jpg', 800, -1.5)] },
    { top: 1480, items: [P('8 НОЯБРЯ · 13:00 МСК', 56), GAP(6), SM('бесплатно, в закрытой комнате', 42)] },
  ] },
  // 11 — что разберём (Дубай ночью, размыто)
  { bg: 'dxb_burj.jpg', pos: '50% 40%', filter: 'blur(9px)', shade: 'rgba(0,0,0,.35)', groups: [
    { top: 200, items: [P('БУДЕМ РАЗБИРАТЬ ТО,', 56), T('о чём молчат даже<br>с подругами…', 72)] },
    { top: 660, items: [N('💔 Почему ты соглашаешься на <b>меньшее</b>, хотя достойна большего<br><br>💔 <b>5 стадий</b>, на которых ты теряешь себя в мужчине<br><br>💔 <b>Границы</b> — чтобы услышали, а не скандал<br><br>💔 Как наконец <b>отпустить бывшего</b><br><br>💔 <b class=acc>Где знакомиться с достойными мужчинами?!</b>', 44)] },
  ] },
  // 12 — подарки (цветы и шарики)
  { bg: 'flowers_balloons.jpg', pos: '50% 50%', shade: 'rgba(0,0,0,.35)', groups: [
    { top: 170, items: [P('А ЕЩЁ — 3 ПОДАРКА!!! 🎁', 62), SM('тем, кто досидит до конца', 44)] },
    { top: 460, items: [ROW([I('gcov1-1.jpg', 320, -3), I('gcov2-1.jpg', 320, 0), I('gcov3-1.jpg', 320, 3)], 0)] },
    { top: 1080, items: [N('💌 <b>«Спроси это, прежде чем влюбиться»</b> — 20 вопросов, твой ли это мужчина<br><br>💌 <b>«Как просить, не выпрашивая»</b> — готовые сообщения<br><br>💌 <b>«Ты не любишь, ты терпишь»</b> — 15 сигналов', 40), GAP(20), T('И главный сюрприз — только на эфире 🤫', 48)] },
  ] },
  // 13 — вопросы (цветы и шарики)
  { bg: 'n_roses.jpg', pos: '50% 50%', shade: 'linear-gradient(rgba(0,0,0,.3) 0%,rgba(0,0,0,.05) 30%,rgba(0,0,0,.35) 100%)', groups: [
    { top: 140, items: [P('СРАЗУ ОТВЕЧУ НА ВОПРОСЫ!', 54)] },
    { top: 1000, items: [N('<b>«Я уже в отношениях»</b><br>Тем более приходи — перестанешь тащить всё на себе<br><br><b>«Мне 30+, не поздно?»</b><br>Поздно — это ещё 5 лет ждать, что всё изменится само<br><br><b>«В воскресенье занята»</b><br>Это 1,5 часа. Можно слушать в наушниках', 40)] },
  ] },
  // 14 — почему нельзя пропустить
  { bg: 'me_fur.jpg', pos: '50% 30%', shade: 'linear-gradient(rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,.35) 55%,rgba(0,0,0,.6) 100%)', groups: [
    { top: 140, items: [P('ПОЧЕМУ НЕЛЬЗЯ ПРОПУСТИТЬ:', 54)] },
    { top: 960, items: [N('🤍 <b>Последняя встреча перед Новым годом</b><br><br>🤍 <b>Записи НЕ БУДЕТ</b> — всё ценное останется у тех, кто придёт<br><br>🤍 <b>Живые разборы</b> — обычно стоят <b class=acc>50&nbsp;000&nbsp;₽</b>, а здесь <b class=acc>бесплатно</b>', 40), GAP(26), T('Напиши мне в директ «ХОЧУ»', 58), SM('— пришлю ссылку лично 💌', 42)] },
  ] },
  // 15 — закат (замени фон на своё фото/видео заката)
  { bg: process.env.SUNSET || 'SUNSET', pos: '50% 50%', shade: 'rgba(0,0,0,.25)', groups: [
    { top: 260, items: [P('А Я ПОШЛА ВСТРЕЧАТЬ', 56), T('закат… 🥹', 80)] },
    { top: 700, items: [SM('А вы пока занимайте свои места!<br>В прошлый раз нас было 140 девочек', 46), GAP(30), T('Побьём рекорд<br>в это воскресенье? ❤️', 78)] },
    { top: 1350, items: [P('🎄 8 НОЯБРЯ · 13:00 МСК', 56)] },
  ] },
];

function item(it) {
  if (it.k === 'gap') return `<div style="height:${it.h}px"></div>`;
  if (it.k === 'img') return `<img class=shot src="file://${C}${it.src}" style="width:${it.w}px;transform:rotate(${it.rot}deg)">`;
  if (it.k === 'row') return `<div style="display:flex;gap:${it.gap}px;justify-content:center">${it.items.map(item).join('')}</div>`;
  if (it.k === 'txt') return `<div class=txt style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'dtxt') return `<div class=dtxt style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'sm') return `<div class=sm style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'note') return `<div class=note style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'bigp') return `<div style="font:900 300px/1 I;color:${PINK};letter-spacing:-.03em">${it.t}</div>`;
  if (it.k === 'ba') return `<div style="display:flex;gap:24px">${[['ДО', it.a, -2], ['ПОСЛЕ', it.b, 2]].map(([l, f, r]) => `<div style="position:relative;transform:rotate(${r}deg)"><img src="file://${C}${f}" style="width:450px;height:650px;object-fit:cover;object-position:50% 20%;border-radius:26px;border:8px solid #fff;box-shadow:0 18px 50px rgba(60,20,40,.25);display:block"><div style="position:absolute;left:50%;bottom:-26px;transform:translateX(-50%)"><span class="pl pink" style="font-size:44px">${l}</span></div></div>`).join('')}</div>`;
  if (it.k === 'frame') return `<div style="width:${it.w}px;height:${it.h}px;background:#fff;border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.4)"></div>`;
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
.dtxt{font-weight:800;color:#2b1a24;line-height:1.15;letter-spacing:-.01em}
.plainbg{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,#fff6f9 0%,#fbe3ec 55%,#f6d0de 100%)}
.sunbg{position:absolute;inset:0;background:linear-gradient(#f7b48a 0%,#f08fa0 45%,#b9647f 100%)}
.note{background:#fff;color:#151515;border-radius:30px;padding:40px 46px;text-align:left;font-weight:400;line-height:1.42;width:940px;box-shadow:0 14px 40px rgba(60,20,40,.18)}
.note b{font-weight:800}
.shot{border-radius:26px;box-shadow:0 18px 50px rgba(0,0,0,.4);display:block}
.stk{border:4px dashed rgba(255,255,255,.75);border-radius:26px;padding:22px 34px;color:rgba(255,255,255,.9);font:600 30px I;background:rgba(0,0,0,.18)}
</style></head><body${String(s.bg).startsWith('video:') ? ' style="background:transparent"' : ''}>${String(s.bg).startsWith('video:') ? '<div class=shade style="background:linear-gradient(rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 60%,rgba(0,0,0,.5) 100%)"></div>' : s.bg === 'plain' ? '<div class=plainbg></div>' : s.bg === 'SUNSET' ? '<div class=sunbg></div>' : `<img class=bg src="file://${C}${s.bg}"><div class=shade></div>`}${groups}${guides ? '' : ''}</body></html>`;
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
    const base = path.join(OUT, `Сторис_${String(n).padStart(2, '0')}`);
    if (String(s.bg).startsWith('video:')) {
      await pg.screenshot({ path: base + '_overlay.png', omitBackground: true });
      require('child_process').execSync(`ffmpeg -v error -y -i "${VID}/${s.bg.slice(6)}" -i "${base}_overlay.png" -filter_complex "[0][1]overlay=0:0" -c:v libx264 -crf 19 -pix_fmt yuv420p -movflags +faststart "${base}.mp4"`);
      // превью-кадр
      require('child_process').execSync(`ffmpeg -v error -y -ss 1 -i "${base}.mp4" -frames:v 1 -q:v 2 "${base}_preview.jpg"`);
      fs.unlinkSync(base + '_overlay.png');
    } else if (s.vcard) {
      const v = s.vcard; await pg.screenshot({ path: base + '_bg.png' });
      require('child_process').execSync(`ffmpeg -v error -y -loop 1 -i "${base}_bg.png" -i "${VID}/${v.src}" -filter_complex "[1:v]scale=${v.w}:${v.h}[v];[0:v][v]overlay=${v.x}:${v.y}:shortest=1,format=yuv420p" -map 0:v -map 1:a? -c:v libx264 -crf 19 -r 30 -c:a aac -shortest -movflags +faststart "${base}.mp4"`);
      require('child_process').execSync(`ffmpeg -v error -y -ss 2 -i "${base}.mp4" -frames:v 1 -q:v 2 "${base}_preview.jpg"`);
      fs.unlinkSync(base + '_bg.png');
    } else await pg.screenshot({ path: base + '.jpg', type: 'jpeg', quality: 92 });
  }
  try { fs.unlinkSync(path.join(OUT, '_t.html')); } catch (e) {}
  await b.close(); console.log('ok', stories.length);
})();
