import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight, MessageCircle, Plus } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { CLIENTS, PARTNERS } from '../../../lib/home';
import { PRODUCT_DIRECTORY, directoryCategoryHref } from '../../../lib/product-directory';
import { PARTNER_FAQ, PARTNER_STATS, PARTNER_STEPS } from '../../../lib/partners';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import CountUp from '../../components/home/CountUp';
import ScrollScenes from '../../components/catalog/ScrollScenes';
import PartnerStory from '../../components/partners/PartnerStory';
import PartnerSwitch from '../../components/partners/PartnerSwitch';
import PartnerForm from '../../components/partners/PartnerForm';
import './partners.css';

export const metadata: Metadata = {
  title: 'Partner with Heseos | Dealers, Designers, Builders & Integrators',
  description: 'Join the Heseos partner network. Dealers, architects, interior designers, builders and system integrators bring Made-in-India smart-home automation to homes, hotels and buildings.',
  openGraph: {
    title: 'Partner with Heseos',
    description: 'Build the future of living, together. Apply to become a Heseos dealer, design, project or installation partner.',
    type: 'website',
  },
};

const productCount = PRODUCT_DIRECTORY.reduce((sum, c) => sum + c.subcategories.reduce((n, s) => n + s.products.length, 0), 0);

// Partners: a pinned story (one villa from sketch to switch-on, a partnership per chapter), the figures, a touch panel that
// lights a key per reason to partner, the range, a wire that runs through the four steps, logos, FAQ and the application.
export default function PartnersPage() {
  return <div className="pt-page">
    <Reveal />
    <ScrollScenes />

    <PartnerStory />

    <section className="pt-stats" aria-label="Heseos at a glance">
      <div className="pt-wrap pt-stats-grid">
        {PARTNER_STATS.map((s, i) => <div className="pt-stat" key={s.label} data-reveal style={{ transitionDelay: `${i * 80}ms` }}><strong><CountUp value={s.value} /></strong><span>{s.label}</span></div>)}
      </div>
    </section>

    <PartnerSwitch />

    <section className="pt-section pt-range" data-scroll="view" aria-labelledby="pt-range-title">
      <div className="pt-wrap pt-range-grid">
        <div className="pt-range-visual" data-reveal>
          <Image src="/media/products/touch-4m.webp" alt="Heseos 4 module glass touch panel" width={1600} height={1133} sizes="(max-width: 900px) 90vw, 45vw" />
          <div className="pt-range-badge"><strong>{productCount}+</strong><span>products to sell, specify and install</span></div>
        </div>
        <div data-reveal>
          <p className="pt-eyebrow"><span />The range you represent</p>
          <h2 id="pt-range-title" className="pt-title">Every room.<br />One app.</h2>
          <p className="pt-lede">{PRODUCT_DIRECTORY.length} product categories that work together in the Heseos app, with Alexa, Siri and Google Home.</p>
          <ol className="pt-range-list">
            {PRODUCT_DIRECTORY.map((c, i) => <li key={c.slug}><SiteLink href={directoryCategoryHref(c)}><span>{String(i + 1).padStart(2, '0')}</span>{c.name}<ArrowUpRight size={16} aria-hidden="true" /></SiteLink></li>)}
          </ol>
        </div>
      </div>
    </section>

    {/* The journey as a circuit: a wire runs through the four steps as the section scrolls past, lighting each node it reaches. */}
    <section className="pt-section pt-journey" data-scroll="view" aria-labelledby="pt-journey-title">
      <div className="pt-wrap">
        <div className="pt-head" data-reveal>
          <p className="pt-eyebrow"><span />How it works</p>
          <h2 id="pt-journey-title" className="pt-title">From hello to<br />first handover.</h2>
        </div>
        <div className="pt-circuit">
          <i className="pt-wire" aria-hidden="true" />
          <ol className="pt-steps">
            {PARTNER_STEPS.map((s, i) => <li key={s.title} style={{ '--at': i / (PARTNER_STEPS.length - 1) } as CSSProperties}><span className="pt-step-dot">{i + 1}</span><h3>{s.title}</h3><p>{s.body}</p></li>)}
          </ol>
        </div>
      </div>
    </section>

    <section className="pt-trust" aria-labelledby="pt-trust-title">
      <div className="pt-wrap pt-trust-head">
        <h2 id="pt-trust-title">In good company</h2>
        <div className="pt-exclusive"><span>Exclusive partners</span>{PARTNERS.map((p) => <Image key={p.name} src={p.logo} alt={p.name} width={224} height={94} sizes="150px" />)}</div>
      </div>
      <div className="pt-marquee">
        <div className="pt-marquee-track">
          {[0, 1].map((copy) => <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy === 0 ? 'Heseos clients' : undefined}>
            {CLIENTS.map((c) => <li key={c.name}><Image src={c.logo} alt={copy === 0 ? c.name : ''} width={312} height={102} sizes="140px" /></li>)}
          </ul>)}
        </div>
      </div>
    </section>

    <section className="pt-section pt-faq" aria-labelledby="pt-faq-title">
      <div className="pt-wrap pt-faq-grid">
        <div data-reveal>
          <p className="pt-eyebrow"><span />Questions</p>
          <h2 id="pt-faq-title" className="pt-title">Good to know.</h2>
          <p className="pt-lede">Something else on your mind? Our team is a message away.</p>
          <a className="pt-text-link" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp</a>
        </div>
        <div className="pt-faq-list">
          {PARTNER_FAQ.map((f) => <details key={f.q}><summary>{f.q}<Plus size={18} aria-hidden="true" /></summary><p>{f.a}</p></details>)}
        </div>
      </div>
    </section>

    <section className="pt-apply" id="apply" aria-labelledby="pt-apply-title">
      <Image className="pt-apply-image" src="/media/partners/lit.webp" alt="" fill sizes="100vw" />
      <div className="pt-wrap pt-apply-grid">
        <div className="pt-apply-copy">
          <p className="pt-eyebrow"><span />Apply</p>
          <h2 id="pt-apply-title">Let&apos;s build<br />something smart.</h2>
          <p>Tell us about your business. Our partnerships team reviews every application and will reach out to plan the next step together.</p>
          <ul>
            <li><span>Free</span>to apply, no obligation</li>
            <li><span>2 min</span>to complete the form</li>
            <li><span>1 team</span>with you from training to handover</li>
          </ul>
          <div className="pt-apply-contact">
            <a href={`mailto:${CONTACT.email}?subject=Heseos%20partnership`}>{CONTACT.email}</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="pt-form-card">
          <h3>Partner application</h3>
          <PartnerForm />
        </div>
      </div>
    </section>
  </div>;
}
