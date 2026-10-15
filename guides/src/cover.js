// Girls' night covers: horizontal post cover + vertical story
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const IMG = L.IMG;
const OUT = '/home/user/Ksu/launch/covers';

// deterministic pseudo-random
let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

function skyline(W, H, base, bx0 = 0.62, ax0 = 0.18) {
  seed = 7;
  const b = [];
  let x = -10;
  while (x < W) {
    const w = 40 + rnd() * 70;
    const h = 90 + rnd() * 230;
    b.push([x, w, h]);
    x += w + 4 + rnd() * 10;
  }
  const burjX = W * bx0;
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;bottom:0">
   <defs><linearGradient id="bld" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a1a44"/><stop offset="1" stop-color="#140912"/></linearGradient></defs>`;
  // back layer
  for (const [bx, bw, bh] of b) svg += `<rect x="${bx}" y="${H - bh * 0.75 - 40}" width="${bw}" height="${bh}" fill="#3a1536" opacity=".75"/>`;
  // Burj Khalifa
  const t = base;
  const tiers = [[60, 0], [46, 0.28], [34, 0.5], [22, 0.68], [12, 0.82], [5, 0.92]];
  for (const [w, f] of tiers) svg += `<rect x="${burjX - w / 2}" y="${H - t * (1 - f) - 0}" width="${w}" height="${t}" fill="url(#bld)" stroke="#F0479A" stroke-opacity=".35" stroke-width="1.5"/>`;
  svg += `<line x1="${burjX}" y1="${H}" x2="${burjX}" y2="${H - t - 60}" stroke="#ff9ccc" stroke-width="2" opacity=".8" style="filter:drop-shadow(0 0 6px #F0479A)"/>`;
  svg += `<polygon points="${burjX - 2},${H - t * 0.08 - t * 0.92 + 0} ${burjX + 2},${H - t * 0.08 - t * 0.92} ${burjX},${H - t - 70}" fill="#2a1028"/>`;
  svg += `<circle cx="${burjX}" cy="${H - t - 70}" r="3" fill="#F0479A"/>`;
  // Burj Al Arab sail
  const ax = W * ax0;
  svg += `<path d="M ${ax} ${H} L ${ax} ${H - 300} Q ${ax + 110} ${H - 150} ${ax + 130} ${H}" fill="url(#bld)"/><line x1="${ax}" y1="${H}" x2="${ax}" y2="${H - 330}" stroke="#2a1028" stroke-width="5"/>`;
  // front layer
  for (const [bx, bw, bh] of b) {
    const y = H - bh * 0.55;
    svg += `<rect x="${bx}" y="${y}" width="${bw}" height="${bh}" fill="url(#bld)"/><line x1="${bx}" y1="${y}" x2="${bx + bw}" y2="${y}" stroke="#F0479A" stroke-opacity=".45" stroke-width="2"/>`;
    for (let wy = y + 14; wy < H - 10; wy += 16) for (let wx = bx + 8; wx < bx + bw - 8; wx += 12)
      if (rnd() < 0.3) svg += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="${rnd() < 0.5 ? '#F0479A' : '#FFC98A'}" opacity="${0.35 + rnd() * 0.5}"/>`;
  }
  // tower windows
  for (let wy = H - t + 40; wy < H - 20; wy += 22) if (rnd() < 0.6) svg += `<rect x="${burjX - 2}" y="${wy}" width="4" height="9" fill="#FFC98A" opacity=".7"/>`;
  return svg + '</svg>';
}

function hearts(list) {
  return list.map(([x, y, s, o, r]) => `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);opacity:${o};filter:drop-shadow(0 0 ${s / 2}px rgba(240,71,154,.8))" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.4 4.5 6.3 4.5c2.3 0 3.9 1.3 5.7 3.4 1.8-2.1 3.4-3.4 5.7-3.4 3.9 0 5.9 4 4.3 7.2C19.5 16.4 12 21 12 21z" fill="#F0479A"/></svg>`).join('');
}

const sky = `background:
  radial-gradient(ellipse 60% 40% at 62% 100%, rgba(255,140,120,.55), rgba(255,140,120,0) 70%),
  radial-gradient(ellipse 80% 55% at 50% 100%, rgba(240,71,154,.55), rgba(240,71,154,0) 75%),
  linear-gradient(180deg, #0B0B0D 0%, #170a19 30%, #451540 62%, #8a2a5c 85%, #c8506a 100%)`;

function stars(W, H, n) {
  seed = 3; let s = '';
  for (let i = 0; i < n; i++) { const x = rnd() * W, y = rnd() * H * 0.55, r = rnd() * 1.6 + .4; s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${.3 + rnd() * .6}"/>`; }
  return `<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0">${s}</svg>`;
}

const spark = (x, y, s) => `<div style="position:absolute;left:${x}px;top:${y}px;color:#fff;font-size:${s}px;text-shadow:0 0 14px #fff">✦</div>`;
const moon = (x, y, r) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${r}px;height:${r}px;border-radius:50%;box-shadow:inset -${r / 4}px ${r / 8}px 0 0 #ffe3ef;filter:drop-shadow(0 0 18px rgba(255,200,230,.8))"></div>`;

function photo(W, H, rot) {
  return `<div style="position:relative;transform:rotate(${rot}deg)">
   <div class="tape" style="right:-55px;top:-14px;transform:rotate(32deg)"></div>
   <div class="tape" style="left:-60px;bottom:-12px;transform:rotate(32deg)"></div>
   <div style="width:${W}px;height:${H}px;border-radius:30px;overflow:hidden;border:6px solid rgba(255,255,255,.9);box-shadow:0 30px 90px rgba(0,0,0,.7),0 0 60px rgba(240,71,154,.45)">
    <img src="file://${IMG}/pajama.jpg" style="width:100%;height:100%;object-fit:cover;object-position:50% 40%"></div></div>`;
}

const textBlock = (scale = 1, heart = true) => `
  <span class="tag" style="font-size:${17 * scale}px;padding:${12 * scale}px ${26 * scale}px;background:rgba(11,11,13,.55)"><b>✦</b>Dubai • Girls night</span>
  <div style="font:700 ${118 * scale}px/0.98 Osw;text-transform:uppercase;margin-top:${28 * scale}px">
   <span style="background:linear-gradient(180deg,#fff 30%,#d6d6dc);-webkit-background-clip:text;color:transparent">Давай найдём</span><br>
   <span style="color:var(--pink);text-shadow:0 0 40px rgba(240,71,154,.6)">тебе любовь!</span> ${heart ? `<span style="font-size:${84 * scale}px">❤️</span>` : ''}</div>
  <div style="font:500 ${32 * scale}px/1.3 Mont;color:#fff;margin-top:${22 * scale}px">Закрытый онлайн-девичник из Дубая</div>
  <div style="font:600 ${21 * scale}px Mont;letter-spacing:.06em;color:#F7B6D6;margin-top:${16 * scale}px;text-transform:uppercase">Самоценность <b style="color:var(--pink)">•</b> Достойные мужчины <b style="color:var(--pink)">•</b> Отношения мечты</div>
  <div class="btn" style="margin-top:${38 * scale}px;font-size:${30 * scale}px;padding:${16 * scale}px ${34 * scale}px;box-shadow:0 0 50px rgba(240,71,154,.55)">📍 25 октября · 15:00 МСК · бесплатно</div>`;

const PH = `file://${IMG}/pajama_dubai.jpg`;
const H1 = `<section class="slide" style="width:1600px;height:900px;padding:0;background:#0B0B0D">
 <div class="grid"></div>
 <div style="position:absolute;right:0;top:0;width:820px;height:900px">
  <img src="${PH}" style="width:100%;height:100%;object-fit:cover;object-position:50% 38%">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,#0B0B0D 0%,rgba(11,11,13,.75) 14%,rgba(11,11,13,0) 40%)"></div>
 </div>
 ${hearts([[700, 640, 40, .9, -15], [740, 150, 28, .75, 10]])}
 ${spark(690, 90, 26)}${spark(90, 820, 22)}
 <div style="position:absolute;left:90px;top:110px;width:860px;z-index:4">${textBlock(1, false)}</div>
</section>`;

const V1 = `<section class="slide" style="width:1080px;height:1920px;padding:0;background:#0B0B0D">
 <div style="position:absolute;left:0;right:0;top:0;height:1920px">
  <img src="${PH}" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%">
  <div style="position:absolute;left:0;right:0;bottom:0;height:720px;background:linear-gradient(180deg,rgba(11,11,13,0),rgba(11,11,13,.82) 38%,rgba(11,11,13,.92))"></div>
 </div>
 ${hearts([[90, 1250, 44, .9, -15], [950, 1230, 36, .85, 12]])}
 <div style="position:absolute;left:80px;right:80px;top:1340px;z-index:4">${textBlock(0.9)}</div>
</section>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [name, html, w, h] of [['Обложка_пост_16x9', H1, 1600, 900], ['Обложка_сторис_9x16', V1, 1080, 1920]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const f = path.resolve(__dirname, '../preview', name + '.html');
    fs.writeFileSync(f, L.page(name, [html]));
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await (await p.$('section')).screenshot({ path: path.join(OUT, name + '.png') });
    await (await p.$('section')).screenshot({ path: path.resolve(__dirname, '../preview', name + '.jpg'), type: 'jpeg', quality: 70, scale: 'css' });
  }
  await b.close();
})();
