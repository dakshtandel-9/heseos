'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { PowerState } from '../../lib/energy';
import { getTourPose } from '../../lib/tour';
import { fitTourCamera, getTourFrame } from '../../lib/framing';
import { getHouseLighting } from '../../lib/lighting';
import { faceGeometry } from '../../lib/product-face';
type Device='lights'|'climate'|'standby';
type Props={progress:number;chapter:number;power:PowerState;rotation:number;reducedMotion:boolean;resetView:number;onToggle:(device:Device)=>void;onReady:()=>void;onProgress:(value:number)=>void;onError:()=>void};
const DEVICE_LABELS={lights:'All home lighting',climate:'Bedroom AC',standby:'Entertainment standby'};
export default function HomeScene(props:Props){
 const host=useRef<HTMLDivElement>(null),latest=useRef(props);latest.current=props;
 const labels=useRef<Record<Device,HTMLButtonElement|null>>({lights:null,climate:null,standby:null});
 const [status,setStatus]=useState<'loading'|'ready'|'fallback'>('loading');
 useEffect(()=>{if(status==='ready')props.onReady();else if(status==='fallback')props.onError();},[status,props.onReady,props.onError]);
 useEffect(()=>{
  const element=host.current;if(!element)return;const el:HTMLDivElement=element;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{setStatus('fallback');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,350);const pose=getTourPose(latest.current.progress);camera.position.copy(pose.camera);camera.lookAt(pose.target);
  const ambient=new THREE.HemisphereLight('#e4e4e4','#282421',2.2);scene.add(ambient);
  const moon=new THREE.DirectionalLight('#c3d9ec',2.2);moon.position.set(-15,20,12);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-18;moon.shadow.camera.right=18;moon.shadow.camera.top=16;moon.shadow.camera.bottom=-16;moon.shadow.bias=-.001;scene.add(moon);
  const sun=new THREE.DirectionalLight('#ffcd91',2.8);sun.position.set(5,12,18);scene.add(sun);
  const roomLights:THREE.PointLight[]=[];for(const y of [1.8,5.1,8.4])for(const x of [-7,0,7]){const light=new THREE.PointLight('#ffca87',30,8,2);light.position.set(x,y,.6);roomLights.push(light);scene.add(light);}
  const ground=new THREE.Mesh(new THREE.CircleGeometry(24,80),new THREE.MeshStandardMaterial({color:'#101010',roughness:1,transparent:true,opacity:.7}));ground.rotation.x=-Math.PI/2;ground.position.y=-.14;ground.receiveShadow=true;scene.add(ground);
  const plinthRing=new THREE.Mesh(new THREE.RingGeometry(16,16.035,128),new THREE.MeshBasicMaterial({color:'#f05a28',transparent:true,opacity:.13,side:THREE.DoubleSide}));plinthRing.rotation.x=-Math.PI/2;plinthRing.position.y=-.12;scene.add(plinthRing);
  const materials={lights:[] as THREE.MeshStandardMaterial[],houseTv:[] as THREE.MeshStandardMaterial[],tv:[] as THREE.MeshStandardMaterial[],climate:[] as THREE.MeshStandardMaterial[]};
  let alive=true,model:THREE.Group|null=null,assetsReady=false,failed=false,firstFrame=false;
  const manager=new THREE.LoadingManager();
  manager.onLoad=()=>{if(alive&&!failed){assetsReady=true;latest.current.onProgress(1);}};
  manager.onError=()=>{failed=true;if(alive)setStatus('fallback');};
  new GLTFLoader(manager).load('/assets/heseos-home.glb',gltf=>{
   if(!alive){gltf.scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>m.dispose());}});return;}
   model=gltf.scene;scene.add(model);model.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){if(m.name==='house-warm-light'&&!materials.lights.includes(m))materials.lights.push(m);if(m.name==='tv-screen'||m.name==='tv-image'){if(o.name.startsWith('theatre-')){const copy=m.clone();o.material=copy;materials.tv.push(copy);}else if(!materials.houseTv.includes(m))materials.houseTv.push(m);}if(m.name==='climate-led'&&!materials.climate.includes(m))materials.climate.push(m);}}});latest.current.onProgress(.96);
  },event=>{if(alive&&event.total>0)latest.current.onProgress(event.loaded/event.total*.9);},()=>{failed=true;if(alive)setStatus('fallback');});
  const texture=new THREE.TextureLoader(manager).load('/assets/proposal-products.jpg');texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const panelMat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});const rimMat=new THREE.MeshStandardMaterial({color:'#ba8948',metalness:.7,roughness:.3});
  const devices:THREE.Mesh[]=[];const anchors:Record<Device,THREE.Vector3>={lights:new THREE.Vector3(2.1,4.9,-2.97),climate:new THREE.Vector3(0,9.2,-2.65),standby:new THREE.Vector3(7,1.9,-2.5)};
  function mount(device:Device,w:number,h:number,corners:number[][],position:THREE.Vector3){const group=new THREE.Group();const rim=new THREE.Mesh(new RoundedBoxGeometry(w+.02,h+.02,.055,3,.02),rimMat);const surface=new THREE.Mesh(faceGeometry(w,h,corners),panelMat);surface.position.z=.035;surface.userData.device=device;group.add(rim,surface);group.position.copy(position);scene.add(group);devices.push(surface);}
  mount('lights',.64,.64,[[112,303],[474,236],[524,568],[182,640]],anchors.lights);
  mount('climate',.5,.28,[[680,420],[1120,483],[1078,694],[619,620]],new THREE.Vector3(1.95,8.02,-2.8));
  mount('standby',.25,.57,[[1219,530],[1390,499],[1500,828],[1337,863]],new THREE.Vector3(9.05,1.55,-2.97));
  // Real pick targets on the AC and TV allow taps on the components themselves.
  const hitMaterial=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
  for(const [device,size] of [['climate',[2.4,.65,.4]],['standby',[3.3,1.7,.25]]] as [Device,number[]][]){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size as [number,number,number]),hitMaterial);mesh.position.copy(anchors[device]);mesh.userData.device=device;scene.add(mesh);devices.push(mesh);}
  const airflow=new THREE.Group();scene.add(airflow);const flowMat=new THREE.LineBasicMaterial({color:'#9cdbe3',transparent:true,opacity:.24});
  for(let i=0;i<5;i++){const points=[];for(let j=0;j<16;j++)points.push(new THREE.Vector3(-.75+i*.36,8.91-j*.07,-2.1+j*.11+Math.sin(j*.5)*.07));airflow.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),flowMat));}
  let frame=0,lastFrame=0,shown=true,smoothP=latest.current.progress,drag=0,dragging=false,moved=0,lastX=0,lastReset=latest.current.resetView,lastStop=0;
  const ray=new THREE.Raycaster(),cameraTarget=new THREE.Vector3().copy(pose.target),projected=new THREE.Vector3();
  const down=(e:PointerEvent)=>{if((e.target as HTMLElement).closest('button'))return;dragging=true;moved=0;lastX=e.clientX;el.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!dragging)return;const dx=e.clientX-lastX;moved+=Math.abs(dx);drag=THREE.MathUtils.clamp(drag+dx*.003,-.55,.55);lastX=e.clientX;};
  const up=(e:PointerEvent)=>{if(!dragging)return;dragging=false;if(moved>5)return;const rect=el.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(devices)[0];if(hit)latest.current.onToggle(hit.object.userData.device);};const cancel=()=>{dragging=false;};
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',cancel);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;const area=getTourFrame(w,h);camera.setViewOffset(w,h,-(area.x-.5)*w,-(area.y-.5)*h,w,h);camera.updateProjectionMatrix();
   // Fit immediately on first load and orientation changes, avoiding a cropped first frame.
   const current=getTourPose(latest.current.progress,latest.current.reducedMotion);
   const direction=current.camera.clone().sub(current.target).applyAxisAngle(new THREE.Vector3(0,1,0),drag+latest.current.rotation);
   camera.position.copy(fitTourCamera(current.target,direction,current.bounds,camera.aspect,area));cameraTarget.copy(current.target);camera.lookAt(cameraTarget);smoothP=latest.current.progress;
  };const ro=new ResizeObserver(resize);ro.observe(el);resize();const io=new IntersectionObserver(([entry])=>{shown=entry.isIntersecting;});io.observe(el);
  function animate(time:number){frame=requestAnimationFrame(animate);if((!shown&&firstFrame)||document.hidden||time-lastFrame<30)return;lastFrame=time;const p=latest.current,t=p.reducedMotion?1:.085;
   if(lastReset!==p.resetView||lastStop!==p.chapter){drag=0;lastReset=p.resetView;lastStop=p.chapter;}
   smoothP=THREE.MathUtils.lerp(smoothP,p.progress,t);const desired=getTourPose(smoothP,p.reducedMotion);const offset=desired.camera.clone().sub(desired.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),drag+p.rotation);
   const area=getTourFrame(el.clientWidth,el.clientHeight);
   const framedPosition=fitTourCamera(desired.target,offset,desired.bounds,camera.aspect,area);
   camera.position.lerp(framedPosition,t);cameraTarget.lerp(desired.target,t);camera.lookAt(cameraTarget);
   const lighting=getHouseLighting(p.power);const away=!p.power.lights&&!p.power.climate&&!p.power.standby;
   roomLights.forEach(l=>{l.intensity=THREE.MathUtils.lerp(l.intensity,lighting.pointIntensity,t);});
   materials.lights.forEach(m=>{m.emissiveIntensity=THREE.MathUtils.lerp(m.emissiveIntensity,lighting.emission,t);m.color.set(lighting.level>0?'#ffe0a9':'#242424');});
   materials.houseTv.forEach(m=>{m.emissiveIntensity=away?0:.4;m.color.set(away?'#030707':'#132a33');});materials.tv.forEach(m=>{m.emissiveIntensity=THREE.MathUtils.lerp(m.emissiveIntensity,p.power.standby?.65:0,t);m.color.set(p.power.standby?'#132a33':'#030707');});materials.climate.forEach(m=>{m.emissiveIntensity=p.power.climate?1.4:0;m.color.set(p.power.climate?'#a4d4e3':'#39424b');});flowMat.opacity=THREE.MathUtils.lerp(flowMat.opacity,p.power.climate?.28:0,t);airflow.position.y=p.reducedMotion?0:Math.sin(time*.002)*.045;
   ambient.intensity=THREE.MathUtils.lerp(ambient.intensity,lighting.ambient,t);sun.intensity=THREE.MathUtils.lerp(sun.intensity,lighting.sun,t);
   moon.intensity=THREE.MathUtils.lerp(moon.intensity,lighting.moon,t);
   try{renderer.render(scene,camera);}catch{if(!failed){failed=true;setStatus('fallback');}return;}
   if(assetsReady&&model&&!failed&&!firstFrame){firstFrame=true;setStatus('ready');}
   const copy=el.clientWidth<=760?el.closest('.story-stage')?.querySelector('.tour-copy')?.getBoundingClientRect():null;
   const minimumLabelTop=copy?copy.bottom-el.getBoundingClientRect().top+14:30;
   (['lights','climate','standby'] as Device[]).forEach((device,i)=>{const label=labels.current[device];if(!label)return;projected.copy(anchors[device]).project(camera);const x=(projected.x*.5+.5)*el.clientWidth,y=(-projected.y*.5+.5)*el.clientHeight;const visible=!!model&&p.chapter===i+1&&projected.z<1&&x>20&&x<el.clientWidth-20&&y>20&&y<el.clientHeight-70;label.style.opacity=visible?'1':'0';label.style.pointerEvents=visible?'auto':'none';label.style.visibility=visible?'visible':'hidden';label.style.left=`${Math.min(el.clientWidth-100,Math.max(100,x))}px`;label.style.top=`${Math.max(minimumLabelTop+label.offsetHeight,y-50)}px`;});
  }
  frame=requestAnimationFrame(animate);const lost=(e:Event)=>{e.preventDefault();setStatus('fallback');};renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{alive=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',cancel);const mats=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));}});mats.forEach(m=>m.dispose());texture.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className={'home-canvas '+status} ref={host} aria-label="Interactive complete three-dimensional Heseos home" role="group">{status!=='ready'&&<div className="home-loading">{status==='loading'?<><span className="loading-ring"/><span>Opening your home…</span></>:<><img src="/assets/home.jpg" alt="Heseos home from the proposal"/><span>3D unavailable here. Use the room controls to explore.</span></>}</div>}{(['lights','climate','standby'] as Device[]).map(device=><button key={device} ref={node=>{labels.current[device]=node;}} className={'device-hotspot '+(props.power[device]?'on':'off')} aria-label={'3D '+DEVICE_LABELS[device]} role="switch" aria-checked={props.power[device]} onClick={()=>props.onToggle(device)}><i/><span>{DEVICE_LABELS[device]}<small>{props.power[device]?'ON · TAP TO SWITCH OFF':'OFF · TAP TO SWITCH ON'}</small></span><b>{props.power[device]?'●':'○'}</b></button>)}</div>;
}
