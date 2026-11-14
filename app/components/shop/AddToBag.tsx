'use client';
import { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { addToBag, useBag, type BagLine } from './bag';
// Adds one of a product to the quote bag; shows how many are already in it.
export default function AddToBag({item}:{item:Omit<BagLine,'qty'>}){
 const qty=useBag().find(l=>l.slug===item.slug)?.qty??0,[flash,setFlash]=useState(false);
 useEffect(()=>{if(!flash)return;const t=setTimeout(()=>setFlash(false),1100);return()=>clearTimeout(t);},[flash]);
 return <button type="button" className={'sh-add'+(flash?' is-flash':'')} onClick={()=>{addToBag(item);setFlash(true);}} aria-label={`Add ${item.name} to quote bag`+(qty?`, ${qty} in bag`:'')}>
  {flash?<Check size={16} aria-hidden="true"/>:<Plus size={16} aria-hidden="true"/>}
  <span>{flash?'Added':'Add to bag'}</span>
  {qty>0&&<b aria-hidden="true">{qty}</b>}
 </button>;
}
