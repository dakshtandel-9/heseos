'use client';
import { useEffect, useRef, type Dispatch, type ReactNode } from 'react';
import { ArrowRight, BatteryCharging, ChevronDown, Lightbulb, Phone, Snowflake, Tv } from 'lucide-react';
import { FAMILIES, familyHref } from '../../../lib/products';
import { FITTINGS, ROOM_NAMES, apartmentUsage, fittedProduct, isLight, isRoomControl, productState, productStatus, roomPlan, type ApartmentAction, type ApartmentState } from '../../../lib/simulation-products';
import SiteLink from '../site/SiteLink';
import { deviceActive, deviceAlert, deviceGlyph, quickAction } from './devices';

type Fitting = (typeof FITTINGS)[number];
const family = (id: string) => FAMILIES.find(p => p.slug === id)!;

export function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
 return <button className="xp-toggle" role="switch" aria-checked={on} aria-label={label} onClick={onChange}><i /></button>;
}
function SwitchRow({ icon, title, detail, on, onChange }: { icon: ReactNode; title: string; detail: string; on: boolean; onChange: () => void }) {
 return <button className="xp-switch" role="switch" aria-checked={on} onClick={onChange}>{icon}<span>{title}<small>{detail}</small></span><i /></button>;
}
export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
 return <label className="xp-slider"><span>{label}<b className="tabular">{value}{unit}</b></span><input type="range" min={min} max={max} step={step} value={value} style={{ '--fill': `${(value - min) / (max - min) * 100}%` } as React.CSSProperties} onChange={e => onChange(Number(e.target.value))} /></label>;
}

function Controls({ fitting, state, dispatch }: { fitting: Fitting; state: ApartmentState; dispatch: Dispatch<ApartmentAction> }) {
 const p = fittedProduct(fitting.id, state), s = productState(p, state), room = state.rooms[p.room], plan = roomPlan(p.room), usage = apartmentUsage(state);
 const lights = (on: boolean, brightness?: number) => dispatch({ type: 'room-lights', room: p.room, on, brightness });
 const climate = <>
  <SwitchRow icon={<Snowflake size={18} />} title="Air conditioner" detail={state.climate ? `Cooling to ${state.temperature}°C` : 'Off'} on={state.climate} onChange={() => dispatch({ type: 'climate', on: !state.climate })} />
  <Slider label="Set temperature" value={state.temperature} min={16} max={30} unit="°C" onChange={value => dispatch({ type: 'temperature', value })} />
 </>;
 if (isRoomControl(p) || isLight(p)) return <>
  <SwitchRow icon={<Lightbulb size={18} />} title={`${plan.circuit} · ${ROOM_NAMES[p.room]}`} detail={room.lights ? `On at ${room.brightness}%` : s.backup ? 'Mains off · running on battery' : 'Off'} on={room.lights} onChange={() => lights(!room.lights)} />
  <Slider label="Brightness" value={room.lights ? room.brightness : 0} min={0} max={100} step={5} unit="%" onChange={value => lights(value > 0, value)} />
  {isLight(p) && <Slider label="Colour temperature" value={room.kelvin} min={2700} max={6500} step={100} unit=" K" onChange={value => dispatch({ type: 'kelvin', id: p.id, value })} />}
  {p.kind === 'tube' && <SwitchRow icon={<BatteryCharging size={18} />} title="Backup battery test" detail="Cuts the bathroom mains and keeps a low light on" on={s.backup} onChange={() => dispatch({ type: 'backup', id: p.id, on: !s.backup })} />}
  {p.kind === 'screen' && climate}
 </>;
 if (p.kind === 'fan') return <div className="xp-steps" role="radiogroup" aria-label={`${ROOM_NAMES[p.room]} fan speed`}>
  <span>Fan speed</span>
  <div>{[0, 1, 2, 3, 4, 5].map(speed => <button key={speed} role="radio" aria-checked={room.fanSpeed === speed} onClick={() => dispatch({ type: 'fan', room: p.room, speed })}>{speed || 'Off'}</button>)}</div>
 </div>;
 if (p.kind === 'plug') return <>
  <SwitchRow icon={<Tv size={18} />} title="Television and set-top box" detail={state.tv ? 'Powered through the plug' : 'Switched off at the plug, no standby draw'} on={state.tv} onChange={() => dispatch({ type: 'tv', on: !state.tv })} />
  <p className="xp-reading"><b className="tabular">{usage.tv} W</b>Illustrative connected load</p>
 </>;
 if (p.kind === 'ir') return climate;
 if (p.kind === 'curtain') return <>
  <Slider label="Open" value={state.curtain} min={0} max={100} step={5} unit="%" onChange={value => dispatch({ type: 'curtain', value })} />
  <div className="xp-steps" role="radiogroup" aria-label="Window covering"><span>Fitted to</span><div>
   <button role="radio" aria-checked={state.curtainKind === 'curtain'} onClick={() => dispatch({ type: 'curtain-kind', value: 'curtain' })}>Curtains</button>
   <button role="radio" aria-checked={state.curtainKind === 'blind'} onClick={() => dispatch({ type: 'curtain-kind', value: 'blind' })}>Roller blind</button>
  </div></div>
 </>;
 if (p.kind === 'lock') return <SwitchRow icon={deviceGlyph(p, state, 18)} title={p.id === 'drawer-lock' ? 'Drawer' : 'Door'} detail={s.locked ? 'Locked' : 'Unlocked from the app'} on={!s.locked} onChange={() => dispatch({ type: 'lock', id: p.id, locked: !s.locked })} />;
 if (p.kind === 'sensor') {
  const safety = p.id === 'gas-leak-sensor' || p.id === 'smoke-detector';
  return <>
   <SwitchRow icon={deviceGlyph(p, state, 18)} title={safety ? 'Test alarm' : 'Simulate movement'} detail={productStatus(p, state)} on={s.triggered} onChange={() => dispatch({ type: 'sensor', id: p.id, triggered: !s.triggered })} />
   <p className="xp-note">{s.triggered ? (safety ? 'The alert reaches every phone in the home. Lighting and appliances are left as they are.' : `${plan.circuit} came on by itself. No other room changed.`) : (safety ? 'Run a test to see the alert a real event would send.' : `Movement here switches on ${plan.circuit} only.`)}</p>
  </>;
 }
 if (p.kind === 'doorbell' || p.kind === 'intercom') return <>
  <SwitchRow icon={<Phone size={18} />} title="Test a visitor call" detail={productStatus(p, state)} on={s.call !== 'idle'} onChange={() => dispatch({ type: 'call', id: p.id, call: s.call === 'idle' ? 'ringing' : 'idle' })} />
  <p className="xp-note">The hall doorbell rings the monitor fitted in the living room, and your phone.</p>
 </>;
 return <>
  <p className="xp-reading"><b className="tabular">{usage.total.toLocaleString('en-IN')} W</b>Whole apartment, illustrative live load</p>
  <Slider label="Alert above" value={state.threshold} min={100} max={4000} step={100} unit=" W" onChange={value => dispatch({ type: 'threshold', value })} />
  <p className="xp-note">{usage.total > state.threshold ? 'Above your threshold. An alert is showing on the home.' : 'Usage is below your alert threshold.'}</p>
 </>;
}

