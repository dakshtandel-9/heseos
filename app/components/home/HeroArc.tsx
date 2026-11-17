'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowUpRight, Mic, Plus } from 'lucide-react';
import type { HeroCard } from '../../../lib/home';
import SiteLink from '../site/SiteLink';

const START=4,SPEED=4.5;
const wrap=(a:number)=>((a%360)+540)%360-180;
const fade=(a:number)=>Math.min(Math.max((96-Math.abs(a))/30,0),1);

function Card({c}:{c:HeroCard}){
 switch(c.kind){
  case 'photo':return <SiteLink href={`/products/browse/${c.slug}`} className="ha-card ha-photo" draggable={false}>
   <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false}/>
   <span className="ha-tag">{c.name}<ArrowUpRight size={14}/></span>
  </SiteLink>;
  case 'app':return <div className="ha-card ha-app"><img src={c.image} alt={`Heseos app, ${c.label} screen`} loading="lazy" decoding="async" draggable={false}/><span className="ha-chip">{c.label}</span></div>;
  case 'stat':return <div className="ha-card ha-stat">
   <span className="ha-l">{c.label}</span><b>{c.value}</b>
   {c.spark?<svg viewBox="0 0 120 44" aria-hidden="true"><defs><linearGradient id="ha-sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f05a28" stopOpacity=".28"/><stop offset="1" stopColor="#f05a28" stopOpacity="0"/></linearGradient></defs><path d="M0 34 L14 30 L26 33 L40 22 L54 26 L68 14 L82 19 L96 9 L110 13 L120 6 V44 H0Z" fill="url(#ha-sg)"/><path d="M0 34 L14 30 L26 33 L40 22 L54 26 L68 14 L82 19 L96 9 L110 13 L120 6" fill="none" stroke="#f05a28" strokeWidth="2" strokeLinejoin="round"/></svg>
    :<span className="ha-toggle" aria-hidden="true"><i/></span>}
   <span className="ha-s">{c.sub}</span>
  </div>;
  case 'note':return <div className="ha-card ha-note"><p><b>{c.lead}</b><i aria-hidden="true"/> {c.rest}</p><span className="ha-mark" aria-hidden="true">∞</span></div>;
  case 'glass':return <SiteLink href={c.href} className="ha-card ha-glass" draggable={false}>
   <span className="ha-ico">{c.icon==='plus'?<Plus size={20}/>:<Mic size={18}/>}</span><b>{c.title}</b><span>{c.sub}</span>
  </SiteLink>;
 }
}

// The hero's turning arc: cards stand on the inside of a slow-turning cylinder, the nearest ones at the edges.
// It turns on its own, eases to a stop under the pointer, can be dragged, and brings a focused card to the front.
export default function HeroArc({cards}:{cards:HeroCard[]}){
 const root=useRef<HTMLDivElement>(null);
 const step=360/cards.length;

 useEffect(()=>{
  const el=root.current;if(!el)return;
  const ring=el.firstElementChild as HTMLElement,items=[...ring.children] as HTMLElement[];
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let spin=-START*step,speed=still?0:SPEED,want=speed,last=0,frame=0,on=true,seek:number|null=null;
  let drag:{x:number;moved:number;t:number}|null=null,fling=0,R=500;

  const measure=()=>{const w=items[0].offsetWidth;R=(w*1.1)/(step*Math.PI/180);el.style.setProperty('--r',`${R.toFixed(1)}px`);};
  const paint=()=>items.forEach((c,i)=>{const a=wrap(i*step+spin);c.style.setProperty('--a',`${a.toFixed(2)}deg`);c.style.setProperty('--o',fade(a).toFixed(3));c.style.zIndex=String(Math.round(Math.abs(a)));c.style.visibility=Math.abs(a)>100?'hidden':'';});
  const tick=(t:number)=>{
   const dt=Math.min((t-(last||t))/1000,.05);last=t;
   if(seek!==null){const d=wrap(seek-spin);spin+=d*Math.min(dt*6,1);if(Math.abs(d)<.05)seek=null;}
   else if(!drag){speed+=(want-speed)*Math.min(dt*3,1);spin+=(speed+fling)*dt;fling*=Math.pow(.04,dt);}
   paint();frame=on?requestAnimationFrame(tick):0;
  };
  const start=()=>{if(!frame){last=0;frame=requestAnimationFrame(tick);}};

  const down=(e:PointerEvent)=>{if(e.button)return;drag={x:e.clientX,moved:0,t:performance.now()};fling=0;seek=null;};
  const move=(e:PointerEvent)=>{
   if(!drag)return;const dx=e.clientX-drag.x,now=performance.now();
   drag.moved+=Math.abs(dx);if(drag.moved>6)el.classList.add('dragging');
   const d=-dx/R*180/Math.PI;spin+=d;fling=d/Math.max((now-drag.t)/1000,.008)*.5;drag.x=e.clientX;drag.t=now;
  };
  const up=()=>{if(!drag)return;const moved=drag.moved;drag=null;fling=Math.max(Math.min(fling,240),-240);setTimeout(()=>el.classList.remove('dragging'),0);if(moved<=6)fling=0;};
  const click=(e:MouseEvent)=>{if(el.classList.contains('dragging'))e.preventDefault();};
  const focus=(e:FocusEvent)=>{const i=items.findIndex(c=>c.contains(e.target as Node));if(i>=0)seek=-i*step;};
  const enter=()=>{want=0;},leave=()=>{want=still?0:SPEED;};

  measure();paint();
  const ro=new ResizeObserver(()=>{measure();paint();});ro.observe(items[0]);
  const io=new IntersectionObserver(([e])=>{on=e.isIntersecting;if(on)start();},{threshold:0});io.observe(el);
  el.addEventListener('pointerdown',down);window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  el.addEventListener('click',click,true);el.addEventListener('focusin',focus);el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();
   el.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
   el.removeEventListener('click',click,true);el.removeEventListener('focusin',focus);el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);};
 },[step]);

 return <div ref={root} className="ha" role="group" aria-label="Heseos product categories and app">
  <div className="ha-ring">{cards.map((c,i)=>{const a=wrap((i-START)*step);return <div key={i} className="ha-slot" style={{'--a':`${a}deg`,'--o':fade(a),zIndex:Math.round(Math.abs(a)),visibility:Math.abs(a)>100?'hidden':undefined} as CSSProperties}><Card c={c}/></div>;})}</div>
 </div>;
}
