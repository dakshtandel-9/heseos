import { MathUtils, Vector3 } from 'three';
export const TOUR_STOP_COUNT=5;
export const TOUR_POSES=[
 {camera:[11.5,10.2,34],target:[0,4.6,0]},
 {camera:[1.8,5.65,10.8],target:[0,4.65,-.6]},
 {camera:[.7,9.35,9.2],target:[0,8.8,-2.3]},
 {camera:[8.7,2.3,9.5],target:[7,1.65,-2.3]},
 {camera:[-13,13,32],target:[0,4.6,0]},
];
const TOUR_BOUNDS=[
 {min:[-12.75,-.895,-5.7],max:[12.75,11.578,8.66]},
 {min:[-3.4,3.3,-3.25],max:[3.4,6.55,3.5]},
 {min:[-3.4,6.6,-3.25],max:[3.4,9.85,3.5]},
 {min:[3.6,0,-3.25],max:[10.4,3.25,3.5]},
 {min:[-12.75,-.895,-5.7],max:[12.75,11.578,8.66]},
];
export function getTourPose(progress:number,reduced=false){
 const p=MathUtils.clamp(progress,0,1);const stop=Math.min(4,Math.floor(p*5));const local=p*5-stop;
 const alpha=stop===0?1:reduced?1:MathUtils.smoothstep(local,0,.52);
 const before=TOUR_POSES[Math.max(0,stop-1)],after=TOUR_POSES[stop];
 const previousBounds=TOUR_BOUNDS[Math.max(0,stop-1)],nextBounds=TOUR_BOUNDS[stop];
 const bounds={min:new Vector3(...previousBounds.min as [number,number,number]).lerp(new Vector3(...nextBounds.min as [number,number,number]),alpha),max:new Vector3(...previousBounds.max as [number,number,number]).lerp(new Vector3(...nextBounds.max as [number,number,number]),alpha)};
 return {stop,bounds,camera:new Vector3(...before.camera as [number,number,number]).lerp(new Vector3(...after.camera as [number,number,number]),alpha),target:new Vector3(...before.target as [number,number,number]).lerp(new Vector3(...after.target as [number,number,number]),alpha)};
}
