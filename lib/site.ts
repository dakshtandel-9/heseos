// One source for the global navigation, its flyouts, the footer and the company's contact details.
export type NavLink={label:string;href:string};
export type NavGroup={title:string;href?:string;big?:boolean;links:NavLink[]};
export type NavItem={label:string;href:string;groups?:NavGroup[]};

// Contact details, social profiles and app listings as published on heseos.com (fetched 2026-11-02).
export const CONTACT={email:'support@heseos.com',whatsapp:'https://api.whatsapp.com/send?phone=918265077639&text=Hello%20Heseos',website:'https://www.heseos.com'};
export const SOCIAL=[
 {id:'linkedin',label:'LinkedIn',href:'https://www.linkedin.com/company/heseos-india/'},
 {id:'instagram',label:'Instagram',href:'https://www.instagram.com/heyheseos/'},
 {id:'youtube',label:'YouTube',href:'https://www.youtube.com/@Heseos'},
 {id:'facebook',label:'Facebook',href:'https://www.facebook.com/heseos'},
] as const;
export const APPS={appStore:'https://apps.apple.com/us/app/heseos/id6443842270',googlePlay:'https://play.google.com/store/apps/details?id=com.heseos.smart'};
export const LEGAL:NavLink[]=[
 {label:'Privacy Policy',href:'https://www.heseos.com/privacy-policies'},
 {label:'Terms & Conditions',href:'https://www.heseos.com/terms-condition'},
 {label:'Refund Policy',href:'https://www.heseos.com/return-refund-cancellation-policies'},
];

export const NAV:NavItem[]=[
 // The site layout fills in the mega menu from the eight-category product directory.
 {label:'Products',href:'/products'},
 {label:'Simulation',href:'/experience',groups:[
  {title:'Step inside',big:true,links:[{label:'The Heseos Simulation',href:'/experience'}]},
 ]},
 {label:'App',href:'/app'},
 {label:'About',href:'/about'},
 {label:'Support',href:'/support'},
];
export const FOOTER:NavGroup[]=[
 {title:'Products',links:[{label:'Touch Panels',href:'/products/browse/smart-switches-panels/touch-panels'},{label:'Door Locks',href:'/products/browse/smart-door-locks/digital-door-locks'},{label:'Smart Lighting',href:'/products/browse/smart-lighting/led-cob-lighting'},{label:'Smart Fans',href:'/products/browse/bldc-fans/elegance-series'},{label:'View All Products',href:'/products'}]},
 {title:'Support',links:[{label:'Help & Support',href:'/support'},{label:'Book a Free Demo',href:'/demo'},{label:'Heseos App',href:'/app'}]},
 {title:'Company',links:[{label:'About Us',href:'/about'},{label:'Our solutions',href:'/about#spaces'},{label:'The Simulation',href:'/experience'},{label:'Contact Us',href:`mailto:${CONTACT.email}`}]},
];
// External, mail and phone links are full page loads.
export const isDocumentLink=(href:string)=>/^(https?|mailto|tel):/.test(href);
