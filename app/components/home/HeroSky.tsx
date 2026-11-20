'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import './HeroSky.css';

type Frames={dir:string;count:number;width:number;height:number;mWidth:number;mHeight:number};
const pad=(n:number)=>String(n).padStart(3,'0');
const ease=(t:number)=>1-Math.pow(1-t,3);
// The opening: a few homes light up on their own as the page opens, then scrolling lights the rest.
const INTRO=.1,INTRO_MS=2600;
// The camera: zoomed in a little so the city fills more of the screen, pushing in further as the night falls.
const ZOOM_FROM=1.16,ZOOM_TO=1.32;

// The homepage hero. The section is taller than the screen; its stage stays pinned while you scroll through it,
// and the scroll plays a timelapse of a city going from blue hour to night as every home's lights come on.
// Frames are drawn to a canvas, blending neighbours so the motion stays smooth; they load coarse-to-fine, so
// scrolling works early and sharpens as the rest arrive. Text and cards stay as they are throughout.
export default function HeroSky({frames,children}:{frames:Frames;children:ReactNode}){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);

 useEffect(()=>{
  const sec=root.current,cv=canvas.current;
  if(!sec||!cv||!frames.count)return;
  const stage=sec.firstElementChild as HTMLElement,ctx=cv.getContext('2d',{alpha:false});
  if(!ctx)return;
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small=matchMedia('(max-width:760px)').matches;
  const n=frames.count,imgs:(HTMLImageElement|null)[]=Array(n).fill(null);
  const src=(i:number)=>`${frames.dir}/${small?'m/':''}${pad(i)}.webp`;
  let p=0,intro=still?1:0,frame=0,dead=false,drawn=-1;
  const t0=performance.now();

  // Coarse to fine: first and last, then every 16th, 8th, 4th, 2nd, then the rest.
  const order:number[]=[];const seen=new Set<number>();
  const push=(i:number)=>{if(i>=0&&i<n&&!seen.has(i)){seen.add(i);order.push(i);}};
  push(0);push(n-1);for(const step of [16,8,4,2,1])for(let i=0;i<n;i+=step)push(i);
  let next=0,busy=0;
  const pump=()=>{while(busy<4&&next<order.length){const i=order[next++],im=new Image();busy++;im.decoding='async';
   im.onload=()=>{busy--;imgs[i]=im;if(!dead){queue();pump();}};im.onerror=()=>{busy--;if(!dead)pump();};im.src=src(i);}};

  const size=()=>{const dpr=Math.min(devicePixelRatio||1,2),w=stage.clientWidth,h=stage.clientHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);drawn=-1;};
  const nearest=(i:number,dir:1|-1)=>{for(let k=i;k>=0&&k<n;k+=dir)if(imgs[k])return k;return -1;};
  const progress=()=>{const r=sec.getBoundingClientRect(),run=sec.offsetHeight-stage.offsetHeight;return run>0?Math.min(Math.max(-r.top/run,0),1):0;};

  const draw=()=>{
   frame=0;
   const now=performance.now();
   if(intro<1)intro=Math.min((now-t0)/INTRO_MS,1);
   const target=still?.85:INTRO*ease(intro)+(1-INTRO)*progress();
   p+=(target-p)*(still?1:.18);if(Math.abs(target-p)<.0005)p=target;
   const f=p*(n-1),a=nearest(Math.floor(f),-1),b=nearest(Math.ceil(f),1);
   if(a<0){if(intro<1||p!==target)queue();return;}
   const key=Math.round(f*100)+cv.width;
   if(key!==drawn){
    drawn=key;
    const W=cv.width,H=cv.height,im=imgs[a]!,iw=im.naturalWidth,ih=im.naturalHeight;
    const zoom=ZOOM_FROM+(ZOOM_TO-ZOOM_FROM)*ease(p),s=Math.max(W/iw,H/ih)*zoom;
    const dw=iw*s,dh=ih*s,dx=(W-dw)/2,dy=(H-dh)*.62;
    ctx.globalAlpha=1;ctx.drawImage(im,dx,dy,dw,dh);
    if(b>a&&imgs[b]){ctx.globalAlpha=(f-a)/(b-a);ctx.drawImage(imgs[b]!,dx,dy,dw,dh);}
    sec.classList.add('live');
   }
   if(intro<1||p!==target)queue();
  };
  const queue=()=>{if(!frame&&!dead)frame=requestAnimationFrame(draw);};

  size();pump();queue();
  const ro=new ResizeObserver(()=>{size();queue();});ro.observe(stage);
  window.addEventListener('scroll',queue,{passive:true});
  return()=>{dead=true;cancelAnimationFrame(frame);ro.disconnect();window.removeEventListener('scroll',queue);};
 },[frames]);

 const first=`${frames.dir}/000.webp`,firstSmall=`${frames.dir}/m/000.webp`;
 return <section ref={root} className="hs" aria-labelledby="hero-title" data-nav-clear>
  <div className="hs-stage">
   <div className="hs-bg" aria-hidden="true">
    <picture><source media="(max-width:760px)" srcSet={firstSmall}/><img src={first} alt="" fetchPriority="high" decoding="async"/></picture>
    <canvas ref={canvas}/>
   </div>
   <div className="hs-shade" aria-hidden="true"/>
   {children}
  </div>
 </section>;
}
