import type { Metadata } from 'next';
import { ArrowRight, Check, Fan, Headphones, House, LayoutGrid, Lightbulb, LockKeyhole, PanelTop, Plug, ShieldCheck, Video } from 'lucide-react';
import { CATALOG_META } from '../../../lib/products';
import { PRODUCT_DIRECTORY, directoryCategoryHref, directoryCounts, directoryProductHref, directorySubcategoryHref, type DirectoryCategory, type DirectorySubcategory } from '../../../lib/product-directory';
import { CATEGORY_INTROS } from '../../../lib/directory-media';
import SiteLink from '../../components/site/SiteLink';
import { Footnotes } from '../../components/site/Footer';
import DirectorySearch from '../../components/catalog/DirectorySearch';

export const metadata:Metadata={title:'Products',description:'Explore Heseos smart home products across eight categories and fourteen ranges.'};

const icons={panels:PanelTop,lock:LockKeyhole,video:Video,lighting:Lightbulb,fan:Fan,security:ShieldCheck,plug:Plug,home:House};

function ArrowBubble(){return <span className="pc-arrow" aria-hidden="true"><ArrowRight size={17}/></span>;}
function RangeCard({category,subcategory,variant='small'}:{category:DirectoryCategory;subcategory:DirectorySubcategory;variant?:'small'|'feature'|'wide'}){
 return <SiteLink className={'pc-range pc-range--'+variant} href={directorySubcategoryHref(category,subcategory)}>
  <span className="pc-range-image" aria-hidden="true"><img src={`/media/products-page/${subcategory.slug}.webp`} alt="" loading="lazy"/></span>
  <span className="pc-range-copy">{variant!=='small'&&<small>Explore the range</small>}<strong>{subcategory.name}</strong><span>{subcategory.products.length} {subcategory.products.length===1?'product type':'product types'}</span><ArrowBubble/></span>
 </SiteLink>;
}
function CategorySection({category,index}:{category:DirectoryCategory;index:number}){
 const subs=category.subcategories,href=subs.length===1?directorySubcategoryHref(category,subs[0]):directoryCategoryHref(category);
 const shape=index===0?'showcase':subs.length===1?'single':subs.length===2?'rows':'showcase';
 return <section id={category.slug} className={'pc-section pc-section--'+shape+' '+(index%2===0?'pc-section--light':'pc-section--dark')} aria-labelledby={category.slug+'-title'}>
  <div className="pc-section-inner">
   <div className="pc-intro">
    <span className="pc-number"><i/> {String(index+1).padStart(2,'0')} / {String(PRODUCT_DIRECTORY.length).padStart(2,'0')}</span>
    <h2 id={category.slug+'-title'}>{category.name}</h2>
    <p>{CATEGORY_INTROS[category.slug]}</p>
    <SiteLink href={href} className={'pc-explore'+(index===0?' pc-explore--primary':'')}>Explore {category.name} <ArrowRight size={17}/></SiteLink>
    {index===0&&<ul className="pc-benefits">{['Touch, app or voice control','Made for new and existing homes','Premium finishes for modern interiors'].map(t=><li key={t}><span><Check size={15}/></span>{t}</li>)}</ul>}
   </div>
   <div className="pc-section-products">
    {shape==='single'?<RangeCard category={category} subcategory={subs[0]} variant="wide"/>:
     shape==='rows'?subs.map(s=><RangeCard key={s.slug} category={category} subcategory={s} variant="wide"/>):<>
      <RangeCard category={category} subcategory={subs[0]} variant="feature"/>
      <div className="pc-range-grid" data-cols={Math.min(subs.length-1,3)}>{subs.slice(1).map(s=><RangeCard key={s.slug} category={category} subcategory={s}/>)}</div>
     </>}
   </div>
  </div>
 </section>;
}

export default function ProductsPage(){
 const totals=directoryCounts();
 return <div className="collection-page">
  <section className="pc-hero" aria-labelledby="pc-title"><div className="pc-hero-inner">
   <div className="pc-hero-copy"><span className="pc-eyebrow"><i/> Our products</span><h1 id="pc-title">Explore the<br/>Heseos collection.</h1><p>A complete range of {totals.products} product types across {totals.subcategories} ranges, for homes, hotels, offices and buildings.</p><DirectorySearch entries={PRODUCT_DIRECTORY.flatMap(c=>c.subcategories.flatMap(s=>s.products.map(p=>({name:p.name,href:directoryProductHref(p),category:c.name,subcategory:s.name}))))}/><div className="pc-hero-chips">{PRODUCT_DIRECTORY.map(c=><a key={c.slug} href={'#'+c.slug}>{c.name}</a>)}</div></div>
   <span className="pc-hero-image" aria-hidden="true"><img src="/media/products-page/hero.webp" alt=""/></span>
  </div></section>
  <nav className="pc-category-nav" aria-label="Product categories">{PRODUCT_DIRECTORY.map(c=>{const Icon=icons[c.icon]??LayoutGrid;return <a key={c.slug} href={'#'+c.slug}><Icon size={20} strokeWidth={1.5}/><span>{c.name}</span></a>;})}</nav>
  {PRODUCT_DIRECTORY.map((c,i)=><CategorySection key={c.slug} category={c} index={i}/>)}
  <section className="pc-cta" aria-labelledby="pc-cta-title"><span className="pc-cta-image" aria-hidden="true"><img src="/media/products-page/cta.webp" alt="" loading="lazy"/></span><div className="pc-cta-inner"><div className="pc-cta-copy"><span className="pc-eyebrow"><i/> Get expert guidance</span><h2 id="pc-cta-title">Talk to an expert.</h2><p>See the products in action, get personalized recommendations and find the right setup for your space.</p><div className="pc-cta-actions"><SiteLink className="btn" href="/demo">Book a Demo <ArrowRight size={17}/></SiteLink><SiteLink className="btn secondary" href="/support"><Headphones size={17}/> Talk to an Expert</SiteLink></div></div></div></section>
  <section className="pc-stats" aria-label="Heseos in numbers"><dl>{CATALOG_META.stats.map(s=><div key={s.label}><dt>{s.label}</dt><dd className="tabular">{s.value}</dd></div>)}</dl></section>
  <Footnotes notes={[CATALOG_META.disclaimer,'Figures from the HESEOS Product Brochure 2026–27.']}/>
 </div>;
}
