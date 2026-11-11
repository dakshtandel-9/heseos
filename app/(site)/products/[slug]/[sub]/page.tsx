import { notFound, permanentRedirect } from 'next/navigation';
import { SUBCATEGORIES, familiesOf, subcategory } from '../../../../../lib/products';
import { directoryHrefFor } from '../../../../../lib/product-directory';
// Brochure subcategories now live in the product directory (/products/browse); old links redirect to the matching range.
type Params={params:Promise<{slug:string;sub:string}>};
export function generateStaticParams(){return SUBCATEGORIES.map(s=>({slug:s.category,sub:s.slug}));}
export default async function SubcategoryPage({params}:Params){
 const {slug,sub}=await params,s=subcategory(slug,sub);if(!s)notFound();
 permanentRedirect(directoryHrefFor(familiesOf(s.slug).map(p=>p.slug),'subcategory'));
}
