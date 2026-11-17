'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import CountUp from './CountUp';
import './StoryCards.css';

type Chapter={title:string;body:string;image:string};

// "Our story, in numbers": the section pins while vertical scroll slides a strip of chapter cards sideways.
// The card nearest the centre comes into focus; numbers count up as each card arrives.
export default function StoryCards({eyebrow,title,body,chapters,stats}:{eyebrow:string;title:string;body:string;chapters:Chapter[];stats:{value:string;label:string}[]}){
 const root=useRef<HTMLElement>(null);

 useEffect(()=>{
  const sec=root.current;
  if(!sec||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const stage=sec.firstElementChild as HTMLElement,rail=stage.querySelector<HTMLElement>('.sc-rail')!;
  const cards=[...rail.querySelectorAll<HTMLElement>('.sc-card')];
  let travel=0,vw=0,centres:number[]=[],frame=0;

  const measure=()=>{
   vw=stage.clientWidth;
   travel=Math.max(rail.offsetWidth-vw,0);
   centres=cards.map(c=>c.offsetLeft+c.offsetWidth/2);
   sec.style.height=`${stage.clientHeight+travel}px`;
  };
  const update=()=>{
   frame=0;
   const r=sec.getBoundingClientRect(),p=travel?Math.min(Math.max(-r.top/travel,0),1):0,x=p*travel;
   rail.style.transform=`translate3d(${(-x).toFixed(1)}px,0,0)`;
   stage.style.setProperty('--p',p.toFixed(4));
   cards.forEach((c,i)=>{const d=Math.abs(centres[i]-x-vw/2)/vw;c.style.setProperty('--f',Math.max(0,1-d*1.5).toFixed(3));});
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};

  measure();update();
  const ro=new ResizeObserver(()=>{measure();queue();});
  ro.observe(stage);
  window.addEventListener('scroll',queue,{passive:true});
  return ()=>{cancelAnimationFrame(frame);ro.disconnect();window.removeEventListener('scroll',queue);sec.style.height='';};
 },[]);

 return <section ref={root} className="sc" aria-labelledby="story-title">
  <div className="sc-stage">
   <div className="sc-rail">
    <div className="sc-intro">
     <span className="ey">{eyebrow}</span>
     <h2 id="story-title">{title}</h2>
     <p>{body}</p>
     <span className="sc-cue" aria-hidden="true">Keep scrolling <ArrowRight size={15}/></span>
    </div>
    {chapters.map((c,i)=>{const s=stats[i];return <article key={c.title} className="sc-card">
     <img src={c.image} alt="" loading="lazy" decoding="async"/>
     <span className="sc-n">Chapter 0{i+1} <em>/ 0{chapters.length}</em></span>
     <div className="sc-body">
      {s&&<div><b className="sc-fig tabular"><CountUp value={s.value}/></b><span className="sc-label">{s.label}</span></div>}
      <div className="sc-copy"><h3>{c.title}</h3><p>{c.body}</p></div>
     </div>
    </article>;})}
   </div>
   <div className="sc-bar" aria-hidden="true"><i/></div>
  </div>
 </section>;
}
