'use client';
import {useCallback,useEffect,useState} from 'react';

// Progress follows model loading and decoded page assets; 100% also requires a rendered home.
export function useSiteLoading(homeReady:boolean){
 const [modelProgress,setModelProgress]=useState(0),[assetProgress,setAssetProgress]=useState(0);
 const [error,setError]=useState(''),[revealed,setRevealed]=useState(false),[percent,setPercent]=useState(1);
 const onModelProgress=useCallback((value:number)=>setModelProgress(previous=>Math.max(previous,Math.min(1,value))),[]);
 const onLoadError=useCallback(()=>setError('Something didn’t finish loading. Please try again.'),[]);
 useEffect(()=>{
  let active=true,completed=0;
  const images=Array.from(document.images);
  // Include off-screen and dialog images instead of waiting for lazy loading on scroll.
  images.forEach(image=>{image.loading='eager';});
  const total=images.length+2;
  const done=()=>{if(active)setAssetProgress(++completed/total);};
  const tasks=images.map(async image=>{await image.decode();done();});
  const fallback=new Image();fallback.src='/assets/home.jpg';
  tasks.push(fallback.decode().then(done));
  tasks.push(document.fonts.ready.then(()=>{done();}));
  Promise.all(tasks).catch(()=>{if(active)onLoadError();});
  return()=>{active=false;};
 },[onLoadError]);
 const complete=homeReady&&assetProgress===1&&!error;
 const target=complete?100:Math.min(99,Math.floor(1+modelProgress*74+assetProgress*24));
 useEffect(()=>{
  let frame=0;
  const advance=()=>{setPercent(previous=>Math.min(target,previous+Math.max(1,Math.ceil((target-previous)*.12))));frame=requestAnimationFrame(advance);};
  if(percent<target)frame=requestAnimationFrame(advance);
  return()=>cancelAnimationFrame(frame);
 },[target,percent]);
 useEffect(()=>{
  if(!complete||percent!==100)return;
  // Hold the actual 100% state briefly, then reveal the already-rendered page.
  const timer=setTimeout(()=>setRevealed(true),450);
  return()=>clearTimeout(timer);
 },[complete,percent]);
 useEffect(()=>{
  if(revealed)return;
  const bodyOverflow=document.body.style.overflow,htmlOverflow=document.documentElement.style.overflow;
  document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';
  const timer=setTimeout(()=>setError('Loading is taking longer than expected. Check your connection and try again.'),90000);
  return()=>{clearTimeout(timer);document.body.style.overflow=bodyOverflow;document.documentElement.style.overflow=htmlOverflow;};
 },[revealed]);
 return {percent,error,revealed,onModelProgress,onLoadError};
}
