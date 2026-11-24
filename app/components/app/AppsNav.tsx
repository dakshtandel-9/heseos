'use client';
import { useEffect, useState } from 'react';

const LINKS = [['how', 'How it works', ''], ['customer', 'Heseos', 'customer'], ['partner', 'Partner', 'partner'], ['installer', 'Installer', 'installer'], ['compare', 'Compare', '']] as const;

// Sticky switcher between the three app chapters; marks the chapter in view.
export default function AppsNav() {
 const [on, setOn] = useState('');
 useEffect(() => {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
  LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
  return () => io.disconnect();
 }, []);
 return <nav className="wa-nav" aria-label="Heseos apps">
  <div>{LINKS.map(([id, label, icon]) => <a key={id} href={`#${id}`} aria-current={on === id ? 'true' : undefined}>{icon && <img src={`/media/app/icons/${icon}.png`} alt="" width={20} height={20}/>}{label}</a>)}</div>
 </nav>;
}
