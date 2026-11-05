// Презентация эфира 2 «Генеральная уборка»: md → 1920x1080 слайды в тёмном люкс-стиле → JPG
// node deck2.js <fontsDir> <outDir> [onlyN,...]
const { marked } = require(process.env.MARKED || 'marked');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
const IMG = path.resolve(__dirname, '../../launch/guides2/img');
const SRC = fs.readFileSync(path.resolve(__dirname, '../../launch/Эфир_2_слайды_текст.md'), 'utf8');
const ff = (fam, file, extra = '') => `@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
const css = `
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-cyrillic-600-normal.woff2', 'font-weight:600;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', 'font-weight:600;unicode-range:U+0000-00FF;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Corm', 'cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2', 'font-weight:700;unicode-range:U+0000-00FF;')}
${ff('CormI', 'cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2', 'font-style:italic;font-weight:500;')}
${ff('CormI', 'cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', 'font-style:italic;font-weight:500;unicode-range:U+0000-00FF;')}
${ff('Cav', 'caveat/files/caveat-cyrillic-700-normal.woff2', 'font-weight:700;')}
${ff('Cav', 'caveat/files/caveat-latin-700-normal.woff2', 'font-weight:700;unicode-range:U+0000-00FF;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-400-normal.woff2', 'font-weight:400;')}
${ff('Mont', 'montserrat/files/montserrat-latin-400-normal.woff2', 'font-weight:400;unicode-range:U+0000-00FF,U+2000-206F;')}
${ff('Mont', 'montserrat/files/montserrat-cyrillic-600-normal.woff2', 'font-weight:600;')}
${ff('Mont', 'montserrat/files/montserrat-latin-600-normal.woff2', 'font-weight:600;unicode-range:U+0000-00FF,U+2000-206F;')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;background:#120c08;color:#efe3cf;font-family:Mont,sans-serif}
.bg{position:absolute;inset:-40px;background:url(file://${IMG}/bgwide.jpg) center/cover}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 35%,rgba(0,0,0,0) 20%,rgba(0,0,0,.55) 100%)}
.tag{display:inline-block;border:2px solid #d9b77e;border-radius:50px;padding:9px 30px;font-family:Corm;font-weight:600;font-size:26px;letter-spacing:.16em;text-transform:uppercase;color:#f3e6d0;background:rgba(20,12,8,.45)}
.gold{font-family:Corm;font-weight:700;text-transform:uppercase;line-height:.98;color:#f3dcae;text-shadow:0 4px 24px rgba(0,0,0,.55)}
.red{font-family:Cav;font-weight:700;color:#e2242b;line-height:1}
.it{font-family:CormI;font-style:italic}
.abs{position:absolute}
.main{position:absolute;left:110px;top:90px;bottom:80px;display:flex;flex-direction:column}
.title{font-family:Corm;font-weight:700;text-transform:uppercase;color:#f3dcae;line-height:1.02;margin:26px 0 30px;font-size:76px;text-shadow:0 4px 24px rgba(0,0,0,.5)}
.body{flex:1;min-height:0;overflow:hidden;font-size:40px;line-height:1.36}
.body p{margin:0 0 .42em}
.body strong{color:#f6d9a2;font-weight:600}
.body em{font-family:CormI;font-style:italic;color:#e6cfa8;font-size:1.12em}
.body s{opacity:.6}
.cards{display:grid;gap:18px}
.card{background:rgba(255,255,255,.05);border:1.5px solid rgba(217,183,126,.4);border-radius:20px;padding:.5em .8em}
.card p{margin:0}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:34px}
.col{background:rgba(255,255,255,.04);border:1.5px solid rgba(217,183,126,.35);border-radius:22px;padding:26px 32px}
.col.new{border-color:#e8c886;background:rgba(232,200,134,.08)}
.col h4{font-family:Corm;font-weight:700;font-size:44px;color:#f3dcae;text-transform:uppercase;margin-bottom:14px}
.ph{position:absolute;top:90px;bottom:90px;right:100px;width:560px;border-radius:30px;overflow:hidden;border:4px solid #c9a46a;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.ph img{width:100%;height:100%;object-fit:cover}
.scr{position:absolute;right:100px;top:46px;border:1.5px solid #d9b77e;border-radius:40px;padding:8px 22px;font-family:Corm;font-weight:600;font-size:22px;letter-spacing:.14em;color:#f3e6d0;background:rgba(20,12,8,.6);text-transform:uppercase;z-index:5}
.foot{position:absolute;left:110px;right:110px;bottom:34px;display:flex;justify-content:space-between;font-family:Corm;font-weight:600;font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:rgba(243,230,208,.55)}
.qr{background:#fff;border-radius:22px;padding:18px;display:inline-block}
.qr img{width:300px;display:block}
`;
// ---------- New Year decor ----------
const tree = (x, y, h) => {
  const w = h * 0.62, layers = 5; let p = '';
  for (let i = 0; i < layers; i++) {
    const top = h * 0.1 + i * h * 0.15, bw = w * (0.36 + i * 0.16), bh = h * 0.26;
    p += `<polygon points="${w / 2},${top} ${w / 2 - bw / 2},${top + bh} ${w / 2 + bw / 2},${top + bh}" fill="url(#tg)" />`;
  }
  let balls = '', lights = '';
  const cols = ['#e2242b', '#f3d18c', '#e2242b', '#fff3dc', '#b8893c'];
  for (let i = 0; i < 26; i++) {
    const t = 0.18 + Math.random() * 0.72, yy = h * t, half = (w * (0.12 + t * 0.62)) / 2, xx = w / 2 + (Math.random() * 2 - 1) * half * 0.85;
    balls += `<circle cx="${xx}" cy="${yy}" r="${6 + Math.random() * 7}" fill="${cols[i % 5]}"/>`;
  }
  for (let i = 0; i < 40; i++) {
    const t = 0.15 + Math.random() * 0.78, yy = h * t, half = (w * (0.12 + t * 0.62)) / 2, xx = w / 2 + (Math.random() * 2 - 1) * half * 0.9;
    lights += `<circle cx="${xx}" cy="${yy}" r="3.2" fill="#fff6d8"/><circle cx="${xx}" cy="${yy}" r="10" fill="#ffd98a" opacity=".25"/>`;
  }
  return `<svg class="abs" style="left:${x}px;top:${y}px" width="${w}" height="${h + 40}"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f4a32"/><stop offset="1" stop-color="#0d2a1b"/></linearGradient></defs>
    <rect x="${w / 2 - 14}" y="${h * 0.9}" width="28" height="${h * 0.12}" fill="#4a2e1a"/>${p}${lights}${balls}
    <path d="M${w / 2} ${h * 0.02} l9 22 24 2 -18 15 6 24 -21 -13 -21 13 6 -24 -18 -15 24 -2z" fill="#f3d18c"/></svg>`;
};
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
Math.random = rnd;
const snow = (n = 70) => { let s = ''; for (let i = 0; i < n; i++) { const r = 1.5 + Math.random() * 3.5; s += `<circle cx="${Math.random() * 1920}" cy="${Math.random() * 1080}" r="${r}" fill="#fff" opacity="${0.25 + Math.random() * 0.5}"/>`; } return `<svg class="abs" style="left:0;top:0;pointer-events:none" width="1920" height="1080">${s}</svg>`; };
const garland = () => { let s = '<path d="M0 40 Q 480 140 960 50 T 1920 40" stroke="#3a2a18" stroke-width="3" fill="none"/>'; for (let i = 0; i <= 40; i++) { const t = i / 40, x = t * 1920; const y = t < .5 ? 40 + 100 * Math.sin(Math.PI * t * 2) * .9 : 50 + 90 * Math.sin(Math.PI * (t - .5) * 2) * .9; s += `<circle cx="${x}" cy="${y}" r="7" fill="#fff1c9"/><circle cx="${x}" cy="${y}" r="20" fill="#ffcf6b" opacity=".28"/>`; } return `<svg class="abs" style="left:0;top:0" width="1920" height="200">${s}</svg>`; };
// ---------- parse ----------
const slides = []; let section = '';
for (const blk of SRC.split(/\n(?=## |### Слайд)/)) {
  if (blk.startsWith('## ')) { section = blk.split('\n')[0].replace(/^## /, '').replace(/\(.*?\)/g, '').trim(); continue; }
  const m = blk.match(/^### Слайд (\d+) · (.*)\n([\s\S]*)$/); if (!m) continue;
  slides.push({ n: +m[1], title: m[2].trim(), body: m[3].replace(/\n---\s*$/, '').trim(), section });
}
const PHOTOS = ['n_marble.jpg', 's_flowers.jpg', 'n_gifts.jpg', 'n_selfie.jpg', 'p_full.jpg', 'n_balloons.jpg', 's_mirror.jpg', 'n_roses.jpg', 'n_yacht.jpg', 's_pajama.jpg', 'p_bags.jpg', 's_walk.jpg', 'p_roses_gifts.jpg', 'p_face.jpg', 's_blueflowers.jpg'];
const FIXED = { 'Почему бывший': 'p_man.jpg', 'Как сделать так, чтобы тебе было хорошо': 's_flowers.jpg', 'Как познакомиться': 'n_yacht.jpg', 'Где знакомиться': 's_mirror.jpg', 'Если ты хочешь в 2027': 'n_roses.jpg', 'Закон вложений': 'n_balloons.jpg', 'Финал': 'p_full.jpg', 'Ксения': 'n_yacht.jpg', 'Подарки тем': 'p_bags.jpg' };
let pi = 0;
const md = t => marked.parseInline(t);
function bodyHtml(b) {
  const lines = b.split('\n').filter(l => l.trim());
  // two columns: "**Header:**" lines
  const hdr = lines.map((l, i) => /^\*\*[^*]+:\*\*$/.test(l.trim()) ? i : -1).filter(i => i >= 0);
  if (hdr.length === 2) {
    const [a, c] = hdr, pre = lines.slice(0, a), A = lines.slice(a + 1, c), C = lines.slice(c + 1);
    const tailIdx = C.findIndex(l => /^\*\*.*\*\*$/.test(l.trim()) && !/^[✔✖]/.test(l)); const tail = tailIdx >= 0 ? C.splice(tailIdx) : [];
    const col = (h, arr, cls) => `<div class="col ${cls}"><h4>${md(h.replace(/\*\*/g, '').replace(/:$/, ''))}</h4>${arr.map(l => `<p>${md(l)}</p>`).join('')}</div>`;
    return pre.map(l => `<p>${md(l)}</p>`).join('') + `<div class="cols">${col(lines[a], A, '')}${col(lines[c], C, 'new')}</div>` + tail.map(l => `<p style="margin-top:.6em">${md(l)}</p>`).join('');
  }
  const isItem = l => /^\*\*(0?\d+[ .·]|Шаг|\d\.)/.test(l.trim()) || /^0\d /.test(l.trim()) || /^(— |✔|✖|☐|🎁|💎|🤍|🤫|❌|🔥)/.test(l.trim());
  const items = lines.filter(isItem);
  if (items.length >= 3) {
    let html = '', buf = [];
    const flush = () => { if (buf.length) { html += `<div class="cards" style="grid-template-columns:${buf.length >= 6 && buf.every(x => x.length < 90) ? '1fr 1fr' : '1fr'}">${buf.map(l => `<div class="card"><p>${md(l.replace(/^— /, ''))}</p></div>`).join('')}</div>`; buf = []; } };
    for (const l of lines) { if (isItem(l)) buf.push(l); else { flush(); html += `<p style="margin:.5em 0">${md(l)}</p>`; } }
    flush(); return html;
  }
  return lines.map(l => `<p>${md(l)}</p>`).join('');
}
function slideHtml(s) {
  const scr = s.title.includes('📸');
  const title = s.title.replace('📸', '').replace(/\*?\([^)]*\)\*?/g, '').replace(/^\s*·?\s*/, '').trim();
  const sec = s.section.replace(/^(ОСТАНОВКА \d) · /, '$1 · ');
  // special: cover
  if (s.n === 1) return `<div class="bg"></div><div class="vig"></div>${garland()}${snow(90)}
    <div class="abs" style="left:120px;top:190px"><span class="tag">Женская встреча</span></div>
    <div class="abs gold" style="left:110px;top:270px;font-size:124px">Генеральная<br>уборка</div>
    <div class="abs it" style="left:120px;top:590px;font-size:62px;color:#f3e6d0">в личной жизни<br>перед 2027 годом</div>
    <div class="abs red" style="left:120px;top:780px;font-size:96px;transform:rotate(-4deg)">Не бери его в 2027-й! ♡</div>
    <div class="ph" style="right:400px;top:150px;bottom:110px;width:500px;transform:rotate(2deg)"><img src="file://${IMG}/p_full.jpg" style="object-position:50% 10%"></div>
    ${tree(1480, 330, 640)}`;
  // special: old / new
  if (/Старая я → Новая я/.test(s.title)) {
    return `<div class="bg"></div><div class="vig"></div>${snow(60)}${garland()}
      <div class="main" style="right:110px;top:170px"><div><span class="tag">${sec}</span></div><div class="title">Старая я 2026 → <span style="color:#e2242b;font-family:Cav;text-transform:none">новая я 2027</span></div>
      <div class="body" style="font-size:34px;padding-right:330px">${bodyHtml(s.body)}</div></div>${tree(1560, 520, 480)}`;
  }
  if (!title) {
    const ph = PHOTOS[(s.n * 7) % PHOTOS.length];
    return `<div class="bg"></div><div class="vig"></div><div class="scr">📸 скринь этот слайд</div>
      <div class="abs" style="left:130px;top:120px"><span class="tag">${sec}</span></div>
      <div class="abs" style="left:130px;right:820px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:28px">
        ${s.body.split('\n').filter(l => l.trim()).map((l, i) => i === 0 ? `<div class="gold" style="font-size:76px;text-transform:none;line-height:1.08">${md(l.replace(/\*\*/g, ''))}</div>` : `<div class="red" style="font-size:64px">${md(l.replace(/\*\*/g, ''))}</div>`).join('')}</div>
      <div class="ph"><img src="file://${IMG}/${ph}" style="object-position:50% 25%"></div>
      <div class="foot"><span>Hey Ksusha ♥ Генеральная уборка</span><span>${String(s.n).padStart(2, '0')} / ${slides.length}</span></div>`;
  }
  if (/Маршрут · Остановка (\d) из 5/.test(s.title)) {
    const k = +s.title.match(/Остановка (\d)/)[1];
    const stops = ['Самоценность', 'Привычка терпеть', 'Синдром «я сама»', 'Бывшие', 'Новая жизнь и среда'];
    const photo = PHOTOS[(k * 3) % PHOTOS.length];
    return `<div class="bg"></div><div class="vig"></div>
      <div class="main" style="right:760px"><div><span class="tag">Маршрут генеральной уборки</span></div>
      <div class="title" style="font-size:96px">Остановка ${k} <span class="red" style="font-size:.8em;text-transform:none">из 5</span></div>
      <div style="display:flex;flex-direction:column;gap:18px;margin-top:10px">${stops.map((t, i) => `<div class="card" style="font-size:40px;display:flex;align-items:center;gap:22px;${i + 1 === k ? 'border-color:#e8c886;background:rgba(232,200,134,.16);color:#fff3dc' : i + 1 < k ? 'opacity:.55' : 'opacity:.85'}"><span style="font-family:Corm;font-weight:700;font-size:52px;color:#e8c886;width:60px">${i + 1 < k ? '✔' : '0' + (i + 1)}</span>${i + 1 === k ? '<b>' + t + '</b> <span class="red" style="font-size:44px">← мы здесь</span>' : t}</div>`).join('')}
        <div class="card" style="font-size:40px;opacity:.85">➜ <b style="color:#f6d9a2">Новая я · 2027</b></div></div></div>
      <div class="ph"><img src="file://${IMG}/${photo}" style="object-position:50% 25%"></div>`;
  }
  let photo = null;
  for (const [k, v] of Object.entries(FIXED)) if (s.title.includes(k)) photo = v;
  const len = s.body.replace(/\*|_/g, '').length;
  const twoCol = (s.body.match(/^\*\*[^*]+:\*\*$/gm) || []).length === 2;
  if (!photo && !twoCol && len < 420 && !/QR/.test(s.body) && s.n > 1) photo = PHOTOS[pi++ % PHOTOS.length];
  if (twoCol && !/Ксения|Привет/.test(s.title)) photo = null;
  const qr = /QR-код/.test(s.body);
  const right = photo ? 760 : (qr ? 560 : 110);
  const body = bodyHtml(s.body.replace(/\*\(QR-код\)\*/g, '').replace(/\*\(обложки[^)]*\)\*/g, '').replace(/\*\(скрины[^)]*\)\*/g, '').replace(/\*\(фото[^)]*\)\*/g, ''));
  return `<div class="bg"></div><div class="vig"></div>${scr ? '<div class="scr">📸 скринь этот слайд</div>' : ''}
    <div class="main" style="right:${right}px"><div><span class="tag">${sec || 'Генеральная уборка'}</span></div>
      <div class="title" style="font-size:${title.length > 48 ? 58 : title.length > 30 ? 66 : 78}px">${md(title)}</div>
      <div class="body" style="font-size:${len < 200 ? 54 : len < 350 ? 46 : 40}px">${body}</div></div>
    ${photo ? `<div class="ph"><img src="file://${IMG}/${photo}" style="object-position:50% 25%"></div>` : ''}
    ${qr ? `<div class="abs" style="right:140px;top:300px;text-align:center"><div class="qr"><img src="file://${IMG}/qr_iamheyksusha.png"></div><div class="it" style="margin-top:14px;font-size:30px;color:#f3e6d0">Наведи камеру</div></div>` : ''}
    <div class="foot"><span>Hey Ksusha ♥ Генеральная уборка</span><span>${String(s.n).padStart(2, '0')} / ${slides.length}</span></div>`;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const s of slides) {
    if (ONLY && !ONLY.includes(s.n)) continue;
    const html = `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${slideHtml(s)}</body></html>`;
    const tmp = path.join(OUT, '_t.html'); fs.writeFileSync(tmp, html);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready);
    // auto-fit body text
    await pg.evaluate(() => { const b = document.querySelector('.body'); if (!b) return; let fs = parseFloat(getComputedStyle(b).fontSize); while (b.scrollHeight > b.clientHeight + 2 && fs > 18) { fs -= 1; b.style.fontSize = fs + 'px'; } });
    await pg.screenshot({ path: path.join(OUT, `s${String(s.n).padStart(3, '0')}.jpg`), type: 'jpeg', quality: 86 });
  }
  fs.unlinkSync(path.join(OUT, '_t.html'));
  await b.close(); console.log('slides', slides.length);
})();
