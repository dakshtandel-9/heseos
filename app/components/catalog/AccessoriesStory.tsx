import type { CSSProperties } from 'react';
import { ChevronRight } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import './accessories-story.css';

// Smart Home Accessories, told by taking things away: a table of remotes empties one remote at a time as each one moves onto the phone,
// then the Smart Plug and the Energy Meter. The two table photos are generated and illustrative (the second is the first with the remotes
// removed, so they line up, and its phone screen is transparent so the live screen below shows through). Facts are from the 2026–27 brochure.
const MEDIA='/media/browse/category/smart-home-accessories/';
const PLUG='/media/catalog/smart-plug-16a/smart-plug-16a-';
const METER='/media/catalog/three-phase-energy-meter/three-phase-energy-meter-';
// The phone's screen in the table photos, measured from the green screen (left, top, width, height in %), plus a hair under the bezel.
const SCREEN={left:'44.1%',top:'25.95%',width:'12.3%',height:'46.35%'};
// Each remote's box in the photo (x0, x1, y0, y1 in %), shadow included; that box of the first photo sits over the second until the remote goes.
const REMOTES=[
 {name:'Air conditioner',line:'The AC remote. Now on your phone.',box:[27,39.5,4.5,46]},
 {name:'TV',line:'The TV remote, too.',box:[27,39.5,46,98.5]},
 {name:'Set-top box',line:'The set-top box.',box:[61.8,74,6.5,50]},
 {name:'Speaker',line:'And the speaker.',box:[62.5,74,52,94]},
];
const F=1.2;// feather, in %
const patch=([x0,x1,y0,y1]:number[]):CSSProperties=>({
 maskImage:`linear-gradient(90deg,#0000 ${x0}%,#000 ${x0+F}%,#000 ${x1-F}%,#0000 ${x1}%),linear-gradient(#0000 ${y0}%,#000 ${y0+F}%,#000 ${y1-F}%,#0000 ${y1}%)`,
 maskComposite:'intersect',transformOrigin:`${(x0+x1)/2}% ${(y0+y1)/2}%`,
});
// The Smart Plug, frame by frame: brochure photos and what each shows.
const PLUG_FRAMES=[
 {img:PLUG+'geyser.webp',alt:'The Smart Plug 16A powering a geyser in a bathroom',title:'Built for heavy appliances.',body:'Turn 16 A appliances like geysers and ACs on or off from your phone.'},
 {img:PLUG+'kitchen.webp',alt:'The Smart Plug 16A in a kitchen socket, powering a coffee machine',title:'No wiring.',body:'It plugs into a standard socket. Plug your appliance into it, and you’re done.'},
 {img:PLUG+'app.webp',alt:'The HESEOS app showing the energy an appliance has used',title:'Know what it uses.',body:'Monitor the energy each appliance uses, in the HESEOS app.'},
 {img:PLUG+'detail.webp',alt:'Close-up of the Smart Plug 16A',title:'On a schedule.',body:'Set it to switch on and off by itself, or ask Google Home, Amazon Alexa or Apple Siri.'},
];
// The lineup, row by row, in brochure words.
const ROWS:{label:string;values:Record<string,string>}[]=[
 {label:'Goes into',values:{'wi-fi-smart-plug':'Any standard socket. No wiring needed.','smart-ir-blaster':'Any USB outlet, like a phone charger.','three-phase-energy-meter':'Your distribution board, fitted by an electrician.'}},
 {label:'Looks after',values:{'wi-fi-smart-plug':'Heavy appliances like ACs and geysers','smart-ir-blaster':'ACs, TVs and other infrared appliances','three-phase-energy-meter':'Electricity use across your space'}},
 {label:'You get',values:{'wi-fi-smart-plug':'Control from anywhere, schedules, energy monitoring','smart-ir-blaster':'App control, scenes and schedules','three-phase-energy-meter':'Real-time tracking and threshold alerts'}},
 {label:'Voice',values:{'wi-fi-smart-plug':'Google Home, Amazon Alexa, Apple Siri','smart-ir-blaster':'Google Home, Amazon Alexa, Apple Siri'}},
];

