import type { CSSProperties } from 'react';
import { ArrowUpRight, Flag, GraduationCap, Headset, Layers, Megaphone, Sparkles } from 'lucide-react';
import { PARTNER_BENEFITS } from '../../../lib/partners';
import SiteLink from '../site/SiteLink';

// Why Heseos, as a six-key glass touch panel. While the section is pinned, scrolling switches the keys on one by one
// (--p from ScrollScenes) and the reason behind each key takes the stage; by the end every key is lit.
const ICONS={layers:Layers,flag:Flag,graduation:GraduationCap,sparkles:Sparkles,headset:Headset,megaphone:Megaphone};
const n=PARTNER_BENEFITS.length;

export default function PartnerSwitch(){
 return <section className="pk" data-scroll="pin" data-steps={n} aria-labelledby="pt-benefits-title">
  <div className="pk-stage">
   <div className="pk-wrap">
    <div className="pk-head">
     <p className="pt-eyebrow"><span/>Why Heseos</p>
     <h2 id="pt-benefits-title">Everything you need<br/> to win the project.</h2>
     <p className="pk-lede">We do not just ship boxes. Partners get the products, training and people to deliver connected spaces their clients rave about.</p>
    </div>
    <div className="pk-panel" aria-hidden="true">
     <div className="pk-glass">
      {PARTNER_BENEFITS.map((b,i)=>{const Icon=ICONS[b.icon];return <span key={b.title} className="pk-key" style={{'--i':i} as CSSProperties}><i/><Icon size={22} strokeWidth={1.5}/></span>;})}
      <b className="pk-led"/>
     </div>
    </div>
    <div className="pk-items">
     {PARTNER_BENEFITS.map((b,i)=><article key={b.title} className="pk-item" style={{'--i':i} as CSSProperties}>
      <p className="pk-count"><span>0{i+1}</span> / 0{n}</p>
      <h3>{b.title}</h3><p>{b.body}</p>
      {b.icon==='sparkles'&&<SiteLink className="pt-text-link" href="/experience">Try the Simulation <ArrowUpRight size={15} aria-hidden="true"/></SiteLink>}
     </article>)}
    </div>
   </div>
  </div>
 </section>;
}
