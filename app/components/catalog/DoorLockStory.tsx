import { ArrowDown, ArrowRight, CreditCard, DoorClosed, Fingerprint, KeyRound, Layers, LockKeyholeOpen, Smartphone } from 'lucide-react';
import { directoryProducts, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import ExplodeFilm from './ExplodeFilm';
import { StoryLineup } from './CategoryStory';
import { plural } from './RangeCards';
import type { CategoryStoryContent } from './stories';
import './category-story.css';
import './explode-hero.css';
import './door-lock-story.css';

// Smart Door Locks, told without taking the lock apart: the lock wakes on a walnut door at night (two stills of one
// generated frame, unlit and lit, crossfaded by scroll), then the studio shot shows each way in as the camera moves to
// that part, then a coming-home film. Facts are from the 2026–27 brochure (wooden-door-lock); media notes are in
// public/media/browse/category/smart-door-locks/SOURCES.md.
const MEDIA='/media/browse/category/smart-door-locks/';
const STUDIO='/media/products/studio/wooden-door-lock.webp';
// Each way in: where the camera moves on the studio shot (x/y in percent of the square image) and how close it gets.
const WAYS=[
 {icon:Fingerprint,title:'Touch.',body:'Your fingertip is the key, read by the sensor on the lever itself.',x:67.5,y:47,z:2.6},
 {icon:KeyRound,title:'Type.',body:'A passcode on the touch keypad, or a scramble code: extra digits around yours, so no one can read it over your shoulder.',x:60,y:26,z:2.3},
 {icon:CreditCard,title:'Tap.',body:'An RFID card, held to the keypad. Handy for anyone who’d rather not use a code.',x:60,y:30,z:1.9},
 {icon:Smartphone,title:'Phone.',body:'Unlock from the HESEOS app, or send a one-time code (OTP) to a guest.',x:50,y:50,z:1},
 {icon:LockKeyholeOpen,title:'Key.',body:'A mechanical key behind the cover, and a USB power interface for when the batteries run flat.',x:60,y:66,z:2.4},
];
const LINEUP:CategoryStoryContent['lineup']={title:'Find the lock for your door.',kind:'product',items:[
 {slug:'wooden-door-lock',kicker:'Front doors',facts:[{icon:KeyRound,text:'7 ways in, including OTP'},{icon:DoorClosed,text:'Most wooden and metal doors'},{icon:Layers,text:'4 models'}]},
 {slug:'screen-door-lock',kicker:'See who’s there',facts:[{icon:KeyRound,text:'6 ways in, including face recognition'},{icon:DoorClosed,text:'Built-in screen'},{icon:Layers,text:'4 models'}]},
 {slug:'lever-door-lock',kicker:'Homes and offices',facts:[{icon:KeyRound,text:'Fingerprint, app, passcode or key'},{icon:DoorClosed,text:'Lever-handle doors'},{icon:Layers,text:'1 model'}]},
 {slug:'glass-door-lock',kicker:'Made for glass',facts:[{icon:KeyRound,text:'6 ways in, with access records'},{icon:DoorClosed,text:'Glass doors'},{icon:Layers,text:'2 models'}]},
 {slug:'sliding-door-lock',kicker:'Made to slide',facts:[{icon:KeyRound,text:'5 ways in, with a backup key'},{icon:DoorClosed,text:'Sliding doors'},{icon:Layers,text:'1 model'}]},
 {slug:'drawer-lock',kicker:'Inside the home',facts:[{icon:KeyRound,text:'Fingerprint'},{icon:DoorClosed,text:'Drawers and cabinets'},{icon:Layers,text:'2 models'}]},
]};
// Caption windows follow the film (5 s): her finger is on the sensor to ~1 s, the door swings from ~1.5 s, she steps in from ~3 s.
const CAPS=[
 {time:'6:48 PM',title:'One touch.',body:'Her fingerprint, read right on the lever. No keys to find in the bag.',from:-1,to:.3},
 {title:'Unlocked.',body:'Press the lever and the door swings in.',from:.3,to:.62},
 {title:'Welcome home.',body:'Fingerprint, passcode, scramble code, card, app, OTP or key.',from:.62,to:2},
];
const FACTS=[{value:'7',label:'Ways to unlock'},{value:'Alloy',label:'Aluminium panel, anti-corrosion'},{value:'USB',label:'Backup power interface'},{value:'Wood & metal',label:'Fits most front doors'}];
const STATEMENT='No more keys under the mat. Just a door that knows the people you trust.';

export default function DoorLockStory({category:c}:{category:DirectoryCategory}){
 const count=directoryProducts(c).length;
 const words=STATEMENT.split(' ');
 return <div className="sw dl">
  <ScrollScenes/>

  {/* 1 · Hero: the lock asleep on the door; scrolling wakes it (keypad and fingerprint ring light up) and it says hello. */}
  <section className="dl-hero" data-scroll="pin" aria-labelledby="rg-title">
   <div className="dl-hero-stage">
    <img className="dl-hero-img" src={MEDIA+'hero-asleep.webp'} alt="The HESEOS Smart Wooden Door Lock on a walnut front door at night: a slim black panel with a touch keypad, the HESEOS logo and a fingerprint lever" fetchPriority="high"/>
    <img className="dl-hero-img dl-hero-awake" src={MEDIA+'hero-awake.webp'} alt=""/>
    <nav className="sw-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="dl-hero-copy">
     <p className="sw-eyebrow">{c.name}</p>
     <h1 id="rg-title">The key<br/>is you.</h1>
     <p className="dl-hero-sub">Locks that open to your fingerprint, a code, a card or your phone. Seven ways in, and no keys under the mat.</p>
     <div className="dl-ctas"><a className="sw-btn" href="#sw-ranges">Explore {plural(count,'lock')} <ArrowDown size={15} aria-hidden="true"/></a><SiteLink className="sw-link" href="/demo">Book a free demo <ArrowRight size={15} aria-hidden="true"/></SiteLink></div>
     <p className="dl-status" aria-hidden="true"><i/>Fingerprint recognised · Welcome home</p>
    </div>
   </div>
  </section>

  <section className="sw-words" data-scroll="view" aria-label={c.name}>
   <p style={{'--n':words.length} as React.CSSProperties}>{words.map((w,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{w} </span>)}</p>
  </section>

  {/* 2 · Seven ways in: the studio shot holds still while the camera moves to each part as its step is reached. */}
  <section className="dl-ways" id="dl-ways" data-scroll="pin" data-steps={WAYS.length} style={{'--steps':WAYS.length} as React.CSSProperties} aria-labelledby="dl-ways-title">
   <div className="dl-ways-stage">
    <div className="dl-ways-copy">
     <p className="sw-eyebrow">Ways in</p>
     <h2 id="dl-ways-title">Seven ways in.<br/><span>One for everyone you trust.</span></h2>
     <ol>{WAYS.map((w,k)=><li key={w.title} style={{'--k':k} as React.CSSProperties}><w.icon size={22} strokeWidth={1.6} aria-hidden="true"/><b>{w.title}</b><span>{w.body}</span><i aria-hidden="true"/></li>)}</ol>
    </div>
    <div className="dl-ways-media" aria-hidden="true">
     <div className="dl-cam" style={Object.fromEntries(WAYS.flatMap((w,k)=>[[`--x${k}`,`${w.x}%`],[`--y${k}`,`${w.y}%`],[`--z${k}`,w.z]])) as React.CSSProperties}><img src={STUDIO} alt=""/></div>
     <div className="dl-phone"><small>HESEOS · Front door</small><span className="dl-phone-lock"><LockKeyholeOpen size={26} strokeWidth={1.6}/></span><b>Unlocked</b><div className="dl-otp"><small>One-time code for Asha</small><p>482 917</p><small>Valid today until 11:00 AM</small></div></div>
    </div>
   </div>
  </section>

  {/* 3 · Coming home: a film scrubbed by scroll (ExplodeFilm writes its run to --open); the door is hinged on the right and swings in. */}
  <section className="sw-film dl-film" data-film data-scroll="pin" aria-labelledby="sw-film-title">
   <div className="sw-stage">
    <ExplodeFilm src={MEDIA+'coming-home.mp4'} srcSmall={MEDIA+'coming-home-720.mp4'} poster={MEDIA+'coming-home-poster.webp'} still={MEDIA+'coming-home-end.webp'} label="A woman touches the fingerprint sensor on her HESEOS lock, the door swings into her flat and she walks in" start={.02} span={.86}/>
    <h2 id="sw-film-title" className="sw-film-title">Coming home, keyless.</h2>
    <ol className="sw-film-caps">{CAPS.map(cap=><li key={cap.title} style={{'--a':cap.from,'--b':cap.to} as React.CSSProperties}>{cap.time&&<small>{cap.time}</small>}<b>{cap.title}</b><span>{cap.body}</span></li>)}</ol>
    <div className="sw-film-rail" aria-hidden="true"><i/></div>
   </div>
  </section>

  {/* 4 · Guests: the app and one-time codes, on the site's own app photo. */}
  <section className="dl-guests" aria-labelledby="dl-guests-title">
   <div className="sw-wrap dl-guests-grid">
    <figure data-reveal><img src="/media/catalog/wooden-door-lock/wooden-door-lock-wooden-app.webp" alt="A phone showing the HESEOS app unlocking a smart wooden door lock" loading="lazy"/></figure>
    <div data-reveal>
     <p className="sw-eyebrow">From anywhere</p>
     <h2 id="dl-guests-title">Let them in.<br/><span>Even when you’re out.</span></h2>
     <p>Family visiting early? The house help at nine? Open the door from the HESEOS app, or send a one-time code that works once and then never again.</p>
     <SiteLink className="sw-link" href="/app">See the HESEOS app <ArrowRight size={15} aria-hidden="true"/></SiteLink>
    </div>
   </div>
  </section>

  <section className="dl-facts" aria-label="The Smart Wooden Door Lock in numbers">
   <dl className="sw-wrap">{FACTS.map(f=><div key={f.label} data-reveal><dd>{f.value}</dd><dt>{f.label}</dt></div>)}</dl>
  </section>

  <StoryLineup category={c} lineup={LINEUP}/>
 </div>;
}
