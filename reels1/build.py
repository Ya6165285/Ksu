import json, subprocess
W=json.load(open("words.json"))["words"]
DROP=set(range(42,64))|{82,83,91,164,209}|set(range(234,239))
keep=[i for i in range(len(W)) if i not in DROP]
PRE,POST,MAXGAP=0.07,0.12,0.30
# build clips from runs of kept words
clips=[]  # [start,end,[word idx]]
for i in keep:
    w=W[i]
    if clips and clips[-1][2][-1]==i-1 and w["s"]-W[i-1]["e"]<=MAXGAP:
        clips[-1][1]=w["e"]; clips[-1][2].append(i)
    else:
        clips.append([w["s"],w["e"],[i]])
for c in clips:
    a,b=c[2][0],c[2][-1]
    lo=W[a-1]["e"] if a>0 else 0
    hi=W[b+1]["s"] if b+1<len(W) else 90.27
    c[0]=max(c[0]-PRE,(lo+c[0])/2); c[1]=min(c[1]+POST,(hi+c[1])/2)
# timeline mapping
t=0; outw={}
for c in clips:
    for i in c[2]:
        outw[i]=(W[i]["s"]-c[0]+t, W[i]["e"]-c[0]+t)
    c.append(t); t+=c[1]-c[0]
total=t
print(f"clips={len(clips)} total={total:.2f}s")
# ---- subtitles ----
PINK="&H00DCBAF2"  # BGR of F2BADC
hdr=f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Word,Montserrat ExtraBold,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,1,0,1,0,4,5,30,30,0,204
Style: Small,Montserrat ExtraBold,88,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,1,0,1,0,4,5,30,30,0,204
Style: Pink,Montserrat Black,128,{PINK},{PINK},&H00000000,&HA0000000,0,1,0,0,100,100,0,0,1,0,4,5,30,30,0,204
Style: Script,Marck Script,170,{PINK},{PINK},&H00000000,&HA0000000,0,0,0,0,100,100,0,0,1,0,4,5,30,30,0,204

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
def ts(x):
    x=max(0,x); h=int(x//3600); m=int(x%3600//60); s=x%60
    return f"{h}:{m:02d}:{s:05.2f}"
Y=1400
POP=r"{\fscx88\fscy88\t(0,90,\fscx100\fscy100)}"
# accents: list of lines, each (word idx list, style)
ACC=[
 [([4,5,6],"Small"),([7,8,9],"Small"),([10],"Pink")],
 [([38,39],"Small"),([40],"Pink"),([41],"Small")],
 [([85,86,87],"Small"),([88],"Small"),([89],"Pink"),([90],"Pink")],
 [([92,93,94],"Small"),([95],"Small"),([96,97],"Script")],
 [([105,106,107],"Small"),([108,109],"Pink")],
 [([203,204,205],"Small"),([206],"Pink"),([207,208],"Small")],
 [([239,240,241],"Small"),([242],"Pink")],
]
LH={"Small":104,"Pink":140,"Script":160}
inacc={}
for k,blk in enumerate(ACC):
    for li,(ids,st) in enumerate(blk):
        for i in ids: inacc[i]=k
order=[i for i in keep]
def nxt_start(i):
    j=order.index(i)
    return outw[order[j+1]][0] if j+1<len(order) else total
ev=[]
done=set()
for i in order:
    if i in inacc:
        k=inacc[i]
        if k in done: continue
        done.add(k); blk=ACC[k]
        allids=[x for ids,_ in blk for x in ids]
        end=min(nxt_start(allids[-1]), outw[allids[-1]][1]+0.6)
        hs=[LH[st] for _,st in blk]; y0=Y-sum(hs)/2
        y=y0
        for ids,st in blk:
            y+=LH[st]/2
            txt=" ".join(W[x]["w"] for x in ids)
            ev.append(f"Dialogue: 1,{ts(outw[ids[0]][0])},{ts(end)},{st},,0,0,0,,{{\\pos(540,{int(y)})}}{POP}{txt}")
            y+=LH[st]/2
        continue
    s=outw[i][0]; e=min(nxt_start(i), outw[i][1]+0.5)
    ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Word,,0,0,0,,{{\\pos(540,{Y})}}{POP}{W[i]['w']}")
open("subs.ass","w").write(hdr+"\n".join(ev)+"\n")
# ---- ffmpeg filter ----
parts=[];cat=""
for n,c in enumerate(clips):
    s,e=c[0],c[1]; d=e-s
    parts.append(f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{n}];[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={max(0,d-0.012):.3f}:d=0.012[a{n}]")
    cat+=f"[v{n}][a{n}]"
fc=";".join(parts)+f";{cat}concat=n={len(clips)}:v=1:a=1[vc][ac];[vc]scale=1080:1920:flags=lanczos,setsar=1,ass=subs.ass[vo];[ac]loudnorm=I=-14:TP=-1.5:LRA=11[ao]"
open("filter.txt","w").write(fc)
json.dump({"clips":[c[:2] for c in clips]},open("clips.json","w"))
