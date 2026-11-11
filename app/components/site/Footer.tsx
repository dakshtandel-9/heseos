import type { ReactNode } from 'react';
import { FOOTER, LEGAL, SOCIAL } from '../../../lib/site';
import SiteLink from './SiteLink';
import NewsletterForm from './NewsletterForm';
import SocialIcon from './SocialIcon';
// Each claim on a page points to a numbered note here, directly above the footer.
export function Footnotes({notes}:{notes:ReactNode[]}){
 return <aside className="footer footer-notes" aria-label="Notes"><ol className="footnotes">{notes.map((n,i)=><li key={i}>{n}</li>)}</ol></aside>;
}
export default function Footer(){
 return <footer className="ftr">
  <div className="ftr-inner">
   <div className="ftr-brand">
    <SiteLink href="/" aria-label="Heseos home"><img src="/assets/heseos-logo-white.png" alt="Heseos" width="2588" height="896"/></SiteLink>
    <p>The smart home for a brighter tomorrow.</p>
    <ul className="ftr-social">{SOCIAL.map(s=><li key={s.id}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Heseos on ${s.label}`}><SocialIcon id={s.id}/></a></li>)}</ul>
   </div>
   <nav className="ftr-links" aria-label="Footer">{FOOTER.map(g=><div key={g.title}><h2>{g.title}</h2><ul>{g.links.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul></div>)}</nav>
   <div className="ftr-news"><h2>Stay updated</h2><p>Get the latest from Heseos.</p><NewsletterForm/></div>
  </div>
  <div className="ftr-legal">
   <ul>{LEGAL.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul>
   <span>© {new Date().getFullYear()} Heseos Technology Pvt. Ltd. All rights reserved.</span>
  </div>
 </footer>;
}
