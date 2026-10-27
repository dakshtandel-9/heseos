import type { PowerState } from './energy';

// All lamps, strips and room lights share this level; AC and TV power remain independent.
export function getHouseLighting(power:PowerState){
 const level=power.lights?Math.max(0,Math.min(100,power.brightness))/100:0;
 return {level,pointIntensity:36*level,emission:3*level,ambient:.32+1.43*level,sun:2.2*level,moon:1.1+1.1*level};
}
