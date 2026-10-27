'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from './usePlatform';
// The product turns to face the visitor as the section scrolls past. Reduced motion shows it face-on.
export default function ScrollRotate({src,alt}:{src:string;alt:string}){
 const section=useRef<HTMLDivElement>(null),image=useRef<HTMLImageElement>(null),reduced=useReducedMotion();
 useEffect(()=>{
  const el=section.current,img=image.current;if(!el||!img)return;
  if(reduced){img.style.transform='';img.style.opacity='1';return;}
  let raf=0;
  const update=()=>{raf=0;const r=el.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(r.height+innerHeight*.2)));const k=1-(1-Math.min(1,p*1.6))**3;
   img.style.transform=`perspective(1600px) rotateY(${(1-k)*-38}deg) rotateX(${(1-k)*8}deg) scale(${.82+.18*k})`;img.style.opacity=String(.25+.75*k);
   el.style.setProperty('--glow',String(k));};
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);};
 },[reduced]);
 return <div className="scroll-rotate" ref={section}><img ref={image} src={src} alt={alt}/></div>;
}
