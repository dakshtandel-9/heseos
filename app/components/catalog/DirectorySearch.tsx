'use client';

import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import SiteLink from '../site/SiteLink';

export type SearchEntry={name:string;href:string;category:string;subcategory:string};
export default function DirectorySearch({entries}:{entries:SearchEntry[]}){
 const [query,setQuery]=useState('');
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const matches=terms.length?entries.filter(e=>terms.every(term=>[e.category,e.subcategory,e.name].some(text=>text.toLowerCase().includes(term)))):[];
 return <div className="pc-search" id="search">
  <label><Search size={18} aria-hidden="true"/><span className="sr-only">Search products</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, categories or ranges" autoComplete="off"/></label>
  {terms.length>0&&<div className="pc-search-results"><p role="status">{matches.length} {matches.length===1?'product':'products'} found</p>
   {matches.length>0&&<ul>{matches.map(e=><li key={e.name}><SiteLink href={e.href}><span><strong>{e.name}</strong><small>{e.category} · {e.subcategory}</small></span><ArrowRight size={16} aria-hidden="true"/></SiteLink></li>)}</ul>}
  </div>}
 </div>;
}
