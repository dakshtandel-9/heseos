import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const transpile=name=>ts.transpileModule(fs.readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {createVoiceSession}=await import('data:text/javascript;base64,'+Buffer.from(transpile('voice')).toString('base64'));
const {getHouseLighting}=await import('data:text/javascript;base64,'+Buffer.from(transpile('lighting')).toString('base64'));
function fixture({throwCreate=false,throwStart=false,onTranscript}={}){
 const events=[],enabled=[],commands=[],recorders=[],pending=new Map();let next=0;
 const factory=()=>{if(throwCreate)throw Error('unsupported');const r={starts:0,aborts:0,start(){this.starts++;if(throwStart)throw Error('blocked');},stop(){},abort(){this.aborts++;}};recorders.push(r);return r;};
 const session=createVoiceSession(factory,{onState:(state,message)=>events.push({state,message}),onEnabled:value=>enabled.push(value),onTranscript:text=>{commands.push(text);onTranscript?.(text,session);}},{set:(fn,ms)=>{pending.set(++next,{fn,ms});return next;},clear:id=>pending.delete(id)});
 const result=(texts,index=0)=>({resultIndex:index,results:texts.map(transcript=>({isFinal:true,0:{transcript}}))});
 const tick=()=>{const [id,t]=[...pending.entries()].sort((a,b)=>a[1].ms-b[1].ms)[0]??[];if(!t)return;pending.delete(id);t.fn();};
 return {session,events,enabled,commands,recorders,pending,result,tick,r:()=>recorders.at(-1),last:()=>events.at(-1)};
}
let checks=0;
{
 const f=fixture();f.session.start();assert.equal(f.last().state,'starting');assert.equal(f.r().continuous,true);f.r().onstart();assert.equal(f.last().state,'listening');assert.equal(f.pending.size,0);
 f.r().onresult(f.result(['lights off']));f.r().onresult(f.result(['lights off','lights off'],1));f.r().onresult(f.result(['lights off','lights off'],1));
 assert.deepEqual(f.commands,['lights off','lights off']);assert.equal(f.session.isEnabled(),true);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();f.r().onresult({resultIndex:0,results:[{isFinal:false,0:{transcript:'lights on'}}]});assert.equal(f.commands.length,0);f.r().onend();assert.equal(f.last().state,'starting');f.tick();assert.equal(f.recorders.length,2);f.r().onstart();assert.equal(f.last().state,'listening');checks++;
}
{
 const f=fixture();f.session.start();const oldStart=f.r().onstart,oldResult=f.r().onresult;f.session.stop();oldStart();oldResult(f.result(['lights on']));f.tick();assert.equal(f.session.isEnabled(),false);assert.equal(f.commands.length,0);assert.equal(f.pending.size,0);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();const oldEnd=f.r().onend;oldEnd();f.session.stop();oldEnd();f.tick();assert.equal(f.recorders.length,1);assert.equal(f.pending.size,0);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();const oldResult=f.r().onresult;f.session.pause('speech');oldResult(f.result(['Your lights are on.']));assert.equal(f.commands.length,0);assert.equal(f.session.isEnabled(),true);assert.equal(f.last().state,'speaking');f.session.resume('speech');assert.equal([...f.pending.values()][0].ms,300);f.tick();assert.equal(f.recorders.length,2);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();f.session.pause('speech');f.session.stop();f.session.resume('speech');f.tick();assert.equal(f.recorders.length,1);assert.equal(f.session.isEnabled(),false);checks++;
}
{
 const f=fixture();f.session.pause('speech');f.session.start();assert.equal(f.recorders.length,0);assert.equal(f.last().state,'speaking');f.session.resume('speech');f.tick();assert.equal(f.recorders.length,1);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();f.session.pause('speech');f.session.pause('hidden');f.session.resume('speech');f.tick();assert.equal(f.recorders.length,1);assert.equal(f.last().state,'paused');f.session.resume('hidden');f.tick();assert.equal(f.recorders.length,2);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();f.session.pause('hidden');f.session.stop();f.session.resume('hidden');f.tick();assert.equal(f.recorders.length,1);assert.equal(f.session.isEnabled(),false);checks++;
}
for(const code of ['not-allowed','service-not-allowed','audio-capture','language-not-supported']){
 const f=fixture();f.session.start();const end=f.r().onend;f.r().onerror({error:code});const message=f.last().message;end();f.tick();assert.equal(f.last().state,'error');assert.equal(f.last().message,message);assert.equal(f.pending.size,0);assert.equal(f.session.isEnabled(),false);f.session.start();assert.equal(f.recorders.length,2);checks++;
}
{
 const f=fixture();f.session.start();for(let i=0;i<6;i++){f.r().onstart();f.r().onerror({error:'no-speech'});f.tick();}assert.equal(f.session.isEnabled(),true);assert.equal(f.recorders.length,7);assert(!f.events.some(e=>e.state==='error'));checks++;
}
{
 const f=fixture();f.session.start();for(let i=0;i<4;i++){f.r().onstart();f.r().onerror({error:'network'});f.tick();}assert.equal(f.session.isEnabled(),false);assert.equal(f.recorders.length,4);assert.equal(f.last().state,'error');assert.equal(f.pending.size,0);checks++;
}
{
 const f=fixture();f.session.start();f.tick();assert.equal(f.session.isEnabled(),false);assert.equal(f.last().state,'error');assert.equal(f.pending.size,0);checks++;
}
{
 const f=fixture();f.session.start();f.r().onstart();f.r().onspeechend();assert.equal(f.last().state,'processing');f.tick();f.tick();assert.equal(f.recorders.length,2);checks++;
}
for(const config of [{throwCreate:true},{throwStart:true}]){const f=fixture(config);f.session.start();assert.equal(f.last().state,'error');assert.equal(f.pending.size,0);assert.equal(f.session.isEnabled(),false);checks++;}
{
 const f=fixture();f.session.start();const oldResult=f.r().onresult,oldEnd=f.r().onend;f.session.dispose();const count=f.events.length;oldResult(f.result(['lights on']));oldEnd();f.session.resume('speech');f.session.start();f.tick();assert.equal(f.events.length,count);assert.equal(f.commands.length,0);assert.equal(f.pending.size,0);checks++;
}
{
 const f=fixture({onTranscript:(_,session)=>session.pause('speech')});f.session.start();f.r().onstart();f.r().onresult(f.result(['lights off','AC off']));assert.deepEqual(f.commands,['lights off','AC off']);checks++;
}
console.log(`${checks} continuous voice scenarios passed: repeated commands, silence, recovery, speech echo protection, manual off, hidden tabs, permission errors, and cleanup.`);
const on={lights:true,brightness:100,climate:true,standby:true};
for(const climate of [false,true])for(const standby of [false,true]){
 const off=getHouseLighting({...on,lights:false,climate,standby});assert.equal(off.pointIntensity,0);assert.equal(off.emission,0);assert.equal(off.sun,0);
 const lit=getHouseLighting({...on,climate,standby});assert.equal(lit.pointIntensity,36);assert.equal(lit.emission,3);assert(lit.ambient>off.ambient);
}
const dim=getHouseLighting({...on,brightness:30});assert.equal(dim.level,.3);assert.equal(getHouseLighting({...on,brightness:0}).emission,0);assert.equal(getHouseLighting({...on,brightness:200}).level,1);assert.equal(getHouseLighting({...on,brightness:-10}).level,0);
// Inspect the actual shipped model so future model revisions cannot omit a lighting group.
const glb=fs.readFileSync(new URL('../public/assets/heseos-home.glb',import.meta.url));
const json=JSON.parse(glb.subarray(20,20+glb.readUInt32LE(12)).toString());
const lightIndex=json.materials.findIndex(m=>m.name==='house-warm-light');
const lightMeshIndices=new Set(json.meshes.map((m,i)=>m.primitives.some(p=>p.material===lightIndex)?i:-1));
const lightMeshes=json.nodes.filter(n=>n.mesh!==undefined&&lightMeshIndices.has(n.mesh));
for(const area of ['living-room','room-0-','room-1-','room-2-','garage','architectural-shell','landscape','staircase']){
 assert(lightMeshes.some(m=>m.name?.includes(area)),`Missing lighting in ${area}`);
}
console.log(`Whole-home lighting targets passed; ${lightMeshes.length} lighting meshes covered in the shipped model.`);
