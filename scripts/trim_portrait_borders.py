"""Trim confirmed white frame bands from four web portraits; preserve masters.
Rebuilds only 400/800 WebP exports from an unchanged original PNG.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import shutil, json
ROOT=Path(__file__).resolve().parent.parent
BORDERS={'elias-cozy':(0,0,0,32),'elias-frazzled':(0,44,32,42),'keisha-confused':(20,0,0,0),'tayanna-comfortable':(39,73,33,68)}
backup=ROOT/'recovery/portrait-border-originals';backup.mkdir(parents=True,exist_ok=True)
proof=ROOT/'design/portrait-proofs';rows=[]
board=Image.new('RGB',(4*420,800),'#eeeeee');draw=ImageDraw.Draw(board)
for i,(name,(left,top,right,bottom)) in enumerate(BORDERS.items()):
 original=Image.open(ROOT/f'tex/site/master/{name}.png').convert('RGB')
 w,h=original.size;trimmed=original.crop((left,top,w-right,h-bottom))
 # Preserve proportions and standard dimensions, with the smallest further crop.
 normalized=ImageOps.fit(trimmed,(810,1440),method=Image.Resampling.LANCZOS)
 for width in (400,800):
  dest=ROOT/f'tex/site/{name}-{width}.webp'; saved=backup/dest.name
  if not saved.exists():shutil.copy2(dest,saved)
  normalized.resize((width,round(width*16/9)),Image.Resampling.LANCZOS).save(dest,quality=80)
 draw.text((i*420+10,10),name+' | original / border trimmed',fill='black')
 for j,img in enumerate((original,normalized)):
  board.paste(img.resize((200,356),Image.Resampling.LANCZOS),(i*420+j*205+5,40))
 rows.append({'name':name,'trim_pixels':{'left':left,'top':top,'right':right,'bottom':bottom},'master_size':[w,h],'exports':{'400':[400,711],'800':[800,1422]},'changes':'Crop and resize only; no brightness, background, shadow, or subject edits.'})
 if name=='keisha-confused':
  side=Image.new('RGB',(820,770),'white');d=ImageDraw.Draw(side)
  for j,(label,img) in enumerate((('Original',original),('Border trimmed only',normalized))):
   d.text((j*410+10,10),label,fill='black');side.paste(img.resize((400,711),Image.Resampling.LANCZOS),(j*410+10,40))
  side.save(proof/'keisha/comparison.jpg',quality=95)
board.crop((0,0,1680,420)).save(proof/'border-trims.jpg',quality=95)
(proof/'border-audit.json').write_text(json.dumps(rows,indent=2))
print('Trimmed only:',', '.join(BORDERS))
