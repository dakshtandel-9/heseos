import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, product } from '../../../../../lib/catalog';
import Price from '../../../../components/commerce/Price';
import AddToBag from '../../../../components/commerce/AddToBag';
import PackageCompare from '../../../../components/commerce/PackageCompare';
import VariantPicker from '../../../../components/commerce/VariantPicker';
import SiteLink from '../../../../components/site/SiteLink';
import { Footnotes } from '../../../../components/site/Footer';
export function generateStaticParams(){return PRODUCTS.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=product((await params).slug);return p?{title:`Buy ${p.name}`}:{};}
export default async function BuyPage({params}:{params:Promise<{slug:string}>}){
 const p=product((await params).slug);if(!p)notFound();
 if(!p.price)return <>
  <section className="section light buy-packages">
   <div className="section-head"><span className="eyebrow">Buy {p.name}</span><h1 className="headline">Touch panels come in Smart Packages.</h1><p className="lead">Choose your home size and how you want to upgrade. Every package can grow with IR Blasters and Smart Plugs.</p></div>
   <PackageCompare initialType="touch-panel"/>
  </section>
  <section className="section"><div className="section-head"><h2 className="title">See every size</h2></div><VariantPicker product={p} heading="Panel size"/><p className="center" style={{marginTop:32}}><SiteLink className="link" href="/demo">Not sure which size? Book a free demo ›</SiteLink></p></section>
  <Footnotes notes={['Prices and package contents as listed on heseos.com; the struck-through price is the listed MRP.']}/>
 </>;
 return <>
  <section className="section buy">
   <div className="buy-media"><img src={p.image} alt={`Heseos ${p.name}`}/></div>
   <div className="buy-panel">
    <span className="eyebrow">{p.eyebrow}</span><h1 className="headline">Buy {p.name}</h1><Price price={p.price} mrp={p.mrp}/>
    <p className="lead">{p.summary}</p>
    <ul className="buy-points">{p.features.map(f=><li key={f.title}><strong>{f.title}</strong> {f.body}</li>)}</ul>
    <AddToBag id={p.slug}/>
    <p className="muted buy-help">Need several for your home? <SiteLink className="link" href="/packages">Smart Packages</SiteLink> bundle them with touch panels.</p>
   </div>
  </section>
  <Footnotes notes={['Price as listed on heseos.com; the struck-through price is the listed MRP. Online payment is not connected yet; see your bag for how to order.']}/>
 </>;
}
