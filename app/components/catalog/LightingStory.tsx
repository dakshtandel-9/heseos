import { ChevronRight } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import LightTry from './LightTry';
import './lighting-story.css';

// Smart Lighting, where the page is the light: scrolling switches the room on and warms the whole page, a room you can dim and tune yourself,
// the three downlights compared, and the tubelight that stays on through a power cut. Room and kitchen photos are generated and
// illustrative; the rest are brochure photos. Facts are from the 2026–27 brochure.
const MEDIA='/media/browse/category/smart-lighting/';
// The comparison, row by row, for the three downlights.
const DOWNLIGHTS:{slug:string;kicker:string;rows:string[]}[]=[
 {slug:'chrome-cob-downlight',kicker:'Bright and efficient',rows:['Polished chrome reflector','100 lm/W','65, 80 or 90 mm cut-out']},
 {slug:'roundo-cob-downlight',kicker:'Black or white',rows:['Focused 36° beam','Black or white trim','55 to 90 mm cut-out']},
 {slug:'deep-cob-downlight',kicker:'Low glare',rows:['Deep-set chrome reflector, 36° beam','Light without the glare','65 to 85 mm cut-out']},
];
const ROWS=['Optics','Character','Fits'];
const SPECS=[{value:'8–18 W',label:'Downlight range'},{value:'100 lm/W',label:'Chrome efficacy'},{value:'36°',label:'Focused beam'},{value:'> 4 kV',label:'Surge protection'}];

export default function LightingStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p)}));
 const tube=products.find(p=>p.slug==='smart-tubelight');
 return <div className="sl">
  <ScrollScenes/>

  {/* Lights on: the dark room grows from a framed picture to the full screen, then its lights come up slowly,
      as if on a dimmer, and the page beneath it warms with them. */}
  <section className="sl-hero" data-scroll="pin" aria-labelledby="rg-title">
   <div className="sl-stage">
    <div className="sl-frame">
     <img className="sl-off" src={MEDIA+'room-off.webp?v=2'} alt="A living room at night, its downlights slowly coming up"/>
     <img className="sl-on" src={MEDIA+'room-warm.webp?v=2'} alt=""/>
    </div>
    <nav className="sl-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <h1 id="rg-title" className="sl-title"><span className="sl-t1">Turn it on.</span><span className="sl-t2">Set the mood.</span></h1>
    <p className="sl-hint">Scroll to switch on the lights</p>
   </div>
  </section>

  <section className="sl-try-section" aria-labelledby="sl-try-title">
   <div className="sl-wrap">
    <div className="sl-head" data-reveal><h2 id="sl-try-title">Bright for dinner. Soft for the film.</h2><p>The CCT downlights dim and move from warm to cool white. Try it.</p></div>
    <div data-reveal><LightTry off={MEDIA+'room-off.webp?v=2'} warm={MEDIA+'room-warm.webp?v=2'} cool={MEDIA+'room-cool.webp?v=2'} alt="A living room lit by smart downlights"/></div>
    <p className="sl-note">Illustrative. Dimming and colour temperature come with the IoT, CCT versions, controlled over Wi-Fi or an RF remote.</p>
   </div>
  </section>

  <section className="sl-beams" aria-labelledby="sl-beams-title">
   <div className="sl-wrap">
    <div className="sl-head sl-head--center" data-reveal><h2 id="sl-beams-title">Choose your beam.</h2><p>Every downlight runs 8 W to 18 W, in IoT and non-IoT, single colour and CCT versions.</p></div>
    <div className="sl-compare">{DOWNLIGHTS.map((d,i)=>{const p=products.find(x=>x.slug===d.slug);if(!p)return null;
     return <article key={d.slug} className="sl-model" data-reveal style={{transitionDelay:`${i*90}ms`}}>
      <SiteLink className="sl-model-media" href={p.href} aria-label={`Explore ${p.name}`}><img src={`/media/products/studio/${p.slug}.webp`} alt={`${p.name}, studio image`} loading="lazy"/><i aria-hidden="true"/></SiteLink>
      <p className="sl-kicker">{d.kicker}</p><h3>{p.name}</h3><p className="sl-tagline">{p.family.tagline}</p>
      <SiteLink className="sl-link" href={p.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
      {d.rows.map((r,k)=><p key={ROWS[k]} className="sl-row"><small>{ROWS[k]}</small>{r}</p>)}
     </article>;})}</div>
   </div>
  </section>

  {/* Power cut, told in three steps while the stage is pinned: the kitchen with every light on; the power goes and the whole
      section goes dark with it; then the tubelight flickers back on from its battery and its light spills out of the frame. */}
  {tube&&<section className="sl-outage" data-scroll="pin" data-steps="3" aria-labelledby="sl-outage-title">
   <div className="sl-stage">
    <div className="sl-out">
     <div className="sl-out-top">
      <p className="sl-out-kicker">{tube.name}</p>
      <p className="sl-out-status" aria-hidden="true"><i/><span>Mains on</span><span>Power cut</span><span>On battery</span></p>
     </div>
     <h2 id="sl-outage-title" className="sl-out-title">
      <span className="sr-only">The power went out. The light didn’t.</span>
      <span aria-hidden="true">Dinner’s on. So is every light.</span>
      <span aria-hidden="true">The power went out.</span>
      <span aria-hidden="true">The light didn’t.</span>
     </h2>
     <figure className="sl-out-scene">
      <img className="sl-out-a" src={MEDIA+'outage-on.webp'} alt="A home kitchen at night with every light on" loading="lazy"/>
      <img className="sl-out-b" src={MEDIA+'outage-backup.webp'} alt="The same kitchen in a power cut, lit only by the tubelight running on its battery" loading="lazy"/>
     </figure>
     <div className="sl-out-foot">
      <p>A built-in 2200 mAh battery keeps it shining through an outage. It switches on when it senses movement, and off when you’ve gone.</p>
      <SiteLink className="sl-link" href={tube.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
     </div>
    </div>
   </div>
  </section>}

  <section className="sl-specs-section" aria-label={`${c.name} in numbers`}>
   <dl className="sl-specs" data-reveal>{SPECS.map(x=><div key={x.label}><dd>{x.value}</dd><dt>{x.label}</dt></div>)}</dl>
  </section>
 </div>;
}
