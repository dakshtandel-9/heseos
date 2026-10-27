import SiteLink from './SiteLink';
// Product sub-navigation that sticks under the global bar, with the buy action always in reach.
export default function LocalNav({title,links,buy}:{title:string;links:{label:string;href:string}[];buy:{label:string;href:string}}){
 return <nav className="lnav" aria-label={title}><div className="lnav-inner">
  <span className="lnav-title">{title}</span>
  <ul>{links.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul>
  <SiteLink className="btn small" href={buy.href}>{buy.label}</SiteLink>
 </div></nav>;
}
