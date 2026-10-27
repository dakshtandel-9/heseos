'use client';
import { useState } from 'react';
import { BHKS, PACKAGE_TYPES, getPackage, recommendTier, type Bhk, type PackageType, type Priority } from '../../../lib/catalog';
import Price from './Price';
import AddToBag from './AddToBag';
import SiteLink from '../site/SiteLink';
const PRIORITIES:{id:Priority;label:string;body:string}[]=[{id:'climate',label:'AC and TV',body:'Control remote-controlled appliances from the app.'},{id:'energy',label:'Energy',body:'Switch off standby power and track heavy appliances.'}];
// Three questions, one explainable recommendation.
export default function BuildWizard(){
 const [bhk,setBhk]=useState<Bhk>(2),[type,setType]=useState<PackageType>('touch-panel'),[priorities,setPriorities]=useState<Priority[]>(['climate']);
 const tier=recommendTier(priorities),pkg=getPackage(type,bhk,tier);
 const toggle=(p:Priority)=>setPriorities(ps=>ps.includes(p)?ps.filter(x=>x!==p):[...ps,p]);
 return <div className="build">
  <ol className="build-steps">
   <li><h2 className="title">1. Your home</h2><div className="segmented" role="radiogroup" aria-label="Home size">{BHKS.map(b=><button key={b} role="radio" aria-checked={b===bhk} onClick={()=>setBhk(b)}>{b} BHK</button>)}</div></li>
   <li><h2 className="title">2. Your upgrade</h2><div className="choice-grid" role="radiogroup" aria-label="Upgrade type">{PACKAGE_TYPES.map(t=><button key={t.id} role="radio" aria-checked={t.id===type} className="choice" onClick={()=>setType(t.id)}><strong>{t.name}</strong><span>{t.summary}</span></button>)}</div></li>
   <li><h2 className="title">3. What matters most</h2><p className="muted">Lights and switches are always included.</p><div className="choice-grid">{PRIORITIES.map(p=><button key={p.id} aria-pressed={priorities.includes(p.id)} className="choice" onClick={()=>toggle(p.id)}><strong>{p.label}</strong><span>{p.body}</span></button>)}</div></li>
  </ol>
  <aside className="build-result" aria-live="polite">
   <span className="eyebrow">We recommend</span><h2 className="title">{pkg.name}</h2><Price price={pkg.price} mrp={pkg.mrp}/>
   <ul>{pkg.items.map(i=><li key={i.name}>{i.qty} × {i.name}</li>)}</ul>
   <p className="muted">{tier==='premium'?'Premium adds Smart Plugs for energy tracking.':tier==='standard'?'Standard adds IR Blasters for your AC and TV.':'Starter covers your switches. Add AC/TV or energy to see more.'}</p>
   <AddToBag id={pkg.id}/><SiteLink className="link" href="/demo">Book a free demo instead ›</SiteLink>
  </aside>
 </div>;
}
