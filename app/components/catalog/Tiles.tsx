import type { FamilyCard } from '../../../lib/products';
import SiteLink from '../site/SiteLink';
// A product family in a listing: the family first, its configurations are chosen on the product page.
export function FamilyTile({card,placeholderImage=false}:{card:FamilyCard;placeholderImage?:boolean}){
 return <SiteLink href={card.href} className="product-card link-card family-card">
  {placeholderImage?<span className="family-image-placeholder" aria-hidden="true"/>:<img src={card.image} alt="" loading="lazy"/>}
  <span className="eyebrow">{[card.subcategory,card.code].filter(Boolean).join(' · ')}</span>
  <h3 className="title">{card.name}</h3><p className="muted">{card.tagline}</p>
  {card.badges.length>0&&<ul className="badges">{card.badges.map(b=><li key={b}>{b}</li>)}</ul>}
  <p className="family-card-meta">{card.configurations===1?'1 configuration':`${card.configurations} configurations`} ›</p>
 </SiteLink>;
}
export function SubcategoryTile({href,name,image,detail}:{href:string;name:string;image:string;detail:string}){
 return <SiteLink href={href} className="sub-tile link-card"><img src={image} alt="" loading="lazy"/><span><b>{name}</b><span className="muted">{detail}</span></span></SiteLink>;
}
export function Faqs({items}:{items:{q:string;a:string}[]}){
 return <div className="faqs">{items.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>;
}
