import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../../../lib/site';
import { REEL, TESTIMONIALS } from '../../../lib/testimonials';
import SiteLink from '../../components/site/SiteLink';
import Reveal from '../../components/home/Reveal';
import TestimonialReel from '../../components/testimonials/TestimonialReel';
import StoryChapter from '../../components/testimonials/StoryChapter';
import FilmWall from '../../components/testimonials/FilmWall';
import '../../components/testimonials/testimonials.css';

export const metadata: Metadata = {
  title: 'Customer Stories | Heseos Smart Home Automation',
  description: 'Heseos customers in Pune, Noida and beyond, filmed in their own homes and workplaces, on touch panels, smart locks, voice control and installation.',
  openGraph: { title: 'In their own words | Heseos customer stories', description: 'Watch seven Heseos customers talk about their smart homes.', type: 'website', images: [REEL.poster] },
};

const films = TESTIMONIALS.flatMap((t) => t.films.map((f) => ({ ...f, name: t.name, slug: t.slug })));
const minutes = Math.round(films.reduce((s, f) => s + f.duration, 0) / 60);
const posters = TESTIMONIALS.flatMap((t) => t.films.filter((f) => f.orient === 'v').map((f) => f.poster));
const rows = [posters, [...posters].reverse()];
const words = (s: string) => s.split(' ').map((w, i) => <span key={i} className="kw"><span style={{ animationDelay: `${120 + i * 90}ms` }}>{w}</span></span>);

export default function TestimonialsPage() {
  return <div className="tp">
    <Reveal />
    <div className="tp-progress" aria-hidden="true" />

    <section className="tp-hero" aria-labelledby="tp-title">
      <div className="tp-wall" aria-hidden="true">{rows.map((r, i) => <div key={i} className={'tp-row' + (i ? ' rev' : '')}>{[...r, ...r, ...r].map((p, k) => <img key={k} src={p} alt="" loading={k < 6 ? 'eager' : 'lazy'} />)}</div>)}</div>
      <div className="hw">
        <span className="ey">Customer stories</span>
        <h1 id="tp-title">{words('In their')} <em>{words('own words.')}</em></h1>
        <p>Heseos customers, filmed in their own homes and workplaces, on what changed once their spaces got smarter.</p>
        <ul className="tp-stats">
          <li><b>{String(TESTIMONIALS.length).padStart(2, '0')}</b><span>Customers</span></li>
          <li><b>{films.length}</b><span>Films</span></li>
          <li><b>{minutes} min</b><span>Of unscripted footage</span></li>
        </ul>
      </div>
    </section>

    <section className="tp-sec" aria-labelledby="reel-title">
      <div className="hw">
        <div className="hh" data-reveal>
          <div><span className="ey">The reel</span><h2 id="reel-title" className="ht">Seven homes.<br /><span className="mute">One minute.</span></h2></div>
          <div className="hh-side"><p>The best line from every story, cut together. Tap a face to jump to that speaker, or turn the sound on.</p></div>
        </div>
        <div data-reveal><TestimonialReel src={REEL.src} poster={REEL.poster} chapters={REEL.chapters} /></div>
        <nav aria-label="Stories on this page"><ul className="tp-index" data-reveal>{TESTIMONIALS.map((t) => <li key={t.slug}><a href={'#' + t.slug}><img src={t.avatar} alt="" loading="lazy" />{t.name}</a></li>)}</ul></nav>
      </div>
    </section>

    <section className="tp-sec" aria-labelledby="stories-title">
      <div className="hw">
        <div className="hh" data-reveal>
          <div><span className="ey">The stories</span><h2 id="stories-title" className="ht">Every film, in full.</h2></div>
          <div className="hh-side"><p>Watch each customer’s film, switch between the reel and landscape cuts, and follow along with the transcript.</p></div>
        </div>
        <div>{TESTIMONIALS.map((t, i) => <StoryChapter key={t.slug} t={t} index={i} total={TESTIMONIALS.length} />)}</div>
      </div>
    </section>

    <section className="tp-sec" aria-labelledby="wall-title">
      <div className="hw">
        <div className="hh" data-reveal>
          <div><span className="ey">The film library</span><h2 id="wall-title" className="ht">All {films.length} films.</h2></div>
          <div className="hh-side"><p>Hover to preview. Click to watch with sound.</p></div>
        </div>
        <div data-reveal><FilmWall items={films} /></div>
      </div>
    </section>

    <section className="cta" aria-labelledby="tp-cta-title">
      <img src="/media/home/cta-dusk.webp" alt="A sunlit modern home overlooking the coast" width={1916} height={821} loading="lazy" decoding="async" />
      <div className="hw" data-reveal>
        <span className="ey">Free home demo</span>
        <h2 id="tp-cta-title">Your home could be the next story.</h2>
        <p>Book a free demo and see Heseos working in your space, just like these customers did.</p>
        <div className="ha"><SiteLink className="btn hb" href="/demo">Book a Demo <ArrowRight size={16} /></SiteLink><a className="btn secondary" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">Talk to an Expert <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  </div>;
}
