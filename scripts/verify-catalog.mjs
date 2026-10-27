import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
// Transpile lib modules in dependency order, pointing relative imports at the already-loaded modules.
const urls={};
async function load(name){
 let code=ts.transpileModule(fs.readFileSync(new URL(`../lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 code=code.replace(/from '\.\/(\w[\w-]*)'/g,(_,dep)=>`from '${urls[dep]}'`);
 urls[name]='data:text/javascript;base64,'+Buffer.from(code).toString('base64');
 return import(urls[name]);
}
await load('energy');
const catalog=await load('catalog'),devices=await load('devices'),{APARTMENTS}=await load('apartments');
let checks=0;const check=(...args)=>{assert.ok(...args);checks++;};

// Packages: every combination exists, sells below MRP, and each tier adds to the one before it.
for(const type of catalog.PACKAGE_TYPES)for(const bhk of catalog.BHKS){
 const tiers=catalog.TIERS.map(t=>catalog.getPackage(type.id,bhk,t.id));
 for(const p of tiers){check(p.price>0&&p.price<p.mrp,`${p.id} priced below MRP`);check(p.items.some(i=>i.name===type.switchItem),`${p.id} includes switches`);check(catalog.parsePackageId(p.id)?.price===p.price,`${p.id} round-trips`);}
 check(tiers[0].price<tiers[1].price&&tiers[1].price<tiers[2].price,`${type.id} ${bhk} BHK tiers rise in price`);
 check(tiers[1].items.some(i=>i.name==='IR Blaster')&&tiers[2].items.some(i=>i.name==='Smart Plug'),`${type.id} ${bhk} BHK tiers add components`);
}
assert.deepEqual(catalog.getPackage('touch-panel',2,'premium').items,[{name:'6M Glass Touch Panel',qty:3},{name:'IR Blaster',qty:3},{name:'Smart Plug',qty:2}]);checks++;
assert.equal(catalog.getPackage('retrofit',1,'starter').price,11699);checks++;

// Bag lines: products with a price and valid package ids resolve; anything else is dropped.
check(catalog.resolveBagLine({id:'smart-plug',qty:2})?.price===3500);
check(catalog.resolveBagLine({id:'ir-blaster',qty:1})?.mrp===4584);
check(catalog.resolveBagLine({id:'touch-panel',qty:1})===null,'touch panels are only sold in packages');
for(const bad of ['pkg:touch-panel:4:premium','pkg:nope:1:starter','pkg:retrofit:1:gold','unknown'])check(catalog.resolveBagLine({id:bad,qty:1})===null,bad);
check(catalog.formatINR(50699).replace(/\s/g,'')==='₹50,699');

// Build your smart home.
assert.equal(catalog.recommendTier([]),'starter');assert.equal(catalog.recommendTier(['climate']),'standard');assert.equal(catalog.recommendTier(['energy']),'premium');assert.equal(catalog.recommendTier(['climate','energy']),'premium');checks+=4;

// Simulation commands: device questions focus a device; everything else falls through to the energy parser.
for(const [input,expected] of [['show me the plug',{type:'focus',device:'smart-plug'}],['where is the IR blaster',{type:'focus',device:'ir-blaster'}],['take me to the touch panel',{type:'focus',device:'touch-panel'}],['turn the AC off',{type:'climate',on:false}],['plug off',{type:'standby',on:false}],['dim to 30%',{type:'brightness',value:30}],['away mode',{type:'scene',scene:'away'}]]){assert.deepEqual(devices.parseSimulationCommand(input),expected,input);checks++;}
check(devices.SCENES.find(s=>s.id==='away').power.lights===false);
check(devices.lightLevel({lights:true,brightness:30,climate:true,standby:true})===.3&&devices.lightLevel({lights:false,brightness:80,climate:true,standby:true})===0);

// Apartments: links, start stops and device rooms all point at real stops; every device and appliance is placed.
for(const a of APARTMENTS){
 const ids=new Set(a.stops.map(s=>s.id));
 check(ids.size===a.stops.length&&ids.has(a.start),`${a.name} stops`);
 for(const [x,y] of a.links)check(ids.has(x)&&ids.has(y)&&x!==y,`${a.name} link ${x}-${y}`);
 for(const d of devices.DEVICES){const p=a.devices[d.id];check(p&&p.at.length===3&&p.view.length===2&&p.seenFrom.every(s=>ids.has(s)),`${a.name} ${d.id}`);}
 check(a.appliances.ac&&a.appliances.tv&&a.lamps.length>0,`${a.name} appliances`);
 check(fs.existsSync(new URL(`../public${a.model}`,import.meta.url)),`${a.name} model file`);
}
console.log(`${checks} catalog, package, bag, command and apartment checks passed.`);
