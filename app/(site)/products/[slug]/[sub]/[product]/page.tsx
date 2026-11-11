import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CalendarCheck, FileText, MessageCircle, Mic, ShieldCheck, Wrench, type LucideIcon } from 'lucide-react';
import { CATALOG_META, FAMILIES, family, familyCard, familyHref, relatedTo, trail } from '../../../../../../lib/products';
import { directoryCategoryHref, directorySubcategoryHref, directoryTrail } from '../../../../../../lib/product-directory';
import SiteLink from '../../../../../components/site/SiteLink';
import { Footnotes } from '../../../../../components/site/Footer';
import Breadcrumbs from '../../../../../components/catalog/Breadcrumbs';
import Configurator from '../../../../../components/catalog/Configurator';
import ImageSlot from '../../../../../components/catalog/ImageSlot';
import PdpHighlights from '../../../../../components/catalog/PdpHighlights';
import ScrollScenes from '../../../../../components/catalog/ScrollScenes';
import Reveal from '../../../../../components/home/Reveal';
import { Faqs, FamilyTile } from '../../../../../components/catalog/Tiles';
import './detail.css';
type Params={params:Promise<{slug:string;sub:string;product:string}>};
// A family is only served at its own category and subcategory.
async function resolve(params:Params['params']){
 const {slug,sub,product}=await params,p=family(product);if(!p)return null;
 const t=trail(p);return t.category.slug===slug&&t.subcategory.slug===sub?{p,...t}:null;
}
export function generateStaticParams(){return FAMILIES.map(p=>{const {category:c,subcategory:s}=trail(p);return {slug:c.slug,sub:s.slug,product:p.slug};});}
export async function generateMetadata({params}:Params):Promise<Metadata>{const r=await resolve(params);return r?{title:r.p.name,description:r.p.summary}:{};}
export default async function FamilyPage({params}:Params){
 const r=await resolve(params);if(!r)notFound();
 const {p,subcategory:s}=r,{contact}=CATALOG_META,path=familyHref(p);
 // Breadcrumbs and "see all" links lead into the product directory, where visitors browse.
 const d=directoryTrail(p.slug),rangeHref=d?directorySubcategoryHref(d.category,d.subcategory):'/products',rangeName=d?.subcategory.name??s.name;
 // Images to generate per product, each shown as a grey frame at its ratio until the file exists; see PRODUCT-IMAGES.md.
 const slot=(name:string)=>`/media/products/pdp/${p.slug}/${name}.webp`;
 const gallery=p.gallery??[];
 // The model table appears when a family's configurations carry their own model codes.
 const models=p.variants.filter(v=>v.model);
 const columns=[...new Set(models.flatMap(v=>(v.specs??[]).map(x=>x.label)))],showLabel=models.some(v=>v.label!==v.model);
 const request=(what:string)=>`mailto:${contact.email}?subject=${encodeURIComponent(`${what}: ${p.name}`)}`;
 const demo=`/demo?product=${encodeURIComponent(p.name)}`;
 const install=p.installation?.join(' ');
 // Rows under the order summary, like delivery and pickup on a store page.
 const info:{icon:LucideIcon;title:string;body:string}[]=[
  {icon:CalendarCheck,title:'Free home demo',body:'See it working in your home before you decide.'},
  {icon:Wrench,title:'Installation',body:install??'Our team checks your wiring and space before installation.'},
  p.warranty?{icon:ShieldCheck,title:'Warranty',body:`${p.warranty} warranty.`}:p.worksWith?{icon:Mic,title:'Works with',body:p.worksWith.join(', ')}:null,
 ].filter(x=>!!x);
 // Reasons to buy through HESEOS, as cards near the foot of the page.
 const reasons:{icon:LucideIcon;title:string;body:string;link?:{label:string;href:string;external?:boolean}}[]=[
  {icon:CalendarCheck,title:'Try it at home first.',body:'Book a free demo and see the product working in your own rooms.',link:{label:'Book a demo',href:demo}},
  {icon:Wrench,title:'Installed by our team.',body:install??'Our team checks your wiring and space before installation.'},
  {icon:ShieldCheck,title:'Covered from day one.',body:p.warranty?`${p.warranty} warranty. Full terms come with your quote.`:'Warranty terms come with your quote.'},
  {icon:MessageCircle,title:'Help when you need it.',body:'Questions about compatibility or setup? Our team is a message away.',link:{label:'Chat on WhatsApp',href:contact.whatsapp,external:true}},
 ];
 const specs=[...p.specs,...(p.highlights?.length?[{label:'Features',value:p.highlights.join(', ')}]:[]),...(p.worksWith?[{label:'Works with',value:p.worksWith.join(', ')}]:[]),...(install?[{label:'Installation',value:install}]:[]),...(p.warranty?[{label:'Warranty',value:p.warranty}]:[])];

 return <div className="product-detail">
  <ScrollScenes/><Reveal/>

  {/* Buy: title row, then the gallery beside one step per option */}
  <section className="pd-buy" id="configure" aria-labelledby="product-title">
   <div className="pd-wrap">
    <Breadcrumbs items={[{label:'Products',href:'/products'},...(d?[{label:d.category.name,href:directoryCategoryHref(d.category)},{label:d.subcategory.name,href:rangeHref}]:[]),{label:p.name}]}/>
    <header className="pd-buy-head">
     <div>
      <p className="pd-kicker">{p.badges?.map(b=><span key={b} className="pd-badge">{b}</span>)}{[rangeName,p.code&&`Series ${p.code}`].filter(Boolean).join(' · ')}</p>
      <h1 id="product-title">{p.name}</h1>
      <p className="pd-tagline">{p.tagline}</p>
     </div>
     <p className="pd-buy-aside">Priced on quote.<SiteLink href={demo}>Book a free home demo ›</SiteLink></p>
    </header>
    <Configurator name={p.name} images={[p.image,...gallery]} options={p.options} variants={p.variants} email={contact.email} whatsapp={contact.whatsapp} path={path}
     intro={p.options.length===0&&<div className="pb-intro"><h2>{p.tagline}</h2><p>{p.summary}</p></div>}
     info={<ul className="pb-info">{info.map(x=><li key={x.title}><x.icon size={20} strokeWidth={1.6} aria-hidden="true"/><div><b>{x.title}</b><span>{x.body}</span></div></li>)}</ul>}/>
   </div>
  </section>

  {/* Overview: a centred statement over one wide image that settles to full size as it scrolls in */}
  <section className="pd-overview" id="overview" aria-labelledby="overview-title">
   <div className="pd-wrap pd-center" data-reveal>
    <h2 id="overview-title" className="pd-display">{p.tagline}</h2>
    <p className="pd-lede">{p.summary}</p>
   </div>
   <div className="pd-wide" data-scroll="view">
    <ImageSlot src={slot('hero')} alt={`The ${p.name} in a home interior`} ratio="21:9" need={`Wide 21:9 lifestyle photo: the ${p.name} installed in a premium, warmly lit modern Indian home, shown at true scale. 2400×1030 WebP.`}/>
   </div>
  </section>

  {/* Highlights: one wide frame per feature */}
  <section className="pd-highlights" id="highlights" aria-labelledby="highlights-title">
   <div className="pd-wrap"><h2 id="highlights-title" className="pd-title" data-reveal>Get the highlights.</h2></div>
   <PdpHighlights items={p.features.map((f,i)=>({title:f.title,body:f.body,src:slot(`feature-${i+1}`),alt:`${p.name}: ${f.title}`,
    need:`Wide 16:9 photo for “${f.title}”: ${f.body} Show the ${p.name}. 1920×1080 WebP.`}))}/>
  </section>

  {/* Up close: a portrait detail beside an everyday moment, set to the same height */}
  <section className="pd-close" aria-labelledby="close-title">
   <div className="pd-wrap">
    <h2 id="close-title" className="pd-title" data-reveal>Take a closer look.</h2>
    <div className="pd-twoup">
     <figure data-reveal><ImageSlot src={slot('detail')} alt={`Close-up of the ${p.name}`} ratio="4:5" need={`4:5 macro close-up of the ${p.name}: its finish, edges and materials in soft raking light. 1200×1500 WebP.`}/><figcaption>Finish and edge, up close.</figcaption></figure>
     <figure data-reveal><ImageSlot src={slot('in-use')} alt={`Someone using the ${p.name}`} ratio="4:3" need={`4:3 photo: a hand or person using the ${p.name} in an everyday moment at home. 1600×1200 WebP.`}/><figcaption>Made for every day.</figcaption></figure>
    </div>
   </div>
  </section>

  {models.length>1&&<section className="pd-models" aria-labelledby="models-title">
   <div className="pd-wrap">
    <h2 id="models-title" className="pd-title" data-reveal>Compare models.</h2>
    <p className="pd-sub">{models.length} models in the {p.name} family.</p>
    <div className="model-table"><table>
     <thead><tr><th scope="col">Model</th>{showLabel&&<th scope="col">Configuration</th>}{columns.map(k=><th key={k} scope="col">{k}</th>)}</tr></thead>
     <tbody>{models.map(v=><tr key={v.id}><th scope="row">{v.model}</th>{showLabel&&<td>{v.label}</td>}{columns.map(k=><td key={k}>{v.specs?.find(x=>x.label===k)?.value??'—'}</td>)}</tr>)}</tbody>
    </table></div>
   </div>
  </section>}

  <section className="pd-specs" id="specs" aria-labelledby="specs-title">
   <div className="pd-wrap">
    <h2 id="specs-title" className="pd-title" data-reveal>Tech specs.</h2>
    <dl>{specs.map(x=><div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
    <p className="pd-source">From the HESEOS Product Brochure 2026–27, {p.brochurePages.length>1?'pages':'page'} {p.brochurePages.join(', ')}.</p>
   </div>
  </section>

  <section className="pd-reasons" aria-labelledby="reasons-title">
   <div className="pd-wrap">
    <h2 id="reasons-title" className="pd-title" data-reveal>Why buy from HESEOS.</h2>
    <ul>{reasons.map(x=><li key={x.title} data-reveal>
     <x.icon size={30} strokeWidth={1.5} aria-hidden="true"/><h3>{x.title}</h3><p>{x.body}</p>
     {x.link&&(x.link.external?<a href={x.link.href} target="_blank" rel="noreferrer">{x.link.label} <ArrowUpRight size={14} aria-hidden="true"/></a>:<SiteLink href={x.link.href}>{x.link.label} ›</SiteLink>)}
    </li>)}</ul>
   </div>
  </section>

  <section className="pd-support" id="support" aria-labelledby="support-title">
   <div className="pd-wrap">
    <h2 id="support-title" className="pd-title" data-reveal>Support.</h2>
    <div className="pd-support-grid">
     <div>
      <h3>Downloads</h3>
      <ul className="pd-downloads">{CATALOG_META.downloads.map(dl=><li key={dl.label}><FileText size={20} strokeWidth={1.6} aria-hidden="true"/><span><b>{dl.label}</b><small>{dl.type}</small></span>
       {dl.href?<a href={dl.href}>Download</a>:<a href={request(`${dl.type} request`)}>Request ›</a>}</li>)}</ul>
      <p className="pd-note">For compatibility and installation help, write to <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
     </div>
     <div><h3>Questions</h3><Faqs items={[...s.faqs,...CATALOG_META.faqs]}/></div>
    </div>
   </div>
  </section>

  <section className="pd-related" aria-labelledby="related-title">
   <div className="pd-wrap">
    <div className="pd-related-head"><h2 id="related-title" className="pd-title" data-reveal>Goes well with.</h2><SiteLink href={rangeHref}>All {rangeName} ›</SiteLink></div>
    <div className="product-grid">{relatedTo(p,3).map(x=><FamilyTile key={x.slug} card={familyCard(x)}/>)}</div>
   </div>
  </section>

  <section className="pd-help" aria-labelledby="help-title">
   <div className="pd-wrap pd-center">
    <h2 id="help-title">Need some help?</h2>
    <p>Talk to a HESEOS specialist about your rooms, your routines and the right setup.</p>
    <div className="pd-help-links"><a href={contact.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowUpRight size={14} aria-hidden="true"/></a><SiteLink href={demo}>Book a free home demo ›</SiteLink></div>
   </div>
  </section>
  <Footnotes notes={[CATALOG_META.disclaimer,'Studio and lifestyle images are illustrative; gallery images come from the HESEOS brochure. Confirm the final finish and configuration with Heseos.']}/>
 </div>;
}
