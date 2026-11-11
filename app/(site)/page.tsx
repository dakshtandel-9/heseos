import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CATALOG_META, CATEGORIES, family, familiesInCategory, familiesOf, familyHref, subcategoriesOf, trail, type Product } from '../../lib/products';
import { directoryHrefFor } from '../../lib/product-directory';
import { CONTACT } from '../../lib/site';
import { CLIENTS, CTA, FEATURED, HERO, HOW, LISTENS, PARTNERS, POPULAR, SOLUTIONS_SECTION, TESTIMONIALS, WHY } from '../../lib/home';
import SiteLink from '../components/site/SiteLink';
import HomeIcon from '../components/home/HomeIcon';
import ProductRail from '../components/home/ProductRail';
import HeroScene from '../components/home/HeroScene';
import Reveal from '../components/home/Reveal';
import ProductExplorer from '../components/home/ProductExplorer';
import PanelStudio from '../components/home/PanelStudio';
import AppShowcase from '../components/home/AppShowcase';
import PackageShowcase from '../components/home/PackageShowcase';
import HowItWorks from '../components/home/HowItWorks';

const popular=POPULAR.map(family).filter((p):p is Product=>!!p).map(p=>({slug:p.slug,href:familyHref(p),name:p.name,tagline:p.tagline,image:p.image,range:trail(p).subcategory.name}));
const explorer=CATEGORIES.map(c=>({slug:c.slug,name:c.shortName,href:directoryHrefFor(familiesInCategory(c.slug).map(p=>p.slug),'category'),ranges:subcategoriesOf(c.slug).map(s=>({slug:s.slug,name:s.name,tagline:s.tagline,image:s.image,href:directoryHrefFor(familiesOf(s.slug).map(p=>p.slug),'subcategory'),families:familiesOf(s.slug).length}))}));
// Frame finishes as the catalogue lists them for the Edge and Bezel series.
const finishes=family('edge-panel-series')?.options.find(o=>o.key==='finish')?.values??[];
const half=Math.ceil(CLIENTS.length/2),clientRows=[CLIENTS.slice(0,half),CLIENTS.slice(half)];

function Head({eyebrow,title,body,children,id}:{eyebrow:string;title:ReactNode;body?:string;children?:ReactNode;id:string}){
 return <div className="hh" data-reveal><div><span className="ey">{eyebrow}</span><h2 id={id} className="ht">{title}</h2></div>{(body||children)&&<div className="hh-side">{body&&<p>{body}</p>}{children}</div>}</div>;
}

