'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lightbulb, Mic, MicOff, Minus, Plus, Power, Send, Smartphone, Snowflake, Tv, Volume2, VolumeX, X } from 'lucide-react';
import { INITIAL_POWER, powerUsage, type PowerState } from '../../../lib/energy';
import { DEVICES, SCENES, device, lightLevel, parseSimulationCommand, type DeviceId, type SceneId } from '../../../lib/devices';
import { APARTMENTS, apartment as findApartment } from '../../../lib/apartments';
import { formatINR, product } from '../../../lib/catalog';
import { createVoiceSession, type SpeechWindow, type VoiceSession, type VoiceState } from '../../../lib/voice';
import { useSpeechFeedback, WELCOME } from '../useSpeechFeedback';
import { useReducedMotion } from '../media/usePlatform';
import SiteLink from '../site/SiteLink';
import type { ViewerStatus } from './ApartmentViewer';
// three.js only ever runs in the browser, so it stays out of the server bundle.
const ApartmentViewer=dynamic(()=>import('./ApartmentViewer'),{ssr:false});
const ICONS={'touch-panel':Lightbulb,'ir-blaster':Snowflake,'smart-plug':Tv};
const HELP='Try “lights off”, “dim to 30 percent”, “AC off”, “show the plug” or “away mode”.';

