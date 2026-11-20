'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import './NumberStack.css';

type Stat={value:string;label:string};
type Photo={src:string;alt:string};
type Dot={tx:number;ty:number;sx:number;sy:number;d:number;c:number;tw:number;ph:number;curl:number;ox:number;oy:number};

// Window-light colours, warm white to amber; the warmer ones are rarer.
const COLORS=['#fff1d6','#ffdcaa','#ffc677','#ffab4f'],WEIGHTS=[.3,.35,.22,.13];
const MAX_DELAY=.42,SPAN=1-MAX_DELAY,REPEL=70;
const BLEED={x:28,top:40,bottom:110};
const easeIO=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v:number)=>Math.min(Math.max(v,0),1);
const pick=()=>{let r=Math.random(),i=0;while(i<WEIGHTS.length-1&&(r-=WEIGHTS[i])>0)i++;return i;};

// A soft round light: bright core, warm halo. Drawn once per colour and stamped for every dot.
function sprite(color:string){
 const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d')!;
 const grad=g.createRadialGradient(32,32,0,32,32,32);
 grad.addColorStop(0,'#ffffff');grad.addColorStop(.2,color);grad.addColorStop(.34,color+'80');grad.addColorStop(.62,color+'1a');grad.addColorStop(1,color+'00');
 g.fillStyle=grad;g.fillRect(0,0,64,64);return c;
}

