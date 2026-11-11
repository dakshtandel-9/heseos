import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, CalendarCheck, FileText, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { APPS, CONTACT, LEGAL } from '../../../lib/site';
import { SUPPORT_DOWNLOADS, SUPPORT_TOPICS, WHATSAPP_DISPLAY } from '../../../lib/support';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import HelpCenter, { AnswerBrowser, HelpSearch, TopicButton } from '../../components/support/HelpCenter';
import { SUPPORT_ICONS } from '../../components/support/icons';
import './support.css';
import ContactForm from '../../components/site/ContactForm';

export const metadata: Metadata = {
 title: 'Heseos Support | Help with your smart home',
 description: 'Answers on Heseos switches, locks, lighting, fans and the Heseos app, plus installation, warranty and ways to reach our support team.',
};

const channels = [
 { icon: MessageCircle, title: 'Chat on WhatsApp', detail: WHATSAPP_DISPLAY, href: CONTACT.whatsapp },
 { icon: Mail, title: 'Email support', detail: CONTACT.email, href: `mailto:${CONTACT.email}` },
 { icon: CalendarCheck, title: 'Book a free demo', detail: 'See it in your space', href: '/demo' },
 { icon: Smartphone, title: 'Heseos app', detail: 'iPhone & Android', href: '/app' },
];

const popular = [
 { label: 'Installation', topic: 'getting-started' },
 { label: 'Alexa & Google Home', topic: 'app' },
 { label: 'Door locks', topic: 'security' },
 { label: 'Warranty', topic: 'warranty' },
];

const steps = [
 { title: 'Book a free demo', body: 'See Heseos working in your home, with a package that fits your rooms and wiring.' },
 { title: 'Choose your configuration', body: 'Request a quote and our team replies with pricing, availability and lead times.' },
 { title: 'Installed for you', body: 'Your devices are fitted, then set up and connected in the Heseos app.' },
 { title: 'Control it your way', body: 'Use the panel, your phone, or your voice through Google Home, Amazon Alexa and Apple Siri.' },
];

