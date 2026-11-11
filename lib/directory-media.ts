// Lifestyle hero images for the product directory's subcategory pages, keyed by subcategory slug.
// Generated and illustrative (see public/media/browse/SOURCES.md); product cards use generated studio shots.
export const SUBCATEGORY_HEROES:Record<string,{image:string;alt:string}>={
 'touch-panels':{image:'/media/browse/touch-panels.webp',alt:'A black glass touch panel on a walnut wall, with a living room and city view beyond'},
 'retrofit-modules':{image:'/media/browse/retrofit-modules.webp',alt:'A white switchboard in a warmly lit hallway above a teak console'},
 'modular-switches':{image:'/media/browse/modular-switches.webp',alt:'A white modular switch plate beside a bed, lit by a bedside lamp'},
 'premium-glass-touch-switches':{image:'/media/browse/premium-glass-touch-switches.webp',alt:'Four touch switch plates in brushed metal, stone, leather and glass on a dark wall'},
 'digital-door-locks':{image:'/media/browse/digital-door-locks.webp',alt:'A black digital lock with a lever handle on a teak front door'},
 'smart-vdp-doorbells':{image:'/media/browse/smart-vdp-doorbells.webp',alt:'An indoor video door phone screen beside the front door of a foyer at night'},
 'led-cob-lighting':{image:'/media/browse/led-cob-lighting.webp',alt:'Recessed downlights washing a travertine wall above a low sofa'},
 'elegance-series':{image:'/media/browse/elegance-series.webp',alt:'A black and gold ceiling fan above a living room in afternoon light'},
 'smart-sensors':{image:'/media/browse/smart-sensors.webp',alt:'A ceiling motion sensor above a corridor lit by low floor lights'},
 'smart-plugs':{image:'/media/browse/smart-plugs.webp',alt:'A white smart plug in a wall socket below an air conditioner'},
 'ir-blasters':{image:'/media/browse/ir-blasters.webp',alt:'A small IR blaster on a media console below a TV and an air conditioner'},
 'energy-meters':{image:'/media/browse/energy-meters.webp',alt:'A neatly wired distribution board with an energy meter'},
 'curtain-automation':{image:'/media/browse/curtain-automation.webp',alt:'Motorised curtains opening onto morning light in a bedroom'},
 'screen-control-panels':{image:'/media/browse/screen-control-panels.webp',alt:'A wall-mounted control screen beside a doorway in a living room'},
};

// Wide hero images for the directory's category pages, keyed by category slug (same source and caveats as above).
export const CATEGORY_HEROES:Record<string,{image:string;alt:string}>={
 'smart-switches-panels':{image:'/media/browse/category/smart-switches-panels.webp',alt:'Black glass touch panels on a walnut wall in an open-plan living and dining room at dusk'},
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
 'automation-controls':'Bring everyday routines together in one connected home.',
};

// Closing call-to-action banners, one per category, shared by the category page and its range pages (same source and caveats as above).
export const CATEGORY_BANNERS:Record<string,{image:string}>=Object.fromEntries(
 ['smart-switches-panels','smart-door-locks','video-door-phones-doorbells','smart-lighting','bldc-fans','security-sensors','smart-home-accessories','automation-controls']
  .map(slug=>[slug,{image:`/media/browse/banner/${slug}.webp`}]));
