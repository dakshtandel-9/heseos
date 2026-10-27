// Product copy, prices and package contents come from heseos.com (/product-info/*, /diy, /shop), fetched 2026-10-21.
// Touch panels are not sold individually online; they are bought as part of a package or through a demo.
export type ProductSlug='touch-panel'|'ir-blaster'|'smart-plug';
export type Feature={title:string;body:string};
export type Product={
 slug:ProductSlug;name:string;eyebrow:string;tagline:string;summary:string;image:string;source:string;
 price:number|null;mrp:number|null;features:Feature[];specs:[string,string][];
 variants?:{id:string;label:string;image:string}[];
};
export const PRODUCTS:Product[]=[
 {slug:'touch-panel',name:'Touch Panel',eyebrow:'Touch control',tagline:'One touch. Every light.',
  summary:'Heseos touch switches automate the appliances on a switchboard from a glass panel, your phone or your voice, including appliances with an IR remote.',
  image:'/media/products/touch-4m.webp',source:'https://www.heseos.com/product-info/4m-touch',price:null,mrp:null,
  features:[
   {title:'Touch and voice',body:'Control appliances with a touch on the glass or with a voice command.'},
   {title:'Your home in your pocket',body:'Connects over your home Wi‑Fi, so you can switch off a forgotten AC even when you are not home.'},
   {title:'Know your power',body:'With the Switch + Sensor Strip package, track power consumption and spot waste room by room.'},
  ],
  specs:[['Sizes','2M, 4M, 6M, 8M, 12M and 16M modules'],['Control','Touch, Heseos app and voice assistants'],['Connectivity','Home Wi‑Fi'],['Buying','Included in Heseos Smart Packages']],
  variants:[2,4,6,8,12,16].map(m=>({id:`${m}m`,label:`${m}M`,image:`/media/products/touch-${m}m.webp`})),
 },
 {slug:'ir-blaster',name:'IR Blaster',eyebrow:'Universal remote',tagline:'One remote. Every room.',
  summary:'Automate remote-controlled appliances like your AC and TV from the Heseos app, without a drawer full of remotes.',
  image:'/media/products/ir-blaster.webp',source:'https://www.heseos.com/product-info/ir-blaster',price:3700,mrp:4584,
  features:[
   {title:'Plugs in anywhere',body:'Plug it into any USB outlet, even a phone charger, then add your remotes in the app.'},
   {title:'A universal remote',body:'Keep adding remotes for your appliances and operate all of them from your smartphone.'},
   {title:'Works with your assistant',body:'The Heseos app works with voice assistants such as Siri, Bixby, Alexa and Google Assistant.'},
  ],
  specs:[['Power','Any USB outlet'],['Controls','Infrared remote-controlled appliances'],['Voice','Siri, Bixby, Alexa, Google Assistant via the app'],['Design','Advanced firmware, rugged hardware']],
 },
 {slug:'smart-plug',name:'Smart Plug',eyebrow:'16A energy plug',tagline:'See every watt.',
  summary:'Switch heavy appliances like an AC or geyser from your phone, and track the power they use, even when you are away.',
  image:'/media/products/smart-plug.webp',source:'https://www.heseos.com/product-info/16a-plug',price:3500,mrp:4248,
  features:[
   {title:'Built for heavy appliances',body:'A 16A plug for appliances like your AC and geyser. Plug in, then control from the app.'},
   {title:'Track power consumption',body:'Monitor the power used in your rooms, compare it, and keep an eye on waste.'},
   {title:'Light. Compact. Safe.',body:'A compact, light design with a ceramic socket for safe conduction and performance.'},
  ],
  specs:[['Rating','16A'],['Monitoring','Power consumption in the Heseos app'],['Socket','Ceramic'],['Control','App, voice and remote access over Wi‑Fi']],
 },
];
export const product=(slug:string)=>PRODUCTS.find(p=>p.slug===slug);

