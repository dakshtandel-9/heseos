'use client';
import { useState } from 'react';
import { BHKS, PACKAGE_TYPES, TIERS, formatINR, getPackage, type Bhk } from '../../../lib/catalog';
import AddToBag from './AddToBag';
// Every upgrade type and tier for one home size, in a single table.
export default function CompareTable(){
 const [bhk,setBhk]=useState<Bhk>(2);
 return <div className="compare-table-wrap">
  <div className="compare-filters"><div className="segmented" role="radiogroup" aria-label="Home size">{BHKS.map(b=><button key={b} role="radio" aria-checked={b===bhk} onClick={()=>setBhk(b)}>{b} BHK</button>)}</div></div>
  <div className="table-scroll"><table className="compare-table">
   <caption className="sr-only">Heseos packages for a {bhk} BHK home</caption>
   <thead><tr><th scope="col">Upgrade</th>{TIERS.map(t=><th key={t.id} scope="col">{t.name}</th>)}</tr></thead>
   <tbody>{PACKAGE_TYPES.map(type=><tr key={type.id}><th scope="row">{type.name}<span className="muted">{type.summary}</span></th>
    {TIERS.map(t=>{const pkg=getPackage(type.id,bhk,t.id);return <td key={t.id}><strong className="tabular">{formatINR(pkg.price)}</strong><s className="tabular">{formatINR(pkg.mrp)}</s>
     <ul>{pkg.items.map(i=><li key={i.name}>{i.qty} × {i.name}</li>)}</ul><AddToBag id={pkg.id} className="small"/></td>;})}</tr>)}</tbody>
  </table></div>
 </div>;
}
