'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Phone } from '../app/AppScreens';

export type StoryBeat = { time: string; title: string; body: string; screen: ReactNode; scene: string };

// One app's story as scrollytelling: the beats scroll past on the left while the phone and the photo behind them stay
// pinned. Whichever beat crosses the middle of the screen is current: the phone swaps to its screen (replaying that
// screen's animations) and the photo crossfades to its scene. Every beat is ordinary text in the page, so it reads
// top to bottom without the effects, and reduced motion only drops the transitions.
export default function AppStory({ app, beats }: { app: string; beats: StoryBeat[] }) {
 const [at, setAt] = useState(0);
 const list = useRef<HTMLOListElement>(null);
 useEffect(() => {
  const items = [...(list.current?.children ?? [])] as HTMLElement[];
  const io = new IntersectionObserver((entries) => {
   for (const e of entries) if (e.isIntersecting) setAt(Number(e.target.getAttribute('data-i')));
  }, { rootMargin: '-48% 0px -48% 0px' });
  items.forEach((el) => io.observe(el));
  return () => io.disconnect();
 }, []);
 const scenes = [...new Set(beats.map((b) => b.scene))];

 return <div className="as">
  <div className="as-scenes" aria-hidden="true">
   <div className="as-pin">
    {scenes.map((s) => <div key={s} className={`as-scene${s === beats[at].scene ? ' on' : ''}`}><Image src={s} alt="" fill sizes="100vw"/></div>)}
   </div>
  </div>
  <div className="as-grid">
   <ol className="as-beats" ref={list}>
    {beats.map((b, i) => <li key={b.title} data-i={i} className={i === at ? 'on' : undefined}>
     <div className="as-card">
      <span className="as-time"><b>{String(i + 1).padStart(2, '0')}</b>{b.time}</span>
      <h3>{b.title}</h3>
      <p>{b.body}</p>
     </div>
    </li>)}
   </ol>
   <div className="as-stage">
    <div className="as-sticky">
     <div className="as-phone">
      <Phone label={`${app}, illustrative screen: ${beats[at].title}`}>
       {beats.map((b, i) => <div key={b.title} className={`wa-scr${i === at ? ' on' : ''}${i < at ? ' past' : ''}`}>{b.screen}</div>)}
      </Phone>
     </div>
     <div className="as-progress" aria-hidden="true">{beats.map((b, i) => <i key={b.title} className={i <= at ? 'done' : undefined}/>)}</div>
     <p className="as-note">Illustrative screens</p>
    </div>
   </div>
  </div>
 </div>;
}
