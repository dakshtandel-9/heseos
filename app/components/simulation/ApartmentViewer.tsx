'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { PowerState } from '../../../lib/energy';
import { DEVICES, lightLevel, type DeviceId } from '../../../lib/devices';
import { findStop, neighbours, type ApartmentConfig, type Placement } from '../../../lib/apartments';
import { airConditioner, irBlaster, smartPlug, television, touchPanel, type Model } from '../../../lib/device-models';

const EYE=1.6,PITCH=-.2;
const yawToward=(fx:number,fz:number,tx:number,tz:number)=>Math.atan2(-(tx-fx),-(tz-fz));
type Pad='forward'|'back'|'left'|'right';
type Label={id:string;name:string;x:number;y:number;visible:boolean};
type Hotspot={id:DeviceId;x:number;y:number;visible:boolean};
export type ViewerStatus={state:'loading'|'ready'|'error';loaded:number;total:number};
type Props={
 apartment:ApartmentConfig;power:PowerState;focus:{id:DeviceId;seq:number}|null;selected:DeviceId|null;reducedMotion:boolean;debug?:boolean;
 onSelect:(id:DeviceId)=>void;onStatus:(status:ViewerStatus)=>void;
};

export default function ApartmentViewer(props:Props){
 const {apartment,focus,selected,debug=false}=props;
 const mount=useRef<HTMLDivElement>(null),latest=useRef(props);
 useEffect(()=>{latest.current=props;});
 const [ready,setReady]=useState(false),[current,setCurrent]=useState<string|null>(apartment.start);
 const [labels,setLabels]=useState<Label[]>([]),[hotspots,setHotspots]=useState<Hotspot[]>([]);
 const api=useRef<{go:(id:string)=>void;pad:(d:Pad,on:boolean)=>void;look:(id:DeviceId)=>void}|null>(null);

 useEffect(()=>{
  // The scene works on its own copy of the configuration.
  const home=structuredClone(apartment),el=mount.current!,floorY=home.floorY,eyeY=floorY+EYE;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch{latest.current.onStatus({state:'error',loaded:0,total:0});return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(el.clientWidth,el.clientHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#0a0b0d');
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  const hemi=new THREE.HemisphereLight(0xffffff,0x444444,.6);scene.add(hemi);
  const moon=new THREE.DirectionalLight('#9fb4dd',.25);moon.position.set(-4,8,6);scene.add(moon);
  const camera=new THREE.PerspectiveCamera(70,el.clientWidth/el.clientHeight,.05,100);camera.rotation.order='YXZ';

  // Devices and the appliances they control.
  const place=(make:()=>Model,p:Placement)=>{const model=make();model.group.position.set(...p.at);model.group.rotation.y=p.yaw;scene.add(model.group);return model;};
  const models:Record<DeviceId,Model>={
   'touch-panel':place(touchPanel,home.devices['touch-panel']),
   'ir-blaster':place(irBlaster,home.devices['ir-blaster']),
   'smart-plug':place(smartPlug,home.devices['smart-plug']),
  };
  const tvPlacement=home.appliances.tv;
  const ac=place(airConditioner,home.appliances.ac),tv=place(()=>television({onConsole:tvPlacement.onConsole,screen:tvPlacement.screen}),tvPlacement);
  const devicePos=Object.fromEntries(DEVICES.map(d=>[d.id,models[d.id].group.position])) as Record<DeviceId,THREE.Vector3>;
  // Configured positions are approximate; snap mounted items onto the real wall or surface once the model is in.
  const snapRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
  const snapped=(root:THREE.Object3D,p:Placement)=>{
   const normal=new THREE.Vector3(Math.sin(p.yaw),0,Math.cos(p.yaw)),origin=new THREE.Vector3(...p.at);
   if(p.mount==='wall')snapRay.set(origin.clone().addScaledVector(normal,.3),normal.clone().negate());else snapRay.set(origin.clone().setY(origin.y+.2),down);
   snapRay.far=p.mount==='wall'?.6:.5;
   const hit=p.mount&&snapRay.intersectObject(root,true)[0];
   if(!hit)return origin;
   return p.mount==='wall'?hit.point.clone().addScaledVector(normal,.002):origin.setY(hit.point.y);
  };

  // Lighting: lamps for lit models, tinted materials and glow sprites for baked (unlit) ones.
  const lamps=home.lamps.map(p=>{const l=new THREE.PointLight('#ffcf9a',0,7,2);l.position.set(...p);scene.add(l);return l;});
  const glowTexture=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d')!,r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'#ffe2b8');r.addColorStop(1,'#ffe2b800');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;})();
  const glowMaterial=new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});
  if(home.lighting==='unlit')for(const p of home.lamps){const s=new THREE.Sprite(glowMaterial);s.position.set(...p);s.scale.setScalar(1.6);scene.add(s);}
  const tinted:{material:THREE.MeshBasicMaterial|THREE.MeshStandardMaterial;base:THREE.Color}[]=[];
  const emissive:{material:THREE.MeshStandardMaterial;base:number}[]=[];
  const night=new THREE.Color(.16,.19,.27),day=new THREE.Color(1,1,1),tint=new THREE.Color();
  let level=-1;
  const applyLight=(value:number)=>{
   // The environment also lights the devices and appliances, so it dims in both strategies.
   scene.environmentIntensity=.1+.9*value;hemi.intensity=.06+.54*value;
   if(home.lighting==='lit')for(const e of emissive)e.material.emissiveIntensity=e.base*value;
   else{tint.copy(night).lerp(day,value);for(const t of tinted)t.material.color.copy(t.base).multiply(tint);glowMaterial.opacity=.55*value;}
   for(const l of lamps)l.intensity=(home.lighting==='lit'?9:0)*value;
  };

  // View state: position + yaw/pitch, with an optional animated move to a stop or a device.
  const pos=new THREE.Vector3();let yaw=0,pitch=PITCH;
  let move:{from:THREE.Vector3;to:THREE.Vector3;yaw0:number;yaw1:number;pitch0:number;pitch1:number;t:number;stop:string|null}|null=null;
  let at:string|null=null;
  const arrowShape=new THREE.Shape();
  arrowShape.moveTo(0,.32);arrowShape.lineTo(.3,0);arrowShape.lineTo(.12,0);arrowShape.lineTo(.12,-.3);arrowShape.lineTo(-.12,-.3);arrowShape.lineTo(-.12,0);arrowShape.lineTo(-.3,0);arrowShape.closePath();
  const arrowGeo=new THREE.ShapeGeometry(arrowShape);arrowGeo.rotateX(-Math.PI/2);
  const arrowMat=new THREE.MeshBasicMaterial({color:0xf05a28,transparent:true,opacity:.85,depthTest:false,side:THREE.DoubleSide});
  const arrowHover=arrowMat.clone();arrowHover.color.set('#ffffff');
  const arrows=new THREE.Group();scene.add(arrows);
  const arrive=(id:string)=>{
   at=id;setCurrent(id);arrows.clear();
   const s=findStop(home,id);
   for(const n of neighbours(home,id)){
    const t=findStop(home,n),dx=t.at[0]-s.at[0],dz=t.at[1]-s.at[1],len=Math.hypot(dx,dz),d=Math.min(2.2,len*.6);
    const m=new THREE.Mesh(arrowGeo,arrowMat);m.renderOrder=10;
    m.position.set(s.at[0]+dx/len*d,floorY+.03,s.at[1]+dz/len*d);m.rotation.y=Math.atan2(-dx,-dz);m.userData.target=n;arrows.add(m);
   }
  };
  const leave=()=>{arrows.clear();at=null;setCurrent(null);};
  const fly=(to:THREE.Vector3,yaw1:number,pitch1:number,stop:string|null)=>{
   const dy=((yaw1-yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
   leave();
   if(latest.current.reducedMotion){pos.copy(to);yaw=yaw1;pitch=pitch1;if(stop)arrive(stop);return;}
   move={from:pos.clone(),to,yaw0:yaw,yaw1:yaw+dy,pitch0:pitch,pitch1,t:0,stop};
  };
  const go=(id:string)=>{const s=findStop(home,id);fly(new THREE.Vector3(s.at[0],eyeY,s.at[1]),yawToward(s.at[0],s.at[1],s.look[0],s.look[1]),PITCH,id);};
  const look=(id:DeviceId)=>{
   const d=home.devices[id],target=devicePos[id],to=new THREE.Vector3(d.view[0],eyeY,d.view[1]);
   fly(to,yawToward(to.x,to.z,target.x,target.z),Math.atan2(target.y-eyeY,Math.hypot(target.x-to.x,target.z-to.z)),null);
  };

  // Free movement; typing in a field never moves the camera.
  const keys=new Set<Pad>();
  const keyMap:Record<string,Pad>={ArrowUp:'forward',KeyW:'forward',ArrowDown:'back',KeyS:'back',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
  const pad=(d:Pad,on:boolean)=>{if(on){keys.add(d);move=null;if(at)leave();}else keys.delete(d);};
  const onKey=(e:KeyboardEvent)=>{
   const d=keyMap[e.code],target=e.target as HTMLElement|null;
   if(!d||e.metaKey||e.ctrlKey||e.altKey||target?.closest('input,textarea,select,[contenteditable=true]'))return;
   if(e.type==='keydown'&&!el.parentElement?.contains(document.activeElement)&&document.activeElement!==document.body)return;
   e.preventDefault();pad(d,e.type==='keydown');
  };
  window.addEventListener('keydown',onKey);window.addEventListener('keyup',onKey);

  // Drag to look around; click a floor arrow to move, or a device to select it.
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  let drag:{x:number;y:number;moved:boolean}|null=null,hovered:THREE.Mesh|null=null;
  const pick=(e:PointerEvent)=>{
   const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);
   const arrow=ray.intersectObjects(arrows.children,false)[0]?.object as THREE.Mesh|undefined;
   if(arrow)return {arrow};
   const hit=ray.intersectObjects(Object.values(models).map(m=>m.group),true)[0];
   const id=hit&&DEVICES.find(d=>{let o:THREE.Object3D|null=hit.object;while(o){if(o===models[d.id].group)return true;o=o.parent;}return false;})?.id;
   return {device:id};
  };
  const canvas=renderer.domElement;canvas.style.touchAction='none';canvas.style.cursor='grab';canvas.tabIndex=0;canvas.setAttribute('aria-label','3D home. Drag to look around, arrow keys to walk.');
  const press=(e:PointerEvent)=>{drag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);};
  const moveP=(e:PointerEvent)=>{
   if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;if(drag.moved&&!move){yaw+=dx*.004;pitch=THREE.MathUtils.clamp(pitch+dy*.004,-1.3,1.3);drag.x=e.clientX;drag.y=e.clientY;canvas.style.cursor='grabbing';}return;}
   const {arrow,device}=pick(e),h=arrow??null;
   if(h!==hovered){if(hovered)hovered.material=arrowMat;if(h)h.material=arrowHover;hovered=h;}
   canvas.style.cursor=h||device?'pointer':'grab';
  };
  const up=(e:PointerEvent)=>{if(drag&&!drag.moved){const {arrow,device}=pick(e);if(arrow)go(arrow.userData.target);else if(device)latest.current.onSelect(device);}drag=null;canvas.style.cursor='grab';};
  canvas.addEventListener('pointerdown',press);canvas.addEventListener('pointermove',moveP);canvas.addEventListener('pointerup',up);

  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();if(top)fitTop();};
  const observer=new ResizeObserver(resize);observer.observe(el);

  // Debug: an orthographic plan view with a 1 m grid, used to place devices.
  let top:THREE.OrthographicCamera|null=null,bounds=new THREE.Box3();
  const fitTop=()=>{if(!top)return;const c=bounds.getCenter(new THREE.Vector3()),s=bounds.getSize(new THREE.Vector3()),aspect=el.clientWidth/el.clientHeight,half=Math.max(s.x/aspect,s.z)/2+.5;top.left=-half*aspect;top.right=half*aspect;top.top=half;top.bottom=-half;top.position.set(c.x,30,c.z);top.lookAt(c.x,0,c.z);top.updateProjectionMatrix();};

  const loader=new GLTFLoader(),draco=new DRACOLoader();
  // three's glTF Draco decoder, served as plain static files: the worker evaluates the script text,
  // which must not pass through the dev server's module transform.
  draco.setDecoderPath({js:'/media/draco/draco_wasm_wrapper.js',wasm:'/media/draco/draco_decoder.wasm'});loader.setDRACOLoader(draco);
  let model:THREE.Object3D|null=null,disposed=false;
  loader.load(home.model,gltf=>{
   if(disposed)return;
   model=gltf.scene;model.updateMatrixWorld(true);
   model.traverse(o=>{
    o.matrixAutoUpdate=false;const mesh=o as THREE.Mesh;if(!mesh.isMesh)return;
    for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
     if(home.lighting==='unlit'&&(m instanceof THREE.MeshBasicMaterial||m instanceof THREE.MeshStandardMaterial)&&!tinted.some(t=>t.material===m))tinted.push({material:m,base:m.color.clone()});
     if(m instanceof THREE.MeshStandardMaterial&&m.emissive.getHex()!==0&&!emissive.some(e=>e.material===m))emissive.push({material:m,base:m.emissiveIntensity});
    }
   });
   scene.add(model);
   for(const d of DEVICES)models[d.id].group.position.copy(snapped(model,home.devices[d.id]));
   ac.group.position.copy(snapped(model,home.appliances.ac));
   if(debug){
    bounds=new THREE.Box3().setFromObject(model);top=new THREE.OrthographicCamera();fitTop();
    renderer.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),home.ceilingY-.3)];
    const grid=new THREE.GridHelper(60,60,0xff3355,0x3355ff);grid.position.y=floorY+.02;scene.add(grid);scene.add(new THREE.AxesHelper(3));
    for(const m of [...Object.values(models),ac,tv])m.group.scale.setScalar(m===ac||m===tv?1:6);
   }
   const s=findStop(home,home.start);pos.set(s.at[0],eyeY,s.at[1]);yaw=yawToward(s.at[0],s.at[1],s.look[0],s.look[1]);arrive(home.start);
   setReady(true);latest.current.onStatus({state:'ready',loaded:1,total:1});
  },e=>latest.current.onStatus({state:'loading',loaded:e.loaded,total:e.total}),()=>latest.current.onStatus({state:'error',loaded:0,total:0}));

  const timer=new THREE.Timer(),v=new THREE.Vector3();timer.connect(document);
  let lastLabels='',lastHotspots='',lastClimate=latest.current.power.climate,time=0;
  renderer.setAnimationLoop(now=>{
   timer.update(now);const dt=Math.min(timer.getDelta(),.1),{power}=latest.current;time+=dt;
   const target=lightLevel(power),next=level<0?target:level+(target-level)*Math.min(1,dt*4);
   if(Math.abs(next-level)>.001){level=next;applyLight(level);}
   if(power.climate!==lastClimate){lastClimate=power.climate;models['ir-blaster'].pulse?.();}
   models['touch-panel'].update(power.lights,lightLevel(power),time,dt);
   models['ir-blaster'].update(power.climate,0,time,dt);
   models['smart-plug'].update(power.standby,0,time,dt);
   ac.update(power.climate,0,time,dt);tv.update(power.standby,0,time,dt);
   if(move){
    move.t=Math.min(1,move.t+dt/1.1);const k=move.t<.5?2*move.t*move.t:1-(-2*move.t+2)**2/2;
    pos.lerpVectors(move.from,move.to,k);yaw=move.yaw0+(move.yaw1-move.yaw0)*k;pitch=move.pitch0+(move.pitch1-move.pitch0)*k;
    if(move.t===1){const stop=move.stop;move=null;if(stop)arrive(stop);}
   }
   if(keys.size){
    if(keys.has('left'))yaw+=1.6*dt;if(keys.has('right'))yaw-=1.6*dt;
    const f=(keys.has('forward')?1:0)-(keys.has('back')?1:0);
    pos.x-=Math.sin(yaw)*f*1.8*dt;pos.z-=Math.cos(yaw)*f*1.8*dt;
   }
   camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);
   const view=top??camera;renderer.render(scene,view);
   // Screen-space labels for floor arrows and device hotspots.
   const w=el.clientWidth,h=el.clientHeight;
   const project=(p:THREE.Vector3)=>{v.copy(p).project(view);return {x:Math.round((v.x+1)/2*w),y:Math.round((1-v.y)/2*h),front:v.z<1&&v.z>-1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05};};
   const nextLabels:Label[]=top?[]:arrows.children.map(a=>{const p=project(a.position),id=a.userData.target as string;return {id,name:findStop(home,id).name,x:p.x,y:p.y,visible:p.front&&p.y<h-90};});
   const key=JSON.stringify(nextLabels);if(key!==lastLabels){lastLabels=key;setLabels(nextLabels);}
   const nextHotspots:Hotspot[]=DEVICES.map(d=>{const p=project(devicePos[d.id]),near=pos.distanceTo(devicePos[d.id])<3.2;return {id:d.id,x:p.x,y:p.y,visible:p.front&&(!!top||near||(at!==null&&home.devices[d.id].seenFrom.includes(at)))};});
   const hkey=JSON.stringify(nextHotspots);if(hkey!==lastHotspots){lastHotspots=hkey;setHotspots(nextHotspots);}
  });
  api.current={go,pad,look};
  return()=>{
   disposed=true;renderer.setAnimationLoop(null);timer.dispose();observer.disconnect();window.removeEventListener('keydown',onKey);window.removeEventListener('keyup',onKey);
   model?.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>{Object.values(mat).forEach(x=>{if(x instanceof THREE.Texture)x.dispose();});mat.dispose();});}});
   for(const m of [...Object.values(models),ac,tv])m.dispose();
   arrowGeo.dispose();arrowMat.dispose();arrowHover.dispose();glowTexture.dispose();glowMaterial.dispose();draco.dispose();pmrem.dispose();scene.environment?.dispose();renderer.dispose();el.removeChild(canvas);
  };
 },[apartment,debug]);

 useEffect(()=>{if(focus&&ready)api.current?.look(focus.id);},[focus,ready]);
 const padBtn=(d:Pad,label:string)=><button className={'sim-pad-'+d} aria-label={`Walk ${d}`}
  onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);api.current?.pad(d,true);}} onPointerUp={()=>api.current?.pad(d,false)} onPointerCancel={()=>api.current?.pad(d,false)}>{label}</button>;
 return <div className="sim-viewer">
  <div ref={mount} className="sim-canvas"/>
  {ready&&<>
   {labels.map(l=>l.visible&&<button key={l.id} className="sim-arrow-label" style={{left:l.x,top:l.y}} onClick={()=>api.current?.go(l.id)}>{l.name}</button>)}
   {hotspots.map(h=>{const d=DEVICES.find(x=>x.id===h.id)!,on=props.power[d.load];return h.visible&&<button key={h.id} className={'sim-hotspot'+(selected===h.id?' selected':'')+(on?' on':'')} style={{left:h.x,top:h.y}} onClick={()=>props.onSelect(h.id)} aria-label={`${d.name}, ${d.controls} ${on?'on':'off'}`}><i aria-hidden="true"/><span>{d.name}</span></button>;})}
   <nav className="sim-rooms" aria-label="Rooms">{apartment.stops.map(s=><button key={s.id} aria-current={current===s.id?'location':undefined} onClick={()=>api.current?.go(s.id)}>{s.name}</button>)}</nav>
   <div className="sim-pad" aria-label="Walk controls">{padBtn('forward','↑')}{padBtn('left','←')}{padBtn('back','↓')}{padBtn('right','→')}</div>
  </>}
 </div>;
}
