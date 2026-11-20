'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Power } from 'lucide-react';
import SiteLink from '../site/SiteLink';
// "Pick your finish": the six Elegance collections, seen from below as you would see them overhead. The fan sits still so the finish
// reads clearly; "Switch on" spins it up and lets it coast down again, the way a BLDC motor ramps. Speed eases toward its target each frame.
export type Finish={slug:string;name:string;tagline:string;href:string;image:string;colours:{id:string;label:string;swatch?:string}[]};
const MAX=14;// degrees per frame at full speed
export default function FanFinish({finishes}:{finishes:Finish[]}){
 const [i,setI]=useState(0),[on,setOn]=useState(false);
 const rotor=useRef<HTMLDivElement>(null),state=useRef({angle:0,speed:0,frame:0});
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const s=state.current,target=on?MAX:0;
  const tick=()=>{
   s.speed+=(target-s.speed)*(on?.025:.018);if(Math.abs(target-s.speed)<.02)s.speed=target;
   s.angle=(s.angle+s.speed)%360;
   const el=rotor.current;if(el){el.style.transform=`rotate(${s.angle}deg)`;el.style.setProperty('--blur',(s.speed/MAX).toFixed(3));}
   s.frame=s.speed>0||target>0?requestAnimationFrame(tick):0;
  };
  cancelAnimationFrame(s.frame);s.frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(s.frame);
 },[on]);
 const f=finishes[i];
 return <div className="bf-pick">
  <div className="bf-pick-stage">
   <div className="bf-rotor" ref={rotor}>
    {finishes.map((x,k)=><img key={x.slug} src={x.image} alt={k===i?`${x.name}, seen from below`:''} aria-hidden={k!==i||undefined} data-active={k===i||undefined} loading="lazy"/>)}
    <div className="bf-rotor-blur" aria-hidden="true"><img src={f.image} alt=""/><img src={f.image} alt=""/></div>
   </div>
   <button type="button" className="bf-power" aria-pressed={on} onClick={()=>setOn(v=>!v)}><Power size={15} aria-hidden="true"/>{on?'Switch off':'Switch on'}</button>
  </div>
  <div className="bf-pick-info">
   <p className="bf-kicker">Collection {i+1} of {finishes.length}</p>
   <h3 aria-live="polite">{f.name.replace(/^Elegance /,'')}</h3>
   <p className="bf-pick-tagline">{f.tagline}</p>
   <div className="bf-swatches" role="radiogroup" aria-label="Collection">
    {finishes.map((x,k)=><button key={x.slug} type="button" role="radio" aria-checked={k===i} aria-label={x.name} title={x.name.replace(/^Elegance /,'')} onClick={()=>setI(k)}><img src={x.image} alt=""/></button>)}
   </div>
   <p className="bf-colours"><small>{f.colours.length>1?`In ${f.colours.length} colours`:'One colour'}</small>{f.colours.map(c=><span key={c.id}><i style={{background:c.swatch}}/>{c.label}</span>)}</p>
   <SiteLink className="bf-link" href={f.href}>Explore {f.name} <ChevronRight size={15} aria-hidden="true"/></SiteLink>
  </div>
 </div>;
}
