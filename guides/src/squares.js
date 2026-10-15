// Square 1080x1080 covers for every bot message of the girls' night chain
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const IMG = L.IMG;
const PREV = path.resolve(__dirname, '../preview');
const OUT = '/home/user/Ksu/launch/bot_covers';

const P = {
  dubai: `file://${IMG}/pajama_dubai.jpg`,
  dress: `file://${IMG}/v-000.jpg`,
  g1: `file://${PREV}/g1-01.png`, g2: `file://${PREV}/g2-01.png`, g3: `file://${PREV}/g3-01.png`,
};


const FONTS = `<style>
@font-face{font-family:GV;src:url(file:///tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/fonts/fontsource-great-vibes/files/great-vibes-cyrillic-400-normal.woff2)}
@font-face{font-family:GV;src:url(file:///tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/fonts/fontsource-great-vibes/files/great-vibes-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}
.scr{font-family:GV,cursive;font-weight:400;text-transform:none;letter-spacing:0;display:inline-block;padding:0 .12em .1em 0;
 background:linear-gradient(100deg,#F0479A 0%,#ff9fd0 28%,#fff0f7 42%,#ff7ab8 58%,#F0479A 75%,#ffc3e1 100%);-webkit-background-clip:text;color:transparent;
 filter:drop-shadow(0 0 14px rgba(240,71,154,.75)) drop-shadow(0 0 2px rgba(255,255,255,.6))}
</style>`;
let gs = 5; const gr = () => ((gs = (gs * 9301 + 49297) % 233280) / 233280);
function glitter(n = 90, seed = 5) {
  gs = seed; let d = '';
  for (let i = 0; i < n; i++) {
    const x = gr() * 1080, y = gr() * 1080, r = gr() * 2.6 + .6, c = ['#ffffff', '#ff9fd0', '#F0479A', '#ffe1a8'][Math.floor(gr() * 4)];
    d += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${.35 + gr() * .6}"/>`;
  }
  for (let i = 0; i < 10; i++) {
    const x = gr() * 1080, y = gr() * 1080, s = 10 + gr() * 22;
    d += `<path d="M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z" fill="#fff" opacity=".9" style="filter:drop-shadow(0 0 6px #ff9fd0)"/>`;
  }
  return `<svg width="1080" height="1080" style="position:absolute;left:0;top:0;z-index:4;pointer-events:none">${d}</svg>`;
}
const note = (t, css) => `<div style="position:absolute;${css};z-index:7;font:400 54px GV,cursive;color:#ffd1e8;transform:rotate(-6deg);filter:drop-shadow(0 0 10px rgba(240,71,154,.8))">${t}</div>`;

const heart = (x, y, s, r = 0, o = .9) => `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);opacity:${o};z-index:6" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.4 4.5 6.3 4.5c2.3 0 3.9 1.3 5.7 3.4 1.8-2.1 3.4-3.4 5.7-3.4 3.9 0 5.9 4 4.3 7.2C19.5 16.4 12 21 12 21z" fill="#F0479A"/></svg>`;
const spark = (x, y, s) => `<div style="position:absolute;left:${x}px;top:${y}px;color:#fff;font-size:${s}px;z-index:6">✦</div>`;
const bg = `<div class="grid"></div>`;
const tag = t => `<span class="tag" style="background:rgba(11,11,13,.7)"><b>✦</b>${t}</span>`;
const title = (w, p, size = 96) => `<div style="font:700 ${size}px/1 Osw;text-transform:uppercase;margin-top:22px"><span style="background:linear-gradient(180deg,#fff 30%,#d6d6dc);-webkit-background-clip:text;color:transparent">${w}</span>${p ? `<br><span class="scr" style="font-size:1.32em;line-height:1.05">${p}</span>` : ''}</div>`;
const sub = t => `<div style="font:500 30px/1.35 Mont;color:#fff;margin-top:20px">${t}</div>`;
const pill = t => `<div class="btn" style="margin-top:30px;font-size:30px;padding:16px 34px">${t}</div>`;
const foot = `<div style="position:absolute;left:70px;right:70px;bottom:36px;display:flex;justify-content:space-between;font:600 15px Mont;letter-spacing:.24em;color:rgba(255,255,255,.4);z-index:7"><span>HEY KSUSHA <b style="color:var(--pink)">♥</b> GIRLS NIGHT</span><span></span></div>`;

