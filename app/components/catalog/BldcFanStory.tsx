import { Mic, Smartphone, Radio } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import FanFinish, { type Finish } from './FanFinish';
import './bldc-fan-story.css';

// BLDC Fans, told from the sofa looking up. The hero is one real Elegance fan (a cut-out of its product render) on a generated,
// illustrative ceiling: scrolling switches it on, spins it up and cools the afternoon light. Then the six collections, still, so the
// finish reads; how you run it; and the numbers. Every fact is from the 2026–27 catalogue (data/products.json).
const MEDIA='/media/browse/category/bldc-fans/';
const fanImage=(slug:string)=>`${MEDIA}fan-${slug.replace(/^elegance-/,'')}.webp`;
const ORDER=['elegance-gold-black-marble','elegance-golden-cap','elegance-gold-plywood','elegance-silver-wood','elegance-white-cap','elegance-base'];
const BEATS=[
 {title:'Look up.',body:'Four o’clock in May. The air hasn’t moved all afternoon.'},
 {title:'Quiet air.',body:'A brushless DC motor turns smoothly and almost silently, on less power than a traditional fan.'},
 {title:'Smart control.',body:'Set the speed from the remote, the Heseos app, or just by asking.'},
];
const CONTROLS=[
 {icon:Radio,title:'Smart remote',body:'A dedicated remote for when your phone isn’t to hand.'},
 {icon:Smartphone,title:'The Heseos app',body:'Switch it on and set the speed over Wi-Fi.'},
 {icon:Mic,title:'Your voice',body:'Google Home, Amazon Alexa and Apple Siri.'},
];
const SPECS=[{value:'BLDC',label:'High-torque motor'},{value:'6',label:'Collections'},{value:'< 5%',label:'Harmonic distortion (THD)'},{value:'3 years',label:'Warranty'}];

export default function BldcFanStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c);
 const finishes:Finish[]=ORDER.flatMap(slug=>{const p=products.find(x=>x.slug===slug);if(!p)return [];const src=directorySource(p);
  return [{slug,name:p.name,tagline:src.tagline,href:directoryProductHref(p),image:fanImage(slug),colours:src.options?.find(o=>o.key==='colour')?.values??[]}];});
 return <div className="bf">
  <ScrollScenes/>

  {/* Look up: the fan hangs still in the afternoon heat. Scrolling switches it on; it spins up until the blades blur into a disc,
      and the gold light on the ceiling cools as the story moves through its three beats. */}
  <section className="bf-hero" data-scroll="pin" data-steps="3" aria-labelledby="bf-title">
   <div className="bf-stage">
    <img className="bf-ceiling" src={MEDIA+'ceiling.webp'} alt="Looking up at a living-room ceiling in late-afternoon sun, an Elegance Gold Black Marble fan overhead" fetchPriority="high"/>
    <div className="bf-cool" aria-hidden="true"/>
    <div className="bf-hero-fan" aria-hidden="true">
     <img className="bf-hero-sharp" src={fanImage('elegance-gold-black-marble')} alt=""/>
     <div className="bf-hero-blur"><img src={fanImage('elegance-gold-black-marble')} alt=""/><img src={fanImage('elegance-gold-black-marble')} alt=""/></div>
    </div>
    <div className="bf-shade" aria-hidden="true"/>
    <nav className="bf-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="bf-copy">
     <h1 id="bf-title" className="bf-title"><span className="sr-only">{c.name}: quiet air, smart control.</span>{BEATS.map(b=><span key={b.title} aria-hidden="true">{b.title}</span>)}</h1>
     <div className="bf-beats" aria-hidden="true">{BEATS.map(b=><p key={b.title}>{b.body}</p>)}</div>
     <p className="bf-steps" aria-hidden="true">{BEATS.map(b=><i key={b.title}/>)}</p>
    </div>
    <p className="bf-hint">Scroll to switch it on</p>
   </div>
  </section>

  <section className="bf-pick-section" aria-labelledby="bf-pick-title">
   <div className="bf-wrap">
    <div className="bf-head" data-reveal><h2 id="bf-pick-title">Six collections. One quiet motor.</h2><p>This is the view you’ll live with, so pick the one that looks right overhead. Then switch it on.</p></div>
    <div data-reveal><FanFinish finishes={finishes}/></div>
    <p className="bf-note">Product renders. The ceiling above is an illustrative scene.</p>
   </div>
  </section>

  <section className="bf-control-section" aria-labelledby="bf-control-title">
   <div className="bf-wrap">
    <div className="bf-head bf-head--center" data-reveal><h2 id="bf-control-title">Run it your way.</h2><p>Every Elegance fan answers to three things.</p></div>
    <ul className="bf-controls">{CONTROLS.map((x,k)=><li key={x.title} data-reveal style={{transitionDelay:`${k*90}ms`}}><x.icon size={26} strokeWidth={1.5} aria-hidden="true"/><h3>{x.title}</h3><p>{x.body}</p></li>)}</ul>
   </div>
  </section>

  <section className="bf-specs-section" aria-label={`${c.name} in numbers`}>
   <dl className="bf-specs" data-reveal>{SPECS.map(x=><div key={x.label}><dd>{x.value}</dd><dt>{x.label}</dt></div>)}</dl>
  </section>
 </div>;
}
