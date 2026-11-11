import { SUBCATEGORIES, family, familyHref, type Product } from './products';

// Every entry is a brochure product family in data/products.json; a collection entry is one finish of its family.
export type DirectoryProduct = {slug:string;name:string;familySlug:string;collection?:string};
export type DirectorySubcategory = {slug:string;name:string;products:DirectoryProduct[]};
export type DirectoryCategory = {slug:string;name:string;icon:'panels'|'lock'|'video'|'lighting'|'fan'|'security'|'plug'|'home';subcategories:DirectorySubcategory[]};

const item=(slug:string,name:string,familySlug=slug,collection?:string):DirectoryProduct=>({slug,name,familySlug,collection});

// The 8 / 14 / 40 browsing hierarchy supplied for the Products directory.
// Entries can share a brochure family when they are distinct finishes or product types.
export const PRODUCT_DIRECTORY:DirectoryCategory[]=[
 {slug:'smart-switches-panels',name:'Smart Switches & Panels',icon:'panels',subcategories:[
  {slug:'touch-panels',name:'Touch Panels',products:[
   item('magnetic-touch-panel','Magnetic Touch Panel (TPM)'),
   item('touch-panel-series','Touch Panel Series (TP)'),
   item('edge-panel-series','Edge Panel Series (TEA)'),
   item('bezzel-panel-series','Bezzel Panel Series (TPB)'),
   item('k-panel-series','K Panel Series (TPK)'),
  ]},
  {slug:'retrofit-modules',name:'Retrofit Modules',products:[item('smart-retrofit-module','Smart Retrofit Module','retrofit-module')]},
  {slug:'modular-switches',name:'Modular Switches',products:[item('smart-modular-switch','Smart Modular Switch','modular-smart-switch')]},
  {slug:'premium-glass-touch-switches',name:'Premium Glass Touch Switches',products:[
   item('glass-touch-switches','Glass Touch Switches','premium-glass-touch-switch','glass'),
   item('premium-brushed-touch-switches','Premium Brushed Touch Switches','premium-glass-touch-switch','brushed'),
   item('premium-textured-touch-switches','Premium Textured Touch Switches','premium-glass-touch-switch','textured'),
   item('premium-leather-touch-switches','Premium Leather Touch Switches','premium-glass-touch-switch','leather'),
  ]},
 ]},
 {slug:'smart-door-locks',name:'Smart Door Locks',icon:'lock',subcategories:[
  {slug:'digital-door-locks',name:'Digital Door Locks',products:[
   item('drawer-lock','Drawer Lock'),
   item('glass-door-lock','Glass Door Lock'),
   item('sliding-door-lock','Sliding Door Lock'),
   item('wooden-door-lock','Wooden Door Lock'),
   item('screen-door-lock','Screen Door Lock'),
   item('lever-door-lock','Lever Door Lock'),
  ]},
 ]},
 {slug:'video-door-phones-doorbells',name:'Video Door Phones & Doorbells',icon:'video',subcategories:[
  {slug:'smart-vdp-doorbells',name:'Smart VDP & Doorbells',products:[
   item('ip-video-door-phone','IP Video Door Phone (HL)'),
   item('analog-video-door-phone','Analog Video Door Phone (HS)'),
   item('smart-doorbell','Smart Doorbell'),
  ]},
 ]},
 {slug:'smart-lighting',name:'Smart Lighting',icon:'lighting',subcategories:[
  {slug:'led-cob-lighting',name:'LED & COB Lighting',products:[
   item('chrome-cob-downlight','Chrome Smart COB Downlight'),
   item('roundo-cob-downlight','Roundo Smart COB Downlight'),
   item('deep-cob-downlight','Deep COB Smart Downlight'),
   item('smart-tubelight','Smart Tubelight','motion-sensor-t8-tubelight'),
  ]},
 ]},
 {slug:'bldc-fans',name:'BLDC Fans',icon:'fan',subcategories:[
  {slug:'elegance-series',name:'Elegance Series',products:[
   item('elegance-base','Elegance Base Model'),
   item('elegance-golden-cap','Elegance Golden Cap'),
   item('elegance-gold-black-marble','Elegance Gold Black Marble'),
   item('elegance-silver-wood','Elegance Silver Wood'),
   item('elegance-gold-plywood','Elegance Gold Plywood'),
   item('elegance-white-cap','Elegance White Cap'),
  ]},
 ]},
 {slug:'security-sensors',name:'Security & Sensors',icon:'security',subcategories:[
  {slug:'smart-sensors',name:'Smart Sensors',products:[
   item('microwave-motion-sensor','Microwave Motion Sensor'),
   item('pir-motion-sensor','PIR Motion Sensor'),
   item('gas-leak-sensor','Smart Gas Leak Sensor with Inbuilt Screen'),
   item('smoke-detector','Smart Smoke Detector'),
   item('human-presence-sensor','Human Presence Motion Sensor'),
  ]},
 ]},
 {slug:'smart-home-accessories',name:'Smart Home Accessories',icon:'plug',subcategories:[
  {slug:'smart-plugs',name:'Smart Plugs',products:[item('wi-fi-smart-plug','Wi-Fi Smart Plug','smart-plug-16a')]},
  {slug:'ir-blasters',name:'IR Blasters',products:[item('smart-ir-blaster','Smart IR Blaster','ir-blaster')]},
  {slug:'energy-meters',name:'Energy Meters',products:[
   item('three-phase-energy-meter','Three Phase Energy Meter'),
  ]},
 ]},
 {slug:'automation-controls',name:'Automation & Controls',icon:'home',subcategories:[
  {slug:'curtain-automation',name:'Curtain Automation',products:[item('smart-curtain-motor','Smart Curtain Motor','curtain-blind-motor')]},
  {slug:'screen-control-panels',name:'Screen Control Panels',products:[item('smart-screen-control-panel','Smart Screen Control Panel','screen-control-panel')]},
 ]},
];

