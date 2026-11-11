'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import CountUp from './CountUp';

const SWAP_MIN_LOCK_MS=900;
const SWAP_QUIET_MS=200;
const SWAP_MAX_LOCK_MS=1600;
const SCROLL_KEYS=new Set(['ArrowDown','PageDown',' ','Spacebar']);

export default function HeroScene({dayImage,nightImage,stats,children}:{dayImage:string;nightImage:string;stats:{value:string;label:string}[];children:ReactNode}){
 const [mode,setMode]=useState<'day'|'night'>('day');
 const demoTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

 useEffect(()=>{
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   demoTimer.current=setTimeout(()=>setMode('night'),5000);
  }
  return ()=>{if(demoTimer.current)clearTimeout(demoTimer.current);};
 },[]);

 // The first downward scroll at the top of the page flips day/night instead of moving the page.
 // Input is held while the crossfade plays (and trackpad momentum dies out), then scrolling is normal.
 // Returning to the top re-arms it.
 useEffect(()=>{
  let armed=true,swappedAt=0,lockUntil=0,touchY=0;
  const atTop=()=>window.scrollY<=2;
  const intercept=(e:Event)=>{
   const now=performance.now();
   if(now<lockUntil){
    e.preventDefault();
    if(e.type==='wheel')lockUntil=Math.min(Math.max(lockUntil,now+SWAP_QUIET_MS),swappedAt+SWAP_MAX_LOCK_MS);
    return;
   }
   if(!armed||!atTop())return;
   e.preventDefault();
   armed=false;swappedAt=now;lockUntil=now+SWAP_MIN_LOCK_MS;
   if(demoTimer.current)clearTimeout(demoTimer.current);
   demoTimer.current=null;
   setMode(m=>m==='day'?'night':'day');
  };
  const onWheel=(e:WheelEvent)=>{if(e.deltaY>0)intercept(e);};
  const onTouchStart=(e:TouchEvent)=>{touchY=e.touches[0].clientY;};
  const onTouchMove=(e:TouchEvent)=>{if(touchY-e.touches[0].clientY>8)intercept(e);};
  const onKey=(e:KeyboardEvent)=>{
   if(!SCROLL_KEYS.has(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;
   if((e.target as HTMLElement|null)?.closest?.('input,textarea,select,button,[contenteditable]'))return;
   intercept(e);
  };
  const onScroll=()=>{if(atTop()&&performance.now()>=lockUntil)armed=true;};
  window.addEventListener('wheel',onWheel,{passive:false});
  window.addEventListener('touchstart',onTouchStart,{passive:true});
  window.addEventListener('touchmove',onTouchMove,{passive:false});
  window.addEventListener('keydown',onKey);
  window.addEventListener('scroll',onScroll,{passive:true});
  return ()=>{
   window.removeEventListener('wheel',onWheel);
   window.removeEventListener('touchstart',onTouchStart);
   window.removeEventListener('touchmove',onTouchMove);
   window.removeEventListener('keydown',onKey);
   window.removeEventListener('scroll',onScroll);
  };
 },[]);

 const selectMode=(next:'day'|'night')=>{
  if(demoTimer.current)clearTimeout(demoTimer.current);
  demoTimer.current=null;
  setMode(next);
 };

 return <section className={`hx hx-${mode}`} aria-labelledby="hero-title">
  <div className="hx-media" aria-hidden="true">
   <img className="hx-day-image" src={dayImage} alt="" fetchPriority="high"/>
   <img className="hx-night-image" src={nightImage} alt=""/>
  </div>
  <div className="hw hx-inner"><div className="hx-copy">{children}</div></div>
  <div className="hw hx-dock">
   <div className="hx-mode" role="group" aria-label="View the home by time of day">
    <button type="button" aria-pressed={mode==='day'} onClick={()=>selectMode('day')}><Sun size={18} strokeWidth={1.8}/><span>Day mode</span></button>
    <button type="button" aria-pressed={mode==='night'} onClick={()=>selectMode('night')}><Moon size={18} strokeWidth={1.8}/><span>Night mode</span></button>
   </div>
   <span className="hx-caption">A home that thinks about energy, around the clock.</span>
   <ul className="hx-stats" aria-label="Heseos in numbers">{stats.map(s=><li key={s.label}><b className="tabular"><CountUp value={s.value}/></b><span>{s.label}</span></li>)}</ul>
  </div>
 </section>;
}
