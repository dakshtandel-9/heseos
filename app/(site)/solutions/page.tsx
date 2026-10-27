import type { Metadata } from 'next';
import { SOLUTIONS } from '../../../lib/solutions';
import PromoTile from '../../components/story/PromoTile';
export const metadata: Metadata = {title:'Solutions'};
export default function SolutionsPage(){return <section className="section"><div className="section-head"><h1 className="headline">Smart, for every kind of space.</h1><p className="lead">The same three components, arranged for homes, hotels, buildings and offices.</p></div>
 <div className="promo-grid">{SOLUTIONS.map(s=><PromoTile key={s.slug} title={s.name} body={s.tagline} image={s.image} href={`/solutions/${s.slug}`} cta="Learn more"/>)}</div></section>;}
