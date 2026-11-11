'use client';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, House, Keyboard, Mic, MicOff, Moon, Phone, PhoneOff, Play, Power, Send, Sun, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { parseSimulationCommand } from '../../../lib/devices';
import { ROOM_SCENES } from '../../../lib/experience-scenes';
import { FITTINGS, LEGACY_PRODUCTS, ROOM_NAMES, ROOM_PLAN, ROOM_TOUR, UNFITTED_PRODUCTS, apartmentReducer, apartmentUsage, fittedProduct, initialApartmentState, installed, lightingCommandTarget, normalizeRoomCommand, roomPlan, type ApartmentState, type RoomId } from '../../../lib/simulation-products';
import { createVoiceSession, type SpeechWindow, type VoiceSession, type VoiceState } from '../../../lib/voice';
import { useSpeechFeedback, WELCOME } from '../useSpeechFeedback';
import { useReducedMotion } from '../media/usePlatform';
import DeviceCard, { Slider, Toggle } from './DeviceCard';
import HomeStage from './HomeStage';
import RoomStage from './RoomStage';
import { ROOM_ICONS } from './devices';

type View = 'home' | RoomId;
type SceneId = 'home' | 'evening' | 'away';
const VIEWS: View[] = ['home', ...ROOM_PLAN.map(r => r.id)];
const isRoom = (value: string | null): value is RoomId => ROOM_PLAN.some(r => r.id === value);
const HELP = 'Try “lights off”, “dim the bedroom to 30 percent”, “AC off”, “go to the kitchen” or “away mode”.';
const SCENES: { id: SceneId; name: string; detail: string; icon: typeof Sun }[] = [
 { id: 'home', name: 'Home', detail: 'Lights at 80%, TV on, curtains open', icon: Sun },
 { id: 'evening', name: 'Evening', detail: 'Lights dimmed to 30%, curtains drawn', icon: Moon },
 { id: 'away', name: 'Away', detail: 'Lights, fans, AC and TV all off', icon: Power },
];
const ROOM_WORDS: [RegExp, RoomId][] = [[/\bbedroom\s*(2|two)\b|\bguest\b|\bstudy\b/i, 'bedroom2'], [/\bbedroom\b/i, 'bedroom'], [/\bliving\b|\blounge\b/i, 'living'], [/\bkitchen\b/i, 'kitchen'], [/\bbath(room)?\b/i, 'bath']];

type Alert = { id: string; urgent: boolean; title: string; body: string; slot: string };
function alertsFor(state: ApartmentState, total: number): Alert[] {
 const list: Alert[] = [];
 for (const f of FITTINGS) {
  const p = fittedProduct(f.id, state);
  if (p.kind !== 'sensor' || !state.devices[p.id].triggered) continue;
  if (p.id === 'gas-leak-sensor') list.push({ id: p.id, urgent: true, title: 'Gas detected in the kitchen', body: 'Alert sent to every phone in the home.', slot: f.id });
  else if (p.id === 'smoke-detector') list.push({ id: p.id, urgent: true, title: 'Smoke detected in the kitchen', body: 'Alert sent to every phone in the home.', slot: f.id });
  else list.push({ id: p.id, urgent: false, title: `Movement in the ${ROOM_NAMES[p.room].toLowerCase()}`, body: `${roomPlan(p.room).circuit} switched on by itself.`, slot: f.id });
 }
 if (total > state.threshold) list.push({ id: 'threshold', urgent: true, title: 'Energy alert', body: `${total.toLocaleString('en-IN')} W is above your ${state.threshold.toLocaleString('en-IN')} W limit.`, slot: 'utility-meter' });
 return list;
}

