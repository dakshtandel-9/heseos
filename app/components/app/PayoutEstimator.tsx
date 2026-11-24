'use client';
import { useState, type CSSProperties } from 'react';
import './payout-estimator.css';

// Partner payout slabs from the Heseos Partner app: each rate applies only to the slice of the month's converted sale value inside its range.
export const PAYOUT_TIERS = [
 { upTo: 2_500_000, rate: 0.15, label: 'Up to ₹25,00,000' },
 { upTo: 7_500_000, rate: 0.10, label: '₹25,00,000 – ₹75,00,000' },
 { upTo: Infinity, rate: 0.08, label: 'Above ₹75,00,000' },
];
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function payout(value: number) {
 let floor = 0, total = 0;
 for (const t of PAYOUT_TIERS) {
  if (value <= floor) break;
  total += (Math.min(value, t.upTo) - floor) * t.rate;
  floor = t.upTo;
 }
 return total;
}

export default function PayoutEstimator() {
 const [value, setValue] = useState(1_000_000);
 const earned = payout(value);
 const tier = PAYOUT_TIERS.findIndex((t) => value <= t.upTo);
 return <div className="wa-estimator">
  <label htmlFor="wa-sale">Converted sale value this month <output htmlFor="wa-sale">{inr(value)}</output></label>
  <input id="wa-sale" type="range" min={0} max={10_000_000} step={50_000} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ '--p': `${value / 100_000}%` } as CSSProperties}/>
  <div className="wa-estimate"><span>Your payout</span><strong>{inr(earned)}</strong><small>{value ? `${((earned / value) * 100).toFixed(1)}% effective rate` : 'Slide to estimate'}</small></div>
  <ul className="wa-tiers">{PAYOUT_TIERS.map((t, i) => <li key={t.label} className={i === tier && value ? 'on' : undefined}><span>{t.label}</span><b>{t.rate * 100}%</b></li>)}</ul>
  <p className="wa-fine">Works like tax slabs — a higher slab never lowers what you have already earned. Illustrative; final payouts follow Heseos partner terms.</p>
 </div>;
}
