import { Hand, Mic, Palette, Ruler, Smartphone, Wrench, type LucideIcon } from 'lucide-react';
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
  hero:{headline:'Built smart, inside and out.',sub:'Open up the Heseos Edge Panel Series. Black glass and a metal edge outside; touch, light and Wi-Fi within.',alt:'The Heseos Edge Panel Series turning from a front view and opening into an exploded view: black glass, rose-gold metal edge, touch and LED boards, control board and back housing'},
  explode:{product:'edge-panel-series',film:'/media/browse/category/smart-switches-panels/panel-explode.mp4',filmSmall:'/media/browse/category/smart-switches-panels/panel-explode-720.mp4',poster:'/media/browse/category/smart-switches-panels/panel-explode-poster.webp',still:'/media/browse/category/smart-switches-panels/panel-explode-open.webp',parts:[
   {title:'Glass face',body:'Black glass with the Heseos mark and four touch keys.',x:41.5,y:59.5},
   {title:'Metal edge',body:'Rose Gold, Grey, Gold, Chrome or Black.',x:55.5,y:48},
   {title:'Touch and light',body:'A sensor under every key, ringed by LEDs that glow to confirm.',x:60.2,y:58.5},
   {title:'Control board',body:'Secure Wi-Fi, a relay for each load and a surge protector.',x:71.7,y:35.4},
   {title:'Back housing',body:'Seats in the wall box and holds the wiring terminals.',x:88.9,y:55.6},
  ]},
  statement:'Every light, fan, curtain and scene. One beautiful sheet of glass.',
  scene:{day:'room-day-v2.webp',night:'room-night-v2.webp',dayAlt:'A living room in morning light with a touch panel on the walnut wall',nightAlt:'The same living room in the evening, its lights switched on as a scene',
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
};
