from fontTools.ttLib import TTFont
import cairosvg, io, copy, sys
from lxml import etree
from PIL import Image, ImageFilter
f=TTFont('/root/.fonts/NotoColorEmoji.ttf'); cmap=f.getBestCmap(); go=f.getGlyphOrder()
docs=f['SVG '].docList
NS="http://www.w3.org/2000/svg"
def glyph_svg(gid):
    for d in docs:
        if d.startGlyphID<=gid<=d.endGlyphID:
            root=etree.fromstring(d.data.encode())
            g=root.find(f".//*[@id='glyph{gid}']")
            new=etree.Element("{%s}svg"%NS,nsmap={None:NS,"xlink":"http://www.w3.org/1999/xlink"})
            for de in root.findall("{%s}defs"%NS): new.append(copy.deepcopy(de))
            new.append(copy.deepcopy(g)); new.set("viewBox","-50 -1050 1400 1400")
            return etree.tostring(new)
def render(ch,name,size=320):
    gid=go.index(cmap[ord(ch)]); s=glyph_svg(gid)
    png=cairosvg.svg2png(bytestring=s,output_width=700,output_height=700)
    im=Image.open(io.BytesIO(png)).convert("RGBA"); bb=im.getbbox()
    if not bb: print("empty",name); return
    im=im.crop(bb); im.thumbnail((size,size),Image.LANCZOS)
    a=im.split()[-1].filter(ImageFilter.MaxFilter(15))
    out=Image.new("RGBA",(im.width+40,im.height+40),(0,0,0,0)); m=Image.new("L",out.size,0); m.paste(a,(20,20))
    out.paste(Image.new("RGBA",out.size,(255,255,255,255)),(0,0),m); out.alpha_composite(im,(20,20)); out.save(name+".png"); print("ok",name,out.size,flush=True)
for ch,n in [("🍊","orange"),("📱","phone"),("🙅","stop"),("📖","book"),("🔒","lock"),("📉","down"),("🥰","inlove"),("🌹","rose")]:
    try: render(ch,n)
    except Exception as e: print("err",n,repr(e)[:120],flush=True)
