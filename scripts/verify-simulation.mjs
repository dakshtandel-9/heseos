import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const productsJson=fs.readFileSync(new URL('../data/products.json',import.meta.url),'utf8');
const productsSource=fs.readFileSync(new URL('../lib/products.ts',import.meta.url),'utf8');
const productModule=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(productsSource.replace("import data from '../data/products.json';",`const data=${productsJson};`),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const simulationSource=fs.readFileSync(new URL('../lib/simulation-products.ts',import.meta.url),'utf8');
const sim=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(simulationSource.replace("import { FAMILIES } from './products';",`const FAMILIES=${JSON.stringify(productModule.FAMILIES)};`),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const {FITTINGS,INSTALLED_PRODUCTS,UNFITTED_PRODUCTS,ROOM_PLAN,ROOM_TOUR,initialApartmentState,apartmentReducer,apartmentUsage,productState,isInstalledVisible,isRoomControl,isLight,fittedProduct,lightingLevel,roomAtPoint,tourIndexForProduct}=sim;
const start=initialApartmentState();
const visible=state=>INSTALLED_PRODUCTS.filter(p=>isInstalledVisible(p,state));
const assertPlan=state=>{
 assert.equal(visible(state).length,FITTINGS.length,'one physical product per fitting');
 for(const f of FITTINGS)assert.equal(visible(state).filter(p=>p.slot===f.id).length,1,`${f.id} has exactly one active model`);
 for(const r of ROOM_PLAN){
  assert.equal(visible(state).filter(p=>p.room===r.id&&isRoomControl(p)).length,1,`${r.name} has exactly one light control`);
  assert.equal(visible(state).filter(p=>p.room===r.id&&p.kind==='fan').length,r.fan?1:0,`${r.name} has only the planned fan`);
 }
};
assertPlan(start);
assert.equal(new Set(INSTALLED_PRODUCTS.map(p=>p.id)).size,INSTALLED_PRODUCTS.length,'no product belongs to two fittings');
assert.deepEqual([...INSTALLED_PRODUCTS,...UNFITTED_PRODUCTS].map(p=>p.id).sort(),productModule.FAMILIES.map(p=>p.slug).sort(),'every catalogue family is either a compatible fitting option or explicitly not fitted');
for(const p of UNFITTED_PRODUCTS)assert.equal(apartmentReducer(start,{type:'select',id:p.id}),start,'incompatible door products cannot create new geometry');

// Every option replaces the same physical fitting and preserves the circuit and total load.
for(const p of INSTALLED_PRODUCTS){
 const before=apartmentReducer(start,{type:'room-lights',room:p.room,on:true,brightness:35});
 const swapped=apartmentReducer(before,{type:'select',id:p.id});
 assertPlan(swapped);
 assert.equal(fittedProduct(p.slot,swapped).id,p.id);
 assert.deepEqual(swapped.rooms,before.rooms,'replacement does not reset any room');
 assert.deepEqual(apartmentUsage(swapped),apartmentUsage(before),'replacement adds no duplicate power load');
 assert.equal(ROOM_TOUR[tourIndexForProduct(p.id)].stop,p.room,'deep link lands in the matching room');
 const f=FITTINGS.find(f=>f.id===p.slot);
 assert.deepEqual(p.at,f.at,'alternative uses the same mount');assert.equal(p.yaw,f.yaw);
 if(isRoomControl(p)||isLight(p)){
  let next=apartmentReducer(swapped,{type:'power',id:p.id,on:false});
  assert.equal(next.rooms[p.room].lights,false);
  assert.equal(lightingLevel(p.room,next),0);
  for(const r of ROOM_PLAN.filter(r=>r.id!==p.room)){
   assert.deepEqual(next.rooms[r.id],swapped.rooms[r.id],`${p.id} must not switch ${r.name}`);
   assert.equal(lightingLevel(r.id,next),lightingLevel(r.id,swapped),'other room visual lighting is unchanged');
  }
  next=apartmentReducer(next,{type:'level',id:p.id,value:25});
  assert.equal(next.rooms[p.room].brightness,25);assert.equal(next.rooms[p.room].lights,true);
  for(const fixture of visible(next).filter(q=>q.room===p.room&&(isRoomControl(q)||isLight(q))))assert.equal(productState(fixture,next).level,25,'wall control and light share one dimmer value');
  next=apartmentReducer(next,{type:'kelvin',id:p.id,value:5000});
  assert.equal(next.rooms[p.room].kelvin,5000);
  for(const r of ROOM_PLAN.filter(r=>r.id!==p.room))assert.deepEqual(next.rooms[r.id],swapped.rooms[r.id]);
 }
}
let state=apartmentReducer(start,{type:'select',id:'magnetic-touch-panel'});
assert.equal(apartmentReducer(state,{type:'power',id:'touch-panel-series',on:false}),state,'an unfitted control cannot change a room');
state=apartmentReducer(start,{type:'fan',room:'bedroom',speed:5});
assert.equal(state.rooms.bedroom.fanSpeed,5);assert.equal(state.rooms.living.fanSpeed,2);assert.equal(state.rooms.bedroom2.fanSpeed,2);
assert.equal(apartmentReducer(state,{type:'fan',room:'kitchen',speed:5}),state,'no phantom kitchen fan');
state=apartmentReducer(state,{type:'select',id:'elegance-silver-wood'});assert.equal(productState(fittedProduct('bedroom-fan',state),state).level,5);
const dark=apartmentReducer(start,{type:'scene',scene:'away'});
for(const id of ['microwave-motion-sensor','pir-motion-sensor','human-presence-sensor']){
 const configured=apartmentReducer(dark,{type:'select',id}),p=INSTALLED_PRODUCTS.find(p=>p.id===id);
 state=apartmentReducer(configured,{type:'sensor',id,triggered:true});
 assert.equal(state.rooms[p.room].lights,true);
 for(const r of ROOM_PLAN.filter(r=>r.id!==p.room))assert.deepEqual(state.rooms[r.id],configured.rooms[r.id],'sensor events stay in their room');
}
for(const id of ['gas-leak-sensor','smoke-detector']){
 state=apartmentReducer(dark,{type:'sensor',id,triggered:true});
 assert.deepEqual(state.rooms,dark.rooms,'safety alerts must not switch lighting');assert.equal(state.devices[id].triggered,true);
}
state=apartmentReducer(start,{type:'call',id:'smart-doorbell',call:'ringing'});
assert.equal(state.devices['ip-video-door-phone'].call,'ringing','the doorbell calls the fitted monitor');
state=apartmentReducer(state,{type:'select',id:'analog-video-door-phone'});
assert.equal(state.devices['analog-video-door-phone'].call,'ringing','monitor replacement preserves the shared call');
state=apartmentReducer(state,{type:'call',id:'analog-video-door-phone',call:'connected'});
assert.equal(state.devices['smart-doorbell'].call,'connected','answering the monitor answers the same visitor call');
state=apartmentReducer(start,{type:'lock',id:'wooden-door-lock',locked:false});
assert.equal(state.devices['drawer-lock'].locked,true,'bedroom access does not unlock a living room drawer');
state=apartmentReducer(state,{type:'select',id:'screen-door-lock'});
assert.equal(state.devices['screen-door-lock'].locked,false,'lock replacement preserves the physical lock state');
state=apartmentReducer(start,{type:'backup',id:'motion-sensor-t8-tubelight',on:true});
assert.equal(state.rooms.bath.lights,false);assert.equal(lightingLevel('bath',state),.2);
for(const r of ROOM_PLAN.filter(r=>r.id!=='bath'))assert.deepEqual(state.rooms[r.id],start.rooms[r.id]);
state=apartmentReducer(start,{type:'all-lights',on:true,brightness:100});
assert.equal(apartmentUsage(state).lighting,120,'five 24W circuits are counted once, without double-counting fixtures');
assert.equal(apartmentUsage(dark).total,0,'away mode turns off all simulated loads');
assert.ok(Object.values(dark.rooms).every(r=>r.fanSpeed===0));
state=apartmentReducer(dark,{type:'scene',scene:'home'});
assert.equal(state.rooms.kitchen.fanSpeed,0);assert.equal(state.rooms.bath.fanSpeed,0);
state=apartmentReducer(start,{type:'tv',on:false});assert.equal(apartmentUsage(state).tv,0);assert.equal(state.climate,start.climate);
state=apartmentReducer(start,{type:'curtain',value:0});assert.equal(state.curtain,0);
state=apartmentReducer(state,{type:'curtain-kind',value:'blind'});assert.equal(state.curtainKind,'blind');
state=apartmentReducer(state,{type:'curtain',value:100});assert.equal(state.curtain,100);
state=apartmentReducer(start,{type:'temperature',value:18});assert.equal(state.temperature,18);
state=apartmentReducer(start,{type:'threshold',value:500});assert.equal(state.threshold,500);
const visited=[];for(const step of ROOM_TOUR)if(visited.at(-1)!==step.stop)visited.push(step.stop);
assert.deepEqual(visited,ROOM_PLAN.map(r=>r.id),'the tour visits each room contiguously, without catalogue-order jumps');
for(const step of ROOM_TOUR)if(step.fitting)assert.equal(FITTINGS.find(f=>f.id===step.fitting)?.room,step.stop);
for(const [x,z,room]of [[-5.5,1.75,'living'],[-2,1.2,'kitchen'],[-1,-2.5,'bedroom'],[-3,-4.3,'bedroom2'],[-5.4,-.6,'bath'],[-4.4,-2,'living']])assert.equal(roomAtPoint(x,z),room,'rendered lighting zone follows the floor plan');
// The photographed apartment: every fitting has a marker on its own room's picture, inside the frame,
// and every picture the page asks for is on disk.
const scenesSource=fs.readFileSync(new URL('../lib/experience-scenes.ts',import.meta.url),'utf8');
const {ROOM_SCENES,HOME_SCENE}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(scenesSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const inFrame=(p,label)=>assert.ok(p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100,`${label} must sit inside its picture`);
assert.deepEqual(Object.keys(ROOM_SCENES).sort(),ROOM_PLAN.map(r=>r.id).sort(),'every room has a picture');
assert.deepEqual(Object.keys(HOME_SCENE.rooms).sort(),ROOM_PLAN.map(r=>r.id).sort(),'every room has an area on the overhead view');
for(const f of FITTINGS){const pin=ROOM_SCENES[f.room].pins[f.id];assert.ok(pin,`${f.id} needs a marker in the ${f.room} picture`);inFrame(pin,f.id);}
for(const s of Object.values(ROOM_SCENES)){
 for(const id of Object.keys(s.pins))assert.equal(FITTINGS.find(f=>f.id===id)?.room,s.room,`${id} is marked in the ${s.room} picture but fitted elsewhere`);
 for(const src of [s.lit,s.dark,s.thumb,s.window?.lit,s.window?.dark].filter(Boolean))assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)),`${src} is missing`);
}
for(const src of [HOME_SCENE.lit,HOME_SCENE.dark,'/media/experience/home-thumb.webp','/media/experience/tv.webp','/media/experience/visitor.webp'])assert.ok(fs.existsSync(new URL('../public'+src,import.meta.url)),`${src} is missing`);
for(const [id,r] of Object.entries(HOME_SCENE.rooms)){inFrame(r.label,`${id} label`);for(const [x,y] of r.area)inFrame({x,y},`${id} area`);}
console.log(`Simulation verified: ${FITTINGS.length} physical fittings, ${ROOM_PLAN.length} independent light controls, ${INSTALLED_PRODUCTS.length} compatible product options, ${ROOM_TOUR.length} room-ordered tour stops. Isolation, substitutions, sensors, calls and energy accounting passed.`);

