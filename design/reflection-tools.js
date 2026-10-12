// Set the approved public launch URL here. Never share a localhost preview address.
const PUBLIC_GUESS_YOU_URL = '';
const NVC_RESOURCE_URL = 'https://www.cnvc.org/store/feelings-and-needs-inventory';
function communicationSentence(values){
 const observation=values.observation.trim().replace(/^when\s+/i,'').replace(/[.!?]+$/,'');
 const need=values.need.trim().replace(/^i (?:might )?need\s+/i,'').replace(/[.!?]+$/,'');
 const request=values.request.trim();
 const feeling=values.feeling.trim();
 let text=observation?`When ${observation}, ${feeling?'I feel '+feeling:'this is what I notice'}`:feeling?`I feel ${feeling}`:'';
 if(need)text+=(text?' because I might need ':'I might need ')+need;
 if(text)text+='.';
 if(request)text+=(text?' ':'')+request+(/[.!?]$/.test(request)?'':'.');
 return text;
}
function reflectionText(values,stage){
 const lines=[];
 if(values.input.trim())lines.push(`My words: ${values.input.trim()}`);
 if(stage!=='checkin'&&values.feeling)lines.push(`I feel ${values.feeling}.`);
 if(stage!=='checkin'&&values.bodyNote.trim())lines.push(`I notice: ${values.bodyNote.trim()}`);
 if(['deep','closing'].includes(stage)){
  const sentence=communicationSentence(values);
  if(values.observation.trim()||values.need.trim()||values.request.trim())lines.push(`What I want to communicate:\n${sentence}`);
 }
 if(stage==='closing'&&values.now.trim())lines.push(`Now I feel: ${values.now.trim()}`);
 return lines.length?lines.join('\n\n'):'My Guess You reflection';
}
function withResources(text){return text+'\n\nMade with Guess You'+(PUBLIC_GUESS_YOU_URL?'\n'+PUBLIC_GUESS_YOU_URL:'')+'\nFeelings & needs: '+NVC_RESOURCE_URL+(PUBLIC_GUESS_YOU_URL?'\nMore resources: '+new URL('resources.html',PUBLIC_GUESS_YOU_URL).href:'');}
