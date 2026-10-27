import type { Metadata } from 'next';
import CheckoutView from '../../components/commerce/CheckoutView';
export const metadata: Metadata = {title:'Checkout'};
export default function CheckoutPage(){return <section className="section light bag-page"><h1 className="headline">Checkout.</h1><CheckoutView/></section>;}
