// Homepage content. Figures, partners and clients come from the HESEOS 2026–27 brochure (pages 2–5, 67–68); package prices come from lib/catalog.ts.
// Images in /media/home/gen are AI-generated mood photography (Higgsfield, GPT Image 2.5); product photos are real.
export const HERO={
 eyebrow:'Energy · Security · Automation',
 title:'Infinite Responsibility',accent:'and Infinite Possibility.',
 body:'Switches, locks, sensors, fans and lighting that save power and keep watch, so your home looks after itself. All on one app.',
 proof:'Trusted in 9,000+ homes, offices and hotels',
};

// Hero background: a city of homes going from blue hour to night as the visitor scrolls, every home's lights switching on.
// Generated with Higgsfield (GPT Image 2.6 start and end stills → Kling 3.0 timelapse), then cut into frames that scroll plays.
// `count` frames live at `${dir}/${n}.webp` (desktop, 16:9) and `${dir}/m/${n}.webp` (phones, centre crop), n = 000….
export const HERO_CITY={dir:'/media/home/city',count:72,width:1600,height:900,mWidth:720,mHeight:960};

// The hero's turning arc shows the eight product categories, each linking to its page. Photos are from "a day in one Heseos home".
export type HeroCard={name:string;href:string;image:string};
const browse=(slug:string)=>`/products/browse/${slug}`;
export const HERO_CARDS:HeroCard[]=[
 {name:'Door Locks',href:browse('smart-door-locks'),image:'/media/home/day/01-lock.webp'},
 {name:'Switches & Panels',href:browse('smart-switches-panels'),image:'/media/home/day/02-panel.webp'},
 {name:'Automation',href:browse('automation-controls'),image:'/media/home/day/03-curtain.webp'},
 {name:'Video Door Phones',href:browse('video-door-phones-doorbells'),image:'/media/home/day/04-bell.webp'},
 {name:'BLDC Fans',href:browse('bldc-fans'),image:'/media/home/day/05-fan.webp'},
 {name:'Security & Sensors',href:browse('security-sensors'),image:'/media/home/day/06-gas.webp'},
 {name:'Lighting',href:browse('smart-lighting'),image:'/media/home/day/07-light.webp'},
 {name:'Accessories',href:browse('smart-home-accessories'),image:'/media/home/day/08-plug.webp'},
];

// "What we've done so far": brochure figures (CATALOG_META.stats, same order), each with one line of context.
export const NUMBERS={
 eyebrow:'What we have done so far',
 title:['Fifteen years.','Nine thousand homes.','One promise kept.'],
 body:'Every number here is a home, an office or a hotel that now uses less electricity and worries less.',
 details:[
  'Designing switches, controls and lighting that do more with less power.',
  'Families, offices and hotels that see what they use, and use only what they need.',
  'Panels, locks, sensors, fans and lights on duty every day.',
  'Residences and hotels beyond India, built on Heseos systems.',
 ],
 // Candid 35mm-style photos, one per figure (Higgsfield, GPT Image 2.6; the panel shots use the Edge Panel studio photo as reference).
 photos:[
  {src:'/media/home/numbers/years.webp',alt:'An engineer’s hands soldering a switch circuit board under a brass desk lamp in a small workshop'},
  {src:'/media/home/numbers/homes.webp',alt:'An apartment building in Pune at night, its balcony windows glowing warm'},
  {src:'/media/home/numbers/devices.webp',alt:'An electrician’s hands fitting a black glass Heseos Edge touch panel into a freshly plastered wall'},
  {src:'/media/home/numbers/abroad.webp',alt:'A Heseos Edge touch panel on a walnut wall beside a hotel bed, a coastal city skyline at night through the window'},
 ],
};

// The hero's app tour. Screens are real screenshots of the Heseos app (/media/home/app); chapters follow its five tabs.
// `tap` is where a finger lands (as % of the screen) to reach that screen. Card figures are read off the same screenshots.
export const APP_TOUR={
 chapters:[
  {tab:'Home',title:'Your whole home, on one screen.',body:'Today’s power use, what is on and off, and your favourite scenes and switches, the moment you open the app.',
   screens:[{src:'/media/home/app/home.webp',alt:'Heseos app home screen: today’s power consumption chart, device status, scene and switch shortcuts',tap:[5.6,95]},{src:'/media/home/app/fan.webp',alt:'Fan speed slider, opened by holding the fan shortcut',tap:[50,76]}],
   cards:[{icon:'zap',label:'Today’s power',value:'3.51 units',spark:true},{icon:'fan',label:'Fan · Living Room',value:'Hold to set speed',bar:.68},{icon:'bulb',label:'Scene shortcut',value:'Start Home Theatre',sub:'8 devices'}]},
  {tab:'Devices',title:'Every room, at a glance.',body:'Each room on its own card, with its devices and their status, a lock, and one tap to switch the whole room off.',
   screens:[{src:'/media/home/app/devices.webp',alt:'Devices screen: room cards for the living room, home theatre, master bedroom, kitchen, guest bathroom and pantry',tap:[23.6,95]}],
   cards:[{icon:'sofa',label:'Living Room',value:'9 devices'},{icon:'bed',label:'Master Bedroom',value:'13 devices'},{icon:'lock',label:'Room lock',value:'One tap to lock'}]},
  {tab:'Automations',title:'Scenes and routines that run themselves.',body:'Good Morning at 7:45, the evening scene at 7:30, Good night with one tap. Lights, fans and screens, set together.',
   screens:[{src:'/media/home/app/scenes.webp',alt:'Automations screen: Good Morning and evening routines, and scenes for the home theatre, good night and good morning',tap:[47.2,95]}],
   cards:[{icon:'sunrise',label:'Routine',value:'Good Morning',sub:'7:45 AM · 7 devices'},{icon:'moon',label:'Scene',value:'Good night',sub:'7 devices'},{icon:'film',label:'Scene',value:'Start Home Theatre',sub:'8 devices'}]},
  {tab:'Remotes',title:'Every remote, in your pocket.',body:'Your AC, TV and set-top box, with the buttons you already know. Change the temperature or set a schedule from the sofa.',
   screens:[{src:'/media/home/app/ac.webp',alt:'AC remote: 18 °C, cool mode, auto fan speed, power, mode and schedule buttons',tap:[71.5,95]},{src:'/media/home/app/tv.webp',alt:'TV remote: power, input, menu, channel, volume, mute and direction pad'},{src:'/media/home/app/dth.webp',alt:'Set-top box remote: power, mute, volume, channel, direction pad, keypad and playback buttons'}],
   cards:[{icon:'snow',label:'AC',value:'18 °C · Cool',sub:'Fan speed auto'},{icon:'tv',label:'TV and set-top box',value:'Vol · Ch · OK'},{icon:'alarm',label:'AC schedule',value:'On and off on time'}]},
  {tab:'Settings',title:'Set up your way.',body:'Homes, rooms, devices, remotes and routines, plus widgets, voice control and app language, all in Settings.',
   screens:[{src:'/media/home/app/settings.webp',alt:'Settings screen: homes, rooms, devices, remotes, schedules, FAQ, support, widgets, voice control and app language',tap:[92.3,95]}],
   cards:[{icon:'mic',label:'Voice control',value:'Alexa · Google · Siri'},{icon:'grid',label:'Widgets',value:'On your home screen'},{icon:'lang',label:'App language',value:'Pick yours'}]},
 ],
 outro:{title:'Get the Heseos app.',body:'One app for every switch, lock, sensor, fan and remote in your home. On iPhone and Android.'},
};

