import type { Metadata } from 'next';
import { Suspense } from 'react';
import Experience from '../../components/experience/Experience';
import './experience.css';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'The Simulation',description:'Step inside a connected apartment. Switch the lights room by room, run the fan, TV, air conditioner and curtains, and try every fitted HESEOS device.'};
export default function ExperiencePage(){
 return <><Suspense fallback={<div className="xp"/>}><Experience/></Suspense>
  <Footnotes notes={[
   'The simulation runs in your browser and does not connect to real Heseos devices. The rooms are illustrative computer-generated images, and marker positions show where a device would typically be fitted.',
   'Loads are illustrative examples: lighting 24 W per room at full brightness, each ceiling fan up to 35 W, AC 1,200 W, TV and set-top box on the Smart Plug 80 W. Actual consumption depends on your appliances and usage.',
   'Voice uses your browser’s speech service, which may process audio. The microphone stays off until you turn it on; nothing is recorded or stored by this site.',
  ]}/></>;
}
