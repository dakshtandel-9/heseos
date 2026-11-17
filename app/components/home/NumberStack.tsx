'use client';

import { ArrowRight } from 'lucide-react';
import CountUp from './CountUp';
import './NumberStack.css';

type Stat = { value: string; label: string };

// "What we have done so far": stat stack with count-up animations and contextual details.
// Staggered layout with statistic, detail line, and optional action link.
export default function NumberStack({
  eyebrow,
  title,
  body,
  stats,
  details,
  cta,
}: {
  eyebrow: string;
  title: [string, string, string];
  body: string;
  stats: Stat[];
  details: string[];
  cta?: { href: string; label: string };
}) {
  return (
    <section className="ns" aria-labelledby="numbers-title">
      <div className="hw">
        <div className="ns-head" data-reveal>
          <div>
            <span className="ey">{eyebrow}</span>
            <h2 id="numbers-title" className="ht">
              {title[0]}
              <br />
              <span className="mute">{title[1]}</span>
              <br />
              <span className="mute" style={{ opacity: 0.6 }}>
                {title[2]}
              </span>
            </h2>
          </div>
          <p className="ns-body">{body}</p>
        </div>

        <div className="ns-grid" data-reveal>
          {stats.map((s, i) => (
            <article key={s.label} className="ns-card">
              <div className="ns-stat">
                <b className="tabular">
                  <CountUp value={s.value} />
                </b>
                <span className="ns-label">{s.label}</span>
              </div>
              {details[i] && <p className="ns-detail">{details[i]}</p>}
            </article>
          ))}
        </div>

        {cta && (
          <div className="ns-cta" data-reveal>
            <a href={cta.href} className="btn hb">
              {cta.label} <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
