'use client';
import { useEffect } from 'react';
// Fades [data-reveal] blocks up as they scroll into view. Content stays visible until this runs, and with reduced motion.
export default function Reveal(){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el);}});
  return()=>io.disconnect();
 },[]);
 return null;
}
