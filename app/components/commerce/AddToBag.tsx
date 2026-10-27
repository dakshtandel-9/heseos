'use client';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import { useBag } from './BagProvider';
export default function AddToBag({id,label='Add to bag',className=''}:{id:string;label?:string;className?:string}){
 const {add}=useBag(),[added,setAdded]=useState(false);
 useEffect(()=>{if(!added)return;const t=setTimeout(()=>setAdded(false),4000);return()=>clearTimeout(t);},[added]);
 return <span className="add-to-bag"><button className={'btn '+className} onClick={()=>{add(id);setAdded(true);}}>{added?<><Check size={16}/>Added</>:label}</button>
  <span role="status" className="added-note">{added&&<>Added to your bag. <SiteLink className="link" href="/bag">Review bag ›</SiteLink></>}</span></span>;
}
