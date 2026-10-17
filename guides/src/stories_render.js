// Instagram-style stories 1080x1920: photo full-bleed + per-line plaques
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad';
const C = S + '/ph/c/';
const OUT = process.argv[2] || S + '/st/out';
const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
fs.mkdirSync(OUT, { recursive: true });
const PINK = '#EC6FB8';
const font = w => `@font-face{font-family:I;font-weight:${w};src:url(file://${S}/fonts/fontsource-inter/package/files/inter-cyrillic-${w}-normal.woff2)}@font-face{font-family:I;font-weight:${w};src:url(file://${S}/fonts/fontsource-inter/package/files/inter-latin-${w}-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+20BD}`;

// item helpers
const P = (t, fs = 64) => ({ k: 'pink', t, fs });
const W = (t, fs = 50) => ({ k: 'white', t, fs });
const D = (t, fs = 46) => ({ k: 'dark', t, fs });
const B = (t, fs = 170) => ({ k: 'big', t, fs });
const E = (t, fs = 110) => ({ k: 'emoji', t, fs });
const I = (src, w = 900, rot = 0) => ({ k: 'img', src, w, rot });
const GAP = (h = 24) => ({ k: 'gap', h });
const T = (t, fs = 76) => ({ k: 'txt', t, fs });
const SM = (t, fs = 40) => ({ k: 'sm', t, fs });
const N = (t, fs = 40) => ({ k: 'note', t, fs });
const p = s => `<span class=acc>${s}</span>`;

const stories = require(process.env.ST || './stories.js')({ P, W, D, B, E, I, GAP, p, T, SM, N });

function item(it) {
  if (it.k === 'gap') return `<div style="height:${it.h}px"></div>`;
  if (it.k === 'img') return `<img class=shot src="file://${C}${it.src}" style="width:${it.w}px;transform:rotate(${it.rot}deg)">`;
  if (it.k === 'txt') return `<div class=txt style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'sm') return `<div class=sm style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'note') return `<div class=note style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'emoji') return `<div class=emoji style="font-size:${it.fs}px">${it.t}</div>`;
  if (it.k === 'big') return `<div class=big style="font-size:${it.fs}px">${it.t}</div>`;
  return `<div class="ln"><span class="pl ${it.k}" style="font-size:${it.fs}px">${it.t}</span></div>`;
}

function html(s) {
  const groups = s.groups.map(g => `<div class=grp style="top:${g.top}px;${g.w ? `width:${g.w}px;left:${(1080 - g.w) / 2}px` : ''}">${g.items.map(item).join('')}</div>`).join('');
  return `<!doctype html><html><head><meta charset=utf-8><style>
${[700, 800, 900].map(font).join('\n')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;background:#111;font-family:I,'Noto Color Emoji',sans-serif}
.bg{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;object-position:${s.pos || 'center'};filter:${s.filter || 'none'}}
.shade{position:absolute;inset:0;background:${s.shade || 'linear-gradient(rgba(0,0,0,.38) 0%,rgba(0,0,0,0) 32%,rgba(0,0,0,0) 52%,rgba(0,0,0,.5) 100%)'}}
.grp{position:absolute;left:60px;width:960px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.ln{line-height:1.42;max-width:100%}
.pl{font-weight:800;padding:.1em .38em;border-radius:.28em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.pink{background:${PINK};color:#fff;font-weight:900;letter-spacing:.01em}
.white{background:#fff;color:#111}
.dark{background:rgba(28,18,26,.82);color:#fff;font-weight:700}
.acc{color:${PINK}}
.pink .acc{color:#fff}
.dark .acc{color:#ff9fd6}
.big{font-weight:900;color:#fff;line-height:1;letter-spacing:-.02em;text-shadow:0 0 2px #EC6FB8,0 6px 0 #EC6FB8,0 10px 40px rgba(0,0,0,.45)}
.big .acc{color:${PINK};text-shadow:0 4px 30px rgba(255,255,255,.25)}
.emoji{line-height:1}
.txt{font-weight:800;color:#fff;line-height:1.15;letter-spacing:-.01em;text-shadow:0 2px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.5)}
.sm{font-weight:700;color:#fff;line-height:1.3;text-shadow:0 2px 12px rgba(0,0,0,.6),0 1px 3px rgba(0,0,0,.5)}
.txt .acc,.sm .acc{color:#ff8fcf}
.note{background:#fff;color:#151515;border-radius:30px;padding:40px 44px;text-align:left;font-weight:600;line-height:1.45;width:900px;box-shadow:0 18px 50px rgba(0,0,0,.3)}
.note b{font-weight:800}
.note .acc{font-weight:800}
.lblw{display:inline-block}
.shot{border-radius:28px;box-shadow:0 18px 50px rgba(0,0,0,.35);display:block}
</style></head><body><img class=bg src="file://${C}${s.bg}"><div class=shade></div>${groups}</body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [i, s] of stories.entries()) {
    const n = i + 1;
    if (ONLY && !ONLY.includes(n)) continue;
    fs.writeFileSync(S + '/st/tmp.html', html(s)); await pg.goto('file://' + S + '/st/tmp.html', { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, `Сторис_${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
