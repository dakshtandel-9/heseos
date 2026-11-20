'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import type { HeroCard } from '../../../lib/home';
import SiteLink from '../site/SiteLink';
import './HeroArc.css';

// D: how far behind the ring's front the middle card sits (× radius), so middle cards look smaller and edge cards loom.
const SPEED=26,GAP=.17,FADE_FROM=56,HIDE=78,D=.3;
const DEG=180/Math.PI;

// The hero's card arc: cards ride a conveyor bent round the inside of a cylinder, so the ones at the edges
// come closer and turn in, as if you stood inside the ring. It drifts on its own, slows to a stop under the
// pointer, can be dragged or flung, and brings a keyboard-focused card to the middle.
export default function HeroArc({cards}:{cards:HeroCard[]}){
 const root=useRef<HTMLDivElement>(null),router=useRouter();

 useEffect(()=>{
  const el=root.current;if(!el)return;
  const items=[...el.children] as HTMLElement[],n=items.length;
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let off=0,speed=still?0:SPEED,want=speed,last=0,frame=0,on=true,seek:number|null=null,fling=0;
  let R=600,s=200,L=200*n,drag:{x:number;moved:number;t:number;href:string|null}|null=null;

  const measure=()=>{
   const w=items[0].offsetWidth,vw=el.clientWidth;
   s=w*(1+GAP);L=s*n;R=Math.max(vw*.5,s*2.6);
   el.style.perspective=`${(2.2*R).toFixed(0)}px`;
  };
  const paint=()=>{for(let i=0;i<n;i++){
   let t=((i*s-off)%L+L)%L;if(t>L/2)t-=L;
   const a=t/R,deg=Math.abs(a*DEG),c=items[i];
   if(deg>HIDE){c.style.visibility='hidden';continue;}
   c.style.visibility='';
   c.style.transform=`translate3d(${(R*Math.sin(a)).toFixed(1)}px,0,${(R*(1-D-Math.cos(a))).toFixed(1)}px) rotateY(${(-a*DEG).toFixed(2)}deg)`;
   c.style.opacity=Math.min(Math.max((HIDE-deg)/(HIDE-FADE_FROM),0),1).toFixed(3);
   c.style.zIndex=String(Math.round(deg));
  }};
  const tick=(t:number)=>{
   const dt=Math.min((t-(last||t))/1000,.05);last=t;
   if(seek!==null){let d=((seek-off)%L+L)%L;if(d>L/2)d-=L;off+=d*Math.min(dt*6,1);if(Math.abs(d)<.5)seek=null;}
   else if(!drag){speed+=(want-speed)*Math.min(dt*3,1);off+=(speed+fling)*dt;fling*=Math.pow(.05,dt);}
   paint();frame=on?requestAnimationFrame(tick):0;
  };
  const start=()=>{if(!frame){last=0;frame=requestAnimationFrame(tick);}};

  const down=(e:PointerEvent)=>{if(e.button)return;drag={x:e.clientX,moved:0,t:performance.now(),href:(e.target as Element).closest('a')?.getAttribute('href')??null};fling=0;seek=null;};
  const move=(e:PointerEvent)=>{
   if(!drag)return;const dx=e.clientX-drag.x,now=performance.now();
   drag.moved+=Math.abs(dx);if(drag.moved>6)el.classList.add('dragging');
   off-=dx;fling=-dx/Math.max((now-drag.t)/1000,.008)*.6;drag.x=e.clientX;drag.t=now;
  };
  const up=()=>{if(!drag)return;const moved=drag.moved,href=drag.href;drag=null;if(moved<=6&&href)router.push(href);fling=moved>6?Math.max(Math.min(fling,1600),-1600):0;setTimeout(()=>el.classList.remove('dragging'),0);};
  // A tap navigates on release (the arc drifts, so down and up can land on different cards and the browser drops the click).
  // Mouse and touch clicks are handled there; keyboard activation (detail 0) still goes through the link.
  const click=(e:MouseEvent)=>{if(e.detail>0||el.classList.contains('dragging')){e.preventDefault();e.stopPropagation();}};
  const focus=(e:FocusEvent)=>{const i=items.findIndex(c=>c.contains(e.target as Node));if(i>=0)seek=i*s;};
  const enter=(e:PointerEvent)=>{if(e.pointerType==='mouse')want=0;},leave=()=>{want=still?0:SPEED;};

  measure();paint();el.classList.add('ready');
  const ro=new ResizeObserver(()=>{measure();paint();});ro.observe(el);
  const io=new IntersectionObserver(([e])=>{on=e.isIntersecting;if(on)start();},{threshold:0});io.observe(el);
  el.addEventListener('pointerdown',down);window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  el.addEventListener('click',click,true);el.addEventListener('focusin',focus);el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();
   el.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
   el.removeEventListener('click',click,true);el.removeEventListener('focusin',focus);el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);};
 },[router]);

 // The set goes round the ring twice, so a card never pops out at one edge while still showing at the other.
 // The second lap is hidden from assistive tech and the tab order.
 return <div ref={root} className="arc" role="group" aria-label="Heseos product categories">
  {[0,1].flatMap(lap=>cards.map(c=><div key={lap+c.href} className="arc-slot" aria-hidden={lap?true:undefined}>
   <SiteLink href={c.href} className="arc-card arc-photo" draggable={false} tabIndex={lap?-1:undefined}>
    <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false}/>
    <span className="arc-tag">{c.name}<ArrowUpRight size={13}/></span>
   </SiteLink>
  </div>))}
 </div>;
}
