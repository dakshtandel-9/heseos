'use client';

import { useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function HeroScene({dayImage,nightImage,children}:{dayImage:string;nightImage:string;children:ReactNode}){
 const [mode,setMode]=useState<'day'|'night'>('night');

 return <section className={`hx hx-${mode}`} aria-labelledby="hero-title">
  <div className="hx-media" aria-hidden="true">
   <img className="hx-day-image" src={dayImage} alt="" fetchPriority="high"/>
   <img className="hx-night-image" src={nightImage} alt=""/>
  </div>
  <div className="hw hx-inner"><div className="hx-copy">{children}</div></div>
  <div className="hw hx-dock">
   <div className="hx-mode" role="group" aria-label="View the home by time of day">
    <button type="button" aria-pressed={mode==='day'} onClick={()=>setMode('day')}><Sun size={18} strokeWidth={1.8}/><span>Day mode</span></button>
    <button type="button" aria-pressed={mode==='night'} onClick={()=>setMode('night')}><Moon size={18} strokeWidth={1.8}/><span>Night mode</span></button>
   </div>
   <span className="hx-caption">A home that thinks about energy, around the clock.</span>
  </div>
 </section>;
}
