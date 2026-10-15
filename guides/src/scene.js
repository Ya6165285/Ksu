// Re-composes the pajama photo: person + bed in front of a panoramic window with night Dubai
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const IMG = require('./lib').IMG;

let seed = 11;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

function city(W, H, hz) {
  // hz = horizon y (water line)
  seed = 11;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">
  <defs>
   <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#120a22"/><stop offset=".45" stop-color="#2c1240"/><stop offset=".75" stop-color="#7a2a62"/><stop offset="1" stop-color="#e2777f"/></linearGradient>
   <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a3a"/><stop offset="1" stop-color="#140c1e"/></linearGradient>
   <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1840"/><stop offset="1" stop-color="#120a18"/></linearGradient>
   <filter id="gl"><feGaussianBlur stdDeviation="2.2"/></filter>
   <filter id="gl2"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="${W}" height="${hz}" fill="url(#sky)"/>`;
  for (let i = 0; i < 140; i++) s += `<circle cx="${rnd() * W}" cy="${rnd() * hz * 0.5}" r="${rnd() * 1.4 + .4}" fill="#fff" opacity="${.3 + rnd() * .6}"/>`;
  // moon
  s += `<circle cx="${W * 0.8}" cy="${hz * 0.16}" r="34" fill="#ffe9f2" opacity=".95"/><circle cx="${W * 0.8}" cy="${hz * 0.16}" r="60" fill="#ffd0e6" opacity=".18" filter="url(#gl2)"/>`;
  // far skyline
  let x = -20;
  while (x < W) { const w = 26 + rnd() * 50, h = 60 + rnd() * 170; s += `<rect x="${x}" y="${hz - h}" width="${w}" height="${h}" fill="#3a1f4a" opacity=".85"/>`; x += w + 2; }
  // Burj Khalifa (tapered silhouette with glowing outline)
  const bx = W * 0.5, bt = hz * 0.9, top = hz - bt;
  const pts = [[-34, 0], [-34, .22], [-26, .22], [-26, .42], [-18, .42], [-18, .6], [-11, .6], [-11, .74], [-6, .74], [-6, .86], [-2, .86], [0, 1]];
  const poly = [...pts.map(([dx, f]) => `${bx + dx},${hz - bt * f}`), ...pts.slice().reverse().map(([dx, f]) => `${bx - dx},${hz - bt * f}`)].join(' ');
  s += `<polygon points="${poly}" fill="url(#b1)"/>`;
  s += `<polygon points="${poly}" fill="none" stroke="#ff8cc6" stroke-width="5" opacity=".55" filter="url(#gl)"/>`;
  s += `<polygon points="${poly}" fill="none" stroke="#ffb3d9" stroke-width="1.5" opacity=".8"/>`;
  for (let y = top + bt * .1; y < hz - 6; y += 11) s += `<rect x="${bx - 1.5}" y="${y}" width="3" height="5" fill="#ffd9a8" opacity=".9"/>`;
  s += `<circle cx="${bx}" cy="${top}" r="5" fill="#ff4f9f"/><circle cx="${bx}" cy="${top}" r="18" fill="#ff4f9f" opacity=".35" filter="url(#gl)"/>`;
  // near towers
  x = -10;
  while (x < W) {
    const w = 40 + rnd() * 70, h = 120 + rnd() * 260;
    if (Math.abs(x + w / 2 - bx) < 90) { x += 80; continue; }
    const y = hz - h;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#b1)"/>`;
    for (let wy = y + 10; wy < hz - 6; wy += 12) for (let wx = x + 6; wx < x + w - 6; wx += 9)
      if (rnd() < .33) s += `<rect x="${wx}" y="${wy}" width="4" height="6" fill="${rnd() < .6 ? '#ffd29a' : '#ff8cc6'}" opacity="${.45 + rnd() * .5}"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="2" fill="#ff8cc6" opacity=".55"/>`;
    x += w + 3 + rnd() * 8;
  }
  // water + reflections
  s += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#water)"/>`;
  for (let i = 0; i < 90; i++) { const rx = rnd() * W, ry = hz + 4 + rnd() * (H - hz) * .5; s += `<rect x="${rx}" y="${ry}" width="${10 + rnd() * 30}" height="2" fill="${rnd() < .5 ? '#ffcf96' : '#ff8cc6'}" opacity="${.2 + rnd() * .4}"/>`; }
  return s + '</svg>';
}

