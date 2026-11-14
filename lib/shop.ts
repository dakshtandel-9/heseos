// The shop: every directory product, grouped into aisles (one per category). Heseos sells on quotation, so the bag
// collects products and quantities and is sent as one quote request; nothing here carries a price.
import { PRODUCT_DIRECTORY, directoryProductHref, directoryProductImage, directorySource } from './product-directory';
import { CATEGORY_INTROS } from './directory-media';

export type ShopItem={slug:string;name:string;range:string;tagline:string;image:string;href:string;configurations:number};
export type ShopAisle={slug:string;name:string;intro:string;items:ShopItem[]};

export const SHOP_AISLES:ShopAisle[]=PRODUCT_DIRECTORY.map(c=>({
 slug:c.slug,name:c.name,intro:CATEGORY_INTROS[c.slug]??'',
 items:c.subcategories.flatMap(s=>s.products.map(p=>{const f=directorySource(p);return {slug:p.slug,name:p.name,range:s.name,tagline:f.tagline,image:directoryProductImage(p),href:directoryProductHref(p),configurations:Math.max(1,f.variants.length)};})),
}));
export const SHOP_COUNT=SHOP_AISLES.reduce((n,a)=>n+a.items.length,0);