export default function Home(){
 return <div className="hp">
  <Reveal/>
  <HeroScene dayImage={HERO.dayImage} nightImage={HERO.nightImage} stats={CATALOG_META.stats}>
   <span className="hx-pill"><span/>Smarter energy for everyday living</span>
   <h1 id="hero-title">{HERO.title}{' '}<em>{HERO.accent}</em></h1>
   <p>{HERO.body}</p>
   <div className="ha"><SiteLink className="btn hb" href="/experience">Explore energy savings <ArrowRight size={16}/></SiteLink></div>
  </HeroScene>

  <section className="hsx lt" aria-labelledby="why-title">
   <div className="hw">
    <Head id="why-title" eyebrow={WHY.eyebrow} title={<>{WHY.title[0]}<br/><span className="mute">{WHY.title[1]}</span></>} body={WHY.body}/>
    <div className="why" data-reveal>
     <figure className="why-photo"><img src={FEATURED.detail} alt="A fingertip on a Heseos glass touch panel set in a walnut wall" loading="lazy"/><figcaption><b>Designed to be touched.</b>Glass, metal and light, made to last.</figcaption></figure>
     {WHY.cards.map((c,i)=><article key={c.title} className="why-tile"><span className="why-n">0{i+1}</span><span className="why-ico"><HomeIcon name={c.icon} size={24}/></span><h3>{c.title}</h3><p>{c.body}</p></article>)}
    </div>
   </div>
  </section>

  <section className="hsx" aria-labelledby="solutions-title">
   <div className="hw">
    <Head id="solutions-title" eyebrow={SOLUTIONS_SECTION.eyebrow} title={SOLUTIONS_SECTION.title} body={SOLUTIONS_SECTION.body}/>
    <div className="sol" data-reveal>{SOLUTIONS_SECTION.cards.map((c,i)=><SiteLink key={c.title} className="sol-card" href={`/demo?space=${encodeURIComponent(c.title)}`} aria-label={`Explore ${c.title}`}>
     <img src={c.image} alt="" loading="lazy"/>
     {'video' in c&&<video src={c.video} poster={c.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"/>}
     <span className="sol-n">0{i+1}</span>
     <span className="sol-copy"><span className="sol-name"><span className="sol-ico"><HomeIcon name={c.icon} size={18}/></span>{c.title}</span><span className="sol-body">{c.body}</span></span>
    </SiteLink>)}</div>
   </div>
  </section>

  <section className="hsx lt" aria-labelledby="products-title">
   <div className="hw">
    <Head id="products-title" eyebrow="Our products" title="Intelligent products for a connected world." body="A complete range of smart products designed for beautiful, effortless living.">
     <SiteLink className="btn secondary small" href="/products">View All Products <ArrowRight size={14}/></SiteLink>
    </Head>
    <div data-reveal><ProductExplorer categories={explorer}/></div>
   </div>
  </section>

  <PanelStudio data={FEATURED} finishes={finishes}/>

  <section className="hsx lt" aria-labelledby="listens-title">
   <div className="hw">
    <Head id="listens-title" eyebrow="Connected living" title={LISTENS.title} body={LISTENS.body}/>
    <figure className="ls-media" data-reveal>
     <img src={LISTENS.image} alt="An open-plan living room with a ceiling fan, downlights, curtains, a touch panel, a smart door lock and a smart plug" loading="lazy"/>
     {LISTENS.hotspots.map(h=><SiteLink key={h.label} href={h.href} className={'spot'+(h.x>60?' left':'')+(h.y<20?' below':'')} style={{left:`${h.x}%`,top:`${h.y}%`}}>
      <span className="spot-dot" aria-hidden="true"/><span className="spot-card"><b>{h.label}</b><span>{h.detail}</span></span>
     </SiteLink>)}
    </figure>
    <ul className="ls-points" data-reveal>{LISTENS.points.map(p=><li key={p.title}><span className="pi"><HomeIcon name={p.icon} size={20}/></span><span><b>{p.title}</b><span>{p.body}</span></span></li>)}</ul>
   </div>
  </section>

  <AppShowcase/>

  <section className="hsx lt" aria-label="Popular products">
   <div className="hw" data-reveal><ProductRail eyebrow="Featured products" title="Popular products for smarter living." items={popular}/></div>
  </section>

  <PackageShowcase/>

  <section className="hsx lt trust" aria-label="Clients and partners">
   <div className="hw trust-head" data-reveal>
    <div><span className="ey">Our clients</span><h2 className="ht">Trusted by leading brands.</h2></div>
    <div className="trust-partners"><span>Exclusive partners</span><ul>{PARTNERS.map(p=><li key={p.name}><img src={p.logo} alt={p.name} loading="lazy"/></li>)}</ul></div>
   </div>
   <div className="marquees">{clientRows.map((row,r)=><div key={r} className={'marquee'+(r?' rev':'')}><ul>{[...row,...row].map((c,i)=><li key={i} aria-hidden={i>=row.length}><img src={c.logo} alt={i<row.length?c.name:''} loading="lazy"/></li>)}</ul></div>)}</div>
   {TESTIMONIALS.length>0&&<div className="hw quotes">{TESTIMONIALS.map(t=><figure key={t.name}><blockquote>“{t.quote}”</blockquote><figcaption><b>{t.name}</b>{t.role}</figcaption></figure>)}</div>}
  </section>

  <section className="hsx how" aria-labelledby="how-title">
   <div className="hw">
    <Head id="how-title" eyebrow={HOW.eyebrow} title={<>{HOW.title[0]}<br/><span className="mute">{HOW.title[1]}</span></>}><p>{HOW.body[0]}<br/>{HOW.body[1]}</p></Head>
    <div data-reveal><HowItWorks steps={HOW.steps}/></div>
   </div>
  </section>

  <section className="cta" aria-labelledby="cta-title">
   <img src={CTA.image} alt="A sunlit modern home overlooking the coast" width={1916} height={821} loading="lazy" decoding="async"/>
   <div className="hw" data-reveal>
    <span className="ey">Free home demo</span>
    <h2 id="cta-title">{CTA.title}</h2><p>{CTA.body}</p>
    <div className="ha"><SiteLink className="btn hb" href="/demo">Book a Demo <ArrowRight size={16}/></SiteLink><a className="btn secondary" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">Talk to an Expert <ArrowUpRight size={16}/></a></div>
   </div>
  </section>
 </div>;
}
