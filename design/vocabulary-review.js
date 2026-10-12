// Local vocabulary research only. Never stores reflection fields or sends searches.
const vocabularyReviewKey='guess-you-unmatched-v1';
function readVocabularyReview(){
 try{const rows=JSON.parse(localStorage.getItem(vocabularyReviewKey)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.word==='string'&&Number.isFinite(r.count)):[];}catch{return [];}
}
function recordUnmatchedWord(value){
 const word=value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
 if(!word||word.length>80)return;
 try{const rows=readVocabularyReview(),existing=rows.find(r=>r.word===word);if(existing){existing.count++;existing.lastSeen=new Date().toISOString();}else{rows.push({word,count:1,lastSeen:new Date().toISOString()});}localStorage.setItem(vocabularyReviewKey,JSON.stringify(rows.slice(-500)));}catch{/* Storage restrictions must never interrupt reflection. */}
}
