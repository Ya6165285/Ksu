// Общий стиль «Из алмаза в бриллиант»: шоколад, шампань-золото, бриллиант, шёлк.
const path = require('path');
const IMG = path.resolve(__dirname, '../../launch/diamond/img');
module.exports = (F) => {
  const ff = (fam, file, extra = '') => `@font-face{font-family:${fam};${extra}src:url(file://${F}/${file})}`;
  const cg = (w, st = 'normal') => ff(st === 'italic' ? 'CormI' : 'Corm', `cormorant-garamond/files/cormorant-garamond-cyrillic-${w}-${st}.woff2`, `font-weight:${w};font-style:${st};`) + ff(st === 'italic' ? 'CormI' : 'Corm', `cormorant-garamond/files/cormorant-garamond-latin-${w}-${st}.woff2`, `font-weight:${w};font-style:${st};unicode-range:U+0000-00FF,U+2000-206F;`);
  const mo = w => ff('Mont', `montserrat/files/montserrat-cyrillic-${w}-normal.woff2`, `font-weight:${w};`) + ff('Mont', `montserrat/files/montserrat-latin-${w}-normal.woff2`, `font-weight:${w};unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF;`);
  return `
${cg(400)}${cg(500)}${cg(600)}${cg(500, 'italic')}${cg(600, 'italic')}
${mo(300)}${mo(400)}${mo(500)}${mo(600)}
:root{--choc:#160e09;--choc2:#2a1a10;--gold1:#fff3dc;--gold2:#ecc996;--gold3:#b9874f;--text:#ecdfcb;--muted:#c9b398;--line:rgba(226,190,140,.42)}
.dbg{background:radial-gradient(ellipse 70% 55% at 50% 38%,#3b2617 0%,#24160d 55%,#120a06 100%)}
.glow{position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none}
.g-txt{background:linear-gradient(180deg,#fff6e4 0%,#f3d7a6 38%,#c99a62 68%,#f5ddb4 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.serif{font-family:Corm;font-weight:500;text-transform:uppercase;letter-spacing:.02em;line-height:.98}
.serif i,.it{font-family:CormI;font-style:italic;font-weight:500}
.caps{font-family:Mont;font-weight:400;text-transform:uppercase;letter-spacing:.16em;color:#eedcc0}
.pill{display:inline-block;padding:16px 46px;border-radius:999px;border:1.6px solid rgba(236,201,150,.85);background:linear-gradient(180deg,rgba(70,44,26,.85),rgba(24,15,9,.92));box-shadow:0 0 0 4px rgba(236,201,150,.08),0 0 40px rgba(236,201,150,.18) inset;font-family:Mont;font-weight:400;text-transform:uppercase;letter-spacing:.14em;color:#f6e7cf;text-align:center;line-height:1.25}
.diam{display:block;mix-blend-mode:screen}
.silk{position:absolute;left:0;right:0;bottom:0;background:url(file://${IMG}/silk.png) center bottom/100% 100% no-repeat}
.chand{position:absolute;background:url(file://${IMG}/chand.jpg) center/cover;mix-blend-mode:screen;opacity:.55;-webkit-mask-image:linear-gradient(90deg,#000 40%,transparent)}
.card{background:linear-gradient(160deg,rgba(66,42,25,.55),rgba(24,15,9,.7));border:1.4px solid var(--line);border-radius:26px}
`;
};
module.exports.IMG = IMG;
