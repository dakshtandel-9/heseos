'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Phone } from './AppScreens';
import useReducedMotion from './useReducedMotion';

type Step = { title: string; body: string; screen: ReactNode };
const STEP_MS = 5600;

// A step list beside a phone: the phone shows the screen for the chosen step. It plays itself while on screen,
// pauses on hover or focus, and never auto-advances for people who prefer reduced motion.
export default function AppTour({ steps, app, tone = 'dark', reverse = false }: { steps: Step[]; app: string; tone?: 'dark' | 'light'; reverse?: boolean }) {
 const [at, setAt] = useState(0);
 const [hold, setHold] = useState(false);
 const [inView, setInView] = useState(false);
 const still = useReducedMotion();
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: .35 });
  if (ref.current) io.observe(ref.current);
  return () => io.disconnect();
 }, []);
 const playing = inView && !hold && !still;
 useEffect(() => {
  if (!playing) return;
  const t = setTimeout(() => setAt((n) => (n + 1) % steps.length), STEP_MS);
  return () => clearTimeout(t);
 }, [at, playing, steps.length]);

 return <div ref={ref} className={`wa-tour${reverse ? ' wa-tour-rev' : ''}${playing ? ' playing' : ''}`} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
  <ol className="wa-tour-steps">
   {steps.map((s, n) => <li key={s.title}>
    <button type="button" aria-current={n === at ? 'step' : undefined} onClick={() => setAt(n)}>
     <span className="wa-tour-n">{String(n + 1).padStart(2, '0')}</span>
     <span><strong>{s.title}</strong><small>{s.body}</small></span>
     <i className="wa-tour-bar" style={{ animationDuration: `${STEP_MS}ms` }}/>
    </button>
   </li>)}
  </ol>
  <div className="wa-tour-stage">
   <Phone tone={tone} label={`${app}, illustrative screen: ${steps[at].title}`}>
    {steps.map((s, n) => <div key={s.title} className={`wa-scr${n === at ? ' on' : ''}${n < at ? ' past' : ''}`}>{s.screen}</div>)}
   </Phone>
   <p className="wa-note">Illustrative screens · {steps[at].title}</p>
  </div>
 </div>;
}
