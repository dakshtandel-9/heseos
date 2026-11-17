'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { AlarmClock, ArrowUpRight, BedDouble, Box, Clapperboard, Fan, GitBranch, House, Languages, LayoutGrid, Lightbulb, Lock, Mic, Monitor, Moon, Settings, Snowflake, Sofa, Sunrise, Tv, Zap } from 'lucide-react';
import { APPS } from '../../../lib/site';
import './HeroApp.css';

type Card={icon:string;label:string;value:string;sub?:string;spark?:boolean;bar?:number};
type Screen={src:string;alt:string;tap?:number[]};
type Chapter={tab:string;title:string;body:string;screens:Screen[];cards:Card[]};

const ICONS={zap:Zap,fan:Fan,bulb:Lightbulb,sofa:Sofa,bed:BedDouble,lock:Lock,sunrise:Sunrise,moon:Moon,film:Clapperboard,snow:Snowflake,tv:Tv,alarm:AlarmClock,mic:Mic,grid:LayoutGrid,lang:Languages} as const;
const TABS=[House,Box,GitBranch,Monitor,Settings];
// Where each chapter's three cards settle around the phone: x in phone half-widths (sign = side), y in phone heights,
// r = tilt, d = parallax drift in px across the chapter.
const SLOTS=[{x:-1,y:-.24,r:-4,d:-56},{x:1,y:-.04,r:3,d:44},{x:-1,y:.25,r:-2,d:-28}];
const UNIT=64;                       // vh of scroll per timeline unit
const INTRO=.75,OUTRO=.8;            // units before the first chapter and after the last
const span=(c:Chapter)=>.7+.38*c.screens.length;
// Today's power curve from the home screen chart, 12 AM → 6 PM (x 0–100, y 0–30, low = more power).
const SPARK='0,25 14,26 28,26 42,26 50,28.5 57,28 63,24.5 70,24 76,25.5 83,22 89,20 93,25 97,7 100,12';

