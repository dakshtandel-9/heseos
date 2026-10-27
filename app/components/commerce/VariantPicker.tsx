'use client';
import { useState } from 'react';
import type { Product } from '../../../lib/catalog';
// Swaps the product photo as a size is chosen.
export default function VariantPicker({product,heading='Choose a size'}:{product:Product;heading?:string}){
 const variants=product.variants??[],[active,setActive]=useState(variants[1]?.id??variants[0]?.id);
 const current=variants.find(v=>v.id===active)??variants[0];
 if(!current)return null;
 return <div className="variant-picker">
  <div className="variant-media">{variants.map(v=><img key={v.id} src={v.image} alt={`${product.name} ${v.label}`} className={v.id===active?'active':''} loading="lazy" aria-hidden={v.id!==active}/>)}</div>
  <div className="variant-options"><span className="variant-heading">{heading} <b>{current.label}</b></span>
   <div className="segmented" role="radiogroup" aria-label={heading}>{variants.map(v=><button key={v.id} role="radio" aria-checked={v.id===active} onClick={()=>setActive(v.id)}>{v.label}</button>)}</div></div>
 </div>;
}
