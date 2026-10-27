import type { Metadata } from 'next';
import { Suspense } from 'react';
import Simulation from '../../components/simulation/Simulation';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'The Simulation',description:'Walk through a Heseos home and try the Touch Panel, IR Blaster and Smart Plug for yourself.'};
export default function ExperiencePage(){
 return <><Suspense fallback={<div className="sim"/>}><Simulation/></Suspense>
  <Footnotes notes={[
   'The simulation runs in your browser and does not connect to real Heseos devices. Device models are illustrative stand-ins until final product models are approved.',
   'Loads are illustrative examples: lighting 120 W at full brightness, AC 1,200 W, TV and set-top box on the Smart Plug 80 W. Actual consumption depends on your appliances and usage.',
   'Voice uses your browser’s speech service, which may process audio. The microphone stays off until you turn it on; nothing is recorded or stored by this site.',
  ]}/></>;
}
