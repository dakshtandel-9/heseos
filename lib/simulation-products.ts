import { FAMILIES } from './products';

export type RoomId = 'living' | 'kitchen' | 'bedroom' | 'bedroom2' | 'bath';
export type ProductKind = 'panel' | 'retrofit' | 'modular' | 'screen' | 'plug' | 'ir' | 'meter' | 'curtain' | 'lock' | 'intercom' | 'doorbell' | 'sensor' | 'downlight' | 'tube' | 'fan';
type ProductOption = { id: string; kind: ProductKind; finish?: string };
type Fitting = {
 id: string; label: string; room: RoomId; at: [number, number, number]; yaw: number;
 mount?: 'wall' | 'surface' | 'ceiling'; view?: [number, number]; fov?: number;
 detail: string; options: ProductOption[];
};
export type InstalledProduct = Omit<Fitting, 'options'> & ProductOption & { slot: string };
export const ROOM_PLAN: { id: RoomId; name: string; circuit: string; controller: string; fan?: string; watts: number }[] = [
 { id: 'living', name: 'Living room', circuit: 'Light 1', controller: 'living-control', fan: 'living-fan', watts: 24 },
 { id: 'kitchen', name: 'Kitchen', circuit: 'Light 2', controller: 'kitchen-control', watts: 24 },
 { id: 'bedroom', name: 'Bedroom', circuit: 'Light 3', controller: 'bedroom-control', fan: 'bedroom-fan', watts: 24 },
 { id: 'bedroom2', name: 'Bedroom 2', circuit: 'Light 4', controller: 'bedroom2-control', fan: 'bedroom2-fan', watts: 24 },
 { id: 'bath', name: 'Bathroom', circuit: 'Light 5', controller: 'bath-control', watts: 24 },
];
export const ROOM_NAMES = Object.fromEntries(ROOM_PLAN.map(r => [r.id, r.name])) as Record<RoomId, string>;
export const roomPlan = (room: RoomId) => ROOM_PLAN.find(r => r.id === room)!;
const option = (id: string, kind: ProductKind, finish?: string): ProductOption => ({ id, kind, finish });
const wall = (id: string, label: string, room: RoomId, at: Fitting['at'], options: ProductOption[], detail: string, yaw = 0, view?: Fitting['view']): Fitting => ({ id, label, room, at, options, detail, yaw, mount: 'wall', view });
const ceiling = (id: string, label: string, room: RoomId, at: Fitting['at'], options: ProductOption[], detail: string): Fitting => ({ id, label, room, at, options, detail, yaw: 0, mount: 'ceiling', fov: 62 });

