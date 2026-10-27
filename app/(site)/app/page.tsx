import type { Metadata } from 'next';
import { Gauge, LayoutGrid, Mic, Sparkles } from 'lucide-react';
import SiteLink from '../../components/site/SiteLink';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'Heseos app'};
const FEATURES=[
 {icon:LayoutGrid,title:'Every device, one app.',body:'Switches, panels, plugs and remotes, organised by room.'},
 {icon:Gauge,title:'Power at a glance.',body:'See what a room is drawing and how its use changes through the day.'},
 {icon:Sparkles,title:'Scenes for the way you live.',body:'Bring devices together in a scene and run it with one tap.'},
 {icon:Mic,title:'Works with your assistant.',body:'Siri, Bixby, Alexa and Google Assistant.¹'},
];
export default function AppPage(){return <>
 <section className="section light"><div className="split app-split" style={{marginTop:0}}>
  <div><span className="eyebrow">Heseos app</span><h1 className="display">Your home in your pocket.</h1><p className="lead">Control your home’s appliances from your phone. Forgot to turn off the AC? Turn it off even when you are not home.</p>
   <div className="actions start"><SiteLink className="btn" href="/demo">Book a free demo</SiteLink><SiteLink className="link" href="/experience">Try it in the simulation ›</SiteLink></div></div>
  <img src="/media/products/app-phone.webp" alt="The Heseos app showing living-room power use and switches" className="app-phone"/></div></section>
 <section className="section"><div className="feature-grid">{FEATURES.map(f=><article key={f.title} className="why-card"><f.icon size={28} strokeWidth={1.5}/><h2 className="title">{f.title}</h2><p className="muted">{f.body}</p></article>)}</div></section>
 <Footnotes notes={['Voice assistant compatibility as described on the Heseos product pages. The app is shown as it appears on heseos.com.']}/></>;}
