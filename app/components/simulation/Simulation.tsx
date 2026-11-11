'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lightbulb, Mic, MicOff, Power, Send, Smartphone, Snowflake, Tv, Volume2, VolumeX, X } from 'lucide-react';
import { DEVICES, parseSimulationCommand, type DeviceId } from '../../../lib/devices';
import { apartment as findApartment } from '../../../lib/apartments';
import { FAMILIES, familyHref } from '../../../lib/products';
import { FITTINGS, INSTALLED_PRODUCTS, LEGACY_PRODUCTS, ROOM_NAMES, ROOM_PLAN, ROOM_TOUR, UNFITTED_PRODUCTS, apartmentReducer, apartmentUsage, fittedProduct, initialApartmentState, installed, lightingCommandTarget, normalizeRoomCommand, isLight, isRoomControl, productState, productStatus, roomPlan, roomProducts, tourIndexForProduct, type RoomId } from '../../../lib/simulation-products';
import { createVoiceSession, type SpeechWindow, type VoiceSession, type VoiceState } from '../../../lib/voice';
import { useSpeechFeedback, WELCOME } from '../useSpeechFeedback';
import { useReducedMotion } from '../media/usePlatform';
import SiteLink from '../site/SiteLink';
import type { ViewerStatus } from './ApartmentViewer';
// three.js only ever runs in the browser, so it stays out of the server bundle.
const ApartmentViewer=dynamic(()=>import('./ApartmentViewer'),{ssr:false});
const HELP='Try “lights off”, “dim to 30 percent”, “AC off”, “show the plug” or “away mode”.';
const TOUR=ROOM_TOUR;
const CAMERA_VIEWS=TOUR.map(step=>({stop:step.stop,focus:step.focus??(step.fitting?FITTINGS.find(f=>f.id===step.fitting)!.options[0].id:undefined)}));
const CATALOG_SLUG:Record<DeviceId,string>={'touch-panel':'touch-panel-series','ir-blaster':'ir-blaster','smart-plug':'smart-plug-16a'};

