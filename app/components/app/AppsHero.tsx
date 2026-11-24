'use client';
import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { CustomerScreen, InstallerJobs, Phone, PartnerHome } from './AppScreens';
import useReducedMotion from './useReducedMotion';

const APPS = [
 { id: 'partner', word: 'partners', name: 'Heseos Partner', icon: '/media/app/icons/partner.png', line: 'Refer homes, earn commission' },
 { id: 'customer', word: 'homeowners', name: 'Heseos', icon: '/media/app/icons/customer.png', line: 'Control your connected home' },
 { id: 'installer', word: 'installers', name: 'Heseos Installer', icon: '/media/app/icons/installer.png', line: 'Claim jobs, install, get paid' },
] as const;
const ORDER = [1, 0, 2];

// Hero: three phones, one per app. A rotating word names who each app is for and lifts the matching phone.
export default function AppsHero() {
 const [at, setAt] = useState(1);
 const still = useReducedMotion();
 useEffect(() => {
  if (still) return;
  let i = 0;
  const t = setInterval(() => { i = (i + 1) % 3; setAt(ORDER[i]); }, 2600);
  return () => clearInterval(t);
 }, [still]);
 const app = APPS[at];
 return <section className="wa-hero" aria-labelledby="wa-hero-title">
  <div className="wa-hero-glow" aria-hidden="true"/>
  <div className="wa-hero-inner">
   <div className="wa-hero-copy">
    <p className="wa-kicker"><span className="wa-dot"/>The Heseos app family</p>
    <h1 id="wa-hero-title"><span className="wa-line"><span>One home.</span></span><span className="wa-line"><span>Three apps.</span></span></h1>
    <p className="wa-rotor" aria-live="off">Built for{' '}
     {still ? <strong className="wa-word">homeowners, partners and installers.</strong>
      : <strong key={app.word} className={`wa-word wa-w-${app.id}`}>{[...app.word].map((c, n) => <span key={n} style={{ animationDelay: `${n * 32}ms` }}>{c}</span>)}</strong>}
    </p>
    <p className="wa-lead">The Heseos app runs the home. Heseos Partner rewards the people who bring homes to us. Heseos Installer puts trained hands on every installation, like a delivery app built for smart homes.</p>
    <div className="wa-hero-apps">{APPS.map((a, n) => <a key={a.id} href={`#${a.id}`} className={n === at ? 'on' : undefined} onMouseEnter={() => setAt(n)} onFocus={() => setAt(n)}>
     <img src={a.icon} alt="" width={44} height={44}/><span><strong>{a.name}</strong><small>{a.line}</small></span>
    </a>)}</div>
   </div>
   <div className="wa-hero-phones" data-at={app.id}>
    <Phone className="wa-hp wa-hp-partner" label="Heseos Partner app, illustrative home screen"><PartnerHome/></Phone>
    <Phone className="wa-hp wa-hp-customer" tone="light" label="Heseos app, illustrative living-room controls"><CustomerScreen/></Phone>
    <Phone className="wa-hp wa-hp-installer" label="Heseos Installer app, illustrative job list"><InstallerJobs/></Phone>
   </div>
  </div>
  <a className="wa-scroll" href="#how"><ArrowDown size={16} aria-hidden="true"/>See how they connect</a>
 </section>;
}
