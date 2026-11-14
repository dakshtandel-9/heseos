// Partner programme content for /partners. Figures match the About page (HESEOS 2026–27 brochure, pages 4–5);
// commercial terms are deliberately not stated here: they depend on partner type and region and are shared on a call.
export type PartnerTrackId='dealer'|'designer'|'builder'|'integrator';
// The /partners scroll story follows one villa from sketch to switch-on, a partnership per chapter: stage names the chapter and image is its scene.
// The villa images are generated and illustrative.
export type PartnerTrack={id:PartnerTrackId;label:string;short:string;stage:string;cta:string;title:string;who:string;image:string;alt:string;gets:string[]};

export const PARTNER_TRACKS:PartnerTrack[]=[
 {id:'designer',label:'Architects & interior designers',stage:'Design',short:'Specify Heseos',cta:'Become a design partner',title:'Design spaces that respond to people.',
  who:'Practices designing homes, villas, hospitality and workspaces for their clients.',
  image:'/media/partners/sketch.webp',alt:'An architect’s pencil sketch of a contemporary villa with a long pool',
  gets:['Guidance on panel placement, finishes and scenes','Wiring and specification advice early in the project','Client walkthroughs in the Heseos Simulation','Recognition for every project you bring us']},
 {id:'builder',label:'Builders & developers',stage:'Build',short:'Build with Heseos',cta:'Become a project partner',title:'Hand over homes that are smart from day one.',
  who:'Residential towers, gated communities, villa projects and commercial developments.',
  image:'/media/partners/shell.webp',alt:'The same villa under construction: a bare concrete frame, brick walls and scaffolding',
  gets:['Project pricing for multi-unit developments','A smart-ready specification for every unit type','Installation and handover support on site','A show-flat setup that helps buyers say yes']},
 {id:'dealer',label:'Dealers & retailers',stage:'Supply',short:'Sell Heseos',cta:'Become a retail partner',title:'Bring smart living to your showroom.',
  who:'Electrical, lighting and home-improvement stores, showrooms and regional distributors.',
  image:'/media/home/gen/connected-home.webp',alt:'A living room fitted with a Heseos glass touch panel, smart door lock, smart plug and ceiling fan',
  gets:['Partner pricing across the full Heseos range','Display and demo units for your showroom','Sales and product training for your team','Brochures, displays and listing support']},
 {id:'integrator',label:'System integrators & electricians',stage:'Install',short:'Install Heseos',cta:'Become an installation partner',title:'Deliver automation your clients will love.',
  who:'Installers, electrical contractors and integrators working across homes, hotels and offices.',
  image:'/media/partners/lit.webp',alt:'The finished villa at dusk with every room lit',
  gets:['Installation and commissioning training','Technical help from Heseos engineers','Priority access to stock and spares','Project enquiries from your city']}
];

export const PARTNER_STATS=[
 {value:'15+',label:'Years of industry experience'},
 {value:'100,000+',label:'Devices installed'},
 {value:'9,000+',label:'Happy customers'},
 {value:'10+',label:'Dealers across India'},
];

export const PARTNER_BENEFITS=[
 {icon:'layers',title:'One complete ecosystem',body:'Panels, locks, lighting, fans, security and accessories from one brand, all in one app. One supplier for the whole project.'},
 {icon:'flag',title:'Made in India',body:'Products designed and made in India, backed by a team that understands Indian homes, wiring and buyers.'},
 {icon:'graduation',title:'Training that sticks',body:'Hands-on product, sales and installation training, so your team can sell, specify and install with confidence.'},
 {icon:'sparkles',title:'Demos that close',body:'Walk clients through a connected home in the Heseos Simulation before a single wire is laid.'},
 {icon:'headset',title:'A team behind you',body:'A partnerships contact for your business and engineers on call when a project needs them.'},
 {icon:'megaphone',title:'Grow together',body:'Co-branded material, product imagery and enquiries shared with partners in the region.'},
] as const;

export const PARTNER_STEPS=[
 {title:'Apply',body:'Tell us about your business in a two-minute form.'},
 {title:'Meet',body:'A conversation with our partnerships team about your market and goals.'},
 {title:'Onboard',body:'Training, partner terms and demo material for your team.'},
 {title:'Grow',body:'Launch your first projects with Heseos support at every step.'},
];

export const PARTNER_FAQ=[
 {q:'Who can become a Heseos partner?',a:'Dealers and retailers, architects and interior designers, builders and developers, and system integrators or electrical contractors. If your work touches how homes, hotels or offices are built, designed or fitted out, we would like to hear from you.'},
 {q:'Does it cost anything to apply?',a:'No. Applying is free. Partner terms depend on the type of partnership and your region, and we share them with you during our first conversation.'},
 {q:'Do I need experience with home automation?',a:'No. We train your team on the products, the Heseos app, selling and installation. Experience with electrical or interior work helps, but it is not required.'},
 {q:'Which cities do you work in?',a:'Heseos has dealers across India and has delivered international projects. Apply from wherever you are; we will tell you how we can support your region.'},
 {q:'What happens after I apply?',a:'Our partnerships team reviews every application and contacts you on the phone number you share, to set up a conversation about your business.'},
];
