import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, LayoutGrid, Mic, Wrench } from 'lucide-react';
import { CATALOG_META } from '../../../../../lib/products';
import { CATEGORY_HEROES, CATEGORY_INTROS, SUBCATEGORY_HEROES } from '../../../../../lib/directory-media';
import { PRODUCT_DIRECTORY, directoryCatalogSubcategories, directoryCategory, directoryCategoryHref, directoryFamilies, directoryProductImage, directoryProducts, directorySubcategoryHref } from '../../../../../lib/product-directory';
import SiteLink from '../../../../components/site/SiteLink';
import { Footnotes } from '../../../../components/site/Footer';
import Reveal from '../../../../components/home/Reveal';
import { CtaBanner, ProductCard, plural } from '../../../../components/catalog/RangeCards';
import CategoryStory from '../../../../components/catalog/CategoryStory';
import { STORIES } from '../../../../components/catalog/stories';
import DoorPhoneStory from '../../../../components/catalog/DoorPhoneStory';
import LightingStory from '../../../../components/catalog/LightingStory';
import BldcFanStory from '../../../../components/catalog/BldcFanStory';
import SecurityStory from '../../../../components/catalog/SecurityStory';
import AccessoriesStory from '../../../../components/catalog/AccessoriesStory';
import AutomationStory from '../../../../components/catalog/AutomationStory';

// Categories with a design of their own, rather than the shared story template.
const CUSTOM_STORIES:Record<string,typeof DoorPhoneStory>={'video-door-phones-doorbells':DoorPhoneStory,'smart-lighting':LightingStory,'bldc-fans':BldcFanStory,'security-sensors':SecurityStory,'smart-home-accessories':AccessoriesStory,'automation-controls':AutomationStory};
import '../range.css';

