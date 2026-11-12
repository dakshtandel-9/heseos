'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { findStop, type ApartmentConfig, type Placement } from '../../../lib/apartments';
import { airConditioner, apartmentProduct, television, type InstalledModel, type ProductVisualState } from '../../../lib/device-models';
import { INSTALLED_PRODUCTS, ROOM_PLAN, ROOM_ZONES, apartmentUsage, fittedProduct, isInstalledVisible, lightingLevel, productState, roomPlan, type ApartmentState, type InstalledProduct, type RoomId } from '../../../lib/simulation-products';

const EYE=1.6,PITCH=-.2;
const yawToward=(fx:number,fz:number,tx:number,tz:number)=>Math.atan2(-(tx-fx),-(tz-fz));
type Hotspot={id:string;x:number;y:number;visible:boolean};
type TourView={stop:string;focus?:string};
type CameraPose={position:THREE.Vector3;yaw:number;pitch:number;fov:number};
export type ViewerStatus={state:'loading'|'ready'|'error';loaded:number;total:number};
type Props={
 apartment:ApartmentConfig;state:ApartmentState;focus:{id:string;seq:number}|null;tourStop:string;tourViews:TourView[];scrollProgress:React.RefObject<number>;selected:string|null;reducedMotion:boolean;debug?:boolean;
 onSelect:(id:string)=>void;onStatus:(status:ViewerStatus)=>void;
};

// A dusk city panorama seen through the open window glazing (equirectangular, so it stays put as the camera turns).
function nightSkyline(){
 const c=document.createElement('canvas');c.width=4096;c.height=2048;const x=c.getContext('2d')!,H=1080;
 const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#06091a');sky.addColorStop(.55,'#16224a');sky.addColorStop(.86,'#3b3a6b');sky.addColorStop(1,'#a5627a');
 x.fillStyle=sky;x.fillRect(0,0,c.width,H);x.fillStyle='#0b0d18';x.fillRect(0,H,c.width,c.height-H);
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let i=0;i<220;i++){x.fillStyle=`rgba(255,255,255,${.2+rnd()*.5})`;x.fillRect(rnd()*c.width,rnd()*H*.6,1.6,1.6);}
 for(const [depth,count,maxH,tone] of [[0,90,170,'#1a1f38'],[1,70,300,'#11152a'],[2,46,430,'#0a0d1c']] as const){
  for(let i=0;i<count;i++){
   const w=40+rnd()*(60+depth*50),h=40+rnd()*maxH,bx=rnd()*c.width,top=H+60-h+depth*40;
   x.fillStyle=tone;x.fillRect(bx,top,w,c.height);
   for(let wy=top+6;wy<H+120;wy+=7+depth*2)for(let wx=bx+4;wx<bx+w-4;wx+=5+depth*2)if(rnd()<.36){x.fillStyle=rnd()<.8?`rgba(255,${190+rnd()*40|0},${110+rnd()*60|0},${.35+rnd()*.5})`:'rgba(190,215,255,.6)';x.fillRect(wx,wy,1.6+depth*.6,2.4+depth*.6);}
  }
 }
 const glow=x.createLinearGradient(0,H-40,0,H+260);glow.addColorStop(0,'rgba(255,150,90,0)');glow.addColorStop(.5,'rgba(255,150,90,.12)');glow.addColorStop(1,'rgba(255,150,90,0)');x.fillStyle=glow;x.fillRect(0,H-40,c.width,300);
 const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}

