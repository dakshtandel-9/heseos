'use client';
import { useState } from 'react';
import { Power } from 'lucide-react';
// The TV in Apartment 1 on its Smart Plug. The wattage is the simulation's illustrative standby load.
export default function PlugDemo(){
 const [on,setOn]=useState(true);
 return <div className="plug-demo">
  <div className="plug-demo-media"><img src="/media/home/tv-on.webp" alt="TV powered through the Smart Plug" className={on?'active':''} loading="lazy"/><img src="/media/home/tv-off.webp" alt="TV switched off at the Smart Plug" className={on?'':'active'} loading="lazy"/></div>
  <div className="plug-demo-control">
   <button className="sim-switch" role="switch" aria-checked={on} onClick={()=>setOn(v=>!v)}><Power size={18}/><span>TV & set-top box<small>{on?'Powered through the plug':'Switched off at the plug'}</small></span><i/></button>
   <p><strong className="tabular">{on?80:0} W</strong> through the plug <span className="muted">(illustrative)</span></p>
  </div>
 </div>;
}
