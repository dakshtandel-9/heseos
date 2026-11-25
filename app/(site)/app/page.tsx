import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, BadgeIndianRupee, BellRing, Box, ChartNoAxesColumn, CheckCheck, FileText, Gauge, House, Image as ImageIcon, Landmark, LayoutGrid, Link2, LockKeyhole, MapPin, Mic2, Package, PlugZap, QrCode, RefreshCw, ShieldCheck, Sparkles, Timer, Wallet, Wrench } from 'lucide-react';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import { APPS, CONTACT } from '../../../lib/site';
import AppExperience from '../../components/app/AppExperience';
import SceneExamples from '../../components/app/SceneExamples';
import AppsHero from '../../components/app/AppsHero';
import AppsNav from '../../components/app/AppsNav';
import AppTour from '../../components/app/AppTour';
import PayoutEstimator from '../../components/app/PayoutEstimator';
import { InstallerCoverage, InstallerEarnings, InstallerJob, InstallerJobs, InstallerTraining, PartnerHome, PartnerLead, PartnerLeads, PartnerRewards, PartnerSignup, PartnerSubmitted } from '../../components/app/AppScreens';
import '../apps-suite.css';

export const metadata: Metadata = {
 title: 'Heseos apps | For homeowners, partners and installers',
 description: 'Three Heseos apps: the Heseos app to control your home, Heseos Partner to refer homes and earn commission, and Heseos Installer to claim and complete installation jobs.',
};
const PHONE = '/media/products/app-phone.webp';

// The flow that ties the three apps together, read left to right. `app` sets the colour and label of each stop.
const FLOW = [
 { app: 'partner', tag: 'Partner app', title: 'A partner punches a lead', body: 'A designer, dealer or electrician adds the customer in three short steps.' },
 { app: 'heseos', tag: 'Heseos team', title: 'Heseos verifies & plans', body: 'We call the customer, plan the home and share a quote.' },
 { app: 'customer', tag: 'Customer', title: 'The customer says yes', body: 'The lead turns Converted.', earn: 'Partner earns commission' },
 { app: 'installer', tag: 'Installer app', title: 'An installer claims the job', body: 'It appears for installers in that city — first to claim gets it.' },
 { app: 'installer', tag: 'Installer app', title: 'Installed & handed over', body: 'Devices fitted and paired with the customer’s app.', earn: 'Installer earns a fee' },
 { app: 'customer', tag: 'Heseos app', title: 'The home comes alive', body: 'Every device, scene and alert in one app.' },
];

