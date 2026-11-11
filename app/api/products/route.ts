import { db, fail, init, json } from '../../../lib/admin/server';
export const dynamic='force-dynamic';
export async function GET(){try{await init();const data=await db().prepare("SELECT id,name,category,description,image,price,mrp,stock FROM products WHERE status='active' ORDER BY name").all();return json({products:data.results});}catch(e){return fail(e);}}
