'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import PlayToggle from './PlayToggle';
import { useReducedMotion } from './usePlatform';
// Headline over a full-width film that plays once. The poster is its first frame; reduced motion shows the finished still instead.
export default function VideoHero({src,poster,still,label,children}:{src:string;poster:string;still:string;label:string;children:ReactNode}){
 const video=useRef<HTMLVideoElement>(null),reduced=useReducedMotion(),[playing,setPlaying]=useState(false);
 useEffect(()=>{const v=video.current;if(!v||reduced)return;v.play().catch(()=>setPlaying(false));},[reduced]);
 const toggle=()=>{const v=video.current;if(!v)return;if(v.paused){if(v.ended)v.currentTime=0;void v.play();}else v.pause();};
 return <section className="hero" aria-label={label}>
  <div className="hero-copy">{children}</div>
  <div className="hero-media">
   {reduced?<img src={still} alt=""/>:<video ref={video} src={src} poster={poster} muted playsInline preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} aria-hidden="true"/>}
   {!reduced&&<PlayToggle playing={playing} onToggle={toggle} label={label} className="hero-toggle"/>}
  </div>
 </section>;
}
