import { ChevronRight } from 'lucide-react';
import SiteLink from '../site/SiteLink';
// The path back up the catalogue; the last crumb is the current page.
export default function Breadcrumbs({items}:{items:{label:string;href?:string}[]}){
 return <nav className="crumbs" aria-label="Breadcrumb"><ol>{items.map((c,i)=><li key={c.label}>
  {i>0&&<ChevronRight size={12} aria-hidden="true"/>}{c.href?<SiteLink href={c.href}>{c.label}</SiteLink>:<span aria-current="page">{c.label}</span>}
 </li>)}</ol></nav>;
}
