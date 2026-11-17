import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { SHOP_AISLES, SHOP_COUNT } from '../../../lib/shop';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import ScrollScenes from '../../components/catalog/ScrollScenes';
import AddToBag from '../../components/shop/AddToBag';
import AisleNav from '../../components/shop/AisleNav';
import ShopBag, { OpenBagButton } from '../../components/shop/ShopBag';
import './shop.css';

export const metadata: Metadata = {
  title: 'Shop | Heseos Smart Home',
  description: `Walk eight aisles of ${SHOP_COUNT} Heseos smart home products, fill your bag and send it for one personal quote.`,
  openGraph: { title: 'Shop Heseos', description: 'Build your smart home, aisle by aisle. One bag, one quote.', type: 'website' },
};

const pad = (n: number) => String(n).padStart(2, '0');
// Aisles with this many products pin on wide screens and their shelf slides sideways as the page scrolls.
const PIN_FROM = 4;

// The shop: a photo hero, a sticky aisle index, one numbered aisle per category, then how the quote bag works.
export default function ShopPage() {
  return <div className="sh-page">
    <Reveal />
    <ScrollScenes />

    <section className="sh-hero" data-scroll="view" aria-labelledby="sh-title">
      <img className="sh-hero-img" src="/media/shop/hero.webp" alt="" width={1600} height={1205} fetchPriority="high" />
      <div className="sh-hero-veil" aria-hidden="true" />
      <div className="sh-hero-copy">
        <p className="sh-eyebrow"><span />The Heseos store</p>
        <h1 id="sh-title">Build your smart home, <em>aisle by aisle.</em></h1>
        <p className="sh-lede">Walk {SHOP_AISLES.length} aisles of switches, locks, lighting, fans and sensors. Fill your bag with what each room needs and send it for one quote, priced for your finishes and installation.</p>
        <div className="sh-hero-actions">
          <a className="sh-btn" href={`#${SHOP_AISLES[0].slug}`}>Start browsing<ArrowDown size={17} aria-hidden="true" /></a>
          <OpenBagButton className="sh-btn sh-btn--ghost" />
        </div>
        <dl className="sh-hero-stats">
          <div><dt>Products</dt><dd>{SHOP_COUNT}</dd></div>
          <div><dt>Aisles</dt><dd>{SHOP_AISLES.length}</dd></div>
          <div><dt>Quote for all of it</dt><dd>1</dd></div>
        </dl>
      </div>
    </section>

    <AisleNav aisles={SHOP_AISLES.map((a) => ({ slug: a.slug, name: a.name }))} />

    {SHOP_AISLES.map((aisle, ai) => {
      const pinned = aisle.items.length >= PIN_FROM, no = pad(ai + 1);
      return <section key={aisle.slug} id={aisle.slug} className={`sh-aisle sh-aisle--${ai % 2 ? 'dark' : 'light'}${pinned ? ' is-pinned' : ''}`} data-scroll={pinned ? 'pin' : undefined} style={{ '--n': aisle.items.length } as CSSProperties} aria-labelledby={`${aisle.slug}-title`}>
        <div className="sh-stage">
          <span className="sh-numeral" aria-hidden="true">{no}</span>
          <header className="sh-aisle-head" data-reveal>
            <div>
              <span className="sh-aisle-no">Aisle {no}</span>
              <h2 id={`${aisle.slug}-title`}>{aisle.name}</h2>
              {aisle.intro && <p>{aisle.intro}</p>}
            </div>
            <div className="sh-aisle-meta">
              <span>{aisle.items.length} {aisle.items.length === 1 ? 'product' : 'products'}</span>
              <SiteLink className="sh-aisle-link" href={aisle.href}>Compare the range<ArrowUpRight size={15} aria-hidden="true" /></SiteLink>
            </div>
          </header>
          <div className="sh-rail">
            <ol className="sh-track">
              {aisle.items.map((item, i) => <li key={item.slug} className="sh-card">
                <SiteLink className="sh-tile" href={item.href} tabIndex={-1} aria-hidden="true">
                  <img src={item.image} alt="" width={1000} height={1000} loading={ai === 0 && i < 4 ? 'eager' : 'lazy'} />
                  <span>{pad(i + 1)}</span>
                </SiteLink>
                <div className="sh-card-body">
                  <span className="sh-card-range">{item.range}</span>
                  <h3><SiteLink href={item.href}>{item.name}</SiteLink></h3>
                  <p>{item.tagline}</p>
                  <div className="sh-card-foot">
                    <small>{item.configurations} {item.configurations === 1 ? 'configuration' : 'configurations'}</small>
                    <AddToBag item={{ slug: item.slug, name: item.name, image: item.image, href: item.href }} />
                  </div>
                </div>
              </li>)}
              <li className="sh-endcap-li">
                <SiteLink className="sh-endcap" href={aisle.href}>
                  <span>End of aisle {no}</span>
                  <strong>See every size and finish in {aisle.name}</strong>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </SiteLink>
              </li>
            </ol>
          </div>
          {pinned && <div className="sh-progress" aria-hidden="true"><i /><span>Keep scrolling to walk the aisle</span></div>}
        </div>
      </section>;
    })}

    <section className="sh-how" aria-labelledby="sh-how-title">
      <div className="sh-how-inner">
        <p className="sh-eyebrow"><span />Checkout</p>
        <h2 id="sh-how-title">One bag. One quote.</h2>
        <ol className="sh-steps">
          <li><b>1</b><h3>Fill your bag</h3><p>Add products from any aisle and set the quantity for each. Your bag stays in this browser until you send it.</p></li>
          <li><b>2</b><h3>Send it to us</h3><p>Send the whole bag on WhatsApp, or by email with your city and stage of construction.</p></li>
          <li><b>3</b><h3>Get your quote</h3><p>Our team prices finishes, sizes and installation for your home and replies with one quote.</p></li>
        </ol>
        <div className="sh-how-actions">
          <OpenBagButton className="sh-btn" />
          <a className="sh-btn sh-btn--ghost" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" />Ask on WhatsApp</a>
          <SiteLink className="sh-btn sh-btn--ghost" href="/demo">Book a free demo</SiteLink>
        </div>
      </div>
    </section>

    <ShopBag whatsapp={CONTACT.whatsapp} />
  </div>;
}
