import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import ContactForm from '../../components/site/ContactForm';
import { CONTACT } from '../../../lib/site';
import './demo.css';
export const metadata: Metadata = {title:'Book a free demo',description:'Plan your connected home with Heseos. Tell us about your space and request a free product demo and consultation.'};
const steps=[
 {n:'01',title:'A quick call',text:'We learn about your rooms, wiring and what you want to automate.',img:'/media/demo/step-call.webp',alt:'Hands holding a phone over a printed floor plan and a cup of chai'},
 {n:'02',title:'See it working',text:'Touch the panels and try everyday scenes built around your home.',img:'/media/home/gen/touch-detail-v2.webp',alt:'A Heseos glass touch panel on a wall'},
 {n:'03',title:'Your plan and quote',text:'A room-by-room configuration with clear pricing and install needs.',img:'/media/demo/step-plan.webp',alt:'A consultant and homeowner reviewing a room plan on a tablet beside a Heseos panel'},
];
export default async function DemoPage({searchParams}:{searchParams:Promise<{product?:string;package?:string;space?:string}>}){
 const query=await searchParams;
 const selected=[['Product',query.product],['Package',query.package],['Space',query.space]].filter((entry):entry is [string,string]=>typeof entry[1]==='string').map(([label,value])=>`${label}: ${value.slice(0,200)}`).join('\n');
 return <div className="demo-page">
  <section className="demo-hero" aria-labelledby="demo-title">
   <div className="demo-visual">
    <img src="/media/demo/hero.webp" alt="A Heseos consultant showing a homeowner the glass touch panel in their living room" fetchPriority="high"/>
    <div className="demo-toast" aria-hidden="true"><span className="demo-toast-dot"/><div><strong>Evening scene</strong><small>Lights 40% · Curtains closed</small></div></div>
    <div className="demo-visual-copy">
     <span className="demo-eyebrow">Free home demo</span>
     <h1 id="demo-title">See your home<br/><em>respond to you.</em></h1>
     <p>Try Heseos panels and scenes with our team, then get a setup planned for your space.</p>
    </div>
   </div>
   <div className="demo-form-card">
    <div className="demo-form-head"><h2>Book your demo</h2><span className="demo-badge">Free · No obligation</span></div>
    <p>Share a few details and we’ll call you to fix a time.</p>
    {selected&&<p className="demo-interest">{selected}</p>}
    <ContactForm type="demo" context={selected} button="Request my free demo"/>
    <a className="demo-chat" href={CONTACT.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true"/>Prefer to chat? Message us on WhatsApp<ArrowUpRight size={15} aria-hidden="true"/></a>
   </div>
  </section>
  <section className="demo-steps" aria-labelledby="demo-steps-title">
   <h2 id="demo-steps-title">What happens next</h2>
   <ol>{steps.map(s=><li key={s.n}><img src={s.img} alt={s.alt} loading="lazy"/><div><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol>
  </section>
 </div>;
}
