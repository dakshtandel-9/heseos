'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// The 4 module Heseos Touch Panel at real-world scale (metres): a metal frame around a glass face.
// The face wears the product photo flattened to a straight-on view, so its rings, sensor and logo are the real ones.
// Built from primitives until an approved product GLB exists; only the face texture and these measurements would change.
const FRAME={w:.146,h:.086,d:.009,r:.0032},GLASS={w:.1432,h:.0832,d:.0018,r:.0022},LIFT=.0003;
// Ring centres on the face (0–1 from its top left) and their radius, measured on the flattened photo.
const RINGS=[[.3991,.3726],[.6594,.3866],[.3978,.6032],[.6572,.6194]] as const,RING_R=.0267*GLASS.w;
// The ring LEDs glow ice blue, as in the brochure renders.
const LED=new THREE.Color('#a4e6ff');
// Physically based stand-ins for the five frame finishes in the catalogue (Edge and Bezel series).
const METALS:Record<string,{color:string;metalness:number;roughness:number}>={
 'rose-gold':{color:'#e4ae98',metalness:1,roughness:.3},
 grey:{color:'#b8bbc1',metalness:1,roughness:.42},
 gold:{color:'#e8c26c',metalness:1,roughness:.27},
 chrome:{color:'#f4f5f7',metalness:1,roughness:.07},
 black:{color:'#1c1d1f',metalness:.6,roughness:.34},
};
const DIST=.62,FOV=28,RETURN_MS=1600;
const KEYS:Record<string,[number,number]>={ArrowLeft:[-.2,0],ArrowRight:[.2,0],ArrowUp:[0,-.12],ArrowDown:[0,.12]};
export type StudioMode='rotate'|'touch'|'finish';
// Where the panel should sit, in stage pixels: its centre and front width, and how far it is turned (radians).
export type Target={cx:number;cy:number;pw:number;yaw:number;pitch:number};
type Props={face:string;target:Target;mode:StudioMode;lights:readonly boolean[];finish:string;revealed:boolean;reduced:boolean;hint:boolean;resetKey:number;label:string;
 onToggle:(ring:number)=>void;onReady:()=>void;onFail:()=>void};

function roundedRect(w:number,h:number,r:number){
 const s=new THREE.Shape(),x=-w/2,y=-h/2;
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
 s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 return s;
}
// A dark product studio to reflect: a softbox overhead, a strip light either side, a soft bar above the camera for a sheen
// across the glass and a modest fill behind it, so black glass stays black face-on while the metal frame has light to catch.
function studio(){
 const scene=new THREE.Scene(),plane=new THREE.PlaneGeometry(1,1),parts:{dispose:()=>void}[]=[plane];
 const light=(w:number,h:number,at:[number,number,number],rgb:[number,number,number])=>{
  const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(...rgb),side:THREE.DoubleSide}),mesh=new THREE.Mesh(plane,mat);parts.push(mat);
  mesh.scale.set(w,h,1);mesh.position.set(...at);mesh.lookAt(0,0,0);scene.add(mesh);
 };
 scene.background=new THREE.Color('#050505');
 light(3,1.6,[-1.4,2.4,1.6],[5,4.8,4.5]);
 light(.35,3,[2.6,.4,-.4],[3,2.55,2.1]);
 light(.3,2.6,[-2.6,.2,-.6],[1.4,1.5,1.7]);
 light(4,1.4,[0,.6,3.2],[.32,.3,.28]);
 light(2.2,.45,[.5,1.7,2.2],[1.15,1.12,1.08]);
 light(2.4,2.8,[-2.2,-.2,1.9],[.26,.24,.22]);
 return {scene,dispose:()=>parts.forEach(p=>p.dispose())};
}
// A soft white spot fading to transparent: the LED halos, and (tinted black) the panel's shadow on the wall.
function softSpot(){
 const c=document.createElement('canvas');c.width=c.height=128;
 const ctx=c.getContext('2d')!,g=ctx.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'#fff');g.addColorStop(.35,'#ffffff8c');g.addColorStop(1,'#fff0');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
 return new THREE.CanvasTexture(c);
}
const {damp,clamp}=THREE.MathUtils;

