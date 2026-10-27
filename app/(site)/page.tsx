import { ArrowRight, BadgeCheck, Home as HomeIcon, Mic, Smartphone } from 'lucide-react';
import VideoHero from '../components/media/VideoHero';
import HighlightsCarousel from '../components/media/HighlightsCarousel';
import ScrollRotate from '../components/media/ScrollRotate';
import StickyMedia from '../components/media/StickyMedia';
import LoopVideo from '../components/media/LoopVideo';
import PanelDemo from '../components/story/PanelDemo';
import PlugDemo from '../components/story/PlugDemo';
import PromoTile from '../components/story/PromoTile';
import CardScroller from '../components/story/CardScroller';
import VariantPicker from '../components/commerce/VariantPicker';
import PackageCompare from '../components/commerce/PackageCompare';
import SiteLink from '../components/site/SiteLink';
import { Footnotes } from '../components/site/Footer';
import { formatINR, product } from '../../lib/catalog';

const panel=product('touch-panel')!,plug=product('smart-plug')!,blaster=product('ir-blaster')!;
const WHY=[
 {icon:HomeIcon,title:'A free demo, at home.',body:'See Heseos working in your own space before you decide.',href:'/demo',cta:'Book a demo'},
 {icon:BadgeCheck,title:'Keep your switchboards.',body:'Retrofit modules make the switches you already have smart.',href:'/packages',cta:'See retrofit packages'},
 {icon:Smartphone,title:'Control from anywhere.',body:'Your home over Wi‑Fi, in the Heseos app.',href:'/app',cta:'About the app'},
 {icon:Mic,title:'Works with your assistant.',body:'Siri, Bixby, Alexa and Google Assistant, through the Heseos app.³',href:'/products/ir-blaster',cta:'Learn more'},
];

