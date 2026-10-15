const L = require('./lib');
const { deco, foot, tag, prog, chain, result, ul, framed, cta, crop, IMG } = L;
const B = 'Гайд · комплименты мужчине';

const BLOCKS = [
  ['Забота', 'Комплименты', 'за заботу', 'чтобы он ухаживал чаще', ['«Мне так приятно, что ты подумал об этом заранее»', '«С тобой я наконец-то могу расслабиться и ничего не решать сама»', '«Ты так красиво ухаживаешь, мне очень нравится быть твоей девушкой»', '«Я до сих пор улыбаюсь, когда вспоминаю, как ты [что сделал]»', '«Спасибо, что ты рядом. Мне с тобой очень спокойно»'], null],
  ['Ум', 'Комплименты', 'его уму', 'мужчина чувствует уважение — а оно для него значит не меньше, чем любовь', ['«Мне так интересно тебя слушать, ты объясняешь сложное очень просто»', '«Я бы до такого решения никогда не додумалась. Как ты это придумал?»', '«Мне нравится, что с тобой можно говорить обо всём»', '«Ты так глубоко разбираешься в [его тема]. Расскажи ещё»', '«Я спросила у тебя совета — и это было лучшее решение за неделю»', '«Мне нравится, как ты мыслишь: спокойно, логично, на шаг вперёд»'],
    'Попроси у него совета, а потом скажи: <b>«Я сделала, как ты сказал, и всё получилось. Спасибо тебе»</b>. Для мужчины это сильнее любого «ты умный».'],
  ['Сила', 'Комплименты', 'его силе', 'мужчина чувствует себя мужчиной — и хочет защищать и заботиться', null,
    'Скажи <b>«Я в тебя верю»</b>, когда у него трудности. Мужчины запоминают женщину, которая поверила в них, когда было тяжело.'],
  ['Решения', 'Комплименты', 'его решениям', 'чтобы он вкладывался', ['«Мне нравится, как ты принимаешь решения: спокойно и уверенно»', '«Ты так легко решил то, из-за чего я переживала неделю»', '«Я горжусь тобой. Правда»', '«С тобой мне не страшно за наше будущее»', '«Мне нравится, что ты знаешь, чего хочешь»'], null],
  ['Характер', 'Комплименты', 'его характеру', 'чтобы он влюблялся', ['«Ты один из самых интересных мужчин, которых я встречала»', '«Мне нравится, как ты смотришь на мир»', '«С тобой я становлюсь лучшей версией себя»', '«Ты умеешь меня рассмешить, даже когда мне грустно»', '«Мне нравится, какой ты с близкими людьми»'], null],
  ['Внешность', 'Комплименты', 'внешности', 'мужчины их тоже любят, но слышат очень редко', ['«Тебе очень идёт эта рубашка»', '«У тебя такие красивые руки»', '«Мне нравится, как ты пахнешь»', '«Ты сегодня особенно красивый»', '«Мне нравится твоя улыбка — особенно когда ты смотришь на меня»'], null],
  ['Переписка', 'Комплименты', 'в переписке', 'маленькие сообщения, которые делают его день', ['«Думаю о тебе и улыбаюсь 🙂»', '«Ты сегодня сделал мой день»', '«Мне так не хватало твоего голоса»', '«С тобой даже обычный вечер становится особенным»', '«Скучаю по твоим объятиям»'], null],
];

