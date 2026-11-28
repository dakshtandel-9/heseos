import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, Bell, Box, Cable, CalendarDays, Check, ChevronRight, CircleCheck, Cog, FileText, Gift, History, House, Image as ImageIcon, LayoutGrid, MapPin, MonitorSmartphone, Package, Play, Plus, QrCode, Radio, Sparkles, UserRound, Wallet, Wrench } from 'lucide-react';
import './app-screens.css';

// Coded mock-ups of the three Heseos apps, drawn from the real screens. Names, amounts and IDs are illustrative.
// Each screen is plain markup so the page can animate it with CSS; .on (set by the tour) restarts a screen's animations.

export function Phone({ children, label, tone = 'dark', className = '' }: { children: ReactNode; label: string; tone?: 'dark' | 'light'; className?: string }) {
 return <div className={`wa-phone wa-${tone} ${className}`} role="img" aria-label={label}>
  <div className="wa-screen" aria-hidden="true">
   <div className="wa-status"><span>9:41</span><i className="wa-island"/><span className="wa-sig"><b/><b/><b/><em/></span></div>
   {children}
  </div>
 </div>;
}

export const Mark = () => <svg className="wa-mark" viewBox="0 0 40 32" aria-hidden="true"><g fill="none" strokeLinecap="round" strokeWidth="3.4"><path d="M4 25a16 16 0 0 1 32 0" stroke="#f0892e"/><path d="M10 24a10 10 0 0 1 20 0" stroke="#ec7430"/><path d="M15.6 23a4.4 4.4 0 0 1 8.8 0" stroke="#e8602a"/><path d="M5 30.5 20 17.5l15 13" stroke="#e5522a" strokeLinecap="square"/></g></svg>;

function Top({ initials }: { initials: string }) {
 return <div className="ws-top"><span className="ws-logo"><Mark/>HESEOS</span><span className="ws-bell"><Bell/><i/></span><span className="ws-av">{initials}</span></div>;
}
function Nav({ items, active }: { items: [string, typeof House][]; active: number }) {
 return <div className="ws-nav">{items.map(([label, Icon], n) => n === 2 ? <span key={label} className="ws-fab"><b><Plus/></b>{label}</span> : <span key={label} className={n === active ? 'on' : undefined}><Icon/>{label}</span>)}</div>;
}
const PARTNER_NAV: [string, typeof House][] = [['Home', House], ['Leads', FileText], ['Add Lead', Plus], ['Rewards', Gift], ['Profile', UserRound]];
const INSTALLER_NAV: [string, typeof House][] = [['Home', House], ['Jobs', Box], ['Add Lead', Plus], ['Earnings', Wallet], ['Profile', UserRound]];
const Row = ({ icon: Icon, title, sub }: { icon: typeof House; title: string; sub: string }) => <div className="ws-row"><span className="ws-ico"><Icon/></span><span><b>{title}</b><small>{sub}</small></span><ChevronRight className="ws-chev"/></div>;
const Head = ({ title }: { title: string }) => <div className="ws-head"><span><ArrowLeft/></span><b>{title}</b></div>;

/* ── Heseos (homeowner app) ── */
export function CustomerScreen() {
 const tiles: [string, boolean][] = [['Ceiling light', true], ['Fan', false], ['Cove light', true], ['TV unit', false]];
 return <div className="ws ws-cust">
  <div className="wc-head"><span>‹ Back</span><b>Living room</b><span>◌ ≡</span></div>
  <div className="wc-meters"><span><b>320 W</b>Power</span><span><b>24°</b>Temperature</span><span><b>52%</b>Humidity</span></div>
  <div className="wc-card wc-chart"><span>Power consumption</span><svg viewBox="0 0 120 34" preserveAspectRatio="none"><path className="wc-line" d="M0 30 C14 30 16 22 28 23 S46 26 56 16 S74 20 84 10 S106 16 120 6" fill="none" stroke="#f0a020" strokeWidth="1.6"/></svg></div>
  <div className="wc-scenes"><b>Scenes</b><span className="on">Movie</span><span>Dinner</span><span>Away</span></div>
  <div className="wc-tiles">{tiles.map(([name, on], n) => <div key={name} className={`wc-tile${on ? ' on' : ''}`} style={{ '--d': `${n * .5}s` } as CSSProperties}><span>{name}</span><i><Sparkles/></i><small>{on ? 'On' : 'Off'}</small></div>)}</div>
  <div className="ws-nav wc-nav"><span><House/>Home</span><span className="on"><Package/>Devices</span><span><Cog/>Scenes</span><span><MonitorSmartphone/>Remotes</span><span><Cog/>Settings</span></div>
 </div>;
}

