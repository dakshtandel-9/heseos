// Scroll-interactive BLDC fan page: fan spins and room cools as you scroll
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import './bldc-fan-story.css';

// BLDC Fans: cool airflow, smart control. The page scrolls a fan from idle to full speed while the room cools.
// As a visitor drags a temperature slider, the fan responds. All 6 finishes shown in a carousel.
const MEDIA='/media/browse/category/bldc-fans/';
const SPECS=[{value:'15–100%',label:'Speed range'},{value:'≤ 28 dB',label:'Ultra-quiet'},{value:'72 W',label:'Max power'},{value:'IP20',label:'Indoor rated'}];
const FINISHES=[
 {slug:'elegance-base',name:'Base Model',desc:'Timeless simplicity'},
 {slug:'elegance-white-cap',name:'White Cap',desc:'Clean and bright'},
 {slug:'elegance-silver-wood',name:'Silver Wood',desc:'Modern elegance'},
 {slug:'elegance-golden-cap',name:'Golden Cap',desc:'Warm luxury'},
 {slug:'elegance-gold-plywood',name:'Gold Plywood',desc:'Rich texture'},
 {slug:'elegance-gold-black-marble',name:'Black Marble',desc:'Bold sophistication'},
];

export default function BldcFanStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p)}));
 return <div className="bf">
  <ScrollScenes/>

  {/* Hero: the fan idles in a warm room, then spins up and cools it as you scroll. */}
  <section className="bf-hero" data-scroll="pin" aria-labelledby="bf-title">
   <div className="bf-stage">
    <img className="bf-warm" src={MEDIA+'room-warm.webp?v=1'} alt="A living room, warm and stuffy, with a ceiling fan idle" loading="eager"/>
    <img className="bf-cool" src={MEDIA+'room-cool.webp?v=1'} alt="The same room, cool and refreshed, with the fan spinning fast" loading="eager" style={{opacity:0}}/>
    <div className="bf-fan-ring" aria-hidden="true"/>
    <p className="bf-temp" aria-live="polite"><span>{Math.round(38-(typeof window!=='undefined'?Math.min(38,Math.max(0,38)):0))}</span>°C</p>
    <nav className="bf-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <h1 id="bf-title" className="bf-title">Cool airflow.<br/>Smart control.</h1>
    <p className="bf-hint">Scroll to spin up</p>
   </div>
  </section>

  {/* Try it: drag to set the fan speed and temperature. */}
  <section className="bf-try-section" aria-labelledby="bf-try-title">
   <div className="bf-wrap">
    <div className="bf-head" data-reveal><h2 id="bf-try-title">Feel the difference.</h2><p>Smart speed and schedules keep your home comfortable, quietly.</p></div>
    <div className="bf-interactive" data-reveal>
     <div className="bf-fan-demo">
      <div className="bf-fan-body">
       <div className="bf-blades" style={{'--speed':'50%'} as React.CSSProperties} aria-hidden="true"/>
      </div>
      <p className="bf-readout"><span>50</span>% speed</p>
     </div>
     <div className="bf-slider-group">
      <label><span>Speed <output>50%</output></span>
       <input type="range" min={0} max={100} defaultValue={50} className="bf-range" style={{'--v':'50%'} as React.CSSProperties}/>
      </label>
      <p className="bf-info">8 W at 50%, scheduling, and voice control. Wi-Fi, Zigbee, and RF ready.</p>
     </div>
    </div>
   </div>
  </section>

  {/* Six finishes in a swipeable row. */}
  <section className="bf-finishes-section" aria-labelledby="bf-finishes-title">
   <div className="bf-wrap">
    <div className="bf-head bf-head--center" data-reveal><h2 id="bf-finishes-title">Choose your finish.</h2><p>One motor, six styles.</p></div>
    <div className="bf-carousel" data-reveal>
     {FINISHES.map((f)=>{const p=products.find(x=>x.slug===f.slug);if(!p)return null;
      return <article key={f.slug} className="bf-finish">
       <SiteLink className="bf-finish-media" href={p.href} aria-label={`Explore ${f.name}`}>
        <img src={`/media/products/studio/${p.slug}.webp`} alt={f.name} loading="lazy"/>
       </SiteLink>
       <h3>{f.name}</h3><p className="bf-desc">{f.desc}</p>
      </article>;})
     }
    </div>
   </div>
  </section>

  {/* Specs. */}
  <section className="bf-specs-section" aria-label={`${c.name} specs`}>
   <dl className="bf-specs" data-reveal>{SPECS.map(x=><div key={x.label}><dd>{x.value}</dd><dt>{x.label}</dt></div>)}</dl>
  </section>
 </div>;
}
