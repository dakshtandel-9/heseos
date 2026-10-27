import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS, formatINR, product } from '../../../../lib/catalog';
import LocalNav from '../../../components/site/LocalNav';
import SiteLink from '../../../components/site/SiteLink';
import { Footnotes } from '../../../components/site/Footer';
import ProductViewer from '../../../components/media/ProductViewer';
import VariantPicker from '../../../components/commerce/VariantPicker';
import Price from '../../../components/commerce/Price';
import AddToBag from '../../../components/commerce/AddToBag';
import PanelDemo from '../../../components/story/PanelDemo';
import PlugDemo from '../../../components/story/PlugDemo';

// The simulation render that shows each component at work.
const IN_HOME={'touch-panel':{image:'/media/home/living-evening.webp',title:'Every light, one panel.',body:'Dim the room for the evening or switch everything off on your way out.'},
 'ir-blaster':{image:'/media/home/apt2-ac.webp',title:'The AC answers your phone.',body:'Cool the room before you walk in, or switch the AC off after you’ve left.'},
 'smart-plug':{image:'/media/home/tv-on.webp',title:'Idle appliances, off at the plug.',body:'Cut standby power to the TV and set-top box, and see what each plug draws.'}} as const;

export function generateStaticParams(){return PRODUCTS.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=product((await params).slug);return p?{title:p.name,description:p.summary}:{};}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const p=product((await params).slug);if(!p)notFound();
 const inHome=IN_HOME[p.slug];
 return <>
  <LocalNav title={p.name} links={[{label:'Overview',href:'#overview'},{label:'Tech specs',href:'#specs'}]} buy={{label:p.price?'Buy':'Choose a package',href:`/store/buy/${p.slug}`}}/>
  <section className="section product-hero" id="overview">
   <span className="eyebrow">{p.eyebrow}</span><h1 className="display">{p.name}</h1><p className="lead">{p.tagline}</p>
   <p className="product-hero-price">{p.price?<>From {formatINR(p.price)}</>:'Available in Heseos Smart Packages'}</p>
   <div className="actions"><SiteLink className="btn" href={`/store/buy/${p.slug}`}>{p.price?'Buy':'Choose a package'}</SiteLink><SiteLink className="link" href={`/experience?device=${p.slug}`}>Try it in the simulation ›</SiteLink></div>
   <img className="product-hero-image" src={p.image} alt={`Heseos ${p.name}`}/>
  </section>
  <section className="section light">
   <div className="section-head"><h2 className="headline">{p.summary}</h2></div>
   <div className="bento">{p.features.map((f,i)=><article key={f.title} className={'bento-card'+(i===0?' wide':'')}><h3 className="title">{f.title}</h3><p className="lead">{f.body}</p></article>)}</div>
  </section>
  <section className="section">
   <div className="section-head"><span className="eyebrow">In your home</span><h2 className="headline">{inHome.title}</h2><p className="lead">{inHome.body}</p></div>
   {p.slug==='touch-panel'?<PanelDemo/>:p.slug==='smart-plug'?<PlugDemo/>:<img className="wide-image" src={inHome.image} alt="" loading="lazy"/>}
   <p className="center" style={{marginTop:28}}><SiteLink className="link" href={`/experience?device=${p.slug}`}>Open it in the Heseos Simulation ›</SiteLink></p>
  </section>
  <section className="section surface">
   <div className="section-head"><h2 className="headline">Take a closer look.</h2><p className="lead">An illustrative 3D model.¹ Drag to turn it, then switch it on.</p></div>
   <ProductViewer device={p.slug} name={p.name}/>
  </section>
  {p.variants&&<section className="section light"><div className="section-head"><h2 className="headline">Six sizes. One look.</h2></div><VariantPicker product={p}/></section>}
  <section className="section specs" id="specs" aria-labelledby="specs-title">
   <h2 id="specs-title" className="headline">Tech specs</h2>
   <dl>{p.specs.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
   <p className="muted">Details from the <a className="link" href={p.source} target="_blank" rel="noreferrer">Heseos product page <ArrowUpRight size={14}/></a></p>
  </section>
  <section className="section light buy-band">
   <div><h2 className="title">{p.name}</h2>{p.price?<Price price={p.price} mrp={p.mrp}/>:<p className="muted">Included in Heseos Smart Packages.</p>}</div>
   <div className="actions">{p.price?<AddToBag id={p.slug}/>:<SiteLink className="btn" href={`/store/buy/${p.slug}`}>Choose a package</SiteLink>}<SiteLink className="link" href="/demo">Book a free demo ›</SiteLink></div>
  </section>
  <Footnotes notes={['The 3D model and simulation renders are illustrative stand-ins until final product models are approved; product photos are from heseos.com.',p.price?'Price as listed on heseos.com; the struck-through price is the listed MRP.':'Touch panels are sold as part of Heseos Smart Packages; see package pricing in the store.']}/>
 </>;
}
