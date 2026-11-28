'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Film } from '../../../lib/testimonials';

type Item=Film&{name:string;slug:string};
const FILTERS=[{k:'all',l:'All films'},{k:'reel',l:'Vertical reels'},{k:'film',l:'Landscape films'},{k:'full',l:'Full interview'}] as const;
const fmt=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

// Every film in one filterable wall; a card previews on hover and opens in a player with sound.
export default function FilmWall({items}:{items:Item[]}){
 const [filter,setFilter]=useState<(typeof FILTERS)[number]['k']>('all');
 const [open,setOpen]=useState<Item|null>(null);
 const dlg=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=dlg.current;if(!d)return;if(open&&!d.open)d.showModal();if(!open&&d.open)d.close();},[open]);
 // Reels first, then the full interview, then landscape films, so the grid tiles cleanly.
 const rank=(i:Item)=>i.orient==='v'?0:i.kind==='full'?1:2;
 const shown=items.filter(i=>filter==='all'||i.kind===filter).sort((a,b)=>rank(a)-rank(b));
 const hover=(e:React.PointerEvent<HTMLButtonElement>,on:boolean)=>{
  if(e.pointerType!=='mouse')return;const v=e.currentTarget.querySelector('video');if(!v)return;
  if(on){v.currentTime=8;v.play().catch(()=>{});}else v.pause();
 };

 return <>
  <div className="fw-filters" role="group" aria-label="Filter films">{FILTERS.map(f=><button key={f.k} type="button" aria-pressed={filter===f.k} onClick={()=>setFilter(f.k)}>{f.l}<small>{f.k==='all'?items.length:items.filter(i=>i.kind===f.k).length}</small></button>)}</div>
  <ul className="fw">{shown.map(i=><li key={i.src} className={'fw-'+i.orient+(i.kind==='full'?' fw-full':'')}>
   <button type="button" onClick={()=>setOpen(i)} onPointerEnter={e=>hover(e,true)} onPointerLeave={e=>hover(e,false)} aria-label={`Play ${i.name}, ${i.label.toLowerCase()}, ${fmt(i.duration)}`}>
    <img src={i.poster} alt="" loading="lazy"/>
    <video src={i.src+'#t=8'} muted playsInline preload="none" aria-hidden="true"/>
    <span className="fw-play"><Play size={18} fill="currentColor"/></span>
    <span className="fw-cap"><b>{i.name}</b><span>{i.label} · {fmt(i.duration)}</span></span>
   </button>
  </li>)}</ul>
  <dialog ref={dlg} className="fw-dlg" onClose={()=>setOpen(null)} onClick={e=>{if(e.target===dlg.current)setOpen(null);}} aria-label={open?`${open.name}, ${open.label}`:'Film player'}>
   {open&&<div className={'fw-dlg-in fw-'+open.orient}>
    <video src={open.src} poster={open.poster} controls autoPlay playsInline/>
    <div className="fw-dlg-cap"><b>{open.name}</b><span>{open.label}</span><a href={'#'+open.slug} onClick={()=>setOpen(null)}>Read the story</a></div>
    <button type="button" className="fw-x" onClick={()=>setOpen(null)} aria-label="Close player"><X size={20}/></button>
   </div>}
  </dialog>
 </>;
}