// This is the physical installation plan. Each fitting contains exactly ONE selected product.
// Options are replacements at that same mounting point, not additional objects around the room.
export const FITTINGS: Fitting[] = [
 wall('living-control', 'Light 1 control', 'living', [-5.05, 1.25, .62], [option('touch-panel-series', 'panel'), option('magnetic-touch-panel', 'panel'), option('screen-control-panel', 'screen')], 'Light 1 · living room only', 0, [-4.95, 1.75]),
 ceiling('living-light', 'Living ceiling light', 'living', [-6.05, 2.35, 3.25], [option('chrome-cob-downlight', 'downlight')], 'Light 1 · same circuit as the living room control'),
 ceiling('living-fan', 'Living ceiling fan', 'living', [-4.9, 2.36, 2.5], [option('elegance-base', 'fan', '#191b1c'), option('elegance-gold-black-marble', 'fan', '#1b1b1d')], 'One ceiling fan · living room'),
 wall('living-tv', 'TV smart plug', 'living', [-5.72, .35, .55], [option('smart-plug-16a', 'plug')], 'Living TV and set-top box only', 0, [-5.55, 1.6]),
 wall('living-climate', 'AC remote', 'living', [-6.05, .75, .55], [option('ir-blaster', 'ir')], 'Living room air conditioner only', 0, [-5, 2]),
 { id: 'living-window', label: 'Window curtains', room: 'living', at: [-5.5, 2.32, 4.15], yaw: Math.PI, view: [-5.5, 1.75], fov: 65, options: [option('curtain-blind-motor', 'curtain')], detail: 'One motorized window treatment · curtains or roller blind' },
 wall('console-lock', 'Media drawer lock', 'living', [-6.23, .62, 1.95], [option('drawer-lock', 'lock')], 'Media-console drawer only', Math.PI / 2),
 wall('entry-monitor', 'Visitor monitor', 'living', [-6.55, 1.45, .95], [option('ip-video-door-phone', 'intercom'), option('analog-video-door-phone', 'intercom')], 'One visitor monitor · choose IP or analog', Math.PI / 2),
 wall('entry-doorbell', 'Hall doorbell', 'living', [-3.85, 1.4, -1.1], [option('smart-doorbell', 'doorbell')], 'Hall visitor call linked to the living monitor', -Math.PI / 2, [-4.45, -1.3]),
 ceiling('living-motion', 'Living motion sensor', 'living', [-5.8, 2.35, 1.55], [option('microwave-motion-sensor', 'sensor'), option('pir-motion-sensor', 'sensor')], 'One motion sensor · triggers Light 1 only'),
 wall('utility-meter', 'Apartment energy meter', 'living', [-6.2, 1.4, .55], [option('three-phase-energy-meter', 'meter')], 'Utility enclosure · monitors the apartment load'),
 wall('kitchen-control', 'Light 2 control', 'kitchen', [-3.35, 1.25, .73], [option('edge-panel-series', 'panel', '#d8a596'), option('retrofit-module', 'retrofit')], 'Light 2 · kitchen only', 0, [-2, 1.2]),
 ceiling('kitchen-light', 'Kitchen ceiling light', 'kitchen', [-1.45, 2.32, 1.65], [option('roundo-cob-downlight', 'downlight')], 'Light 2 · same circuit as the kitchen control'),
 wall('kitchen-gas', 'Kitchen gas sensor', 'kitchen', [-.75, 1.65, .34], [option('gas-leak-sensor', 'sensor')], 'Kitchen gas alert · does not switch room lighting'),
 ceiling('kitchen-smoke', 'Kitchen smoke detector', 'kitchen', [-2.1, 2.33, 1.65], [option('smoke-detector', 'sensor')], 'Kitchen smoke alert · does not switch room lighting'),
 wall('bedroom-control', 'Light 3 control', 'bedroom', [-3.75, 1.25, -1.55], [option('bezzel-panel-series', 'panel', '#d9b64c'), option('premium-glass-touch-switch', 'panel', '#8e7661')], 'Light 3 · bedroom only', Math.PI / 2, [-3, -2.5]),
 ceiling('bedroom-light', 'Bedroom ceiling light', 'bedroom', [-2.7, 2.35, -1.6], [option('deep-cob-downlight', 'downlight')], 'Light 3 · same circuit as the bedroom control'),
 ceiling('bedroom-fan', 'Bedroom ceiling fan', 'bedroom', [-1.9, 2.36, -1.6], [option('elegance-gold-plywood', 'fan', '#65402c'), option('elegance-silver-wood', 'fan', '#34312d')], 'One ceiling fan · bedroom'),
 ceiling('bedroom-presence', 'Bedroom presence sensor', 'bedroom', [-1.35, 2.35, -1.7], [option('human-presence-sensor', 'sensor')], 'Bedroom presence · triggers Light 3 only'),
 wall('bedroom-lock', 'Bedroom door lock', 'bedroom', [-3.12, 1.05, -3.3], [option('wooden-door-lock', 'lock'), option('lever-door-lock', 'lock'), option('screen-door-lock', 'lock')], 'One lock on the existing bedroom door', 0, [-1, -2.5]),
 wall('bedroom2-control', 'Light 4 control', 'bedroom2', [-2.8, 1.25, -3.76], [option('k-panel-series', 'panel')], 'Light 4 · bedroom 2 only', Math.PI, [-3, -4.3]),
 ceiling('bedroom2-fan', 'Bedroom 2 ceiling fan', 'bedroom2', [-1.7, 2.36, -5.15], [option('elegance-golden-cap', 'fan', '#eee9df'), option('elegance-white-cap', 'fan', '#f4f2ec')], 'One ceiling fan · bedroom 2'),
 wall('bath-control', 'Light 5 control', 'bath', [-5.85, 1.25, -.75], [option('modular-smart-switch', 'modular')], 'Light 5 · bathroom only', 0, [-5.6, -.3]),
 wall('bath-light', 'Bathroom tube light', 'bath', [-5.8, 2.15, -.87], [option('motion-sensor-t8-tubelight', 'tube')], 'Light 5 · bathroom light with backup demonstration', 0, [-5.6, -.3]),
];
export const INSTALLED_PRODUCTS: InstalledProduct[] = FITTINGS.flatMap(({ options, ...fitting }) => options.map(p => ({ ...fitting, ...p, slot: fitting.id })));
// These require a different door construction; do not invent a new door just to fit a product.
export const UNFITTED_PRODUCTS = [
 { id: 'glass-door-lock', reason: 'Requires a compatible glass door; this apartment has no planned glass-door fitting.' },
 { id: 'sliding-door-lock', reason: 'Requires a compatible sliding door; this apartment has no planned sliding-door fitting.' },
];
export const installed = (id: string) => INSTALLED_PRODUCTS.find(p => p.id === id);
export const catalogProduct = (id: string) => FAMILIES.find(p => p.slug === id)!;
export const LEGACY_PRODUCTS: Record<string, string> = { 'touch-panel': 'touch-panel-series', 'smart-plug': 'smart-plug-16a' };
export const isRoomControl = (p: InstalledProduct) => ['panel', 'retrofit', 'modular', 'screen'].includes(p.kind);
export const isLight = (p: InstalledProduct) => p.kind === 'downlight' || p.kind === 'tube';

