import type { Metadata } from 'next';
import { ArrowRight, BellRing, ChartNoAxesColumn, Gauge, House, LayoutGrid, LockKeyhole, Mic2, PlugZap, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import SiteLink from '../../components/site/SiteLink';
import { APPS } from '../../../lib/site';
import AppExperience from '../../components/app/AppExperience';
import SceneExamples from '../../components/app/SceneExamples';

export const metadata: Metadata = {
 title: 'Heseos app | Your home in your pocket',
 description: 'Control connected devices, create scenes and stay informed about your home with the Heseos app.',
};
const PHONE = '/media/products/app-phone.webp';

function ActionLinks({compact = false}: {compact?: boolean}) {
 return <div className={`app-actions${compact ? ' app-actions-compact' : ''}`}>
  <SiteLink className="app-primary" href="/demo">Book a Free Demo <ArrowRight size={17} aria-hidden="true"/></SiteLink>
  <SiteLink className="app-text-link" href="#download">Download the App <ArrowRight size={16} aria-hidden="true"/></SiteLink>
 </div>;
}

export default function AppPage() {
 return <div className="app-page">
  <section className="app-hero" aria-labelledby="app-hero-title">
   <div className="app-hero-inner">
    <div className="app-hero-copy">
     <p className="app-kicker">Heseos app</p>
     <h1 id="app-hero-title">Your home in<br/>your pocket.</h1>
     <p className="app-hero-lead">Control your home&apos;s appliances from your phone. Turn devices on or off, create scenes, check usage, and stay in control — at home or away.</p>
     <ActionLinks/>
    </div>
    <div className="app-hero-visual"><img src={PHONE} width={801} height={1134} alt="A hand holding a phone displaying the genuine Heseos living-room app screen" fetchPriority="high"/></div>
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
    <div className="app-section-intro"><p className="app-kicker">The Heseos app</p><h2 id="app-features-title">Your whole home. One app.</h2><p>Total control, greater insight, and a more personal home experience — all in one app.</p></div>
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

  <section className="app-end" id="download" aria-label="Download and explore the Heseos app"><div className="app-download"><div className="app-download-icon"><img src="/apple-touch-icon.png" alt="" width={72} height={72}/></div><div className="app-download-copy"><h2>Get the Heseos app.</h2><p>Download now and take control of your home, anytime, anywhere.</p></div><div className="app-store-links"><a href={APPS.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download Heseos on the App Store (opens in a new tab)"><img src="/media/app/app-store.svg" width={120} height={40} alt="Download on the App Store"/></a><a href={APPS.googlePlay} target="_blank" rel="noopener noreferrer" aria-label="Get Heseos on Google Play (opens in a new tab)"><img src="/media/app/google-play.png" width={646} height={250} alt="Get it on Google Play"/></a></div></div><div className="app-final-cta"><div><p className="app-kicker">Make your home yours</p><h2>Make your home feel connected.</h2><p>Download the app or speak with our team about the right devices for your home.</p></div><ActionLinks compact/></div></section>
 </div>;
}