// The homepage hero: the real Heseos app in a phone that stays pinned while the page scrolls behind it. The screen walks
// through the app's five tabs, a band of tab names slides behind the phone, and each chapter deals three cards out from it.
export default function HeroApp({chapters,outro,children}:{chapters:Chapter[];outro:{title:string;body:string};children:ReactNode}){
 const root=useRef<HTMLElement>(null);
 const screens=chapters.flatMap((c,ci)=>c.screens.map(s=>({...s,ci})));
 const total=INTRO+chapters.reduce((a,c)=>a+span(c),0)+OUTRO;

 useEffect(()=>{
  const sec=root.current;
  if(!sec)return;
  const stage=sec.firstElementChild as HTMLElement;
  const q=<T extends Element>(s:string)=>[...stage.querySelectorAll<T & HTMLElement>(s)];
  const [deck]=q('.hx-deck'),[band]=q('.hx-band'),[tap]=q('.hx-tap');
  const words=q('.hx-band span'),shots=q('.hx-screen'),cards=q('.hx-card'),blocks=q('.hx-say'),tabs=q('.hx-tabs button');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flat=chapters.flatMap((c,ci)=>c.screens.map(s=>({...s,ci})));
  const starts:number[]=[];chapters.reduce((a,c)=>{starts.push(a);return a+span(c);},INTRO);
  let centres:number[]=[],anchor=0,frame=0,chapter=-2,screen=-1;

  const measure=()=>{
   const s=stage.getBoundingClientRect(),d=deck.getBoundingClientRect();
   anchor=d.left-s.left+d.width/2;
   centres=words.map(w=>w.offsetLeft+w.offsetWidth/2);
  };
  // Band position for a fractional chapter index, extrapolating past either end.
  const bandAt=(f:number)=>{
   const n=centres.length-1,i=Math.min(Math.max(Math.floor(f),0),n-1),u=f-i;
   return centres[i]+(centres[i+1]-centres[i])*u;
  };
  const set=(els:HTMLElement[],fn:(i:number)=>string)=>els.forEach((el,i)=>{const v=fn(i);if(el.dataset.s!==v)el.dataset.s=v;});

  const update=()=>{
   frame=0;
   const r=sec.getBoundingClientRect(),run=sec.offsetHeight-stage.offsetHeight;
   const u=run>0?Math.min(Math.max(-r.top/run,0),1)*total:0;
   let ci=-1,t=0;
   for(let i=0;i<chapters.length;i++)if(u>=starts[i]){ci=i;t=Math.min((u-starts[i])/span(chapters[i]),1);}
   const end=starts[chapters.length-1]+span(chapters[chapters.length-1]),outroOn=u>=end;
   const k=reduce?1:Math.min(u/INTRO,1),o=Math.min(Math.max((u-end)/OUTRO,0),1);
   const now=outroOn?chapters.length:ci;

   stage.style.setProperty('--k',k.toFixed(4));
   stage.style.setProperty('--o',o.toFixed(4));
   stage.style.setProperty('--t',(ci<0?0:t).toFixed(4));
   const f=ci<0?-.5-(1-k)*.7:outroOn?chapters.length-.5+o*.7:ci+t-.5;
   band.style.transform=`translate3d(${(anchor-bandAt(f)).toFixed(1)}px,-50%,0)`;

   if(now!==chapter){
    chapter=now;stage.dataset.ch=String(now);
    set(blocks,i=>i===now+1?'on':i<now+1?'past':'off');
    set(words,i=>i===ci?'on':'off');
    set(tabs,i=>i===ci?'on':i<ci?'done':'off');
    set(cards,i=>{const c=Math.floor(i/3);return c===ci&&!outroOn?'on':ci<0&&c===0?'peek':'off';});
    tabs.forEach((b,i)=>b.setAttribute('aria-current',i===ci?'step':'false'));
   }
   const per=ci<0?0:Math.min(Math.floor(t*chapters[ci].screens.length),chapters[ci].screens.length-1);
   const next=ci<0?0:flat.findIndex(s=>s.ci===ci)+per;
   if(next!==screen){
    const forward=next>screen&&screen>=0;screen=next;
    set(shots,i=>i===next?'on':i<next?'past':'next');
    const at=flat[next].tap;
    if(forward&&at&&!reduce){
     tap.style.left=at[0]+'%';tap.style.top=at[1]+'%';
     tap.animate([{transform:'translate(-50%,-50%) scale(.35)',opacity:.85},{transform:'translate(-50%,-50%) scale(1.7)',opacity:0}],{duration:700,easing:'cubic-bezier(.2,.7,.3,1)'});
    }
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const jump=(i:number)=>()=>{
   const run=sec.offsetHeight-stage.offsetHeight,top=sec.getBoundingClientRect().top+scrollY;
   scrollTo({top:top+(starts[i]+.08)/total*run,behavior:reduce?'auto':'smooth'});
  };
  const jumps=tabs.map((b,i)=>{const fn=jump(i);b.addEventListener('click',fn);return fn;});

  measure();update();
  const ro=new ResizeObserver(()=>{measure();queue();});
  ro.observe(stage);
  addEventListener('scroll',queue,{passive:true});
  document.fonts?.ready.then(()=>{measure();queue();});
  return ()=>{cancelAnimationFrame(frame);ro.disconnect();removeEventListener('scroll',queue);tabs.forEach((b,i)=>b.removeEventListener('click',jumps[i]));};
 },[chapters,total]);

 return <section ref={root} className="hx" style={{height:`calc(100svh + ${(total*UNIT).toFixed(1)}vh)`}} aria-labelledby="hero-title">
  <div className="hx-stage" data-ch="-1">
   <div className="hx-bg" aria-hidden="true"/>
   <div className="hx-bandbox" aria-hidden="true"><div className="hx-band">{chapters.map((c,i)=><span key={c.tab} data-s={i?'off':'on'}>{c.tab}</span>)}</div></div>

   <div className="hx-deck">
    <div className="hx-glow" aria-hidden="true"/>
    <ul className="hx-cards" aria-hidden="true">{chapters.flatMap((c,ci)=>c.cards.map((card,si)=>{
     const Icon=ICONS[card.icon as keyof typeof ICONS]??Zap,sl=SLOTS[si];
     return <li key={`${ci}-${si}`} style={{'--sx':sl.x,'--sy':sl.y,'--sr':`${sl.r}deg`,'--d':sl.d} as CSSProperties}>
      <div className="hx-card" data-s={ci?'off':'peek'}>
       <span className="hx-ico"><Icon size={17} strokeWidth={1.9}/></span>
       <span className="hx-txt"><small>{card.label}</small><b>{card.value}</b>{card.sub&&<em>{card.sub}</em>}</span>
       {card.spark&&<svg className="hx-spark" viewBox="0 0 100 30" preserveAspectRatio="none"><polygon points={`0,30 ${SPARK} 100,30`}/><polyline points={SPARK}/></svg>}
       {card.bar!=null&&<i className="hx-bar" style={{'--v':card.bar} as CSSProperties}/>}
      </div>
     </li>;
    }))}</ul>
    <figure className="hx-phone">
     <div className="hx-screen-wrap">
      <ul className="hx-screens">{screens.map((s,i)=><li key={s.src} className="hx-screen" data-s={i?'next':'on'}><img src={s.src} alt={s.alt} width={600} height={1300} loading={i<2?'eager':'lazy'} decoding="async"/></li>)}</ul>
      <span className="hx-island" aria-hidden="true"/>
      <span className="hx-time" aria-hidden="true">9:41</span>
      <span className="hx-tap" aria-hidden="true"/>
     </div>
    </figure>
   </div>

   <div className="hx-copy">
    <div className="hx-say hx-intro" data-s="on">{children}</div>
    {chapters.map((c,i)=><div key={c.tab} className="hx-say" data-s="off">
     <span className="hx-step"><b>0{i+1}</b> / 0{chapters.length} · {c.tab}</span>
     <h2>{c.title}</h2><p>{c.body}</p>
    </div>)}
    <div className="hx-say hx-end" data-s="off">
     <span className="hx-step">The Heseos app</span>
     <h2>{outro.title}</h2><p>{outro.body}</p>
     <div className="hx-stores">
      <a href={APPS.appStore} target="_blank" rel="noreferrer">App Store <ArrowUpRight size={15}/></a>
      <a href={APPS.googlePlay} target="_blank" rel="noreferrer">Google Play <ArrowUpRight size={15}/></a>
     </div>
    </div>
   </div>

   <nav className="hx-tabs" aria-label="Tour of the Heseos app">{chapters.map((c,i)=>{const Icon=TABS[i]??House;return <button key={c.tab} type="button" data-s="off" aria-current="false">
    <Icon size={17} strokeWidth={1.9} aria-hidden="true"/><span>{c.tab}</span><i aria-hidden="true"/>
   </button>;})}</nav>
   <span className="hx-hint" aria-hidden="true">Scroll to explore the app<i/></span>
  </div>
 </section>;
}