// World-space zones follow the imported floor plan. The corridor belongs to Light 1.
// The viewer derives its shader conditions from these same bounds, including shared baked meshes.
export const ROOM_ZONES: { room: RoomId; minX?: number; maxX?: number; minZ?: number; maxZ?: number }[] = [
 { room: 'bath', maxX: -4.92, maxZ: .56 },
 { room: 'bedroom2', minX: -3.76, maxZ: -3.68 },
 { room: 'bedroom', minX: -3.76, maxZ: -.38 },
 { room: 'kitchen', minX: -3.76, maxZ: 3.3 },
];
export function roomAtPoint(x: number, z: number): RoomId {
 return ROOM_ZONES.find(r => x >= (r.minX ?? -Infinity) && x < (r.maxX ?? Infinity) && z >= (r.minZ ?? -Infinity) && z < (r.maxZ ?? Infinity))?.room ?? 'living';
}
export type TourStep = { id: string; title: string; description: string; stop: RoomId; fitting?: string; focus?: 'tv' | 'ac' };
export const ROOM_TOUR: TourStep[] = [
 { id: 'welcome', title: 'A home with a plan', description: 'Five rooms. Five lighting circuits. Each control belongs to its own room.', stop: 'living' },
 { id: 'living-lights', title: 'Light 1 · Living room', description: 'One wall control dims the living room lights. The other rooms keep their own settings.', stop: 'living', fitting: 'living-control' },
 { id: 'living-tv', title: 'TV power, at the plug', description: 'The TV and set-top box share one smart plug beside the media unit.', stop: 'living', fitting: 'living-tv', focus: 'tv' },
 { id: 'living-ac', title: 'Living room comfort', description: 'One IR remote controls this air conditioner and its set temperature.', stop: 'living', fitting: 'living-climate', focus: 'ac' },
 { id: 'living-window', title: 'Daylight, on demand', description: 'One motor opens the window covering. Choose curtains or a roller blind at the same window.', stop: 'living', fitting: 'living-window' },
 { id: 'kitchen-lights', title: 'Light 2 · Kitchen', description: 'The kitchen has its own switch and ceiling light. Changing it leaves the living room untouched.', stop: 'kitchen', fitting: 'kitchen-control' },
 { id: 'kitchen-safety', title: 'Kitchen safety', description: 'Gas and smoke sensors report separate alerts. They do not switch unrelated lights or appliances.', stop: 'kitchen', fitting: 'kitchen-smoke' },
 { id: 'bedroom-lights', title: 'Light 3 · Bedroom', description: 'One bedside wall control owns this room’s lighting circuit.', stop: 'bedroom', fitting: 'bedroom-control' },
 { id: 'bedroom-fan', title: 'Your bedroom, your comfort', description: 'One ceiling fan serves this room. A different finish replaces the fitted fan.', stop: 'bedroom', fitting: 'bedroom-fan' },
 { id: 'bedroom2-lights', title: 'Light 4 · Bedroom 2', description: 'A separate wall control operates only bedroom 2’s existing lights.', stop: 'bedroom2', fitting: 'bedroom2-control' },
 { id: 'bedroom2-fan', title: 'A fan for bedroom 2', description: 'This fan has its own speed. It does not change the fan in the other bedroom.', stop: 'bedroom2', fitting: 'bedroom2-fan' },
 { id: 'bath-lights', title: 'Light 5 · Bathroom', description: 'One modular switch controls the bathroom lighting circuit.', stop: 'bath', fitting: 'bath-control' },
 { id: 'bath-backup', title: 'Light when you need it', description: 'Try the tube light’s backup mode here. The other room circuits stay independent.', stop: 'bath', fitting: 'bath-light' },
];
export function tourIndexForProduct(id: string) {
 const p = installed(LEGACY_PRODUCTS[id] ?? id); if (!p) return 0;
 const exact = ROOM_TOUR.findIndex(s => s.fitting === p.slot);
 return exact >= 0 ? exact : ROOM_TOUR.findIndex(s => s.stop === p.room);
}
// Unqualified commands follow the current room; explicit circuit/room names take priority.
export function lightingCommandTarget(text: string, current: RoomId): RoomId | 'all' {
 const circuit = text.match(/\blight(?:ing)?\s*([1-5])\b/i);
 if (circuit) return ROOM_PLAN[Number(circuit[1]) - 1].id;
 const rooms: [RegExp, RoomId][] = [[/\bbedroom\s*2\b/i, 'bedroom2'], [/\bbedroom\b/i, 'bedroom'], [/\bliving\b/i, 'living'], [/\bkitchen\b/i, 'kitchen'], [/\bbath(?:room)?\b/i, 'bath']];
 return rooms.find(([match]) => match.test(text))?.[1] ?? (/\b(all|whole|every)\b/i.test(text) ? 'all' : current);
}
// Do not mistake a circuit/room number for the requested brightness percentage.
export const normalizeRoomCommand = (text: string) => text.replace(/\blight(?:ing)?\s*[1-5]\b/gi, 'lights').replace(/\bbedroom\s*2\b/gi, 'bedroom');
export type DeviceState = { on: boolean; level: number; kelvin: number; locked: boolean; triggered: boolean; call: 'idle' | 'ringing' | 'connected'; backup: boolean };
export type RoomState = { lights: boolean; brightness: number; kelvin: number; fanSpeed: number };
export type ApartmentState = { rooms: Record<RoomId, RoomState>; devices: Record<string, DeviceState>; variants: Record<string, string>; climate: boolean; temperature: number; tv: boolean; curtain: number; curtainKind: 'curtain' | 'blind'; threshold: number; scene: 'home' | 'evening' | 'away' | 'custom' };
export function initialApartmentState(): ApartmentState {
 const rooms = Object.fromEntries(ROOM_PLAN.map(r => [r.id, { lights: true, brightness: 80, kelvin: 3000, fanSpeed: r.fan ? 2 : 0 }])) as Record<RoomId, RoomState>;
 const devices = Object.fromEntries(INSTALLED_PRODUCTS.map(p => [p.id, { on: true, level: 80, kelvin: 3000, locked: true, triggered: false, call: 'idle', backup: false }])) as Record<string, DeviceState>;
 return { rooms, devices, variants: Object.fromEntries(FITTINGS.map(f => [f.id, f.options[0].id])), climate: true, temperature: 24, tv: true, curtain: 65, curtainKind: 'curtain', threshold: 1800, scene: 'home' };
}
export const isInstalledVisible = (p: InstalledProduct, state: ApartmentState) => state.variants[p.slot] === p.id;
export const fittedProduct = (slot: string, state: ApartmentState) => installed(state.variants[slot])!;
export const roomProducts = (room: RoomId, state: ApartmentState) => FITTINGS.filter(f => f.room === room).map(f => fittedProduct(f.id, state));
export const lightingLevel = (room: RoomId, state: ApartmentState) => {
 const r = state.rooms[room];
 const backup = roomProducts(room, state).some(p => p.kind === 'tube' && state.devices[p.id].backup);
 return r.lights ? r.brightness / 100 : backup ? .2 : 0;
};
export function productState(p: InstalledProduct, state: ApartmentState): DeviceState {
 const own = state.devices[p.id], room = state.rooms[p.room];
 if (isRoomControl(p) || isLight(p)) return { ...own, on: room.lights || (p.kind === 'tube' && own.backup), level: p.kind === 'tube' && own.backup && !room.lights ? 20 : room.brightness, kelvin: room.kelvin };
 if (p.kind === 'fan') return { ...own, on: room.fanSpeed > 0, level: room.fanSpeed };
 if (p.kind === 'plug') return { ...own, on: state.tv };
 if (p.kind === 'ir') return { ...own, on: state.climate, level: state.temperature };
 return own;
}
export type ApartmentAction =
 | { type: 'select'; id: string } | { type: 'power'; id: string; on: boolean } | { type: 'level' | 'kelvin'; id: string; value: number }
 | { type: 'room-lights'; room: RoomId; on: boolean; brightness?: number }
 | { type: 'fan'; room: RoomId; speed: number } | { type: 'lock'; id: string; locked: boolean } | { type: 'sensor'; id: string; triggered: boolean }
 | { type: 'call'; id: string; call: DeviceState['call'] } | { type: 'backup'; id: string; on: boolean }
 | { type: 'curtain' | 'threshold' | 'temperature'; value: number } | { type: 'curtain-kind'; value: 'curtain' | 'blind' }
 | { type: 'climate' | 'tv'; on: boolean } | { type: 'all-lights'; on: boolean; brightness?: number } | { type: 'scene'; scene: 'home' | 'evening' | 'away' };
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));
export function apartmentReducer(state: ApartmentState, action: ApartmentAction): ApartmentState {
 const next = { ...state, rooms: { ...state.rooms }, devices: { ...state.devices }, variants: { ...state.variants } };
 if (action.type === 'select') {
  const p = installed(action.id); if (!p) return state;
  const previous = fittedProduct(p.slot, state);
  next.variants[p.slot] = p.id;
  next.devices[p.id] = { ...state.devices[previous.id] };
  return next;
 }
 next.scene = action.type === 'scene' ? action.scene : 'custom';
 if (action.type === 'scene') {
  for (const r of ROOM_PLAN) next.rooms[r.id] = { ...state.rooms[r.id], lights: action.scene !== 'away', brightness: action.scene === 'evening' ? 30 : 80, fanSpeed: action.scene === 'away' || !r.fan ? 0 : 2 };
  for (const [id, d] of Object.entries(next.devices)) next.devices[id] = { ...d, on: true, locked: true, triggered: false, call: 'idle', backup: false };
  next.climate = action.scene !== 'away'; next.tv = action.scene === 'home'; next.curtain = action.scene === 'home' ? 65 : 0; return next;
 }
 if (action.type === 'all-lights' || action.type === 'room-lights') {
  for (const { id } of ROOM_PLAN.filter(r => action.type === 'all-lights' || r.id === action.room)) {
   const brightness = clamp(action.brightness ?? (next.rooms[id].brightness || 80), 0, 100);
   next.rooms[id] = { ...next.rooms[id], lights: action.on && brightness > 0, brightness };
  }
  return next;
 }
 if (action.type === 'fan') { if (!roomPlan(action.room).fan) return state; next.rooms[action.room] = { ...next.rooms[action.room], fanSpeed: Math.round(clamp(action.speed, 0, 5)) }; return next; }
 if (action.type === 'temperature') { next.temperature = clamp(action.value, 16, 30); return next; }
 if (action.type === 'curtain') { next.curtain = clamp(action.value, 0, 100); return next; }
 if (action.type === 'threshold') { next.threshold = clamp(action.value, 100, 4000); return next; }
 if (action.type === 'curtain-kind') { next.curtainKind = action.value; return next; }
 if (action.type === 'climate' || action.type === 'tv') { next[action.type] = action.on; return next; }
 if (!('id' in action)) return state;
 const p = installed(action.id); if (!p || !isInstalledVisible(p, state)) return state;
 const d = { ...next.devices[p.id] }, r = { ...next.rooms[p.room] }; next.devices[p.id] = d; next.rooms[p.room] = r;
 if (action.type === 'power') {
  if (isRoomControl(p) || isLight(p)) { r.lights = action.on; if (action.on && r.brightness === 0) r.brightness = 80; }
  else if (p.kind === 'plug') next.tv = action.on;
  else if (p.kind === 'ir') next.climate = action.on;
  else d.on = action.on;
 } else if (action.type === 'level' && (isRoomControl(p) || isLight(p))) { r.brightness = clamp(action.value, 0, 100); r.lights = r.brightness > 0; }
 else if (action.type === 'kelvin' && (isRoomControl(p) || isLight(p))) r.kelvin = clamp(action.value, 2700, 6500);
 else if (action.type === 'lock') d.locked = action.locked;
 else if (action.type === 'sensor') {
  d.triggered = action.triggered;
  if (action.triggered && !['gas-leak-sensor', 'smoke-detector'].includes(p.id)) { r.lights = true; r.brightness = Math.max(r.brightness, 70); }
 } else if (action.type === 'call') {
  // One doorbell call is shared by the selected visitor monitor.
  for (const f of FITTINGS.filter(f => f.id === 'entry-monitor' || f.id === 'entry-doorbell')) {
   const id = next.variants[f.id]; next.devices[id] = { ...next.devices[id], call: action.call };
  }
 } else if (action.type === 'backup') { d.backup = action.on; if (action.on) r.lights = false; }
 return next;
}
export function apartmentUsage(state: ApartmentState) {
 // Count physical circuits and fitted fans once. Alternative products add no load.
 const lighting = Math.round(ROOM_PLAN.reduce((n, r) => n + (state.rooms[r.id].lights ? r.watts * state.rooms[r.id].brightness / 100 : 0), 0));
 const fans = Math.round(ROOM_PLAN.reduce((n, r) => { const speed = state.rooms[r.id].fanSpeed; return n + (r.fan && speed > 0 ? 6 + Math.pow(speed / 5, 2) * 29 : 0); }, 0));
 const climate = state.climate ? 1200 : 0, tv = state.tv ? 80 : 0;
 return { lighting, fans, climate, tv, total: lighting + fans + climate + tv };
}
export function productStatus(p: InstalledProduct, state: ApartmentState) {
 const d = productState(p, state);
 if (p.kind === 'lock') return d.locked ? 'Locked' : 'Unlocked';
 if (p.kind === 'fan') return d.on ? `Speed ${d.level} of 5` : 'Off';
 if (p.kind === 'curtain') return `${state.curtain}% open`;
 if (p.kind === 'sensor') return d.triggered ? 'Event detected' : 'Monitoring';
 if (p.kind === 'intercom' || p.kind === 'doorbell') return d.call === 'idle' ? 'Ready' : d.call === 'ringing' ? 'Visitor calling' : 'Call connected';
 if (p.kind === 'meter') return `${apartmentUsage(state).total} W`;
 if (p.kind === 'ir') return state.climate ? `Cooling · ${state.temperature}°C` : 'AC off';
 return d.on ? 'On' : 'Off';
}
