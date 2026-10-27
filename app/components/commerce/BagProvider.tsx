'use client';
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { resolveBagLine, type BagLine } from '../../../lib/catalog';
const KEY='heseos-bag',EMPTY:BagLine[]=[];
type Bag={lines:BagLine[];ready:boolean;count:number;add:(id:string,qty?:number)=>void;setQty:(id:string,qty:number)=>void;remove:(id:string)=>void;clear:()=>void};
const BagContext=createContext<Bag|null>(null);
// The bag lives in this browser's storage until checkout is connected; unreadable storage just starts an empty bag.
let cache:BagLine[]|null=null;
const listeners=new Set<()=>void>();
function read():BagLine[]{
 if(cache===null){
  try{const saved=JSON.parse(localStorage.getItem(KEY)??'[]');cache=Array.isArray(saved)?saved.filter((l:BagLine)=>typeof l?.id==='string'&&Number.isInteger(l.qty)&&l.qty>0&&resolveBagLine(l)):[];}catch{cache=[];}
 }
 return cache;
}
function write(update:(lines:BagLine[])=>BagLine[]){
 cache=update(read());
 try{localStorage.setItem(KEY,JSON.stringify(cache));}catch{/* Kept for this page only. */}
 listeners.forEach(l=>l());
}
function subscribe(onChange:()=>void){
 const storage=(e:StorageEvent)=>{if(e.key===KEY){cache=null;onChange();}};
 listeners.add(onChange);addEventListener('storage',storage);
 return()=>{listeners.delete(onChange);removeEventListener('storage',storage);};
}
const never=()=>()=>{};
export function BagProvider({children}:{children:ReactNode}){
 const lines=useSyncExternalStore(subscribe,read,()=>EMPTY),ready=useSyncExternalStore(never,()=>true,()=>false);
 const setQty=useCallback((id:string,qty:number)=>write(ls=>qty<=0?ls.filter(l=>l.id!==id):ls.map(l=>l.id===id?{...l,qty:Math.min(10,qty)}:l)),[]);
 const add=useCallback((id:string,qty=1)=>write(ls=>ls.some(l=>l.id===id)?ls.map(l=>l.id===id?{...l,qty:Math.min(10,l.qty+qty)}:l):[...ls,{id,qty}]),[]);
 const remove=useCallback((id:string)=>write(ls=>ls.filter(l=>l.id!==id)),[]);
 const clear=useCallback(()=>write(()=>[]),[]);
 const value=useMemo(()=>({lines,ready,count:lines.reduce((s,l)=>s+l.qty,0),add,setQty,remove,clear}),[lines,ready,add,setQty,remove,clear]);
 return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}
export function useBag(){const bag=useContext(BagContext);if(!bag)throw Error('useBag needs BagProvider');return bag;}
