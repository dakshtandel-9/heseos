import { DoorClosed, Fingerprint, Hand, KeyRound, Layers, Mic, Palette, Ruler, Smartphone, Wrench, type LucideIcon } from 'lucide-react';
// Content for the Apple-style category stories (CategoryStory). A category with an entry here opens with its story;
// the rest keep the standard category page. Facts are from the 2026–27 brochure (data/products.json).
// Scene images are generated and illustrative, made from each category's studio shots (see public/media/browse/category/<slug>/).
export type StoryFact={icon:LucideIcon;text:string};
export type CategoryStoryContent={
 hero:{headline:string;sub:string;alt:string};
 statement:string;
 scene?:{day:string;night:string;dayAlt:string;nightAlt:string;caps:[{time:string;title:string;body:string},{time:string;title:string;body:string}]};
 // A pinned film scrubbed by scroll, in place of the day/night scene. Each caption shows while the film's run (0–1) is between from and to.
 film?:{title:string;film:string;filmSmall:string;poster:string;still:string;alt:string;caps:{time?:string;title:string;body:string;from:number;to:number}[]};
 // `range` items are subcategory slugs, pictured by `image` (a studio shot slug); `product` items are directory products, pictured by their own studio shot.
 lineup:{title:string;kind:'range'|'product';items:{slug:string;image?:string;kicker:string;facts:StoryFact[]}[]};
 control:{eyebrow:string;title:string;image:string;alt:string;tiles:{icon:LucideIcon;title:string;body:string}[]};
 sizes?:{title:[string,string];image:string;alt:string};
 // One product taken apart on a loop, in place of the hero still (ExplodeHero). `product` is a directory product slug;
 // each part's x/y is its pin, in percent of the film's 16:9 frame on the exploded (last) frame.
 explode?:{product:string;film:string;filmSmall:string;poster:string;still:string;parts:{title:string;body:string;x:number;y:number}[]};
};