// building blocks
function books(x, y, sc = 1) {
  const card = (src, l, t, r, z) => `<img src="${src}" style="position:absolute;left:${l * sc}px;top:${t * sc}px;width:${300 * sc}px;height:${424 * sc}px;object-fit:cover;border-radius:${16 * sc}px;transform:rotate(${r}deg);z-index:${z};box-shadow:0 24px 60px rgba(0,0,0,.6);border:2px solid rgba(255,255,255,.15)">`;
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${640 * sc}px;height:${520 * sc}px;z-index:3">
   ${card(P.g2, 0, 70, -12, 1)}${card(P.g3, 340, 70, 12, 1)}${card(P.g1, 170, 20, 0, 2)}
   <div style="position:absolute;left:${236 * sc}px;top:${-24 * sc}px;width:${170 * sc}px;height:${60 * sc}px;z-index:3;background:linear-gradient(90deg,#F0479A,#F678B4);border-radius:8px;transform:rotate(-4deg);display:flex;align-items:center;justify-content:center;font:700 ${26 * sc}px Osw;color:#fff;letter-spacing:.08em">🎁 ПОДАРКИ</div></div>`;
}
function photoRight(src, pos = '50% 30%', w = 520) {
  return `<div style="position:absolute;right:0;top:0;bottom:0;width:${w}px;z-index:1"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.5) 22%,#000 50%)"></div>`;
}
function photoTop(src, pos = '50% 40%', h = 640) {
  return `<div style="position:absolute;left:0;right:0;top:0;height:${h}px;z-index:1"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};-webkit-mask-image:linear-gradient(180deg,#000 45%,rgba(0,0,0,.5) 70%,transparent 100%)"></div>`;
}
const at = (css, html) => `<div style="position:absolute;${css};z-index:5">${html}</div>`;

