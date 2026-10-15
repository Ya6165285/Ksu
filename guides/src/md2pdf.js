const { marked } = require('marked'); const fs = require('fs'); const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const F = path.resolve(__dirname, '../fonts');
const css = `
@font-face{font-family:Mont;font-weight:400;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-400-normal.woff2)}
@font-face{font-family:Mont;font-weight:600;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-600-normal.woff2)}
@font-face{font-family:Mont;font-weight:700;src:url(file://${F}/fontsource-montserrat/files/montserrat-cyrillic-700-normal.woff2)}
@font-face{font-family:Mont;font-weight:400;src:url(file://${F}/fontsource-montserrat/files/montserrat-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
@font-face{font-family:Mont;font-weight:700;src:url(file://${F}/fontsource-montserrat/files/montserrat-latin-700-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF}
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/fontsource-oswald/files/oswald-cyrillic-700-normal.woff2)}
@font-face{font-family:Osw;font-weight:700;src:url(file://${F}/fontsource-oswald/files/oswald-latin-700-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}
@page{size:A4;margin:16mm 14mm}
body{font-family:Mont,sans-serif;font-size:16.5px;line-height:1.6;color:#1d1b20}
h1{font:700 34px/1.1 Osw;text-transform:uppercase;color:#E0357F;margin:0 0 14px}
h1:not(:first-of-type){page-break-before:always;margin-top:0}
h2{font:700 24px/1.2 Osw;text-transform:uppercase;color:#1d1b20;margin:30px 0 10px;padding-bottom:6px;border-bottom:3px solid #F0479A;page-break-after:avoid}
h3{font-size:17px;font-weight:700;color:#E0357F;margin:20px 0 8px;page-break-after:avoid}
p{margin:0 0 10px}
strong{font-weight:700}
hr{border:0;border-top:1px dashed #e9b6cf;margin:22px 0}
ul,ol{padding-left:22px;margin:0 0 12px}
li{margin:3px 0}
table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:14px;page-break-inside:avoid}
th{background:#F0479A;color:#fff;text-align:left;padding:8px 10px}
td{border-bottom:1px solid #f1d4e2;padding:8px 10px;vertical-align:top}
blockquote{margin:0 0 14px;padding:14px 18px;background:#fff1f7;border-left:4px solid #F0479A;border-radius:10px}
code{background:#f6eef2;padding:1px 5px;border-radius:4px;font-size:.92em}
a{color:#E0357F}
.post{background:#fff6fa;border:1.5px solid #f6c3db;border-radius:14px;padding:16px 20px;margin:6px 0 14px}
.post p{margin:0 0 8px}
.post blockquote{background:#fff}
`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [src, out] of process.argv.slice(2).map(x => x.split('::'))) {
    const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><body>${marked.parse(fs.readFileSync(src, 'utf8'), { breaks: true })}</body>`;
    fs.writeFileSync('t.html', html); await p.goto('file://' + path.resolve('t.html'));
    await p.evaluate(() => {
      for (const h of [...document.querySelectorAll('h2,h3')]) {
        const items = []; let n = h.nextElementSibling;
        while (n && !/^(H1|H2|H3|HR)$/.test(n.tagName)) { items.push(n); n = n.nextElementSibling; }
        if (!items.length || items.some(e => /^(TABLE)$/.test(e.tagName))) continue;
        const d = document.createElement('div'); d.className = 'post'; h.after(d); items.forEach(e => d.appendChild(e));
      }
    });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' } });
  }
  await b.close();
})();
