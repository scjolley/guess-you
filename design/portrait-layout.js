// Keep the six opening portraits, then separate matching families on both axes.
// Slots are physical row-major positions, independent of animation/DOM order.
function portraitGridSlots(faces, columns) {
 const count=Math.floor(faces.length/columns)*columns;
 const cells=Array(count).fill(null), slots=Array(faces.length).fill(-1);
 const traversal=Array.from({length:count},(_,i)=>{
  const row=Math.floor(i/columns), col=i%columns;
  return row*columns+(row%2?columns-1-col:col);
 });
 const groups=new Map();
 for(let i=0;i<count;i++){
  if(i<6){cells[i]=faces[i].family;slots[i]=i;continue;}
  if(!groups.has(faces[i].family))groups.set(faces[i].family,[]);
  groups.get(faces[i].family).push(i);
 }
 let visits=0;
 function place(step){
  if(step===count)return true;
  if(++visits>20000)return false;
  const slot=traversal[step],col=slot%columns;
  const neighbors=[slot-columns,col>0?slot-1:-1,col<columns-1?slot+1:-1];
  const candidates=[...groups.entries()].filter(([family,ids])=>ids.length&&!neighbors.some(n=>n>=0&&cells[n]===family)).sort((a,b)=>b[1].length-a[1].length||a[1][0]-b[1][0]);
  for(const [family,ids] of candidates){
   const index=ids.shift();cells[slot]=family;slots[index]=slot;
   if(place(step+1))return true;
   ids.unshift(index);cells[slot]=null;slots[index]=-1;
  }
  return false;
 }
 if(!place(Math.min(6,count)))throw Error('Unable to separate portrait families');
 return slots;
}
