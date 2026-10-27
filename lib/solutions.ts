// Four audiences, four stories (proposal page 9). Each moment pairs a simulation render with the component behind it.
export type Solution={slug:string;name:string;tagline:string;intro:string;image:string;moments:{title:string;body:string;image:string;component:string}[]};
export const SOLUTIONS:Solution[]=[
 {slug:'home',name:'Smart Home',tagline:'A day that runs itself.',image:'/media/home/living-home.webp',
  intro:'Lights, AC and appliances that follow your day, from the first light in the morning to the moment you lock the door.',
  moments:[
   {title:'Evenings, set with a touch.',body:'One glass panel dims the room for a film or brightens it for guests.',image:'/media/home/living-evening.webp',component:'Touch Panel'},
   {title:'A cool room when you arrive.',body:'Switch the AC on from your phone on the way home.',image:'/media/home/apt2-ac.webp',component:'IR Blaster'},
   {title:'Nothing left on when you leave.',body:'Away turns off the lights, the AC and the TV at its plug.',image:'/media/home/apt2-away.webp',component:'Smart Plug'},
  ]},
 {slug:'hotel',name:'Smart Hotel',tagline:'Hospitality without friction.',image:'/media/home/bedroom.webp',
  intro:'Guest rooms that are simple to use for guests and simple to manage for your team.',
  moments:[
   {title:'Lights guests understand.',body:'Clear, soft-lit touch panels by the door and the bed.',image:'/media/home/bedroom.webp',component:'Touch Panel'},
   {title:'Rooms comfortable before check-in.',body:'Run each room’s AC from the app without a remote in every drawer.',image:'/media/home/apt2-ac.webp',component:'IR Blaster'},
   {title:'Idle rooms, switched off.',body:'Cut power to appliances in empty rooms and see what each one draws.',image:'/media/home/apt2-away.webp',component:'Smart Plug'},
  ]},
 {slug:'buildings',name:'Smart Buildings',tagline:'Control at property scale.',image:'/media/home/entrance.webp',
  intro:'Give every unit a smart start, and every resident the same simple app.',
  moments:[
   {title:'Smart from handover.',body:'Install touch panels or retrofit modules while the electrical work is still open.',image:'/media/home/entrance.webp',component:'Touch Panel'},
   {title:'One app for every appliance.',body:'Residents add their AC and TV remotes in minutes.',image:'/media/home/tv-on.webp',component:'IR Blaster'},
   {title:'Energy you can see.',body:'Track the power drawn by heavy appliances unit by unit.',image:'/media/home/living-away.webp',component:'Smart Plug'},
  ]},
 {slug:'enterprise',name:'Smart Enterprise',tagline:'Automation without complexity.',image:'/media/home/office.webp',
  intro:'Offices that switch themselves down at the end of the day, without a building-management project.',
  moments:[
   {title:'Every room from one panel.',body:'Group lights by zone and switch them from a single touch panel.',image:'/media/home/office.webp',component:'Touch Panel'},
   {title:'Meeting-room ACs, from the app.',body:'Switch them on for the meeting and off when it ends.',image:'/media/home/apt2-ac.webp',component:'IR Blaster'},
   {title:'Desks and screens off overnight.',body:'Smart Plugs cut standby power after hours.',image:'/media/home/kitchen.webp',component:'Smart Plug'},
  ]},
];
export const solution=(slug:string)=>SOLUTIONS.find(s=>s.slug===slug);
