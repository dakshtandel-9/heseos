import type { Metadata } from 'next';
import ComingSoon from '../../components/site/ComingSoon';
export const metadata: Metadata = {title:'Blog'};
export default function Page(){return <ComingSoon title="Blog" body="Ideas, guides and news from Heseos. Articles are moving to this site soon." links={[{label:'Book a free demo',href:'/demo'},{label:'Visit heseos.com',href:'https://www.heseos.com'}]}/>;}
