'use client';
import { Minus, Plus, X } from 'lucide-react';
import { formatINR, resolveBagLine, type BagEntry } from '../../../lib/catalog';
import SiteLink from '../site/SiteLink';
import { useBag } from './BagProvider';
export function useBagEntries(){
 const bag=useBag(),entries=bag.lines.map(resolveBagLine).filter((e):e is BagEntry=>e!==null);
 return {...bag,entries,total:entries.reduce((s,e)=>s+e.price*e.qty,0),mrp:entries.reduce((s,e)=>s+e.mrp*e.qty,0)};
}
export default function BagView(){
 const {entries,ready,total,mrp,setQty,remove}=useBagEntries();
 if(!ready)return <p className="muted center" role="status">Loading your bag…</p>;
 if(!entries.length)return <div className="bag-empty"><h2 className="title">Your bag is empty.</h2><p className="muted">Start with a component or a Smart Package.</p><div className="actions"><SiteLink className="btn" href="/store">Continue shopping</SiteLink></div></div>;
 return <div className="bag">
  <ul className="bag-lines">{entries.map(e=><li key={e.id} className="bag-line">
   <div className="bag-line-media">{e.image?<img src={e.image} alt=""/>:<span className="placeholder">Package</span>}</div>
   <div className="bag-line-info"><SiteLink href={e.href} className="bag-line-name">{e.name}</SiteLink><span className="muted">{e.detail}</span>
    <div className="qty" role="group" aria-label={`Quantity of ${e.name}`}><button aria-label="Decrease quantity" onClick={()=>setQty(e.id,e.qty-1)}><Minus size={14}/></button><span className="tabular" aria-live="polite">{e.qty}</span><button aria-label="Increase quantity" disabled={e.qty>=10} onClick={()=>setQty(e.id,e.qty+1)}><Plus size={14}/></button></div></div>
   <div className="bag-line-price"><strong className="tabular">{formatINR(e.price*e.qty)}</strong><button className="link" onClick={()=>remove(e.id)}><X size={14}/> Remove</button></div>
  </li>)}</ul>
  <div className="bag-summary">
   <div><span>Subtotal</span><span className="tabular">{formatINR(mrp)}</span></div>
   <div className="save"><span>Savings</span><span className="tabular">−{formatINR(mrp-total)}</span></div>
   <div className="total"><span>Total</span><strong className="tabular">{formatINR(total)}</strong></div>
   <p className="muted">Delivery and installation details are confirmed with your order.</p>
   <SiteLink className="btn" href="/checkout">Check out</SiteLink>
  </div>
 </div>;
}
