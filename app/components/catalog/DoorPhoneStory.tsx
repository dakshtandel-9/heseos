import { BellRing, ChevronRight, Mic, Phone, PhoneOff } from 'lucide-react';
import { directoryProductHref, directoryProducts, directorySource, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import './door-phone-story.css';

// Video Door Phones & Doorbells, told as one visit: an indoor monitor holds still while its screen plays Ring, See, Talk and Away.
// The monitor and phone are drawn in code; the visitor feed is a generated, illustrative image. Facts are from the 2026–27 brochure.
const MEDIA='/media/browse/category/video-door-phones-doorbells/';
const FEED=MEDIA+'visitor.webp';
// Each device photo has a transparent screen; the feed sits behind it in this box, measured from the photo (left, top, width, height).
const MONITOR_SCREEN={left:'19.52%',top:'20.01%',width:'61%',height:'47.13%'};
const PHONE_SCREEN={left:'4.19%',top:'1.69%',width:'91.61%',height:'94.35%'};
const STEPS=[
 {title:'Ring.',body:'Your visitor presses the bell. Inside, the monitor rings.'},
 {title:'See.',body:'Live video of your entrance before you go near the door. The smart doorbell sees 130° wide, and in infrared at night.'},
 {title:'Talk.',body:'Two-way audio, so you can speak to whoever is there before you open up.'},
 {title:'Away.',body:'Not home? The smart doorbell rings your phone over Wi-Fi, in the HESEOS app.'},
];
// The doorbell's headline numbers, from its brochure specs.
const SPECS=[{value:'130°',label:'Wide-angle view'},{value:'2 MP',label:'HD camera'},{value:'IR',label:'Night vision'},{value:'2-way',label:'Intercom'}];
// The comparison, row by row, for the three products in directory order.
const COMPARE:{label:string;values:Record<string,string>}[]=[
 {label:'Connects over',values:{'ip-video-door-phone':'Your internet network (IP)','analog-video-door-phone':'Analog wiring','smart-doorbell':'Wi-Fi, with a rechargeable battery'}},
 {label:'You see',values:{'ip-video-door-phone':'High-quality video and audio','analog-video-door-phone':'Live visuals of your entrance','smart-doorbell':'2 MP HD, 130° wide angle, infrared night vision'}},
 {label:'Answer from',values:{'ip-video-door-phone':'Indoor monitor, integrated with the HESEOS smart home','analog-video-door-phone':'Indoor monitor','smart-doorbell':'Your phone, in the HESEOS app'}},
 {label:'Made for',values:{'ip-video-door-phone':'Homes and businesses','analog-video-door-phone':'Homes, workplaces and residential complexes','smart-doorbell':'Homes'}},
];

export default function DoorPhoneStory({category:c}:{category:DirectoryCategory}){
 const products=directoryProducts(c).map(p=>({...p,family:directorySource(p),href:directoryProductHref(p),image:`/media/products/studio/${p.slug}.webp`}));
 const bell=products.find(p=>p.slug==='smart-doorbell')?.family;
 return <div className="vd">
  <ScrollScenes/>

  {/* Through the lens: the doorbell at dusk; scrolling dives into its camera and the visitor appears out of it. */}
  <section className="vd-hero" data-scroll="pin" aria-labelledby="rg-title">
   <div className="vd-hero-stage">
    <img className="vd-bell" src={MEDIA+'doorbell-hero.webp'} alt="A Heseos smart doorbell on a stone wall beside a carved front door at dusk" fetchPriority="high"/>
    <span className="vd-pulse" aria-hidden="true"><i/><i/><i/></span>
    <div className="vd-lens" aria-hidden="true"><img src={FEED} alt=""/><p className="vd-chip"><i/>Live · Front door</p></div>
    <nav className="vd-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="vd-hero-copy"><h1 id="rg-title">Never miss who’s at the door.</h1><p className="vd-hint">Scroll to answer</p></div>
    <div className="vd-hero-after"><p>See who’s there before you open the door.</p><div className="vd-ctas"><a className="vd-link" href="#vd-compare">Find yours <ChevronRight size={16} aria-hidden="true"/></a><SiteLink className="vd-link" href="/demo">Book a free demo <ChevronRight size={16} aria-hidden="true"/></SiteLink></div></div>
   </div>
  </section>

  <section className="vd-call" id="vd-call" data-scroll="pin" data-steps={STEPS.length} style={{'--steps':STEPS.length} as React.CSSProperties} aria-labelledby="vd-call-title">
   <div className="vd-stage">
    <div className="vd-steps">
     <h2 id="vd-call-title">Someone’s at the door.</h2>
     <ol>{STEPS.map((s,k)=><li key={s.title} style={{'--k':k} as React.CSSProperties}><b>{s.title}</b><span>{s.body}</span><i aria-hidden="true"/></li>)}</ol>
    </div>
    <div className="vd-device" aria-hidden="true">
     <div className="vd-monitor">
      <div className="vd-screen" style={MONITOR_SCREEN}>
       <img src={FEED} alt=""/>
       <div className="vd-ring"><span><BellRing size={28} strokeWidth={1.6}/></span><b>Front door</b><small>is ringing</small></div>
       <p className="vd-live"><i/>Live · Front door</p>
       <div className="vd-talk"><Mic size={15}/><span className="vd-wave">{Array.from({length:14},(_,i)=><i key={i} style={{'--d':`${(i*137)%600}ms`} as React.CSSProperties}/>)}</span><small>Talking</small></div>
      </div>
      <img className="vd-frame" src={MEDIA+'monitor.webp'} alt=""/>
     </div>
     <div className="vd-phone">
      <div className="vd-phone-screen" style={PHONE_SCREEN}>
       <img src={FEED} alt=""/>
       <p className="vd-caller"><small>HESEOS · Smart Doorbell</small>Front door</p>
       <div className="vd-phone-actions"><span><i className="vd-decline"><PhoneOff size={22}/></i>Decline</span><span><i className="vd-accept"><Phone size={22}/></i>Answer</span></div>
      </div>
      <img className="vd-frame" src={MEDIA+'phone.webp'} alt=""/>
     </div>
    </div>
   </div>
  </section>

  <section className="vd-compare" id="vd-compare" aria-labelledby="vd-compare-title">
   <div className="vd-wrap">
    <div className="vd-head" data-reveal><h2 id="vd-compare-title">Which one is right for you?</h2></div>
    <div className="vd-table" role="table" aria-label="Compare video door phones and doorbells">
     <div className="vd-row vd-row--head" role="row"><span role="columnheader"/>{products.map(p=><div key={p.slug} role="columnheader" className="vd-col-head" data-reveal>
      <SiteLink href={p.href} className="vd-col-media"><img src={p.image} alt={`${p.name}, studio image`} loading="lazy"/></SiteLink>
      <h3>{p.name}</h3><p>{p.family.tagline}</p><SiteLink className="vd-link" href={p.href}>Learn more <ChevronRight size={15} aria-hidden="true"/></SiteLink>
     </div>)}</div>
     {COMPARE.map(r=><div key={r.label} className="vd-row" role="row" data-reveal><span role="rowheader">{r.label}</span>{products.map(p=><span key={p.slug} role="cell" data-label={p.name}>{r.values[p.slug]??'—'}</span>)}</div>)}
    </div>
   </div>
  </section>

  {bell&&<section className="vd-spot" data-scroll="view" aria-labelledby="vd-spot-title">
   <div className="vd-wrap">
    <div className="vd-spot-head" data-reveal><h2 id="vd-spot-title">{bell.name}.<br/><span>Wide enough for the whole porch. Clear enough at midnight.</span></h2></div>
    <div className="vd-daynight">
     <figure data-reveal><img src="/media/catalog/smart-doorbell/smart-doorbell-day.webp" alt="The smart doorbell beside a carved front door by day" loading="lazy"/><figcaption>By day</figcaption></figure>
     <figure data-reveal><img src="/media/catalog/smart-doorbell/smart-doorbell-night.webp" alt="The smart doorbell beside the same door at night" loading="lazy"/><figcaption>By night, with infrared vision</figcaption></figure>
    </div>
    <dl className="vd-specs" data-reveal>{SPECS.map(x=><div key={x.label}><dd>{x.value}</dd><dt>{x.label}</dt></div>)}</dl>
   </div>
  </section>}
 </div>;
}