/* ── Heseos Partner ── */
export function PartnerSignup() {
 return <div className="ws ws-photo" style={{ backgroundImage: 'linear-gradient(180deg,#070d1a55,#070d1a 62%),url(/media/app/partner-studio-v2.webp)' }}>
  <div className="ws-pad ws-signup">
   <h4>Join the Heseos Partner <em>Network</em></h4>
   <p>Create your account and start punching quality leads.</p>
   {['Full Name', 'Mobile Number', 'Pincode (6 digits)', 'Create Password'].map((f, n) => <span key={f} className="ws-input ws-fill" style={{ '--d': `${.25 + n * .35}s` } as CSSProperties}>{f}</span>)}
   <span className="ws-check"><i><Check/></i>I agree to the <em>Terms</em> and <em>Privacy Policy</em></span>
   <span className="ws-btn ws-press">Create Account</span>
  </div>
 </div>;
}
export function PartnerHome() {
 return <div className="ws">
  <Top initials="PS"/>
  <div className="ws-pad">
   <div className="ws-hello"><span><b>Hi, Priya! 👋</b><small>Here’s your lead overview</small></span><span className="ws-pay"><small>This month’s payout</small><b>₹51,000</b></span></div>
   <div className="ws-banner"><b>Smart homes.</b><em>Brighter futures.</em><small>Let’s grow together.</small></div>
   <div className="ws-stats">{[['12', 'Total'], ['3', 'New'], ['5', 'In progress'], ['4', 'Converted']].map(([v, l], n) => <span key={l} style={{ '--d': `${n * .12}s` } as CSSProperties}><b>{v}</b>{l}</span>)}</div>
   <Row icon={Package} title="Browse Catalogue" sub="Products, photos & pricing"/>
   <Row icon={QrCode} title="My QR" sub="Let a customer scan it"/>
   <Row icon={ImageIcon} title="Marketing Studio" sub="Posters with your name"/>
  </div>
  <Nav items={PARTNER_NAV} active={0}/>
 </div>;
}
export function PartnerLead() {
 const fields = [['Property type', '3 BHK Apartment'], ['Configuration', 'Premium'], ['Budget range', '₹2L – ₹4L'], ['When are they planning?', 'Within 30 days'], ['How did you connect?', 'Site visit']];
 return <div className="ws">
  <Head title="Punch New Lead"/>
  <div className="ws-steps"><i className="done">1</i><em className="done"/><i className="at">2</i><em/><i>3</i></div>
  <div className="ws-pad"><div className="ws-card"><b className="ws-card-t">Requirement Details</b>
   {fields.map(([l, v], n) => <label key={l} className="ws-field"><small>{l}</small><span className="ws-input ws-type" style={{ '--d': `${.2 + n * .45}s`, '--n': v.length } as CSSProperties}><span>{v}</span></span></label>)}
  </div><span className="ws-btn ws-press" style={{ '--d': '2.6s' } as CSSProperties}>Next</span></div>
  <Nav items={PARTNER_NAV} active={2}/>
 </div>;
}
export function PartnerSubmitted() {
 return <div className="ws ws-done">
  <div className="ws-pad">
   <span className="ws-tick"><Check/></span>
   <b className="ws-big">Lead Submitted!</b>
   <p>We have received the lead. Our team will connect with the customer soon.</p>
   <span className="ws-id"><small>Lead ID</small><b>L2048 3177</b></span>
   <b className="ws-sub">What happens next?</b>
   {['Our team will verify the lead', 'We will connect with the customer', 'You get updates on lead progress'].map((t, n) => <span key={t} className="ws-next" style={{ '--d': `${.5 + n * .3}s` } as CSSProperties}><Check/>{t}</span>)}
  </div>
  <Nav items={PARTNER_NAV} active={0}/>
 </div>;
}
export function PartnerLeads() {
 const leads = [['Kapoor House', 'Bungalow · Goa', 'New', 'b'], ['Sharma Apartment', '3 BHK · Bengaluru', 'In progress', 'a'], ['Mehta Residence', '4 BHK Villa · Pune', 'Converted', 'g']];
 return <div className="ws">
  <div className="ws-title">My Leads</div>
  <div className="ws-tabs"><span className="on">All (12)</span><span>New (3)</span><span>In Progress (5)</span></div>
  <div className="ws-pad">{leads.map(([n, p, s, c], i) => <div key={n} className="ws-lead" style={{ '--d': `${i * .2}s` } as CSSProperties}><span className="ws-ico"><FileText/></span><span><b>{n}</b><small>{p}</small></span><em className={`ws-chip ws-${c}`}>{s}</em></div>)}
   <div className="ws-track"><small>Mehta Residence</small>{['Submitted', 'Verified', 'Demo', 'Converted'].map((t) => <span key={t}><i/>{t}</span>)}</div>
  </div>
  <Nav items={PARTNER_NAV} active={1}/>
 </div>;
}
export function PartnerRewards() {
 return <div className="ws">
  <div className="ws-title">Rewards &amp; Earnings</div>
  <div className="ws-pad">
   <div className="ws-card ws-payout"><small>This month’s payout</small><b className="ws-count">₹51,000</b><em>15% overall on ₹3,40,000 converted</em><Wallet className="ws-wallet"/></div>
   <div className="ws-card"><b className="ws-card-t">Payout Tiers</b>
    {[['Up to ₹25,00,000', '15%'], ['Up to ₹75,00,000', '10%'], ['Above ₹75,00,000', '8%']].map(([r, p], n) => <span key={r} className={`ws-tier${n ? '' : ' on'}`}><span>{r}</span><b>{p}</b></span>)}
   </div>
  </div>
  <Nav items={PARTNER_NAV} active={3}/>
 </div>;
}

