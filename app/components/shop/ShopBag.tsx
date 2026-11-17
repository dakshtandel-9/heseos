'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import ContactForm from '../site/ContactForm';
import { bagCount, clearBag, openBag, setQty, useBag } from './bag';

// A button anywhere on /shop that opens the bag drawer and shows how many items are in it.
export function OpenBagButton({className,children='View your bag'}:{className?:string;children?:ReactNode}){
 const count=bagCount(useBag());
 return <button type="button" className={className} onClick={openBag}><ShoppingBag size={17} aria-hidden="true"/>{children}{count>0&&<b>{count}</b>}</button>;
}
// The floating bag on /shop and its drawer: adjust quantities, then send the whole bag as one quote request (form or WhatsApp).
export default function ShopBag({whatsapp}:{whatsapp:string}){
 const lines=useBag(),count=bagCount(lines),[open,setOpen]=useState(false),[bump,setBump]=useState(0);
 useEffect(()=>{
  const show=()=>setOpen(true);
  if(location.hash==='#bag')show();
  window.addEventListener('heseos-bag-open',show);
  return()=>window.removeEventListener('heseos-bag-open',show);
 },[]);
 const [shown,setShown]=useState(count);
 if(shown!==count){setShown(count);if(count>shown)setBump(b=>b+1);}
 useEffect(()=>{if(!open)return;const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};document.body.style.overflow='hidden';addEventListener('keydown',esc);return()=>{document.body.style.overflow='';removeEventListener('keydown',esc);};},[open]);
 const message=['I\'d like a quote for these HESEOS products:',...lines.map(l=>`• ${l.name} × ${l.qty}`),'Project location: '].join('\n');
 const chat=`https://wa.me/${whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;
 return <>
  <button type="button" key={bump} className={'sh-fab'+(count?' has-items':'')+(bump?' bump':'')} onClick={()=>setOpen(true)} aria-label={`Open quote bag, ${count} ${count===1?'item':'items'}`}>
   <ShoppingBag size={19} aria-hidden="true"/><span>Bag</span>{count>0&&<b>{count}</b>}
  </button>
  <div className={'sh-scrim'+(open?' open':'')} onClick={()=>setOpen(false)} aria-hidden="true"/>
  <aside className={'sh-drawer'+(open?' open':'')} aria-label="Quote bag" inert={!open}>
   <header><h2>Your bag <span>{count}</span></h2><button type="button" className="sh-x" onClick={()=>setOpen(false)} aria-label="Close bag"><X size={20}/></button></header>
   {lines.length===0?<div className="sh-empty"><ShoppingBag size={34} aria-hidden="true"/><p>Your bag is empty.</p><span>Add products from the aisles, then request one quote for everything.</span></div>:<>
    <ul className="sh-lines">{lines.map(l=><li key={l.slug}>
     <img src={l.image} alt="" width={72} height={72}/>
     <div><SiteLink href={l.href} onClick={()=>setOpen(false)}>{l.name}</SiteLink>
      <div className="sh-qty"><button type="button" onClick={()=>setQty(l.slug,l.qty-1)} aria-label={`One fewer ${l.name}`}>{l.qty===1?<Trash2 size={14}/>:<Minus size={14}/>}</button><output aria-live="polite">{l.qty}</output><button type="button" onClick={()=>setQty(l.slug,l.qty+1)} aria-label={`One more ${l.name}`}><Plus size={14}/></button></div>
     </div>
    </li>)}</ul>
    <div className="sh-checkout">
     <p className="sh-note">Prices depend on finish, size and installation, so our team prices every bag personally.</p>
     <a className="sh-wa" href={chat} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true"/>Send bag on WhatsApp</a>
     <details className="sh-form"><summary>Or request a quote by email</summary><div className="sh-form-content"><ContactForm type="quote" context={message} button="Request quote for bag"/></div></details>
     <button type="button" className="sh-clear" onClick={clearBag}>Empty bag</button>
    </div>
   </>}
  </aside>
 </>;
}