export const STORIES:Record<string,CategoryStoryContent>={
 'smart-switches-panels':{
  hero:{headline:'Built smart, inside and out.',sub:'Open up the Heseos Three Phase Energy Meter. It tracks every unit in real time and warns you when use crosses your thresholds.',alt:'The Heseos Three Phase Energy Meter opening into an exploded view: printed lid, green control board and white enclosure'},
  explode:{product:'three-phase-energy-meter',film:'/media/browse/category/smart-switches-panels/explode.mp4',filmSmall:'/media/browse/category/smart-switches-panels/explode-720.mp4',poster:'/media/browse/category/smart-switches-panels/explode-poster.webp',still:'/media/browse/category/smart-switches-panels/explode-open.webp',parts:[
   {title:'Marked lid',body:'Every terminal labelled: B, Y, R, N, line in and out.',x:56.5,y:23.5},
   {title:'Three CT inputs',body:'R, Y and B: a current input for each phase.',x:87.5,y:12},
   {title:'Control board',body:'Real-time energy tracking and relay control.',x:65.8,y:48.7},
   {title:'Vented enclosure',body:'A compact housing that closes over the board.',x:52.7,y:69.3},
  ]},
  statement:'Every light, fan, curtain and scene. One beautiful sheet of glass.',
  scene:{day:'room-day.webp',night:'room-night.webp',dayAlt:'A living room in morning light with a touch panel on the walnut wall',nightAlt:'The same living room in the evening, its lights switched on as a scene',
   caps:[{time:'7:00 AM',title:'Good morning.',body:'Sunlight does the work. Every light stays off.'},{time:'7:00 PM',title:'Evening, in one touch.',body:'A single scene sets the downlights, pendant and mood together.'}]},
  lineup:{title:'Which switch is right for you?',kind:'range',items:[
   {slug:'touch-panels',image:'edge-panel-series',kicker:'Replace the switchboard',facts:[{icon:Ruler,text:'2 to 12 modules'},{icon:Palette,text:'Black glass, five metal-edge finishes'},{icon:Wrench,text:'Replaces the switchboard plate and switches'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
   {slug:'retrofit-modules',image:'smart-retrofit-module',kicker:'Keep your switches',facts:[{icon:Ruler,text:'1 to 6 modules'},{icon:Palette,text:'Hidden behind your switchboard'},{icon:Wrench,text:'Fits inside the existing switchboard'},{icon:Smartphone,text:'HESEOS app and voice assistants'}]},
   {slug:'modular-switches',image:'smart-modular-switch',kicker:'Keep your plates',facts:[{icon:Ruler,text:'5 switch types, fan and dimmer included'},{icon:Palette,text:'Glass switch modules'},{icon:Wrench,text:'Replaces switch modules; plates stay'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
   {slug:'premium-glass-touch-switches',image:'premium-leather-touch-switches',kicker:'Designer collection',facts:[{icon:Ruler,text:'1 to 4 switches'},{icon:Palette,text:'Brushed, textured, leather or glass'},{icon:Wrench,text:'Confirmed with your quote'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
   {slug:'screen-control-panels',image:'smart-screen-control-panel',kicker:'One screen for the home',facts:[{icon:Ruler,text:'4, 6 or 8 inch'},{icon:Palette,text:'Touchscreen with a control knob'},{icon:Wrench,text:'Mounts on the wall, connects over Wi-Fi'},{icon:Smartphone,text:'Touch, knob and voice'}]},
  ]},
  control:{eyebrow:'Touch, tap or talk',title:'However you reach for it.',image:'/media/browse/category/smart-switches-panels/touch.webp',alt:'A fingertip on a glowing key of a black glass touch panel',tiles:[
   {icon:Hand,title:'Touch.',body:'Glass that answers the lightest fingertip, with a soft glow to confirm.'},
   {icon:Smartphone,title:'Tap.',body:'The same switches, scenes and schedules in the Heseos app, at home or away.'},
   {icon:Mic,title:'Talk.',body:'Works with Google Home, Amazon Alexa and Apple Siri.'},
  ]},
  sizes:{title:['From 2 modules to 12.','One look on every wall.'],image:'lineup.webp',alt:'Touch panels in four sizes on a stone wall'},
 },
 'smart-door-locks':{
  hero:{headline:'Your door, reimagined.',sub:'Open up the Heseos Wooden Door Lock: a stainless steel heart, a fingerprint reader in the handle and seven ways in.',alt:'The Heseos Wooden Door Lock coming apart into an exploded view: keypad panel with fingerprint lever, inside panel, stainless steel mortise and through-bolts'},
  // The SS304 and 450 °C lines are from Heseos’s own SS304 product artwork; the rest is from the brochure (wooden-door-lock).
  explode:{product:'wooden-door-lock',film:'/media/browse/category/smart-door-locks/explode.mp4',filmSmall:'/media/browse/category/smart-door-locks/explode-720.mp4',poster:'/media/browse/category/smart-door-locks/explode-poster.webp',still:'/media/browse/category/smart-door-locks/explode-open.webp',parts:[
   {title:'Fingerprint lever',body:'Your fingertip is the key, read right on the handle.',x:53.5,y:51.5},
   {title:'Keypad panel',body:'Aluminium alloy, anti-corrosion. Passcode, card, scramble code or OTP.',x:56.5,y:27},
   {title:'SS304 mortise',body:'Stainless steel lock body, engineered to resist heat up to 450 °C.',x:75,y:44},
   {title:'Through-bolts and key',body:'Fits most wooden and metal doors, with a mechanical key as backup.',x:67,y:84},
  ]},
  statement:'No more keys under the mat. Just a door that knows the people you trust.',
  // Run windows follow the film: the touch is at 0.3–1.5 s, the door opens at ~2 s and she steps in from ~3 s (of 5 s).
  film:{title:'Coming home, keyless.',film:'/media/browse/category/smart-door-locks/home.mp4',filmSmall:'/media/browse/category/smart-door-locks/home-720.mp4',poster:'/media/browse/category/smart-door-locks/home-poster.webp',still:'/media/browse/category/smart-door-locks/home-end.webp',alt:'A woman touches the fingerprint reader on her Heseos lock’s handle, opens her front door and walks into her home',caps:[
   {time:'7:42 PM',title:'One touch.',body:'Her fingerprint is the key, read right on the handle. No keys to find.',from:-1,to:.32},
   {title:'Unlocked.',body:'Press the lever, and the door swings in.',from:.32,to:.6},
   {title:'Welcome home.',body:'Fingerprint, app, passcode, card, scramble code, OTP or key: seven ways in.',from:.6,to:2},
  ]},
  lineup:{title:'Find the lock for your door.',kind:'product',items:[
   {slug:'wooden-door-lock',kicker:'Front doors',facts:[{icon:KeyRound,text:'7 ways in, including OTP'},{icon:DoorClosed,text:'Most wooden and metal doors'},{icon:Layers,text:'4 models'}]},
   {slug:'screen-door-lock',kicker:'See who’s there',facts:[{icon:KeyRound,text:'6 ways in, including face recognition'},{icon:DoorClosed,text:'Built-in screen'},{icon:Layers,text:'4 models'}]},
   {slug:'lever-door-lock',kicker:'Homes and offices',facts:[{icon:KeyRound,text:'Fingerprint, app, passcode or key'},{icon:DoorClosed,text:'Lever-handle doors'},{icon:Layers,text:'1 model'}]},
   {slug:'glass-door-lock',kicker:'Made for glass',facts:[{icon:KeyRound,text:'6 ways in, with access records'},{icon:DoorClosed,text:'Glass doors'},{icon:Layers,text:'2 models'}]},
   {slug:'sliding-door-lock',kicker:'Made to slide',facts:[{icon:KeyRound,text:'5 ways in, with a backup key'},{icon:DoorClosed,text:'Sliding doors'},{icon:Layers,text:'1 model'}]},
   {slug:'drawer-lock',kicker:'Inside the home',facts:[{icon:KeyRound,text:'Fingerprint'},{icon:DoorClosed,text:'Drawers and cabinets'},{icon:Layers,text:'2 models'}]},
  ]},
  control:{eyebrow:'Ways in',title:'However you open up.',image:'/media/catalog/lever-door-lock/lever-door-lock-lever-finger.webp',alt:'A fingertip on the fingerprint reader of a smart lever lock',tiles:[
   {icon:Fingerprint,title:'Fingerprint.',body:'Your fingertip is the key, on every lock in the range.'},
   {icon:Smartphone,title:'Phone.',body:'Unlock from the Heseos app on most models in the range.'},
   {icon:KeyRound,title:'PIN, card or key.',body:'Passcodes, RFID cards and a physical backup key, depending on the model.'},
  ]},
 },
};
