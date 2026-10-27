'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import PlayToggle from './PlayToggle';
import { useReducedMotion } from './usePlatform';
export type Highlight={image:string;title:string;body:string};
// Apple-style highlights: a scroll-snapped strip that advances on its own until the visitor pauses or interacts.
export default function HighlightsCarousel({items}:{items:Highlight[]}){
 const track=useRef<HTMLDivElement>(null),reduced=useReducedMotion();
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(true);
 const go=useCallback((i:number)=>{const t=track.current,slide=t?.children[i] as HTMLElement|undefined;if(t&&slide)t.scrollTo({left:slide.offsetLeft-t.offsetLeft-(t.clientWidth-slide.clientWidth)/2,behavior:reduced?'instant':'smooth'});},[reduced]);
 useEffect(()=>{
  const t=track.current;if(!t)return;
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive(Number((e.target as HTMLElement).dataset.index));},{root:t,threshold:.6});
  Array.from(t.children).forEach(c=>io.observe(c));return()=>io.disconnect();
 },[]);
 useEffect(()=>{if(!playing||reduced)return;const id=setTimeout(()=>go((active+1)%items.length),5000);return()=>clearTimeout(id);},[active,playing,reduced,go,items.length]);
 return <div className="highlights" onPointerDown={()=>setPlaying(false)}>
  <div className="highlights-track" ref={track} tabIndex={0} aria-label="Highlights" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setPlaying(false);go(Math.min(items.length-1,active+1));}if(e.key==='ArrowLeft'){e.preventDefault();setPlaying(false);go(Math.max(0,active-1));}}}>
   {items.map((h,i)=><figure key={h.title} className="highlight" data-index={i} aria-hidden={i!==active}>
    <img src={h.image} alt="" loading={i===0?'eager':'lazy'}/><figcaption><strong>{h.title}</strong> {h.body}</figcaption>
   </figure>)}
  </div>
  <div className="highlights-controls">
   <div className="dots" role="group" aria-label="Choose a highlight">{items.map((h,i)=><button key={h.title} aria-label={h.title} aria-current={i===active} onClick={()=>{setPlaying(false);go(i);}}><span className={i===active&&playing&&!reduced?'run':''}/></button>)}</div>
   {!reduced&&<PlayToggle playing={playing} onToggle={()=>setPlaying(p=>!p)} label="highlights"/>}
  </div>
 </div>;
}
