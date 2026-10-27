import type { Metadata } from 'next';
import { BHKS, PACKAGE_IMAGE, PACKAGE_TYPES, formatINR, getPackage, type Bhk, type PackageType } from '../../../lib/catalog';
import PackageCompare from '../../components/commerce/PackageCompare';
import SiteLink from '../../components/site/SiteLink';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'Smart Packages',description:'Heseos Smart Packages for 1, 2 and 3 BHK homes: retrofit modules, modular touch switches or glass touch panels.'};
export default async function PackagesPage({searchParams}:{searchParams:Promise<{type?:string;bhk?:string}>}){
 const q=await searchParams;
 const type=PACKAGE_TYPES.find(t=>t.id===q.type)?.id??'touch-panel' as PackageType;
 const bhk=(BHKS.find(b=>String(b)===q.bhk)??2) as Bhk;
 return <>
  <section className="section light">
   <div className="section-head"><h1 className="headline">Smart Packages.</h1><p className="lead">Pick your home size and how you want to upgrade. Starter covers your switches; Standard adds IR Blasters; Premium adds Smart Plugs too.</p></div>
   <PackageCompare initialType={type} initialBhk={bhk}/>
  </section>
  <section className="section">
   <div className="section-head"><h2 className="headline">Three ways to upgrade.</h2></div>
   <div className="product-grid">{PACKAGE_TYPES.map(t=>{const image=PACKAGE_IMAGE[t.id];return <article key={t.id} className="product-card">
    {image?<img src={image} alt="" loading="lazy"/>:<span className="placeholder product-card-placeholder">{t.name}</span>}<h3 className="title">{t.name}</h3><p className="muted">{t.summary}</p>
    <p className="product-card-price">From {formatINR(getPackage(t.id,1,'starter').price)}</p><SiteLink className="link" href={`/packages?type=${t.id}`}>See {t.name} packages ›</SiteLink></article>;})}</div>
   <p className="center" style={{marginTop:40}}><SiteLink className="link" href="/compare">Compare every package side by side ›</SiteLink></p>
  </section>
  <Footnotes notes={['Prices and package contents as listed on heseos.com; the struck-through price is the listed MRP.']}/>
 </>;
}
