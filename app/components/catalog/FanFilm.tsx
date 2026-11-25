'use client';
import { useEffect, useRef } from 'react';
// A film scrubbed by scroll: its time follows the enclosing scene's progress (--p, set and eased by ScrollScenes). Between
// start and start+span of the scene it runs from `from` to `to` (fractions of the film), so two films can share one scene.
// Files are encoded with a keyframe every few frames so seeking stays smooth. With reduced motion ScrollScenes doesn't run,
// --p stays 0, and the poster shows.
type Props={src:string;srcSmall?:string;poster:string;start:number;span:number;from?:number;to?:number;className?:string};
export default function FanFilm({src,srcSmall,poster,start,span,from=0,to=1,className}:Props){
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const v=ref.current,scene=v?.closest<HTMLElement>('[data-scroll]');
  if(!v||!scene)return;
  v.play().then(()=>v.pause()).catch(()=>{}); // lets iOS decode frames for seeking
  let frame=0,last=-1;
  const tick=()=>{
   const p=parseFloat(scene.style.getPropertyValue('--p'))||0;
   const t=from+(to-from)*Math.min(1,Math.max(0,(p-start)/span));
   if(Math.abs(t-last)>.0005&&v.readyState>=1&&!v.seeking){v.currentTime=t*Math.max(0,v.duration-.05);last=t;}
   frame=requestAnimationFrame(tick);
  };
  const io=new IntersectionObserver(([e])=>{cancelAnimationFrame(frame);frame=e.isIntersecting?requestAnimationFrame(tick):0;});
  io.observe(scene);
  return()=>{io.disconnect();cancelAnimationFrame(frame);};
 },[start,span,from,to]);
 return <video ref={ref} className={className} muted playsInline preload="auto" poster={poster} disablePictureInPicture tabIndex={-1} aria-hidden="true">
  {srcSmall&&<source src={srcSmall} type="video/mp4" media="(max-width: 860px)"/>}
  <source src={src} type="video/mp4"/>
 </video>;
}
