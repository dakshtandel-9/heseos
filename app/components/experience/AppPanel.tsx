'use client';
import { useEffect, useRef, useState, type CSSProperties, type Dispatch, type ReactNode } from 'react';
import { AlarmClock, ArrowLeft, Bell, Box, Circle, ChevronLeft, ChevronRight, CircleHelp, CircleUser, CloudOff, Cpu, Fan, GitBranch, Grip, House, Languages, LayoutGrid, LifeBuoy, Lightbulb, Lock, LockOpen, LogIn, LogOut, Menu, Mic, Minus, Monitor, Pause, Play, Plus, Power, Satellite, Settings, Snowflake, Square, Thermometer, Tv, Undo2, Volume2, VolumeX, Zap, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { FITTINGS, ROOM_PLAN, ROOM_NAMES, apartmentUsage, fittedProduct, isLight, isRoomControl, productStatus, type ApartmentAction, type ApartmentState, type RoomId } from '../../../lib/simulation-products';
import SiteLink from '../site/SiteLink';
import { deviceActive, deviceAlert, deviceGlyph, quickAction } from './devices';

type Tab = 'home' | 'devices' | 'automations' | 'remotes' | 'settings';
type RemoteId = 'tv' | 'dth' | 'ac';
type Slide = { label: string; value: number; min: number; max: number; step: number; unit: string; set: (v: number) => void };
type Shortcut = { id: string; name: string; place: string; icon: LucideIcon; on: boolean; badge?: string; toggle: () => void; slide?: Slide };
type Props = { state: ApartmentState; dispatch: Dispatch<ApartmentAction>; alerts: { id: string; title: string; body: string }[]; view: 'home' | RoomId; selected: string | null; onVisit: (v: 'home' | RoomId) => void };

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [{ id: 'home', label: 'Home', icon: House }, { id: 'devices', label: 'Devices', icon: Box }, { id: 'automations', label: 'Automations', icon: GitBranch }, { id: 'remotes', label: 'Remotes', icon: Monitor }, { id: 'settings', label: 'Settings', icon: Settings }];
const TITLES: Record<Tab, string> = { home: 'Smart Home', devices: 'Devices', automations: 'Automations', remotes: 'Remotes', settings: 'Settings' };
const BASE_KWH = [.15, .12, .12, .12, .11, .11, .11, .11, .1, .03, .05, .14, .17, .14, .2, .25, .1];
const MODES = ['COOL', 'DRY', 'FAN'], AC_SPEEDS = ['AUTO', 'LOW', 'MED', 'HIGH'];
const SCENE_TILES = [{ id: 'home', name: 'Home', n: 10 }, { id: 'evening', name: 'Evening', n: 9 }, { id: 'away', name: 'Away', n: 10 }] as const;
const fmt = (n: number) => n.toLocaleString('en-IN');
const PHONE_W = 414, PHONE_H = 868;

function Range({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
 return <label className="ha-range"><span>{label}<b>{value}{unit}</b></span><input type="range" min={min} max={max} step={step} value={value} style={{ '--fill': `${(value - min) / (max - min) * 100}%` } as CSSProperties} onChange={e => onChange(Number(e.target.value))} /></label>;
}
function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
 return <button className="ha-switch" role="switch" aria-checked={on} aria-label={label} onClick={onChange}><i /></button>;
}

// Hold a shortcut to get the tall dimmer, like the real app.
function VSlider({ icon: Icon, slide, title, onClose }: { icon: LucideIcon; slide: Slide; title: string; onClose: () => void }) {
 const ref = useRef<HTMLDivElement>(null), pct = (slide.value - slide.min) / (slide.max - slide.min) * 100;
 const set = (y: number) => { const b = ref.current!.getBoundingClientRect(), p = 1 - Math.min(1, Math.max(0, (y - b.top) / b.height)); slide.set(Math.round((slide.min + p * (slide.max - slide.min)) / slide.step) * slide.step); };
 useEffect(() => { const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }; window.addEventListener('keydown', esc, true); return () => window.removeEventListener('keydown', esc, true); }, [onClose]);
 return <div className="ha-sheet" onClick={onClose}>
  <p className="ha-sheet-title">{title}<b>{slide.value}{slide.unit}</b></p>
  <div ref={ref} className="ha-vslider" role="slider" tabIndex={0} aria-label={`${title} ${slide.label}`} aria-valuemin={slide.min} aria-valuemax={slide.max} aria-valuenow={slide.value} autoFocus
   onClick={e => e.stopPropagation()} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); set(e.clientY); }} onPointerMove={e => { if (e.buttons) set(e.clientY); }}
   onKeyDown={e => { const d = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); slide.set(Math.max(slide.min, Math.min(slide.max, slide.value + d * slide.step))); } }}>
   <i style={{ height: `${pct}%` }} /><Icon size={22} />
  </div>
  <small>Tap outside to close</small>
 </div>;
}

