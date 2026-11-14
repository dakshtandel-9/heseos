'use client';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import { bagCount, openBag, useBag } from './bag';
// The header's bag icon: opens the drawer on /shop, otherwise goes to /shop with the bag open.
export default function HeaderBag(){
 const count=bagCount(useBag()),pathname=usePathname();
 return <SiteLink href="/shop#bag" className="hdr-icon hdr-bag" aria-label={`Quote bag, ${count} ${count===1?'item':'items'}`} onClick={e=>{if(pathname==='/shop'){e.preventDefault();openBag();}}}>
  <ShoppingBag size={18} strokeWidth={1.8}/>{count>0&&<b aria-hidden="true">{count>99?'99+':count}</b>}
 </SiteLink>;
}
