'use client';
import { useEffect, useRef, useState } from 'react';
// Counts a figure like "9000+" or "1,00,000+" up from zero the first time it scrolls into view; renders the final value without JavaScript.
export default function CountUp({value}:{value:string}){
 const ref=useRef<HTMLSpanElement>(null),[shown,setShown]=useState(value);
 useEffect(()=>{
  const el=ref.current,target=Number(value.replace(/\D/g,''));
  if(!el||!target||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const format=(n:number)=>value.replace(/[\d,]+/,new Intl.NumberFormat(value.includes(',')?'en-IN':'en-US',{useGrouping:value.includes(',')}).format(n));
  let frame=0;
  const io=new IntersectionObserver(([e])=>{
   if(!e.isIntersecting)return;io.disconnect();setShown(format(0));
   const start=performance.now(),tick=(t:number)=>{const k=Math.min((t-start)/1400,1);setShown(format(Math.round(target*(1-Math.pow(1-k,3)))));if(k<1)frame=requestAnimationFrame(tick);};
   frame=requestAnimationFrame(tick);
  },{threshold:.3});
  io.observe(el);return()=>{io.disconnect();cancelAnimationFrame(frame);};
 },[value]);
 return <span ref={ref} aria-label={value}>{shown}</span>;
}