function PowerChart({ kw }: { kw: number }) {
 const data = [...BASE_KWH, kw], top = Math.max(1, Math.ceil(Math.max(...data) * 2) / 2), W = 300, H = 104, x = (i: number) => 34 + i * (W - 40) / (data.length - 1), y = (v: number) => 8 + (1 - v / top) * (H - 14);
 const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(''), area = `${line}L${x(data.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z`;
 return <svg className="ha-chart" viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={`Power consumption today, now ${kw.toFixed(2)} units per hour`}>
  <defs><linearGradient id="ha-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fb9300" stopOpacity=".4" /><stop offset="1" stopColor="#fb9300" stopOpacity="0" /></linearGradient></defs>
  {[0, top / 2, top].map(t => <g key={t}><text x="0" y={y(t) + 4} className="ha-axis">{t}</text></g>)}
  <path d={area} fill="url(#ha-fill)" /><path d={line} fill="none" stroke="#fb9300" strokeWidth="1.5" strokeLinejoin="round" />
  {['12 AM', '4 AM', '8 AM', '12 PM', '4 PM'].map((t, i) => <text key={t} x={x(i * 4)} y={H + 12} textAnchor="middle" className="ha-axis">{t}</text>)}
 </svg>;
}

function DeviceRow({ fitting, state, dispatch, highlight }: { fitting: (typeof FITTINGS)[number]; state: ApartmentState; dispatch: Dispatch<ApartmentAction>; highlight: boolean }) {
 const row = useRef<HTMLElement>(null), [seenHi, setSeenHi] = useState(highlight);
 const [open, setOpen] = useState(highlight), p = fittedProduct(fitting.id, state), quick = quickAction(p, state), alert = deviceAlert(p, state), room = state.rooms[p.room];
 const expandable = isRoomControl(p) || isLight(p) || ['fan', 'ir', 'curtain', 'meter'].includes(p.kind);
 if (seenHi !== highlight) { setSeenHi(highlight); if (highlight) setOpen(true); }
 useEffect(() => { if (highlight) row.current?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [highlight]);
 return <article ref={row} className={'ha-row' + (alert ? ' alert' : '') + (highlight ? ' hi' : '')}>
  <div className="ha-row-top">
   <button className="ha-row-main" aria-expanded={expandable ? open : undefined} onClick={() => expandable && setOpen(o => !o)}>
    <span className={'ha-ico' + (deviceActive(p, state) ? ' on' : '')}>{deviceGlyph(p, state, 18)}</span>
    <span className="ha-row-text"><b>{fitting.label}</b><small>{productStatus(p, state)}</small></span>
    {expandable && (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
   </button>
   {quick && <Switch on={quick.on} label={quick.label} onChange={() => dispatch(quick.action)} />}
  </div>
  {open && <div className="ha-row-body">
   {(isRoomControl(p) || isLight(p)) && <Range label="Brightness" value={room.lights ? room.brightness : 0} min={0} max={100} step={5} unit="%" onChange={v => dispatch({ type: 'room-lights', room: p.room, on: v > 0, brightness: v })} />}
   {isLight(p) && <Range label="Colour" value={room.kelvin} min={2700} max={6500} step={100} unit=" K" onChange={v => dispatch({ type: 'kelvin', id: p.id, value: v })} />}
   {p.kind === 'fan' && <div className="ha-steps" role="radiogroup" aria-label="Fan speed">{[0, 1, 2, 3, 4, 5].map(s => <button key={s} role="radio" aria-checked={room.fanSpeed === s} onClick={() => dispatch({ type: 'fan', room: p.room, speed: s })}>{s || 'Off'}</button>)}</div>}
   {p.kind === 'ir' && <Range label="Temperature" value={state.temperature} min={16} max={30} unit="°C" onChange={v => dispatch({ type: 'temperature', value: v })} />}
   {p.kind === 'curtain' && <Range label="Open" value={state.curtain} min={0} max={100} step={5} unit="%" onChange={v => dispatch({ type: 'curtain', value: v })} />}
   {p.kind === 'meter' && <Range label="Alert above" value={state.threshold} min={100} max={4000} step={100} unit=" W" onChange={v => dispatch({ type: 'threshold', value: v })} />}
  </div>}
 </article>;
}

export default function AppPanel({ state, dispatch, alerts, view, selected, onVisit }: Props) {
 const [tab, setTab] = useState<Tab>(view === 'home' ? 'home' : 'devices'), [room, setRoom] = useState<RoomId | null>(view === 'home' ? null : view), [remote, setRemote] = useState<RemoteId | null>(null), [autoTab, setAutoTab] = useState<'scenes' | 'automations'>('scenes');
 const [sheet, setSheet] = useState<string | null>(null), [toast, setToast] = useState(''), [rm, setRm] = useState({ ch: 12, vol: 20, mute: false, dth: true, mode: 0, speed: 0 });
 const hold = useRef<{ timer?: number; fired?: boolean }>({}), usage = apartmentUsage(state), r = state.rooms;
 const say = (text: string) => setToast(text);
 const panel = useRef<HTMLElement>(null), phone = useRef<HTMLDivElement>(null);
 // The phone is drawn at real size (390 × 844 screen) and zoomed to fit whatever room the column has.
 useEffect(() => {
  const el = panel.current, ph = phone.current; if (!el || !ph) return;
  const fit = () => { const cs = getComputedStyle(el), w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); ph.style.zoom = String(Math.max(.5, Math.min(1, w / PHONE_W, h / PHONE_H))); };
  const ro = new ResizeObserver(fit); ro.observe(el); fit();
  return () => ro.disconnect();
 }, []);
 useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 1800); return () => window.clearTimeout(t); }, [toast]);
 // The picture and the app stay in step: choosing a room on the left opens it here.
 const [seen, setSeen] = useState(view);
 // A marker tapped in the picture opens that room's device list here.
 const [seenSel, setSeenSel] = useState(selected);
 if (seenSel !== selected) { setSeenSel(selected); const f = selected ? FITTINGS.find(x => x.id === selected) : undefined; if (f) { setRoom(f.room); setTab('devices'); setRemote(null); setSheet(null); } }
 if (seen !== view) { setSeen(view); if (view === 'home') setRoom(null); else { setRoom(view); setTab('devices'); setRemote(null); } }
 const go = (next: Tab) => { setTab(next); setRemote(null); setSheet(null); if (next !== 'devices') setRoom(null); };
 const openRoom = (id: RoomId | null) => { setRoom(id); onVisit(id ?? 'home'); };

 const rooms = (id: RoomId) => FITTINGS.filter(f => f.room === id).map(f => fittedProduct(f.id, state));
 const roomOn = (id: RoomId) => rooms(id).filter(p => deviceActive(p, state)).length;
 const lightRoom = (id: RoomId): Shortcut => ({ id: 'light-' + id, name: 'Ceiling Light', place: ROOM_NAMES[id], icon: Lightbulb, on: r[id].lights, toggle: () => dispatch({ type: 'room-lights', room: id, on: !r[id].lights }), slide: { label: 'Brightness', value: r[id].lights ? r[id].brightness : 0, min: 0, max: 100, step: 5, unit: '%', set: v => dispatch({ type: 'room-lights', room: id, on: v > 0, brightness: v }) } });
 const fanRoom = (id: RoomId): Shortcut => ({ id: 'fan-' + id, name: 'Fan', place: ROOM_NAMES[id], icon: Fan, on: r[id].fanSpeed > 0, badge: r[id].fanSpeed > 0 ? String(r[id].fanSpeed) : undefined, toggle: () => dispatch({ type: 'fan', room: id, speed: r[id].fanSpeed > 0 ? 0 : 3 }), slide: { label: 'Speed', value: r[id].fanSpeed, min: 0, max: 5, step: 1, unit: '/5', set: v => dispatch({ type: 'fan', room: id, speed: v }) } });
 const shortcuts: Shortcut[] = [
  { id: 'tv', name: 'TV', place: 'Living room', icon: Tv, on: state.tv, toggle: () => dispatch({ type: 'tv', on: !state.tv }) }, fanRoom('living'), lightRoom('living'), lightRoom('bedroom'), fanRoom('bedroom'),
  { id: 'ac', name: 'AC', place: 'Living room', icon: Snowflake, on: state.climate, toggle: () => dispatch({ type: 'climate', on: !state.climate }), slide: { label: 'Temperature', value: state.temperature, min: 16, max: 30, step: 1, unit: '°C', set: v => dispatch({ type: 'temperature', value: v }) } },
 ];
 const pressProps = (s: Shortcut) => ({
  onPointerDown: () => { hold.current.fired = false; if (s.slide) hold.current.timer = window.setTimeout(() => { hold.current.fired = true; setSheet(s.id); }, 450); },
  onPointerUp: () => window.clearTimeout(hold.current.timer), onPointerLeave: () => window.clearTimeout(hold.current.timer), onPointerCancel: () => window.clearTimeout(hold.current.timer),
  onClick: () => { if (hold.current.fired) { hold.current.fired = false; return; } s.toggle(); },
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  onKeyDown: (e: React.KeyboardEvent) => { if (s.slide && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); setSheet(s.id); } },
 });
 const sheetItem = sheet ? shortcuts.find(s => s.id === sheet) : undefined;

 const onCount = ROOM_PLAN.filter(x => r[x.id].lights).length + ROOM_PLAN.filter(x => r[x.id].fanSpeed > 0).length + (state.tv ? 1 : 0) + (state.climate ? 1 : 0), total = 10;
 const bell = <button className="ha-icon-btn" aria-label={alerts.length ? `${alerts.length} notifications` : 'Notifications'} onClick={() => say(alerts[0] ? `${alerts[0].title}. ${alerts[0].body}` : 'No new notifications.')}><Bell size={22} />{alerts.length > 0 && <em>{alerts.length}</em>}</button>;
 const door = fittedProduct('bedroom-lock', state), doorLocked = state.devices[door.id].locked, sceneCount = (id: string) => state.scene === id;

 const homeScreen = <>
  <section className="ha-card ha-power"><div className="ha-power-head"><div><h3>Today’s Power Consumption</h3><p><Zap size={15} />{(BASE_KWH.reduce((a, b) => a + b, 0) + usage.total / 1000).toFixed(2)} units</p></div><span>All devices</span></div><PowerChart kw={usage.total / 1000} /></section>
  <div className="ha-stats"><div><WifiOffIcon /><b>0</b><span>Unreachable</span></div><div><Lightbulb size={26} className="on" /><b>{onCount}</b><span>Turned On</span></div><div><Lightbulb size={26} /><b>{total - onCount}</b><span>Turned Off</span></div></div>
  <h3 className="ha-h">Scene Shortcuts</h3>
  <div className="ha-scenes">{SCENE_TILES.map(s => <button key={s.id} aria-pressed={sceneCount(s.id)} onClick={() => { dispatch({ type: 'scene', scene: s.id }); say(`${s.name} scene on.`); }}><Lightbulb size={18} /><b>{s.n}</b><span>{s.name}</span></button>)}</div>
  <h3 className="ha-h">Switch Shortcuts<small>Hold to adjust</small></h3>
  <div className="ha-shortcuts">{shortcuts.map(s => <button key={s.id} className={s.on ? 'on' : ''} aria-pressed={s.on} aria-label={`${s.name}, ${s.place}`} {...pressProps(s)}><s.icon size={26} />{s.badge && <em><Fan size={12} />{s.badge}</em>}<b>{s.name}</b><span>{s.place}</span></button>)}</div>
 </>;

 const allOn = ROOM_PLAN.some(x => r[x.id].lights);
 const devicesScreen = room ? <>
  <section className="ha-hero"><div className={'ha-orb' + (r[room].lights ? ' on' : '')}><b>{r[room].lights ? r[room].brightness : 0}<small>%</small></b><i /></div><div><h3>{ROOM_NAMES[room]}</h3><p>{ROOM_PLAN.find(x => x.id === room)!.circuit} · {roomOn(room)} of {rooms(room).length} devices on</p></div><Switch on={r[room].lights} label={`${ROOM_NAMES[room]} lights`} onChange={() => dispatch({ type: 'room-lights', room, on: !r[room].lights })} /></section>
  <h3 className="ha-h">Devices in this room</h3>
  <div className="ha-rows">{FITTINGS.filter(f => f.room === room).map(f => <DeviceRow key={f.id} fitting={f} state={state} dispatch={dispatch} highlight={selected === f.id} />)}</div>
 </> : <>
  <div className="ha-rooms">{ROOM_PLAN.map(x => <article key={x.id} className="ha-room"><button className="ha-room-main" aria-label={`Open ${x.name}`} onClick={() => openRoom(x.id)}><span className="ha-orb-sm"><b>{roomOn(x.id)}</b><i /></span><h4>{x.name}</h4></button><div className="ha-room-foot"><span><i className="k" />{rooms(x.id).length}</span><span><i className="a" />{roomOn(x.id)}</span><button className={'ha-pwr' + (r[x.id].lights ? ' on' : '')} aria-pressed={r[x.id].lights} aria-label={`${x.name} lights`} onClick={() => dispatch({ type: 'room-lights', room: x.id, on: !r[x.id].lights })}><Power size={22} /></button></div></article>)}</div>
 </>;

 const runScene = (name: string, run: () => void) => { run(); say(`${name} started.`); };
 const automations: { id: string; title: string; text: string; slot: string; kind: 'sensor' | 'call' }[] = [
  { id: 'living-motion', title: 'Movement in the living room', text: 'Then Light 1 switches on', slot: 'living-motion', kind: 'sensor' },
  { id: 'bedroom-presence', title: 'Someone in the bedroom', text: 'Then Light 3 switches on', slot: 'bedroom-presence', kind: 'sensor' },
  { id: 'kitchen-gas', title: 'Gas detected in the kitchen', text: 'Then every phone gets an alert', slot: 'kitchen-gas', kind: 'sensor' },
  { id: 'kitchen-smoke', title: 'Smoke in the kitchen', text: 'Then every phone gets an alert', slot: 'kitchen-smoke', kind: 'sensor' },
  { id: 'entry-doorbell', title: 'Doorbell pressed', text: 'Then the living-room monitor rings', slot: 'entry-doorbell', kind: 'call' },
 ];
 const automationsScreen = <>
  <div className="ha-tabs" role="tablist">{(['scenes', 'automations'] as const).map(t => <button key={t} role="tab" aria-selected={autoTab === t} onClick={() => setAutoTab(t)}>{t}</button>)}</div>
  {autoTab === 'scenes' ? <>
   <h3 className="ha-h">Routines</h3>
   <div className="ha-routines">{[['Good Morning', '7:45 AM', 'home'], ['My Evening Scene', '7:30 PM', 'evening']].map(([name, time, id]) => <button key={name} className={state.scene === id ? 'on' : ''} onClick={() => { dispatch({ type: 'scene', scene: id as 'home' | 'evening' }); say(`${name} ran.`); }}><i><em /></i><b>{name}</b><span>{time}</span><Lightbulb size={17} /></button>)}</div>
   <h3 className="ha-h">Scenes</h3>
   <div className="ha-tiles">
    {SCENE_TILES.map(s => <button key={s.id} className={state.scene === s.id ? 'on' : ''} onClick={() => { dispatch({ type: 'scene', scene: s.id }); say(`${s.name} scene on.`); }}><Lightbulb size={18} /><b>{s.n}</b><span>{s.name}</span></button>)}
    <button onClick={() => runScene('Home theatre', () => { dispatch({ type: 'all-lights', on: true, brightness: 20 }); dispatch({ type: 'tv', on: true }); dispatch({ type: 'curtain', value: 0 }); })}><Lightbulb size={18} /><b>8</b><span>Start Home Theatre</span></button>
    <button onClick={() => runScene('Home theatre stopped,', () => { dispatch({ type: 'scene', scene: 'home' }); })}><Lightbulb size={18} /><b>5</b><span>Stop Home Theatre</span></button>
   </div>
  </> : <div className="ha-rows">{automations.map(a => { const p = fittedProduct(a.slot, state), q = quickAction(p, state); return <article key={a.id} className={'ha-row' + (deviceAlert(p, state) ? ' alert' : '')}><div className="ha-row-top"><div className="ha-row-main"><span className={'ha-ico' + (q?.on ? ' on' : '')}>{deviceGlyph(p, state, 18)}</span><span className="ha-row-text"><b>{a.title}</b><small>{q?.on ? 'Triggered · ' : ''}{a.text}</small></span></div>{q && <button className="ha-run" onClick={() => dispatch(q.action)}>{q.on ? 'Reset' : 'Test'}</button>}</div></article>; })}</div>}
 </>;

 const ping = (label: string, needsTv = true) => { if (needsTv && !state.tv) say('The TV is off. Press power first.'); else say(label); };
 const key = (label: string, children: ReactNode, onClick?: () => void, cls = '') => <button key={label} className={'ha-key ' + cls} aria-label={label} onClick={onClick ?? (() => ping(`${label} sent`))}>{children}</button>;
 const tvScreen = <>
  <p className="ha-status">{state.tv ? `On · Ch ${rm.ch} · ${rm.mute ? 'Muted' : `Vol ${rm.vol}`}` : 'TV is off'}</p>
  <div className="ha-keys">{key('Power', <Power size={26} />, () => dispatch({ type: 'tv', on: !state.tv }))}{key('Input', <LogIn size={24} />)}{key('Menu', <Menu size={26} />)}{key('Exit', <LogOut size={24} />)}{key('Numbers', <Grip size={24} />)}{key('Back', <Undo2 size={24} />)}</div>
  <div className="ha-rbody">
   <div className="ha-rocker"><button aria-label="Channel up" onClick={() => { setRm(v => ({ ...v, ch: v.ch + 1 })); ping('Channel up'); }}><Plus size={18} /></button><span>Ch</span><button aria-label="Channel down" onClick={() => { setRm(v => ({ ...v, ch: Math.max(1, v.ch - 1) })); ping('Channel down'); }}><Minus size={18} /></button></div>
   <button className="ha-round" aria-label="Mute" aria-pressed={rm.mute} onClick={() => { setRm(v => ({ ...v, mute: !v.mute })); ping(rm.mute ? 'Sound on' : 'Muted'); }}>{rm.mute ? <VolumeX size={22} /> : <Volume2 size={22} />}</button>
   <div className="ha-rocker"><button aria-label="Volume up" onClick={() => { setRm(v => ({ ...v, vol: Math.min(100, v.vol + 5), mute: false })); ping('Volume up'); }}><Plus size={18} /></button><span>Vol</span><button aria-label="Volume down" onClick={() => { setRm(v => ({ ...v, vol: Math.max(0, v.vol - 5) })); ping('Volume down'); }}><Minus size={18} /></button></div>
  </div>
  <div className="ha-dpad"><i />{[['Up', 'u', ChevronUp], ['Left', 'l', ChevronLeft], ['Right', 'r', ChevronRight], ['Down', 'd', ChevronDown]].map(([l, c, I]) => { const Icon = I as LucideIcon; return <button key={l as string} className={c as string} aria-label={l as string} onClick={() => ping(`${l} sent`)}><Icon size={34} strokeWidth={3} /></button>; })}<button className="ok" onClick={() => ping('OK sent')}>OK</button></div>
 </>;
 const dthScreen = <>
  <p className="ha-status">{rm.dth ? 'Set-top box on' : 'Set-top box off'} · TV {state.tv ? 'on' : 'off'}</p>
  <div className="ha-dth-top"><button className="red" aria-label="Set-top box power" onClick={() => { setRm(v => ({ ...v, dth: !v.dth })); say(rm.dth ? 'Set-top box off.' : 'Set-top box on.'); }}><Power size={22} /></button><button aria-label="Mute" onClick={() => ping('Mute sent', false)}><VolumeX size={22} /></button><button className="red" onClick={() => dispatch({ type: 'tv', on: !state.tv })}><Power size={22} />TV</button></div>
  <div className="ha-dpad dth"><i />{[['Vol +', 'vp'], ['CH +', 'cp'], ['Vol −', 'vm'], ['CH −', 'cm']].map(([l, c]) => <button key={c} className={c} onClick={() => ping(`${l} sent`, false)}>{l}</button>)}{[['Up', 'u', ChevronUp], ['Left', 'l', ChevronLeft], ['Right', 'r', ChevronRight], ['Down', 'd', ChevronDown]].map(([l, c, I]) => { const Icon = I as LucideIcon; return <button key={l as string} className={c as string} aria-label={l as string} onClick={() => ping(`${l} sent`, false)}><Icon size={30} strokeWidth={3} /></button>; })}<button className="ok" onClick={() => ping('OK sent', false)}>OK</button></div>
  <button className="ha-wide" aria-label="Numbers" onClick={() => ping('Number pad opened', false)}><Grip size={24} /></button>
  <div className="ha-media">{[['Record', <Circle key="r" size={22} fill="#f33" color="#f33" />], ['Play', <Play key="p" size={22} fill="currentColor" />], ['Pause', <Pause key="u" size={22} fill="currentColor" />], ['Stop', <Square key="s" size={20} fill="currentColor" />]].map(([l, i]) => <button key={l as string} aria-label={l as string} onClick={() => ping(`${l} sent`, false)}>{i as ReactNode}</button>)}</div>
 </>;
 const acScreen = <>
  <div className="ha-ac"><svg viewBox="0 0 300 160" aria-hidden="true"><path d="M0 40C80 90 160 140 300 40M0 70C90 130 200 150 300 20" fill="none" stroke="#fb930066" /><path d="M0 100C100 150 220 130 300 70" fill="none" stroke="#fb930040" /></svg><div className={state.climate ? '' : 'off'}><b>{state.temperature}<sup>°C</sup></b><span>{state.climate ? <><Snowflake size={16} />{MODES[rm.mode]}</> : 'OFF'}</span></div><p>Speed<b>{AC_SPEEDS[rm.speed]}</b></p></div>
  <div className="ha-keys ac">
   <button className="g" aria-label="Power on" onClick={() => dispatch({ type: 'climate', on: true })}><Power size={28} /></button><button className="r" aria-label="Power off" onClick={() => dispatch({ type: 'climate', on: false })}><Power size={28} /></button><button onClick={() => { setRm(v => ({ ...v, mode: (v.mode + 1) % MODES.length })); say(`Mode ${MODES[(rm.mode + 1) % MODES.length].toLowerCase()}.`); }}>Mode</button>
   <div className="temp"><button aria-label="Lower temperature" onClick={() => dispatch({ type: 'temperature', value: state.temperature - 1 })}><Minus size={26} /></button><Thermometer size={26} /><button aria-label="Raise temperature" onClick={() => dispatch({ type: 'temperature', value: state.temperature + 1 })}><Plus size={26} /></button></div>
   <button aria-label="Fan speed" onClick={() => { setRm(v => ({ ...v, speed: (v.speed + 1) % AC_SPEEDS.length })); say(`Fan ${AC_SPEEDS[(rm.speed + 1) % AC_SPEEDS.length].toLowerCase()}.`); }}><Fan size={28} /></button>
  </div>
  <button className="ha-wide sched" onClick={() => say('Schedules are set in the Heseos app.')}><AlarmClock size={24} />Schedule</button>
 </>;
 const remotes: { id: RemoteId; name: string; place: string; icon: LucideIcon; on: boolean }[] = [{ id: 'tv', name: 'TV', place: 'Living room', icon: Tv, on: state.tv }, { id: 'dth', name: 'DTH', place: 'Set-top box', icon: Satellite, on: rm.dth }, { id: 'ac', name: 'AC', place: 'Living room', icon: Snowflake, on: state.climate }];
 const remotesScreen = remote ? ({ tv: tvScreen, dth: dthScreen, ac: acScreen })[remote] : <div className="ha-remotes">{remotes.map(x => <button key={x.id} onClick={() => setRemote(x.id)}><span className={'ha-ico' + (x.on ? ' on' : '')}><x.icon size={24} /></span><span className="ha-row-text"><b>{x.name}</b><small>{x.place} · {x.on ? 'On' : 'Off'}</small></span><ChevronRight size={18} /></button>)}</div>;

 const soon = (name: string) => () => say(`${name} lives in the full Heseos app.`);
 const group = (title: string, items: { label: string; icon: LucideIcon; run?: () => void; href?: string }[]) => <><h3 className="ha-section">{title}</h3><div className="ha-list">{items.map(i => { const body = <><i.icon size={26} strokeWidth={1.4} /><span>{i.label}</span><ChevronRight size={18} /></>; return i.href ? <SiteLink key={i.label} className="ha-item" href={i.href}>{body}</SiteLink> : <button key={i.label} className="ha-item" onClick={i.run}>{body}</button>; })}</div></>;
 const settingsScreen = <>
  <h2 className="ha-big">Smart Home</h2>
  {group('Homes and Devices Configuration', [{ label: 'Homes', icon: House, run: soon('Homes') }, { label: 'Rooms', icon: Box, run: () => go('devices') }, { label: 'Devices', icon: Cpu, run: () => go('devices') }, { label: 'Remotes', icon: Monitor, run: () => go('remotes') }, { label: 'Schedules/Routines', icon: Box, run: () => { go('automations'); } }])}
  {group('Support', [{ label: 'FAQ', icon: CircleHelp, href: '/support' }, { label: 'Support', icon: LifeBuoy, href: '/support' }])}
  {group('Other Options', [{ label: 'Widgets', icon: LayoutGrid, run: soon('Widgets') }, { label: 'Voice Control', icon: Mic, run: () => say('Tap the keyboard icon under the picture to type or speak.') }, { label: 'App Language', icon: Languages, run: soon('Languages') }])}
 </>;

 const fab = tab === 'home' ? <button className="ha-fab" aria-label={doorLocked ? 'Unlock bedroom door' : 'Lock bedroom door'} onClick={() => { dispatch({ type: 'lock', id: door.id, locked: !doorLocked }); say(doorLocked ? 'Bedroom door unlocked.' : 'Bedroom door locked.'); }}>{doorLocked ? <Lock size={26} /> : <LockOpen size={26} />}</button>
  : tab === 'devices' && !room ? <button className="ha-fab" aria-label={allOn ? 'Turn all lights off' : 'Turn all lights on'} onClick={() => { dispatch({ type: 'all-lights', on: !allOn }); say(allOn ? 'All lights off.' : 'All lights on.'); }}><Lightbulb size={26} /></button>
  : tab === 'automations' ? <button className="ha-fab" aria-label="New scene" onClick={() => say('New scenes are made in the Heseos app.')}><Plus size={30} /></button> : null;
 const screens: Record<Tab, ReactNode> = { home: homeScreen, devices: devicesScreen, automations: automationsScreen, remotes: remotesScreen, settings: settingsScreen };
 const title = tab === 'devices' && room ? ROOM_NAMES[room] : remote ? remotes.find(x => x.id === remote)!.name : TITLES[tab];
 const back = (tab === 'devices' && room) ? () => openRoom(null) : (tab === 'remotes' && remote) ? () => setRemote(null) : null;
 return <aside ref={panel} className="xp-panel xp-panel-app" aria-label="Heseos app on a phone">
  <div ref={phone} className="ha-phone">
  <i className="ha-btn action" /><i className="ha-btn vol-up" /><i className="ha-btn vol-down" /><i className="ha-btn power" />
  <div className="ha">
   <div className="ha-sbar" aria-hidden="true"><b>9:41</b><span className="ha-island" /><span className="ha-sbar-icons"><StatusIcons /></span></div>
   <div className="ha-head">{back ? <button className="ha-icon-btn" aria-label="Back" onClick={back}><ArrowLeft size={24} /></button> : null}<h2>{title}</h2>
    {tab === 'home' && <><button className="ha-icon-btn amber" aria-label="Add" onClick={() => say('Adding devices happens in the Heseos app.')}><Plus size={26} /></button>{bell}</>}
    {tab === 'devices' && !room && <><CloudOff size={24} className="ha-muted" aria-hidden="true" /><button className="ha-icon-btn amber" aria-label="Sort" onClick={() => say(`${fmt(FITTINGS.length)} devices across 5 rooms.`)}><Menu size={26} /></button>{bell}</>}
    {tab === 'devices' && room && bell}
    {tab === 'automations' && bell}
    {tab === 'settings' && <button className="ha-icon-btn amber" aria-label="Account" onClick={() => say('Demo account · nothing is saved.')}><CircleUser size={30} /></button>}
   </div>
   <div className={'ha-body' + (tab === 'settings' ? ' flush' : '')} key={`${tab}-${room}-${remote}-${autoTab}`}>{screens[tab]}</div>
   {sheetItem?.slide && <VSlider icon={sheetItem.icon} slide={sheetItem.slide} title={`${sheetItem.name} · ${sheetItem.place}`} onClose={() => setSheet(null)} />}
   {toast && <p className="ha-toast" role="status">{toast}</p>}
   <nav className="ha-tabbar" aria-label="App sections">{TABS.map(t => <button key={t.id} aria-current={tab === t.id ? 'page' : undefined} onClick={() => go(t.id)}><t.icon size={26} fill={tab === t.id ? 'currentColor' : 'none'} /><span>{t.label}</span></button>)}</nav>
   {fab}
   <span className="ha-homebar" aria-hidden="true" />
  </div>
  </div>
 </aside>;
}
function WifiOffIcon() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e5453b" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10.5" /><path d="M5.5 10a9 9 0 0 1 13 0M8 13a5.5 5.5 0 0 1 8 0M12 17h.01M4 4l16 16" /></svg>; }
function StatusIcons() {
 return <svg width="78" height="13" viewBox="0 0 78 13" fill="currentColor"><rect x="0" y="8" width="3.2" height="4.5" rx="1" /><rect x="4.8" y="5.8" width="3.2" height="6.7" rx="1" /><rect x="9.6" y="3.4" width="3.2" height="9.1" rx="1" /><rect x="14.4" y="1" width="3.2" height="11.5" rx="1" /><path d="M31 3.2a9.6 9.6 0 0 1 6.9 2.9l1.3-1.3A11.4 11.4 0 0 0 31 1.4a11.4 11.4 0 0 0-8.2 3.4l1.3 1.3A9.6 9.6 0 0 1 31 3.2Zm0 3.7a5.9 5.9 0 0 1 4.2 1.7l1.3-1.3A7.7 7.7 0 0 0 31 5.1a7.7 7.7 0 0 0-5.5 2.2l1.3 1.3A5.9 5.9 0 0 1 31 6.9Zm0 3.6 2-2a2.8 2.8 0 0 0-4 0l2 2Z" /><rect x="48.5" y=".8" width="24" height="11.4" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".4" /><rect x="50.5" y="2.8" width="17" height="7.4" rx="2" /><path d="M74 4.6v3.8c.8-.3 1.3-1 1.3-1.9s-.5-1.6-1.3-1.9Z" fillOpacity=".45" /></svg>;
}