const PARTNER_STEPS = [
 { title: 'Sign up in a minute', body: 'Name, mobile number and pincode. Dealers, architects, designers, builders and electricians are all welcome.', screen: <PartnerSignup/> },
 { title: 'Your lead dashboard', body: 'This month’s payout, your lead counts and every sales tool on one home screen.', screen: <PartnerHome/> },
 { title: 'Punch a lead in three steps', body: 'Customer details, then what they need — property, configuration, budget, timeline — then review and submit.', screen: <PartnerLead/> },
 { title: 'Get a Lead ID instantly', body: 'Heseos verifies the lead and connects with the customer. You get updates as it moves.', screen: <PartnerSubmitted/> },
 { title: 'Track it to Converted', body: 'Every lead sits in New, In Progress or Converted, so you always know where it stands.', screen: <PartnerLeads/> },
 { title: 'Get paid on the sale', body: 'Commission on the converted sale value, worked out by slab and paid to your bank.', screen: <PartnerRewards/> },
];
const INSTALLER_STEPS = [
 { title: 'Set your coverage', body: 'Tell us the area you work in. Installation jobs there come to you.', screen: <InstallerCoverage/> },
 { title: 'A job drops in', body: 'New installations appear in Available as soon as Heseos schedules them. First to claim gets the job.', screen: <InstallerJobs/> },
 { title: 'Learn before you go', body: 'Short videos for every device: touch panels, smart plugs, IR blasters and door locks.', screen: <InstallerTraining/> },
 { title: 'Install & hand over', body: 'Fit the devices, pair them with the customer’s Heseos app and mark the job complete.', screen: <InstallerJob/> },
 { title: 'Get paid per job', body: 'Your installation fee waits in Earnings until payout, with the full history logged.', screen: <InstallerEarnings/> },
];
const PARTNER_TOOLS = [
 { icon: Package, title: 'Browse Catalogue', body: 'Products, photos and pricing — show a customer right from your phone.' },
 { icon: QrCode, title: 'My QR', body: 'Show your personal QR code so a customer can scan it on the spot.' },
 { icon: Link2, title: 'Referral link', body: 'Share it anywhere and earn when a lead converts.' },
 { icon: ImageIcon, title: 'Marketing Studio', body: 'Posters with your name and referral link, ready for WhatsApp Status.' },
 { icon: FileText, title: 'Heseos Brochure', body: 'Share the product brochure on WhatsApp, or keep a copy for yourself.' },
 { icon: Landmark, title: 'Bank & payouts', body: 'Add your bank details once and see every payout logged.' },
];
const COMPARE = [
 ['Made for', 'Homeowners and families', 'Dealers, architects, interior designers, builders and electricians', 'Electricians and technicians'],
 ['You use it to', 'Control devices, run scenes, get alerts and check energy use', 'Punch leads, share the catalogue and posters, track every lead', 'Claim installation jobs nearby, install and hand over'],
 ['What you get', 'A connected, comfortable, safer home', 'Commission on converted sales — 15% / 10% / 8% slabs', 'A fee for every installation, plus referral rewards'],
 ['Getting started', 'Download free on iOS and Android', 'Apply, then sign up with your mobile number and pincode', 'Apply as an installation partner and set your coverage'],
];

function ActionLinks({ compact = false }: { compact?: boolean }) {
 return <div className={`app-actions${compact ? ' app-actions-compact' : ''}`}>
  <SiteLink className="app-primary" href="/demo">Book a Free Demo <ArrowRight size={17} aria-hidden="true"/></SiteLink>
  <SiteLink className="app-text-link" href="#download">Download the App <ArrowRight size={16} aria-hidden="true"/></SiteLink>
 </div>;
}
function StoreBadges({ name, links }: { name: string; links: { appStore: string; googlePlay: string } }) {
 return <div className="wa-badges">
  <a href={links.appStore} target="_blank" rel="noopener noreferrer" aria-label={`Download ${name} on the App Store (opens in a new tab)`}><img src="/media/app/app-store.svg" width={120} height={40} alt="Download on the App Store"/></a>
  <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" aria-label={`Get ${name} on Google Play (opens in a new tab)`}><img src="/media/app/google-play-badge.png" width={564} height={168} alt="Get it on Google Play"/></a>
 </div>;
}
function Chapter({ n, icon, app, title, lead, who }: { n: string; icon: string; app: string; title: ReactNode; lead: string; who: string[] }) {
 return <header className="wa-chapter-head" data-reveal>
  <div className="wa-chapter-id"><img src={`/media/app/icons/${icon}.png`} alt="" width={64} height={64}/><span><small>{n}</small><strong>{app}</strong></span></div>
  <h2>{title}</h2>
  <p>{lead}</p>
  <ul className="wa-who" aria-label="Who it is for">{who.map((w) => <li key={w}>{w}</li>)}</ul>
 </header>;
}

