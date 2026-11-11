'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageSlot from './ImageSlot';
export type PdpHighlight={title:string;body:string;src:string;alt:string;need:string};
// The product page's highlights: wide frames in a scroll-snapped row, paged with the buttons below or by swiping.
export default function PdpHighlights({items}:{items:PdpHighlight[]}){
 const track=useRef<HTMLOListElement>(null),[edge,setEdge]=useState({start:true,end:items.length<2});
 useEffect(()=>{
  const t=track.current;if(!t)return;
  const update=()=>setEdge({start:t.scrollLeft<8,end:t.scrollLeft+t.clientWidth>=t.scrollWidth-8});
  update();t.addEventListener('scroll',update,{passive:true});addEventListener('resize',update);
  return()=>{t.removeEventListener('scroll',update);removeEventListener('resize',update);};
 },[]);
 const page=(dir:number)=>{const t=track.current,first=t?.children[0] as HTMLElement|undefined;if(!t||!first)return;
  t.scrollBy({left:dir*(first.offsetWidth+parseFloat(getComputedStyle(t).columnGap||'0')),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
 return <div className="hl">
  <ol className="hl-track" ref={track} tabIndex={0} aria-label="Highlights">
   {items.map((h,i)=><li key={h.title} className="hl-item">
    <ImageSlot src={h.src} alt={h.alt} need={h.need} ratio="16:9"/>
    <div className="hl-copy"><span className="hl-num">{String(i+1).padStart(2,'0')}</span><h3>{h.title}</h3><p>{h.body}</p></div>
   </li>)}
  </ol>
  {items.length>1&&<div className="hl-controls">
   <button type="button" aria-label="Previous highlight" disabled={edge.start} onClick={()=>page(-1)}><ChevronLeft size={20}/></button>
   <button type="button" aria-label="Next highlight" disabled={edge.end} onClick={()=>page(1)}><ChevronRight size={20}/></button>
  </div>}
 </div>;
}
