// One source for the global navigation, its flyouts and the footer sitemap.
export type NavLink={label:string;href:string};
export type NavGroup={title:string;big?:boolean;links:NavLink[]};
export type NavItem={label:string;href:string;groups?:NavGroup[]};
export const NAV:NavItem[]=[
 {label:'Store',href:'/store',groups:[
  {title:'Shop',big:true,links:[{label:'Shop all',href:'/store'},{label:'Smart Packages',href:'/packages'},{label:'Compare packages',href:'/compare'}]},
  {title:'Quick links',links:[{label:'Bag',href:'/bag'},{label:'Book a free demo',href:'/demo'},{label:'Build your smart home',href:'/build'}]},
 ]},
 {label:'Touch Panel',href:'/products/touch-panel',groups:[
  {title:'Explore Touch Panel',big:true,links:[{label:'Touch Panel',href:'/products/touch-panel'},{label:'Try it in the simulation',href:'/experience'}]},
  {title:'Shop Touch Panel',links:[{label:'Choose a package',href:'/store/buy/touch-panel'},{label:'Sizes 2M to 16M',href:'/products/touch-panel#specs'}]},
 ]},
 {label:'IR Blaster',href:'/products/ir-blaster',groups:[
  {title:'Explore IR Blaster',big:true,links:[{label:'IR Blaster',href:'/products/ir-blaster'},{label:'Try it in the simulation',href:'/experience'}]},
  {title:'Shop IR Blaster',links:[{label:'Buy IR Blaster',href:'/store/buy/ir-blaster'},{label:'Tech specs',href:'/products/ir-blaster#specs'}]},
 ]},
 {label:'Smart Plug',href:'/products/smart-plug',groups:[
  {title:'Explore Smart Plug',big:true,links:[{label:'Smart Plug',href:'/products/smart-plug'},{label:'Try it in the simulation',href:'/experience'}]},
  {title:'Shop Smart Plug',links:[{label:'Buy Smart Plug',href:'/store/buy/smart-plug'},{label:'Tech specs',href:'/products/smart-plug#specs'}]},
 ]},
 {label:'Simulation',href:'/experience',groups:[
  {title:'Step inside',big:true,links:[{label:'The Heseos Simulation',href:'/experience'},{label:'Saving Power story',href:'/saving-power'}]},
  {title:'Choose a home',links:[{label:'Apartment 1 · 8 rooms',href:'/experience?apartment=1'},{label:'Apartment 2 · 5 rooms',href:'/experience?apartment=2'}]},
 ]},
 {label:'Solutions',href:'/solutions',groups:[
  {title:'Solutions',big:true,links:[{label:'Smart Home',href:'/solutions/home'},{label:'Smart Hotel',href:'/solutions/hotel'},{label:'Smart Buildings',href:'/solutions/buildings'},{label:'Smart Enterprise',href:'/solutions/enterprise'}]},
 ]},
 {label:'App',href:'/app'},
 {label:'Support',href:'/support'},
];
export const FOOTER:NavGroup[]=[
 {title:'Shop and Learn',links:[{label:'Store',href:'/store'},{label:'Touch Panel',href:'/products/touch-panel'},{label:'IR Blaster',href:'/products/ir-blaster'},{label:'Smart Plug',href:'/products/smart-plug'},{label:'Smart Packages',href:'/packages'},{label:'Compare',href:'/compare'}]},
 {title:'Experience',links:[{label:'The Simulation',href:'/experience'},{label:'Saving Power story',href:'/saving-power'},{label:'Heseos App',href:'/app'},{label:'Build your smart home',href:'/build'}]},
 {title:'Solutions',links:[{label:'Smart Home',href:'/solutions/home'},{label:'Smart Hotel',href:'/solutions/hotel'},{label:'Smart Buildings',href:'/solutions/buildings'},{label:'Smart Enterprise',href:'/solutions/enterprise'}]},
 {title:'About Heseos',links:[{label:'About',href:'/about'},{label:'Projects',href:'/projects'},{label:'Blog',href:'/blog'},{label:'Support',href:'/support'}]},
 {title:'Get in touch',links:[{label:'Book a free demo',href:'/demo'},{label:'heseos.com',href:'https://www.heseos.com'}]},
];
// The Saving Power story ships its own global stylesheet, so links to it are full page loads.
export const isDocumentLink=(href:string)=>href.startsWith('/saving-power')||href.startsWith('http');