// templates
const T = {
  gifts: ({ tg, w, p, s, b }) => `${bg}${books(250, 70, .9)}${heart(130, 160, 50, -15)}${heart(900, 120, 40, 12)}${spark(90, 520, 28)}${spark(960, 470, 24)}
    ${at('left:70px;right:70px;top:560px', `${tag(tg)}${title(w, p, 80)}${s ? sub(s) : ''}${b ? pill(b) : ''}`)}${foot}`,
  photo: ({ tg, w, p, s, b, src, pos }) => `${bg}${photoTop(src || P.dubai, pos)}${heart(940, 80, 46, 12)}${spark(80, 90, 28)}
    ${at('left:70px;right:70px;top:540px', `${tag(tg)}${title(w, p, 90)}${s ? sub(s) : ''}${b ? pill(b) : ''}`)}${foot}`,
  side: ({ tg, w, p, s, b, src, pos }) => `${bg}${photoRight(src || P.dress, pos)}${heart(560, 860, 44, -10)}${spark(80, 920, 24)}
    ${at('left:70px;width:620px;top:120px', `${tag(tg)}${title(w, p, 86)}${s ? sub(s) : ''}${b ? pill(b) : ''}`)}${foot}`,
  count: ({ n, unit, s, b, gifts }) => `${bg}${gifts ? books(560, 300, .72) : ''}${heart(470, 150, 50, -15)}${spark(940, 120, 28)}
    ${at('left:70px;top:130px;width:560px', `${tag('Обратный отсчёт')}
      <div style="font:700 380px/0.9 Osw;margin-top:30px;background:linear-gradient(180deg,#ff9fd0,#F0479A 60%,#c92a78);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(240,71,154,.55))">${n}</div>
      <div class="scr" style="font-size:110px;line-height:1;margin-top:-10px">${unit}</div>
      ${sub(s)}${b ? pill(b) : ''}`)}${foot}`,
  whisper: ({ q }) => `${bg}
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,rgba(240,71,154,.28),rgba(240,71,154,0) 55%)"></div>
    ${heart(150, 180, 40, -15, .6)}${heart(880, 760, 52, 12, .8)}${spark(860, 170, 26)}${spark(120, 800, 22)}
    ${at('left:90px;right:90px;top:170px;text-align:center', `<div style="font-size:150px;line-height:1">🤫</div>
      <div class="scr" style="font-size:120px;line-height:1.1;margin-top:10px">Шёпотом…</div>
      <div style="font:500 italic 42px/1.35 Mont;color:#fff;margin-top:40px">${q}</div>`)}${foot}`,
  live: ({ w, p, s, b }) => `${bg}${photoTop(P.dubai, '50% 45%', 600)}
    ${at('left:70px;top:70px', `<span style="display:inline-flex;align-items:center;gap:14px;background:#E5203A;border-radius:12px;padding:12px 24px;font:700 34px Osw;color:#fff;letter-spacing:.06em"><span style="width:20px;height:20px;border-radius:50%;background:#fff"></span>LIVE</span>`)}
    ${at('left:70px;right:70px;top:560px', `${title(w, p, 100)}${sub(s)}${pill(b)}`)}${foot}`,
  cases: () => `${bg}${heart(940, 90, 44, 12)}${spark(80, 90, 26)}
    ${at('left:70px;right:70px;top:90px', `${tag('Истории моих учениц')}${title('«Со мной что-то', 'не так»', 84)}
      <div style="display:grid;gap:16px;margin-top:36px">
      ${[['👸🏽', 'Анна, 27', '4 года одна', 'предложение через 1,5 месяца 💍'], ['🎁', 'Лиза', 'синдром «я сама»', 'подарок 100 000 ₽ от незнакомца'], ['👰🏼', 'Илона', 'не верила в любовь', 'вышла замуж']]
        .map(([e, n, a, z], k) => `<div class="card ${k === 1 ? 'hl' : ''}" style="display:flex;align-items:center;gap:24px;padding:22px 28px"><div style="font-size:54px">${e}</div>
          <div><div style="font:700 34px Osw;text-transform:uppercase;color:#fff">${n}</div><div style="font:500 24px/1.3 Mont;color:#C9C9CF">${a} <span style="color:var(--pink)">→</span> <b style="color:#fff">${z}</b></div></div></div>`).join('')}
      </div>`)}${foot}`,
  quiz: () => `${bg}${heart(940, 90, 44, 12)}${spark(80, 940, 24)}
    ${at('left:70px;right:70px;top:90px', `${tag('Мини-тест')}${title('Ответь честно', '3 вопроса', 84)}
      <div style="display:grid;gap:16px;margin-top:34px">
      ${['Ты радуешься любому вниманию, даже «крохам»?', 'Когда он не пишет, ищешь проблему в себе?', 'С «хорошими» скучно, а цепляют холодные?']
        .map((t, k) => `<div class="card" style="display:flex;align-items:center;gap:22px;padding:22px 28px"><span class="num" style="min-width:56px;height:52px;font-size:28px">0${k + 1}</span><div style="font:500 28px/1.3 Mont;color:#fff">${t}</div></div>`).join('')}
      </div>
      <div class="result" style="margin-top:26px;padding:22px 28px"><span class="lab" style="font-size:24px">Хоть одно «да»?</span><span class="rt" style="font-size:24px">Это не невезение. Это сценарий 🤍</span></div>`)}${foot}`,
  form: ({ tg, w, p, s, b }) => `${bg}${photoRight(P.dress, '50% 20%', 460)}${heart(520, 120, 46, -10)}${spark(560, 900, 24)}
    ${at('left:70px;width:640px;top:110px', `${tag(tg)}${title(w, p, 84)}
      <div style="display:grid;gap:12px;margin-top:30px">${['Где ломается твой маршрут', 'Какой сценарий ты повторяешь', 'Что делать именно тебе'].map(t => `<div style="font:500 28px Mont;color:#fff"><span style="color:var(--pink);font-weight:700">→</span>&nbsp; ${t}</div>`).join('')}</div>
      ${s ? sub(s) : ''}${pill(b)}`)}${foot}`,
};

