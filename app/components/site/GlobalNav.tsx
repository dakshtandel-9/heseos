'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import type { NavItem } from '../../../lib/site';
import SiteLink from './SiteLink';
// The site header: transparent over the homepage hero, solid everywhere else. Flyouts open on hover or focus; below 1000px the links move into a sheet.
export default function GlobalNav({nav}:{nav:NavItem[]}){
 const pathname=usePathname(),[open,setOpen]=useState(false),[shownPath,setShownPath]=useState(pathname);
 if(shownPath!==pathname){setShownPath(pathname);setOpen(false);}
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};document.body.style.overflow='hidden';window.addEventListener('keydown',close);return()=>{document.body.style.overflow='';window.removeEventListener('keydown',close);};},[open]);
 const current=(href:string)=>pathname===href||(href!=='/'&&pathname.startsWith(href+'/'))?'page' as const:undefined;
 return <header className={'hdr'+(pathname==='/'?' over':'')+(open?' open':'')}>
  <nav className="hdr-inner" aria-label="Global">
   <SiteLink href="/" className="hdr-logo" aria-label="Heseos home"><img src="/assets/heseos-logo-white.png" alt="" width="2588" height="896"/></SiteLink>
   <ul className="hdr-links">{nav.map(item=><li key={item.href} className="hdr-item">
    <SiteLink href={item.href} className="hdr-link" aria-current={current(item.href)}>{item.label}</SiteLink>
    {item.groups&&<div className={'hdr-flyout'+(item.href==='/products'?' hdr-flyout--products':'')}>{item.groups.map(g=><div key={g.title}><h2>{g.href?<SiteLink href={g.href}>{g.title}</SiteLink>:g.title}</h2><ul className={g.big?'big':''}>{g.links.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul></div>)}</div>}
   </li>)}</ul>
   <div className="hdr-actions">
    <SiteLink href="/products#search" className="hdr-icon" aria-label="Search products"><Search size={18} strokeWidth={1.8}/></SiteLink>
    <SiteLink href="/demo" className="btn small hdr-cta">Book a Demo</SiteLink>
    <button className="hdr-icon hdr-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="hdr-sheet" onClick={()=>setOpen(o=>!o)}>{open?<X size={20} strokeWidth={1.8}/>:<Menu size={20} strokeWidth={1.8}/>}</button>
   </div>
  </nav>
  <div id="hdr-sheet" className="hdr-sheet" inert={!open}>
   <ul>{nav.map(item=><li key={item.href}><SiteLink href={item.href} onClick={()=>setOpen(false)}>{item.label}</SiteLink></li>)}</ul>
   <ul className="sub">{['/experience'].map(href=>{const link=nav.flatMap(i=>i.groups??[]).flatMap(g=>g.links).find(l=>l.href===href)!;return <li key={href}><SiteLink href={href} onClick={()=>setOpen(false)}>{link.label}</SiteLink></li>;})}</ul>
   <SiteLink href="/demo" className="btn" onClick={()=>setOpen(false)}>Book a Demo</SiteLink>
  </div>
 </header>;
}
