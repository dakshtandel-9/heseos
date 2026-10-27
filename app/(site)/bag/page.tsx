import type { Metadata } from 'next';
import BagView from '../../components/commerce/BagView';
export const metadata: Metadata = {title:'Bag'};
export default function BagPage(){return <section className="section light bag-page"><h1 className="headline">Review your bag.</h1><BagView/></section>;}
