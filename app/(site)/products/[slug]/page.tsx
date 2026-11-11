import { notFound, permanentRedirect } from 'next/navigation';
import { CATEGORIES, category, family, familiesInCategory, familyHref } from '../../../../lib/products';
import { directoryHrefFor } from '../../../../lib/product-directory';
// Brochure categories now live in the product directory (/products/browse); old links and product aliases redirect.
const aliases:Record<string,string>={'touch-panel':'touch-panel-series','smart-plug':'smart-plug-16a','ir-blaster':'ir-blaster'};
export function generateStaticParams(){return [...CATEGORIES.map(p=>({slug:p.slug})),...Object.keys(aliases).map(slug=>({slug}))];}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(category(slug))permanentRedirect(directoryHrefFor(familiesInCategory(slug).map(p=>p.slug),'category'));
 const p=family(aliases[slug]??slug);if(p)permanentRedirect(familyHref(p));notFound();
}
