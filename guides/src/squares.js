// Square 1080x1080 covers for every bot message of the girls' night chain
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const IMG = L.IMG;
const PREV = path.resolve(__dirname, '../preview');
const OUT = '/home/user/Ksu/launch/bot_covers';

const P = {
  pj: `file://${IMG}/pajama.jpg`,
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
const at = (css, html) => `<div style="position:absolute;${css};z-index:5">${html}</div>`;
const tag = (t, fs = 28) => `<span class="tag" style="background:rgba(11,11,13,.75);font-size:${fs}px;padding:14px 30px;letter-spacing:.14em"><b style="font-size:${fs + 4}px">✦</b>${t}</span>`;
const title = (w, p, ws = 112, ps = 150) => `<div style="margin-top:18px">
  <div style="font:700 ${ws}px/0.98 Osw;text-transform:uppercase;background:linear-gradient(180deg,#fff 30%,#dcdce2);-webkit-background-clip:text;color:transparent">${w}</div>
  ${p ? `<div class="scr" style="font-size:${ps}px;line-height:1.02;margin-top:-6px">${p}</div>` : ''}</div>`;
const sub = (t, fs = 38) => `<div style="font:600 ${fs}px/1.3 Mont;color:#fff;margin-top:14px;text-shadow:0 2px 12px rgba(0,0,0,.6)">${t}</div>`;
const pill = (t, fs = 42) => `<div class="btn" style="margin-top:26px;font-size:${fs}px;padding:18px 40px;box-shadow:0 0 40px rgba(240,71,154,.55)">${t}</div>`;

function books(x, y, sc = 1) {
  const card = (src, l, t, r, z) => `<img src="${src}" style="position:absolute;left:${l * sc}px;top:${t * sc}px;width:${300 * sc}px;height:${424 * sc}px;object-fit:cover;border-radius:${16 * sc}px;transform:rotate(${r}deg);z-index:${z};box-shadow:0 24px 60px rgba(0,0,0,.6);border:3px solid rgba(255,255,255,.25)">`;
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${640 * sc}px;height:${520 * sc}px;z-index:3">
   ${card(P.g2, 0, 70, -12, 1)}${card(P.g3, 340, 70, 12, 1)}${card(P.g1, 170, 20, 0, 2)}
   <div style="position:absolute;left:${210 * sc}px;top:${-30 * sc}px;width:${220 * sc}px;height:${72 * sc}px;z-index:3;background:linear-gradient(90deg,#F0479A,#F678B4);border-radius:10px;transform:rotate(-4deg);display:flex;align-items:center;justify-content:center;font:700 ${34 * sc}px Osw;color:#fff;letter-spacing:.06em;box-shadow:0 8px 24px rgba(0,0,0,.4)">🎁 ПОДАРКИ</div></div>`;
}
const photoTop = (src, pos, h) => `<div style="position:absolute;left:0;right:0;top:0;height:${h}px;z-index:1"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};-webkit-mask-image:linear-gradient(180deg,#000 55%,rgba(0,0,0,.45) 78%,transparent 100%)"></div>`;
const photoRight = (src, pos, w) => `<div style="position:absolute;right:0;top:0;bottom:0;width:${w}px;z-index:1"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.6) 18%,#000 40%)"></div>`;

const pol = (css, w, h, rot = 4, src = P.pj, pos = '50% 45%') => `<div style="position:absolute;${css};transform:rotate(${rot}deg);z-index:3">
  <div style="position:absolute;right:-46px;top:-16px;width:170px;height:48px;background:linear-gradient(90deg,#F0479A,#F678B4);transform:rotate(32deg);z-index:2"></div>
  <div style="position:absolute;left:-50px;bottom:-14px;width:170px;height:48px;background:linear-gradient(90deg,#F0479A,#F678B4);transform:rotate(32deg);z-index:2"></div>
  <div style="width:${w}px;height:${h}px;border-radius:28px;overflow:hidden;border:5px solid rgba(255,255,255,.92);box-shadow:0 26px 70px rgba(0,0,0,.6),0 0 50px rgba(240,71,154,.35)"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"></div></div>`;

let ks = 3; const kr = () => ((ks = (ks * 9301 + 49297) % 233280) / 233280);
function dubai() {
  ks = 3; const W = 1080, H = 1080, hz = 1080; let d = `<defs><linearGradient id="bb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0f2a"/><stop offset="1" stop-color="#12070f"/></linearGradient>
   <linearGradient id="glowsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0479A" stop-opacity="0"/><stop offset="1" stop-color="#F0479A" stop-opacity=".45"/></linearGradient></defs>
   <rect x="0" y="560" width="${W}" height="520" fill="url(#glowsky)"/>`;
  let x = -10; while (x < W) { const w = 40 + kr() * 60, h = 140 + kr() * 220; d += `<rect x="${x}" y="${hz - h}" width="${w}" height="${h}" fill="#2a0c20" opacity=".9"/>`; x += w + 3; }
  const bx = 820, bt = 640; const pts = [[-30, 0], [-30, .22], [-23, .22], [-23, .42], [-16, .42], [-16, .6], [-10, .6], [-10, .74], [-5, .74], [-5, .86], [-2, .86], [0, 1]];
  const poly = [...pts.map(([dx, f]) => `${bx + dx},${hz - bt * f}`), ...pts.slice().reverse().map(([dx, f]) => `${bx - dx},${hz - bt * f}`)].join(' ');
  d += `<polygon points="${poly}" fill="url(#bb)" stroke="#ff7ab8" stroke-width="2" stroke-opacity=".7"/>`;
  for (let y = hz - bt * .86; y < hz; y += 12) d += `<rect x="${bx - 1.5}" y="${y}" width="3" height="5" fill="#ffd1e8" opacity=".9"/>`;
  x = -20; while (x < W) { const w = 50 + kr() * 70, h = 80 + kr() * 170, y = hz - h; if (Math.abs(x + w / 2 - bx) < 80) { x += 90; continue; }
    d += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#bb)"/><rect x="${x}" y="${y}" width="${w}" height="2" fill="#ff7ab8" opacity=".6"/>`;
    for (let wy = y + 10; wy < hz - 6; wy += 13) for (let wx = x + 7; wx < x + w - 7; wx += 10) if (kr() < .3) d += `<rect x="${wx}" y="${wy}" width="4" height="6" fill="${kr() < .5 ? '#ffd1e8' : '#ff7ab8'}" opacity="${.5 + kr() * .5}"/>`;
    x += w + 4; }
  return `<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0;z-index:1">${d}</svg>`;
}

const T = {
  photo: ({ tg, w, p, s, b }) => `${dubai()}${pol('right:70px;top:80px', 400, 640, 4)}${heart(560, 70, 60, -12)}
    ${at('left:56px;width:560px;top:70px', `${tag(tg, 26)}${title(w, p, 96, 140)}${s ? sub(s) : ''}`)}
    ${b ? at('left:56px;right:56px;bottom:56px', pill(b)) : ''}`,
  side: ({ tg, w, p, s, b }) => `${photoRight(P.dress, '45% 18%', 560)}${heart(470, 930, 60, -10)}
    ${at('left:56px;width:600px;top:70px', `${tag(tg)}${title(w, p, 104, 132)}${s ? sub(s, 36) : ''}${b ? pill(b, 40) : ''}`)}`,
  gifts: ({ w, p, s, b }) => `${books(150, 50, 1.22)}${heart(70, 90, 60, -15)}${heart(960, 80, 54, 12)}
    ${at('left:56px;right:56px;top:640px', `${title(w, p, 110, 140)}${s ? sub(s) : ''}${b ? pill(b) : ''}`)}`,
  count: ({ n, unit, s, b, gifts, ph }) => `${gifts ? books(440, 150, 1.0) : ph === 'dress' ? photoRight(P.dress, '45% 18%', 600) : dubai() + pol('right:70px;top:110px', 400, 640, 4)}${heart(gifts ? 960 : 900, 60, 60, 12)}
    ${at('left:56px;top:40px;width:520px', `${tag('Обратный отсчёт')}
      <div style="font:700 ${n.length > 1 ? 470 : 560}px/0.86 Osw;margin-top:20px;background:linear-gradient(180deg,#ffb3db,#F0479A 55%,#c92a78);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(240,71,154,.55))">${n}</div>
      <div class="scr" style="font-size:170px;line-height:.9;margin-top:-30px">${unit}</div>`)}
    ${at('left:56px;width:' + (gifts ? 968 : 560) + 'px;bottom:56px', `${sub(s, 42)}${b ? pill(b) : ''}`)}`,
  whisper: ({ q }) => `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,rgba(240,71,154,.30),rgba(240,71,154,0) 60%)"></div>
    ${heart(80, 120, 60, -15, .8)}${heart(930, 860, 70, 12, .9)}
    ${at('left:60px;right:60px;top:110px;text-align:center', `<div style="font-size:200px;line-height:1">🤫</div>
      <div class="scr" style="font-size:190px;line-height:1.1;margin-top:-10px">Шёпотом…</div>
      <div style="font:600 italic 64px/1.3 Mont;color:#fff;margin-top:34px;text-shadow:0 2px 14px rgba(0,0,0,.6)">${q}</div>`)}
    ${at('left:0;right:0;bottom:60px;text-align:center', `<div class="scr" style="font-size:96px">Ксюша ♡</div>`)}`,
  live: ({ w, p, s, b }) => `${dubai()}${pol('right:70px;top:90px', 400, 640, 4)}
    ${at('left:56px;top:56px', `<span style="display:inline-flex;align-items:center;gap:16px;background:#E5203A;border-radius:14px;padding:14px 30px;font:700 52px Osw;color:#fff;letter-spacing:.06em;box-shadow:0 0 30px rgba(229,32,58,.6)"><span style="width:28px;height:28px;border-radius:50%;background:#fff"></span>LIVE</span>`)}
    ${at('left:56px;width:560px;top:190px', `${title(w, p, 130, 170)}${sub(s)}`)}${at('left:56px;right:56px;bottom:56px', pill(b))}`,
  cases: () => `${heart(960, 50, 60, 12)}
    ${at('left:56px;right:56px;top:50px', `${title('«Со мной что-то', 'не так»', 96, 130)}
      <div style="display:grid;gap:24px;margin-top:24px">
      ${[['👸🏽', 'Анна, 27', '4 года одна → предложение 💍'], ['🎁', 'Лиза', '«я сама» → подарок 100 000 ₽'], ['👰🏼', 'Илона', 'не верила в любовь → замужем']]
        .map(([e, n, z], k) => `<div class="card ${k === 1 ? 'hl' : ''}" style="display:flex;align-items:center;gap:28px;padding:34px 34px;border-radius:30px"><div style="font-size:100px;line-height:1">${e}</div>
          <div><div style="font:700 52px/1 Osw;text-transform:uppercase;color:#fff">${n}</div><div style="font:600 38px/1.25 Mont;color:#fff;margin-top:10px">${z}</div></div></div>`).join('')}
      </div>${pill('Найдём твой сценарий · 25.10', 40)}`)}`,
  quiz: () => `${heart(960, 50, 60, 12)}
    ${at('left:56px;right:56px;top:50px', `${title('Ответь честно', '3 вопроса', 104, 130)}
      <div style="display:grid;gap:16px;margin-top:16px">
      ${['Радуешься даже «крохам» внимания?', 'Он не пишет — ищешь проблему в себе?', 'С «хорошими» скучно, цепляют холодные?']
        .map((t, k) => `<div class="card" style="display:flex;align-items:center;gap:24px;padding:30px 30px;border-radius:26px"><span class="num" style="min-width:70px;height:64px;font-size:38px">0${k + 1}</span><div style="font:600 40px/1.25 Mont;color:#fff">${t}</div></div>`).join('')}
      </div>
      <div class="result" style="margin-top:26px;padding:28px 30px;border-radius:26px"><span class="rt" style="font-size:40px;font-weight:700">Хоть одно «да» — это не невезение, а сценарий 🤍</span></div>`)}`,
  form: ({ tg, w, p, s, b }) => `${photoRight(P.dress, '45% 18%', 470)}${heart(480, 60, 60, -10)}
    ${at('left:56px;width:660px;top:60px', `${tag(tg)}${title(w, p, 86, 130)}
      <div style="display:grid;gap:14px;margin-top:18px">${['Где ломается маршрут', 'Какой сценарий повторяешь', 'Что делать именно тебе'].map(t => `<div style="font:600 38px/1.2 Mont;color:#fff"><span style="color:var(--pink);font-weight:700">→</span> ${t}</div>`).join('')}</div>
      ${s ? sub(s, 34) : ''}${pill(b)}`)}`,
};

const LIST = [
  ['01_18окт_12-00_приглашение', 'photo', { tg: 'Girls night · Дубай', w: 'Давай найдём', p: 'тебе любовь!', b: '25.10 · 15:00 МСК · бесплатно' }],
  ['02_18окт_20-00_шёпотом', 'whisper', { q: 'Мест на разборы будет совсем немного… Хочу, чтобы ты была там 🤍' }],
  ['03_19окт_12-00_моя_история', 'side', { tg: 'Моя история', w: 'Я год ждала,', p: 'что он изменится', s: 'Как я ушла — расскажу на девичнике', b: '25.10 · 15:00' }],
  ['04_20окт_12-00_кейсы', 'cases', {}],
  ['05_20окт_20-00_шёпотом', 'whisper', { q: 'Волнуюсь, как перед первым свиданием 🙈 Напиши мне «я тут»' }],
  ['06_21окт_12-00_мини-тест', 'quiz', {}],
  ['07_22окт_12-00_осталось_3_дня', 'count', { n: '3', unit: 'дня', s: 'до девичника + 3 подарка 🎁', gifts: true }],
  ['08_22окт_20-00_шёпотом', 'whisper', { q: '«Ты слишком многого хочешь»? Не слишком ❤️' }],
  ['09_23окт_12-00_осталось_2_дня', 'count', { n: '2', unit: 'дня', s: 'Пришли историю — разберу в эфире 🔍', gifts: true }],
  ['10_24окт_12-00_завтра', 'photo', { tg: 'Завтра · 15:00 МСК', w: 'Уже завтра', p: 'девичник!', b: 'Будильник на 14:55 ⏰' }],
  ['11_24окт_21-00_шёпотом', 'whisper', { q: 'Завтра расскажу то, о чём никогда не говорила… 🌙' }],
  ['12_25окт_10-00_сегодня', 'gifts', { w: 'Сегодня', p: 'наш девичник', b: '📍 15:00 по МСК' }],
  ['13_25окт_14-00_шёпотом', 'whisper', { q: 'Через час начинаем… Я уже перед камерой 🙈' }],
  ['14_25окт_14-50_через_10_минут', 'count', { n: '10', unit: 'минут', s: 'до начала эфира', b: 'Зайти →' }],
  ['15_25окт_15-05_мы_в_эфире', 'live', { w: 'Мы', p: 'в эфире!', s: 'Подарки — тем, кто до конца 🎁', b: 'Смотреть эфир →' }],
  ['16_25окт_15-40_догоняй', 'live', { w: 'Идут', p: 'разборы!', s: 'Самое сильное — сейчас 🔥', b: 'Смотреть эфир →' }],
  ['17_25окт_17-00_анкета', 'form', { tg: 'Бесплатно', w: 'Персональный', p: 'разбор', s: 'Мест немного · до вт 23:59', b: 'Заполнить анкету →' }],
  ['18_26окт_12-00_шёпотом', 'whisper', { q: 'Может, следующая история — твоя? 🤍' }],
  ['19_26окт_19-00_не_успела', 'form', { tg: 'Не успела на эфир?', w: 'Записи нет,', p: 'а разбор есть', b: 'Заполнить анкету →' }],
  ['20_27окт_12-00_последний_день', 'count', { n: '1', unit: 'день', s: 'Сегодня в 23:59 закрываем анкеты', b: 'Успеть →', ph: 'dress' }],
  ['21_27окт_21-00_осталось_3_часа', 'count', { n: '3', unit: 'часа', s: 'В 23:59 анкета закроется 🤍', b: 'Анкета →', ph: 'dress' }],
];

function glitter2(seed) {
  gs = seed; let d = '';
  for (let i = 0; i < 70; i++) { const x = gr() * 1080, y = gr() * 1080, r = gr() * 3 + .8, c = ['#ffffff', '#ff9fd0', '#F0479A', '#ffe1a8'][Math.floor(gr() * 4)]; d += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${.4 + gr() * .55}"/>`; }
  const edge = () => { const side = Math.floor(gr() * 4), t = gr() * 1080, m = 20 + gr() * 50; return [[t, m], [1080 - m, t], [t, 1080 - m], [m, t]][side]; };
  for (let i = 0; i < 8; i++) { const [x, y] = edge(), s = 14 + gr() * 22; d += `<path d="M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z" fill="#fff" style="filter:drop-shadow(0 0 8px #ff9fd0)"/>`; }
  return `<svg width="1080" height="1080" style="position:absolute;left:0;top:0;z-index:4;pointer-events:none">${d}</svg>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  const only = process.argv[2];
  for (const [name, t, d] of LIST) {
    if (only && !name.startsWith(only)) continue;
    const html = L.page(name, [FONTS + `<section class="slide" style="width:1080px;height:1080px;padding:0;background:radial-gradient(circle at 100% 0%,rgba(240,71,154,.38),rgba(240,71,154,0) 48%),radial-gradient(circle at 0% 100%,rgba(240,71,154,.26),rgba(240,71,154,0) 44%),#0B0B0D"><div class="grid"></div>${T[t](d)}${glitter2(name.length * 7 + 3)}</section>`]);
    const f = path.join(PREV, 'sq.html');
    fs.writeFileSync(f, html);
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
    await (await page.$('section')).screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 90 });
  }
  await b.close();
})();
