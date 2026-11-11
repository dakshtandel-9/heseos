'use client';
import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { HOME_RATIO, HOME_SCENE, areaMask } from '../../../lib/experience-scenes';
import { ROOM_PLAN, lightingLevel, type ApartmentState, type RoomId } from '../../../lib/simulation-products';
import { ROOM_ICONS } from './devices';

const MASKS = Object.fromEntries(ROOM_PLAN.map(r => [r.id, areaMask(HOME_SCENE.rooms[r.id].area)])) as Record<RoomId, string>;

// The whole apartment from above. The lit plate is shown through one feathered mask per room,
// so each room brightens and dims with its own circuit and nothing else.
export default function HomeStage({ state, zoom, onEnter }: { state: ApartmentState; zoom: RoomId | null; onEnter: (room: RoomId) => void }) {
 const [hover, setHover] = useState<RoomId | null>(null);
 const target = zoom && HOME_SCENE.rooms[zoom].label;
 return <div className={'xp-home' + (zoom ? ' zooming' : '')}>
  <div className="xp-home-plate" style={target ? { transformOrigin: `${target.x}% ${target.y}%` } : undefined}>
   <img className="xp-layer" src={HOME_SCENE.dark} alt={HOME_SCENE.alt} draggable={false} />
   {ROOM_PLAN.map(r => {
    const level = lightingLevel(r.id, state);
    return <img key={r.id} className="xp-layer xp-home-lit" src={HOME_SCENE.lit} alt="" draggable={false} style={{ opacity: level <= 0 ? 0 : Math.pow(level, .7), maskImage: MASKS[r.id], WebkitMaskImage: MASKS[r.id] } as CSSProperties} />;
   })}
   <svg className="xp-home-hit" viewBox={`0 0 ${100 * HOME_RATIO} 100`} preserveAspectRatio="none" aria-hidden="true">
    {ROOM_PLAN.map(r => <polygon key={r.id} className={hover === r.id ? 'hover' : undefined} points={HOME_SCENE.rooms[r.id].area.map(([x, y]) => `${x * HOME_RATIO},${y}`).join(' ')} onClick={() => onEnter(r.id)} onPointerEnter={() => setHover(r.id)} onPointerLeave={() => setHover(null)} />)}
   </svg>
   {ROOM_PLAN.map(r => {
    const Icon = ROOM_ICONS[r.id], s = state.rooms[r.id], at = HOME_SCENE.rooms[r.id].label;
    return <button key={r.id} className={'xp-room-chip' + (s.lights ? ' on' : '') + (hover === r.id ? ' hover' : '')} style={{ left: `${at.x}%`, top: `${at.y}%` }} onClick={() => onEnter(r.id)} onPointerEnter={() => setHover(r.id)} onPointerLeave={() => setHover(null)} aria-label={`Enter the ${r.name.toLowerCase()}. ${r.circuit} ${s.lights ? `on at ${s.brightness} percent` : 'off'}.`}>
     <i><Icon size={15} strokeWidth={2.2} /></i><span>{r.name}<small>{r.circuit} · {s.lights ? `${s.brightness}%` : 'Off'}</small></span><ArrowRight size={14} className="xp-room-chip-go" />
    </button>;
   })}
  </div>
 </div>;
}