/* ── Heseos Installer ── */
export function InstallerHome() {
 return <div className="ws">
  <div className="ws-hero" style={{ backgroundImage: 'linear-gradient(90deg,#070d1a 30%,#070d1a99 60%,#070d1a33),linear-gradient(0deg,#070d1a,transparent 45%),url(/assets/home.jpg)' }}>
   <Top initials="RK"/>
   <div className="ws-pad"><b className="ws-big">Hi, Ravi! 👋</b><small className="ws-lede">Let’s build smarter spaces together.</small><span className="ws-cov"><MapPin/><span><small>Coverage</small><b>Pune West</b></span></span></div>
  </div>
  <div className="ws-pad">
   <div className="ws-tiles">{[['3', 'Available jobs', 'o'], ['1', 'My active jobs', 'b'], ['18', 'Completed', 'g'], ['₹27,600', 'Fees earned', 'p']].map(([v, l, c], n) => <span key={l} className={`ws-tile ws-${c}`} style={{ '--d': `${n * .12}s` } as CSSProperties}><b>{v}</b>{l}</span>)}</div>
   <div className="ws-find"><span className="ws-ico"><Box/></span><span><b>Find installation jobs</b><small>Claim a job, first come first served</small></span><i><ChevronRight/></i></div>
  </div>
  <Nav items={INSTALLER_NAV} active={0}/>
 </div>;
}
export function InstallerJobs() {
 return <div className="ws">
  <div className="ws-title">Installation Jobs</div>
  <div className="ws-tabs"><span className="on">Available 3</span><span>My jobs 1</span><span>Completed 18</span></div>
  <div className="ws-pad">
   <div className="ws-job ws-drop"><em className="ws-new">NEW · 4.2 km</em><b>3 BHK Apartment · Baner</b>
    <span className="ws-items"><i>Touch panel ×6</i><i>Smart plug ×2</i><i>IR blaster</i></span>
    <span className="ws-meta"><CalendarDays/>Thu · 11:00 AM<b>₹2,400</b></span>
    <span className="ws-claim"><span>Claim job</span><span><Check/>Claimed — it’s yours</span></span></div>
   <div className="ws-job ws-dim"><em className="ws-new ws-old">7.8 km</em><b>Villa · Aundh</b>
    <span className="ws-items"><i>Touch panel ×10</i><i>Door lock</i></span>
    <span className="ws-meta"><CalendarDays/>Sat · 10:00 AM<b>₹4,200</b></span></div>
  </div>
  <Nav items={INSTALLER_NAV} active={1}/>
 </div>;
}
export function InstallerJob() {
 const steps = [['Reach the site', 'Baner · navigate'], ['Install the devices', '6 panels · 2 plugs · IR blaster'], ['Pair with the customer’s app', 'Rooms and scenes set up'], ['Mark the job complete', 'Fee moves to Earnings']];
 return <div className="ws">
  <Head title="My job · J-5531"/>
  <div className="ws-pad">
   <div className="ws-card ws-jobsum"><span className="ws-ico"><Wrench/></span><span><b>3 BHK Apartment · Baner</b><small>Thu · 11:00 AM · Install fee ₹2,400</small></span></div>
   <div className="ws-list">{steps.map(([t, s], n) => <span key={t} className="ws-li" style={{ '--d': `${.3 + n * .55}s` } as CSSProperties}><i><Check/></i><span><b>{t}</b><small>{s}</small></span></span>)}</div>
   <span className="ws-btn ws-press ws-green" style={{ '--d': '2.7s' } as CSSProperties}><CircleCheck/>Job completed</span>
  </div>
  <Nav items={INSTALLER_NAV} active={1}/>
 </div>;
}
export function InstallerEarnings() {
 return <div className="ws">
  <div className="ws-title">Earnings</div>
  <div className="ws-pad">
   <div className="ws-card ws-payout"><small>Installation fees — pending payout</small><b className="ws-count">₹4,800</b><em>₹22,800 paid so far · ₹2,400 in progress</em><Wallet className="ws-wallet"/></div>
   <Row icon={Gift} title="Referral rewards" sub="What you earn on leads you refer"/>
   <Row icon={History} title="Payout history" sub="Everything logged or paid to you"/>
   <b className="ws-sub">Completed installations</b>
   {[['Villa · Aundh', '₹4,200'], ['3 BHK · Baner', '₹2,400']].map(([j, f], n) => <span key={j} className="ws-paid" style={{ '--d': `${.3 + n * .25}s` } as CSSProperties}><span><b>{j}</b><small>{n ? 'Pending' : 'Paid to bank'}</small></span><b>{f}</b></span>)}
  </div>
  <Nav items={INSTALLER_NAV} active={3}/>
 </div>;
}
export function InstallerTraining() {
 const vids = [['touch-panel-series', 'Touch Panel', '6 min'], ['wi-fi-smart-plug', 'Smart Plug', '3 min'], ['smart-ir-blaster', 'IR Blaster', '4 min'], ['glass-door-lock', 'Door Lock', '7 min']];
 return <div className="ws">
  <Head title="Training videos"/>
  <div className="ws-pad"><small className="ws-lede">Install &amp; set up every Heseos device before you reach the site.</small>
   <div className="ws-vids">{vids.map(([img, t, d], n) => <span key={t} className="ws-vid" style={{ '--d': `${n * .15}s` } as CSSProperties}><span style={{ backgroundImage: `url(/media/products/studio/${img}.webp)` }}><Play/></span><b>{t}</b><small>{d}</small></span>)}</div>
  </div>
  <Nav items={INSTALLER_NAV} active={0}/>
 </div>;
}
export function InstallerCoverage() {
 return <div className="ws ws-map">
  <div className="ws-title">Your coverage</div>
  <div className="ws-pad">
   <div className="ws-radar"><i/><i/><i/><MapPin className="ws-pin"/>{[[22, 30], [70, 24], [60, 70]].map(([x, y], n) => <span key={n} className="ws-blip" style={{ left: `${x}%`, top: `${y}%`, '--d': `${.6 + n * .5}s` } as CSSProperties}><Cable/></span>)}</div>
   <span className="ws-cov"><MapPin/><span><small>Coverage</small><b>Pune West</b></span></span>
   <small className="ws-lede">New installations in your area appear in Available as soon as Heseos schedules them.</small>
   <Row icon={Radio} title="Job alerts" sub="Get notified the moment a job lands"/>
   <Row icon={LayoutGrid} title="Skills" sub="Panels · plugs · locks · IR"/>
  </div>
  <Nav items={INSTALLER_NAV} active={0}/>
 </div>;
}
