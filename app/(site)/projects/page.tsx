import type { Metadata } from 'next';
import ComingSoon from '../../components/site/ComingSoon';
export const metadata: Metadata = {title:'Projects'};
export default function Page(){return <ComingSoon title="Projects" body="Homes, hotels and offices running on Heseos. Project stories are coming soon." links={[{label:'Book a free demo',href:'/demo'},{label:'Visit heseos.com',href:'https://www.heseos.com'}]}/>;}
