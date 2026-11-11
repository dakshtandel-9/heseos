import { BellRing, ChartNoAxesColumn, House, Layers3 } from 'lucide-react';

const FEATURES = [
  { label: 'Home Dashboard', description: 'See the devices in your home, all in one clear view.', icon: House },
  { label: 'Smart Scenes', description: 'Set the right mood for every moment with a tap.', icon: Layers3 },
  { label: 'Security & Alerts', description: 'Stay informed with supported device notifications.', icon: BellRing },
  { label: 'Energy Analytics', description: 'Understand usage and make smarter choices.', icon: ChartNoAxesColumn },
] as const;

export default function AppExperience() {
  return <section className="app-experience" aria-labelledby="app-experience-title">
    <div className="app-experience-inner">
      <div className="app-experience-stage">
        <img className="app-experience-phone" src="/media/products/app-phone.webp" width={801} height={1134} loading="lazy" alt="Genuine Heseos app showing living-room controls and a power-consumption chart" />
      </div>
      <div className="app-experience-copy">
        <p className="app-kicker">App experience</p>
        <h2 id="app-experience-title">Your home,<br />in hand.</h2>
        <p className="app-experience-lead">Everything you need to feel connected to your home, brought together in one simple app.</p>
        <div className="app-experience-features">
          {FEATURES.map((feature, index) => <div className="app-experience-feature" key={feature.label}>
            <span className="app-experience-feature-number" aria-hidden="true">0{index + 1}</span>
            <feature.icon size={25} strokeWidth={1.55} aria-hidden="true" />
            <div><h3>{feature.label}</h3><p>{feature.description}</p></div>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
