import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import { directoryProductHref, directoryProductImage, directorySource, type DirectoryCategory, type DirectoryProduct } from '../../../lib/product-directory';
import { CATEGORY_BANNERS } from '../../../lib/directory-media';
import { CONTACT } from '../../../lib/site';
import SiteLink from '../site/SiteLink';
// Product cards and the closing banner for the product directory's category and range pages (styles in app/(site)/products/browse/range.css).

export const plural=(n:number,one:string,many=one+'s')=>`${n} ${n===1?one:many}`;

// A product photo filling its frame.
export function ProductPhoto({src,alt='',className,eager=false}:{src:string;alt?:string;className:string;eager?:boolean}){
 return <span className={`rg-photo ${className}`}><img src={src} alt={alt} loading={eager?undefined:'lazy'}/></span>;
}

// `range` labels the card with its range where several ranges share one grid.
export function ProductCard({product,range}:{product:DirectoryProduct;range?:string}){
 // A collection card is one finish of its family, so the family's "4 collections" badge would misdescribe it.
 const f=directorySource(product),chips=product.collection?[]:[...(f.badges??[]),...(f.highlights??[])].slice(0,3);
 return <SiteLink className="rg-card" href={directoryProductHref(product)} data-reveal>
  <span className="rg-card-image"><ProductPhoto className="rg-card-photo" src={directoryProductImage(product)}/>{f.code&&<span className="rg-code">{f.code}</span>}</span>
  <span className="rg-card-body">
   {range&&<span className="rg-card-range">{range}</span>}
   <strong>{product.name}</strong>
   <span className="rg-card-tagline">{f.tagline}</span>
   {chips.length>0&&<span className="rg-chips">{chips.map(c=><span key={c}>{c}</span>)}</span>}
   <span className="rg-card-foot"><span>{plural(f.variants.length,'configuration')}</span><span className="rg-arrow" aria-hidden="true"><ArrowRight size={16}/></span></span>
  </span>
 </SiteLink>;
}

// The closing call to action on a category and its range pages: one photo per category, demo, WhatsApp and email.
export function CtaBanner({category,eyebrow,body,subject}:{category:DirectoryCategory;eyebrow:string;body:string;subject:string}){
 const banner=CATEGORY_BANNERS[category.slug];
 return <section className="rg-cta" aria-labelledby="rg-cta-title">
  {banner&&<img className="rg-cta-image" src={banner.image} alt="" loading="lazy"/>}
  <div className="rg-cta-shade" aria-hidden="true"/>
  <div className="rg-wrap rg-cta-inner" data-reveal>
   <div><p className="rg-eyebrow"><span/>{eyebrow}</p><h2 id="rg-cta-title">See it working in your space.</h2><p>{body}</p></div>
   <div className="rg-actions">
    <SiteLink className="rg-btn" href="/demo">Book a free demo <ArrowRight size={16} aria-hidden="true"/></SiteLink>
    <a className="rg-btn rg-btn-outline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true"/>Chat on WhatsApp</a>
    <a className="rg-btn rg-btn-outline" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`}><Mail size={16} aria-hidden="true"/>Email us</a>
   </div>
  </div>
  {banner&&<span className="rg-caption">Illustrative imagery</span>}
 </section>;
}
