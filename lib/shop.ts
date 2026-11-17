// The shop: every directory product, grouped into aisles (one per category). Heseos sells on quotation, so the bag
// collects products and quantities and is sent as one quote request; nothing here carries a price.
import { PRODUCT_DIRECTORY, directoryCategoryHref, directoryProductHref, directoryProductImage, directorySource, directorySubcategoryHref } from './product-directory';
import { CATEGORY_INTROS } from './directory-media';

export type ShopItem={slug:string;name:string;range:string;tagline:string;image:string;href:string;configurations:number};
export type ShopAisle={slug:string;name:string;intro:string;href:string;items:ShopItem[]};

export const SHOP_AISLES:ShopAisle[]=PRODUCT_DIRECTORY.map(c=>({
 slug:c.slug,name:c.name,intro:CATEGORY_INTROS[c.slug]??'',
 href:c.subcategories.length===1?directorySubcategoryHref(c,c.subcategories[0]):directoryCategoryHref(c),
 items:c.subcategories.flatMap(s=>s.products.map(p=>{const f=directorySource(p);return {slug:p.slug,name:p.name,range:s.name,tagline:f.tagline,image:directoryProductImage(p),href:directoryProductHref(p),configurations:Math.max(1,f.variants.length)};})),
}));
export const SHOP_COUNT=SHOP_AISLES.reduce((n,a)=>n+a.items.length,0);
