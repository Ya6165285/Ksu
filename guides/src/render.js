const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const OUT = '/home/user/Ksu/guides';
const PREV = path.resolve(__dirname, '../preview');
const GUIDES = {
  g1: ['Тест — Почему за тобой не ухаживают', 'Тест_Почему_за_тобой_не_ухаживают'],
  g2: ['Гайд — Скажи ему это', 'Гайд_Комплименты_мужчине'],
  g3: ['Гайд — Красоты недостаточно', 'Гайд_Красоты_недостаточно'],
};

(async () => {
  const only = process.argv.slice(2);
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(PREV, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  for (const [k, [title, file]] of Object.entries(GUIDES)) {
    if (only.length && !only.includes(k)) continue;
    if (!fs.existsSync(path.join(__dirname, k + '.js'))) continue;
    const slides = require('./' + k)();
    const html = L.page(title, slides);
    const hp = path.join(PREV, k + '.html');
    fs.writeFileSync(hp, html);
    await page.goto('file://' + hp);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const els = await page.$$('section.slide');
    for (let j = 0; j < els.length; j++) await els[j].screenshot({ path: path.join(PREV, `${k}-${String(j + 1).padStart(2, '0')}.png`) });
    await page.pdf({ path: path.join(OUT, file + '.pdf'), width: '1600px', height: '900px', printBackground: true });
    console.log(k, els.length, 'slides');
  }
  await browser.close();
})();
