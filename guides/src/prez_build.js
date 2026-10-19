const { chromium } = require('playwright');
const S='/tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad';
const data=require('./data.js');
const f=(w)=>`@font-face{font-family:I;font-weight:${w};src:url(file://${S}/fonts/fontsource-inter/package/files/inter-cyrillic-${w}-normal.woff2)}@font-face{font-family:I;font-weight:${w};src:url(file://${S}/fonts/fontsource-inter/package/files/inter-latin-${w}-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F,U+20BD}`;
const body=data.map(d=>d.block?`<div class=blk><span>${d.block}</span><i>${d.time}</i>${d.note?`<div class=bn>${d.note}</div>`:''}</div>`:
`<div class=card><div class=lab>Слайд ${d.n} · ${d.t}</div><div class=slide>${d.s}</div>${d.g?`<div class=say><b>Говоришь:</b> ${d.g}</div>`:''}</div>`).join('');
const html=`<!doctype html><meta charset=utf-8><style>${[400,600,800].map(f).join('')}
@page{size:A4;margin:14mm 14mm}
body{font-family:I,'Noto Color Emoji',sans-serif;color:#222;margin:0}
.title{font-size:30px;font-weight:800;color:#EC6FB8;margin:0 0 6px}
.meta{font-size:13px;line-height:1.6;color:#444;margin-bottom:10px}
.blk{break-after:avoid;margin:22px 0 10px;padding:10px 16px;background:#EC6FB8;color:#fff;border-radius:12px;font-weight:800;font-size:17px;display:flex;flex-wrap:wrap;justify-content:space-between}
.blk i{font-style:normal;font-weight:600;opacity:.9}.bn{width:100%;font-weight:400;font-size:13px;margin-top:4px}
.card{break-inside:avoid;margin:0 0 16px}
.lab{font-size:12px;font-weight:800;color:#EC6FB8;text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px}
.slide{aspect-ratio:16/9;width:78%;margin:0 auto;border-radius:14px;background:linear-gradient(135deg,#2a1622,#4a2238);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px 26px;box-sizing:border-box}
.slide h1{font-size:26px;line-height:1.15;margin:0 0 8px;font-weight:800}
.slide h2{font-size:18px;line-height:1.25;margin:0 0 8px;font-weight:800}
.slide p{font-size:14px;line-height:1.55;margin:0;font-weight:400}
.slide b{color:#ff8fcf}
.say{width:78%;margin:8px auto 0;font-size:14px;line-height:1.5;background:#fdf0f7;border-left:4px solid #EC6FB8;padding:10px 14px;border-radius:8px}
.say b{color:#c4489a}
.prep{break-inside:avoid;margin-top:20px;font-size:14px;line-height:1.7;background:#fdf0f7;padding:14px 18px;border-radius:12px}
</style>
<div class=title>ПРЕЗЕНТАЦИЯ ДЕВИЧНИКА<br>«ДАВАЙ НАЙДЁМ ТЕБЕ ЛЮБОВЬ!»</div>
<div class=meta>Эфир: воскресенье, 25 октября, 15:00 МСК · ~2 часа<br>Тёмная карточка — что видят девочки на экране. Розовая полоса — что ты говоришь.</div>
${body}
<div class=prep><b>Подготовить до эфира:</b><br>— кодовое слово<br>— 5 историй для разборов<br>— QR-код на анкету<br>— фото «до/после» и фото со Стасом<br>— скрины отзывов учениц</div>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();require('fs').writeFileSync(S+'/prez/p.html',html);await p.goto('file://'+S+'/prez/p.html');await p.evaluate(()=>document.fonts.ready);await p.pdf({path:process.argv[2],format:'A4',printBackground:true,margin:{top:'14mm',bottom:'14mm',left:'14mm',right:'14mm'}});await b.close();})();
