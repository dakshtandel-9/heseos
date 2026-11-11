import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { CLIENTS, PARTNERS } from '../../../lib/home';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import './about.css';

export const metadata: Metadata = {
  title: 'About Heseos | Intelligent Living & Smart Home Automation',
  description: 'Discover Heseos, an Indian smart-home automation brand creating intelligent solutions for homes, hotels, offices and buildings.',
  openGraph: {
    title: 'About Heseos | Intelligent Living & Smart Home Automation',
    description: 'Technology that feels like home. Discover the Heseos approach to connected spaces.',
    type: 'website',
  },
};

const spaces = [
  { name: 'Smart homes', detail: 'Comfort, security and control.', image: '/media/home/gen/villa.webp', alt: 'Contemporary home at dusk with warm interior lighting', href: '/experience' },
  { name: 'Smart hotels', detail: 'Connected guest experiences.', image: '/media/home/gen/hotel-suite.webp', alt: 'Warmly lit contemporary hotel suite', href: '/demo' },
  { name: 'Smart buildings', detail: 'Intelligence across properties.', image: '/media/home/gen/residence-tower.webp', alt: 'Modern multi-storey building at twilight', href: '/demo' },
  { name: 'Smart enterprises', detail: 'Automate, monitor and schedule.', image: '/media/home/gen/office.webp', alt: 'Contemporary office with warm architectural lighting', href: '/demo' },
];

// Figures and relationships on pages 4–5 and 68 of the HESEOS 2026–27 brochure.
const stats = [
  { value: '15+', label: 'Years of industry experience' },
  { value: '9,000+', label: 'Happy customers' },
  { value: '100,000+', label: 'Devices installed' },
  { value: '6+', label: 'International projects' },
  { value: '10+', label: 'Dealers in India' },
];

// The About page features three of the clients listed in lib/home.ts.
const clients = ['Virinchi', 'Emaar Digi Homes', 'IHCL'].map((name) => CLIENTS.find((client) => client.name === name)!);

const principles = [
  { number: '01', title: 'Support', body: 'A team to help you make the most of your connected space.' },
  { number: '02', title: 'Quality hardware', body: 'Controls made for confident everyday use.' },
  { number: '03', title: 'Made in India', body: 'Products created with pride in India.' },
  { number: '04', title: 'Wide ecosystem', body: 'Hardware and software designed to work together.' },
];

