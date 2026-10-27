'use client';
import { useState } from 'react';
import { Check, Minus } from 'lucide-react';
import { BHKS, PACKAGE_IMAGE, PACKAGE_TYPES, TIERS, getPackage, type Bhk, type PackageType } from '../../../lib/catalog';
import Price from './Price';
import AddToBag from './AddToBag';
// Starter, Standard and Premium side by side for one home size and upgrade type.
export default function PackageCompare({initialType='touch-panel',initialBhk=2}:{initialType?:PackageType;initialBhk?:Bhk}){
 const [type,setType]=useState<PackageType>(initialType),[bhk,setBhk]=useState<Bhk>(initialBhk);
 const info=PACKAGE_TYPES.find(t=>t.id===type)!,image=PACKAGE_IMAGE[type];
 return <div className="compare">
  <div className="compare-filters">
   <div className="segmented" role="radiogroup" aria-label="Home size">{BHKS.map(b=><button key={b} role="radio" aria-checked={b===bhk} onClick={()=>setBhk(b)}>{b} BHK</button>)}</div>
   <div className="segmented" role="radiogroup" aria-label="Upgrade type">{PACKAGE_TYPES.map(t=><button key={t.id} role="radio" aria-checked={t.id===type} onClick={()=>setType(t.id)}>{t.name}</button>)}</div>
  </div>
  <p className="compare-summary muted">{info.summary}</p>
  <div className="compare-grid">{TIERS.map(t=>{const pkg=getPackage(type,bhk,t.id);return <article key={t.id} className={'compare-card'+(t.id==='premium'?' featured':'')}>
   {t.id==='premium'&&<span className="badge">Includes all three components</span>}
   <div className="compare-media">{image?<img src={image} alt="" loading="lazy"/>:<span className="placeholder">{info.name}</span>}</div>
   <h3 className="title">{t.name}</h3>
   <Price price={pkg.price} mrp={pkg.mrp}/>
   <ul className="compare-items">{[info.switchItem,'IR Blaster','Smart Plug'].map(name=>{const item=pkg.items.find(i=>i.name===name);return <li key={name} className={item?'':'missing'}>{item?<Check size={16}/>:<Minus size={16}/>}<span>{item?`${item.qty} × ${name}`:name}</span></li>;})}</ul>
   <AddToBag id={pkg.id} className="small"/>
  </article>;})}</div>
 </div>;
}
