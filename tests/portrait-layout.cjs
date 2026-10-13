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
