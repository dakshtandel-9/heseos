'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
export type Step={title:string;body:ReactNode;image:string;alt:string;contain?:boolean};
// Text steps scroll by while the media stays pinned and follows the step in view. On small screens each step shows its own image.
export default function StickyMedia({steps}:{steps:Step[]}){
 const list=useRef<HTMLOListElement>(null),[active,setActive]=useState(0);
 useEffect(()=>{
  const items=Array.from(list.current?.children??[]);
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive(Number((e.target as HTMLElement).dataset.index));},{rootMargin:'-45% 0px -45% 0px'});
  items.forEach(i=>io.observe(i));return()=>io.disconnect();
 },[]);
 return <div className="sticky-media">
  <div className="sticky-media-frame" aria-hidden="true">{steps.map((s,i)=><img key={s.image} src={s.image} alt="" className={(i===active?'active ':'')+(s.contain?'contain':'')} loading="lazy"/>)}</div>
  <ol className="sticky-media-steps" ref={list}>{steps.map((s,i)=><li key={s.title} data-index={i} className={i===active?'active':''}>
   <img src={s.image} alt={s.alt} className={'step-image'+(s.contain?' contain':'')} loading="lazy"/><h3 className="title">{s.title}</h3><p className="lead">{s.body}</p>
  </li>)}</ol>
 </div>;
}
