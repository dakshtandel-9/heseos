import type { CSSProperties } from 'react';
import { ChevronRight } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import './security-story.css';

// Security & Sensors, told as one night: a single photo of a sleeping home, and a camera that moves through it room by room
// while each sensor notices something. The two night photos are generated and illustrative (the second is the first with the
// events added, so they line up); everything said about the sensors is from the 2026–27 brochure.
const MEDIA='/media/browse/category/security-sensors/';
const CALM=MEDIA+'night-calm.webp',LIT=MEDIA+'night-events.webp';
// The phone photo has a transparent screen; the lock screen sits behind it in this box, measured from the photo (shared with Door Phones).
const PHONE='/media/browse/category/video-door-phones-doorbells/phone.webp';
const PHONE_SCREEN={left:'4.19%',top:'1.69%',width:'91.61%',height:'94.35%'};

type Stop={slug:string;x:number;y:number;z:number;time:string;line:string;lit?:{x:number;y:number;rx:number;ry:number}};
// Where the camera rests for each sensor: x and y are the point it centres on, as fractions of the photo, and z its zoom on a desktop screen.
// "lit" is the part of the second photo that fades in once the camera arrives (an ellipse, in % of the photo).
const STOPS:Stop[]=[
 {slug:'pir-motion-sensor',x:.15,y:.55,z:1.8,time:'2:03 AM.',line:'Someone’s up for a glass of water. The PIR sensor senses the warmth of movement, and the hallway lights come on.',lit:{x:12,y:55,rx:12,ry:60}},
 {slug:'microwave-motion-sensor',x:.3,y:.58,z:1.9,time:'2:06 AM.',line:'Something moves on the balcony. The microwave sensor sees it through the glass.',lit:{x:27,y:60,rx:10,ry:22}},
 {slug:'human-presence-sensor',x:.45,y:.5,z:1.7,time:'2:09 AM.',line:'Still reading, and hardly moving. The presence sensor knows he’s there, so the lamp stays on.',lit:{x:43,y:50,rx:12,ry:32}},
 {slug:'gas-leak-sensor',x:.76,y:.52,z:1.7,time:'2:12 AM.',line:'By the hob, the gas leak sensor keeps watch, with its readings on a screen of its own.',lit:{x:81,y:50,rx:4,ry:7}},
 {slug:'smoke-detector',x:.93,y:.36,z:2.2,time:'2:15 AM.',line:'In the bedroom, the smoke detector. If it ever senses smoke, your phone will know.'},
];
// The camera's path: the whole house, each stop in turn, then the whole house again. Segment k eases from key k−1 to key k (see --se1…--se6 in the CSS).
const KEYS=[{x:.5,y:.5,z:1},...STOPS,{x:.5,y:.5,z:1}];
const path=(k:'x'|'y'|'z')=>`calc(${KEYS[0][k]}${KEYS.slice(1).map((s,i)=>` + ${+(s[k]-KEYS[i][k]).toFixed(3)} * var(--se${i+1})`).join('')})`;
const CAMERA={'--cx':path('x'),'--cy':path('y'),'--cz':path('z')} as CSSProperties;

// The lineup, in brochure words: what each sensor notices, and one more thing worth knowing.
const LINEUP:Record<string,{notices:string;more:string}>={
 'pir-motion-sensor':{notices:'Movement, by its warmth',more:'Turns on lights and devices as someone walks in.'},
 'microwave-motion-sensor':{notices:'Movement, even through glass',more:'Sensitive enough to pick up small movements.'},
 'human-presence-sensor':{notices:'People, even sitting still',more:'Switches lights and devices on and off as people come and go.'},
 'gas-leak-sensor':{notices:'Gas leaks',more:'Alerts your phone, and shows readings on its own screen.'},
 'smoke-detector':{notices:'Smoke',more:'Alerts your phone, wherever you are.'},
};
const NOTES=[
 {title:'Gas leak detected',body:'Kitchen · Smart Gas Leak Sensor',when:'now'},
 {title:'Smoke detected',body:'Bedroom · Smart Smoke Detector',when:'now'},
];

