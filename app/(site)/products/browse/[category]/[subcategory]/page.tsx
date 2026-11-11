import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, Check, LayoutGrid, Mic, Wifi, Wrench } from 'lucide-react';
import { CATALOG_META } from '../../../../../../lib/products';
import { CATEGORY_HEROES, SUBCATEGORY_HEROES } from '../../../../../../lib/directory-media';
import { PRODUCT_DIRECTORY, directoryCatalogSubcategories, directoryCategory, directoryCategoryHref, directoryFamilies, directoryProductHref, directoryProductImage, directoryProducts, directoryRangeImage, directorySource, directorySubcategory, directorySubcategoryHref, type DirectoryProduct } from '../../../../../../lib/product-directory';
import SiteLink from '../../../../../components/site/SiteLink';
import { Footnotes } from '../../../../../components/site/Footer';
import Reveal from '../../../../../components/home/Reveal';
import { CtaBanner, ProductCard, ProductPhoto, plural } from '../../../../../components/catalog/RangeCards';
import '../../range.css';

type Props={params:Promise<{category:string;subcategory:string}>};
export function generateStaticParams(){return PRODUCT_DIRECTORY.flatMap(c=>c.subcategories.map(s=>({category:c.slug,subcategory:s.slug})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {category,subcategory}=await params,s=directorySubcategory(category,subcategory);if(!s)return {};
 return {title:s.name,description:directoryCatalogSubcategories(s)[0]?.description??`Browse ${s.name} from Heseos.`};
}

// A value every family states and agrees on; nothing when one is silent or they differ.
const shared=(values:(string|undefined)[])=>values.every(Boolean)&&new Set(values).size===1?values[0]:undefined;
const listJoin=(items:string[])=>items.length<2?items.join(''):`${items.slice(0,-1).join(', ')} and ${items.at(-1)}`;

// A one-product range gets the product itself, with its features and key specs.
function FeaturedProduct({product}:{product:DirectoryProduct}){
 const f=directorySource(product),href=directoryProductHref(product);
 return <article className="rg-feature" data-reveal>
  <div className="rg-feature-media">
   <SiteLink className="rg-feature-main" href={href} aria-label={`View ${product.name}`}><ProductPhoto className="rg-feature-photo" src={directoryProductImage(product)} alt={`${product.name}, studio image`} eager/></SiteLink>
  </div>
  <div className="rg-feature-copy">
   {(f.badges??[]).length>0&&<p className="rg-chips">{f.badges!.map(b=><span key={b}>{b}</span>)}</p>}
   <h3>{product.name}</h3>
   <p className="rg-feature-tagline">{f.tagline}</p>
   <p className="rg-feature-summary">{f.summary}</p>
   <ul className="rg-feature-list">{f.features.map(x=><li key={x.title}><Check size={16} aria-hidden="true"/><span><strong>{x.title}</strong> {x.body}</span></li>)}</ul>
   <dl className="rg-feature-specs">{f.specs.slice(0,4).map(x=><div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
   <div className="rg-actions">
    <SiteLink className="rg-btn" href={href}>View product <ArrowRight size={16} aria-hidden="true"/></SiteLink>
    <SiteLink className="rg-btn rg-btn-ghost" href={`${href}#configure`}>Request a quote</SiteLink>
   </div>
  </div>
 </article>;
}

export default async function DirectorySubcategoryPage({params}:Props){
 const {category,subcategory}=await params,c=directoryCategory(category),s=directorySubcategory(category,subcategory);if(!c||!s)notFound();
 const families=directoryFamilies(s),catalog=directoryCatalogSubcategories(s),intro=catalog[0];
 const hero=SUBCATEGORY_HEROES[s.slug]??{image:directoryRangeImage(s),alt:''};
 const configurations=families.reduce((n,f)=>n+f.variants.length,0),single=s.products.length===1;
 const faqs=[...catalog.flatMap(x=>x.faqs),...CATALOG_META.faqs].map(f=>({q:f.q.trim(),a:f.a.trim()}));

 // Facts every product in the range shares, from the catalogue; a fact the products disagree on is left out.
 const worksWith=[...new Set(families.flatMap(f=>f.worksWith??[]))];
 const spec=(label:string)=>shared(families.map(f=>f.specs.find(x=>x.label===label)?.value));
 const facts=[
  {icon:LayoutGrid,label:'The range',value:`${plural(s.products.length,'product')} · ${plural(configurations,'configuration')}`},
  worksWith.length>0&&families.every(f=>f.worksWith?.length)?{icon:Mic,label:'Works with',value:listJoin(worksWith)}:null,
  shared(families.map(f=>f.installation?.join(' ')))?{icon:Wrench,label:'Installation',value:shared(families.map(f=>f.installation?.join(' ')))!}:null,
  shared(families.map(f=>f.warranty))?{icon:BadgeCheck,label:'Warranty',value:shared(families.map(f=>f.warranty))!}:null,
  spec('Connectivity')?{icon:Wifi,label:'Connectivity',value:spec('Connectivity')!}:null,
 ].filter((x):x is {icon:typeof Mic;label:string;value:string}=>Boolean(x));
 // Ranges with few shared facts fill the strip with what Heseos offers for every product (as stated on the homepage).
 for(const extra of [{icon:Wrench,label:'Installation',value:'Installed, then set up in the Heseos app'},{icon:CalendarCheck,label:'Free demo',value:'See it working in your space first'}])
  if(facts.length<3&&!facts.some(f=>f.label===extra.label))facts.push(extra);
 facts.splice(4);

 // Keep browsing: the other ranges in this category, or the other categories when this is the only one.
 const siblings=c.subcategories.filter(x=>x.slug!==s.slug);
 const more=siblings.length>0
  ?{title:`More in ${c.name}`,cards:siblings.map(x=>({key:x.slug,href:directorySubcategoryHref(c,x),image:directoryRangeImage(x),name:x.name,detail:plural(x.products.length,'product')}))}
  :{title:'Explore other categories',cards:PRODUCT_DIRECTORY.filter(x=>x.slug!==c.slug).map(x=>({key:x.slug,href:directoryCategoryHref(x),image:CATEGORY_HEROES[x.slug]?.image??directoryRangeImage(x.subcategories[0]),name:x.name,detail:plural(directoryProducts(x).length,'product')}))};

 return <div className="range-page">
  <Reveal/>

  <section className="rg-hero" aria-labelledby="rg-title">
   <Image className="rg-hero-image" src={hero.image} alt={hero.alt?`Illustrative image: ${hero.alt}`:''} fill sizes="100vw" priority/>
   <div className="rg-hero-shade"/>
   <div className="rg-wrap rg-hero-content">
    <nav className="rg-trail" aria-label="Breadcrumb"><ol>
     <li><SiteLink href="/products">Products</SiteLink></li>
     <li><SiteLink href={directoryCategoryHref(c)}>{c.name}</SiteLink></li>
     <li><span aria-current="page">{s.name}</span></li>
    </ol></nav>
    <p className="rg-eyebrow"><span/>{c.name}</p>
    <h1 id="rg-title">{s.name}</h1>
    {intro&&<p className="rg-tagline">{intro.tagline}</p>}
    {intro&&<p className="rg-desc">{intro.description}</p>}
    <div className="rg-actions">
     <a className="rg-btn" href="#range">{single?'See the product':`Explore ${plural(s.products.length,'product')}`} <ArrowDown size={16} aria-hidden="true"/></a>
     <SiteLink className="rg-btn rg-btn-outline" href="/demo">Book a free demo</SiteLink>
    </div>
   </div>
   <span className="rg-caption">Illustrative imagery</span>
  </section>

  <section className="rg-facts" aria-label={`${s.name} at a glance`}>
   <dl className="rg-wrap rg-facts-grid" data-count={facts.length}>
    {facts.map(f=><div key={f.label}><f.icon size={20} strokeWidth={1.6} aria-hidden="true"/><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
   </dl>
  </section>

  <section className="rg-range" id="range" aria-labelledby="rg-range-title">
   <div className="rg-wrap">
    <div className="rg-head" data-reveal>
     <div><p className="rg-eyebrow rg-eyebrow-light">The range</p><h2 id="rg-range-title">{single?`Meet the ${s.products[0].name}.`:'Find the one for your space.'}</h2></div>
     {!single&&<p className="rg-head-note">Every product opens with its configurations, tech specs and a quote request.</p>}
    </div>
    {single?<FeaturedProduct product={s.products[0]}/>:<div className="rg-grid" data-count={s.products.length}>{s.products.map(p=><ProductCard key={p.slug} product={p}/>)}</div>}
   </div>
  </section>


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

  <CtaBanner category={c} eyebrow="Not sure which fits?" body={`Book a free demo and we'll recommend the right ${single?'setup':'products'} for your rooms and wiring.`} subject={`Question about ${s.name}`}/>

  <section className="rg-more" aria-labelledby="rg-more-title">
   <div className="rg-wrap">
    <div className="rg-head"><h2 id="rg-more-title">{more.title}</h2><SiteLink className="rg-inline-link" href="/products">All products <ArrowRight size={15} aria-hidden="true"/></SiteLink></div>
    <div className="rg-more-rail">{more.cards.map(x=><SiteLink key={x.key} className="rg-more-card" href={x.href}>
     <img src={x.image} alt="" loading="lazy"/>
     <span><strong>{x.name}</strong><small>{x.detail}</small></span>
     <ArrowUpRight size={17} aria-hidden="true"/>
    </SiteLink>)}</div>
   </div>
  </section>

  <Footnotes notes={[CATALOG_META.disclaimer,'Product and lifestyle images are illustrative renders.']}/>
 </div>;
}
