'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Move3d, Palette, Pointer, Power, Rotate3d, RotateCcw } from 'lucide-react';
import type { FEATURED } from '../../../lib/home';
import SiteLink from '../site/SiteLink';
import HomeIcon from './HomeIcon';
import { useReducedMotion, useWebGLSupport } from '../media/usePlatform';
import type { StudioMode, Target } from './PanelScene';

// three.js loads only as the section comes near the screen, and never on the server.
const PanelScene=dynamic(()=>import('./PanelScene'),{ssr:false});
type Finish={id:string;label:string;swatch?:string};
type Box={x:number;y:number;w:number;h:number};
const PANEL_RATIO=146/86;
// The product photo stands in for the 3D panel while it loads and where WebGL is missing: its aspect, the share of its width
// the panel fills, and its four rings (% of the image), measured on public/media/products/touch-4m.webp.
const PHOTO={ratio:1600/1133,fill:.91,rings:[[39.97,36.28],[61.5,39.32],[38.52,53.72],[60.03,57.39]]};
const MODES=[{id:'rotate',label:'Rotate',short:'Rotate',Icon:Rotate3d},{id:'touch',label:'Touch demo',short:'Touch',Icon:Pointer},{id:'finish',label:'Finishes',short:'Finish',Icon:Palette}] as const;

// Where the panel and the room sit on the stage in each view, in pixels. `dock` is the height of the controls along the bottom.
function layout(mode:StudioMode,W:number,H:number,dock:number,roomRatio:number):{panel:Target;room:Box}{
 const avail=Math.max(200,H-dock),portrait=W/H<1.05;
 let room:Box,touch:Target;
 if(portrait){
  const w=Math.min(W-32,avail*.55*roomRatio),h=w/roomRatio,rest=avail-16-h;
  room={x:(W-w)/2,y:16,w,h};touch={cx:W/2,cy:16+h+rest/2,pw:Math.min(W*.66,rest*.72*PANEL_RATIO),yaw:0,pitch:0};
 }else{
  const h=Math.min(avail-56,W*.5/roomRatio),w=h*roomRatio,x=W-w-Math.max(24,W*.05);
  room={x,y:(avail-h)/2+8,w,h};touch={cx:x/2+12,cy:avail/2+4,pw:Math.min(x*.66,avail*.5*PANEL_RATIO),yaw:0,pitch:0};
 }
 if(mode==='touch')return {room,panel:touch};
 const finish=mode==='finish';
 return {room,panel:{cx:W/2,cy:avail/2+8,pw:Math.min(W*(portrait?.84:finish?.58:.54),avail*(finish?.7:.68)*PANEL_RATIO),yaw:finish?-.72:-.42,pitch:finish?.2:.14}};
}
const px=(b:Box):CSSProperties=>({left:b.x,top:b.y,width:b.w,height:b.h});
const mask=(image:string):CSSProperties=>({maskImage:image,WebkitMaskImage:image});

