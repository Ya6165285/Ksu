import base64, json, sys, subprocess
TPL_HEAD = '''<title>{title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;800;900&display=swap">
<style>
/* Layout: phone-shaped players side by side, stacking on narrow screens */
:root{{--bg:#fbf6f8;--fg:#2a1f25;--muted:#7d6a74;--pink:#e9a6cb;--pink-ink:#8a3a66;--frame:#1d1519;--display:"Montserrat",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171114;--fg:#f6eef2;--muted:#b5a2ad;--pink:#f2badc;--pink-ink:#f2badc;--frame:#000;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#171114;--fg:#f6eef2;--muted:#b5a2ad;--pink:#f2badc;--pink-ink:#f2badc;--frame:#000;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font-family:var(--display)}}
.wrap{{max-width:900px;margin:0 auto;padding-inline:16px;padding-block:24px 40px;display:flex;flex-direction:column;gap:20px}}
h1{{margin:0;font-weight:900;font-size:1.8rem}}
h1 span{{color:var(--pink-ink);font-style:italic}}
.lead{{margin:0;color:var(--muted);font-weight:500}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}}
.card{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.hook{{margin:0;font-weight:800;font-size:1.05rem;text-wrap:balance}}
.meta{{margin:0;color:var(--muted);font-weight:500;font-size:.9rem}}
video{{display:block;width:100%;max-width:100%;aspect-ratio:9/16;background:var(--frame);border-radius:18px}}
button{{align-self:flex-start;font:800 1rem var(--display);border:0;border-radius:999px;padding:12px 20px;background:var(--pink);color:#2a1f25;cursor:pointer}}
button:focus-visible{{outline:3px solid var(--pink-ink);outline-offset:2px}}
.status{{margin:0;color:var(--muted);font-size:.9rem;font-weight:500;min-height:1.2em}}
</style>
<div class="wrap">
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
  <div class="grid">
'''
CARD = '''    <div class="card">
      <p class="hook">{hook}</p>
      <p class="meta">{meta}</p>
      <video id="v{k}" controls playsinline preload="auto"></video>
      <button type="button" data-v="{k}" data-name="{fname}" hidden>Скачать ролик</button>
      <p class="status" id="st{k}"></p>
    </div>
'''
JS = '''<script>
(function(){
  var blobs={};
  document.querySelectorAll('script[data-vid]').forEach(function(sc){
    var k=sc.dataset.vid, b64=sc.textContent.trim();
    var bin=atob(b64),bytes=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    var blob=new Blob([bytes],{type:'video/mp4'}); blobs[k]=blob;
    var v=document.getElementById('v'+k), tried=false;
    v.addEventListener('error',function(){if(!tried){tried=true;v.src='data:video/mp4;base64,'+b64;}});
    try{v.src=URL.createObjectURL(blob);}catch(e){tried=true;v.src='data:video/mp4;base64,'+b64;}
  });
  (async function(){
    var downloads=null;
    try{downloads=await window.claude?.use?.("downloads");}catch(e){}
    if(!downloads)return;
    document.querySelectorAll('button[data-v]').forEach(function(btn){
      btn.hidden=false;
      btn.addEventListener('click',async function(){
        var k=btn.dataset.v, st=document.getElementById('st'+k); st.textContent='';
        try{await downloads.save({filename:btn.dataset.name,data:blobs[k]}); st.textContent='Сохранено, '+(blobs[k].size/1048576).toFixed(1)+' МБ.';}
        catch(e){ if(!(e&&e.code==='declined')) st.textContent='Не получилось. Нажмите и удерживайте видео, чтобы сохранить.'; }
      });
    });
  })();
})();
</script>
'''
def dur(f):
    return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
def build(out, title, h1, lead, items):
    html = TPL_HEAD.format(title=title, h1=h1, lead=lead)
    data = ""
    for k,(f,hook,num) in enumerate(items):
        d = dur(f)
        html += CARD.format(k=k, hook=hook, meta=f"Рилс {num} · {int(round(d))} сек", fname=f"Рилс Ксюша YouTube {num}.mp4")
        data += f'<script type="application/octet-stream" data-vid="{k}">' + base64.b64encode(open(f,"rb").read()).decode() + "</script>\n"
    html += "  </div>\n</div>\n" + data + JS
    open(out,"w").write(html); print(out, round(len(html)/1e6,2), "MB")
H = {"r1":"Он внушал, что без него я пропаду","r2":"Почему тебе попадаются «не те» мужчины","r3":"Я похудела, когда перестала себя мучить",
     "r4":"Ты сама продлеваешь свои страдания","r5":"Если сейчас нет денег — послушай это","r6":"Эту мысль тебе просто внушили",
     "r7":"Вспомни, какой ты была год назад","r8":"Всё плохое, что случилось, было тебе во благо"}
pages=[("1",["r1","r5"]),("2",["r2","r8"]),("3",["r3","r6"]),("4",["r4","r7"])]
for n,rs in pages:
    build(f"pages/ksu_yt_{n}.html", f"Рилсы с YouTube {n}", f"Рилсы с YouTube · <span>{n}/4</span>",
          "Нарезка из YouTube-ролика Ксюши: хук сверху, субтитры, вставки, концовка с МАРШРУТ.",
          [(f"small/{r}.mp4", H[r], r[1:]) for r in rs])
