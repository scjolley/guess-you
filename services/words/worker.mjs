const MAX_BODY=1024;
export function cleanPhrase(value){
 if(typeof value!=='string'||value.length>80)return null;
 const word=value.normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
 if(word.length<2||word.length>80||word.split(' ').length>8||!/^\p{L}[\p{L}\p{M} '\-]*$/u.test(word))return null;
 return word;
}
async function readSmallBody(request){
 const reader=request.body?.getReader();if(!reader)throw Error('empty');
 const chunks=[];let size=0;
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BODY){await reader.cancel();throw Error('large');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'https://guessyou.app').split(',').map(s=>s.trim());
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  if(new URL(request.url).pathname!=='/words')return reply(404,{error:'Not found'});
  if(!origin||!allowed.includes(origin))return reply(403,{error:'Origin not allowed'});
  headers['Access-Control-Allow-Origin']=origin;
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'3600'}});
  // There is deliberately no public read endpoint. Review happens inside Cloudflare.
  if(request.method!=='POST')return reply(405,{error:'Method not allowed'});
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415,{error:'JSON required'});
  let payload;try{payload=await readSmallBody(request);}catch{return reply(400,{error:'Use a short word or phrase'});}
  if(!payload||payload.consent!==true||Object.keys(payload).some(k=>!['phrase','consent'].includes(k)))return reply(400,{error:'Consent and phrase required'});
  const word=cleanPhrase(payload.phrase);if(!word)return reply(400,{error:'Use up to 80 characters, without contact details or numbers'});
  try{
   if(!env.DB||!env.WORD_LIMITER)return reply(503,{error:'Collection unavailable'});
   // This address is used only by Cloudflare's short-lived rate limiter, never stored in D1.
   const ip=request.headers.get('CF-Connecting-IP');if(!ip)return reply(503,{error:'Collection unavailable'});
   const {success}=await env.WORD_LIMITER.limit({key:ip});
   if(!success)return reply(429,{error:'Please try later'});
   await env.DB.prepare('INSERT INTO words (word, count) VALUES (?, 1) ON CONFLICT(word) DO UPDATE SET count = count + 1').bind(word).run();
   return reply(201,{saved:true});
  }catch{return reply(503,{error:'Not saved. Please try later'});}
 }
};
