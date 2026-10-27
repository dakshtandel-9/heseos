'use client';
import { useEffect, useRef, useState } from 'react';
import PlayToggle from './PlayToggle';
import { useReducedMotion } from './usePlatform';
// A muted loop that only plays while on screen, with its own pause button.
export default function LoopVideo({src,poster,label,className=''}:{src:string;poster:string;label:string;className?:string}){
 const video=useRef<HTMLVideoElement>(null),reduced=useReducedMotion(),[playing,setPlaying]=useState(false),[userPaused,setUserPaused]=useState(false);
 useEffect(()=>{
  const v=video.current;if(!v||reduced||userPaused)return;
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)v.play().catch(()=>{});else v.pause();},{threshold:.35});
  io.observe(v);return()=>io.disconnect();
 },[reduced,userPaused]);
 if(reduced)return <img className={className} src={poster} alt=""/>;
 return <div className={'loop-video '+className}>
  <video ref={video} src={src} poster={poster} muted loop playsInline preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-hidden="true"/>
  <PlayToggle playing={playing} label={label} onToggle={()=>{const v=video.current;if(!v)return;if(v.paused){setUserPaused(false);void v.play();}else{setUserPaused(true);v.pause();}}}/>
 </div>;
}
