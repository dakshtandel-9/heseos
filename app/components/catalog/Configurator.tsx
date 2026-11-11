'use client';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { matchVariant, type Option, type OptionValue, type Variant } from '../../../lib/variants';
import SiteLink from '../site/SiteLink';
import ContactForm from '../site/ContactForm';
const noop=()=>()=>{};
// Each option is one step with a short question, the way apple.com's buy pages guide a choice.
const PROMPTS:[RegExp,string][]=[[/colou?r temperature/i,'Set the mood.'],[/module/i,'Which fits your switchboard?'],[/switches/i,'How many do you need?'],[/finish|colou?r/i,'Pick your favourite.'],[/model|version/i,'Which is right for you?'],[/screen/i,'Which size suits your wall?'],[/collection/i,'Choose your style.'],[/control/i,'How do you want to control it?'],[/light/i,'Choose your light.']];
const promptFor=(label:string)=>PROMPTS.find(([re])=>re.test(label))?.[1]??'Choose one.';
// When a choice has no photo of its own, the family photo whose file name shows what the option changes:
// first one named after the value itself, then one named after the option (finishes, sizes, light colours, the app).
const SHOWS:[RegExp,RegExp][]=[[/temperature|cct/i,/cct|colou?r-temp/],[/finish|colou?r/i,/finish|colou?r|range/],[/module|switches|size|screen/i,/size|range/],[/light/i,/cct|light/],[/control/i,/app|remote/],[/collection|model|type|version/i,/range/]];
function photoFor(images:string[],o:Option,v:OptionValue){
 const file=(src:string)=>src.split('/').pop()??'';
 const named=images.find(src=>new RegExp(`(^|-)${v.id.replace(/[^a-z0-9]+/gi,'-')}([-.]|$)`,'i').test(file(src)));
 if(named)return named;
 const shows=SHOWS.find(([label])=>label.test(o.label)||label.test(o.key))?.[1];
 return shows?images.find(src=>shows.test(file(src))):undefined;
}
// The product page's buy flow: a gallery that stays in view beside one step per option, then a summary that sends a quote
// request with the exact selection. A bar at the foot of the screen keeps the selection and the request in reach while choosing.
export default function Configurator({name,images,options,variants,whatsapp,path,intro,info}:{name:string;images:string[];options:Option[];variants:Variant[];email:string;whatsapp:string;path:string;intro?:ReactNode;info?:ReactNode}){
 // A link can preselect options, e.g. ?collection=leather from the Products directory; the server renders without them.
 const search=useSyncExternalStore(noop,()=>location.search,()=>'');
 const linked=options.flatMap(o=>{const v=o.values.find(x=>x.id===new URLSearchParams(search).get(o.key));return v?[{key:o.key,value:v}]:[];});
 const [showQuote,setShowQuote]=useState(false);
 // What the visitor chose; null clears an option.
 const [chosen,setChosen]=useState<Record<string,string|null>>({});
 const defaults=Object.fromEntries([...options.filter(o=>!o.confirm).map(o=>[o.key,o.values[0].id]),...linked.map(l=>[l.key,l.value.id])]);
 const selected=Object.fromEntries(Object.entries({...defaults,...chosen}).filter((e):e is [string,string]=>e[1]!==null));
 const variant=matchVariant(variants,selected);
 // The chosen configuration's own photos lead the gallery, then the family's shared photos.
 const gallery=[...new Set([...(variant?.images??[]),...images])];
 const [clicked,setShown]=useState<string|null>(null);
 const linkedImage=linked.map(l=>l.value.image).find(i=>i&&gallery.includes(i));
 const shown=clicked&&gallery.includes(clicked)?gallery.indexOf(clicked):linkedImage?gallery.indexOf(linkedImage):0;
 const step=(by:number)=>setShown(gallery[(shown+by+gallery.length)%gallery.length]);
 // Options to confirm are optional: choosing the selected one again clears it.
 const choose=(o:Option,v:OptionValue)=>{
  const clearing=o.confirm&&selected[o.key]===v.id;
  setChosen(c=>({...c,[o.key]:clearing?null:v.id}));
  const next=matchVariant(variants,clearing?Object.fromEntries(Object.entries(selected).filter(([k])=>k!==o.key)):{...selected,[o.key]:v.id});
  // The gallery answers every choice: the value's own photo; for an option that picks the configuration, its first photo;
  // otherwise the family photo that shows what the option changes (all finishes, all sizes, the light colours).
  const picksVariant=variants.some(x=>o.key in x.options);
  setShown((v.image&&images.includes(v.image)?v.image:null)??(picksVariant?next?.images?.[0]:null)??photoFor(images,o,v)??clicked);
 };
 const picked=options.flatMap(o=>{const v=o.values.find(x=>x.id===selected[o.key]);return v?[{option:o.label,value:v.label}]:[];});
 const choice=picked.map(p=>p.value).join(' · ');
 const message=[`I'd like a quote for the HESEOS ${name}.`,...picked.map(p=>`${p.option}: ${p.value}`),...(variant?.model?[`Model: ${variant.model}`]:[]),'Quantity: ','Project location: ',`Product page: ${path}`].join('\n');
 const chat=whatsapp&&`https://wa.me/${whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;

 // The bar shows while the buy flow is on screen and its summary is not.
 const flow=useRef<HTMLDivElement>(null),summary=useRef<HTMLElement>(null);
 const [inFlow,setInFlow]=useState(false),[atSummary,setAtSummary]=useState(false);
 useEffect(()=>{
  const io=new IntersectionObserver(entries=>{for(const e of entries)(e.target===flow.current?setInFlow:setAtSummary)(e.isIntersecting);});
  if(flow.current)io.observe(flow.current);if(summary.current)io.observe(summary.current);
  return()=>io.disconnect();
 },[]);
 const bar=inFlow&&!atSummary;
 const openQuote=()=>{setShowQuote(true);summary.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};

 return <div className="pb" ref={flow}>
  <div className="pb-media">
   <div className="pb-stage">
    {gallery.map((src,i)=><img key={src} src={src} alt={i===shown?(variant?.model?`${name}, model ${variant.model}`:name):''} className={i===shown?'active':''} aria-hidden={i!==shown} loading={i?'lazy':undefined}/>)}
    {gallery.length>1&&<>
     <button type="button" className="pb-paddle prev" aria-label="Previous image" onClick={()=>step(-1)}><ChevronLeft size={20}/></button>
     <button type="button" className="pb-paddle next" aria-label="Next image" onClick={()=>step(1)}><ChevronRight size={20}/></button>
    </>}
   </div>
   {gallery.length>1&&<div className="pb-dots" role="group" aria-label="Product images">{gallery.map((src,i)=><button key={src} type="button" aria-label={`Image ${i+1} of ${gallery.length}`} aria-pressed={i===shown} onClick={()=>setShown(src)}><span/></button>)}</div>}
  </div>

  <div className="pb-panel">
   {intro}
   {options.map(o=>{const current=o.values.find(v=>v.id===selected[o.key]),swatches=o.values.every(v=>v.swatch);return <fieldset key={o.key} className="pb-step">
    <legend><b>{o.label}.</b> {promptFor(o.label)}</legend>
    {swatches?<>
     <p className="pb-swatch-name">{current?<>{o.label} — <b>{current.label}</b></>:<>Choose a {o.label.toLowerCase()}</>}</p>
     <div className="pb-swatches" role="group" aria-label={o.label}>{o.values.map(v=><button key={v.id} type="button" aria-pressed={selected[o.key]===v.id} title={v.label} onClick={()=>choose(o,v)}>
      <span style={{background:v.swatch}} aria-hidden="true"/><span className="sr-only">{v.label}</span>
     </button>)}</div>
    </>:<div className="pb-choices" role="group" aria-label={o.label}>{o.values.map(v=><button key={v.id} type="button" aria-pressed={selected[o.key]===v.id} onClick={()=>choose(o,v)}>{v.label}</button>)}</div>}
    {o.confirm&&<p className="pb-note">Optional. We confirm availability with your quote.</p>}
   </fieldset>;})}

   <aside className="pb-help">
    <b>Need help choosing?</b>
    <p>{chat?<a href={chat} target="_blank" rel="noreferrer">Chat with a HESEOS specialist</a>:'Talk to a HESEOS specialist'} or <SiteLink href={`/demo?product=${encodeURIComponent(name)}`}>book a free home demo</SiteLink>.</p>
   </aside>

   <section className="pb-summary" id="enquire" ref={summary} aria-labelledby="summary-title">
    <h2 id="summary-title"><b>Your {name}.</b> Just the way you want it.</h2>
    <div className="pb-summary-card">
     <div className="pb-summary-item">
      <img src={gallery[0]} alt="" aria-hidden="true"/>
      <div aria-live="polite"><strong>{name}</strong>{choice&&<span>{choice}</span>}{variant?.model&&<span>Model {variant.model}</span>}</div>
     </div>
     {variant?.specs&&<dl className="pb-summary-specs">{variant.specs.map(s=><div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>}
     <div className="pb-summary-price"><span>Price</span><b>On request</b></div>
     <button type="button" className="btn pb-cta" onClick={()=>setShowQuote(!showQuote)} aria-expanded={showQuote} aria-controls="quote-form">{showQuote?'Close quote request':'Request a quote'}</button>
     {chat&&<a className="btn pb-cta pb-wa" href={chat} target="_blank" rel="noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2 12.06 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.9-9.89 9.9zM20.5 3.49A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.44-8.41z"/></svg>Ask on WhatsApp</a>}
     {showQuote&&<div id="quote-form" className="pb-form"><ContactForm type="quote" context={message} button="Send quote request"/></div>}
     {info}
    </div>
   </section>
  </div>

  <div className={'pb-bar'+(bar?' show':'')} inert={!bar}>
   <div className="pb-bar-inner">
    <div className="pb-bar-text"><strong>{name}</strong>{choice&&<span>{choice}</span>}</div>
    <span className="pb-bar-price">Price on request</span>
    <button type="button" className="btn small" onClick={openQuote}>Request a quote</button>
   </div>
  </div>
 </div>;
}
