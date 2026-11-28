// Lifestyle hero images for the product directory's subcategory pages, keyed by subcategory slug.
// Generated and illustrative (see public/media/browse/SOURCES.md); product cards use generated studio shots.
export const SUBCATEGORY_HEROES:Record<string,{image:string;alt:string}>={
 'touch-panels':{image:'/media/browse/touch-panels-v2.webp',alt:'A horizontal HESEOS black glass touch panel with a rose-gold edge on a walnut wall, with a living room and city view beyond'},
 'retrofit-modules':{image:'/media/browse/retrofit-modules-v3.webp',alt:'An electrician fitting a white HESEOS retrofit module into a clean wall box behind an existing four-switch board in a warm hallway'},
 'modular-switches':{image:'/media/browse/modular-switches-v2.webp',alt:'Two HESEOS black glass smart switch modules in a white wall plate beside a bed, lit by a bedside lamp'},
 'premium-glass-touch-switches':{image:'/media/browse/premium-glass-touch-switches-v2.webp',alt:'Four HESEOS square touch switches in brushed gold, textured black, white leather and black glass on a dark wall'},
 'digital-door-locks':{image:'/media/browse/digital-door-locks-v3.webp',alt:'A black HESEOS smart lock with a lever handle on a teak front door'},
 'smart-vdp-doorbells':{image:'/media/browse/smart-vdp-doorbells.webp',alt:'An indoor video door phone screen beside the front door of a foyer at night'},
 'led-cob-lighting':{image:'/media/browse/led-cob-lighting.webp',alt:'Recessed downlights washing a travertine wall above a low sofa'},
 'elegance-series':{image:'/media/browse/elegance-series.webp',alt:'A black and gold ceiling fan above a living room in afternoon light'},
 'smart-sensors':{image:'/media/browse/smart-sensors.webp',alt:'A ceiling motion sensor above a corridor lit by low floor lights'},
 'smart-plugs':{image:'/media/browse/smart-plugs.webp',alt:'A HESEOS smart plug in a wall switch plate above an oak console'},
 'ir-blasters':{image:'/media/browse/ir-blasters.webp',alt:'A small IR blaster on a media console below a TV and an air conditioner'},
 'energy-meters':{image:'/media/browse/energy-meters.webp',alt:'The HESEOS three-phase energy meter with its current sensors on a stone ledge'},
 'curtain-automation':{image:'/media/browse/curtain-automation.webp',alt:'Motorised curtains opening onto morning light in a bedroom'},
 'screen-control-panels':{image:'/media/browse/screen-control-panels-v2.webp',alt:'A HESEOS screen control panel with a rotary knob on a wall beside a doorway in a living room'},
};

// Wide hero images for the directory's category pages, keyed by category slug (same source and caveats as above).
export const CATEGORY_HEROES:Record<string,{image:string;alt:string}>={
 'smart-switches-panels':{image:'/media/browse/category/smart-switches-panels.webp',alt:'A fingertip tapping a horizontal HESEOS black glass touch panel on a walnut wall, an open-plan living and dining room at night beyond'},
 'smart-door-locks':{image:'/media/browse/category/smart-door-locks.webp',alt:'Two teak front doors with black digital locks in a warmly lit lift lobby'},
 'video-door-phones-doorbells':{image:'/media/browse/category/video-door-phones-doorbells.webp',alt:'A villa entrance at blue hour with a video doorbell beside the front door'},
 'smart-lighting':{image:'/media/browse/category/smart-lighting.webp',alt:'An open-plan living room at night lit by downlights, cove lights and a lit niche'},
 'bldc-fans':{image:'/media/browse/category/bldc-fans.webp',alt:'A wood and gold ceiling fan above a living room opening onto a garden veranda'},
 'security-sensors':{image:'/media/browse/category/security-sensors.webp',alt:'A quiet kitchen at night with a ceiling smoke detector and a wall motion sensor'},
 'smart-home-accessories':{image:'/media/browse/category/smart-home-accessories.webp',alt:'A study corner with an air conditioner, a smart plug and an IR blaster on a shelf'},
 'automation-controls':{image:'/media/browse/category/automation-controls.webp',alt:'Motorised curtains and a wall control screen in a living room at sunset'},
};

// One line per category, shared by the Products page and each category page.
export const CATEGORY_INTROS:Record<string,string>={
 'smart-switches-panels':'Intuitive, elegant control for every room and every space.',
 'smart-door-locks':'Secure, keyless access for modern living.',
 'video-door-phones-doorbells':'See who is at the door, wherever you are.',
 'smart-lighting':'Illuminate your world with intelligent, efficient lighting.',
 'bldc-fans':'Quiet air, smart control and effortless comfort.',
 'security-sensors':'Small sensors that keep watch throughout your home.',
 'smart-home-accessories':'Make the home you have smarter, one device at a time.',
 'automation-controls':'Curtains and blinds that open and close right on cue.',
};

// Closing call-to-action banners, one per category, shared by the category page and its range pages (same source and caveats as above).
export const CATEGORY_BANNERS:Record<string,{image:string;position?:string}>={...Object.fromEntries(
 ['smart-switches-panels','smart-door-locks','video-door-phones-doorbells','smart-lighting','bldc-fans','security-sensors','smart-home-accessories','automation-controls']
  .map(slug=>[slug,{image:`/media/browse/banner/${slug}.webp`}])),
 // Its lock sits high in the frame, so the crop is biased upwards.
 'smart-door-locks':{image:'/media/browse/banner/smart-door-locks-v3.webp',position:'right 20%'}};
