import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BadgeIndianRupee, Box, CheckCheck, FileText, Image as ImageIcon, Landmark, Link2, MessageCircle, Package, Plus, QrCode } from 'lucide-react';
import { APPS, CONTACT } from '../../../lib/site';
import { CLIENTS, PARTNERS } from '../../../lib/home';
import { PARTNER_FAQ, PARTNER_STATS } from '../../../lib/partners';
import Reveal from '../../components/home/Reveal';
import ScrollScenes from '../../components/catalog/ScrollScenes';
import Odometer from '../../components/partners/Odometer';
import PartnerForm from '../../components/partners/PartnerForm';
import AppStory, { type StoryBeat } from '../../components/partners/AppStory';
import PayoutEstimator from '../../components/app/PayoutEstimator';
import { InstallerCoverage, InstallerEarnings, InstallerJob, InstallerJobs, InstallerTraining, PartnerHome, PartnerLead, PartnerLeads, PartnerRewards, PartnerSignup, PartnerSubmitted, Phone } from '../../components/app/AppScreens';
import './partners.css';

export const metadata: Metadata = {
  title: 'Partner with Heseos | The Heseos Partner and Installer apps',
  description: 'Bring homes with the Heseos Partner app and earn commission on every converted sale, or install them with the Heseos Installer app and earn a fee for every job. Dealers, designers, builders and electricians welcome.',
  openGraph: {
    title: 'Partner with Heseos',
    description: 'Two apps. One network. Bring a home with Heseos Partner, install it with Heseos Installer, and earn on both.',
    type: 'website',
  },
};

// The page tells one home's story through the two apps that make it: a partner brings the lead (chapter 01), the
// converted lead becomes an installation job (the handoff), and an installer claims and finishes it (chapter 02).
// Screens are the coded app mock-ups from /app; photos are generated and illustrative (public/media/partners/SOURCES.md).
const PARTNER_BEATS: StoryBeat[] = [
  { time: 'Day 1 · 10:00', title: 'Sign up in a minute', body: 'Name, mobile number and pincode. Dealers, architects, interior designers, builders and electricians are all welcome.', screen: <PartnerSignup/>, scene: '/media/partners/partner-desk.webp' },
  { time: 'Day 1 · 10:02', title: 'Your sales kit opens', body: 'This month’s payout, your lead counts, the catalogue, your QR code, posters and the brochure, all on one home screen.', screen: <PartnerHome/>, scene: '/media/partners/partner-desk.webp' },
  { time: 'Day 4 · 12:40', title: 'A customer asks about smart switches', body: 'At the showroom counter or on a site visit, punch them in: customer details, what they need, then review and submit.', screen: <PartnerLead/>, scene: '/media/partners/partner-showroom.webp' },
  { time: 'Day 4 · 12:42', title: 'A Lead ID, instantly', body: 'Heseos verifies the lead, calls the customer, plans the home and shares a quote. You get an update every time it moves.', screen: <PartnerSubmitted/>, scene: '/media/partners/partner-showroom.webp' },
  { time: 'Week 2', title: 'Track it to Converted', body: 'Every lead sits in New, In Progress or Converted, so you always know where it stands, without a single follow-up call.', screen: <PartnerLeads/>, scene: '/media/partners/partner-evening.webp' },
  { time: 'Month end', title: 'Paid on the sale', body: 'Commission on the converted sale value, worked out by slab and paid to your bank.', screen: <PartnerRewards/>, scene: '/media/partners/partner-evening.webp' },
];
const INSTALLER_BEATS: StoryBeat[] = [
  { time: 'Once', title: 'Set your coverage', body: 'Tell us the area you work in. Installation jobs there come to you, and only there.', screen: <InstallerCoverage/>, scene: '/media/partners/installer-ride.webp' },
  { time: '08:15', title: 'A job drops in', body: 'New installations appear in Available the moment Heseos schedules them. See the devices, the time and the fee. First to claim gets it.', screen: <InstallerJobs/>, scene: '/media/partners/installer-ride.webp' },
  { time: '08:40', title: 'Learn before you go', body: 'Short videos for every device: touch panels, smart plugs, IR blasters and door locks. Arrive ready.', screen: <InstallerTraining/>, scene: '/media/app/installer-hands.webp' },
  { time: '11:30', title: 'Install and hand over', body: 'Fit the devices, pair them with the homeowner’s Heseos app and mark the job complete.', screen: <InstallerJob/>, scene: '/media/partners/installer-handover.webp' },
  { time: '18:00', title: 'Paid per job', body: 'Your installation fee waits in Earnings until payout, with every job logged.', screen: <InstallerEarnings/>, scene: '/media/partners/installer-handover.webp' },
];
const SALES_KIT = [
  { icon: Package, title: 'Browse Catalogue', body: 'Products, photos and pricing to show a customer from your phone.' },
  { icon: QrCode, title: 'My QR', body: 'Your personal code for a customer to scan on the spot.' },
  { icon: Link2, title: 'Referral link', body: 'Share it anywhere and earn when a lead converts.' },
  { icon: ImageIcon, title: 'Marketing Studio', body: 'Posters with your name and link, ready for WhatsApp Status.' },
  { icon: FileText, title: 'Heseos Brochure', body: 'Share the product brochure on WhatsApp in a tap.' },
  { icon: Landmark, title: 'Bank & payouts', body: 'Add your bank once and see every payout logged.' },
];
// The handoff map: four stops (viewBox 1600×900, kept to the right of the captions) joined by three curves. Each curve draws during its quarter of the
// section's scroll, and data-step (from ScrollScenes) lights the stop it reaches and shows that stop's caption.
const STOPS = [
  { x: 760, y: 700, app: 'partner', label: 'Partner', note: 'Lead converted', title: 'The customer says yes.', body: 'The partner’s lead turns Converted in the Partner app, and their commission is on its way.' },
  { x: 1000, y: 480, app: 'heseos', label: 'Heseos', note: 'Installation planned', title: 'Heseos plans the install.', body: 'Our team confirms the devices and schedules the installation for that home.' },
  { x: 1230, y: 640, app: 'installer', label: 'Installer', note: 'Job claimed · 4.2 km', title: 'A job drops in nearby.', body: 'It appears for every installer covering that area. The first to claim it gets the job.' },
  { x: 1450, y: 360, app: 'home', label: 'Home', note: 'Handed over', title: 'The home comes alive.', body: 'Devices fitted, paired with the homeowner’s Heseos app and handed over. The installer earns their fee.' },
];
const ROUTE = ['M760 700C850 690 900 480 1000 480', 'M1000 480C1100 480 1120 640 1230 640', 'M1230 640C1350 640 1360 380 1450 360'];

