import type { Metadata } from 'next';
import BuildWizard from '../../components/commerce/BuildWizard';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'Build your smart home'};
export default function BuildPage(){return <><section className="section light"><div className="section-head"><h1 className="headline">Build your smart home.</h1><p className="lead">Three questions. One package, with the reason for every part of it.</p></div><BuildWizard/></section>
 <Footnotes notes={['Recommendations use the Heseos Smart Packages as listed on heseos.com. A free demo confirms the right setup for your wiring and rooms.']}/></>;}