// "What we have done so far". It carries on the hero's night: each figure is drawn in lights, like the city's windows.
// As a row scrolls up, its lights rise from below and gather into the number; scrolling back scatters them again.
// Lights twinkle once in place and shy away from the pointer. The real figure stays in the page for screen readers,
// and shows as plain text if the canvas can't run. With reduced motion the figures are drawn formed and still.
export default function NumberStack({eyebrow,title,body,stats,details,photos,cta}:{eyebrow:string;title:readonly string[];body:string;stats:Stat[];details:readonly string[];photos:readonly Photo[];cta?:{href:string;label:string}}){
 const root=useRef<HTMLElement>(null);

 useEffect(()=>{
  const sec=root.current;if(!sec)return;
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sprites=COLORS.map(sprite);
  let dead=false,frame=0;

  const rows=[...sec.querySelectorAll<HTMLElement>('.ns-row')].map(row=>{
   const fig=row.querySelector<HTMLElement>('.ns-fig')!,val=fig.querySelector<HTMLElement>('.ns-val')!,cv=fig.querySelector('canvas')!;
   const ctx=cv.getContext('2d')!;
   return {row,fig,val,cv,ctx,dots:[] as Dot[],step:4,W:0,H:0,p:still?1:0,seen:false,ptr:null as null|{x:number;y:number}};
  });
  type Row=typeof rows[number];

  // Lay the figure out in lights: draw the text where the page put it, then keep one dot per grid cell it covers.
  const measure=(r:Row)=>{
   const fr=r.fig.getBoundingClientRect(),vr=r.val.getBoundingClientRect(),cs=getComputedStyle(r.val);
   const W=Math.ceil(fr.width+BLEED.x*2),H=Math.ceil(fr.height+BLEED.top+BLEED.bottom),dpr=Math.min(devicePixelRatio||1,2);
   if(!W||!H)return;
   r.W=W;r.H=H;r.cv.width=Math.round(W*dpr);r.cv.height=Math.round(H*dpr);
   r.ctx.setTransform(dpr,0,0,dpr,0,0);
   const fs=parseFloat(cs.fontSize),step=r.step=Math.max(3.4,fs/23);
   const oc=document.createElement('canvas');oc.width=W;oc.height=H;const o=oc.getContext('2d',{willReadFrequently:true})!;
   o.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
   if('letterSpacing' in o)(o as CanvasRenderingContext2D&{letterSpacing:string}).letterSpacing=cs.letterSpacing;
   o.textBaseline='middle';
   const text=r.val.textContent??'',m=o.measureText(text).width||1;
   o.setTransform(vr.width/m,0,0,1,vr.left-fr.left+BLEED.x,vr.top-fr.top+BLEED.top+vr.height/2);
   o.fillText(text,0,0);
   const px=o.getImageData(0,0,W,H).data,dots:Dot[]=[];
   for(let y=step/2;y<H;y+=step)for(let x=step/2;x<W;x+=step){
    if(px[(Math.floor(y)*W+Math.floor(x))*4+3]<110)continue;
    dots.push({tx:x,ty:y,sx:Math.random()*W,sy:H*(.45+.55*Math.pow(Math.random(),.6)),d:Math.random()*(MAX_DELAY-.1)+x/W*.1,
     c:pick(),tw:.8+Math.random()*1.6,ph:Math.random()*6.3,curl:(Math.random()-.5)*90,ox:0,oy:0});
   }
   r.dots=dots;
  };

  const draw=(r:Row,t:number)=>{
   const {ctx,W,H,step}=r;
   ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
   for(const d of r.dots){
    const e=easeIO(clamp((r.p-d.d)/SPAN));
    let x=d.sx+(d.tx-d.sx)*e+d.curl*Math.sin(Math.PI*e),y=d.sy+(d.ty-d.sy)*e;
    let tox=0,toy=0;
    if(r.ptr){const dx=x-r.ptr.x,dy=y-r.ptr.y,dist=Math.hypot(dx,dy);if(dist<REPEL&&dist>.01){const f=Math.pow(1-dist/REPEL,2)*26;tox=dx/dist*f;toy=dy/dist*f;}}
    d.ox+=(tox-d.ox)*.16;d.oy+=(toy-d.oy)*.16;x+=d.ox;y+=d.oy;
    let a=.14+.86*e;
    if(e===1&&!still)a*=.84+.16*Math.sin(t*.001*d.tw+d.ph);
    const s=step*(1.3+.6*e);
    ctx.globalAlpha=a;ctx.drawImage(sprites[d.c],x-s/2,y-s/2,s,s);
   }
  };

  // Each row forms as its top travels from near the bottom of the screen to a little above the middle.
  const target=(r:Row)=>{const b=r.row.getBoundingClientRect();return clamp((innerHeight*.94-b.top)/(innerHeight*.5));};
  const visible=new Set<Row>();
  const tick=(t:number)=>{
   frame=0;
   for(const r of visible){
    if(!still){const want=target(r);r.p+=(want-r.p)*.12;if(Math.abs(want-r.p)<.0008)r.p=want;}
    r.row.style.setProperty('--p',r.p.toFixed(3));
    draw(r,t);
   }
   if(visible.size&&!still&&!dead)frame=requestAnimationFrame(tick);
  };
  const run=()=>{if(!frame&&!dead)frame=requestAnimationFrame(tick);};

  const io=new IntersectionObserver(es=>{es.forEach(e=>{const r=rows.find(x=>x.row===e.target)!;if(e.isIntersecting)visible.add(r);else visible.delete(r);});run();},{rootMargin:'120px 0px'});
  const ro=new ResizeObserver(es=>{es.forEach(e=>{const r=rows.find(x=>x.fig===e.target);if(r)measure(r);});run();});
  const listeners=rows.map(r=>{
   const move=(e:PointerEvent)=>{const b=r.fig.getBoundingClientRect();r.ptr={x:e.clientX-b.left+BLEED.x,y:e.clientY-b.top+BLEED.top};run();};
   const leave=()=>{r.ptr=null;run();};
   r.fig.addEventListener('pointermove',move);r.fig.addEventListener('pointerleave',leave);
   return()=>{r.fig.removeEventListener('pointermove',move);r.fig.removeEventListener('pointerleave',leave);};
  });

  document.fonts.ready.then(()=>{
   if(dead)return;
   rows.forEach(r=>{measure(r);ro.observe(r.fig);io.observe(r.row);if(still)r.row.style.setProperty('--p','1');});
   sec.classList.add('lit');run();
  });
  return()=>{dead=true;cancelAnimationFrame(frame);io.disconnect();ro.disconnect();listeners.forEach(f=>f());};
 },[stats]);

 return <section ref={root} className="ns" aria-labelledby="numbers-title">
  <div className="hw">
   <div className="ns-head" data-reveal>
    <div>
     <span className="ey">{eyebrow}</span>
     <h2 id="numbers-title" className="ns-title">{title.map((line,i)=><span key={line} className={`l${i}`}>{line}</span>)}</h2>
    </div>
    <p className="ns-body">{body}</p>
   </div>

   <ol className="ns-list">{stats.map((s,i)=><li key={s.label} className="ns-row">
    <span className="ns-i" aria-hidden="true">0{i+1}<em>/ 0{stats.length}</em></span>
    <div className="ns-fig"><canvas aria-hidden="true"/><span className="ns-val">{s.value}</span></div>
    {photos[i]&&<figure className="ns-photo"><img src={photos[i].src} alt={photos[i].alt} loading="lazy" decoding="async"/></figure>}
    <div className="ns-copy"><h3 className="ns-label">{s.label}</h3>{details[i]&&<p>{details[i]}</p>}</div>
   </li>)}</ol>

   {cta&&<div className="ns-foot" data-reveal>
    <p>Every light above is a real home, office or hotel, switched on with Heseos.</p>
    <SiteLink href={cta.href} className="ns-cta">{cta.label}<b><ArrowUpRight size={17}/></b></SiteLink>
   </div>}
  </div>
 </section>;
}
