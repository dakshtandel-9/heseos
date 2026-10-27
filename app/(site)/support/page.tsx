import type { Metadata } from 'next';
import ComingSoon from '../../components/site/ComingSoon';
export const metadata: Metadata = {title:'Support'};
export default function Page(){return <ComingSoon title="Support" body="Help with setup, compatibility and your Heseos app. Support guides are coming soon; until then, our team is a demo request away." links={[{label:'Book a free demo',href:'/demo'},{label:'Visit heseos.com',href:'https://www.heseos.com'}]}/>;}