// The interactive panel. It renders only while on screen and while something is moving, then sleeps until the next change.
export default function PanelScene(props:Props){
 const host=useRef<HTMLDivElement>(null),live=useRef(props),wake=useRef(()=>{});
 useEffect(()=>{live.current=props;wake.current();});
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{live.current.onFail();return;}
  const disposables:{dispose:()=>void}[]=[],keep=<T extends {dispose:()=>void}>(item:T)=>{disposables.push(item);return item;};
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  const canvas=renderer.domElement;canvas.style.touchAction='pan-y';el.appendChild(canvas);
  const scene=new THREE.Scene(),pmrem=keep(new THREE.PMREMGenerator(renderer)),lights=studio();
  scene.environment=keep(pmrem.fromScene(lights.scene,.04).texture);lights.dispose();
  const camera=new THREE.PerspectiveCamera(FOV,1,.01,5);camera.position.set(0,0,DIST);
  const key=new THREE.DirectionalLight('#fff0e2',0);key.position.set(-.4,.75,.55);scene.add(key);
  // A cool fill from well off to the right catches the frame's edges when it turns, at too low an angle to grey the glass face-on.
  const fill=new THREE.DirectionalLight('#e4ebf2',0);fill.position.set(1,.12,.18);scene.add(fill);

  // The panel turns about the middle of its depth; z=0 inside `panel` is the front of the frame.
  const pivot=new THREE.Group(),panel=new THREE.Group();panel.position.z=FRAME.d/2;pivot.add(panel);scene.add(pivot);
  const frameMat=keep(new THREE.MeshPhysicalMaterial({metalness:1,roughness:.3,envMapIntensity:1.4}));
  const frame=new THREE.Mesh(keep(new RoundedBoxGeometry(FRAME.w,FRAME.h,FRAME.d,4,FRAME.r)),frameMat);frame.position.z=-FRAME.d/2;panel.add(frame);
  // The glass: a rounded slab whose front face is mapped 0–1 across, so the photo lands edge to edge.
  const glassGeo=keep(new THREE.ExtrudeGeometry(roundedRect(GLASS.w,GLASS.h,GLASS.r),{depth:GLASS.d,bevelEnabled:false,curveSegments:12}));
  const uv=glassGeo.getAttribute('uv'),pos=glassGeo.getAttribute('position'),caps=glassGeo.groups[0];
  for(let i=caps.start;i<caps.start+caps.count;i++)uv.setXY(i,pos.getX(i)/GLASS.w+.5,pos.getY(i)/GLASS.h+.5);
  glassGeo.translate(0,0,LIFT-GLASS.d);
  let loaded=false;
  const faceTex=keep(new THREE.TextureLoader().load(live.current.face,()=>{loaded=true;wake.current();},undefined,()=>live.current.onFail()));
  faceTex.colorSpace=THREE.SRGBColorSpace;faceTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
  // The face also glows faintly with its own texture, so the printed rings and logo read at any angle while the black glass stays black.
  const faceMat=keep(new THREE.MeshPhysicalMaterial({map:faceTex,emissiveMap:faceTex,emissive:'#fff',emissiveIntensity:0,roughness:.22,clearcoat:1,clearcoatRoughness:.05}));
  const edgeMat=keep(new THREE.MeshPhysicalMaterial({color:'#08090a',roughness:.12,clearcoat:1}));
  const glass=new THREE.Mesh(glassGeo,[faceMat,edgeMat]);panel.add(glass);

  const spot=keep(softSpot());
  const shadow=new THREE.Mesh(keep(new THREE.PlaneGeometry(FRAME.w*1.7,FRAME.h*2)),keep(new THREE.MeshBasicMaterial({color:'#000',map:spot,transparent:true,opacity:.6,depthWrite:false})));
  shadow.position.set(0,-.008,-FRAME.d-.006);panel.add(shadow);
  // Each ring: the lit LED, its halo, and a ripple that spreads when it is switched.
  const ringGeo=keep(new THREE.RingGeometry(RING_R*.82,RING_R*1.1,64)),haloGeo=keep(new THREE.PlaneGeometry(RING_R*7,RING_R*7));
  const glow=(map?:THREE.Texture)=>keep(new THREE.MeshBasicMaterial({color:LED,map:map??null,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
  const rings=RINGS.map(([u,v])=>{
   const led=glow(),halo=glow(spot),wave=glow(),group=new THREE.Group(),waveMesh=new THREE.Mesh(ringGeo,wave);
   group.position.set((u-.5)*GLASS.w,(.5-v)*GLASS.h,LIFT+.0002);group.add(new THREE.Mesh(haloGeo,halo),new THREE.Mesh(ringGeo,led),waveMesh);panel.add(group);
   return {led,halo,wave,waveMesh,level:0,age:Infinity};
  });

  let W=1,H=1,visible=false,ready=false,raf=0,last=0,awake=0,first=true;
  let dragYaw=0,dragPitch=0,returnAt=Infinity,hover=-1,pointerX=0,pointerY=0,tiltX=0,tiltY=0;
  let revealAt=-1,sweepAt=-Infinity,lastFinish=live.current.finish,lastMode=live.current.mode,lastReset=live.current.resetKey,lastLights=[...live.current.lights];
  let down:{x:number;y:number;id:number;moved:boolean;touch:boolean}|null=null,dragging=false;
  const cur={x:0,y:0,s:1,yaw:0,pitch:0},metal=new THREE.Color();
  const view=()=>{const vh=2*DIST*Math.tan(THREE.MathUtils.degToRad(FOV/2));return {vh,vw:vh*W/H};};
  // How far the stage is through the viewport, -1 (entering below) to 1 (leaving above), for a little scroll-linked turn.
  const scrolled=()=>{const b=el.getBoundingClientRect();return clamp((innerHeight/2-(b.top+b.height/2))/(innerHeight/2+b.height/2),-1,1);};

  const step=(now:number,dt:number)=>{
   const p=live.current,reduced=p.reduced,turnable=p.mode!=='touch';
   if(p.revealed&&revealAt<0)revealAt=now;
   const r=reduced?1:revealAt<0?0:Math.min(1,(now-revealAt)/1800),e=1-Math.pow(1-r,3);
   if(p.resetKey!==lastReset){lastReset=p.resetKey;dragYaw=dragPitch=0;returnAt=Infinity;}
   if(!reduced&&((p.finish!==lastFinish&&turnable)||(p.mode==='finish'&&lastMode!=='finish')))sweepAt=now;
   lastFinish=p.finish;lastMode=p.mode;
   if(!turnable){dragYaw=dragPitch=0;returnAt=Infinity;}
   if(now>returnAt&&!dragging){const k=1-Math.exp(-4*dt);dragYaw-=dragYaw*k;dragPitch-=dragPitch*k;if(Math.abs(dragYaw)+Math.abs(dragPitch)<.002){dragYaw=dragPitch=0;returnAt=Infinity;}}
   const follow=turnable&&!reduced&&!dragging;
   tiltX=damp(tiltX,follow?pointerX:0,4,dt);tiltY=damp(tiltY,follow?pointerY:0,4,dt);
   const scroll=p.mode==='rotate'&&!reduced?scrolled():0,sweepT=(now-sweepAt)/1500,sweep=sweepT<1?Math.sin(Math.PI*sweepT)*.34:0;
   const {vh,vw}=view(),t=p.target;
   const goal={x:(t.cx/W-.5)*vw,y:(.5-t.cy/H)*vh,s:t.pw/W*vw/FRAME.w,
    yaw:t.yaw+dragYaw+tiltX*.08+scroll*.18+sweep-(1-e)*.8,pitch:t.pitch+dragPitch+tiltY*.05-scroll*.05+(1-e)*.32};
   // The first frame and reduced motion jump straight to the goal; otherwise everything eases (dt is 0 on the frame after a wake).
   const snap=first||reduced,lambda=dragging?18:5;
   let settled=true;
   for(const k of ['x','y','s','yaw','pitch'] as const){cur[k]=snap?goal[k]:damp(cur[k],goal[k],lambda,dt);if(Math.abs(cur[k]-goal[k])>1e-5)settled=false;}
   pivot.position.set(cur.x,cur.y-(1-e)*.02,0);pivot.scale.setScalar(cur.s*(.9+.1*e));pivot.rotation.set(cur.pitch,cur.yaw,0);
   // The reveal: the light comes up and its reflection slides across the glass.
   scene.environmentIntensity=.25+.75*e;scene.environmentRotation.y=(1-e)*-1.4;key.intensity=1.8*e;fill.intensity=1.1*e;faceMat.emissiveIntensity=.16*e;
   const m=METALS[p.finish]??METALS['rose-gold'];metal.set(m.color);
   if(snap){frameMat.color.copy(metal);frameMat.metalness=m.metalness;frameMat.roughness=m.roughness;}
   else{frameMat.color.lerp(metal,1-Math.exp(-5*dt));frameMat.metalness=damp(frameMat.metalness,m.metalness,5,dt);frameMat.roughness=damp(frameMat.roughness,m.roughness,5,dt);}
   first=false;
   const metalSettled=Math.abs(frameMat.color.r-metal.r)+Math.abs(frameMat.color.g-metal.g)+Math.abs(frameMat.color.b-metal.b)<.002;
   let ringsBusy=false;
   rings.forEach((g,i)=>{
    if(p.lights[i]!==lastLights[i])g.age=0;
    const pulse=p.hint&&i===0&&p.mode==='touch'&&!reduced?.3*(.5+.5*Math.sin(now/420)):0;
    const want=(p.lights[i]?1:0)+(hover===i&&p.mode==='touch'?.22:0)+pulse;
    g.level=reduced?want:damp(g.level,want,9,dt);g.led.opacity=Math.min(1,g.level);g.halo.opacity=Math.min(1,g.level)*.5;
    g.age+=dt;const w=Math.min(1,g.age/.75);g.waveMesh.visible=!reduced&&g.age<.75;g.waveMesh.scale.setScalar(1+w*1.8);g.wave.opacity=.7*(1-w);
    if(pulse||Math.abs(g.level-want)>.003||g.waveMesh.visible)ringsBusy=true;
   });
   lastLights=[...p.lights];
   const cursor=p.mode==='touch'?(hover>=0?'pointer':'default'):dragging?'grabbing':'grab';if(canvas.style.cursor!==cursor)canvas.style.cursor=cursor;
   return !settled||r<1||sweepT<1||dragging||returnAt!==Infinity||!metalSettled||ringsBusy||Math.abs(tiltX-(follow?pointerX:0))+Math.abs(tiltY-(follow?pointerY:0))>.001;
  };
  const frameLoop=(now:number)=>{
   raf=0;if(!visible||!loaded)return;
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;
   const busy=step(now,dt);renderer.render(scene,camera);
   if(!ready){ready=true;live.current.onReady();}
   if(busy||now<awake)raf=requestAnimationFrame(frameLoop);else last=0;
  };
  const kick=()=>{awake=performance.now()+250;if(!raf&&visible&&loaded)raf=requestAnimationFrame(frameLoop);};
  wake.current=kick;

  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  // The ring under the pointer, found from where it meets the glass face; -1 when it is not over one.
  const ringAt=(e:PointerEvent)=>{
   const b=canvas.getBoundingClientRect();ndc.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(ndc,camera);
   const hit=ray.intersectObject(glass,false)[0];if(!hit?.uv||!hit.face||hit.face.normal.z<.5)return -1;
   let best=-1,bestD=RING_R*2.6;
   RINGS.forEach(([u,v],i)=>{const d=Math.hypot((hit.uv!.x-u)*GLASS.w,(1-hit.uv!.y-v)*GLASS.h);if(d<bestD){bestD=d;best=i;}});
   return best;
  };
  const onDown=(e:PointerEvent)=>{if(e.button>0)return;down={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false,touch:e.pointerType!=='mouse'};};
  const onMove=(e:PointerEvent)=>{
   const p=live.current;
   if(down&&p.mode!=='touch'){
    if(!down.moved&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down.moved=dragging=true;canvas.setPointerCapture(down.id);}
    if(down.moved){dragYaw=clamp(dragYaw+(e.clientX-down.x)*.009,-1.1,1.1);if(!down.touch)dragPitch=clamp(dragPitch+(e.clientY-down.y)*.006,-.45,.5);down.x=e.clientX;down.y=e.clientY;returnAt=Infinity;kick();}
    return;
   }
   if(e.pointerType!=='mouse')return;
   const b=canvas.getBoundingClientRect();pointerX=(e.clientX-b.left)/b.width*2-1;pointerY=(e.clientY-b.top)/b.height*2-1;
   if(p.mode==='touch')hover=ringAt(e);
   kick();
  };
  const release=()=>{down=null;if(!dragging)return;dragging=false;if(!live.current.reduced)returnAt=performance.now()+RETURN_MS;kick();};
  const onUp=(e:PointerEvent)=>{
   const tap=down&&!down.moved&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<8,p=live.current;release();
   if(tap&&p.mode==='touch'){const i=ringAt(e);if(i>=0)p.onToggle(i);}
  };
  const onLeave=()=>{pointerX=pointerY=0;hover=-1;kick();};
  const onKey=(e:KeyboardEvent)=>{
   const p=live.current,turn=KEYS[e.key];if(p.mode==='touch')return;
   if(turn){e.preventDefault();dragYaw=clamp(dragYaw+turn[0],-1.1,1.1);dragPitch=clamp(dragPitch+turn[1],-.45,.5);returnAt=p.reduced?Infinity:performance.now()+RETURN_MS*1.5;kick();}
   else if(e.key==='Escape'||e.key==='Home'){dragYaw=dragPitch=0;returnAt=Infinity;kick();}
  };
  const onLost=(e:Event)=>{e.preventDefault();live.current.onFail();};
  const onScroll=()=>{if(live.current.mode==='rotate'&&!live.current.reduced)kick();};
  canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);
  canvas.addEventListener('pointercancel',release);canvas.addEventListener('pointerleave',onLeave);canvas.addEventListener('webglcontextlost',onLost);
  el.addEventListener('keydown',onKey);addEventListener('scroll',onScroll,{passive:true});
  const resize=new ResizeObserver(()=>{W=Math.max(1,el.clientWidth);H=Math.max(1,el.clientHeight);renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix();kick();});resize.observe(el);
  const onScreen=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)kick();else{cancelAnimationFrame(raf);raf=0;last=0;}});onScreen.observe(el);
  return()=>{
   cancelAnimationFrame(raf);wake.current=()=>{};resize.disconnect();onScreen.disconnect();removeEventListener('scroll',onScroll);el.removeEventListener('keydown',onKey);
   canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);
   canvas.removeEventListener('pointercancel',release);canvas.removeEventListener('pointerleave',onLeave);canvas.removeEventListener('webglcontextlost',onLost);
   disposables.forEach(d=>d.dispose());renderer.dispose();canvas.remove();
  };
 },[]);
 return <div ref={host} className="ps-canvas" role="group" aria-roledescription="3D model" aria-label={props.label} tabIndex={props.mode==='touch'?-1:0}/>;
}
