const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loadPortraits}=require('../design/portrait-loader.js');
test('recovers intermittent failures, bounds the opening burst, and falls back to the same portrait',async()=>{
 let active=0,peak=0;
 const images=Array.from({length:20},(_,i)=>({dataset:{src:`person-${i}-400.webp`},naturalWidth:0,attempts:[],
 set src(value){this.attempts.push(value);peak=Math.max(peak,++active);setImmediate(()=>{active--;const fails=i===3&&this.attempts.length<3||i===5;this.naturalWidth=fails?0:400;fails?this.onerror():this.onload();});}}));
 await loadPortraits(images,{wait:async()=>{}});
 assert(peak<=6);
 assert.equal(images[3].attempts[2],'person-3-800.webp');
 assert.equal(images[3].dataset.loadState,'ready');
 assert.equal(images[5].dataset.loadState,'failed');
 assert.equal(images[5].attempts.length,3);
 assert.equal(images.filter(i=>i.dataset.loadState==='ready').length,19);
});
