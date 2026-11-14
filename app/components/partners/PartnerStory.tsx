import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { PARTNER_TRACKS } from '../../../lib/partners';

// The /partners hero is one pinned scroll story: a villa goes from an architect's sketch to a concrete shell, is fitted with Heseos,
// and is switched on, and each stage is a partnership. ScrollScenes (on the page) gives the section --p, 0 → 1, and data-step (tenths).
// Timeline as a share of the pinned scroll: opening 0–.1, chapter i from .1 + .2i to .3 + .2i, closing beat .9–1.
// Each later scene wipes in left to right behind an orange build line just before its chapter; the last one is the dark villa,
// whose lights then come up during the installation chapter. Hash links to #partner-<id> land mid-chapter.
const SPAN=500; // pinned scroll distance in vh: the section is 600vh tall, the stage 100vh
const start=(i:number)=>.1+i*.2;
const DARK='/media/partners/dark.webp';

export default function PartnerStory(){
 const [first,...rest]=PARTNER_TRACKS;
 const last=PARTNER_TRACKS[PARTNER_TRACKS.length-1];
 return <section className="pv" data-scroll="pin" data-steps="10" aria-labelledby="pt-hero-title">
  {PARTNER_TRACKS.map((t,i)=><span key={t.id} id={`partner-${t.id}`} className="pv-anchor" style={{top:`${Math.round((start(i)+.08)*SPAN)}vh`}}/>)}
  <div className="pv-stage">
   <div className="pv-scenes">
    <div className="pv-layer"><Image src={first.image} alt={`Illustrative image: ${first.alt}`} fill sizes="100vw" priority/></div>
    <i className="pv-paper" aria-hidden="true"/>
    {/* The wipes: the next chapter's scene, revealed just before the chapter begins. The lit villa is not a wipe: the dark one is. */}
    {rest.map((t,k)=>{const lit=t.id===last.id;return <div key={t.id} className="pv-layer pv-wipe" style={{'--at':start(k+1)-.035} as CSSProperties}>
     <Image src={lit?DARK:t.image} alt={lit?'':`Illustrative image: ${t.alt}`} fill sizes="100vw"/>
    </div>;})}
    <div className="pv-layer pv-lights"><Image src={last.image} alt={`Illustrative image: ${last.alt}`} fill sizes="100vw"/></div>
   </div>
   <i className="pv-veil" aria-hidden="true"/>

   <header className="pv-open">
    <p className="pt-eyebrow"><span/>Heseos Partner Program</p>
    <h1 id="pt-hero-title">Build the future<br/> of living. <em>Together.</em></h1>
    <p className="pv-open-lede">Join the dealers, designers, developers and integrators bringing Heseos smart-home automation to homes, hotels and buildings across India.</p>
    <div className="pv-open-actions">
     <a className="pt-button" href="#apply">Apply to partner <ArrowRight size={16} aria-hidden="true"/></a>
     <a className="pt-button pt-button-ink" href={`#partner-${first.id}`}>Explore partnerships <ArrowDown size={16} aria-hidden="true"/></a>
    </div>
    <p className="pv-hint" aria-hidden="true">Scroll to build a smart home</p>
   </header>

   {PARTNER_TRACKS.map((t,i)=><article key={t.id} className="pv-ch" data-i={i} style={{'--s':start(i)} as CSSProperties} aria-labelledby={`pv-ch-${t.id}`}>
    <p className="pv-ch-kicker"><span>0{i+1}</span>{t.stage}<small>{t.short}</small></p>
    <h2 id={`pv-ch-${t.id}`}>{t.label}</h2>
    <p className="pv-ch-title">{t.title}</p>
    <p className="pv-ch-who"><span>Made for</span>{t.who}</p>
    <ul>{t.gets.map(g=><li key={g}><Check size={15} aria-hidden="true"/>{g}</li>)}</ul>
    <a className="pt-button" href="#apply" data-track={t.id}>{t.cta} <ArrowRight size={16} aria-hidden="true"/></a>
   </article>)}

   <div className="pv-end">
    <p className="pv-end-line">Four partners.<br/><em>One smart home.</em></p>
    <a className="pt-button" href="#apply">Apply to partner <ArrowRight size={16} aria-hidden="true"/></a>
   </div>

   <nav className="pv-rail" aria-label="Partnership types">
    <ol>{PARTNER_TRACKS.map((t,i)=><li key={t.id} data-i={i} style={{'--s':start(i)} as CSSProperties}>
     <a href={`#partner-${t.id}`}><span className="pv-rail-n">0{i+1}</span><span className="pv-rail-stage">{t.stage}</span><span className="pv-rail-label">{t.label}</span><i aria-hidden="true"/></a>
    </li>)}</ol>
   </nav>
   <span className="pv-caption">Illustrative imagery</span>
  </div>
 </section>;
}
