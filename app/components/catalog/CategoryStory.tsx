import { ArrowDown, ArrowRight } from 'lucide-react';
import { directoryCatalogSubcategories, directoryFamilies, directoryProductHref, directoryProducts, directorySource, directorySubcategoryHref, type DirectoryCategory } from '../../../lib/product-directory';
import SiteLink from '../site/SiteLink';
import ScrollScenes from './ScrollScenes';
import { plural } from './RangeCards';
import type { CategoryStoryContent } from './stories';
import './category-story.css';

// A category told the way Apple tells a product: two pinned moments (the hero, and a scene that changes from one state to another),
// and everything else simply fading up as it arrives. Content comes from stories.ts; images live in public/media/browse/category/<slug>/.
export default function CategoryStory({category:c,story:s}:{category:DirectoryCategory;story:CategoryStoryContent}){
 const img=(name:string)=>`/media/browse/category/${c.slug}/${name}`;
 const subs=c.subcategories,families=subs.flatMap(directoryFamilies),products=directoryProducts(c);
 const configurations=families.reduce((n,f)=>n+f.variants.length,0);
 const worksWith=[...new Set(families.flatMap(f=>f.worksWith??[]))];
 const words=s.statement.split(' ');
 // Each lineup column, resolved to a range or a product of this category.
 const lineup=s.lineup.items.flatMap(item=>{
  if(s.lineup.kind==='range'){
   const r=subs.find(x=>x.slug===item.slug);if(!r)return [];
   const f=directoryFamilies(r);
   return [{...item,name:r.name,href:directorySubcategoryHref(c,r),image:item.image??r.products[0].slug,tagline:directoryCatalogSubcategories(r)[0]?.tagline,finish:f.flatMap(x=>x.options).find(o=>o.values.every(v=>v.swatch)),count:plural(r.products.length,'product')}];
  }
  const p=products.find(x=>x.slug===item.slug);if(!p)return [];
  const f=directorySource(p);
  return [{...item,name:p.name,href:directoryProductHref(p),image:item.image??p.slug,tagline:f.tagline,finish:f.options.find(o=>o.values.every(v=>v.swatch)),count:plural(f.variants.length,'model')}];
 });
 const stats=[subs.length>1&&{label:'Ranges',value:subs.length},{label:'Products',value:products.length},{label:'Configurations',value:configurations},worksWith.length>0&&{label:'Voice assistants',value:worksWith.length}].filter((x):x is {label:string;value:number}=>!!x);
 const statList=<dl className="sw-stats" data-reveal style={{'--n':stats.length} as React.CSSProperties}>{stats.map(x=><div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>;
 return <div className="sw">
  <ScrollScenes/>

  <section className="sw-hero" data-scroll="pin" aria-labelledby="rg-title">
   <div className="sw-stage">
    <nav className="sw-trail" aria-label="Breadcrumb"><ol><li><SiteLink href="/products">Products</SiteLink></li><li><span aria-current="page">{c.name}</span></li></ol></nav>
    <div className="sw-hero-copy">
     <p className="sw-eyebrow">{c.name}</p>
     <h1 id="rg-title">{s.hero.headline}</h1>
     <p className="sw-hero-sub">{s.hero.sub}</p>
     <div className="sw-hero-ctas"><a className="sw-btn" href="#sw-ranges">{s.lineup.kind==='range'?`Explore ${subs.length} ranges`:`Explore ${plural(products.length,'product')}`} <ArrowDown size={15} aria-hidden="true"/></a><SiteLink className="sw-link" href="/demo">Book a free demo <ArrowRight size={15} aria-hidden="true"/></SiteLink></div>
    </div>
    <div className="sw-hero-product"><img src={img('hero.webp')} alt={s.hero.alt} fetchPriority="high"/></div>
   </div>
  </section>

  <section className="sw-words" data-scroll="view" aria-label={c.name}>
   <p style={{'--n':words.length} as React.CSSProperties}>{words.map((w,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{w} </span>)}</p>
  </section>

  <section className="sw-daynight" data-scroll="pin" data-steps="2" aria-label={`${s.scene.caps[0].title} ${s.scene.caps[1].title}`}>
   <div className="sw-stage">
    <img className="sw-day" src={img(s.scene.day)} alt={s.scene.dayAlt} loading="lazy"/>
    <img className="sw-night" src={img(s.scene.night)} alt={s.scene.nightAlt} loading="lazy"/>
    <div className="sw-caps">{s.scene.caps.map(cap=><p key={cap.time} className="sw-cap"><small>{cap.time}</small>{cap.title}<span>{cap.body}</span></p>)}</div>
   </div>
  </section>

  <section className="sw-ranges" id="sw-ranges" aria-labelledby="sw-ranges-title">
   <div className="sw-wrap">
    <div className="sw-head sw-head--center" data-reveal><p className="sw-eyebrow">Explore the lineup</p><h2 id="sw-ranges-title">{s.lineup.title}</h2>{s.lineup.kind==='range'&&<a className="sw-link" href="#products">Compare all products <ArrowRight size={14} aria-hidden="true"/></a>}</div>
    <div className="sw-lineup-grid" style={{'--cols':lineup.length>4&&lineup.length%3===0?3:Math.min(lineup.length,4),'--rows':6+(lineup[0]?.facts.length??0)} as React.CSSProperties}>{lineup.map((l,i)=><article key={l.slug} className="sw-model" data-reveal style={{transitionDelay:`${(i%4)*90}ms`}}>
     <SiteLink className="sw-model-media" href={l.href} aria-label={`Explore ${l.name}`}><img src={`/media/products/studio/${l.image}.webp`} alt={`${l.name}, studio image`} loading="lazy"/></SiteLink>
     {/* Finish swatches come from the catalogue; without them the column shows its product or model count. */}
     <div className="sw-model-swatches">{l.finish?<ul aria-label={`${l.finish.values.length} finishes`}>{l.finish.values.map(v=><li key={v.id} title={v.label} style={{background:v.swatch}}/>)}</ul>:<span>{l.count}</span>}</div>
     <p className="sw-model-kicker">{l.kicker}</p>
     <h3>{l.name}</h3>
     <p className="sw-model-tagline">{l.tagline}</p>
     <div className="sw-model-actions"><SiteLink className="sw-pill" href={l.href}>Explore</SiteLink><SiteLink className="sw-link" href="/demo">Book a demo <ArrowRight size={14} aria-hidden="true"/></SiteLink></div>
     {l.facts.map(f=><p key={f.text} className="sw-model-fact"><f.icon size={20} strokeWidth={1.5} aria-hidden="true"/>{f.text}</p>)}
    </article>)}</div>
   </div>
  </section>

  <section className="sw-control" aria-labelledby="sw-control-title">
   <div className="sw-wrap">
    <div className="sw-head" data-reveal><p className="sw-eyebrow">{s.control.eyebrow}</p><h2 id="sw-control-title">{s.control.title}</h2></div>
    <div className="sw-bento">
     <figure className="sw-tile sw-tile--img" data-reveal><img src={s.control.image} alt={s.control.alt} loading="lazy"/></figure>
     {s.control.tiles.map(t=><div key={t.title} className="sw-tile" data-reveal><t.icon size={26} strokeWidth={1.5} aria-hidden="true"/><h3>{t.title}</h3><p>{t.body}</p></div>)}
    </div>
   </div>
  </section>

  {s.sizes?<section className="sw-lineup" data-scroll="view" aria-labelledby="sw-lineup-title">
   <div className="sw-head sw-head--center" data-reveal><p className="sw-eyebrow">Sizes</p><h2 id="sw-lineup-title">{s.sizes.title[0]}<br/>{s.sizes.title[1]}</h2></div>
   <div className="sw-lineup-media"><img src={img(s.sizes.image)} alt={s.sizes.alt} loading="lazy"/></div>
   {statList}
  </section>:<section className="sw-lineup sw-lineup--stats" aria-label={`${c.name} in numbers`}>{statList}</section>}
 </div>;
}