export type PackageType='retrofit'|'touch-switch'|'touch-panel';
export type Tier='starter'|'standard'|'premium';
export const PACKAGE_TYPES:{id:PackageType;name:string;summary:string;switchItem:string}[]=[
 {id:'retrofit',name:'Retrofit Module',summary:'Make your existing switches smart with a retrofit module.',switchItem:'4 on/off Retrofit Switch'},
 {id:'touch-switch',name:'Modular Touch Switch',summary:'Upgrade mechanical switches to smart modular touch switches.',switchItem:'4 Touch Modular Switch'},
 {id:'touch-panel',name:'Modular Touch Panel',summary:'The full glass experience with modular touch panels.',switchItem:'6M Glass Touch Panel'},
];
export const TIERS:{id:Tier;name:string}[]=[{id:'starter',name:'Starter'},{id:'standard',name:'Standard'},{id:'premium',name:'Premium'}];
export const BHKS=[1,2,3] as const;
export type Bhk=typeof BHKS[number];
// [type][bhk - 1][tier] = [mrp, price, switches, IR blasters, smart plugs]
const PACKAGE_DATA:Record<PackageType,[number,number,number,number,number][][]>={
 retrofit:[[[17999,11699,2,0,0],[23999,15599,2,2,0],[27999,18199,2,2,1]],[[21999,14299,3,0,0],[31999,20799,3,3,0],[39999,25999,3,3,2]],[[27999,18199,4,0,0],[43999,28599,5,4,0],[71999,36399,5,4,3]]],
 'touch-switch':[[[21999,14299,2,0,0],[27999,18199,2,2,0],[31999,20799,2,2,1]],[[35999,23399,4,0,0],[43999,28599,4,3,0],[51999,33799,4,3,2]],[[49999,24999,4,0,0],[61999,30999,4,3,0],[71999,35999,4,3,2]]],
 'touch-panel':[[[43999,28599,2,0,0],[49999,32499,2,2,0],[53999,35099,2,2,1]],[[61999,40299,3,0,0],[69999,45499,3,3,0],[77999,50699,3,3,2]],[[79999,51999,4,0,0],[91999,59799,4,4,0],[101999,66299,4,4,3]]],
};
export type Package={id:string;type:PackageType;bhk:Bhk;tier:Tier;name:string;mrp:number;price:number;items:{name:string;qty:number}[]};
export function getPackage(type:PackageType,bhk:Bhk,tier:Tier):Package{
 const [mrp,price,switches,blasters,plugs]=PACKAGE_DATA[type][bhk-1][TIERS.findIndex(t=>t.id===tier)];
 const info=PACKAGE_TYPES.find(t=>t.id===type)!;
 const items=[{name:info.switchItem,qty:switches},{name:'IR Blaster',qty:blasters},{name:'Smart Plug',qty:plugs}].filter(i=>i.qty>0);
 return {id:`pkg:${type}:${bhk}:${tier}`,type,bhk,tier,name:`${bhk} BHK ${info.name} · ${TIERS.find(t=>t.id===tier)!.name}`,mrp,price,items};
}
export function parsePackageId(id:string){
 const [,type,bhk,tier]=id.split(':');
 if(!PACKAGE_TYPES.some(t=>t.id===type)||!BHKS.includes(Number(bhk) as Bhk)||!TIERS.some(t=>t.id===tier))return null;
 return getPackage(type as PackageType,Number(bhk) as Bhk,tier as Tier);
}

// No retrofit module photo is available yet; the UI shows a labelled placeholder.
export const PACKAGE_IMAGE:Record<PackageType,string|null>={retrofit:null,'touch-switch':'/media/products/touch-4m.webp','touch-panel':'/media/products/touch-6m.webp'};

export type BagLine={id:string;qty:number};
export type BagEntry={id:string;qty:number;name:string;detail:string;price:number;mrp:number;image:string|null;href:string};
// A bag line id is a product slug or a package id; anything else is ignored.
export function resolveBagLine(line:BagLine):BagEntry|null{
 const pkg=line.id.startsWith('pkg:')?parsePackageId(line.id):null;
 if(pkg)return {...line,name:pkg.name,detail:pkg.items.map(i=>`${i.qty} × ${i.name}`).join(' · '),price:pkg.price,mrp:pkg.mrp,image:PACKAGE_IMAGE[pkg.type],href:`/packages?type=${pkg.type}&bhk=${pkg.bhk}`};
 const p=product(line.id);
 if(!p||p.price===null||p.mrp===null)return null;
 return {...line,name:p.name,detail:p.eyebrow,price:p.price,mrp:p.mrp,image:p.image,href:`/products/${p.slug}`};
}
export const formatINR=(value:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);

// Build-your-smart-home: switches are always included; climate and TV control add IR Blasters (Standard),
// energy tracking adds Smart Plugs (Premium).
export type Priority='climate'|'energy';
export const recommendTier=(priorities:Priority[]):Tier=>priorities.includes('energy')?'premium':priorities.includes('climate')?'standard':'starter';