function scene(W, H) {
  const k = W / 720; // photo is 720x1280
  const hz = 600 * k;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0}body{width:${W}px;height:${H}px;overflow:hidden;background:#0B0B0D}
  .s{position:relative;width:${W}px;height:${H}px;overflow:hidden}
  </style></head><body><div class="s" id="s">
  <div style="position:absolute;inset:0;filter:blur(1.6px)">${city(W, H, hz)}</div>
  <!-- window frame -->
  <div style="position:absolute;inset:0;background:
     linear-gradient(90deg,transparent ${W * .33 - 7}px,#1b1320 ${W * .33 - 7}px,#1b1320 ${W * .33 + 7}px,transparent ${W * .33 + 7}px,transparent ${W * .67 - 7}px,#1b1320 ${W * .67 - 7}px,#1b1320 ${W * .67 + 7}px,transparent ${W * .67 + 7}px)"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:${26 * k}px;background:#1b1320"></div>
  <!-- glass reflection -->
  <div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.06) 38%,rgba(255,255,255,0) 46%)"></div>
  <!-- warm room light from below -->
  <div style="position:absolute;left:0;right:0;bottom:0;height:${H * .55}px;background:radial-gradient(ellipse 70% 60% at 50% 100%,rgba(255,170,150,.35),rgba(255,170,150,0) 70%)"></div>
  <!-- fairy lights garland -->
  <svg width="${W}" height="${H}" style="position:absolute;left:0;top:0">
   <path d="M 0 ${120 * k} Q ${W * .25} ${200 * k} ${W * .5} ${130 * k} T ${W} ${150 * k}" stroke="#3a2a30" stroke-width="2" fill="none"/>
   ${Array.from({ length: 34 }, (_, i) => { const t = i / 33; const x = t * W; const y = (t < .5 ? 120 + (200 - 120) * Math.sin(t * 2 * Math.PI) * .5 + 40 * Math.sin(t * Math.PI * 2) : 140 + 20 * Math.sin(t * Math.PI * 4)) * k; return `<circle cx="${x}" cy="${y}" r="${2.6 * k}" fill="#fff1d6"/><circle cx="${x}" cy="${y}" r="${9 * k}" fill="#ffc78a" opacity=".28"/>`; }).join('')}
  </svg>
  <!-- window sill behind bed -->
  <div style="position:absolute;left:0;right:0;top:${hz + 210 * k}px;height:${16 * k}px;background:linear-gradient(180deg,#2a1d26,#140e12)"></div>
  <div style="position:absolute;left:0;right:0;top:${hz + 226 * k}px;bottom:0;background:linear-gradient(180deg,#24161f,#3a2630)"></div>
  <!-- person + bed -->
  <img src="file://${IMG}/pajama_cut.png" style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;filter:saturate(1.05) brightness(.97)">
  <!-- pink rim light / grade -->
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(120,30,90,.10),rgba(255,120,170,.06));mix-blend-mode:soft-light"></div>
  </div></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const W = 1080, H = 1920;
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const f = path.resolve(__dirname, '../preview/scene.html');
  fs.writeFileSync(f, scene(W, H));
  await p.goto('file://' + f); await p.waitForTimeout(500);
  await (await p.$('#s')).screenshot({ path: `${IMG}/pajama_dubai.jpg`, type: 'jpeg', quality: 92 });
  await (await p.$('#s')).screenshot({ path: path.resolve(__dirname, '../preview/scene_prev.jpg'), type: 'jpeg', quality: 60 });
  await b.close();
})();
