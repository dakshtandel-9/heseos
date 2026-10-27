'use client';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, Lightbulb, Maximize2, Menu, Mic, MicOff, Minus, Plus, Power, RotateCcw, Send, Snowflake, Sparkles, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { INITIAL_POWER, dailyAvoidedKwh, parseEnergyCommand, powerUsage, type PowerState } from '../../lib/energy';
import {createVoiceSession, type VoiceSession, type VoiceState, type SpeechWindow} from '../../lib/voice';
import {useSpeechFeedback,WELCOME} from '../components/useSpeechFeedback';
import SiteLoader from '../components/SiteLoader';
import SceneLoadBoundary from '../components/SceneLoadBoundary';
import {useSiteLoading} from '../components/useSiteLoading';
const HomeScene=lazy(()=>import('../components/HomeScene'));
const chapters=[
 {eyebrow:'01 — YOUR CONNECTED HOME',title:<>Saving power.<br/><em>Room by room.</em></>,body:'Step inside a home that uses energy thoughtfully. Scroll to explore each room, then take control of what’s running.',label:'The whole home'},
 {eyebrow:'02 — THE LIVING ROOM',title:<>A softer light.<br/><em>A smarter switch.</em></>,body:'One touch panel, every room. Switch lighting off across the whole home, or dim all the lights to suit the moment.',label:'Lighting'},
 {eyebrow:'03 — THE BEDROOM',title:<>Cool the room.<br/><em>Only when needed.</em></>,body:'Upstairs, the bedroom AC is still running. Turn it off when the room is empty and see the connected load fall.',label:'Climate'},
 {eyebrow:'04 — THE ENTERTAINMENT ROOM',title:<>The show is over.<br/><em>So is the standby.</em></>,body:'Head downstairs to the entertainment room. Give idle devices a break by switching off their connected standby load.',label:'Standby'},
 {eyebrow:'05 — ONE HOME. ONE SCENE.',title:<>Head out.<br/><em>Leave less on.</em></>,body:'You’ve explored the home. Bring lighting, climate and standby devices together in one Away scene.',label:'Away mode'},
];
const TOUR_STOPS=chapters.length;
export default function Home(){
 const [power,setPower]=useState<PowerState>(INITIAL_POWER),[progress,setProgress]=useState(0),[chapter,setChapter]=useState(0),[rotation,setRotation]=useState(0),[resetView,setResetView]=useState(0),[reduced,setReduced]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [homeReady,setHomeReady]=useState(false),[voiceState,setVoiceState]=useState<VoiceState>('loading'),[micEnabled,setMicEnabled]=useState(false),[voiceNotice,setVoiceNotice]=useState(''),[input,setInput]=useState(''),[hours,setHours]=useState(4),[sourceOpen,setSourceOpen]=useState(false),[sceneName,setSceneName]=useState('Home');
 const {percent:loadPercent,error:loadError,revealed,onModelProgress,onLoadError}=useSiteLoading(homeReady);
 const story=useRef<HTMLElement>(null),recognition=useRef<VoiceSession|null>(null),sourceDialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!menuOpen)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenuOpen(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[menuOpen]);
 const {spoken,reply,welcomePending,announce,cancel:cancelSpeech,toggleSpoken,setReply}=useSpeechFeedback(recognition);
 const powerRef=useRef(power);powerRef.current=power;
 const announcedLights=useRef(power.lights);
 const onHomeReady=useCallback(()=>setHomeReady(true),[]);
 const voiceBusy=voiceState==='loading'||voiceState==='starting'||voiceState==='processing';
 const usage=powerUsage(power),avoided=dailyAvoidedKwh(1400,usage.total,hours);

 const setScene=useCallback((scene:'away'|'home'|'movie')=>{setSceneName(scene==='away'?'Away':scene==='movie'?'Evening':'Home');setPower(scene==='away'?{lights:false,brightness:0,climate:false,standby:false}:scene==='movie'?{lights:true,brightness:30,climate:true,standby:false}:{...INITIAL_POWER});},[]);
 const toggleLights=useCallback(()=>{setSceneName('Custom');setPower(p=>({...p,lights:!p.lights,brightness:p.brightness||100}));},[]);
 const goTo=useCallback((id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:reduced?'instant':'smooth'});},[reduced]);
 const execute=useCallback((text:string)=>{
  const command=parseEnergyCommand(text);
  if(command.type==='lights'){setPower(p=>({...p,lights:command.on,brightness:p.brightness||100}));setSceneName('Custom');if(powerRef.current.lights===command.on)announce(command.on?'Your lights are on.':'Your lights are off.');}
  else if(command.type==='brightness'){announcedLights.current=command.value>0;setPower(p=>({...p,lights:command.value>0,brightness:command.value}));setSceneName('Custom');announce(`All home lights set to ${command.value} percent.`);}
  else if(command.type==='climate'){setPower(p=>({...p,climate:command.on}));setSceneName('Custom');announce(command.on?'Climate control on.':'Climate control off. No cooling an empty room.');}
  else if(command.type==='standby'){setPower(p=>({...p,standby:command.on}));setSceneName('Custom');announce(command.on?'Standby devices connected.':'Standby devices switched off.');}
  else if(command.type==='scene'){announcedLights.current=command.scene!=='away';setScene(command.scene);announce(command.scene==='away'?'Away mode is active. Lights, climate and standby loads are off.':command.scene==='movie'?'Evening mode. Lights at 30 percent and standby devices off.':'Welcome home. Your lighting and devices are on.');}
  else if(command.type==='navigate'){goTo(command.target);announce('Let’s take a look.');}
  else announce('Try “lights off”, “dim to 30 percent”, “AC off”, or “Away mode”.');
  setInput('');
 },[announce,goTo,setScene]);
 const latestExecute=useRef(execute);latestExecute.current=execute;
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');setReduced(media.matches);const update=()=>setReduced(media.matches);media.addEventListener('change',update);
  return()=>{media.removeEventListener('change',update);recognition.current?.dispose();};
 },[]);
 useEffect(()=>{
  if(!revealed)return;
  const Constructor=(window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition;
  const controller=createVoiceSession(()=>{if(!Constructor)throw Error('Unsupported');return new Constructor();},{
   onEnabled:setMicEnabled,
   onState:(state,message)=>{setVoiceState(state);if(message)setVoiceNotice(message);else if(state==='listening')setVoiceNotice('');},
   onTranscript:text=>{if(parseEnergyCommand(text).type!=='unknown')latestExecute.current(text);},
  });
  recognition.current=controller;
  if(document.hidden)controller.pause('hidden');
  setVoiceState('ready');
  return()=>{controller.dispose();if(recognition.current===controller)recognition.current=null;cancelSpeech(false);};
 },[revealed,announce,cancelSpeech,welcomePending]);
 useEffect(()=>{
  if(!revealed)return;
  const visibility=()=>{if(document.hidden){recognition.current?.pause('hidden');cancelSpeech(true);}else{recognition.current?.resume('hidden');if(recognition.current?.isEnabled()&&welcomePending.current)announce(WELCOME,true);}};
  const unlock=()=>{if(recognition.current?.isEnabled()&&welcomePending.current)announce(WELCOME,true);};
  document.addEventListener('visibilitychange',visibility);document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);
  return()=>{document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);};
 },[revealed,announce,cancelSpeech,welcomePending]);
 useEffect(()=>{if(announcedLights.current!==power.lights){announcedLights.current=power.lights;announce(power.lights?'Your lights are on.':'Your lights are off.');}},[power.lights,announce]);
 useEffect(()=>{if(sourceOpen)sourceDialog.current?.showModal();else sourceDialog.current?.close();},[sourceOpen]);
 useEffect(()=>{
  let raf=0;const update=()=>{raf=0;const el=story.current;if(!el)return;const bounds=el.getBoundingClientRect();const value=Math.max(0,Math.min(1,-bounds.top/(el.offsetHeight-(el.firstElementChild as HTMLElement).offsetHeight)));setProgress(value);setChapter(Math.min(TOUR_STOPS-1,Math.floor(value*TOUR_STOPS)));};
  const scroll=()=>{if(!raf)raf=requestAnimationFrame(update);};window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
 },[]);
 function jump(index:number){if(!story.current)return;const top=window.scrollY+story.current.getBoundingClientRect().top;window.scrollTo({top:top+(story.current.offsetHeight-(story.current.firstElementChild as HTMLElement).offsetHeight)*(index/TOUR_STOPS+(index===0?0:.12)),behavior:'instant'});}
 function startVoice(){
  setMenuOpen(false);if(!revealed)return;
  const controller=recognition.current;
  if(controller?.isEnabled()){
   controller.stop();welcomePending.current=false;cancelSpeech(true);setVoiceNotice('');setReply('Microphone is off. Tap the mic to turn it on.');
  }else{
   setVoiceNotice('');if(welcomePending.current){controller?.pause('speech');controller?.start();announce(WELCOME,true);}else controller?.start();
  }
 }
 function typeCommand(text:string){execute(text);}
 const change=(key:'climate'|'standby')=>{setSceneName('Custom');setPower(p=>({...p,[key]:!p[key]}));};
 const activeDevice=chapter===2?'climate':chapter===3?'standby':'lights';
 const activeOn=power[activeDevice];
 const activeLabel=chapter===2?'Bedroom climate':chapter===3?'Entertainment standby':'All home lights';
 const toggleDevice=useCallback((device:'lights'|'climate'|'standby')=>{setSceneName('Custom');setPower(p=>({...p,[device]:!p[device],...(device==='lights'?{brightness:p.brightness||100}:{})}));},[]);
 return <>{!revealed&&<SiteLoader percent={loadPercent} error={loadError}/>}<main inert={!revealed} aria-hidden={!revealed} style={{opacity:revealed?1:0}}>
  <a className="skip-link" href="#playground">Skip to energy controls</a>
  <header className="nav"><a href="#story" className="brand" aria-label="Heseos Saving Power home" onClick={()=>setMenuOpen(false)}><img src="/assets/heseos-logo-white.png" alt="Heseos — Lighting Ahead" width="2588" height="896"/></a><nav id="main-navigation" className={menuOpen?'is-open':''} aria-label="Main navigation"><a href="#story" onClick={()=>setMenuOpen(false)}>The experience</a><a href="#playground" onClick={()=>setMenuOpen(false)}>Saving power</a><a href="#products" onClick={()=>setMenuOpen(false)}>Our products</a><a href="https://www.heseos.com/" target="_blank" rel="noreferrer" onClick={()=>setMenuOpen(false)}>Discover Heseos <ArrowUpRight size={11}/></a></nav><button className="nav-cta" aria-label={micEnabled?'Turn voice assistant off':'Turn voice assistant on'} aria-pressed={micEnabled} aria-busy={voiceBusy} title={voiceNotice||undefined} onClick={startVoice} disabled={!revealed}><span>{micEnabled?'Voice on':'Voice off'}</span>{micEnabled?<Mic size={15}/>:<MicOff size={15}/>}</button><button className="menu-toggle" aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={21}/>:<Menu size={21}/>}</button></header>
  <section className="scroll-story" id="story" ref={story} aria-label="Saving Power scroll experience">
   <div className={'story-stage '+(!power.lights?'lights-off':'')}>
    <div className="home-atmosphere"/><div className="home-horizon"/>
    <div className="hero-topline"><span><i/> THE HESEOS SAVING POWER EXPERIENCE</span><span>LESS ENERGY. MORE POSSIBILITY.</span></div>
    <div className={'chapter-copy tour-copy stop-'+chapter} key={chapter}><div className="eyebrow">{chapters[chapter].eyebrow}</div><h1>{chapters[chapter].title}</h1><p>{chapters[chapter].body}</p>
     {chapter===0?<button className="primary" onClick={()=>jump(1)}>Step inside your home <ArrowDown size={15}/></button>:chapter===4?<><button className="primary" onClick={()=>setScene('away')}><Power size={15}/> Activate Away mode</button><button className="text-button" onClick={()=>goTo('playground')}>Explore all controls <ArrowRight size={14}/></button></>:<div className="component-actions"><button className={'component-switch '+(activeOn?'is-on':'')} role="switch" aria-checked={activeOn} aria-label={'Tour '+activeLabel} onClick={()=>toggleDevice(activeDevice)}>{chapter===1?<Lightbulb size={18}/>:chapter===2?<Snowflake size={18}/>:<Power size={18}/>}<span>{activeLabel}<small>{activeOn?'On — tap to switch off':'Off — power saved'}</small></span><i className={'switch '+(activeOn?'on':'')}><i/></i></button>{chapter===1&&<label className="tour-dimmer">Brightness <input type="range" min="0" max="100" value={power.brightness} aria-label="Tour lighting brightness" onChange={e=>{const v=Number(e.target.value);setPower(p=>({...p,lights:v>0,brightness:v}));setSceneName('Custom');}}/><span>{power.brightness}%</span></label>}<button className="next-room" onClick={()=>jump(chapter+1)}>Next: {chapters[chapter+1].label}<ArrowRight size={13}/></button></div>}
     <div className="chapter-footnote">{chapter===0?'ONE HOME. THREE SMALL CHANGES.':chapter===4?'EVERY SWITCH TELLS A BETTER ENERGY STORY.':'SCROLL TO CONTINUE · YOUR CHANGES STAY WITH YOU'}</div>
    </div>
    <div className={'home-model-stage stop-'+chapter}><SceneLoadBoundary onError={onLoadError}><Suspense fallback={<div className="home-loading"><span className="loading-ring"/><span>Opening your home…</span></div>}><HomeScene progress={progress} chapter={chapter} power={power} rotation={rotation} reducedMotion={reduced} resetView={resetView} onToggle={toggleDevice} onReady={onHomeReady} onProgress={onModelProgress} onError={onLoadError}/></Suspense></SceneLoadBoundary>
     <div className="model-caption"><span className="tiny-line"/> {chapter===0?'YOUR HOME, IN THREE DIMENSIONS':chapter===1?'WHOLE-HOME LIGHTING · HESEOS TOUCH CONTROL':chapter===2?'BEDROOM · CONNECTED CLIMATE':chapter===3?'ENTERTAINMENT · STANDBY CONTROL':'YOUR WHOLE HOME, WORKING TOGETHER'}<span>Drag to look around · Tap a device to switch</span></div>
     <div className="model-tools" aria-label="3D view controls"><button className={'whole-home-toggle '+(power.lights?'is-on':'')} role="switch" aria-checked={power.lights} aria-label="Whole-home lights" onClick={toggleLights}><Lightbulb size={14}/><span>All lights {power.lights?'on':'off'}</span></button><button aria-label="Rotate home left" onClick={()=>setRotation(r=>Math.max(-.8,r-.2))}><ChevronLeft size={15}/></button><button aria-label="Reset 3D view" onClick={()=>{setRotation(0);setResetView(v=>v+1);}}><RotateCcw size={13}/><span>Reset view</span></button><button aria-label="Rotate home right" onClick={()=>setRotation(r=>Math.min(.8,r+.2))}><ChevronRight size={15}/></button></div>
    </div>
    <div className="energy-float"><div><i/> CONNECTED LOAD <span>ILLUSTRATIVE</span></div><strong>{usage.total.toLocaleString()}<small>W</small></strong><span className={usage.total<1400?'saving-indicator':'power-baseline'}>{usage.total<1400?<><ArrowDown size={12}/>{(1400-usage.total).toLocaleString()} W switched off</>:<>Your home, before a smarter routine</>}</span></div>
    <div className="stage-bottom"><div className="chapter-nav" role="navigation" aria-label="Story chapters">{chapters.map((c,i)=><button key={i} className={chapter===i?'active':''} aria-current={chapter===i?'step':undefined} onClick={()=>jump(i)}><span>0{i+1}</span><span>{c.label}</span></button>)}</div><div className="quick-controls"><button className={activeOn?'active':''} onClick={()=>toggleDevice(activeDevice)} role="switch" aria-checked={activeOn} aria-label="Focused component power">{chapter===2?<Snowflake size={15}/>:chapter===3?<Power size={15}/>:<Lightbulb size={15}/>}<span>{chapter===2?'Climate':chapter===3?'Standby':'Lights'} {activeOn?'on':'off'}</span><i className="mini-switch"/></button></div></div>
    <div className="scroll-progress" role="progressbar" aria-label="Story progress" aria-valuenow={Math.round(progress*100)} aria-valuemin={0} aria-valuemax={100}><span style={{transform:`scaleX(${progress})`}}/></div>
   </div>
  </section>
  <section className="manifesto" aria-label="Why saving power matters"><span className="eyebrow">A SMALL CHANGE. A BETTER EVERYDAY.</span><h2>Saving power should feel<br/><em>like second nature.</em></h2><p>Keep the moments that matter. Switch off what doesn’t.<br/>Heseos brings power monitoring, schedules and room-wise control<br className="desktop"/> together, so your home can use energy more thoughtfully.</p><div className="principles"><span><Zap size={18}/> Know what’s running</span><span><Clock3 size={18}/> Set a smarter routine</span><span><Power size={18}/> Leave waste behind</span></div></section>
  <section className="playground" id="playground">
   <div className="lab-heading"><div><span className="eyebrow">YOUR HOME. YOUR CONTROLS.</span><h2>Feel the difference.<br/><em>See it in watts.</em></h2></div><p>Make a change below and watch the room respond.<br/>This is your space to try a little smarter living.</p></div>
   <div className="lab-grid"><div className="room-preview"><img src="/assets/living-room.jpg" alt="The warm Heseos living room shown in the proposal" style={{filter:`brightness(${power.lights?.6+power.brightness/180:.22}) saturate(${power.lights?1:.35})`}}/><div className="preview-top"><span><i/> LIVING ROOM</span><span>{sceneName.toUpperCase()} SCENE</span></div><div className="preview-bottom"><span>One room.<br/><em>A more thoughtful rhythm.</em></span><button onClick={toggleLights} aria-label={power.lights?'Turn all home lights off':'Turn all home lights on'}><Power size={22}/></button></div><span className="preview-note">Interactive lighting simulation</span></div>
    <div className="control-panel"><div className="control-panel-top"><span className="eyebrow">MAKE YOURSELF AT HOME</span><button className="reset" onClick={()=>setScene('home')}><RotateCcw size={12}/> Reset</button></div>
     <div className="scene-presets" role="group" aria-label="Energy scenes">{(['home','movie','away'] as const).map((s,i)=><button key={s} className={sceneName===(s==='movie'?'Evening':s==='home'?'Home':'Away')?'selected':''} onClick={()=>setScene(s)}>{[<Lightbulb size={14} key="a"/>,<Sparkles size={14} key="b"/>,<Power size={14} key="c"/>][i]}{s==='movie'?'Evening':s==='home'?'Home':'Away'}</button>)}</div>
     <div className="device-row"><div className="device-icon"><Lightbulb size={19}/></div><div><strong>Whole-home lighting</strong><span>Every room, one control</span></div><b>{usage.lighting} W</b><button className={'switch '+(power.lights?'on':'')} role="switch" aria-checked={power.lights} aria-label="Lighting power" onClick={toggleLights}><i/></button></div>
     <div className="dimmer"><Minus size={11}/><input type="range" min="0" max="100" value={power.brightness} aria-label="Lighting brightness" onChange={e=>{const value=Number(e.target.value);setSceneName('Custom');setPower(p=>({...p,brightness:value,lights:value>0}));}}/><Plus size={11}/><span>{power.brightness}%</span></div>
     <div className="device-row"><div className="device-icon"><Snowflake size={19}/></div><div><strong>Climate</strong><span>Cool your room, when you’re in it</span></div><b>{usage.climate.toLocaleString()} W</b><button className={'switch '+(power.climate?'on':'')} role="switch" aria-checked={power.climate} aria-label="Climate power" onClick={()=>change('climate')}><i/></button></div>
     <div className="device-row"><div className="device-icon"><Power size={18}/></div><div><strong>Standby devices</strong><span>Give idle appliances a break</span></div><b>{usage.standby} W</b><button className={'switch '+(power.standby?'on':'')} role="switch" aria-checked={power.standby} aria-label="Standby device power" onClick={()=>change('standby')}><i/></button></div>
     <div className="usage-total"><div><span>CURRENT CONNECTED LOAD</span><strong>{usage.total.toLocaleString()}<small> watts</small></strong></div><div className="usage-meter" style={{'--load':`${usage.total/1400*100}%`} as React.CSSProperties}><span/></div></div>
     <p className="simulation-note">Illustrative loads: lighting 120 W · climate 1,200 W · standby 80 W. This demo does not measure or control real devices.</p>
    </div>
   </div>
   <div className="savings-strip"><div><span className="eyebrow">SMALL ACTIONS ADD UP</span><h3>{avoided.toFixed(2)} <span>kWh avoided</span></h3><p>At these settings for {hours} {hours===1?'hour':'hours'} each day.</p></div><label className="hours-control">How long is the room unused?<input type="range" min="1" max="12" value={hours} aria-label="Unused hours per day" onChange={e=>setHours(Number(e.target.value))}/><span>1 hour <b>{hours} hours / day</b> 12 hours</span></label><p className="calculation-note">Compared with all three sample loads running at 1,400 W. Calculated from your controls; actual savings depend on your devices and usage.</p></div>
  </section>
  <section className="voice-banner" id="voice-controls"><div className="voice-orb"><span/><span/><Mic size={26}/></div><div><span className="eyebrow">LESS EFFORT. LESS WASTE.</span><h2>“Hey Heseos,<br/><em>save some power.”</em></h2><p>Speak naturally and watch your home respond.<br/>Enable voice using the microphone in the header.</p></div><div className="inline-voice-controls"><div className="command-chips">{['Lights off','Dim to 30%','AC off','Away mode','I’m home'].map(c=><button key={c} onClick={()=>typeCommand(c)}>{c}</button>)}</div><form onSubmit={e=>{e.preventDefault();if(input.trim())typeCommand(input);}}><label className="sr-only" htmlFor="voice-command">Type a home command</label><input id="voice-command" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a command…" autoComplete="off"/><button type="submit" aria-label="Send command" disabled={!input.trim()}><Send size={17}/></button></form><p className="inline-voice-reply" role="status">{voiceNotice||reply}</p><div className="voice-options"><span>Voice is off by default. Turn it on in the header when you’re ready.</span><button aria-label={spoken?'Mute spoken replies':'Enable spoken replies'} aria-pressed={spoken} onClick={toggleSpoken} disabled={!micEnabled}>{spoken?<Volume2 size={16}/>:<VolumeX size={16}/>}</button></div><p className="voice-privacy">Your browser’s speech service may process audio. This demo does not store recordings.</p></div></section>
  <section className="products" id="products"><div className="products-heading"><div><span className="eyebrow">THOUGHTFUL TECHNOLOGY</span><h2>Beautifully simple.<br/><em>Quietly powerful.</em></h2></div><p>Touch control. Connected appliances.<br/>A smarter relationship with the energy you use.</p></div><button className="product-panorama" onClick={()=>setSourceOpen(true)} aria-label="View original product imagery"><img src="/assets/proposal-products.jpg" alt="Original proposal product collection: six black glass touch panels with gold edges" loading="lazy"/><span><Maximize2 size={15}/> Explore the collection</span></button><div className="product-details"><div><span>01</span><h3>Power, made visible.</h3><p>Follow consumption and understand which connected appliances need your attention.</p></div><div><span>02</span><h3>Control, wherever you are.</h3><p>Use the Heseos app to turn off a forgotten device, even after you’ve left home.</p></div><div><span>03</span><h3>Habits that run themselves.</h3><p>Bring devices together with a schedule or a scene that fits the way you live.</p></div></div><button className="sources-link" onClick={()=>setSourceOpen(true)}>Product imagery & sources <ArrowUpRight size={12}/></button></section>
  <section className="closing"><span className="eyebrow">SAVING POWER STARTS WITH ONE SWITCH.</span><h2>More life.<br/><em>Less left on.</em></h2><div><button className="primary" onClick={()=>{setPower({...INITIAL_POWER});setSceneName('Home');setRotation(0);setResetView(v=>v+1);goTo('story');}}>Replay the experience <RotateCcw size={15}/></button><a href="https://heseos.com/product-info/2m-touch" target="_blank" rel="noreferrer" className="text-button">Explore Heseos <ArrowUpRight size={14}/></a></div></section>
  <footer><a className="brand" href="#story" aria-label="Heseos Saving Power home"><img src="/assets/heseos-logo-white.png" alt="Heseos — Lighting Ahead" width="2588" height="896"/></a><span>Saving Power — an interactive concept by Zocktech.</span><button onClick={()=>setSourceOpen(true)}>About this demo <ArrowUpRight size={12}/></button></footer>
  <dialog ref={sourceDialog} className="source-dialog" onCancel={()=>setSourceOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setSourceOpen(false);}} aria-labelledby="source-title"><div className="dialog-content"><button className="close-button" onClick={()=>setSourceOpen(false)} aria-label="Close product sources"><X size={19}/></button><span className="eyebrow">THE HESEOS REFERENCE COLLECTION</span><h2 id="source-title">Original by design.</h2><img className="source-image" src="/assets/proposal-products.jpg" alt="Unaltered product collection extracted from page 8 of the Heseos proposal"/><p>The room and collection images come directly from the supplied Heseos proposal (pages 6 and 8). The 3D surfaces use those original product faces. The complete 3D home is a visual reconstruction of the proposal’s architecture. Depth and dimensions are illustrative; the PDF does not include engineering models.</p><div className="source-links"><a href="https://heseos.com/product-info/2m-touch" target="_blank" rel="noreferrer">Heseos touch controls <ArrowUpRight size={13}/></a><a href="https://www.heseos.com/product-info/4-switch" target="_blank" rel="noreferrer">Heseos energy monitoring <ArrowUpRight size={13}/></a></div><p className="source-note">Catalogue products differ from the proposal’s concept renders. Features are based on Heseos’s existing product pages. All energy values here are clearly labelled examples. Real hardware control requires a separate integration.</p></div></dialog>
 </main></>
}
