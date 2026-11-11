'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
type Step={name:string;phrase:string;title:string;body:string;caption:string;image:string;width:number;height:number;alt:string};
// How it works: an index of four steps beside one photograph. Choosing a step crossfades the photo and swaps the copy; nothing advances on its own.
// Every panel and photo stays mounted in one cell, so the layout keeps the size of the longest step.
export default function HowItWorks({steps}:{steps:readonly Step[]}){
 const [active,setActive]=useState(0),tabs=useRef<(HTMLButtonElement|null)[]>([]),n=steps.length;
 function select(i:number){setActive(i);tabs.current[i]?.focus();}
 function onKey(e:KeyboardEvent){
  const to=({ArrowDown:active+1,ArrowRight:active+1,ArrowUp:active-1,ArrowLeft:active-1,Home:0,End:n-1} as Record<string,number>)[e.key];
  if(to===undefined)return;
  e.preventDefault();select((to+n)%n);
 }
 return <div className="how-grid" style={{'--i':active,'--n':n} as CSSProperties}>
  <div className="how-nav" role="tablist" aria-label="Four steps to a connected home" onKeyDown={onKey}>
   {steps.map((s,i)=><button key={s.name} ref={el=>{tabs.current[i]=el;}} type="button" role="tab" id={`how-tab-${i}`} aria-selected={i===active} aria-controls={`how-panel-${i}`} tabIndex={i===active?0:-1} onClick={()=>setActive(i)}>
    <span className="how-n">0{i+1}</span><span className="how-name">{s.name}</span><span className="how-phrase">{s.phrase}</span>
   </button>)}
   <span className="how-bar" aria-hidden="true"/>
  </div>
  <figure className="how-media">
   {steps.map((s,i)=><img key={s.image} src={s.image} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async" fetchPriority={i===0?'auto':'low'} className={i===active?'on':undefined} aria-hidden={i!==active||undefined}/>)}
   <figcaption aria-hidden="true"><b>0{active+1}</b><span key={active}>{steps[active].caption}</span></figcaption>
  </figure>
  <div className="how-copy">
   {steps.map((s,i)=><div key={s.name} role="tabpanel" id={`how-panel-${i}`} aria-labelledby={`how-tab-${i}`} tabIndex={i===active?0:undefined} className={i===active?'on':undefined}>
    <h3>{s.title}</h3><p>{s.body}</p>
   </div>)}
  </div>
  <SiteLink className="how-cta" href="/demo">Book a Free Demo <ArrowRight size={16} aria-hidden="true"/></SiteLink>
 </div>;
}
