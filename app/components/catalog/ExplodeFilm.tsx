'use client';
import { useEffect, useRef, useState } from 'react';
// The exploded-view film, scrubbed by scroll: its time follows the pinned hero's progress (--p, set and eased by
// ScrollScenes), so scrolling down takes the device apart and scrolling back puts it together. The film runs over
// START…START+SPAN of the scene, leaving a beat closed at the start and a beat exploded at the end. That run is also
// written to the hero as --open and data-open, which the rail, the pins and the parts key read. The file has a keyframe
// every 4 frames and no B-frames, so seeking stays smooth. With reduced motion the hero shows the exploded still.
// The same player scrubs any pinned [data-film] scene (start/span set where its run sits in that scene).
export default function ExplodeFilm({src,srcSmall,poster,still,label,start=.04,span=.74}:{src:string;srcSmall:string;poster:string;still:string;label:string;start?:number;span?:number}){
 const ref=useRef<HTMLVideoElement>(null);
 const [isStill,setStill]=useState(false);
 useEffect(()=>{
  const START=start,SPAN=span;
  const v=ref.current,hero=v?.closest<HTMLElement>('[data-explode],[data-film]');
  if(!v||!hero)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setStill(true);hero.dataset.open='true';hero.style.setProperty('--open','1');return;}
  v.play().then(()=>v.pause()).catch(()=>{}); // lets iOS decode frames for seeking
  let frame=0,last=-1;
  const tick=()=>{
   const p=parseFloat(hero.style.getPropertyValue('--p'))||0;
   const run=Math.min(1,Math.max(0,(p-START)/SPAN));
   if(Math.abs(run-last)>.0005&&v.readyState>=1&&!v.seeking){
    v.currentTime=run*Math.max(0,v.duration-.05);last=run;
    hero.style.setProperty('--open',run.toFixed(3));hero.dataset.open=String(run>.97);
   }
   frame=requestAnimationFrame(tick);
  };
  const io=new IntersectionObserver(([e])=>{cancelAnimationFrame(frame);frame=e.isIntersecting?requestAnimationFrame(tick):0;});
  io.observe(hero);
  return()=>{io.disconnect();cancelAnimationFrame(frame);};
 },[start,span]);
 if(isStill)return <div className="xh-film"><img src={still} alt={label}/></div>;
 return <div className="xh-film" role="img" aria-label={label}>
  <video ref={ref} muted playsInline preload="auto" poster={poster} disablePictureInPicture tabIndex={-1}>
   <source src={srcSmall} type="video/mp4" media="(max-width: 860px)"/>
   <source src={src} type="video/mp4"/>
  </video>
 </div>;
}
