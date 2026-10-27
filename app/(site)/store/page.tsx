import type { Metadata } from 'next';
import { CalendarCheck, MessageCircle, Package } from 'lucide-react';
import { PACKAGE_IMAGE, PACKAGE_TYPES, PRODUCTS, formatINR, getPackage } from '../../../lib/catalog';
import SiteLink from '../../components/site/SiteLink';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'Store',description:'Buy the Heseos IR Blaster and Smart Plug, or a complete Smart Package for your home.'};
export default function StorePage(){
 return <>
  <section className="section store-head"><h1 className="display">Store.</h1><p className="lead">Smart homes, ready to order. Or let us show you first, with a free demo.</p></section>
  <section className="section store-row" aria-labelledby="components-title">
   <h2 id="components-title" className="title">The components.</h2>
   <div className="product-grid">{PRODUCTS.map(p=><SiteLink key={p.slug} href={`/store/buy/${p.slug}`} className="product-card link-card">
    <img src={p.image} alt="" loading="lazy"/><span className="eyebrow">{p.eyebrow}</span><h3 className="title">{p.name}</h3>
    <p className="product-card-price">{p.price?<>{formatINR(p.price)} <s>{formatINR(p.mrp!)}</s></>:'In Smart Packages'}</p></SiteLink>)}</div>
  </section>
  <section className="section store-row light" aria-labelledby="packages-title">
   <h2 id="packages-title" className="title">Smart Packages. Everything for your home.</h2>
   <div className="product-grid">{PACKAGE_TYPES.map(t=>{const from=getPackage(t.id,1,'starter');const image=PACKAGE_IMAGE[t.id];return <SiteLink key={t.id} href={`/packages?type=${t.id}`} className="product-card link-card">
    {image?<img src={image} alt="" loading="lazy"/>:<span className="placeholder product-card-placeholder">{t.name}</span>}<h3 className="title">{t.name}</h3><p className="muted">{t.summary}</p>
    <p className="product-card-price">From {formatINR(from.price)}</p></SiteLink>;})}</div>
  </section>
  <section className="section store-row" aria-labelledby="help-title">
   <h2 id="help-title" className="title">Help is here.</h2>
   <div className="help-grid">
    <SiteLink href="/demo" className="help-card"><CalendarCheck size={28}/><h3>Book a free demo</h3><p className="muted">See Heseos working in your home.</p></SiteLink>
    <SiteLink href="/build" className="help-card"><Package size={28}/><h3>Build your smart home</h3><p className="muted">Answer three questions, get a package.</p></SiteLink>
    <SiteLink href="/support" className="help-card"><MessageCircle size={28}/><h3>Talk to us</h3><p className="muted">Questions about compatibility or installation.</p></SiteLink>
   </div>
  </section>
  <Footnotes notes={['Prices and package contents as listed on heseos.com; the struck-through price is the listed MRP.']}/>
 </>;
}