export default function Experience() {
 const params = useSearchParams();
 const requested = params.get('device'), linked = requested ? installed(LEGACY_PRODUCTS[requested] ?? requested) : undefined, linkedRoom = params.get('room');
 const [state, dispatch] = useReducer(apartmentReducer, linked?.id, id => id ? apartmentReducer(initialApartmentState(), { type: 'select', id }) : initialApartmentState());
 const [view, setView] = useState<View>(() => linked?.room ?? (isRoom(linkedRoom) ? linkedRoom : 'home'));
 const [slot, setSlot] = useState<string | null>(linked?.slot ?? null), [tour, setTour] = useState<number | null>(null), [zoom, setZoom] = useState<RoomId | null>(null);
 const [input, setInput] = useState(''), [typing, setTyping] = useState(false);
 const [voiceState, setVoiceState] = useState<VoiceState>('ready'), [micOn, setMicOn] = useState(false), [notice, setNotice] = useState(() => UNFITTED_PRODUCTS.find(p => p.id === requested)?.reason ?? '');
 const reduced = useReducedMotion(), zoomTimer = useRef<number | undefined>(undefined), recognition = useRef<VoiceSession | null>(null);
 const { spoken, reply, welcomePending, announce, cancel, toggleSpoken, setReply, skipWelcome } = useSpeechFeedback(recognition, HELP);
 const usage = apartmentUsage(state), alerts = useMemo(() => alertsFor(state, usage.total), [state, usage.total]);
 const call = state.devices[state.variants['entry-doorbell']].call;

 // Leaving the overhead view pushes in toward the chosen room before the room itself appears.
 const go = useCallback((next: View, nextSlot: string | null = null) => {
  window.clearTimeout(zoomTimer.current); setSlot(nextSlot);
  if (view === 'home' && next !== 'home' && !reduced) { setZoom(next); zoomTimer.current = window.setTimeout(() => { setView(next); setZoom(null); }, 420); }
  else { setZoom(null); setView(next); }
 }, [view, reduced]);
 useEffect(() => () => window.clearTimeout(zoomTimer.current), []);
 const visit = useCallback((next: View) => { setTour(null); go(next); }, [go]);
 const toggleDevice = useCallback((id: string) => setSlot(current => current === id ? null : id), []);
 const openDevice = useCallback((id: string) => { const f = FITTINGS.find(x => x.id === id); if (f) go(f.room, id); }, [go]);
 const goTour = useCallback((index: number) => {
  const n = Math.max(0, Math.min(ROOM_TOUR.length - 1, index)), step = ROOM_TOUR[n];
  setTour(n); go(step.id === 'welcome' ? 'home' : step.stop, step.fitting ?? null);
 }, [go]);

 // Arrow keys walk between rooms; Escape steps back out. Sliders and text fields keep their own keys.
 useEffect(() => {
  const key = (e: KeyboardEvent) => {
   const el = e.target as HTMLElement;
   if (e.metaKey || e.ctrlKey || e.altKey || el.closest('input,textarea,select,[role=radiogroup]')) return;
   if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const i = VIEWS.indexOf(view) + (e.key === 'ArrowRight' ? 1 : -1); if (VIEWS[i]) { e.preventDefault(); visit(VIEWS[i]); } }
   else if (e.key === 'Escape') { if (slot) setSlot(null); else if (view !== 'home') visit('home'); }
  };
  window.addEventListener('keydown', key);
  return () => window.removeEventListener('keydown', key);
 }, [view, slot, visit]);

 // Fetch the other rooms once the first view has settled, unless the visitor asked to save data.
 useEffect(() => {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  const timer = window.setTimeout(() => { for (const s of Object.values(ROOM_SCENES)) for (const src of [s.lit, s.dark]) new Image().src = src; }, 1800);
  return () => window.clearTimeout(timer);
 }, []);

 const execute = useCallback((text: string) => {
  const current: RoomId = view === 'home' ? 'living' : view, command = parseSimulationCommand(normalizeRoomCommand(text));
  // A named room or circuit wins; otherwise a command means this room, or the whole home from the overhead view.
  const named = lightingCommandTarget(text, 'living') === lightingCommandTarget(text, 'kitchen'), target = named || view !== 'home' ? lightingCommandTarget(text, current) : 'all', all = target === 'all';
  const place = all ? 'All lights' : `${roomPlan(target).circuit} in the ${ROOM_NAMES[target].toLowerCase()}`;
  const destination = /\b(go to|show|open|take me|enter|walk)\b/i.test(text) ? ROOM_WORDS.find(([word]) => word.test(text))?.[1] : undefined;
  if (/\btour\b/i.test(text)) { goTour(0); announce('Starting the tour.'); }
  else if (/\b(whole home|overview|floor ?plan)\b/i.test(text)) { visit('home'); announce('Here is the whole home.'); }
  else if (command.type === 'focus') { openDevice(command.device === 'touch-panel' ? roomPlan(current).controller : command.device === 'ir-blaster' ? 'living-climate' : 'living-tv'); announce('Here it is.'); }
  else if (destination) { visit(destination); announce(`This is the ${ROOM_NAMES[destination].toLowerCase()}.`); }
  else if (command.type === 'lights') { dispatch(all ? { type: 'all-lights', on: command.on } : { type: 'room-lights', room: target, on: command.on }); announce(`${place} ${command.on ? 'on' : 'off'}.`); }
  else if (command.type === 'brightness') { dispatch(all ? { type: 'all-lights', on: command.value > 0, brightness: command.value } : { type: 'room-lights', room: target, on: command.value > 0, brightness: command.value }); announce(`${place} set to ${command.value} percent.`); }
  else if (command.type === 'climate') { dispatch({ type: 'climate', on: command.on }); announce(command.on ? 'The AC is on.' : 'The AC is off.'); }
  else if (command.type === 'standby') { dispatch({ type: 'tv', on: command.on }); announce(command.on ? 'The TV is on.' : 'The TV is off.'); }
  else if (command.type === 'scene') { const id = command.scene === 'movie' ? 'evening' : command.scene; dispatch({ type: 'scene', scene: id }); announce(id === 'away' ? 'Away mode. Lights, fans and appliances are off.' : id === 'evening' ? 'Evening. Lights dimmed, curtains closed.' : 'Welcome home.'); }
  else announce(HELP);
  setInput('');
 }, [announce, goTour, openDevice, view, visit]);
 const latestExecute = useRef(execute);
 useEffect(() => { latestExecute.current = execute; }, [execute]);

 // Voice stays off until the visitor turns it on; typed commands always work.
 useEffect(() => {
  const Constructor = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
  const controller = createVoiceSession(() => { if (!Constructor) throw Error('Unsupported'); return new Constructor(); }, {
   onEnabled: setMicOn,
   onState: (next, message) => { setVoiceState(next); if (message) setNotice(message); else if (next === 'listening') setNotice(''); },
   onTranscript: text => { if (parseSimulationCommand(normalizeRoomCommand(text)).type !== 'unknown') latestExecute.current(text); },
  });
  recognition.current = controller;
  const visibility = () => { if (document.hidden) { controller.pause('hidden'); cancel(true); } else controller.resume('hidden'); };
  document.addEventListener('visibilitychange', visibility);
  return () => { document.removeEventListener('visibilitychange', visibility); controller.dispose(); if (recognition.current === controller) recognition.current = null; cancel(false); };
 }, [cancel]);
 const toggleMic = () => {
  const controller = recognition.current; if (!controller) return;
  if (controller.isEnabled()) { controller.stop(); skipWelcome(); cancel(true); setNotice(''); setReply('Microphone is off. ' + HELP); }
  else { setNotice(''); if (welcomePending.current) { controller.pause('speech'); controller.start(); announce(WELCOME, true); } else controller.start(); }
 };

 const room = view === 'home' ? null : view, scene = room && ROOM_SCENES[room], plan = room && roomPlan(room), fittings = room ? FITTINGS.filter(f => f.room === room) : [];
 const step = tour === null ? null : ROOM_TOUR[tour];
 const caption = step ? { eyebrow: `Tour · ${tour! + 1} of ${ROOM_TOUR.length}`, title: step.title, body: step.description }
  : scene && plan ? { eyebrow: `${plan.circuit} · ${fittings.length} devices fitted`, title: scene.title, body: scene.intro }
  : { eyebrow: 'The Heseos Simulation', title: 'Step inside a connected home', body: `Five rooms on five lighting circuits, with ${FITTINGS.length} Heseos devices fitted. Choose a room to walk in, or change the whole home with one tap.` };
 const lit = ROOM_PLAN.filter(r => state.rooms[r.id].lights).length;

 return <section className="xp" data-view={room ? 'room' : 'home'} aria-label="The Heseos Simulation">
  <h1 className="sr-only">The Heseos Simulation</h1>
  <div className="xp-main">
   <div className="xp-view">
   <div className="xp-stage">
    {scene ? <RoomStage key={scene.room} scene={scene} state={state} selected={slot} onSelect={toggleDevice} /> : <HomeStage state={state} zoom={zoom} onEnter={visit} />}
    <div className="xp-bar">
     {room ? <button className="xp-chip" onClick={() => visit('home')}><ChevronLeft size={16} />Whole home</button> : <span className="xp-chip quiet"><i className="xp-live" />Apartment 2 · live</span>}
     <div className="xp-load" aria-live="polite"><Zap size={14} /><b className="tabular">{usage.total.toLocaleString('en-IN')} W</b><small>{lit} of 5 rooms lit</small></div>
    </div>
    {(alerts.length > 0 || call !== 'idle') && <div className="xp-alerts" role="status">
     {call !== 'idle' && <div className={'xp-call' + (call === 'ringing' ? ' ringing' : '')}>
      <img src="/media/experience/visitor.webp" alt="Doorbell camera: a courier holding a parcel" />
      <div><b>{call === 'ringing' ? 'Someone is at the door' : 'Talking to your visitor'}</b><small>Hall doorbell · illustrative camera view</small>
       <span>{call === 'ringing' && <button className="answer" onClick={() => dispatch({ type: 'call', id: state.variants['entry-doorbell'], call: 'connected' })}><Phone size={14} />Answer</button>}<button onClick={() => dispatch({ type: 'call', id: state.variants['entry-doorbell'], call: 'idle' })}><PhoneOff size={14} />{call === 'ringing' ? 'Ignore' : 'End call'}</button></span>
      </div>
     </div>}
     {alerts.map(a => <button key={a.id} className={'xp-alert' + (a.urgent ? ' urgent' : '')} onClick={() => openDevice(a.slot)}><i /><span><b>{a.title}</b><small>{a.body}</small></span></button>)}
    </div>}
   </div>
   <div className="xp-caption" key={`caption-${step ? step.id : view}`}>
    <div className="xp-caption-text"><span>{caption.eyebrow}</span><h2>{caption.title}</h2><p>{caption.body}</p></div>
    {step ? <div className="xp-caption-actions">
     <button className="xp-btn" disabled={tour === 0} onClick={() => goTour(tour! - 1)} aria-label="Previous stop"><ArrowLeft size={16} /></button>
     {tour! < ROOM_TOUR.length - 1 ? <button className="xp-btn primary" onClick={() => goTour(tour! + 1)}>Next<ArrowRight size={16} /></button> : <button className="xp-btn primary" onClick={() => visit('home')}>Finish</button>}
     <button className="xp-btn ghost" onClick={() => setTour(null)}><X size={15} />Exit tour</button>
     <div className="xp-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(tour! + 1) / ROOM_TOUR.length})` }} /></div>
    </div> : <div className="xp-caption-actions">
     {room && <button className="xp-btn" onClick={() => visit(VIEWS[VIEWS.indexOf(room) - 1])} aria-label="Previous room"><ArrowLeft size={16} /></button>}
     {room && VIEWS[VIEWS.indexOf(room) + 1] && <button className="xp-btn" onClick={() => visit(VIEWS[VIEWS.indexOf(room) + 1])}>{ROOM_NAMES[VIEWS[VIEWS.indexOf(room) + 1] as RoomId]}<ArrowRight size={16} /></button>}
     <button className={'xp-btn' + (room ? '' : ' primary')} onClick={() => goTour(0)}><Play size={15} />{room ? 'Tour' : 'Take the tour'}</button>
    </div>}
   </div>
   </div>
   <div className="xp-dock">
    <nav className="xp-rail" aria-label="Rooms">
     <button className="xp-rail-item" aria-current={!room ? 'page' : undefined} onClick={() => visit('home')}><span className="xp-rail-thumb"><img src="/media/experience/home-thumb.webp" alt="" /><House size={16} /></span><b>Whole home</b></button>
     {ROOM_PLAN.map(r => <button key={r.id} className={'xp-rail-item' + (state.rooms[r.id].lights ? ' lit' : '')} aria-current={room === r.id ? 'page' : undefined} onClick={() => visit(r.id)}><span className="xp-rail-thumb"><img src={ROOM_SCENES[r.id].thumb} alt="" /><i /></span><b>{r.name}</b></button>)}
     <button className={'xp-rail-ask' + (typing ? ' active' : '')} aria-expanded={typing} aria-label="Type or speak a command" onClick={() => setTyping(v => !v)}><Keyboard size={18} /></button>
    </nav>
    <div className={'xp-ask' + (typing ? ' open' : '')}>
     <form className="xp-command" onSubmit={e => { e.preventDefault(); if (input.trim()) execute(input); }}>
      <label className="sr-only" htmlFor="xp-command">Type a command</label>
      <input id="xp-command" value={input} onChange={e => setInput(e.target.value)} placeholder={room ? `“Lights off” in the ${ROOM_NAMES[room].toLowerCase()}` : '“Away mode” or “go to the kitchen”'} autoComplete="off" enterKeyHint="send" />
      <button type="submit" aria-label="Send command" disabled={!input.trim()}><Send size={16} /></button>
      <button type="button" className={micOn ? 'on' : ''} aria-label={micOn ? 'Turn voice off' : 'Turn voice on'} aria-pressed={micOn} aria-busy={voiceState === 'starting' || voiceState === 'processing'} onClick={toggleMic}>{micOn ? <Mic size={16} /> : <MicOff size={16} />}</button>
      <button type="button" aria-label={spoken ? 'Mute spoken replies' : 'Unmute spoken replies'} aria-pressed={spoken} disabled={!micOn} onClick={toggleSpoken}>{spoken ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
     </form>
     <p className="xp-reply" role="status">{notice || reply}</p>
    </div>
   </div>
  </div>

  <aside className="xp-panel" aria-label={room ? `${ROOM_NAMES[room]} devices` : 'Whole-home controls'}>
   <header className="xp-panel-head">
    <div><span>{room && plan ? `${plan.circuit} · ${fittings.length} devices` : `${FITTINGS.length} devices · 5 circuits`}</span><h2>{room ? ROOM_NAMES[room] : 'Whole home'}</h2></div>
    <div className="xp-panel-load"><b className="tabular">{usage.total.toLocaleString('en-IN')}<small> W</small></b><span>Live load</span><i style={{ transform: `scaleX(${Math.min(1, usage.total / 2000)})` }} /></div>
   </header>
   <div className="xp-scenes" role="group" aria-label="Whole-home scenes">
    {SCENES.map(s => <button key={s.id} aria-pressed={state.scene === s.id} onClick={() => dispatch({ type: 'scene', scene: s.id })}><s.icon size={17} /><b>{s.name}</b><small>{s.detail}</small></button>)}
   </div>

   {room ? <div className="xp-list">
    <p className="xp-list-title">Fitted in this room<small>Tap a marker in the picture, or a device here</small></p>
    {fittings.map(f => <DeviceCard key={f.id} fitting={f} state={state} open={slot === f.id} dispatch={dispatch} onToggle={toggleDevice} />)}
   </div> : <>
    <div className="xp-list">
     <p className="xp-list-title">Rooms<small>Each switch changes its own room, and nothing else</small></p>
     {ROOM_PLAN.map(r => {
      const Icon = ROOM_ICONS[r.id], s = state.rooms[r.id];
      return <article key={r.id} className="xp-device xp-roomrow">
       <div className="xp-device-row">
        <button className="xp-device-main" onClick={() => visit(r.id)}><span className={'xp-device-icon' + (s.lights ? ' on' : '')}><Icon size={17} /></span><span className="xp-device-text"><b>{r.name}</b><small>{r.circuit} · {s.lights ? `On at ${s.brightness}%` : 'Off'}</small></span><ChevronRight size={16} className="xp-device-chevron" /></button>
        <Toggle on={s.lights} label={`${r.circuit}, ${r.name}`} onChange={() => dispatch({ type: 'room-lights', room: r.id, on: !s.lights })} />
       </div>
       <Slider label={`${r.circuit} brightness`} value={s.lights ? s.brightness : 0} min={0} max={100} step={5} unit="%" onChange={value => dispatch({ type: 'room-lights', room: r.id, on: value > 0, brightness: value })} />
      </article>;
     })}
    </div>
    <div className="xp-energy">
     <p className="xp-list-title">Where the power goes<small>Illustrative loads, updated as you switch things</small></p>
     {([['Air conditioning', usage.climate], ['Lighting', usage.lighting], ['TV and set-top box', usage.tv], ['Fans', usage.fans]] as const).map(([name, watts]) => <div key={name} className="xp-energy-row"><span>{name}</span><b className="tabular">{watts.toLocaleString('en-IN')} W</b><i><em style={{ transform: `scaleX(${usage.total ? watts / Math.max(usage.total, 1) : 0})` }} /></i></div>)}
    </div>
   </>}
  </aside>
 </section>;
}