// "A day in one Heseos home": one category per moment, 6 AM to 11:30 PM. Photos generated with Higgsfield (GPT Image 2.6)
// from the real studio shots in /media/products/studio, styled as 35mm documentary film in a lived-in Pune flat.
export const DAY={
 eyebrow:'A day in one Heseos home',
 title:'Eight categories. One ordinary, well-run day.',
 moments:[
  {time:'06:10',slug:'smart-door-locks',name:'Door Locks',line:'Out for a walk before the city wakes. One thumb on the lock, no keys to find.',image:'/media/home/day/01-lock.webp',alt:'A hand in a grey kurta sleeve pressing a thumb on a black Heseos smart lever lock on a teak door, a shoe rack and newspaper beside it'},
  {time:'07:40',slug:'smart-switches-panels',name:'Switches & Panels',line:'Chai on the stove, tiffins half packed. One tap on the glass for the kitchen lights.',image:'/media/home/day/02-panel.webp',alt:'A fingertip tapping a black glass Heseos touch panel on a kitchen wall, chai on the stove and a tiffin on the counter'},
  {time:'09:30',slug:'automation-controls',name:'Automation',line:'The curtains open on schedule, while the newspaper is still being read.',image:'/media/home/day/03-curtain.webp',alt:'Printed curtains opening on a motorised track in a sunlit living room as an older man reads the newspaper'},
  {time:'11:20',slug:'video-door-phones-doorbells',name:'Video Door Phones',line:'A parcel at the door. See who it is before anyone gets up.',image:'/media/home/day/04-bell.webp',alt:'A delivery person with a parcel pressing a black Heseos video doorbell beside a door with a marigold toran'},
  {time:'14:15',slug:'bldc-fans',name:'BLDC Fans',line:'The afternoon nap, under a fan that runs quietly on far less power.',image:'/media/home/day/05-fan.webp',alt:'A brown and gold Heseos BLDC ceiling fan turning over a child napping in a bedroom on a hot afternoon'},
  {time:'17:40',slug:'security-sensors',name:'Security & Sensors',line:'Dinner prep begins. A sensor keeps watch over the gas.',image:'/media/home/day/06-gas.webp',alt:'A Heseos gas leak sensor with a glowing screen on the tiled wall above a stove with a pressure cooker'},
  {time:'20:15',slug:'smart-lighting',name:'Lighting',line:'Everyone at the table, under warm light that is just bright enough.',image:'/media/home/day/07-light.webp',alt:'Hands passing a bowl of dal across a dining table lit by recessed Heseos COB downlights'},
  {time:'23:30',slug:'smart-home-accessories',name:'Accessories',line:'Lights out. The smart plug shows what is still drawing power, and switches it off.',image:'/media/home/day/08-plug.webp',alt:'A white Heseos smart plug with a green status light in a wall socket in a dark living room'},
 ],
};

// "Our story in numbers": one chapter per catalogue stat, in CATALOG_META.stats order. Images generated (Higgsfield, GPT Image).
export const STORY={
 eyebrow:'Our story, in numbers',
 title:'Fifteen years of making electricity work harder.',
 body:'Every number below is a home, a building or a project that now uses less, and worries less.',
 chapters:[
  {title:'It started with a switch.',body:'For over fifteen years we have designed switches, controls and lighting that do more with less electricity.',image:'/media/home/story/years.webp'},
  {title:'9,000 homes said yes.',body:'Families, offices and hotels that now see what they use, and use only what they need.',image:'/media/home/story/customers.webp'},
  {title:'A lakh devices, on duty.',body:'Panels, locks, sensors, fans and lights working every day, quietly cutting waste and keeping watch.',image:'/media/home/story/devices.webp'},
  {title:'Made in India. Trusted abroad.',body:'Heseos systems now light, secure and automate projects beyond India, from private residences to hotels.',image:'/media/home/story/global.webp'},
 ],
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
