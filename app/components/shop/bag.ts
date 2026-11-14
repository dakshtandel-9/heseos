'use client';
import { useSyncExternalStore } from 'react';
// The quote bag, kept in this browser only. Every change fires 'heseos-bag' so the header count and the shop drawer stay in step.
export type BagLine={slug:string;name:string;image:string;href:string;qty:number};
const KEY='heseos-bag',EVENT='heseos-bag';
const EMPTY:BagLine[]=[];
let cache:{raw:string|null;lines:BagLine[]}={raw:null,lines:EMPTY};

function read():BagLine[]{
 let raw:string|null=null;
 try{raw=localStorage.getItem(KEY);}catch{return EMPTY;}
 if(raw===cache.raw)return cache.lines;
 let lines=EMPTY;
 try{const v=JSON.parse(raw??'[]');if(Array.isArray(v))lines=v.filter(l=>l&&typeof l.slug==='string'&&l.qty>0);}catch{}
 cache={raw,lines};return lines;
}
function write(lines:BagLine[]){
 try{localStorage.setItem(KEY,JSON.stringify(lines));}catch{}
 window.dispatchEvent(new Event(EVENT));
}
function subscribe(fn:()=>void){
 window.addEventListener(EVENT,fn);window.addEventListener('storage',fn);
 return()=>{window.removeEventListener(EVENT,fn);window.removeEventListener('storage',fn);};
}
export const useBag=()=>useSyncExternalStore(subscribe,read,()=>EMPTY);
export const bagCount=(lines:BagLine[])=>lines.reduce((n,l)=>n+l.qty,0);

export function addToBag(item:Omit<BagLine,'qty'>,qty=1){
 const lines=read(),hit=lines.find(l=>l.slug===item.slug);
 write(hit?lines.map(l=>l===hit?{...l,qty:Math.min(99,l.qty+qty)}:l):[...lines,{...item,qty}]);
}
export function setQty(slug:string,qty:number){
 write(qty<=0?read().filter(l=>l.slug!==slug):read().map(l=>l.slug===slug?{...l,qty:Math.min(99,qty)}:l));
}
export const clearBag=()=>write([]);
export const openBag=()=>window.dispatchEvent(new Event('heseos-bag-open'));