export default function Simulation(){
 const params=useSearchParams(),router=useRouter(),pathname=usePathname();
 const apartmentId=params.get('apartment')==='1'?'1':'2',debug=params.has('debug');
 const home=findApartment(apartmentId);
 const [power,setPower]=useState<PowerState>(INITIAL_POWER),[scene,setScene]=useState<SceneId|'custom'>('home');
 const [selected,setSelected]=useState<DeviceId|null>(null),[focus,setFocus]=useState<{id:DeviceId;seq:number}|null>(null);
 const [status,setStatus]=useState<ViewerStatus>({state:'loading',loaded:0,total:0}),reduced=useReducedMotion();
 const [temperature,setTemperature]=useState(24),[appView,setAppView]=useState(false),[input,setInput]=useState('');
 const [voiceState,setVoiceState]=useState<VoiceState>('ready'),[micOn,setMicOn]=useState(false),[notice,setNotice]=useState('');
 const recognition=useRef<VoiceSession|null>(null);
 const {spoken,reply,welcomePending,announce,cancel,toggleSpoken,setReply,skipWelcome}=useSpeechFeedback(recognition,HELP);
 const usage=powerUsage(power);

 // A new apartment starts loading from scratch.
 const [shownApartment,setShownApartment]=useState(apartmentId);
 if(shownApartment!==apartmentId){setShownApartment(apartmentId);setStatus({state:'loading',loaded:0,total:0});setFocus(null);}

 const select=useCallback((id:DeviceId)=>{setSelected(id);setFocus(f=>({id,seq:(f?.seq??0)+1}));},[]);
 const applyScene=useCallback((id:SceneId)=>{setScene(id);setPower(SCENES.find(s=>s.id===id)!.power);},[]);
 // Product pages link here with ?device= to open the simulation on that component, once per loaded apartment.
 const linked=DEVICES.find(d=>d.id===params.get('device'))?.id,linkKey=linked&&status.state==='ready'?`${apartmentId}:${linked}`:null;
 const [openedLink,setOpenedLink]=useState<string|null>(null);
 if(linked&&linkKey&&openedLink!==linkKey){setOpenedLink(linkKey);select(linked);}
 const change=useCallback((next:Partial<PowerState>)=>{setScene('custom');setPower(p=>({...p,...next}));},[]);
 const chooseApartment=(id:string)=>router.replace(`${pathname}?apartment=${id}${debug?'&debug':''}`,{scroll:false});

 const execute=useCallback((text:string)=>{
  const command=parseSimulationCommand(text);
  if(command.type==='focus'){select(command.device);announce(`Here is the ${device(command.device).name}.`);}
  else if(command.type==='lights'){change({lights:command.on,...(command.on?{brightness:100}:{})});announce(command.on?'Your lights are on.':'Your lights are off.');}
  else if(command.type==='brightness'){change({lights:command.value>0,brightness:command.value});announce(`Lights set to ${command.value} percent.`);}
  else if(command.type==='climate'){change({climate:command.on});announce(command.on?'The AC is on.':'The AC is off.');}
  else if(command.type==='standby'){change({standby:command.on});announce(command.on?'The TV plug is on.':'The TV plug is off. No more standby.');}
  else if(command.type==='scene'){const id=command.scene==='movie'?'evening':command.scene;applyScene(id);announce(id==='away'?'Away mode. Lights, AC and TV are off.':id==='evening'?'Evening. Lights at 30 percent, TV off.':'Welcome home.');}
  else announce(HELP);
  setInput('');
 },[announce,applyScene,change,select]);
 const latestExecute=useRef(execute);
 useEffect(()=>{latestExecute.current=execute;},[execute]);

 // Voice stays off until the visitor turns it on; typed commands always work.
 useEffect(()=>{
  const Constructor=(window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition;
  const controller=createVoiceSession(()=>{if(!Constructor)throw Error('Unsupported');return new Constructor();},{
   onEnabled:setMicOn,
   onState:(state,message)=>{setVoiceState(state);if(message)setNotice(message);else if(state==='listening')setNotice('');},
   onTranscript:text=>{if(parseSimulationCommand(text).type!=='unknown')latestExecute.current(text);},
  });
  recognition.current=controller;
  const visibility=()=>{if(document.hidden){controller.pause('hidden');cancel(true);}else controller.resume('hidden');};
  document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('visibilitychange',visibility);controller.dispose();if(recognition.current===controller)recognition.current=null;cancel(false);};
 },[cancel]);
 const toggleMic=()=>{
  const controller=recognition.current;if(!controller)return;
  if(controller.isEnabled()){controller.stop();skipWelcome();cancel(true);setNotice('');setReply('Microphone is off. '+HELP);}
  else{setNotice('');if(welcomePending.current){controller.pause('speech');controller.start();announce(WELCOME,true);}else controller.start();}
 };

 const pct=status.total?Math.round(status.loaded/status.total*100):0;
 const sheet=selected&&device(selected),info=selected&&product(selected);
 const nextDevice=selected&&DEVICES[(DEVICES.findIndex(d=>d.id===selected)+1)%DEVICES.length].id;
 return <div className="sim">
  <div className="sim-bar">
   <h1 className="sim-title">The Heseos Simulation</h1>
   <div className="segmented" role="radiogroup" aria-label="Apartment">{[...APARTMENTS].sort((a,b)=>a.id.localeCompare(b.id)).map(a=><button key={a.id} role="radio" aria-checked={a.id===apartmentId} onClick={()=>chooseApartment(a.id)}>{a.name}<span> · {a.rooms} rooms</span></button>)}</div>
   <button className={'sim-chip'+(appView?' active':'')} aria-pressed={appView} onClick={()=>setAppView(v=>!v)}><Smartphone size={15}/>App view</button>
  </div>
  <div className="sim-stage">
   {status.state!=='error'&&<ApartmentViewer key={home.id} apartment={home} power={power} focus={focus} selected={selected} reducedMotion={reduced} debug={debug} onSelect={select} onStatus={setStatus}/>}
   {status.state==='loading'&&<div className="sim-loading" role="status"><span className="tabular">{pct}%</span><small>Opening {home.name}{status.total?` · ${(status.loaded/1e6).toFixed(1)} of ${(status.total/1e6).toFixed(1)} MB`:''}</small></div>}
   {status.state==='error'&&<div className="sim-loading" role="status"><span>3D isn’t available here.</span><small>Every control below still works. Try another browser for the walkthrough.</small></div>}
   <div className="sim-meter" aria-live="polite"><span>Connected load</span><strong className="tabular">{usage.total.toLocaleString('en-IN')}<small> W</small></strong><em>Illustrative loads</em><i style={{transform:`scaleX(${usage.total/1400})`}}/></div>
   {appView&&<div className="sim-app" aria-label="App preview"><header><span>Living room</span><button aria-label="Close app view" onClick={()=>setAppView(false)}><X size={14}/></button></header><div className="sim-app-power"><b className="tabular">{usage.total.toLocaleString('en-IN')} W</b><span>Power</span></div>{DEVICES.map(d=>{const on=power[d.load],Icon=ICONS[d.id];return <button key={d.id} className={on?'on':''} onClick={()=>change(d.load==='lights'?{lights:!on,brightness:power.brightness||100}:{[d.load]:!on})}><Icon size={18}/><span>{d.controls}<small>{d.name}</small></span><i>{on?'On':'Off'}</i></button>;})}<p>Illustrative app preview</p></div>}
   {sheet&&info&&<aside className="sim-sheet" aria-label={sheet.name}>
    <button className="sim-sheet-close" aria-label="Close" onClick={()=>setSelected(null)}><X size={16}/></button>
    <img src={info.image} alt="" className={'sim-sheet-image '+sheet.id}/>
    <span className="eyebrow">{info.eyebrow}</span><h2 className="title">{info.name}</h2><p className="muted">{info.tagline}</p>
    {sheet.id==='touch-panel'&&<div className="glass-panel" role="group" aria-label="Touch panel buttons">
     {[{label:'Lights',on:power.lights,act:()=>change({lights:!power.lights,brightness:power.brightness||100})},{label:'Dim 30%',on:power.lights&&power.brightness===30,act:()=>change({lights:true,brightness:30})},{label:'Bright',on:power.lights&&power.brightness===100,act:()=>change({lights:true,brightness:100})},{label:'Evening',on:scene==='evening',act:()=>applyScene('evening')}].map(b=><button key={b.label} aria-pressed={b.on} className={b.on?'on':''} onClick={b.act}><i aria-hidden="true"/>{b.label}</button>)}
    </div>}
    {sheet.id==='touch-panel'&&<label className="sim-slider">Brightness<input type="range" min="0" max="100" step="5" value={power.lights?power.brightness:0} onChange={e=>{const value=Number(e.target.value);change({lights:value>0,brightness:value});}}/><span className="tabular">{Math.round(lightLevel(power)*100)}%</span></label>}
    {sheet.id==='ir-blaster'&&<><button className="sim-switch" role="switch" aria-checked={power.climate} onClick={()=>change({climate:!power.climate})}><Snowflake size={18}/><span>Air conditioner<small>{power.climate?`Cooling to ${temperature}°`:'Off'}</small></span><i/></button>
     <div className="sim-stepper" role="group" aria-label="AC temperature"><button aria-label="Cooler" disabled={!power.climate||temperature<=16} onClick={()=>setTemperature(t=>t-1)}><Minus size={16}/></button><span className="tabular">{temperature}°</span><button aria-label="Warmer" disabled={!power.climate||temperature>=30} onClick={()=>setTemperature(t=>t+1)}><Plus size={16}/></button></div>
     <p className="sim-note">The IR Blaster sends the same infrared commands as your AC remote.</p></>}
    {sheet.id==='smart-plug'&&<><button className="sim-switch" role="switch" aria-checked={power.standby} onClick={()=>change({standby:!power.standby})}><Power size={18}/><span>TV & set-top box<small>{power.standby?'Powered':'Switched off at the plug'}</small></span><i/></button>
     <div className="sim-reading"><strong className="tabular">{usage.standby} W</strong><span>through this plug (illustrative)</span></div></>}
    <div className="sim-sheet-actions"><SiteLink className="link" href={`/products/${info.slug}`}>Learn more <ArrowRight size={14}/></SiteLink><SiteLink className="btn small" href={`/store/buy/${info.slug}`}>{info.price?`Buy · ${formatINR(info.price)}`:'Choose a package'}</SiteLink></div>
    {nextDevice&&<button className="sim-next" onClick={()=>select(nextDevice)}>Next: {device(nextDevice).name}<ArrowRight size={14}/></button>}
   </aside>}
  </div>
  <div className="sim-dock">
   <div className="sim-devices" role="group" aria-label="Components">{DEVICES.map(d=>{const Icon=ICONS[d.id],on=power[d.load];return <button key={d.id} className={'sim-device'+(selected===d.id?' selected':'')} aria-pressed={selected===d.id} onClick={()=>select(d.id)}><Icon size={18}/><span>{d.name}<small>{d.controls} · {on?'On':'Off'}</small></span></button>;})}</div>
   <div className="segmented small" role="radiogroup" aria-label="Scenes">{SCENES.map(s=><button key={s.id} role="radio" aria-checked={scene===s.id} onClick={()=>applyScene(s.id)}>{s.name}</button>)}</div>
   <form className="sim-command" onSubmit={e=>{e.preventDefault();if(input.trim())execute(input);}}>
    <label className="sr-only" htmlFor="sim-command">Type a command</label>
    <input id="sim-command" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a command, like “AC off”" autoComplete="off"/>
    <button type="submit" aria-label="Send command" disabled={!input.trim()}><Send size={16}/></button>
    <button type="button" className={micOn?'on':''} aria-label={micOn?'Turn voice off':'Turn voice on'} aria-pressed={micOn} aria-busy={voiceState==='starting'||voiceState==='processing'} onClick={toggleMic}>{micOn?<Mic size={16}/>:<MicOff size={16}/>}</button>
    <button type="button" aria-label={spoken?'Mute spoken replies':'Unmute spoken replies'} aria-pressed={spoken} disabled={!micOn} onClick={toggleSpoken}>{spoken?<Volume2 size={16}/>:<VolumeX size={16}/>}</button>
   </form>
   <p className="sim-reply" role="status">{notice||reply}</p>
  </div>
 </div>;
}
