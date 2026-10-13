/* Limit the opening burst and recover transient failures using the same portrait. */
(function(root){
 function loadPortraits(images,{concurrency=6,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),onReady=()=>{}}={}){
  const queue=[...images];
  async function load(img){
   const source=img.dataset.src;
   const alternate=source.replace('-400.webp','-800.webp');
   const attempts=[source,source+(source.includes('?')?'&':'?')+'retry=1',alternate];
   for(let attempt=0;attempt<attempts.length;attempt++){
    if(attempt)await wait(attempt*600);
    const loaded=await new Promise(resolve=>{
     const finish=ok=>{img.onload=null;img.onerror=null;resolve(ok);};
     img.onload=()=>finish(img.naturalWidth>0);
     img.onerror=()=>finish(false);
     img.src=attempts[attempt];
    });
    if(loaded){img.dataset.loadState='ready';onReady(img);return true;}
   }
   img.dataset.loadState='failed';return false;
  }
  async function worker(){while(queue.length){const img=queue.shift();await load(img);}}
  return Promise.all(Array.from({length:Math.min(concurrency,queue.length)},worker));
 }
 root.loadPortraits=loadPortraits;
 if(typeof module!=='undefined')module.exports={loadPortraits};
})(typeof window!=='undefined'?window:globalThis);
