import { fail, init, json, store } from '../../../lib/admin/server';
export const dynamic='force-dynamic';
export async function GET(){try{await init();const snap=await store().collection('products').where('status','==','active').select('id','name','category','description','image','price','mrp','stock').get();const products=snap.docs.map(d=>d.data()).sort((a,b)=>String(a.name).localeCompare(String(b.name)));return json({products});}catch(e){return fail(e);}}