export default function SecurityStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p)}));
 const find=(slug:string)=>products.find(p=>p.slug===slug);
 const gas=find('gas-leak-sensor'),smoke=find('smoke-detector');
 return <div className="sns">
  <ScrollScenes/>

  {/* One take: the camera glides through one photo of the home at 2 AM. At each stop the matching part of the second photo
      fades in, so the hallway light comes up, the cat appears behind the glass and the reading lamp is on. */}
  <section className="sns-tour" data-scroll="pin" data-steps={KEYS.length} aria-labelledby="rg-title">
   <div className="sns-stage">
    <div className="sns-world" style={CAMERA}>
     <img src={CALM} alt="A home at 2 AM, seen from the front door: hallway, balcony door, living room, kitchen and bedroom, each with a Heseos sensor" fetchPriority="high"/>
     {STOPS.map((s,i)=>s.lit&&<img key={s.slug} className="sns-lit" src={LIT} alt="" style={{'--a':i+1,maskImage:`radial-gradient(${s.lit.rx}% ${s.lit.ry}% at ${s.lit.x}% ${s.lit.y}%,#000 60%,#0000)`} as CSSProperties}/>)}
     <img className="sns-lit sns-lit--all" src={LIT} alt=""/>
    </div>
    <nav className="sns-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="sns-intro">
     <h1 id="rg-title"><span>It’s 2 AM. Everyone’s asleep.</span> <span>Your home isn’t.</span></h1>
     <p className="sns-hint">Scroll to look around</p>
    </div>
    <ol className="sns-lines">{STOPS.map((s,i)=>{const p=find(s.slug);
     return <li key={s.slug} style={{'--a':i+1} as CSSProperties}><p><b>{s.time}</b> {s.line}</p>{p&&<small>{p.name}</small>}</li>;})}</ol>
    <div className="sns-outro">
     <h2>Five sensors. One quiet night.</h2>
     <p><a className="sns-link" href="#sns-lineup">Find your sensor <ChevronRight size={16} aria-hidden="true"/></a><SiteLink className="sns-link" href="/demo">Book a free demo <ChevronRight size={16} aria-hidden="true"/></SiteLink></p>
    </div>
   </div>
  </section>

  {/* Wherever you are: the alerts land on a real phone photo's lock screen as it rises into view. */}
  <section className="sns-alerts" data-scroll="view" aria-labelledby="sns-alerts-title">
   <div className="sns-wrap sns-alerts-grid">
    <div className="sns-alerts-copy" data-reveal>
     <h2 id="sns-alerts-title">Wherever you are.</h2>
     <p>The gas leak sensor pushes an alert to your phone the moment it detects a leak. The smoke detector warns you the same way. Both on iOS and Android, in the HESEOS app.</p>
     <p className="sns-links">{gas&&<SiteLink className="sns-link" href={gas.href}>Gas leak sensor <ChevronRight size={16} aria-hidden="true"/></SiteLink>}{smoke&&<SiteLink className="sns-link" href={smoke.href}>Smoke detector <ChevronRight size={16} aria-hidden="true"/></SiteLink>}</p>
    </div>
    <div className="sns-phone" aria-hidden="true">
     <div className="sns-screen" style={PHONE_SCREEN}>
      <img className="sns-wall" src={CALM} alt=""/>
      <p className="sns-clock"><small>Saturday 7 November</small>2:16</p>
      <ul className="sns-notes">{NOTES.map((n,i)=><li key={n.title} style={{'--a':i} as CSSProperties}><span className="sns-app">H</span><p><b>{n.title}</b><span>{n.body}</span></p><time>{n.when}</time></li>)}</ul>
     </div>
     <img className="sns-frame" src={PHONE} alt=""/>
    </div>
   </div>
   <p className="sns-wrap sns-note">Illustrative. Alert wording in the HESEOS app may differ.</p>
  </section>

  {/* Its own screen: the brochure close-up of the gas leak sensor, which shows readings and status on the sensor itself. */}
  {gas&&<section className="sns-screen-section" aria-labelledby="sns-own-title">
   <div className="sns-wrap sns-split">
    <figure data-reveal><img src="/media/catalog/gas-leak-sensor/gas-leak-sensor-detail.webp" alt="Close-up of the Smart Gas Leak Sensor’s screen" loading="lazy"/></figure>
    <div data-reveal>
     <h2 id="sns-own-title">And right there on the wall.</h2>
     <p>The gas leak sensor has a screen of its own, so anyone in the kitchen can check its readings and status at a glance.</p>
     <SiteLink className="sns-link" href={gas.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink>
    </div>
   </div>
  </section>}

  <section className="sns-lineup" id="sns-lineup" aria-labelledby="sns-lineup-title">
   <div className="sns-wrap">
    <h2 id="sns-lineup-title" data-reveal>Which sensor goes where?</h2>
    <ul className="sns-row">{products.map(p=>{const x=LINEUP[p.slug];
     return <li key={p.slug} data-reveal>
      <SiteLink className="sns-tile" href={p.href} aria-label={`Explore ${p.name}`}><img src={`/media/products/studio/${p.slug}.webp`} alt={`${p.name}, studio image`} loading="lazy"/></SiteLink>
      <h3>{p.name}</h3><p className="sns-tagline">{p.family.tagline}</p>
      <SiteLink className="sns-link" href={p.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
      {x&&<dl><div><dt>Notices</dt><dd>{x.notices}</dd></div><div><dt>Good to know</dt><dd>{x.more}</dd></div></dl>}
     </li>;})}</ul>
   </div>
  </section>
 </div>;
}
