export type PowerState = { lights: boolean; brightness: number; climate: boolean; standby: boolean };
export const INITIAL_POWER: PowerState = { lights: true, brightness: 100, climate: true, standby: true };
// Explicit illustrative connected loads, in watts. Not a household savings claim.
export function powerUsage(state: PowerState) {
 const lighting=state.lights?Math.round(120*Math.max(0,Math.min(100,state.brightness))/100):0;
 const climate=state.climate?1200:0,standby=state.standby?80:0;
 return {lighting,climate,standby,total:lighting+climate+standby};
}
export function dailyAvoidedKwh(before: number, after: number, hours: number) { return Math.max(0,before-after)*Math.max(0,hours)/1000; }
export type EnergyCommand={type:'lights';on:boolean}|{type:'brightness';value:number}|{type:'climate';on:boolean}|{type:'standby';on:boolean}|{type:'scene';scene:'away'|'home'|'movie'}|{type:'navigate';target:'story'|'playground'|'products'}|{type:'unknown'};
export function parseEnergyCommand(raw:string):EnergyCommand {
 const s=raw.toLowerCase().replace(/[^a-z0-9%\s]/g,' ').replace(/\s+/g,' ').trim();
 if(/\b(dim|brightness)\b/.test(s)){const words:Record<string,number>={zero:0,ten:10,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,hundred:100};const named=Object.entries(words).find(([word])=>new RegExp('\\b'+word+'\\b').test(s));const n=s.match(/\b(\d{1,3})\s*%?/);return {type:'brightness',value:n?Math.max(0,Math.min(100,Number(n[1]))):(named?.[1]??30)};}
 if(/\b(lights?|lighting)\b/.test(s)){if(/\b(off|out)\b/.test(s))return {type:'lights',on:false};if(/\b(on|up)\b/.test(s))return {type:'lights',on:true};}
 if(/\b(ac|air conditioning|climate|cooling)\b/.test(s)){if(/\b(off|stop)\b/.test(s))return {type:'climate',on:false};if(/\b(on|start)\b/.test(s))return {type:'climate',on:true};}
 if(/\b(standby|plug|plugs)\b/.test(s)){if(/\b(off|stop)\b/.test(s))return {type:'standby',on:false};if(/\b(on|start)\b/.test(s))return {type:'standby',on:true};}
 if(/\b(away|leaving|save|saving|goodbye)\b/.test(s))return {type:'scene',scene:'away'};
 if(/\b(movie|cinema|evening)\b/.test(s))return {type:'scene',scene:'movie'};
 if(/\b(home|reset|morning)\b/.test(s))return {type:'scene',scene:'home'};
 if(/\b(product|products|panel|panels)\b/.test(s))return {type:'navigate',target:'products'};
 if(/\b(demo|try|control)\b/.test(s))return {type:'navigate',target:'playground'};
 if(/\b(start|story|replay)\b/.test(s))return {type:'navigate',target:'story'};
 return {type:'unknown'};
}
