// Product configurations: what the configurator needs on the client, without loading the whole catalogue.
export type Spec={label:string;value:string};
export type OptionValue={id:string;label:string;swatch?:string;image?:string};
// `confirm` marks an option the brochure shows for the family but not per configuration; it is chosen on the quote and confirmed by HESEOS.
export type Option={key:string;label:string;confirm?:boolean;values:OptionValue[]};
// `images` are a configuration's own photos; the product page shows them before the family's shared photos.
export type Variant={id:string;label:string;model?:string;options:Record<string,string>;specs?:Spec[];images?:string[]};

// A configuration matches when every option it names is selected; options it does not name (finish, collection) stay open.
export const matchVariant=(variants:Variant[],selected:Record<string,string>)=>variants.find(v=>Object.entries(v.options).every(([k,id])=>selected[k]===id));
