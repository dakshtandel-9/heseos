import type { Metadata } from 'next';
import CompareTable from '../../components/commerce/CompareTable';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'Compare packages'};
export default function ComparePage(){return <><section className="section light"><div className="section-head"><h1 className="headline">Compare every package.</h1><p className="lead">Nine packages for each home size: three ways to upgrade, three levels of control.</p></div><CompareTable/></section>
 <Footnotes notes={['Prices and package contents as listed on heseos.com; the struck-through price is the listed MRP.']}/></>;}