export const directoryCategory=(slug:string)=>PRODUCT_DIRECTORY.find(c=>c.slug===slug);
export const directorySubcategory=(categorySlug:string,subSlug:string)=>directoryCategory(categorySlug)?.subcategories.find(s=>s.slug===subSlug);
export function directorySource(product:DirectoryProduct):Product{
 const p=family(product.familySlug);if(!p)throw new Error(`${product.name}: no product family "${product.familySlug}" in data/products.json`);
 return p;
}
export const directoryCategoryHref=(category:DirectoryCategory)=>'/products/browse/'+category.slug;
export const directorySubcategoryHref=(category:DirectoryCategory,sub:DirectorySubcategory)=>directoryCategoryHref(category)+'/'+sub.slug;
// The directory range that lists a brochure family, so pages keyed by brochure category link into the directory.
export function directoryTrail(familySlug:string){
 for(const c of PRODUCT_DIRECTORY)for(const s of c.subcategories)if(s.products.some(p=>p.familySlug===familySlug))return {category:c,subcategory:s};
}
// Where a brochure category or subcategory lives in the directory: the range of its first listed family.
export function directoryHrefFor(familySlugs:string[],level:'category'|'subcategory'){
 const t=familySlugs.map(directoryTrail).find(Boolean);if(!t)return '/products';
 return level==='category'&&t.category.subcategories.length>1?directoryCategoryHref(t.category):directorySubcategoryHref(t.category,t.subcategory);
}
// Products open their family's page; a collection opens it with that collection chosen.
export const directoryProductHref=(product:DirectoryProduct)=>familyHref(directorySource(product))+(product.collection?'?collection='+product.collection:'');
// Every directory product has a clean studio shot (public/media/products/studio/<slug>.webp), generated from its brochure photo.
export const directoryProductImage=(product:DirectoryProduct)=>`/media/products/studio/${product.slug}.webp`;
export const directoryCounts=()=>({
 categories:PRODUCT_DIRECTORY.length,
 subcategories:PRODUCT_DIRECTORY.reduce((n,c)=>n+c.subcategories.length,0),
 products:PRODUCT_DIRECTORY.reduce((n,c)=>n+c.subcategories.reduce((m,s)=>m+s.products.length,0),0),
});
export const directoryProducts=(category:DirectoryCategory)=>category.subcategories.flatMap(s=>s.products);

// The brochure families behind a subcategory, each once, and the catalogue subcategories (taglines, descriptions, FAQs) they come from.
export const directoryFamilies=(sub:DirectorySubcategory)=>[...new Map(sub.products.map(p=>[p.familySlug,directorySource(p)])).values()];
export const directoryCatalogSubcategories=(sub:DirectorySubcategory)=>[...new Set(directoryFamilies(sub).map(f=>f.subcategory))].map(slug=>SUBCATEGORIES.find(s=>s.slug===slug)!);
// The image the Products page uses for a subcategory's range card.
export const directoryRangeImage=(sub:DirectorySubcategory)=>`/media/products-page/${sub.slug}.webp`;
