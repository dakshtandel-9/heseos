'use client';
import { Lock } from 'lucide-react';
import { formatINR } from '../../../lib/catalog';
import SiteLink from '../site/SiteLink';
import { useBagEntries } from './BagView';
// Payment is not connected yet: the summary is real, the pay button stays disabled and says why.
export default function CheckoutView(){
 const {entries,ready,total}=useBagEntries();
 if(!ready)return null;
 if(!entries.length)return <div className="bag-empty"><p className="muted">There’s nothing to check out yet.</p><div className="actions"><SiteLink className="btn" href="/store">Go to the store</SiteLink></div></div>;
 return <div className="checkout">
  <div className="notice" role="note"><Lock size={18}/><div><strong>Online payment is coming soon.</strong> Razorpay checkout is being connected. To order today, book a free demo and our team will confirm your order with you.</div></div>
  <ul className="checkout-lines">{entries.map(e=><li key={e.id}><span>{e.qty} × {e.name}</span><span className="tabular">{formatINR(e.price*e.qty)}</span></li>)}</ul>
  <div className="checkout-total"><span>Total</span><strong className="tabular">{formatINR(total)}</strong></div>
  <div className="actions start"><button className="btn" disabled aria-describedby="pay-note">Pay with Razorpay</button><SiteLink className="btn secondary" href="/demo">Book a free demo</SiteLink></div>
  <p id="pay-note" className="muted">Payment is disabled until checkout is connected.</p>
 </div>;
}
