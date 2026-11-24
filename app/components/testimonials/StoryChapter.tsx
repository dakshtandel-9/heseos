'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { Testimonial } from '../../../lib/testimonials';

const fmt=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

// One customer's chapter: a sticky film with version tabs, a quote that lights up word by word as you scroll, and a transcript that follows the film.
export default function StoryChapter({t,index,total}:{t:Testimonial;index:number;total:number}){
 const [film,setFilm]=useState(0),[started,setStarted]=useState(false),[line,setLine]=useState(-1);
 const vid=useRef<HTMLVideoElement>(null),quote=useRef<HTMLQuoteElement>(null),list=useRef<HTMLOListElement>(null);
 const f=t.films[film];
 const words=t.headline.split(' ');

 // Scroll-linked highlight: --p runs 0→1 as the quote crosses the viewport.
 useEffect(()=>{
  const el=quote.current;if(!el)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.style.setProperty('--p','1');return;}
  let raf=0;
  const run=()=>{raf=0;const r=el.getBoundingClientRect(),vh=innerHeight;el.style.setProperty('--p',String(Math.min(1,Math.max(0,(vh*.9-r.top)/(vh*.55)))));};
  const on=()=>{if(!raf)raf=requestAnimationFrame(run);};
  run();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',on);removeEventListener('resize',on);};
 },[]);

 // Follow the film in the transcript.
 useEffect(()=>{
  const v=vid.current;if(!v)return;
  const on=()=>{const tt=v.currentTime;let i=-1;f.transcript.forEach(([s],k)=>{if(tt>=s)i=k;});setLine(p=>p===i?p:i);};
  v.addEventListener('timeupdate',on);return()=>v.removeEventListener('timeupdate',on);
 },[f]);
 useEffect(()=>{
  const ol=list.current;if(!ol||line<0||!started)return;
  const li=ol.children[line] as HTMLElement|undefined;if(li)ol.scrollTo({top:li.offsetTop-ol.clientHeight/3,behavior:'smooth'});
 },[line,started]);

 const pick=(i:number)=>{setFilm(i);setStarted(false);setLine(-1);};
 const start=()=>{const v=vid.current;if(!v)return;setStarted(true);v.play().catch(()=>{});};
 const seek=(s:number)=>{const v=vid.current;if(!v)return;v.currentTime=s;setStarted(true);v.play().catch(()=>{});};

 return <article className={'sc sc-'+f.orient} id={t.slug} aria-labelledby={t.slug+'-name'}>
  <div className="sc-film">
   <div className="sc-frame">
    <video ref={vid} key={f.src} src={f.src} poster={f.poster} preload="none" playsInline controls={started} onPlay={()=>setStarted(true)}/>
    {!started&&<button type="button" className="sc-play" onClick={start} aria-label={`Play ${t.name}'s ${f.label.toLowerCase()} (${fmt(f.duration)})`}>
     <span className="sc-play-ico"><Play size={22} fill="currentColor"/></span><span>Watch {fmt(f.duration)}</span>
    </button>}
   </div>
   {t.films.length>1&&<div className="sc-tabs" role="tablist" aria-label="Film version">{t.films.map((x,i)=><button key={x.src} type="button" role="tab" aria-selected={i===film} className={i===film?'on':''} onClick={()=>pick(i)}>{x.label}<small>{fmt(x.duration)}</small></button>)}</div>}
  </div>
  <div className="sc-copy">
   <span className="sc-n" aria-hidden="true">{String(index+1).padStart(2,'0')}<small>/{String(total).padStart(2,'0')}</small></span>
   <h3 id={t.slug+'-name'} className="sc-name">{t.name}</h3>
   <p className="sc-meta">{t.role}{t.place&&<> · {t.place}</>}</p>
   <blockquote ref={quote} className="sc-quote" style={{'--n':words.length} as React.CSSProperties}>
    {words.map((w,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{w} </span>)}
   </blockquote>
   <p className="sc-story">{t.story}</p>
   <ul className="sc-tags" aria-label="Mentioned in this story">{t.tags.map(x=><li key={x}>{x}</li>)}</ul>
   <details className="sc-tx">
    <summary>Read the transcript <small>{f.label}</small></summary>
    <ol ref={list}>{f.transcript.map(([s,txt],i)=><li key={i} className={i===line?'on':''}><button type="button" onClick={()=>seek(s)}><time>{fmt(s)}</time><span>{txt}</span></button></li>)}</ol>
   </details>
  </div>
 </article>;
}
