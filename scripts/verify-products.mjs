import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
// Checks data/products.json (edited by hand until the admin panel exists) and the helpers in lib/products.ts.
const json=fs.readFileSync(new URL('../data/products.json',import.meta.url),'utf8');
const load=(name,patch=c=>c)=>import('data:text/javascript;base64,'+Buffer.from(patch(ts.transpileModule(fs.readFileSync(new URL(`../lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText)).toString('base64'));
const lib=await load('products',c=>c.replace(/import data from '\.\.\/data\/products\.json';/,`const data=${json};`)),{matchVariant}=await load('variants'),{FOOTER}=await load('site');
const {CATEGORIES,SUBCATEGORIES,FAMILIES,CATALOG_META}=lib;
let checks=0;const check=(ok,msg)=>{assert.ok(ok,msg);checks++;};
const unique=(list,what)=>check(new Set(list).size===list.length,`${what} are unique: ${list.filter((x,i)=>list.indexOf(x)!==i)}`);
const exists=src=>fs.existsSync(new URL(`../public${src}`,import.meta.url));
const SLUG=/^[a-z0-9]+(-[a-z0-9]+)*$/;

// Structure: every record links to a real parent, slugs are URL-safe and unique, and no category shadows a legacy product page.
unique(CATEGORIES.map(c=>c.slug),'category slugs');unique(SUBCATEGORIES.map(s=>s.slug),'subcategory slugs');unique(FAMILIES.map(p=>p.slug),'family slugs');
for(const c of CATEGORIES){check(SLUG.test(c.slug),c.slug);check(!['touch-panel','ir-blaster','smart-plug'].includes(c.slug),`${c.slug} clashes with a legacy product page`);check(SUBCATEGORIES.some(s=>s.category===c.slug),`${c.slug} has subcategories`);check(exists(c.image),`${c.slug} image ${c.image}`);}
check(CATEGORIES.every(c=>c.image.startsWith('/media/browse/')),'category images use generated browse artwork');
for(const s of SUBCATEGORIES){
 check(SLUG.test(s.slug)&&CATEGORIES.some(c=>c.slug===s.category),`${s.slug} category`);
 check(FAMILIES.some(p=>p.subcategory===s.slug),`${s.slug} has families`);check(exists(s.image),`${s.slug} image ${s.image}`);
 for(const f of s.filters)check(FAMILIES.some(p=>p.subcategory===s.slug&&p.attributes[f.key]?.length),`${s.slug} filter ${f.key} has values`);
}
check(SUBCATEGORIES.every(s=>s.image.startsWith('/media/browse/')),'subcategory images use generated browse artwork');

// Families: options, configurations, attributes, images and links are all consistent.
for(const p of FAMILIES){
 const at=p.slug;
 check(p.image.startsWith('/media/products/studio/'),`${at} uses its generated studio image`);
 check(new Set([p.image,...(p.gallery??[]),...(p.variants[0]?.images??[])]).size<=8,`${at} first model gallery has at most eight images`);
 check(SLUG.test(p.slug)&&SUBCATEGORIES.some(s=>s.slug===p.subcategory),`${at} subcategory`);
 check(p.name&&p.tagline&&p.summary&&p.features.length&&p.specs.length,`${at} has copy and specs`);
 for(const src of [p.image,...(p.gallery??[]),...p.options.flatMap(o=>o.values.flatMap(v=>v.image?[v.image]:[]))])check(exists(src),`${at} image ${src}`);
 // A configuration's own photos fill the first two gallery places; with the shared photos, eight at most.
 for(const v of p.variants.filter(v=>v.images)){
  check(v.images.length<=2&&new Set([...v.images,p.image,...(p.gallery??[])]).size<=8,`${at} ${v.id} gallery has at most two own and eight images in all`);
  for(const src of v.images)check(exists(src),`${at} ${v.id} image ${src}`);
 }
 unique(p.options.map(o=>o.key),`${at} option keys`);
 for(const o of p.options)unique(o.values.map(v=>v.id),`${at} ${o.key} values`);
 check(p.variants.length>0,`${at} has configurations`);unique(p.variants.map(v=>v.id),`${at} configuration ids`);
 unique(p.variants.map(v=>JSON.stringify(Object.entries(v.options).sort())),`${at} configuration options`);
 for(const v of p.variants)for(const [k,id] of Object.entries(v.options)){
  const o=p.options.find(x=>x.key===k);
  check(o&&!o.confirm&&o.values.some(x=>x.id===id),`${at} ${v.id} option ${k}=${id}`);
 }
 // Every value of an option that defines configurations leads to one, so the picker never offers a dead end.
 for(const o of p.options.filter(o=>!o.confirm))for(const val of o.values)check(p.variants.some(v=>v.options[o.key]===val.id),`${at} ${o.key}=${val.id} has a configuration`);
 const sub=SUBCATEGORIES.find(s=>s.slug===p.subcategory);
 for(const k of Object.keys(p.attributes))check(sub.filters.some(f=>f.key===k),`${at} attribute ${k} is a ${sub.slug} filter`);
 for(const r of p.related)check(r!==p.slug&&FAMILIES.some(x=>x.slug===r),`${at} related ${r}`);
 for(const l of p.links??[])check(l.href.startsWith('/'),`${at} link ${l.href}`);
}
check(/^\S+@\S+\.\S+$/.test(CATALOG_META.contact.email),'contact email');

// The brochure plan: 5 categories, 15 subcategories, 37 families, 106 configurations.
assert.deepEqual(lib.counts(),{categories:5,subcategories:15,families:37,configurations:106});checks++;
assert.deepEqual(CATEGORIES.map(c=>lib.subcategoriesOf(c.slug).length),[5,4,3,2,1]);checks++;

// Helpers: URLs, related families, filters and configuration matching.
const edge=lib.family('edge-panel-series');
assert.equal(lib.familyHref(edge),'/products/smart-switches/touch-panels/edge-panel-series');checks++;
assert.equal(matchVariant(edge.variants,{modules:'4',finish:'black'})?.id,'tea-4m');checks++;
assert.equal(matchVariant(edge.variants,{finish:'black'}),undefined);checks++;
const touch=lib.family('touch-panel-series');
const twoModule=matchVariant(touch.variants,{modules:'2'}),fourModule=matchVariant(touch.variants,{modules:'4'});
check(twoModule?.images?.length===2&&fourModule?.images?.length===2&&twoModule.images[0]!==fourModule.images[0],'touch-panel models lead with distinct image pairs');
assert.equal(matchVariant(lib.family('ir-blaster').variants,{})?.id,'ir-blaster');checks++;
const facets=s=>lib.facetsFor(lib.subcategory(...s.split('/')),lib.familiesOf(s.split('/')[1])).map(f=>f.key);
assert.deepEqual(facets('smart-switches/touch-panels'),['finish','availability'],'module sizes are shared by every series, so they are not a filter');checks++;
assert.deepEqual(facets('smart-security/door-locks'),['doorType','unlocking']);checks++;
assert.deepEqual(facets('smart-switches/retrofit-modules'),[],'a single family needs no filters');checks++;
const related=lib.relatedTo(edge);
check(related.length===4&&!related.includes(edge)&&related[0].slug==='bezzel-panel-series','related families');
check(lib.familyCard(lib.family('wooden-door-lock')).models.includes('HWL-818-TY'),'family cards carry model codes for search');
// Navigation: the mega menu covers every subcategory, and footer links into the catalogue resolve.
assert.deepEqual(lib.productNavGroups().flatMap(g=>g.links.map(l=>l.href)),SUBCATEGORIES.map(lib.subcategoryHref));checks++;
// The Products directory: every entry opens a catalogue family page (with a collection that family offers), and footer links resolve.
globalThis.catalogue=lib;
const dir=await load('product-directory',c=>c.replace(/import \{[^}]*\} from '\.\/products';/,'const {family,familyHref}=globalThis.catalogue;'));
for(const p of dir.PRODUCT_DIRECTORY.flatMap(dir.directoryProducts)){
 const f=lib.family(p.familySlug);check(f,`directory entry ${p.slug} has a family`);
 check(dir.directoryProductHref(p).split('?')[0]===lib.familyHref(f),`directory entry ${p.slug} links to its family page`);
 if(p.collection)check(f.options.find(o=>o.key==='collection')?.values.some(v=>v.id===p.collection),`directory entry ${p.slug} collection ${p.collection}`);
 check(exists(dir.directoryProductImage(p)),`directory entry ${p.slug} image`);
}
for(const l of FOOTER.flatMap(g=>g.links).filter(l=>l.href.startsWith('/products/'))){
 const [,,a,b,c]=l.href.split('/');
 check(a==='browse'?dir.directorySubcategory(b,c):['touch-panel','ir-blaster','smart-plug'].includes(a)||lib.category(a),`footer link ${l.href}`);
}
console.log(`${checks} product catalogue checks passed.`);
