'use client';
import { useEffect } from 'react';
// Drives Apple-style scroll scenes: every [data-scroll] element gets --p, its progress from 0 to 1.
// "pin" scenes run while their sticky stage is held on screen; "view" scenes run as they cross the viewport.
// Progress eases toward the scroll position rather than jumping to it, so motion glides instead of tracking every wheel tick.
// A scene with data-steps also gets data-step, the step its progress has reached. With reduced motion nothing runs and CSS shows each scene's end state.
const EASE=.14;
export default function ScrollScenes(){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const scenes=[...document.querySelectorAll<HTMLElement>('[data-scroll]')].map(el=>({el,now:-1,target:0}));
  let frame=0;
  const measure=()=>{
   const vh=innerHeight;
   for(const s of scenes){
    const r=s.el.getBoundingClientRect();
    const p=s.el.dataset.scroll==='pin'?-r.top/Math.max(1,r.height-vh):(vh-r.top)/(vh+r.height);
    s.target=Math.min(1,Math.max(0,p));if(s.now<0)s.now=s.target;
   }
  };
  const tick=()=>{
   frame=0;let moving=false;
   for(const s of scenes){
    const gap=s.target-s.now;
    s.now=Math.abs(gap)<.0005?s.target:s.now+gap*EASE;if(s.now!==s.target)moving=true;
    s.el.style.setProperty('--p',s.now.toFixed(4));
    const steps=Number(s.el.dataset.steps);if(steps)s.el.dataset.step=String(Math.min(steps-1,Math.floor(s.target*steps)));
   }
   if(moving)frame=requestAnimationFrame(tick);
  };
  const queue=()=>{measure();if(!frame)frame=requestAnimationFrame(tick);};
  queue();addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);
  return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',queue);removeEventListener('resize',queue);};
 },[]);
 return null;
}
