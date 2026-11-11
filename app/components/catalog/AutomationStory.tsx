import { ChevronRight } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import PanelSizes, { type PanelSize } from './PanelSizes';
import './automation-story.css';

// Automation & Controls, told as a morning that runs itself: the page opens on a closed curtain that parts as you scroll,
// the camera pulls back to the bedroom, then moves to the Screen Control Panel that set it all off. The two hero photos are generated and
// illustrative (the curtain is a close-up of the room's own curtains; the panel's screen is transparent so a live screen shows through).
// Everything said about the products is from the 2026–27 brochure.
const MEDIA='/media/browse/category/automation-controls/';
const PANEL='/media/catalog/screen-control-panel/screen-control-panel-';
const MOTOR='/media/catalog/curtain-blind-motor/curtain-blind-motor-';
// The panel's screen in the room photo, measured from its green screen (left, top, width, height in %).
const SCREEN={left:'84.11%',top:'38.29%',width:'5.17%',height:'7.04%'};
const SCENES=['Good morning','Away','Movie','Good night'];
const SIZES:PanelSize[]=[
 {id:'4',label:'4 inch',model:'H4INPanelTY',img:PANEL+'4in-1.webp',alt:'The 4 inch Screen Control Panel'},
 {id:'6',label:'6 inch',model:'H6INPanelTY',img:PANEL+'6in-1.webp',alt:'The 6 inch Screen Control Panel'},
 {id:'8',label:'8 inch',model:'H8INPanelTY',img:PANEL+'8in-1.webp',alt:'The 8 inch Screen Control Panel, with its control knob'},
];
const WAYS=[
 {title:'Touch.',body:'One screen for every smart device in your home.'},
 {title:'Turn.',body:'Adjust with the knob switch.'},
 {title:'Talk.',body:'Speak a command. It works with Google Home, Amazon Alexa and Apple Siri, too.'},
];
const MOTOR_FACTS=[
 {title:'Quiet and smooth.',body:'It opens and closes quietly, without a jolt.'},
 {title:'Stops on blockage.',body:'If something is in the way, the motor stops.'},
 {title:'Your way.',body:'The remote, the HESEOS app, your voice or a schedule.'},
 {title:'All together.',body:'Group several motors and move every curtain at once.'},
];
// The comparison, row by row, in brochure words.
const ROWS:{label:string;values:Record<string,string>}[]=[
 {label:'Does',values:{'smart-curtain-motor':'Opens and closes curtains, drapes and roller blinds','smart-screen-control-panel':'Controls every smart device in your home from one screen'}},
 {label:'Control with',values:{'smart-curtain-motor':'Remote, HESEOS app, voice, schedules','smart-screen-control-panel':'Touchscreen, knob switch, voice'}},
 {label:'Comes as',values:{'smart-curtain-motor':'Curtain motor or roller blind motor','smart-screen-control-panel':'4, 6 or 8 inch'}},
 {label:'Installs',values:{'smart-curtain-motor':'On the ceiling or wall','smart-screen-control-panel':'On the wall'}},
 {label:'Works with',values:{'smart-curtain-motor':'Google Home, Amazon Alexa, Apple Siri','smart-screen-control-panel':'Google Home, Amazon Alexa, Apple Siri'}},
];

