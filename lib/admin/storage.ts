// Product image uploads, stored in Cloudflare R2 (free tier; Firebase Cloud Storage requires Blaze plan).
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function saveImage(key: string, data: ArrayBuffer, contentType: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET || 'heseos-media',
    Key: `products/${key}`,
    Body: Buffer.from(data),
    ContentType: contentType,
  }));
}

export async function readImage(key: string) {
  try {
    const result = await s3.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET || 'heseos-media',
      Key: `products/${key}`,
    }));
    const body = await result.Body?.transformToByteArray();
    if (!body) return null;
    return { body: new Uint8Array(body), contentType: result.ContentType || 'image/jpeg' };
  } catch (error) {
    const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) return null;
    throw error;
  }
}