export default function AppPage() {
 return <div className="app-page wa-page">
  <Reveal/>
  <AppsHero/>
  <AppsNav/>

  {/* How the three apps connect: one home's journey from a partner's lead to a working, connected home. */}
  <section className="wa-how" id="how" aria-labelledby="wa-how-title">
   <div className="wa-wrap">
    <div className="wa-sec-head" data-reveal><p className="wa-kicker">How it connects</p><h2 id="wa-how-title">One home. <em>Three apps.</em> One journey.</h2><p>Follow a single home from the first conversation to the first “Hey, lights on”. Each app hands off to the next.</p></div>
    <ol className="wa-flow" data-reveal>
     {FLOW.map((s, n) => <li key={s.title} className={`wa-f-${s.app}`} style={{ '--i': n } as CSSProperties}>
      <span className="wa-node" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
      <small>{s.tag}</small><strong>{s.title}</strong><p>{s.body}</p>
      {s.earn && <span className="wa-earn"><BadgeIndianRupee size={14} aria-hidden="true"/>{s.earn}</span>}
     </li>)}
     <span className="wa-flow-track" aria-hidden="true"><i/><b/></span>
    </ol>
    <div className="wa-legend" aria-hidden="true"><span className="wa-f-partner">Heseos Partner</span><span className="wa-f-installer">Heseos Installer</span><span className="wa-f-customer">Heseos app</span></div>
   </div>
  </section>

  {/* 01 — the homeowner app (existing content). */}
  <div id="customer" className="wa-customer">
   <section className="app-hero" aria-labelledby="app-hero-title">
    <div className="app-hero-inner">
     <div className="app-hero-copy" data-reveal>
      <div className="wa-chapter-id wa-chapter-id-light"><img src="/media/app/icons/customer.png" alt="" width={64} height={64}/><span><small>01 · For homeowners</small><strong>Heseos</strong></span></div>
      <h2 id="app-hero-title" className="wa-cust-title">Your home in<br/>your pocket.</h2>
      <p className="app-hero-lead">Control your home&apos;s appliances from your phone. Turn devices on or off, create scenes, check usage, and stay in control — at home or away.</p>
      <ActionLinks/>
     </div>
     <div className="app-hero-visual"><img src={PHONE} width={801} height={1134} alt="A hand holding a phone displaying the genuine Heseos living-room app screen" loading="lazy"/></div>
    </div>
   </section>
   <section className="app-benefits" aria-label="Heseos app benefits">
    <div className="app-benefits-inner">
     <div><House size={27} strokeWidth={1.5} aria-hidden="true"/><span><strong>One connected home</strong><small>Control by room</small></span></div>
     <div><PlugZap size={27} strokeWidth={1.5} aria-hidden="true"/><span><strong>iOS &amp; Android</strong><small>Available on both platforms</small></span></div>
     <div><ShieldCheck size={27} strokeWidth={1.5} aria-hidden="true"/><span><strong>Stay informed</strong><small>Supported device alerts</small></span></div>
     <div><Mic2 size={27} strokeWidth={1.5} aria-hidden="true"/><span><strong>Voice control</strong><small>Compatible assistants</small></span></div>
    </div>
   </section>
   <section className="app-features" aria-labelledby="app-features-title">
    <div className="app-section-wrap">
     <div className="app-section-intro" data-reveal><p className="app-kicker">The Heseos app</p><h2 id="app-features-title">Your whole home. One app.</h2><p>Total control, greater insight, and a more personal home experience — all in one app.</p></div>
     <div className="app-feature-grid">
      <article className="app-feature-card app-feature-device"><LayoutGrid className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Every device,<br/>one app.</h3><p>Switches, panels, plugs and remotes, organised by room.</p><img src={PHONE} width={801} height={1134} loading="lazy" alt="Genuine Heseos app device controls"/></article>
      <article className="app-feature-card app-feature-power"><Gauge className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Power at<br/>a glance.</h3><p>Understand usage and stay informed about your connected devices.</p><div className="app-power-chart" role="img" aria-label="Illustrative trend chart for device power usage"><span>Power usage <small>Illustrative</small></span><svg viewBox="0 0 340 122" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="app-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#f86c28" stopOpacity=".37"/><stop offset="1" stopColor="#f86c28" stopOpacity="0"/></linearGradient></defs><path d="M0 108 C40 108 38 96 74 98 S126 101 154 76 S201 82 229 54 S287 75 340 25 V122 H0Z" fill="url(#app-chart-fill)"/><path d="M0 108 C40 108 38 96 74 98 S126 101 154 76 S201 82 229 54 S287 75 340 25" fill="none" stroke="#ff9a4b" strokeWidth="2"/></svg><div className="app-chart-axis"><span>Morning</span><span>Afternoon</span><span>Evening</span></div></div></article>
      <article className="app-feature-card app-feature-scenes"><Sparkles className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Scenes for the<br/>way you live.</h3><p>Bring connected devices together in a scene and activate them with one tap.</p><SceneExamples/></article>
      <article className="app-feature-card app-feature-voice"><Mic2 className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Works with<br/>your assistant.</h3><p>Control supported devices through compatible voice assistants.</p><div className="app-voice-art" aria-hidden="true">{[22,42,70,96,58,32,18,45,81,54,30,16,34,62,40,20].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><span className="app-card-note">Siri · Alexa · Google Assistant</span></article>
      <article className="app-feature-card app-feature-security"><div className="app-feature-photo" style={{backgroundImage:'url(/media/app/smart-living.webp)'}}/><div className="app-feature-content"><BellRing className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Security alerts<br/>in real time.</h3><p>Stay informed about supported security events and device activity.</p></div><div className="app-mini-notification"><span className="app-mini-mark">⌂</span><span><strong>Heseos</strong><small>Example alert · Front door locked</small></span></div></article>
      <article className="app-feature-card app-feature-remote"><div className="app-feature-photo" style={{backgroundImage:'url(/media/app/remote-access.webp)'}}/><div className="app-feature-content"><RefreshCw className="app-feature-icon" size={27} strokeWidth={1.7} aria-hidden="true"/><h3>Remote access<br/>from anywhere.</h3><p>Check your connected home and manage supported devices while you&apos;re away.</p></div></article>
     </div>
    </div>
   </section>
   <AppExperience/>
   <section className="app-living" aria-labelledby="app-living-title"><div className="app-living-photo"/><div className="app-living-inner"><div className="app-living-copy"><p className="app-kicker">Smart living, everyday</p><h2 id="app-living-title">A more comfortable, secure, and effortless home.</h2><p>From a cosy movie night to peace of mind when you&apos;re away, the Heseos app fits seamlessly into the way you live.</p><div className="app-living-benefits"><div><House size={22} aria-hidden="true"/><strong>More comfort</strong><small>Set the right atmosphere, instantly.</small></div><div><LockKeyhole size={22} aria-hidden="true"/><strong>Greater peace of mind</strong><small>Keep your home close, wherever you are.</small></div><div><ChartNoAxesColumn size={22} aria-hidden="true"/><strong>More efficient living</strong><small>Understand use and make smarter choices.</small></div></div></div><div className="app-living-notices" aria-label="Illustrative Heseos app notifications"><div><span className="app-mini-mark">⌂</span><span><strong>Heseos <em>Example</em></strong><small>Movie scene activated</small></span></div><div><span className="app-mini-mark">⌂</span><span><strong>Heseos <em>Example</em></strong><small>Front door locked</small></span></div></div></div></section>
  </div>

  {/* 02 — Heseos Partner. */}
  <section id="partner" className="wa-chapter wa-partner" aria-labelledby="wa-partner-title">
   <div className="wa-wrap">
    <Chapter n="02 · For people who bring homes" icon="partner" app="Heseos Partner" who={['Dealers', 'Architects', 'Interior designers', 'Builders', 'Electricians']}
     title={<span id="wa-partner-title">Bring a home. <em>Earn on every sale.</em></span>}
     lead="Know someone building or doing up a home? Punch them in as a lead in under a minute. Heseos takes it from there — the call, the plan, the demo — and you earn a slab-based commission when the sale converts."/>
    <div className="wa-photos" data-reveal>
     <figure className="wa-photo-main"><img src="/media/app/partner-studio.webp" width={1600} height={1063} loading="lazy" alt="A designer shows a phone to a homeowner couple over floor plans, material swatches and a glass touch panel sample"/>
      <div className="wa-float wa-float-lead" aria-hidden="true"><span className="wa-float-ico"><CheckCheck size={16}/></span><span><small>Lead L2048 3177</small><strong>Converted · ₹3,40,000 sale</strong></span><b>+₹51,000</b></div>
     </figure>
     <figure className="wa-photo-side"><img src="/media/app/partner-site.webp" width={1600} height={1063} loading="lazy" alt="An architect points homeowners to a glass touch panel mounted at a villa site"/><figcaption>Architects bring Heseos into the plan at the site visit.</figcaption></figure>
    </div>
    <AppTour app="Heseos Partner" steps={PARTNER_STEPS}/>
    <div className="wa-sub-head" data-reveal><h3>Everything you need to sell, in your pocket.</h3><p>The Partner app doubles as your sales kit.</p></div>
    <div className="wa-tools">{PARTNER_TOOLS.map(({ icon: Icon, title, body }, n) => <article key={title} data-reveal style={{ '--i': n } as CSSProperties}><span className="wa-tool-ico"><Icon size={20} aria-hidden="true"/></span><h4>{title}</h4><p>{body}</p></article>)}</div>
    <div className="wa-earn-block" data-reveal>
     <div><p className="wa-kicker">Payout tiers</p><h3>Keep selling. <em>It always adds up.</em></h3><p>Your commission works like income-tax slabs: each rate applies only to the slice of the month’s converted sale value in that range. Cross into a new slab and nothing you’ve already earned changes — your total only goes up.</p></div>
     <PayoutEstimator/>
    </div>
   </div>
  </section>

  {/* 03 — Heseos Installer. */}
  <section id="installer" className="wa-chapter wa-installer" aria-labelledby="wa-installer-title">
   <div className="wa-wrap">
    <Chapter n="03 · For the hands that install" icon="installer" app="Heseos Installer" who={['Electricians', 'Technicians', 'Installation teams']}
     title={<span id="wa-installer-title">Jobs come to you. <em>Install, earn, repeat.</em></span>}
     lead="Think of a delivery-partner app, built for smart homes. Set your coverage area and installation jobs near you show up as Heseos schedules them. Claim one first, install it, hand it over — and earn a fee for every job."/>
    <div className="wa-photos wa-photos-rev" data-reveal>
     <figure className="wa-photo-main"><img src="/media/app/installer-site.webp" width={1600} height={1063} loading="lazy" alt="An electrician kneels to wire a glass smart touch panel into the wall of a finished home"/>
      <div className="wa-float wa-float-job" aria-hidden="true"><span className="wa-float-ico"><Box size={16}/></span><span><small>New job · 4.2 km</small><strong>3 BHK · Baner · ₹2,400</strong></span><b>Claim</b></div>
     </figure>
     <figure className="wa-photo-side"><img src="/media/app/installer-hands.webp" width={1600} height={1063} loading="lazy" alt="Close view of hands fitting a glass touch panel, with a tool pouch and phone nearby"/><figcaption>Every device has a training video, so you arrive ready.</figcaption></figure>
    </div>
    <ul className="wa-pillars" data-reveal>
     <li><MapPin size={20} aria-hidden="true"/><strong>Jobs near you</strong><span>Only in the coverage area you set</span></li>
     <li><Timer size={20} aria-hidden="true"/><strong>First come, first served</strong><span>Claim a job before anyone else</span></li>
     <li><Wrench size={20} aria-hidden="true"/><strong>Trained for every device</strong><span>Videos for panels, plugs, IR, locks</span></li>
     <li><Wallet size={20} aria-hidden="true"/><strong>A fee for every job</strong><span>Logged in Earnings, paid to your bank</span></li>
    </ul>
    <AppTour app="Heseos Installer" steps={INSTALLER_STEPS} reverse/>
    <div className="wa-tabs-explain" data-reveal>
     <h3>Your whole day in three tabs.</h3>
     <div>
      <article><span>Available</span><p>Installations in your city that no one has claimed yet. Tap one, see the devices, the time and the fee, and claim it.</p></article>
      <article><span>My jobs</span><p>What you’ve claimed and where to be. Work through the job and mark it complete when the home is handed over.</p></article>
      <article><span>Completed</span><p>Every installation you’ve finished, with the fee it earned and whether it has been paid.</p></article>
     </div>
    </div>
    <div className="wa-refer" data-reveal><Link2 size={22} aria-hidden="true"/><p><strong>Installers can refer too.</strong> You carry a referral link and QR code just like a partner. Meet a homeowner who wants Heseos? Punch the lead from the + button and earn referral rewards when it converts.</p></div>
   </div>
  </section>

  {/* Side-by-side comparison of the three apps. */}
  <section id="compare" className="wa-compare" aria-labelledby="wa-compare-title">
   <div className="wa-wrap">
    <div className="wa-sec-head" data-reveal><p className="wa-kicker">Which app is yours?</p><h2 id="wa-compare-title">Three apps, <em>side by side.</em></h2></div>
    <div className="wa-table-wrap" data-reveal>
     <table className="wa-table">
      <thead><tr><td/>{[['customer', 'Heseos'], ['partner', 'Heseos Partner'], ['installer', 'Heseos Installer']].map(([k, n]) => <th key={k} scope="col" className={`wa-f-${k}`}><img src={`/media/app/icons/${k}.png`} alt="" width={40} height={40}/>{n}</th>)}</tr></thead>
      <tbody>{COMPARE.map(([row, ...cells]) => <tr key={row}><th scope="row">{row}</th>{cells.map((c, n) => <td key={n}>{c}</td>)}</tr>)}</tbody>
     </table>
    </div>
   </div>
  </section>

  {/* Get each app, then the closing call to action. */}
  <section className="wa-join" id="download" aria-labelledby="wa-join-title">
   <div className="wa-wrap">
    <h2 id="wa-join-title" className="wa-join-title" data-reveal>Get the app that fits you.</h2>
    <div className="wa-join-grid">
     <article className="wa-join-card wa-f-customer" data-reveal><img src="/media/app/icons/customer.png" alt="" width={72} height={72}/><h3>Heseos</h3><p>For homeowners. Control your connected home, anytime, anywhere.</p><StoreBadges name="Heseos" links={APPS}/></article>
     <article className="wa-join-card wa-f-partner" data-reveal><img src="/media/app/icons/partner.png" alt="" width={72} height={72}/><h3>Heseos Partner</h3><p>For dealers, architects, designers, builders and electricians who bring homes to Heseos.</p><StoreBadges name="Heseos Partner" links={APPS.partner}/></article>
     <article className="wa-join-card wa-f-installer" data-reveal><img src="/media/app/icons/installer.png" alt="" width={72} height={72}/><h3>Heseos Installer</h3><p>For electricians and technicians who want steady installation work in their city.</p><StoreBadges name="Heseos Installer" links={APPS.installer}/></article>
    </div>
    <div className="wa-cta" data-reveal>
     <div className="wa-cta-copy">
      <p className="wa-kicker">Make your home yours</p>
      <h2>Make your home <em>feel connected.</em></h2>
      <p>See Heseos working in a real home, or talk to our team about the right devices for yours.</p>
      <div className="wa-cta-actions">
       <SiteLink className="wa-cta-primary" href="/demo">Book a Free Demo <ArrowRight size={18} aria-hidden="true"/></SiteLink>
       <a className="wa-cta-whatsapp" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2 12.06 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.9-9.89 9.9zM20.5 3.49A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.44-8.41z"/></svg>Chat on WhatsApp</a>
      </div>
     </div>
     <div className="wa-cta-apps" aria-hidden="true">{['customer', 'partner', 'installer'].map((k) => <img key={k} src={`/media/app/icons/${k}.png`} alt="" width={56} height={56}/>)}<span>Three apps. One home.</span></div>
    </div>
   </div>
  </section>
 </div>;
}
