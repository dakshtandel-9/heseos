'use client';
import { useState } from 'react';
// "Pick your size": the Screen Control Panel in 4, 6 and 8 inch, one studio photo each from the brochure.
// The chosen photo fades in over the others; the model name comes from the brochure specs.
export type PanelSize={id:string;label:string;model:string;img:string;alt:string};
export default function PanelSizes({sizes}:{sizes:PanelSize[]}){
 const [pick,setPick]=useState(sizes[1]?.id??sizes[0]?.id);
 const current=sizes.find(s=>s.id===pick)??sizes[0];
 return <div className="cue-sizes">
  <div className="cue-sizes-media">{sizes.map(s=><img key={s.id} src={s.img} alt={s.id===current.id?s.alt:''} aria-hidden={s.id!==current.id} loading="lazy" data-on={s.id===current.id||undefined}/>)}</div>
  <div className="cue-sizes-pick" role="radiogroup" aria-label="Screen size">
   {sizes.map(s=><button key={s.id} type="button" role="radio" aria-checked={s.id===current.id} onClick={()=>setPick(s.id)}>{s.label}</button>)}
  </div>
  <p className="cue-sizes-model" aria-live="polite">{current.model}</p>
 </div>;
}
