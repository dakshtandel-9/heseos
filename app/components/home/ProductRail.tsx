'use client';
import { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
// A row of product cards that scrolls sideways; the arrows move it by one card.
export default function ProductRail({title,eyebrow,items}:{title:string;eyebrow:string;items:{slug:string;href:string;name:string;tagline:string;image:string;range:string}[]}){
 const track=useRef<HTMLUListElement>(null);
 const move=(dir:number)=>{const el=track.current,card=el?.firstElementChild as HTMLElement|null;if(el&&card)el.scrollBy({left:dir*(card.offsetWidth+20),behavior:'smooth'});};
 return <>
  <div className="hh">
   <div><span className="ey">{eyebrow}</span><h2 className="ht">{title}</h2></div>
   <div className="rail-nav"><button type="button" aria-label="Previous products" onClick={()=>move(-1)}><ChevronLeft size={18}/></button><button type="button" aria-label="Next products" onClick={()=>move(1)}><ChevronRight size={18}/></button></div>
  </div>
  <ul ref={track} className="rail">{items.map(p=><li key={p.slug}>
   <SiteLink href={p.href} className="rail-card">
    <span className="rail-img"><img src={p.image} alt="" loading="lazy"/><span className="rail-range">{p.range}</span></span>
    <span className="rail-copy"><b>{p.name}</b><span>{p.tagline}</span></span>
    <span className="rail-go" aria-hidden="true"><ArrowUpRight size={18}/></span>
   </SiteLink>
  </li>)}</ul>
 </>;
}
