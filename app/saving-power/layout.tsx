import type { Metadata } from 'next';
import './saving-power.css';
export const metadata: Metadata = {
 title: 'Saving Power — A Heseos Experience',
 description: 'More life. Less left on. Discover intelligent lighting, energy monitoring and a more thoughtful home in the Heseos Saving Power experience.',
 openGraph:{title:'Saving Power — A Heseos Experience',description:'More life. Less left on. An interactive journey through a more thoughtful home.',type:'website',images:[{url:'/og.png',width:1730,height:909,alt:'Heseos Saving Power — Room by room.'}]},
 twitter:{card:'summary_large_image',title:'Saving Power — A Heseos Experience',description:'More life. Less left on.',images:['/og.png']},
};
export default function SavingPowerLayout({children}:Readonly<{children:React.ReactNode}>){return children;}
