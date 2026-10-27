'use client';
import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// A horizontal row of cards with previous/next buttons; touch and trackpads scroll it natively.
export default function CardScroller({label,children}:{label:string;children:ReactNode}){
 const track=useRef<HTMLDivElement>(null);
 const page=(dir:number)=>track.current?.scrollBy({left:dir*track.current.clientWidth*.8,behavior:'smooth'});
 return <div className="card-scroller">
  <div className="card-track" ref={track} role="list" aria-label={label}>{children}</div>
  <div className="card-nav"><button aria-label="Previous" onClick={()=>page(-1)}><ChevronLeft size={20}/></button><button aria-label="Next" onClick={()=>page(1)}><ChevronRight size={20}/></button></div>
 </div>;
}
