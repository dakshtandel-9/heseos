'use client';
import { useEffect, useRef, useState } from 'react';
// The shop's sticky aisle index: marks the aisle in view and keeps its chip scrolled into sight.
export default function AisleNav({aisles}:{aisles:{slug:string;name:string}[]}){
 const [active,setActive]=useState(-1),list=useRef<HTMLOListElement>(null);
 useEffect(()=>{
  const els=aisles.map(a=>document.getElementById(a.slug)).filter((el):el is HTMLElement=>!!el);
  const update=()=>{
   const line=innerHeight*.45;let i=-1;
   els.forEach((el,k)=>{const r=el.getBoundingClientRect();if(r.top<=line&&r.bottom>line)i=k;});
   setActive(i);
  };
  update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);
  return()=>{removeEventListener('scroll',update);removeEventListener('resize',update);};
 },[aisles]);
 useEffect(()=>{
  const ol=list.current,chip=ol?.children[active] as HTMLElement|undefined;
  if(ol&&chip)ol.scrollTo({left:chip.offsetLeft-ol.clientWidth/2+chip.offsetWidth/2,behavior:'smooth'});
 },[active]);
 return <nav className="sh-nav" aria-label="Aisles">
  <ol ref={list}>{aisles.map((a,i)=><li key={a.slug}><a href={'#'+a.slug} aria-current={i===active||undefined}><span>{String(i+1).padStart(2,'0')}</span>{a.name}</a></li>)}</ol>
 </nav>;
}
