// Partner programme content for /partners. Figures match the About page (HESEOS 2026–27 brochure, pages 4–5).
// Commission slabs live with the payout estimator (app/components/app/PayoutEstimator.tsx); other commercial terms
// depend on partner type and region and are shared on a call.
export type PartnerTrackId='dealer'|'designer'|'builder'|'integrator';

// The partnership types offered on the application form. A link with data-track="<id>" preselects one.
export const PARTNER_TRACKS:{id:PartnerTrackId;label:string}[]=[
 {id:'designer',label:'Architects & interior designers'},
 {id:'builder',label:'Builders & developers'},
 {id:'dealer',label:'Dealers & retailers'},
 {id:'integrator',label:'System integrators & electricians'},
];

export const PARTNER_STATS=[
 {value:'15+',label:'Years of industry experience'},
 {value:'100,000+',label:'Devices installed'},
 {value:'9,000+',label:'Happy customers'},
 {value:'10+',label:'Dealers across India'},
];

export const PARTNER_FAQ=[
 {q:'Who can become a Heseos partner?',a:'Dealers and retailers, architects and interior designers, builders and developers, and system integrators or electrical contractors. If your work touches how homes, hotels or offices are built, designed or fitted out, we would like to hear from you.'},
 {q:'Which app is mine: Partner or Installer?',a:'Heseos Partner is for people who bring homes: you punch leads, share the catalogue and posters, track every lead and earn commission on converted sales. Heseos Installer is for electricians and technicians: you set your coverage area, claim installation jobs nearby, install and hand over, and earn a fee for every job.'},
 {q:'Can installers refer homes too?',a:'Yes. Installers carry a referral link and QR code just like partners. Punch a lead from the + button in the Installer app and earn referral rewards when it converts.'},
 {q:'Does it cost anything to apply?',a:'No. Applying is free. Partner terms depend on the type of partnership and your region, and we share them with you during our first conversation.'},
 {q:'Do I need experience with home automation?',a:'No. We train your team on the products, the Heseos apps, selling and installation, and the Installer app has a training video for every device. Experience with electrical or interior work helps, but it is not required.'},
 {q:'Which cities do you work in?',a:'Heseos has dealers across India and has delivered international projects. Apply from wherever you are; we will tell you how we can support your region.'},
 {q:'What happens after I apply?',a:'Our partnerships team reviews every application and contacts you on the phone number you share, to set up a conversation about your business.'},
];
