'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
// A figure as a mechanical counter, like the number drums on an energy meter. When it scrolls into view each digit rolls up
// to its value (digits further right spin more turns), then the status light beside the label comes on.
// The server renders the final reading, and it stays that way with reduced motion or when it is already on screen at load.
// Figures with a thousands separator are grouped the Indian way (100,000 reads 1,00,000), as elsewhere on the site.
const STRIP = '0123456789'.repeat(4).split('').join('\n');

export default function Odometer({ value, label, variant = 'stack', delay = 0 }: { value: string; label: string; variant?: 'hero' | 'stack' | 'row'; delay?: number }) {
  const reading = useRef<HTMLSpanElement>(null), [state, setState] = useState<'' | 'is-ready' | 'is-run'>('');
  useEffect(() => {
    const el = reading.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;
    setState('is-ready');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setState('is-run'); io.disconnect(); } }, { threshold: .6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const digits = value.replace(/\D/g, ''), unit = value.replace(/[\d,]/g, '');
  const grouped = value.includes(',') ? new Intl.NumberFormat('en-IN').format(Number(digits)) : digits;
  let d = 0;
  return <div className={`od od--${variant} ${state}`} style={{ '--delay': `${delay}ms`, '--n': digits.length } as CSSProperties}>
    <span className="od-reading" ref={reading} aria-hidden="true">
      <span className="od-window">{[...grouped].map((ch, k) => {
        if (ch === ',') return <span key={k} className="od-sep">,</span>;
        const i = d++;
        return <span key={k} className="od-drum" style={{ '--i': i, '--pos': Math.min(i, 3) * 10 + Number(ch) } as CSSProperties}><span className="od-strip">{STRIP}</span></span>;
      })}</span>
      {unit && <span className="od-unit">{unit}</span>}
    </span>
    <span className="od-sr">{grouped + unit}</span>
    <span className="od-label"><i className="od-led" aria-hidden="true" />{label}</span>
  </div>;
}
