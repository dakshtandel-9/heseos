'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import './NumberStack.css';

type Stat={value:string;label:string};
type Photo={src:string;alt:string};

// Every transform keeps the same list of functions so the browser can tween each one; rotateY gives the 3D spin.
const P='perspective(1400px)';
const REST=`${P} translate(0px,0px) scale(1) rotate(0deg) rotateY(0deg)`;
const IO='cubic-bezier(.65,0,.35,1)';
const angle=(i:number,n:number)=>(i-(n-1)/2)*15;

// A card: the photo fills it, the figure and its label sit top-left, the corner that shows in the fan. The dealt card adds the detail line.
function Face({value,label,photo,detail}:{value:string;label:string;photo?:Photo;detail?:string}){
 return <span className="nc-face" style={{'--len':value.length} as CSSProperties}>
  {photo&&<img src={photo.src} alt={detail?photo.alt:''} loading="lazy" decoding="async" draggable={false}/>}
  <span className="nc-text"><b>{value}</b><span className="nc-label">{label}</span></span>
  {detail&&<span className="nc-detail">{detail}</span>}
 </span>;
}

// "What we have done so far": copy on the left, the four figures as a fanned hand of cards on the right.
// Picking a card spins it out of the hand to the middle of the screen, where it also shows its detail line.
// Arrows (or ← →) deal the next card; Esc, the close button or the backdrop put it back in the hand.
export default function NumberStack({eyebrow,title,body,stats,details,photos,cta}:{eyebrow:string;title:readonly string[];body:string;stats:Stat[];details:readonly string[];photos:readonly Photo[];cta?:{href:string;label:string}}){
 const n=stats.length;
 const [open,setOpen]=useState<number|null>(null);
 // Cards shown since the dialog opened; once all have been seen, scrolling on puts the card back.
 const [seen,setSeen]=useState<number[]>([]);
 const cards=useRef<(HTMLButtonElement|null)[]>([]);
 const big=useRef<HTMLDivElement>(null);
 const busy=useRef(false);
 const from=useRef(0);

 const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Where the hand's card sits, as a transform from the big card's resting place.
 const fromHand=(i:number)=>{
  const c=cards.current[i],b=big.current;if(!c||!b)return null;
  const r=c.getBoundingClientRect(),q=b.getBoundingClientRect();
  return `${P} translate(${r.left+r.width/2-(q.left+q.width/2)}px,${r.top+r.height/2-(q.top+q.height/2)}px) scale(${c.offsetWidth/b.offsetWidth}) rotate(${angle(i,n)}deg) rotateY(0deg)`;
 };

 // Fly in from the hand once the dialog has rendered, before it paints.
 useLayoutEffect(()=>{
  if(open===null||!big.current||busy.current)return;
  const start=fromHand(from.current);if(!start)return;
  busy.current=true;
  // One full turn on the vertical axis, easing in and out, as it travels from the hand to the middle.
  const a=big.current.animate([
   {transform:start},
   {transform:REST.replace('rotateY(0deg)','rotateY(360deg)')},
  ],{duration:still()?0:1150,easing:IO});
  a.finished.then(()=>{busy.current=false;},()=>{busy.current=false;});
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[open===null]);

 const pick=(i:number)=>{if(busy.current||open!==null)return;from.current=i;setSeen([i]);setOpen(i);};

 const close=async()=>{
  if(busy.current||open===null||!big.current)return;
  busy.current=true;
  const end=fromHand(open);
  if(end)await big.current.animate([{transform:REST},{transform:end.replace('rotateY(0deg)','rotateY(-360deg)')}],{duration:still()?0:900,easing:IO,fill:'forwards'}).finished.catch(()=>{});
  const i=open;busy.current=false;flushSync(()=>setOpen(null));cards.current[i]?.focus({preventScroll:true});
 };

 const go=async(dir:1|-1)=>{
  if(busy.current||open===null||!big.current)return;
  busy.current=true;const el=big.current,t=still()?0:1;
  // The card turns edge-on and slides away; the next one spins in from the other side.
  const out=el.animate([{transform:REST,opacity:1},{transform:`${P} translate(${-dir*30}vw,0px) scale(.8) rotate(0deg) rotateY(${-dir*90}deg)`,opacity:0}],{duration:380*t,easing:'cubic-bezier(.55,0,1,.45)',fill:'forwards'});
  await out.finished.catch(()=>{});
  const next=(open+dir+n)%n;
  flushSync(()=>{setOpen(next);setSeen(v=>v.includes(next)?v:[...v,next]);});
  const inn=el.animate([
   {transform:`${P} translate(${dir*40}vw,0px) scale(.75) rotate(0deg) rotateY(${dir*360}deg)`,opacity:0},
   {opacity:1,offset:.3},
   {transform:REST,opacity:1},
  ],{duration:1000*t,easing:IO});
  out.cancel();
  await inn.finished.catch(()=>{});
  busy.current=false;
 };

 // Keys and scroll lock while a card is out.
 const allSeen=seen.length>=n;
 // Scrolling down deals the next card (4 → 1 wraps); once all four have been seen it closes. Scrolling up goes back.
 const step=(dir:1|-1)=>{if(dir===1&&allSeen)close();else go(dir);};
 const keys=useRef({close,go,step});
 useEffect(()=>{keys.current={close,go,step};});
 useEffect(()=>{
  if(open===null)return;
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape')keys.current.close();
   else if(e.key==='ArrowRight'){e.preventDefault();keys.current.go(1);}
   else if(e.key==='ArrowLeft'){e.preventDefault();keys.current.go(-1);}
  };
  // One step per scroll gesture: after a step, input is held until the card lands and trackpad momentum dies out.
  let lockUntil=0,stepAt=0,touchY=0;
  const intercept=(dir:1|-1)=>{
   const now=performance.now();
   if(now<lockUntil){lockUntil=Math.min(Math.max(lockUntil,now+220),stepAt+1900);return;}
   stepAt=now;lockUntil=now+1100;keys.current.step(dir);
  };
  const wheel=(e:WheelEvent)=>{e.preventDefault();if(Math.abs(e.deltaY)<4)return;intercept(e.deltaY>0?1:-1);};
  const tstart=(e:TouchEvent)=>{touchY=e.touches[0].clientY;};
  const tmove=(e:TouchEvent)=>{e.preventDefault();const dy=touchY-e.touches[0].clientY;if(Math.abs(dy)>40){touchY=e.touches[0].clientY;intercept(dy>0?1:-1);}};
  const html=document.documentElement,was=html.style.overflow;html.style.overflow='hidden';
  window.addEventListener('keydown',key);
  window.addEventListener('wheel',wheel,{passive:false});
  window.addEventListener('touchstart',tstart,{passive:true});
  window.addEventListener('touchmove',tmove,{passive:false});
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',tstart);window.removeEventListener('touchmove',tmove);html.style.overflow=was;};
 },[open===null]);// eslint-disable-line react-hooks/exhaustive-deps

 const cur=open===null?null:stats[open];

 return <section className="ns" aria-labelledby="numbers-title">
  <div className="hw ns-grid">
   <div className="ns-head" data-reveal>
    <span className="ey">{eyebrow}</span>
    <h2 id="numbers-title" className="ns-title">{title.map((line,i)=><span key={line} className={`l${i}`}>{line}</span>)}</h2>
    <p className="ns-body">{body}</p>
    {cta&&<SiteLink href={cta.href} className="ns-cta">{cta.label}<b><ArrowUpRight size={17}/></b></SiteLink>}
   </div>

   <div className="nc-hand-wrap" data-reveal>
    <ul className="nc-hand" aria-label="Heseos in numbers">{stats.map((s,i)=><li key={s.label} className={`nc-slot${open===i?' out':''}`} style={{'--r':`${angle(i,n)}deg`,'--i':i} as CSSProperties}>
     <button type="button" ref={el=>{cards.current[i]=el;}} className="nc-card" onClick={()=>pick(i)} aria-haspopup="dialog" aria-label={`${s.value} ${s.label}. Open card`}>
      <Face value={s.value} label={s.label} photo={photos[i]}/>
     </button>
    </li>)}</ul>
   </div>
  </div>

  {cur&&open!==null&&createPortal(<div className="nc-stage" role="dialog" aria-modal="true" aria-label={`${cur.value} ${cur.label}`} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <button type="button" className="nc-nav nc-prev" onClick={()=>go(-1)} aria-label="Previous card"><ArrowLeft size={20}/></button>
   <div ref={big} className="nc-big"><div className="nc-side"><Face value={cur.value} label={cur.label} photo={photos[open]} detail={details[open]}/></div><div className="nc-side nc-back" aria-hidden="true"><img src="/assets/heseos-logo-white.png" alt="" width="2588" height="896" draggable={false}/></div></div>
   <button type="button" className="nc-nav nc-next" onClick={()=>go(1)} aria-label="Next card"><ArrowRight size={20}/></button>
   <button type="button" className="nc-close" onClick={close} aria-label="Put the card back" autoFocus><X size={20}/></button>
   <span className="nc-scroll" aria-live="polite">{allSeen?'Scroll to go back to the page':'Scroll for the next card'}</span>
  </div>,document.body)}
 </section>;
}