export default function AutomationStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p)}));
 const find=(slug:string)=>products.find(p=>p.slug===slug);
 const motor=find('smart-curtain-motor'),panel=find('smart-screen-control-panel');
 return <div className="cue">
  <ScrollScenes/>

  {/* On cue: the curtain parts down its seam, each half gathering toward its side, and the camera pulls back from the window
      to the whole room, then moves to the panel on the wall, whose screen shows the morning scene. */}
  <section className="cue-hero" data-scroll="pin" data-steps="5" aria-labelledby="rg-title">
   <div className="cue-stage">
    <div className="cue-world">
     <div className="cue-panel-screen" style={SCREEN}><div className="cue-ui">
      <p className="cue-time">6:30</p>
      <ul>{SCENES.map((s,i)=><li key={s} data-on={i===0||undefined}>{s}</li>)}</ul>
     </div></div>
     <img src={MEDIA+'room-open.webp'} alt="A bedroom at sunrise: the curtains open on their own, and the wall panel beside the window shows the morning scene" fetchPriority="high"/>
    </div>
    <div className="cue-curtain" aria-hidden="true">
     <div className="cue-half cue-half--l"><img src={MEDIA+'curtain-closed.webp'} alt=""/></div>
     <div className="cue-half cue-half--r"><img src={MEDIA+'curtain-closed.webp'} alt=""/></div>
    </div>
    <nav className="cue-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="cue-intro">
     <h1 id="rg-title">Good morning.</h1>
     <p className="cue-hint">Scroll to open the curtains</p>
    </div>
    <p className="cue-line cue-line--1"><b>6:30 AM.</b> The curtains open by themselves, right on schedule.</p>
    <div className="cue-outro">
     <h2>Your home, on cue.</h2>
     <p>A morning scene, set once on the Screen Control Panel. The curtain motor takes care of the rest.</p>
     <p className="cue-links">{motor&&<SiteLink className="cue-link" href={motor.href}>Curtain motor <ChevronRight size={16} aria-hidden="true"/></SiteLink>}{panel&&<SiteLink className="cue-link" href={panel.href}>Screen Control Panel <ChevronRight size={16} aria-hidden="true"/></SiteLink>}</p>
    </div>
   </div>
  </section>
  <p className="cue-wrap cue-note">Illustrative. Scene names on the panel are examples; you name your own in the HESEOS app.</p>

  {/* Touch, turn or talk: the brochure photo of a hand on the panel settles from a slight push-in, over three short lines. */}
  {panel&&<section className="cue-ways" data-scroll="view" aria-labelledby="cue-ways-title">
   <div className="cue-wrap">
    <div className="cue-head" data-reveal><h2 id="cue-ways-title">{panel.family.tagline}</h2><p>The {panel.family.name} puts the whole home on one wall, with temperature, weather and scene modes at a glance.</p></div>
    <figure className="cue-ways-media"><img src={PANEL+'touch.webp'} alt="A hand touching a scene on the Screen Control Panel" loading="lazy"/></figure>
    <ul className="cue-ways-list">{WAYS.map(w=><li key={w.title} data-reveal><b>{w.title}</b> {w.body}</li>)}</ul>
   </div>
  </section>}

  {panel&&<section className="cue-size-section" aria-labelledby="cue-size-title">
   <div className="cue-wrap cue-size-grid">
    <div data-reveal>
     <h2 id="cue-size-title">Three sizes. One for every wall.</h2>
     <p>Choose 4, 6 or 8 inches. Every size mounts on the wall and connects over Wi-Fi.</p>
     <SiteLink className="cue-link" href={panel.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink>
    </div>
    <div data-reveal><PanelSizes sizes={SIZES}/></div>
   </div>
  </section>}

  {motor&&<section className="cue-motor" aria-labelledby="cue-motor-title">
   <div className="cue-wrap">
    <div className="cue-head" data-reveal><h2 id="cue-motor-title">Curtains or roller blinds.</h2><p>{motor.family.name}: {motor.family.tagline.toLowerCase().replace(/\.$/,'')}, on the ceiling or the wall.</p></div>
    <div className="cue-pair">
     <figure data-reveal><img src={MOTOR+'sunrise.webp'} alt="Sheer curtains drawn by the curtain motor, at sunrise" loading="lazy"/><figcaption><b>Curtain motor</b> For curtains and drapes.</figcaption></figure>
     <figure data-reveal><img src={MOTOR+'bedroom.webp'} alt="A bedroom with a roller blind lowered by the roller blind motor" loading="lazy"/><figcaption><b>Roller blind motor</b> For roller blinds.</figcaption></figure>
    </div>
    <dl className="cue-facts">{MOTOR_FACTS.map(f=><div key={f.title} data-reveal><dt>{f.title}</dt><dd>{f.body}</dd></div>)}</dl>
    <p className="cue-center" data-reveal><SiteLink className="cue-link" href={motor.href}>Learn more <ChevronRight size={16} aria-hidden="true"/></SiteLink></p>
   </div>
  </section>}

  <section className="cue-compare" aria-labelledby="cue-compare-title">
   <div className="cue-wrap">
    <h2 id="cue-compare-title" data-reveal>Better together.</h2>
    <div className="cue-cols">{products.map(p=><article key={p.slug} data-reveal>
     <SiteLink className="cue-tile" href={p.href} aria-label={`Explore ${p.name}`}><img src={`/media/products/studio/${p.slug}.webp`} alt={`${p.name}, studio image`} loading="lazy"/></SiteLink>
     <h3>{p.name}</h3><p className="cue-tagline">{p.family.tagline}</p>
     <SiteLink className="cue-link" href={p.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
     <dl>{ROWS.map(r=><div key={r.label}><dt>{r.label}</dt><dd>{r.values[p.slug]??'—'}</dd></div>)}</dl>
    </article>)}</div>
   </div>
  </section>
 </div>;
}
