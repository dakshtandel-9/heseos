import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BellRing, Cable, Fan, Tv } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { CLIENTS, PARTNERS } from '../../../lib/home';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import CountUp from '../../components/about/CountUp';
import PitchVideo from '../../components/about/PitchVideo';
import './about.css';

export const metadata: Metadata = {
  title: 'About Heseos | Intelligent Living & Smart Home Automation',
  description: 'Discover Heseos, the Indian smart-home automation brand seen on Indian Angels, creating retrofit, wireless solutions for homes, hotels, offices and buildings.',
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

// Heseos on Indian Angels (JioCinema), uploaded to the Heseos YouTube channel on 31 January 2024.
const PITCH_VIDEO = { id: 'xC4w-jMrZTo', url: 'https://www.youtube.com/watch?v=xC4w-jMrZTo', title: 'Heseos on Indian Angels, full video on JioCinema' };

// What the pitch covered, from the episode audio.
const pitchPoints = [
  { icon: Cable, title: 'Retrofit by design', body: 'Fits your existing switchboards. No rewiring, no broken walls.' },
  { icon: Fan, title: 'Lights, fans and ACs', body: 'Control everyday appliances from your phone, anywhere in the world.' },
  { icon: BellRing, title: 'Alerts that matter', body: 'Intrusion, gas leak and fire alarms, straight to your mobile.' },
];

const retrofitSteps = [
  { number: '01', title: 'Keep your wiring', body: 'Our wireless modules sit behind the switchboards you already have.' },
  { number: '02', title: 'Install in hours', body: 'No wall chasing, no repainting, no weeks of disruption.' },
  { number: '03', title: 'Control everything', body: 'Lights, fans, ACs and scenes from touch panels, the app or your voice.' },
];

// The About page features three of the clients listed in lib/home.ts.
const clients = ['Virinchi', 'Emaar Digi Homes', 'IHCL'].map((name) => CLIENTS.find((client) => client.name === name)!);
const logos = [...PARTNERS.map((p) => ({ name: p.name, logo: p.logo, w: 224, h: 94 })), ...clients.map((c) => ({ name: c.name, logo: c.logo, w: 312, h: 102 }))];

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
      <div className="about-wrap about-hero-content">
        <a className="about-badge" href="#pitch"><span className="about-badge-dot" />As seen on Indian Angels · JioCinema<ArrowRight size={14} aria-hidden="true" /></a>
        <h1 id="about-hero-title"><span>Built for a more</span> <span>beautiful way to live.</span></h1>
        <p>At Heseos, we create intelligent living experiences that bring comfort, control and elegance to your everyday life, without rewiring your home.</p>
        <div className="about-hero-actions">
          <SiteLink className="about-button" href="/products">Explore our solutions <ArrowRight size={16} aria-hidden="true" /></SiteLink>
          <a className="about-button about-button-ghost" href="#pitch">Watch our pitch</a>
        </div>
      </div>
      <a className="about-scroll" href="#about-story" aria-label="Scroll to our story"><span /></a>
      <span className="about-hero-caption">Illustrative imagery</span>
    </section>

    <section className="about-intro about-light" id="about-story" aria-labelledby="about-intro-title">
      <div className="about-wrap about-intro-grid">
        <div data-reveal>
          <p className="about-eyebrow"><span />Who we are</p>
          <h2 id="about-intro-title" className="about-section-title">Technology that<br />feels like home.</h2>
          <p className="about-copy-text">Heseos makes IoT products and services for homes, offices, buildings and hotels. Our connected solutions bring convenience, efficiency and thoughtful technology into everyday life.</p>
          <p className="about-made-in-india">Made in India. Proudly serving the world.</p>
        </div>
        <figure className="about-frame about-intro-photo has-caption" data-reveal>
          <Image src="/media/about/intro-v2.webp" alt="Illustrative image: a hand touching a Heseos Edge Panel, a horizontal black glass touch switch with a rose-gold frame, on a sunlit plaster wall" fill sizes="(max-width: 700px) 100vw, 55vw" />
          <figcaption>Designed for the spaces we live in · Illustrative</figcaption>
        </figure>
      </div>
    </section>

    <section className="about-stats" aria-label="Heseos at a glance">
      <div className="about-wrap about-stats-grid">
        {stats.map((stat) => <div className="about-stat" key={stat.label}><CountUp value={stat.value} /><span>{stat.label}</span></div>)}
      </div>
    </section>

    <section className="about-pitch" id="pitch" aria-labelledby="about-pitch-title">
      <div className="about-pitch-glow" aria-hidden="true" />
      <div className="about-wrap">
        <div className="about-pitch-head" data-reveal>
          <p className="about-eyebrow"><span />As seen on Indian Angels</p>
          <h2 id="about-pitch-title">We took smart homes<br className="about-desktop-break" /> to national TV.</h2>
          <p>On Indian Angels, streaming on JioCinema, we pitched a simpler idea of home automation to India&apos;s angel investors: one that works with the home you already have.</p>
        </div>
        <div className="about-pitch-grid">
          <div className="about-pitch-media" data-reveal>
            <PitchVideo id={PITCH_VIDEO.id} title={PITCH_VIDEO.title} />
            <a className="about-pitch-link" href={PITCH_VIDEO.url} target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="about-pitch-copy">
            <blockquote data-reveal>
              <p>&ldquo;Our products are completely retrofit in nature, wireless in technology, and help you control your lights, fans and ACs from anywhere in the world.&rdquo;</p>
              <footer>From our pitch on Indian Angels</footer>
            </blockquote>
            <ul className="about-pitch-points">
              {pitchPoints.map(({ icon: Icon, title, body }) => <li key={title} data-reveal>
                <span className="about-pitch-icon"><Icon size={18} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>)}
            </ul>
          </div>
        </div>
        <div className="about-pitch-outcome" data-reveal>
          <div><strong>3</strong><span>Offers on the table</span></div>
          <div><strong>1</strong><span>Angel deal accepted</span></div>
          <div><Tv size={22} aria-hidden="true" /><span>Streamed on JioCinema · January 2024</span></div>
        </div>
      </div>
    </section>

    <section className="about-retrofit about-light" aria-labelledby="about-retrofit-title">
      <div className="about-wrap about-retrofit-grid">
        <figure className="about-frame about-retrofit-photo has-caption" data-reveal>
          <Image src="/media/about/retrofit-range.webp" alt="Illustrative image: the Heseos range on oak shelves, including touch panels, switches, retrofit module, smart plug, door locks, video door phone, doorbell, sensors, downlights, tube light and ceiling fan" fill sizes="(max-width: 700px) 100vw, 50vw" />
          <figcaption>The Heseos range · Illustrative</figcaption>
        </figure>
        <div data-reveal>
          <p className="about-eyebrow"><span />Why retrofit</p>
          <h2 id="about-retrofit-title" className="about-section-title">Smart, without<br />breaking walls.</h2>
          <p className="about-copy-text">Traditional automation means new wiring, and a bill to match. Heseos brings the cost of automation down drastically by working with what is already in your walls.</p>
          <ol className="about-steps">
            {retrofitSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}
          </ol>
        </div>
      </div>
    </section>

    <section className="about-purpose" aria-label="Heseos mission and vision">
      <div className="about-purpose-image" aria-hidden="true">
        <Image src="/media/about/township.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="about-purpose-shade" aria-hidden="true" />
      <div className="about-wrap about-purpose-grid">
        <article className="about-purpose-card" data-reveal>
          <p className="about-eyebrow">Our mission</p>
          <h2>Empowering spaces with smart solutions.</h2>
          <p>To bring IoT products and services into homes, offices, buildings and hotels, making daily life more convenient, efficient and sustainable.</p>
        </article>
        <article className="about-purpose-card" data-reveal>
          <p className="about-eyebrow">Our vision</p>
          <h2>Technology that enriches lives.</h2>
          <p>To grow a smart-home ecosystem that connects people and products seamlessly, and makes technology a positive part of everyday life.</p>
        </article>
      </div>
      <span className="about-purpose-caption">Illustrative imagery</span>
    </section>

    <section className="about-craft" aria-labelledby="about-craft-title">
      <div className="about-craft-image" aria-hidden="true" />
      <Image className="about-craft-panel" src="/media/about/craft-panel-v2.webp" alt="" width={1600} height={1085} sizes="(max-width: 700px) 84vw, 46vw" />
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
      <span className="about-craft-caption">Heseos Touch Panel · enhanced render</span>
    </section>

    <section className="about-solutions about-light" id="spaces" aria-labelledby="about-solutions-title">
      <div className="about-wrap about-solutions-grid">
        <div className="about-solutions-intro" data-reveal>
          <p className="about-eyebrow"><span />Our solutions</p>
          <h2 id="about-solutions-title" className="about-section-title">Intelligence<br />for every space.</h2>
          <p className="about-copy-text">From smart homes and hotels to buildings and enterprises, Heseos connects the spaces where people live and work.</p>
        </div>
        <div className="about-space-grid">
          {spaces.map((space, index) => <SiteLink className="about-space-card" href={space.href} key={space.name} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
            <Image src={space.image} alt={`Illustrative image: ${space.alt}`} fill sizes="(max-width: 700px) 45vw, (max-width: 1000px) 22vw, 17vw" />
            <span className="about-space-number">0{index + 1}</span>
            <span className="about-space-copy"><span className="about-space-name">{space.name}<ArrowUpRight size={17} aria-hidden="true" /></span><small>{space.detail}</small></span>
          </SiteLink>)}
        </div>
      </div>
    </section>

    <section className="about-trust about-light" aria-labelledby="about-trust-title">
      <div className="about-wrap"><h2 id="about-trust-title" className="about-trust-title">Our exclusive partners and clients</h2></div>
      <div className="about-marquee">
        {[0, 1].map((copy) => <ul key={copy} aria-hidden={copy === 1 || undefined}>
          {logos.map((logo) => <li key={logo.name}><Image src={logo.logo} alt={copy ? '' : logo.name} width={logo.w} height={logo.h} sizes="160px" /></li>)}
        </ul>)}
      </div>
    </section>

    <section className="about-cta" aria-labelledby="about-cta-title">
      <Image className="about-cta-image" src="/media/about/cta.webp" alt="Illustrative contemporary villa glowing at blue hour beside a reflecting pool" fill sizes="100vw" />
      <div className="about-cta-shade" />
      <div className="about-wrap about-cta-content" data-reveal>
        <div><p className="about-eyebrow">Smarter spaces. Better living.</p><h2 id="about-cta-title">Let&apos;s make your<br />space extraordinary.</h2><p>Tell us about your space and discover how Heseos can bring intelligent living to life.</p></div>
        <div className="about-cta-actions">
          <SiteLink className="about-button" href="/demo">Book a demo <ArrowRight size={16} aria-hidden="true" /></SiteLink>
          <a className="about-button about-button-outline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">Talk to an expert <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
      <span className="about-cta-caption">Illustrative imagery</span>
    </section>
  </div>;
}
