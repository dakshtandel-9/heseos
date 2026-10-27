import type { Metadata } from 'next';
import ComingSoon from '../../components/site/ComingSoon';
export const metadata: Metadata = {title:'About'};
export default function Page(){return <ComingSoon title="About" body="Heseos makes smart homes simple: touch panels, IR blasters and smart plugs that work together. Our story is coming to this page soon." links={[{label:'Book a free demo',href:'/demo'},{label:'Visit heseos.com',href:'https://www.heseos.com'}]}/>;}
