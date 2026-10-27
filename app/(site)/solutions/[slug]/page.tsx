import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SOLUTIONS, solution } from '../../../../lib/solutions';
import SiteLink from '../../../components/site/SiteLink';
import { Footnotes } from '../../../components/site/Footer';
export function generateStaticParams(){return SOLUTIONS.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const s=solution((await params).slug);return s?{title:s.name,description:s.intro}:{};}
export default async function SolutionPage({params}:{params:Promise<{slug:string}>}){
 const s=solution((await params).slug);if(!s)notFound();
 return <>
  <section className="solution-hero"><img src={s.image} alt=""/><div><span className="eyebrow">{s.name}</span><h1 className="display">{s.tagline}</h1><p className="lead">{s.intro}</p>
   <div className="actions"><SiteLink className="btn" href="/demo">Talk to us</SiteLink><SiteLink className="btn secondary" href="/experience">Try the simulation</SiteLink></div></div></section>
  <section className="section">{s.moments.map((m,i)=><div key={m.title} className={'split moment'+(i%2?' reverse':'')}>
   <div><span className="eyebrow">{m.component}</span><h2 className="headline">{m.title}</h2><p className="lead">{m.body}</p></div>
   <img src={m.image} alt="" loading="lazy" className="moment-image"/></div>)}</section>
  <section className="section light center"><h2 className="headline">Plan your {s.name.replace('Smart ','').toLowerCase()} with us.</h2><div className="actions"><SiteLink className="btn" href="/demo">Book a free demo</SiteLink><SiteLink className="link" href="/packages">See Smart Packages ›</SiteLink></div></section>
  <Footnotes notes={['Images are rendered in the Heseos Simulation and are illustrative.']}/>
 </>;
}
