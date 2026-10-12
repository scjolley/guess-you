const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const D=JSON.parse(fs.readFileSync('data.json','utf8'));
const source=fs.readFileSync('design/journey.js','utf8');
const language=fs.readFileSync('design/feeling-language.js','utf8');
const context={D};
vm.createContext(context);
vm.runInContext(language+'\nconst feelings=D.feelings,byId=new Map(feelings.map(f=>[f.id,f]));\n'+source.slice(source.indexOf('function normalizePhrase'),source.indexOf('function suggest()'))+'\nthis.resolve=resolveWords;this.groups=everydayLanguage;',context);
const known=new Set(D.feelings.map(f=>f.id));
for(const row of context.groups){assert(row.feelings.length>=4);for(const id of row.feelings)assert(known.has(id),id);for(const phrase of row.phrases)assert(context.resolve(phrase).ids.length>=4,phrase);}
for(const phrase of ['small','I feel small',"I'm feeling really small today",'a little small'])assert.equal(context.resolve(phrase).ids[0],'insecure',phrase);
assert(!context.resolve('not happy').ids.includes('happy'));
assert(context.resolve('happy and sad').ids.includes('torn'));
assert.equal(context.resolve('nonsense xyz').ids.length,0);
console.log('All 253 editorial phrases resolve; prefixes, modifiers, mixed feelings and negation checked.');
