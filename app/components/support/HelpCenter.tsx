'use client';
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, MessageCircle, Search, X } from 'lucide-react';
import SiteLink from '../site/SiteLink';
import { SUPPORT_ICONS } from './icons';
import type { SupportTopic } from '../../../lib/support';

// The hero search, the topic shortcuts and the answer browser share one query and one open topic.
type HelpState={query:string;setQuery:(q:string)=>void;topic:string;selectTopic:(id:string)=>void;openTopic:(id:string)=>void};
const HelpContext=createContext<HelpState|null>(null);
const useHelp=()=>{const c=useContext(HelpContext);if(!c)throw new Error('Help components need a HelpCenter');return c;};

const showAnswers=()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.getElementById('answers')?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
};

export default function HelpCenter({initialTopic,children}:{initialTopic:string;children:ReactNode}){
 const [query,setQuery]=useState('');
 const [topic,setTopic]=useState(initialTopic);
 const value=useMemo(()=>{
  const selectTopic=(id:string)=>{setTopic(id);setQuery('');};
  return {query,setQuery,topic,selectTopic,openTopic:(id:string)=>{selectTopic(id);showAnswers();}};
 },[query,topic]);
 return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}

export function HelpSearch({id,placeholder='Search answers'}:{id:string;placeholder?:string}){
 const {query,setQuery}=useHelp();
 return <form className="sp-search" role="search" onSubmit={e=>{e.preventDefault();showAnswers();}}>
  <label className="sr-only" htmlFor={id}>Search help</label>
  <Search size={19} aria-hidden="true"/>
  <input id={id} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder} autoComplete="off" enterKeyHint="search"/>
  {query&&<button type="button" className="sp-search-clear" onClick={()=>setQuery('')} aria-label="Clear search"><X size={16} aria-hidden="true"/></button>}
 </form>;
}

export function TopicButton({topic,className,children}:{topic:string;className?:string;children:ReactNode}){
 const {openTopic}=useHelp();
 return <button type="button" className={className} onClick={()=>openTopic(topic)}>{children}</button>;
}

const normalise=(s:string)=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ');

export function AnswerBrowser({topics,contactHref}:{topics:SupportTopic[];contactHref:string}){
 const {query,setQuery,topic,selectTopic}=useHelp();
 const statusId=useId();
 const terms=normalise(query).split(' ').filter(Boolean);
 const searching=terms.length>0;
 const active=topics.find(t=>t.id===topic)??topics[0];
 // Every word must appear somewhere in the question, answer, product or topic.
 // On narrow screens the topics are a scrolling row; keep the open one in view when a shortcut elsewhere picks it.
 const row=useRef<HTMLElement>(null);
 useEffect(()=>{
  const nav=row.current,pill=nav?.querySelector<HTMLElement>('[aria-pressed=true]');
  if(!nav||!pill||nav.scrollWidth<=nav.clientWidth)return;
  const n=nav.getBoundingClientRect(),p=pill.getBoundingClientRect();
  nav.scrollTo({left:nav.scrollLeft+p.left-n.left-(n.width-p.width)/2});
 },[active.id]);
 const results=searching?topics.flatMap(t=>t.answers.filter(a=>{const hay=normalise(`${a.q} ${a.a} ${a.about??''} ${t.title}`);return terms.every(w=>hay.includes(w));}).map(a=>({...a,topic:t.title}))):active.answers.map(a=>({...a,topic:active.title}));

 return <div className="sp-browser">
  <nav className="sp-topics" aria-label="Help topics" ref={row}>
   <ul>{topics.map(t=>{const Icon=SUPPORT_ICONS[t.icon];const current=!searching&&t.id===active.id;
    return <li key={t.id}><button type="button" aria-pressed={current} onClick={()=>selectTopic(t.id)}><Icon size={18} strokeWidth={1.7} aria-hidden="true"/><span>{t.title}</span><small>{t.answers.length}</small></button></li>;})}</ul>
  </nav>
  <div className="sp-results">
   <div className="sp-results-head">
    <h3>{searching?<>Results for “{query.trim()}”</>:active.title}</h3>
    <p id={statusId} aria-live="polite">{searching?`${results.length} ${results.length===1?'answer':'answers'}`:active.blurb}</p>
   </div>
   {results.length>0?<div className="sp-faq">
    {results.map(r=><details key={`${r.topic}-${r.q}`}>
     <summary><span>{r.about&&<em>{r.about}</em>}{r.q}</span><i aria-hidden="true"/></summary>
     <div className="sp-faq-body">
      <p>{r.a}</p>
      {r.link&&<SiteLink className="sp-inline-link" href={r.link.href}>{r.link.label} <ArrowRight size={14} aria-hidden="true"/></SiteLink>}
      {searching&&<span className="sp-faq-topic">{r.topic}</span>}
     </div>
    </details>)}
   </div>:<div className="sp-empty">
    <MessageCircle size={26} strokeWidth={1.5} aria-hidden="true"/>
    <p><strong>No answers match that yet.</strong> Try another word, or ask our team directly.</p>
    <div><a className="sp-btn" href={contactHref} target="_blank" rel="noreferrer">Ask on WhatsApp</a><button type="button" className="sp-btn sp-btn-ghost" onClick={()=>setQuery('')}>Clear search</button></div>
   </div>}
  </div>
 </div>;
}
