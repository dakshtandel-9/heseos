'use client';
import { Pause, Play } from 'lucide-react';
// Every moving piece of media gets a visible pause control.
export default function PlayToggle({playing,onToggle,label,className=''}:{playing:boolean;onToggle:()=>void;label:string;className?:string}){
 return <button className={'play-toggle '+className} onClick={onToggle} aria-label={`${playing?'Pause':'Play'} ${label}`}>{playing?<Pause size={14} fill="currentColor"/>:<Play size={14} fill="currentColor"/>}</button>;
}