export default function SupportPage() {
 return <div className="support-page">
  <Reveal />
  <HelpCenter initialTopic={SUPPORT_TOPICS[0].id}>

   <section className="sp-hero" aria-labelledby="sp-hero-title">
    <Image className="sp-hero-image" src="/media/support/hero.webp" alt="" fill sizes="100vw" priority />
    <div className="sp-hero-shade" />
    <div className="sp-wrap sp-hero-content">
     <p className="sp-eyebrow"><span />Heseos Support</p>
     <h1 id="sp-hero-title">How can we<br />help you today?</h1>
     <p>Answers for your switches, locks, lighting, fans and the Heseos app, and a team that&apos;s a message away.</p>
     <HelpSearch id="sp-hero-search" placeholder="Search, e.g. warranty, Alexa, retrofit" />
     <div className="sp-popular"><span>Popular</span>{popular.map(p => <TopicButton key={p.label} topic={p.topic} className="sp-chip">{p.label}</TopicButton>)}</div>
    </div>
    <span className="sp-caption">Illustrative imagery</span>
   </section>

   <section className="sp-channels" aria-label="Ways to reach Heseos">
    <div className="sp-wrap sp-channels-grid">
     {channels.map(c => <SiteLink key={c.title} className="sp-channel" href={c.href}>
      <c.icon size={22} strokeWidth={1.6} aria-hidden="true" />
      <span><strong>{c.title}</strong><small>{c.detail}</small></span>
      <ArrowUpRight className="sp-channel-arrow" size={16} aria-hidden="true" />
     </SiteLink>)}
    </div>
   </section>

   <section className="sp-topics-section" aria-labelledby="sp-topics-title">
    <div className="sp-wrap">
     <div className="sp-section-head" data-reveal>
      <p className="sp-eyebrow">Browse by topic</p>
      <h2 id="sp-topics-title">Find your answer fast.</h2>
     </div>
     <div className="sp-topic-grid">
      {SUPPORT_TOPICS.map(t => { const Icon = SUPPORT_ICONS[t.icon]; return <TopicButton key={t.id} topic={t.id} className="sp-topic-card">
       <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
       <strong>{t.title}</strong>
       <span>{t.blurb}</span>
       <small>{t.answers.length} answers <ArrowRight size={14} aria-hidden="true" /></small>
      </TopicButton>; })}
     </div>
    </div>
   </section>

   <section className="sp-answers" id="answers" aria-labelledby="sp-answers-title">
    <div className="sp-wrap">
     <div className="sp-answers-head">
      <div><p className="sp-eyebrow">Help centre</p><h2 id="sp-answers-title">Answers for your connected home.</h2></div>
      <HelpSearch id="sp-answers-search" />
     </div>
     <AnswerBrowser topics={SUPPORT_TOPICS} contactHref={CONTACT.whatsapp} />
    </div>
   </section>

   <section className="sp-setup" aria-labelledby="sp-setup-title">
    <div className="sp-wrap sp-setup-grid">
     <figure className="sp-setup-photo" data-reveal>
      <Image src="/media/support/install.webp" alt="Illustrative image: a technician's hands fitting a black glass touch panel onto a wall switch box" fill sizes="(max-width: 800px) 100vw, 48vw" />
      <figcaption>Fitted and connected by our team · Illustrative</figcaption>
     </figure>
     <div className="sp-setup-copy" data-reveal>
      <p className="sp-eyebrow">From demo to daily use</p>
      <h2 id="sp-setup-title">Set up with experts,<br />start to finish.</h2>
      <ol className="sp-steps">{steps.map((s, i) => <li key={s.title}><span>0{i + 1}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}</ol>
      <SiteLink className="sp-btn" href="/demo">Book a free demo <ArrowRight size={16} aria-hidden="true" /></SiteLink>
     </div>
    </div>
   </section>

   <section className="sp-resources" aria-labelledby="sp-resources-title">
    <div className="sp-wrap">
     <div className="sp-section-head" data-reveal>
      <p className="sp-eyebrow">Guides & downloads</p>
      <h2 id="sp-resources-title">Guides, downloads and resources.</h2>
     </div>
     <div className="sp-resource-grid">
      <div className="sp-card sp-downloads" data-reveal>
       <h3>Product documents</h3>
       <ul>{SUPPORT_DOWNLOADS.map(d => <li key={d.label}><a href={d.href}>
        <FileText size={20} strokeWidth={1.6} aria-hidden="true" />
        <span><strong>{d.label}</strong><small>{d.type}{d.onRequest ? ' · Sent on request by email' : ''}</small></span>
        <ArrowUpRight size={16} aria-hidden="true" />
       </a></li>)}</ul>
      </div>
      <div className="sp-card sp-app-card" data-reveal>
       <img src="/apple-touch-icon.png" alt="" width={56} height={56} />
       <h3>Get the Heseos app</h3>
       <p>Add your devices, build scenes and stay informed, at home or away.</p>
       <div className="sp-stores">
        <a href={APPS.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download Heseos on the App Store (opens in a new tab)"><img src="/media/app/app-store.svg" width={120} height={40} alt="Download on the App Store" /></a>
        <a href={APPS.googlePlay} target="_blank" rel="noopener noreferrer" aria-label="Get Heseos on Google Play (opens in a new tab)"><img src="/media/app/google-play.png" width={646} height={250} alt="Get it on Google Play" /></a>
       </div>
      </div>
      <div className="sp-card sp-policies" data-reveal>
       <h3>Policies</h3>
       <ul>{LEGAL.map(l => <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer">{l.label}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul>
       <p>Published on heseos.com.</p>
      </div>
     </div>
    </div>
   </section>

   <section className="sp-cta" aria-labelledby="sp-cta-title">
    <Image className="sp-cta-image" src="/media/support/help.webp" alt="" fill sizes="100vw" />
    <div className="sp-cta-shade" />
    <div className="sp-wrap sp-cta-content" data-reveal>
     <div>
      <p className="sp-eyebrow">Still need help?</p>
      <h2 id="sp-cta-title">Our team is<br />a message away.</h2>
      <p>Tell us what you&apos;re working on, whether it&apos;s a question about a device or planning a new home.</p>
     </div>
     <div className="sp-cta-actions">
      <a className="sp-btn" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" />Chat on WhatsApp</a>
      <a className="sp-btn sp-btn-outline" href={`mailto:${CONTACT.email}`}><Mail size={17} aria-hidden="true" />{CONTACT.email}</a>
     </div>
    </div>
    <span className="sp-caption">Illustrative imagery</span>
   </section>

   <section className="section light sp-contact" id="contact" aria-labelledby="contact-title"><div className="section-head"><h2 className="title" id="contact-title">Send us a message.</h2><p className="lead">Tell us how we can help. Our team will get back to you.</p></div><ContactForm type="support" button="Send support request"/></section>
  </HelpCenter>
 </div>;
}
