import { ArrowDown, ArrowRight, ArrowUpRight, Mouse } from 'lucide-react';
import { PRODUCT_DIRECTORY, directoryProductHref, directoryProducts, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ExplodeFilm from './ExplodeFilm';
import type { CategoryStoryContent } from './stories';
import './explode-hero.css';

// A category hero built around one product taken apart. The section pins (data-scroll="pin", driven by ScrollScenes
// in CategoryStory) and scrolling scrubs the film from assembled to exploded; numbered pins then mark the parts and the
// bottom bar keys those numbers like a technical drawing. Content is the story's `explode` entry (stories.ts); pin x/y
// are percentages of the film's 16:9 frame, measured on its exploded last frame.
export default function ExplodeHero({category:c,story:s,cta,ctaHref}:{category:DirectoryCategory;story:CategoryStoryContent;cta:string;ctaHref:string}){
 const x=s.explode!;
 const product=PRODUCT_DIRECTORY.flatMap(directoryProducts).find(p=>p.slug===x.product);
 const nn=(i:number)=>String(i+1).padStart(2,'0');
 return <section className="xh" data-explode data-scroll="pin" aria-labelledby="rg-title">
  <div className="xh-pin">
   <div className="xh-stage">
    <div className="xh-frame">
     <ExplodeFilm src={x.film} srcSmall={x.filmSmall} poster={x.poster} still={x.still} label={s.hero.alt}/>
     <ol className="xh-pins" aria-hidden="true">{x.parts.map((p,i)=><li key={p.title} style={{left:`${p.x}%`,top:`${p.y}%`,'--i':i} as React.CSSProperties}>{nn(i)}</li>)}</ol>
    </div>
   </div>
   <div className="xh-grid" aria-hidden="true"/>

   <nav className="sw-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>

   <div className="xh-copy">
    <p className="sw-eyebrow">{c.name}</p>
    <h1 id="rg-title">{s.hero.headline}</h1>
    <p className="xh-sub">{s.hero.sub}</p>
    <div className="xh-ctas"><a className="sw-btn" href={ctaHref}>{cta} <ArrowDown size={15} aria-hidden="true"/></a><SiteLink className="sw-link" href="/demo">Book a free demo <ArrowRight size={15} aria-hidden="true"/></SiteLink></div>
    {product&&<SiteLink className="xh-featured" href={directoryProductHref(product)}><span className="xh-featured-tag">Featured</span><span>{product.name}</span><ArrowUpRight size={15} aria-hidden="true"/></SiteLink>}
    <p className="xh-fig" aria-hidden="true">Fig. 01 <span>Exploded view</span> <em>Illustrative</em></p>
   </div>

   <p className="xh-hint" aria-hidden="true"><Mouse size={15}/> Scroll to take it apart</p>

   <div className="xh-hud">
    <div className="xh-rail" aria-hidden="true"><span>Assembled</span><i><b/></i><span>Exploded</span></div>
    <ol className="xh-parts" style={{'--n':x.parts.length} as React.CSSProperties} aria-label={`Inside the ${product?.name??'product'}`}>
     {x.parts.map((p,i)=><li key={p.title} style={{'--i':i} as React.CSSProperties}><span className="xh-n">{nn(i)}</span><strong>{p.title}</strong><span className="xh-body">{p.body}</span></li>)}
    </ol>
   </div>
  </div>
 </section>;
}
