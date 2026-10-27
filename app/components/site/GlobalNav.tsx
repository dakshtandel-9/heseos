'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { NAV } from '../../../lib/site';
import { useBag } from '../commerce/BagProvider';
import SiteLink from './SiteLink';
export default function GlobalNav(){
 const pathname=usePathname(),{count}=useBag(),[open,setOpen]=useState(false),[shownPath,setShownPath]=useState(pathname);
 if(shownPath!==pathname){setShownPath(pathname);setOpen(false);}
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};document.body.style.overflow='hidden';window.addEventListener('keydown',close);return()=>{document.body.style.overflow='';window.removeEventListener('keydown',close);};},[open]);
 const current=(href:string)=>pathname===href||(href!=='/'&&pathname.startsWith(href+'/'))?'page' as const:undefined;
 return <header className="gnav">
  <nav className="gnav-inner" aria-label="Global">
   <SiteLink href="/" className="gnav-logo" aria-label="Heseos home"><img src="/assets/heseos-logo-white.png" alt="" width="2588" height="896"/></SiteLink>
   <ul className="gnav-links">{NAV.map(item=><li key={item.href} className="gnav-item">
    <SiteLink href={item.href} className="gnav-link" aria-current={current(item.href)}>{item.label}</SiteLink>
    {item.groups&&<div className="gnav-flyout">{item.groups.map(g=><div key={g.title}><h2>{g.title}</h2><ul className={g.big?'big':''}>{g.links.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul></div>)}</div>}
   </li>)}</ul>
   <div className="gnav-actions">
    <SiteLink href="/bag" className="gnav-icon" aria-label={count?`Bag, ${count} item${count===1?'':'s'}`:'Bag'}><ShoppingBag size={17} strokeWidth={1.6}/>{count>0&&<span className="bag-count tabular" aria-hidden="true">{count}</span>}</SiteLink>
    <button className="gnav-icon gnav-menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="gnav-sheet" onClick={()=>setOpen(o=>!o)}>{open?<X size={20} strokeWidth={1.6}/>:<Menu size={20} strokeWidth={1.6}/>}</button>
   </div>
  </nav>
  <div id="gnav-sheet" className={'gnav-sheet'+(open?' open':'')} inert={!open}>
   <ul>{NAV.map(item=><li key={item.href}><SiteLink href={item.href} onClick={()=>setOpen(false)}>{item.label}</SiteLink></li>)}</ul>
   <ul className="sub">{['/packages','/demo','/saving-power'].map(href=>{const link=NAV.flatMap(i=>i.groups??[]).flatMap(g=>g.links).find(l=>l.href===href)!;return <li key={href}><SiteLink href={href} onClick={()=>setOpen(false)}>{link.label}</SiteLink></li>;})}</ul>
  </div>
 </header>;
}