export default function AccessoriesStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p)}));
 const find=(slug:string)=>products.find(p=>p.slug===slug);
 const ir=find('smart-ir-blaster'),plug=find('wi-fi-smart-plug'),meter=find('three-phase-energy-meter');
 return <div className="acc">
  <ScrollScenes/>

  {/* Less to hold: the remotes leave the table one by one, each landing on the phone's screen, and the camera settles on the phone. */}
  <section className="acc-table" data-scroll="pin" data-steps="6" aria-labelledby="rg-title">
   <div className="acc-stage">
    <div className="acc-world">
     <div className="acc-screen" style={SCREEN}>
      <p className="acc-app"><small>Living room</small>Remotes</p>
      <ul>{REMOTES.map((r,i)=><li key={r.name} style={{'--k':i+1} as CSSProperties}><b>{r.name}</b><span>Ready</span></li>)}</ul>
     </div>
     <img src={MEDIA+'table-phone.webp'} alt="A coffee table with a phone and four remote controls; one by one the remotes go, and each appears on the phone" fetchPriority="high"/>
     {REMOTES.map((r,i)=><img key={r.name} className="acc-remote" src={MEDIA+'table-remotes.webp'} alt="" style={{...patch(r.box),'--k':i+1} as CSSProperties}/>)}
    </div>
    <nav className="acc-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="acc-intro">
     <h1 id="rg-title"><span>Four remotes on the table.</span> <span>You only need one.</span></h1>
     <p className="acc-hint">Scroll to clear the table</p>
    </div>
    <ol className="acc-lines">{REMOTES.map((r,i)=><li key={r.name} style={{'--k':i+1} as CSSProperties}>{r.line}</li>)}</ol>
    <div className="acc-outro">
     <h2>One remote. Every room.</h2>
     <p>The IR Blaster turns your phone into a remote for ACs, TVs and other infrared appliances.</p>
     <p className="acc-links">{ir&&<SiteLink className="acc-link" href={ir.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink>}<a className="acc-link" href="#acc-lineup">Compare accessories <ChevronRight size={16} aria-hidden="true"/></a></p>
    </div>
   </div>
  </section>
  <p className="acc-wrap acc-note">Illustrative. The IR Blaster works with appliances that use an infrared remote.</p>

  {/* All it takes: the brochure photo of the IR Blaster in a phone charger, opening from a framed picture to the full width as it scrolls in. */}
  {ir&&<section className="acc-usb" data-scroll="view" aria-labelledby="acc-usb-title">
   <div className="acc-wrap acc-usb-head" data-reveal>
    <h2 id="acc-usb-title">All it takes is a USB outlet.</h2>
    <p>Plug the IR Blaster into any USB outlet, like a phone charger, and add your remotes in the HESEOS app. Then set scenes and schedules, from anywhere.</p>
   </div>
   <figure className="acc-usb-media"><img src="/media/catalog/ir-blaster/ir-blaster-charger.webp" alt="The IR Blaster plugged into a phone charger in a wall socket" loading="lazy"/></figure>
  </section>}

  {/* The Smart Plug, on a filmstrip: the page holds still while the frames slide past. */}
  {plug&&<section className="acc-plug" data-scroll="pin" style={{'--n':PLUG_FRAMES.length} as CSSProperties} aria-labelledby="acc-plug-title">
   <div className="acc-plug-stage">
    <div className="acc-plug-head">
     <h2 id="acc-plug-title">{plug.family.name}. <span>{plug.family.tagline}</span></h2>
     <SiteLink className="acc-link" href={plug.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink>
    </div>
    <ul className="acc-strip">{PLUG_FRAMES.map(f=><li key={f.title}>
     <img src={f.img} alt={f.alt} loading="lazy"/>
     <p><b>{f.title}</b> {f.body}</p>
    </li>)}</ul>
   </div>
  </section>}

  {/* The Energy Meter: the brochure macro of its clamps on the three phases, then its two versions. */}
  {meter&&<section className="acc-meter" aria-labelledby="acc-meter-title">
   <div className="acc-wrap">
    <div className="acc-split">
     <figure data-reveal><img src={METER+'clamp.webp'} alt="The energy meter’s current clamps on red, yellow and blue phase cables" loading="lazy"/></figure>
     <div data-reveal>
      <h2 id="acc-meter-title">See where the power goes.</h2>
      <p>The {meter.family.name} tracks electricity use in real time, across many locations in your space, and warns you when consumption goes above the thresholds you set.</p>
      <SiteLink className="acc-link" href={meter.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink>
     </div>
    </div>
    <div className="acc-versions">
     <figure data-reveal><img src={METER+'standard-1.webp'} alt="The Three Phase Energy Meter with its current clamps" loading="lazy"/><figcaption><b>Three Phase Energy Meter</b></figcaption></figure>
     <figure data-reveal><img src={METER+'din-1.webp'} alt="The Three Phase DIN Rail Energy Meter with its current clamps" loading="lazy"/><figcaption><b>Three Phase DIN Rail Energy Meter</b> For distribution boards.</figcaption></figure>
    </div>
   </div>
  </section>}

  <section className="acc-lineup" id="acc-lineup" aria-labelledby="acc-lineup-title">
   <div className="acc-wrap">
    <h2 id="acc-lineup-title" data-reveal>Which accessory do you need?</h2>
    <div className="acc-cols">{products.map(p=><article key={p.slug} data-reveal>
     <SiteLink className="acc-tile" href={p.href} aria-label={`Explore ${p.name}`}><img src={`/media/products/studio/${p.slug}.webp`} alt={`${p.name}, studio image`} loading="lazy"/></SiteLink>
     <h3>{p.name}</h3><p className="acc-tagline">{p.family.tagline}</p>
     <SiteLink className="acc-link" href={p.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
     <dl>{ROWS.map(r=><div key={r.label}><dt>{r.label}</dt><dd>{r.values[p.slug]??'—'}</dd></div>)}</dl>
    </article>)}</div>
   </div>
  </section>
 </div>;
}
