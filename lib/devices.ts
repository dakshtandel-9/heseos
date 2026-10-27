import { INITIAL_POWER, parseEnergyCommand, type EnergyCommand, type PowerState } from './energy';
import type { ProductSlug } from './catalog';
// The three simulated components, each driving one of the illustrative loads in energy.ts.
export type DeviceId=ProductSlug;
export const DEVICES:{id:DeviceId;name:string;load:'lights'|'climate'|'standby';controls:string}[]=[
 {id:'touch-panel',name:'Touch Panel',load:'lights',controls:'Lighting'},
 {id:'ir-blaster',name:'IR Blaster',load:'climate',controls:'Air conditioner'},
 {id:'smart-plug',name:'Smart Plug',load:'standby',controls:'TV & set-top box'},
];
export const device=(id:DeviceId)=>DEVICES.find(d=>d.id===id)!;
export type SceneId='home'|'evening'|'away';
export const SCENES:{id:SceneId;name:string;power:PowerState}[]=[
 {id:'home',name:'Home',power:INITIAL_POWER},
 {id:'evening',name:'Evening',power:{lights:true,brightness:30,climate:true,standby:false}},
 {id:'away',name:'Away',power:{lights:false,brightness:0,climate:false,standby:false}},
];
export const lightLevel=(power:PowerState)=>power.lights?Math.max(0,Math.min(100,power.brightness))/100:0;
export type SimulationCommand=EnergyCommand|{type:'focus';device:DeviceId};
const DEVICE_WORDS:[RegExp,DeviceId][]=[[/\b(panel|switch|touch)\b/,'touch-panel'],[/\b(ir|blaster|remote)\b/,'ir-blaster'],[/\b(plug|socket)\b/,'smart-plug']];
export function parseSimulationCommand(raw:string):SimulationCommand{
 const s=raw.toLowerCase().replace(/[^a-z0-9%\s]/g,' ').replace(/\s+/g,' ').trim();
 if(/\b(show|where|find|take me|go to|open)\b/.test(s)){const match=DEVICE_WORDS.find(([pattern])=>pattern.test(s));if(match)return {type:'focus',device:match[1]};}
 return parseEnergyCommand(raw);
}
