import type { RoomId } from './simulation-products';

// Artwork for the simulation: one photographed-style plate per room in two lighting states,
// plus an overhead plate of the whole apartment. Every position is a percentage of its plate,
// measured on the artwork in public/media/experience, so markers stay put at any screen size.
export type Point = { x: number; y: number };
export type Rect = Point & { w: number; h: number };
export type RoomScene = {
 room: RoomId; title: string; intro: string; alt: string;
 lit: string; dark: string; thumb: string;
 focus: number; // horizontal centre shown first when the plate is wider than the screen
 pins: Record<string, Point>; // fitting id → marker position
 tv?: Rect; ac?: Rect; readout?: Point;
 fan?: Rect; // ellipse swept by the blades: centre, width and height
 // Drapes close across x…x+w; a roller blind comes down inside the glass outline (clockwise from top left).
 window?: { x: number; w: number; quad: [number, number][]; lit: string; dark: string };
};
const art = (name: string) => `/media/experience/${name}.webp`;
const scene = (room: RoomId, rest: Omit<RoomScene, 'room' | 'lit' | 'dark' | 'thumb'>): RoomScene => ({ room, lit: art(`${room}-lit`), dark: art(`${room}-dark`), thumb: art(`${room}-thumb`), ...rest });

export const PLATE_RATIO = 16 / 9;
export const ROOM_SCENES: Record<RoomId, RoomScene> = {
 living: scene('living', {
  title: 'Living room', alt: 'Living room with a walnut media wall, television, ceiling fan and floor-to-ceiling windows at dusk',
  intro: 'The room everyone shares. One wall panel, one fan, the TV, the air conditioner and the curtains all answer to the same app.',
  focus: 52,
  pins: {
   'living-control': { x: 94.9, y: 51.4 }, 'living-light': { x: 70.8, y: 17 }, 'living-fan': { x: 50.3, y: 12.4 },
   'living-tv': { x: 36.6, y: 66.8 }, 'living-climate': { x: 64.6, y: 62.6 }, 'living-window': { x: 12.5, y: 40 },
   'console-lock': { x: 45.5, y: 67 }, 'entry-monitor': { x: 95, y: 40.5 }, 'entry-doorbell': { x: 88.8, y: 45 },
   'living-motion': { x: 80.5, y: 14 }, 'utility-meter': { x: 86.3, y: 58 },
  },
  tv: { x: 39.7, y: 38.9, w: 22.6, h: 20.9 }, ac: { x: 67.2, y: 27.7, w: 11.4, h: 6.4 }, readout: { x: 76.2, y: 30.6 },
  fan: { x: 50.5, y: 12.6, w: 24.5, h: 14.5 },
  window: { x: 0, w: 23.6, quad: [[5.1, 10.2], [19.9, 25.2], [19.9, 76.1], [5.1, 82.7]], lit: art('living-closed-lit'), dark: art('living-closed-dark') },
 }),
 kitchen: scene('kitchen', {
  title: 'Kitchen', alt: 'Modular kitchen with an island, built-in hob and oven at dusk',
  intro: 'Light 2 has its own switch here. Gas and smoke sensors keep watch and raise an alert on your phone, without touching any other room.',
  focus: 50,
  pins: { 'kitchen-control': { x: 3.8, y: 51.4 }, 'kitchen-light': { x: 69.9, y: 14.5 }, 'kitchen-gas': { x: 33.6, y: 35.7 }, 'kitchen-smoke': { x: 50.1, y: 5.3 } },
 }),
 bedroom: scene('bedroom', {
  title: 'Bedroom', alt: 'Master bedroom with a king bed, walnut feature wall, ceiling fan and a door with a smart lock',
  intro: 'A calmer circuit. The presence sensor brings Light 3 on when someone walks in, and the door opens with a code, a card or the app.',
  focus: 50,
  pins: { 'bedroom-control': { x: 96, y: 51.4 }, 'bedroom-light': { x: 69.8, y: 16.9 }, 'bedroom-fan': { x: 49.8, y: 12.7 }, 'bedroom-presence': { x: 30, y: 9 }, 'bedroom-lock': { x: 91.2, y: 55 } },
  fan: { x: 50, y: 13.2, w: 26.5, h: 15 },
 }),
 bedroom2: scene('bedroom2', {
  title: 'Bedroom 2', alt: 'Second bedroom with a queen bed, a study desk and a white ceiling fan',
  intro: 'Guest room and study. Its panel and fan are separate from the other bedroom, so nobody changes a room they are not in.',
  focus: 50,
  pins: { 'bedroom2-control': { x: 97.1, y: 50.8 }, 'bedroom2-fan': { x: 49.7, y: 12.2 } },
  fan: { x: 50.2, y: 12.5, w: 25.5, h: 14 },
 }),
 bath: scene('bath', {
  title: 'Bathroom', alt: 'Bathroom with a walnut vanity, mirror, tube light and a glass walk-in shower',
  intro: 'One modular switch and one tube light. Try the backup mode: the tube keeps a low light on its own battery when the mains are off.',
  focus: 46,
  pins: { 'bath-control': { x: 6.6, y: 47.6 }, 'bath-light': { x: 48, y: 17.9 } },
 }),
};

// Overhead plate of the apartment. Each room's area is lit separately, so one switch changes one room.
// The kitchen is open to the passage, so the passage follows the kitchen light.
export const HOME_RATIO = 3 / 2;
export const HOME_SCENE: { lit: string; dark: string; alt: string; rooms: Record<RoomId, { area: [number, number][]; label: Point }> } = {
 lit: art('home-lit'), dark: art('home-dark'),
 alt: 'Overhead view of the apartment: living room, kitchen, bathroom and two bedrooms',
 rooms: {
  living: { area: [[7.4, 13.4], [41.4, 13.4], [41.4, 49.5], [39.7, 49.5], [39.7, 89.6], [3.2, 89.8]], label: { x: 23, y: 49 } },
  kitchen: { area: [[41.4, 13.4], [69.4, 13.4], [69.4, 38.6], [92.6, 38.6], [93, 49.5], [41.4, 49.5]], label: { x: 55.5, y: 30 } },
  bath: { area: [[69.4, 13.4], [92.2, 13.4], [92.6, 38.6], [69.4, 38.6]], label: { x: 81, y: 26 } },
  bedroom: { area: [[39.7, 49.5], [68.1, 49.5], [68.4, 89.6], [39.7, 89.6]], label: { x: 54, y: 67 } },
  bedroom2: { area: [[68.1, 49.5], [93, 49.5], [97.6, 89.4], [68.4, 89.6]], label: { x: 81.5, y: 68 } },
 },
};
// A feathered mask for one room's area, as an inline SVG so it always matches the outline above.
export function areaMask(area: [number, number][]) {
 const points = area.map(([x, y]) => `${(x * HOME_RATIO).toFixed(2)},${y}`).join(' ');
 const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${100 * HOME_RATIO} 100' preserveAspectRatio='none'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='0.9'/></filter><polygon points='${points}' filter='url(%23f)'/></svg>`;
 return `url("data:image/svg+xml,${svg.replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
}
