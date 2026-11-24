'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { ReelChapter } from '../../../lib/testimonials';
import './testimonials.css';

// The highlight reel: one stitched video, story-style progress bars, and a kinetic quote that changes with each speaker.
export default function TestimonialReel({src,poster,chapters,compact}:{src:string;poster:string;chapters:ReelChapter[];compact?:boolean}){
 const vid=useRef<HTMLVideoElement>(null),root=useRef<HTMLDivElement>(null),bars=useRef<HTMLDivElement>(null);
 const [idx,setIdx]=useState(0),[muted,setMuted]=useState(true),[playing,setPlaying]=useState(false);
 const userPaused=useRef(false);
 const chapterAt=useCallback((t:number)=>{let i=0;chapters.forEach((c,k)=>{if(t>=c.start-.05)i=k;});return i;},[chapters]);

 // Paint the progress bars every frame while playing; React state only changes when the speaker does.
 useEffect(()=>{
  const v=vid.current;if(!v)return;let raf=0;
  const paint=()=>{
   const t=v.currentTime,i=chapterAt(t);
   bars.current?.querySelectorAll<HTMLElement>('i').forEach((b,k)=>{const c=chapters[k];b.style.transform=`scaleX(${Math.min(1,Math.max(0,(t-c.start)/(c.end-c.start)))})`;});
   setIdx(p=>p===i?p:i);
  };
  const tick=()=>{paint();raf=requestAnimationFrame(tick);};
  const on=()=>{setPlaying(true);cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);};
  const off=()=>{setPlaying(false);cancelAnimationFrame(raf);paint();};
  const seeked=()=>{if(v.paused)paint();};
  v.addEventListener('play',on);v.addEventListener('pause',off);v.addEventListener('seeked',seeked);
  return()=>{cancelAnimationFrame(raf);v.removeEventListener('play',on);v.removeEventListener('pause',off);v.removeEventListener('seeked',seeked);};
 },[chapters,chapterAt]);

 // Autoplay (muted) while on screen, unless reduced motion is on or the visitor paused it.
 useEffect(()=>{
  const v=vid.current,el=root.current;if(!v||!el)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){if(!userPaused.current)v.play().catch(()=>{});}else v.pause();},{threshold:.35});
  io.observe(el);return()=>io.disconnect();
 },[]);

 const toggle=()=>{const v=vid.current;if(!v)return;if(v.paused){userPaused.current=false;v.play().catch(()=>{});}else{userPaused.current=true;v.pause();}};
 const sound=()=>{const v=vid.current;if(!v)return;v.muted=!v.muted;setMuted(v.muted);if(!v.muted&&v.paused){userPaused.current=false;v.play().catch(()=>{});}};
 const jump=(i:number)=>{const v=vid.current;if(!v)return;v.currentTime=chapters[i].start+.02;setIdx(i);userPaused.current=false;v.play().catch(()=>{});};
 const c=chapters[idx];

 return <div ref={root} className={'tr'+(compact?' tr-compact':'')}>
  <div className="tr-phone">
   <video ref={vid} src={src} poster={poster} muted playsInline loop preload="metadata" onClick={toggle} aria-label="Heseos customer testimonial highlight reel"/>
   <div className="tr-bars" ref={bars} aria-hidden="true">{chapters.map(ch=><span key={ch.slug}><i/></span>)}</div>
   <div className="tr-tag" key={'t'+idx}><b>{c.name}</b><span>{c.place}</span></div>
   <div className="tr-ctl">
    <button type="button" onClick={toggle} aria-label={playing?'Pause reel':'Play reel'}>{playing?<Pause size={16}/>:<Play size={16}/>}</button>
    <button type="button" onClick={sound} aria-label={muted?'Turn sound on':'Mute'} className={muted?'pulse':''}>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}<span>{muted?'Tap for sound':'Sound on'}</span></button>
   </div>
  </div>
  <div className="tr-side">
   <span className="tr-count"><b>{String(idx+1).padStart(2,'0')}</b> / {String(chapters.length).padStart(2,'0')}</span>
   <blockquote className="tr-quote" key={'q'+idx} aria-live="polite">
    {c.line.split(' ').map((w,i)=><span key={i} className="kw"><span style={{animationDelay:`${i*55}ms`}}>{w}</span></span>)}
   </blockquote>
   <p className="tr-who" key={'w'+idx}><b>{c.name}</b> · {c.place}</p>
   <ul className="tr-people" aria-label="Jump to a speaker">{chapters.map((ch,i)=><li key={ch.slug}>
    <button type="button" onClick={()=>jump(i)} className={i===idx?'on':''} aria-current={i===idx}>
     <img src={ch.avatar} alt="" loading="lazy"/><span>{ch.name}</span>
    </button></li>)}</ul>
  </div>
 </div>;
}