export default function Home(){
 return <>
  <VideoHero src="/media/home/hero.mp4" poster="/media/home/hero-start.webp" still="/media/home/hero.webp" label="film of a living room waking up">
   <span className="eyebrow">Heseos Smart Home</span>
   <h1 className="display">The home that listens.</h1>
   <p className="lead">Touch it, tap it or just say it. Lights, AC and appliances that answer, wherever you are.</p>
   <div className="actions"><SiteLink className="btn" href="/experience">Step inside</SiteLink><SiteLink className="btn secondary" href="/packages">Shop packages</SiteLink></div>
  </VideoHero>

  <section className="section" aria-labelledby="highlights-title">
   <div className="section-head"><h2 id="highlights-title" className="headline">Get the highlights.</h2></div>
   <HighlightsCarousel items={[
    {image:'/media/home/living-evening.webp',title:'Set the mood with a touch.',body:'Dim every light in the room from one glass panel.'},
    {image:'/media/home/apt2-ac.webp',title:'Cool the room you’re in.',body:'The IR Blaster runs your AC from the Heseos app.'},
    {image:'/media/home/tv-on.webp',title:'Standby, switched off.',body:'The Smart Plug cuts power to appliances you’re not using.'},
    {image:'/media/home/apt2-away.webp',title:'Away, in one tap.',body:'Lights, AC and TV off as you head out the door.'},
    {image:'/media/home/teaser.webp',title:'Try it before you buy it.',body:'Every control works in the Heseos Simulation.'},
   ]}/>
  </section>

  <section className="section light product-intro" aria-labelledby="panel-title">
   <div className="section-head"><span className="eyebrow">{panel.name}</span><h2 id="panel-title" className="headline">{panel.tagline}</h2><p className="lead">{panel.summary}</p>
    <div className="actions"><SiteLink className="btn" href={`/store/buy/${panel.slug}`}>Choose a package</SiteLink><SiteLink className="link" href={`/products/${panel.slug}`}>Learn more ›</SiteLink></div></div>
   <ScrollRotate src="/media/products/touch-4m.webp" alt="Heseos 4M touch panel in black glass with a champagne frame"/>
   <div className="split">
    <div><h3 className="title">Six sizes. One look.</h3><p className="lead">From a 2-module switch to a 16-module panel, every Heseos touch panel shares the same black glass and soft-lit rings.</p></div>
    <VariantPicker product={panel}/>
   </div>
   <div className="split reverse">
    <div><h3 className="title">Home, evening, away.</h3><p className="lead">One touch changes the whole room. Try the scenes on the panel, as rendered in the Heseos Simulation.¹</p></div>
    <PanelDemo/>
   </div>
  </section>

  <section className="section" aria-labelledby="plug-title">
   <div className="section-head"><span className="eyebrow">{plug.name}</span><h2 id="plug-title" className="headline">{plug.tagline}</h2><p className="lead">{plug.summary}</p>
    <div className="actions"><SiteLink className="btn" href={`/store/buy/${plug.slug}`}>Buy · {formatINR(plug.price!)}</SiteLink><SiteLink className="link" href={`/products/${plug.slug}`}>Learn more ›</SiteLink></div></div>
   <div className="stats">
    <div><strong className="gradient-text">16A</strong><span>Rated for heavy appliances like an AC or a geyser.</span></div>
    <div><strong className="gradient-text">Ceramic</strong><span>A ceramic socket for safe conduction and performance.</span></div>
    <div><strong className="gradient-text">Anywhere</strong><span>Forgot the AC? Switch it off from your phone.</span></div>
   </div>
   <PlugDemo/>
  </section>

  <section className="section surface" aria-labelledby="blaster-title">
   <div className="section-head"><span className="eyebrow">{blaster.name}</span><h2 id="blaster-title" className="headline">{blaster.tagline}</h2><p className="lead">{blaster.summary}</p>
    <div className="actions"><SiteLink className="btn" href={`/store/buy/${blaster.slug}`}>Buy · {formatINR(blaster.price!)}</SiteLink><SiteLink className="link" href={`/products/${blaster.slug}`}>Learn more ›</SiteLink></div></div>
   <StickyMedia steps={[
    {title:'Your AC, from anywhere.',body:'Switch it on before you get home, or off after you’ve left. The IR Blaster sends the same commands as its remote.',image:'/media/home/apt2-ac.webp',alt:'Air conditioner in a living room, controlled by the IR Blaster'},
    {title:'Your TV, without the hunt.',body:'Add the TV’s remote to the app once. After that, your phone is the remote.',image:'/media/home/tv-on.webp',alt:'TV on a media console'},
    {title:'Plugs into any USB port.',body:'Even a phone charger. No wiring, no installation.',image:'/media/products/ir-blaster.webp',alt:'Two Heseos IR Blasters with USB connectors',contain:true},
   ]}/>
  </section>

  <section className="section" aria-labelledby="sim-title">
   <h2 id="sim-title" className="sr-only">The Heseos Simulation</h2>
   <PromoTile size="full" stacked title="Step inside the Heseos Simulation." body="Walk through two apartments and try the Touch Panel, IR Blaster and Smart Plug for yourself." href="/experience" cta="Enter the simulation" secondary={{href:'/experience?apartment=1',label:'Start in Apartment 1'}}
    media={<LoopVideo src="/media/home/teaser.mp4" poster="/media/home/teaser.webp" label="simulation preview"/>}/>
  </section>

  <section className="section light" aria-labelledby="app-title">
   <div className="split app-split">
    <div><span className="eyebrow">Heseos app</span><h2 id="app-title" className="headline">Your home in your pocket.</h2>
     <p className="lead">Every switch, plug and remote in one app. Forgot to turn off the AC? Turn it off from wherever you are.</p>
     <div className="actions start"><SiteLink className="btn" href="/app">About the app</SiteLink></div></div>
    <img src="/media/products/app-phone.webp" alt="The Heseos app on a phone, showing living-room switches and power use" loading="lazy" className="app-phone"/>
   </div>
  </section>

  <section className="section" aria-labelledby="solutions-title">
   <div className="section-head"><h2 id="solutions-title" className="headline">Smart, for every kind of space.</h2></div>
   <div className="promo-grid">
    <PromoTile title="Smart Home" body="A day that runs itself." image="/media/home/living-home.webp" href="/solutions/home" cta="Learn more"/>
    <PromoTile title="Smart Hotel" body="Hospitality without friction." image="/media/home/bedroom.webp" href="/solutions/hotel" cta="Learn more"/>
    <PromoTile title="Smart Buildings" body="Control at property scale." image="/media/home/entrance.webp" href="/solutions/buildings" cta="Learn more"/>
    <PromoTile title="Smart Enterprise" body="Automation without complexity." image="/media/home/office.webp" href="/solutions/enterprise" cta="Learn more"/>
   </div>
  </section>

  <section className="section light" aria-labelledby="compare-title">
   <div className="section-head"><h2 id="compare-title" className="headline">Which package is right for you?</h2><p className="lead">Every package is priced as listed on heseos.com.²</p></div>
   <PackageCompare/>
   <p className="center" style={{marginTop:32}}><SiteLink className="link" href="/compare">Compare every package ›</SiteLink></p>
  </section>

  <section className="section" aria-labelledby="why-title">
   <div className="section-head"><h2 id="why-title" className="headline">Why Heseos.</h2></div>
   <CardScroller label="Reasons to choose Heseos">{WHY.map(w=><div key={w.title} className="why-card" role="listitem"><w.icon size={30} strokeWidth={1.5}/><h3 className="title">{w.title}</h3><p className="muted">{w.body}</p><SiteLink className="link" href={w.href}>{w.cta} <ArrowRight size={14}/></SiteLink></div>)}</CardScroller>
  </section>

  <section className="closing" aria-labelledby="closing-title">
   <img src="/media/home/apt2-away.webp" alt="" loading="lazy"/>
   <div><h2 id="closing-title" className="display">Your home is about to wake up.</h2>
    <div className="actions"><SiteLink className="btn" href="/demo">Book a free demo</SiteLink><SiteLink className="btn secondary" href="/store">Shop</SiteLink></div></div>
  </section>

  <Footnotes notes={[
   'Rooms, scenes and films on this page are rendered in the Heseos Simulation. Device models in the simulation are illustrative.',
   'Prices and package contents as listed on heseos.com; the struck-through price is the listed MRP. Watts shown are illustrative example loads, not measurements.',
   'Voice assistant compatibility as described on the Heseos IR Blaster product page.',
  ]}/>
 </>;
}
