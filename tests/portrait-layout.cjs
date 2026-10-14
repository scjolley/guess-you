const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync('design/journey-data.js','utf8')+';this.data=D;',ctx);
const D=ctx.data,feelings=D.feelings.filter(f=>f.image),byId=new Map(feelings.map(f=>[f.id,f]));
const source=fs.readFileSync('design/journey.js','utf8');
Object.assign(ctx,{D,feelings,byId});
vm.runInContext(source.slice(source.indexOf('const personKey='),source.indexOf("$('#portraitCloud').innerHTML"))+';this.faces=introFaces;',ctx);
vm.runInContext(fs.readFileSync('design/portrait-layout.js','utf8')+';this.layout=portraitGridSlots;',ctx);
for(const cols of [10,16]){
 const slots=ctx.layout(ctx.faces,cols),count=Math.floor(ctx.faces.length/cols)*cols;
 const used=slots.filter(n=>n>=0);assert.equal(used.length,count);assert.equal(new Set(used).size,count);
 const board=Array(count);slots.forEach((slot,i)=>{if(slot>=0)board[slot]=ctx.faces[i].family;});
 for(let i=0;i<count;i++){
  if(i%cols)assert.notEqual(board[i],board[i-1],`horizontal collision at ${cols}:${i}`);
  if(i>=cols)assert.notEqual(board[i],board[i-cols],`vertical collision at ${cols}:${i}`);
 }
 for(let i=0;i<6;i++)assert.equal(slots[i],i,'Opening six retain their positions');
 assert.deepEqual(slots,ctx.layout(ctx.faces,cols),'Stable across resize');
 console.log(`${cols} columns: ${count} unique portraits, full rows, no matching families touching.`);
}

for(const [width,height,expected] of [[390,844,10],[768,1024,10],[1024,768,16],[820,1180,10],[1180,820,16],[1024,1366,10],[1366,1024,16]]){
 assert.equal(ctx.portraitGridColumns(width,height),expected,`${width}×${height}`);
 const slots=ctx.layout(ctx.faces,expected).filter(n=>n>=0);
 assert.equal(slots.length%expected,0,'No incomplete row after rotation');
 assert.equal(slots.length%2,0,'Even portrait count');
}
console.log('Portrait and landscape rotation preserve full rows and even counts.');

for(const [top,bottom,preferred] of [[235,470,108],[210,420,100],[260,580,135]]){
 const fan=ctx.fitOpeningFan(preferred,top,bottom);
 for(let slot=-3;slot<=3;slot+=.05){
  for(const tilt of [-1.6,1.6]){
   const angle=(slot*8+tilt)*Math.PI/180;
   const halfHeight=fan.width*(Math.abs(Math.cos(angle))*8/9+Math.abs(Math.sin(angle))*.5);
   assert.ok(fan.center+slot*slot*5-2-halfHeight>=top-.001,'Fan stays below subtitle throughout sway');
   assert.ok(fan.center+slot*slot*5+2+halfHeight<=bottom+.001,'Fan stays above CTA throughout sway');
  }
 }
 assert.ok(fan.width<=preferred);
}
console.log('Opening fan clears text and CTA throughout its full movement.');
