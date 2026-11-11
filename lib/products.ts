// The full HESEOS catalogue (data/products.json, from the 2026–27 brochure): categories → subcategories → product families → configurations.
// Until the admin panel exists, edit the JSON and run `npm run test:products`.
import data from '../data/products.json';
import type { NavGroup } from './site';
import type { Option, Spec, Variant } from './variants';

export type Faq={q:string;a:string};
export type Link={label:string;href:string};
export type Download={label:string;type:string;href:string};
export type Product={
 slug:string;subcategory:string;name:string;code?:string;tagline:string;summary:string;image:string;gallery?:string[];badges?:string[];
 highlights?:string[];features:{title:string;body:string}[];options:Option[];variants:Variant[];specs:Spec[];
 worksWith?:string[];installation?:string[];warranty?:string;attributes:Record<string,string[]>;related:string[];links?:Link[];
 brochurePages:number[];review?:string[];
};
export type Subcategory={slug:string;category:string;name:string;tagline:string;description:string;image:string;brochurePages:number[];filters:{key:string;label:string}[];faqs:Faq[]};
export type Category={slug:string;name:string;shortName:string;tagline:string;description:string;image:string};
export type Catalog={
 meta:{version:string;source:string;company:string;tagline:string;contact:{email:string;website:string;whatsapp:string;phone:string};disclaimer:string;worksWith:string[];downloads:Download[];stats:{value:string;label:string}[];faqs:Faq[]};
 categories:Category[];subcategories:Subcategory[];products:Product[];
};

// JSON imports infer per-record shapes that TypeScript can't compare with these types;
// scripts/verify-products.mjs checks the catalogue and its image paths.
export const CATALOG=data as unknown as Catalog;
export const {meta:CATALOG_META,categories:CATEGORIES,subcategories:SUBCATEGORIES,products:FAMILIES}=CATALOG;

export const category=(slug:string)=>CATEGORIES.find(c=>c.slug===slug);
export const subcategory=(category:string,slug:string)=>SUBCATEGORIES.find(s=>s.category===category&&s.slug===slug);
export const family=(slug:string)=>FAMILIES.find(p=>p.slug===slug);
export const subcategoriesOf=(category:string)=>SUBCATEGORIES.filter(s=>s.category===category);
export const familiesOf=(subcategory:string)=>FAMILIES.filter(p=>p.subcategory===subcategory);
export const familiesInCategory=(category:string)=>subcategoriesOf(category).flatMap(s=>familiesOf(s.slug));

// Every family belongs to exactly one subcategory, and every subcategory to one category.
export function trail(p:Product){const s=SUBCATEGORIES.find(x=>x.slug===p.subcategory)!;return {subcategory:s,category:category(s.category)!};}
export const categoryHref=(c:{slug:string})=>`/products/${c.slug}`;
export const subcategoryHref=(s:Subcategory)=>`/products/${s.category}/${s.slug}`;
export const familyHref=(p:Product)=>{const {subcategory:s}=trail(p);return `${subcategoryHref(s)}/${p.slug}`;};

// Explicit related families first, then the rest of the subcategory, never the family itself.
export function relatedTo(p:Product,limit=4){
 const slugs=[...p.related,...familiesOf(p.subcategory).map(x=>x.slug)].filter((s,i,all)=>s!==p.slug&&all.indexOf(s)===i);
 return slugs.map(family).filter((x):x is Product=>!!x).slice(0,limit);
}

// A family card: what listings, filters and search need, small enough to hand to client components.
export type FamilyCard={slug:string;href:string;name:string;code?:string;tagline:string;image:string;badges:string[];configurations:number;models:string[];subcategory:string;category:string;attributes:Record<string,string[]>};
export function familyCard(p:Product):FamilyCard{
 const {subcategory:s,category:c}=trail(p);
 return {slug:p.slug,href:familyHref(p),name:p.name,code:p.code,tagline:p.tagline,image:p.image,badges:p.badges??[],configurations:p.variants.length,
  models:p.variants.flatMap(v=>v.model?[v.model]:[]),subcategory:s.name,category:c.shortName,attributes:p.attributes};
}

// Filters for a listing: only those that tell the families apart, with values in first-seen order.
export type Facet={key:string;label:string;values:string[]};
export function facetsFor(s:Subcategory,families:Product[]):Facet[]{
 return s.filters.map(f=>({...f,values:[...new Set(families.flatMap(p=>p.attributes[f.key]??[]))]}))
  .filter(f=>f.values.length>0&&families.some(p=>(p.attributes[f.key]??[]).length!==f.values.length));
}

// The Products mega menu: every category, with its subcategories.
export const productNavGroups=():NavGroup[]=>CATEGORIES.map(c=>({title:c.shortName,href:categoryHref(c),links:subcategoriesOf(c.slug).map(s=>({label:s.name,href:subcategoryHref(s)}))}));

export const counts=()=>({categories:CATEGORIES.length,subcategories:SUBCATEGORIES.length,families:FAMILIES.length,configurations:FAMILIES.reduce((n,p)=>n+p.variants.length,0)});
