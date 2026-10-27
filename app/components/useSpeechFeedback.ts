'use client';
import {useCallback,useEffect,useRef,useState,type RefObject} from 'react';
import type {VoiceSession} from '../../lib/voice';
export const WELCOME='Welcome to Heseos.';

export function useSpeechFeedback(controller:RefObject<VoiceSession|null>,initialReply='Voice is off. Use the microphone in the header to turn it on, or type a command.'){
 const [spoken,setSpoken]=useState(true),[reply,setReply]=useState(initialReply),[needsGesture,setNeedsGesture]=useState(false);
 const enabled=useRef(true),utterance=useRef<SpeechSynthesisUtterance|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),welcomePending=useRef(true);
 const cancel=useCallback((resume=true)=>{
  if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}
  const old=utterance.current;utterance.current=null;if(old){old.onstart=null;old.onend=null;old.onerror=null;}
  if(typeof window!=='undefined')window.speechSynthesis?.cancel();
  if(resume)controller.current?.resume('speech');
 },[controller]);
 const announce=useCallback((message:string,welcome=false)=>{
  setReply(message);cancel(false);
  if(!controller.current?.isEnabled()||!enabled.current||!window.speechSynthesis){if(welcome)welcomePending.current=false;controller.current?.resume('speech');return;}
  controller.current?.pause('speech');
  const speech=new SpeechSynthesisUtterance(message);speech.lang='en-IN';speech.rate=.95;utterance.current=speech;
  const finish=(blocked=false)=>{if(utterance.current!==speech)return;if(blocked)setNeedsGesture(true);cancel(true);};
  speech.onstart=()=>{if(utterance.current!==speech)return;if(welcome)welcomePending.current=false;setNeedsGesture(false);if(timer.current!==null)clearTimeout(timer.current);timer.current=setTimeout(()=>finish(),20000);};
  speech.onend=()=>finish();speech.onerror=event=>finish(event.error==='not-allowed');
  // Some engines silently queue speech until the first user gesture.
  timer.current=setTimeout(()=>finish(true),2500);
  try{window.speechSynthesis.speak(speech);}catch{finish(true);}
 },[cancel,controller]);
 const toggleSpoken=useCallback(()=>{enabled.current=!enabled.current;setSpoken(enabled.current);if(!enabled.current){welcomePending.current=false;setNeedsGesture(false);cancel(true);}else announce(welcomePending.current?WELCOME:'Voice replies are on.',welcomePending.current);},[announce,cancel]);
 useEffect(()=>()=>cancel(false),[cancel]);
 const skipWelcome=useCallback(()=>{welcomePending.current=false;},[]);
 return {spoken,reply,needsGesture,welcomePending,announce,cancel,toggleSpoken,setReply,skipWelcome};
}
