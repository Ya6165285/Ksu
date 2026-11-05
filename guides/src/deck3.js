// Презентация «Генеральная уборка» — красно-золотой стиль (раскладка первой презентации).
// node deck3.js <fontsDir> <outDir> [onlyN,...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
const DATA = require('./deck3_data');
const ff = (fam, file, extra = '') => `@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
const css = `
${ff('Osw', 'oswald/files/oswald-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Osw', 'oswald/files/oswald-latin-700-normal.woff2', 'font-weight:700;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-500-normal.woff2', 'font-weight:500;')}
${ff('Mont', 'montserrat/files/montserrat-latin-500-normal.woff2', 'font-weight:500;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-600-normal.woff2', 'font-weight:600;')}
${ff('Mont', 'montserrat/files/montserrat-latin-600-normal.woff2', 'font-weight:600;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Mont', 'montserrat/files/montserrat-latin-700-normal.woff2', 'font-weight:700;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF;')}
${ff('Cav', 'caveat/files/caveat-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Cav', 'caveat/files/caveat-latin-700-normal.woff2', 'font-weight:700;unicode-range:U+0000-00FF;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('CormI', 'cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2', 'font-style:italic;font-weight:500;')}
:root{--gold:#e8c886;--cream:#f3dcae;--red:#d91f2a}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;color:#efe3cf;font-family:Mont;background:#120c08}
.bgimg{position:absolute;inset:-40px;background:url(file://${IMG}/bgwide.jpg) center/cover}
.grid{position:absolute;inset:-300px;transform:rotate(-9deg);background-image:linear-gradient(rgba(232,200,134,.04) 2px,transparent 2px),linear-gradient(90deg,rgba(232,200,134,.04) 2px,transparent 2px);background-size:200px 150px}
.tag{position:absolute;left:120px;top:84px;background:rgba(20,12,8,.6);border:1.5px solid #d9b77e;border-radius:999px;padding:9px 26px;font:600 20px Mont;letter-spacing:.18em;text-transform:uppercase;color:#f3e6d0;z-index:3}
.tag:before{content:'✦ ';color:var(--gold)}
.h{position:absolute;left:120px;top:150px;right:120px;font:700 88px/1.02 Osw;text-transform:uppercase;color:var(--cream);z-index:3}
.h .p{color:var(--red)}
.gridc{display:grid;gap:24px}
.c{background:rgba(25,17,12,.74);border:1.5px solid rgba(217,183,126,.35);border-radius:26px;padding:28px 34px}
.c.hl{border:2px solid var(--red);background:linear-gradient(150deg,rgba(217,31,42,.30),rgba(30,12,10,.86) 60%)}
.num{display:inline-flex;align-items:center;justify-content:center;min-width:66px;height:60px;padding:0 12px;border-radius:14px;border:1.5px solid rgba(232,200,134,.6);background:rgba(232,200,134,.12);font:700 34px Osw;color:var(--gold);flex:none}
  .c .t{font:700 44px/1.18 Mont;color:#fff3dc}
.c .k{font:700 54px/1.05 Osw;text-transform:uppercase;color:var(--cream)}
.c .d{font:500 34px/1.35 Mont;color:#d9c8ad;margin-top:8px}
.row{display:flex;gap:22px;align-items:center}
.result{position:absolute;left:120px;right:120px;bottom:96px;border-radius:26px;padding:24px 40px;background:linear-gradient(100deg,#e3343c,#a8121c);font:700 40px Osw;text-transform:uppercase;color:#fff;text-align:center;z-index:3}
.foot{position:absolute;left:120px;right:120px;bottom:30px;display:flex;justify-content:space-between;font:600 17px Mont;letter-spacing:.2em;color:rgba(243,230,208,.45);text-transform:uppercase}
.ph{position:absolute;top:90px;bottom:90px;right:110px;width:560px;border-radius:30px;overflow:hidden;transform:rotate(2deg);border:4px solid #c9a46a;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:50% 25%}
.tape{position:absolute;width:190px;height:50px;background:linear-gradient(90deg,#c9a46a,#f1d9ae);opacity:.92;z-index:5}
.hw{position:absolute;font-family:Cav;font-weight:700;color:#e2242b;line-height:1.05;transform:rotate(-3deg);font-size:48px;z-index:6;text-shadow:0 2px 10px rgba(0,0,0,.6)}
.abs{position:absolute}
.flow{position:absolute;left:120px;top:80px;display:flex;flex-direction:column;gap:26px;z-index:3}
.flow .tag2{align-self:flex-start;background:rgba(20,12,8,.6);border:1.5px solid #d9b77e;border-radius:999px;padding:9px 26px;font:600 20px Mont;letter-spacing:.18em;text-transform:uppercase;color:#f3e6d0}
.flow .tag2:before{content:'✦ ';color:var(--gold)}
.flow .hh{font:700 84px/1.02 Osw;text-transform:uppercase;color:var(--cream)}
.flow .hh .p{color:var(--red)}
.fb{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:22px}
.hwf{font-family:Cav;font-weight:700;color:#e2242b;font-size:48px;line-height:1.05;transform:rotate(-2deg);transform-origin:left;align-self:flex-start;text-shadow:0 2px 10px rgba(0,0,0,.6)}
.gold{font-family:Corm;font-weight:700;text-transform:uppercase;line-height:.98;color:#f3dcae}
.it{font-family:CormI;font-style:italic}
.word{display:inline-block;padding:14px 40px;border-radius:18px;background:linear-gradient(100deg,#e3343c,#a8121c);font:700 64px Osw;color:#fff;letter-spacing:.04em}
.qr{background:#fff;border-radius:24px;padding:18px;display:inline-block}.qr img{width:300px;display:block}
`;
const PHOTOS = ['n_marble.jpg', 's_flowers.jpg', 'n_gifts.jpg', 'n_selfie.jpg', 'p_full.jpg', 'n_balloons.jpg', 's_mirror.jpg', 'n_roses.jpg', 'n_yacht.jpg', 's_pajama.jpg', 'p_bags.jpg', 's_walk.jpg', 'p_roses_gifts.jpg', 'p_face.jpg', 's_blueflowers.jpg', 'o_after.jpg'];
let seed = 11; const R = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const photo = (f0, pos0 = '50% 25%', extra = '') => { const [f, p2] = f0.split('|'); const pos = p2 || pos0; return `<div class="ph" style="${extra}"><img src="file://${IMG}/${f}" style="object-position:${pos}"></div><div class="tape" style="right:${extra.includes('left') ? 'auto' : '560px'};top:70px;transform:rotate(-24deg)"></div>`; };
const H = (h, right = 120) => `<div class="h" style="right:${right}px">${h[0]} <span class="p">${h[1] || ''}</span></div>`;
const note = n => n ? `<div class="hw" style="${n[1]}">${n[0]}</div>` : '';
const tag = t => `<div class="tag">${t}</div>`;
const tree = (x, y, h) => {
  const w = h * 0.62; let p = '', balls = '', lights = '';
  for (let i = 0; i < 5; i++) { const top = h * 0.1 + i * h * 0.15, bw = w * (0.36 + i * 0.16), bh = h * 0.26; p += `<polygon points="${w / 2},${top} ${w / 2 - bw / 2},${top + bh} ${w / 2 + bw / 2},${top + bh}" fill="url(#tg)"/>`; }
  const cols = ['#e2242b', '#f3d18c', '#e2242b', '#fff3dc', '#b8893c'];
  for (let i = 0; i < 26; i++) { const t = 0.18 + R() * 0.72, yy = h * t, half = (w * (0.12 + t * 0.62)) / 2, xx = w / 2 + (R() * 2 - 1) * half * 0.85; balls += `<circle cx="${xx}" cy="${yy}" r="${6 + R() * 7}" fill="${cols[i % 5]}"/>`; }
  for (let i = 0; i < 40; i++) { const t = 0.15 + R() * 0.78, yy = h * t, half = (w * (0.12 + t * 0.62)) / 2, xx = w / 2 + (R() * 2 - 1) * half * 0.9; lights += `<circle cx="${xx}" cy="${yy}" r="3.2" fill="#fff6d8"/><circle cx="${xx}" cy="${yy}" r="10" fill="#ffd98a" opacity=".25"/>`; }
  return `<svg class="abs" style="left:${x}px;top:${y}px;z-index:4" width="${w}" height="${h + 40}"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f4a32"/><stop offset="1" stop-color="#0d2a1b"/></linearGradient></defs><rect x="${w / 2 - 14}" y="${h * 0.9}" width="28" height="${h * 0.12}" fill="#4a2e1a"/>${p}${lights}${balls}<path d="M${w / 2} ${h * 0.02} l9 22 24 2 -18 15 6 24 -21 -13 -21 13 6 -24 -18 -15 24 -2z" fill="#f3d18c"/></svg>`;
};
const snow = (n = 70) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${R() * 1920}" cy="${R() * 1080}" r="${1.5 + R() * 3.5}" fill="#fff" opacity="${0.25 + R() * 0.5}"/>`; return `<svg class="abs" style="left:0;top:0;z-index:2" width="1920" height="1080">${s}</svg>`; };
const garland = () => { let s = '<path d="M0 40 Q 480 140 960 50 T 1920 40" stroke="#3a2a18" stroke-width="3" fill="none"/>'; for (let i = 0; i <= 40; i++) { const t = i / 40, x = t * 1920, y = t < .5 ? 40 + 90 * Math.sin(Math.PI * t * 2) : 50 + 80 * Math.sin(Math.PI * (t - .5) * 2); s += `<circle cx="${x}" cy="${y}" r="7" fill="#fff1c9"/><circle cx="${x}" cy="${y}" r="20" fill="#ffcf6b" opacity=".28"/>`; } return `<svg class="abs" style="left:0;top:0;z-index:2" width="1920" height="200">${s}</svg>`; };
const card = (it, big) => `<div class="c ${it.hl ? 'hl' : ''}">${it.n ? `<div class="row"><span class="num">${it.n}</span><div class="t" style="${big ? '' : ''}">${it.t || ''}</div></div>${it.d ? `<div class="d" style="margin-left:88px">${it.d}</div>` : ''}` : `${it.k ? `<div class="k">${it.k}</div>` : ''}${it.t ? `<div class="t" style="margin-top:${it.k ? 10 : 0}px">${it.t}</div>` : ''}${it.d ? `<div class="d">${it.d}</div>` : ''}`}</div>`;
const STOPS = ['Самоценность', 'Привычка терпеть', 'Синдром «я сама»', 'Бывшие', 'Новая жизнь и среда'];
const BLOCKS = [['01', 'Самоценность и опора', 'Перестаёшь доказывать'], ['02', 'Психика и сценарии', 'Закрываешь прошлое'], ['03', 'Состояние и уровень жизни', 'Твоя норма и энергия'], ['04', 'Понимание отношений', 'Что важно ему и тебе'], ['05', 'Коммуникация и границы', 'Тебя слышат'], ['06', 'Привлечение мужчины', 'Знакомства, флаги, свидания'], ['07', 'Отношения в паре', 'Финансы без «я сама»']];
let pi = 0;
const frame = (t, h, right, body, result, nt, rstyle = '') => `<div class="flow" style="right:${right}px;bottom:${result ? 210 : 90}px"><div class="tag2">${t}</div><div class="hh">${h[0]} <span class="p">${h[1] || ''}</span></div><div class="fb">${body}${nt ? `<div class="hwf">${nt[0]}</div>` : ''}</div></div>${result ? `<div class="result" style="right:${right}px;${rstyle}">${result}</div>` : ''}`;
function slide(s, n, total) {
  const foot = `<div class="foot"><span>Hey Ksusha ♥ Генеральная уборка</span><span>${String(n).padStart(2, '0')} / ${total}</span></div>`;
  const wrap = b => `<div class="bgimg"></div><div class="grid"></div>${b}${s.type !== 'cover' ? foot : ''}`;
  switch (s.type) {
    case 'cover': return wrap(`${garland()}${snow(90)}
      <div class="tag" style="top:200px">Женская встреча</div>
      <div class="abs" style="left:120px;top:270px;font:700 128px/.95 Osw;text-transform:uppercase;color:var(--cream)">Генеральная<br><span style="color:var(--red)">уборка</span></div>
      <div class="abs it" style="left:124px;top:600px;font-size:58px;color:#f3e6d0">в личной жизни перед 2027 годом</div>
      <div class="hw" style="left:124px;top:720px;font-size:96px;transform:rotate(-4deg)">Не бери его в 2027-й! ♡</div>
      <div class="abs" style="left:124px;top:880px;font:600 30px Mont;letter-spacing:.14em;color:#f3e6d0;text-transform:uppercase">Ксюша · @iamheyksusha</div>
      ${photo('p_full.jpg', '50% 8%', 'right:400px;width:470px;top:150px;bottom:110px')}${tree(1500, 330, 640)}`);
    case 'oldnew': return wrap(`${garland()}${snow(60)}${tag('2026 → 2027')}<div class="h" style="top:160px">Старая я <span class="p">→ новая я</span></div>
      <div class="gridc abs" style="left:120px;right:520px;top:340px;grid-template-columns:1fr 1fr">
        <div class="c"><div class="k" style="color:#bfae95">Старая я · 2026</div>${['Терплю, лишь бы не ушёл', '«Мне ничего не надо, я сама»', 'Бывший в голове и в телефоне', '«Нормальных мужчин нет»'].map(x => `<div class="d" style="font-size:30px;margin-top:14px">✖ ${x}</div>`).join('')}</div>
        <div class="c hl"><div class="k">Новая я · 2027</div>${['Знаю свою ценность', 'Говорю «мне важно» — и меня слышат', 'Принимаю заботу без вины', 'Рядом мужчина, который выбирает меня'].map(x => `<div class="d" style="font-size:30px;margin-top:14px;color:#fff3dc">✔ ${x}</div>`).join('')}</div></div>
      ${tree(1500, 400, 560)}<div class="hw" style="left:130px;top:930px">оставь старую себя в 2026-м ♡</div>`);
    case 'route': {
      const k = s.k, ph = ({ 3: 'n_selfie.jpg', 5: 'me_blue.jpg' })[k] || PHOTOS[(k * 3 + 2) % PHOTOS.length];
      const hdr = k === 0 ? ['Маршрут', 'генеральной уборки'] : k === 6 ? ['Твой маршрут', 'пройден'] : [`Остановка ${k}`, 'из 5'];
      return wrap(`${tag('Маршрут генеральной уборки')}${H(hdr, 760)}
        <div class="gridc abs" style="left:120px;right:760px;top:${k === 0 || k === 6 ? 330 : 290}px;gap:14px">${STOPS.map((t, i) => { const st = k === 6 || i + 1 < k ? 'done' : i + 1 === k ? 'cur' : 'next'; return `<div class="c ${st === 'cur' ? 'hl' : ''}" style="padding:16px 26px;${st === 'done' ? 'opacity:.6' : ''}"><div class="row"><span class="num">${st === 'done' ? '✔' : '0' + (i + 1)}</span><div class="t">${t}</div>${st === 'cur' ? '<span class="hw" style="position:static;font-size:44px;margin-left:auto;transform:none">← мы здесь</span>' : ''}</div></div>`; }).join('')}
          <div class="c" style="padding:16px 26px;border-color:#e8c886"><div class="row"><span class="num">★</span><div class="t" style="color:var(--cream)">Новая я · 2027</div></div></div></div>
        ${photo(ph)}${k === 6 ? '<div class="hw" style="left:130px;top:965px">а дальше — закрепить ♡</div>' : ''}`);
    }
    case 'cards': {
      const ph = s.ph; const right = ph ? 760 : 120;
      const cols = ph ? (s.cols >= 3 ? 1 : s.cols) : s.cols;
      const body = `<div class="gridc" style="grid-template-columns:repeat(${cols},1fr);${s.small ? 'gap:16px' : ''}">${s.items.map(it => s.small && it.n && it.d ? `<div class="c ${it.hl ? 'hl' : ''}" style="padding:18px 28px"><div class="row"><span class="num">${it.n}</span><div class="t">${it.t} <span style="font-weight:500;color:#d9c8ad">· ${it.d}</span></div></div></div>` : card(it)).join('')}</div>${s.example ? `<div class="c" style="border-left:5px solid var(--red);font:500 32px/1.45 Mont;color:#fff3dc">${s.example}</div>` : ''}`;
      return wrap(`${frame(s.tag, s.h, right, body, s.result, s.note)}${ph ? photo(ph) : ''}`);
    }
    case 'twocol': return wrap(frame(s.tag, s.h, s.ph ? 760 : 120, `<div class="gridc" style="grid-template-columns:${s.ph ? '1fr' : '1fr 1fr'}">
      <div class="c"><div class="k" style="color:#bfae95">${s.a[0]}</div>${s.a[1].map(x => `<div class="t" style="font-weight:600;font-size:40px;margin-top:18px;color:#d9c8ad">${s.neutral ? '•' : '✖'} ${x}</div>`).join('')}</div>
      <div class="c hl"><div class="k">${s.b[0]}</div>${s.b[1].map(x => `<div class="t" style="font-weight:600;font-size:40px;margin-top:18px">${s.neutral ? '•' : '✔'} ${x}</div>`).join('')}</div></div>`, s.result, s.note) + (s.ph ? photo(s.ph) : ''));
    case 'quote': return wrap(`${tag(s.tag)}${s.scr ? '<div class="hw" style="left:130px;top:950px;font-size:44px">📸 скринь этот слайд</div>' : ''}
      <div class="abs" style="left:120px;right:780px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:34px">
        <div style="font:700 84px/1.04 Osw;text-transform:uppercase;color:var(--cream)">${s.q}</div>
        <div class="hw" style="position:static;font-size:66px;transform:rotate(-2deg)">${s.r}</div></div>${photo(s.ph)}`);
    case 'bridge': return wrap(frame(s.tag, ['Без этого', 'отношения не получатся'], 120, `<div class="gridc" style="grid-template-columns:${s.next ? '1fr 1fr' : '1fr'}">
        <div class="c"><div class="k" style="font-size:40px">Потому что</div><div class="t" style="font-weight:600;font-size:38px;margin-top:14px">${s.why}</div></div>
        ${s.next ? `<div class="c"><div class="k" style="font-size:40px">Если продолжать так же</div><div class="t" style="font-weight:600;font-size:38px;margin-top:14px">${s.next}</div></div>` : ''}</div>`, '➜ В программе: ' + s.prog, null, 'text-transform:none;font-family:Mont;font-size:32px'));
    case 'gifts': return wrap(`${tag('Подарки тем, кто досидит до конца')}${H(['Подарки', 'тебе'])}
      <div class="gridc abs" style="left:120px;right:120px;top:290px;grid-template-columns:repeat(3,1fr)">
      ${[['n_marble.jpg', 'Спроси это,', 'прежде чем влюбиться', '20 вопросов, которые покажут, твой ли он'], ['n_selfie.jpg', 'Как просить,', 'не выпрашивая', 'Готовые сообщения о заботе и подарках'], ['n_yacht.jpg', 'Ты не любишь,', 'ты терпишь', '15 сигналов, что соглашаешься на меньшее']].map(([img, a, b, d]) => `<div class="c" style="padding:0;overflow:hidden"><div style="height:250px"><img src="file://${IMG}/${img}" style="width:100%;height:100%;object-fit:cover;object-position:50% 20%"></div><div style="padding:22px 28px"><span class="num" style="height:40px;font-size:22px">ГАЙД</span><div class="k" style="font-size:40px;margin-top:12px">${a}</div><div class="hw" style="position:static;font-size:40px;transform:none;color:#e2242b">${b}</div><div class="d" style="font-size:24px">${d}</div></div></div>`).join('')}</div>
      <div class="result" style="font-size:32px">+ Личный созвон со мной и секретный подарок — расскажу в конце</div>
      <div class="hw" style="right:140px;top:200px;font-size:44px">кодовое слово — только в конце ♡</div>`);
    case 'about': return wrap(`${tag('Обо мне')}${H(['Привет,', 'я Ксюша'], 760)}
      <div class="gridc abs" style="left:120px;right:760px;top:290px;grid-template-columns:1fr 1fr;gap:20px">
        <div class="c" style="padding:22px 26px"><div class="k" style="font-size:36px;color:#bfae95">Я до</div>${['Изменили с лучшей подругой', 'Год ждала, что изменится', '«Вызови такси сама»', 'За всё платила я'].map(x => `<div class="d" style="font-size:29px;margin-top:10px">✖ ${x}</div>`).join('')}</div>
        <div class="c hl" style="padding:22px 26px"><div class="k" style="font-size:36px">Я после</div>${['Мужчина ценит и вкладывается', 'Балует подарками просто так', 'Уверена в себе', 'Отношения без качелей'].map(x => `<div class="d" style="font-size:29px;margin-top:10px;color:#fff3dc">✔ ${x}</div>`).join('')}</div></div>
      <div class="gridc abs" style="left:120px;right:760px;top:700px;grid-template-columns:repeat(3,1fr);gap:16px">${[['1 000+', 'учениц'], ['10 000+', 'на YouTube'], ['300 000+', 'в Instagram']].map(([a, b]) => `<div class="c" style="padding:16px 20px;text-align:center"><div class="k" style="font-size:52px;color:var(--gold)">${a}</div><div class="d" style="margin:0">${b}</div></div>`).join('')}</div>
      <div class="abs" style="right:110px;top:90px;width:560px;height:900px">
        <div class="ph" style="right:270px;width:290px;top:60px;bottom:auto;height:420px;transform:rotate(-4deg)"><img src="file://${IMG}/o_before.jpg"></div>
        <div class="ph" style="right:0;width:330px;top:330px;bottom:auto;height:480px;transform:rotate(3deg)"><img src="file://${IMG}/o_after.jpg"></div>
        <div class="hw" style="left:30px;top:520px;font-size:46px">до</div><div class="hw" style="right:40px;top:830px;font-size:46px">после ♡</div></div>
      <div class="hw" style="left:130px;top:905px;font-size:44px">внешность та же — изменилось то, что я считаю нормой</div>`);
    case 'review': return wrap(`${tag('Уже работает')}${H(['После', 'прошлого эфира'])}
      <div class="abs" style="left:120px;top:320px;width:1000px"><img src="file://${IMG}/review_solved.jpg" style="width:100%;border-radius:26px;border:3px solid #c9a46a;box-shadow:0 20px 60px rgba(0,0,0,.6)"></div>
      <div class="c abs" style="right:120px;top:340px;width:560px"><div class="k" style="font-size:96px;color:var(--gold)">[3]</div><div class="t" style="margin-top:8px">девочки уже в новом потоке «Девушки на миллион»</div></div>
      <div class="hw" style="left:140px;top:900px;font-size:54px">«решила свой запрос прямо на эфире» ♡</div>`);
    case 'case': {
      const im = x => { const [f, p] = x.split('|'); return `<img src="file://${IMG}/${f}" style="object-position:${p || '50% 25%'}">`; };
      const ph = s.ph.length === 2 ? `<div class="ph" style="width:330px;right:340px;top:100px;bottom:auto;height:520px;transform:rotate(-3deg)">${im(s.ph[0])}</div><div class="ph" style="width:330px;right:110px;top:400px;bottom:auto;height:540px;transform:rotate(3deg)">${im(s.ph[1])}</div>` : photo(s.ph[0]);
      return wrap(`${tag('Результаты учениц')}<div class="h" style="right:820px">${s.name}</div><div class="hw" style="left:124px;top:262px;font-size:54px;transform:rotate(-1deg)">${s.sub}</div>
        <div class="gridc abs" style="left:120px;right:820px;top:370px">
          <div class="c"><div class="k" style="font-size:30px;color:#bfae95">До</div><div class="t" style="font-weight:500;font-size:34px;margin-top:8px;color:#d9c8ad">${s.before}</div></div>
          <div class="c hl"><div class="k" style="font-size:30px">После</div><div class="t" style="font-weight:600;font-size:34px;margin-top:8px">${s.after}</div></div></div>
        ${ph}${s.note ? `<div class="hw" style="left:130px;top:960px;font-size:36px;opacity:.8">${s.note}</div>` : ''}`);
    }
    case 'cta': return wrap(`${tag(s.tag)}${H(s.h, 560)}
      <div class="gridc abs" style="left:120px;right:600px;top:330px;gap:16px">${s.lines.map((l, i) => `<div class="c" style="padding:20px 28px"><div class="row"><span class="num">${i + 1}</span><div class="t" style="font-size:32px">${l}</div></div></div>`).join('')}</div>
      <div class="abs" style="left:120px;top:${330 + s.lines.length * 120 + 30}px;font:600 34px Mont;color:#f3e6d0">Напиши слово <span class="word">${s.word}</span> → <b style="color:var(--cream)">@iamheyksusha</b></div>
      <div class="abs" style="right:140px;top:300px;text-align:center"><div class="qr"><img src="file://${IMG}/qr_iamheyksusha.png"></div><div class="hw" style="position:static;font-size:40px;margin-top:16px">наведи камеру ♡</div></div>${note(s.note)}`);
    case 'formula': return wrap(`${tag('Остановка 2 · Привычка терпеть')}${H(['Формула', 'границы'])}
      <div class="gridc abs" style="left:120px;right:120px;top:300px;grid-template-columns:repeat(4,1fr)">${[['1', 'Когда ты…', 'что он делает'], ['2', 'Я чувствую…', 'твоё чувство'], ['3', 'Мне важно…', 'твоя потребность'], ['4', 'Давай…', 'как по-другому']].map(([n, t, d], i) => card({ n, t, d, hl: i === 3 })).join('')}</div>
      <div class="c abs" style="left:120px;right:120px;top:600px;border-left:5px solid var(--red);font:500 32px/1.45 Mont;color:#fff3dc">«Когда ты пропадаешь на весь вечер, я волнуюсь. Мне важно знать, что ты в порядке. <b style="color:var(--cream)">Давай ты просто напишешь "задерживаюсь"?</b>»</div>
      <div class="hw" style="right:140px;top:190px">скринь, пригодится ♡</div><div class="hw" style="left:130px;top:880px;font-size:42px">если повторится — скажи, что сделаешь ты: «не буду ждать, пойду ужинать с подругой»</div>`);
    case 'game': return wrap(`${tag('Игра')}${H(['Терпишь', 'или выбираешь?'], 760)}
      <div class="gridc abs" style="left:120px;right:760px;top:340px;grid-template-columns:1fr 1fr"><div class="c" style="text-align:center"><div class="k" style="font-size:120px;color:#bfae95">Т</div><div class="t">терплю</div></div><div class="c hl" style="text-align:center"><div class="k" style="font-size:120px">В</div><div class="t">выбираю себя</div></div></div>
      <div class="result" style="right:760px">Пиши в чат букву</div>${photo('n_gifts.jpg')}<div class="hw" style="left:130px;top:640px">5 ситуаций из жизни ↓</div>`);
    case 'sit-q': return wrap(`${tag('Игра · Ситуация ' + s.i + ' из 5')}${H(['Ситуация', s.i])}
      <div class="c abs" style="left:120px;right:120px;top:320px;font:600 44px/1.35 Mont;color:#fff3dc;padding:40px 48px">${s.s}</div>
      <div class="c abs" style="left:120px;right:900px;top:610px"><div class="k" style="font-size:30px;color:#bfae95">Ты:</div><div class="t" style="font-weight:500;color:#d9c8ad;margin-top:8px">${s.you}</div></div>
      <div class="result" style="left:1080px">Т или В? Пиши в чат</div>`);
    case 'sit-a': return wrap(`${tag('Игра · Ситуация ' + s.i + ' из 5')}${H(['Как ответить', 'экологично'], 760)}
      <div class="c hl abs" style="left:120px;right:760px;top:320px;font:600 38px/1.4 Mont;color:#fff3dc;padding:40px 44px">${s.a}</div>
      ${photo(PHOTOS[(s.i * 5) % PHOTOS.length])}<div class="hw" style="left:130px;top:920px">спокойно, без обвинений — и граница сохранена ♡</div>`);
    case 'students': return wrap(`${tag('Результаты учениц')}${H(['1 000+', 'учениц'], 1000)}
      <div class="abs" style="left:120px;top:330px;width:760px;font:700 64px/1.1 Osw;text-transform:uppercase;color:var(--cream)">1 успех — везение.<br><span style="color:var(--red)">1 000 — система</span></div>
      <div class="hw" style="left:130px;top:560px;font-size:52px">и следующей можешь быть ты ♡</div>
      <div class="ph" style="left:900px;right:110px;width:auto;top:220px;bottom:200px;transform:rotate(1.5deg)"><img src="file://${IMG}/students.jpg" style="object-position:50% 50%"></div><div class="tape" style="left:880px;top:200px;transform:rotate(-20deg)"></div>`);
    case 'reviews': {
      const bgs = ['p_roses_gifts.jpg', 'n_roses.jpg', 's_blueflowers.jpg', 'n_gifts.jpg', 'n_balloons.jpg', 's_flowers.jpg'];
      return wrap(`<div class="abs" style="inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;opacity:.38;filter:blur(2px)">${bgs.map(b => `<img src="file://${IMG}/${b}" style="width:100%;height:100%;object-fit:cover">`).join('')}</div><div class="abs" style="inset:0;background:rgba(18,12,8,.55)"></div>
        ${tag('Отзывы')}${H(['Отзывы', 'о моих программах'])}
        <img class="abs" src="file://${IMG}/rv_katya.jpg" style="left:120px;top:290px;width:620px;border-radius:20px;border:3px solid #c9a46a;transform:rotate(-2deg);box-shadow:0 20px 50px rgba(0,0,0,.6)">
        <img class="abs" src="file://${IMG}/rv_carry.jpg" style="left:800px;top:270px;width:560px;border-radius:20px;border:3px solid #c9a46a;transform:rotate(2deg);box-shadow:0 20px 50px rgba(0,0,0,.6)">
        <img class="abs" src="file://${IMG}/rv_changed.jpg" style="left:1180px;top:640px;width:600px;border-radius:20px;border:3px solid #c9a46a;transform:rotate(-2deg);box-shadow:0 20px 50px rgba(0,0,0,.6)">
        <img class="abs" src="file://${IMG}/review_solved.jpg" style="left:200px;top:700px;width:600px;border-radius:20px;border:3px solid #c9a46a;transform:rotate(1.5deg);box-shadow:0 20px 50px rgba(0,0,0,.6)">
        <div class="hw" style="left:860px;top:900px;font-size:52px">ради этих слов я и работаю ♡</div>`);
    }
    case 'chain': return wrap(`${tag('Программа')}${H(['Отношения —', 'это цепочка'])}
      <div class="abs row" style="left:120px;right:120px;top:360px;gap:14px">${['Самоценность', 'Границы', 'Умение принимать', 'Свобода от прошлого', 'Новая среда'].map((t, i) => `<div class="c" style="flex:1;text-align:center;padding:30px 14px"><span class="num">${i + 1}</span><div class="t" style="font-size:30px;margin-top:14px">${t}</div></div>${i < 4 ? '<div style="font:700 50px Osw;color:var(--gold)">→</div>' : ''}`).join('')}</div>
      <div class="result">Выпадает одно звено — рвётся вся цепочка</div><div class="hw" style="left:130px;top:700px;font-size:46px">нужен не один секрет, а система ♡</div>`);
    case 'program': return wrap(`${tag('Программа · старт через 3,5 недели')}${H(['«Девушка', 'на миллион»'])}
      <div class="gridc abs" style="left:120px;right:120px;top:300px;grid-template-columns:repeat(4,1fr);gap:18px">${BLOCKS.map(([n, t, d], i) => `<div class="c" style="padding:22px 24px"><span class="num">${n}</span><div class="t" style="font-size:30px;margin-top:12px">${t}</div><div class="d" style="font-size:24px">${d}</div></div>`).join('')}
        <div class="c hl" style="padding:22px 24px;display:flex;flex-direction:column;justify-content:center"><div class="k" style="font-size:40px">Маршрут к отношениям мечты</div></div></div>`);
    case 'offer': return wrap(`${tag('Только 24 часа')}${H(['Тем, кто зайдёт', 'в программу'])}
      <div class="gridc abs" style="left:120px;right:120px;top:300px;grid-template-columns:1fr 1fr;gap:18px">
        ${[['💎', 'Личный видеосозвон со мной', 'Твоя ситуация · моя консультация 50 000 ₽'], ['💎', 'Разбор «Тот или не тот?»', 'Переписка или прошлый мужчина + стратегия'], ['💎', 'Повторный поток бесплатно', 'Не увидишь результат — пройдёшь ещё раз'], ['🤍', 'Доступ навсегда + чат', 'Уроки остаются с тобой']].map(([e, t, d]) => `<div class="c"><div class="t">${e} ${t}</div><div class="d">${d}</div></div>`).join('')}
        <div class="c hl" style="grid-column:1/3"><div class="t">🤫 Секретный подарок — гайд «Где он?» по сайтам знакомств</div><div class="d" style="color:#f3e6d0">Как я знакомилась с обеспеченными мужчинами, которые меня одаривали. Только при покупке программы</div></div></div>
      <div class="hw" style="right:140px;top:110px">бонусы сгорают через 24 часа</div>`);
    case 'codeword': return wrap(`${tag('Подарки')}${H(['Кодовое', 'слово'], 600)}
      <div class="abs" style="left:120px;top:330px"><span class="word" style="font-size:120px;padding:20px 60px">УБОРКА</span></div>
      <div class="abs" style="left:120px;top:540px;width:780px;font:600 40px Mont;color:#f3e6d0">→ <b style="color:var(--cream)">@iamheyksusha</b><br>и забирай 3 гайда</div>
      <div class="abs" style="left:980px;top:250px;display:flex;gap:26px">${[1, 2, 3].map((i) => `<img src="file://${IMG}/gcov${i}-1.jpg" style="width:270px;border-radius:14px;border:3px solid #c9a46a;box-shadow:0 20px 50px rgba(0,0,0,.6);transform:rotate(${(i - 2) * 4}deg)">`).join('')}</div>
      <div class="abs" style="left:120px;top:700px;text-align:center"><div class="qr"><img src="file://${IMG}/qr_iamheyksusha.png" style="width:200px"></div></div>
      <div class="hw" style="left:420px;top:820px;font-size:44px">🤫 секретный гайд «Где он?» — тем, кто в программе</div>`);
    case 'final': return wrap(`${garland()}${snow(80)}<div class="abs" style="left:120px;right:780px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div style="font:700 60px/1.15 Osw;text-transform:uppercase;color:var(--cream)">Твоя жизнь меняется не когда появляется новый мужчина, а когда ты впервые <span style="color:var(--red)">выбираешь себя</span></div>
      <div class="hw" style="position:static;font-size:72px">В 2027-й заходит новая ты ♡</div><div class="hw" style="position:static;font-size:52px;transform:rotate(-1deg)">Ксюша</div></div>
      ${photo('p_full.jpg', '50% 8%')}${tree(860, 560, 420)}`);
  }
}
(async () => {
  // expand sit into two slides
  const list = [];
  for (const s of DATA) { if (s.type === 'sit') { list.push({ ...s, type: 'sit-q' }, { ...s, type: 'sit-a' }); } else list.push(s); }
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [i, s] of list.entries()) {
    const n = i + 1; if (ONLY && !ONLY.includes(n)) continue;
    const tmp = path.join(OUT, '_t.html');
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${slide(s, n, list.length)}</body></html>`);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => { document.querySelectorAll('.fb').forEach(fb => { let z = 1; while (fb.scrollHeight > fb.clientHeight + 2 && z > 0.6) { z -= 0.04; fb.style.zoom = z; } }); });
    await pg.screenshot({ path: path.join(OUT, `s${String(n).padStart(3, '0')}.jpg`), type: 'jpeg', quality: 86 });
  }
  try { fs.unlinkSync(path.join(OUT, '_t.html')); } catch (e) {}
  await b.close(); console.log('slides', list.length);
})();
