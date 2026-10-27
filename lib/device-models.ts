import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
// Illustrative stand-ins for the three components and the appliances they control, built at real-world scale (metres).
// They are replaced by approved product GLBs when those exist.
export type Model={group:THREE.Group;update:(on:boolean,level:number,time:number,dt:number)=>void;pulse?:()=>void;dispose:()=>void};
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
 ctx.fillStyle='#ffffffd9';ctx.font='600 30px Inter, Arial, sans-serif';ctx.textAlign='center';ctx.fillText('Good evening',256,150);
 const tex=t.keep(new THREE.CanvasTexture(canvas));tex.colorSpace=THREE.SRGBColorSpace;
 const screen=t.keep(new THREE.MeshBasicMaterial({map:tex,color:'#000',toneMapped:false}));
 const [w,h]=screenSize??[1.2,.675];
 mesh(screenGroup,t.keep(new THREE.PlaneGeometry(w,h)),screen,0,0,screenSize?0:.0405);
 const led=t.keep(new THREE.MeshBasicMaterial({color:'#200',toneMapped:false}));
 mesh(screenGroup,t.keep(new THREE.PlaneGeometry(.012,.004)),led,w/2-.04,-h/2-.0075,screenSize?.002:.0405);
 const off=new THREE.Color('#050505'),on=new THREE.Color('#ffffff');let power=0;
 return {group,update:(isOn,_level,_time,dt)=>{power+=((isOn?1:0)-power)*Math.min(1,dt*4);screen.color.copy(off).lerp(on,power);led.color.set(isOn?'#33c3ff':'#200');},dispose:t.dispose};
}