module.exports = function () {
  const s = []; const N = 15; let i = 0; const add = h => s.push(h);

  // 1 cover
  i++; add(`<section class="slide">${deco(1)}
   <div class="z" style="width:860px;margin-top:60px">
    ${tag('Гайд · подарок с девичника')}
    <div class="h" style="font-size:150px;margin-top:30px"><span class="w">Скажи ему</span><br><span class="p">это</span></div>
    <div class="sub" style="width:780px">Комплименты, после которых мужчина начинает <em>ухаживать</em>, <em>вкладываться</em> и <em>влюбляться</em></div>
    <div style="display:flex;gap:16px;margin-top:40px"><span class="pill"><b>40+</b>готовых фраз</span><span class="pill"><b>7</b>дней практики</span></div>
   </div>
   ${framed('right:120px;top:90px', `<div style="${crop('p-000.jpg', 1090, 30, 820, 1095, 450, 601)}"></div>`, 4)}
   ${foot(B, i, N)}</section>`);

  // 2 intro
  i++; add(`<section class="slide">${deco(0)}
   <div class="z">${tag('Почему это работает')}
    <div class="h m"><span class="w">Мужчина вкладывается туда,</span><br><span class="p">где его вклад замечают</span></div></div>
   <div class="z cols" style="margin-top:36px">
    <div class="col bad"><div class="lbl">Женщине важно</div><div class="quote" style="font-size:28px">Чувствовать, что её <b style="color:#fff">любят</b></div></div>
    <div class="col good"><div class="lbl">Мужчине важно</div><div class="quote" style="font-size:28px">Чувствовать, что он <b>справляется</b>, что он <b>нужен</b> и что рядом с ним тебе <b>хорошо</b></div></div>
   </div>
   <div class="z txt" style="margin-top:26px;font-size:23px;width:1300px">Когда он делает что-то для тебя, а слышит «не надо, я сама», «а почему не так?» или тишину — желание стараться пропадает. А когда видит, что его забота делает тебя счастливой, ему хочется давать ещё и ещё.</div>
   <div class="z" style="position:absolute;left:90px;right:90px;bottom:86px">${result('Секрет', 'Особенно мужчины ценят, когда женщина замечает их <b>УМ</b> и <b>СИЛУ</b>. Внешность ему хвалят мама и друзья — а то, что он умный и сильный, он хочет услышать от тебя.')}</div>
   ${foot(B, i, N)}</section>`);

  // 3 rules
  i++; add(`<section class="slide">${deco(2)}
   <div class="z">${tag('3 правила')}
    <div class="h m"><span class="w">Комплимент,</span> <span class="p">который работает</span></div></div>
   <div class="z" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:40px">
    ${[['01', 'За поступок, а не «вообще»', '«Ты такой хороший»', '«Мне так приятно, что ты сам заехал за мной»'], ['02', 'Через свои чувства', '«Ты молодец»', '«Рядом с тобой я чувствую себя такой спокойной»'], ['03', 'Только искренне', 'Лесть и дежурные фразы', 'Найди то, что тебе правда в нём нравится']]
      .map(([n, t, b, g], k) => `<div class="card ${k === 0 ? 'hl' : ''}" style="padding:30px">
       <span class="num">${n}</span><h4 style="margin:18px 0 22px;font-size:34px">${t}</h4>
       <div style="font:500 20px/1.4 Mont;color:#8E8E96;margin-bottom:14px">✕&nbsp; ${b}</div>
       <div style="font:600 21px/1.4 Mont;color:#fff"><span style="color:var(--pink)">✓</span>&nbsp; ${g}</div></div>`).join('')}
   </div>
   <div class="z" style="margin-top:28px">${result('Важно', 'Мужчины очень хорошо чувствуют фальшь. Если не нравится — не хвали.')}</div>
   ${foot(B, i, N)}</section>`);

  // 4 formula
  i++; add(`<section class="slide">${deco(1)}
   <div class="z">${tag('Волшебная формула')}
    <div class="h m"><span class="w">После таких слов</span><br><span class="p">хочется сделать это снова</span></div></div>
   <div class="z" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:40px">
    ${[['01', 'Что он сделал', '«Ты сам забронировал ресторан и всё продумал»'], ['02', 'Что ты почувствовала', '«Я весь вечер чувствовала себя такой беззаботной»'], ['03', 'Что это для тебя значит', '«Мне так нравится, что с тобой можно ни о чём не думать»']]
      .map(([n, t, e], k) => `<div class="card ${k === 2 ? 'hl' : ''}" style="padding:30px;position:relative">
       <div style="font:700 70px/1 Osw;color:var(--pink);text-shadow:0 0 26px rgba(240,71,154,.5)">${n}</div>
       <h4 style="margin:14px 0 14px;font-size:36px">${t}</h4><div class="txt" style="font-size:21px;color:#fff">${e}</div></div>`).join('')}
   </div>
   <div class="z card" style="margin-top:28px;padding:22px 30px">${chain(['Что он сделал', 'что ты почувствовала', 'что это для тебя значит'])}</div>
   ${foot(B, i, N)}</section>`);

  // 5-11 blocks
  BLOCKS.forEach(([short, a, b, sub, items, tip], k) => {
    i++;
    let body;
    if (short === 'Сила') {
      body = `<div class="cols" style="margin-top:28px">
        <div class="col"><div class="lbl">Физическая сила</div><div style="display:grid;gap:12px">${['«Ты такой сильный, рядом с тобой я чувствую себя защищённой»', '«Мне так нравятся твои объятия — в них ничего не страшно»', '«Ого, ты так легко это поднял»', '«Мне нравится, какие у тебя сильные руки»'].map(t => `<div class="phrase">${t}</div>`).join('')}</div></div>
        <div class="col"><div class="lbl">Внутренняя сила</div><div style="display:grid;gap:12px">${['«Мне нравится, что на тебя можно положиться»', '«Ты так спокойно справился, я восхищаюсь тобой»', '«Я вижу, какой ты сильный, и я в тебя верю»', '«Ты из тех мужчин, которые держат слово. Это так редко»'].map(t => `<div class="phrase">${t}</div>`).join('')}</div></div></div>`;
    } else {
      body = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:30px">${items.map(t => `<div class="phrase">${t}</div>`).join('')}</div>`;
    }
    add(`<section class="slide">${deco(k)}
     <div class="z">${tag(`Блок ${String(k + 1).padStart(2, '0')} · ${short}`)}${prog(7, k + 1)}
      <div class="h m"><span class="w">${a}</span> <span class="p">${b}</span></div>
      <div class="sub" style="font-size:24px;color:var(--mut);margin-top:10px">— ${sub}</div>
      ${body}</div>
     ${tip ? `<div class="z" style="position:absolute;left:90px;right:90px;bottom:86px">${result('Сильнее всего', tip)}</div>` : ''}
     ${foot(B, i, N)}</section>`);
  });

  // 12 mistakes
  i++; add(`<section class="slide">${deco(2)}
   <div class="z">${tag('Чего не говорить')}
    <div class="h s"><span class="w">6 «комплиментов», после которых</span><br><span class="p">мужчина перестаёт стараться</span></div></div>
   <div class="z" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px">
    ${[['С упрёком', '«Наконец-то ты догадался подарить цветы»'], ['Со сравнением', '«Ты не такой, как мой бывший»'], ['Как маленькому', '«Ой, ты мой умничка, справился»'], ['С поправкой', '«Спасибо, но в следующий раз бери розовые»'], ['Обесценивание заботы', '«Да не надо было, я бы сама»'], ['Сомнение в уме и силе', '«Дай я сама, у тебя не получится»']]
      .map(([t, e], k) => `<div class="card ${k >= 4 ? 'hl' : ''}" style="padding:22px 26px"><div style="display:flex;gap:14px;align-items:center;margin-bottom:10px"><span class="num" style="min-width:40px;height:36px;font-size:18px">✕</span><h4 style="margin:0;font-size:26px">${t}</h4></div><div class="txt" style="font-size:20px">${e}</div></div>`).join('')}
   </div>
   <div class="z" style="margin-top:22px">${result('Запомни', '«Я сама» мужчина слышит как «твоя забота мне не нужна». А сомнение в его уме или силе бьёт по самому важному — <b>по уважению</b>.')}</div>
   ${foot(B, i, N)}</section>`);

  // 13 challenge
  i++; add(`<section class="slide">${deco(0)}
   <div class="z">${tag('Практика')}
    <div class="h m"><span class="w">Челлендж</span> <span class="p">на 7 дней</span></div>
    <div class="sub" style="width:1200px">Каждый день — один искренний комплимент по формуле: <b>что сделал → что почувствовала → что это значит</b></div></div>
   <div class="z" style="display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-top:40px">
    ${['Ум', 'Сила', 'Забота', 'Решения', 'Характер', 'Внешность', 'Переписка'].map((t, k) => `<div class="card ${k < 2 ? 'hl' : ''}" style="text-align:center;padding:24px 10px">
      <div style="font:600 14px Mont;letter-spacing:.2em;color:var(--mut)">ДЕНЬ</div>
      <div style="font:700 64px/1.05 Osw;color:var(--pink)">${k + 1}</div>
      <div style="font:700 22px Osw;text-transform:uppercase;color:#fff;margin-top:6px">${t}</div>
      <div style="width:30px;height:30px;border:2px solid var(--pink);border-radius:9px;margin:16px auto 0"></div></div>`).join('')}
   </div>
   <div class="z" style="position:absolute;left:90px;right:90px;bottom:86px">${result('Если ты одна', 'Говори комплименты папе, брату, другу, коллеге. Это тренировка: ты учишься замечать и принимать мужскую заботу — и когда появится «тот самый», ты уже будешь это уметь.')}</div>
   ${foot(B, i, N)}</section>`);

  // 14 bridge
  i++; add(`<section class="slide">${deco(1)}
   <div class="z" style="width:1100px;margin-top:40px">
    ${tag('А если не работает?')}
    <div class="h"><span class="w">Значит, дело</span><br><span class="p">не в словах</span></div>
    <div class="txt" style="margin-top:28px;font-size:25px;width:950px">
     <p>Ты хвалишь, благодаришь, принимаешь заботу — а мужчина всё равно не ухаживает?</p>
     <p>Возможно, ты выбираешь мужчин, которые не умеют или не хотят вкладываться. Или есть <b>невидимая ошибка</b>, которая отталкивает тех, кто готов.</p></div>
   </div>${foot(B, i, N)}</section>`);

  i++; add(cta(B, i, N, 0));
  return s;
};
