'use client';
import { useRef } from 'react';
import { Play, X } from 'lucide-react';
// "Watch Video" plays the Heseos Simulation film in a modal; closing it stops playback.
export default function WatchVideo({src,poster}:{src:string;poster:string}){
 const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null);
 return <>
  <button type="button" className="btn secondary home-play" onClick={()=>{dialog.current?.showModal();void video.current?.play();}}><Play size={14} fill="currentColor"/>Watch Video</button>
  <dialog ref={dialog} className="video-dialog" aria-label="Heseos film" onClose={()=>video.current?.pause()} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}>
   <button type="button" className="video-close" aria-label="Close video" onClick={()=>dialog.current?.close()}><X size={20}/></button>
   <video ref={video} src={src} poster={poster} controls playsInline preload="none"/>
  </dialog>
 </>;
}