// Featured product: the Touch Panel as a 3D model to turn, a touch demo that lights a room, and its frame finishes.
export default function PanelStudio({data,finishes}:{data:typeof FEATURED;finishes:Finish[]}){
 const stage=useRef<HTMLDivElement>(null),dock=useRef<HTMLDivElement>(null),firstLight=useRef<HTMLButtonElement>(null);
 const reduced=useReducedMotion(),webgl=useWebGLSupport();
 const [mode,setMode]=useState<StudioMode>('rotate'),[lights,setLights]=useState([false,false,false,false]),[finish,setFinish]=useState(finishes[0]?.id??'');
 const [size,setSize]=useState<{W:number;H:number;dock:number}|null>(null),[near,setNear]=useState(false),[revealed,setRevealed]=useState(false);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[touched,setTouched]=useState(false),[resetKey,setResetKey]=useState(0);
 const live3d=webgl&&!failed,{demo}=data,lit=lights.filter(Boolean).length;
 useEffect(()=>{
  const el=stage.current,bar=dock.current;if(!el||!bar)return;
  const measure=()=>setSize({W:el.clientWidth,H:el.clientHeight,dock:bar.offsetHeight+28});
  const resize=new ResizeObserver(measure);resize.observe(el);resize.observe(bar);
  const soon=new IntersectionObserver(([e])=>{if(e.isIntersecting){setNear(true);soon.disconnect();}},{rootMargin:'900px 0px'});soon.observe(el);
  const seen=new IntersectionObserver(([e])=>{if(e.isIntersecting){setRevealed(true);seen.disconnect();}},{threshold:.3});seen.observe(el);
  return()=>{resize.disconnect();soon.disconnect();seen.disconnect();};
 },[]);
 const at=size&&layout(mode,size.W,size.H,size.dock,demo.ratio);
 const poster=at&&(()=>{const w=at.panel.pw/PHOTO.fill,h=w/PHOTO.ratio;return {x:at.panel.cx-w/2,y:at.panel.cy-h/2,w,h};})();
 const toggle=(i:number)=>{setTouched(true);setLights(l=>l.map((on,j)=>j===i?!on:on));};
 const showDemo=()=>{
  setMode('touch');stage.current?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
  setTimeout(()=>firstLight.current?.focus({preventScroll:true}),reduced?0:500);
 };
 const finishName=finishes.find(f=>f.id===finish)?.label??'';
 const label=mode==='touch'?{title:'Touch demo',line:'Tap a ring on the panel to switch a light.'}
  :mode==='finish'?{title:'Frame finish',line:`${finishName} · Edge and Bezel series`}:{title:data.name,line:`${data.model}${finishName?` · ${finishName} frame`:''}`};
 const [wx,wt,wb]=demo.windows;
 return <section className="ps" aria-labelledby="featured-title">
  <div className="hw">
   <div className="hh" data-reveal>
    <div><span className="ey">{data.eyebrow}</span><h2 id="featured-title" className="ht">{data.title}</h2></div>
    <div className="hh-side"><p>{data.body}</p><div className="ps-ctas">
     <SiteLink className="btn hb" href={data.href}>{data.cta} <ArrowRight size={16}/></SiteLink>
     <button type="button" className="link" onClick={showDemo}>See it in action ›</button>
    </div></div>
   </div>

   <div ref={stage} className={`ps-stage is-${mode}${revealed?' is-revealed':''}${size&&size.W/size.H<1.05?' is-portrait':''}${live3d?'':' is-flat'}`}>
    <img className="ps-backdrop" src={data.backdrop} alt="" loading="lazy"/>
    {/* The room the demo lights: its lights-off base, the city outside (always lit), one layer per circuit, and a fill as more come on. */}
    <div className={'ps-room'+(mode==='touch'?' is-on':'')} style={at?px(at.room):undefined} aria-hidden="true">
     <img className="ps-room-off" src={demo.image} alt="" loading="lazy"/>
     <div className="ps-room-layer" style={mask(`linear-gradient(90deg,#0000 ${wx-2}%,#000 ${wx+2}%)`)}><img src={demo.image} alt="" loading="lazy" style={mask(`linear-gradient(180deg,#0000 ${wt-4}%,#000 ${wt+2}%,#000 ${wb-6}%,#0000 ${wb+2}%)`)}/></div>
     {demo.circuits.map((c,i)=>{const [x,y,rx,ry]=c.zone;return <img key={c.label} className={'ps-room-zone'+(lights[i]?' is-lit':'')} src={demo.image} alt="" loading="lazy" style={mask(`radial-gradient(${rx}% ${ry}% at ${x}% ${y}%,#000 30%,#0000 100%)`)}/>;})}
     <img className="ps-room-fill" src={demo.image} alt="" loading="lazy" style={{opacity:lit*.16}}/>
     <span className="ps-room-tag">Living room · illustrative</span>
    </div>
    {live3d&&near&&<div className={'ps-3d'+(ready?' is-ready':'')}><PanelScene face={data.face} target={at?.panel??{cx:0,cy:0,pw:1,yaw:0,pitch:0}} mode={mode} lights={lights} finish={finish} revealed={revealed} reduced={reduced}
     hint={mode==='touch'&&!touched} resetKey={resetKey} label={`${data.name}, ${data.model}, ${finishName} frame. ${mode==='touch'?'Tap a ring to switch a light.':'Drag or use the arrow keys to turn it.'}`}
     onToggle={toggle} onReady={()=>setReady(true)} onFail={()=>setFailed(true)}/></div>}
    <div className={'ps-poster'+(live3d&&ready?' is-hidden':'')} style={poster?px(poster):undefined}>
     <img src={data.image} alt="Heseos 4 module touch panel in black glass with a champagne frame" loading="lazy"/>
     {!live3d&&mode==='touch'&&PHOTO.rings.map(([x,y],i)=><button key={i} type="button" tabIndex={-1} aria-hidden="true" className={'ps-ring'+(lights[i]?' is-lit':'')} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>toggle(i)}/>)}
    </div>
    <p className="ps-label"><b>{label.title}</b><span>{label.line}</span></p>

    <div ref={dock} className="ps-dock">
     <div className="ps-context">
      {mode==='rotate'&&live3d&&<><span className="ps-hint"><Move3d size={15} aria-hidden="true"/>Drag to turn</span><button type="button" className="ps-chip ghost" onClick={()=>setResetKey(k=>k+1)}><RotateCcw size={14} aria-hidden="true"/>Reset view</button></>}
      {mode==='touch'&&<>{demo.circuits.map((c,i)=><button key={c.label} ref={i===0?firstLight:undefined} type="button" className={'ps-chip'+(lights[i]?' is-on':'')} aria-pressed={lights[i]} onClick={()=>toggle(i)}><i aria-hidden="true"/>{c.label}</button>)}
       <button type="button" className="ps-chip ghost" disabled={!lit} onClick={()=>setLights([false,false,false,false])}><Power size={14} aria-hidden="true"/>All off</button></>}
      {mode==='finish'&&<div className="ps-swatches" role="radiogroup" aria-label="Frame finish">{finishes.map(f=><button key={f.id} type="button" role="radio" aria-checked={finish===f.id} aria-label={f.label} title={f.label} style={{background:f.swatch}} onClick={()=>setFinish(f.id)}/>)}</div>}
     </div>
     {live3d?<div className="ps-tabs" role="radiogroup" aria-label="Explore the panel">{MODES.map(m=><button key={m.id} type="button" role="radio" aria-checked={mode===m.id} onClick={()=>setMode(m.id)}>
      <m.Icon size={16} aria-hidden="true"/><span className="ps-long">{m.label}</span><span className="ps-short">{m.short}</span></button>)}</div>
     :<div className="ps-tabs"><button type="button" aria-pressed={mode==='touch'} onClick={()=>setMode(m=>m==='touch'?'rotate':'touch')}><Pointer size={16} aria-hidden="true"/>Touch demo</button></div>}
    </div>
   </div>

   <ul className="ps-feats" data-reveal>{data.features.map(f=><li key={f.title}>
    <span className="ps-feat-ico"><HomeIcon name={f.icon} size={22}/></span><h3>{f.title}</h3><p>{f.body}</p>
   </li>)}</ul>
  </div>
 </section>;
}
