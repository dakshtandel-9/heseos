import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const base=process.env.ADMIN_TEST_URL||'http://localhost:3000';
assert(['localhost','127.0.0.1'].includes(new URL(base).hostname),'Admin integration tests only run against a local preview.');
const tag=`admin-test-${crypto.randomUUID()}`;const testIp=`192.0.2.${crypto.getRandomValues(new Uint8Array(1))[0]%254+1}`;let cookie='';const productIds=[],orderIds=[],formIds=[];
async function call(path,method='GET',body,auth=true,extra={}){const r=await fetch(base+path,{method,headers:{'CF-Connecting-IP':testIp,...(body?{'Content-Type':'application/json'}:{}),...(auth?{Cookie:cookie}:{}),...extra},body:body?JSON.stringify(body):undefined});const text=await r.text();let data;try{data=JSON.parse(text);}catch{data={error:text};}return {status:r.status,data,headers:r.headers};}
const state=async()=>{const r=await call('/api/admin/data');assert.equal(r.status,200);return r.data;};
try{
 assert.equal((await call('/api/admin/data','GET',undefined,false)).status,401,'Admin data is private');
 assert.equal((await call('/api/admin/login','POST',{password:'incorrect'},false)).status,401,'Wrong password rejected');
 const login=await call('/api/admin/login','POST',{password:process.env.ADMIN_TEST_PASSWORD||'1210'},false);assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];assert.match(login.headers.get('set-cookie'),/HttpOnly/);assert.match(login.headers.get('set-cookie'),/SameSite=Strict/);
 assert.equal((await call('/api/admin/session')).data.authenticated,true);
 const p={name:tag,sku:tag,category:'Test fixtures',description:'Temporary integration fixture',image:'',price:123450,mrp:150000,stock:2,status:'draft'};
 const created=await call('/api/admin/products','POST',p);assert.equal(created.status,201);const productId=created.data.id;productIds.push(productId);
 let publicProducts=(await call('/api/products','GET',undefined,false)).data.products;assert(!publicProducts.some(p=>p.id===productId),'Draft is not public');
 let saved=(await state()).products.find(p=>p.id===productId);
 assert.equal((await call(`/api/admin/products/${productId}`,'PATCH',{...saved,status:'active',original_stock:saved.stock})).status,200);
 publicProducts=(await call('/api/products','GET',undefined,false)).data.products;assert(publicProducts.some(p=>p.id===productId),'Active product is public');
 assert.equal((await call('/api/admin/products','POST',p,true,{Origin:'https://untrusted.example'})).status,403,'Cross-origin mutation rejected');
 assert.equal((await call('/api/admin/products','POST',{...p,sku:tag+'-bad',price:-1})).status,400);
 const request={requestKey:crypto.randomUUID(),name:tag,email:`${tag}@example.test`,phone:'9000000000',address:'Local test fixture, not a real delivery',lines:[{id:productId,qty:1,price:123450}]};
 assert.equal((await call('/api/orders','POST',{...request,lines:[{id:productId,qty:1,price:1}]},false)).status,409,'Tampered price rejected');
 const order=await call('/api/orders','POST',request,false);assert.equal(order.status,201);orderIds.push(order.data.id);assert.equal(order.data.total,123450);
 assert.equal((await call('/api/orders','POST',request,false)).data.id,order.data.id,'Retry does not create duplicate order');
 assert.equal((await state()).products.find(p=>p.id===productId).stock,1);
 assert.equal((await call(`/api/admin/products/${productId}`,'PATCH',{...saved,status:'active',original_stock:saved.stock})).status,409,'Stale product edits cannot overwrite reserved stock');
 const parallel=await Promise.all([1,2].map(()=>call('/api/orders','POST',{...request,requestKey:crypto.randomUUID()},false)));assert.deepEqual(parallel.map(r=>r.status).sort(),[201,409],'Only one concurrent order gets last unit');for(const r of parallel)if(r.status===201)orderIds.push(r.data.id);
 assert.equal((await state()).products.find(p=>p.id===productId).stock,0);
 let record=(await state()).orders.find(o=>o.id===order.data.id);
 assert.equal((await call(`/api/admin/orders/${record.id}`,'PATCH',{...record,status:'confirmed',payment:'paid',notes:'Test payment recorded'})).status,200);
 assert.equal((await call(`/api/admin/orders/${record.id}`,'PATCH',{...record,status:'shipped'})).status,409,'Stale order edits rejected');
 record=(await state()).orders.find(o=>o.id===order.data.id);assert.equal(record.payment,'paid');
 assert.equal((await call(`/api/admin/orders/${record.id}`,'PATCH',{...record,status:'cancelled',payment:'refunded'})).status,200);
 assert.equal((await state()).products.find(p=>p.id===productId).stock,1,'Cancellation restores stock');
 record=(await state()).orders.find(o=>o.id===order.data.id);assert.equal((await call(`/api/admin/orders/${record.id}`,'PATCH',{...record,status:'confirmed'})).status,400,'Cancelled order cannot reopen');
 for(const type of ['demo','quote','newsletter','support']){const result=await call('/api/submissions','POST',{type,name:tag,email:`${tag}@example.test`,phone:'9000000000',details:tag},false);assert.equal(result.status,201);formIds.push(result.data.id);}
 assert.equal((await call(`/api/admin/submissions/${formIds[0]}`,'PATCH',{status:'contacted',notes:'Follow up'})).status,200);
 assert.equal((await state()).submissions.find(s=>s.id===formIds[0]).status,'contacted');
 assert.equal((await call('/api/submissions','POST',{type:'newsletter',email:'bad'},false)).status,400);
 const upload=new FormData();upload.set('file',new Blob(['<svg/>'],{type:'image/svg+xml'}),'test.svg');const rejected=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Cookie:cookie},body:upload});assert.equal(rejected.status,400,'Active SVG uploads rejected');
 assert.equal((await call('/api/admin/logout','POST')).status,200);assert.equal((await call('/api/admin/data')).status,401,'Logout revokes session');
 console.log('PASS: authentication, authorization, product lifecycle, price validation, idempotency, concurrent stock, order updates, cancellation, four form types, uploads, and logout.');
}finally{
 const quote=s=>`'${s.replaceAll("'","''")}'`;const ids=values=>values.map(quote).join(',')||"''";
 const sql=[`DELETE FROM order_items WHERE order_id IN (${ids(orderIds)})`,`DELETE FROM orders WHERE id IN (${ids(orderIds)})`,`DELETE FROM products WHERE id IN (${ids(productIds)})`,`DELETE FROM submissions WHERE id IN (${ids(formIds)})`,`DELETE FROM activity WHERE message LIKE ${quote('%'+tag+'%')}`,`DELETE FROM activity WHERE ${[...orderIds,...formIds].map(id=>`message LIKE ${quote('%'+id.slice(0,8)+'%')}`).join(' OR ')||'0'}`].join(';');
 execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','wrangler.local.json','--persist-to','.wrangler/state','--command',sql],{stdio:'pipe'});
 console.log('Removed temporary integration fixtures from the local database.');
}
