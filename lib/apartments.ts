import type { DeviceId } from './devices';
// Model-space coordinates in metres. [x, z] is a floor position; [x, y, z] includes height.
// yaw turns a device so its face (local +Z) points into the room. mount snaps it after loading:
// 'wall' moves it onto the nearest surface behind it, 'surface' drops it onto whatever is below.
export type Vec2=[number,number];
export type Vec3=[number,number,number];
export type Placement={at:Vec3;yaw:number;mount?:'wall'|'surface'};
export type TvPlacement=Placement&{onConsole?:boolean;screen?:[number,number]};
export type Stop={id:string;name:string;at:Vec2;look:Vec2};
export type DevicePlacement=Placement&{view:Vec2;seenFrom:string[]};
export type ApartmentConfig={
 id:'1'|'2';name:string;rooms:number;model:string;floorY:number;ceilingY:number;
 // lit: PBR materials respond to lamps and environment; unlit: baked materials are tinted instead.
 lighting:'lit'|'unlit';
 stops:Stop[];links:[string,string][];start:string;
 devices:Record<DeviceId,DevicePlacement>;appliances:{ac:Placement;tv:TvPlacement};lamps:Vec3[];
};
export const APARTMENTS:ApartmentConfig[]=[
 {id:'2',name:'Apartment 2',rooms:5,model:'/media/models/apartment-2.glb',floorY:0,ceilingY:2.4,lighting:'unlit',start:'living',
  stops:[
   {id:'living',name:'Living',at:[-2.6,3.3],look:[-6,2.6]},
   {id:'kitchen',name:'Kitchen',at:[-2,1.2],look:[-.3,.4]},
   {id:'bedroom',name:'Bedroom',at:[-1,-.7],look:[-2.2,-2.8]},
   {id:'bedroom2',name:'Bedroom 2',at:[-3.2,-4],look:[-.8,-5]},
   {id:'bath',name:'Bath',at:[-5.4,-.6],look:[-6.2,-3.2]},
  ],
  links:[['living','kitchen'],['living','bath'],['kitchen','bedroom'],['bath','bedroom'],['bedroom','bedroom2']],
  devices:{
   'touch-panel':{at:[-5.05,1.25,.62],yaw:0,mount:'wall',view:[-4.95,1.75],seenFrom:['living']},
   'ir-blaster':{at:[-6.05,.75,2.05],yaw:Math.PI/2,mount:'surface',view:[-5,2],seenFrom:['living']},
   'smart-plug':{at:[-5.72,.35,.64],yaw:0,mount:'wall',view:[-5.55,1.6],seenFrom:['living']},
  },
  // Apartment 2 already has a TV in its west wall unit; only its screen is simulated.
  appliances:{ac:{at:[-5.7,2.08,.62],yaw:0,mount:'wall'},tv:{at:[-6.26,1.59,2.49],yaw:Math.PI/2,screen:[1.52,.86]}},
  lamps:[[-4.6,2.2,2.5],[-2,2.2,1.6],[-1.6,2.2,-1.9],[-1.6,2.2,-4.8],[-5.8,2.2,-1.6]],
 },
 {id:'1',name:'Apartment 1',rooms:8,model:'/media/models/apartment-1.glb',floorY:.15,ceilingY:2.75,lighting:'lit',start:'entrance',
  stops:[
   {id:'entrance',name:'Entrance',at:[12.8,3.6],look:[6,3.4]},
   {id:'hallway',name:'Hallway',at:[6,3.5],look:[0,3.4]},
   {id:'bedroom',name:'Bedroom',at:[10.5,2],look:[13,0]},
   {id:'bathroom',name:'Bathroom',at:[8.2,1.4],look:[7,-.6]},
   {id:'office',name:'Office',at:[3,1.3],look:[5,-1.1]},
   {id:'dining',name:'Dining',at:[.3,3.7],look:[.3,1.5]},
   {id:'kitchen',name:'Kitchen',at:[-1.2,1],look:[-2.3,-1.2]},
   {id:'living',name:'Living Room',at:[-2.4,.45],look:[-5.2,3.2]},
  ],
  links:[['entrance','hallway'],['entrance','bedroom'],['hallway','bedroom'],['hallway','office'],['hallway','dining'],['bedroom','bathroom'],['office','dining'],['office','kitchen'],['dining','kitchen'],['dining','living'],['kitchen','living']],
  devices:{
   'touch-panel':{at:[-1.2,1.35,4.3],yaw:Math.PI,mount:'wall',view:[-1.2,3.2],seenFrom:['living','dining']},
   'ir-blaster':{at:[-1.9,.6,3.2],yaw:-Math.PI/2,view:[-2.9,3.15],seenFrom:['living']},
   'smart-plug':{at:[-1.6,.45,4.3],yaw:Math.PI,mount:'wall',view:[-1.55,3.4],seenFrom:['living']},
  },
  appliances:{ac:{at:[-6.45,2.25,2.6],yaw:Math.PI/2},tv:{at:[-1.9,.15,2.5],yaw:-Math.PI/2,onConsole:true}},
  lamps:[[-4,2.4,2.4],[-1,2.4,1.5],[.3,2.4,3.4],[3,2.4,1],[6,2.4,3.5],[8.2,2.4,1],[11.5,2.4,1.5],[12.8,2.4,3.6]],
 },
];
export const apartment=(id:string)=>APARTMENTS.find(a=>a.id===id)??APARTMENTS[0];
export const findStop=(a:ApartmentConfig,id:string)=>a.stops.find(s=>s.id===id)!;
export const neighbours=(a:ApartmentConfig,id:string)=>a.links.flatMap(([x,y])=>x===id?[y]:y===id?[x]:[]);
