// Homepage content. Figures, partners and clients come from the HESEOS 2026–27 brochure (pages 2–5, 67–68); package prices come from lib/catalog.ts.
// Images in /media/home/gen are AI-generated mood photography (Higgsfield, GPT Image 2.5); product photos are real.
export const HERO={
 title:'Use less energy.',accent:'Live beautifully.',
 body:'Intelligent controls help your home use only the energy it needs, day and night, so you can keep electricity costs in check.',
 dayImage:'/media/home/hero-day.webp',nightImage:'/media/home/hero-night.webp',
};

export const WHY={
 eyebrow:'Why Heseos',title:['More than smart.','A more beautiful way to live.'],
 body:'Heseos combines intelligent hardware, intuitive software and powerful automation to create spaces that are more comfortable, secure and truly effortless.',
 cards:[
  {icon:'support',title:'Trusted Support',body:'Expert guidance from your first demo to everyday living.'},
  {icon:'hardware',title:'Premium Hardware',body:'Precision-crafted controls designed to elevate every space.'},
  {icon:'india',title:'Made in India',body:'Designed with pride. Built for homes around the world.'},
  {icon:'ecosystem',title:'Wide Ecosystem',body:'Seamless control with Alexa, Siri and Google Home, all in one app.'},
 ],
} as const;

export const SOLUTIONS_SECTION={
 eyebrow:'Our solutions',title:'Smart solutions for every space.',
 body:'From homes to hotels, offices to large enterprises, Heseos brings intelligent living to every space.',
 cards:[
  {icon:'home',title:'Smart Homes',body:'Security, convenience and comfort, together in your home.',image:'/media/home/gen/villa.webp',video:'/media/home/gen/villa.mp4',poster:'/media/home/gen/villa-poster.webp'},
  {icon:'hotel',title:'Smart Hotels',body:'Where hospitality meets the technology of tomorrow.',image:'/media/home/gen/hotel-suite.webp',video:'/media/home/gen/hotel.mp4',poster:'/media/home/gen/hotel-poster.webp'},
  {icon:'building',title:'Smart Buildings',body:'Turn real estate projects into the smart buildings of the future.',image:'/media/home/gen/residence-tower.webp',video:'/media/home/gen/building.mp4',poster:'/media/home/gen/building-poster.webp'},
  {icon:'enterprise',title:'Smart Enterprises',body:'Automate, monitor and schedule any device in your enterprise.',image:'/media/home/gen/office.webp',video:'/media/home/gen/enterprise.mp4',poster:'/media/home/gen/enterprise-poster.webp'},
 ],
} as const;

// `face` is the touch-4m photo flattened to a straight-on view of the glass; the 3D panel wears it, so its rings, sensor and logo are the real ones.
export const FEATURED={
 eyebrow:'Featured product · Heseos Touch Panel',name:'Heseos Touch Panel',model:'4 Module',title:'Control beautifully.',
 body:'Meet the Heseos Touch Panel. A seamless blend of intelligent control, precision engineering and timeless design.',
 image:'/media/products/touch-4m.webp',face:'/media/products/touch-4m-face.webp',backdrop:'/media/home/gen/spotlight.webp',detail:'/media/home/gen/touch-detail.webp',
 href:'/products/browse/smart-switches-panels/touch-panels',cta:'Explore Touch Panels',
 features:[
  {icon:'design',title:'Premium glass finish',body:'Black glass set in a slim metal frame.'},
  {icon:'touch',title:'Intuitive touch control',body:'One touch for every light, plus the Heseos app and your voice.'},
  {icon:'variants',title:'Flexible configurations',body:'Five series in 2 to 12 modules. Edge and Bezel frames come in five finishes.'},
 ],
 // The touch demo: a crop of gen/hero.webp. Each ring switches one circuit, the part of the photo that circuit lights
 // (ellipse centre and radii, % of the image). The city outside the windows stays lit whatever the room does.
 demo:{
  image:'/media/home/gen/touch-demo-room.webp',ratio:1200/1177,
  circuits:[
   {label:'Ceiling cove',zone:[50,6,62,17]},
   {label:'Floor lamp',zone:[35,48,20,40]},
   {label:'Art wall',zone:[14,45,19,32]},
   {label:'Shelves',zone:[47.5,37,10,22]},
  ],
  windows:[64,10,60],
 },
} as const;

// Each hotspot sits on the device in the photo (percentages of the image) and opens the products behind it.
export const LISTENS={
 title:'A home that listens to you.',body:'Every light, curtain, lock and appliance in one connected home, controlled by touch, app or voice.',image:'/media/home/gen/connected-home.webp',
 hotspots:[
  {label:'Smart Fan',detail:'Elegance BLDC fans with app and voice control.',x:23,y:9,href:'/products/browse/bldc-fans/elegance-series'},
  {label:'COB Downlights',detail:'Dimmable, tunable smart lighting.',x:51.5,y:16,href:'/products/browse/smart-lighting/led-cob-lighting'},
  {label:'Curtain Motor',detail:'Open the day with a touch or a schedule.',x:35,y:28,href:'/products/browse/automation-controls/curtain-automation'},
  {label:'IR Blaster',detail:'Your TV and AC remotes, in one app.',x:6.5,y:37,href:'/products/browse/smart-home-accessories/ir-blasters'},
  {label:'Touch Panel',detail:'The whole switchboard, in glass.',x:67.3,y:36,href:'/products/browse/smart-switches-panels/touch-panels'},
  {label:'Smart Door Lock',detail:'Fingerprint, PIN, card or app.',x:80,y:48,href:'/products/browse/smart-door-locks/digital-door-locks'},
  {label:'Smart Plug',detail:'Switch and measure heavy appliances.',x:65.5,y:84.5,href:'/products/browse/smart-home-accessories/smart-plugs'},
 ],
 points:[
  {icon:'control',title:'Control everything, effortlessly',body:'Lights, fans, curtains, AC and more from a single app or panel.'},
  {icon:'comfort',title:'Comfort for every moment',body:'Create the perfect mood with custom scenes and automation.'},
  {icon:'security',title:'A safer home',body:'Get real-time alerts from locks, doorbells and sensors, and remote access from anywhere.'},
  {icon:'ecosystem',title:'A truly connected ecosystem',body:'All your devices work together, beautifully.'},
 ],
} as const;

