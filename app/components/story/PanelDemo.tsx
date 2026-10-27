'use client';
import { useState } from 'react';
const SCENES=[{id:'home',label:'Home',image:'/media/home/living-home.webp',alt:'Living room with every light on'},{id:'evening',label:'Evening',image:'/media/home/living-evening.webp',alt:'Living room dimmed for the evening'},{id:'away',label:'Away',image:'/media/home/living-away.webp',alt:'Living room with the lights off'}];
// Three scenes on a glass panel, rendered in the Heseos Simulation.
export default function PanelDemo(){
 const [active,setActive]=useState('evening');
 return <div className="panel-demo">
  <div className="panel-demo-media">{SCENES.map(s=><img key={s.id} src={s.image} alt={s.alt} className={s.id===active?'active':''} loading="lazy" aria-hidden={s.id!==active}/>)}</div>
  <div className="glass-panel panel-demo-panel" role="radiogroup" aria-label="Lighting scene">{SCENES.map(s=><button key={s.id} role="radio" aria-checked={s.id===active} className={s.id===active?'on':''} onClick={()=>setActive(s.id)}><i aria-hidden="true"/>{s.label}</button>)}</div>
 </div>;
}
