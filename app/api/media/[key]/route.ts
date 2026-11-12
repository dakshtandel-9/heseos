import { readImage } from '../../../../lib/admin/storage';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{key:string}>}){const {key}=await params;if(!/^product-[a-f0-9-]+$/.test(key))return new Response('Not found',{status:404});const file=await readImage(key);if(!file)return new Response('Not found',{status:404});return new Response(file.body,{headers:{'Content-Type':file.contentType||'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});}
