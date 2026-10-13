import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{cleanPhrase} from './worker.mjs';
const req=(body,options={})=>new Request('https://example.workers.dev/words',{method:'POST',headers:{Origin:'https://guessyou.app','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(body),...options});
function env(){
 const rows=new Map();
 const DB={prepare(sql){
  assert(sql.includes('VALUES (?, 1)'));
  return {bind(word){
   return {run:async()=>rows.set(word,(rows.get(word)||0)+1)};
  }};
 }};
 return {rows,DB,WORD_LIMITER:{limit:async()=>({success:true})}};
}

test('only opted-in phrases are counted, normalized, without reflection fields',async()=>{
 const e=env();for(const phrase of ['  Out of sorts ', 'out of sorts'])assert.equal((await worker.fetch(req({phrase,consent:true}),e)).status,201);
 assert.equal(e.rows.get('out of sorts'),2);
 assert.equal((await worker.fetch(req({phrase:'small',consent:false}),e)).status,400);
 assert.equal((await worker.fetch(req({phrase:'small',consent:true,reflection:'private'}),e)).status,400);
 assert.equal(e.rows.size,1);
});
test('rejects personal contact formats, huge payloads, and public database reads',async()=>{
 for(const value of ['hello@example.com','https://example.com','2125551234','x'.repeat(81)])assert.equal(cleanPhrase(value),null);
 assert.equal(cleanPhrase('não sei'),'não sei');
 assert.equal((await worker.fetch(req({phrase:'x'.repeat(2000),consent:true}),env())).status,400);
 assert.equal((await worker.fetch(new Request('https://example.workers.dev/words',{headers:{Origin:'https://guessyou.app'}}),env())).status,405);
 assert.equal((await worker.fetch(req({phrase:'small',consent:true},{headers:{Origin:'https://other.example','Content-Type':'application/json'}}),env())).status,403);
});
test('rate limits and service errors do not claim success',async()=>{
 const e=env();e.WORD_LIMITER.limit=async()=>({success:false});assert.equal((await worker.fetch(req({phrase:'small',consent:true}),e)).status,429);assert.equal(e.rows.size,0);
 delete e.WORD_LIMITER;assert.equal((await worker.fetch(req({phrase:'small',consent:true}),e)).status,503);
});
