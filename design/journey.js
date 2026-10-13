const arrowSVG='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16h20M18 8l8 8-8 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const $=s=>document.querySelector(s), reduce=matchMedia('(prefers-reduced-motion: reduce)');
const feelings=D.feelings.filter(f=>f.image), byId=new Map(feelings.map(f=>[f.id,f])), families=new Map(D.families.map(f=>[f.id,f]));
const trimmedPortraits=new Set(['elias-cozy','elias-frazzled','keisha-confused','tayanna-comfortable']);
const portraitSrc=path=>trimmedPortraits.has(path.split('/').pop().replace(/-(400|800)\.webp$/,''))?path+'?v=border-trim-1':path;
const tints={angry:'#f7c9c2',sad:'#d6e1ff',afraid:'#e5dafa',tense:'#ffe1c1',disconnected:'#e4e9e2',tired:'#eadbcf',confused:'#d0efeb',vulnerable:'#f9dce9',joyful:'#fff0b8',peaceful:'#dcefdc',faux:'#e7e7e3'};
let matches=[],limit=4,selected=null;
const defaults=['happy','sad','angry','anxious','peaceful','overwhelmed'];
// One portrait per person. Only the opening six move while the visitor is still.
const personKey=f=>f.image.split('/').pop().slice(0,-('-'+f.id.replaceAll(' ','-')+'-800.webp').length);
const introFaces=['excited','annoyed','anxious','calm','disappointed','confused'].map(id=>byId.get(id));
const usedPeople=new Set(introFaces.map(personKey));
const buckets=D.families.map(f=>feelings.filter(x=>x.family===f.id));
for(let round=0;introFaces.length<76&&round<80;round++){for(const bucket of buckets){const f=bucket.find(x=>!usedPeople.has(personKey(x)));if(f){usedPeople.add(personKey(f));introFaces.push(f);}}}
$('#portraitCloud').innerHTML=introFaces.map((f,i)=>`<div class="cloud-card" style="visibility:${i<6?'visible':'hidden'}"><img src="${portraitSrc(f.image.replace('-800.webp','-400.webp'))}" alt="" loading="eager" fetchpriority="${i<6?'high':'low'}" decoding="async"></div>`).join('');
const hero=$('#hello'),sticky=$('.hero-sticky'),cards=[...document.querySelectorAll('.cloud-card')];
let motionFrame=0,paused=false,lastProgress=-1,geometry=null;
const referenceMotion=new URLSearchParams(location.search).get('motion')!=='original';
let fanStart=performance.now()+3800,fanPausedAt=0;
function referenceFan(time,index){
 const phase=Math.max(0,time-fanStart)/2300-(index-2.5)*.10;
 return {shift:Math.sin(phase)*.48,tilt:Math.sin(phase+.35)*1.1,lift:Math.sin(phase)*2};
}
const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>n*n*(3-2*n);
function measureHero(){const w=sticky.clientWidth,h=sticky.clientHeight,cols=w<700?10:16,count=Math.floor(cards.length/cols)*cols,rows=count/cols,gap=w<700?5:10;const gw=Math.min((w-36-(cols-1)*gap)/cols,(h*.72-(rows-1)*gap)/rows*9/16);geometry={w,h,cols,rows,count,gap,gw,gh:gw*16/9,fw:Math.min(w*.255,174,h*.18)};lastProgress=-1;}
function paintHero(time=0){motionFrame=0;if(reduce.matches){const cols=sticky.clientWidth<700?10:16;cards.forEach((el,i)=>el.style.display=i<Math.floor(cards.length/cols)*cols?'block':'none');document.body.classList.toggle('compact-logo',$('.intro-copy').getBoundingClientRect().bottom<70);$('#pauseMotion').hidden=true;return;}if(!geometry)measureHero();const g=geometry;const rect=hero.getBoundingClientRect(),p=reduce.matches?1:clamp(-rect.top/Math.max(1,hero.offsetHeight-g.h));const progressChanged=Math.abs(p-lastProgress)>.0001;const sweep=paused||reduce.matches?0:Math.sin(time/2300)*.48;
 if(progressChanged){if(p>.01)document.body.classList.add('intro-scrolled');const copyFade=1-clamp(p/.25);$('.intro-copy').style.opacity=copyFade;$('.intro-copy').style.transform=`translateY(${-p*150}px)`;$('.hero-cta').style.opacity=copyFade;$('.hero-cta').style.visibility=p>.25?'hidden':'visible';$('.scrollnote').style.opacity=copyFade;document.body.classList.toggle('compact-logo',p>.3);$('#pauseMotion').hidden=p>.05||reduce.matches;}
 cards.forEach((el,i)=>{if(i>=g.count){el.style.display='none';return;}el.style.display='block';if(!progressChanged&&i>=6)return;const row=Math.floor(i/g.cols),column=row%2?g.cols-1-i%g.cols:i%g.cols;const tx=(g.w-(g.cols*g.gw+(g.cols-1)*g.gap))/2+column*(g.gw+g.gap),ty=(g.h-(g.rows*g.gh+(g.rows-1)*g.gap))/2+row*(g.gh+g.gap)+g.h*.07+10;let x,y,width,rotation;
 if(i<6){const motion=referenceMotion?referenceFan(paused?fanPausedAt:time,i):{shift:sweep,tilt:0,lift:0};const slot=i-2.5+motion.shift;const fx=g.w/2+slot*g.fw*.77-g.fw/2,fy=g.h*.61+slot*slot*5-g.fw*16/9/2+motion.lift;const q=ease(clamp((p-i*.025)/.375));width=g.fw+(g.gw-g.fw)*q;x=fx+(tx-fx)*q;y=fy+(ty-fy)*q+Math.sin(q*Math.PI)*Math.sin(i*.8)*60;rotation=(slot*8+motion.tilt)*(1-q);el.style.visibility='visible';}
 else{const q=ease(clamp((p-.08-i/g.count*.29)/.12));el.style.visibility=q>0?'visible':'hidden';width=g.gw;const direction=row%2?-1:1;x=tx+direction*(1-q)*(g.w*.75);y=ty+(1-q)*g.h*.65;rotation=(1-q)*direction*18;}
 el.style.width=`${width}px`;el.style.transform=`translate3d(${x}px,${y}px,0) rotate(${rotation}deg)`;
 });lastProgress=p;if(!paused&&!reduce.matches&&p<.86&&rect.bottom>0&&rect.top<g.h&&!document.hidden)motionFrame=requestAnimationFrame(paintHero);
}
function requestMotion(){if(!motionFrame)motionFrame=requestAnimationFrame(paintHero);}
addEventListener('scroll',requestMotion,{passive:true});addEventListener('resize',()=>{measureHero();requestMotion()});document.addEventListener('visibilitychange',requestMotion);reduce.addEventListener('change',requestMotion);
$('#pauseMotion').onclick=()=>{if(paused)fanStart+=performance.now()-fanPausedAt;else fanPausedAt=performance.now();paused=!paused;$('#pauseMotion').textContent=paused?'Play motion':'Pause motion';$('#pauseMotion').setAttribute('aria-pressed',String(paused));requestMotion()};requestMotion();
function syncKeepReflection(){
 const stage=!$('#closing').hidden?'closing':!$('#deep').hidden?'deep':!$('#detail').hidden?'detail':null;
 const button=$('.keep-reflection');
 if(stage){document.querySelector(`[data-keep-stage="${stage}"]`).append(button);button.dataset.stage=stage;}
 button.hidden=!stage;
}
function move(id){syncKeepReflection();$(id).scrollIntoView({behavior:'instant'});}
function normalizePhrase(value){return value.toLowerCase().normalize('NFKC').replace(/[’']/g,'').replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim().replace(/^(?:(?:i am|im|i) (?:feeling|feel)|i feel|im|i am|feeling)\s+/,'').trim();}
const language=[...everydayLanguage,...D.triggers];
const phraseIndex=new Map();for(const row of language){for(const phrase of row.phrases){const key=normalizePhrase(phrase);if(!phraseIndex.has(key))phraseIndex.set(key,row.feelings.filter(id=>byId.has(id)));}}
const nounAliases={disappointment:'disappointed',sadness:'sad',anger:'angry',rejection:'rejected',heartbreak:'heartbroken',loneliness:'lonely',anxiety:'anxious',happiness:'happy',frustration:'frustrated',exhaustion:'exhausted',embarrassment:'embarrassed',guilt:'guilty',shame:'ashamed',grief:'heartbroken',gratitude:'grateful',relief:'relieved',fear:'scared',joy:'happy'};
const suggestionWords=[...new Set([...feelings.map(f=>f.id),...everydayLanguage.flatMap(r=>r.phrases)])];
function resolveWords(value){const q=normalizePhrase(value);if(nounAliases[q])return resolveWords(nounAliases[q]);if(phraseIndex.has(q))return {ids:phraseIndex.get(q),phrase:true};if(byId.has(q)){const f=byId.get(q);return {ids:[q,...feelings.filter(x=>x.family===f.family&&x.id!==q).map(x=>x.id)],phrase:false};}const stripped=q.replace(/^(?:really|very|a little|a bit|kind of|sort of|so)\s+/,'').replace(/\s+(?:today|right now|at the moment|lately)$/,'');if(stripped!==q&&(phraseIndex.has(stripped)||byId.has(stripped)))return resolveWords(stripped);return {ids:feelings.filter(f=>q&&normalizePhrase(f.id).includes(q)).map(f=>f.id),phrase:false};}
function suggest(){const q=normalizePhrase($('#feelingInput').value);const words=q?suggestionWords.filter(w=>normalizePhrase(w).includes(q)).sort((a,b)=>(normalizePhrase(b)===q)-(normalizePhrase(a)===q)).slice(0,4):['happy','sad','angry','anxious'];$('#suggestions').replaceChildren(...words.map(w=>{const b=document.createElement('button');b.textContent=w;b.onclick=()=>{$('#feelingInput').value=w;search()};return b}));}
$('#feelingInput').addEventListener('input',suggest);suggest();
function expandMatches(ids){
 const unique=[...new Set(ids)].filter(id=>byId.has(id));
 const familyIds=new Set();for(const id of unique){const f=byId.get(id);if(f.family==='faux'){for(const underlying of f.underlying||[]){if(byId.has(underlying))familyIds.add(byId.get(underlying).family);}}else familyIds.add(f.family);}
 const candidates=feelings.filter(f=>familyIds.has(f.family)).map(f=>f.id);
 const related={sad:['vulnerable'],afraid:['tense','vulnerable'],vulnerable:['sad','afraid'],angry:['tense'],tense:['afraid','tired'],tired:['disconnected'],disconnected:['tired','sad'],confused:['afraid'],joyful:['peaceful'],peaceful:['joyful']};
 const adjacent=new Set([...familyIds].flatMap(f=>related[f]||[]));
 const all=[...new Set([...unique,...candidates,...feelings.filter(f=>adjacent.has(f.family)).map(f=>f.id)])];
 return all.slice(0,Math.min(24,Math.floor(all.length/4)*4)).map(id=>byId.get(id));
}
function search(){const q=$('#feelingInput').value.trim();const result=resolveWords(q);matches=expandMatches(result.ids);const found=matches.length>0;if(!found&&q)recordUnmatchedWord(normalizePhrase(q));if(!found)matches=['happy','frustrated','calm','hurt','excited','lonely','grateful','confused'].map(id=>byId.get(id)).filter(Boolean);limit=4;$('#results').hidden=false;$('#detail').hidden=true;$('#deep').hidden=true;$('#closing').hidden=true;$('#resultStatus').textContent=found?(result.phrase?'That can mean different things. Do any of these fit?':'Choose the word that feels closest.'):q?'Still finding the words? Try one of these, or another phrase.':'A few starting points. Pick what fits.';renderGrid();move('#results');}
$('#feelingForm').addEventListener('submit',e=>{e.preventDefault();search()});
function renderGrid(){const grid=$('#grid');grid.classList.toggle('expanded',limit>4);grid.replaceChildren(...matches.slice(0,limit).map(f=>{const b=document.createElement('button');b.className='feeling-card';b.setAttribute('aria-label',`Explore ${f.id}`);const img=document.createElement('img');img.src=portraitSrc(f.image);img.alt=`Portrait expressing ${f.id}`;const label=document.createElement('span');label.textContent=f.id;const arrow=document.createElement('i');arrow.innerHTML=arrowSVG;arrow.setAttribute('aria-hidden','true');label.append(arrow);b.append(img,label);b.onclick=()=>select(f);return b}));$('#more').hidden=limit>=matches.length;$('#more').setAttribute('aria-label','See four more feelings');}
$('#more').onclick=()=>{limit+=4;renderGrid()};
function select(f){selected=f;document.documentElement.style.setProperty('--accent',tints[f.family]||'#e6ecdc');$('#chosen').textContent=f.id;$('#family').textContent=families.get(f.family)?.label||'A word to explore';$('#description').textContent=feelingDescriptions[f.id]+' Your experience might feel different.';$('#detailImage').src=portraitSrc(f.image);$('#detailImage').alt=`Portrait expressing ${f.id}`;updateCommunication();$('#deep').hidden=true;$('#closing').hidden=true;$('#deeper').setAttribute('aria-expanded','false');$('#copyStatus').textContent='';$('#needSuggestions').replaceChildren(...f.needs.map(n=>{const b=document.createElement('button');b.textContent=n;b.onclick=()=>{$('#need').value=n;updateCommunication()};return b}));$('#detail').hidden=false;move('#detail');$('#detailTitle').focus({preventScroll:true});}
$('#back').onclick=()=>{$('#detail').hidden=true;$('#deep').hidden=true;$('#closing').hidden=true;move('#results')};function closeDeep(){$('#deep').hidden=true;$('#deeper').setAttribute('aria-expanded','false');move('#detail');$('#deeper').focus({preventScroll:true});}$('#closeDeep').onclick=closeDeep;$('#deeper').onclick=()=>{if(!$('#deep').hidden){closeDeep();return;}$('#deep').hidden=false;$('#deeper').setAttribute('aria-expanded','true');move('#deep')};$('#closeClosing').onclick=()=>{$('#closing').hidden=true;move($('#deep').hidden?'#detail':'#deep')};document.querySelectorAll('.finish').forEach(b=>b.onclick=()=>{$('#closing').hidden=false;move('#closing');$('#closingTitle').focus({preventScroll:true})});
function currentWords(){return {input:$('#feelingInput').value,feeling:selected?.id||'',...Object.fromEntries(['bodyNote','observation','need','request','now'].map(id=>[id,$('#'+id).value]))};}
function updateCommunication(){const v=currentWords(),hasContent=!!(v.observation.trim()||v.need.trim()||v.request.trim());$('#communicationPreview').textContent=hasContent?communicationSentence(v):'Your words will come together here as you write.';}
['observation','need','request'].forEach(id=>$('#'+id).addEventListener('input',updateCommunication));
async function copyText(text,status){try{await navigator.clipboard.writeText(text);status.textContent='Copied. Your words are ready to paste.';}catch{status.textContent='Copy is unavailable here. Select and copy the text below.';$('#shareText').value=text;$('#includeLinks').checked=false;if(!$('#shareDialog').open)$('#shareDialog').showModal();$('#shareStatus').textContent='Select and copy your words manually.';$('#shareText').select();}}

let shareStage='detail';
function openShare(stage){shareStage=stage;$('#shareText').value=reflectionText(currentWords(),stage);$('#shareStatus').textContent='';$('#publicLinkNote').textContent=PUBLIC_GUESS_YOU_URL?'': 'The Guess You website link will be added once the public site is live.';$('#nativeShare').hidden=typeof navigator.share!=='function';$('#shareDialog').showModal();}
document.querySelectorAll('.keep-reflection').forEach(b=>b.onclick=()=>openShare(b.dataset.stage));
$('#closeShare').onclick=()=>$('#shareDialog').close();
function sharePayload(){return $('#includeLinks').checked?withSiteLink($('#shareText').value):$('#shareText').value;}
$('#copyReflection').onclick=()=>copyText(sharePayload(),$('#shareStatus'));
$('#downloadReflection').onclick=()=>{const url=URL.createObjectURL(new Blob([sharePayload()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-guess-you-reflection.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#shareStatus').textContent='Your reflection file is ready.';};
$('#emailReflection').onclick=()=>{location.href='mailto:?subject='+encodeURIComponent('My Guess You reflection')+'&body='+encodeURIComponent(sharePayload());$('#shareStatus').textContent='Continue in your email app. If no draft opens, copy your reflection instead.';};
$('#nativeShare').onclick=async()=>{try{await navigator.share({title:'My Guess You reflection',text:sharePayload()});$('#shareStatus').textContent='Sharing finished.';}catch(e){$('#shareStatus').textContent=e.name==='AbortError'?'Sharing canceled. Your words are still here.':'Sharing is unavailable here. You can copy or email your reflection.';}};

document.querySelectorAll('.circle').forEach(el=>{if(el.textContent.trim()==='＋')return;const down=el.textContent.trim()==='↓';el.innerHTML=arrowSVG;if(down)el.classList.add('arrow-down');});