export const APP_SECTION={
 eyebrow:'Heseos app',title:'Your home in your hands.',
 body:'Control, automate and stay connected from anywhere with the Heseos app.',
 image:'/media/products/app-phone.webp',scene:'/media/home/gen/app-lifestyle.webp',
 points:[
  {icon:'anywhere',title:'Control from anywhere',body:'Your home, always with you.'},
  {icon:'scenes',title:'Create smart scenes',body:'One tap. Perfect ambience.'},
  {icon:'power',title:'Power analytics',body:'Track and save energy.'},
  {icon:'alerts',title:'Security alerts',body:'Real-time notifications.'},
  {icon:'devices',title:'Multi-device management',body:'All your devices in one app.'},
  {icon:'voice',title:'Works with Alexa, Siri, Google Home',body:'Control it with your voice.'},
 ],
} as const;

// Product families shown in the popular products rail, by catalogue slug.
export const POPULAR=['edge-panel-series','wooden-door-lock','smart-plug-16a','screen-control-panel','ir-blaster','elegance-golden-cap','chrome-cob-downlight','premium-glass-touch-switch'];

// How it works. Copy keeps to what Heseos offers today: a free demo, packages by rooms and wiring, installation, touch, app and voice.
// Images in /media/home/journey are AI-generated (Higgsfield, GPT Image 2.5) from the real Touch Panel and app photos (products/touch-4m.webp, products/app-phone.webp) as references.
export const HOW={
 eyebrow:'How it works',title:['From first conversation','to effortless living.'],body:['Four thoughtful steps.','One beautifully connected home.'],
 steps:[
  {name:'Consult',phrase:'Your space, your routines',title:'It starts with your vision.',body:'Tell us about your space, your routines and how you want your home to work.',caption:'Consultation',
   image:'/media/home/journey/consult.webp',width:1120,height:896,alt:'A Heseos consultant showing a couple the Heseos app, a Touch Panel sample on the coffee table'},
  {name:'Plan',phrase:'Free demo, right package',title:'Thoughtfully designed for your space.',body:'A free demo shows Heseos working in your home. Then we help you choose a package that fits your rooms, wiring and budget.',caption:'Planning',
   image:'/media/home/journey/plan.webp',width:1120,height:896,alt:'A floor plan marked with switch positions room by room, beside a Heseos Touch Panel and the Heseos app'},
  {name:'Install',phrase:'Fitted and connected',title:'Technology, seamlessly integrated.',body:'Your devices are installed, then set up and connected in the Heseos app.',caption:'Installation',
   image:'/media/home/journey/install.webp',width:1120,height:896,alt:'A technician fitting a Heseos Touch Panel flush to a living room wall'},
  {name:'Enjoy',phrase:'Touch, app and voice',title:'Welcome to effortless living.',body:'Lights, fans, curtains and AC, controlled by touch, from the Heseos app or with your voice.',caption:'Everyday living',
   image:'/media/home/journey/enjoy.webp',width:1120,height:896,alt:'A woman touching a Heseos Touch Panel in a warmly lit living room at night, the city beyond the windows'},
 ],
} as const;

export const PARTNERS=[{name:'Livspace',logo:'/media/clients/livspace.webp'},{name:'Square Yards',logo:'/media/clients/square-yards.webp'}];
export const CLIENTS=[
 ['mahalaxmi','Mahalaxmi'],['cosmos','Cosmos Infra Engineering'],['diligent-builders','Diligent Builders'],['dsr-group','DSR Group'],
 ['oleander-farms','Oleander Farms'],['pious-hideaways','Pious Hideaways'],['virinchi','Virinchi'],['arun-sheth','Arun Sheth & Co.'],
 ['nobroker','NoBroker Home Interiors'],['ats','ATS'],['shapoorji-pallonji','Shapoorji Pallonji'],['runwal-bliss','Runwal Bliss'],
 ['brick-and-bolt','Brick & Bolt'],['ihcl','IHCL'],['olive','Olive by Embassy'],['flipspaces','Flipspaces'],
 ['decorpot','Decorpot'],['emaar-digi-homes','Emaar Digi Homes'],['goel-ganga','Goel Ganga Developments'],['neuleaf','Neuleaf'],
 ['sumadhura','Sumadhura'],['nobility','Nobility'],['360-life','360 Life'],['niva-earthscape','Niva Earthscape'],
 ['ravima','Ravima'],['ametek','Ametek'],['escon','Escon Infra Realtor'],['sbr-group','SBR Group'],
].map(([id,name])=>({name,logo:`/media/clients/${id}.webp`}));

// Real customer quotes only. While this is empty, the homepage shows the exclusive partners in their place.
export const TESTIMONIALS:{quote:string;name:string;role:string}[]=[];

export const CTA={title:'Ready to build a smarter space?',body:'Get in touch with our experts and see Heseos working in your space.',image:'/media/home/cta-dusk.webp'};