type Props={params:Promise<{category:string}>};
export function generateStaticParams(){return PRODUCT_DIRECTORY.map(c=>({category:c.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const c=directoryCategory((await params).category);
 return c?{title:c.name,description:CATEGORY_INTROS[c.slug]??`Explore ${c.name} from Heseos.`}:{};
}

// A value every family states and agrees on; nothing when one is silent or they differ.
const shared=(values:(string|undefined)[])=>values.every(Boolean)&&new Set(values).size===1?values[0]:undefined;
const listJoin=(items:string[])=>items.length<2?items.join(''):`${items.slice(0,-1).join(', ')} and ${items.at(-1)}`;

export default async function DirectoryCategoryPage({params}:Props){
 const c=directoryCategory((await params).category);if(!c)notFound();
 const subs=c.subcategories,single=subs.length===1,products=directoryProducts(c);
 const families=subs.flatMap(directoryFamilies),catalog=[...new Set(subs.flatMap(directoryCatalogSubcategories))];
 const configurations=families.reduce((n,f)=>n+f.variants.length,0);
 const hero=CATEGORY_HEROES[c.slug]??SUBCATEGORY_HEROES[subs[0].slug];
 // One range: its own description. Several: name them.
 const description=single?catalog[0]?.description:`${subs.length} ranges: ${listJoin(subs.map(s=>s.name))}.`;
 const faqs=[...new Map([...catalog.flatMap(x=>x.faqs),...CATALOG_META.faqs].map(f=>[f.q.trim(),{q:f.q.trim(),a:f.a.trim()}])).values()];

 const worksWith=[...new Set(families.flatMap(f=>f.worksWith??[]))],warranty=shared(families.map(f=>f.warranty));
 const facts=[
  {icon:LayoutGrid,label:'The collection',value:[!single&&plural(subs.length,'range'),plural(products.length,'product'),plural(configurations,'configuration')].filter(Boolean).join(' · ')},
  worksWith.length>0&&families.every(f=>f.worksWith?.length)&&{icon:Mic,label:'Works with',value:listJoin(worksWith)},
  warranty&&{icon:BadgeCheck,label:'Warranty',value:warranty},
  {icon:Wrench,label:'Installation',value:'Installed, then set up in the Heseos app'},
  {icon:CalendarCheck,label:'Free demo',value:'See it working in your space first'},
 ].filter((x):x is {icon:typeof Mic;label:string;value:string}=>Boolean(x)).slice(0,4);

 const others=PRODUCT_DIRECTORY.filter(x=>x.slug!==c.slug);
 // Categories with a story (stories.ts) open with it in place of the hero, facts and range cards.
 const story=STORIES[c.slug],Custom=CUSTOM_STORIES[c.slug];

 return <div className="range-page">
  <Reveal/>

  {story?<CategoryStory category={c} story={story}/>:Custom?<Custom category={c}/>:<>
  <section className="rg-hero" aria-labelledby="rg-title">
   <Image className="rg-hero-image" src={hero.image} alt={`Illustrative image: ${hero.alt}`} fill sizes="100vw" priority/>
   <div className="rg-hero-shade"/>
   <div className="rg-wrap rg-hero-content">
    <nav className="rg-trail" aria-label="Breadcrumb"><ol>
     <li><SiteLink href="/products">Products</SiteLink></li>
     <li><span aria-current="page">{c.name}</span></li>
    </ol></nav>
    <p className="rg-eyebrow"><span/>Product category</p>
    <h1 id="rg-title">{c.name}</h1>
    <p className="rg-tagline">{CATEGORY_INTROS[c.slug]}</p>
    {description&&<p className="rg-desc">{description}</p>}
    <div className="rg-actions">
     <a className="rg-btn" href={single?'#products':'#ranges'}>{single?`Explore ${plural(products.length,'product')}`:`Explore ${subs.length} ranges`} <ArrowDown size={16} aria-hidden="true"/></a>
     <SiteLink className="rg-btn rg-btn-outline" href="/demo">Book a free demo</SiteLink>
    </div>
   </div>
   <span className="rg-caption">Illustrative imagery</span>
  </section>

  <section className="rg-facts" aria-label={`${c.name} at a glance`}>
   <dl className="rg-wrap rg-facts-grid" data-count={facts.length}>
    {facts.map(f=><div key={f.label}><f.icon size={20} strokeWidth={1.6} aria-hidden="true"/><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
   </dl>
  </section>

  {!single&&<section className="rg-range cg-ranges" id="ranges" aria-labelledby="cg-ranges-title">
   <div className="rg-wrap">
    <div className="rg-head" data-reveal><div><p className="rg-eyebrow rg-eyebrow-light">The ranges</p><h2 id="cg-ranges-title">Choose a range.</h2></div><p className="rg-head-note">Each range has its own page with every product and answers to common questions.</p></div>
    <div className="cg-range-grid" data-count={subs.length}>
     {subs.map((s,i)=>{const img=SUBCATEGORY_HEROES[s.slug],tagline=directoryCatalogSubcategories(s)[0]?.tagline;
      return <SiteLink key={s.slug} className="cg-range-card" href={directorySubcategoryHref(c,s)} data-reveal>
       {img&&<img className="cg-range-image" src={img.image} alt="" loading="lazy"/>}
       <span className="cg-range-number">{String(i+1).padStart(2,'0')}</span>
       <span className="cg-range-copy">
        <strong>{s.name}</strong>
        {tagline&&<span className="cg-range-tagline">{tagline}</span>}
        <span className="cg-range-foot">
         <span className="cg-thumbs" aria-hidden="true">{s.products.slice(0,4).map(p=><img key={p.slug} src={directoryProductImage(p)} alt="" loading="lazy"/>)}</span>
         <span className="cg-range-count">{plural(s.products.length,'product')}</span>
         <span className="rg-arrow" aria-hidden="true"><ArrowRight size={16}/></span>
        </span>
       </span>
      </SiteLink>;})}
    </div>
   </div>
  </section>}

  </>}

  {/* A story that already shows every product leaves out the product grid. */}
  {!Custom&&story?.lineup.kind!=='product'&&<section className={single?'rg-range':'rg-range cg-products'} id="products" aria-labelledby="cg-products-title">
   <div className="rg-wrap">
    <div className="rg-head" data-reveal>
     <div><p className="rg-eyebrow rg-eyebrow-light">{single?subs[0].name:'Every product'}</p><h2 id="cg-products-title">{single?'Find the one for your space.':`All ${plural(products.length,'product')}.`}</h2></div>
     {single&&<SiteLink className="rg-inline-link" href={directorySubcategoryHref(c,subs[0])}>View the {subs[0].name} range <ArrowRight size={15} aria-hidden="true"/></SiteLink>}
    </div>
    <div className="rg-grid" data-count={Math.min(products.length,4)}>{subs.flatMap(s=>s.products.map(p=><ProductCard key={p.slug} product={p} range={single?undefined:s.name}/>))}</div>
   </div>
  </section>}

  <section className="rg-faq" aria-labelledby="rg-faq-title">
   <div className="rg-wrap rg-faq-grid">
    <div data-reveal>
     <p className="rg-eyebrow rg-eyebrow-light">Good to know</p>
     <h2 id="rg-faq-title">Questions, answered.</h2>
     <p className="rg-faq-note">Answers from the HESEOS 2026–27 catalogue. For anything else, our team is a message away.</p>
     <SiteLink className="rg-inline-link" href="/support">Visit Help &amp; Support <ArrowUpRight size={15} aria-hidden="true"/></SiteLink>
    </div>
    <div className="rg-faq-list">
     {faqs.map(f=><details key={f.q}><summary><span>{f.q}</span><i aria-hidden="true"/></summary><p>{f.a}</p></details>)}
    </div>
   </div>
  </section>

  <CtaBanner category={c} eyebrow="Not sure where to start?" body="Book a free demo and we'll recommend the right products for your rooms and wiring." subject={`Question about ${c.name}`}/>

  <section className="rg-more" aria-labelledby="rg-more-title">
   <div className="rg-wrap">
    <div className="rg-head"><h2 id="rg-more-title">Explore other categories</h2><SiteLink className="rg-inline-link" href="/products">All products <ArrowRight size={15} aria-hidden="true"/></SiteLink></div>
    <div className="rg-more-rail">{others.map(x=><SiteLink key={x.slug} className="rg-more-card" href={directoryCategoryHref(x)}>
     <img src={CATEGORY_HEROES[x.slug]?.image??SUBCATEGORY_HEROES[x.subcategories[0].slug]?.image} alt="" loading="lazy"/>
     <span><strong>{x.name}</strong><small>{plural(directoryProducts(x).length,'product')}</small></span>
     <ArrowUpRight size={17} aria-hidden="true"/>
    </SiteLink>)}</div>
   </div>
  </section>

  <Footnotes notes={[CATALOG_META.disclaimer,'Product and lifestyle images are illustrative renders.']}/>
 </div>;
}
