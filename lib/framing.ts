import { MathUtils, Vector3 } from 'three';

// Normalized safe area within the full-bleed hero, clear of copy and controls.
export function getTourFrame(width:number,height:number){
 const portrait=width<=760;
 return portrait
  ? {width:.92,height:height<760?.29:.34,x:.5,y:height<760?.685:.67}
  : {width:.55,height:.63,x:.695,y:.53};
}

export function fitTourCamera(target:Vector3,direction:Vector3,bounds:{min:Vector3;max:Vector3},aspect:number,frame:{width:number;height:number},fov=34){
 const forward=direction.clone().normalize();
 const right=new Vector3(0,1,0).cross(forward).normalize();
 const up=forward.clone().cross(right).normalize();
 const tan=Math.tan(MathUtils.degToRad(fov/2));
 let distance=0;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
  const relative=new Vector3(x,y,z).sub(target),depth=relative.dot(forward);
  distance=Math.max(distance,depth+Math.abs(relative.dot(right))/(tan*aspect*frame.width),depth+Math.abs(relative.dot(up))/(tan*frame.height));
 }
 return target.clone().addScaledVector(forward,distance*1.025);
}
