import * as THREE from 'three';
import { CircleGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, TorusGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { InstalledProduct } from './simulation-products';
// Illustrative stand-ins for the three components and the appliances they control, built at real-world scale (metres).
// They are replaced by approved product GLBs when those exist.
export type Model={group:THREE.Group;update:(on:boolean,level:number,time:number,dt:number)=>void;pulse?:()=>void;dispose:()=>void};
export type ProductVisualState={on:boolean;level:number;kelvin:number;locked:boolean;triggered:boolean;call:'idle'|'ringing'|'connected';backup:boolean;reading:number;threshold:number;progress:number;curtainKind:'curtain'|'blind';temperature:number};
export type InstalledModel=Model&{setState?:(state:ProductVisualState)=>void};
const AMBER=new THREE.Color('#ffb35c'),IDLE=new THREE.Color('#3a3a3a');
function tracked(){
 const disposables:{dispose:()=>void}[]=[];
 const keep=<T extends {dispose:()=>void}>(item:T)=>{disposables.push(item);return item;};
 return {keep,dispose:()=>disposables.forEach(d=>d.dispose())};
}
function mesh(group:THREE.Object3D,geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);group.add(m);return m;}

// 4M landscape panel: black glass, champagne bezel, four touch rings that glow with the lights.
export function touchPanel():Model{
 const t=tracked(),group=new THREE.Group();
 const bezel=t.keep(new THREE.MeshStandardMaterial({color:'#c9a27a',metalness:.85,roughness:.28}));
 const glass=t.keep(new THREE.MeshStandardMaterial({color:'#040404',metalness:.3,roughness:.06}));
 const ring=t.keep(new THREE.MeshBasicMaterial({color:IDLE,toneMapped:false}));
 mesh(group,t.keep(new RoundedBoxGeometry(.146,.086,.012,3,.004)),bezel,0,0,.006);
 mesh(group,t.keep(new RoundedBoxGeometry(.14,.08,.004,2,.0015)),glass,0,0,.0125);
 const torus=t.keep(new THREE.TorusGeometry(.0062,.0007,8,40));
 for(const [x,y] of [[-.022,.016],[-.024,-.016],[.022,.014],[.02,-.017]])mesh(group,torus,ring,x,y,.0148);
 const color=new THREE.Color();
 return {group,update:(on,level)=>{ring.color.copy(color.copy(IDLE).lerp(AMBER,on?.35+.65*level:0));},dispose:t.dispose};
}
// 16A plug: white body with a socket face and a status LED.
export function smartPlug():Model{
 const t=tracked(),group=new THREE.Group();
 const body=t.keep(new THREE.MeshStandardMaterial({color:'#f2f1ec',roughness:.45}));
 const face=t.keep(new THREE.MeshStandardMaterial({color:'#e4e3de',roughness:.5}));
 const hole=t.keep(new THREE.MeshStandardMaterial({color:'#0b0b0b',roughness:.9}));
 const led=t.keep(new THREE.MeshBasicMaterial({color:'#1e2a1e',toneMapped:false}));
 mesh(group,t.keep(new RoundedBoxGeometry(.07,.1,.045,3,.012)),body,0,0,.0225);
 mesh(group,t.keep(new RoundedBoxGeometry(.05,.055,.004,2,.006)),face,0,.012,.0455);
 const pin=t.keep(new THREE.CylinderGeometry(.0042,.0042,.002,16));pin.rotateX(Math.PI/2);
 for(const [x,y] of [[0,.028],[0,.017],[-.012,.003],[.012,.003]])mesh(group,pin,hole,x,y,.0476);
 mesh(group,t.keep(new THREE.SphereGeometry(.0022,10,8)),led,-.02,-.035,.0452);
 return {group,update:on=>{led.color.set(on?'#43ff6b':'#1e2a1e');},dispose:t.dispose};
}
// IR Blaster: a small black USB puck with the orange Heseos arcs; a ring pulses when it sends a command.
export function irBlaster():Model{
 const t=tracked(),group=new THREE.Group();
 const body=t.keep(new THREE.MeshStandardMaterial({color:'#0d0d0d',metalness:.1,roughness:.22}));
 const logo=t.keep(new THREE.MeshBasicMaterial({color:'#f05a28',toneMapped:false}));
 const wave=t.keep(new THREE.MeshBasicMaterial({color:'#ff9a5c',transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
 mesh(group,t.keep(new RoundedBoxGeometry(.05,.045,.045,3,.012)),body,0,.0225,0);
 const arc=t.keep(new THREE.TorusGeometry(.009,.0012,6,24,Math.PI));
 for(const s of [1,.6]){const m=mesh(group,arc,logo,0,.0225,.0228);m.scale.setScalar(s);}
 const ringMesh=mesh(group,t.keep(new THREE.RingGeometry(.06,.068,48)),wave,0,.0225,.03);
 let since=Infinity;ringMesh.visible=false;
 return {group,pulse:()=>{since=0;},update:(_on,_level,_time,dt)=>{since+=dt;const k=Math.min(1,since/1.1);ringMesh.visible=since<1.1;ringMesh.scale.setScalar(1+k*14);wave.opacity=.55*(1-k);},dispose:t.dispose};
}
// Wall-mounted split AC with a temperature display and visible airflow when running.
export function airConditioner():Model{
 const t=tracked(),group=new THREE.Group();
 const body=t.keep(new THREE.MeshStandardMaterial({color:'#f4f4f1',roughness:.35}));
 const vane=t.keep(new THREE.MeshStandardMaterial({color:'#d9d9d5',roughness:.4}));
 mesh(group,t.keep(new RoundedBoxGeometry(.92,.3,.22,4,.05)),body,0,0,.11);
 const flap=mesh(group,t.keep(new THREE.BoxGeometry(.78,.05,.008)),vane,0,-.125,.21);
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=64;
 const ctx=canvas.getContext('2d')!;ctx.fillStyle='#bfe7ff';ctx.font='600 40px Inter, Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('24°',64,34);
 const tex=t.keep(new THREE.CanvasTexture(canvas));tex.colorSpace=THREE.SRGBColorSpace;
 const display=t.keep(new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0,toneMapped:false}));
 mesh(group,t.keep(new THREE.PlaneGeometry(.08,.04)),display,.3,.02,.2215);
 const COUNT=160,positions=new Float32Array(COUNT*3),seeds=new Float32Array(COUNT);
 for(let i=0;i<COUNT;i++)seeds[i]=Math.random();
 const flowGeo=t.keep(new THREE.BufferGeometry());flowGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const dot=document.createElement('canvas');dot.width=dot.height=32;
 const dctx=dot.getContext('2d')!,grad=dctx.createRadialGradient(16,16,0,16,16,16);grad.addColorStop(0,'#fff');grad.addColorStop(1,'#fff0');dctx.fillStyle=grad;dctx.fillRect(0,0,32,32);
 const dotTex=t.keep(new THREE.CanvasTexture(dot));
 const flowMat=t.keep(new THREE.PointsMaterial({color:'#bfe7ff',map:dotTex,size:.022,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
 const flow=new THREE.Points(flowGeo,flowMat);flow.frustumCulled=false;group.add(flow);
 let power=0;
 return {group,update:(on,_level,time,dt)=>{
  power+=((on?1:0)-power)*Math.min(1,dt*3);
  flap.rotation.x=-power*.7;display.opacity=power;flowMat.opacity=.28*power;
  for(let i=0;i<COUNT;i++){const k=(seeds[i]+time*.35)%1,s=seeds[i]*997;positions[i*3]=(Math.sin(s)*.38);positions[i*3+1]=-.14-k*.7+Math.sin(s*3+time)*.02;positions[i*3+2]=.22+k*.8;}
  flowGeo.attributes.position.needsUpdate=true;
 },dispose:t.dispose};
}
// TV on the Smart Plug: the screen shows ambient art while powered.
// onConsole: origin on the floor under a TV on a media console. screen: only a glowing screen of [width, height],
// laid over a TV that is already part of the apartment model. Otherwise: a wall-mounted TV centred on the origin.
export function television({onConsole=false,screen:screenSize}:{onConsole?:boolean;screen?:[number,number]}={}):Model{
 const t=tracked(),group=new THREE.Group(),screenGroup=new THREE.Group();group.add(screenGroup);
 const frame=t.keep(new THREE.MeshStandardMaterial({color:'#0a0a0a',metalness:.4,roughness:.3}));
 if(onConsole&&!screenSize){
  const wood=t.keep(new THREE.MeshStandardMaterial({color:'#3b2a1f',roughness:.6}));
  mesh(group,t.keep(new THREE.BoxGeometry(1.5,.45,.4)),wood,0,.225,0);
  mesh(group,t.keep(new THREE.BoxGeometry(.3,.03,.18)),frame,0,.465,0);
  mesh(group,t.keep(new THREE.BoxGeometry(.05,.06,.03)),frame,0,.5,0);
  screenGroup.position.set(0,.885,-.02);
 }
 if(!screenSize)mesh(screenGroup,t.keep(new THREE.BoxGeometry(1.23,.71,.04)),frame,0,0,.02);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=288;
 const ctx=canvas.getContext('2d')!;const g=ctx.createLinearGradient(0,0,512,288);g.addColorStop(0,'#2b1408');g.addColorStop(.55,'#c4541f');g.addColorStop(1,'#f6b25c');ctx.fillStyle=g;ctx.fillRect(0,0,512,288);
  const tex=t.keep(new THREE.CanvasTexture(canvas));tex.colorSpace=THREE.SRGBColorSpace;
 const still=new Image();still.onload=()=>{canvas.width=still.naturalWidth;canvas.height=still.naturalHeight;ctx.drawImage(still,0,0);tex.needsUpdate=true;};still.src='/media/experience/tv.webp';
 const screen=t.keep(new THREE.MeshBasicMaterial({map:tex,color:'#000',toneMapped:false}));
 const [w,h]=screenSize??[1.2,.675];
 mesh(screenGroup,t.keep(new THREE.PlaneGeometry(w,h)),screen,0,0,screenSize?0:.0405);
 const led=t.keep(new THREE.MeshBasicMaterial({color:'#200',toneMapped:false}));
 mesh(screenGroup,t.keep(new THREE.PlaneGeometry(.012,.004)),led,w/2-.04,-h/2-.0075,screenSize?.002:.0405);
 const off=new THREE.Color('#050505'),on=new THREE.Color('#ffffff');let power=0;
 return {group,update:(isOn,_level,_time,dt)=>{power+=((isOn?1:0)-power)*Math.min(1,dt*4);screen.color.copy(off).lerp(on,power);led.color.set(isOn?'#33c3ff':'#200');},dispose:t.dispose};
}

// Parametric models used by the planned apartment fittings and their replacement options.
// These are deliberately native Three.js objects so their controls, status lights, blades,
// curtain and lock mechanisms respond in the apartment instead of being static catalogue cards.
const productGlow=(kelvin:number)=>{
 const warm=new THREE.Color('#ffad5b'),cool=new THREE.Color('#d6e6ff');
 return warm.lerp(cool,THREE.MathUtils.clamp((kelvin-2700)/3800,0,1));
};
const makeDisplay=(width:number,height:number,label:string)=>{
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=320;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const redraw=(title:string,subtitle:string,color='#f5ab48')=>{
  const c=canvas.getContext('2d')!;const bg=c.createLinearGradient(0,0,512,320);bg.addColorStop(0,'#101824');bg.addColorStop(1,'#172339');c.fillStyle=bg;c.fillRect(0,0,512,320);
  c.fillStyle=color;c.font='600 22px Inter, Arial, sans-serif';c.fillText('HESEOS  ·  HOME',28,42);
  c.fillStyle='#ffffff';c.font='600 31px Inter, Arial, sans-serif';c.fillText(title,28,126);
  c.fillStyle='#b9c4d5';c.font='400 19px Inter, Arial, sans-serif';c.fillText(subtitle,28,174);
  c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.roundRect(28,216,456,64,12);c.stroke();
  c.fillStyle='#d9e1ec';c.font='500 18px Inter, Arial, sans-serif';c.fillText(label,46,256);texture.needsUpdate=true;
 };
 redraw('Welcome home','All rooms are connected');
 const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
 return {texture,material,redraw};
};
const pbox=(t:ReturnType<typeof tracked>,group:THREE.Object3D,material:THREE.Material,w:number,h:number,d:number,x=0,y=0,z=0,r=.008)=>mesh(group,t.keep(new RoundedBoxGeometry(w,h,d,3,r)),material,x,y,z);

export function apartmentProduct(spec:InstalledProduct):InstalledModel{
 const t=tracked(),group=new THREE.Group(),main=t.keep(new THREE.MeshStandardMaterial({color:spec.finish??'#e9e7e1',roughness:.38,metalness:.12})),edge=t.keep(new THREE.MeshStandardMaterial({color:spec.finish??'#c79a6b',roughness:.24,metalness:.72})),dark=t.keep(new THREE.MeshStandardMaterial({color:'#101113',roughness:.24,metalness:.32})),glass=t.keep(new THREE.MeshStandardMaterial({color:'#030405',roughness:.1,metalness:.24})),indicator=t.keep(new THREE.MeshBasicMaterial({color:'#65717e',toneMapped:false}));
 let powered=1,open=0,spin:THREE.Group|null=null,act:((state:ProductVisualState)=>void)|undefined;const dispose=t.dispose;
 const setIndicator=(on:boolean,color='#ffa43c')=>indicator.color.set(on?color:'#4e5862');
 const drawScreen=(w:number,h:number,label:string,kind='screen')=>{const display=makeDisplay(w,h,label);t.keep(display.texture);t.keep(display.material);const m=mesh(group,t.keep(new THREE.PlaneGeometry(w,h)),display.material,0,0,.035);return {m,redraw:display.redraw};};
 if(spec.kind==='panel'||spec.kind==='modular'||spec.kind==='screen'){
  const w=spec.kind==='screen'?.26:spec.kind==='modular'?.24:.19,h=spec.kind==='screen'?.27:.19;
  pbox(t,group,edge,w+.018,h+.018,.025,0,0,.005,.012);pbox(t,group,spec.kind==='screen'?dark:glass,w,h,.012,0,0,.02,.008);
  if(spec.kind==='screen'){
   const display=drawScreen(.205,.145,spec.detail);const knob=t.keep(new THREE.MeshStandardMaterial({color:'#d1a76a',metalness:.85,roughness:.22}));
   mesh(group,t.keep(new THREE.CylinderGeometry(.024,.024,.018,32)),knob,.08,-.097,.036).rotation.x=Math.PI/2;
   act=s=>{display.redraw(s.on?'Welcome home':'Lights off',`${s.level}% · ${s.reading} W`);setIndicator(s.on);};
  }else{
   const count=spec.kind==='modular'?4:spec.id==='touch-panel-series'||spec.id==='edge-panel-series'?4:spec.id==='bezzel-panel-series'?4:2;
   const ring=t.keep(new THREE.MeshBasicMaterial({color:'#76899b',toneMapped:false})),torus=t.keep(new THREE.TorusGeometry(.009,.0014,8,24));
   for(let i=0;i<count;i++){
    const cols=count>2?2:1,rows=Math.ceil(count/cols),x=(i%cols-(cols-1)/2)*.045,y=((rows-1)/2-Math.floor(i/cols))*.046;
    mesh(group,t.keep(new CircleGeometry(.016,24)),dark,x,y,.027);
    mesh(group,torus,ring,x,y,.029);
   }
   act=s=>{ring.color.set(productGlow(s.kelvin).getHex());ring.color.lerp(new THREE.Color('#35424e'),s.on?0:.86);};
  }
 }else if(spec.kind==='retrofit'){
  pbox(t,group,dark,.16,.1,.035);const pcb=t.keep(new THREE.MeshStandardMaterial({color:'#1d6248',roughness:.66}));pbox(t,group,pcb,.14,.08,.009,0,0,.023);
  const relay=t.keep(new THREE.MeshStandardMaterial({color:'#eee8dc'}));for(let i=0;i<3;i++)pbox(t,group,relay,.028,.028,.014,-.045+i*.045,0,.037,.004);
  mesh(group,t.keep(new SphereGeometry(.005,10,8)),indicator,.055,.027,.035);act=s=>setIndicator(s.on);
 }else if(spec.kind==='plug'){
  const body=t.keep(new RoundedBoxGeometry(.086,.12,.05,4,.014)),frame=t.keep(new MeshStandardMaterial({color:'#f4f3ef',roughness:.3}));mesh(group,body,frame,0,0,.024);
  pbox(t,group,glass,.066,.076,.006,0,0,.052,.006);const ring=t.keep(new THREE.MeshBasicMaterial({color:'#56616d',toneMapped:false})),torus=t.keep(new THREE.TorusGeometry(.018,.002,8,32));mesh(group,torus,ring,0,.001,.058);
  act=s=>{ring.color.copy(s.on?new THREE.Color('#51d7a0'):new THREE.Color('#59626d'));};
 }else if(spec.kind==='ir'){
  pbox(t,group,dark,.066,.043,.05,0,.022,.022,.012);const arc=t.keep(new THREE.MeshBasicMaterial({color:'#f05a28',toneMapped:false})),torus=t.keep(new THREE.TorusGeometry(.012,.0017,8,28,Math.PI));mesh(group,torus,arc,0,.025,.05).rotation.z=Math.PI;
  const wave=t.keep(new THREE.MeshBasicMaterial({color:'#ffac64',transparent:true,opacity:.38,side:THREE.DoubleSide,toneMapped:false}));const ring=mesh(group,t.keep(new THREE.RingGeometry(.022,.027,32)),wave,0,.025,.053);ring.visible=false;
  let pulse=0;act=s=>{powered=s.on?1:0;};return {group,update:(on,_l,time,dt)=>{powered+=( (on?1:0)-powered)*Math.min(1,dt*4);ring.visible=on;pulse+=dt;ring.scale.setScalar(1+(Math.sin(pulse*2)+1)*.12);},pulse:()=>{pulse=0;},setState:s=>act?.(s),dispose};
 }else if(spec.kind==='meter'){
  pbox(t,group,main,.32,.42,.05,0,0,-.025,.012);
  pbox(t,group,edge,.21,.29,.055,0,0,.012,.018);pbox(t,group,dark,.18,.25,.025,0,0,.045,.012);
  const display=drawScreen(.15,.11,'Energy monitor');display.m.position.z=.065;act=s=>display.redraw(`${s.reading} W`,s.reading>s.threshold?'Threshold alert':'Live apartment load',s.reading>s.threshold?'#ff5858':'#f5ab48');
 }else if(spec.kind==='curtain'){
  const railMat=t.keep(new THREE.MeshStandardMaterial({color:'#b5b1aa',metalness:.82,roughness:.25}));mesh(group,t.keep(new CylinderGeometry(.014,.014,1.48,16)),railMat,0,.02,0).rotation.z=Math.PI/2;
  const fabric=t.keep(new THREE.MeshStandardMaterial({color:'#d8ccbc',roughness:.9,side:THREE.DoubleSide})),panels:THREE.Mesh[]=[];
  for(const sign of [-1,1]){const g=new THREE.PlaneGeometry(.72,1.78,16,1),cloth=mesh(group,t.keep(g),fabric,sign*.37,-.91,.012);cloth.rotation.y=sign<0?0:Math.PI;panels.push(cloth);}
  const blind=t.keep(new THREE.MeshStandardMaterial({color:'#c5c4bf',roughness:.86,side:THREE.DoubleSide})),blindSheet=mesh(group,t.keep(new THREE.PlaneGeometry(1.44,1.78,20,1)),blind,0,-.91,.014);blindSheet.visible=false;
  const roll=t.keep(new THREE.MeshStandardMaterial({color:'#aaa69d',metalness:.4,roughness:.45}));mesh(group,t.keep(new CylinderGeometry(.035,.035,1.46,20)),roll,0,.025,0).rotation.z=Math.PI/2;
  pbox(t,group,edge,.09,.04,.045,0,.018,.038,.01);
  act=s=>{open=s.progress;const isBlind=s.curtainKind==='blind';panels.forEach((p,i)=>{p.visible=!isBlind;p.scale.x=1-.8*open;p.position.x=(i===0?-1:1)*(.36+.288*open);});blindSheet.visible=isBlind&&open<1;blindSheet.scale.y=1-open;blindSheet.position.y=-.02-.89*(1-open);};
 }else if(spec.kind==='lock'&&spec.id==='drawer-lock'){
  pbox(t,group,edge,.052,.052,.018,0,0,.012,.012);
  mesh(group,t.keep(new CircleGeometry(.016,32)),glass,0,0,.023);
  const status=t.keep(new MeshBasicMaterial({color:'#49bfff',toneMapped:false}));
  mesh(group,t.keep(new TorusGeometry(.019,.0015,8,32)),status,0,0,.024);
  act=s=>{status.color.set(s.locked?'#49bfff':'#59e3a0');};
 }else if(spec.kind==='lock'){
  let hardware:THREE.Group=group,door:THREE.Group|null=null;
  if(spec.id==='sliding-door-lock'){
   door=new THREE.Group();group.add(door);hardware=door;
   const frame=t.keep(new THREE.MeshStandardMaterial({color:'#aeb5bb',metalness:.72,roughness:.28})),pane=t.keep(new THREE.MeshStandardMaterial({color:'#b3d3df',metalness:.12,roughness:.1,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));
   mesh(door,t.keep(new THREE.PlaneGeometry(1.15,1.9)),pane,0,0,-.016);
   pbox(t,door,frame,1.24,.035,.042,0,.98,0,.006);pbox(t,door,frame,1.24,.035,.042,0,-.98,0,.006);
   for(const x of [-.6,.6])pbox(t,door,frame,.04,1.98,.05,x,0,0,.006);
   const seam=pbox(t,door,frame,.018,1.9,.02,0,0,.012,.004);seam.material=dark;
  }
  pbox(t,hardware,dark,.094,.31,.037,0,0,.01,.018);pbox(t,hardware,edge,.083,.29,.018,0,0,.035,.014);
  const face=t.keep(new THREE.MeshStandardMaterial({color:'#121317',metalness:.42,roughness:.22}));pbox(t,hardware,face,.067,.27,.012,0,0,.049,.011);
  for(let i=0;i<9;i++)mesh(hardware,t.keep(new CircleGeometry(.0045,16)),indicator,(i%3-.95)*.017,.055-Math.floor(i/3)*.022,.057);
  const lens=t.keep(new THREE.MeshBasicMaterial({color:'#49bfff',toneMapped:false}));mesh(hardware,t.keep(new CircleGeometry(.009,20)),lens,0,.106,.058);
  const leverHub=mesh(hardware,t.keep(new CylinderGeometry(.016,.016,.012,24)),edge,0,-.038,.068);leverHub.rotation.x=Math.PI/2;
  const lever=new THREE.Group();lever.position.set(0,-.038,.068);hardware.add(lever);pbox(t,lever,edge,.115,.016,.022,.061,0,0,.007);
  const bolt=pbox(t,hardware,edge,.04,.018,.024,-.062,-.1,.046,.004);
  act=s=>{lever.rotation.z=s.locked?0:-.16;bolt.position.x=s.locked?-.062:-.042;lens.color.set(s.locked?'#49bfff':'#59e3a0');if(door)door.position.x=s.locked?0:.92;};
 }else if(spec.kind==='intercom'||spec.kind==='doorbell'){
  const doorbell=spec.kind==='doorbell',w=doorbell?.105:.185,h=doorbell?.2:.285;pbox(t,group,dark,w+.016,h+.016,.035,0,0,.01,.014);pbox(t,group,edge,w,h,.018,0,0,.028,.01);
  const display=drawScreen(doorbell?.07:.15,doorbell?.08:.17,'Entrance camera');display.m.position.z=.05;
  const lens=t.keep(new MeshBasicMaterial({color:'#101b30',toneMapped:false}));mesh(group,t.keep(new SphereGeometry(doorbell?.008:.011,16,12)),lens,0,h*.34,.052);
  const button=t.keep(new MeshBasicMaterial({color:'#7e9aaa',toneMapped:false})),torus=t.keep(new TorusGeometry(.012,.002,8,24));mesh(group,torus,button,0,-h*.35,.052);
  let last='';act=s=>{const value=`${s.call}:${s.triggered}`;if(value===last)return;last=value;display.redraw(s.call==='ringing'?'Visitor calling':s.call==='connected'?'Talk connected':'Welcome home',s.call==='ringing'?'Tap Answer to open the call':'Simulated entrance camera',s.call==='ringing'?'#ff5858':'#f5ab48');button.color.set(s.call==='ringing'?'#ff5353':s.call==='connected'?'#49cf9b':'#758899');};
 }else if(spec.kind==='sensor'){
  const gas=spec.id==='gas-leak-sensor',screen=gas?drawScreen(.09,.06,'Gas monitor'):null,base=t.keep(new MeshStandardMaterial({color:'#f0eee8',roughness:.42}));
  if(spec.mount==='ceiling'){
   mesh(group,t.keep(new CylinderGeometry(.07,.07,.025,32)),base,0,.02,0);
  mesh(group,t.keep(new SphereGeometry(.061,32,16,0,Math.PI*2,Math.PI/2,Math.PI/2)),glass,0,-.005,0);
   const ring=t.keep(new THREE.MeshBasicMaterial({color:'#507d69',toneMapped:false}));mesh(group,t.keep(new TorusGeometry(.064,.0025,8,32)),ring,0,.02,0);
   act=s=>{ring.color.set(s.triggered?'#ff4848':'#51c398');};
  }else{
   pbox(t,group,base,.115,.13,.055,0,0,.012,.014);mesh(group,t.keep(new CircleGeometry(.033,32)),dark,0,.027,.043);
   const lens=t.keep(new MeshBasicMaterial({color:'#728ca5',toneMapped:false}));mesh(group,t.keep(new CircleGeometry(.018,24)),lens,0,.027,.046);
   if(screen){screen.m.position.z=.047;act=s=>screen.redraw(s.triggered?'GAS DETECTED':'GAS MONITOR',s.triggered?'Alert sent to your phone':'Sensor is monitoring',s.triggered?'#ff5858':'#f5ab48');}
   else act=s=>{setIndicator(s.triggered,s.triggered?'#ff5858':'#ffa43c');lens.color.set(s.triggered?'#ff5858':'#728ca5');};
  }
 }else if(spec.kind==='downlight'){
  const can=t.keep(new THREE.CylinderGeometry(.072,.067,.09,40,1,true)),white=t.keep(new THREE.MeshStandardMaterial({color:spec.finish??'#f1f0ec',metalness:.25,roughness:.25,side:THREE.DoubleSide}));mesh(group,can,white,0,-.035,0);
  const trim=mesh(group,t.keep(new TorusGeometry(.071,.008,12,48)),edge,0,0,0);trim.rotation.x=Math.PI/2;
  const lampMat=t.keep(new THREE.MeshBasicMaterial({color:'#fff0d9',toneMapped:false})),lamp=mesh(group,t.keep(new CircleGeometry(.047,32)),lampMat,0,-.009,.003);lamp.rotation.x=Math.PI/2;
  const point=new THREE.PointLight('#ffdeb0',0,4,2);point.position.set(0,-.2,0);group.add(point);
  act=s=>{const color=productGlow(s.kelvin);lampMat.color.copy(color);point.color.copy(color);point.intensity=s.on?Math.max(.05,s.level/32):0;};
 }else if(spec.kind==='tube'){
  pbox(t,group,edge,1.05,.065,.055,0,0,0,.018);const diffuser=t.keep(new MeshStandardMaterial({color:'#fff1d4',emissive:'#ffdfa2',emissiveIntensity:.05,roughness:.27}));pbox(t,group,diffuser,.98,.037,.03,0,0,.018,.016);
  const point=new THREE.PointLight('#ffe0b4',0,4,2);point.position.set(0,-.3,.04);group.add(point);
  act=s=>{diffuser.emissive.copy(productGlow(s.kelvin));diffuser.emissiveIntensity=s.on&&!s.backup?.65:.04;point.intensity=s.on?Math.max(.08,s.level/35):0;};
 }else if(spec.kind==='fan'){
  const canopy=t.keep(new MeshStandardMaterial({color:spec.finish??'#c7a05c',metalness:.78,roughness:.24}));mesh(group,t.keep(new CylinderGeometry(.16,.11,.04,32)),canopy,0,.006,0);
  const downrod=t.keep(new MeshStandardMaterial({color:'#242424',metalness:.7,roughness:.28}));mesh(group,t.keep(new CylinderGeometry(.018,.018,.12,16)),downrod,0,-.075,0);
  spin=new THREE.Group();spin.position.y=-.14;group.add(spin);const hubmat=canopy;mesh(spin,t.keep(new SphereGeometry(.085,32,20)),hubmat,0,0,0);
  const bladeMat=t.keep(new MeshStandardMaterial({color:spec.finish??'#403931',metalness:.12,roughness:.38}));
  for(let i=0;i<3;i++){
   const blade=new THREE.Shape();blade.moveTo(.055,.035);blade.quadraticCurveTo(.42,.22,.67,.16);blade.quadraticCurveTo(.78,.08,.67,-.08);blade.quadraticCurveTo(.4,-.1,.055,-.035);blade.closePath();
   const geometry=t.keep(new THREE.ExtrudeGeometry(blade,{depth:.014,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.008,bevelThickness:.005}));const bladePivot=new THREE.Group();bladePivot.rotation.y=i*Math.PI*2/3;spin.add(bladePivot);const fanBlade=mesh(bladePivot,geometry,bladeMat,0,-.025,-.007);fanBlade.rotation.x=-Math.PI/2;
   const trim=t.keep(new THREE.MeshStandardMaterial({color:'#c7a05c',metalness:.8,roughness:.25}));
   // Each blade has a subtle metallic cap so the selectable finish remains legible from below.
   const inset=pbox(t,fanBlade,trim,.06,.07,.006,.09,0,.004,.004);inset.rotation.z=-.18;
  }
 }
 return {group,update:(on,level,_time,dt)=>{powered+=( (on?1:0)-powered)*Math.min(1,dt*5);if(spec.kind==='fan'&&spin)spin.rotation.y+=dt*(on?.28+level*.22:0);},setState:s=>{act?.(s);},dispose};
}
