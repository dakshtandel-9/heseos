'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PARTNER_TRACKS } from '../../../lib/partners';

const EXPERIENCE=['Just starting out','1–3 years','3–10 years','10+ years'];
const VOLUME=['1–5 projects a year','6–20 projects a year','21–50 projects a year','50+ projects a year'];

// Partner applications land in the admin as "partner" submissions; the business details are folded into `details`.
export default function PartnerForm(){
 const [track,setTrack]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
 // A partnership CTA elsewhere on the page (an a[data-track] link to #apply) preselects that partnership here.
 useEffect(()=>{
  const pick=(e:MouseEvent)=>{const id=(e.target as Element|null)?.closest<HTMLElement>('a[data-track]')?.dataset.track;if(id&&PARTNER_TRACKS.some(t=>t.id===id))setTrack(id);};
  document.addEventListener('click',pick);
  return()=>document.removeEventListener('click',pick);
 },[]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError('');
  const f=Object.fromEntries(new FormData(e.currentTarget)) as Record<string,string>;
  const label=PARTNER_TRACKS.find(t=>t.id===f.track)?.label??f.track;
  const details=[`Partnership: ${label}`,`Company: ${f.company}`,`City: ${f.city}`,`Experience: ${f.experience}`,`Volume: ${f.volume}`,f.portfolio&&`Website or portfolio: ${f.portfolio}`,f.message].filter(Boolean).join('\n');
  try{
   const response=await fetch('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'partner',name:f.name,email:f.email,phone:f.phone,website:f.website,details})});
   const result=await response.json() as {error?:string};
   if(!response.ok)throw Error(result.error||'We could not send your application. Please try again.');
   setSent(true);
  }catch(err){setError((err as Error).message||'Please check your connection and try again.');}
  finally{setBusy(false);}
 }
 if(sent)return <div className="pt-form-success" role="status"><CheckCircle2 size={34} aria-hidden="true"/><h3>Application received.</h3><p>Thank you for your interest in partnering with Heseos. Our partnerships team will contact you on the number you shared.</p></div>;
 return <form className="pt-form" onSubmit={submit}>
  <label className="pt-honey" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <fieldset className="pt-choice">
   <legend>I want to partner as</legend>
   <div>{PARTNER_TRACKS.map(t=><label key={t.id}><input type="radio" name="track" value={t.id} required checked={track===t.id} onChange={()=>setTrack(t.id)}/><span>{t.label}</span></label>)}</div>
  </fieldset>
  <div className="pt-form-row">
   <label>Your name<input name="name" required maxLength={150} autoComplete="name"/></label>
   <label>Company or firm<input name="company" required maxLength={150} autoComplete="organization"/></label>
  </div>
  <div className="pt-form-row">
   <label>Phone<input name="phone" type="tel" required maxLength={30} autoComplete="tel"/></label>
   <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email"/></label>
  </div>
  <div className="pt-form-row">
   <label>City<input name="city" required maxLength={80} autoComplete="address-level2"/></label>
   <label><span>Website or portfolio <small>(optional)</small></span><input name="portfolio" maxLength={200} inputMode="url" placeholder="https:// or @instagram"/></label>
  </div>
  <div className="pt-form-row">
   <label>Years in business<select name="experience" required defaultValue=""><option value="" disabled>Choose…</option>{EXPERIENCE.map(o=><option key={o}>{o}</option>)}</select></label>
   <label>Typical volume<select name="volume" required defaultValue=""><option value="" disabled>Choose…</option>{VOLUME.map(o=><option key={o}>{o}</option>)}</select></label>
  </div>
  <label><span>Tell us about your business <small>(optional)</small></span><textarea name="message" rows={3} maxLength={3000} placeholder="Your market, the kind of projects you do, and what you'd like from a partnership."/></label>
  {error&&<p className="pt-form-error" role="alert">{error}</p>}
  <button className="pt-button pt-submit" disabled={busy}>{busy?'Sending…':'Submit application'}{!busy&&<ArrowRight size={16} aria-hidden="true"/>}</button>
  <p className="pt-form-note">By applying, you agree that Heseos may contact you about a partnership. Applying is free.</p>
 </form>;
}
