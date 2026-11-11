'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, BellRing, ChartColumn, Expand, LayoutGrid, X } from 'lucide-react';
import { APP_SECTION } from '../../../lib/home';
import { APPS } from '../../../lib/site';
import HomeIcon from './HomeIcon';
import './AppShowcase.css';

// Guided highlights of the original image, not simulated app screens or device controls.
const previews = [
 { id: 'controls', label: 'Controls', icon: LayoutGrid, caption: 'Your living room. One place to control it.', detail: 'Individual switches and running hours, together in the Heseos app.' },
 { id: 'power', label: 'Power use', icon: ChartColumn, caption: 'A clearer picture of your power use.', detail: 'The room’s power consumption chart sits just above your connected devices.' },
 { id: 'alerts', label: 'Alerts', icon: BellRing, caption: 'Stay connected, even when you’re away.', detail: 'Access alerts from compatible Heseos locks help you keep track of your home.' },
] as const;
type Preview = typeof previews[number]['id'];

export default function AppShowcase() {
 const [active, setActive] = useState<Preview>('controls');
 const [expanded, setExpanded] = useState(false);
 const [open, setOpen] = useState(false);
 const section = useRef<HTMLElement>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const current = previews.find(p => p.id === active)!;

 useEffect(() => {
  const element = section.current;
  if (!element || !('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // Visible in SSR, without JS, with reduced motion, and when entered via an anchor.
  if (motion.matches || element.getBoundingClientRect().top < innerHeight) return;
  element.classList.add('as-waiting');
  const observer = new IntersectionObserver(([entry]) => {
   if (entry.isIntersecting) {
    element.classList.remove('as-waiting');
    element.classList.add('as-entered');
    observer.disconnect();
   }
  }, { rootMargin: '0px 0px -6% 0px' });
  observer.observe(element);
  const show = () => { if (motion.matches) element.classList.remove('as-waiting'); };
  motion.addEventListener('change', show);
  return () => { observer.disconnect(); motion.removeEventListener('change', show); element.classList.remove('as-waiting'); };
 }, []);

 useEffect(() => {
  if (!open) return;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = previousOverflow; };
 }, [open]);

 function choose(value: Preview) {
  setActive(value);
  setExpanded(value === 'alerts');
 }

 function showCloser() {
  dialog.current?.showModal();
  setOpen(true);
 }

 function controls(location: string) {
  return <div className="as-controls" role="group" aria-label={`Explore the Heseos app${location === 'dialog' ? ' in detail' : ''}`}>
   {previews.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={active === id} onClick={() => choose(id)}>
    <Icon size={15} strokeWidth={1.6} aria-hidden="true"/>{label}
   </button>)}
  </div>;
 }

 return <section ref={section} id="heseos-app" className="hsx as-section" aria-labelledby="app-title">
  <div className="hw as-grid">
   <header className="as-heading as-reveal">
    <span className="ey">{APP_SECTION.eyebrow}</span>
    <h2 id="app-title" className="ht">{APP_SECTION.title}</h2>
    <p className="as-lead">{APP_SECTION.body}</p>
   </header>

   <div className="as-experience">
    <div className="as-stage">
     <img className="as-lifestyle as-reveal" src={APP_SECTION.scene} alt="A person relaxing with their phone in a warmly lit living room" width={1100} height={1375} loading="lazy" decoding="async"/>
     <button className="as-enlarge" type="button" onClick={showCloser} aria-haspopup="dialog" aria-label="View the Heseos app closer"><Expand size={15} aria-hidden="true"/><span>View closer</span></button>
     <div className="as-device as-reveal" data-preview={active}>
      <img src={APP_SECTION.image} alt="The Heseos app showing living-room switches, running hours and a power consumption chart" width={801} height={1134} loading="lazy" decoding="async"/>
      <span className="as-highlight" aria-hidden="true"/>
     </div>
     <div className="as-notification as-reveal" data-active={active === 'alerts'}>
      <button type="button" className="as-notification-trigger" aria-expanded={expanded} aria-controls="app-alert-detail" onClick={() => { setActive('alerts'); setExpanded(!expanded); }}>
       <span className="as-notification-icon"><HomeIcon name="security" size={19}/></span>
       <span><small>Demo notification</small><b>Front door locked</b><span>Away scene is on</span></span>
       <ArrowUpRight className="as-notification-arrow" size={15} aria-hidden="true"/>
      </button>
      <div id="app-alert-detail" className="as-alert-detail" hidden={!expanded}>
       <p>Receive access alerts wherever you are.</p>
       <span>Illustrative preview. Compatible Heseos locks required.</span>
      </div>
     </div>
    </div>
    <div className="as-guide as-reveal">
     {controls('section')}
     <div className="as-caption" aria-live="polite" aria-atomic="true"><p key={active}>{current.caption}</p></div>
    </div>
   </div>

   <div className="as-details">
    <ul className="as-features">
     {APP_SECTION.points.map((point, index) => <li key={point.title} className="as-reveal" style={{ '--as-delay': `${180 + index * 35}ms` } as CSSProperties}>
      <span className="as-feature-icon"><HomeIcon name={point.icon} size={21}/></span>
      <span><b>{point.title}</b><span>{point.body}</span></span>
     </li>)}
    </ul>
    <div className="as-downloads as-reveal" aria-label="Download the Heseos app">
     <a href={APPS.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download Heseos on the App Store (opens in a new tab)"><img src="/media/app/app-store.svg" width={120} height={40} alt="Download on the App Store" loading="lazy"/></a>
     <a className="as-google" href={APPS.googlePlay} target="_blank" rel="noopener noreferrer" aria-label="Get Heseos on Google Play (opens in a new tab)"><img src="/media/app/google-play.png" width={646} height={250} alt="Get it on Google Play" loading="lazy"/></a>
    </div>
   </div>
  </div>

  <dialog ref={dialog} className="as-dialog" aria-labelledby="app-dialog-title" aria-describedby="app-dialog-description" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
   <div className="as-dialog-content">
    <button type="button" className="as-close" aria-label="Close app preview" onClick={() => dialog.current?.close()}><X size={21} aria-hidden="true"/></button>
    <div className="as-dialog-image" data-preview={active}>
     <img src={APP_SECTION.image} width={801} height={1134} alt="An enlarged view of the original Heseos living-room interface, with a power chart and individual device switches" loading="lazy"/>
     <span className="as-highlight" aria-hidden="true"/>
    </div>
    <div className="as-dialog-copy">
     <span className="ey">Inside the Heseos app</span>
     <h3 id="app-dialog-title">A little closer to home.</h3>
     <p id="app-dialog-description">Explore the living-room controls in the Heseos app.</p>
     {controls('dialog')}
     <div className="as-dialog-description" aria-live="polite" aria-atomic="true"><div key={active}><b>{current.caption}</b><p>{current.detail}</p>{active === 'alerts' && <div className="as-dialog-alert"><BellRing size={19} aria-hidden="true"/><span><small>Demo notification</small><b>Front door locked</b><span>Away scene is on</span></span></div>}</div></div>
     <small className="as-preview-note">Product preview. No devices are connected.</small>
    </div>
   </div>
  </dialog>
 </section>;
}
