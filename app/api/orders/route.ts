import { audit, body, email, fail, hash, HttpError, id, init, json, now, phone, rateLimit, store, str } from '../../../lib/admin/server';
import type { AdminProduct, OrderItem } from '../../../lib/admin/types';
export async function POST(req:Request){try{await init();await rateLimit(req,'orders',15);const v=await body(req),requestKey=str(v.requestKey,'request reference',100);
 // One lock document per request key makes a retried checkout return the first order instead of a duplicate.
 const lock=store().collection('order_requests').doc(await hash(requestKey));const previous=await lock.get();if(previous.exists)return json({id:previous.get('order_id')});
 const name=str(v.name,'name',150),mail=email(v.email),tel=phone(v.phone),address=str(v.address,'delivery address',2000);
 if(!Array.isArray(v.lines)||!v.lines.length||v.lines.length>50)throw new HttpError(400,'Your bag is empty or too large.');const seen=new Set<string>();const lines:{id:string;qty:number;price:unknown}[]=[];for(const line of v.lines){const key=str(line.id,'product',100);if(seen.has(key)||!Number.isInteger(line.qty)||line.qty<1||line.qty>10)throw new HttpError(400,'Invalid order quantity.');seen.add(key);lines.push({id:key,qty:line.qty,price:line.price});}
 const key=id(),products=store().collection('products');
 // Stock is checked and reserved in the same transaction that creates the order.
 const result=await store().runTransaction(async tx=>{const [again,...snaps]=await Promise.all([tx.get(lock),...lines.map(l=>tx.get(products.doc(l.id)))]);if(again.exists)return {id:again.get('order_id') as string,total:0,created:false};
  const time=now(),items:OrderItem[]=[];let total=0;
  snaps.forEach((s,i)=>{const p=s.data() as AdminProduct|undefined,l=lines[i];if(!p||p.status!=='active'||p.price===null)throw new HttpError(400,'A product is no longer available. Refresh your bag.');if(l.price!==p.price)throw new HttpError(409,'A product price changed. Refresh your bag and review the total.');if(p.stock!==null&&p.stock<l.qty)throw new HttpError(409,`Not enough stock for ${p.name}.`);items.push({id:id(),order_id:key,product_id:s.id,name:p.name,price:p.price,qty:l.qty});total+=p.price*l.qty;if(p.stock!==null)tx.update(s.ref,{stock:p.stock-l.qty,updated_at:time});});
  tx.create(lock,{order_id:key,created_at:time});tx.create(store().collection('orders').doc(key),{id:key,request_key:requestKey,name,email:mail,phone:tel,address,total,status:'pending',payment:'unpaid',notes:'',created_at:time,updated_at:time,items});await audit(`New order ${key.slice(0,8)} from ${name}`,tx);return {id:key,total,created:true};});
 return result.created?json({id:result.id,total:result.total},201):json({id:result.id});}catch(e){return fail(e);}}
