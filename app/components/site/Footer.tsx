import type { ReactNode } from 'react';
import { FOOTER } from '../../../lib/site';
import SiteLink from './SiteLink';
// Each claim on a page points to a numbered note here, directly above the sitemap.
export function Footnotes({notes}:{notes:ReactNode[]}){
 return <aside className="footer footer-notes" aria-label="Notes"><ol className="footnotes">{notes.map((n,i)=><li key={i}>{n}</li>)}</ol></aside>;
}
export default function Footer(){
 return <footer className="footer">
  <nav className="footer-grid" aria-label="Sitemap">{FOOTER.map(g=><div key={g.title}><h2>{g.title}</h2><ul>{g.links.map(l=><li key={l.href}><SiteLink href={l.href}>{l.label}</SiteLink></li>)}</ul></div>)}</nav>
  <div className="footer-legal"><span>Copyright © {new Date().getFullYear()} Heseos. All rights reserved.</span><span>More ways to shop: <SiteLink href="/demo">book a free demo</SiteLink> or visit <SiteLink href="https://www.heseos.com">heseos.com</SiteLink>.</span></div>
 </footer>;
}
