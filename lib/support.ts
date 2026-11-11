// Help centre content for /support. Product answers come from the catalogue FAQs (data/products.json); the rest keeps to
// what the site already states: the free demo, installation, the app pages, the contact details and the published policies.
import { CATALOG_META, SUBCATEGORIES } from './products';
import { CONTACT, LEGAL } from './site';
import type { Link } from './products';

export type SupportIcon='start'|'app'|'switches'|'security'|'lighting'|'automation'|'warranty';
export type SupportAnswer={q:string;a:string;about?:string;link?:Link};
export type SupportTopic={id:string;icon:SupportIcon;title:string;blurb:string;answers:SupportAnswer[]};

// Catalogue FAQs for the given categories, each labelled with the subcategory it answers for.
const catalogAnswers=(...categories:string[]):SupportAnswer[]=>SUBCATEGORIES
 .filter(s=>categories.includes(s.category))
 .flatMap(s=>s.faqs.map(f=>({q:f.q.trim(),a:f.a.trim(),about:s.name})));

const [priceFaq,picturesFaq,voiceFaq]=CATALOG_META.faqs;
const refund=LEGAL.find(l=>l.label==='Refund Policy')!;

export const WHATSAPP_DISPLAY=CATALOG_META.contact.whatsapp.replace(/^\+91(\d{5})(\d{5})$/,'+91 $1 $2');

export const SUPPORT_TOPICS:SupportTopic[]=[
 {id:'getting-started',icon:'start',title:'Orders & installation',blurb:'Demos, quotes, wiring and getting your devices fitted.',answers:[
  {q:'How do I get started?',a:'Book a free demo. We see your space with you, then recommend a package that fits your rooms and wiring.',link:{label:'Book a free demo',href:'/demo'}},
  priceFaq,
  {q:'Do you install the devices?',a:'Yes. Your devices are installed, then set up and connected in the Heseos app.'},
  {q:'Will I need to rewire my home?',a:'Often not. Retrofit modules fit inside your existing switchboard, modular switches keep your existing plates, and the Smart Plug needs no wiring at all. Touch panels replace the switchboard plate and switches. We recommend the right option at your demo.'},
  picturesFaq,
 ]},
 {id:'app',icon:'app',title:'App & voice',blurb:'The Heseos app, scenes, alerts and voice assistants.',answers:[
  {q:'Which phones does the Heseos app work on?',a:'iPhone and Android. Download it free from the App Store or Google Play.',link:{label:'About the Heseos app',href:'/app'}},
  voiceFaq,
  {q:'Can I control my home when I’m away?',a:'Yes. Check your connected home and manage supported devices from the app wherever you are.'},
  {q:'Can several devices run together?',a:'Yes. Bring connected devices together in a scene and activate them with one tap.'},
 ]},
 {id:'switches',icon:'switches',title:'Switches & panels',blurb:'Touch panels, retrofit modules, modular and glass switches.',answers:catalogAnswers('smart-switches')},
 {id:'security',icon:'security',title:'Locks & security',blurb:'Door locks, video door phones and sensors.',answers:catalogAnswers('smart-security')},
 {id:'lighting-fans',icon:'lighting',title:'Lighting & fans',blurb:'COB downlights, tubelights and BLDC fans.',answers:catalogAnswers('smart-lighting','smart-fans')},
 {id:'automation',icon:'automation',title:'Plugs & automation',blurb:'Smart plugs, IR blasters, energy meters and curtains.',answers:catalogAnswers('home-automation')},
 {id:'warranty',icon:'warranty',title:'Warranty & returns',blurb:'Cover, returns, refunds and our policies.',answers:[
  {q:'What warranty do Heseos fans have?',a:'Elegance BLDC fans carry a 3 year warranty.',about:'Elegance BLDC Fans'},
  {q:'How do I check the warranty on another product?',a:`Write to ${CONTACT.email} with the product and your invoice, and our team will confirm the cover that applies.`,link:{label:'Email support',href:`mailto:${CONTACT.email}?subject=Warranty%20question`}},
  {q:'How do returns, refunds and cancellations work?',a:'They follow the Heseos return, refund and cancellation policy.',link:{label:'Read the Refund Policy',href:refund.href}},
 ]},
];

// Downloads without a hosted file yet are requested from support by email.
export const SUPPORT_DOWNLOADS=CATALOG_META.downloads.map(d=>({...d,href:d.href||`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Request: ${d.label}`)}`,onRequest:!d.href}));
