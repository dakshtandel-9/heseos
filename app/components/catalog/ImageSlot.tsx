'use client';
import { useEffect, useRef, useState } from 'react';
// An image the page is designed around but may not have yet. Until a file exists at `src` the slot is a plain grey
// frame at the image's aspect ratio; `need` describes the image to make (PRODUCT-IMAGES.md lists every slot).
export default function ImageSlot({src,alt,need,ratio,className}:{src:string;alt:string;need:string;ratio:string;className?:string}){
 const ref=useRef<HTMLImageElement>(null),[missing,setMissing]=useState(false);
 // The error can fire before hydration, so check once mounted as well.
 useEffect(()=>{const img=ref.current;if(img?.complete&&!img.naturalWidth)setMissing(true);},[]);
 return <figure className={'slot'+(missing?' is-missing':'')+(className?' '+className:'')} style={{aspectRatio:ratio.replace(':','/')}} data-need={missing?need:undefined}>
  {missing?<figcaption className="slot-ratio"><span className="sr-only">Image coming soon. </span>{ratio}</figcaption>
   :<img ref={ref} src={src} alt={alt} loading="lazy" onError={()=>setMissing(true)}/>}
 </figure>;
}
