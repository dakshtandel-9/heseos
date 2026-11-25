'use client';
import { useEffect, useRef, useState } from 'react';

// Counts a figure such as "9,000+" up from zero when it scrolls into view. The final value is rendered first, so it reads correctly without JS and with reduced motion.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const [text, setText] = useState(value);
  useEffect(() => {
    const match = value.match(/^([\d,]+)(.*)$/);
    const el = ref.current;
    if (!match || !el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = Number(match[1].replace(/,/g, ''));
    const suffix = match[2];
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1600, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        setText(Math.round(target * eased).toLocaleString('en-IN') + suffix);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setText('0' + suffix);
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <strong ref={ref} aria-label={value}><span aria-hidden="true">{text}</span></strong>;
}