assert.equal(sim.lightingCommandTarget('lights off','kitchen'),'kitchen');
assert.equal(sim.lightingCommandTarget('Light 1 off','bedroom'),'living');
assert.equal(sim.lightingCommandTarget('dim bedroom 2 to 30 percent','living'),'bedroom2');
assert.equal(sim.lightingCommandTarget('all kitchen lights off','living'),'kitchen');
assert.equal(sim.lightingCommandTarget('all lights off','living'),'all');
assert.equal(sim.normalizeRoomCommand('dim Light 1 to 30 percent'),'dim lights to 30 percent');

// Validate the actual imported apartment rather than accepting arbitrary wall coordinates.
const THREE=await import('three');
const {NodeIO}=await import('@gltf-transform/core');
const {ALL_EXTENSIONS}=await import('@gltf-transform/extensions');
const draco=(await import('draco3dgltf')).default;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
const model=await io.read(new URL('../public/media/models/apartment-2.glb',import.meta.url).pathname);
const root=new THREE.Group();
for(const node of model.getRoot().listNodes()){
 const mesh=node.getMesh();if(!mesh)continue;
 for(const primitive of mesh.listPrimitives()){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(primitive.getAttribute('POSITION').getArray(),3));
  geometry.setIndex(new THREE.BufferAttribute(primitive.getIndices().getArray(),1));
  const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({side:primitive.getMaterial().getDoubleSided()?THREE.DoubleSide:THREE.FrontSide}));
  mesh.applyMatrix4(new THREE.Matrix4().fromArray(node.getWorldMatrix()));root.add(mesh);
 }
}
root.updateMatrixWorld(true);
const apartmentSource=fs.readFileSync(new URL('../lib/apartments.ts',import.meta.url),'utf8');
const {APARTMENTS}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(apartmentSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
assert.equal(APARTMENTS.length,1,'only Apartment 2 remains');
const home=APARTMENTS[0],ray=new THREE.Raycaster(),eye=home.floorY+1.6;
const views=home.stops.map(s=>({name:s.name,at:s.at,room:s.id}));
for(const f of FITTINGS){
 if(f.mount==='wall'){
  const normal=new THREE.Vector3(Math.sin(f.yaw),0,Math.cos(f.yaw));
  ray.set(new THREE.Vector3(...f.at).addScaledVector(normal,.3),normal.clone().negate());ray.far=.6;
  assert.ok(ray.intersectObject(root,true)[0],`${f.id} must mount on an existing apartment surface`);
 }
 if(f.view)views.push({name:f.id,at:f.view,room:f.room});
}
views.push({name:'TV close view',at:home.appliances.tv.view,room:'living'},{name:'AC close view',at:home.appliances.ac.view,room:'living'});
for(const view of views){
 assert.equal(roomAtPoint(...view.at),view.room,`${view.name} must stay in its own room`);
 const pos=new THREE.Vector3(view.at[0],eye,view.at[1]);
 ray.set(pos,new THREE.Vector3(0,-1,0));ray.far=2;
 const floor=ray.intersectObject(root,true)[0];
 assert.ok(floor&&floor.point.y<=home.floorY+.25,`${view.name} must be above open floor, not furniture`);
 for(let i=0;i<8;i++){
  ray.set(pos,new THREE.Vector3(Math.cos(i*Math.PI/4),0,Math.sin(i*Math.PI/4)));ray.far=.16;
  assert.equal(ray.intersectObject(root,true).length,0,`${view.name} must have camera clearance at eye height`);
 }
}
root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
console.log(`Apartment geometry verified: all wall fittings have a real mounting surface; ${views.length} camera positions have floor support and eye-height clearance.`);
