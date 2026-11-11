'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { MoveHorizontal } from 'lucide-react';
import type { RoomScene } from '../../../lib/experience-scenes';
import { FITTINGS, fittedProduct, lightingLevel, productStatus, type ApartmentState } from '../../../lib/simulation-products';
import { deviceActive, deviceAlert, deviceIcon } from './devices';

type Props = { scene: RoomScene; state: ApartmentState; selected: string | null; onSelect: (slot: string) => void };
const pct = (n: number) => `${n}%`;

// One room as a layered plate: the lights-off photograph underneath, the lights-on photograph faded in
// by the dimmer level, then the things that move on their own (curtains, TV, AC, fan) and the device markers.
export default function RoomStage({ scene, state, selected, onSelect }: Props) {
 const scroller = useRef<HTMLDivElement>(null), drag = useRef<{ x: number; left: number; moved: boolean } | null>(null), mounted = useRef(false);
 const [pannable, setPannable] = useState(false), [hint, setHint] = useState(true);
 const room = state.rooms[scene.room], level = lightingLevel(scene.room, state);
 const glow = level <= 0 ? 0 : Math.pow(level, .7), cool = Math.max(0, Math.min(1, (room.kelvin - 3000) / 3500));
 const fittings = FITTINGS.filter(f => f.room === scene.room);

 const panTo = useCallback((x: number, smooth: boolean) => {
  const el = scroller.current; if (!el) return;
  const max = el.scrollWidth - el.clientWidth; if (max <= 0) return;
  el.scrollTo({ left: Math.max(0, Math.min(max, x / 100 * el.scrollWidth - el.clientWidth / 2)), behavior: smooth ? 'smooth' : 'instant' });
 }, []);
 // Bring the chosen device into view; on arrival, start on the part of the room worth seeing first.
 useEffect(() => {
  const pin = selected ? scene.pins[selected] : undefined;
  if (pin || !mounted.current) panTo(pin?.x ?? scene.focus, mounted.current);
  mounted.current = true;
 }, [selected, scene, panTo]);
 useEffect(() => {
  const el = scroller.current; if (!el) return;
  const measure = () => setPannable(el.scrollWidth - el.clientWidth > 24);
  const observer = new ResizeObserver(measure); observer.observe(el); measure();
  return () => observer.disconnect();
 }, []);

 // Touch pans natively; a mouse drags the plate. A drag never counts as a click on a marker.
 const press = (e: ReactPointerEvent<HTMLDivElement>) => { setHint(false); if (e.pointerType === 'mouse' && e.button === 0) drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false }; };
 const move = (e: ReactPointerEvent<HTMLDivElement>) => {
  const d = drag.current; if (!d) return;
  const dx = e.clientX - d.x;
  if (!d.moved && Math.abs(dx) > 5) { d.moved = true; e.currentTarget.setPointerCapture(e.pointerId); }
  if (d.moved) e.currentTarget.scrollLeft = d.left - dx;
 };
 const release = () => { drag.current = null; };

 // Drapes: the curtains-closed photograph is revealed from both sides of the window toward the middle.
 // Roller blind: a fabric panel comes down inside the glass outline, following its perspective.
 const win = scene.window, closed = 1 - state.curtain / 100, blind = state.curtainKind === 'blind';
 const cover = (src: string) => {
  if (!win) return null;
  if (!blind) return <>
   <img className="xp-layer xp-drape" src={src} alt="" draggable={false} style={{ clipPath: `inset(0 ${100 - win.x - closed * win.w / 2}% 0 ${win.x}%)` }} />
   <img className="xp-layer xp-drape" src={src} alt="" draggable={false} style={{ clipPath: `inset(0 ${100 - win.x - win.w}% 0 ${win.x + win.w - closed * win.w / 2}%)` }} />
  </>;
  const [tl, tr, br, bl] = win.quad, along = (a: [number, number], b: [number, number]) => `${a[0] + (b[0] - a[0]) * closed}% ${a[1] + (b[1] - a[1]) * closed}%`;
  return <i className="xp-blind" style={{ clipPath: `polygon(${tl[0]}% ${tl[1]}%, ${tr[0]}% ${tr[1]}%, ${along(tr, br)}, ${along(tl, bl)})` }} />;
 };

 return <div className="xp-roomwrap"><div className={'xp-room' + (pannable ? ' pannable' : '')} data-room={scene.room} ref={scroller} onPointerDown={press} onPointerMove={move} onPointerUp={release} onPointerCancel={release} onWheel={() => setHint(false)}>
  <div className="xp-plate" style={{ backgroundImage: `url(${scene.thumb})` }}>
   <img className="xp-layer" src={scene.dark} alt={scene.alt} draggable={false} />
   {win && <div className="xp-shade">{cover(win.dark)}</div>}
   <div className="xp-lit" style={{ opacity: glow, filter: cool ? `brightness(${1 + cool * .1})` : undefined }}>
    <img className="xp-layer" src={scene.lit} alt="" draggable={false} />
    {win && cover(win.lit)}
    <i className="xp-tint" style={{ opacity: cool * .75 }} />
   </div>

   {scene.tv && <div className={'xp-tv' + (state.tv ? ' on' : '')} style={{ left: pct(scene.tv.x), top: pct(scene.tv.y), width: pct(scene.tv.w), height: pct(scene.tv.h) }} aria-hidden="true"><i /></div>}
   {scene.ac && <div className={'xp-air' + (state.climate ? ' on' : '')} style={{ left: pct(scene.ac.x), top: pct(scene.ac.y + scene.ac.h), width: pct(scene.ac.w) }} aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(i => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>}
   {scene.readout && state.climate && <span className="xp-readout" style={{ left: pct(scene.readout.x), top: pct(scene.readout.y) }} aria-hidden="true">{state.temperature}°</span>}
   {scene.fan && room.fanSpeed > 0 && <div className="xp-fan" style={{ left: pct(scene.fan.x), top: pct(scene.fan.y), width: pct(scene.fan.w), '--squash': scene.fan.h / scene.fan.w * (9 / 16), '--spin': `${1.9 / room.fanSpeed}s`, opacity: .5 + room.fanSpeed * .1, filter: `brightness(${(.3 + .7 * glow).toFixed(2)})` } as CSSProperties} aria-hidden="true"><i /></div>}

   {fittings.map(f => {
    const pin = scene.pins[f.id]; if (!pin) return null;
    const p = fittedProduct(f.id, state), Icon = deviceIcon(p, state);
    const cls = 'xp-pin' + (selected === f.id ? ' selected' : '') + (deviceAlert(p, state) ? ' alert' : deviceActive(p, state) ? ' on' : '') + (pin.x > 72 ? ' flip' : '');
    return <button key={f.id} className={cls} style={{ left: pct(pin.x), top: pct(pin.y) }} aria-pressed={selected === f.id} aria-label={`${f.label}: ${productStatus(p, state)}`} onClick={() => onSelect(f.id)}><i><Icon size={15} strokeWidth={2.2} /></i><span>{f.label}<small>{productStatus(p, state)}</small></span></button>;
   })}
  </div>
 </div>{pannable && hint && <span className="xp-hint"><MoveHorizontal size={14} />Drag to look around</span>}</div>;
}