const statSize = (v: string) => Number(v.replace(/\D/g, ''));
const heroStat = PARTNER_STATS.reduce((a, b) => (statSize(b.value) > statSize(a.value) ? b : a));
const otherStats = PARTNER_STATS.filter((s) => s !== heroStat);

function StoreBadges({ name, links }: { name: string; links: { appStore: string; googlePlay: string } }) {
  return <div className="ph-badges">
    <a href={links.appStore} target="_blank" rel="noopener noreferrer" aria-label={`Download ${name} on the App Store (opens in a new tab)`}><img src="/media/app/app-store.svg" width={120} height={40} alt="Download on the App Store"/></a>
    <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" aria-label={`Get ${name} on Google Play (opens in a new tab)`}><img src="/media/app/google-play-badge.png" width={564} height={168} alt="Get it on Google Play"/></a>
  </div>;
}

export default function PartnersPage() {
  return <div className="pt-page">
    <Reveal/>
    <ScrollScenes/>

    {/* Hero: the unfinished apartment both apps work toward, with the two apps rising in beside the headline. */}
    <section className="ph-hero" data-scroll="view" aria-labelledby="ph-title">
      <Image className="ph-hero-bg" src="/media/partners/hero.webp" alt="" fill priority sizes="100vw"/>
      <div className="pt-wrap ph-hero-grid">
        <div className="ph-hero-copy">
          <p className="pt-eyebrow"><span/>Heseos partner programme</p>
          <h1 id="ph-title"><span>Two apps.</span> <span>One network.</span> <em>Your income.</em></h1>
          <p className="ph-hero-lede">Bring a home with the <b>Heseos Partner</b> app and earn on the sale. Install it with the <b>Heseos Installer</b> app and earn on the job. Heseos handles everything in between.</p>
          <div className="ph-hero-actions">
            <a className="pt-button" href="#apply">Apply to partner <ArrowRight size={17} aria-hidden="true"/></a>
            <a className="pt-button pt-button-ghost" href="#paths">See how it works</a>
          </div>
        </div>
        <div className="ph-hero-phones">
          <div className="ph-hp ph-hp-partner">
            <Phone label="Heseos Partner app, illustrative home screen"><div className="wa-scr on"><PartnerHome/></div></Phone>
            <div className="ph-chip" aria-hidden="true"><span className="ph-chip-ico"><CheckCheck size={15}/></span><span><small>Lead L2048 3177</small><strong>Converted · +₹51,000</strong></span></div>
          </div>
          <div className="ph-hp ph-hp-installer">
            <Phone label="Heseos Installer app, illustrative jobs screen"><div className="wa-scr on"><InstallerJobs/></div></Phone>
            <div className="ph-chip ph-chip-in" aria-hidden="true"><span className="ph-chip-ico"><Box size={15}/></span><span><small>New job · 4.2 km</small><strong>3 BHK · Baner · Claim</strong></span></div>
          </div>
        </div>
      </div>
      <a className="ph-cue" href="#paths"><i aria-hidden="true"/>Scroll the story</a>
    </section>

    {/* Two ways in: each card opens its app's chapter. */}
    <section className="ph-paths" id="paths" aria-labelledby="ph-paths-title">
      <div className="pt-wrap">
        <div className="ph-head" data-reveal>
          <p className="pt-eyebrow"><span/>Two ways in</p>
          <h2 id="ph-paths-title" className="pt-title">Which side of the<br/>home are you on?</h2>
        </div>
        <div className="ph-paths-grid">
          <a className="ph-path" href="#partner-app" data-reveal>
            <Image src="/media/app/partner-studio.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw"/>
            <span className="ph-path-body">
              <img src="/media/app/icons/partner.png" alt="" width={56} height={56}/>
              <small>Heseos Partner</small>
              <strong>I bring homes.</strong>
              <span>Dealers, architects, interior designers, builders and electricians who meet people building or doing up a home.</span>
              <em><BadgeIndianRupee size={16} aria-hidden="true"/>Commission on every converted sale</em>
              <b>Follow the Partner story <ArrowRight size={16} aria-hidden="true"/></b>
            </span>
          </a>
          <a className="ph-path ph-path-in" href="#installer-app" data-reveal>
            <Image src="/media/app/installer-site.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw"/>
            <span className="ph-path-body">
              <img src="/media/app/icons/installer.png" alt="" width={56} height={56}/>
              <small>Heseos Installer</small>
              <strong>I install homes.</strong>
              <span>Electricians, technicians and installation teams who want steady smart-home work in their own city.</span>
              <em><Box size={16} aria-hidden="true"/>A fee for every installation</em>
              <b>Follow the Installer story <ArrowRight size={16} aria-hidden="true"/></b>
            </span>
          </a>
        </div>
      </div>
    </section>

    {/* Chapter 01: one lead, from the designer's desk to the payout. */}
    <section className="ph-chapter" id="partner-app" aria-labelledby="ph-partner-title">
      <header className="pt-wrap ph-chapter-head" data-reveal>
        <div className="ph-app-id"><img src="/media/app/icons/partner.png" alt="" width={60} height={60}/><span><small>Chapter 01 · For people who bring homes</small><strong>Heseos Partner</strong></span></div>
        <h2 id="ph-partner-title">Bring a home. <em>Earn on every sale.</em></h2>
        <p>Follow one lead from a designer’s desk to a payout. As you scroll, the phone shows what the Partner app does at each moment.</p>
      </header>
      <AppStory app="Heseos Partner" beats={PARTNER_BEATS}/>
      <div className="pt-wrap">
        <div className="ph-sub" data-reveal><h3>Your sales kit, in your pocket.</h3><p>The Partner app doubles as everything you need to sell.</p></div>
        <ul className="ph-kit">{SALES_KIT.map(({ icon: Icon, title, body }, i) => <li key={title} data-reveal style={{ '--i': i } as CSSProperties}><span><Icon size={20} aria-hidden="true"/></span><h4>{title}</h4><p>{body}</p></li>)}</ul>
        <div className="ph-earn" data-reveal>
          <div className="ph-earn-copy">
            <p className="pt-eyebrow"><span/>Payout slabs</p>
            <h3>Keep selling. <em>It always adds up.</em></h3>
            <p>Commission works like income-tax slabs: each rate applies only to the slice of the month’s converted sale value in its range. Crossing into a new slab never lowers what you have already earned.</p>
          </div>
          <PayoutEstimator/>
        </div>
      </div>
    </section>

    {/* The handoff: the converted lead travels across the city and becomes an installer's job (pinned for 300vh). */}
    <section className="ho" data-scroll="pin" data-steps={STOPS.length} aria-labelledby="ho-title">
      <div className="ho-stage">
        <Image className="ho-bg" src="/media/partners/handoff-city.webp" alt="" fill sizes="100vw"/>
        <svg className="ho-map" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {ROUTE.map((d, i) => <g key={d} className="ho-seg" style={{ '--k': i } as CSSProperties}>
            <path className="ho-base" d={d} pathLength={1}/>
            <path className="ho-lit" d={d} pathLength={1}/>
            <path className="ho-flow" d={d} pathLength={1}/>
          </g>)}
          {STOPS.map((s, i) => <g key={s.label} className={`ho-stop ho-${s.app}`} data-i={i} transform={`translate(${s.x} ${s.y})`}>
            <circle className="ho-pulse" r="34"/>
            <circle className="ho-ring" r="20"/>
            <circle className="ho-core" r="8"/>
            <text className="ho-label" y={i === 3 ? -48 : 64}>{s.label}</text>
            <text className="ho-note" y={i === 3 ? -80 : 96}>{s.note}</text>
          </g>)}
        </svg>
        <div className="ho-copy pt-wrap">
          <p className="pt-eyebrow"><span/>The handoff</p>
          <h2 id="ho-title">The moment a lead converts, <em>a job is born.</em></h2>
          <ol className="ho-steps">
            {STOPS.map((s, i) => <li key={s.label} data-i={i} className={`ho-${s.app}`}>
              <span>{String(i + 1).padStart(2, '0')} · {s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>)}
          </ol>
        </div>
      </div>
    </section>

    {/* Chapter 02: one installer's day, from the job dropping in to the payout. */}
    <section className="ph-chapter ph-chapter-in" id="installer-app" aria-labelledby="ph-installer-title">
      <header className="pt-wrap ph-chapter-head" data-reveal>
        <div className="ph-app-id"><img src="/media/app/icons/installer.png" alt="" width={60} height={60}/><span><small>Chapter 02 · For the hands that install</small><strong>Heseos Installer</strong></span></div>
        <h2 id="ph-installer-title">Jobs come to you. <em>Install, earn, repeat.</em></h2>
        <p>Think of a delivery-partner app, built for smart homes. Follow one installer’s day, from the job dropping in to the fee landing.</p>
      </header>
      <AppStory app="Heseos Installer" beats={INSTALLER_BEATS}/>
      <div className="pt-wrap">
        <div className="ph-sub" data-reveal><h3>Your whole day in three tabs.</h3><p>Every job you can take, are doing, or have done.</p></div>
        <div className="ph-tabs">
          <article data-reveal style={{ '--i': 0 } as CSSProperties}><span>Available</span><p>Installations in your area no one has claimed yet. Tap one, see the devices, the time and the fee, and claim it.</p></article>
          <article data-reveal style={{ '--i': 1 } as CSSProperties}><span>My jobs</span><p>What you have claimed and where to be. Work through the job and mark it complete at handover.</p></article>
          <article data-reveal style={{ '--i': 2 } as CSSProperties}><span>Completed</span><p>Every installation you have finished, with the fee it earned and whether it has been paid.</p></article>
        </div>
        <div className="ph-refer" data-reveal><Link2 size={22} aria-hidden="true"/><p><strong>Installers can refer too.</strong> You carry a referral link and QR code just like a partner. Meet a homeowner who wants Heseos? Punch the lead from the + button and earn referral rewards when it converts.</p></div>
      </div>
    </section>

    {/* Both apps, side by side, with their store links. */}
    <section className="ph-get" id="download" aria-labelledby="ph-get-title">
      <div className="pt-wrap">
        <div className="ph-head ph-head-center" data-reveal>
          <p className="pt-eyebrow"><span/>Get the apps</p>
          <h2 id="ph-get-title" className="pt-title">Pick your app. <em>Start this week.</em></h2>
        </div>
        <div className="ph-get-grid">
          <article className="ph-get-card" data-reveal>
            <img src="/media/app/icons/partner.png" alt="" width={72} height={72}/>
            <h3>Heseos Partner</h3>
            <p>For dealers, architects, interior designers, builders and electricians who bring homes to Heseos.</p>
            <ul><li>Punch a lead in three steps</li><li>Track every lead to Converted</li><li>Commission by slab, paid to your bank</li></ul>
            <StoreBadges name="Heseos Partner" links={APPS.partner}/>
          </article>
          <article className="ph-get-card ph-get-in" data-reveal>
            <img src="/media/app/icons/installer.png" alt="" width={72} height={72}/>
            <h3>Heseos Installer</h3>
            <p>For electricians and technicians who want steady installation work in their city.</p>
            <ul><li>Jobs in the area you choose</li><li>A training video for every device</li><li>A fee for every job, logged in Earnings</li></ul>
            <StoreBadges name="Heseos Installer" links={APPS.installer}/>
          </article>
        </div>
      </div>
    </section>

    {/* The figures as mechanical counters: the largest gets the big counter under the heading, the rest are read off a list beside it. */}
    <section className="pt-section pt-figures" aria-labelledby="pt-figures-title">
      <div className="pt-wrap pt-figures-grid">
        <div className="pt-figures-main" data-reveal>
          <p className="pt-eyebrow"><span/>By the numbers</p>
          <h2 id="pt-figures-title" className="pt-title">Numbers your clients<br/>will ask about.</h2>
          <p className="pt-lede">When a homeowner asks how long Heseos has been around, this is your answer.</p>
          <Odometer value={heroStat.value} label={heroStat.label} variant="hero"/>
        </div>
        <div className="pt-figures-list">
          {otherStats.map((s, i) => <Odometer key={s.label} value={s.value} label={s.label} variant="row" delay={250 + i * 180}/>)}
        </div>
      </div>
    </section>

    <section className="pt-trust" aria-labelledby="pt-trust-title">
      <div className="pt-wrap pt-trust-head">
        <h2 id="pt-trust-title">In good company</h2>
        <div className="pt-exclusive"><span>Exclusive partners</span>{PARTNERS.map((p) => <Image key={p.name} src={p.logo} alt={p.name} width={224} height={94} sizes="150px"/>)}</div>
      </div>
      <div className="pt-marquee">
        <div className="pt-marquee-track">
          {[0, 1].map((copy) => <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy === 0 ? 'Heseos clients' : undefined}>
            {CLIENTS.map((c) => <li key={c.name}><Image src={c.logo} alt={copy === 0 ? c.name : ''} width={312} height={102} sizes="140px"/></li>)}
          </ul>)}
        </div>
      </div>
    </section>

    <section className="pt-section pt-faq" aria-labelledby="pt-faq-title">
      <div className="pt-wrap pt-faq-grid">
        <div data-reveal>
          <p className="pt-eyebrow"><span/>Questions</p>
          <h2 id="pt-faq-title" className="pt-title">Good to know.</h2>
          <p className="pt-lede">Something else on your mind? Our team is a message away.</p>
          <a className="pt-text-link" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true"/> Chat on WhatsApp</a>
        </div>
        <div className="pt-faq-list">
          {PARTNER_FAQ.map((f) => <details key={f.q}><summary>{f.q}<Plus size={18} aria-hidden="true"/></summary><p>{f.a}</p></details>)}
        </div>
      </div>
    </section>

    <section className="pt-apply" id="apply" aria-labelledby="pt-apply-title">
      <Image className="pt-apply-image" src="/media/partners/lit.webp" alt="" fill sizes="100vw"/>
      <div className="pt-wrap pt-apply-grid">
        <div className="pt-apply-copy">
          <p className="pt-eyebrow"><span/>Apply</p>
          <h2 id="pt-apply-title">Let&apos;s build<br/>something smart.</h2>
          <p>Tell us about your business. Our partnerships team reviews every application and will reach out to plan the next step together.</p>
          <ul>
            <li><span>Free</span>to apply, no obligation</li>
            <li><span>2 min</span>to complete the form</li>
            <li><span>2 apps</span>to bring homes and install them</li>
          </ul>
          <div className="pt-apply-contact">
            <a href={`mailto:${CONTACT.email}?subject=Heseos%20partnership`}>{CONTACT.email}</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={14} aria-hidden="true"/></a>
          </div>
        </div>
        <div className="pt-form-card">
          <h3>Partner application</h3>
          <PartnerForm/>
        </div>
      </div>
    </section>
  </div>;
}
