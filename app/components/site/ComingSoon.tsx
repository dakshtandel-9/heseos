import SiteLink from './SiteLink';
// A planned page in the site map whose content is not ready yet.
export default function ComingSoon({title,body,links}:{title:string;body:string;links:{label:string;href:string}[]}){
 return <section className="section coming-soon"><h1 className="headline">{title}</h1><p className="lead">{body}</p>
  <div className="actions">{links.map((l,i)=><SiteLink key={l.href} className={i?'link':'btn'} href={l.href}>{l.label}{i?' ›':''}</SiteLink>)}</div></section>;
}
