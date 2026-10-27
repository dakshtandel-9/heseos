'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { irBlaster, smartPlug, touchPanel, type Model } from '../../../lib/device-models';
import type { DeviceId } from '../../../lib/devices';
import PlayToggle from './PlayToggle';
import { useReducedMotion, useWebGLSupport } from './usePlatform';
const BUILD:Record<DeviceId,()=>Model>={'touch-panel':touchPanel,'ir-blaster':irBlaster,'smart-plug':smartPlug};
// A turntable of the illustrative device model: drag to turn it, switch it on to see its lights.
export default function ProductStage({device,name}:{device:DeviceId;name:string}){
 const mount=useRef<HTMLDivElement>(null),reduced=useReducedMotion(),webgl=useWebGLSupport();
 const [on,setOn]=useState(true),[spinning,setSpinning]=useState(true);
 const state=useRef({on,spinning});
 useEffect(()=>{state.current={on,spinning:spinning&&!reduced};},[on,spinning,reduced]);
 useEffect(()=>{
  const el=mount.current;if(!el||!webgl)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(el.clientWidth,el.clientHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
  const model=BUILD[device](),pivot=new THREE.Group();pivot.add(model.group);scene.add(pivot);
  // Frame only what is visible, so effects like the IR signal ring do not shrink the product.
  const box=new THREE.Box3();model.group.traverseVisible(o=>{if((o as THREE.Mesh).isMesh)box.expandByObject(o,true);});
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  model.group.position.sub(center);
  const camera=new THREE.PerspectiveCamera(30,el.clientWidth/el.clientHeight,.001,10),radius=size.length()/2;
  camera.position.set(0,radius*.6,radius/Math.tan(THREE.MathUtils.degToRad(15))*1.15);camera.lookAt(0,0,0);
  let yaw=-.5,pitch=.15,drag:{x:number;y:number}|null=null;
  const canvas=renderer.domElement;canvas.style.touchAction='pan-y';canvas.style.cursor='grab';
  const down=(e:PointerEvent)=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';};
  const move=(e:PointerEvent)=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.01;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-drag.y)*.006,-.6,.8);drag={x:e.clientX,y:e.clientY};};
  const up=()=>{drag=null;canvas.style.cursor='grab';};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  const resize=new ResizeObserver(()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();});resize.observe(el);
  const timer=new THREE.Timer();timer.connect(document);let time=0;
  renderer.setAnimationLoop(now=>{timer.update(now);const dt=Math.min(timer.getDelta(),.1);time+=dt;if(state.current.spinning&&!drag)yaw+=dt*.35;pivot.rotation.set(pitch,yaw,0);model.update(state.current.on,1,time,dt);renderer.render(scene,camera);});
  return()=>{renderer.setAnimationLoop(null);timer.dispose();resize.disconnect();model.dispose();pmrem.dispose();scene.environment?.dispose();renderer.dispose();el.removeChild(canvas);};
 },[device,webgl]);
 return <div className="product-viewer">
  <div ref={mount} className="product-viewer-canvas" role="img" aria-label={`${name}, illustrative 3D model. Drag to turn it.`}/>
  {!webgl?<p className="muted center">3D isn’t available in this browser.</p>:<div className="product-viewer-controls">
   <div className="segmented small" role="radiogroup" aria-label="Device state"><button role="radio" aria-checked={on} onClick={()=>setOn(true)}>On</button><button role="radio" aria-checked={!on} onClick={()=>setOn(false)}>Off</button></div>
   {!reduced&&<PlayToggle playing={spinning} onToggle={()=>setSpinning(s=>!s)} label="rotation"/>}
  </div>}
 </div>;
}
