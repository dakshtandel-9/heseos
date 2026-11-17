'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import SiteLink from '../site/SiteLink';
import './HeroOrbit.css';

type OrbitCard={slug:string;name:string;image:string;href:string};

const LAPS=2;            // each category appears twice around the orbit
const DRIFT=.0045;       // orbit turned per second while idle (fraction of a lap)
const SCROLL_TURN=.3;    // orbit turned across the hero's scroll
const SPREAD=.5;         // how far the orbit opens out by the end of the scroll
const SAMPLES=720;
const TAU=Math.PI*2;

// The tagline sits inside an elliptical orbit of the product categories. Cards are spaced by arc length,
// tilt along the path, drift on their own, and scrolling turns the orbit and opens it out to hand over to the story strip.
export default function HeroOrbit({cards,bridge,children}:{cards:OrbitCard[];bridge:{title:string;points:string[]};children:ReactNode}){
 const root=useRef<HTMLElement>(null),ring=useRef<HTMLUListElement>(null),track=useRef<SVGSVGElement>(null);
 const items=Array.from({length:cards.length*LAPS},(_,i)=>({...cards[i%cards.length],copy:i>=cards.length}));

 useEffect(()=>{
  const sec=root.current,list=ring.current,svg=track.current;
  if(!sec||!list||!svg)return;
  const stage=sec.firstElementChild as HTMLElement,els=[...list.children] as HTMLElement[],paths=[...svg.querySelectorAll('ellipse')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lut=new Float64Array(SAMPLES+1);
  let w=0,h=0,cx=0,cy=0,rx=0,ry=0;

  const measure=()=>{
   w=stage.clientWidth;h=stage.clientHeight;
   const card=els[0].offsetHeight,mobile=w<760;
   cx=w/2;cy=h*(mobile?.68:.72);
   ry=Math.max(cy-(72+card/2+16),160);
   rx=mobile?Math.max(w*.6,ry*.6):Math.min(w*.47,ry*1.75);
   for(let i=1;i<=SAMPLES;i++){const t=(i-.5)/SAMPLES*TAU;lut[i]=lut[i-1]+Math.hypot(rx*Math.cos(t),ry*Math.sin(t))*TAU/SAMPLES;}
   svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  };
  // Parametric angle at a given arc length, so cards sit evenly however wide the ellipse is.
  const thetaAt=(s:number)=>{
   let lo=0,hi=SAMPLES;
   while(hi-lo>1){const mid=(lo+hi)>>1;if(lut[mid]<=s)lo=mid;else hi=mid;}
   return (lo+(s-lut[lo])/((lut[hi]-lut[lo])||1))/SAMPLES*TAU;
  };

  let drift=0,hold=false,frame=0,phase='';
  const start=performance.now();let last=start;
  const render=(now:number)=>{
   frame=0;
   const dt=Math.min(now-last,64)/1000;last=now;
   if(!hold&&!reduce)drift+=dt*DRIFT;
   const r=sec.getBoundingClientRect(),span=r.height-h;
   const p=reduce||span<=0?0:Math.min(Math.max(-r.top/span,0),1);
   const intro=reduce?1:1-Math.pow(1-Math.min((now-start)/1800,1),3);
   const s=(.86+.14*intro)*(1+p*SPREAD),turn=drift+p*SCROLL_TURN-(1-intro)*.05,L=lut[SAMPLES];
   els.forEach((el,i)=>{
    const f=((i/els.length+turn)%1+1)%1,t=thetaAt(f*L);
    const x=cx+s*rx*Math.sin(t),y=cy-s*ry*Math.cos(t),a=Math.atan2(ry*Math.sin(t),rx*Math.cos(t))*180/Math.PI;
    el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${a.toFixed(2)}deg)`;
    // Fade cards out on the lower half of the orbit, where they would turn upside down.
    el.style.opacity=Math.min(Math.max((Math.cos(t)+.42)/.3,0),1).toFixed(2);
   });
   paths.forEach(e=>{e.setAttribute('cx',String(cx));e.setAttribute('cy',String(cy));e.setAttribute('rx',(s*rx).toFixed(1));e.setAttribute('ry',(s*ry).toFixed(1));});
   stage.style.setProperty('--p',p.toFixed(4));
   stage.style.setProperty('--intro',intro.toFixed(3));
   const next=p>.4?'2':'1';
   if(next!==phase){phase=next;stage.dataset.phase=next;}
   if(!reduce)frame=requestAnimationFrame(render);
  };
  const run=()=>{if(!frame)frame=requestAnimationFrame(render);};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};

  measure();
  const ro=new ResizeObserver(()=>{measure();if(reduce)run();});
  ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)run();else if(!reduce)stop();});
  io.observe(sec);
  const holdOn=()=>{hold=true;},holdOff=()=>{hold=false;};
  list.addEventListener('pointerenter',holdOn);list.addEventListener('pointerleave',holdOff);
  list.addEventListener('focusin',holdOn);list.addEventListener('focusout',holdOff);
  return ()=>{
   stop();ro.disconnect();io.disconnect();
   list.removeEventListener('pointerenter',holdOn);list.removeEventListener('pointerleave',holdOff);
   list.removeEventListener('focusin',holdOn);list.removeEventListener('focusout',holdOff);
  };
 },[]);

 return <section ref={root} className="ho" aria-labelledby="hero-title">
  <div className="ho-stage">
   <div className="ho-glow" aria-hidden="true"/>
   <svg ref={track} className="ho-track" aria-hidden="true" preserveAspectRatio="none">
    <ellipse className="ho-path"/>
    <ellipse className="ho-comet" pathLength={100}/>
   </svg>
   <ul ref={ring} className="ho-ring" aria-label="Product categories">
    {items.map((c,i)=><li key={i} className="ho-card" aria-hidden={c.copy||undefined}>
     <SiteLink href={c.href} tabIndex={c.copy?-1:undefined}>
      <img src={c.image} alt="" loading={i<6?'eager':'lazy'} decoding="async"/>
      <span>{c.name}</span>
     </SiteLink>
    </li>)}
   </ul>
   <div className="ho-copy">{children}</div>
   <div className="ho-bridge">
    <p>{bridge.title}</p>
    <ul>{bridge.points.map(t=><li key={t}>{t}</li>)}</ul>
   </div>
   <span className="ho-hint" aria-hidden="true">Scroll<i/></span>
  </div>
 </section>;
}
