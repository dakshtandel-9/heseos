import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { SHOP_AISLES, SHOP_COUNT } from '../../../lib/shop';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import ScrollScenes from '../../components/catalog/ScrollScenes';
import AddToBag from '../../components/shop/AddToBag';
import ShopBag from '../../components/shop/ShopBag';
import './shop.css';

export const metadata: Metadata = {
  title: 'Shop | Heseos Smart Home',
  description: `Browse and quote ${SHOP_COUNT}+ Heseos smart home products. Add to your bag and request a personalized quote.`,
  openGraph: {
    title: 'Shop Heseos',
    description: 'Build your smart home. Browse products, add to your quote bag, and get priced by our team.',
    type: 'website',
  },
};

export default function ShopPage() {
  return <div className="sh-page">
    <Reveal />
    <ScrollScenes />

    <section className="sh-hero" data-scroll="view" aria-labelledby="sh-hero-title">
      <div className="sh-hero-inner">
        <div data-reveal>
          <h1 id="sh-hero-title" className="sh-title">Build your<br />smart home.</h1>
          <p className="sh-lede">Browse {SHOP_COUNT}+ products across eight categories. Add to your bag and request one quote. No markup, no middleman.</p>
          <p className="sh-hint">💡 New to Heseos? <SiteLink href="/products">Explore the full catalog</SiteLink> first.</p>
        </div>
        <div className="sh-hero-visual" data-reveal>
          <img src="/media/shop/hero.webp" alt="Modern smart home living room" width={800} height={600} />
        </div>
      </div>
    </section>

    {SHOP_AISLES.map((aisle, aisleIndex) => (
      <section key={aisle.slug} id={aisle.slug} className={'sh-aisle ' + (aisleIndex % 2 === 0 ? 'sh-aisle--light' : 'sh-aisle--dark')} aria-labelledby={aisle.slug + '-title'} data-scroll="view">
        <div className="sh-aisle-head" data-reveal>
          <div>
            <h2 id={aisle.slug + '-title'} className="sh-aisle-title">{aisle.name}</h2>
            <p className="sh-aisle-intro">{aisle.intro}</p>
          </div>
          <SiteLink href={`/products/browse/${aisle.slug}`} className="sh-aisle-link">
            Explore range <ArrowUpRight size={14} aria-hidden="true" />
          </SiteLink>
        </div>

        <div className="sh-grid">
          {aisle.items.map((item, i) => (
            <div key={item.slug} className="sh-card" data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
              <a className="sh-card-image" href={item.href}>
                <img src={item.image} alt={item.name} width={320} height={240} loading={aisleIndex === 0 && i < 3 ? 'eager' : 'lazy'} />
              </a>
              <div className="sh-card-info">
                <a href={item.href} className="sh-card-name">{item.name}</a>
                <span className="sh-card-range">{item.range}</span>
                <p className="sh-card-tagline">{item.tagline}</p>
                <div className="sh-card-footer">
                  <small>{item.configurations} {item.configurations === 1 ? 'variant' : 'variants'}</small>
                  <AddToBag item={{ slug: item.slug, name: item.name, image: item.image, href: item.href }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}

    <section className="sh-cta" data-scroll="view" aria-labelledby="sh-cta-title">
      <div className="sh-wrap">
        <h2 id="sh-cta-title">Questions about your project?</h2>
        <p>Our team is here to help. Chat on WhatsApp, email, or book a free demo to see products in action.</p>
        <div className="sh-cta-links">
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn">Chat on WhatsApp</a>
          <SiteLink href="/demo" className="btn secondary">Book a demo</SiteLink>
          <a href={`mailto:${CONTACT.email}`} className="btn secondary">Email us</a>
        </div>
      </div>
    </section>

    <ShopBag whatsapp={CONTACT.whatsapp} />
  </div>;
}
