import type { QuerySnapshot } from 'firebase-admin/firestore';
import { audit, authorized, body, deleteAll, fail, hash, HttpError, id, init, json, now, passwordHash, productInput, rateLimit, requireAdmin, sameOrigin, store, str, verifyPassword } from '../../../../lib/admin/server';
import type { Activity, AdminProduct, Order, Submission } from '../../../../lib/admin/types';
import { saveImage } from '../../../../lib/admin/storage';
export const dynamic='force-dynamic';
type Context={params:Promise<{path:string[]}>};
const cookie=(req:Request,token:string,age=28800)=>`heseos_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${new URL(req.url).protocol==='https:'?'; Secure':''}`;
const sessionToken=(req:Request)=>req.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('heseos_admin='))?.slice(13);
const rows=<T,>(snap:QuerySnapshot)=>snap.docs.map(d=>d.data() as T);
const col=(name:string)=>store().collection(name);

export async function GET(req:Request,{params}:Context){try{await init();const {path}=await params;if(path[0]==='session')return json({authenticated:await authorized(req)});await requireAdmin(req);
 if(path[0]==='data'){
 const [products,orders,submissions,activity]=await Promise.all([col('products').get(),col('orders').orderBy('created_at','desc').get(),col('submissions').orderBy('created_at','desc').get(),col('activity').orderBy('created_at','desc').limit(30).get()]);
 return json({products:rows<AdminProduct>(products).sort((a,b)=>b.created_at.localeCompare(a.created_at)||a.name.localeCompare(b.name)),orders:rows<Order>(orders).map(o=>({...o,items:o.items??[]})),submissions:rows<Submission>(submissions),activity:rows<Activity>(activity)});
 }throw new HttpError(404,'Not found.');}catch(e){return fail(e);}}

export async function POST(req:Request,{params}:Context){try{sameOrigin(req);await init();const {path}=await params;
 if(path[0]==='login'){await rateLimit(req,'login',10);const input=await body(req);if(!await verifyPassword(str(input.password,'password',200)))throw new HttpError(401,'Incorrect password.');const token=id()+id();await deleteAll(await col('sessions').where('expires','<',Date.now()).get());await col('sessions').doc(await hash(token)).set({expires:Date.now()+28800000});return json({ok:true},200,{'Set-Cookie':cookie(req,token)});}
 await requireAdmin(req);
 if(path[0]==='logout'){const token=sessionToken(req);if(token)await col('sessions').doc(await hash(token)).delete();return json({ok:true},200,{'Set-Cookie':cookie(req,'',0)});}
 if(path[0]==='upload'){const form=await req.formData(),file=form.get('file');if(!(file instanceof File)||!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)||file.size>5*1024*1024)throw new HttpError(400,'Choose a JPG, PNG, WebP or AVIF image under 5 MB.');const key=`product-${id()}`;await saveImage(key,await file.arrayBuffer(),file.type);return json({url:`/api/media/${key}`});}
 const input=await body(req);
 if(path[0]==='password'){await rateLimit(req,'password',10);if(!await verifyPassword(str(input.current,'current password',200)))throw new HttpError(400,'Current password is incorrect.');const value=str(input.password,'new password',200);if(value.length<8)throw new HttpError(400,'Use at least 8 characters for the new password.');const salt=id();const b=store().batch();b.set(col('settings').doc('password'),{value:JSON.stringify({salt,hash:await passwordHash(value,salt)})});await audit('Admin password changed; all sessions signed out.',b);await b.commit();await deleteAll(await col('sessions').get());return json({ok:true},200,{'Set-Cookie':cookie(req,'',0)});}
 if(path[0]==='products'){const p=productInput(input),key=id(),time=now();await store().runTransaction(async tx=>{if(!(await tx.get(col('products').where('sku','==',p.sku).limit(1))).empty)throw new HttpError(409,'This SKU already exists.');tx.create(col('products').doc(key),{id:key,...p,created_at:time,updated_at:time});await audit(`Added product: ${p.name}`,tx);});return json({id:key},201);}
 throw new HttpError(404,'Not found.');}catch(e){return fail(e);}}

export async function PATCH(req:Request,{params}:Context){try{sameOrigin(req);await requireAdmin(req);const {path}=await params;const input=await body(req),key=path[1];if(!key)throw new HttpError(400,'Missing record.');
 if(path[0]==='products'){const p=productInput(input),ref=col('products').doc(key);await store().runTransaction(async tx=>{const [snap,same]=await Promise.all([tx.get(ref),tx.get(col('products').where('sku','==',p.sku).limit(2))]);if(!snap.exists)throw new HttpError(404,'Product not found.');if(typeof input.updated_at!=='string'||!Object.hasOwn(input,'original_stock'))throw new HttpError(400,'Refresh this product and try again.');if(same.docs.some(d=>d.id!==key))throw new HttpError(409,'This SKU already exists.');const cur=snap.data() as AdminProduct;if(cur.updated_at!==input.updated_at||cur.stock!==(input.original_stock??null))throw new HttpError(409,'This product or its stock changed. Refresh and try again.');tx.update(ref,{...p,updated_at:now()});await audit(`Updated product: ${p.name}`,tx);});return json({ok:true});}
 if(path[0]==='orders'){const status=str(input.status,'order status'),payment=str(input.payment,'payment status'),notes=str(input.notes??'','notes',5000,false),ref=col('orders').doc(key);
 await store().runTransaction(async tx=>{const snap=await tx.get(ref);if(!snap.exists)throw new HttpError(404,'Order not found.');const old=snap.data() as Order;if(!['pending','confirmed','processing','shipped','delivered','cancelled'].includes(status)||!['unpaid','paid','refunded'].includes(payment))throw new HttpError(400,'Invalid order or payment status.');if(old.status==='cancelled'&&status!=='cancelled')throw new HttpError(400,'Cancelled orders cannot be reopened. Create a new order.');if(old.updated_at!==input.updated_at)throw new HttpError(409,'This order changed. Refresh and try again.');const time=now();
  // Cancelling returns the order's quantities to tracked stock.
  if(status==='cancelled'&&old.status!=='cancelled'){const qty=new Map<string,number>();for(const i of old.items??[])qty.set(i.product_id,(qty.get(i.product_id)??0)+i.qty);const snaps=qty.size?await tx.getAll(...[...qty.keys()].map(k=>col('products').doc(k))):[];for(const s of snaps){const stock=s.get('stock');if(s.exists&&typeof stock==='number')tx.update(s.ref,{stock:stock+qty.get(s.id)!,updated_at:time});}}
  tx.update(ref,{status,payment,notes,updated_at:time});await audit(`Order ${key.slice(0,8)} updated: ${status}, ${payment}`,tx);});return json({ok:true});}
 if(path[0]==='submissions'){const status=str(input.status,'submission status'),notes=str(input.notes??'','notes',5000,false);if(!['new','contacted','qualified','closed','spam'].includes(status))throw new HttpError(400,'Invalid submission status.');const ref=col('submissions').doc(key);await store().runTransaction(async tx=>{if(!(await tx.get(ref)).exists)throw new HttpError(404,'Submission not found.');tx.update(ref,{status,notes});await audit(`Submission ${key.slice(0,8)} marked ${status}`,tx);});return json({ok:true});}
 throw new HttpError(404,'Not found.');}catch(e){return fail(e);}}
