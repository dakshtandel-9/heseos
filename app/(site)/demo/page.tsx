import type { Metadata } from 'next';
import { ArrowUpRight, Info } from 'lucide-react';
export const metadata: Metadata = {title:'Book a free demo'};
const SELECTS=[
 {id:'city',label:'City',options:['Bangalore','Delhi / Delhi NCR','Kolkata','Mumbai','Pune','Other']},
 {id:'property',label:'Property type',options:['Independent home','Gated villa','Apartment','Architect or interior designer','Builder','Other']},
 {id:'stage',label:'Stage of construction',options:['Early stage','Electrical work in progress','Interior work in progress','Close to handover','Handover','Ready to move in']},
 {id:'requirement',label:'Requirement',options:['Partial home automation','Complete home automation']},
];
// The form is the planned design; it stays disabled until lead capture is connected.
export default function DemoPage(){return <section className="section light demo-page">
 <div className="section-head"><h1 className="headline">Book a free demo.</h1><p className="lead">See Heseos working in your home, then get a package that fits your rooms and wiring.</p></div>
 <div className="notice" role="note"><Info size={18}/><div><strong>Booking on this site is coming soon.</strong> Until then, request your demo on heseos.com. <a className="link" href="https://www.heseos.com/" target="_blank" rel="noreferrer">Open heseos.com <ArrowUpRight size={14}/></a></div></div>
 <form className="form" aria-describedby="demo-note">
  <fieldset disabled>
   <legend className="sr-only">Demo request (preview)</legend>
   <label>Name<input name="name" autoComplete="name"/></label>
   <label>Phone<input name="phone" type="tel" autoComplete="tel"/></label>
   {SELECTS.map(s=><label key={s.id}>{s.label}<select name={s.id} defaultValue=""><option value="" disabled>Choose…</option>{s.options.map(o=><option key={o}>{o}</option>)}</select></label>)}
   <button className="btn" type="submit">Request a demo</button>
  </fieldset>
  <p id="demo-note" className="muted">This form is a preview of the booking flow and isn’t connected yet.</p>
 </form>
</section>;}
