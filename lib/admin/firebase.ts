// Firebase Admin SDK: Firestore holds the admin data (Cloudflare R2 holds product images in the free tier).
// Only the server talks to Firebase; firestore.rules blocks all browser access.
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function serviceAccount() {
  // Either the whole service-account JSON (raw or base64) in FIREBASE_SERVICE_ACCOUNT, or its three fields.
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (raw) {
    const json = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
    return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key };
  }
  const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY: key } = process.env;
  return projectId && clientEmail && key ? { projectId, clientEmail, privateKey: key.replace(/\\n/g, '\n') } : null;
}

function app(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const account = serviceAccount();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (account) return initializeApp({ credential: cert(account), projectId: account.projectId, storageBucket });
  // The local Firebase emulators need only a project id.
  if (process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_PROJECT_ID) return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID, storageBucket });
  throw new Error('Firebase is not configured: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY and FIREBASE_STORAGE_BUCKET.');
}

// Kept on globalThis so dev hot reloads don't initialize Firestore twice (which throws).
const cache = globalThis as typeof globalThis & { __heseosFirestore?: Firestore };
export function store() {
  if (!cache.__heseosFirestore) {
    cache.__heseosFirestore = getFirestore(app());
    cache.__heseosFirestore.settings({ ignoreUndefinedProperties: true });
  }
  return cache.__heseosFirestore;
}
