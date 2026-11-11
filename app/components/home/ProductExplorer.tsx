'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
type Range={slug:string;name:string;tagline:string;image:string;href:string;families:number};
// Product ranges by category: tabs switch the category, the first range in each gets the large tile.
export default function ProductExplorer({categories}:{categories:{slug:string;name:string;href:string;ranges:Range[]}[]}){
 const [active,setActive]=useState(categories[0].slug),current=categories.find(c=>c.slug===active)!;
 return <div className="px">
  <div className="px-tabs" role="tablist" aria-label="Product categories">{categories.map(c=><button key={c.slug} type="button" role="tab" id={`tab-${c.slug}`} aria-selected={c.slug===active} aria-controls="px-panel" onClick={()=>setActive(c.slug)}>{c.name}<span>{c.ranges.length}</span></button>)}</div>
  <div id="px-panel" role="tabpanel" aria-labelledby={`tab-${active}`} key={active} className={'px-grid n'+current.ranges.length}>
   {current.ranges.map((r,i)=><SiteLink key={r.slug} href={r.href} className={'px-tile'+(i===0?' lead':'')} style={{animationDelay:`${i*60}ms`}}>
    <img src={r.image} alt="" loading="lazy"/>
    <span className="px-copy"><span className="px-meta">{r.families===1?'1 product family':`${r.families} product families`}</span><b>{r.name}</b><span>{r.tagline}</span></span>
    <span className="px-go" aria-hidden="true"><ArrowUpRight size={18}/></span>
   </SiteLink>)}
  </div>
  <SiteLink href={current.href} className="px-all">All {current.name} <ArrowUpRight size={16}/></SiteLink>
 </div>;
}
