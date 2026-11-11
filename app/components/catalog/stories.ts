import { DoorClosed, Fingerprint, Hand, KeyRound, Layers, Mic, Palette, Ruler, Smartphone, Wrench, type LucideIcon } from 'lucide-react';
// Content for the Apple-style category stories (CategoryStory). A category with an entry here opens with its story;
// the rest keep the standard category page. Facts are from the 2026–27 brochure (data/products.json).
// Scene images are generated and illustrative, made from each category's studio shots (see public/media/browse/category/<slug>/).
export type StoryFact={icon:LucideIcon;text:string};
export type CategoryStoryContent={
 hero:{headline:string;sub:string;alt:string};
 statement:string;
 scene:{day:string;night:string;dayAlt:string;nightAlt:string;caps:[{time:string;title:string;body:string},{time:string;title:string;body:string}]};
 // `range` items are subcategory slugs, pictured by `image` (a studio shot slug); `product` items are directory products, pictured by their own studio shot.
 lineup:{title:string;kind:'range'|'product';items:{slug:string;image?:string;kicker:string;facts:StoryFact[]}[]};
 control:{eyebrow:string;title:string;image:string;alt:string;tiles:{icon:LucideIcon;title:string;body:string}[]};
 sizes?:{title:[string,string];image:string;alt:string};
};

export const STORIES:Record<string,CategoryStoryContent>={
 'smart-switches-panels':{
  hero:{headline:'Control, beautifully.',sub:'One touch for every light, fan and scene.',alt:'A Heseos black glass touch panel with glowing keys'},
  statement:'Every light, fan, curtain and scene. One beautiful sheet of glass.',
  scene:{day:'room-day.webp',night:'room-night.webp',dayAlt:'A living room in morning light with a touch panel on the walnut wall',nightAlt:'The same living room in the evening, its lights switched on as a scene',
   caps:[{time:'7:00 AM',title:'Good morning.',body:'Sunlight does the work. Every light stays off.'},{time:'7:00 PM',title:'Evening, in one touch.',body:'A single scene sets the downlights, pendant and mood together.'}]},
  lineup:{title:'Which switch is right for you?',kind:'range',items:[
   {slug:'touch-panels',image:'edge-panel-series',kicker:'Replace the switchboard',facts:[{icon:Ruler,text:'2 to 12 modules'},{icon:Palette,text:'Black glass, five metal-edge finishes'},{icon:Wrench,text:'Replaces the switchboard plate and switches'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
   {slug:'retrofit-modules',image:'smart-retrofit-module',kicker:'Keep your switches',facts:[{icon:Ruler,text:'1 to 6 modules'},{icon:Palette,text:'Hidden behind your switchboard'},{icon:Wrench,text:'Fits inside the existing switchboard'},{icon:Smartphone,text:'HESEOS app and voice assistants'}]},
   {slug:'modular-switches',image:'smart-modular-switch',kicker:'Keep your plates',facts:[{icon:Ruler,text:'5 switch types, fan and dimmer included'},{icon:Palette,text:'Glass switch modules'},{icon:Wrench,text:'Replaces switch modules; plates stay'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
   {slug:'premium-glass-touch-switches',image:'premium-leather-touch-switches',kicker:'Designer collection',facts:[{icon:Ruler,text:'1 to 4 switches'},{icon:Palette,text:'Brushed, textured, leather or glass'},{icon:Wrench,text:'Confirmed with your quote'},{icon:Smartphone,text:'Touch, HESEOS app and voice assistants'}]},
  ]},
  control:{eyebrow:'Touch, tap or talk',title:'However you reach for it.',image:'/media/browse/category/smart-switches-panels/touch.webp',alt:'A fingertip on a glowing key of a black glass touch panel',tiles:[
   {icon:Hand,title:'Touch.',body:'Glass that answers the lightest fingertip, with a soft glow to confirm.'},
   {icon:Smartphone,title:'Tap.',body:'The same switches, scenes and schedules in the Heseos app, at home or away.'},
   {icon:Mic,title:'Talk.',body:'Works with Google Home, Amazon Alexa and Apple Siri.'},
  ]},
  sizes:{title:['From 2 modules to 12.','One look on every wall.'],image:'lineup.webp',alt:'Touch panels in four sizes on a stone wall'},
 },
 'smart-door-locks':{
  hero:{headline:'Your door, reimagined.',sub:'Fingerprint, phone, PIN or card. Keys optional.',alt:'A Heseos smart door lock with a glowing keypad'},
  statement:'No more keys under the mat. Just a door that knows the people you trust.',
  scene:{day:'entrance-away.webp',night:'entrance-home.webp',dayAlt:'A teak front door at dusk, closed, with a smart lock glowing softly',nightAlt:'The same front door opening onto a warmly lit home',
   caps:[{time:'6:28 PM',title:'Locked while you’re away.',body:'Shut and secure while the house is empty.'},{time:'6:30 PM',title:'Welcome home.',body:'One fingertip, and the door is open. No keys to find in the dark.'}]},
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