export default function ApartmentViewer(props:Props){
 const {apartment,focus,selected,debug=false}=props;
 const mount=useRef<HTMLDivElement>(null),latest=useRef(props);
 useEffect(()=>{latest.current=props;});
 const [ready,setReady]=useState(false),[hotspots,setHotspots]=useState<Hotspot[]>([]);
 const api=useRef<{look:(id:string)=>void}|null>(null);

 useEffect(()=>{
  // The scene works on its own copy of the configuration.
  const home=structuredClone(apartment),el=mount.current!,floorY=home.floorY,eyeY=floorY+EYE;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch{latest.current.onStatus({state:'error',loaded:0,total:0});return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(el.clientWidth,el.clientHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=nightSkyline();
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  const hemi=new THREE.HemisphereLight(0xffffff,0x444444,.6);scene.add(hemi);
  const moon=new THREE.DirectionalLight('#9fb4dd',.25);moon.position.set(-4,8,6);scene.add(moon);
  const camera=new THREE.PerspectiveCamera(70,el.clientWidth/el.clientHeight,.05,100);camera.rotation.order='YXZ';

  // Devices and the appliances they control.
  const place=(make:()=>InstalledModel,p:Placement)=>{const model=make();model.group.position.set(...p.at);model.group.rotation.y=p.yaw;scene.add(model.group);return model;};
  const productModels=Object.fromEntries(INSTALLED_PRODUCTS.map(p=>{const m=apartmentProduct(p);m.group.position.set(...p.at);m.group.rotation.y=p.yaw;m.group.visible=isInstalledVisible(p,latest.current.state);scene.add(m.group);return [p.id,m];})) as Record<string,InstalledModel>;
  const tvPlacement=home.appliances.tv;
  const ac=place(airConditioner,home.appliances.ac),tv=place(()=>television({onConsole:tvPlacement.onConsole,screen:tvPlacement.screen}),tvPlacement);
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

  // Five independent circuits. Shared baked meshes are shaded per fragment in world space,
  // so a kitchen switch never darkens living furniture on the same imported material.
  const roomLevels={value:ROOM_PLAN.map(r=>lightingLevel(r.id,latest.current.state))};
  const roomColors={value:ROOM_PLAN.map(()=>new THREE.Color(1,1,1))};
  const lampColor=new THREE.Color(),white=new THREE.Color(1,1,1),warm=new THREE.Color('#ffdfb2'),cool=new THREE.Color('#dbe9ff');
  const lamps=home.lamps.map(p=>{const l=new THREE.PointLight('#ffcf9a',0,5,2);l.position.set(...p);scene.add(l);return l;});
  scene.environmentIntensity=.65;
  const zoneChecks=ROOM_ZONES.map(zone=>{
   const clauses=[zone.minX!==undefined?`vRoomPosition.x >= ${zone.minX.toFixed(4)}`:'',zone.maxX!==undefined?`vRoomPosition.x < ${zone.maxX.toFixed(4)}`:'',zone.minZ!==undefined?`vRoomPosition.z >= ${zone.minZ.toFixed(4)}`:'',zone.maxZ!==undefined?`vRoomPosition.z < ${zone.maxZ.toFixed(4)}`:''].filter(Boolean).join(' && ');
   return `if (${clauses}) return ${ROOM_PLAN.findIndex(r=>r.id===zone.room)};`;
  }).join('\n');
  const shaded=new Set<THREE.Material>();
  const shadeRoom=(material:THREE.Material)=>{
   if(shaded.has(material))return;shaded.add(material);
   material.onBeforeCompile=shader=>{
    shader.uniforms.uRoomLevels=roomLevels;shader.uniforms.uRoomColors=roomColors;
    shader.vertexShader='varying vec3 vRoomPosition;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvRoomPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader=`varying vec3 vRoomPosition;
uniform float uRoomLevels[5];
uniform vec3 uRoomColors[5];
int apartmentRoom() { ${zoneChecks} return 0; }
`+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nint roomIndex = apartmentRoom();\ndiffuseColor.rgb *= mix(vec3(0.14, 0.17, 0.23), uRoomColors[roomIndex], uRoomLevels[roomIndex]);');
   };
   material.customProgramCacheKey=()=>`apartment-room-lighting-v1:${zoneChecks}`;
   material.needsUpdate=true;
  };
  const updateLighting=(state:ApartmentState,dt:number)=>{
   for(const [i,r] of ROOM_PLAN.entries()){
    const target=lightingLevel(r.id,state),k=latest.current.reducedMotion?1:1-Math.exp(-dt*5);
    roomLevels.value[i]+=(target-roomLevels.value[i])*k;
    lampColor.copy(warm).lerp(cool,(state.rooms[r.id].kelvin-2700)/3800);
    roomColors.value[i].copy(white).lerp(lampColor,.2);
    lamps[i].color.copy(lampColor);lamps[i].intensity=roomLevels.value[i]*6;
   }
  };

  // Scroll progress drives a continuous camera track; selecting a device temporarily takes over.
  const pos=new THREE.Vector3();let yaw=0,pitch=PITCH;
  const targetPos=new THREE.Vector3();let poses:CameraPose[]=[],blockedSegments:boolean[]=[],lookOffsetYaw=0,lookOffsetPitch=0,lastProgress=latest.current.scrollProgress.current,catchUpOpacity=1;
  const angleDelta=(from:number,to:number)=>((to-from+Math.PI)%(Math.PI*2)+(Math.PI*2))%(Math.PI*2)-Math.PI;
  let model:THREE.Object3D|null=null,disposed=false;
  const travelRay=new THREE.Raycaster(),travelDirection=new THREE.Vector3();
  const blockedPath=(from:THREE.Vector3,to:THREE.Vector3)=>{
   if(!model)return false;
   travelDirection.subVectors(to,from);const distance=travelDirection.length();
   if(distance<.35)return false;
   travelDirection.divideScalar(distance);
   // Check from both ends: imported walls may be single-sided. Leave room for the camera at each end.
   for(const [origin,sign] of [[from,1],[to,-1]] as const){
    travelRay.set(origin.clone().addScaledVector(travelDirection,sign*.16),travelDirection.clone().multiplyScalar(sign));
    travelRay.far=distance-.32;
    if(travelRay.intersectObject(model,true).length)return true;
   }
   return false;
  };
  const fadeAt=(fraction:number)=>THREE.MathUtils.smoothstep(Math.abs(fraction-.5),0,.18);
  let move:{from:THREE.Vector3;to:THREE.Vector3;yaw0:number;yaw1:number;pitch0:number;pitch1:number;fov0:number;fov1:number;blocked:boolean;t:number}|null=null;
  const fly=(to:THREE.Vector3,yaw1:number,pitch1:number,fov1=42)=>{
   const dy=((yaw1-yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
   if(latest.current.reducedMotion){pos.copy(to);yaw=yaw1;pitch=pitch1;camera.fov=fov1;camera.updateProjectionMatrix();return;}
   move={from:pos.clone(),to,yaw0:yaw,yaw1:yaw+dy,pitch0:pitch,pitch1,fov0:camera.fov,fov1,blocked:blockedPath(pos,to),t:0};
  };
  const lookProduct=(id:string)=>{
   const spec=INSTALLED_PRODUCTS.find(p=>p.id===id);if(!spec)return;
   const stop=findStop(home,spec.room),view=spec.view??stop.at,target=productModels[id].group.position.clone();target.y+=spec.mount==='ceiling'?-0.35:.02;
   const to=new THREE.Vector3(view[0],eyeY,view[1]);fly(to,yawToward(to.x,to.z,target.x,target.z),Math.atan2(target.y-eyeY,Math.hypot(target.x-to.x,target.z-to.z)),spec.fov??(spec.kind==='fan'?66:42));
  };

  // Drag to look around; movement between rooms is controlled by the tour.
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  let drag:{x:number;y:number;moved:boolean}|null=null;
  const pick=(e:PointerEvent)=>{
   const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);
   const candidates=INSTALLED_PRODUCTS.filter(p=>productModels[p.id].group.visible).map(p=>productModels[p.id].group),hit=ray.intersectObjects(candidates,true)[0];
   if(hit&&model){const obstruction=ray.intersectObject(model,true)[0];if(obstruction&&obstruction.distance<hit.distance-.025)return {product:undefined};}
   if(hit)for(const p of INSTALLED_PRODUCTS){let o:THREE.Object3D|null=hit.object;while(o){if(o===productModels[p.id].group)return {product:p.id};o=o.parent;}}
   return {product:undefined};
  };
  const canvas=renderer.domElement;canvas.style.touchAction='pan-y';canvas.style.cursor='grab';canvas.tabIndex=0;canvas.setAttribute('aria-label','3D home. Scroll to explore products, drag to look around.');
  const press=(e:PointerEvent)=>{drag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);};
  const moveP=(e:PointerEvent)=>{
   if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;if(drag.moved&&!move&&e.pointerType!=='touch'){lookOffsetYaw+=dx*.004;lookOffsetPitch=THREE.MathUtils.clamp(lookOffsetPitch+dy*.004,-.65,.65);drag.x=e.clientX;drag.y=e.clientY;canvas.style.cursor='grabbing';}return;}
   const {product}=pick(e);
   canvas.style.cursor=product?'pointer':'grab';
  };
  const up=(e:PointerEvent)=>{if(drag&&!drag.moved){const {product}=pick(e);if(product)latest.current.onSelect(product);}drag=null;canvas.style.cursor='grab';};
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
  loader.load(home.model,gltf=>{
   if(disposed)return;
   model=gltf.scene;model.updateMatrixWorld(true);
   model.traverse(o=>{
    o.matrixAutoUpdate=false;const mesh=o as THREE.Mesh;if(!mesh.isMesh)return;
    for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
     if(m instanceof THREE.MeshBasicMaterial||m instanceof THREE.MeshStandardMaterial)shadeRoom(m);
    }
   });
   scene.add(model);
   for(const p of INSTALLED_PRODUCTS){const spec=p as InstalledProduct,m=productModels[p.id];if(spec.mount==='wall'||spec.mount==='surface')m.group.position.copy(snapped(model,{at:spec.at,yaw:spec.yaw,mount:spec.mount}));}
   for(const p of INSTALLED_PRODUCTS.filter(p=>p.slot))productModels[p.id].group.visible=isInstalledVisible(p,latest.current.state);
   ac.group.position.copy(snapped(model,home.appliances.ac));
   poses=latest.current.tourViews.map((view,index)=>{
    const s=findStop(home,view.stop),product=view.focus&&productModels[view.focus]?INSTALLED_PRODUCTS.find(p=>p.id===view.focus):undefined,variation=view.focus?0:index;
    let x=s.at[0],z=s.at[1];
    let target=new THREE.Vector3(s.look[0]+(variation?0.32*Math.cos(index*1.2):0),eyeY-.32,s.look[1]);
    let fov=70;
    if(product){const v=product.view??s.at;[x,z]=v;target=productModels[product.id].group.position.clone();target.y+=product.mount==='ceiling'?-0.35:.02;fov=product.fov??(product.kind==='fan'?66:42);}
    else if(view.focus==='tv'){[x,z]=home.appliances.tv.view;target=tv.group.position.clone();fov=60;}
    else if(view.focus==='ac'){[x,z]=home.appliances.ac.view;target=ac.group.position.clone();fov=52;}
    const position=new THREE.Vector3(x,eyeY,z),distance=Math.hypot(target.x-x,target.z-z);
    return {position,yaw:yawToward(x,z,target.x,target.z),pitch:Math.atan2(target.y-eyeY,distance),fov};
   });
   blockedSegments=poses.slice(0,-1).map((pose,index)=>blockedPath(pose.position,poses[index+1].position));
   if(debug){
    bounds=new THREE.Box3().setFromObject(model);top=new THREE.OrthographicCamera();fitTop();
    renderer.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),home.ceilingY-.3)];
    const grid=new THREE.GridHelper(60,60,0xff3355,0x3355ff);grid.position.y=floorY+.02;scene.add(grid);scene.add(new THREE.AxesHelper(3));
   }
   const start=Math.min(poses.length-1,Math.floor(latest.current.scrollProgress.current)),end=Math.min(poses.length-1,start+1),t=latest.current.scrollProgress.current-start;
   pos.lerpVectors(poses[start].position,poses[end].position,t);yaw=poses[start].yaw+angleDelta(poses[start].yaw,poses[end].yaw)*t;pitch=THREE.MathUtils.lerp(poses[start].pitch,poses[end].pitch,t);camera.fov=THREE.MathUtils.lerp(poses[start].fov,poses[end].fov,t);camera.updateProjectionMatrix();
   setReady(true);latest.current.onStatus({state:'ready',loaded:1,total:1});
  },e=>latest.current.onStatus({state:'loading',loaded:e.loaded,total:e.total}),()=>latest.current.onStatus({state:'error',loaded:0,total:0}));

  const timer=new THREE.Timer(),v=new THREE.Vector3();timer.connect(document);
  let lastHotspots='',time=0,lastState:ApartmentState|null=null,lastSync=-1;
  renderer.setAnimationLoop(now=>{
   timer.update(now);const dt=Math.min(timer.getDelta(),.1),{state}=latest.current;time+=dt;
   updateLighting(state,dt);
   const usage=apartmentUsage(state);
   if(lastState!==state||lastSync!==usage.total){
    lastState=state;lastSync=usage.total;
    for(const p of INSTALLED_PRODUCTS){const m=productModels[p.id],s=productState(p,state);m.group.visible=isInstalledVisible(p,state);
     const visual:ProductVisualState={...s,reading:usage.total,threshold:state.threshold,progress:state.curtain/100,curtainKind:state.curtainKind,temperature:state.temperature};m.setState?.(visual);
    }
   }
   for(const p of INSTALLED_PRODUCTS){if(!isInstalledVisible(p,state))continue;const s=productState(p,state);productModels[p.id].update(s.on,s.level,time,dt);}
   ac.update(state.climate,0,time,dt);tv.update(state.tv,0,time,dt);
   const progress=latest.current.scrollProgress.current;
   if(Math.abs(progress-lastProgress)>.002){lookOffsetYaw=0;lookOffsetPitch=0;lastProgress=progress;}
   if(latest.current.selected&&move){
    move.t=Math.min(1,move.t+dt/1.1);const k=move.t<.5?2*move.t*move.t:1-(-2*move.t+2)**2/2;
    const travel=move.blocked?(move.t<.5?0:1):k;
    pos.lerpVectors(move.from,move.to,travel);yaw=move.yaw0+(move.yaw1-move.yaw0)*travel;pitch=move.pitch0+(move.pitch1-move.pitch0)*travel;camera.fov=THREE.MathUtils.lerp(move.fov0,move.fov1,travel);
    canvas.style.opacity=move.blocked?String(fadeAt(move.t)):'';
    if(move.t===1)move=null;
   }
   else if(!latest.current.selected&&poses.length){
    move=null;
    const start=Math.min(poses.length-1,Math.floor(progress)),end=Math.min(poses.length-1,start+1),fraction=progress-start,t=fraction*fraction*(3-2*fraction);
    const a=poses[start],b=poses[end],blocked=blockedSegments[start]&&start!==end,travel=blocked?(fraction<.5?0:1):t,smooth=blocked||latest.current.reducedMotion?1:1-Math.exp(-dt*7);
    targetPos.lerpVectors(a.position,b.position,travel);
    const targetYaw=a.yaw+angleDelta(a.yaw,b.yaw)*travel+lookOffsetYaw,targetPitch=THREE.MathUtils.lerp(a.pitch,b.pitch,travel)+lookOffsetPitch;
    camera.fov=THREE.MathUtils.lerp(a.fov,b.fov,travel);
    // A fast scroll can skip several sections. Never ease from the old room through walls.
    if(!blocked&&pos.distanceToSquared(targetPos)>.25&&blockedPath(pos,targetPos)){
     pos.copy(targetPos);yaw=targetYaw;pitch=targetPitch;catchUpOpacity=0;
    }else{
     pos.lerp(targetPos,smooth);yaw+=angleDelta(yaw,targetYaw)*smooth;pitch+=((targetPitch-pitch)*smooth);
    }
    catchUpOpacity=Math.min(1,catchUpOpacity+dt*4);
    canvas.style.opacity=String(Math.min(blocked?fadeAt(fraction):1,catchUpOpacity));
   }
   camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);camera.updateProjectionMatrix();
   const view=top??camera;renderer.render(scene,view);
   // Screen-space device hotspots.
   const w=el.clientWidth,h=el.clientHeight;
   const project=(p:THREE.Vector3)=>{v.copy(p).project(view);return {x:Math.round((v.x+1)/2*w),y:Math.round((1-v.y)/2*h),front:v.z<1&&v.z>-1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05};};
   const currentRoom=latest.current.tourStop as RoomId;
   const p=fittedProduct(roomPlan(currentRoom).controller,state),point=productModels[p.id].group.position,projected=project(point);
   let unobstructed=true;
   if(model){travelDirection.subVectors(point,pos);const distance=travelDirection.length();travelRay.set(pos,travelDirection.normalize());travelRay.far=Math.max(0,distance-.04);unobstructed=travelRay.intersectObject(model,true).length===0;}
   const nextHotspots:Hotspot[]=[{id:p.id,x:projected.x,y:projected.y,visible:projected.front&&unobstructed&&pos.distanceTo(point)<4}];
   const hkey=JSON.stringify(nextHotspots);if(hkey!==lastHotspots){lastHotspots=hkey;setHotspots(nextHotspots);}
  });
  api.current={look:lookProduct};
  return()=>{
   disposed=true;renderer.setAnimationLoop(null);timer.dispose();observer.disconnect();
   model?.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){m.geometry.dispose();(Array.isArray(m.material)?m.material:[m.material]).forEach(mat=>{Object.values(mat).forEach(x=>{if(x instanceof THREE.Texture)x.dispose();});mat.dispose();});}});
   for(const m of new Set(Object.values(productModels)))m.dispose();ac.dispose();tv.dispose();
   draco.dispose();pmrem.dispose();scene.environment?.dispose();(scene.background as THREE.Texture|null)?.dispose();renderer.dispose();el.removeChild(canvas);
  };
 },[apartment,debug]);

 useEffect(()=>{if(focus&&ready)api.current?.look(focus.id);},[focus,ready]);
 return <div className="sim-viewer">
  <div ref={mount} className="sim-canvas"/>
  {ready&&<>
   {hotspots.map(h=>{const spec=INSTALLED_PRODUCTS.find(p=>p.id===h.id)!,on=productState(spec,props.state).on;return h.visible&&<button key={h.id} className={'sim-hotspot'+(selected===spec.id?' selected':'')+(on?' on':'')} style={{left:h.x,top:h.y}} onClick={()=>props.onSelect(spec.id)} aria-label={`${spec.label}, ${on?'on':'off'}`}><i aria-hidden="true"/><span>{spec.label}</span></button>;})}
  </>}
 </div>;
}
