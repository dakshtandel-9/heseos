import type { Metadata } from 'next';
import { PRODUCTS, formatINR } from '../../../lib/catalog';
import SiteLink from '../../components/site/SiteLink';
export const metadata: Metadata = {title:'Products',description:'The Heseos Touch Panel, IR Blaster and Smart Plug.'};
export default function ProductsPage(){
 return <section className="section">
  <div className="section-head"><h1 className="headline">Three components. One smart home.</h1><p className="lead">Start with one, or bring all three together in a Smart Package.</p></div>
  <div className="product-grid">{PRODUCTS.map(p=><article key={p.slug} className="product-card">
   <img src={p.image} alt={`Heseos ${p.name}`} loading="lazy"/><span className="eyebrow">{p.eyebrow}</span><h2 className="title">{p.name}</h2><p className="muted">{p.tagline}</p>
   <p className="product-card-price">{p.price?`From ${formatINR(p.price)}`:'In Smart Packages'}</p>
   <div className="actions"><SiteLink className="btn small" href={`/products/${p.slug}`}>Learn more</SiteLink><SiteLink className="link" href={`/store/buy/${p.slug}`}>{p.price?'Buy':'Packages'} ›</SiteLink></div>
  </article>)}</div>
 </section>;
}
