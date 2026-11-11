'use client';
import { useState } from 'react';
// "Try it yourself": one room photographed three ways (off, warm 2700K, cool 6500K). Brightness fades the lit photos in over the dark one;
// colour temperature blends warm into cool. Kelvin is shown on the scale the CCT downlights cover.
const WARM=2700,COOL=6500;
export default function LightTry({off,warm,cool,alt}:{off:string;warm:string;cool:string;alt:string}){
 const [level,setLevel]=useState(80),[kelvin,setKelvin]=useState(3000);
 const mix=(kelvin-WARM)/(COOL-WARM),lit=level/100;
 return <div className="sl-try">
  {/* The frame keeps a fixed size; only the photos inside it zoom from slightly enlarged to 1× as the room scrolls into place. */}
  <div className="sl-room" data-scroll="view">
   <div className="sl-room-media">
    <img src={off} alt={alt} loading="lazy"/>
    <img src={warm} alt="" loading="lazy" style={{opacity:lit*(1-mix)}}/>
    <img src={cool} alt="" loading="lazy" style={{opacity:lit*mix}}/>
   </div>
   <p className="sl-readout" aria-live="polite"><b>{level}%</b> · {kelvin.toLocaleString('en-IN')}K</p>
  </div>
  <div className="sl-controls">
   <label><span>Brightness <output>{level}%</output></span>
    <input type="range" min={0} max={100} value={level} onChange={e=>setLevel(+e.target.value)} className="sl-range sl-range--level" style={{'--v':`${level}%`} as React.CSSProperties}/>
   </label>
   <label><span>Colour <output>{kelvin<3500?'Warm white':kelvin<5000?'Natural white':'Cool daylight'}</output></span>
    <input type="range" min={WARM} max={COOL} step={100} value={kelvin} onChange={e=>setKelvin(+e.target.value)} className="sl-range sl-range--cct"/>
   </label>
  </div>
 </div>;
}