export default function Simulation(){
 const params=useSearchParams(),debug=params.has('debug');
 const home=findApartment('2');
 const requestedDevice=params.get('device'),linkedProduct=requestedDevice?installed(LEGACY_PRODUCTS[requestedDevice]??requestedDevice):undefined;
 const [stepIndex,setStepIndex]=useState(()=>linkedProduct?tourIndexForProduct(linkedProduct.id):0);
 const step=TOUR[stepIndex],storyRef=useRef<HTMLDivElement>(null),scrollProgress=useRef(stepIndex),progressBar=useRef<HTMLElement>(null);
 const [simulation,dispatch]=useReducer(apartmentReducer,linkedProduct?.id,id=>id?apartmentReducer(initialApartmentState(),{type:'select',id}):initialApartmentState());
 const [selected,setSelected]=useState<string|null>(linkedProduct?.id??null),[focus,setFocus]=useState<{id:string;seq:number}|null>(()=>linkedProduct?{id:linkedProduct.id,seq:1}:null);
 const [status,setStatus]=useState<ViewerStatus>({state:'loading',loaded:0,total:0}),reduced=useReducedMotion();
 const [appView,setAppView]=useState(false),[input,setInput]=useState('');
 const [voiceState,setVoiceState]=useState<VoiceState>('ready'),[micOn,setMicOn]=useState(false),[notice,setNotice]=useState(()=>UNFITTED_PRODUCTS.find(p=>p.id===requestedDevice)?.reason??'');
 const recognition=useRef<VoiceSession|null>(null);
 const {spoken,reply,welcomePending,announce,cancel,toggleSpoken,setReply,skipWelcome}=useSpeechFeedback(recognition,HELP);
 const usage=apartmentUsage(simulation);

 const select=useCallback((requested:string)=>{const id=LEGACY_PRODUCTS[requested]??requested;if(!installed(id))return;setSelected(id);dispatch({type:'select',id});setFocus(f=>({id,seq:(f?.seq??0)+1}));},[]);
 const applyScene=useCallback((scene:'home'|'evening'|'away')=>dispatch({type:'scene',scene}),[]);
 const change=useCallback((action:Parameters<typeof dispatch>[0])=>dispatch(action),[]);
 const goStep=useCallback((next:number)=>{
  const index=Math.max(0,Math.min(TOUR.length-1,next)),story=storyRef.current;
  setStepIndex(index);setSelected(null);
  if(story)window.scrollTo({top:window.scrollY+story.getBoundingClientRect().top+index*story.clientHeight/TOUR.length,behavior:reduced?'instant':'smooth'});
 },[reduced]);
 useEffect(()=>{
  const story=storyRef.current;if(!story)return;
  let frame=0,currentIndex=stepIndex;
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const progress=Math.max(0,Math.min(TOUR.length-1,-story.getBoundingClientRect().top/(story.clientHeight/TOUR.length)));
   if(Math.abs(progress-scrollProgress.current)>.005)setSelected(null);
   scrollProgress.current=progress;
   if(progressBar.current)progressBar.current.style.transform=`scaleX(${(progress+1)/TOUR.length})`;
   const index=Math.round(progress);
   if(index!==currentIndex){currentIndex=index;setStepIndex(index);}
  });};
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  if(linkedProduct){const index=tourIndexForProduct(linkedProduct.id);scrollProgress.current=index;window.scrollTo(0,window.scrollY+story.getBoundingClientRect().top+index*story.clientHeight/TOUR.length);}update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
 // The URL is only used for the initial deep link. Scrolling owns the section after mount.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 const execute=useCallback((text:string)=>{
  const command=parseSimulationCommand(normalizeRoomCommand(text)),targetRoom=lightingCommandTarget(text,step.stop),allRooms=targetRoom==='all';
  if(command.type==='focus'){const id=command.device==='touch-panel'?simulation.variants[roomPlan(step.stop).controller]:CATALOG_SLUG[command.device];select(id);announce(`Taking you to the ${FAMILIES.find(p=>p.slug===id)?.name??'product'}.`);}
  else if(command.type==='lights'){change(allRooms?{type:'all-lights',on:command.on}:{type:'room-lights',room:targetRoom,on:command.on});announce(`${allRooms?'All lights':roomPlan(targetRoom).circuit+' · '+ROOM_NAMES[targetRoom]} ${command.on?'on':'off'}.`);}
  else if(command.type==='brightness'){change(allRooms?{type:'all-lights',on:command.value>0,brightness:command.value}:{type:'room-lights',room:targetRoom,on:command.value>0,brightness:command.value});announce(`${allRooms?'All lights':roomPlan(targetRoom).circuit} set to ${command.value} percent.`);}
  else if(command.type==='climate'){change({type:'climate',on:command.on});announce(command.on?'The AC is on.':'The AC is off.');}
  else if(command.type==='standby'){change({type:'tv',on:command.on});announce(command.on?'The TV is on.':'The TV is off.');}
  else if(command.type==='scene'){const id=command.scene==='movie'?'evening':command.scene;applyScene(id);announce(id==='away'?'Away mode. Lights, fans and appliances are off.':id==='evening'?'Evening. Lights dimmed, curtains closed.':'Welcome home.');}
  else announce(HELP);
  setInput('');
 },[announce,applyScene,change,select,simulation.variants,step.stop]);
 const latestExecute=useRef(execute);
 useEffect(()=>{latestExecute.current=execute;},[execute]);

 // Voice stays off until the visitor turns it on; typed commands always work.
 useEffect(()=>{
  const Constructor=(window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition;
  const controller=createVoiceSession(()=>{if(!Constructor)throw Error('Unsupported');return new Constructor();},{
   onEnabled:setMicOn,
   onState:(state,message)=>{setVoiceState(state);if(message)setNotice(message);else if(state==='listening')setNotice('');},
   onTranscript:text=>{if(parseSimulationCommand(normalizeRoomCommand(text)).type!=='unknown')latestExecute.current(text);},
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
 const sheet=selected&&INSTALLED_PRODUCTS.find(p=>p.id===selected),info=selected&&FAMILIES.find(p=>p.slug===selected);
 const currentState=sheet&&productState(sheet,simulation),tourProduct=step.fitting?fittedProduct(step.fitting,simulation):undefined,tourFamily=tourProduct&&FAMILIES.find(p=>p.slug===tourProduct.id),currentRoom=roomPlan(step.stop),inRoom=roomProducts(step.stop,simulation);
 const quickProducts=[fittedProduct(currentRoom.controller,simulation),...(currentRoom.fan?[fittedProduct(currentRoom.fan,simulation)]:[]),...inRoom.filter(p=>p.kind==='ir'||p.kind==='sensor')].slice(0,3);
 const focusMode=(id:string)=>{
  const p=INSTALLED_PRODUCTS.find(x=>x.id===id);if(p){select(id);announce(`Viewing ${FAMILIES.find(x=>x.slug===id)?.name??'product'}.`);}
 };
 const togglePower=(id:string)=>{const p=INSTALLED_PRODUCTS.find(x=>x.id===id);if(p)dispatch({type:'power',id,on:!productState(p,simulation).on});};
 const updateRoomLights=(room:RoomId,on:boolean)=>dispatch({type:'room-lights',room,on});
 const selectedScene=simulation.scene;
 return <div className="sim-scroll-story" ref={storyRef} style={{height:`${TOUR.length*100}svh`}}><div className="sim">
  <h1 className="sr-only">The Heseos Simulation</h1>
  <div className="sim-stage">
   {status.state!=='error'&&<ApartmentViewer apartment={home} state={simulation} focus={focus} tourStop={step.stop} tourViews={CAMERA_VIEWS} scrollProgress={scrollProgress} selected={selected} reducedMotion={reduced} debug={debug} onSelect={focusMode} onStatus={setStatus}/>}
   {status.state==='loading'&&<div className="sim-loading" role="status"><span className="tabular">{pct}%</span><small>Opening {home.name}{status.total?` · ${(status.loaded/1e6).toFixed(1)} of ${(status.total/1e6).toFixed(1)} MB`:''}</small></div>}
   {status.state==='error'&&<div className="sim-loading" role="status"><span>3D isn’t available here.</span><small>Every control below still works. Try another browser for the walkthrough.</small></div>}
   <div className="sim-meter" aria-live="polite"><span>Live apartment load</span><strong className="tabular">{usage.total.toLocaleString('en-IN')}<small> W</small></strong><em>Illustrative · {Object.values(simulation.rooms).filter(r=>r.lights).length} rooms lit</em><i style={{transform:`scaleX(${Math.min(1,usage.total/4000)})`}}/></div>
   <button className={'sim-chip sim-app-toggle'+(appView?' active':'')} aria-pressed={appView} onClick={()=>setAppView(v=>!v)}><Smartphone size={15}/>App view</button>
   <section className="sim-tour" aria-live="polite" aria-label="Room tour section">
    <nav className="sim-room-nav" aria-label="Apartment rooms">{ROOM_PLAN.map(r=><button key={r.id} aria-current={step.stop===r.id?'step':undefined} onClick={()=>goStep(TOUR.findIndex(s=>s.stop===r.id))}>{r.name}</button>)}</nav>
    <span className="sim-tour-count">{String(stepIndex+1).padStart(2,'0')} / {String(TOUR.length).padStart(2,'0')} · {ROOM_NAMES[step.stop as RoomId]??'Apartment 2'}</span>
    <h2 key={`${step.id}-title`}>{step.title}</h2><p key={`${step.id}-description`}>{step.description}</p>
    {tourProduct&&isRoomControl(tourProduct)&&<div className="sim-tour-products"><button className="sim-tour-control" role="switch" aria-checked={simulation.rooms[step.stop].lights} onClick={()=>updateRoomLights(step.stop,!simulation.rooms[step.stop].lights)}>{currentRoom.circuit} {simulation.rooms[step.stop].lights?'on':'off'} <Lightbulb size={16}/></button><label className="sim-slider">Brightness<input aria-label={`${currentRoom.circuit} brightness`} type="range" min="0" max="100" step="5" value={simulation.rooms[step.stop].lights?simulation.rooms[step.stop].brightness:0} onChange={e=>dispatch({type:'room-lights',room:step.stop,on:Number(e.target.value)>0,brightness:Number(e.target.value)})}/><span>{simulation.rooms[step.stop].brightness}%</span></label></div>}
    {step.focus==='tv'&&<button className="sim-tour-control" role="switch" aria-checked={simulation.tv} onClick={()=>change({type:'tv',on:!simulation.tv})}>TV {simulation.tv?'on':'off'} <Power size={16}/></button>}
    {step.focus==='ac'&&<button className="sim-tour-control" role="switch" aria-checked={simulation.climate} onClick={()=>change({type:'climate',on:!simulation.climate})}>AC {simulation.climate?'on':'off'} · {simulation.temperature}°C <Snowflake size={16}/></button>}
    {tourProduct&&tourFamily&&<button className="sim-catalog-product sim-product-feature" onClick={()=>focusMode(tourProduct.id)}><img src={tourFamily.image} alt=""/><span>{tourFamily.name}<small><ArrowRight size={12}/> {tourProduct.label} · controls and options</small></span></button>}
    <details className="sim-room-products" key={step.stop}><summary>Fitted in {ROOM_NAMES[step.stop].toLowerCase()} · {inRoom.length}</summary><div>{inRoom.map(p=><button key={p.slot} onClick={()=>focusMode(p.id)}><span>{p.label}</span><small>{productStatus(p,simulation)}</small></button>)}</div></details>
    <div className="sim-tour-nav"><button disabled={stepIndex===0} onClick={()=>goStep(stepIndex-1)}>Previous</button><span>Scroll to explore</span><button disabled={stepIndex===TOUR.length-1} onClick={()=>goStep(stepIndex+1)}>Next <ArrowRight size={14}/></button></div>
    <div className="sim-tour-progress"><i ref={progressBar}/></div>
   </section>
   {appView&&<div className="sim-app" aria-label="Heseos app preview"><header><span>Whole-home controls</span><button aria-label="Close app view" onClick={()=>setAppView(false)}><X size={14}/></button></header><div className="sim-app-power"><b className="tabular">{usage.total.toLocaleString('en-IN')} W</b><span>Live illustrative usage</span></div>{(Object.keys(ROOM_NAMES) as RoomId[]).map(room=><button key={room} className={simulation.rooms[room].lights?'on':''} onClick={()=>updateRoomLights(room,!simulation.rooms[room].lights)}><Lightbulb size={16}/><span>{ROOM_NAMES[room]}<small>{roomPlan(room).circuit} · {simulation.rooms[room].brightness}%</small></span><i>{simulation.rooms[room].lights?'On':'Off'}</i></button>)}<button className={simulation.climate?'on':''} onClick={()=>change({type:'climate',on:!simulation.climate})}><Snowflake size={16}/><span>Air conditioning<small>{simulation.temperature}°C</small></span><i>{simulation.climate?'On':'Off'}</i></button><p>Each switch controls only its own room.</p></div>}
   {sheet&&info&&currentState&&<aside className="sim-sheet" aria-label={info.name}>
    <button className="sim-sheet-close" aria-label="Close" onClick={()=>setSelected(null)}><X size={16}/></button>
    <img src={info.image} alt="" className="sim-sheet-image"/>
    <span className="eyebrow">{sheet.detail} · {productStatus(sheet,simulation)}</span><h2 className="title">{info.name}</h2><p className="muted">{info.summary}</p>
    {FITTINGS.find(f=>f.id===sheet.slot)!.options.length>1&&<label className="sim-fitted-model">Fitted model<select aria-label={`Fitted model for ${sheet.label}`} value={sheet.id} onChange={e=>select(e.target.value)}>{FITTINGS.find(f=>f.id===sheet.slot)!.options.map(p=><option key={p.id} value={p.id}>{FAMILIES.find(f=>f.slug===p.id)?.name}</option>)}</select><small>Replaces this fitting. One model stays installed.</small></label>}
    {isRoomControl(sheet)&&<><button className="sim-switch" role="switch" aria-checked={simulation.rooms[sheet.room].lights} onClick={()=>togglePower(sheet.id)}><Lightbulb size={18}/><span>{roomPlan(sheet.room).circuit} · {ROOM_NAMES[sheet.room]}<small>{simulation.rooms[sheet.room].lights?'On':'Off'} · {simulation.rooms[sheet.room].brightness}%</small></span><i/></button><label className="sim-slider">Dimmer<input aria-label="Room lighting brightness" type="range" min="0" max="100" step="5" value={simulation.rooms[sheet.room].lights?simulation.rooms[sheet.room].brightness:0} onChange={e=>change({type:'level',id:sheet.id,value:Number(e.target.value)})}/><span>{simulation.rooms[sheet.room].brightness}%</span></label></>}
    {sheet.kind==='screen'&&<><button className="sim-switch" role="switch" aria-checked={simulation.climate} onClick={()=>change({type:'climate',on:!simulation.climate})}><Snowflake size={18}/><span>Air conditioner<small>{simulation.temperature}°C · {simulation.climate?'Cooling':'Off'}</small></span><i/></button><label className="sim-slider">Temperature<input type="range" min="16" max="30" value={simulation.temperature} onChange={e=>change({type:'temperature',value:Number(e.target.value)})}/><span>{simulation.temperature}°</span></label></>}
    {isLight(sheet)&&<><button className="sim-switch" role="switch" aria-checked={currentState.on} onClick={()=>togglePower(sheet.id)}><Lightbulb size={18}/><span>Light {currentState.on?'on':'off'}<small>{currentState.kelvin} K · {currentState.level}% brightness</small></span><i/></button><label className="sim-slider">Brightness<input type="range" min="0" max="100" step="5" value={currentState.level} onChange={e=>change({type:'level',id:sheet.id,value:Number(e.target.value)})}/><span>{currentState.level}%</span></label><label className="sim-slider">Colour<input type="range" min="2700" max="6500" step="100" value={currentState.kelvin} onChange={e=>change({type:'kelvin',id:sheet.id,value:Number(e.target.value)})}/><span>{currentState.kelvin} K</span></label>{sheet.kind==='tube'&&<button className="sim-switch" role="switch" aria-checked={currentState.backup} onClick={()=>change({type:'backup',id:sheet.id,on:!currentState.backup})}><span>Backup battery<small>Test battery light · bathroom mains off</small></span><i/></button>}</>}
    {sheet.kind==='fan'&&<><label className="sim-slider">Fan speed<input aria-label="Ceiling fan speed" type="range" min="0" max="5" step="1" value={simulation.rooms[sheet.room].fanSpeed} onChange={e=>change({type:'fan',room:sheet.room,speed:Number(e.target.value)})}/><span>{simulation.rooms[sheet.room].fanSpeed}/5</span></label></>}
    {sheet.kind==='plug'&&<><button className="sim-switch" role="switch" aria-checked={simulation.tv} onClick={()=>change({type:'tv',on:!simulation.tv})}><Tv size={18}/><span>Television & set-top box<small>Switched {simulation.tv?'on':'off'} at the plug</small></span><i/></button><div className="sim-reading"><strong className="tabular">{usage.tv} W</strong><span>Illustrative connected load</span></div></>}
    {sheet.kind==='ir'&&<><button className="sim-switch" role="switch" aria-checked={simulation.climate} onClick={()=>change({type:'climate',on:!simulation.climate})}><Snowflake size={18}/><span>Air conditioner<small>{simulation.climate?'Cooling':'Off'}</small></span><i/></button><label className="sim-slider">Set temperature<input type="range" min="16" max="30" value={simulation.temperature} onChange={e=>change({type:'temperature',value:Number(e.target.value)})}/><span>{simulation.temperature}°C</span></label></>}
    {sheet.kind==='curtain'&&<><label className="sim-slider">Curtain travel<input type="range" min="0" max="100" step="5" value={simulation.curtain} onChange={e=>change({type:'curtain',value:Number(e.target.value)})}/><span>{simulation.curtain}%</span></label><div className="sim-product-actions"><button aria-pressed={simulation.curtainKind==='curtain'} onClick={()=>change({type:'curtain-kind',value:'curtain'})}>Curtains</button><button aria-pressed={simulation.curtainKind==='blind'} onClick={()=>change({type:'curtain-kind',value:'blind'})}>Roller blind</button></div><div className="sim-product-actions"><button onClick={()=>change({type:'curtain',value:0})}>Close</button><button onClick={()=>change({type:'curtain',value:100})}>Open</button></div></>}
    {sheet.kind==='lock'&&<><button className="sim-switch" role="switch" aria-checked={currentState.locked} onClick={()=>change({type:'lock',id:sheet.id,locked:!currentState.locked})}><Power size={18}/><span>{sheet.id==='drawer-lock'?'Drawer lock':'Door lock'}<small>{currentState.locked?'Locked':'Unlocked'} · simulated</small></span><i/></button></>}
    {(sheet.kind==='sensor'||sheet.kind==='doorbell'||sheet.kind==='intercom')&&<><button className="sim-switch" role="switch" aria-checked={sheet.kind==='sensor'?currentState.triggered:currentState.call!=='idle'} onClick={()=>sheet.kind==='sensor'?change({type:'sensor',id:sheet.id,triggered:!currentState.triggered}):change({type:'call',id:sheet.id,call:currentState.call==='idle'?'ringing':'idle'})}><Power size={18}/><span>{sheet.kind==='sensor'?'Detection event':'Test entrance call'}<small>{productStatus(sheet,simulation)}</small></span><i/></button>{sheet.kind!=='sensor'&&currentState.call==='ringing'&&<button className="sim-tour-control" onClick={()=>change({type:'call',id:sheet.id,call:'connected'})}>Answer visitor</button>}{sheet.kind==='sensor'&&<p className="sim-note">{currentState.triggered?(sheet.id==='gas-leak-sensor'||sheet.id==='smoke-detector'?'Alert active · clear the event to dismiss it.':`${ROOM_NAMES[sheet.room]} lights came on automatically.`):'Trigger a test event to see the automation.'}</p>}</>}
    {sheet.kind==='meter'&&<><div className="sim-reading"><strong className="tabular">{usage.total.toLocaleString('en-IN')} W</strong><span>Apartment · illustrative real-time load</span></div><label className="sim-slider">Alert threshold<input type="range" min="100" max="4000" step="100" value={simulation.threshold} onChange={e=>change({type:'threshold',value:Number(e.target.value)})}/><span>{simulation.threshold} W</span></label><p className="sim-note">{usage.total>simulation.threshold?'Threshold reached · alert active':'Usage is below your alert threshold.'}</p></>}
    <div className="sim-sheet-actions"><SiteLink className="link" href={familyHref(info)}>Full specifications <ArrowRight size={14}/></SiteLink><SiteLink className="btn small" href={`/demo?product=${encodeURIComponent(info.name)}`}>Book a demo</SiteLink></div>

   </aside>}
  </div>
  <div className="sim-dock">
   <div className="sim-devices" role="group" aria-label={`${ROOM_NAMES[step.stop]} controls`}>{quickProducts.map(p=><button key={p.slot} className={'sim-device'+(selected===p.id?' selected':'')} aria-pressed={selected===p.id} onClick={()=>focusMode(p.id)}><Power size={16}/><span>{p.label}<small>{productStatus(p,simulation)}</small></span></button>)}</div>
   <div className="segmented small" role="group" aria-label="Whole-home scenes">{(['home','evening','away'] as const).map(id=><button key={id} aria-pressed={selectedScene===id} onClick={()=>applyScene(id)}>{id==='home'?'Home':id==='evening'?'Evening':'Away'}</button>)}</div>
   <form className="sim-command" onSubmit={e=>{e.preventDefault();if(input.trim())execute(input);}}>
    <label className="sr-only" htmlFor="sim-command">Type a command</label>
    <input id="sim-command" value={input} onChange={e=>setInput(e.target.value)} placeholder={`“Lights off” for ${ROOM_NAMES[step.stop].toLowerCase()}`} autoComplete="off"/>
    <button type="submit" aria-label="Send command" disabled={!input.trim()}><Send size={16}/></button>
    <button type="button" className={micOn?'on':''} aria-label={micOn?'Turn voice off':'Turn voice on'} aria-pressed={micOn} aria-busy={voiceState==='starting'||voiceState==='processing'} onClick={toggleMic}>{micOn?<Mic size={16}/>:<MicOff size={16}/>}</button>
    <button type="button" aria-label={spoken?'Mute spoken replies':'Unmute spoken replies'} aria-pressed={spoken} disabled={!micOn} onClick={toggleSpoken}>{spoken?<Volume2 size={16}/>:<VolumeX size={16}/>}</button>
   </form>
   <p className="sim-reply" role="status">{notice||reply}</p>
  </div>
 </div></div>;
}
