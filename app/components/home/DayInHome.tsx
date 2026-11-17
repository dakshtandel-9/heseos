'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import './DayInHome.css';

type Moment={time:string;name:string;line:string;image:string;alt:string;href:string;count:number};

const UNIT=58;          // vh of scroll per moment
// Each print's resting tilt and offset in the stack, so the pile looks hand-dropped.
const TILT=[-3.2,2.4,-1.6,3.4,-2.6,1.8,-3.6,2.8],NUDGE=[[-6,4],[8,-2],[-4,-6],[6,6],[-8,2],[4,-4],[-2,8],[8,2]];
const mins=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
const clock=(m:number)=>{m=Math.round(m);const h=Math.floor(m/60)%24,mm=m%60;return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;};

// "A day in one Heseos home": the section pins while a stack of photo prints, one per product category, is dealt
// off one by one. A clock runs between each moment's time, and the stage light follows the day from dawn to night.
export default function DayInHome({eyebrow,title,moments}:{eyebrow:string;title:string;moments:Moment[]}){
 const root=useRef<HTMLElement>(null);
 const n=moments.length;

 useEffect(()=>{
  const sec=root.current;
  if(!sec)return;
  const stage=sec.firstElementChild as HTMLElement;
  const q=(s:string)=>[...stage.querySelectorAll<HTMLElement>(s)];
  const prints=q('.dh-print'),says=q('.dh-say'),ticks=q('.dh-ticks li'),[time]=q('.dh-time'),[sun]=q('.dh-sun');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const at=moments.map(m=>mins(m.time));
  let frame=0,cur=-1;

  const update=()=>{
   frame=0;
   const r=sec.getBoundingClientRect(),run=sec.offsetHeight-stage.offsetHeight;
   const p=run>0?Math.min(Math.max(-r.top/run,0),1):0,f=p*n;
   const i=Math.min(Math.floor(f),n-1),u=Math.min(f-i,1);
   // The clock holds on each moment's time, then runs to the next one over the last third of the step.
   const run2=Math.max((u-.66)/.34,0),m=i<n-1?at[i]+(at[i+1]-at[i])*run2*run2*(3-2*run2):at[i];
   time.textContent=clock(m);
   const day=(m-at[0])/(at[n-1]-at[0]);
   stage.style.setProperty('--day',day.toFixed(4));
   sun.style.left=`${(m/1440*100).toFixed(2)}%`;
   if(i!==cur){
    cur=i;stage.dataset.i=String(i);
    prints.forEach((el,k)=>{el.dataset.s=k<i?'gone':k===i?'top':'under';el.style.zIndex=String(n-k);});
    says.forEach((el,k)=>{el.dataset.s=k===i?'on':k<i?'past':'off';});
    ticks.forEach((el,k)=>{el.dataset.s=k===i?'on':k<i?'done':'off';});
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  update();
  if(reduce)stage.dataset.reduce='';
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue);
  return ()=>{cancelAnimationFrame(frame);removeEventListener('scroll',queue);removeEventListener('resize',queue);};
 },[moments,n]);

 return <section ref={root} className="dh" style={{height:`calc(100svh + ${n*UNIT}vh)`}} aria-labelledby="day-title">
  <div className="dh-stage" data-i="0">
   <div className="dh-sky" aria-hidden="true"/>
   <header className="dh-head">
    <span className="ey">{eyebrow}</span>
    <h2 id="day-title">{title}</h2>
   </header>

   <div className="dh-copy">
    <span className="dh-time tabular" aria-hidden="true">{moments[0].time}</span>
    <div className="dh-says">{moments.map((m,k)=><div key={m.name} className="dh-say" data-s={k?'off':'on'}>
     <span className="dh-n">0{k+1} / 0{n} · <time>{m.time}</time></span>
     <h3>{m.name}</h3>
     <p>{m.line}</p>
     <SiteLink className="dh-link" href={m.href} tabIndex={k?-1:undefined}>Explore {m.name} <span>{m.count} products</span><ArrowRight size={15}/></SiteLink>
    </div>)}</div>
   </div>

   <ol className="dh-stack">{moments.map((m,k)=><li key={m.name} className="dh-print" data-s={k?'under':'top'} style={{'--r':`${TILT[k%TILT.length]}deg`,'--x':`${NUDGE[k%8][0]}px`,'--y':`${NUDGE[k%8][1]}px`,zIndex:n-k} as CSSProperties}>
    <SiteLink href={m.href} tabIndex={-1} aria-hidden="true">
     <img src={m.image} alt={m.alt} width={1200} height={1500} loading={k<2?'eager':'lazy'} decoding="async"/>
     <span className="dh-cap"><b>{m.time}</b>{m.name}</span>
    </SiteLink>
   </li>)}</ol>

   <div className="dh-day" aria-hidden="true">
    <div className="dh-rule"><i className="dh-sun"/></div>
    <ol className="dh-ticks">{moments.map((m,k)=><li key={m.name} data-s={k?'off':'on'} style={{left:`${mins(m.time)/1440*100}%`}}><span>{m.time}</span></li>)}</ol>
   </div>
  </div>
 </section>;
}