export default function AboutPage() {
  return <div className="about-page">
    <Reveal />

    <section className="about-hero" aria-labelledby="about-hero-title">
      <Image className="about-hero-image" src="/media/about/hero.webp" alt="Illustrative contemporary living room in golden-hour light, with glass walls opening onto a garden" fill sizes="100vw" priority />
      <div className="about-hero-shade" />
      <div className="about-wrap about-hero-content" data-reveal>
        <p className="about-eyebrow"><span />Our story</p>
        <h1 id="about-hero-title">Built for a more<br className="about-desktop-break" /> beautiful way to live.</h1>
        <p>At Heseos, we create intelligent living experiences that bring comfort, control and elegance to your everyday life.</p>
        <SiteLink className="about-button" href="/products">Explore our solutions <ArrowRight size={16} aria-hidden="true" /></SiteLink>
      </div>
      <span className="about-hero-caption">Illustrative imagery</span>
    </section>

    <section className="about-intro about-light" aria-labelledby="about-intro-title">
      <div className="about-wrap about-intro-grid">
        <div data-reveal>
          <p className="about-eyebrow">Who we are</p>
          <h2 id="about-intro-title" className="about-section-title">Technology that<br />feels like home.</h2>
          <p className="about-copy-text">Heseos makes IoT products and services for homes, offices, buildings and hotels. Our connected solutions bring convenience, efficiency and thoughtful technology into everyday life.</p>
          <p className="about-made-in-india">Made in India. Proudly serving the world.</p>
        </div>
        <figure className="about-frame about-intro-photo has-caption" data-reveal>
          <Image src="/media/about/intro.webp" alt="Illustrative image: a hand touching a black glass touch panel on a sunlit plaster wall" fill sizes="(max-width: 700px) 100vw, 55vw" />
          <figcaption>Designed for the spaces we live in · Illustrative</figcaption>
        </figure>
      </div>
    </section>

    <section className="about-stats" aria-label="Heseos at a glance">
      <div className="about-wrap about-stats-grid">
        {stats.map((stat) => <div className="about-stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
    </section>

    <section className="about-purpose about-light" aria-label="Heseos mission and vision">
      <div className="about-wrap about-purpose-grid">
        <figure className="about-frame about-purpose-photo has-caption" data-reveal>
          <Image src="/media/home/gen/connected-home.webp" alt="Illustrative contemporary living room with connected-home devices" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 90vw, 40vw" />
          <figcaption>More considered spaces, made for living · Illustrative</figcaption>
        </figure>
        <article className="about-purpose-copy" data-reveal>
          <p className="about-eyebrow">Our mission</p>
          <h2>Empowering spaces with smart solutions.</h2>
          <p>To bring IoT products and services into homes, offices, buildings and hotels, making daily life more convenient, efficient and sustainable.</p>
        </article>
        <article className="about-purpose-copy" data-reveal>
          <p className="about-eyebrow">Our vision</p>
          <h2>Technology that enriches lives.</h2>
          <p>To grow a smart-home ecosystem that connects people and products seamlessly, and makes technology a positive part of everyday life.</p>
        </article>
      </div>
    </section>

    <section className="about-craft" aria-labelledby="about-craft-title">
      <div className="about-craft-image" aria-hidden="true" />
      <Image className="about-craft-panel" src="/media/products/touch-4m.webp" alt="" width={1600} height={1133} sizes="(max-width: 700px) 84vw, 46vw" />
      <div className="about-craft-wash" aria-hidden="true" />
      <div className="about-wrap about-craft-content" data-reveal>
        <p className="about-eyebrow">Made for everyday life</p>
        <h2 id="about-craft-title"><span>Crafted with intention.</span> <span>Engineered for everyday life.</span></h2>
        <div className="about-principles">
          {principles.map((principle) => <article key={principle.number}>
            <span>{principle.number}</span>
            <div><h3>{principle.title}</h3><p>{principle.body}</p></div>
          </article>)}
        </div>
      </div>
      <span className="about-craft-caption">Genuine Heseos Touch Panel</span>
    </section>

    <section className="about-solutions about-light" id="spaces" aria-labelledby="about-solutions-title">
      <div className="about-wrap about-solutions-grid">
        <div className="about-solutions-intro" data-reveal>
          <p className="about-eyebrow">Our solutions</p>
          <h2 id="about-solutions-title" className="about-section-title">Intelligence<br />for every space.</h2>
          <p className="about-copy-text">From smart homes and hotels to buildings and enterprises, Heseos connects the spaces where people live and work.</p>
        </div>
        <div className="about-space-grid">
          {spaces.map((space, index) => <SiteLink className="about-space-card" href={space.href} key={space.name} data-reveal>
            <Image src={space.image} alt={`Illustrative image: ${space.alt}`} fill sizes="(max-width: 700px) 45vw, (max-width: 1000px) 22vw, 17vw" />
            <span className="about-space-number">0{index + 1}</span>
            <span className="about-space-copy"><span className="about-space-name">{space.name}<ArrowUpRight size={17} aria-hidden="true" /></span><small>{space.detail}</small></span>
          </SiteLink>)}
        </div>
      </div>
    </section>

    <section className="about-trust about-light" aria-labelledby="about-trust-title">
      <h2 id="about-trust-title" className="sr-only">Heseos partners and clients</h2>
      <div className="about-wrap about-trust-inner">
        <div className="about-trust-group"><h3>Exclusive partners</h3><div className="about-logos">{PARTNERS.map((partner) => <div key={partner.name}><Image src={partner.logo} alt={partner.name} width={224} height={94} sizes="160px" /></div>)}</div></div>
        <div className="about-trust-group"><h3>Our clients</h3><div className="about-logos">{clients.map((client) => <div key={client.name}><Image src={client.logo} alt={client.name} width={312} height={102} sizes="160px" /></div>)}</div></div>
      </div>
    </section>

    <section className="about-belief about-light" aria-labelledby="about-belief-title">
      <div className="about-wrap about-belief-grid">
        <div data-reveal>
          <p className="about-eyebrow">Our belief</p>
          <h2 id="about-belief-title" className="about-section-title">Smarter spaces.<br />Better living.</h2>
          <p className="about-copy-text">We believe the best technology is simple, intuitive and human — quietly working in the background to make life more comfortable, convenient and efficient.</p>
        </div>
        <figure className="about-frame about-belief-photo" data-reveal>
          <Image src="/media/app/smart-living.webp" alt="Illustrative warm contemporary living room with natural stone, wood and soft evening light" fill sizes="(max-width: 700px) 100vw, 55vw" />
        </figure>
      </div>
    </section>

    <section className="about-cta" aria-labelledby="about-cta-title">
      <Image className="about-cta-image" src="/media/about/cta.webp" alt="Illustrative contemporary villa glowing at blue hour beside a reflecting pool" fill sizes="100vw" />
      <div className="about-cta-shade" />
      <div className="about-wrap about-cta-content" data-reveal>
        <div><p className="about-eyebrow">Make your space yours</p><h2 id="about-cta-title">Let&apos;s make your<br />space extraordinary.</h2><p>Tell us about your space and discover how Heseos can bring intelligent living to life.</p></div>
        <div className="about-cta-actions">
          <SiteLink className="about-button" href="/demo">Book a demo <ArrowRight size={16} aria-hidden="true" /></SiteLink>
          <a className="about-button about-button-outline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">Talk to an expert <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
      <span className="about-cta-caption">Illustrative imagery</span>
    </section>
  </div>;
}
