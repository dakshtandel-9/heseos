'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { DeviceId } from '../../../lib/devices';
// three.js loads only when the viewer comes near the screen, and never on the server.
const ProductStage=dynamic(()=>import('./ProductStage'),{ssr:false,loading:()=><div className="product-viewer-canvas"/>});
export default function ProductViewer({device,name}:{device:DeviceId;name:string}){
 const holder=useRef<HTMLDivElement>(null),[near,setNear]=useState(false);
 useEffect(()=>{const el=holder.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setNear(true);io.disconnect();}},{rootMargin:'600px 0px'});io.observe(el);return()=>io.disconnect();},[]);
 return <div ref={holder}>{near?<ProductStage device={device} name={name}/>:<div className="product-viewer"><div className="product-viewer-canvas"/></div>}</div>;
}
