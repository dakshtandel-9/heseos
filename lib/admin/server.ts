import { FAMILIES, SUBCATEGORIES } from '../products';
import { PRODUCTS, PACKAGE_TYPES, BHKS, TIERS, getPackage, PACKAGE_IMAGE } from '../catalog';
import type { AdminProduct } from './types';
import type { QuerySnapshot, Transaction, WriteBatch } from 'firebase-admin/firestore';
import { store } from './firebase';
export { store };
export const now=()=>new Date().toISOString();
export const id=()=>crypto.randomUUID();
export class HttpError extends Error {constructor(public status:number,message:string){super(message);}}
export const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
export function fail(error:unknown){if(error instanceof HttpError)return json({error:error.message},error.status);console.error('Commerce request failed',error);return json({error:'Unable to save this request. Please try again.'},500);}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new HttpError(403,'Request origin is not allowed.');}
export async function body(req:Request){sameOrigin(req);const raw=await req.text();if(raw.length>40000)throw new HttpError(413,'Request is too large.');try{return JSON.parse(raw);}catch{throw new HttpError(400,'Invalid request.');}}
export function str(value:unknown,label:string,max=300,required=true){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new HttpError(400,`Enter a valid ${label}.`);return value.trim();}
export function email(value:unknown,required=true){const v=str(value??'','email address',254,required).toLowerCase();if((required||v)&&!/^\S+@\S+\.\S+$/.test(v))throw new HttpError(400,'Enter a valid email address.');return v;}
export function phone(value:unknown){const v=str(value,'phone number',30);if(v.replace(/\D/g,'').length<7)throw new HttpError(400,'Enter a valid phone number.');return v;}
export async function hash(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export async function passwordHash(value:string,salt:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(value),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:100000},key,256);return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');}
export async function setting(key:string){return (await store().collection('settings').doc(key).get()).get('value') as string|undefined;}
// Deletes every document in a query result, 400 per batch (Firestore's limit is 500 writes).
export async function deleteAll(snap:QuerySnapshot){for(let i=0;i<snap.docs.length;i+=400){const b=store().batch();snap.docs.slice(i,i+400).forEach(d=>b.delete(d.ref));await b.commit();}}
let initialized=false;
// First use seeds the catalog products and the admin password. Existing products are never overwritten.
export async function init(){
 if(initialized)return;
 if(await setting('initialized')){initialized=true;return;}
 const time=now();const seeds:Omit<AdminProduct,'created_at'|'updated_at'>[]=[];
 for(const p of FAMILIES)seeds.push({id:`catalog-${p.slug}`,name:p.name,sku:p.code||`CAT-${p.slug}`,category:SUBCATEGORIES.find(s=>s.slug===p.subcategory)?.name||p.subcategory,description:p.summary,image:p.image,price:null,mrp:null,stock:null,status:'active'});
 for(const p of PRODUCTS.filter(p=>p.price!==null))seeds.push({id:p.slug,name:p.name,sku:p.slug.toUpperCase(),category:p.eyebrow,description:p.summary,image:p.image,price:Math.round(p.price!*100),mrp:Math.round(p.mrp!*100),stock:null,status:'active'});
 for(const type of PACKAGE_TYPES)for(const bhk of BHKS)for(const tier of TIERS){const p=getPackage(type.id,bhk,tier.id);seeds.push({id:p.id,name:p.name,sku:p.id,category:'Smart Packages',description:p.items.map(i=>`${i.qty} × ${i.name}`).join(', '),image:PACKAGE_IMAGE[type.id]||'',price:p.price*100,mrp:p.mrp*100,stock:null,status:'active'});}
 const salt=id();const secret=JSON.stringify({salt,hash:await passwordHash(process.env.ADMIN_INITIAL_PASSWORD||'1210',salt)});
 const products=store().collection('products'),settings=store().collection('settings');
 const existing=await products.select('sku').get(),ids=new Set(existing.docs.map(d=>d.id)),skus=new Set(existing.docs.map(d=>d.get('sku')));
 const fresh=seeds.filter(p=>{if(ids.has(p.id)||skus.has(p.sku))return false;ids.add(p.id);skus.add(p.sku);return true;});
 for(let i=0;i<fresh.length;i+=400){const b=store().batch();fresh.slice(i,i+400).forEach(p=>b.set(products.doc(p.id),{...p,created_at:time,updated_at:time}));await b.commit();}
 await store().runTransaction(async tx=>{const pw=settings.doc('password');if(!(await tx.get(pw)).exists)tx.set(pw,{value:secret});tx.set(settings.doc('initialized'),{value:'1'});});
 initialized=true;
}
export async function verifyPassword(password:string){const saved=JSON.parse((await setting('password'))!);return await passwordHash(password,saved.salt)===saved.hash;}
export async function authorized(req:Request){const token=req.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('heseos_admin='))?.slice(13);if(!token)return false;const session=await store().collection('sessions').doc(await hash(token)).get();return session.exists&&session.get('expires')>Date.now();}
export async function requireAdmin(req:Request){if(!await authorized(req))throw new HttpError(401,'Please sign in to continue.');}
export async function rateLimit(req:Request,scope:string,limit:number){const ip=req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0].trim()||req.headers.get('cf-connecting-ip')||'local';const ref=store().collection('rate_limits').doc(await hash(`${scope}:${ip}`)),time=Date.now();const count=await store().runTransaction(async tx=>{const old=(await tx.get(ref)).data() as {count:number;expires:number}|undefined;const next=!old||old.expires<time?{count:1,expires:time+900000}:{count:old.count+1,expires:old.expires};tx.set(ref,next);return next.count;});if(count>limit)throw new HttpError(429,'Too many attempts. Please try again in 15 minutes.');}
// Records an activity entry, inside the given transaction or batch when there is one.
export async function audit(message:string,tx?:Transaction|WriteBatch){const key=id(),ref=store().collection('activity').doc(key),entry={id:key,message,created_at:now()};if(tx)(tx as Transaction).set(ref,entry);else await ref.set(entry);}
export function productInput(v:Record<string,unknown>){const name=str(v.name,'product name',150),sku=str(v.sku,'SKU',100),category=str(v.category,'category',100),description=str(v.description??'','description',5000,false),image=str(v.image??'','image URL',1000,false);if(image&&!/^https:\/\/[^\s]+$|^\/(?!\/)[^\s]*$/.test(image))throw new HttpError(400,'Use an HTTPS image URL or a local image path.');const money=(x:unknown)=>{if(x===null||x==='')return null;if(typeof x!=='number'||!Number.isSafeInteger(x)||x<0||x>1000000000)throw new HttpError(400,'Enter a valid price.');return x;};const price=money(v.price),mrp=money(v.mrp);if(price!==null&&price===0)throw new HttpError(400,'Selling price must be greater than zero.');if(mrp!==null&&price!==null&&mrp<price)throw new HttpError(400,'MRP cannot be lower than selling price.');const stock=v.stock===null||v.stock===''?null:v.stock;if(stock!==null&&(typeof stock!=='number'||!Number.isInteger(stock)||stock<0||stock>1000000))throw new HttpError(400,'Enter a valid stock quantity.');const status=str(v.status,'status');if(!['active','draft','archived'].includes(status))throw new HttpError(400,'Invalid product status.');return {name,sku,category,description,image,price,mrp,stock,status};}
