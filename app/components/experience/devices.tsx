import { createElement } from 'react';
import { AlarmSmoke, Bath, BedDouble, BedSingle, BellRing, Blinds, CookingPot, Fan, Flame, Gauge, Lightbulb, Lock, LockOpen, Plug, Radar, Snowflake, Sofa, ToggleRight, Video, type LucideIcon } from 'lucide-react';
import { ROOM_NAMES, apartmentUsage, isLight, isRoomControl, productState, roomPlan, type ApartmentAction, type ApartmentState, type InstalledProduct, type RoomId } from '../../../lib/simulation-products';

export const ROOM_ICONS: Record<RoomId, LucideIcon> = { living: Sofa, kitchen: CookingPot, bedroom: BedDouble, bedroom2: BedSingle, bath: Bath };

export function deviceIcon(p: InstalledProduct, state: ApartmentState): LucideIcon {
 if (isRoomControl(p)) return ToggleRight;
 if (isLight(p)) return Lightbulb;
 if (p.kind === 'fan') return Fan;
 if (p.kind === 'plug') return Plug;
 if (p.kind === 'ir') return Snowflake;
 if (p.kind === 'curtain') return Blinds;
 if (p.kind === 'lock') return state.devices[p.id].locked ? Lock : LockOpen;
 if (p.kind === 'doorbell') return BellRing;
 if (p.kind === 'intercom') return Video;
 if (p.kind === 'meter') return Gauge;
 return p.id === 'gas-leak-sensor' ? Flame : p.id === 'smoke-detector' ? AlarmSmoke : Radar;
}

export const deviceGlyph = (p: InstalledProduct, state: ApartmentState, size: number) => createElement(deviceIcon(p, state), { size });

// "Active" lights a marker amber; "alert" turns it red and raises a notification.
export function deviceActive(p: InstalledProduct, state: ApartmentState) {
 if (p.kind === 'curtain') return state.curtain > 0;
 if (p.kind === 'lock') return !state.devices[p.id].locked;
 if (p.kind === 'meter') return false;
 if (p.kind === 'sensor') return state.devices[p.id].triggered;
 if (p.kind === 'doorbell' || p.kind === 'intercom') return state.devices[p.id].call !== 'idle';
 return productState(p, state).on;
}
export function deviceAlert(p: InstalledProduct, state: ApartmentState) {
 if (p.kind === 'meter') return apartmentUsage(state).total > state.threshold;
 if (p.kind === 'doorbell' || p.kind === 'intercom') return state.devices[p.id].call === 'ringing';
 return p.kind === 'sensor' && state.devices[p.id].triggered && (p.id === 'gas-leak-sensor' || p.id === 'smoke-detector');
}

// The one-tap action shown beside each device in a room's list.
export function quickAction(p: InstalledProduct, state: ApartmentState): { label: string; on: boolean; action: ApartmentAction } | null {
 const room = state.rooms[p.room], own = state.devices[p.id];
 if (isRoomControl(p) || isLight(p)) return { label: `${roomPlan(p.room).circuit}, ${ROOM_NAMES[p.room]}`, on: room.lights, action: { type: 'room-lights', room: p.room, on: !room.lights } };
 if (p.kind === 'fan') return { label: `${ROOM_NAMES[p.room]} fan`, on: room.fanSpeed > 0, action: { type: 'fan', room: p.room, speed: room.fanSpeed > 0 ? 0 : 3 } };
 if (p.kind === 'plug') return { label: 'Television power', on: state.tv, action: { type: 'tv', on: !state.tv } };
 if (p.kind === 'ir') return { label: 'Air conditioner', on: state.climate, action: { type: 'climate', on: !state.climate } };
 if (p.kind === 'curtain') return { label: 'Window covering open', on: state.curtain > 0, action: { type: 'curtain', value: state.curtain > 0 ? 0 : 100 } };
 if (p.kind === 'lock') return { label: `${p.label} unlocked`, on: !own.locked, action: { type: 'lock', id: p.id, locked: !own.locked } };
 if (p.kind === 'sensor') return { label: `Test ${p.label.toLowerCase()}`, on: own.triggered, action: { type: 'sensor', id: p.id, triggered: !own.triggered } };
 if (p.kind === 'doorbell' || p.kind === 'intercom') return { label: 'Test a visitor call', on: own.call !== 'idle', action: { type: 'call', id: p.id, call: own.call === 'idle' ? 'ringing' : 'idle' } };
 return null;
}