const LIST = [
  ['01_18окт_12-00_приглашение', 'photo', { tg: 'Dubai • Girls night', w: 'Давай найдём', p: 'тебе любовь!', s: 'Закрытый девичник из Дубая', b: '25 октября · 15:00 МСК · бесплатно' }],
  ['02_18окт_20-00_шёпотом', 'whisper', { q: 'Мест на разборы в эфире будет совсем немного…<br>Хочу, чтобы ты была там 🤍' }],
  ['03_19окт_12-00_моя_история', 'side', { tg: 'Моя история', w: 'Я год ждала,', p: 'что он изменится', s: 'Как я ушла от мужчины, который ничего для меня не делал, — расскажу на девичнике', b: '25.10 · 15:00 МСК' }],
  ['04_20окт_12-00_кейсы', 'cases', {}],
  ['05_20окт_20-00_шёпотом', 'whisper', { q: 'Я волнуюсь перед эфиром, как перед первым свиданием 🙈<br>Напиши мне «я тут»' }],
  ['06_21окт_12-00_мини-тест', 'quiz', {}],
  ['07_22окт_12-00_осталось_3_дня', 'count', { n: '3', unit: 'дня', s: 'до девичника — и 3 подарка тем, кто будет до конца', gifts: true }],
  ['08_22окт_20-00_шёпотом', 'whisper', { q: 'Помнишь, тебе говорили «ты слишком многого хочешь»?<br>Не слишком ❤️' }],
  ['09_23окт_12-00_осталось_2_дня', 'count', { n: '2', unit: 'дня', s: 'Пришли свою историю — разберу её в прямом эфире 🔍', gifts: true }],
  ['10_24окт_12-00_завтра', 'photo', { tg: 'Завтра · 15:00 МСК', w: 'Уже завтра', p: 'девичник!', s: 'Я в Дубае и готовлю для вас эфир 🌴 Записи не будет', b: 'Ставь будильник на 14:55 ⏰' }],
  ['11_24окт_21-00_шёпотом', 'whisper', { q: 'Завтра я расскажу то, о чём никогда не говорила в канале…<br>Спокойной ночи 🌙' }],
  ['12_25окт_10-00_сегодня', 'gifts', { tg: 'Сегодня · 15:00 МСК', w: 'Сегодня', p: 'наш девичник', s: 'Наливай чай, бери блокнот. Подарки — тем, кто до конца', b: '📍 15:00 по МСК' }],
  ['13_25окт_14-00_шёпотом', 'whisper', { q: 'Через час начинаем…<br>Я уже перед камерой и немного дрожу 🙈' }],
  ['14_25окт_14-50_через_10_минут', 'count', { n: '10', unit: 'минут', s: 'Заходи заранее, чтобы не пропустить начало', b: 'Зайти на эфир →' }],
  ['15_25окт_15-05_мы_в_эфире', 'live', { w: 'Мы', p: 'в эфире!', s: 'Заходи, пока не начались разборы. Подарки — только тем, кто до конца 🎁', b: 'Смотреть эфир →' }],
  ['16_25окт_15-40_догоняй', 'live', { w: 'Идут', p: 'разборы!', s: 'Самое сильное — прямо сейчас. Ещё не поздно зайти 🔥', b: 'Смотреть эфир →' }],
  ['17_25окт_17-00_анкета', 'form', { tg: 'Бесплатно', w: 'Персональный', p: 'разбор', s: 'Мест немного · до вторника 23:59', b: 'Заполнить анкету →' }],
  ['18_26окт_12-00_шёпотом', 'whisper', { q: 'Одна девочка написала мне после эфира…<br>Может, следующая история — твоя? 🤍' }],
  ['19_26окт_19-00_не_успела', 'form', { tg: 'Не успела на эфир?', w: 'Записи нет,', p: 'а разбор есть', s: 'Разберём именно твою историю — это даже ценнее эфира', b: 'Заполнить анкету →' }],
  ['20_27окт_12-00_последний_день', 'count', { n: '1', unit: 'день', s: 'Сегодня в 23:59 закрываем анкеты на персональный разбор', b: 'Успеть →' }],
  ['21_27окт_21-00_осталось_3_часа', 'count', { n: '3', unit: 'часа', s: 'В 23:59 анкета закроется 🤍', b: 'Заполнить анкету →' }],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  const only = process.argv[2];
  for (const [name, t, d] of LIST) {
    if (only && !name.startsWith(only)) continue;
    const html = L.page(name, [FONTS + `<section class="slide" style="width:1080px;height:1080px;padding:0;background:radial-gradient(circle at 100% 0%,rgba(240,71,154,.3),rgba(240,71,154,0) 45%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.22),rgba(240,71,154,0) 42%),linear-gradient(180deg,#120a12,#1a0b17)">${T[t](d)}${glitter(110, name.length * 7 + 3)}${note('girls night ♡', ['side', 'form'].includes(t) ? 'left:470px;bottom:70px' : 'right:70px;bottom:62px')}</section>`]);
    const f = path.join(PREV, 'sq.html');
    fs.writeFileSync(f, html);
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
    const el = await page.$('section');
    await el.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 90 });
  }
  await b.close();
})();
