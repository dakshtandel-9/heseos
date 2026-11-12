// Product image uploads, stored in Vercel Blob (previously Cloudflare R2).
// Create the Blob store as Private (the default); set BLOB_ACCESS=public only if you created a public store.
import { get, put } from '@vercel/blob';

const access = process.env.BLOB_ACCESS === 'public' ? 'public' : 'private';

export async function saveImage(key: string, data: ArrayBuffer, contentType: string) {
  await put(key, data, { access, contentType, addRandomSuffix: false, allowOverwrite: false });
}

export async function readImage(key: string) {
  const file = await get(key, { access });
  return file?.statusCode === 200 ? { body: file.stream, contentType: file.blob.contentType } : null;
}
