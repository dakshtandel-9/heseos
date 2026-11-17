'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import './HeroSky.css';

type Beat={at:number;time:string;line:string};
const FADE=1.6;

// The homepage hero's backdrop: one evening on a ridge (sunset, then the home's lights come on), looping forever.
// Two copies of the clip crossfade at the seam so the loop never jumps; a caption follows the story beat on screen.
// Pauses while scrolled away. With reduced motion, the opening still stays and nothing plays.
export default function HeroSky({poster,posterSmall,video,videoSmall,beats,children}:{poster:string;posterSmall:string;video:string;videoSmall:string;beats:Beat[];children:ReactNode}){
 const root=useRef<HTMLElement>(null),[beat,setBeat]=useState(0),[live,setLive]=useState(false);

 useEffect(()=>{
  const sec=root.current;
  if(!sec||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const vids=[...sec.querySelectorAll('video')];
  let cur=0,swapping=false,visible=true,timer=0;
  const onTime=(e:Event)=>{
   const v=e.target as HTMLVideoElement;
   if(v!==vids[cur])return;
   let b=0;beats.forEach((x,i)=>{if(v.currentTime>=x.at)b=i;});setBeat(b);
   if(!swapping&&v.duration&&v.currentTime>v.duration-FADE-.25){
    swapping=true;const next=vids[1-cur];next.currentTime=0;
    next.play().catch(()=>{});next.classList.add('on');v.classList.remove('on');cur=1-cur;
    timer=window.setTimeout(()=>{v.pause();swapping=false;},FADE*1000+100);
   }
  };
  const playing=()=>setLive(true);
  vids.forEach(v=>{v.addEventListener('timeupdate',onTime);v.addEventListener('playing',playing);});
  vids[1].preload='auto';
  const io=new IntersectionObserver(([e])=>{
   visible=e.isIntersecting;const v=vids[cur];
   if(visible)v.play().catch(()=>{});else{v.pause();vids[1-cur].pause();}
  },{threshold:.05});
  io.observe(sec);
  return()=>{io.disconnect();clearTimeout(timer);vids.forEach(v=>{v.removeEventListener('timeupdate',onTime);v.removeEventListener('playing',playing);v.pause();});};
 },[beats]);

 const b=beats[beat];
 return <section ref={root} className={'hs'+(live?' live':'')} aria-labelledby="hero-title">
  <div className="hs-bg" aria-hidden="true">
   <picture><source media="(max-width:760px)" srcSet={posterSmall}/><img src={poster} alt="" fetchPriority="high" decoding="async"/></picture>
   {[0,1].map(i=><video key={i} className={i?'':'on'} muted playsInline preload={i?'none':'auto'} disablePictureInPicture tabIndex={-1}>
    <source media="(max-width:760px)" src={videoSmall} type="video/mp4"/>
    <source src={video} type="video/mp4"/>
   </video>)}
  </div>
  <div className="hs-shade" aria-hidden="true"/>
  {children}
  <p className="hs-story" aria-hidden="true">
   <span className="hs-steps">{beats.map((x,i)=><i key={x.at} className={i===beat?'on':i<beat?'done':''}/>)}</span>
   <b key={b.time}>{b.time}</b><span key={b.line} className="hs-line">{b.line}</span>
  </p>
 </section>;
}
