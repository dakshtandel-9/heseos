import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://heseos-saving-power.dakshtandel.chatgpt.site'),
 title: {default:'Heseos — The home that listens',template:'%s — Heseos'},
 description: 'Smart touch panels, IR blasters and smart plugs that make your home easier to live in. Step inside the Heseos simulation, then shop or book a free demo.',
 openGraph:{title:'Heseos — The home that listens',description:'Touch panels, IR blasters and smart plugs, working together in one home.',type:'website',images:[{url:'/og.png',width:1730,height:909,alt:'Heseos smart home'}]},
 twitter:{card:'summary_large_image',title:'Heseos — The home that listens',images:['/og.png']},
 icons:{icon:'/favicon.ico',apple:'/apple-touch-icon.png'},
};
export const viewport: Viewport = {themeColor:'#000000',colorScheme:'dark light'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