// One fitted device: a row with a one-tap action, opening to its full controls and the product behind it.
export default function DeviceCard({ fitting, state, open, dispatch, onToggle }: { fitting: Fitting; state: ApartmentState; open: boolean; dispatch: Dispatch<ApartmentAction>; onToggle: (slot: string) => void }) {
 const card = useRef<HTMLElement>(null);
 const p = fittedProduct(fitting.id, state), info = family(p.id), quick = quickAction(p, state), alert = deviceAlert(p, state);
 useEffect(() => { if (open) card.current?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }, [open]);
 return <article ref={card} className={'xp-device' + (open ? ' open' : '') + (alert ? ' alert' : '')}>
  <div className="xp-device-row">
   <button className="xp-device-main" aria-expanded={open} onClick={() => onToggle(fitting.id)}>
    <span className={'xp-device-icon' + (deviceActive(p, state) ? ' on' : '')}>{deviceGlyph(p, state, 17)}</span>
    <span className="xp-device-text"><b>{fitting.label}</b><small>{info.name} · {productStatus(p, state)}</small></span>
    <ChevronDown size={16} className="xp-device-chevron" />
   </button>
   {quick && <Toggle on={quick.on} label={quick.label} onChange={() => dispatch(quick.action)} />}
  </div>
  {open && <div className="xp-device-body">
   <Controls fitting={fitting} state={state} dispatch={dispatch} />
   <div className="xp-product"><img src={info.image} alt="" /><div><b>{info.name}</b><p>{info.tagline}</p></div></div>
   {fitting.options.length > 1 && <div className="xp-models" role="radiogroup" aria-label={`Model fitted as the ${fitting.label.toLowerCase()}`}>
    <span>Try another model in this spot</span>
    <div>{fitting.options.map(o => <button key={o.id} role="radio" aria-checked={o.id === p.id} onClick={() => dispatch({ type: 'select', id: o.id })}><img src={family(o.id).image} alt="" /><em>{family(o.id).name}</em></button>)}</div>
   </div>}
   <div className="xp-device-links"><SiteLink className="link" href={familyHref(info)}>Full specifications <ArrowRight size={14} /></SiteLink><SiteLink className="btn small" href={`/demo?product=${encodeURIComponent(info.name)}`}>Book a demo</SiteLink></div>
  </div>}
 </article>;
}
