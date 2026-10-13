// Set only after the hosted collector has passed its deployment checks.
const WORD_COLLECTION_ENDPOINT='https://guess-you-words.guess-you-words.workers.dev/words';
const submittedWords=new Set();
function showWordContribution(phrase,found){
 const panel=document.querySelector('#wordContribution');
 const button=document.querySelector('#sendWord');
 const status=document.querySelector('#wordContributionStatus');
 const eligible=phrase.length>=2&&phrase.length<=80&&phrase.split(' ').length<=8&&/^\p{L}[\p{L}\p{M} '\-]*$/u.test(phrase);
 panel.hidden=found||!eligible||!WORD_COLLECTION_ENDPOINT;
 button.disabled=submittedWords.has(phrase);
 button.textContent=button.disabled?'Word sent':'Send this word to help grow the collection';
 document.querySelector('#contributionWord').textContent=phrase;
 status.textContent='';
 button.onclick=async()=>{
  button.disabled=true;status.textContent='Sending…';
  try{
   const response=await fetch(WORD_COLLECTION_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',referrerPolicy:'no-referrer',body:JSON.stringify({phrase,consent:true}),signal:AbortSignal.timeout(12000)});
   const result=await response.json();
   if(!response.ok||result.saved!==true)throw Error('not saved');
   submittedWords.add(phrase);
   if(document.querySelector('#contributionWord').textContent===phrase){button.textContent='Word sent';status.textContent='Thank you. Your suggestion is in the review list.';}
  }catch{
   if(document.querySelector('#contributionWord').textContent===phrase){button.disabled=false;status.textContent='We couldn’t confirm it was saved. You can try again, or keep exploring.';}
  }
 };
}
