'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { BHKS, PACKAGE_TYPES, TIERS, formatINR, type Bhk, type Tier } from '../../../lib/catalog';
import { getStartingPackage } from '../../../lib/package-showcase';
import SiteLink from '../site/SiteLink';
import './PackageShowcase.css';

const copy: Record<Tier, { description: string; benefits: string[] }> = {
 starter: { description: 'Essential smart living.', benefits: ['Smart switches for your rooms', 'Retrofit, touch switch or touch panel', 'Control by touch, app and voice'] },
 standard: { description: 'Perfect for modern homes.', benefits: ['Everything in Starter', 'IR Blasters for your AC and TV', 'Every remote, in the Heseos app'] },
 premium: { description: 'The complete experience.', benefits: ['Everything in Standard', 'Smart Plugs for heavy appliances', 'Track your power consumption'] },
};

export default function PackageShowcase() {
 const [bhk, setBhk] = useState<Bhk>(BHKS[0]);
 const controls = useRef<(HTMLButtonElement | null)[]>([]);
 const packages = TIERS.map(tier => ({ ...tier, pkg: getStartingPackage(bhk, tier.id) }));

 function navigateSizes(event: KeyboardEvent<HTMLButtonElement>, index: number) {
  let next: number;
  switch (event.key) {
   case 'ArrowRight': case 'ArrowDown': next = (index + 1) % BHKS.length; break;
   case 'ArrowLeft': case 'ArrowUp': next = (index + BHKS.length - 1) % BHKS.length; break;
   case 'Home': next = 0; break;
   case 'End': next = BHKS.length - 1; break;
   default: return;
  }
  event.preventDefault();
  setBhk(BHKS[next]);
  controls.current[next]?.focus();
 }

 return <section id="home-packages" className="hsx pricing-section" aria-labelledby="packages-title">
  <div className="hw">
   <header className="pricing-heading" data-reveal>
    <div><span className="ey">Packages</span><h2 id="packages-title" className="ht">Which package is right for you?</h2></div>
    <p>Choose a package that fits your space and start your smart living journey today.</p>
   </header>

   <div className="pricing-toolbar">
    <div className="pricing-home-size">
     <span id="pricing-size-label">Your home size</span>
     <div className="pricing-sizes" role="radiogroup" aria-labelledby="pricing-size-label">
      {BHKS.map((size, index) => <button key={size} ref={element => { controls.current[index] = element; }} type="button" role="radio" aria-checked={bhk === size} aria-controls="pricing-options" tabIndex={bhk === size ? 0 : -1} onClick={() => setBhk(size)} onKeyDown={event => navigateSizes(event, index)}>{size} BHK</button>)}
     </div>
    </div>
    <p>Three tiers. Three ways to make it yours.</p>
   </div>

   <p className="sr-only" role="status" aria-atomic="true">Starting prices for {bhk} BHK: {packages.map(({ name, pkg }) => `${name} ${formatINR(pkg.price)}`).join('; ')}.</p>
   <div id="pricing-options" className="pricing-grid" data-reveal>
    {packages.map(({ id, name, pkg }, index) => <article key={id} className={`pricing-card${id === 'standard' ? ' is-recommended' : ''}`} aria-labelledby={`pricing-${id}-title`}>
     <div className="pricing-card-top"><span className="pricing-index" aria-hidden="true">0{index + 1}</span>{id === 'standard' && <span className="pricing-recommendation">Recommended</span>}</div>
     <h3 id={`pricing-${id}-title`}>{name}</h3>
     <p className="pricing-description">{copy[id].description}</p>
     <div className="pricing-amount">
      <span className="pricing-from">From</span>
      <p key={bhk} className="pricing-number"><span className="sr-only">{formatINR(pkg.price)}</span><span aria-hidden="true" className="pricing-currency">₹</span><span aria-hidden="true">{new Intl.NumberFormat('en-IN').format(pkg.price)}</span></p>
      <p className="pricing-qualification">Starting price for {bhk} BHK</p>
     </div>
     <ul className="pricing-benefits">{copy[id].benefits.map(benefit => <li key={benefit}><Check size={15} strokeWidth={1.5} aria-hidden="true"/><span>{benefit}</span></li>)}</ul>
     <details className="pricing-inclusions">
      <summary><span>Included at this price</span><ChevronDown size={14} aria-hidden="true"/></summary>
      <div key={pkg.id}><p>{PACKAGE_TYPES.find(type => type.id === pkg.type)!.name} · {bhk} BHK</p><ul>{pkg.items.map(item => <li key={item.name}>{item.qty} × {item.name}</li>)}</ul></div>
     </details>
     <SiteLink className="pricing-cta" href={`/demo?package=${encodeURIComponent(name)}`}>Explore {name}<ArrowRight size={17} strokeWidth={1.6} aria-hidden="true"/></SiteLink>
    </article>)}
   </div>

   <footer className="pricing-footer">
    <p>Starting prices across retrofit, touch switch and touch panel packages.<br/>Explore a tier to see its configuration and other upgrade options.</p>
    <SiteLink className="pricing-compare" href="/demo">Plan a package for your home<ArrowRight size={16} aria-hidden="true"/></SiteLink>
   </footer>
  </div>
 </section>;
}
