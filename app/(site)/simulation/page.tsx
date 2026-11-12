import type { Metadata } from 'next';
import { Suspense } from 'react';
import Simulation from '../../components/simulation/Simulation';
import './simulation.css';
import { Footnotes } from '../../components/site/Footer';
export const metadata: Metadata = {title:'3D Simulation',description:'Walk through Apartment 2 in 3D. Switch each room’s lights, run the fans, TV, air conditioner and curtains, and try every fitted HESEOS device.'};
export default function SimulationPage(){
 return <><Suspense fallback={<div className="sim-story"/>}><Simulation/></Suspense>
  <Footnotes notes={[
   'The simulation runs in your browser and does not connect to real Heseos devices. The apartment is an illustrative 3D model, and device positions show where a device would typically be fitted.',
   'Loads are illustrative examples: lighting 24 W per room at full brightness, each ceiling fan up to 35 W, AC 1,200 W, TV and set-top box on the Smart Plug 80 W. Actual consumption depends on your appliances and usage.',
   'Voice uses your browser’s speech service, which may process audio. The microphone stays off until you turn it on; nothing is recorded or stored by this site.',
  ]}/></>;
}
